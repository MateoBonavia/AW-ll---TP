"use strict";

function renderizarLigas(contenedor, ligas) {
  contenedor.innerHTML = "";

  ligas.forEach((liga) => {
    const item = document.createElement("li");
    const casilla = document.createElement("input");
    const etiqueta = document.createElement("label");

    // Cada casilla identifica su etiqueta para que el clic active el checkbox.
    const idCasilla = `liga-${liga.id}`;
    casilla.type = "checkbox";
    casilla.id = idCasilla;
    casilla.name = "liga";
    casilla.value = liga.id;

    etiqueta.setAttribute("for", idCasilla);
    etiqueta.textContent = liga.nombre;

    item.appendChild(casilla);
    item.appendChild(etiqueta);
    contenedor.appendChild(item);
  });
}

export function inicializarFiltros(productos, ligas, actualizarCatalogo) {
  const formularioBusqueda = document.getElementById("formulario-busqueda");
  const campoBusqueda = document.getElementById("search");
  const botonesAnio = document.querySelectorAll("[data-anio]");
  const botonesTalle = document.querySelectorAll("[data-talle]");
  const contenedorLigas = document.getElementById("lista-ligas");
  const botonTodas = document.querySelector("[data-reset-filters]");

  let anioSeleccionado = "";
  let talleSeleccionado = "";

  // Las casillas se crean antes de conectar los eventos para poder consultarlas.
  if (contenedorLigas) {
    renderizarLigas(contenedorLigas, ligas);
  }

  const casillasLiga = document.querySelectorAll("input[name='liga']");

  // Permite mostrar y buscar por nombre aunque el producto guarde solo el id.
  const nombresDeLigas = new Map(ligas.map((liga) => [liga.id, liga.nombre]));

  function actualizarBotones(botones, valorSeleccionado) {
    botones.forEach((boton) => {
      const valorBoton = boton.dataset.anio || boton.dataset.talle;
      boton.classList.toggle("active", valorBoton === valorSeleccionado);
    });
  }

  function aplicarFiltros() {
    const textoBuscado = campoBusqueda.value.trim().toLowerCase();
    const ligasSeleccionadas = Array.from(casillasLiga).filter(
      (casilla) => casilla.checked
    );

    const productosFiltrados = productos.filter((producto) => {
      // La notación entre corchetes permite leer una clave que contiene ñ.
      const anioProducto = producto["año"];
      const nombreLiga = nombresDeLigas.get(String(producto.liga_id)) ?? "";

      const coincideAnio = !anioSeleccionado || anioProducto === anioSeleccionado;
      const coincideTalle = !talleSeleccionado || producto.talles.includes(talleSeleccionado);
      const coincideLiga =
        ligasSeleccionadas.length === 0 ||
        ligasSeleccionadas.some(
          (casilla) => casilla.value === String(producto.liga_id)
        );
      const textoDelProducto = [
        producto.nombre,
        producto.descripcion,
        producto.etiqueta,
        nombreLiga,
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
