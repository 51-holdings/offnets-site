// alternador dos dois modos da marca: Alumínio (claro) e Titânio (escuro). Sem escolha, vale o do sistema (prefers-color-scheme).
// A escolha fica só neste navegador (localStorage); o <head> a aplica antes de pintar, para não piscar.
(function(){
  var h=document.documentElement, b=document.querySelector('.tema'); if(!b) return;
  var mq=window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)');
  function escuro(){ return h.dataset.theme ? h.dataset.theme==='dark' : !!(mq && mq.matches); }
  b.addEventListener('click',function(){
    var t=escuro()?'light':'dark', sistema=mq && mq.matches ? 'dark' : 'light';
    try{
      if(t===sistema){ delete h.dataset.theme; localStorage.removeItem('offnets-tema'); }
      else{ h.dataset.theme=t; localStorage.setItem('offnets-tema',t); }
    }catch(e){ h.dataset.theme=t; }
  });
})();
