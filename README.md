# offnets.org

Site público do Offnets em sete línguas: português (raiz), inglês, espanhol, francês, chinês simplificado, hindi e árabe (da direita para a esquerda).

Quatro páginas por língua, separando ENTENDER de ESTUDAR:
- a home (13 seções: da tese à entrada por convite, com O encontro na 06);
- `manifesto/`: o manifesto inteiro e a origem;
- `constituicao/` (pt) ou `constitution/` (demais): a Constituição completa, artigo por artigo (âncoras `#art-1` … `#art-15`);
- `de-onde-vem/` (pt), `where-it-comes-from/` (en, zh, hi, ar), `de-donde-viene/` (es), `d-ou-il-vient/` (fr): os fundamentos, Aristóteles e Sandel.

Fora do `montar.sh`: `termos/` (Termos de Uso e Aviso de Privacidade, só em português), página estática editada à mão.

Fonte:
- `src/<lingua>/`: `topo.html`, `rodape.html`, `home.html`, `manifesto.html`, `constituicao.html`, `de-onde-vem.html` (o português é a fonte; as outras línguas são traduções dela).
- `src/_svg/`: desenhos sem texto, iguais em todas as línguas, incluídos pelo marcador `{{SVG:nome}}`.
- `assets/`: estilo, constelação (com revelar-ao-rolar, que respeita movimento reduzido) e o script que lembra o idioma escolhido.
- Marca (Manual de Marca v0.1, 13/10/2026): os modos Alumínio (claro) e Titânio (escuro) pelo `prefers-color-scheme`, com alternador no topo (`assets/tema.js`); a Manrope (SIL OFL 1.1) embutida em `assets/fontes/`; o símbolo R4-2, o favicon, os ícones e a imagem de compartilhamento em `assets/marca/`. Tudo isso sai de `src/_marca/` (`./src/_marca/gerar.sh`, com o Chrome), que só se roda quando a marca muda. O nome escrito usa a Manrope (proposta W1); o logotipo ainda está a decidir.
- `./montar.sh` gera tudo, com hreflang entre as versões da mesma página e x-default em inglês, o `CNAME` e o `.nojekyll`. Falha se sobrar algum marcador `{{...}}`.
- Publicado pelo GitHub Pages a partir da branch `main`.

Nada aqui guarda conhecimento de cérebro nenhum: é só a página pública.
