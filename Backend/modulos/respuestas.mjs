// Criterio único para todas las respuestas JSON de la API:
// - Datos (listados, un recurso): se envía el recurso tal cual.
// - Acciones (eliminar, login, registro): { mensaje, ...datos }.
// - Errores: { error }.

export function responderDatos(res, estado, datos) {
  return res.status(estado).json(datos);
}

export function responderMensaje(res, estado, mensaje, datos = {}) {
  return res.status(estado).json({ mensaje, ...datos });
}

export function responderError(res, estado, mensaje) {
  return res.status(estado).json({ error: mensaje });
}
