# Vídeos de portada

Estos son los archivos **que se publican**. Los másteres sin comprimir están
en `assets-source/videos/` (fuera de `public/`, y en `.gitignore`: pesan 93 MB).

| Archivo             | Resolución | Duración | Peso   | Se sirve en    |
| ------------------- | ---------- | -------- | ------ | -------------- |
| `hero-desktop.mp4`  | 1920×1080  | 24,3 s   | 3,7 MB | ≥ 768 px       |
| `hero-mobile.mp4`   | 720×1280   | 40,0 s   | 2,8 MB | < 768 px       |

Rutas configuradas en `businessMedia` (`src/config/business.js`):
`heroVideoDesktop` y `heroVideoMobile`.

El hero monta **una sola** etiqueta `<video>` con **una sola** fuente, elegida
antes del primer pintado: el navegador nunca llega a ver la otra ruta.

## Cómo recomprimir

Si llegan másteres nuevos, dejarlos en `assets-source/videos/` y ejecutar:

```bash
# Desktop — 1920×1080
ffmpeg -i assets-source/videos/hero-desktop-source.mp4 \
  -vf "scale=1920:1080:flags=lanczos" \
  -c:v libx264 -preset medium -crf 27 -maxrate 3M -bufsize 6M \
  -profile:v high -level 4.0 -pix_fmt yuv420p -an -movflags +faststart \
  public/videos/hero-desktop.mp4

# Mobile — 720×1280 vertical
ffmpeg -i assets-source/videos/hero-mobile-source.mp4 \
  -vf "scale=720:1280:flags=lanczos" \
  -c:v libx264 -preset medium -crf 30 -maxrate 950k -bufsize 1900k \
  -profile:v high -level 4.0 -pix_fmt yuv420p -an -movflags +faststart \
  public/videos/hero-mobile.mp4
```

Claves de esos comandos:

- `-an` quita la pista de audio. El hero va silenciado; el audio solo pesa.
- `-movflags +faststart` mueve el índice al principio del archivo para que
  empiece a reproducirse antes de terminar de descargarse.
- `-pix_fmt yuv420p` garantiza compatibilidad con Safari iOS.
- El vídeo va bajo un velo azul del 26-95 %, así que no hace falta más
  resolución de la indicada: casi todo el detalle fino no llega a verse.
