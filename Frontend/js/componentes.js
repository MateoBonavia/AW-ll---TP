"use strict";

export async function cargarHeader() {
  const contenedor = document.getElementById("header-container");

  if (!contenedor) return;

  const respuesta = await fetch("./componentes/header.html");

  if (!respuesta.ok) {
    throw new Error("No se pudo cargar el header.");
  }

  contenedor.innerHTML = await respuesta.text();
  marcarPaginaActual();
  inicializarMenuMovil();
}

export async function cargarFooter() {
  const contenedor = document.getElementById("footer-container");

  if (!contenedor) return;

  const respuesta = await fetch("./componentes/footer.html");

  if (!respuesta.ok) {
    throw new Error("No se pudo cargar el footer.");
  }

  contenedor.innerHTML = await respuesta.text();
}

function marcarPaginaActual() {
  const paginaActual = window.location.pathname.split("/").pop() || "index.html";
  const enlaces = document.querySelectorAll("#header-container nav ul a");

  enlaces.forEach((enlace) => {
    if (enlace.getAttribute("href") === paginaActual) {
      enlace.setAttribute("aria-current", "page");
    }
  });
}

function inicializarMenuMovil() {
  const botonMenu = document.querySelector("#header-container .hamburger-menu");
  const listaMenu = document.querySelector("#header-container nav ul");

  if (!botonMenu || !listaMenu) return;

  botonMenu.addEventListener("click", () => {
    listaMenu.classList.toggle("active");
  });
}
