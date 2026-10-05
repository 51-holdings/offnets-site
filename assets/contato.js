/* Offnets · contato.js — link de e-mail que funciona para todo mundo.
   Um "mailto:" sozinho não faz nada quando a pessoa não tem app de e-mail configurado (quem usa Gmail ou Outlook
   no navegador). Ao clicar, abre um menu pequeno: Gmail · Outlook · app de e-mail · copiar endereço.
   Sem JavaScript, o link continua sendo mailto: comum. */
(function () {
  var T = {
    pt: { gmail: "Abrir no Gmail", outlook: "Abrir no Outlook", app: "App de e-mail", copiar: "Copiar endereço", copiado: "Copiado ✓", titulo: "Escrever para" },
    en: { gmail: "Open in Gmail", outlook: "Open in Outlook", app: "Mail app", copiar: "Copy address", copiado: "Copied ✓", titulo: "Write to" },
    es: { gmail: "Abrir en Gmail", outlook: "Abrir en Outlook", app: "App de correo", copiar: "Copiar dirección", copiado: "Copiado ✓", titulo: "Escribir a" },
    fr: { gmail: "Ouvrir dans Gmail", outlook: "Ouvrir dans Outlook", app: "App de messagerie", copiar: "Copier l’adresse", copiado: "Copié ✓", titulo: "Écrire à" },
    zh: { gmail: "在 Gmail 中打开", outlook: "在 Outlook 中打开", app: "邮件应用", copiar: "复制地址", copiado: "已复制 ✓", titulo: "写信给" },
    hi: { gmail: "Gmail में खोलें", outlook: "Outlook में खोलें", app: "ईमेल ऐप", copiar: "पता कॉपी करें", copiado: "कॉपी हो गया ✓", titulo: "लिखें" },
    ar: { gmail: "افتح في Gmail", outlook: "افتح في Outlook", app: "تطبيق البريد", copiar: "انسخ العنوان", copiado: "تم النسخ ✓", titulo: "اكتب إلى" }
  };
  var lang = (document.documentElement.lang || "pt").slice(0, 2);
  var t = T[lang] || T.en;
  var aberto = null;

  function fechar() {
    if (!aberto) return;
    var dono = aberto.dono; aberto.remove(); aberto = null;
    if (dono) dono.setAttribute("aria-expanded", "false");
  }
  function partes(href) {
    var u = href.replace(/^mailto:/i, ""), q = "", i = u.indexOf("?");
    if (i >= 0) { q = u.slice(i + 1); u = u.slice(0, i); }
    var assunto = "";
    q.split("&").forEach(function (kv) { var p = kv.split("="); if (p[0].toLowerCase() === "subject") assunto = decodeURIComponent(p[1] || ""); });
    return { para: decodeURIComponent(u), assunto: assunto };
  }
  function item(rotulo, href, acao) {
    var a = document.createElement(href ? "a" : "button");
    a.className = "contato-opcao"; a.textContent = rotulo;
    if (href) { a.href = href; if (/^https:/.test(href)) { a.target = "_blank"; a.rel = "noopener"; } a.addEventListener("click", function () { setTimeout(fechar, 50); }); }
    else { a.type = "button"; a.addEventListener("click", acao); }
    return a;
  }
  function copiar(texto, botao) {
    function ok() { botao.textContent = t.copiado; setTimeout(fechar, 900); }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(texto).then(ok, function () { selecionar(); });
    } else { selecionar(); }
    function selecionar() {
      var c = document.createElement("input"); c.value = texto; c.setAttribute("readonly", ""); c.className = "contato-copia";
      botao.replaceWith(c); c.focus(); c.select();
    }
  }
  function abrir(link) {
    fechar();
    var d = partes(link.getAttribute("href"));
    var m = document.createElement("div");
    m.className = "contato-menu"; m.setAttribute("role", "menu"); m.dono = link;
    var cab = document.createElement("div"); cab.className = "contato-para"; cab.textContent = t.titulo + " " + d.para; m.appendChild(cab);
    var su = encodeURIComponent(d.assunto), to = encodeURIComponent(d.para);
    m.appendChild(item(t.gmail, "https://mail.google.com/mail/?view=cm&fs=1&to=" + to + "&su=" + su));
    m.appendChild(item(t.outlook, "https://outlook.office.com/mail/deeplink/compose?to=" + to + "&subject=" + su));
    m.appendChild(item(t.app, link.getAttribute("href")));
    var b = item(t.copiar, null, function () { copiar(d.para, b); }); m.appendChild(b);
    document.body.appendChild(m);
    var r = link.getBoundingClientRect(), w = m.offsetWidth, h = m.offsetHeight;
    var x = Math.min(Math.max(8, r.left + window.scrollX), window.scrollX + document.documentElement.clientWidth - w - 8);
    var y = r.bottom + window.scrollY + 6;
    if (r.bottom + h + 12 > window.innerHeight && r.top - h - 6 > 0) y = r.top + window.scrollY - h - 6;
    m.style.left = x + "px"; m.style.top = y + "px";
    link.setAttribute("aria-expanded", "true");
    aberto = m;
    var primeiro = m.querySelector(".contato-opcao"); if (primeiro) primeiro.focus();
  }
  document.addEventListener("click", function (e) {
    var a = e.target.closest && e.target.closest('a[href^="mailto:"]');
    if (a && !a.closest(".contato-menu")) { e.preventDefault(); if (aberto && aberto.dono === a) fechar(); else abrir(a); return; }
    if (aberto && !aberto.contains(e.target)) fechar();
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && aberto) { var d = aberto.dono; fechar(); if (d) d.focus(); }
  });
  window.addEventListener("resize", fechar);
  document.querySelectorAll('a[href^="mailto:"]').forEach(function (a) { a.setAttribute("aria-haspopup", "menu"); a.setAttribute("aria-expanded", "false"); });
})();
