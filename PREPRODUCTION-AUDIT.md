# Auditoría de preproducción — EXPOASEO

## Estado

Interfaz revisada y corregida para el MVP. El CV admite un máximo de 4 MB
en frontend y backend. Se mantiene el rate limit por instancia como
mitigación inicial junto a Turnstile y honeypot; no es un límite distribuido
fuerte y puede mejorarse si aumenta el volumen de postulaciones.
Faltan configuración real y una prueba de entrega antes de habilitar el envío.
El formulario comprueba la disponibilidad del backend sin exponer secretos
y deshabilita el envío si falta Turnstile o Resend.
No se desplegó ni se enviaron correos reales durante la auditoría.

## Correcciones

- Modal de empleo: portal a document.body. El backdrop-filter del header
  creaba el contexto que recortaba el modal fixed al bajar por la página.
- Altura dvh, márgenes móviles seguros y scroll interno; bloqueo compartido
  de body para menú/modal, restauración de estilos y posición exacta.
- Fondo inert, foco inicial en diálogo, Tab/Shift+Tab, Escape y devolución
  al CTA desktop o al botón del menú móvil (el CTA móvil ya está oculto).
- Validación de campos con errores asociados y foco al primero. Archivo
  no vacío, formato/tamaño, selección, cambio, eliminación y nombres largos.
- Protección contra doble submit; respuestas humanas, comprobación de ok
  en JSON, timeout, estados de éxito/error y reset al reabrir.
- Turnstile: limpieza al desmontar, callbacks de éxito/caducidad/error,
  reintento de carga, tamaño compacto para 320 px y token en memoria.
- Handler de Vercel convertido al export Web Standard fetch. Validación
  de multipart, campos duplicados/desconocidos, hostname y action de
  Turnstile, timeout de proveedores y rechazo controlado sin configuración.
- Segunda comprobación del rate limit tras validación asíncrona para evitar
  dos envíos concurrentes dentro de la misma instancia; clave de idempotencia
  de correo. No se registran CV ni respuestas completas del proveedor.
- Header pasa al menú compacto en anchos intermedios; Escape, click fuera,
  limpieza de listeners y desbloqueo al pasar a desktop.
- Selector de cotización con wrap: causaba overflow a 320/360 px.
- Filas de servicios con títulos y precios largos apilados en móvil.
- Eliminado ID duplicado confianza; pestañas apuntan a un panel existente.
- Enlace para saltar al contenido, contraste de botón primario dark y
  WhatsApp hover, logo legible en el header oscuro.
- Pausa explícita del video decorativo y del marquee; altura mínima de
  la zona de organizaciones al filtrar; reduced motion preservado.
- Footer: corregida frase incorrecta «en Cobertura nacional desde Loja».
- Tres miniaturas de servicios convertidas a WebP (320 px): 1.163.345 bytes
  originales frente a 74.846 bytes nuevos, aproximadamente 94% menos.
  Los JPG originales permanecen disponibles.
- Exclusión de archivos .env con secretos en Git, conservando .env.example.

## Verificación ejecutada

- Chromium local automatizado: 320, 360, 390, 430, 768, 1024, 1280, 1440 y
  1920 px, en light y dark. Sin overflow del body ni errores de runtime
  durante el recorrido probado. Revisión visual de modal y servicios móvil.
- Modal desde footer en todos esos tamaños; desde hero/mitad/footer a 390
  y 1280 px. Portal, límites del viewport, scroll restaurado, Escape,
  focus trap, selección de CV y ausencia de bloqueo residual.
- Formulario con Turnstile y API simulados: campos requeridos, foco de error,
  adjunto, éxito en dark, reapertura y callback de caducidad. No equivale
  a una prueba real de entrega ni de CAPTCHA en dominio autorizado.
- API con proveedores simulados: método, email, honeypot, firma PDF falsa,
  CAPTCHA fallido y dos solicitudes concurrentes (un 200 y un 429).
- Teclado en pestañas, filtros y FAQ (Enter/Space); enlace de Jardinería
  con nombre correcto en mensaje de WhatsApp.
- Cinco MP4 reproducidos individualmente; exclusividad y pausa al salir.
  Hero desactivado y marquee sin animación con reduced motion.
- DOM: un h1, sin IDs duplicados, anclas internas resueltas, enlaces
  target blank con rel correcto; WhatsApp centralizado en 593989869808.
- SEO: idioma es, title/description/OG y schema con Ecuador como cobertura.
  No se inventó un dominio canonical ni una imagen OG ausente.
- npm run lint y npm run build sin errores. No había suite ni script test
  en package.json; se ejecutaron las comprobaciones específicas indicadas.

Esta revisión no constituye una certificación WCAG. Queda recomendable
verificar con lector de pantalla y Safari/iOS reales antes de publicar.

## Pendientes de publicación

1. Configurar VITE_TURNSTILE_SITE_KEY, TURNSTILE_SECRET_KEY,
   TURNSTILE_HOSTNAME, RESEND_API_KEY y MAIL_FROM en Vercel.
   El hostname debe coincidir con producción; previews necesitan su
   configuración autorizada. Usar modo no interactivo si se quiere evitar
   interacción visual. No usar claves de prueba en producción.
2. Verificar el dominio remitente de Resend/DNS; realizar una postulación
   controlada y confirmar adjunto recibido en expoaseoec@gmail.com.
3. Confirmar dominio definitivo para canonical/og:url/sitemap, imagen OG y
   la disponibilidad real de las cuentas Instagram/TikTok.

## Cierre mínimo del MVP

- Límite de CV: 4 MB (4 × 1024 × 1024 bytes), con margen multipart
  de 16 KB en la comprobación del tamaño de petición. Sin storage externo.
- Rate limit por instancia aceptado como mitigación inicial suficiente
  para este MVP junto a Turnstile y honeypot. Redis/KV no son bloqueos
  para publicar; un límite distribuido fuerte queda para mayor volumen.
- .env.example contiene únicamente las cinco variables indicadas arriba.
- Destinatario del CV fijo: expoaseoec@gmail.com.
- GET /api/job-application devuelve solo available. Sin configuración
  completa, el botón queda deshabilitado con un mensaje humano.
- Los originales no referenciados limpieza-exterior-01.mp4 y
  trabajo-altura-02.mp4 se retiran de public/videos/real-work y se
  conservan en assets-source/production-archive/ para recuperación.
- No se inventan canonical, og:url, sitemap ni imagen OG.
- npm run dev sirve la interfaz; para comprobar la API localmente se
  necesita el entorno de funciones de Vercel o un deployment de prueba.

## Referencias

- https://vercel.com/docs/functions/runtimes/node-js
- https://vercel.com/docs/functions/limitations
- https://vercel.com/kb/guide/how-to-bypass-vercel-body-size-limit-serverless-functions
- https://developers.cloudflare.com/turnstile/get-started/client-side-rendering/widget-configurations/
