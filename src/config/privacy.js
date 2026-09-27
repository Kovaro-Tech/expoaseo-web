// Datos legales confirmados por la clienta. Vacío = no se publica.
// TODO cliente: confirmar responsables internos de acceso y proveedores definitivos,
// contratos y salvaguardas internacionales según el despliegue final.
export const privacyConfig = {
  version: '2026-09-27',
  updatedLabel: 'septiembre de 2026',
  country: 'Ecuador',
  taxId: '1191739848001',
  address: 'Avenida Mercadillo 19-30',
  legalRepresentative: 'Mgtr. Paola Valarezo Tenorio',
  retentionPeriod: '', // TODO: plazo y procedimiento real de eliminación, incluido correo.
  consentText: 'He leído la Política de Privacidad y autorizo el tratamiento de mis datos personales y hoja de vida para fines de selección y contratación.',
}

// Punto de entrada para un futuro CMP. No hay scripts no esenciales registrados.
// Antes de añadirlos: consentimiento previo por finalidad, rechazo y revocación.
export const optionalServices = []
