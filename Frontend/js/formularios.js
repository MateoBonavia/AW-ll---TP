'use strict';

function crearMensaje(contenedor) {
  const mensaje = document.createElement('p');
  mensaje.className = 'mensaje-formulario';
  mensaje.setAttribute('role', 'status');
  mensaje.setAttribute('aria-live', 'polite');
  contenedor.after(mensaje);
  return mensaje;
}

function mostrarMensaje(mensaje, texto, esError) {
  mensaje.textContent = texto;
  mensaje.classList.toggle('mensaje-formulario--error', esError);
}

function inicializarFormularioContacto() {
  // Se usa la clase BEM del formulario de contacto para no depender de un nombre genérico.
  const formulario = document.querySelector('.contacto-formulario');

  if (!formulario) return;

  const nombre = formulario.querySelector('#full-name');
  const email = formulario.querySelector('#email');
  const consulta = formulario.querySelector('#message');
  const mensaje = crearMensaje(formulario);

  // Se desactiva el aviso nativo para poder mostrar mensajes consistentes con aria-live.
  formulario.noValidate = true;

  formulario.addEventListener('submit', (evento) => {
    // El proyecto es frontend: se valida y confirma sin enviar datos a un servidor.
    evento.preventDefault();

    const nombreValido = nombre.value.trim().length >= 3;
    const emailValido = email.validity.valid;
    const consultaValida = consulta.value.trim().length >= 10;

    nombre.setAttribute('aria-invalid', String(!nombreValido));
    email.setAttribute('aria-invalid', String(!emailValido));
    consulta.setAttribute('aria-invalid', String(!consultaValida));

    if (!nombreValido || !emailValido || !consultaValida) {
      mostrarMensaje(
        mensaje,
        'Completá tu nombre, un email válido y un mensaje de al menos 10 caracteres.',
        true
      );
      return;
    }

    formulario.reset();
    nombre.removeAttribute('aria-invalid');
    email.removeAttribute('aria-invalid');
    consulta.removeAttribute('aria-invalid');
    mostrarMensaje(
      mensaje,
      '¡Gracias! Recibimos tu consulta y te responderemos pronto.',
      false
    );
  });
}

function inicializarNewsletters() {
  const formularios = document.querySelectorAll('footer form');

  formularios.forEach((formulario) => {
    const email = formulario.querySelector("input[type='email']");
    const mensaje = crearMensaje(formulario);

    formulario.noValidate = true;

    formulario.addEventListener('submit', (evento) => {
      // Evita la navegación a ./ y deja una confirmación visible para el usuario.
      evento.preventDefault();

      if (!email.validity.valid) {
        email.setAttribute('aria-invalid', 'true');
        mostrarMensaje(
          mensaje,
          'Ingresá un correo electrónico válido para suscribirte.',
          true
        );
        return;
      }

      formulario.reset();
      email.removeAttribute('aria-invalid');
      mostrarMensaje(mensaje, '¡Listo! Te suscribiste al newsletter.', false);
    });
  });
}

function inicializarBuscadorFaq() {
  const campoBusqueda = document.getElementById('faq-search');

  if (!campoBusqueda) return;

  const formulario = campoBusqueda.closest('form');
  const seccionPreguntas = document.querySelector('.seccion-preguntas');
  const preguntas = seccionPreguntas.querySelectorAll('details');
  const mensaje = document.createElement('div');
  mensaje.className = 'faq-search__empty';
  mensaje.setAttribute('role', 'status');
  mensaje.setAttribute('aria-live', 'polite');
  mensaje.hidden = true;
  mensaje.innerHTML = '<strong>No encontramos preguntas con esa búsqueda.</strong><span>Probá con envío, cambios o pagos.</span>';

  // El estado vacío queda dentro de la sección para conservar la alineación visual.
  seccionPreguntas.appendChild(mensaje);

  function filtrarPreguntas() {
    const textoBuscado = campoBusqueda.value.trim().toLowerCase();
    let cantidadCoincidencias = 0;

    preguntas.forEach((pregunta) => {
      const coincide = pregunta.textContent
        .toLowerCase()
        .includes(textoBuscado);
      pregunta.hidden = !coincide;
      if (coincide) cantidadCoincidencias += 1;
    });

    if (textoBuscado && cantidadCoincidencias === 0) {
      mensaje.hidden = false;
    } else {
      // Si hay coincidencias, las preguntas visibles ya son la respuesta al usuario.
      mensaje.hidden = true;
    }
  }

  campoBusqueda.addEventListener('input', filtrarPreguntas);
  formulario.addEventListener('submit', (evento) => {
    // Permite usar Enter sin provocar una recarga de la página.
    evento.preventDefault();
    filtrarPreguntas();
  });
}

export function inicializarFormularios() {
  inicializarFormularioContacto();
  inicializarNewsletters();
  inicializarBuscadorFaq();
}
