/* Offnets · encontrar.js — "Quero ser encontrado" (06/10/2026). Não é fila: a pessoa se apresenta para que alguém que a
   conhece a convide. Envia para a caixa da rede (offnets.io/encontrar); nada fica neste site. */
(function () {
  var f = document.getElementById("form-encontrar"); if (!f) return;
  var aviso = document.getElementById("encontrar-aviso");
  f.addEventListener("submit", function (ev) {
    ev.preventDefault();
    var d = new FormData(f), b = f.querySelector("button[type=submit]");
    var corpo = { nome: d.get("nome"), email: d.get("email"), conhece: d.get("conhece"), comunidades: d.get("comunidades"),
      perfil_tipo: d.get("perfil_tipo") || null, perfil: d.get("perfil"), whatsapp: d.get("whatsapp"), motivo: d.get("motivo"),
      maior_de_idade: d.get("maior") === "on", consentimento: d.get("consentimento") === "on", site_url: d.get("site_url"),
      idioma: (document.documentElement.lang || "pt").slice(0, 2) };
    b.disabled = true; aviso.textContent = "Enviando…";
    fetch("https://offnets.io/encontrar", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(corpo) })
      .then(function (r) { return r.json().then(function (j) { return { st: r.status, j: j }; }); })
      .then(function (x) {
        if (x.st === 201) { f.hidden = true; aviso.innerHTML = "<strong>Pronto, " + (corpo.nome || "").replace(/[<>&]/g, "") + ".</strong> Vamos avisar as pessoas do seu círculo que você quer entrar. Se alguém te conhecer, você recebe o convite pela mão dessa pessoa."; }
        else { b.disabled = false; aviso.textContent = (x.j && x.j.faca) ? "Quase: " + x.j.faca + "." : "Não consegui enviar agora. Tente de novo em instantes."; }
      })
      .catch(function () { b.disabled = false; aviso.textContent = "Não consegui enviar agora. Tente de novo em instantes."; });
  });
})();
