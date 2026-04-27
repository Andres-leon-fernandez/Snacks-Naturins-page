document.addEventListener("DOMContentLoaded", () => {
    const contenedor = document.getElementById("detalle-articulo");

    // 1. Obtener el ID del artículo desde la URL (ej: blogarticulo.html?id=1)
    const params = new URLSearchParams(window.location.search);
    const postId = params.get("id");

    if (!postId) {
        contenedor.innerHTML = `<p class="text-center text-[#733702]">Artículo no encontrado.</p>`;
        return;
    }

    // 2. Cargar el JSON (usando la ruta relativa corregida)
    fetch("./db/blog.json")
        .then(res => {
            if (!res.ok) throw new Error("No se pudo cargar la base de datos");
            return res.json();
        })
        .then(articulos => {
            // 3. Buscar el artículo específico
            const art = articulos.find(a => a.id == postId);

            if (art) {
                renderizarArticulo(art);
            } else {
                contenedor.innerHTML = `<p class="text-center text-[#733702]">El artículo solicitado no existe.</p>`;
            }
        })
        .catch(err => {
            console.error(err);
            contenedor.innerHTML = `<p class="text-center text-red-500">Error al cargar la información.</p>`;
        });

    function renderizarArticulo(art) {
        contenedor.innerHTML = `
        <div class="max-w-6xl mx-auto">
            <a href="blog.html" class="inline-flex items-center text-[#F1860B] font-bold text-sm uppercase tracking-wider mb-8 hover:translate-x-[-5px] transition-transform">
               <i class="fa-solid fa-arrow-left mr-2"></i> Volver al blog
            </a>

            <div class="grid grid-cols-1 lg:grid-cols-3 gap-12">
                
                <div class="lg:col-span-2">
                    <header class="mb-8">
                        <span class="bg-[#F1860B] text-white px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-md">
                            ${art.categoria}
                        </span>
                        <h1 class="font-['Amaranth'] text-4xl md:text-5xl text-[#733702] mt-6 mb-4 leading-tight">
                            ${art.titulo}
                        </h1>
                        <div class="flex items-center gap-4 text-sm text-gray-500 font-medium">
                            <span><i class="fa-regular fa-calendar mr-1"></i> ${art.fecha}</span>
                            <span class="text-orange-300">•</span>
                            <span class="text-[#733702] font-bold uppercase text-[11px]">Por ${art.autor}</span>
                        </div>
                    </header>

                    <div class="rounded-[40px] overflow-hidden shadow-xl mb-10 border-4 border-white">
                        <img src="${art.imagen}" alt="${art.titulo}" class="w-full h-auto object-cover max-h-[500px]">
                    </div>

                    <div class="prose prose-orange max-w-none text-gray-700 leading-relaxed text-lg bg-white p-8 md:p-12 rounded-[40px] shadow-sm border border-orange-50">
                        <p class="first-letter:text-5xl first-letter:font-bold first-letter:text-[#F1860B] first-letter:mr-3 first-letter:float-left">
                            ${art.descripcion}
                        </p>
                    </div>
                </div>

                <aside class="space-y-8">
                    <div class="bg-[#F1860B]/5 border-2 border-[#F1860B]/20 p-8 rounded-[40px] text-center">
                        <h3 class="font-['Amaranth'] text-2xl text-[#733702] mb-4">¡Pruébalos hoy!</h3>
                        <div class="bg-white rounded-full p-4 mb-4 shadow-inner">
                             <img src="img/Naturins-logo-mobile.svg" class="h-20 mx-auto opacity-80" alt="Logo Naturins">
                        </div>
                        <p class="text-sm text-gray-600 mb-6 font-medium italic">Encuentra estos sabores naturales en nuestra tienda.</p>
                        <a href="productos.html" class="block w-full bg-[#F1860B] text-white py-3 rounded-full font-bold uppercase tracking-widest hover:bg-[#733702] transition-colors shadow-lg">
                            Ver Productos
                        </a>
                    </div>

<div class="bg-[#733702] p-8 rounded-[40px] text-center text-white">
    <p class="font-['Amaranth'] text-lg mb-4 text-white">Comparte bienestar</p>
    <div class="flex justify-center gap-4">
        <a href="https://www.facebook.com/sharer/sharer.php?u=${window.location.href}" 
           target="_blank" 
           class="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-[#F1860B] transition-all">
           <i class="fa-brands fa-facebook-f text-white"></i>
        </a>
        
        <a href="https://api.whatsapp.com/send?text=Mira este artículo de Naturins: ${window.location.href}" 
           target="_blank" 
           class="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-[#F1860B] transition-all">
           <i class="fa-brands fa-whatsapp text-white"></i>
        </a>

        <button onclick="navigator.clipboard.writeText(window.location.href); alert('Enlace copiado');" 
                class="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-[#F1860B] transition-all">
           <i class="fa-solid fa-link text-white"></i>
        </button>
    </div>
</div>

                    
                </aside>

            </div>
        </div>
    `;
    }
});