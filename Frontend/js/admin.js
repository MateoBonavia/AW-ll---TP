'use strict';

import {
  actualizarProducto,
  crearProducto,
  eliminarProducto,
} from './productos.js';
import { mostrarAviso, mostrarMensajeEnDialogo } from './avisos.js';
import { actualizarEstadoCuenta } from './componentes.js';

// Misma lista que usa el catálogo: los cambios se reflejan sin recargar la página.
let productosAdmin = [];
let idProductoEnEdicion = null;
let alActualizarCatalogo = () => {};

let idProductoAEliminar = null; // Para recordar el producto que se quiere eliminar mientras se abre el diálogo de confirmación.

function abrirDialogo(dialogo) {
  if (!dialogo) return;

  // Cada apertura empieza sin mensajes de un intento anterior.
  mostrarMensajeEnDialogo(dialogo, '');

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
    idProductoEnEdicion = producto.id;
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

// Muestra el error en el diálogo. Si la sesión venció (401), se actualiza
// la interfaz para ocultar las acciones de administración.
function informarError(dialogo, error) {
  console.error(error);

  const texto =
    error instanceof TypeError
      ? 'No se pudo conectar con el servidor.'
      : error.message;

  mostrarMensajeEnDialogo(dialogo, texto);

  if (error.estado === 401) actualizarEstadoCuenta();
}

// Evita envíos dobles mientras se espera la respuesta del servidor.
async function conBotonOcupado(boton, accion) {
  if (boton) boton.disabled = true;

  try {
    await accion();
  } finally {
    if (boton) boton.disabled = false;
  }
}

export function inicializarAccionesCatalogo(productos, ligas, alActualizar = () => {}) {
  productosAdmin = productos;
  cargarOpcionesDeLigas(ligas);
  alActualizarCatalogo = alActualizar;

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
    const ejecutarAccion = (evento) => {
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
    };

    contenedor.addEventListener('click', ejecutarAccion);

    // Los botones de las tarjetas también responden a Enter y Espacio.
    contenedor.addEventListener('keydown', (evento) => {
      if (evento.key === 'Enter' || evento.key === ' ') ejecutarAccion(evento);
    });
  }

  // Los botones marcados con data-cerrar cierran el diálogo que los contiene.
  document.querySelectorAll('[data-cerrar]').forEach((boton) => {
    boton.addEventListener('click', () => {
      cerrarDialogo(document.getElementById(boton.dataset.cerrar));
    });
  });

  if (botonConfirmarEliminacion) {
    botonConfirmarEliminacion.addEventListener('click', () =>
      conBotonOcupado(botonConfirmarEliminacion, async () => {
        try {
          const { mensaje } = await eliminarProducto(idProductoAEliminar);

          const indice = productosAdmin.findIndex(
            (producto) => producto.id === idProductoAEliminar
          );
          if (indice !== -1) productosAdmin.splice(indice, 1);

          cerrarDialogo(dialogoConfirmacion);
          alActualizarCatalogo();
          mostrarAviso(mensaje);
        } catch (error) {
          informarError(dialogoConfirmacion, error);
        }
      })
    );
  }

  if (formularioEdicion) {
    formularioEdicion.addEventListener('submit', (evento) => {
      evento.preventDefault();

      const productoActual = productosAdmin.find((producto) => producto.id === idProductoEnEdicion);
      if (!productoActual) return;

      const productoEditado = new FormData(formularioEdicion);
      productoEditado.set('liga_id', productoActual.liga_id ?? '');
      productoEditado.set('talles', JSON.stringify(productoActual.talles));
      productoEditado.set('tags', JSON.stringify(productoActual.tags));

      return conBotonOcupado(evento.submitter, async () => {
        try {
          const actualizado = await actualizarProducto(idProductoEnEdicion, productoEditado);
          Object.assign(productoActual, actualizado);
          cerrarDialogo(dialogoEdicion);
          alActualizarCatalogo();
          mostrarAviso('Producto actualizado correctamente.');
        } catch (error) {
          informarError(dialogoEdicion, error);
        }
      });
    });
  }

  if (botonCrearProducto) {
    botonCrearProducto.addEventListener('click', abrirCreacion);
  }

  if (formularioCreacion) {
    formularioCreacion.addEventListener('submit', (evento) => {
      evento.preventDefault();

      return conBotonOcupado(evento.submitter, async () => {
        try {
          const creado = await crearProducto(new FormData(formularioCreacion));
          productosAdmin.push(creado);
          cerrarDialogo(dialogoCreacion);
          alActualizarCatalogo();
          mostrarAviso('Producto creado correctamente.');
        } catch (error) {
          informarError(dialogoCreacion, error);
        }
      });
    });
  }
}
