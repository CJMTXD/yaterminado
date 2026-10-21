import React from 'react';
import { catalogos } from '../utils/reclamos';
export const estiloControl = 'w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100';
export default function Campo({ campo, etiqueta, tipo = 'text', valor, cambiar, obligatorio = false, soloLectura = false, prefijo = '' }) {
  const props = { id: prefijo + campo, name: campo, value: valor || '', onChange: e => cambiar?.(campo, e.target.value), className: estiloControl, readOnly: soloLectura, 'aria-required': obligatorio };
  return <div className={tipo === 'textarea' ? 'sm:col-span-2' : ''}>
    <label htmlFor={prefijo + campo} className="mb-1.5 block text-sm font-medium text-slate-700">{etiqueta}{obligatorio && <span aria-hidden="true" className="text-red-600"> *</span>}</label>
    {tipo === 'select' ? <select {...props}><option value="">Seleccionar</option>{catalogos[campo].map(opcion => <option key={opcion}>{opcion}</option>)}</select> : tipo === 'textarea' ? <textarea {...props} rows={3}/> : <input {...props} type={tipo}/>}
  </div>;
}
