# offnets.org

Site público do Offnets em sete línguas: português (raiz), inglês, espanhol, francês, chinês simplificado, hindi e árabe (da direita para a esquerda).

Três páginas por língua, separando ENTENDER de ESTUDAR:
- a home (12 seções: da tese à entrada por convite);
- `manifesto/`: o manifesto inteiro e a origem;
- `constituicao/` (pt) ou `constitution/` (demais): a Constituição completa, artigo por artigo (âncoras `#art-1` … `#art-15`).

Fonte:
- `src/<lingua>/`: `topo.html`, `rodape.html`, `home.html`, `manifesto.html`, `constituicao.html` (o português é a fonte; as outras línguas são traduções dela).
- `src/_svg/`: desenhos sem texto, iguais em todas as línguas, incluídos pelo marcador `{{SVG:nome}}`.
- `assets/`: estilo, constelação (com revelar-ao-rolar, que respeita movimento reduzido) e o script que lembra o idioma escolhido.
- `./montar.sh` gera tudo, com hreflang entre as versões da mesma página e x-default em inglês, o `CNAME` e o `.nojekyll`. Falha se sobrar algum marcador `{{...}}`.
- Publicado pelo GitHub Pages a partir da branch `main`.

Nada aqui guarda conhecimento de cérebro nenhum: é só a página pública.
