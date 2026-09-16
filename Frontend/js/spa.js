// Variable de estado para el carrusel de imágenes
"use strict";

// Guardan el estado necesario para navegar por el detalle sin recargar la página.
let activeImgIndex = 0;
let activeProductImgs = [];
let productosCargados = [];
let productoActual = null;
let talleSeleccionado = "";
let accionesCarrito = null;

// Enrutador de la aplicación
function router() {
  // El hash funciona como una ruta simple, por ejemplo: #producto=argentina.
  const hash = window.location.hash;
  const vistaInicio = document.getElementById('vista-inicio');
  const vistaDetalle = document.getElementById('vista-detalle');

  // Evita errores si faltan las áreas que necesita la vista SPA.
  if (!vistaInicio || !vistaDetalle) return;

  // Comprobar si el hash coincide con la ruta de un producto
  if (hash.startsWith('#producto=')) {
    const id = hash.replace('#producto=', '');
    // Busca en los datos JSON el producto pedido por la URL.
    const producto = productosCargados.find((p) => p.id === id);

    if (producto) {
      // Renderizar los detalles de ese producto
      renderDetail(producto);
      vistaInicio.style.display = 'none';
      vistaDetalle.style.display = 'block';

      // Desplazar la vista al tope de la página
      window.scrollTo(0, 0);
      return;
    }
  }

  // Si el hash es vacío o no coincide, mostrar la vista del catálogo
  vistaInicio.style.display = 'block';
  vistaDetalle.style.display = 'none';
  document.title = '90 Minutos - La Historia se Viste';

  // #catalogo mantiene la vista principal y desplaza a la grilla de productos.
  if (hash === '#catalogo') {
    const catalogo = document.getElementById('catalogo');

    if (catalogo) {
      catalogo.scrollIntoView({ behavior: 'smooth' });
    }
    return;
  }

  // #inicio o una ruta desconocida vuelven a la parte superior de la página.
  window.scrollTo(0, 0);
}

// Función para renderizar los detalles del producto seleccionado
function renderDetail(producto) {
  // Completa todos los campos dinámicos de la plantilla de detalle.
  // Actualizar el título de la pestaña del navegador
  document.title = `${producto.nombre} - 90 Minutos`;

  // Cargar textos básicos
  document.getElementById('jersey-title').textContent = producto.nombre;
  document.getElementById('detalle-precio').textContent =
    `$${producto.precio.toFixed(2)}`;

  // Guarda el producto abierto para usarlo al presionar los botones de compra.
  productoActual = producto;
  renderizarTalles(producto);

  // Renderizar tags dinámicos
  // Limpia los tags anteriores y agrega los del producto seleccionado.
  const categoryContainer = document.getElementById('detalle-categoria-container');
  if (categoryContainer) {
    categoryContainer.innerHTML = '';
    
    // Etiqueta principal (ej: BESTSELLER)
    if (producto.etiqueta) {
      const tag = document.createElement('span');
      tag.className = 'tag-detalle';
      tag.textContent = producto.etiqueta;
      categoryContainer.appendChild(tag);
    }
    
    // Tags secundarios (ej: SELECCIÓN, 80S ERA)
    if (producto.tags) {
      producto.tags.forEach(t => {
        const tag = document.createElement('span');
        tag.className = 'tag-detalle tag-detalle-secundario';
        tag.textContent = t;
        categoryContainer.appendChild(tag);
      });
    }
  }

  // Utilizar el primer tag como la colección o liga de la camiseta
  const coleccionNombre =
    producto.tags && producto.tags.length > 0
      ? `${producto.tags[0]} Collection`
      : 'Colección Serie A';
  document.getElementById('detalle-coleccion').textContent = coleccionNombre;

  const descText = producto.descripcion;
  const descDesktop = document.getElementById('detalle-descripcion');
  if (descDesktop) descDesktop.textContent = descText;
  
  const descMovil = document.getElementById('detalle-descripcion-movil');
  if (descMovil) descMovil.textContent = descText;

  // Actualizar imágenes activas del producto para el carrusel
  // Al cambiar de producto, el carrusel vuelve a comenzar desde su primera foto.
  activeProductImgs = producto.imagenes;
  activeImgIndex = 0;

  // Cargar imagen principal
  const mainImg = document.getElementById('main-product-img');
  if (mainImg) {
    mainImg.src = activeProductImgs[0];
    mainImg.alt = `Camiseta ${producto.nombre} - Vista Destacada`;
  }

  // Renderizar puntos del carrusel para móvil
  const puntosContainer = document.getElementById('galeria-puntos-container');
  if (puntosContainer) {
    puntosContainer.innerHTML = '';
    activeProductImgs.forEach((_, index) => {
      const dot = document.createElement('span');
      dot.className = index === 0 ? 'punto-galeria active' : 'punto-galeria';
      // Cada punto móvil permite saltar directamente a una imagen.
      dot.addEventListener('click', () => {
        setCarouselImage(index);
      });
      puntosContainer.appendChild(dot);
    });
  }

  // Renderizar miniaturas del carrusel
  const miniaturaContainer = document.getElementById('contenedor-miniaturas');
  if (miniaturaContainer) {
    miniaturaContainer.innerHTML = '';

    activeProductImgs.forEach((imgUrl, index) => {
      const btn = document.createElement('button');
      btn.className = index === 0 ? 'miniatura active' : 'miniatura';
      btn.setAttribute('aria-label', `Ver vista ${index + 1} de la camiseta`);

      btn.innerHTML = `<img src="${imgUrl}" alt="Miniatura ${index + 1}" />`;

      // Cambiar imagen principal al hacer clic
      btn.addEventListener('click', () => {
        setCarouselImage(index);
      });

      miniaturaContainer.appendChild(btn);
    });
  }

  // Renderizar los productos recomendados (los otros 3 del catálogo)
  const relacionadosContainer = document.getElementById(
    'contenedor-relacionados'
  );
  if (relacionadosContainer) {
    relacionadosContainer.innerHTML = '';

    // Recomienda todos los productos menos el que se está visualizando.
    const otrosProductos = productosCargados.filter((p) => p.id !== producto.id);

    // Fisher-Yates mezcla una copia sin modificar el catálogo original.
    const productosAleatorios = [...otrosProductos];
    for (let indice = productosAleatorios.length - 1; indice > 0; indice -= 1) {
      const indiceAleatorio = Math.floor(Math.random() * (indice + 1));
      [productosAleatorios[indice], productosAleatorios[indiceAleatorio]] = [
        productosAleatorios[indiceAleatorio],
        productosAleatorios[indice]
      ];
    }

    // Se muestran tres recomendaciones o todas las disponibles si hay menos.
    productosAleatorios.slice(0, 3).forEach((otro) => {
      const card = document.createElement('a');
      card.className = 'producto-card tarjeta-producto';
      card.setAttribute('href', `#producto=${otro.id}`);
      card.setAttribute('data-id', otro.id);

      let labelHTML = '';
      if (otro.etiqueta) {
        labelHTML = `<span class="etiqueta">${otro.etiqueta}</span>`;
      }

      // Crear el subtítulo con los tags (ej: SERIE A • 1987)
      const subtituloText = (otro.tags && otro.tags.length > 0) ? otro.tags.join(" • ") : "";
      const subtituloHTML = subtituloText ? `<span class="tarjeta-subtitulo">${subtituloText}</span>` : "";

      card.innerHTML = `
        ${labelHTML}
        <img src="${otro.imagenes[0]}" alt="Camiseta ${otro.nombre}" />
        ${subtituloHTML}
        <div class="producto-card__encabezado nombre-precio">
          <h3>${otro.nombre}</h3>
          <span class="precio">$${otro.precio.toFixed(2)}</span>
        </div>
        <p class="producto-card__descripcion descripcion-producto">${otro.descripcion}</p>
      `;

      relacionadosContainer.appendChild(card);
    });
  }
}

function renderizarTalles(producto) {
  const contenedorTalles = document.querySelector('.talle-opciones');

  if (!contenedorTalles) return;

  // M es la opción inicial si existe; si no, se usa el primer talle disponible.
  talleSeleccionado = producto.talles.includes('M') ? 'M' : producto.talles[0];
  contenedorTalles.innerHTML = '';

  producto.talles.forEach((talle) => {
    const boton = document.createElement('button');
    boton.type = 'button';
    boton.className = talle === talleSeleccionado ? 'boton-talle active' : 'boton-talle';
    boton.textContent = talle;
    boton.setAttribute('aria-pressed', talle === talleSeleccionado ? 'true' : 'false');
    boton.setAttribute('aria-label', `Seleccionar talle ${talle}`);

    boton.addEventListener('click', () => {
      talleSeleccionado = talle;

      // Actualiza el estilo y el atributo accesible del talle elegido.
      contenedorTalles.querySelectorAll('.boton-talle').forEach((opcion) => {
        const estaSeleccionado = opcion.textContent === talleSeleccionado;
        opcion.classList.toggle('active', estaSeleccionado);
        opcion.setAttribute('aria-pressed', estaSeleccionado ? 'true' : 'false');
      });
    });

    contenedorTalles.appendChild(boton);
  });
}

function agregarProductoActual(abrirResumen) {
  const mensaje = document.getElementById('mensaje-carrito');

  if (!productoActual || !talleSeleccionado || !accionesCarrito) return;

  accionesCarrito.agregarProducto(productoActual, talleSeleccionado);

  if (mensaje) {
    mensaje.textContent = `${productoActual.nombre}, talle ${talleSeleccionado}, fue añadido al carrito.`;
  }

  if (abrirResumen) {
    accionesCarrito.abrirCarrito();
  }
}

// Función para cambiar de imagen en el carrusel
function setCarouselImage(index) {
  // Guarda la posición actual para que las flechas sepan cuál imagen mostrar.
  activeImgIndex = index;

  // Cambiar fuente de imagen principal
  const mainImg = document.getElementById('main-product-img');
  if (mainImg && activeProductImgs[index]) {
    mainImg.src = activeProductImgs[index];
  }

  // Actualizar clase activa en los botones de miniaturas
  const btns = document.querySelectorAll('#contenedor-miniaturas .miniatura');
  btns.forEach((btn, i) => {
    if (i === index) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  // Actualizar clase activa en los puntos móviles
  const dots = document.querySelectorAll('#galeria-puntos-container .punto-galeria');
  dots.forEach((dot, i) => {
    if (i === index) {
      dot.classList.add('active');
    } else {
      dot.classList.remove('active');
    }
  });
}

// Inicializar escuchas y estado al cargar la página
export function inicializarSpa(productos, carrito) {
  // Conserva los productos cargados para usarlos cada vez que cambie el hash.
  productosCargados = productos;
  accionesCarrito = carrito;
  // Escuchar cambios de hash para navegar sin recargar la página
  window.addEventListener('hashchange', router);

  // Configurar las flechas del carrusel principal
  const btnIzq = document.getElementById('btn-flecha-izq');
  const btnDer = document.getElementById('btn-flecha-der');

  if (btnIzq) {
    // Retrocede una imagen y vuelve al final al llegar al principio.
    btnIzq.addEventListener('click', () => {
      if (activeProductImgs.length === 0) return;
      let nextIndex = activeImgIndex - 1;
      if (nextIndex < 0) {
        nextIndex = activeProductImgs.length - 1;
      }
      setCarouselImage(nextIndex);
    });
  }

  if (btnDer) {
    // Avanza una imagen y vuelve al inicio al llegar al final.
    btnDer.addEventListener('click', () => {
      if (activeProductImgs.length === 0) return;
      let nextIndex = activeImgIndex + 1;
      if (nextIndex >= activeProductImgs.length) {
        nextIndex = 0;
      }
      setCarouselImage(nextIndex);
    });
  }

  const botonesAgregar = document.querySelectorAll(
    '.boton-agregar-carrito, .boton-agregar-carrito-movil'
  );
  const botonComprar = document.querySelector('.boton-comprar-ahora');

  // Ambos botones de añadir comparten la misma acción, también en móviles.
  botonesAgregar.forEach((boton) => {
    boton.addEventListener('click', () => agregarProductoActual(false));
  });

  // Comprar ahora agrega el producto y muestra el resumen del carrito.
  if (botonComprar) {
    botonComprar.addEventListener('click', () => agregarProductoActual(true));
  }

  // Enrutar al iniciar (por si el usuario entra directo con un hash)
  router();
}
