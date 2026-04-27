// ================================================================
//  script.js — Portafolio Dev_IFTS29
//  v3 — Navegación tipo SPA con transición slide
// ================================================================


// ================================================================
// NAVEGACIÓN SPA — Slide entre secciones
//
//  Cómo funciona:
//  - Solo una sección está visible a la vez (clase "seccion--activa")
//  - Al navegar, la sección actual sale deslizándose y la nueva entra
//  - La dirección del slide depende del "orden" de las secciones
//  - El historial del browser (botón Atrás) funciona con History API
//  - Cada sección (excepto sobre-mi) tiene un botón "← Volver al inicio"
// ================================================================

const ORDEN_SECCIONES = ["sobre-mi", "tarjetas", "habilidades", "peliculas", "musica", "contacto"];

let seccionActual = "sobre-mi";
let navegando = false; // bloquea clicks mientras hay animación en curso

// ── Preparar el DOM ──────────────────────────────────────────────

// Ocultamos todas las secciones excepto la inicial
ORDEN_SECCIONES.forEach((id) => {
  const sec = document.getElementById(id);
  if (!sec) return;
  sec.classList.add("seccion");
  if (id === "sobre-mi") {
    sec.classList.add("seccion--activa");
  }
});

// Agregar botón "← Inicio" a cada sección que no sea sobre-mi
ORDEN_SECCIONES.filter(id => id !== "sobre-mi").forEach((id) => {
  const sec = document.getElementById(id);
  if (!sec) return;

  const btnVolver = document.createElement("button");
  btnVolver.classList.add("btn-volver");
  btnVolver.innerHTML = `← Volver al inicio`;
  btnVolver.addEventListener("click", () => navegarA("sobre-mi"));
  sec.insertBefore(btnVolver, sec.firstChild);
});

// ── Función principal de navegación ─────────────────────────────

function navegarA(idDestino, agregarHistorial = true) {
  if (idDestino === seccionActual || navegando) return;
  navegando = true;

  const secAnterior = document.getElementById(seccionActual);
  const secNueva    = document.getElementById(idDestino);
  if (!secAnterior || !secNueva) { navegando = false; return; }

  // Determinamos la dirección: ¿el destino está "adelante" o "atrás"?
  const indiceActual  = ORDEN_SECCIONES.indexOf(seccionActual);
  const indiceDestino = ORDEN_SECCIONES.indexOf(idDestino);
  const direccion     = indiceDestino > indiceActual ? "adelante" : "atras";

  // Preparamos la sección nueva: entra desde la derecha (adelante) o izquierda (atrás)
  secNueva.classList.add("seccion--entrando", `seccion--desde-${direccion === "adelante" ? "derecha" : "izquierda"}`);
  secNueva.classList.add("seccion--activa");

  // Forzamos un reflow para que el browser "vea" el estado inicial antes de animar
  secNueva.getBoundingClientRect();

  // Arrancamos la animación: la actual sale, la nueva entra
  secAnterior.classList.add(`seccion--saliendo-${direccion === "adelante" ? "izquierda" : "derecha"}`);
  secNueva.classList.remove("seccion--entrando", "seccion--desde-derecha", "seccion--desde-izquierda");

  // Actualizamos el link activo del nav
  document.querySelectorAll(".nav__link").forEach(l => l.classList.remove("nav__link--activo"));
  const linkActivo = document.querySelector(`.nav__link[href="#${idDestino}"]`);
  if (linkActivo) linkActivo.classList.add("nav__link--activo");

  // Guardamos en el historial del browser
  if (agregarHistorial) {
    history.pushState({ seccion: idDestino }, "", `#${idDestino}`);
  }

  // Al terminar la animación limpiamos las clases
  const DURACION_MS = 450;
  setTimeout(() => {
    secAnterior.classList.remove("seccion--activa", "seccion--saliendo-izquierda", "seccion--saliendo-derecha");
    seccionActual = idDestino;
    navegando = false;

    // Scroll al tope de la sección nueva (por si el contenido es largo)
    window.scrollTo({ top: 0, behavior: "instant" });
  }, DURACION_MS);
}

// ── Interceptar clicks del nav ───────────────────────────────────

document.querySelectorAll(".nav__link").forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault(); // evitamos el scroll nativo
    const id = link.getAttribute("href").replace("#", "");
    navegarA(id);
  });
});

// Interceptar el link "Contactame" dentro de sobre-mi
document.querySelectorAll('a[href="#contacto"]').forEach(link => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    navegarA("contacto");
  });
});

// ── Botón Atrás / Adelante del browser ──────────────────────────

window.addEventListener("popstate", (e) => {
  const id = e.state?.seccion || "sobre-mi";
  navegarA(id, false); // false = no volver a pushear al historial
});

// ── Estado inicial según el hash de la URL ──────────────────────
// (por si alguien entra directo a /#musica por ejemplo)
window.addEventListener("load", () => {
  const hash = window.location.hash.replace("#", "");
  if (hash && ORDEN_SECCIONES.includes(hash) && hash !== "sobre-mi") {
    // Navegamos sin animación en la carga inicial
    const secInicial = document.getElementById("sobre-mi");
    const secDestino = document.getElementById(hash);
    secInicial.classList.remove("seccion--activa");
    secDestino.classList.add("seccion--activa");
    seccionActual = hash;
    history.replaceState({ seccion: hash }, "", `#${hash}`);
  } else {
    history.replaceState({ seccion: "sobre-mi" }, "", "#sobre-mi");
  }

  // Animación de entrada en sobre-mi
  const sobreMiContent = document.querySelector(".sobre-mi__content");
  if (sobreMiContent) {
    setTimeout(() => sobreMiContent.classList.add("visible"), 200);
  }

  // Marcar link activo inicial
  const linkInicial = document.querySelector(`.nav__link[href="#${seccionActual}"]`);
  if (linkInicial) linkInicial.classList.add("nav__link--activo");
});


// ================================================================
// FLIP DE CARDS — Sección "Proyectos"
// ================================================================

const datosCards = [
  {
    titulo: "To-Do App",
    detalle: "Gestión de tareas con filtros por estado (pendiente / completada). Datos guardados en localStorage para no perderlos al recargar.",
    tecnologias: ["HTML5", "CSS3", "JavaScript"],
    link: "#"
  },
  {
    titulo: "Portafolio Personal",
    detalle: "Este mismo sitio. Diseño responsivo, semántica HTML correcta, y ahora con JavaScript interactivo agregado.",
    tecnologias: ["HTML5", "CSS3", "JavaScript"],
    link: "#"
  },
  {
    titulo: "Próximo Proyecto",
    detalle: "En exploración. Explorando posibilidades con JavaScript y sus APIs. ¡Pronto habrá novedades!",
    tecnologias: ["JavaScript", "???"],
    link: "#"
  }
];

document.querySelectorAll(".card").forEach((card, index) => {
  const datos = datosCards[index];

  const frente = document.createElement("div");
  frente.classList.add("card__frente");
  while (card.firstChild) frente.appendChild(card.firstChild);

  const reverso = document.createElement("div");
  reverso.classList.add("card__reverso");
  reverso.innerHTML = `
    <h3 class="card__reverso-titulo">${datos.titulo}</h3>
    <p class="card__reverso-detalle">${datos.detalle}</p>
    <div class="card__reverso-tags">
      ${datos.tecnologias.map(t => `<span class="card__reverso-tag">${t}</span>`).join("")}
    </div>
    <a href="${datos.link}" class="btn btn--primary card__reverso-btn">Ver proyecto →</a>
  `;

  const contenedor = document.createElement("div");
  contenedor.classList.add("card__flip-inner");
  contenedor.appendChild(frente);
  contenedor.appendChild(reverso);
  card.appendChild(contenedor);
  card.classList.add("card--flippable");

  card.addEventListener("click", () => card.classList.toggle("flipped"));
});


// ================================================================
// BOTÓN "ME GUSTA" — Cards de Películas y Música
// ================================================================

document.querySelectorAll(".pelicula-card").forEach((card, index) => {
  const titulo = card.querySelector(".pelicula-card__title")?.textContent || `item-${index}`;
  const key = `like-${titulo.trim().replace(/\s+/g, "-").toLowerCase()}`;
  let tieneLike = localStorage.getItem(key) === "true";

  const btnLike = document.createElement("button");
  btnLike.classList.add("btn-like");
  if (tieneLike) btnLike.classList.add("btn-like--activo");
  btnLike.innerHTML = `<span class="btn-like__icono">❤️</span> <span class="btn-like__texto">${tieneLike ? "Te gusta" : "Me gusta"}</span>`;

  const body = card.querySelector(".pelicula-card__body");
  if (body) body.appendChild(btnLike);

  btnLike.addEventListener("click", () => {
    tieneLike = !tieneLike;
    localStorage.setItem(key, tieneLike);
    btnLike.classList.toggle("btn-like--activo", tieneLike);
    btnLike.querySelector(".btn-like__texto").textContent = tieneLike ? "Te gusta" : "Me gusta";
    btnLike.classList.add("btn-like--animar");
    btnLike.addEventListener("animationend", () => btnLike.classList.remove("btn-like--animar"), { once: true });
  });
});


// ================================================================
// FORMULARIO DE CONTACTO — Validación y mensaje de éxito
// ================================================================

const form = document.querySelector(".form");
if (form) {
  form.addEventListener("submit", (evento) => {
    evento.preventDefault();
    form.querySelectorAll(".form__error").forEach(e => e.remove());
    form.querySelectorAll(".form__input--error").forEach(i => i.classList.remove("form__input--error"));

    const nombre   = form.querySelector("#nombre");
    const apellido = form.querySelector("#apellido");
    const email    = form.querySelector("#email");
    let hayErrores = false;

    function mostrarError(campo, mensaje) {
      campo.classList.add("form__input--error");
      const span = document.createElement("span");
      span.classList.add("form__error");
      span.textContent = mensaje;
      campo.parentNode.appendChild(span);
      hayErrores = true;
    }

    if (!nombre.value.trim()) mostrarError(nombre, "El nombre es obligatorio.");
    if (!apellido.value.trim()) mostrarError(apellido, "El apellido es obligatorio.");
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.value.trim()) {
      mostrarError(email, "El email es obligatorio.");
    } else if (!regexEmail.test(email.value.trim())) {
      mostrarError(email, "El formato del email no es válido.");
    }

    if (!hayErrores) {
      form.style.display = "none";
      const mensaje = document.createElement("div");
      mensaje.classList.add("form__exito");
      mensaje.innerHTML = `
        <p class="form__exito-icono">✅</p>
        <h3 class="form__exito-titulo">¡Mensaje enviado!</h3>
        <p class="form__exito-texto">Gracias <strong>${nombre.value.trim()}</strong>, me pondré en contacto a la brevedad.</p>
        <button class="btn btn--primary form__exito-btn">Enviar otro mensaje</button>
      `;
      form.parentNode.appendChild(mensaje);
      mensaje.querySelector(".form__exito-btn").addEventListener("click", () => {
        form.reset();
        form.style.display = "";
        mensaje.remove();
      });
    }
  });
}


// ================================================================
// MENÚ HAMBURGUESA — Mobile
// ================================================================

const nav = document.querySelector(".nav");
const headerContenido = document.querySelector(".header__contenido");

if (nav && headerContenido) {
  const btnHamburguesa = document.createElement("button");
  btnHamburguesa.classList.add("btn-hamburguesa");
  btnHamburguesa.setAttribute("aria-label", "Abrir menú");
  btnHamburguesa.innerHTML = `<span></span><span></span><span></span>`;
  headerContenido.appendChild(btnHamburguesa);

  btnHamburguesa.addEventListener("click", (e) => {
    e.stopPropagation();
    const estaAbierto = nav.classList.toggle("nav--abierto");
    btnHamburguesa.classList.toggle("btn-hamburguesa--activo", estaAbierto);
    btnHamburguesa.setAttribute("aria-label", estaAbierto ? "Cerrar menú" : "Abrir menú");
  });

  nav.querySelectorAll(".nav__link").forEach(link => {
    link.addEventListener("click", () => {
      nav.classList.remove("nav--abierto");
      btnHamburguesa.classList.remove("btn-hamburguesa--activo");
    });
  });

  document.addEventListener("click", (e) => {
    if (!nav.contains(e.target) && !btnHamburguesa.contains(e.target)) {
      nav.classList.remove("nav--abierto");
      btnHamburguesa.classList.remove("btn-hamburguesa--activo");
    }
  });
}


// ================================================================
// MODAL CON VIDEO DE YOUTUBE — Películas y Música
// ================================================================

const videosYoutube = {
  "Blade Runner":         { youtubeId: "eogpIG53Cis", label: "Ver trailer" },
  "The Matrix":           { youtubeId: "vKQi3bBA1y8", label: "Ver trailer" },
  "Bastardos sin Gloria": { youtubeId: "KnrRy6kSFF0", label: "Ver trailer" },
  "Led Zeppelin II":      { youtubeId: "HQmmM_qwG4k", label: "Escuchar tema" },
  "And Justice for All":  { youtubeId: "WM8bTdBs-cw", label: "Escuchar tema" },
  "Paranoid":             { youtubeId: "0qanF-91aJo", label: "Escuchar tema" },
};

// Creamos el modal con preview (miniatura) en vez de iframe
// YouTube bloquea el embed en la mayoría de sus videos oficiales (error 150/153).
// La solución: mostramos la miniatura del video y al hacer click abrimos YouTube.
const modal = document.createElement("div");
modal.classList.add("yt-modal");
modal.innerHTML = `
  <div class="yt-modal__caja">
    <button class="yt-modal__cerrar" aria-label="Cerrar">✕</button>
    <h3 class="yt-modal__titulo"></h3>
    <a class="yt-modal__preview" href="#" target="_blank" rel="noopener">
      <img class="yt-modal__thumb" src="" alt="Miniatura del video" />
      <div class="yt-modal__play-overlay">
        <span class="yt-modal__play-btn">▶</span>
        <span class="yt-modal__play-texto">Ver en YouTube</span>
      </div>
    </a>
    <p class="yt-modal__aviso">Se abrirá en una nueva pestaña</p>
  </div>
`;
document.body.appendChild(modal);

const modalTitulo  = modal.querySelector(".yt-modal__titulo");
const modalPreview = modal.querySelector(".yt-modal__preview");
const modalThumb   = modal.querySelector(".yt-modal__thumb");

function abrirModal(titulo, youtubeId) {
  modalTitulo.textContent = titulo;
  // YouTube ofrece miniaturas gratis con esta URL
  modalThumb.src = `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`;
  modalPreview.href = `https://www.youtube.com/watch?v=${youtubeId}`;
  modal.classList.add("yt-modal--visible");
  document.body.style.overflow = "hidden";
}

function cerrarModal() {
  modal.classList.remove("yt-modal--visible");
  document.body.style.overflow = "";
}

modal.querySelector(".yt-modal__cerrar").addEventListener("click", cerrarModal);
modal.addEventListener("click", (e) => { if (e.target === modal) cerrarModal(); });
document.addEventListener("keydown", (e) => { if (e.key === "Escape") cerrarModal(); });

document.querySelectorAll(".pelicula-card").forEach((card) => {
  const titulo = card.querySelector(".pelicula-card__title")?.textContent?.trim();
  const datos  = videosYoutube[titulo];
  if (!datos) return;

  const btn = document.createElement("button");
  btn.classList.add("btn-video");
  btn.innerHTML = `<span class="btn-video__icono">▶</span> ${datos.label}`;
  btn.addEventListener("click", () => abrirModal(titulo, datos.youtubeId));

  const body = card.querySelector(".pelicula-card__body");
  if (body) body.appendChild(btn);
});
