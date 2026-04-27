// ────────────────────────────────────────
//  SISTEMA DE LOGIN (patrón similar al carrito)
// ────────────────────────────────────────

// Usuarios válidos
const USUARIOS_VALIDOS = [
  {usuario: "admin", password: "1234", nombre: "Administrador"},
  {usuario: "usuario", password: "1234", nombre: "Usuario"},
];

// Inicializar cuando el DOM esté cargado
document.addEventListener("DOMContentLoaded", () => {
  initLogin();
});

// ────────────────────────────────────────
//  FUNCIONES PRINCIPALES
// ────────────────────────────────────────

function initLogin() {
  const btnLogin = document.getElementById("btn-login");

  if (!btnLogin) return;

  // Verificar si hay sesión activa
  const sesion = obtenerSesion();

  if (sesion && sesion.activa) {
    mostrarUsuarioLogueado(sesion.nombre);
  } else {
    configurarBtnLogin(btnLogin);
  }
}

function obtenerSesion() {
  return JSON.parse(localStorage.getItem("sesion")) || null;
}

function guardarSesion(sesion) {
  localStorage.setItem("sesion", JSON.stringify(sesion));
}

function cerrarSesionStorage() {
  localStorage.removeItem("sesion");
}

// ────────────────────────────────────────
//  CONFIGURACIÓN DEL BOTÓN LOGIN
// ────────────────────────────────────────

function configurarBtnLogin(btn) {
  btn.addEventListener("click", () => {
    abrirModalLogin();
  });
}

// ────────────────────────────────────────
//  MODAL DE LOGIN
// ────────────────────────────────────────

function abrirModalLogin() {
  let modal = document.getElementById("modal-login");

  if (!modal) {
    modal = crearModalLogin();
  }

  document.body.appendChild(modal);
  modal.classList.remove("hidden");

  setTimeout(() => {
    document.getElementById("login-usuario")?.focus();
  }, 100);
}

function crearModalLogin() {
  const modal = document.createElement("div");
  modal.id = "modal-login";
  modal.className =
    "hidden fixed inset-0 bg-black/50 z-[100] flex items-center justify-center";

  modal.innerHTML = `
    <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden transform transition-all">
      <!-- Header -->
      <div class="bg-[#733702] px-6 py-4 flex items-center justify-between">
        <h3 class="text-white text-lg font-bold font-['Amaranth']">Iniciar Sesión</h3>
        <button id="login-cerrar" class="text-white/80 hover:text-white text-2xl font-bold cursor-pointer transition">
          &times;
        </button>
      </div>
      
      <!-- Formulario -->
      <form id="login-form" class="p-6 space-y-4">
        <div>
          <label class="block text-sm font-semibold text-[#733702] mb-2">
            <i class="fa-solid fa-user mr-2"></i>Usuario
          </label>
          <input 
            type="text" 
            id="login-usuario" 
            name="usuario"
            placeholder="Ingresa tu usuario"
            class="w-full px-4 py-3 border-[1.5px] border-[#e0d0c0] rounded-lg focus:border-[#F1860B] focus:ring-2 focus:ring-[#F1860B]/20 outline-none transition text-[#2c1a00]"
            required
            autocomplete="username"
          />
        </div>
        
        <div>
          <label class="block text-sm font-semibold text-[#733702] mb-2">
            <i class="fa-solid fa-lock mr-2"></i>Contraseña
          </label>
          <input 
            type="password" 
            id="login-password" 
            name="password"
            placeholder="Ingresa tu contraseña"
            class="w-full px-4 py-3 border-[1.5px] border-[#e0d0c0] rounded-lg focus:border-[#F1860B] focus:ring-2 focus:ring-[#F1860B]/20 outline-none transition text-[#2c1a00]"
            required
            autocomplete="current-password"
          />
        </div>
        
        <!-- Mensaje de error -->
        <div id="login-error" class="hidden bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg">
          <i class="fa-solid fa-circle-exclamation mr-2"></i>
          <span>Usuario o contraseña incorrectos</span>
        </div>
        
        <!-- Botón -->
        <button 
          type="submit"
          class="w-full bg-[#E52619] hover:bg-red-700 text-white py-3 rounded-lg font-semibold transition cursor-pointer"
        >
          <i class="fa-solid fa-right-to-bracket mr-2"></i>Ingresar
        </button>
        
        <!-- Info -->
        <p class="text-xs text-gray-400 text-center mt-4">
          Usuarios de prueba: <strong>admin</strong> o <strong>usuario</strong><br/>
          Contraseña: <strong>1234</strong>
        </p>
      </form>
    </div>
  `;

  // Eventos
  modal
    .querySelector("#login-cerrar")
    .addEventListener("click", cerrarModalLogin);
  modal.querySelector("#login-form").addEventListener("submit", manejarLogin);

  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      cerrarModalLogin();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !modal.classList.contains("hidden")) {
      cerrarModalLogin();
    }
  });

  return modal;
}

function cerrarModalLogin() {
  const modal = document.getElementById("modal-login");
  if (modal) {
    modal.classList.add("hidden");
    setTimeout(() => modal.remove(), 150);
  }
  const error = document.getElementById("login-error");
  if (error) error.classList.add("hidden");
}

// ────────────────────────────────────────
//  MANEJO DEL LOGIN
// ────────────────────────────────────────

function manejarLogin(e) {
  e.preventDefault();

  const usuarioInput = document.getElementById("login-usuario");
  const passwordInput = document.getElementById("login-password");
  const errorDiv = document.getElementById("login-error");

  const usuario = usuarioInput.value.trim();
  const password = passwordInput.value;

  // Validar campos vacíos
  if (!usuario || !password) {
    errorDiv.innerHTML = `
      <i class="fa-solid fa-circle-exclamation mr-2"></i>
      <span>Por favor, complete todos los campos</span>
    `;
    errorDiv.classList.remove("hidden");
    errorDiv.classList.add("animate-pulse");
    return;
  }

  // Buscar usuario válido
  const usuarioValido = USUARIOS_VALIDOS.find(
    (u) => u.usuario === usuario && u.password === password,
  );

  if (usuarioValido) {
    // Guardar sesión
    const sesion = {
      activa: true,
      usuario: usuarioValido.usuario,
      nombre: usuarioValido.nombre,
      fecha: new Date().toISOString(),
    };
    guardarSesion(sesion);

    // Limpiar formulario
    usuarioInput.value = "";
    passwordInput.value = "";

    // Cerrar modal
    cerrarModalLogin();

    // Actualizar UI
    mostrarUsuarioLogueado(usuarioValido.nombre);

    // Mostrar mensaje
    mostrarNotificacion("¡Bienvenido, " + usuarioValido.nombre + "!");
  } else {
    errorDiv.innerHTML = `
      <i class="fa-solid fa-circle-exclamation mr-2"></i>
      <span>Usuario o contraseña incorrectos</span>
    `;
    errorDiv.classList.remove("hidden");
    errorDiv.classList.add("animate-pulse");
  }
}

// ────────────────────────────────────────
//  UI DE USUARIO LOGUEADO
// ────────────────────────────────────────

function mostrarUsuarioLogueado(nombre) {
  const btnLogin = document.getElementById("btn-login");
  if (!btnLogin) return;

  btnLogin.outerHTML = `
    <div id="usuario-logueado" class="flex items-center gap-3">
      <!-- Avatar con inicial -->
      <div class="w-10 h-10 rounded-full bg-gradient-to-br from-[#E52619] to-[#733702] flex items-center justify-center text-white font-bold text-sm shadow-md">
        ${nombre.charAt(0).toUpperCase()}
      </div>
      
      <!-- Nombre y botón logout -->
      <div class="flex flex-col">
        <span class="text-sm font-semibold text-[#733702]">${nombre}</span>
        <button 
          id="btn-logout" 
          class="text-xs text-red-600 hover:text-red-800 font-medium text-left"
        >
          <i class="fa-solid fa-right-from-bracket mr-1"></i>Cerrar sesión
        </button>
      </div>
    </div>
  `;

  document
    .getElementById("btn-logout")
    ?.addEventListener("click", cerrarSesion);
}

function cerrarSesion() {
  cerrarSesionStorage();

  const usuarioLogueado = document.getElementById("usuario-logueado");
  if (usuarioLogueado) {
    usuarioLogueado.outerHTML = `
      <button id="btn-login" type="button"
        class="text-sm font-semibold text-[#E52619] border-[1.5px] border-[#E52619] rounded-full px-4 py-2 hover:bg-[#E52619] hover:text-white transition cursor-pointer">
        Iniciar sesión
      </button>
    `;
    initLogin();
  }

  mostrarNotificacion("Sesión cerrada correctamente");
}

// ────────────────────────────────────────
//  NOTIFICACIONES
// ────────────────────────────────────────

function mostrarNotificacion(mensaje) {
  const notificacion = document.createElement("div");
  notificacion.className =
    "fixed bottom-4 right-4 bg-[#1a4731] text-white px-6 py-3 rounded-lg shadow-lg z-[150] transform transition-all duration-300 translate-y-20 opacity-0";
  notificacion.innerHTML = `
    <div class="flex items-center gap-2">
      <i class="fa-solid fa-circle-check text-green-400"></i>
      <span class="font-medium text-sm">${mensaje}</span>
    </div>
  `;

  document.body.appendChild(notificacion);

  setTimeout(() => {
    notificacion.classList.remove("translate-y-20", "opacity-0");
  }, 10);

  setTimeout(() => {
    notificacion.classList.add("translate-y-20", "opacity-0");
    setTimeout(() => notificacion.remove(), 300);
  }, 2500);
}
