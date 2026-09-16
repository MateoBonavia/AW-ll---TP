"use strict";

/**
 * Renderiza las tarjetas del catálogo a partir de los productos cargados.
 * @param {Array} productos Productos disponibles.
 */
export function renderizarCatalogo(productos, totalProductos) {
  const contenedor = document.getElementById("contenedor-tarjetas");
  const contador = document.getElementById("contador-resultados");

  // Evita un error si este módulo se reutiliza en una página sin catálogo.
  if (!contenedor) return;

  // Borra las tarjetas de ejemplo del HTML antes de renderizar los datos reales.
  contenedor.innerHTML = "";

  // Actualiza el texto para que indique cuántos productos deja ver el filtro.
  if (contador) {
    contador.textContent = `Mostrando ${productos.length} de ${totalProductos} productos`;
  }

  if (productos.length === 0) {
    contenedor.innerHTML = "<p class=\"mensaje-sin-resultados\" role=\"status\">No encontramos productos con esos filtros.</p>";
    return;
  }

  productos.forEach((producto) => {
    // Cada tarjeta es un enlace: el hash abre el detalle sin recargar la página.
    const article = document.createElement("a");
    article.className = "producto-card tarjeta-producto";
    article.setAttribute("href", `#producto=${producto.id}`);
    article.setAttribute("data-id", producto.id);

    let etiquetaHTML = "";
    if (producto.etiqueta) {
      // NUEVO usa el estilo normal; las otras etiquetas usan el alternativo.
      const claseEtiqueta = producto.etiqueta === "NUEVO" ? "etiqueta" : "etiqueta etiqueta-azul";
      etiquetaHTML = `<span class="${claseEtiqueta}">${producto.etiqueta}</span>`;
    }

    let tagsHTML = "";
    if (producto.tags && producto.tags.length > 0) {
      // Los tags indican liga, selección o época de la camiseta.
      tagsHTML = `<div class="tags-producto">${producto.tags.map((tag) => `<span>${tag}</span>`).join("")}</div>`;
    }

    // Une los tags para mostrarlos como subtítulo debajo de la imagen.
    const subtituloText = producto.tags && producto.tags.length > 0 ? producto.tags.join(" • ") : "";
    const subtituloHTML = subtituloText ? `<span class="tarjeta-subtitulo">${subtituloText}</span>` : "";

    // Arma la tarjeta con la información que llegó desde productos.json.
    article.innerHTML = `
      ${etiquetaHTML}
      <img src="${producto.imagenes[0]}" alt="Camiseta ${producto.nombre}" />
      ${subtituloHTML}
      <div class="producto-card__encabezado nombre-precio">
        <h3>${producto.nombre}</h3>
        <data value="${producto.precio}" class="precio">$${producto.precio.toFixed(2)}</data>
      </div>
      <p class="producto-card__descripcion descripcion-producto">${producto.descripcion}</p>
      ${tagsHTML}
    `;

    // Inserta la tarjeta completa en la grilla de productos.
    contenedor.appendChild(article);
  });
}

/**
 * Muestra el catálogo completo apenas termina de cargarse el JSON.
 * @param {Array} productos Productos disponibles.
 */
export function inicializarCatalogo(productos) {
  renderizarCatalogo(productos, productos.length);
}
