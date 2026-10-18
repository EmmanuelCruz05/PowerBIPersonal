# Línea Taína — pieza de producto (21 s)

Video de producto **terminado**, hecho solo con la foto real de la línea (`assets/fotos/linea-taina.jpg`).
Una "cámara" recorre la foto producto por producto, con rótulos, música y cierre comercial.

| Tiempo | Escena |
|---|---|
| 0–2,6 s | «El único chisme que vale la pena: **Línea Taína** · Atabey Organics» |
| 2,6–14,6 s | 6 productos, 2 s cada uno: Body Wash, Cinnamon Sugar Polish, Cloud Body Butter, Hydrating Body Oil, Shimmer Body Oil, labios |
| 14,6–21 s | «Hidrata tu piel» + botón «Número y cuenta en la descripción ↓» (6 s en pantalla) |

Los rótulos solo usan lo que se lee en las etiquetas (nombres y descripciones impresas). No se mencionan
ingredientes, SPF ni resultados.

## Archivos
- `index.html`: 9:16 1080×1920 (Reels/Stories)
- `compositions/feed-4x5.html`: 4:5 1080×1350 (feed)
- `compositions/producto.html`: la pieza (zonas de cada producto en `PRODUCTOS`, al inicio del script)

## Cambios rápidos
- Cuenta en el cierre: variable `cuenta` (vacía = no se muestra). Texto del botón: `ctaTexto`.
- Música: `assets/audio/musica-divertida.wav` es una pista **sintetizada**; sustitúyela por una con licencia
  (mismo nombre) o silénciala (`data-volume="0"`) y añade audio de Instagram al publicar.
- Otra foto: reemplaza `assets/fotos/linea-taina.jpg` y ajusta los rectángulos de `PRODUCTOS`.

## Render
```bash
npx hyperframes render -q high -o renders/raw-9x16.mp4
npx hyperframes render -c compositions/feed-4x5.html -q high -o renders/raw-4x5.mp4
for f in 9x16 4x5; do ffmpeg -y -i renders/raw-$f.mp4 -c:v copy -af loudnorm=I=-14:TP=-1.5:LRA=11 -c:a aac -b:a 192k renders/linea-taina-producto-$f.mp4; done
```
