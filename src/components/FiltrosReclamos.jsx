import React from 'react';
import Campo, { estiloControl } from './Campo';
import { botonGris } from './FormularioReclamo';
const opciones = [['vendedor', 'Vendedor'], ['clasificacion', 'Clasificación'], ['tipoReclamo', 'Tipo de Reclamo'], ['despachoFinalEstatus', 'Estatus Final'], ['conformidadClienteEstatus', 'Conformidad del Cliente']];
export default function FiltrosReclamos({ filtros, cambiar, limpiar, cantidad, total }) {
  return <section aria-labelledby="titulo-filtros" className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 sm:p-7">
    <h2 id="titulo-filtros" className="mb-4 text-xl font-semibold">Filtros</h2>
    <label htmlFor="busqueda" className="mb-1.5 block text-sm font-medium text-slate-700">Buscar por cliente, producto, código o ubicación</label>
    <input id="busqueda" type="search" className={estiloControl} value={filtros.busqueda} onChange={e => cambiar('busqueda', e.target.value)} placeholder="Buscar reclamos…"/>
    <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{opciones.map(([campo, etiqueta]) => <Campo key={campo} prefijo="filtro-" campo={campo} etiqueta={etiqueta} tipo="select" valor={filtros[campo]} cambiar={(_, valor) => cambiar(campo, valor)} />)}</div>
    <div className="mt-5 flex flex-wrap items-center justify-between gap-3"><button type="button" className={botonGris} onClick={limpiar}>Limpiar Filtros</button><p role="status" className="text-sm text-slate-600">Mostrando {cantidad} de {total} reclamos</p></div>
  </section>;
}
