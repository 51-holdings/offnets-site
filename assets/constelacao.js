// constelação: três cérebros (pessoa, empresa, comunidade), cada um com seus nós; só os nós liberados (verdes) se ligam
// entre cérebros, por fios tracejados. Um pacote percorre devagar a ponte, e para quem pede movimento reduzido nada se move.
(function(){
  var s=document.getElementById('constelacao'); if(!s) return;
  var NS='http://www.w3.org/2000/svg', W=1000, rtl=document.documentElement.dir==='rtl';
  var calmo=window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function X(x){return rtl?W-x:x}
  function el(t,a){var e=document.createElementNS(NS,t);for(var k in a)e.setAttribute(k,a[k]);s.appendChild(e);return e}
  // [x,y,liberado?]
  var C=[
    [[70,120],[110,78],[150,132],[118,170],[176,92],[205,140,1]],                                   // pessoa
    [[400,70],[436,48],[430,96],[500,150],[532,128],[510,186],[574,70],[606,92],[580,112,1],[470,110,1]], // empresa
    [[790,60],[830,118],[862,70],[900,140],[940,92],[812,178],[870,196],[930,186],[760,130,1],[958,40]]    // comunidade
  ];
  var A=[
    [[0,1],[1,2],[2,3],[1,4],[4,2],[4,5],[2,5]],
    [[0,1],[1,2],[0,2],[3,4],[4,5],[3,5],[6,7],[7,8],[6,8],[2,9],[9,3],[9,8],[1,6]],
    [[0,2],[2,4],[1,3],[3,7],[5,6],[1,5],[4,9],[0,8],[8,1],[6,7],[2,1]]
  ];
  var d=0;
  C.forEach(function(ns,c){A[c].forEach(function(p){el('line',{'class':'fio',x1:X(ns[p[0]][0]),y1:ns[p[0]][1],x2:X(ns[p[1]][0]),y2:ns[p[1]][1],style:'animation-delay:'+(c*.25)+'s'})})});
  // pontes entre cérebros: só nós liberados
  var P=[[C[0][5],C[1][9]],[C[1][8],C[2][8]]], caminhos=[];
  P.forEach(function(p,i){
    var a=p[0],b=p[1],mx=(a[0]+b[0])/2,my=Math.min(a[1],b[1])-34;
    var dd='M'+X(a[0])+' '+a[1]+' Q'+X(mx)+' '+my+' '+X(b[0])+' '+b[1];
    el('path',{'class':'ponte',d:dd,fill:'none',style:'animation-delay:'+(.9+i*.3)+'s'}); caminhos.push(dd);
  });
  C.forEach(function(ns,c){ns.forEach(function(n){el('circle',{'class':'no'+(n[2]?' s':''),cx:X(n[0]),cy:n[1],r:n[2]?5.5:3.6,style:'animation-delay:'+(c*.25+.2)+'s'})})});
  if(!calmo){
    caminhos.forEach(function(dd,i){
      var p=el('circle',{'class':'pacote',r:2.6,visibility:'hidden'});
      var v=document.createElementNS(NS,'set');v.setAttribute('attributeName','visibility');v.setAttribute('to','visible');v.setAttribute('begin',(2.5+i*4.5)+'s');p.appendChild(v);
      var m=document.createElementNS(NS,'animateMotion');
      m.setAttribute('path',dd);m.setAttribute('dur','9s');m.setAttribute('begin',(2.5+i*4.5)+'s');m.setAttribute('repeatCount','indefinite');
      m.setAttribute('keyPoints','0;1;1');m.setAttribute('keyTimes','0;.35;1');m.setAttribute('calcMode','linear');
      p.appendChild(m);
    });
  }
})();
// revelar seções ao rolar (só com JS; o CSS desliga com movimento reduzido)
(function(){
  var els=document.querySelectorAll('.rev');
  if(!('IntersectionObserver' in window)){els.forEach(function(e){e.classList.add('vista')});return}
  var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('vista');io.unobserve(e.target)}})},{rootMargin:'0px 0px -8% 0px'});
  els.forEach(function(e){io.observe(e)});
})();
