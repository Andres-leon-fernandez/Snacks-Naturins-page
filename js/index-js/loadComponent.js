document.addEventListener("DOMContentLoaded", () => {
  loadComponent("footer", "js/component/footer.html");
  loadComponent("header", "js/component/header.html", () => {
    initHeader();
    initLogin();
  });

  // Cargar el script del login después de cargar los componentes
  const scriptLogin = document.createElement("script");
  scriptLogin.src = "js/component/login.js";
  scriptLogin.defer = true;
  document.body.appendChild(scriptLogin);
});

function loadComponent(id, path, callback) {
  fetch(path)
    .then((res) => res.text())
    .then((data) => {
      document.getElementById(id).innerHTML = data;
      if (callback) callback();
    })
    .catch((err) => console.error("Error al cargar el componente:", id, err));
}

function initHeader() {
  const btn = document.getElementById("btn-carrito");
  const mini = document.getElementById("mini-carrito");

  if (!btn || !mini) return;

  actualizarContador();

  btn.addEventListener("click", () => {
    mini.classList.toggle("hidden");
    renderMiniCarrito();
  });
}

//  MINI CARRITO
function renderMiniCarrito() {
  const contenedor = document.getElementById("mini-items");
  const totalSpan = document.getElementById("mini-total");
  const footer = document.getElementById("mini-footer");

  if (!contenedor || !totalSpan || !footer) return;

  let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

  contenedor.innerHTML = "";

  //  CARRITO VACÍO
  if (carrito.length === 0) {
    contenedor.innerHTML = `
      <div class="flex flex-col items-center justify-center text-center py-6">

        <div class="relative mb-4">
          <i class="fa-solid fa-cart-shopping text-6xl text-gray-300"></i>
          <span class="absolute -top-2 -right-2 bg-red-500 text-white text-sm w-6 h-6 flex items-center justify-center rounded-full font-bold">
            ✕
          </span>
        </div>

        <p class="text-sm font-semibold text-gray-600">
          No hay productos en el carrito
        </p>

        <p class="text-xs text-gray-400 mt-1 mb-4">
          Agrega productos para continuar
        </p>

        <a href="productos.html"
          class="bg-[#E52619] hover:bg-red-700 text-white text-sm px-4 py-2 rounded-lg font-semibold no-underline">
          Volver a la tienda
        </a>

      </div>
    `;

    totalSpan.textContent = "S/ 0.00";
    footer.classList.add("hidden"); // ocultar botones

    actualizarContador();
    return;
  }

  //  CARRITO CON PRODUCTOS
  footer.classList.remove("hidden");

  let total = 0;

  carrito.forEach((p) => {
    total += p.precio * p.cantidad;

    contenedor.innerHTML += `
      <div class="flex items-center justify-between gap-2">

        <!-- INFO -->
        <div class="flex gap-2 items-center">
          <img src="${p.imagen}" class="w-12 h-12 rounded object-cover">

          <div>
            <p class="text-sm font-semibold">${p.nombre}</p>
            <p class="text-xs text-gray-500">x${p.cantidad}</p>
          </div>
        </div>

        <!-- PRECIO + ELIMINAR -->
        <div class="flex items-center gap-3 min-w-[90px] justify-end">
          <p class="text-sm font-bold">
            S/ ${(p.precio * p.cantidad).toFixed(2)}
          </p>  

          <button 
            class="mini-eliminar w-8 h-8 flex items-center justify-center text-red-500 hover:bg-red-100 rounded-full transition"
            data-id="${p.id}">
            <i class="fa-solid fa-trash"></i>
          </button>
        </div>

      </div>
    `;
  });

  totalSpan.textContent = "S/ " + total.toFixed(2);

  // EVENTOS ELIMINAR
  document.querySelectorAll(".mini-eliminar").forEach((btn) => {
    btn.addEventListener("click", () => {
      eliminarDelCarrito(btn.dataset.id);
    });
  });

  actualizarContador();
}

//  CONTADOR
function actualizarContador() {
  const contador = document.getElementById("contador-carrito");
  if (!contador) return;

  let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

  let total = carrito.reduce((acc, p) => acc + p.cantidad, 0);

  contador.textContent = total;
}

//  ELIMINAR PRODUCTO
function eliminarDelCarrito(id) {
  let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

  carrito = carrito.filter((p) => p.id != id);

  localStorage.setItem("carrito", JSON.stringify(carrito));

  renderMiniCarrito();
  actualizarContador();
}
