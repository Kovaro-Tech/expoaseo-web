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
| Logo (dos versiones)                           | `businessMedia.logo` en config |
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

### Organizaciones y certificaciones

Las 29 organizaciones reales viven en `clients` (`src/data/trust.js`), cada
una con `name`, `shortName`, `sector`, `category`, `icon`, `logo` y `featured`.

| Sector         | Organizaciones |
| -------------- | -------------- |
| Sector público | 13             |
| Salud          | 11             |
| Energía        | 2              |
| Privado        | 3              |

- **`sector`** decide en qué fila del rail cae y bajo qué filtro aparece.
- **`icon`** es una clave Lucide elegida en el dato; el componente solo la
  resuelve. Qué icono lleva cada organización NO se decide en el componente.
- **`shortName`** es lo que se ve; `name` va en el `title` del elemento.
- **`featured`** (8 organizaciones) da algo más de peso y prioridad de orden.
- **`clientStats`** calcula las cifras de la banda desde el propio array, así
  que nunca contradicen a la lista.

**Añadir una organización** = un objeto más en `clients`. Entra sola en su
fila, su filtro y con su icono. Al rellenar `logo`, la imagen sustituye al
icono sin tocar el componente: altura uniforme, `object-fit: contain`, sin
recolorear ni recortar.

**Filtro** (`clientSectors`): chips de texto con línea de acento, nunca
botones. En móvil se desplazan en horizontal.

**Movimiento:** CSS puro, 90 s en móvil y 70 s en desktop, fila 1 en un
sentido y fila 2 en el contrario. El set se repite cuatro veces y la animación
desplaza exactamente un set, de modo que el reinicio es invisible. Se detiene
con `:hover`, `:focus-within` y, en táctil, 6 s después de tocarla.

El rail se adapta al número de organizaciones: dos filas a partir de 12, una
sola por debajo, y **estática** por debajo de 6 (Energía y Privado hoy), para
que una cinta con dos nombres no se vea pobre.

Con `prefers-reduced-motion: reduce` no hay animación: se oculta la
repetición y queda una única tanda en rejilla.

`certifications` sigue vacío; su bloque no se renderiza hasta que haya
contenido. **No poblar con datos de ejemplo**: solo material que la clienta
haya entregado y autorizado.

### Logo y colores de marca

Hay **dos versiones del logo**, ambas sobre transparencia y sin placa ni caja:

| Archivo                       | `businessMedia.logo` | Dónde                    |
| ----------------------------- | -------------------- | ------------------------ |
| `/images/logo.png`            | `onLight`            | Navbar con fondo claro   |
| `/images/logo-light.png`      | `onDark`             | Hero y footer            |

La versión clara se generó a partir del original con ffmpeg: pasa a blanco
todo lo que no sea verde, así que el wordmark y la bajada quedan en blanco y
la escoba conserva el verde de marca.

```bash
ffmpeg -i public/images/logo.png -vf "format=rgba,geq=r='if(gt(g(X,Y),b(X,Y)),r(X,Y),255)':g='if(gt(g(X,Y),b(X,Y)),g(X,Y),255)':b='if(gt(g(X,Y),b(X,Y)),b(X,Y),255)':a='alpha(X,Y)'" public/images/logo-light.png
```

Si algún archivo faltara, `src/components/Logo.jsx` cae a un wordmark
tipográfico provisional.

La paleta de `src/styles/tokens.css` está derivada del logo:

| Color            | Hex       | Token         | Uso                                  |
| ---------------- | --------- | ------------- | ------------------------------------ |
| Azul wordmark    | `#0F75BC` | `--brand-600` | Botones, tabs, iconos, degradados    |
| Verde escoba     | `#8CC63F` | `--accent-500`| Filetes de sección, subrayado activo |
| Verde secundario | `#6EBE44` | `--accent-600`| Reservado; hoy sin uso               |
| Gris bajada      | `#818285` | `--logo-gray` | Referencia de marca                  |
| Verde WhatsApp   | `#25D366` | `--wa`        | Solo botones que abren el chat       |

`--ink-500` y `--ink-400` llevan texto pequeño y sus valores están elegidos
para superar 4.5:1 (WCAG AA) sobre el fondo del sitio. **No aclararlos**: el
gris exacto del logo (`--logo-gray`) no alcanza ese contraste en texto chico.

Sobre fondo oscuro se usa la versión blanca con un `drop-shadow` mínimo
(`.logo--light`), nunca una placa de color.

## Estructura

```
src/
  components/   Navbar, Footer, Logo, SectionHeader, ServiceRow,
                ServiceSelector, FaqItem, WhatsAppIcon
  sections/     Hero · Experience · Services · RequestCta ·
                Clients · Faq · FinalCta
  data/         services.js · content.js · trust.js
  config/       business.js · whatsapp.js
  lib/          whatsapp.js · useMediaQuery.js
  styles/       tokens.css                 (design tokens)
```

Cada componente/sección tiene su propio archivo `.css` al lado.
CSS mobile-first: los `@media` son siempre `min-width`.

### Dirección visual

Sitio editorial, no "landing de tarjetas": secciones separadas por filetes
(`border-top`) en lugar de cajas, radios bajos, sombras casi inexistentes y
composiciones asimétricas (columna de intro fija + columna de contenido).

**Una sola familia: Plus Jakarta Sans.** La jerarquía se construye con peso,
tamaño y tracking, no con una segunda tipografía:

| Elemento         | Peso | Tracking  |
| ---------------- | ---- | --------- |
| H1 / H2          | 700  | -0.03em   |
| Cifras y precios | 800  | -0.035em  |
| Subtítulos (h3)  | 700  | -0.015em  |
| Cuerpo           | 400  | normal    |
| Labels           | 700  | +0.16em, mayúsculas |

No volver a introducir una serif ni una segunda familia: la elegancia sale de
la composición, no de la fuente.

### Ritmo de la página

Cada bloque tiene que ser una experiencia distinta, no otro bloque de texto
con filete:

```
vídeo → fotos reales → movimiento → catálogo → interacción → preguntas → CTA
Hero    Experience     Clients      Services   RequestCta    Faq          FinalCta
```

Los **15 años son exclusivos de Trayectoria**. El hero no lleva cifras, ni
clientes, ni argumentos: solo qué hacen, para quién y el CTA. La autoridad la
demuestra la sección siguiente, no un titular.

Los tres atributos de confianza (personal, insumos, horarios) son una **banda
compacta al cierre de Servicios**, no una sección propia: apoyan al catálogo
justo donde el usuario está mirando precios.

### Fondos y uso del navy

El azul oscuro está reservado a los dos extremos de la página. En medio todo
es claro, para que la web se lea como una empresa de servicios y no como una
sucesión de portadas:

| Sección       | Fondo                          |
| ------------- | ------------------------------ |
| Hero          | vídeo + velo navy              |
| Trayectoria   | claro                          |
| Servicios     | claro (banda de categoría azul)|
| Confianza     | gris suave (`--surface-2`)     |
| Cotizador     | gris suave (`--surface-2`)     |
| FAQ           | claro                          |
| Cierre        | gris suave (`--surface-2`)     |
| Footer        | navy                           |

No añadir más bloques oscuros: pierden el efecto de los dos que hay.

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

El navbar flota sobre la portada sin fondo, con la versión blanca del logo;
al desplazarse 60 px vuelve a fondo claro y logo a color.

### Fotografías de trabajo real

La sección "Trayectoria" muestra **tres fotografías fijas** de
`public/images/real-work/`: una principal y dos de apoyo. Sin carrusel, sin
controles y sin avance automático — la prueba no necesita animarse.

Las seis fotos siguen declaradas en `workPhotos` (`src/data/trust.js`) con
`src`, `alt`, `label` y `objectPosition`; `src/sections/Experience.jsx` elige
cuáles se muestran. Los `label` son contexto del trabajo ("Sala de sesiones",
"Trabajo en altura"): **nunca dirección exacta, coordenadas ni fecha**.

`limpieza-altura-01.jpg` y `petroecuador-exterior-01.jpg` venían con fecha y
coordenadas GPS incrustadas: los archivos publicados ya están **recortados**
para eliminarlas. Los originales quedan en `assets-source/images/`.

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
