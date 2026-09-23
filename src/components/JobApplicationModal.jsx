import { useEffect, useId, useRef, useState } from 'react'
import { FileText, Upload, X } from 'lucide-react'
import './JobApplicationModal.css'

const MAX_FILE_SIZE = 5 * 1024 * 1024
const ACCEPTED_EXTENSIONS = ['pdf', 'doc', 'docx']

function fileIsValid(file) {
  const extension = file?.name.split('.').pop()?.toLowerCase()
  return Boolean(file && ACCEPTED_EXTENSIONS.includes(extension) && file.size <= MAX_FILE_SIZE)
}

function fileSize(bytes) {
  return `${(bytes / 1024 / 1024).toFixed(bytes < 1024 * 1024 ? 1 : 2)} MB`
}

export default function JobApplicationModal({ open, onClose, returnFocusRef }) {
  const [file, setFile] = useState(null)
  const [fileError, setFileError] = useState('')
  const [status, setStatus] = useState('idle')
  const [message, setMessage] = useState('')
  const dialogRef = useRef(null)
  const inputRef = useRef(null)
  const turnstileRef = useRef(null)
  const widgetIdRef = useRef(null)
  const nameId = useId()
  const emailId = useId()
  const phoneId = useId()
  const cityId = useId()
  const areaId = useId()
  const fileId = useId()
  const siteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY
  const closeModal = () => {
    setFile(null)
    setFileError('')
    setStatus('idle')
    setMessage('')
    onClose()
  }

  useEffect(() => {
    if (!open) return undefined

    const focusable = () =>
      dialogRef.current?.querySelectorAll(
        'button:not([disabled]), input:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
      ) ?? []
    const onKeyDown = (event) => {
      if (event.key === 'Escape') onClose()
      if (event.key !== 'Tab') return
      const nodes = [...focusable()]
      if (!nodes.length) return
      const first = nodes[0]
      const last = nodes[nodes.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.body.style.overflow = 'hidden'
    const returnFocusNode = returnFocusRef.current
    const timer = window.setTimeout(() => focusable()[0]?.focus(), 0)
    window.addEventListener('keydown', onKeyDown)
    return () => {
      window.clearTimeout(timer)
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKeyDown)
      returnFocusNode?.focus()
    }
  }, [onClose, open, returnFocusRef])

  useEffect(() => {
    if (!open || !siteKey) return undefined

    const render = () => {
      if (!window.turnstile || widgetIdRef.current !== null || !turnstileRef.current) return
      widgetIdRef.current = window.turnstile.render(turnstileRef.current, {
        sitekey: siteKey,
        theme: document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light',
      })
    }
    const existing = document.querySelector('script[src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"]')
    if (existing) {
      existing.addEventListener('load', render)
      render()
      return () => existing.removeEventListener('load', render)
    }
    const script = document.createElement('script')
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'
    script.async = true
    script.defer = true
    script.addEventListener('load', render)
    document.head.appendChild(script)
    return () => script.removeEventListener('load', render)
  }, [open, siteKey])

  const selectFile = (candidate) => {
    if (!fileIsValid(candidate)) {
      setFile(null)
      setFileError('Adjunta un archivo PDF, DOC o DOCX de máximo 5 MB.')
      return
    }
    setFile(candidate)
    setFileError('')
  }

  const submit = async (event) => {
    event.preventDefault()
    if (status === 'sending') return
    if (!file) {
      setFileError('Adjunta tu CV para continuar.')
      return
    }
    const token = document.querySelector('[name="cf-turnstile-response"]')?.value
    if (!siteKey || !token) {
      setStatus('error')
      setMessage('No pudimos validar la solicitud. Recarga la página e inténtalo nuevamente.')
      return
    }

    setStatus('sending')
    setMessage('')
    const formData = new FormData(event.currentTarget)
    formData.set('cv', file)
    formData.set('turnstileToken', token)

    try {
      const response = await fetch('/api/job-application', { method: 'POST', body: formData })
      const payload = await response.json().catch(() => ({}))
      if (!response.ok) throw new Error(payload.error || 'No pudimos enviar tu postulación.')
      setStatus('success')
      setMessage('Gracias por querer formar parte de EXPOASEO. Hemos recibido tu información correctamente.')
    } catch (error) {
      setStatus('error')
      setMessage(error.message || 'No pudimos enviar tu postulación. Inténtalo nuevamente más tarde.')
      if (widgetIdRef.current !== null && window.turnstile) window.turnstile.reset(widgetIdRef.current)
    }
  }

  if (!open) return null

  return (
    <div className="application-modal" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && closeModal()}>
      <div className="application-modal__dialog" ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby="application-title" aria-describedby="application-description">
        <button type="button" className="application-modal__close" onClick={closeModal} aria-label="Cerrar formulario de postulación">
          <X size={21} />
        </button>
        {status === 'success' ? (
          <div className="application-modal__success" role="status">
            <FileText size={30} aria-hidden="true" />
            <h2 id="application-title">¡Postulación enviada!</h2>
            <p>{message}</p>
            <button type="button" className="btn btn--primary" onClick={closeModal}>Cerrar</button>
          </div>
        ) : (
          <>
            <header className="application-modal__header">
              <h2 id="application-title">Trabaja con nosotros</h2>
              <p id="application-description">Déjanos tus datos y hoja de vida. Nuestro equipo podrá contactarte cuando exista una oportunidad acorde a tu perfil.</p>
            </header>
            <form className="application-form" onSubmit={submit} noValidate>
              <div className="application-form__grid">
                <label>Nombre completo *<input id={nameId} name="name" autoComplete="name" required /></label>
                <label>Correo electrónico *<input id={emailId} name="email" type="email" autoComplete="email" required /></label>
                <label>Teléfono *<input id={phoneId} name="phone" type="tel" autoComplete="tel" required /></label>
                <label>Ciudad *<input id={cityId} name="city" autoComplete="address-level2" required /></label>
              </div>
              <label>Área o cargo de interés <input id={areaId} name="area" /></label>
              <input className="application-form__honeypot" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" />
              <input ref={inputRef} id={fileId} name="cv" type="file" accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" onChange={(event) => selectFile(event.target.files?.[0])} hidden />
              <div className={`application-dropzone${fileError ? ' is-error' : ''}`} onDragOver={(event) => event.preventDefault()} onDrop={(event) => { event.preventDefault(); selectFile(event.dataTransfer.files?.[0]) }}>
                {file ? (
                  <div className="application-dropzone__file"><FileText size={22} aria-hidden="true" /><span><strong>{file.name}</strong><small>{fileSize(file.size)}</small></span><button type="button" onClick={() => { setFile(null); inputRef.current.value = '' }}>Eliminar</button></div>
                ) : (
                  <button type="button" onClick={() => inputRef.current?.click()}><Upload size={22} aria-hidden="true" /><span><strong>Adjunta tu CV *</strong><small>PDF, DOC o DOCX · Máx. 5 MB</small></span></button>
                )}
              </div>
              {fileError && <p className="application-form__error" role="alert">{fileError}</p>}
              <div ref={turnstileRef} className="application-form__turnstile" />
              {!siteKey && <p className="application-form__error" role="alert">El formulario no está configurado todavía. Inténtalo más tarde.</p>}
              {status === 'error' && <p className="application-form__error" role="alert">{message}</p>}
              <button className="btn btn--primary application-form__submit" type="submit" disabled={status === 'sending' || !siteKey}>{status === 'sending' ? 'Enviando…' : 'Enviar postulación'}</button>
              <p className="application-form__privacy">Tus datos serán utilizados únicamente para procesos de selección.</p>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
