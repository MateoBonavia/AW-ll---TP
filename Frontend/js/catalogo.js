"use strict";

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

    // Acciones de administración sobre el producto (por ahora solo visuales).
    const accionesHTML = `
      <div class="acciones-tarjeta">
        <span class="accion-tarjeta" role="button" tabindex="0" data-accion="editar" data-id="${producto.id}" aria-label="Editar ${producto.nombre}">
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
        </span>
        <span class="accion-tarjeta accion-tarjeta-eliminar" role="button" tabindex="0" data-accion="eliminar" data-id="${producto.id}" aria-label="Eliminar ${producto.nombre}">
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
        </span>
      </div>`;

    // Arma la tarjeta con la información que llegó desde la API.
    article.innerHTML = `
      ${etiquetaHTML}
      ${accionesHTML}
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

export function inicializarCatalogo(productos) {
  renderizarCatalogo(productos, productos.length);
}
