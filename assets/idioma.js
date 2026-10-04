// lembra o idioma escolhido no seletor; na página raiz (português), quem já escolheu outro idioma vai direto para ele.
(function(){
  var chave='offnets-idioma', atual=document.documentElement.lang.slice(0,2).toLowerCase();
  document.querySelectorAll('.idiomas a').forEach(function(a){
    a.addEventListener('click',function(){ try{ localStorage.setItem(chave,a.dataset.lingua); }catch(e){} });
  });
  try{
    var salvo=localStorage.getItem(chave);
    if(atual==='pt' && salvo && salvo!=='pt' && /^(en|es|fr|zh|hi|ar)$/.test(salvo) && !location.hash){ location.replace(salvo+'/'); }
  }catch(e){}
})();
