#!/usr/bin/env bash
# Recria o diretório de trabalho do protótipo a partir deste repositório.
#   uso: ./restore.sh [destino]        (padrão: /home/claude/mepaguei)
set -e
DEST="${1:-/home/claude/mepaguei}"
REPO="$(cd "$(dirname "$0")" && pwd)"
mkdir -p "$DEST"
cp -r "$REPO/source/." "$DEST/"          # src/ + scripts + package.json + vendor-icons/
cp -r "$REPO/assets"   "$DEST/"          # assets são os mesmos do build publicado
cp "$REPO"/CLAUDE.md "$REPO"/prd.md "$REPO"/design.md "$DEST/"
echo "Fonte restaurado em: $DEST"
echo "Próximo passo:  cd $DEST && python3 build.py"
echo "(os ícones vêm de vendor-icons/; só rode 'npm install' se precisar de um ícone novo)"
