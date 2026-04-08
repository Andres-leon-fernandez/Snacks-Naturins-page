document.addEventListener("DOMContentLoaded", () => {
  const contenedor = document.getElementById("grid-products");
  if (!contenedor) return;

  function crearCard(pro) {
    const item = document.createElement("div");

    item.className =
      "group relative bg-white rounded-2xl overflow-hidden border border-gray-200 hover:shadow-xl transition-all duration-300";

    item.innerHTML = `
      <!-- Imagen -->
      <div class="relative w-full aspect-[4/3] overflow-hidden">
        <img 
          src="${pro.imagen}" 
          alt="${pro.nombre}"
          loading="lazy"
          class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          onerror="this.src='img/fallback.webp'"
        >

        <!-- Favorito -->
        <button class="absolute top-2 right-2 bg-white/80 backdrop-blur p-2 rounded-full shadow hover:bg-red-50 hover:text-red-500 transition">
          ♡
        </button>
      </div>

      <!-- Info -->
      <div class="p-4 relative">

        <h2 class="text-sm font-['Inter'] font-semibold text-gray-800 truncate">
          ${pro.nombre}
        </h2>

        <div class="flex items-center gap-1 mt-1">
          <span class="text-xs text-amber-500">★★★★★</span>
          <span class="text-xs text-gray-400">(${pro.rating})</span>
        </div>

        <p class="text-green-700 font-bold mt-2 text-lg">
          S/ ${pro.precio.toFixed(2)}
        </p>

        <!-- Botón -->
        <button 
          onclick="agregarCarrito('${pro.nombre}', ${pro.precio})"
          class="mt-3 w-full bg-green-700 cursor-pointer hover:bg-green-800 text-white font-['Inter'] py-2 rounded-xl text-sm font-semibold shadow active:scale-95 transition"
        >
          Añadir al carrito
        </button>
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

  fetch("db/productos.json")
    .then((res) => {
      if (!res.ok) throw new Error("Error al cargar productos");
      return res.json();
    })
    .then(renderizarProductos)
    .catch(() => {
      contenedor.innerHTML =
        "<p class='text-center col-span-full text-red-500'>Error al cargar productos</p>";
    });
});
