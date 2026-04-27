// --- CONTROL DEL MENÚ HAMBURGUESA ---
document.addEventListener("DOMContentLoaded", () => {
    // 1. Capturamos los elementos
    const btnOpen = document.getElementById('menu-toggle');
    const btnClose = document.getElementById('menu-close');
    const sidebar = document.getElementById('sidebar-menu');
    const overlay = document.getElementById('menu-overlay');

    // 2. Definimos la función para abrir/cerrar
    function toggleMenu() {
        if (!sidebar || !overlay) return; // Seguridad por si los IDs cambian
        
        sidebar.classList.toggle('-translate-x-full');
        overlay.classList.toggle('opacity-0');
        overlay.classList.toggle('pointer-events-none');
        document.body.classList.toggle('overflow-hidden');
    }

    // 3. Asignamos los eventos de clic
    if (btnOpen) {
        btnOpen.addEventListener('click', (e) => {
            e.preventDefault();
            toggleMenu();
        });
    }

    if (btnClose) btnClose.addEventListener('click', toggleMenu);
    if (overlay) overlay.addEventListener('click', toggleMenu);
});