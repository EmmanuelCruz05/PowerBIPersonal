#!/usr/bin/env bash
# Prepara la foto de producto: copia principal + fondo desenfocado.
# Uso: bash tools/preparar-foto.sh ruta/a/tu-foto.jpg
set -euo pipefail
cd "$(dirname "$0")/.."
SRC="${1:-assets/fotos/linea-taina.jpg}"
[ "$SRC" != "assets/fotos/linea-taina.jpg" ] && ffmpeg -y -v error -i "$SRC" -q:v 3 assets/fotos/linea-taina.jpg
ffmpeg -y -v error -i assets/fotos/linea-taina.jpg \
  -vf "scale=540:-2,boxblur=24:3,eq=brightness=-0.08:saturation=1.1,scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920" \
  -q:v 4 assets/fotos/linea-taina-fondo.jpg
echo "Listo: assets/fotos/linea-taina.jpg y assets/fotos/linea-taina-fondo.jpg"
