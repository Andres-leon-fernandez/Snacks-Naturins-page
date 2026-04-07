document.addEventListener("DOMContentLoaded", () => {
  loadComponent("footer", "/js/component/footer.html");
  loadComponent("header", "/js/component/header.html");
});

function loadComponent(id, path) {
  fetch(path)
    .then((res) => res.text())
    .then((data) => {
      document.getElementById(id).innerHTML = data;
    })
    .catch((err) => console.error("Error al cargar el componente: ", id, err));
}
