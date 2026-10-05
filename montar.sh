#!/bin/bash
# Monta o site público offnets.org em 7 línguas e 3 páginas por língua (entender → estudar):
#   home (a página de entender), manifesto/ (o manifesto inteiro e a origem) e constituicao/ (pt) ou constitution/ (demais).
# Fonte por língua em src/<lingua>/: topo.html, rodape.html, home.html, manifesto.html, constituicao.html.
#   Em cada página: linha 1 = <!-- titulo: ... -->, linha 2 = <!-- descricao: ... -->, resto = corpo.
#   Marcadores: {{TOPO}} {{RODAPE}} {{IDIOMAS}} {{HOME}} {{MANIFESTO}} {{CONSTITUICAO}} (links relativos à página)
#   e {{SVG:nome}} (inclui src/_svg/nome.svg, desenhos sem texto, iguais em todas as línguas).
# Saída: index.html (pt), en/ es/ fr/ zh/ hi/ ar/, com hreflang entre as versões da MESMA página e x-default = inglês.
set -euo pipefail
cd "$(dirname "$0")"
python3 - <<'PY'
import os, re, sys
SITE = "https://offnets.org"
ATUAL = ' aria-current="true"'
L = [  # código, pasta, html lang, bandeira, rótulo
  ("pt", "",    "pt-BR",   "🇧🇷", "PT"),
  ("en", "en/", "en",      "🇺🇸", "EN"),
  ("es", "es/", "es",      "🇪🇸", "Español"),
  ("fr", "fr/", "fr",      "🇫🇷", "Français"),
  ("zh", "zh/", "zh-Hans", "🇨🇳", "中文"),
  ("hi", "hi/", "hi",      "🇮🇳", "हिन्दी"),
  ("ar", "ar/", "ar",      "🇸🇦", "العربية"),
]
MAIS = {"pt": "Mais idiomas", "en": "More languages", "es": "Más idiomas", "fr": "Plus de langues", "zh": "更多语言", "hi": "और भाषाएँ", "ar": "المزيد من اللغات"}
PAGINAS = ["home", "manifesto", "constituicao"]
def slug(cod, pag):
    if pag == "home": return ""
    if pag == "manifesto": return "manifesto/"
    return "constituicao/" if cod == "pt" else "constitution/"
def caminho(cod, pag):  # pasta a partir da raiz do site, ex.: "en/constitution/"
    pasta = dict((c, p) for c, p, *_ in L)[cod]
    return pasta + slug(cod, pag)
def rel(de, para):  # link relativo de uma pasta para outra
    r = os.path.relpath(para or ".", de or ".")
    return "./" if r == "." else r + "/"
FONTE_EXTRA = {
  "hi": "Noto+Sans+Devanagari:wght@400;500;600",
  "ar": "Noto+Sans+Arabic:wght@400;500;600",
}
SVG = {f[:-4]: open(f"src/_svg/{f}", encoding="utf-8").read() for f in os.listdir("src/_svg") if f.endswith(".svg")}
def ler(cod, nome):
    return open(f"src/{cod}/{nome}.html", encoding="utf-8").read()
erros = 0
for cod, pasta, lang, _, _ in L:
    topo, rodape = ler(cod, "topo"), ler(cod, "rodape")
    for pag in PAGINAS:
        aqui = caminho(cod, pag)
        src = ler(cod, pag).split("\n", 2)
        titulo = re.search(r"titulo:\s*(.*?)\s*-->", src[0]).group(1)
        descr = re.search(r"descricao:\s*(.*?)\s*-->", src[1]).group(1)
        corpo = src[2].replace("{{TOPO}}", topo).replace("{{RODAPE}}", rodape)
        raiz = rel(aqui, "")
        DIR = ' dir="rtl"' if cod == "ar" else ""
        extra = FONTE_EXTRA.get(cod)
        fonte_extra = f'\n<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family={extra}&display=swap">' if extra else ""
        def lk(c, lg, r):
            return (f'<a href="{rel(aqui, caminho(c, pag))}" hreflang="{lg}" lang="{lg}"{ATUAL if c == cod else ""} data-lingua="{c}">{r}</a>')
        info = {c: (lg, r) for c, p, lg, b, r in L}
        fora = [c for c in ("es", "fr", "zh", "hi", "ar")]
        globo = ('<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round">'
                 '<circle cx="12" cy="12" r="9.5"/><path d="M2.5 12h19M12 2.5c2.6 2.7 3.9 5.9 3.9 9.5s-1.3 6.8-3.9 9.5c-2.6-2.7-3.9-5.9-3.9-9.5S9.4 5.2 12 2.5z"/></svg>')
        seletor = ('<nav class="idiomas" aria-label="Idioma / Language">'
            + lk("pt", *info["pt"]) + lk("en", *info["en"])
            + f'<details class="mais"{" data-atual" if cod in fora else ""}><summary aria-label="{MAIS[cod]}" title="{MAIS[cod]}">{globo}</summary><div class="menu">'
            + "".join(lk(c, *info[c]) for c in fora) + "</div></details></nav>")
        alternos = "\n".join(f'<link rel="alternate" hreflang="{lg}" href="{SITE}/{caminho(c, pag)}">' for c, p, lg, b, r in L)
        corpo = (corpo.replace("{{IDIOMAS}}", seletor)
                      .replace("{{HOME}}", rel(aqui, caminho(cod, "home")))
                      .replace("{{MANIFESTO}}", rel(aqui, caminho(cod, "manifesto")))
                      .replace("{{CONSTITUICAO}}", rel(aqui, caminho(cod, "constituicao"))))
        corpo = re.sub(r"\{\{SVG:(\w+)\}\}", lambda m: SVG[m.group(1)], corpo)
        pagina = f"""<!doctype html>
<html lang="{lang}"{DIR}>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>{titulo}</title>
<meta name="description" content="{descr}">
<meta property="og:title" content="{titulo}">
<meta property="og:description" content="{descr}">
<meta property="og:url" content="{SITE}/{aqui}">
<meta property="og:type" content="website">
<meta name="theme-color" content="#f5f6f4" media="(prefers-color-scheme: light)">
<meta name="theme-color" content="#080c0c" media="(prefers-color-scheme: dark)">
<link rel="canonical" href="{SITE}/{aqui}">
{alternos}
<link rel="alternate" hreflang="x-default" href="{SITE}/{caminho("en", pag)}">
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 22 22'%3E%3Cg fill='%230b7a66'%3E%3Ccircle cx='4' cy='15' r='2.6'/%3E%3Ccircle cx='11' cy='5' r='2.6'/%3E%3Ccircle cx='18' cy='13' r='2.6'/%3E%3C/g%3E%3Cpath d='M4 15 11 5 18 13' fill='none' stroke='%230b7a66' stroke-width='1.3'/%3E%3C/svg%3E">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Geist:wght@300..700&family=Geist+Mono:wght@400;500&display=swap">
<link rel="stylesheet" href="{raiz}assets/site.css">{fonte_extra}
<script>document.documentElement.classList.add('js')</script>
</head>
<body>
{corpo}
<script src="{raiz}assets/constelacao.js"></script>
<script src="{raiz}assets/idioma.js"></script>
</body>
</html>
"""
        if "{{" in pagina:
            print(f"ERRO: marcador sobrando em {cod}/{pag}: {set(re.findall(r'{{[^}]*}}', pagina))}", file=sys.stderr); erros += 1
        if aqui: os.makedirs(aqui, exist_ok=True)
        open(f"{aqui}index.html", "w", encoding="utf-8").write(pagina)
        print(f"/{aqui}index.html  {lang}  {len(pagina)} bytes")
sys.exit(1 if erros else 0)
PY
echo "offnets.org" > CNAME
touch .nojekyll
