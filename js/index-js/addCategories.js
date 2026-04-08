document.addEventListener("DOMContentLoaded", () => {
  const contenedor = document.getElementById("categorias-container");

  let categoriasGlobal = [];

  if (!contenedor) {
    console.error("No se encontró el contenedor de categorías");
    return;
  }

  function renderizarCategorias(categorias) {
    contenedor.innerHTML = "";

    if (categorias.length === 0) {
      contenedor.innerHTML = "<p>No se encontraron categorías 😕</p>";
      return;
    }

    categorias.forEach((cat) => {
      const item = document.createElement("a");

      item.href = cat.link;
      item.className =
        "group flex flex-col items-center p-6 no-underline transition-all duration-300 hover:-translate-y-1 hover:scale-105";

      item.innerHTML = `
        <div class="relative flex items-center justify-center">
          
          <div
            class="absolute w-32 h-32 rounded-full bg-[#F1860B]/20 scale-100 group-hover:scale-150 opacity-0 group-hover:opacity-100 transition-all duration-300">
          </div>

          <img src="${cat.imagen}" alt="${cat.nombre}"
            class="w-28 h-28 object-cover rounded-full border-4 border-[#F2B707] group-hover:scale-110 transition duration-300 z-10 shadow-md group-hover:shadow-lg group-hover:shadow-[#F1860B]/20" />
        </div>

        <p class="mt-4 text-sm font-semibold text-[#733702] group-hover:text-[#F1860B] text-center">
          ${cat.nombre}
        </p>
      `;

      contenedor.appendChild(item);
    });
  }

  // 🔹 Cargar JSON
  fetch("db/categories.json")
    .then((response) => {
      if (!response.ok) {
        throw new Error("No se pudo cargar el JSON de categorías.");
      }
      return response.json();
    })
    .then((categorias) => {
      categoriasGlobal = categorias;
      renderizarCategorias(categoriasGlobal);
    })
    .catch((error) => {
      console.error("Error al cargar categorías:", error);
      contenedor.innerHTML =
        "<p style='color:red;'>No se pudieron cargar las categorías 😢</p>";
    });
});
