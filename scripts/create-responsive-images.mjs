// Manual asset generation: node scripts/create-responsive-images.mjs (requires ffmpeg).
// Adds smaller srcset candidates next to the originals, which stay untouched and
// remain the largest candidate. Outputs are committed; builds do not need ffmpeg.
import { execFileSync } from 'node:child_process'
import { trajectoryPhotos, trajectoryVariant, trajectoryWidths } from '../src/data/trajectoryPhotos.js'
import { businessMedia } from '../src/config/business.js'

const ffmpeg = (input, output, width, codec) => execFileSync('ffmpeg', ['-v', 'error', '-y', '-i', `public${input}`, '-vf', `scale=${width}:-2:flags=lanczos`, ...codec, `public${output}`])

for (const photo of trajectoryPhotos) {
  for (const width of trajectoryWidths) {
    ffmpeg(photo.src, trajectoryVariant(photo.id, width), width, ['-c:v', 'libwebp', '-quality', '82', '-compression_level', '6'])
  }
}
const width = businessMedia.logoCompactWidth
for (const logo of Object.values(businessMedia.logo)) {
  ffmpeg(logo, logo.replace(/\.png$/, `-${width}.webp`), width, ['-c:v', 'libwebp', '-lossless', '1', '-compression_level', '6'])
}
console.log('Responsive images generated.')
