// ================================================================
//  script.js — Portafolio Dev_IFTS29
//  Funcionalidades:
//    1. Animación de entrada en "Sobre mí"
//    2. Cards de proyectos con flip al hacer click
//    3. Botón "Me gusta" en cards de películas y música
//    4. Formulario de contacto con validación y mensaje de éxito
//    5. Menú hamburguesa para mobile
//    6. Navbar: resalta el link de la sección visible (scroll spy)
// ================================================================


// ================================================================
// 1. ANIMACIÓN DE ENTRADA — Sección "Sobre mí"
//    Agrega la clase "visible" después de 200ms para activar
//    la transición CSS (fade + slide desde abajo)
// ================================================================
window.addEventListener("load", () => {
  const section = document.querySelector(".sobre-mi__content");
  if (section) {
    setTimeout(() => {
      section.classList.add("visible");
    }, 200);
  }
});


// ================================================================
// 2. FLIP DE CARDS — Sección "Proyectos"
//    Al hacer click en una card, la da vuelta mostrando el reverso
//    con info extra (tecnologías usadas y un link al proyecto).
//    Hace click de nuevo → vuelve al frente.
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

const cards = document.querySelectorAll(".card");

cards.forEach((card, index) => {
  const datos = datosCards[index];

  const frente = document.createElement("div");
  frente.classList.add("card__frente");
  while (card.firstChild) {
    frente.appendChild(card.firstChild);
  }

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

  card.addEventListener("click", () => {
    card.classList.toggle("flipped");
  });
});


// ================================================================
// 3. BOTÓN "ME GUSTA" — Cards de Películas y Música
//    Agrega un botón con corazón a cada pelicula-card.
//    El estado se guarda en localStorage.
// ================================================================

const peliculaCards = document.querySelectorAll(".pelicula-card");

peliculaCards.forEach((card, index) => {
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
    btnLike.addEventListener("animationend", () => {
      btnLike.classList.remove("btn-like--animar");
    }, { once: true });
  });
});


// ================================================================
// 4. FORMULARIO DE CONTACTO — Validación y mensaje de éxito
//    Valida nombre, apellido y email. Si todo está bien muestra
//    un mensaje de confirmación personalizado.
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
// 5. MENÚ HAMBURGUESA — Para pantallas mobile
//    Crea dinámicamente el botón ☰ y lo agrega al header.
//    Toggle con clase "nav--abierto". Cierra al hacer click fuera.
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
// 6. SCROLL SPY — Resalta el link del nav según sección visible
//    Usa IntersectionObserver para detectar qué sección está
//    en pantalla y agrega "nav__link--activo" al link correspondiente.
// ================================================================

const secciones = document.querySelectorAll("section[id]");
const linksNav  = document.querySelectorAll(".nav__link");

const observador = new IntersectionObserver(
  (entradas) => {
    entradas.forEach((entrada) => {
      if (entrada.isIntersecting) {
        linksNav.forEach(l => l.classList.remove("nav__link--activo"));
        const linkActivo = document.querySelector(`.nav__link[href="#${entrada.target.id}"]`);
        if (linkActivo) linkActivo.classList.add("nav__link--activo");
      }
    });
  },
  { threshold: 0.3 }
);

secciones.forEach(seccion => observador.observe(seccion));


// ================================================================
// 7. MODAL CON VIDEO DE YOUTUBE — Películas y Música
//    Agrega un botón "▶ Ver trailer" / "▶ Escuchar" a cada card.
//    Al hacer click abre un modal con el iframe de YouTube.
//    Al cerrar (botón X, click fuera, o Escape) pausa el video.
// ================================================================

// --- Datos de los videos ---
// Las claves deben coincidir con el texto del título de cada card
const videosYoutube = {
  // Películas
  "Blade Runner":         { tipo: "pelicula", youtubeId: "eogpIG53Cis", label: "Ver trailer" },
  "The Matrix":           { tipo: "pelicula", youtubeId: "vKQi3bBA1y8", label: "Ver trailer" },
  "Bastardos sin Gloria": { tipo: "pelicula", youtubeId: "KnrRy6kSFF0", label: "Ver trailer" },
  // Música
  "Led Zeppelin II":      { tipo: "musica",   youtubeId: "HQmmM_qwG4k", label: "Escuchar tema" },
  "And Justice for All":  { tipo: "musica",   youtubeId: "WM8bTdBs-cw", label: "Escuchar tema" },
  "Paranoid":             { tipo: "musica",   youtubeId: "0qanF-91aJo", label: "Escuchar tema" },
};

// --- Crear el modal una sola vez en el DOM ---
const modal = document.createElement("div");
modal.classList.add("yt-modal");
modal.innerHTML = `
  <div class="yt-modal__caja">
    <button class="yt-modal__cerrar" aria-label="Cerrar video">✕</button>
    <h3 class="yt-modal__titulo"></h3>
    <div class="yt-modal__video-wrap">
      <iframe
        class="yt-modal__iframe"
        src=""
        title="Video de YouTube"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen>
      </iframe>
    </div>
  </div>
`;
document.body.appendChild(modal);

const modalTitulo = modal.querySelector(".yt-modal__titulo");
const modalIframe = modal.querySelector(".yt-modal__iframe");

// Función para abrir el modal
function abrirModal(titulo, youtubeId) {
  modalTitulo.textContent = titulo;
  // El parámetro autoplay=1 hace que empiece solo al abrir
  modalIframe.src = `https://www.youtube.com/embed/${youtubeId}?autoplay=1`;
  modal.classList.add("yt-modal--visible");
  document.body.style.overflow = "hidden"; // evita scroll de fondo
}

// Función para cerrar el modal
function cerrarModal() {
  modal.classList.remove("yt-modal--visible");
  modalIframe.src = ""; // vaciar src detiene el video y libera recursos
  document.body.style.overflow = "";
}

// Cerrar con botón X
modal.querySelector(".yt-modal__cerrar").addEventListener("click", cerrarModal);

// Cerrar haciendo click fuera de la caja
modal.addEventListener("click", (e) => {
  if (e.target === modal) cerrarModal();
});

// Cerrar con tecla Escape
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") cerrarModal();
});

// --- Agregar el botón a cada card ---
document.querySelectorAll(".pelicula-card").forEach((card) => {
  const titulo = card.querySelector(".pelicula-card__title")?.textContent?.trim();
  const datos  = videosYoutube[titulo];
  if (!datos) return; // si no hay datos para esta card, la saltamos

  const btn = document.createElement("button");
  btn.classList.add("btn-video");
  btn.innerHTML = `<span class="btn-video__icono">▶</span> ${datos.label}`;
  btn.addEventListener("click", () => abrirModal(titulo, datos.youtubeId));

  const body = card.querySelector(".pelicula-card__body");
  if (body) body.appendChild(btn);
});
