'use strict';

// Configuración central del Front-End: la URL del backend se define solo acá.
// Se usa la URL completa para que Live Server (puerto 5500) consulte al backend del puerto 3000.
export const API_BASE_URL = 'http://localhost:3000';

export const URL_PRODUCTOS = `${API_BASE_URL}/api/v1/productos`;
export const URL_LIGAS = `${API_BASE_URL}/api/v1/ligas`;
