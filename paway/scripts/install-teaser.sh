#!/usr/bin/env bash
# Copia il teaser cinematico PAWAY nel repo e rigenera il poster.
# Uso: SOURCE="/percorso/PAWAY | Teaser cinematico.mp4" ./scripts/install-teaser.sh
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
DEFAULT_MAC="$HOME/Downloads/PAWAY | Teaser cinematico.mp4"
SOURCE="${SOURCE:-${1:-$DEFAULT_MAC}}"
DEST="$ROOT/assets/video/paway-teaser-cinematico.mp4"
POSTER="$ROOT/assets/img/paway-teaser-poster.webp"

if [[ -z "$SOURCE" || ! -f "$SOURCE" ]]; then
  echo "File sorgente non trovato." >&2
  echo "Imposta SOURCE o passa il percorso come primo argomento, es.:" >&2
  echo '  Doppio clic su METTI-TEASER.command nella cartella del progetto' >&2
  echo '  oppure: SOURCE="/Users/mariamaturi/Downloads/PAWAY | Teaser cinematico.mp4" ./scripts/install-teaser.sh' >&2
  exit 1
fi

command -v ffmpeg >/dev/null || { echo "ffmpeg richiesto." >&2; exit 1; }

cp -f "$SOURCE" "$DEST"
ffmpeg -y -ss 2 -i "$DEST" -frames:v 1 -q:v 80 "$POSTER" >/dev/null 2>&1

echo "Video: $DEST ($(du -h "$DEST" | cut -f1))"
echo "Poster: $POSTER ($(du -h "$POSTER" | cut -f1))"
ffprobe -v error -show_entries format=duration,size -of default=noprint_wrappers=1 "$DEST"
