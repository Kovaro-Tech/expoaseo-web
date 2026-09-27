import { businessConfig } from '../config/business'
import { privacyConfig } from '../config/privacy'
import './LegalPage.css'

const contact = <a href={`mailto:${businessConfig.email}`}>{businessConfig.email}</a>

function Privacy() {
  return <>
    <section><h2>1. Responsable del tratamiento</h2>
      <p>{businessConfig.legalName}</p>
      {privacyConfig.taxId && <p>RUC: {privacyConfig.taxId}</p>}
      {privacyConfig.address && <p>Domicilio: {privacyConfig.address}</p>}
      {privacyConfig.legalRepresentative && <p>Representante legal: {privacyConfig.legalRepresentative}</p>}
      <p>Correo: {contact}</p>
      <p>{privacyConfig.country}</p>
      <p>Es responsable del tratamiento de los datos recibidos mediante esta web.</p>
    </section>
    <section><h2>2. Datos que recibimos</h2>
      <p>El formulario «Trabaja con nosotros» solicita nombre completo, correo electrónico, teléfono, ciudad y hoja de vida (CV). Puedes indicar, de forma opcional, el área o cargo de interés. También recibimos la información que incluyas voluntariamente en tu CV.</p>
      <p>Comparte únicamente información pertinente para tu postulación. Evita incluir datos sensibles o datos de otras personas que no sean necesarios.</p>
      <p>Para proteger el sitio y prevenir abuso se tratan datos técnicos de conexión, como la dirección IP, y señales de verificación de seguridad. Guardamos tu preferencia de apariencia si eliges el modo claro u oscuro.</p>
    </section>
    <section><h2>3. Para qué utilizamos tus datos</h2>
      <p>Utilizamos los datos de postulación para recibir candidaturas, evaluar perfiles, contactar candidatos y gestionar procesos de selección y contratación. Los datos técnicos nos ayudan a prevenir fraude, spam y abuso del formulario.</p>
      <p>Los datos de tu postulación no se utilizan para marketing. Cualquier finalidad de ese tipo requeriría información y consentimiento separados.</p>
    </section>
    <section><h2>4. Tu autorización</h2>
      <p>El tratamiento de los datos y del CV para selección se basa en tu consentimiento, que otorgas voluntariamente al marcar la casilla del formulario. La casilla está desmarcada inicialmente y puedes decidir no enviar la postulación.</p>
      <p>Los campos obligatorios y el CV son necesarios para gestionar tu candidatura mediante este formulario. Sin ellos o sin tu autorización no podemos recibirla por esta vía. El área o cargo es opcional.</p>
      <p>Puedes revocar tu consentimiento escribiendo a {contact}. La revocación no afecta al tratamiento realizado lícitamente antes de recibirla. Conservamos junto a la postulación constancia de la autorización, su fecha y la versión de esta política.</p>
      <p>Este formulario no realiza decisiones de contratación automatizadas ni perfiles publicitarios.</p>
    </section>
    <section><h2>5. Conservación</h2>
      <p>{privacyConfig.retentionPeriod || 'Conservaremos los datos durante el tiempo necesario para gestionar el proceso de selección y durante el período razonable o legal aplicable, atendiendo a la finalidad y a las obligaciones que correspondan.'}</p>
      <p>La postulación y su adjunto se transmiten por correo al equipo responsable. La conservación incluye esos correos y sus copias. Puedes solicitar la eliminación cuando corresponda a través de {contact}.</p>
    </section>
    <section><h2>6. Proveedores y transferencias</h2>
      <p>Usamos Cloudflare para servicios de seguridad, CDN o alojamiento según la configuración del despliegue, y Cloudflare Turnstile para prevenir el abuso automatizado. La verificación utiliza señales técnicas; nuestro código no envía a Turnstile el contenido de los campos de la postulación ni el CV.</p>
      <p>Resend transmite por correo los datos de la postulación y el CV al buzón de contacto de EXPOASEO. El proveedor del buzón recibe y almacena ese correo para su gestión.</p>
      <p>La tipografía se carga desde Google Fonts, lo que genera solicitudes técnicas a sus servidores. No utilizamos Google Analytics, Meta Pixel ni herramientas de publicidad en esta web.</p>
      <p>Algunos proveedores tecnológicos pueden procesar información desde infraestructura situada fuera de Ecuador. Para estos tratamientos corresponde aplicar las salvaguardas exigidas por la normativa de protección de datos aplicable.</p>
      <p>Los enlaces a WhatsApp, redes sociales y otros sitios externos se rigen por las políticas de sus respectivos servicios cuando los visitas.</p>
    </section>
    <section><h2>7. Tus derechos</h2>
      <p>Puedes solicitar, según corresponda, acceso, rectificación, actualización, eliminación, oposición, revocación del consentimiento y los demás derechos previstos por la normativa aplicable, incluidos portabilidad y suspensión del tratamiento cuando procedan.</p>
      <p>Envía tu solicitud a {contact}, indicando el derecho que deseas ejercer y la información necesaria para localizar tu postulación. Podremos solicitar una verificación proporcionada de tu identidad para proteger tus datos.</p>
      <p>También puedes acudir a la Superintendencia de Protección de Datos Personales de Ecuador si consideras que tus derechos no han sido atendidos.</p>
    </section>
    <section><h2>8. Seguridad</h2>
      <p>El sitio está preparado para operar mediante HTTPS, con validación de campos y adjuntos, controles contra spam y proveedores especializados. El acceso a las postulaciones debe limitarse al personal autorizado que interviene en la selección.</p>
      <p>Ninguna medida elimina todos los riesgos. Si detectas un incidente relacionado con tus datos, comunícalo a {contact}.</p>
    </section>
    <section><h2>9. Cambios en esta política</h2><p>Publicaremos los cambios en esta página e indicaremos la fecha de actualización. Si se propone una finalidad que requiera una nueva autorización, deberá solicitarse antes de utilizar los datos para ella.</p></section>
  </>
}

function Cookies() {
  return <>
    <section><h2>1. Qué son estas tecnologías</h2><p>Las cookies son pequeños archivos que un servicio puede guardar en tu navegador. El almacenamiento local (localStorage) permite recordar preferencias en ese navegador. No todas estas tecnologías se utilizan para publicidad.</p></section>
    <section><h2>2. Preferencia de apariencia</h2><p>La clave <code>expoaseo-theme</code> del almacenamiento local conserva tu selección de modo claro u oscuro. Es una preferencia funcional, no de marketing, y permanece hasta que la cambies o elimines los datos del sitio. Si no hay una selección guardada, se utiliza la preferencia de tu dispositivo.</p></section>
    <section><h2>3. Seguridad y Cloudflare Turnstile</h2><p>El formulario utiliza Turnstile para prevenir abuso automatizado. Se carga al abrir el formulario cuando el servicio está disponible. La verificación trata señales técnicas del navegador y de la conexión; nuestro código no le envía el contenido del CV ni de los campos de postulación.</p><p>Las cookies de seguridad que pueda emitir Cloudflare dependen de las funciones activadas en el despliegue. Por ejemplo, <code>cf_clearance</code> solo puede aparecer si se configura la autorización previa de desafíos (pre-clearance); este repositorio no activa esa opción. Su presencia y duración deben verificarse en la configuración del servicio.</p></section>
    <section><h2>4. Qué utiliza esta web</h2><p>El código de esta web no establece cookies propias ni usa sessionStorage, IndexedDB o un service worker. No guarda formularios ni CV en el almacenamiento del navegador: los datos permanecen en memoria mientras completas el formulario y se transmiten al enviarlo.</p><p>No incorporamos analítica de comportamiento, publicidad, Google Analytics, Meta Pixel ni Hotjar. Google Fonts sirve la tipografía mediante solicitudes externas; no se integra como herramienta de analítica. El navegador puede conservar recursos estáticos en su caché para cargar la web con mayor rapidez.</p></section>
    <section><h2>5. Tus opciones</h2><p>Puedes cambiar el tema desde el control de apariencia o borrar los datos del sitio en tu navegador. Restringir tecnologías de seguridad puede impedir la verificación o el envío del formulario.</p><p>Actualmente no mostramos un banner de «aceptar todas» o «rechazar todas», porque no hay tecnologías de analítica o marketing que elegir. Si se añaden servicios no esenciales, deberán permanecer desactivados hasta obtener el consentimiento que corresponda, con opciones para rechazarlo y retirarlo.</p></section>
    <section><h2>6. Contacto</h2><p>Para consultas, escribe a {contact}. Puedes conocer más sobre el tratamiento de tus datos en la <a href="/privacidad">Política de Privacidad</a>.</p></section>
  </>
}

export default function LegalPage({ path }) {
  const privacy = path === '/privacidad'
  return <article className="legal-page">
    <a className="legal-page__back" href="/">Volver al inicio</a>
    <h1>{privacy ? 'Política de Privacidad' : 'Política de Cookies'}</h1>
    <p className="legal-page__updated">Última actualización: {privacyConfig.updatedLabel}</p>
    {privacy ? <Privacy /> : <Cookies />}
  </article>
}

export function NotFound() {
  return <div className="legal-page legal-page--not-found"><h1>Página no encontrada</h1><p>La página que buscas no está disponible.</p><a className="btn btn--primary" href="/">Volver al inicio</a></div>
}
