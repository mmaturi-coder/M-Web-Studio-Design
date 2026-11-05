#!/usr/bin/env bash
# Avvia il sito PAWAY in locale con un server HTTP minimale (Python 3).
set -euo pipefail

cd "$(dirname "$0")"

if ! command -v python3 >/dev/null 2>&1; then
  echo "Errore: python3 non trovato."
  echo "Su Mac installalo da https://www.python.org/downloads/ oppure con Homebrew: brew install python"
  exit 1
fi

if [[ ! -f index.html ]]; then
  echo "Errore: index.html non trovato in questa cartella."
  echo "Assicurati di essere nella cartella PAWAY-presentazione (dove c'è start.sh)."
  exit 1
fi

pick_port() {
  local port="${1:-4173}"
  local max="${2:-4273}"
  while [[ "$port" -le "$max" ]]; do
    if ! python3 -c "
import socket
s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
s.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
try:
    s.bind(('127.0.0.1', $port))
except OSError:
    raise SystemExit(1)
finally:
    s.close()
" 2>/dev/null; then
      port=$((port + 1))
      continue
    fi
    echo "$port"
    return 0
  done
  echo "Errore: nessuna porta libera tra 4173 e $max." >&2
  exit 1
}

PORT="$(pick_port 4173)"

echo ""
echo "  PAWAY — server locale"
echo "  Cartella: $(pwd)"
echo ""
echo "  Apri nel browser (clicca il link o copia l'indirizzo):"
echo ""
echo "    http://localhost:${PORT}"
echo "    http://127.0.0.1:${PORT}"
echo ""
echo "  Su Mac, da un altro Terminale puoi anche fare:"
echo "    open http://localhost:${PORT}"
echo ""
echo "  Lascia questa finestra aperta finché usi il sito."
echo "  Per fermare il server: Ctrl+C"
echo ""

if [[ "$(uname -s)" == "Darwin" ]] && command -v open >/dev/null 2>&1; then
  (sleep 0.8 && open "http://localhost:${PORT}/") &
fi

exec python3 -m http.server "$PORT" --bind 127.0.0.1
