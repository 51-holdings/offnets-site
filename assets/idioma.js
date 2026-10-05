// lembra o idioma escolhido no seletor; só na raiz (português, offnets.org/), quem já escolheu outro idioma vai direto para ele.
(function(){
  var chave='offnets-idioma', atual=document.documentElement.lang.slice(0,2).toLowerCase();
  document.querySelectorAll('.idiomas a').forEach(function(a){
    a.addEventListener('click',function(){ try{ localStorage.setItem(chave,a.dataset.lingua); }catch(e){} });
  });
  var d=document.querySelector('.idiomas .mais');
  if(d){
    document.addEventListener('click',function(e){ if(d.open && !d.contains(e.target)) d.open=false; });
    document.addEventListener('keydown',function(e){ if(e.key==='Escape' && d.open){ d.open=false; d.querySelector('summary').focus(); } });
  }
  try{
    var salvo=localStorage.getItem(chave), raiz=/^\/(index\.html)?$/.test(location.pathname);
    if(raiz && atual==='pt' && salvo && salvo!=='pt' && /^(en|es|fr|zh|hi|ar)$/.test(salvo) && !location.hash){ location.replace(salvo+'/'); }
  }catch(e){}
})();
