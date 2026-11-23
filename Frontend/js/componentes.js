'use strict';

import { CREDENCIALES, URL_AUTH } from './config.js';
import { mostrarAviso } from './avisos.js';

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
  actualizarEstadoCuenta();
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
      const respuesta = await enviarCredenciales('registrarse', formRegistro);
      const datos = await respuesta.json().catch(() => ({}));

      if (!respuesta.ok) {
        mensajeRegistro.textContent = datos.error ?? 'No se pudo crear el usuario.';
        return;
      }

      registro.close();
      login.showModal();
      mensajeLogin.textContent = `${datos.mensaje} Ya podés iniciar sesión.`;
    } catch {
      mensajeRegistro.textContent = 'No se pudo conectar con el servidor.';
    }
  });

  const formLogin = login.querySelector('form');
  const mensajeLogin = login.querySelector('.dialogo-cuenta__mensaje');

  formLogin.addEventListener('submit', async (evento) => {
    evento.preventDefault();

    try {
      const respuesta = await enviarCredenciales('login', formLogin);
      const datos = await respuesta.json().catch(() => ({}));

      if (!respuesta.ok) {
        mensajeLogin.textContent = datos.error ?? 'No se pudo iniciar sesión.';
        return;
      }

      // La sesión se refleja en la misma página, sin redirigir.
      login.close();
      await actualizarEstadoCuenta();
      mostrarAviso(datos.mensaje);
    } catch {
      mensajeLogin.textContent = 'No se pudo conectar con el servidor.';
    }
  });

  const botonCerrarSesion = document.getElementById('cerrar-sesion');

  botonCerrarSesion?.addEventListener('click', async () => {
    try {
      const respuesta = await fetch(`${URL_AUTH}/logout`, {
        method: 'POST',
        credentials: CREDENCIALES,
      });
      const datos = await respuesta.json().catch(() => ({}));

      await actualizarEstadoCuenta();
      mostrarAviso(datos.mensaje ?? 'Sesión cerrada.');
    } catch {
      mostrarAviso('No se pudo conectar con el servidor.', true);
    }
  });
}

function enviarCredenciales(ruta, formulario) {
  return fetch(`${URL_AUTH}/${ruta}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: CREDENCIALES,
    body: JSON.stringify({
      email: formulario.elements.email.value,
      pass: formulario.elements.password.value,
    }),
  });
}

// Consulta la sesión y adapta la interfaz: botones de la cuenta y, con la clase
// sesion-activa en el body, las acciones de administración del catálogo.
export async function actualizarEstadoCuenta() {
  const abrirLogin = document.getElementById('abrir-login');
  const cerrarSesion = document.getElementById('cerrar-sesion');
  let autenticado = false;

  try {
    const respuesta = await fetch(`${URL_AUTH}/sesion`, { credentials: CREDENCIALES });
    if (respuesta.ok) {
      const sesion = await respuesta.json();
      autenticado = sesion.autenticado === true;
    }
  } catch {}

  if (abrirLogin) abrirLogin.hidden = autenticado;
  if (cerrarSesion) cerrarSesion.hidden = !autenticado;
  document.body.classList.toggle('sesion-activa', autenticado);

  return autenticado;
}
