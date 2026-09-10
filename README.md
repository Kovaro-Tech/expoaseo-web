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
| Textos de confianza, pasos, beneficios, FAQ| `src/data/content.js`                |
| Colores, tipografía, radios y sombras      | `src/styles/tokens.css`              |
| Logo                                       | colocar `public/logo.png`            |
| Foto del hero (opcional)                   | `businessMedia.heroImage` en config  |

### WhatsApp

`businessConfig.whatsapp` va en formato internacional **sin `+` ni espacios**
(ej. `593987654321`). Mientras esté vacío los botones abren WhatsApp con el
mensaje escrito pero sin destinatario — sirve para demo, **no publicar así**.

Los mensajes se arman en `src/lib/whatsapp.js`.

### Logo

El navbar carga `/logo.png` automáticamente. Si el archivo no existe, muestra un
wordmark tipográfico provisional (`src/components/Logo.jsx`). No hay que tocar
código para activarlo: basta con dejar el archivo en `public/`.

## Estructura

```
src/
  components/   Navbar, Footer, Logo, ServiceCard, ServiceSelector, FaqItem…
  sections/     Hero, TrustBar, Services, HowItWorks, RequestCta, WhyUs, Faq, FinalCta
  data/         services.js · content.js   (única fuente de contenido)
  config/       business.js                (datos de contacto)
  lib/          whatsapp.js · icons.js
  styles/       tokens.css                 (design tokens)
```

Cada componente/sección tiene su propio archivo `.css` al lado.
CSS mobile-first: los `@media` son siempre `min-width`.

## Pendientes con la clienta

- Número de WhatsApp, correo, redes y horario de atención.
- Logo en `public/logo.png` y colores exactos de marca (`tokens.css`).
- Fotografías reales (hero y, más adelante, galería).
- Validar la respuesta de la FAQ sobre tiempos de agendamiento.
