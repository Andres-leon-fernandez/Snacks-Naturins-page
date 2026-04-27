document.addEventListener("DOMContentLoaded", async () => {
  const params = new URLSearchParams(window.location.search);
  const idArticulo = params.get("id");
  const contenedor = document.getElementById("detalle-articulo");

  if (!contenedor || !idArticulo) return;

  try {
    const response = await fetch("db/blog.json");
    const articulos = await response.json();
    
    const art = articulos.find(a => a.id === idArticulo);

    if (!art) {
      contenedor.innerHTML = `<p class="text-center py-20">Artículo no encontrado 😢</p>`;
      return;
    }

    // Dibujar el contenido completo del artículo
    contenedor.innerHTML = `
      <div class="max-w-4xl mx-auto space-y-8">
        <nav class="text-sm text-gray-500 mb-8">
          <a href="blog.html" class="hover:text-[#F1860B]">Blog</a> / 
          <span class="capitalize">${art.categoria}</span>
        </nav>

        <img src="${art.imagen}" class="w-full h-[450px] object-cover rounded-[40px] shadow-lg mb-10">

        <div class="flex items-center gap-4 text-gray-500 text-sm mb-4">
          <span class="bg-orange-100 text-[#733702] px-3 py-1 rounded-full font-bold uppercase">${art.categoria}</span>
          <span>${art.fecha}</span>
          <span>•</span>
          <span>Autor: ${art.autor}</span>
        </div>

        <h1 class="font-['Amaranth'] text-4xl md:text-5xl text-[#2c1a00] leading-tight">
          ${art.titulo}
        </h1>

        <div class="prose prose-lg max-w-none text-gray-700 leading-relaxed space-y-6 text-lg">
          ${art.descripcion}
        </div>

        <div class="pt-10 border-t border-orange-100 mt-10">
          <a href="blog.html" class="inline-block bg-[#1a4731] text-white px-8 py-3 rounded-xl hover:bg-[#245e41] transition">
            Volver al Blog
          </a>
        </div>
      </div>
    `;
  } catch (error) {
    console.error("Error al cargar el artículo:", error);
  }
});