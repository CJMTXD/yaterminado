import React from 'react';
export function Estatus({ valor }) {
  const color = valor === 'DESPACHADO' ? 'bg-green-100 text-green-800' : valor === 'PENDIENTE' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800';
  return <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${color}`}>{valor || 'Sin estatus'}</span>;
}
function Acciones({ reclamo, editar, eliminar }) {
  return <div className="flex flex-wrap gap-2">
    <button type="button" aria-label={`Editar ${reclamo.id}`} onClick={() => editar(reclamo, 1)} className="rounded-md bg-indigo-50 px-3 py-2 text-xs font-semibold text-indigo-700 hover:bg-indigo-100">Editar</button>
    <button type="button" aria-label={`Seguimiento ${reclamo.id}`} onClick={() => editar(reclamo, 2)} className="rounded-md bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200">Seguimiento</button>
    <button type="button" aria-label={`Eliminar ${reclamo.id}`} onClick={() => eliminar(reclamo.id)} className="rounded-md bg-red-50 px-3 py-2 text-xs font-semibold text-red-700 hover:bg-red-100">Eliminar</button>
  </div>;
}
export function TablaReclamos({ reclamos, ...acciones }) {
  return <div className="hidden overflow-x-auto md:block"><table className="w-full min-w-[1100px] text-left text-sm">
    <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500"><tr>{['Código', 'Fecha', 'Cliente', 'Producto', 'Clasificación', 'Estatus Final', 'Conformidad Cliente', 'Acciones'].map(titulo => <th scope="col" className="px-4 py-4" key={titulo}>{titulo}</th>)}</tr></thead>
    <tbody className="divide-y divide-slate-100">{reclamos.map(reclamo => <tr key={reclamo.id} className="hover:bg-slate-50">
      <td className="whitespace-nowrap px-4 py-4 font-semibold text-blue-700">{reclamo.id}</td><td className="whitespace-nowrap px-4 py-4">{reclamo.fechaReclamo}</td><td className="max-w-56 break-words px-4 py-4">{reclamo.cliente}</td><td className="max-w-56 break-words px-4 py-4">{reclamo.producto}</td><td className="px-4 py-4">{reclamo.clasificacion}</td><td className="px-4 py-4"><Estatus valor={reclamo.despachoFinalEstatus}/></td><td className="px-4 py-4">{reclamo.conformidadClienteEstatus || '—'}</td><td className="px-4 py-4"><Acciones reclamo={reclamo} {...acciones}/></td>
    </tr>)}</tbody>
  </table></div>;
}
export function TarjetasReclamos({ reclamos, ...acciones }) {
  return <div className="grid gap-4 p-4 md:hidden">{reclamos.map(reclamo => <article key={reclamo.id} className="min-w-0 rounded-xl border border-slate-200 p-4">
    <div className="mb-3 flex flex-wrap items-center justify-between gap-2"><h3 className="font-semibold text-blue-700">{reclamo.id}</h3><Estatus valor={reclamo.despachoFinalEstatus}/></div>
    <p className="break-words font-semibold">{reclamo.cliente}</p><p className="mt-1 break-words text-sm text-slate-600">{reclamo.producto}</p>
    <p className="mt-2 text-xs text-slate-500">{reclamo.clasificacion} · {reclamo.fechaReclamo}</p>
    {reclamo.conformidadClienteEstatus && <p className="mt-2 text-sm text-slate-600">{reclamo.conformidadClienteEstatus}</p>}
    <div className="mt-4"><Acciones reclamo={reclamo} {...acciones}/></div>
  </article>)}</div>;
}
export default function ListaReclamos({ reclamos, filtrado, ...acciones }) {
  return <section aria-labelledby="titulo-lista" className="min-w-0 overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
    <h2 id="titulo-lista" className="px-5 py-5 text-xl font-semibold">{filtrado ? 'Reclamos · resultados filtrados' : 'Lista de reclamos'}</h2>
    {reclamos.length ? <><TablaReclamos reclamos={reclamos} {...acciones}/><TarjetasReclamos reclamos={reclamos} {...acciones}/></> : <p className="px-5 pb-8 text-sm text-slate-500">No se encontraron reclamos con los filtros aplicados</p>}
  </section>;
}
