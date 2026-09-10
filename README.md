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
| Verde escoba     | `#8CC63F` | `--accent-500`| Badges, checks, detalles             |
| Verde secundario | `#6EBE44` | `--accent-600`| Iconos de acento                     |
| Gris bajada      | `#818285` | `--ink-400`   | Texto terciario                      |
| Verde WhatsApp   | `#25D366` | `--wa`        | Solo botones que abren el chat       |

Sobre el footer oscuro el logo se monta en una placa blanca
(`.logo--light`), porque el azul del logo no contrasta con el navy.

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
- Fotografías reales (hero y, más adelante, galería).
- Imagen para compartir en redes (`og:image`, 1200×630) con URL absoluta.
- Validar la respuesta de la FAQ sobre tiempos de agendamiento.
