(function () {
  var T = window.TOKI || {};
  var each = function (sel, fn) { document.querySelectorAll(sel).forEach(fn); };

  // Un dato cuenta como listo si existe y ya no dice "PENDIENTE"
  var ready = function (k) { return !!T[k] && String(T[k]).indexOf("PENDIENTE") === -1; };
  var hasWa = ready("whatsapp") && /^\d{12,13}$/.test(T.whatsapp);
  var hasEmail = ready("email");

  // Oculta todo lo que dependa de un dato pendiente
  each("[data-need]", function (el) {
    var k = el.dataset.need;
    if (!(k === "whatsapp" ? hasWa : ready(k))) el.hidden = true;
  });
  if (!["instagram", "facebook", "tiktok"].some(ready)) document.querySelector(".socials").hidden = true;

  var waLink = function (msg) {
    return "https://wa.me/" + T.whatsapp + "?text=" + encodeURIComponent(msg || T.whatsappMensaje || "");
  };

  // Botones de WhatsApp: si aún no hay número, llevan a la sección de contacto
  each(".js-wa", function (a) {
    if (hasWa) {
      a.href = waLink(a.dataset.msg);
      a.target = "_blank";
      a.rel = "noopener";
    } else {
      a.href = "#contacto";
    }
  });
  each(".js-wa-info", function (a) { if (hasWa) a.href = waLink(T.whatsappInfo); });
  var flotante = document.querySelector(".wa-float");
  if (!hasWa && flotante) flotante.hidden = true;

  // Sin WhatsApp ni correo: el formulario se cambia por un aviso
  var sub = document.getElementById("contact-sub");
  if (!hasWa && !hasEmail) {
    document.getElementById("form").hidden = true;
    document.getElementById("soon").hidden = false;
    sub.textContent = "Atendemos todo tipo de negocios en " + (T.ciudad || "Morelia") + ".";
  } else if (!hasWa) {
    sub.textContent = "Cuéntanos de tu negocio y te respondemos por correo con una propuesta.";
    document.querySelector("#form button").textContent = "Enviar por correo";
    document.querySelector(".form__note").textContent = "Se abrirá tu correo con el mensaje listo para enviar.";
  }
  each(".js-wa-text", function (a) {
    var n = String(T.whatsapp || "").replace(/^52/, "");
    if (/^\d{10}$/.test(n)) {
      // Lada de 2 dígitos (CDMX, Guadalajara, Monterrey): 33 1234 5678; las demás: 443 123 4567
      a.textContent = /^(33|55|81)/.test(n) ? n.replace(/(\d{2})(\d{4})(\d{4})/, "$1 $2 $3") : n.replace(/(\d{3})(\d{3})(\d{4})/, "$1 $2 $3");
    } else {
      a.textContent = n || "—";
    }
  });

  // Correo, ciudad, horario y redes
  each(".js-email", function (a) { a.href = "mailto:" + T.email; a.textContent = T.email; });
  each(".js-ciudad", function (el) { el.textContent = T.ciudad; });
  each(".js-horario", function (el) { el.textContent = T.horario; });
  each(".js-ig", function (a) { a.href = T.instagram; });
  each(".js-fb", function (a) { a.href = T.facebook; });
  each(".js-tt", function (a) { a.href = T.tiktok; });

  var y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();

  // Menú móvil
  var nav = document.querySelector(".nav");
  var toggle = document.querySelector(".nav__toggle");
  toggle.addEventListener("click", function () {
    var open = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", open);
  });
  each(".nav__links a", function (a) {
    a.addEventListener("click", function () {
      nav.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });

  // Logo: siempre regresa al inicio de la página
  each(".brand", function (a) {
    a.addEventListener("click", function (e) {
      e.preventDefault();
      nav.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
      window.scrollTo({ top: 0, behavior: "smooth" });
      if (history.replaceState) history.replaceState(null, "", location.pathname);
    });
  });

  // Formulario: arma el mensaje y abre WhatsApp
  document.getElementById("form").addEventListener("submit", function (e) {
    e.preventDefault();
    var f = new FormData(e.target);
    var msg = "Hola Toki, soy " + f.get("nombre") + " de " + f.get("negocio") +
      " (" + f.get("giro") + "). Me interesa: " + f.get("interes") + "." +
      (f.get("mensaje") ? "\n" + f.get("mensaje") : "");
    if (hasWa) window.open(waLink(msg), "_blank", "noopener");
    else location.href = "mailto:" + T.email + "?subject=" + encodeURIComponent("Quiero activar mi negocio") + "&body=" + encodeURIComponent(msg);
  });

  // Animación de aparición
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
      });
    }, { threshold: 0.12 });
    each(".sec-head, .step, .card, .plan, .why > div, .faq details, .split > div, .form", function (el) {
      el.classList.add("reveal");
      io.observe(el);
    });
  }
})();
