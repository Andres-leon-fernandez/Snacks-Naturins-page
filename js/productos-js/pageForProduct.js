document.addEventListener("DOMContentLoaded", async () => {
  const params = new URLSearchParams(window.location.search);
  const idProducto = params.get("id");

  const contenedor = document.getElementById("detalle_producto");
  const relacionadosContenedor = document.getElementById("relacionados");

  if (!contenedor) return;

  try {
    const [productos, categorias] = await Promise.all([
      fetch("db/productos.json").then((res) => res.json()),
      fetch("db/categories.json").then((res) => res.json()),
    ]);

    const producto = productos.find((p) => String(p.id) === idProducto);

    if (!producto) {
      contenedor.innerHTML = `<p>Producto no encontrado 😢</p>`;
      return;
    }

    const categoria = categorias.find((c) => c.id === producto.categoria);

    // 🎯 RENDER PRINCIPAL
    contenedor.innerHTML = `
      <div class="grid md:grid-cols-2 gap-10 items-start">
        
        <div>
          <img src="${producto.imagen}" class="w-full rounded-2xl shadow-md">
        </div>

        <div class="space-y-4">
          <span class="text-sm text-[#F1860B] font-semibold uppercase">
            ${categoria?.nombre || "Sin categoría"}
          </span>

          <h1 class="font-['Amaranth'] text-3xl text-[#2c1a00]">
            ${producto.nombre}
          </h1>

          <p class="text-gray-600">
            ${producto.descripcion}
          </p>

          <p class="text-3xl font-bold text-[#1a4731]">
            S/ ${producto.precio.toFixed(2)}
          </p>

          <button 
  id="btn-agregar"
  class="bg-[#1a4731] text-white px-6 py-3 rounded-xl hover:bg-[#245e41] transition"
  data-id="${producto.id}">
  Añadir al carrito
</button>
        </div>

      </div>
    `;

    // 🔥 EVENT LISTENER para btn-agregar
    const btnAgregar = document.getElementById("btn-agregar");
    if (btnAgregar) {
      btnAgregar.addEventListener("click", (e) => {
        e.preventDefault();

        // Animación
        btnAgregar.classList.add("scale-95");
        setTimeout(() => btnAgregar.classList.remove("scale-95"), 150);

        // Agregar al carrito
        if (typeof agregarAlCarrito === "function") {
          agregarAlCarrito(producto);
        }
      });
    }

    // 🔥 PRODUCTOS RELACIONADOS
    if (relacionadosContenedor) {
      const relacionados = productos
        .filter(
          (p) => p.categoria === producto.categoria && p.id !== producto.id,
        )
        .slice(0, 6);

      relacionadosContenedor.innerHTML = relacionados
        .map(
          (p) => `
        <a href="producto.html?id=${p.id}" 
           class="block bg-white rounded-xl p-3 shadow hover:shadow-md transition">
          
          <img src="${p.imagen}" class="w-full h-32 object-cover rounded-lg mb-2">

          <h3 class="text-sm font-semibold text-[#2c1a00]">
            ${p.nombre}
          </h3>

          <p class="text-sm text-[#1a4731] font-bold">
            S/ ${p.precio.toFixed(2)}
          </p>

        </a>
      `,
        )
        .join("");
    }
  } catch (error) {
    console.error(error);
    contenedor.innerHTML = `<p style="color:red;">Error al cargar 😓</p>`;
  }
});
