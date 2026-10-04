#!/bin/bash
# Monta o site público offnets.org: src/pagina.html (o mesmo arquivo do rascunho no claude.ai) vira um documento completo em index.html.
set -euo pipefail
cd "$(dirname "$0")"
{ printf '<!doctype html>\n<html lang="pt-BR">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n'
  awk '/^<\/style>/{print; exit} {print}' src/pagina.html
  printf '</head>\n<body>\n'
  awk 'f{print} /^<\/style>/{f=1}' src/pagina.html
  printf '</body>\n</html>\n'; } > index.html
echo "offnets.org" > CNAME
touch .nojekyll
echo "index.html montado ($(wc -c < index.html) bytes)"
