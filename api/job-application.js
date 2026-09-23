const MAX_FILE_SIZE = 5 * 1024 * 1024
const ALLOWED_TYPES = new Map([
  ['pdf', ['application/pdf']],
  ['doc', ['application/msword', 'application/octet-stream']],
  ['docx', ['application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/zip', 'application/octet-stream']],
])
const requests = new Map()
const RATE_LIMIT_MS = 10 * 60 * 1000

function json(status, body) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}

function clean(value, max = 160) {
  return String(value || '').trim().replace(/[\r\n<>]/g, ' ').slice(0, max)
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
  })
  const result = await response.json()
  return result.success === true
}

async function hasExpectedSignature(file, extension) {
  const head = new Uint8Array(await file.slice(0, 8).arrayBuffer())
  if (extension === 'pdf') return [0x25, 0x50, 0x44, 0x46].every((byte, index) => head[index] === byte)
  if (extension === 'doc') return [0xd0, 0xcf, 0x11, 0xe0].every((byte, index) => head[index] === byte)
  return [0x50, 0x4b, 0x03, 0x04].every((byte, index) => head[index] === byte)
}

export default async function handler(request) {
  if (request.method !== 'POST') return json(405, { error: 'Método no permitido.' })

  try {
    const ip = clientIp(request)
    if (isRateLimited(ip)) return json(429, { error: 'Ya recibimos una postulación desde esta conexión. Inténtalo más tarde.' })

    const form = await request.formData()
    if (clean(form.get('website'))) return json(400, { error: 'Solicitud inválida.' })

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
      return json(400, { error: 'El CV debe ser un archivo de máximo 5 MB.' })
    }

    const extension = file.name.split('.').pop()?.toLowerCase()
    if (!ALLOWED_TYPES.has(extension) || !ALLOWED_TYPES.get(extension).includes(file.type)) {
      return json(400, { error: 'El CV debe estar en formato PDF, DOC o DOCX.' })
    }
    if (!(await hasExpectedSignature(file, extension))) {
      return json(400, { error: 'No pudimos validar el archivo adjunto.' })
    }
    if (!(await validTurnstile(token, ip))) return json(403, { error: 'No pudimos validar la solicitud. Inténtalo nuevamente.' })
    // Solo bloqueamos tras una solicitud humana validada: un error de formulario
    // no impide al candidato corregir sus datos y volver a intentarlo.
    requests.set(ip, Date.now())
    if (!process.env.RESEND_API_KEY || !process.env.MAIL_FROM) {
      console.error('Missing RESEND_API_KEY or MAIL_FROM')
      return json(500, { error: 'El servicio de postulaciones no está configurado.' })
    }

    const attachment = Buffer.from(await file.arrayBuffer()).toString('base64')
    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: process.env.MAIL_FROM,
        to: [process.env.APPLICATION_EMAIL || 'expoaseoec@gmail.com'],
        reply_to: email,
        subject: `Nueva postulación EXPOASEO - ${name}`,
        text: `Nueva postulación EXPOASEO\n\nNombre: ${name}\nCorreo: ${email}\nTeléfono: ${phone}\nCiudad: ${city}\nÁrea o cargo de interés: ${area || 'No especificado'}`,
        attachments: [{ filename: file.name.replace(/[^\w. -]/g, '_'), content: attachment }],
      }),
    })
    if (!resendResponse.ok) {
      console.error('Resend error', await resendResponse.text())
      return json(502, { error: 'No pudimos enviar tu postulación. Inténtalo más tarde.' })
    }
    return json(200, { ok: true })
  } catch (error) {
    console.error('Job application error', error)
    return json(500, { error: 'No pudimos procesar tu postulación. Inténtalo más tarde.' })
  }
}
