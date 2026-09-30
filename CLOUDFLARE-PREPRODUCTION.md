# EXPOASEO: preparación para Cloudflare

Fecha: 30 de septiembre de 2026. Código preparado y probado localmente.
**No se desplegó, no se compró el dominio, no se modificó DNS ni se enviaron correos reales.**

## Informe solicitado

1. **Loja — auditoría rectificada:** la conclusión inicial de «cero correcciones» era
   incorrecta: se revisó el literal central, pero se omitieron transformaciones en JSX.
   Hero y Footer aplicaban `businessConfig.serviceArea.toLowerCase()` a
   «Cobertura nacional desde Loja», generando «cobertura nacional desde loja».
   Se reprodujo en `document.body.innerText` y en los HTML de `dist`: dos casos en
   inicio y uno en privacidad, cookies y 404. La causa era código, no caché.
   Ahora ambos usan `serviceAreaInSentence`, que cambia únicamente la inicial de
   «Cobertura». Se conservan «lojana», identificadores, rutas y clases CSS.
2. **Vercel auditado:** existían `api/job-application.js`, `vercel.json` y
   `scripts/configure-hosting.mjs`; se retiraron. El build dependía del generador de
   headers; SEO dependía de `VERCEL_ENV`; tests importaban el handler anterior.
   Se adaptaron esos puntos y el comentario del preview. No había SDK de Vercel.
   Los informes anteriores se conservan marcados como históricos.
3. **Migración:** `worker/job-application.js` recibe `Request` y bindings `env`.
   Conserva multipart limitado por bytes, campos, consentimiento/versionado, honeypot,
   MIME/extensión/firma, Turnstile, timeouts, correo seguro y errores humanos.
   `node:crypto` y `node:buffer` usan `nodejs_compat`; no depende de `process.env`
   ni del parser/límite de cuerpo de Vercel. Se corrigió también el honeypot largo.
4. **API:** `/api/job-application`, GET de disponibilidad y POST de postulación.
   Otros métodos devuelven 405; otras rutas `/api/*`, 404. Sin secretos devuelve
   disponibilidad falsa/503 sin revelar variables.
5. **Cloudflare:** `wrangler.jsonc` conecta un único Worker con `dist` vía `ASSETS`.
   Entorno raíz staging, entorno `production` separado, bindings de rate limit y
   Durable Object SQLite con migración `v1`. Sin rutas/custom domains activos,
   sin Workers Sites, `workers_dev` y preview URLs desactivados.
   Se usa Wrangler oficial junto a Vite: el build existente hace prerender SSR
   después de Vite y genera cuatro HTML en `dist`; conservarlo evita cambiar su
   pipeline por el plugin Vite. No se creó otro frontend.
6. **Variable pública:** `VITE_TURNSTILE_SITE_KEY`, incorporada al JS durante el build.
   Debe corresponder al widget/hostname del entorno; no usar la clave de prueba al publicar.
7. **Secrets Worker:** `TURNSTILE_SECRET_KEY`, `RESEND_API_KEY`, `MAIL_FROM`.
   No contienen valores reales en archivos versionados. `.dev.vars.example` sirve
   de plantilla local. `.env*`, `.dev.vars*` y `.wrangler/` están ignorados, salvo ejemplos.
8. **Rate limit:** binding nativo de 20 POST/minuto/IP por ubicación contra ráfagas;
   un Durable Object compartido aplica 3 intentos humanos validados por IP en ventana
   móvil de 15 minutos, incluso entre instancias concurrentes. Los errores de formulario
   no consumen la cuota de tres; fallos de Resend y reintentos sí. La IP proviene de
   `CF-Connecting-IP` en ingreso Cloudflare; no se usa `X-Forwarded-For`. Para las claves
   se transforma con HMAC usando el secreto de Turnstile; la IP original solo viaja a
   Siteverify. El objeto guarda timestamps, sin IP ni CV; alarma borra estado tras
   15 minutos desde el último intento admitido. Una red compartida comparte la cuota.
   Los namespaces 1001/1002 están separados; comprobar que no estén usados por otro
   limitador de la misma cuenta antes del primer despliegue.
9. **CV e idempotencia:** máximo 4 MiB (4.194.304 bytes), igual al frontend anterior;
   cuerpo máximo 4 MiB + 16 KiB. Browser → Worker → validación → Resend →
   `expoaseoec@gmail.com`. No hay R2, KV ni almacenamiento de adjuntos en objetos.
   Se envía como `CV.pdf/doc/docx`. Un objeto por huella del contenido mantiene
   únicamente la fecha de recepción durante 24 horas: la clave de idempotencia y
   el cuerpo enviados a Resend permanecen iguales al reintentar. El correo y el CV
   sí quedan sujetos a la conservación del proveedor de correo y el buzón destino.
10. **Headers Static Assets:** `dist/_headers`, generado desde `scripts/security.mjs`:
    CSP, X-Content-Type-Options, X-Frame-Options, Referrer-Policy, Permissions-Policy;
    además noindex en staging y en 404.
11. **Headers Worker:** los mismos cinco desde código para todas sus respuestas;
    API siempre `Cache-Control: no-store` y `X-Robots-Tag: noindex, nofollow`.
    El Worker se ejecuta antes de assets para garantizar headers y verificar que
    el build corresponde al entorno (503 si no coincide). Esto implica invocaciones
    del Worker también para recursos estáticos; revisar su uso en la cuenta.
    CSP conserva Turnstile, Google Fonts, imágenes y videos, sin añadir permisos.
    `/`, `/privacidad`, `/cookies` sirven HTML propio. Desconocidas, `/404` y
    `/404.html` devuelven HTTP 404 con contenido, sin fallback SPA de HTTP 200.
12. **Privacidad/cookies:** actualmente no contienen menciones a Vercel; no hubo nada
    que eliminar. No se adelantaron modificaciones legales. Tras confirmar la retirada
    total del alojamiento anterior, revisar la descripción de Cloudflare como alojamiento,
    el estado temporal antiabuso/idempotencia y los proveedores efectivos. Se conservan
    pendientes previos sobre responsables de acceso, conservación del buzón y contratos.
13. **Pendientes:** no se detectó un impedimento de código para comprar el dominio.
    Antes de conectar/publicar: acceso a cuenta Cloudflare con Workers/Durable Objects,
    widget Turnstile y claves por hostname, remitente real verificado en Resend y sus
    secretos, revisión de namespaces, confirmación operativa/legal y prueba de entrega
    real autorizada. Falta `public/og-image.jpg` aprobado (1200×630); no se publica una
    URL rota. No se verificó disponibilidad comercial de expoaseo.com.
14. **Lint:** `npm run lint`, aprobado. `npm audit`: cero vulnerabilidades.
15. **Tests:** aprobados `npm test` (4 pruebas), artefactos en ambos entornos, runtime workerd con Miniflare
    y empaquetado Wrangler dry-run; navegador Chromium sobre Wrangler local, 32
    recorridos de rutas/tamaños/temas y prueba del modal. Proveedores simulados en
    backend; Turnstile real con clave pública oficial de prueba en navegador.
16. **Build:** aprobados `npm run build`, `build:staging` y `build:production`; cada build
    genera HTML, robots, sitemap, headers y manifiesto. Producción usa exactamente
    `SITE_ENVIRONMENT=production`, `SITE_URL=https://expoaseo.com`,
    `TURNSTILE_HOSTNAME=expoaseo.com`; canonical de inicio `https://expoaseo.com/`.
    Staging usa `https://expoaseo.kovarotech.com`, noindex,nofollow, sin canonical,
    sitemap vacío y URLs OG/schema de staging. La imagen OG/Twitter se omite hasta
    recibir el archivo aprobado.

## Trabajo local reproducible

### Comprobación posterior de «Loja» en navegador

Corrección verificada en Chromium con los builds de staging y producción servidos
localmente. `document.body.innerText` devuelve exactamente:

- Hero: «Hogares, empresas e instituciones con cobertura nacional desde Loja.»
- Footer: «Limpieza profesional con cobertura nacional desde Loja. 15 años de experiencia.»

Se revisaron inicio, privacidad, cookies y 404, trayectoria, cada respuesta desplegada
del FAQ, descripciones SEO/OG/Twitter y alt. Ninguna contiene el nombre en minúscula.
El distintivo que usa CSS uppercase sigue mostrando «COBERTURA NACIONAL DESDE LOJA»;
no se cambió su estilo. «Orgullosamente lojana» también permanece intacto.

Ambos builds: cero coincidencias de `desde loja` o ` loja.` en los cuatro HTML
prerenderizados y los bundles JS. Lint, las cuatro pruebas Node, ambos builds y
`test:artifacts` aprobados. El navegador ejecutó el JS además de leer el HTML inicial.
No se modificaron despliegues remotos ni cachés/CDN; estas confirmaciones corresponden
a los builds locales de ambos entornos.

La prueba de regresión `node tests/capitalization.browser.mjs` arranca el preview
local y registra `document.body.innerText`, las secciones, metadata y resultados del
escaneo de dist en `qa-artifacts/capitalization-staging.json` y
`qa-artifacts/capitalization-production.json`. Requiere Chrome/Chromium como las demás
pruebas de navegador. También se conservó evidencia del error previo en
`qa-artifacts/capitalization-staging-before.json` (artefactos locales no versionados).

Archivos de esta corrección: `src/config/business.js`, `src/sections/Hero.jsx`,
`src/components/Footer.jsx`, `tests/capitalization.browser.mjs` y este informe.

### Comandos de la migración

Requiere Node compatible con las versiones de Vite y Wrangler del lockfile.
`npm ci` instala las mismas versiones; Miniflare está alineado con la dependencia
5.20260930.0-alpha de Wrangler 4.145.0, solo como herramienta de desarrollo/pruebas.

```sh
npm ci
npm run lint
npm test
npm run build:staging
npm run test:artifacts
npm run test:worker
npm run dev:worker
```

Wrangler local atiende `http://127.0.0.1:4173`. En otra terminal:

```sh
npm run test:browser
npm run test:form
```

Para navegador, instalar Chromium con Playwright o establecer `CHROME_PATH` a Chrome.
La prueba de formulario requiere reconstruir staging con
`VITE_TURNSTILE_SITE_KEY=1x00000000000000000000AA` (solo prueba pública).
El POST del navegador está interceptado: no envía correo.
Los tests del Worker interceptan todas las llamadas externas a proveedores.
Los casos de fallo generan mensajes de error seguros esperados durante el test.

`npm run build:production`, seguido de `test:artifacts` y `test:worker`, verifica
producción localmente. `test:worker` hace únicamente `wrangler deploy --dry-run`;
selecciona el entorno del manifiesto. No sube código ni crea recursos remotos.

El script de build explícito carga `.env.staging` o `.env.production`, respectivamente,
además del `.env` común y variables del proceso. Esos archivos deben contener solo
configuración de build y la clave pública; los secretos pertenecen al Worker.
`npm run build` conserva las variables explícitas existentes y, sin ellas, staging.
`npm run preview` sigue siendo un servidor estático auxiliar sin API; la validación
de integración se hace con `dev:worker`.

## Pasos posteriores: no ejecutados

1. Comprar el dominio y conectarlo a la cuenta Cloudflare. Activar DNSSEC desde
   Registrar/DNS; no es una tarea del código.
2. Configurar los tres secretos separadamente para staging y producción, y la clave
   pública de build correcta. En producción usar `wrangler secret put NOMBRE --env production`;
   para el entorno raíz staging, `--env=""`. Verificar MAIL_FROM en Resend.
3. Recompilar y validar el entorno a publicar. Al autorizar el despliegue futuro,
   registrar el Custom Domain `expoaseo.com` en el Worker production. Staging conserva
   `expoaseo.kovarotech.com` en su Worker separado; no reutilizar dist de producción.
4. Solo con el dominio en Cloudflare, crear regla de redirección 301/308:
   hostname `www.expoaseo.com` → `https://expoaseo.com` + pathname,
   conservando query string. No se agregó una ruta www ni una regla activa.
5. Habilitar HTTPS obligatorio en Cloudflare y comprobar certificados. El Worker
   ya redirige HTTP a HTTPS en los dos hostnames previstos preservando ruta/query;
   localhost permanece utilizable por HTTP. No se activa HSTS preload.
6. Verificar en el hostname real Siteverify (success, hostname y action), una entrega
   autorizada a Gmail, 404 real, noindex de staging y canonical de producción.
   Desconectar el backend anterior y revisar proveedores/textos legales efectivos.

## Referencias técnicas consultadas

- [Workers Static Assets](https://developers.cloudflare.com/workers/static-assets/)
- [Vite plugin oficial](https://developers.cloudflare.com/workers/vite-plugin/)
- [Rate Limiting: ventanas de 10/60 segundos, localidad y consistencia](https://developers.cloudflare.com/workers/runtime-apis/bindings/rate-limit/)
- [HTML handling y rutas](https://developers.cloudflare.com/workers/static-assets/routing/advanced/html-handling/)

El binding nativo no equivale a una cuota global exacta de 15 minutos; por eso se
complementa con Durable Objects, en vez de configurar una ventana no soportada.
