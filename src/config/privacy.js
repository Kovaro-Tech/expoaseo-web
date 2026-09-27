// TODO cliente: completar únicamente con datos verificados. Vacío = no se publica.
export const privacyConfig = {
  version: '2026-09-27',
  updatedLabel: 'septiembre de 2026',
  country: 'Ecuador',
  taxId: '',
  address: '',
  legalRepresentative: '',
  retentionPeriod: '', // TODO: plazo y procedimiento real de eliminación, incluido correo.
  consentText: 'He leído la Política de Privacidad y autorizo el tratamiento de mis datos personales y hoja de vida para fines de selección y contratación.',
}

// Punto de entrada para un futuro CMP. No hay scripts no esenciales registrados.
// Antes de añadirlos: consentimiento previo por finalidad, rechazo y revocación.
export const optionalServices = []
