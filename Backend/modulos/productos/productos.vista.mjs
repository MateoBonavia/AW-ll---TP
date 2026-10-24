export function mostrarProductos(res, productos) {
  return res.status(200).json(productos);
}

export function mostrarError(res, estado, mensaje) {
  return res.status(estado).json({ error: mensaje });
}
