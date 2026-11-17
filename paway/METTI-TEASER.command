#!/bin/bash
# Copia il teaser da Download nel sito e rigenera il poster.
cd "$(dirname "$0")"
SOURCE="${SOURCE:-/Users/mariamaturi/Downloads/PAWAY | Teaser cinematico.mp4}"
export SOURCE
chmod +x scripts/install-teaser.sh 2>/dev/null
./scripts/install-teaser.sh "$SOURCE"
