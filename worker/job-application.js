import { createHash, createHmac } from 'node:crypto'
import { Buffer } from 'node:buffer'
import { securityHeaders } from '../scripts/security.mjs'
import { businessConfig } from '../src/config/business.js'
import { privacyConfig } from '../src/config/privacy.js'

const MAX_FILE_SIZE = 4 * 1024 * 1024
const MAX_REQUEST_SIZE = MAX_FILE_SIZE + 16384
const UNAVAILABLE = 'El envío de postulaciones no está disponible temporalmente. Puedes intentarlo nuevamente más tarde.'
const configured = (env) => ['TURNSTILE_SECRET_KEY', 'TURNSTILE_HOSTNAME', 'RESEND_API_KEY', 'MAIL_FROM']
  .every((name) => Boolean(env[name]?.trim())) && Boolean(env.ABUSE_GUARD && env.APPLICATION_RATE_LIMITER)
  && ['production', 'staging'].includes(env.SITE_ENVIRONMENT)
  && env.SITE_URL === (env.SITE_ENVIRONMENT === 'production' ? 'https://expoaseo.com' : 'https://expoaseo.kovarotech.com')
  && env.TURNSTILE_HOSTNAME === new URL(env.SITE_URL).hostname
const ALLOWED_TYPES = new Map([
  ['pdf', ['application/pdf']],
  ['doc', ['application/msword', 'application/octet-stream']],
  ['docx', ['application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/zip', 'application/octet-stream']],
])

function json(status, body) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...securityHeaders, 'Content-Type': 'application/json', 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff', 'X-Robots-Tag': 'noindex, nofollow' },
  })
}

function clean(value, max = 160) {
  if (typeof value !== 'string' || value.length > max) return ''
  return value.trim().replace(/[\r\n<>]/g, ' ')
}

function clientIp(request) {
  // This entrypoint is reachable only through Cloudflare ingress, never a Node origin.
  // Cloudflare overwrites CF-Connecting-IP. Never use X-Forwarded-For.
  return request.headers.get('cf-connecting-ip') || ''
}

async function validTurnstile(token, ip, env) {
  const secret = env.TURNSTILE_SECRET_KEY
  if (!secret || !token) return false
  const body = new URLSearchParams({ secret, response: token, remoteip: ip })
  const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    body,
    signal: AbortSignal.timeout(10000),
  })
  const result = await response.json()
  return response.ok && result.success === true && result.action === 'application'
    && env.TURNSTILE_HOSTNAME === result.hostname
}

async function hasExpectedSignature(file, extension) {
  const head = new Uint8Array(await file.slice(0, 8).arrayBuffer())
  if (extension === 'pdf') return [0x25, 0x50, 0x44, 0x46].every((byte, index) => head[index] === byte)
  if (extension === 'doc') return [0xd0, 0xcf, 0x11, 0xe0].every((byte, index) => head[index] === byte)
  return [0x50, 0x4b, 0x03, 0x04].every((byte, index) => head[index] === byte)
}

// No confiar solo en Content-Length: también limitar solicitudes fragmentadas.
async function readBoundedForm(request) {
  const reader = request.body?.getReader()
  if (!reader) throw new Error('Invalid request')
  const chunks = []
  let length = 0
  try {
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      length += value.byteLength
      if (length > MAX_REQUEST_SIZE) {
        await reader.cancel()
        return null
      }
      chunks.push(value)
    }
  } finally { reader.releaseLock() }
  return new Response(new Blob(chunks), { headers: { 'Content-Type': request.headers.get('content-type') } }).formData()
}

export async function handler(request, env) {
  // Solo exponemos disponibilidad; nunca nombres de variables ni secretos.
  if (request.method === 'GET') return json(200, { available: configured(env) })
  if (request.method !== 'POST') return json(405, { error: 'Método no permitido.' })

  try {
    if (!configured(env)) {
      return json(503, { error: UNAVAILABLE })
    }
    if (!request.headers.get('content-type')?.startsWith('multipart/form-data;')) return json(400, { error: 'Solicitud inválida.' })
    if (Number(request.headers.get('content-length')) > MAX_REQUEST_SIZE) return json(413, { error: 'Archivo demasiado grande.' })
    const ip = clientIp(request)
    if (!ip) return json(503, { error: UNAVAILABLE })
    const ipKey = createHmac('sha256', env.TURNSTILE_SECRET_KEY).update(ip).digest('hex')
    if (!(await env.APPLICATION_RATE_LIMITER.limit({ key: ipKey })).success) return json(429, { error: 'Espera un momento antes de volver a intentarlo.' })

    let form
    try { form = await readBoundedForm(request) } catch { return json(400, { error: 'Solicitud inválida.' }) }
    if (!form) return json(413, { error: 'Archivo demasiado grande.' })
    const allowed = new Set(['name', 'email', 'phone', 'city', 'area', 'website', 'cv', 'turnstileToken', 'privacyConsent', 'privacyVersion'])
    for (const key of form.keys()) {
      if (!allowed.has(key) || form.getAll(key).length !== 1) return json(400, { error: 'Solicitud inválida.' })
    }
    if (form.get('website') !== null && form.get('website') !== '') return json(400, { error: 'Solicitud inválida.' })
    if (form.get('privacyConsent') !== 'accepted' || form.get('privacyVersion') !== privacyConfig.version) {
      return json(400, { error: 'Revisa y acepta la Política de Privacidad vigente antes de enviar.' })
    }

    const name = clean(form.get('name'))
    const email = clean(form.get('email'))
    const phone = clean(form.get('phone'), 40)
    const city = clean(form.get('city'))
    const area = clean(form.get('area'))
    const token = String(form.get('turnstileToken') || '')
    const file = form.get('cv')
    const emailIsValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

    if (!name || !emailIsValid || !phone || !city) return json(400, { error: 'Revisa los campos obligatorios.' })
    if (!(file instanceof File) || !file.name || file.size === 0 || file.size > MAX_FILE_SIZE) {
      return json(400, { error: 'El CV debe ser un archivo de máximo 4 MB.' })
    }

    const extension = file.name.split('.').pop()?.toLowerCase()
    if (!ALLOWED_TYPES.has(extension) || !ALLOWED_TYPES.get(extension).includes(file.type)) {
      return json(400, { error: 'El CV debe estar en formato PDF, DOC o DOCX.' })
    }
    if (!(await hasExpectedSignature(file, extension))) {
      return json(400, { error: 'No pudimos validar el archivo adjunto.' })
    }
    if (!(await validTurnstile(token, ip, env))) return json(403, { error: 'No pudimos validar la solicitud. Inténtalo nuevamente.' })
    const attempt = await env.ABUSE_GUARD.get(env.ABUSE_GUARD.idFromName('ip:' + ipKey)).fetch('https://guard/attempt', { method: 'POST' })
    if (attempt.status === 429) return json(429, { error: 'Has alcanzado el límite de postulaciones desde esta conexión. Inténtalo en 15 minutos.' })
    if (!attempt.ok) return json(503, { error: UNAVAILABLE })
    const attachment = Buffer.from(await file.arrayBuffer()).toString('base64')
    const fingerprint = createHash('sha256').update(JSON.stringify([name, email, phone, city, area, extension, privacyConfig.version, privacyConfig.consentText, env.MAIL_FROM, businessConfig.email])).update(attachment).digest('hex')
    const receipt = await env.ABUSE_GUARD.get(env.ABUSE_GUARD.idFromName('submission:' + fingerprint)).fetch('https://guard/receipt', { method: 'POST' })
    if (!receipt.ok) return json(503, { error: UNAVAILABLE })
    const { receivedAt } = await receipt.json()
    const consentReceivedAt = new Date(receivedAt).toISOString()
    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json', 'Idempotency-Key': `application-${fingerprint}-${receivedAt}` },
      signal: AbortSignal.timeout(15000),
      body: JSON.stringify({
        from: env.MAIL_FROM,
        to: [businessConfig.email],
        reply_to: email,
        subject: `Nueva postulación EXPOASEO - ${name}`,
        text: `Nueva postulación EXPOASEO\n\nNombre: ${name}\nCorreo: ${email}\nTeléfono: ${phone}\nCiudad: ${city}\nÁrea o cargo de interés: ${area || 'No especificado'}\n\nConsentimiento: ${privacyConfig.consentText}\nPolítica: ${privacyConfig.version}\nRecibido (UTC): ${consentReceivedAt}`,
        attachments: [{ filename: `CV.${extension}`, content: attachment }],
      }),
    })
    if (!resendResponse.ok) {
      console.error('Application email provider status:', resendResponse.status)
      return json(502, { error: 'No pudimos enviar tu postulación. Inténtalo más tarde.' })
    }
    return json(200, { ok: true })
  } catch (error) {
    console.error('Job application failure:', error.name)
    return json(500, { error: 'No pudimos procesar tu postulación. Inténtalo más tarde.' })
  }
}
