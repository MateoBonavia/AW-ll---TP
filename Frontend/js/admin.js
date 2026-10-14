'use strict';

// Copia de la lista del catálogo para buscar el producto desde los botones de cada tarjeta.
let productosAdmin = [];

function abrirDialogo(dialogo) {
  if (!dialogo) return;

  // showModal ofrece un diálogo accesible; open es una alternativa simple.
  if (typeof dialogo.showModal === 'function') {
    dialogo.showModal();
  } else {
    dialogo.setAttribute('open', '');
  }
}

function cerrarDialogo(dialogo) {
  if (!dialogo) return;

  if (typeof dialogo.close === 'function') {
    dialogo.close();
  } else {
    dialogo.removeAttribute('open');
  }
}

function abrirConfirmacion(producto) {
  const dialogo = document.getElementById('dialogo-confirmar-eliminacion');
  const nombre = document.getElementById('nombre-producto-eliminacion');

  if (nombre) {
    nombre.textContent = producto.nombre;
  }

  abrirDialogo(dialogo);
}

function abrirEdicion(producto) {
  const dialogo = document.getElementById('dialogo-editar-producto');
  const formulario = document.getElementById('form-editar-producto');

  if (formulario) {
    // Carga los datos actuales del producto en cada campo del formulario.
    formulario.elements.namedItem('nombre').value = producto.nombre;
    formulario.elements.namedItem('precio').value = producto.precio;
    formulario.elements.namedItem('descripcion').value = producto.descripcion;
    formulario.elements.namedItem('etiqueta').value = producto.etiqueta ?? '';
    formulario.elements.namedItem('anio').value = producto['año'] ?? '';
    // El input file no admite precargar archivos por seguridad del navegador.
    formulario.elements.namedItem('imagenes').value = '';
  }

  abrirDialogo(dialogo);
}

function abrirCreacion() {
  const dialogo = document.getElementById('dialogo-crear-producto');
  const formulario = document.getElementById('form-crear-producto');

  // Limpia los campos por si el formulario se usó antes y se canceló.
  if (formulario) {
    formulario.reset();
  }

  abrirDialogo(dialogo);
}

export function inicializarAccionesCatalogo(productos) {
  productosAdmin = productos;

  const contenedor = document.getElementById('contenedor-tarjetas');
  const dialogoConfirmacion = document.getElementById('dialogo-confirmar-eliminacion');
  const dialogoEdicion = document.getElementById('dialogo-editar-producto');
  const dialogoCreacion = document.getElementById('dialogo-crear-producto');
  const formularioEdicion = document.getElementById('form-editar-producto');
  const formularioCreacion = document.getElementById('form-crear-producto');
  const botonConfirmarEliminacion = document.getElementById('confirmar-eliminacion');
  const botonCrearProducto = document.getElementById('crear-producto');

  // Un único listener gestiona los botones de todas las tarjetas, incluso tras un filtro.
  if (contenedor) {
    contenedor.addEventListener('click', (evento) => {
      const accion = evento.target.closest('[data-accion]');

      // La tarjeta es un enlace al detalle: la acción propia no debe navegar.
      if (!accion) return;

      evento.preventDefault();

      const producto = productosAdmin.find(
        (item) => String(item.id) === accion.dataset.id
      );

      if (!producto) return;

      if (accion.dataset.accion === 'eliminar') abrirConfirmacion(producto);
      if (accion.dataset.accion === 'editar') abrirEdicion(producto);
    });
  }

  // Los botones marcados con data-cerrar cierran el diálogo que los contiene.
  document.querySelectorAll('[data-cerrar]').forEach((boton) => {
    boton.addEventListener('click', () => {
      cerrarDialogo(document.getElementById(boton.dataset.cerrar));
    });
  });

  // Por ahora solo cierra el diálogo; acá se haría el DELETE contra la API.
  if (botonConfirmarEliminacion) {
    botonConfirmarEliminacion.addEventListener('click', () => {
      cerrarDialogo(dialogoConfirmacion);
    });
  }

  // Por ahora solo cierra el diálogo; acá se haría el PUT con los datos del formulario.
  if (formularioEdicion) {
    formularioEdicion.addEventListener('submit', (evento) => {
      evento.preventDefault();
      cerrarDialogo(dialogoEdicion);
    });
  }

  if (botonCrearProducto) {
    botonCrearProducto.addEventListener('click', abrirCreacion);
  }

  // Por ahora solo cierra el diálogo; acá se haría el POST con los datos del formulario.
  if (formularioCreacion) {
    formularioCreacion.addEventListener('submit', (evento) => {
      evento.preventDefault();
      cerrarDialogo(dialogoCreacion);
    });
  }
}
