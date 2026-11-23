'use strict';

// Avisos dentro de la interfaz: reemplazan a alert() para informar al usuario
// el resultado de cada acción sin bloquear la página.
const DURACION_AVISO = 4000;

function obtenerContenedor() {
  let contenedor = document.getElementById('avisos');

  if (!contenedor) {
    contenedor = document.createElement('div');
    contenedor.id = 'avisos';
    contenedor.className = 'avisos';
    contenedor.setAttribute('role', 'status');
    contenedor.setAttribute('aria-live', 'polite');
    document.body.appendChild(contenedor);
  }

  return contenedor;
}

export function mostrarAviso(texto, esError = false) {
  const aviso = document.createElement('p');
  aviso.className = esError ? 'aviso aviso--error' : 'aviso';
  aviso.textContent = texto;

  obtenerContenedor().appendChild(aviso);
  setTimeout(() => aviso.remove(), DURACION_AVISO);
}

// Muestra un mensaje dentro de un diálogo (por ejemplo, un error de validación).
export function mostrarMensajeEnDialogo(dialogo, texto, esError = true) {
  const mensaje = dialogo?.querySelector('[data-mensaje]');
  if (!mensaje) return;

  mensaje.textContent = texto;
  mensaje.classList.toggle('mensaje-formulario--error', esError);
}
