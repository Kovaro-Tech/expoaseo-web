# EXPOASEO — Sitio comercial (MVP)

Landing comercial de **EXPOASEO SERVICIOS GENERALES CIA LTDA**.
Objetivo: presentar los servicios y llevar al usuario a WhatsApp.

Sin backend, sin base de datos, sin login y sin panel administrativo.
La estructura queda preparada para crecer hacia una plataforma con reservas.

## Ejecutar

```bash
npm install
npm run dev     # http://localhost:5173
npm run build   # producción → dist/
npm run lint
```

## Qué tocar para actualizar el sitio

| Necesito cambiar…                              | Archivo                        |
| ---------------------------------------------- | ------------------------------ |
| Número, correo, redes, horario, años, cobertura | `src/config/business.js`      |
| **Texto de los mensajes de WhatsApp**          | `src/config/whatsapp.js`       |
| Servicios, precios, unidades y duraciones      | `src/data/services.js`         |
| Atributos de "Cómo trabajamos" y FAQ           | `src/data/content.js`          |
| Fotos de trabajo real, instituciones, certif.  | `src/data/trust.js`            |
| Colores, tipografía, radios y sombras          | `src/styles/tokens.css`        |
| Logo                                           | `public/images/logo.png`       |
| Fotos de portada y de categoría                | `businessMedia` en config      |

### WhatsApp

`businessConfig.whatsapp` va en formato internacional **sin `+` ni espacios**:
Ecuador es `593` + el número sin el `0` inicial.
`0989869808` → `593989869808`.

**El texto de los mensajes no vive en los componentes**: está en
`src/config/whatsapp.js`, donde se pueden editar saludo, introducción,
etiquetas, qué campos se incluyen (`fields`) y cierre.
`src/lib/whatsapp.js` solo los ensambla y **omite las líneas sin valor**: un
servicio sin duración o sin precio nunca genera una línea vacía.

Mensaje generado al elegir un servicio:

```
Hola EXPOASEO 👋

Quisiera solicitar una cotización.

Tipo de servicio: Limpieza para hogares
Servicio: Jornada Completa
Valor referencial visto en la web: $45 – $60
Duración: 8 horas
Detalles: Departamento de 90 m², sábado por la mañana

¿Me pueden confirmar disponibilidad y precio final?
```

Hay cinco CTA de WhatsApp en toda la página, cada uno con texto y propósito
distinto: navbar (contacto), hero (solicitar), servicio destacado (ese
servicio), selector (solicitud con detalle) y cierre (cotización).

### Precios

Todos los valores publicados son referenciales. Esto se comunica en tres
puntos, sin saturar la página:

1. Bajo el título de la sección de servicios (`pricingDisclaimer`), antes de
   que aparezca cualquier cifra.
2. Junto al precio destacado de cada categoría ("Valor referencial · …").
3. En la FAQ "¿Los precios publicados son fijos?".

No añadir la palabra "referencial" a cada fila del catálogo: se vuelve ruido.

### Clientes y certificaciones

`src/data/trust.js` exporta `clients` (las 10 instituciones, ya cargadas),
`certifications` (vacío: su bloque no se renderiza hasta que haya contenido) y
`heroClientIds`, los cinco nombres de la línea de autoridad del hero.

Al añadir `logo` a un cliente, la imagen sustituye al nombre sin tocar el
componente. **No poblar con datos de ejemplo**: solo material que la clienta
haya entregado y autorizado.

### Logo y colores de marca

El logo vive en `public/images/logo.png` (ruta configurada en
`businessMedia.logo`). Si el archivo faltara, `src/components/Logo.jsx` cae a un
wordmark tipográfico provisional.

La paleta de `src/styles/tokens.css` está derivada del logo:

| Color            | Hex       | Token         | Uso                                  |
| ---------------- | --------- | ------------- | ------------------------------------ |
| Azul wordmark    | `#0F75BC` | `--brand-600` | Botones, tabs, iconos, degradados    |
| Verde escoba     | `#8CC63F` | `--accent-500`| Filetes de sección, subrayado activo |
| Verde secundario | `#6EBE44` | `--accent-600`| Numeración editorial                 |
| Gris bajada      | `#818285` | `--logo-gray` | Referencia de marca                  |
| Verde WhatsApp   | `#25D366` | `--wa`        | Solo botones que abren el chat       |

`--ink-500` y `--ink-400` llevan texto pequeño y sus valores están elegidos
para superar 4.5:1 (WCAG AA) sobre el fondo del sitio. **No aclararlos**: el
gris exacto del logo (`--logo-gray`) no alcanza ese contraste en texto chico.

Sobre el footer oscuro el logo se monta en una placa blanca
(`.logo--light`), porque el azul del logo no contrasta con el navy.

## Estructura

```
src/
  components/   Navbar, Footer, Logo, SectionHeader, ServiceRow,
                ServiceSelector, FaqItem, WhatsAppIcon
  sections/     Hero · Experience · Services · RequestCta ·
                Clients · Faq · FinalCta
  data/         services.js · content.js · trust.js
  config/       business.js · whatsapp.js
  lib/          whatsapp.js                (ensambla, no redacta)
  styles/       tokens.css                 (design tokens)
```

Cada componente/sección tiene su propio archivo `.css` al lado.
CSS mobile-first: los `@media` son siempre `min-width`.

### Dirección visual

Sitio editorial, no "landing de tarjetas": secciones separadas por filetes
(`border-top`) en lugar de cajas, radios bajos, sombras casi inexistentes y
composiciones asimétricas (columna de intro fija + columna de contenido).

Titulares en **Fraunces** (`--font-display`), cuerpo en **Plus Jakarta Sans**.
Para volver a un sitio 100 % sans, iguala `--font-display` a `--font-sans` en
`tokens.css`.

### Enlaces a una categoría concreta

`#servicios-hogar`, `#servicios-institucional` y `#servicios-tapiceria` abren la
sección de servicios ya posicionada en esa categoría. Los usa el footer.

### Portada con vídeo

El hero reproduce un vídeo distinto según el viewport y **solo descarga uno**:

| Viewport | Archivo                    | Peso   |
| -------- | -------------------------- | ------ |
| ≥ 768 px | `/videos/hero-desktop.mp4` | 3,7 MB |
| < 768 px | `/videos/hero-mobile.mp4`  | 2,8 MB |

Se monta **una sola** etiqueta `<video>` con **una sola** `src`, elegida antes
del primer pintado (`useSyncExternalStore` + `matchMedia` devuelve el valor de
forma síncrona). El navegador nunca llega a ver la otra ruta, así que no puede
pedirla. No se usa `<source media>`: los navegadores ignoran ese atributo
dentro de `<video>` y acabarían descargando el primero de la lista.

Atributos: `autoplay muted loop playsInline preload="metadata"`, sin controles
y sin pista de audio en el archivo.

**Fallback.** Debajo del vídeo hay siempre un `<img>` con `heroPoster`, cargado
con `fetchpriority="high"`. El vídeo arranca en `opacity: 0` y solo aparece
—con un fundido de 240 ms— cuando dispara el evento `playing`, no `canplay`:
si el navegador bloquea el autoplay, el archivo falla o tarda, se queda el
póster y nunca se ve fondo negro. `heroPosterMobile` permite una imagen
distinta en móvil; vacío usa `heroPoster`.

**Movimiento reducido.** Con `prefers-reduced-motion: reduce` la etiqueta
`<video>` ni siquiera se monta: el archivo no se pide. No es una pausa
posterior a la descarga.

**Encuadre.** `heroVideoPositionDesktop` y `heroVideoPositionMobile`
(`object-position`) se aplican por igual al vídeo y al póster.

El velo azul es un degradado, no un plano opaco: denso bajo el copy (90-95 %)
y suelto en la zona opuesta (22-34 %), para que el movimiento se note sin
comprometer la lectura.

El navbar flota sobre la portada sin fondo y con el logo sobre placa blanca;
al desplazarse 60 px vuelve a su versión clara.

### Fotografías de trabajo real

La sección "Trayectoria" usa cuatro fotos de `public/images/real-work/`,
declaradas en `workPhotos` (`src/data/trust.js`) con su `alt`, su proporción y
su `object-position`.

**El recorte no es decorativo.** `limpieza-altura-01.jpg` y
`petroecuador-exterior-01.jpg` traen incrustadas fecha, coordenadas GPS y
nombre del sitio en la esquina inferior derecha. Los marcos 16:9 y 21:9 con
`focus: 'top'` las dejan fuera de cuadro. Si se cambia la proporción de esas
dos fotos, la marca vuelve a aparecer. Lo ideal es pedir a la clienta un
reexport sin sello.

### Rendimiento

- El hero carga con `fetchpriority="high"`; todo lo demás con `loading="lazy"`.
- Cada marco de imagen fija `aspect-ratio`, así que no hay saltos de layout.
- Sin librerías de animación ni de carrusel. Los iconos son tree-shaken.
- `prefers-reduced-motion` desactiva animaciones y scroll suave.

### Facebook

`businessConfig.facebook` está vacío porque la clienta no confirmó cuenta. El
footer solo muestra las redes que tengan URL, así que no hay que tocar nada: si
más adelante hay página, se pega la URL y el enlace aparece.

## Datos confirmados por la clienta

WhatsApp `0989869808` (`593989869808`) · `expoaseoec@gmail.com` ·
Instagram y TikTok `@expoaseo` · Loja y provincia ·
08:30–12:30 y 15:00–18:00 · 15 años de experiencia ·
instituciones listadas en `src/data/trust.js`.

## Pendientes con la clienta

- **Días de atención**: solo tenemos las franjas horarias, no los días.
  Cuando los confirme, escribirlos en `businessConfig.businessDays` y se
  muestran solos junto al horario.
- **Logos de las instituciones** y **certificaciones** (ver `src/data/trust.js`).
  Los nombres ya se muestran en texto; al añadir `logo` a un cliente, la imagen
  sustituye al nombre sin tocar el componente.
- **Reexport sin sello** de las dos fotos con fecha y coordenadas incrustadas.
- **Metraje propio para la portada**: el vídeo actual es de stock (equipo con
  overol rojo en un loft), y no coincide con el uniforme ni los espacios reales
  que se ven en Trayectoria.
- **Fotografías de las tres categorías de servicio** — es lo único que sigue
  mostrando campo de color en vez de imagen. Todo el material se carga desde
  `businessMedia` en `src/config/business.js`, sin tocar componentes:

  | Clave             | Dónde aparece           | Proporción | Mínimo    |
  | ----------------- | ----------------------- | ---------- | --------- |
  | `heroVideoDesktop`| Portada ≥ 768 px        | 16:9       | 1920×1080 |
  | `heroVideoMobile` | Portada < 768 px        | 9:16       | 720×1280  |
  | `heroPoster`      | Respaldo de portada     | 16:9       | 1920×1080 |
  | `homeImage`       | Categoría Hogares       | 21:9       | 1600×686  |
  | `businessImage`   | Categoría Empresas      | 21:9       | 1600×686  |
  | `upholsteryImage` | Categoría Tapicería     | 21:9       | 1600×686  |
  | `closingImage`    | Cierre                  | 16:9       | 1600×900  |

  Portada, respaldo y cierre ya están resueltos. Falta una foto honesta de
  **hogar**: todo el material disponible es institucional.
- Imagen para compartir en redes (`og:image`, 1200×630) con URL absoluta.
- Validar la respuesta de la FAQ sobre tiempos de agendamiento.
