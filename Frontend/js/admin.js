'use strict';

// Copia de la lista del catálogo para buscar el producto desde los botones de cada tarjeta.
let productosAdmin = [];

const URL_PRODUCTOS = 'http://localhost:3000/api/v1/productos';

let idProductoAEliminar = null; // Para recordar el producto que se quiere eliminar mientras se abre el diálogo de confirmación.

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

  idProductoAEliminar = producto.id;

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

function cargarOpcionesDeLigas(ligas) {
  const select = document.getElementById('crear-liga');

  if (!select) return;

  ligas.forEach((liga) => {
    const opcion = document.createElement('option');
    opcion.value = liga.id;
    opcion.textContent = liga.nombre;
    select.appendChild(opcion);
  });
}

export function inicializarAccionesCatalogo(productos, ligas) {
  productosAdmin = productos;
  cargarOpcionesDeLigas(ligas);

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
    botonConfirmarEliminacion.addEventListener('click', async () => {
      try {
        const respuesta = await fetch(`${URL_PRODUCTOS}/${idProductoAEliminar}`, {
          method: 'DELETE',
        });

        // 204: se borró y no hay cuerpo para leer. Cualquier otro caso trae { error }.
        if (!respuesta.ok) {
          const { error } = await respuesta.json().catch(() => ({}));
          alert(error ?? 'No se pudo eliminar el producto.');
          return;
        }

        cerrarDialogo(dialogoConfirmacion);
        window.location.reload(); // vuelve a pedir el catálogo sin el producto borrado
      } catch (error) {
        console.error(error);
        alert('No se pudo conectar con el servidor.');
      }
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
    formularioCreacion.addEventListener('submit', async (evento) => {
      evento.preventDefault();

      try {
        const respuesta = await fetch(URL_PRODUCTOS, {
          method: 'POST',
          body: new FormData(formularioCreacion),
        });

        if (!respuesta.ok) {
          const { error } = await respuesta.json().catch(() => ({}));
          alert(error ?? 'No se pudo crear el producto.');
          return;
        }

        cerrarDialogo(dialogoCreacion);
        window.location.reload(); // vuelve a pedir el catálogo y se ve el producto nuevo
      } catch (error) {
        console.error(error);
        alert('No se pudo conectar con el servidor.');
      }
    });
  }
}
