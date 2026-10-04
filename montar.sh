#!/bin/bash
# Monta o site público offnets.org em 5 línguas. Fonte: src/<lingua>.html (linha 1 = título, linha 2 = descrição, resto = corpo,
# com {{IDIOMAS}} onde entra o seletor). Saída: index.html (pt), en/, es/, fr/, zh/ — cada uma com hreflang para as outras.
set -euo pipefail
cd "$(dirname "$0")"
python3 - <<'PY'
import os, re
SITE = "https://offnets.org"
ATUAL = ' aria-current="true"'
L = [  # código, pasta, html lang, bandeira, rótulo
  ("pt", "",    "pt-BR",   "🇧🇷", "PT"),
  ("en", "en/", "en",      "🇺🇸", "EN"),
  ("es", "es/", "es",      "🇪🇸", "ES"),
  ("fr", "fr/", "fr",      "🇫🇷", "FR"),
  ("zh", "zh/", "zh-Hans", "🇨🇳", "中文"),
]
for cod, pasta, lang, _, _ in L:
    src = open(f"src/{cod}.html", encoding="utf-8").read().split("\n", 2)
    titulo = re.search(r"titulo:\s*(.*?)\s*-->", src[0]).group(1)
    descr = re.search(r"descricao:\s*(.*?)\s*-->", src[1]).group(1)
    corpo = src[2]
    raiz = "../" if pasta else ""
    seletor = '<nav class="idiomas" aria-label="Idioma / Language">' + "".join(
        f'<a href="{raiz}{p}" hreflang="{lg}" lang="{lg}"{ATUAL if c == cod else ""} data-lingua="{c}">'
        f'<span class="bandeira" aria-hidden="true">{b}</span>{r}</a>' for c, p, lg, b, r in L) + "</nav>"
    alternos = "\n".join(f'<link rel="alternate" hreflang="{lg}" href="{SITE}/{p}">' for c, p, lg, b, r in L)
    pagina = f"""<!doctype html>
<html lang="{lang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>{titulo}</title>
<meta name="description" content="{descr}">
<link rel="canonical" href="{SITE}/{pasta}">
{alternos}
<link rel="alternate" hreflang="x-default" href="{SITE}/en/">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Newsreader:opsz,wght@6..72,400;6..72,500;6..72,700&family=IBM+Plex+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap">
<link rel="stylesheet" href="{raiz}assets/site.css">
</head>
<body>
{corpo.replace("{{IDIOMAS}}", seletor)}
<script src="{raiz}assets/constelacao.js"></script>
<script src="{raiz}assets/idioma.js"></script>
</body>
</html>
"""
    if pasta: os.makedirs(pasta, exist_ok=True)
    open(f"{pasta}index.html", "w", encoding="utf-8").write(pagina)
    print(f"{pasta or '/'}index.html  {lang}  {len(pagina)} bytes")
PY
echo "offnets.org" > CNAME
touch .nojekyll
