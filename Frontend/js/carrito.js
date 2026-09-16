'use strict';

// El carrito vive en memoria: conserva los productos mientras la página está abierta.
let productosEnCarrito = [];

function actualizarContador() {
  const contador = document.getElementById('contador-carrito');
  const cantidadTotal = productosEnCarrito.reduce(
    (total, item) => total + item.cantidad,
    0
  );

  if (contador) {
    contador.textContent = `Carrito (${cantidadTotal})`;
  }
}

function renderizarCarrito() {
  const lista = document.getElementById('lista-carrito');
  const total = document.getElementById('total-carrito');

  if (!lista || !total) return;

  if (productosEnCarrito.length === 0) {
    lista.innerHTML = '<p class="carrito__vacio">Tu carrito está vacío.</p>';
    total.textContent = '$0.00';
    return;
  }

  // Cada fila tiene controles para modificar solo ese producto y talle.
  lista.innerHTML = productosEnCarrito
    .map(
      (item) => `
    <article class="carrito__item">
      <img src="${item.imagenes[0]}" alt="Camiseta ${item.nombre}" />
      <div class="carrito__datos">
        <h3>${item.nombre}</h3>
        <p>Talle: ${item.talle}</p>
        <span>$${item.precio.toFixed(2)}</span>
      </div>
      <div class="carrito__controles">
        <button type="button" data-accion="restar" data-id="${item.id}" data-talle="${item.talle}" aria-label="Restar una unidad">−</button>
        <span aria-label="Cantidad">${item.cantidad}</span>
        <button type="button" data-accion="sumar" data-id="${item.id}" data-talle="${item.talle}" aria-label="Sumar una unidad">+</button>
        <button type="button" class="carrito__eliminar" data-accion="eliminar" data-id="${item.id}" data-talle="${item.talle}">Quitar</button>
      </div>
    </article>
  `
    )
    .join('');

  const importeTotal = productosEnCarrito.reduce(
    (totalActual, item) => totalActual + item.precio * item.cantidad,
    0
  );
  total.textContent = `$${importeTotal.toFixed(2)}`;
}

function buscarItem(id, talle) {
  return productosEnCarrito.find(
    (item) => item.id === id && item.talle === talle
  );
}

function cambiarCantidad(id, talle, cambio) {
  const item = buscarItem(id, talle);

  if (!item) return;

  item.cantidad += cambio;

  // Al llegar a cero se elimina el ítem, para no mostrar cantidades inválidas.
  if (item.cantidad <= 0) {
    productosEnCarrito = productosEnCarrito.filter(
      (producto) => !(producto.id === id && producto.talle === talle)
    );
  }

  actualizarContador();
  renderizarCarrito();
}

function abrirCarrito() {
  const dialogo = document.getElementById('dialogo-carrito');

  if (!dialogo) return;

  renderizarCarrito();

  // showModal ofrece un diálogo accesible; open es una alternativa simple.
  if (typeof dialogo.showModal === 'function') {
    dialogo.showModal();
  } else {
    dialogo.setAttribute('open', '');
  }
}

function cerrarCarrito() {
  const dialogo = document.getElementById('dialogo-carrito');

  if (!dialogo) return;

  if (typeof dialogo.close === 'function') {
    dialogo.close();
  } else {
    dialogo.removeAttribute('open');
  }
}

/**
 * Prepara el carrito y devuelve las acciones que usará el detalle del producto.
 * @returns {{agregarProducto: Function, abrirCarrito: Function}}
 */
export function inicializarCarrito() {
  const enlaceCarrito = document.getElementById('abrir-carrito');
  const botonCerrar = document.getElementById('cerrar-carrito');
  const lista = document.getElementById('lista-carrito');
  const botonFinalizar = document.getElementById('finalizar-compra');

  if (enlaceCarrito) {
    enlaceCarrito.addEventListener('click', (evento) => {
      evento.preventDefault();
      abrirCarrito();
    });
  }

  if (botonCerrar) {
    botonCerrar.addEventListener('click', cerrarCarrito);
  }

  // Un único listener gestiona los botones de todos los ítems renderizados.
  if (lista) {
    lista.addEventListener('click', (evento) => {
      const boton = evento.target.closest('button[data-accion]');

      if (!boton) return;

      const { accion, id, talle } = boton.dataset;

      if (accion === 'sumar') cambiarCantidad(id, talle, 1);
      if (accion === 'restar') cambiarCantidad(id, talle, -1);
      if (accion === 'eliminar')
        cambiarCantidad(id, talle, -Number.MAX_SAFE_INTEGER);
    });
  }

  if (botonFinalizar) {
    botonFinalizar.addEventListener('click', () => {
      window.alert('Compra realizada correctamente!');
    });
  }

  actualizarContador();
  renderizarCarrito();

  return {
    agregarProducto(producto, talle) {
      const itemExistente = buscarItem(producto.id, talle);

      if (itemExistente) {
        itemExistente.cantidad += 1;
      } else {
        productosEnCarrito.push({ ...producto, talle, cantidad: 1 });
      }

      actualizarContador();
      renderizarCarrito();
    },
    abrirCarrito,
  };
}
