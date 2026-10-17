# El chisme de la mejor amiga — Anuncio Línea Taína (Atabey Organics)

Anuncio UGC vertical hecho con **HyperFrames 0.8.169** (HTML + GSAP → MP4).
Empieza como un chisme contado a cámara y, en el giro, se convierte en la presentación de la línea Taína.

> **Estado:** la estructura, la animación, los subtítulos sincronizados y la mezcla están hechos y validados
> (`hyperframes check` sin errores). **Todavía no es el anuncio final:** el video, la voz, la música y los
> efectos son **marcadores**. Hay que sustituirlos por tu material (ver §4 y §5).

---

## 1. Guion definitivo de voz (≈ 53 s de voz + 3,2 s de cierre = 56 s)

| # | Momento | Texto |
|---|---------|-------|
| L01 | Gancho | Mi mejor amiga me contó que el novio le estaba pegando cuernos... |
| L02 | Gancho | ¿Y adivinen con quién? *(pausa)* |
| L03 | Gancho | ¡Con la prima de él! |
| L04 | Suspenso | Pero espérate, que ahí no termina la vaina. |
| L05 | Suspenso | Ella tenía semanas sospechando... |
| L06 | Suspenso | así que, mientras él dormía, le revisó el celular. |
| L07 | Suspenso | ¿Y qué encontró? *(pausa larga: silencio total)* |
| L08 | Suspenso | Un mensaje que decía: |
| L09 | Suspenso | «Tranquilo, que ella no se va a enterar de lo nuestro.» |
| L10 | Clímax | Mi amiga, que no es fácil, le tomó captura a todo... |
| L11 | Clímax | y al otro día lo invitó a cenar. |
| L12 | Clímax | Tranquila, bonita, oliendo rico... |
| L13 | Clímax | porque hasta pa' dejar a un hombre hay que estar bien puesta. |
| L14 | Clímax | Cuando él llegó, le puso las capturas en la mesa y le dijo: |
| L15 | Clímax | «Explícame esto.» |
| L16 | Clímax | ¡El hombre se quedó frío! *(pausa)* |
| L17 | Giro | Pero espérate... *(pausa)* |
| L18 | Giro | nada de eso pasó. Me lo inventé. *(risa)* |
| L19 | Producto | Pero ya que llegaste hasta aquí... |
| L20 | Producto | esta es la línea Taína, de Atabey Organics. |
| L21 | CTA | En la descripción te dejo el número y la cuenta pa' que la consigas. |
| L22 | CTA | Que hidratar tu piel es mejor que andar escuchando chismes. |

El guion vive en `tools/guion.json` (texto, momento y pausa de cada línea). Si cambias una frase allí,
vuelve a sincronizar (§5).

**Dirección de voz:** tono de nota de voz a una amiga, no de locutora. Baja la voz en «¿Y qué encontró?»,
lee el mensaje con tono burlón, deja respirar la pausa tras «se quedó frío» y suelta una risa real en
«me lo inventé». Para el cierre, sonrisa en la voz y ritmo más tranquilo.

## 2. Storyboard (tiempos con la voz guía; se recalculan con tu voz real)

| Tiempo | Momento | Visual | Subtítulo / gráfico | Sonido | Transición |
|---|---|---|---|---|---|
| 0,0–2,9 | GANCHO | A-roll primer plano, empuje lento 1,00→1,05 | Etiqueta superior «EL CHISME DE MI MEJOR AMIGA»; «cuernos» resaltado | Entra música de intriga | — |
| 3,6–4,8 | GANCHO | Corte a 1,14 | «¿Y adivinen con quién?» | — | Jump cut |
| 5,3–6,4 | GANCHO | Acercamiento a 1,30 + sacudida corta | «¡Con la **prima**…» | *pop* | Jump cut |
| 6,9–11,0 | SUSPENSO | A-roll 1,00 → 1,10 | «ahí no termina la **vaina**» | Intriga | Jump cuts |
| 11,4–14,3 | SUSPENSO | **B-roll celular** (cuarto oscuro, luz de pantalla) | «le revisó el **celular**» | *whoosh* | Corte |
| 14,6–16,1 | SUSPENSO | A-roll acercamiento extremo 1,38→1,46 | «¿Y qué **encontró**?» | **Silencio total** (se corta la música) | Corte |
| 16,1–20,4 | SUSPENSO | A-roll desenfocado y oscurecido + **chat gráfico** («Prima», 2:14 a. m.), «escribiendo…», burbuja que se ilumina palabra a palabra | El mensaje es el subtítulo | *notificación*; vuelve la intriga | El chat sube |
| 20,7–23,6 | CLÍMAX | A-roll; en «captura»: destello blanco + 3 capturas en abanico | «le tomó **captura**» | *obturador* | Destello |
| 23,6–25,5 | CLÍMAX | A-roll 1,12 | «lo invitó a **cenar**» | — | — |
| 25,8–31,0 | CLÍMAX | **B-roll «bien puesta»**: espejo, pelo, aceite en el brazo (producto sin protagonismo) | «hay que estar bien **puesta**» | — | Corte |
| 31,2–34,4 | CLÍMAX | **B-roll mesa**: mano que pone las capturas | «le puso las capturas…» | *whoosh* | Corte |
| 34,4–35,5 | CLÍMAX | A-roll 1,32 | «**Explícame** esto.» | *golpe* | Jump cut |
| 35,9–37,4 | CLÍMAX | A-roll 1,12 + tinte frío y desaturado | «se quedó **frío**» | — | — |
| 38,1–39,0 | GIRO | A-roll 1,25 + sacudida | «Pero espérate…» | *disco rayado*, la música se corta | Corte |
| 39,5–41,3 | GIRO | A-roll 1,00 con rebote; el título superior se **tacha** y aparece «(inventado)» | «Me lo **inventé**.» | **Cambio a música divertida** (aire de merengue) + *pop* | — |
| 41,9–43,7 | PRODUCTO | A-roll 1,10 | «Pero ya que llegaste hasta aquí…» | — | **Cortina ámbar** (como aceite) sube y revela el producto |
| 43,8–46,2 | PRODUCTO | Fondo de foto desenfocada, «ATABEY ORGANICS / Línea Taína», tarjeta con foto real, burbuja con tu cara (PiP) | «línea **Taína**, de **Atabey Organics**» | *ding* | Entrada escalonada |
| 46,5–53,2 | CTA | La tarjeta muestra el **B-roll de aplicación**; botón «Número y cuenta en la descripción ↓» | Subtítulos de L21–L22 | *pop*; música divertida | Fundido en tarjeta |
| 53,2–56,4 | CIERRE | Foto real + `@TU_CUENTA` + botón (visible ~10 s en total) | — | La música se desvanece | — |

**Zonas seguras.** Todo el contenido clave del 9:16 está entre y≈330 e y≈1500 px y a 90 px del borde izquierdo
y 150 px del derecho (columna de iconos de Instagram). Esa franja cabe dentro del recorte 4:5 (y=285…1635),
por lo que el feed reutiliza la misma pieza; en el 4:5 la etiqueta superior baja 120 px.

## 3. Estructura del proyecto

```
index.html                    9:16 1080×1920 (Reels/Stories) – monta compositions/anuncio.html
compositions/feed-4x5.html    4:5 1080×1350 (feed) – monta la misma pieza recortada al centro
compositions/anuncio.html     TODA la pieza: capas, gráficos, audio, subtítulos y línea de tiempo GSAP
tools/guion.json              Guion por líneas (texto, momento, pausa)
tools/sincronizar.mjs         Genera voz guía o alinea tu voz real; recalcula escenas y subtítulos
tools/timing.json             Tiempos por palabra resultantes (lo genera el script)
tools/generar-placeholders.sh Crea los marcadores de video/música/efectos
tools/preparar-foto.sh        Copia tu foto de producto y crea el fondo desenfocado
assets/video|audio|sfx|fotos  Recursos (ver §4)
assets/vendor/gsap-3.14.2.min.js  GSAP local (el render no depende de internet)
```

Cada clip de video/audio lleva `data-sync="INICIO..FIN"` referido a líneas del guion (`L06`, `L13:end`,
`L10@captura`, `total`, `voz`). El script reescribe `data-start` / `data-duration` a partir de esas
referencias, así que **nunca hay que retocar tiempos a mano** cuando cambia la voz.

## 4. Recursos que debes grabar o aportar

| Archivo (mismo nombre) | Qué es | Cómo grabarlo en casa | Estado |
|---|---|---|---|
| `assets/video/aroll.mp4` | **Tú contando el chisme** a cámara, una sola toma de principio a fin (L01–L22) | Celular vertical 1080×1920, 30 fps, a la altura de los ojos, frente a una ventana (luz de lado), fondo: pared lisa, cama o tocador. Encuadre del pecho hacia arriba con la cara en el tercio superior (los acercamientos se centran en y≈34 %). Habla como en una nota de voz. | MARCADOR |
| `assets/audio/voz.wav` | Tu voz | **Opción A (recomendada):** sale de la misma toma: `ffmpeg -i assets/video/aroll.mp4 -vn -ac 1 -ar 48000 assets/audio/voz.wav`. **Opción B:** voz en off grabada aparte con el celular pegado a la boca en un clóset/cuarto con ropa (menos eco). | VOZ GUÍA PROVISIONAL (sintética, acento neutro, **no** dominicana) |
| `assets/video/broll-celular.mp4` | Mano que toma el celular en la oscuridad | Luces apagadas, brillo del celular al máximo; que la luz de la pantalla te ilumine la cara. 3–6 s | MARCADOR |
| `assets/video/broll-puesta.mp4` | «Bien puesta» | Frente al espejo: acomodarte el pelo, aplicarte el aceite en el brazo/cuello. Producto visible pero sin mostrar la etiqueta de frente. 5–7 s | MARCADOR |
| `assets/video/broll-mesa.mp4` | Capturas en la mesa | Plano cenital de cualquier mesa: tu mano deja el celular o capturas impresas con firmeza. 3–5 s | MARCADOR |
| `assets/video/broll-aplicacion.mp4` | **Aplicación real del producto** | Primerísimo plano con luz de ventana: aceite corporal deslizándose en el brazo o mantequilla en la mano. Grábalo vertical; se recorta a 3:4 en la tarjeta. 5–7 s | MARCADOR |
| `assets/fotos/linea-taina.jpg` | Foto de la línea | **Ya incluida** (la foto que enviaste). Si tienes una mejor, pásala por `tools/preparar-foto.sh`. | REAL |
| `assets/audio/musica-intriga.wav` | Música de intriga | Pista con licencia (biblioteca de audio de tu editor o banco de música libre de derechos). Mínimo 40 s. | PROVISIONAL sintetizada |
| `assets/audio/musica-divertida.wav` | Música del giro | Algo alegre (merengue/bachata instrumental con licencia). Mínimo 20 s, que arranque con energía. | PROVISIONAL sintetizada |
| `assets/sfx/*.wav` | pop, whoosh, notificación, obturador, golpe, disco rayado, ding | Bancos libres de derechos (Pixabay, Freesound con licencia CC0). Mismos nombres. | PROVISIONALES sintetizados |
| Cuenta y número | Texto del cierre | Cambia `@TU_CUENTA` (variable `cuenta`) y escribe el número y la cuenta en la **descripción** de la publicación. | MARCADOR |

**Si no tienes algún B-roll:** el video funciona igual dejando el marcador fuera; basta con borrar ese
bloque `<div class="broll" …>` de `compositions/anuncio.html` (la cámara queda debajo). Para la aplicación
del producto, si no la grabas, borra `#an-aplic-wrap` y la tarjeta mostrará la foto todo el tiempo.

**No incluido a propósito:** no se mencionan ingredientes, beneficios, SPF ni resultados que no aparezcan en
las etiquetas; el texto solo nombra la marca, la línea y «hidratar tu piel» (las etiquetas dicen
*hydrating* / *nourishing*). No hay logotipo dibujado: si me envías el logo oficial en PNG/SVG lo añado.

## 5. Sustituir los marcadores

```bash
cd anuncio-taina

# 1) Copia tus archivos encima de los marcadores, con el MISMO nombre
cp ~/Descargas/mi-toma.mp4            assets/video/aroll.mp4
ffmpeg -y -i assets/video/aroll.mp4 -vn -ac 1 -ar 48000 assets/audio/voz.wav   # voz desde la misma toma
cp ~/Descargas/celular.mp4            assets/video/broll-celular.mp4
# … igual con broll-puesta, broll-mesa, broll-aplicacion, músicas y sfx
bash tools/preparar-foto.sh ~/Descargas/mi-foto.jpg      # opcional

# 2) Sincroniza todo con TU voz (transcribe en español y alinea palabra por palabra)
node tools/sincronizar.mjs --voz assets/audio/voz.wav
#    (si ya tienes transcript: node tools/sincronizar.mjs --voz assets/audio/voz.wav --transcript transcript.json)

# 3) Revisa y ajusta en el editor visual
npx hyperframes preview            # Studio: puedes mover clips, cambiar textos y la variable "cuenta"
npm run check                      # debe terminar sin errores
```

Notas:
- Di el guion **tal como está** en `tools/guion.json` (o edita ese archivo para que coincida con lo que digas);
  el alineador tolera muletillas y palabras sueltas, y avisa si algo no coincide.
- Si grabas el A-roll y la voz por separado, el A-roll se usará sin sonido y los labios no irán sincronizados;
  en ese caso conviene grabar el A-roll repitiendo el guion encima de tu voz.
- Video de iPhone (HEVC/H.265) funciona: el render lo decodifica y la vista previa crea una copia compatible.

## 6. Renderizado y exportación

```bash
# 9:16 Reels / Stories (1080×1920)
npx hyperframes render -q high -o renders/anuncio-taina-9x16.mp4

# 4:5 Feed (1080×1350)
npx hyperframes render -c compositions/feed-4x5.html -q high -o renders/anuncio-taina-4x5.mp4

# Volumen final para Instagram (≈ −14 LUFS); el render sale a ≈ −20 LUFS
for f in renders/anuncio-taina-9x16 renders/anuncio-taina-4x5; do
  ffmpeg -y -i $f.mp4 -c:v copy -af loudnorm=I=-14:TP=-1.5:LRA=11 -c:a aac -b:a 192k ${f}-IG.mp4
done
```

- Usa `-q draft` para pruebas rápidas. En una computadora normal el render tarda unos minutos; `-w 4` usa 4 procesos.
- Para un resultado idéntico en cualquier máquina: añade `--docker` (requiere Docker).
- Sube a Instagram el archivo `*-IG.mp4`. Pega en la descripción el número de WhatsApp y la cuenta.
- Si prefieres usar una canción de la biblioteca de Instagram, baja `data-volume` de las dos músicas a `0`
  en `compositions/anuncio.html`, renderiza, y añade la canción en la app (el giro perderá su cambio de música).

### Requisitos
Node.js ≥ 22 y FFmpeg. La primera ejecución de `npx hyperframes` descarga la herramienta y Chromium.
La voz guía (`--guia`) además necesita Python con `pip install kokoro-onnx soundfile`
(y `HYPERFRAMES_PYTHON` apuntando a ese Python si está en un entorno virtual).
