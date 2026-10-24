export function mostrarProductos(res, productos) {
  return res.status(200).json(productos);
}

export function mostrarProducto(res, producto) {
  return res.status(200).json(producto);
}

export function mostrarError(res, estado, mensaje) {
  return res.status(estado).json({ error: mensaje });
}

export function mostrarProductoCreado(res, producto) {
  return res.status(201).json(producto);
}

export function mostrarProductoEliminado(res) {
  return res.status(204).send();
}