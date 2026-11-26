# Reel Georadar GPR — Cruva Construcciones S.R.L.
Vertical 1080×1920, 30 fps, 35,5 s. Misma estructura que el proyecto `../cruva` (ver su README).
- Escenas: `compositions/s1-hook`, `s2-tecnologia`, `s3-beneficios`, `s4-aplicaciones`, `s5-cta`, `captions`. Mapa de tiempos en el comentario de `index.html`.
- Voz: `assets/voice/v1..v7.wav` (Kokoro `em_alex`, normalizada). Para regenerar: `npx hyperframes tts "texto" --voice em_alex --lang es -o /tmp/raw.wav` y `ffmpeg -i /tmp/raw.wav -af loudnorm=I=-16:TP=-1.5:LRA=7 -ar 44100 assets/voice/vN.wav`.
- Música y efectos sintetizados: `python3 tools/make_audio.py` (sustituible por una pista real en `assets/music.wav`).
- Imágenes: `assets/img/` recortadas del flyer (`src/flyer.jpg`).
- Número: `s5-cta.html`, `captions.html`, `.srt` y la frase v7 de la voz.
- Render: `npx hyperframes render --quality delivery --fps 30 -o renders/georadar-gpr.mp4` (el MP4 entregado tiene además -1,5 dB de ganancia en el audio, aplicada con ffmpeg).
