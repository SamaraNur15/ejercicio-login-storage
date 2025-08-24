// Esta es la base de datos de nuestros usuarios
const baseDeDatos = {
  usuarios: [
    {
      id: 1,
      name: "Steve Jobs",
      email: "steve@jobs.com",
      password: "Steve123",
    },
    {
      id: 2,
      name: "Ervin Howell",
      email: "shanna@melissa.tv",
      password: "Ervin345",
    },
    {
      id: 3,
      name: "Clementine Bauch",
      email: "nathan@yesenia.net",
      password: "Floppy39876",
    },
    {
      id: 4,
      name: "Patricia Lebsack",
      email: "julianne.oconner@kory.org",
      password: "MysuperPassword345",
    },
  ],
};

// ACTIVIDAD

// Paso a paso:

// 1) Al momento de que la persona inicia sesión, si las validaciones que ya tenemos implementadas
// han sido exitosas, deberemos almacenar la información del usuario en el LocalStorage.

// ===== Selección de elementos =====
const loginBtn = document.querySelector(".login-btn");
const emailInput = document.getElementById("email-input");
const passwordInput = document.getElementById("password-input");
const loader = document.getElementById("loader");
const errorContainer = document.getElementById("error-container");
const STORAGE_KEY = "authUser";

// ===== Helpers =====
function sleep(ms = 3000) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
function isValidEmail(value = "") {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(value).toLowerCase());
}
function hasMinLength(value = "", min = 5) {
  return value.length >= min;
}
function findUserByEmailAndPassword(email, password) {
  return (
    baseDeDatos.usuarios.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    ) || null
  );
}

let isSubmitting = false;
let currentUser = null;

function handleLogout() {
  // 1) borrar sesión
  localStorage.removeItem(STORAGE_KEY);

  // 2) mostrar mensaje
  const main = document.querySelector("main");
  const msg = document.createElement("p");
  msg.textContent = "Sesión cerrada. Redirigiendo al login…";
  msg.style.marginTop = "1rem";
  main.appendChild(msg);

  // 3) recargar
  setTimeout(() => {
    window.location.reload();
  }, 1000);
}

// ===== Manejador del click =====
async function handleLoginClick() {
  if (isSubmitting) return;
  isSubmitting = true;

  console.clear();
  console.log('[Paso 2-3] Click detectado, simulando petición de 3s...');

  // UI: limpiar error + mostrar loader
  errorContainer.textContent = "";
  errorContainer.classList.add("hidden");
  loader.classList.remove("hidden");
  const originalBtnText = loginBtn.textContent;
  loginBtn.disabled = true;
  loginBtn.textContent = "Procesando...";

  // Capturar valores actuales del form
  const email = (emailInput.value || "").trim();
  const password = passwordInput.value || "";

  // Simular espera de “servidor”
  await sleep(3000);

  // ===== PASO 4: VALIDACIONES (ahora SÍ dentro del handler) =====
  const emailOk = isValidEmail(email);
  const passOk = hasMinLength(password, 5);
  const user = emailOk && passOk ? findUserByEmailAndPassword(email, password) : null;
  const credsOk = !!user;

  console.log("[Paso 4] emailOk:", emailOk, "| passOk:", passOk, "| user:", user?.name ?? null);

  if (!credsOk) {
    errorContainer.innerHTML = "<small>Alguno de los datos ingresados son incorrectos</small>";
    errorContainer.classList.remove("hidden");
  } 
  else {
    currentUser = user;
    // ✅ Guardar SOLO lo necesario (sin password)
    const sessionUser = {
      id: currentUser.id,
      name: currentUser.name,
      email: currentUser.email,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessionUser));
    console.log("[Paso 1] Sesión almacenada en localStorage:", sessionUser);

    console.log(`[Paso 4] Validaciones OK. Usuario: ${currentUser.name}`);

    const form = document.querySelector("form");
    const main = document.querySelector("main");

    // Ocultamos el formulario
    form.classList.add("hidden");

    // Render de bienvenida con botón “Cerrar sesión”
    const welcome = document.createElement("div");
    welcome.id = "welcome";
    welcome.innerHTML = `
      <h1>Bienvenido al sitio 😀</h1>
      <p>¡Hola, <strong>${currentUser.name}</strong>! Ingresaste como <em>${currentUser.email}</em>.</p>
      <button id="logout-btn" type="button" class="logout-btn">Cerrar sesión</button>
    `;

    
    welcome.style.marginTop = "1.5rem";

    main.appendChild(welcome);
    const logoutBtn = document.getElementById("logout-btn");
    logoutBtn.addEventListener("click", handleLogout);
  }


  // Restaurar UI
  loader.classList.add("hidden");
  loginBtn.disabled = false;
  loginBtn.textContent = originalBtnText;

  console.log('[Paso 2-3] Demora finalizada ✅ (validaciones ejecutadas)');
  isSubmitting = false;
}

// Registrar listener
loginBtn.addEventListener("click", handleLoginClick);
// 2) Al mensaje de bienvenida que ya teníamos implementado, deberemos agregarle el nombre de la
// persona y un botón de "Cerrar Sesión".

// 3) Una vez iniciada la sesión, la misma se deberá mantener en ese estado para el caso de que la persona
// recargue la página. Para ello, deberás validar si existe información del usuario al momento en
// que se produce la carga de la página, y en base a dicha condción decidir que elementos mostrar.
// ===== Paso 3: Mantener sesión iniciada =====
window.addEventListener("DOMContentLoaded", () => {
  const savedUser = localStorage.getItem(STORAGE_KEY);

  if (savedUser) {
    const user = JSON.parse(savedUser);
    currentUser = user; // restauramos al usuario logueado

    const form = document.querySelector("form");
    const main = document.querySelector("main");

    // Ocultamos el formulario
    form.classList.add("hidden");

    // Render de bienvenida igual que en el Paso 2
    const welcome = document.createElement("div");
    welcome.id = "welcome";
    welcome.innerHTML = `
      <h1>Bienvenido al sitio 😀</h1>
      <p>¡Hola, <strong>${user.name}</strong>! Ingresaste como <em>${user.email}</em>.</p>
      <button id="logout-btn" type="button" class="logout-btn">Cerrar sesión</button>
    `;

    welcome.style.marginTop = "1.5rem";

    main.appendChild(welcome);
  }
});
// 3) Para el caso de que la persona haga click en el botón "Cerrar Sesión", se deberá eliminar
// la información del usuario, mostrar un mensaje indicando que se ha cerrado la sesión, y recargar
// la página para mostrar nuevamente el formulario de login.

/* 
TIPS:
  - Para lograr los objetivos de este ejercicio, deberás valerte de algunos eventos y métodos que vimos en
    las clases anteriores. Te invitamos a que revises los recursos en caso de que tengas dudas, ya que allí
    encontrarás todas las respuestas que necesitas para completar la actividad.

  - Recuerda que puedes seleccionar y manipular los elementos del archivo index.html, usando los
    recursos que Javascript te ofrece para ello. Además, en el archivo styles.css tiene algunas clases y 
    estilos predefinidos para ayudarte a completar la actividad.

  - Al momento de guardar información del usuario en el navegador, recuerda que debemos almacenar solo la 
    información necesaria, y EN NINGUN CASO DEBEMOS GUARDAR LA CONTRASEÑA. Por ello, deberás seleccionar y
    separar la información que tienes que almacenar, a partir del objeto que contiene la información del 
    usuario.

   ¡Manos a la obra!
 */
