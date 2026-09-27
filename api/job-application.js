import { createHash } from 'node:crypto'
import { businessConfig } from '../src/config/business.js'
import { privacyConfig } from '../src/config/privacy.js'

const MAX_FILE_SIZE = 4 * 1024 * 1024
const MAX_REQUEST_SIZE = MAX_FILE_SIZE + 16384
const UNAVAILABLE = 'El envío de postulaciones no está disponible temporalmente. Puedes intentarlo nuevamente más tarde.'
const configured = () => ['TURNSTILE_SECRET_KEY', 'TURNSTILE_HOSTNAME', 'RESEND_API_KEY', 'MAIL_FROM']
  .every((name) => Boolean(process.env[name]?.trim()))
const ALLOWED_TYPES = new Map([
  ['pdf', ['application/pdf']],
  ['doc', ['application/msword', 'application/octet-stream']],
  ['docx', ['application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/zip', 'application/octet-stream']],
])
// Mitigación inicial del MVP junto a Turnstile y honeypot.
// No es un rate limit distribuido fuerte: vive por instancia.
// Si aumenta el volumen, se puede migrar a un límite compartido.
const requests = new Map()
const RATE_LIMIT_MS = 10 * 60 * 1000

function json(status, body) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff', 'X-Robots-Tag': 'noindex, nofollow' },
  })
}

function clean(value, max = 160) {
  if (typeof value !== 'string' || value.length > max) return ''
  return value.trim().replace(/[\r\n<>]/g, ' ')
}

function clientIp(request) {
  return request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
}

function isRateLimited(ip) {
  const now = Date.now()
  for (const [key, timestamp] of requests) {
    if (now - timestamp > RATE_LIMIT_MS) requests.delete(key)
  }
  const previous = requests.get(ip)
  return Boolean(previous && now - previous < RATE_LIMIT_MS)
}

async function validTurnstile(token, ip) {
  const secret = process.env.TURNSTILE_SECRET_KEY
  if (!secret || !token) return false
  const body = new URLSearchParams({ secret, response: token, remoteip: ip })
  const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    body,
    signal: AbortSignal.timeout(10000),
  })
  const result = await response.json()
  return response.ok && result.success === true && result.action === 'application'
    && process.env.TURNSTILE_HOSTNAME === result.hostname
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

export async function handler(request) {
  // Solo exponemos disponibilidad; nunca nombres de variables ni secretos.
  if (request.method === 'GET') return json(200, { available: configured() })
  if (request.method !== 'POST') return json(405, { error: 'Método no permitido.' })

  try {
    if (!configured()) {
      return json(503, { error: UNAVAILABLE })
    }
    if (!request.headers.get('content-type')?.startsWith('multipart/form-data;')) return json(400, { error: 'Solicitud inválida.' })
    if (Number(request.headers.get('content-length')) > MAX_REQUEST_SIZE) return json(413, { error: 'Archivo demasiado grande.' })
    const ip = clientIp(request)
    if (isRateLimited(ip)) return json(429, { error: 'Ya recibimos una postulación desde esta conexión. Inténtalo más tarde.' })

    let form
    try { form = await readBoundedForm(request) } catch { return json(400, { error: 'Solicitud inválida.' }) }
    if (!form) return json(413, { error: 'Archivo demasiado grande.' })
    const allowed = new Set(['name', 'email', 'phone', 'city', 'area', 'website', 'cv', 'turnstileToken', 'privacyConsent', 'privacyVersion'])
    for (const key of form.keys()) {
      if (!allowed.has(key) || form.getAll(key).length !== 1) return json(400, { error: 'Solicitud inválida.' })
    }
    if (clean(form.get('website'))) return json(400, { error: 'Solicitud inválida.' })
    if (form.get('privacyConsent') !== 'accepted' || form.get('privacyVersion') !== privacyConfig.version) {
      return json(400, { error: 'Revisa y acepta la Política de Privacidad vigente antes de enviar.' })
    }
    const consentReceivedAt = new Date().toISOString()

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
    if (!(await validTurnstile(token, ip))) return json(403, { error: 'No pudimos validar la solicitud. Inténtalo nuevamente.' })
    // Recheck after asynchronous verification, then reserve synchronously.
    if (isRateLimited(ip)) return json(429, { error: 'Espera antes de enviar otra postulación.' })
    // Solo bloqueamos tras una solicitud humana validada: un error de formulario
    // no impide al candidato corregir sus datos y volver a intentarlo.
    requests.set(ip, Date.now())
    const attachment = Buffer.from(await file.arrayBuffer()).toString('base64')
    const fingerprint = createHash('sha256').update(email.toLowerCase()).update(attachment).digest('hex')
    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json', 'Idempotency-Key': `application-${fingerprint}` },
      signal: AbortSignal.timeout(15000),
      body: JSON.stringify({
        from: process.env.MAIL_FROM,
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

export default { fetch: handler }
