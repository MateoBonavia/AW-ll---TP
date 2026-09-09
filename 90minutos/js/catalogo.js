document.addEventListener('DOMContentLoaded', () => {
  const contenedor = document.getElementById('contenedor-tarjetas');
  if (!contenedor) return;

  // Limpiar el contenedor antes de renderizar
  contenedor.innerHTML = '';

  productos.forEach((producto) => {
    // Crear la tarjeta de producto como un enlace
    const article = document.createElement("a");
    article.className = "tarjeta-producto";
    article.setAttribute("href", `#producto=${producto.id}`);
    article.setAttribute("data-id", producto.id);

    // Etiqueta de la tarjeta
    let etiquetaHTML = '';
    if (producto.etiqueta) {
      const claseEtiqueta =
        producto.etiqueta === 'NUEVO' ? 'etiqueta' : 'etiqueta etiqueta-azul';
      etiquetaHTML = `<span class="${claseEtiqueta}">${producto.etiqueta}</span>`;
    }

    // Etiquetas secundarias en el pie de la tarjeta
    let tagsHTML = '';
    if (producto.tags && producto.tags.length > 0) {
      tagsHTML = `<div class="tags-producto">
        ${producto.tags.map((tag) => `<span>${tag}</span>`).join('')}
      </div>`;
    }

    // La primera imagen del array es la frontal destacada
    const imagenPrincipal = producto.imagenes[0];

    // Crear el subtítulo con los tags (ej: SERIE A • 1987)
    const subtituloText = (producto.tags && producto.tags.length > 0) ? producto.tags.join(" • ") : "";
    const subtituloHTML = subtituloText ? `<span class="tarjeta-subtitulo">${subtituloText}</span>` : "";

    article.innerHTML = `
      ${etiquetaHTML}
      <img src="${imagenPrincipal}" alt="Camiseta ${producto.nombre}" />
      ${subtituloHTML}
      <div class="nombre-precio">
        <h3>${producto.nombre}</h3>
        <data value="${producto.precio}" class="precio">$${producto.precio.toFixed(2)}</data>
      </div>
      <p class="descripcion-producto">${producto.descripcion}</p>
      ${tagsHTML}
    `;

    contenedor.appendChild(article);
  });
});
