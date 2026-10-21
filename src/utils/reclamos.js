export const catalogos = {
  vendedor: ['CALL CENTER', 'ORIENTE', 'CADENAS', 'CENTRO', 'OCCIDENTE', 'OFICINA'],
  clasificacion: ['GARANTÍA', 'REPARACIÓN FUERA DE GARANTÍA'],
  tipoReclamo: ['Mueble', 'Cama'],
  tipoProblema: ['Madera', 'Tela', 'Patas', 'Tela y patas', 'Resorte', 'Fieltro', 'Espuma'],
  despachoFinalEstatus: ['DESPACHADO', 'NO PROCEDE', 'PENDIENTE'],
  conformidadClienteEstatus: ['Inconformidad de cliente', 'Aceptación de cliente'],
};
export const iniciales = [
  ['vendedor', 'Vendedor', 'select'], ['fechaReclamo', 'Fecha de Reclamo', 'date'],
  ['cliente', 'Cliente', 'text'], ['ubicacion', 'Sucursal/Ubicación', 'text'],
  ['producto', 'Producto', 'text'], ['clasificacion', 'Clasificación', 'select'],
  ['tipoReclamo', 'Tipo de Reclamo', 'select'], ['tipoProblema', 'Tipo de Problema', 'select'],
  ['descripcion', 'Descripción', 'textarea'], ['sugerencias', 'Sugerencias', 'textarea', true],
  ['evidencia', 'Evidencia (texto/URL)', 'text', true],
];
export const fechasSeguimiento = [
  ['despachoRecepcion', 'Despacho-Recepción'],
  ['despachoEntregaBodega', 'Despacho-Entrega a Bodega'],
  ['bodegaFechaProduccion', 'Bodega-Fecha a Producción'],
  ['produccionFechaReparacion', 'Producción-Fecha de Reparación'],
  ['produccionEntregaBodega', 'Producción-Entrega a Bodega'],
  ['calidadRevisionBPT', 'Calidad-Revisión de Ingreso a BPT'],
  ['comercializacionFechaRemision', 'Comercialización-Fecha Nota de Remisión'],
];
export function fechaLocal(fecha = new Date()) {
  return new Date(fecha.getTime() - fecha.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
}
export function siguienteCodigo(reclamos) {
  const maximo = reclamos.reduce((max, r) => /^RG-\d+$/.test(r.id) ? Math.max(max, Number(r.id.slice(3))) : max, 0);
  return `RG-${String(maximo + 1).padStart(4, '0')}`;
}
export function nuevoReclamo(reclamos) {
  return { id: siguienteCodigo(reclamos), timestamp: fechaLocal(),
    ...Object.fromEntries([...iniciales, ...fechasSeguimiento, ['calidadComentarios'], ['conformidadClienteEstatus'], ['comentariosGenerales']].map(([campo]) => [campo, ''])),
    despachoFinalEstatus: 'PENDIENTE' };
}
export function completarFechas(reclamo) {
  const copia = { ...reclamo };
  let anterior = copia.fechaReclamo || '';
  for (const [campo] of fechasSeguimiento) {
    copia[campo] = copia[campo] || anterior;
    anterior = copia[campo];
  }
  return copia;
}
export const filtrosVacios = { busqueda: '', vendedor: '', clasificacion: '', tipoReclamo: '', despachoFinalEstatus: '', conformidadClienteEstatus: '' };
export function filtrarOrdenar(reclamos, filtros) {
  const termino = filtros.busqueda.trim().toLocaleLowerCase('es');
  const tiempo = r => { const t = Date.parse(r.timestamp || r.fechaReclamo); return Number.isNaN(t) ? 0 : t; };
  return reclamos.filter(r => ['cliente', 'producto', 'id', 'ubicacion'].some(c => String(r[c] || '').toLocaleLowerCase('es').includes(termino)) &&
    Object.entries(filtros).every(([campo, valor]) => campo === 'busqueda' || !valor || r[campo] === valor))
    .sort((a, b) => tiempo(b) - tiempo(a));
}
