'use strict';

export async function cargarHeader() {
  const contenedor = document.getElementById('header-container');

  if (!contenedor) return;

  const respuesta = await fetch('./componentes/header.html');

  if (!respuesta.ok) {
    throw new Error('No se pudo cargar el header.');
  }

  contenedor.innerHTML = await respuesta.text();
  marcarPaginaActual();
  inicializarMenuMovil();
  inicializarDialogosCuenta();
  mostrarEstadoCuenta();
}

export async function cargarFooter() {
  const contenedor = document.getElementById('footer-container');

  if (!contenedor) return;

  const respuesta = await fetch('./componentes/footer.html');

  if (!respuesta.ok) {
    throw new Error('No se pudo cargar el footer.');
  }

  contenedor.innerHTML = await respuesta.text();
}

function marcarPaginaActual() {
  const paginaActual =
    window.location.pathname.split('/').pop() || 'index.html';
  const enlaces = document.querySelectorAll('#header-container nav ul a');

  enlaces.forEach((enlace) => {
    if (enlace.getAttribute('href') === paginaActual) {
      enlace.setAttribute('aria-current', 'page');
    }
  });
}

function inicializarMenuMovil() {
  const botonMenu = document.querySelector('#header-container .hamburger-menu');
  const listaMenu = document.querySelector('#header-container nav ul');

  if (!botonMenu || !listaMenu) return;

  botonMenu.addEventListener('click', () => {
    listaMenu.classList.toggle('active');
  });
}

function inicializarDialogosCuenta() {
  const login = document.getElementById('dialogo-login');
  const registro = document.getElementById('dialogo-registro');
  const abrirLogin = document.getElementById('abrir-login');
  const abrirRegistro = document.getElementById('abrir-registro');
  const volverLogin = document.getElementById('volver-login');

  if (!login || !registro || !abrirLogin) return;

  abrirLogin.addEventListener('click', () => login.showModal());
  abrirRegistro.addEventListener('click', () => {
    login.close();
    registro.showModal();
  });
  volverLogin.addEventListener('click', () => {
    registro.close();
    login.showModal();
  });

  for (const dialogo of [login, registro]) {
    dialogo
      .querySelector('[data-cerrar-cuenta]')
      .addEventListener('click', () => dialogo.close());
    dialogo.addEventListener('click', (evento) => {
      if (evento.target === dialogo) dialogo.close();
    });
    dialogo.addEventListener('close', () => {
      dialogo.querySelector('form').reset();
      dialogo.querySelector('.dialogo-cuenta__mensaje').textContent = '';
    });
  }

  const formRegistro = registro.querySelector('form');
  const mensajeRegistro = registro.querySelector('.dialogo-cuenta__mensaje');

  formRegistro.addEventListener('submit', async (evento) => {
    evento.preventDefault();

    try {
      const respuesta = await fetch('/api/v1/registrarse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formRegistro.elements.email.value,
          pass: formRegistro.elements.password.value,
        }),
      });

      const datos = await respuesta.json();

      registro.close();
      login.showModal();
    } catch {
      mensajeRegistro.textContent = 'No se pudo conectar con el servidor.';
    }
  });

  const formLogin = login.querySelector('form');
  const mensajeLogin = login.querySelector('.dialogo-cuenta__mensaje');

  formLogin.addEventListener('submit', async (evento) => {
    evento.preventDefault();

    const respuesta = await fetch('/api/v1/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: formLogin.elements.email.value,
        pass: formLogin.elements.password.value,
      }),
    });

    if (respuesta.ok) {
      window.location.href = '/';
    } else {
      mensajeLogin.textContent = 'No se pudo iniciar sesión.';
    }
  });
}

async function mostrarEstadoCuenta() {
  const abrirLogin = document.getElementById('abrir-login');
  const cerrarSesion = document.getElementById('cerrar-sesion');
  let autenticado = false;

  try {
    const respuesta = await fetch('/api/v1/sesion');
    if (respuesta.ok) {
      const sesion = await respuesta.json();
      autenticado = sesion.autenticado === true;
    }
  } catch {}

  abrirLogin.hidden = autenticado;
  cerrarSesion.hidden = !autenticado;
}
