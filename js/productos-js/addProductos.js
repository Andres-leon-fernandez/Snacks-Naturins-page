document.addEventListener("DOMContentLoaded", () => {
  const contenedor = document.getElementById("grid-products");
  if (!contenedor) return;

  function crearCard(pro) {
    const item = document.createElement("div");
    const categoriaNombre = pro.categoriaNombre || pro.categoria;
    const descripcion =
      pro.descripcion ||
      "Delicioso snack artesanal, preparado con los mejores ingredientes naturales.";

    item.className =
      "bg-white rounded-[2rem] shadow-xl overflow-hidden hover:shadow-2xl transition duration-300";

    item.innerHTML = `
                <!-- Imagen -->
                <div class="relative w-full aspect-[4/3] overflow-hidden">
                    <img src="${pro.imagen}"
                        alt="${pro.nombre}" loading="lazy" class="w-full h-full object-cover transition-transform duration-500 hover:scale-105" />

                    <!-- Favorito -->
                    <button
                        class="absolute top-3 right-3 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-sm hover:bg-orange-50 transition">
                        ☆
                    </button>
                </div>

                <!-- Info -->
                <div class="p-5">
                    <div class="flex items-start justify-between gap-3">
                        <span class="inline-flex items-center rounded-full bg-orange-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-orange-600">
                            ${categoriaNombre}
                        </span>
                        <span class="inline-flex items-center rounded-full bg-slate-900 px-3 py-1 text-xs font-medium text-white">
                            ${pro.rating.toFixed(1)}
                        </span>
                    </div>

                    <h2 class="mt-4 text-xl font-semibold leading-tight text-slate-900">
                        ${pro.nombre}
                    </h2>

                    <p class="text-sm text-slate-500 mt-3 line-clamp-3">
                        ${descripcion}
                    </p>

                    <div class="mt-5 flex items-center justify-between gap-4">
                        <div>
                            <p class="text-sm text-slate-500">Precio</p>
                            <p class="text-2xl font-bold text-slate-900">S/ ${pro.precio.toFixed(2)}</p>
                        </div>

                        <!-- Botón de acción (carrito) -->

                        <a href="carrito.html"
                          class="btn-carrito group inline-flex h-12 w-12 items-center justify-center rounded-full bg-orange-500 text-white shadow-lg hover:bg-orange-600 transition transform hover:scale-110 active:scale-95"
                          data-id="${pro.id}">
  

                            <!-- Icono (+) -->
                            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 group-hover:hidden" fill="none"
                                viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M12 4v16m8-8H4" />
                            </svg>

                            <!-- Icono carrito -->
                            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 hidden group-hover:block" fill="none"
                                viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-1.5 6h13M10 21a1 1 0 100-2 1 1 0 000 2zm7 0a1 1 0 100-2 1 1 0 000 2z" />
                            </svg>
                        </a>
                    </div>
                </div>
    `;

    return item;
  }

  function renderizarProductos(productos) {
    contenedor.innerHTML = "";

    if (!productos.length) {
      contenedor.innerHTML =
        "<p class='text-center col-span-full text-gray-500'>No hay productos 😕</p>";
      return;
    }

    const fragment = document.createDocumentFragment();

    productos.forEach((pro) => {
      fragment.appendChild(crearCard(pro));
    });

    contenedor.appendChild(fragment);
  }

  Promise.all([
    fetch("db/productos.json").then((res) => {
      if (!res.ok) throw new Error("Error al cargar productos");
      return res.json();
    }),
    fetch("db/categories.json").then((res) => {
      if (!res.ok) throw new Error("Error al cargar categorías");
      return res.json();
    }),
  ])
    .then(([productos, categorias]) => {
      const categoriasMap = Object.fromEntries(
        categorias.map((cat) => [cat.id, cat.nombre]),
      );

      const productosConCategoria = productos.map((pro) => ({
        ...pro,
        categoriaNombre: categoriasMap[pro.categoria] || "Sin categoría",
      }));

      renderizarProductos(productosConCategoria);

      // EVENTO CLICK 
      document.querySelectorAll(".btn-carrito").forEach((btn) => {
        btn.addEventListener("click", () => {

          // 🔥 animación botón
        btn.classList.add("scale-125");
        setTimeout(() => {
        btn.classList.remove("scale-125");
        }, 150);

          const id = btn.dataset.id;
          const producto = productosConCategoria.find(p => p.id == id);
          agregarAlCarrito(producto);
        });
      });
    })
    .catch(() => {
      contenedor.innerHTML =
        "<p class='text-center col-span-full text-red-500'>Error al cargar productos o categorías</p>";
    });
});

function agregarAlCarrito(producto) {
  let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

  const existe = carrito.find(item => item.id === producto.id);

  if (existe) {
    existe.cantidad += 1;
  } else {
    carrito.push({
      id: producto.id,
      nombre: producto.nombre,
      precio: producto.precio,
      imagen: producto.imagen,
      cantidad: 1
    });
  }

  localStorage.setItem("carrito", JSON.stringify(carrito));

  // 🔥 ACTUALIZAR CONTADOR (forzado seguro)
  setTimeout(() => {
    if (typeof actualizarContador === "function") {
      actualizarContador();
      animarContador();
    }
  }, 50);

  // 🔥 feedback visual
  mostrarToast("Producto agregado al carrito");

  // 🔥 abrir mini carrito automáticamente
  const mini = document.getElementById("mini-carrito");
  if (mini) {
    mini.classList.remove("hidden");
    renderMiniCarrito();
  }
}

// 🔔 TOAST BONITO
function mostrarToast(mensaje) {
  const toast = document.createElement("div");

  toast.className = `
    fixed bottom-6 right-6 bg-[#1a4731] text-white px-5 py-3 rounded-xl shadow-lg 
    opacity-0 translate-y-5 transition-all duration-300 z-50
  `;

  toast.textContent = mensaje;

  document.body.appendChild(toast);

  setTimeout(() => {
    toast.classList.remove("opacity-0", "translate-y-5");
  }, 10);

  setTimeout(() => {
    toast.classList.add("opacity-0", "translate-y-5");
    setTimeout(() => toast.remove(), 300);
  }, 2000);
}

// 🔴 ANIMACIÓN CONTADOR
function animarContador() {
  const contador = document.getElementById("contador-carrito");
  if (!contador) return;

  contador.classList.add("scale-125");

  setTimeout(() => {
    contador.classList.remove("scale-125");
  }, 200);
}