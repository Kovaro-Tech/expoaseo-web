# Informe histórico

La migración posterior está documentada en [CLOUDFLARE-PREPRODUCTION.md](CLOUDFLARE-PREPRODUCTION.md).
Las instrucciones de Vercel de este informe ya no aplican al código actual.

# Última capa de preproducción — 27 de septiembre de 2026

Implementación local terminada; no se ha desplegado ni enviado correo real. Se conserva el diseño y el orden de secciones aprobados. Los cambios previos del usuario en `ServiceRow.jsx` y `ServiceRow.css` se mantuvieron intactos. Este informe actualiza las conclusiones de SEO y privacidad del informe anterior `PREPRODUCTION-AUDIT.md`.

## Entrega solicitada

1. **Páginas legales:** `/privacidad` y `/cookies`, con header/footer existentes, tokens, tipografía, modo oscuro, ancho máximo de 860 px y fecha «septiembre de 2026». No se publican campos legales vacíos. Hay una página 404 con «Volver al inicio».
2. **Almacenamiento real:** `localStorage['expoaseo-theme']`, persistente hasta cambio/borrado. No hay cookies creadas por la aplicación, `sessionStorage`, IndexedDB ni service worker. Formularios, CV y token permanecen en memoria; al enviar correctamente se limpian archivo y campos. El navegador puede cachear recursos. Las cookies emitidas por Cloudflare dependen de las opciones activadas en su cuenta; no se atribuye al despliegue una cookie que no se haya observado.
3. **Banner:** no se añadió, porque no hay analítica ni marketing. `optionalServices` en `src/config/privacy.js` es el registro vacío reservado para futuras integraciones; no existe ningún cargador activo de tracking.
4. **Consentimiento:** casilla obligatoria, desmarcada, texto solicitado, enlace en nueva pestaña, error asociado y foco. El backend rechaza consentimiento ausente, distinto de `accepted`, duplicado o con versión antigua antes de llamar a proveedores. El correo contiene texto de autorización, versión y fecha UTC recibida por el servidor. No hay base de datos adicional de candidatos.
5. **Title:** `EXPOASEO | Limpieza y servicios generales en Ecuador`.
6. **Description:** `Servicios profesionales de limpieza, jardinería, fumigación y mantenimiento para empresas, instituciones y hogares. Cobertura nacional desde Loja.`
7. **Canonical:** `https://expoaseo.com/`; las páginas legales usan su URL equivalente. No se emite canonical en staging ni 404.
8. **Robots:** producción usa `index,follow` en HTML; `public/robots.txt` permite `/` y anuncia el sitemap. En staging se conserva el rastreo para que se puedan leer `noindex,nofollow` y `X-Robots-Tag`; no se depende de `Disallow` para desindexar.
9. **Sitemap:** producción contiene únicamente `/`, `/privacidad`, `/cookies`, todas en `https://expoaseo.com`. En staging el artefacto generado contiene un sitemap vacío y robots no lo anuncia.
10. **Schema:** `Organization` generado desde configuración central: razón social, dominio, email, teléfono internacional, Ecuador e Instagram/TikTok ya confirmados en el proyecto. Incluye el RUC como `taxID` de tipo string y `PostalAddress` con únicamente el domicilio confirmado (`streetAddress`) y país (`addressCountry`) de `src/config/privacy.js`. Sin ciudad, provincia, código postal, rating, reseñas, coordenadas, horario ni año de fundación inventados.
11. **OG/Twitter:** títulos/descripciones por página, `website`, `EXPOASEO`, `es_EC`, URL definitiva y `summary_large_image`. No hay imagen aprobada: se omiten `og:image` y `twitter:image`. Al incorporar `public/og-image.jpg`, el build verifica JPEG de 1200 × 630 y activa ambos metadatos. Sin esa imagen no se garantiza una tarjeta grande en redes.
12. **Identidad:** ICO multirresolución, PNG de 32, Apple de 180 e iconos de 192/512, derivados de la escoba verde original sin redibujarla. Se retiró el SVG genérico anterior. Manifest `browser`, colores reales, sin PWA/service worker. `theme-color` responde a claro/oscuro.
13. **Headers:** `nosniff`, `strict-origin-when-cross-origin`, cámara/micrófono/geolocalización deshabilitados, `X-Frame-Options: DENY`, CSP y noindex de previews. API con `no-store`, `nosniff` y noindex. No se encontraron recursos activos HTTP externos.
14. **CSP:** permite Turnstile en scripts/frames/conexiones; estilos y fuentes solo desde el propio dominio (la tipografía está self-hosted desde la auditoría de rendimiento). Scripts sin `unsafe-inline` ni `unsafe-eval`. Única excepción: `style-src-attr 'unsafe-inline'`, necesaria para estilos dinámicos existentes de React (galería, posición de medios y scroll). Resend solo se llama desde el servidor; no necesita permiso del navegador. Configuración basada en la [documentación de Turnstile](https://developers.cloudflare.com/turnstile/reference/content-security-policy/).
15. **Staging:** predeterminado seguro. Variables `SITE_ENVIRONMENT` y `SITE_URL`; un preview de Vercel nunca se vuelve indexable por heredar producción. Vercel agrega noindex en hosts distintos de `expoaseo.com`. El build emite `_headers` para Cloudflare Pages con reglas específicas de staging/pages.dev. El script de tema añade una defensa adicional en hosts distintos del definitivo. No reutilizar un artefacto de producción para crear un nuevo staging.
16. **Datos legales y pendientes reales del cliente:** RUC, domicilio del responsable y representante legal confirmados e incorporados en `src/config/privacy.js`; la política los consume desde esa configuración, junto con la razón social y correo ya centralizados en `src/config/business.js`. Continúan pendientes el plazo formal de conservación/eliminación (incluido buzón y copias), responsables de acceso, proveedores/contratos y salvaguardas internacionales según despliegue final. Se conservan los TODO internos correspondientes. Falta imagen OG aprobada. No se inventaron estos datos.
17. **Validación:** lint, build y pruebas Node aprobados. Se verificaron artefactos tanto de producción como de staging. Chromium: 32 recorridos (4 rutas × 4 anchos × 2 temas), sin overflow ni infracciones CSP; un h1, landmarks y alt presentes; enlaces externos seguros. Modal abre la política sin perder campos y restaura foco. Turnstile real completó con clave pública de prueba bajo CSP; frontend probado con envío simulado y backend con proveedores simulados. Lighthouse local: inicio y privacidad, ver resultados abajo.
18. **Límites pendientes de publicación:** no hay prueba de entrega real por Resend ni verificación de DNS/HTTPS/headers en dominios desplegados. El rate limit sigue siendo por instancia, no distribuido. Validación de firma/extensión de CV no equivale a antivirus. La implementación no constituye certificación jurídica ni auditoría WCAG completa.

## Activación por entorno

`npm run build` genera HTML estático con contenido y metadatos, además del bundle React. No necesita un servidor React para leer páginas legales o metadatos. Mantener las URL limpias y una respuesta HTTP 404 real para rutas desconocidas; no reescribir todas las rutas a `index.html`.

| Variable | Staging | Producción |
| --- | --- | --- |
| `SITE_ENVIRONMENT` | `staging` | `production` |
| `SITE_URL` | URL HTTPS del preview; por defecto `https://expoaseo.kovarotech.com` | `https://expoaseo.com` |
| `VITE_TURNSTILE_SITE_KEY` | Clave pública autorizada para staging | Clave pública real autorizada para producción |
| `TURNSTILE_HOSTNAME` | Hostname de staging, sin protocolo/ruta | `expoaseo.com` |

`TURNSTILE_SECRET_KEY`, `RESEND_API_KEY` y `MAIL_FROM` son exclusivos del backend. No anteponerles `VITE_`. Las claves públicas de prueba se utilizaron solo en un build temporal de verificación; el artefacto final se reconstruyó como staging sin ellas.

### Hosting detectado

La API existente es una función Node de Vercel (`api/job-application.js`). `vercel.json` conserva esa vía; Cloudflare puede seguir delante como DNS/CDN/seguridad. Si el alojamiento final es exclusivamente Cloudflare Pages/Workers, hará falta adaptar y configurar la función: subir `dist` solo publica el frontend, no ejecuta esta API.

`_headers` sirve para recursos estáticos de Cloudflare Pages; sus reglas no se aplican a respuestas de Functions. Esto está explicado en la [documentación de Cloudflare](https://developers.cloudflare.com/pages/configuration/headers/). Vercel usa `vercel.json`. Tras editar `scripts/security.mjs`, ejecutar `node scripts/configure-hosting.mjs --write` antes de desplegar; el build detecta una configuración desincronizada. Véase la [referencia de headers condicionales de Vercel](https://vercel.com/docs/project-configuration/vercel-json#headers).

Configurar HTTPS y redirección de HTTP a HTTPS en la plataforma, así como `www` hacia el dominio canónico si se habilita. Verificar en el despliegue final los códigos 200/404, los headers y que ninguna regla externa reintroduzca un fallback SPA o tracking automático. No activar HSTS preload sin revisar primero los dominios afectados.

### Proveedores y datos

| Servicio | Flujo observado/preparado | Confirmación operativa pendiente |
| --- | --- | --- |
| Cloudflare/Turnstile | Recursos y señales técnicas de seguridad; API verifica token, IP, hostname y action. No se envía CV/campos a Turnstile. | Dominio autorizado, opciones de seguridad, cookies reales y contratos. |
| Resend | Datos y CV codificado para correo; autorización, fecha y versión de política. | Remitente/DNS verificados, entrega real, retención y contrato. |
| Buzón `expoaseoec@gmail.com` | Recibe postulación y CV adjunto; destinatario centralizado. | Acceso del personal autorizado, borrado de correos/copias y protección de cuenta. |
| Vercel, si se conserva el backend actual | Procesamiento transitorio del multipart y envío a proveedores. | Confirmar despliegue final y reflejar proveedor definitivo en la política antes de publicar. |

El servidor limita el cuerpo multipart a 4 MB + 16 KB incluso sin `Content-Length`; el CV conserva el límite de 4 MB. El adjunto se envía como `CV.pdf/doc/docx`, sin reproducir el nombre original. Los logs no incluyen datos de candidatos, cuerpo multipart, CV ni respuestas completas de proveedores. El candidato solo ve el nombre del archivo que él mismo seleccionó en su modal privado.

### Cambios futuros de consentimiento

Antes de añadir analítica, píxeles, publicidad o scripts no esenciales: identificar datos/proveedor/finalidad, actualizar las políticas y conectar el registro `optionalServices` a un CMP. No importar, precargar ni ejecutar esos scripts hasta la aceptación expresa de su finalidad; permitir rechazo equivalente y revocación. El consentimiento de empleo no autoriza marketing.

La política utiliza lenguaje prudente a partir del alcance solicitado y de la [Ley Orgánica de Protección de Datos Personales publicada en gob.ec](https://www.gob.ec/sites/default/files/regulations/2025-01/01%20Ley%20Org%C3%A1nica%20de%20Protecci%C3%B3n%20de%20Datos%20Personales.pdf). La empresa debe definir el plazo de conservación y completar la información/operación que exige su situación real; no se afirma cumplimiento integral.

## Pruebas y reproducción

```text
npm run lint
npm test
npm run build
node tests/build-artifacts.mjs
npm run preview
```

El preview local sirve archivos, headers y 404 reales; el endpoint de empleo devuelve indisponibilidad, sin usar secretos ni enviar correos. Para Chromium, con Playwright instalado: `node tests/preproduction.browser.mjs`. Permite `PLAYWRIGHT_MODULE` como ruta de módulo y `CHROME_PATH` como ejecutable externo. `tests/form.browser.mjs` requiere un build temporal con la clave pública de prueba de Turnstile; su API siempre se simula. Reconstruir sin la clave de prueba después.

Se visitaron 320, 390, 768 y 1440 px, en claro/oscuro; se verificaron además carga del vídeo de portada, decodificación de fotografías visibles y anclas de navegación. Capturas y reportes están en `qa-artifacts/` (excluido de Git). Lighthouse staging: **accesibilidad 100, buenas prácticas 100, SEO 66**; el único audit fallido es `is-crawlable` por el noindex deliberado. No se quitó noindex para mejorar la puntuación. Los HTML de producción se verificaron por separado con canonical, indexación y sitemap correctos.

Instagram, TikTok y Kovaro Tech respondieron HTTP 200 el 27/09/2026 (Instagram/Kovaro redirigen a `www`). Un HTTP 200 no acredita titularidad; las redes usadas en schema son las ya confirmadas en la configuración/README del proyecto.

Antes de publicar: completar los pendientes legales, configurar el entorno real, revisar almacenamiento/headers desde el dominio y realizar una postulación controlada que confirme la recepción del CV. El trabajo local no cambia los despliegues actuales.
