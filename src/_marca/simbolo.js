const NS="http://www.w3.org/2000/svg";const MS=document.createElementNS(NS,"svg");document.body.appendChild(MS);
const smooth=t=>{t=Math.max(0,Math.min(1,t));return t*t*(3-2*t)};
function prog(d,{p=9.5,dmin=.42,l0=.3,l1=.6}={}){const el=document.createElementNS(NS,"path");el.setAttribute("d",d);MS.appendChild(el);const L=el.getTotalLength(),a=[];for(let pos=0;pos<L;pos+=p){const t=smooth((pos/L-l0)/(l1-l0));let du=dmin+(1-dmin)*t;if(du>.96)du=1;a.push((p*du).toFixed(2),(p*(1-du)).toFixed(2))}el.remove();return a.join(" ")}
const LL="A16 16 0 0 1 22 66A14 14 0 0 1 14 42A15 15 0 0 1 24 20A16 16 0 0 1 46 17",LR="A16 16 0 0 0 78 66A14 14 0 0 0 86 42A15 15 0 0 0 76 20A16 16 0 0 0 54 17";
const MAIN=`M50 71A6 6 0 0 0 46 77${LL}A6 6 0 0 0 50 23L50 71A6 6 0 0 1 54 77${LR}A6 6 0 0 1 50 23`;
const GL=["M21 47A13 13 0 0 1 38 50","M38 25A13 13 0 0 1 35 41"],GR=["M79 47A13 13 0 0 0 62 50","M62 25A13 13 0 0 0 65 41"];
const DASH=prog(MAIN);
// on/of: cores das metades (CSS var no site; cor fixa nos arquivos de imagem)
function brain(g,{on="var(--brain-on)",of="var(--roxo)",shimmer=false}={}){
  return `<defs><linearGradient id="${g}" gradientUnits="userSpaceOnUse" x1="34" y1="0" x2="66" y2="0"><stop offset="0" style="stop-color:${on}"/><stop offset="1" style="stop-color:${of}"/></linearGradient></defs>`+
  `<path d="${MAIN}" fill="none" stroke="url(#${g})" stroke-width="6.2" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="${DASH}"/>`+
  `<g fill="none" stroke-linecap="round" stroke-width="4.4">${GL.map(d=>`<path d="${d}" stroke="${on}" stroke-dasharray="5 5"/>`).join("")}${GR.map(d=>`<path d="${d}" stroke="${of}"/>`).join("")}</g>`+
  (shimmer?`<path class="brilho" d="${MAIN}" pathLength="100" fill="none" stroke="#fff" stroke-width="2.6" stroke-linecap="round"/>`:"");
}
const DASHG=prog(MAIN,{p:12,dmin:.45});
function glyph(){return `<path d="${MAIN}" fill="none" stroke="currentColor" stroke-width="9" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="${DASHG}"/>`+
  `<path d="${GL[0]}" fill="none" stroke="currentColor" stroke-opacity=".8" stroke-width="7" stroke-linecap="round" stroke-dasharray="7 6"/><path d="${GR[0]}" fill="none" stroke="currentColor" stroke-width="7" stroke-linecap="round"/>`}
// ícone do app em metal (Manual, p. 12): Alumínio escovado ou Titânio, grade de ícone do macOS
function appIcon(mode){const al=mode==="al";
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="100 100 824 824" width="100%" height="100%"><defs>
  <linearGradient id="ig" x1="0" y1="0" x2="1" y2="1">${al?'<stop offset="0" stop-color="#f6f7f8"/><stop offset=".55" stop-color="#cfd2d7"/><stop offset="1" stop-color="#e7e9ec"/>':'<stop offset="0" stop-color="#34353a"/><stop offset=".6" stop-color="#141416"/><stop offset="1" stop-color="#232428"/>'}</linearGradient>
  <filter id="tb" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="0.002 0.55" numOctaves="2" seed="4"/><feColorMatrix values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 ${al?.22:.06} 0"/></filter>
  <clipPath id="cl"><rect x="100" y="100" width="824" height="824" rx="185.4"/></clipPath></defs>
  <rect x="100" y="100" width="824" height="824" rx="185.4" fill="url(#ig)"/>
  <rect x="100" y="100" width="824" height="824" clip-path="url(#cl)" filter="url(#tb)"/>
  <rect x="101" y="101" width="822" height="822" rx="184.4" fill="none" stroke="${al?'rgba(255,255,255,.7)':'rgba(255,255,255,.08)'}" stroke-width="2"/>
  <g transform="translate(512 518) scale(6.1) translate(-50 -47)">${brain("pi",{on:"#8b8e96",of:al?"#5a3fc0":"#a99bf2"})}</g></svg>`}
