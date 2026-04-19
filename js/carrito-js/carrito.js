document.addEventListener("DOMContentLoaded", () => {
  const contenedor = document.getElementById("carrito-container");

  const subtotalSpan = document.getElementById("subtotal");
  const totalSpan = document.getElementById("total");
  const descuentoSpan = document.getElementById("descuento");

  const envioSelect = document.getElementById("envio");
  const cuponInput = document.getElementById("cupon");


  let descuento = 0;

  function obtenerCarrito() {
    return JSON.parse(localStorage.getItem("carrito")) || [];
  }

  function guardarCarrito(carrito) {
    localStorage.setItem("carrito", JSON.stringify(carrito));
  }

  function renderCarrito() {
  const carrito = obtenerCarrito();
  contenedor.innerHTML = "";

  const acciones = document.getElementById("acciones-carrito");
  const wrapper = document.getElementById("carrito-wrapper");
  const resumen = document.getElementById("resumen-compra");
  

  if (carrito.length === 0) {

    // 🔴 OCULTAR ELEMENTOS DE ACCIÓN Y RESUMEN
    acciones.classList.add("hidden");
    resumen.classList.add("hidden");

    const layout = document.getElementById("layout-carrito");

    // 🔴 CENTRAR CONTENIDO (IMPORTANTE: reset completo de layout)
    layout.className = "flex flex-col items-center justify-center min-h-[60vh]";

    //parte cuando no hay ni un producto seleccionado
   contenedor.innerHTML = `
  <div class="flex flex-col items-center justify-center text-center w-full py-24">

    <div class="relative mb-6">
      <i class="fa-solid fa-cart-shopping text-8xl text-gray-300"></i>

      <span class="absolute -top-2 -right-2 bg-red-500 text-white text-sm w-7 h-7 flex items-center justify-center rounded-full font-bold">
        ✕
      </span>
    </div>

    <h2 class="text-4xl font-extrabold text-gray-700 mb-3">
      Tu carrito está vacío
    </h2>

    <p class="text-gray-500 text-lg mb-8 max-w-md">
      Antes de finalizar tu compra, necesitas agregar productos desde la tienda.
    </p>

    <a href="Productos.html"
      class="bg-[#98C01E] hover:bg-[#E52619] text-white px-8 py-4 rounded-xl font-semibold text-lg transition shadow-lg">
      Volver a la tienda
    </a>

  </div>
`;

    actualizarTotales();
    return;
  }

  // 🟢 CON PRODUCTOS
  acciones.classList.remove("hidden");
  resumen.classList.remove("hidden");

  wrapper.className = "min-h-[60vh] flex flex-col w-full";

  carrito.forEach((p) => {
    const item = document.createElement("div");

  item.className =
"flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm hover:shadow-xl transition w-full border border-gray-100";

    item.innerHTML = `
      <div class="flex items-center gap-4">
  <img src="${p.imagen}" class="w-24 h-24 object-cover rounded-xl border">

  <div>
    <h2 class="font-semibold text-lg">${p.nombre}</h2>
    <p class="text-gray-500 text-sm">S/ ${p.precio.toFixed(2)}</p>

    <div class="flex items-center gap-3 mt-3">
      <button class="restar bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-lg" data-id="${p.id}">-</button>
      <span class="font-semibold">${p.cantidad}</span>
      <button class="sumar bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-lg" data-id="${p.id}">+</button>
    </div>
  </div>
</div>

      <div class="text-right">
        <p class="font-bold mb-2">S/ ${(p.precio * p.cantidad).toFixed(2)}</p>
        <button class="eliminar bg-red-100 hover:bg-red-200 text-red-600 p-2 rounded-full"
                data-id="${p.id}">
          <i class="fa-solid fa-trash"></i>
        </button>
      </div>
    `;

    contenedor.appendChild(item);
  });

  eventos();
  actualizarTotales();
}

  function eventos() {
    document.querySelectorAll(".sumar").forEach(btn => {
      btn.onclick = () => cambiarCantidad(btn.dataset.id, 1);
    });

    document.querySelectorAll(".restar").forEach(btn => {
      btn.onclick = () => cambiarCantidad(btn.dataset.id, -1);
    });

    document.querySelectorAll(".eliminar").forEach(btn => {
      btn.onclick = () => eliminarProducto(btn.dataset.id);
    });
  }

  function cambiarCantidad(id, cambio) {
    let carrito = obtenerCarrito();

    carrito = carrito.map(p => {
      if (p.id == id) {
        p.cantidad += cambio;
        if (p.cantidad < 1) p.cantidad = 1;
      }
      return p;
    });

    guardarCarrito(carrito);
    renderCarrito();
  }

  function eliminarProducto(id) {
    let carrito = obtenerCarrito().filter(p => p.id != id);
    guardarCarrito(carrito);
    renderCarrito();
  }

  function actualizarTotales() {
    const carrito = obtenerCarrito();

    let subtotal = carrito.reduce((acc, p) => acc + p.precio * p.cantidad, 0);
    let envio = Number(envioSelect.value);

    subtotalSpan.textContent = "S/ " + subtotal.toFixed(2);
    descuentoSpan.textContent = "S/ " + descuento.toFixed(2);

    let total = subtotal + envio - descuento;

    if (total < 0) total = 0; // evita negativos

    totalSpan.textContent = "S/ " + total.toFixed(2);
  }

  // ENVÍO
  envioSelect.addEventListener("change", actualizarTotales);

  // CUPONES
  document.getElementById("aplicar-cupon").addEventListener("click", () => {
    const codigo = cuponInput.value.trim().toLowerCase();

    descuento = 0;

    if (codigo === "descuento10") {
      descuento = 10;
    }
    else if (codigo === "enviogratis") {
      envioSelect.value = 0;
    }
    else if (codigo !== "") {
      alert("Cupón inválido");
    }

    actualizarTotales();
  });

  // VACIAR CARRITO
document.getElementById("vaciar-carrito").addEventListener("click", () => {
  mostrarConfirmacion("¿Seguro que deseas vaciar el carrito?", () => {
    localStorage.removeItem("carrito");
    renderCarrito();
  });
});

renderCarrito();
});

function mostrarConfirmacion(mensaje, onConfirm) {
  const overlay = document.createElement("div");

  overlay.className = `
    fixed inset-0 bg-black/40 flex items-center justify-center z-50
  `;

  overlay.innerHTML = `
    <div class="bg-white rounded-2xl p-6 w-[320px] text-center shadow-xl">

      <h2 class="text-lg font-bold mb-3 text-gray-800">
        Confirmar acción
      </h2>

      <p class="text-sm text-gray-500 mb-5">
        ${mensaje}
      </p>

      <div class="flex gap-3">
        <button id="cancelar"
          class="flex-1 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition text-sm font-semibold">
          Cancelar
        </button>

        <button id="confirmar"
          class="flex-1 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition text-sm font-semibold">
          Sí, vaciar
        </button>
      </div>

    </div>
  `;

  document.body.appendChild(overlay);

  overlay.querySelector("#cancelar").onclick = () => overlay.remove();

  overlay.querySelector("#confirmar").onclick = () => {
    onConfirm();
    overlay.remove();
  };

  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) overlay.remove();
  });
}
