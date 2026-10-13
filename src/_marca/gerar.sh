#!/bin/bash
# Gera os arquivos da marca usados pelo site, a partir do Manual de Marca v0.1 (símbolo R4-2):
#   src/_svg/simbolo_topo.svg e simbolo_hero.svg (inline nas páginas, cores pelos tokens do CSS),
#   assets/marca/favicon.svg, simbolo-aluminio.svg, simbolo-titanio.svg e as imagens PNG (og.png, ícones).
# Precisa do Google Chrome. Rodar só quando a marca mudar; o ./montar.sh não depende disto.
set -euo pipefail
cd "$(dirname "$0")/../.."
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
mkdir -p assets/marca
"$CHROME" --headless=new --disable-gpu --dump-dom "file://$PWD/src/_marca/simbolo.html" 2>/dev/null | python3 -c '
import re, html, sys
s = sys.stdin.read()
dest = {"topo": "src/_svg/simbolo_topo.svg", "hero": "src/_svg/simbolo_hero.svg", "favicon": "assets/marca/favicon.svg",
        "al": "assets/marca/simbolo-aluminio.svg", "ti": "assets/marca/simbolo-titanio.svg"}
for k, v in re.findall(r"<textarea id=\"(\w+)\">(.*?)</textarea>", s, re.S):
    open(dest[k], "w", encoding="utf-8").write(html.unescape(v) + "\n"); print(dest[k])
'
foto() { "$CHROME" --headless=new --disable-gpu --hide-scrollbars --force-device-scale-factor=1 --default-background-color=00000000 \
  --window-size="$2,$3" --screenshot="$PWD/assets/marca/$1" "file://$PWD/src/_marca/imagens.html#$4" 2>/dev/null; echo "assets/marca/$1"; }
foto og.png 1200 630 og
# o Chrome headless não abre janela menor que ~500 px: fotografa em 512 e reduz com o sips do macOS
foto icone-512.png 512 512 icone
foto favicon-512.png 512 512 fav
for n in 180 192; do sips -Z $n assets/marca/icone-512.png --out assets/marca/icone-$n.png >/dev/null; echo "assets/marca/icone-$n.png"; done
sips -Z 32 assets/marca/favicon-512.png --out assets/marca/favicon-32.png >/dev/null; rm assets/marca/favicon-512.png; echo assets/marca/favicon-32.png
