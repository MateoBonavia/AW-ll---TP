"use strict";

/**
 * Conecta los controles del catálogo con el renderizado de productos filtrados.
 * Los productos normalizados conservan la clave "año", pero el HTML y las variables usan ASCII.
 * @param {Array} productos Lista completa cargada desde la API.
 * @param {Function} actualizarCatalogo Función que muestra el resultado filtrado.
 */
export function inicializarFiltros(productos, actualizarCatalogo) {
  const formularioBusqueda = document.getElementById("formulario-busqueda");
  const campoBusqueda = document.getElementById("search");
  const botonesAnio = document.querySelectorAll("[data-anio]");
  const botonesTalle = document.querySelectorAll("[data-talle]");
  const casillasLiga = document.querySelectorAll("input[name='liga']");
  const botonTodas = document.querySelector("[data-reset-filters]");

  let anioSeleccionado = "";
  let talleSeleccionado = "";

  function actualizarBotones(botones, valorSeleccionado) {
    botones.forEach((boton) => {
      const valorBoton = boton.dataset.anio || boton.dataset.talle;
      boton.classList.toggle("active", valorBoton === valorSeleccionado);
    });
  }

  function aplicarFiltros() {
    const textoBuscado = campoBusqueda.value.trim().toLowerCase();
    const ligasSeleccionadas = Array.from(casillasLiga)
      .filter((casilla) => casilla.checked)
      .map((casilla) => casilla.value);

    const productosFiltrados = productos.filter((producto) => {
      // La notación entre corchetes permite leer una clave que contiene ñ.
      const anioProducto = producto["año"];
      const coincideAnio = !anioSeleccionado || anioProducto === anioSeleccionado;
      const coincideTalle = !talleSeleccionado || producto.talles.includes(talleSeleccionado);
      const coincideLiga = ligasSeleccionadas.length === 0 || ligasSeleccionadas.includes(producto.liga);
      const textoDelProducto = [
        producto.nombre,
        producto.descripcion,
        producto.etiqueta,
        producto.liga,
        anioProducto,
        ...producto.tags
      ].join(" ").toLowerCase();
      const coincideBusqueda = !textoBuscado || textoDelProducto.includes(textoBuscado);

      return coincideAnio && coincideTalle && coincideLiga && coincideBusqueda;
    });

    actualizarCatalogo(productosFiltrados, productos.length);

    if (botonTodas) {
      botonTodas.classList.toggle(
        "active",
        !anioSeleccionado && !talleSeleccionado && ligasSeleccionadas.length === 0 && !textoBuscado
      );
    }
  }

  botonesAnio.forEach((boton) => {
    boton.addEventListener("click", () => {
      anioSeleccionado = anioSeleccionado === boton.dataset.anio ? "" : boton.dataset.anio;
      actualizarBotones(botonesAnio, anioSeleccionado);
      aplicarFiltros();
    });
  });

  botonesTalle.forEach((boton) => {
    boton.addEventListener("click", () => {
      talleSeleccionado = talleSeleccionado === boton.dataset.talle ? "" : boton.dataset.talle;
      actualizarBotones(botonesTalle, talleSeleccionado);
      aplicarFiltros();
    });
  });

  casillasLiga.forEach((casilla) => {
    casilla.addEventListener("change", aplicarFiltros);
  });

  campoBusqueda.addEventListener("input", aplicarFiltros);

  formularioBusqueda.addEventListener("submit", (evento) => {
    // Evita que Buscar o Enter recarguen la página.
    evento.preventDefault();
    aplicarFiltros();
  });

  if (botonTodas) {
    botonTodas.addEventListener("click", () => {
      anioSeleccionado = "";
      talleSeleccionado = "";
      campoBusqueda.value = "";
      casillasLiga.forEach((casilla) => {
        casilla.checked = false;
      });
      actualizarBotones(botonesAnio, "");
      actualizarBotones(botonesTalle, "");
      aplicarFiltros();
    });
  }
}
