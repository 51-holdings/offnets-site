// constelação: nós ligados, desenhados uma vez (sem animação contínua)
(function(){
  var s=document.getElementById('constelacao'), NS='http://www.w3.org/2000/svg';
  var n=[[30,80],[95,38],[150,92],[215,52],[280,96],[340,30],[400,74],[460,40],[520,92],[585,56],[650,84]];
  var e=[[0,1],[1,2],[1,3],[2,4],[3,5],[4,6],[5,6],[6,7],[7,8],[7,9],[8,10],[9,10],[3,4]];
  e.forEach(function(p){var l=document.createElementNS(NS,'line');l.setAttribute('class','fio');l.setAttribute('x1',n[p[0]][0]);l.setAttribute('y1',n[p[0]][1]);l.setAttribute('x2',n[p[1]][0]);l.setAttribute('y2',n[p[1]][1]);s.appendChild(l);});
  n.forEach(function(p,i){var c=document.createElementNS(NS,'circle');c.setAttribute('class','no'+(i===5?' s':''));c.setAttribute('cx',p[0]);c.setAttribute('cy',p[1]);c.setAttribute('r',i===5?6:4);s.appendChild(c);});
})();
