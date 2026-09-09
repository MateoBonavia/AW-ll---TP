// Variable de estado para el carrusel de imágenes
let activeImgIndex = 0;
let activeProductImgs = [];

// Enrutador de la aplicación
function router() {
  const hash = window.location.hash;
  const vistaInicio = document.getElementById('vista-inicio');
  const vistaDetalle = document.getElementById('vista-detalle');

  if (!vistaInicio || !vistaDetalle) return;

  // Comprobar si el hash coincide con la ruta de un producto
  if (hash.startsWith('#producto=')) {
    const id = hash.replace('#producto=', '');
    const producto = productos.find((p) => p.id === id);

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
  window.scrollTo(0, 0);
}

// Función para renderizar los detalles del producto seleccionado
function renderDetail(producto) {
  // Actualizar el título de la pestaña del navegador
  document.title = `${producto.nombre} - 90 Minutos`;

  // Cargar textos básicos
  document.getElementById('jersey-title').textContent = producto.nombre;
  document.getElementById('detalle-precio').textContent =
    `$${producto.precio.toFixed(2)}`;

  // Renderizar tags dinámicos
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

    const otrosProductos = productos.filter((p) => p.id !== producto.id);
    otrosProductos.forEach((otro) => {
      const card = document.createElement('a');
      card.className = 'tarjeta-producto';
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
        <div class="nombre-precio">
          <h3>${otro.nombre}</h3>
          <span class="precio">$${otro.precio.toFixed(2)}</span>
        </div>
        <p class="descripcion-producto">${otro.descripcion}</p>
      `;

      relacionadosContainer.appendChild(card);
    });
  }
}

// Función para cambiar de imagen en el carrusel
function setCarouselImage(index) {
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
document.addEventListener('DOMContentLoaded', () => {
  // Escuchar cambios de hash para navegar sin recargar la página
  window.addEventListener('hashchange', router);

  // Configurar las flechas del carrusel principal
  const btnIzq = document.getElementById('btn-flecha-izq');
  const btnDer = document.getElementById('btn-flecha-der');

  if (btnIzq) {
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
    btnDer.addEventListener('click', () => {
      if (activeProductImgs.length === 0) return;
      let nextIndex = activeImgIndex + 1;
      if (nextIndex >= activeProductImgs.length) {
        nextIndex = 0;
      }
      setCarouselImage(nextIndex);
    });
  }

  // Enrutar al iniciar (por si el usuario entra directo con un hash)
  router();
});
