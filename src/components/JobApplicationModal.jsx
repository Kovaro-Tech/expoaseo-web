import { useEffect, useId, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { FileText, Upload, X } from 'lucide-react'
import { lockScroll } from '../lib/scrollLock'
import { privacyConfig } from '../config/privacy'
import './JobApplicationModal.css'

const MAX_FILE_SIZE = 4 * 1024 * 1024
const TYPES = {
  pdf: ['application/pdf'],
  doc: ['application/msword', 'application/octet-stream'],
  docx: ['application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/zip', 'application/octet-stream'],
}
const FIELDS = [
  ['name', 'Nombre completo', 'text', 'name', 160],
  ['email', 'Correo electrónico', 'email', 'email', 160],
  ['phone', 'Teléfono', 'tel', 'tel', 40],
  ['city', 'Ciudad', 'text', 'address-level2', 160],
]
const UNAVAILABLE = 'El envío de postulaciones no está disponible temporalmente. Puedes intentarlo nuevamente más tarde.'
const SCRIPT = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'

export default function JobApplicationModal({ onClose, returnFocusRef }) {
  const [file, setFile] = useState(null)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle')
  const [message, setMessage] = useState('')
  const [verification, setVerification] = useState('loading')
  const [verificationAttempt, setVerificationAttempt] = useState(0)
  const [availability, setAvailability] = useState('checking')
  const dialogRef = useRef(null)
  const inputRef = useRef(null)
  const uploadRef = useRef(null)
  const turnstileRef = useRef(null)
  const widget = useRef(null)
  const token = useRef('')
  const sending = useRef(false)
  const mounted = useRef(false)
  const closeRef = useRef(onClose)
  const id = useId()
  const siteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY

  useEffect(() => { closeRef.current = onClose }, [onClose])

  useEffect(() => {
    if (!siteKey) return undefined
    let disposed = false
    const controller = new AbortController()
    const timeout = window.setTimeout(() => controller.abort(), 10000)
    fetch('/api/job-application', { cache: 'no-store', signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) throw new Error('Unavailable')
        const result = await response.json()
        if (!disposed) setAvailability(result.available === true ? 'ready' : 'unavailable')
      })
      .catch(() => { if (!disposed) setAvailability('unavailable') })
      .finally(() => window.clearTimeout(timeout))
    return () => {
      disposed = true
      controller.abort()
      window.clearTimeout(timeout)
    }
  }, [siteKey])

  useEffect(() => {
    mounted.current = true
    const unlock = lockScroll()
    const origin = returnFocusRef.current
    const root = document.getElementById('root')
    const wasInert = root.inert
    root.inert = true
    const dialog = dialogRef.current
    const nodes = () => [...dialog.querySelectorAll('button, input, textarea, select, a[href], iframe, [tabindex]')]
      .filter((node) => node.tabIndex >= 0 && !node.disabled && node.getClientRects().length)
    const keydown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        event.stopPropagation()
        closeRef.current()
      }
      if (event.key !== 'Tab') return
      const list = nodes()
      const first = list[0]
      const last = list.at(-1)
      if (event.shiftKey && (document.activeElement === first || document.activeElement === dialog)) {
        event.preventDefault()
        last?.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first?.focus()
      }
    }
    dialog.focus({ preventScroll: true })
    dialog.addEventListener('keydown', keydown)
    return () => {
      mounted.current = false
      root.inert = wasInert
      dialog.removeEventListener('keydown', keydown)
      unlock()
      origin?.focus({ preventScroll: true })
    }
  }, [returnFocusRef])

  useEffect(() => {
    if (!siteKey || availability !== 'ready') return undefined
    let disposed = false
    const failure = () => {
      if (disposed) return
      token.current = ''
      setVerification('error')
    }
    const render = () => {
      if (disposed || !window.turnstile || widget.current !== null) return
      widget.current = window.turnstile.render(turnstileRef.current, {
        sitekey: siteKey,
        action: 'application',
        size: 'compact',
        'response-field': false,
        theme: document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light',
        callback: (value) => { token.current = value; setVerification('ready') },
        'expired-callback': () => { token.current = ''; setVerification('expired') },
        'error-callback': failure,
        'timeout-callback': failure,
      })
    }
    let script = document.querySelector(`script[src="${SCRIPT}"]`)
    if (!script) {
      script = document.createElement('script')
      script.src = SCRIPT
      script.async = true
      document.head.appendChild(script)
    }
    script.addEventListener('load', render)
    script.addEventListener('error', failure)
    render()
    const timeout = window.setTimeout(() => { if (!token.current) failure() }, 20000)
    return () => {
      disposed = true
      clearTimeout(timeout)
      script.removeEventListener('load', render)
      script.removeEventListener('error', failure)
      if (widget.current !== null) window.turnstile?.remove(widget.current)
      widget.current = null
      token.current = ''
    }
  }, [siteKey, verificationAttempt, availability])

  const retryVerification = () => {
    token.current = ''
    setVerification('loading')
    if (widget.current !== null) window.turnstile?.reset(widget.current)
    else {
      document.querySelector(`script[src="${SCRIPT}"]`)?.remove()
      setVerificationAttempt((value) => value + 1)
    }
  }

  const selectFile = (candidate) => {
    if (!candidate || sending.current) return
    const types = TYPES[candidate.name.split('.').pop()?.toLowerCase()]
    const valid = types && (!candidate.type || types.includes(candidate.type)) && candidate.size > 0 && candidate.size <= MAX_FILE_SIZE
    setFile(valid ? candidate : null)
    setErrors((current) => ({ ...current, cv: valid ? '' : 'Adjunta un PDF, DOC o DOCX no vacío, de máximo 4 MB.' }))
    inputRef.current.value = ''
  }

  const submit = async (event) => {
    event.preventDefault()
    if (sending.current || !siteKey || availability !== 'ready') return
    const form = event.currentTarget
    const data = new FormData(form)
    const nextErrors = {}
    for (const [name, label] of FIELDS) {
      if (!String(data.get(name) || '').trim()) nextErrors[name] = `Completa el campo ${label.toLowerCase()}.`
    }
    if (data.get('email') && !form.elements.email.validity.valid) nextErrors.email = 'Introduce un correo electrónico válido.'
    if (!file) nextErrors.cv = 'Adjunta tu CV para continuar.'
    if (data.get('privacyConsent') !== 'accepted') nextErrors.privacyConsent = 'Debes autorizar el tratamiento de tus datos para enviar tu postulación.'
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length) {
      const first = Object.keys(nextErrors)[0]
      ;(first === 'cv' ? uploadRef.current : form.elements[first])?.focus()
      return
    }
    if (!siteKey || !token.current) {
      setMessage(siteKey ? 'Completa la verificación de seguridad antes de enviar.' : UNAVAILABLE)
      setStatus('error')
      return
    }
    sending.current = true
    setStatus('sending')
    setMessage('')
    data.set('cv', file)
    data.set('turnstileToken', token.current)
    data.set('privacyVersion', privacyConfig.version)
    try {
      const response = await fetch('/api/job-application', { method: 'POST', body: data, signal: AbortSignal.timeout(30000) })
      if (!response.ok) {
        if (response.status === 503) setAvailability('unavailable')
        const messages = {
          400: 'Revisa los datos y el formato de tu CV.',
          403: 'No pudimos verificar la solicitud. Repite la verificación.',
          413: 'El archivo supera el límite de envío. Adjunta un CV de máximo 4 MB.',
          429: 'Espera unos minutos antes de enviar otra postulación.',
        }
        throw new Error(messages[response.status] || UNAVAILABLE)
      }
      const payload = await response.json()
      if (payload.ok !== true) throw new Error(UNAVAILABLE)
      if (mounted.current) {
        setFile(null)
        form.reset()
        setStatus('success')
        dialogRef.current.focus()
      }
    } catch (error) {
      if (mounted.current) {
        setStatus('error')
        setMessage(error.name === 'TimeoutError' ? 'La confirmación está tardando. Espera unos minutos antes de volver a intentarlo.' : UNAVAILABLE === error.message || error.message.startsWith('Revisa') || error.message.startsWith('No pudimos verificar') || error.message.startsWith('El archivo') || error.message.startsWith('Espera') ? error.message : 'No se pudo confirmar el envío. Revisa tu conexión e inténtalo más tarde.')
        retryVerification()
      }
    } finally { sending.current = false }
  }

  return createPortal(
    <div className="application-modal" onClick={(event) => { if (event.target === event.currentTarget) onClose() }}>
      <div className="application-modal__dialog" ref={dialogRef} role="dialog" aria-modal="true" tabIndex={-1} aria-labelledby={`${id}-title`} aria-describedby={`${id}-description`}>
        <button type="button" className="application-modal__close" onClick={onClose} aria-label="Cerrar formulario de postulación"><X size={21} /></button>
        {status === 'success' ? (
          <div className="application-modal__success" role="status">
            <FileText size={30} aria-hidden="true" />
            <h2 id={`${id}-title`}>¡Postulación enviada!</h2>
            <p id={`${id}-description`}>Gracias por querer formar parte de EXPOASEO. Hemos recibido tu información correctamente.</p>
            <button type="button" className="btn btn--primary" onClick={onClose}>Cerrar</button>
          </div>
        ) : (
          <>
            <header className="application-modal__header">
              <h2 id={`${id}-title`}>Trabaja con nosotros</h2>
              <p id={`${id}-description`}>Déjanos tus datos y hoja de vida. Nuestro equipo podrá contactarte cuando exista una oportunidad acorde a tu perfil.</p>
            </header>
            <form className="application-form" onSubmit={submit} noValidate aria-busy={status === 'sending'}>
              <fieldset disabled={status === 'sending'}>
                <legend className="sr-only">Datos de postulación</legend>
                <div className="application-form__grid">
                  {FIELDS.map(([name, label, type, autoComplete, maxLength]) => (
                    <div key={name}>
                      <label htmlFor={`${id}-${name}`}>{label} *</label>
                      <input id={`${id}-${name}`} name={name} type={type} autoComplete={autoComplete} maxLength={maxLength} required aria-invalid={Boolean(errors[name])} aria-describedby={errors[name] ? `${id}-${name}-error` : undefined} />
                      {errors[name] && <p className="application-form__error" id={`${id}-${name}-error`}>{errors[name]}</p>}
                    </div>
                  ))}
                </div>
                <label>Área o cargo de interés (opcional)<input name="area" maxLength={160} /></label>
                <input name="website" tabIndex={-1} autoComplete="off" hidden aria-hidden="true" />
                <input ref={inputRef} name="cv" type="file" accept=".pdf,.doc,.docx" aria-label="Archivo CV" onChange={(event) => selectFile(event.target.files?.[0])} hidden />
                <div className={`application-dropzone${errors.cv ? ' is-error' : ''}`} onDragOver={(event) => event.preventDefault()} onDrop={(event) => { event.preventDefault(); selectFile(event.dataTransfer.files?.[0]) }}>
                  <button ref={uploadRef} type="button" aria-invalid={Boolean(errors.cv)} aria-describedby={errors.cv ? `${id}-cv-error` : undefined} onClick={() => inputRef.current?.click()}>
                    <Upload size={22} aria-hidden="true" />
                    <span><strong>{file ? 'Cambiar CV' : 'Adjunta tu CV *'}</strong><small>PDF, DOC o DOCX · Máx. 4 MB</small></span>
                  </button>
                  {file && <div className="application-dropzone__file"><FileText size={22} aria-hidden="true" /><span><strong>{file.name}</strong><small>{(file.size / 1024).toFixed(1)} KB</small></span><button type="button" onClick={() => setFile(null)}>Eliminar</button></div>}
                </div>
                {errors.cv && <p className="application-form__error" id={`${id}-cv-error`} role="alert">{errors.cv}</p>}
                <label className="application-form__consent" htmlFor={`${id}-consent`}>
                  <input id={`${id}-consent`} type="checkbox" name="privacyConsent" value="accepted" required aria-invalid={Boolean(errors.privacyConsent)} aria-describedby={errors.privacyConsent ? `${id}-consent-error` : undefined} />
                  <span>He leído la <a href="/privacidad" target="_blank" rel="noopener noreferrer">Política de Privacidad</a> y autorizo el tratamiento de mis datos personales y hoja de vida para fines de selección y contratación.</span>
                </label>
                {errors.privacyConsent && <p className="application-form__error" id={`${id}-consent-error`} role="alert">{errors.privacyConsent}</p>}
              </fieldset>
              <div ref={turnstileRef} className="application-form__turnstile" />
              <p role="status">{!siteKey || availability === 'unavailable' ? UNAVAILABLE : availability === 'checking' ? 'Comprobando disponibilidad…' : verification === 'loading' ? 'Cargando verificación de seguridad…' : verification === 'ready' ? 'Verificación completada.' : 'La verificación caducó o no se pudo completar.'}</p>
              {siteKey && availability === 'ready' && ['error', 'expired'].includes(verification) && <button type="button" className="btn btn--secondary" onClick={retryVerification}>Reintentar verificación</button>}
              {status === 'error' && <p className="application-form__error" role="alert">{message}</p>}
              <button className="btn btn--primary application-form__submit" type="submit" disabled={status === 'sending' || !siteKey || availability !== 'ready'}>{status === 'sending' ? 'Enviando…' : 'Enviar postulación'}</button>
              <p className="application-form__privacy">Tus datos serán utilizados únicamente para gestionar procesos de selección. <a href="/privacidad" target="_blank" rel="noopener noreferrer">Política de Privacidad</a>.</p>
            </form>
          </>
        )}
      </div>
    </div>,
    document.body,
  )
}
