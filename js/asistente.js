/* ============================================================
   ASISTENTE TOKI (sin IA)
   Responde con botones y palabras clave. Para agendar, junta los
   datos y abre WhatsApp con el mensaje listo.
   Para cambiar respuestas, edita el objeto R y la lista INTENTOS.
   ============================================================ */
(function () {
  var T = window.TOKI || {};
  var WA = /^\d{12,13}$/.test(T.whatsapp || "") ? T.whatsapp : "";
  var waUrl = function (msg) { return "https://wa.me/" + WA + "?text=" + encodeURIComponent(msg); };

  // ---------- Respuestas ----------
  var MENU = ["¿Qué es Toki?", "Servicios", "Precios", "Cómo funciona", "Agendar visita", "Hablar con alguien"];

  var R = {
    hola: {
      t: ["¡Hola! Soy el asistente de Toki 👋", "Te ayudo con dudas sobre nuestros stickers NFC, precios y visitas. ¿Qué te gustaría saber?"],
      c: MENU
    },
    que: {
      t: ["Toki instala stickers con tecnología NFC en tu negocio. Tus clientes acercan el celular y en un segundo dejan su reseña en Google, se conectan a tu Wi-Fi o ven tu menú. Sin apps y sin escanear nada.",
          "Diseñamos con tu marca, programamos, instalamos en tu local y damos seguimiento. Estamos en Morelia y atendemos todo tipo de negocios."],
      c: ["Servicios", "Precios", "Agendar visita"]
    },
    servicios: {
      t: ["Esto es lo que activamos en tu negocio:",
          "⭐ Reseñas de Google y Wi-Fi al instante con stickers NFC.\n📱 Mini web: tu negocio en una página con WhatsApp, ubicación, horarios y redes.\n🍽️ Menú digital: tu menú en el celular de tus clientes, sin reimprimir."],
      c: ["Precios", "Convertir lo que ya tengo", "Agendar visita"]
    },
    precios: {
      t: ["Plan Esencial: $200 MXN. Incluye 8 stickers NFC de 7 cm con tu marca, programación e instalación. Cada sticker adicional cuesta $35.",
          "La Mini web y el Menú digital se cotizan según la información que lleven. Te los cotiza alguien del equipo por WhatsApp."],
      c: ["Agendar visita", "Cotizar Mini web o Menú", "Cómo funciona"]
    },
    como: {
      t: ["Es así de fácil:\n1. Diseñamos tus stickers con tu logo y colores.\n2. Los programamos y los instalamos en tu local.\n3. Tus clientes acercan el celular y llegan directo a tu reseña, Wi-Fi o menú."],
      c: ["¿Funciona con iPhone?", "Precios", "Agendar visita"]
    },
    celular: {
      t: ["Sí, funciona en iPhone y en la mayoría de los Android con NFC. No necesitan descargar ninguna app; en Android solo debe estar activado el NFC (casi siempre viene encendido).",
          "Si algún celular no tiene NFC, podemos agregar un código QR al sticker."],
      c: ["Precios", "Agendar visita", "Más preguntas"]
    },
    convertir: {
      t: ["La etiqueta NFC es muy delgada y se pega a casi cualquier superficie: portarretratos, servilleteros, cuadros, mostradores o pósteres. Le damos un toque inteligente a lo que ya tienes.",
          "Sobre metal se usa una etiqueta especial; te lo decimos al visitarte."],
      c: ["Precios", "Agendar visita"]
    },
    mas: {
      t: ["Otras dudas frecuentes:"],
      c: ["¿Necesita batería?", "¿Funciona sobre metal?", "¿Puedo cambiar el enlace?", "¿Dónde trabajan?", "Menú principal"]
    },
    bateria: { t: ["No. La etiqueta toma la energía del celular al acercarlo. No se descarga ni necesita mantenimiento."], c: ["Más preguntas", "Agendar visita"] },
    metal: { t: ["Sobre madera, vidrio, plástico, papel y acrílico funciona directo. Sobre metal se necesita una etiqueta especial; si tu mobiliario es metálico, te lo decimos al visitarte."], c: ["Más preguntas", "Agendar visita"] },
    enlace: { t: ["Sí. Si cambias tu Wi-Fi, tu menú o tu enlace, nosotros lo actualizamos sin que compres stickers nuevos."], c: ["Más preguntas", "Agendar visita"] },
    zona: { t: ["Estamos en Morelia, Michoacán, e instalamos en tu local. La atención es solo con cita."], c: ["Agendar visita", "Menú principal"] },
    horario: {
      t: ["Atendemos solo con cita. Las visitas a tu negocio se agendan de lunes a viernes de 9:00 a 18:00 y sábados de 16:00 a 20:00.",
          "Por WhatsApp te respondemos a cualquier hora."],
      c: ["Agendar visita", "Hablar con alguien"]
    },
    cotizar: {
      t: ["La Mini web y el Menú digital dependen de cuánta información lleven. Escríbenos por WhatsApp y te mandamos tu cotización."],
      wa: "Hola, Toki Tap. Me gustaría cotizar la Mini web o el Menú digital para mi negocio.",
      c: ["Agendar visita", "Menú principal"]
    },
    humano: {
      t: ["Claro. Escríbenos por WhatsApp: te responde nuestro asistente al momento, y si lo pides, una persona del equipo."],
      wa: T.whatsappInfo || "Hola, Toki Tap. Me gustaría recibir información.",
      c: ["Menú principal"]
    },
    gracias: { t: ["¡Con gusto! Si necesitas algo más, aquí estoy."], c: ["Menú principal", "Agendar visita"] },
    nose: {
      t: ["Mmm, no estoy seguro de haber entendido 🤔", "Puedes elegir una opción o escribirnos por WhatsApp y te ayudamos."],
      wa: T.whatsappInfo || "Hola, Toki Tap. Tengo una duda.",
      c: MENU
    }
  };

  // Botón → respuesta
  var CHIPS = {
    "¿Qué es Toki?": "que", "Servicios": "servicios", "Precios": "precios", "Cómo funciona": "como",
    "Agendar visita": "_agendar", "Hablar con alguien": "humano", "Convertir lo que ya tengo": "convertir",
    "¿Funciona con iPhone?": "celular", "Más preguntas": "mas", "¿Necesita batería?": "bateria",
    "¿Funciona sobre metal?": "metal", "¿Puedo cambiar el enlace?": "enlace", "¿Dónde trabajan?": "zona",
    "Cotizar Mini web o Menú": "cotizar", "Menú principal": "hola"
  };

  // Palabras clave → respuesta (se revisan en orden)
  var INTENTOS = [
    ["_agendar", ["agendar", "agenda", "cita", "visita", "visiten", "contratar", "quiero el", "me interesa"]],
    ["humano", ["persona", "humano", "asesor", "hablar con", "llamar", "telefono", "numero", "whatsapp", "contacto"]],
    ["cotizar", ["cotiza", "cotizacion", "mini web", "pagina web", "sitio web", "menu digital"]],
    ["precios", ["precio", "costo", "cuesta", "cuanto", "cobran", "tarifa", "plan", "esencial", "barato", "caro", "$"]],
    ["celular", ["iphone", "android", "samsung", "celular", "telefono", "compatible", "app", "aplicacion", "descargar", "qr"]],
    ["bateria", ["bateria", "pila", "carga", "energia", "corriente"]],
    ["metal", ["metal", "metalico", "aluminio", "superficie"]],
    ["enlace", ["cambiar", "actualizar", "modificar", "editar", "contrasena"]],
    ["convertir", ["portarretrato", "servilletero", "cuadro", "poster", "mostrador", "objeto", "pegar"]],
    ["horario", ["horario", "hora", "abren", "cierran", "dias", "sabado", "domingo"]],
    ["zona", ["donde", "zona", "morelia", "ubicacion", "direccion", "domicilio", "ciudad"]],
    ["como", ["como funciona", "funciona", "proceso", "pasos", "instalan", "nfc", "sticker", "etiqueta"]],
    ["servicios", ["servicio", "ofrecen", "hacen", "venden", "producto", "resena", "google", "wifi", "wi-fi", "menu"]],
    ["que", ["que es", "quienes son", "toki"]],
    ["gracias", ["gracias", "grax", "excelente", "perfecto", "genial"]],
    ["hola", ["hola", "buenas", "buenos dias", "buenas tardes", "hey", "menu principal", "inicio", "opciones"]]
  ];

  var norm = function (s) {
    return String(s).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[¿?¡!.,]/g, " ").replace(/\s+/g, " ").trim();
  };
  var detectar = function (txt) {
    // Cada palabra clave debe empezar una palabra ("cita" no debe coincidir con "necesita")
    var n = " " + norm(txt) + " ";
    for (var i = 0; i < INTENTOS.length; i++) {
      var ws = INTENTOS[i][1];
      for (var j = 0; j < ws.length; j++) if (n.indexOf(" " + norm(ws[j]) ) !== -1 || ws[j] === "$" && n.indexOf("$") !== -1) return INTENTOS[i][0];
    }
    return "nose";
  };

  // ---------- Flujo para agendar ----------
  var TIPOS = ["Restaurante o cafetería", "Tienda", "Estética o barbería", "Consultorio", "Taller", "Otro"];
  var INTERES = ["Reseñas de Google", "Wi-Fi", "Mini web", "Menú digital", "Aún no sé"];
  var PASOS = [
    { k: "nombre", q: "¡Perfecto! Te ayudo a pedir tu visita. ¿Cuál es tu nombre?" },
    { k: "negocio", q: "Mucho gusto, {nombre}. ¿Cómo se llama tu negocio?" },
    { k: "tipo", q: "¿Qué tipo de negocio es?", c: TIPOS },
    { k: "interes", q: "¿Qué te interesa activar?", c: INTERES },
    { k: "cuando", q: "¿Qué día y hora te acomoda para la visita? Agendamos de lunes a viernes de 9:00 a 18:00 y sábados de 16:00 a 20:00.", c: ["Lo antes posible", "Esta semana", "La próxima semana"] }
  ];
  var flujo = null; // { paso, datos }

  // ---------- Interfaz ----------
  var root = document.createElement("div");
  root.className = "tk";
  root.innerHTML =
    '<button class="tk-launch" type="button" aria-label="Abrir asistente de Toki" aria-expanded="false">' +
      '<svg viewBox="0 0 24 24" class="tk-ico-open"><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3h11A2.5 2.5 0 0 1 20 5.5v8a2.5 2.5 0 0 1-2.5 2.5H10l-4.5 4v-4A2.5 2.5 0 0 1 4 13.5z"/><path d="M8.5 9.5h.01M12 9.5h.01M15.5 9.5h.01" stroke-width="2.6"/></svg>' +
      '<svg viewBox="0 0 24 24" class="tk-ico-close"><path d="M6 6l12 12M18 6L6 18"/></svg>' +
    '</button>' +
    '<div class="tk-hint" hidden>¿Dudas? Pregúntame 👋</div>' +
    '<section class="tk-panel" role="dialog" aria-label="Asistente de Toki" hidden>' +
      '<header class="tk-head">' +
        '<img src="assets/logo-light.svg" alt="" width="34" height="34">' +
        '<div><strong>Asistente Toki</strong><span>Respuestas al instante</span></div>' +
        '<button class="tk-x" type="button" aria-label="Cerrar">×</button>' +
      '</header>' +
      '<div class="tk-log" aria-live="polite"></div>' +
      '<div class="tk-chips"></div>' +
      '<form class="tk-form" autocomplete="off">' +
        '<input class="tk-in" type="text" maxlength="200" placeholder="Escribe tu pregunta…" aria-label="Escribe tu pregunta">' +
        '<button class="tk-send" type="submit" aria-label="Enviar"><svg viewBox="0 0 24 24"><path d="M4 12l16-8-6 16-2.5-6.5z"/></svg></button>' +
      '</form>' +
    '</section>';
  document.body.appendChild(root);

  var launch = root.querySelector(".tk-launch");
  var panel = root.querySelector(".tk-panel");
  var log = root.querySelector(".tk-log");
  var chips = root.querySelector(".tk-chips");
  var form = root.querySelector(".tk-form");
  var input = root.querySelector(".tk-in");
  var hint = root.querySelector(".tk-hint");
  var iniciado = false;

  var scroll = function () { log.scrollTop = log.scrollHeight; };

  var burbuja = function (texto, quien) {
    var b = document.createElement("div");
    b.className = "tk-msg tk-" + quien;
    b.textContent = texto;
    log.appendChild(b);
    scroll();
    return b;
  };

  var botonWa = function (msg, etiqueta) {
    if (!WA) return;
    var a = document.createElement("a");
    a.className = "tk-wa";
    a.href = waUrl(msg);
    a.target = "_blank";
    a.rel = "noopener";
    a.textContent = etiqueta || "Escribir por WhatsApp";
    log.appendChild(a);
    scroll();
  };

  var ponerChips = function (lista) {
    chips.innerHTML = "";
    (lista || []).forEach(function (txt) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "tk-chip";
      b.textContent = txt;
      b.addEventListener("click", function () { usuario(txt, true); });
      chips.appendChild(b);
    });
    scroll(); // las opciones achican la conversación: volver a bajar
  };

  // Mensajes del asistente con una pequeña pausa de "escribiendo"
  var cola = Promise.resolve();
  var decir = function (textos, despues) {
    cola = cola.then(function () {
      return textos.reduce(function (p, t) {
        return p.then(function () {
          var esc = burbuja("", "bot");
          esc.classList.add("tk-typing");
          esc.innerHTML = "<i></i><i></i><i></i>";
          return new Promise(function (ok) {
            setTimeout(function () {
              esc.classList.remove("tk-typing");
              esc.textContent = t;
              scroll();
              ok();
            }, Math.min(350 + t.length * 6, 1100));
          });
        });
      }, Promise.resolve()).then(function () { if (despues) despues(); });
    });
  };

  var responder = function (clave) {
    if (clave === "_agendar") return iniciarAgenda();
    var r = R[clave] || R.nose;
    ponerChips([]);
    decir(r.t, function () {
      if (r.wa) botonWa(r.wa);
      ponerChips(r.c);
    });
  };

  var iniciarAgenda = function () {
    flujo = { paso: 0, datos: {} };
    preguntar();
  };

  var preguntar = function () {
    var p = PASOS[flujo.paso];
    var q = p.q.replace(/\{(\w+)\}/g, function (_, k) { return flujo.datos[k] || ""; });
    ponerChips([]);
    decir([q], function () {
      ponerChips((p.c || []).concat(["Cancelar"]));
      input.placeholder = p.c ? "Elige o escribe…" : "Escribe tu respuesta…";
      input.focus({ preventScroll: true });
    });
  };

  var terminarAgenda = function () {
    var d = flujo.datos;
    flujo = null;
    input.placeholder = "Escribe tu pregunta…";
    var msg = "Hola, Toki Tap. Quiero agendar una visita.\n" +
      "Nombre: " + d.nombre + "\nNegocio: " + d.negocio + " (" + d.tipo + ")\n" +
      "Me interesa: " + d.interes + "\nCuándo: " + d.cuando;
    ponerChips([]);
    decir(["¡Listo, " + d.nombre + "! Este es tu resumen:",
           "🏪 " + d.negocio + " · " + d.tipo + "\n✨ " + d.interes + "\n📅 " + d.cuando,
           "Toca el botón para mandarlo por WhatsApp. Ahí te confirmamos la fecha y la hora."],
      function () {
        botonWa(msg, "Enviar por WhatsApp");
        ponerChips(["Menú principal"]);
      });
  };

  var usuario = function (texto, esChip) {
    texto = String(texto).trim().slice(0, 200);
    if (!texto) return;
    burbuja(texto, "user");
    input.value = "";

    if (flujo) {
      if (norm(texto) === "cancelar") {
        flujo = null;
        input.placeholder = "Escribe tu pregunta…";
        return decir(["Sin problema, lo dejamos para después."], function () { ponerChips(MENU); });
      }
      flujo.datos[PASOS[flujo.paso].k] = texto;
      flujo.paso++;
      return flujo.paso < PASOS.length ? preguntar() : terminarAgenda();
    }

    var clave = esChip && CHIPS[texto] ? CHIPS[texto] : detectar(texto);
    responder(clave);
  };

  var abrir = function (abierto) {
    panel.hidden = !abierto;
    root.classList.toggle("tk-open", abierto);
    launch.setAttribute("aria-expanded", abierto);
    hint.hidden = true;
    if (abierto && !iniciado) { iniciado = true; responder("hola"); }
    if (abierto && window.matchMedia("(min-width: 600px)").matches) input.focus({ preventScroll: true });
  };

  launch.addEventListener("click", function () { abrir(panel.hidden); });
  root.querySelector(".tk-x").addEventListener("click", function () { abrir(false); launch.focus(); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && !panel.hidden) abrir(false); });
  form.addEventListener("submit", function (e) { e.preventDefault(); usuario(input.value, false); });

  // Cualquier enlace con data-asistente abre el asistente
  document.querySelectorAll("[data-asistente]").forEach(function (el) {
    el.addEventListener("click", function (e) { e.preventDefault(); abrir(true); });
  });

  // Aviso discreto a los 6 segundos, una sola vez
  setTimeout(function () { if (!iniciado) hint.hidden = false; }, 6000);
  hint.addEventListener("click", function () { abrir(true); });
})();
