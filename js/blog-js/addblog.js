document.addEventListener("DOMContentLoaded", () => {
  const contenedor = document.getElementById("grid-blog");
  const botonesFiltro = document.querySelectorAll(".filter-btn");
  
  if (!contenedor) return;

  let articulosGlobal = [];

  // Función para crear la tarjeta visual (Grid)
  function crearCardBlog(art) {
    const item = document.createElement("div");
    item.className = "h-full";
    item.innerHTML = `
      <article class="group flex h-full flex-col overflow-hidden rounded-[30px] bg-white shadow-sm hover:shadow-xl transition-all duration-300 border border-orange-50">
        <div class="relative overflow-hidden aspect-[16/10]">
          <img src="${art.imagen}" alt="${art.titulo}" class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
          <span class="absolute top-4 left-4 bg-[#F1860B] text-white px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-lg">
            ${art.categoria}
          </span>
        </div>
        <div class="p-6 flex flex-col flex-1">
          <div class="flex items-center gap-2 mb-3">
             <span class="text-[10px] text-gray-400 font-bold uppercase tracking-widest">${art.fecha}</span>
             <span class="text-gray-300">•</span>
             <span class="text-[10px] text-[#733702] font-bold uppercase tracking-widest">Por ${art.autor}</span>
          </div>
          <h2 class="font-['Amaranth'] text-2xl text-[#733702] mb-3 group-hover:text-[#F1860B] transition-colors leading-tight">
            ${art.titulo}
          </h2>
          <p class="text-gray-600 text-sm leading-relaxed mb-6 line-clamp-3">
            ${art.resumen}
          </p>
          <div class="mt-auto pt-4 border-t border-orange-50">
            <a href="blogarticulo.html?id=${art.id}" class="inline-flex items-center text-[#F1860B] font-bold text-xs uppercase tracking-wider group/link hover:gap-2 transition-all">
              Leer artículo completo →
            </a>
          </div>
        </div>
      </article>`;
    return item;
  }

  function renderizar(lista) {
    contenedor.innerHTML = "";
    lista.forEach(art => contenedor.appendChild(crearCardBlog(art)));
  }

  // Cargar datos del JSON
  fetch("./db/blog.json")
    .then(res => res.json())
    .then(datos => {
      articulosGlobal = datos;
      renderizar(articulosGlobal);
    })
    .catch(err => console.error("Error al cargar blog.json:", err));

  // --- LÓGICA DE FILTROS (EL CAMBIO DE COLOR QUE BUSCAS) ---
// --- LÓGICA DE FILTROS ---
  botonesFiltro.forEach(btn => {
    btn.addEventListener("click", () => {
      // 1. Resetear todos los botones: Fondo blanco, borde marrón suave y letra marrón
      botonesFiltro.forEach(b => {
        b.classList.remove("bg-[#F1860B]", "text-white", "shadow-md");
        b.classList.add("bg-white", "text-[#733702]", "border-2", "border-[#733702]/20"); 
      });
      
      // 2. Aplicar estado seleccionado: Fondo naranja, letra blanca, sin borde oscuro
      btn.classList.remove("bg-white", "text-[#733702]", "border-[#733702]/20");
      btn.classList.add("bg-[#F1860B]", "text-white", "shadow-md", "border-transparent");
      
      const cat = btn.dataset.categoria;
      const filtrados = cat === "todos" 
        ? articulosGlobal 
        : articulosGlobal.filter(a => a.categoria === cat);
      renderizar(filtrados);
    });
  });
});