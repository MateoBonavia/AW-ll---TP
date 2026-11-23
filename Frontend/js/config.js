'use strict';

// Configuración central del Front-End: la URL del backend se define solo acá.
// Si la página la sirve el propio backend, se usan rutas relativas (mismo origen).
// Con Live Server (puerto 5500) se apunta al backend del puerto 3000.
const ES_LIVE_SERVER = window.location.port === '5500';

export const API_BASE_URL = ES_LIVE_SERVER ? 'http://localhost:3000' : '';

export const URL_PRODUCTOS = `${API_BASE_URL}/api/v1/productos`;
export const URL_LIGAS = `${API_BASE_URL}/api/v1/ligas`;
export const URL_AUTH = `${API_BASE_URL}/api/v1`;

// Envía la cookie de sesión también cuando el backend está en otro origen.
export const CREDENCIALES = 'include';
