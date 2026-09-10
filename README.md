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

| Necesito cambiar…                          | Archivo                              |
| ------------------------------------------ | ------------------------------------ |
| Número de WhatsApp, correo, redes, horario | `src/config/business.js`             |
| Servicios, precios y descripciones         | `src/data/services.js`               |
| Índice editorial, atributos y FAQ          | `src/data/content.js`                |
| Colores, tipografía, radios y sombras      | `src/styles/tokens.css`              |
| Logo                                       | `public/images/logo.png`             |
| Foto del hero (opcional)                   | `businessMedia.heroImage` en config  |

### WhatsApp

`businessConfig.whatsapp` va en formato internacional **sin `+` ni espacios**
(ej. `593987654321`). Mientras esté vacío los botones abren WhatsApp con el
mensaje escrito pero sin destinatario — sirve para demo, **no publicar así**.

Los mensajes se arman en `src/lib/whatsapp.js`.

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
| Gris bajada      | `#818285` | `--ink-400`   | Texto terciario                      |
| Verde WhatsApp   | `#25D366` | `--wa`        | Solo botones que abren el chat       |

Sobre el footer oscuro el logo se monta en una placa blanca
(`.logo--light`), porque el azul del logo no contrasta con el navy.

## Estructura

```
src/
  components/   Navbar, Footer, Logo, SectionHeader, ServiceRow,
                ServiceSelector, FaqItem, WhatsAppIcon
  sections/     Hero · Manifesto · Services · RequestCta · WhyUs · Faq · FinalCta
  data/         services.js · content.js   (única fuente de contenido)
  config/       business.js                (datos de contacto)
  lib/          whatsapp.js
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
sección de servicios ya posicionada en esa categoría. Los usa el índice
`01 / 02 / 03` del manifiesto y el footer.

## Pendientes con la clienta

- Número de WhatsApp, correo, redes y horario de atención.
- **Fotografía del hero**: el marco ya está listo (`businessMedia.heroImage`,
  formato apaisado ~4:3). Mientras no exista, se muestra un campo de color de
  marca. Es la mejora visual pendiente más grande.
- Imagen para compartir en redes (`og:image`, 1200×630) con URL absoluta.
- Validar la respuesta de la FAQ sobre tiempos de agendamiento.
