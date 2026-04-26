document.addEventListener("DOMContentLoaded", () => {
  const contenedor = document.getElementById("grid-products");
  if (!contenedor) return;

  function crearCard(pro) {
    const item = document.createElement("div");
    const categoriaNombre = pro.categoriaNombre || pro.categoria;
    const descripcion =
      pro.descripcion ||
      "Delicioso snack artesanal, preparado con los mejores ingredientes naturales.";

    // ✅ Sin clases duplicadas en el wrapper — el article ya tiene todo
    item.className = "h-full";

    item.innerHTML = `
<article
  class="group flex h-full flex-col overflow-hidden rounded-[20px] bg-white ring-1 ring-black/10 transition duration-300 hover:-translate-y-1 hover:shadow-xl">

  <!-- Imagen -->
  <div class="relative w-full aspect-[4/3] overflow-hidden bg-[#fff8ef]">
    <img src="${pro.imagen}" alt="${pro.nombre}" loading="lazy"
      class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />

    ${pro.nuevo ? `<span class="absolute top-2.5 left-2.5 rounded-full bg-[#733702] px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest text-white">Nuevo</span>` : ""}

    <button
      class="fav-btn absolute right-2.5 top-2.5 grid h-[34px] w-[34px] place-items-center rounded-full bg-white/90 text-[#733702] backdrop-blur-sm transition duration-200 hover:bg-[#F1860B] hover:text-white border-0 cursor-pointer text-[15px]"
      aria-label="Marcar como favorito">♡</button>
  </div>

  <!-- Info -->
  <div class="flex flex-1 flex-col p-4">

    <div class="flex items-center justify-between gap-2">
      <span class="inline-flex items-center rounded-full bg-[#F1860B]/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#F1860B]">
        ${categoriaNombre}
      </span>
      <span class="inline-flex items-center gap-1 rounded-full bg-[#733702] px-2.5 py-0.5 text-[11px] font-semibold text-white">
        <span class="inline-block h-2 w-2 bg-yellow-300"
          style="clip-path:polygon(50% 0%,61% 35%,98% 35%,68% 57%,79% 91%,50% 70%,21% 91%,32% 57%,2% 35%,39% 35%)"></span>
        ${pro.rating.toFixed(1)}
      </span>
    </div>

    <h2 class="mt-3 font-['Amaranth'] text-[1.1rem] leading-snug text-slate-900">
      ${pro.nombre}
    </h2>

    <p class="mt-1.5 text-[12.5px] leading-relaxed text-slate-500 line-clamp-3">
      ${descripcion}
    </p>

    <p class="mt-3.5 text-[10px] uppercase tracking-[0.14em] text-slate-400">Precio</p>
    <p class="mt-0.5 text-[1.35rem] font-bold tracking-tight text-slate-900">
      S/ ${pro.precio.toFixed(2)}
    </p>

    <div class="mt-auto pt-3.5 flex items-center justify-between gap-2">
      <a href="producto.html?id=${pro.id}"
        class="inline-flex items-center justify-center rounded-[10px] border-[1.5px] border-[#F1860B] px-3.5 py-1.5 text-[12.5px] font-semibold text-[#F1860B] transition duration-200 hover:bg-[#F1860B] hover:text-white">
        Ver más
      </a>

      <!-- ✅ Cambiado a <button> — ya no navega a carrito.html -->
      <button
        class="btn-carrito inline-grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#F1860B] text-white transition duration-200 hover:bg-[#E52619] active:scale-95"
        data-id="${pro.id}"
        aria-label="Agregar al carrito">
        <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" fill="none" viewBox="0 0 24 24"
          stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-1.5 6h13M10 21a1 1 0 100-2 1 1 0 000 2zm7 0a1 1 0 100-2 1 1 0 000 2z"/>
        </svg>
      </button>
    </div>

  </div>
</article>`;

    return item;
  }

  // ✅ Delegación en document para .fav-btn — funciona aunque se rerenderice el grid
  document.addEventListener("click", (e) => {
    const btn = e.target.closest(".fav-btn");
    if (!btn) return;

    const estaActivo = btn.dataset.active === "1";
    btn.dataset.active = estaActivo ? "" : "1";
    btn.textContent = estaActivo ? "♡" : "♥";

    // ✅ Clases estáticas en lugar de JIT dinámico para evitar purge issues
    if (estaActivo) {
      btn.style.background = "rgba(255,255,255,0.92)";
      btn.style.color = "#733702";
    } else {
      btn.style.background = "#F1860B";
      btn.style.color = "#fff";
    }
  });

  // ✅ Delegación en contenedor para .btn-carrito — reemplaza el forEach post-render
  contenedor.addEventListener("click", (e) => {
    const btn = e.target.closest(".btn-carrito");
    if (!btn) return;

    // Animación
    btn.classList.add("scale-125");
    setTimeout(() => btn.classList.remove("scale-125"), 150);

    const id = btn.dataset.id;
    const producto = productosGlobal.find((p) => String(p.id) === String(id));

    if (!producto) return; // ✅ Guard: evita llamar agregarAlCarrito con undefined

    agregarAlCarrito(producto);
  });

  // ✅ Variable en scope del módulo para que la delegación pueda acceder a los datos
  let productosGlobal = [];

  function renderizarProductos(productos) {
    contenedor.innerHTML = "";

    if (!productos.length) {
      contenedor.innerHTML =
        "<p class='text-center col-span-full text-gray-500'>No hay productos 😕</p>";
      return;
    }

    const fragment = document.createDocumentFragment();
    productos.forEach((pro) => fragment.appendChild(crearCard(pro)));
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

      productosGlobal = productos.map((pro) => ({
        ...pro,
        categoriaNombre: categoriasMap[pro.categoria] || "Sin categoría",
      }));

      renderizarProductos(productosGlobal);
    })
    .catch(() => {
      contenedor.innerHTML =
        "<p class='text-center col-span-full text-red-500'>Error al cargar productos o categorías</p>";
    });
});

function agregarAlCarrito(producto) {
  let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

  const existe = carrito.find((item) => item.id === producto.id);

  if (existe) {
    existe.cantidad += 1;
  } else {
    carrito.push({
      id: producto.id,
      nombre: producto.nombre,
      precio: producto.precio,
      imagen: producto.imagen,
      cantidad: 1,
    });
  }

  localStorage.setItem("carrito", JSON.stringify(carrito));

  // Actualizar interfaz
  if (typeof actualizarContador === "function") {
    actualizarContador();
  }

  // Animar contador
  const contador = document.getElementById("contador-carrito");
  if (contador) {
    contador.classList.add("scale-125");
    setTimeout(() => contador.classList.remove("scale-125"), 200);
  }

  mostrarToast("Producto agregado al carrito");

  const mini = document.getElementById("mini-carrito");
  if (mini) {
    mini.classList.remove("hidden");
    renderMiniCarrito();
  }
}

function mostrarToast(mensaje) {
  const toast = document.createElement("div");
  toast.className =
    "fixed bottom-6 right-6 bg-[#1a4731] text-white px-5 py-3 rounded-xl shadow-lg opacity-0 translate-y-5 transition-all duration-300 z-50";
  toast.textContent = mensaje;
  document.body.appendChild(toast);

  setTimeout(() => toast.classList.remove("opacity-0", "translate-y-5"), 10);
  setTimeout(() => {
    toast.classList.add("opacity-0", "translate-y-5");
    setTimeout(() => toast.remove(), 300);
  }, 2000);
}

function animarContador() {
  const contador = document.getElementById("contador-carrito");
  if (!contador) return;
  contador.classList.add("scale-125");
  setTimeout(() => contador.classList.remove("scale-125"), 200);
}
