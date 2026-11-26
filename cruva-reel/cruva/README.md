# Reel Black Friday — Cruva Construcciones S.R.L.

Vertical 1080×1920, 30 fps, 25 s. Proyecto HyperFrames (HTML + GSAP).

## Estructura
- `index.html` — raíz: mapa de tiempos (comentario), escenas, voz, música y efectos.
- `compositions/` — una escena por archivo: `s1-hook`, `s2-precios`, `s3-incluye`, `s4-validez`, `s5-cta`, `captions` (subtítulos quemados).
- `assets/img/` — recortes del flyer original (logo, 2 fotos, 2 íconos). `src/flyer.jpg` es el original.
- `assets/voice/v1..v6.wav` — una pista de voz por frase (Kokoro, voz `em_alex`, normalizada a −16 LUFS / −1,5 dBTP).
- `assets/music.wav`, `assets/sfx/*.wav` — música y efectos sintetizados con `tools/make_audio.py`.
- `assets/vendor/gsap.min.js` — GSAP local (el CDN está bloqueado en el entorno).
- `renders/cruva-black-friday.mp4` y `.srt`.

## Cómo modificar
- **Textos/precios**: edita el HTML de cada escena (`s2-precios.html` para precios, `s5-cta.html` para el número).
- **Número de WhatsApp**: `s5-cta.html` (`#num`), `captions.html`, el `.srt` y la frase `v6` de la voz. Número actual: 829 343 8197.
- **Tiempos**: `data-start`/`data-duration` en `index.html` y los tiempos del `tl` dentro de cada escena.
- **Imágenes**: reemplaza los archivos de `assets/img/` (mismo nombre). Con logo y fotos originales de mayor resolución el resultado mejora.
- **Voz**: regenera una frase y normaliza:
  `npx hyperframes tts "texto" --voice em_alex --lang es -o assets/voice/raw_v1.wav`
  `ffmpeg -i assets/voice/raw_v1.wav -af loudnorm=I=-16:TP=-1.5:LRA=7 -ar 44100 assets/voice/v1.wav`
  y ajusta `data-duration` del `<audio>` si cambia la duración.
- **Música**: sustituye `assets/music.wav` por una pista real (25 s) o ejecuta `python3 tools/make_audio.py`.

## Regenerar
```
npm install            # instala gsap/hyperframes si hace falta
npx hyperframes check
npx hyperframes snapshot --at 0,5.5,9,13,16,24
npx hyperframes render --quality delivery --fps 30 -o renders/cruva-black-friday.mp4
```
