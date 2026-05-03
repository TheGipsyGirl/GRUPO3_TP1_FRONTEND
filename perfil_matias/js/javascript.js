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
