const CLAVE = 'reclamos-garantias';
export function getClaims() {
  const datos = JSON.parse(localStorage.getItem(CLAVE) || '[]');
  if (!Array.isArray(datos)) throw new Error('El almacenamiento de reclamos no contiene una lista.');
  return datos;
}
export function setClaims(claims) {
  localStorage.setItem(CLAVE, JSON.stringify(claims));
}
