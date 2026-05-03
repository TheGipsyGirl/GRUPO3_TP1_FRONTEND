// Mostrar/Ocultar discos favoritos
const toggleBtn = document.getElementById("toggle-musica");
const discosContainer = document.querySelector(".discos-container");

toggleBtn.addEventListener("click", () => {
  if (discosContainer.style.display === "none") {
    discosContainer.style.display = "grid";
    toggleBtn.textContent = "Ocultar Discos";
  } else {
    discosContainer.style.display = "none";
    toggleBtn.textContent = "Mostrar Discos";
  }
});

// Botón volver arriba
const backToTopBtn = document.getElementById("back-to-top");

window.addEventListener("scroll", () => {
  if (window.scrollY > 100) {
    backToTopBtn.classList.add("show");
  } else {
    backToTopBtn.classList.remove("show");
  }
});

backToTopBtn.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
});
