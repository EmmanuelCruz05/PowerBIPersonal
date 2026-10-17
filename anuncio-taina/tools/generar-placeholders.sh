#!/usr/bin/env bash
# Genera RECURSOS DE EJEMPLO (marcadores) para poder previsualizar y renderizar
# el anuncio antes de tener el material real. Sustitúyelos por tus archivos con
# el MISMO nombre. Uso: bash tools/generar-placeholders.sh <duracion_total_seg>
set -euo pipefail
cd "$(dirname "$0")/.."
TOTAL="${1:-57}"
FONT="${FONT:-/usr/share/fonts/opentype/inter/Inter-Bold.otf}"
V=assets/video; A=assets/audio; S=assets/sfx
mkdir -p "$V" "$A" "$S"

# --- Videos marcadores (1080x1920, 30 fps, H.264) ---
placeholder () { # archivo duracion color "TITULO" "linea 1" "linea 2"
  ffmpeg -y -v error -f lavfi -i "color=c=$3:s=1080x1920:r=30:d=$2" \
    -vf "drawbox=x=140:y=360:w=800:h=760:color=white@0.18:t=6,\
drawtext=fontfile=$FONT:text='MARCADOR':fontsize=46:fontcolor=white@0.55:x=(w-tw)/2:y=200,\
drawtext=fontfile=$FONT:text='$4':fontsize=70:fontcolor=white:x=(w-tw)/2:y=700,\
drawtext=fontfile=$FONT:text='$5':fontsize=40:fontcolor=white@0.85:x=(w-tw)/2:y=1240,\
drawtext=fontfile=$FONT:text='$6':fontsize=40:fontcolor=white@0.85:x=(w-tw)/2:y=1300,\
drawtext=fontfile=$FONT:text='%{pts\:hms}':fontsize=44:fontcolor=white@0.7:x=(w-tw)/2:y=1420" \
    -c:v libx264 -preset veryfast -crf 30 -pix_fmt yuv420p -movflags +faststart "$1"
}
placeholder $V/aroll.mp4            "$TOTAL" 0x5a3324 "A-ROLL (TU CARA)"   "Una sola toma contando el chisme"  "Encuadre del pecho hacia arriba"
placeholder $V/broll-celular.mp4    6 0x1b2230 "B-ROLL CELULAR"     "Cuarto oscuro: mano toma el celular" "La luz de la pantalla en la cara"
placeholder $V/broll-puesta.mp4     7 0x7a4a2c "B-ROLL BIEN PUESTA" "Frente al espejo: pelo y aceite"      "en el brazo (sin enseñar etiqueta)"
placeholder $V/broll-mesa.mp4       5 0x3a2a22 "B-ROLL MESA"        "Mano pone las capturas en la mesa"   "Plano cenital, cualquier mesa"
placeholder $V/broll-aplicacion.mp4 6 0x9a5a2e "B-ROLL APLICACION"  "Producto real aplicado en la piel"   "Primerisimo plano, luz de ventana"

# --- Música provisional sintetizada (sustituir por música con licencia) ---
# Intriga: pulso grave a 92 bpm + acorde menor suave + tic
ffmpeg -y -v error -f lavfi -i "aevalsrc=\
0.30*sin(2*PI*55*t)*exp(-5*mod(t\,0.652))\
+0.045*(sin(2*PI*220*t)+sin(2*PI*261.63*t)+sin(2*PI*329.63*t))*(0.6+0.4*sin(2*PI*0.2*t))\
+0.05*(random(0)*2-1)*exp(-70*mod(t\,0.326))\
+0.06*sin(2*PI*880*t)*exp(-9*mod(t\,2.608)):s=48000:d=$TOTAL" \
  -af "lowpass=f=6000,afade=t=in:d=0.3" -ac 2 $A/musica-intriga.wav
# Divertida: aire de merengue (bajo + güira + arpegio mayor) a 128 bpm
ffmpeg -y -v error -f lavfi -i "aevalsrc=\
0.16*sin(2*PI*if(lt(mod(t\,0.469)\,0.117)\,523.25\,if(lt(mod(t\,0.469)\,0.234)\,659.25\,if(lt(mod(t\,0.469)\,0.352)\,783.99\,880)))*t)*exp(-9*mod(t\,0.117))\
+0.28*sin(2*PI*if(lt(mod(t\,1.875)\,0.9375)\,130.81\,98)*t)*exp(-4*mod(t\,0.469))\
+0.35*sin(2*PI*(45+90*exp(-25*mod(t\,0.469)))*t)*exp(-9*mod(t\,0.469))\
+0.06*(random(0)*2-1)*exp(-45*mod(t\,0.117)):s=48000:d=$TOTAL" \
  -af "highpass=f=35,afade=t=in:d=0.05" -ac 2 $A/musica-divertida.wav

# --- Efectos de sonido provisionales ---
ffmpeg -y -v error -f lavfi -i "aevalsrc=0.5*sin(2*PI*1320*t)*exp(-7*t)+0.25*sin(2*PI*1980*t)*exp(-9*t):s=48000:d=0.8" $S/ding.wav
ffmpeg -y -v error -f lavfi -i "aevalsrc=0.45*sin(2*PI*if(lt(t\,0.11)\,988\,1319)*t)*exp(-10*mod(t\,0.11)):s=48000:d=0.45" $S/notificacion.wav
ffmpeg -y -v error -f lavfi -i "aevalsrc=0.8*(random(0)*2-1)*(exp(-60*t)+0.6*exp(-80*abs(t-0.07))):s=48000:d=0.25" -af "highpass=f=1200" $S/obturador.wav
ffmpeg -y -v error -f lavfi -i "aevalsrc=0.6*(random(0)*2-1)*sin(PI*t/0.7):s=48000:d=0.7" -af "bandpass=f=900:w=1400,afade=t=out:st=0.4:d=0.3" $S/whoosh.wav
ffmpeg -y -v error -f lavfi -i "aevalsrc=0.55*sin(2*PI*(500-420*t/0.45)*t)*(0.6+0.4*(random(0)*2-1))*exp(-2*t):s=48000:d=0.45" -af "lowpass=f=3500" $S/scratch.wav
ffmpeg -y -v error -f lavfi -i "aevalsrc=0.9*sin(2*PI*(40+120*exp(-18*t))*t)*exp(-4*t)+0.2*(random(0)*2-1)*exp(-25*t):s=48000:d=1.2" $S/golpe.wav
ffmpeg -y -v error -f lavfi -i "aevalsrc=0.5*sin(2*PI*(300+900*exp(-40*t))*t)*exp(-22*t):s=48000:d=0.25" $S/pop.wav
echo "Marcadores generados (duración A-roll ${TOTAL}s)."
