import React from 'react';
import Campo from './Campo';
import { iniciales, fechasSeguimiento } from '../utils/reclamos';
export const botonGris = 'rounded-lg bg-slate-100 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-200 focus-visible:outline-2 focus-visible:outline-blue-600';
export default function FormularioReclamo({ formulario, cambiar, editando, etapa, cambiarEtapa, guardar, cancelar, error }) {
  return <section aria-labelledby="titulo-formulario" className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 sm:p-7">
    <h2 id="titulo-formulario" className="text-xl font-semibold">{editando ? `Editar reclamo ${formulario.id}` : 'Nuevo reclamo'}</h2>
    <div className="my-5 flex flex-wrap gap-2" aria-label="Etapas del formulario">
      <button type="button" aria-pressed={etapa === 1} className={`${botonGris} ${etapa === 1 ? 'ring-2 ring-blue-500' : ''}`} onClick={() => cambiarEtapa(1)}>Datos Iniciales</button>
      <button type="button" disabled={!editando} aria-pressed={etapa === 2} className={`${botonGris} disabled:cursor-not-allowed disabled:opacity-40 ${etapa === 2 ? 'ring-2 ring-blue-500' : ''}`} onClick={() => cambiarEtapa(2)}>Seguimiento</button>
    </div>
    <form noValidate onSubmit={guardar}>
      {error && <div role="alert" className="mb-5 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}
      <div className="grid gap-4 sm:grid-cols-2">
        {etapa === 1 ? <>
          <Campo campo="id" etiqueta="Código" valor={formulario.id} soloLectura/>
          <Campo campo="timestamp" etiqueta="Timestamp" tipo="datetime-local" valor={formulario.timestamp} soloLectura/>
          {iniciales.map(([campo, etiqueta, tipo, opcional]) => <Campo key={campo} {...{campo, etiqueta, tipo, cambiar}} valor={formulario[campo]} obligatorio={!opcional}/>)}
        </> : <>
          {fechasSeguimiento.map(([campo, etiqueta]) => <Campo key={campo} {...{campo, etiqueta, cambiar}} tipo="date" valor={formulario[campo]}/>)}
          <Campo campo="calidadComentarios" etiqueta="Calidad-Comentarios" tipo="textarea" valor={formulario.calidadComentarios} cambiar={cambiar}/>
          <Campo campo="despachoFinalEstatus" etiqueta="Despacho Final-Estatus" tipo="select" valor={formulario.despachoFinalEstatus} cambiar={cambiar} obligatorio/>
          <Campo campo="conformidadClienteEstatus" etiqueta="Conformidad del Cliente-Estatus" tipo="select" valor={formulario.conformidadClienteEstatus} cambiar={cambiar}/>
          <Campo campo="comentariosGenerales" etiqueta="Comentarios Generales" tipo="textarea" valor={formulario.comentariosGenerales} cambiar={cambiar}/>
        </>}
      </div>
      <div className="mt-6 flex flex-wrap gap-3 border-t border-slate-100 pt-5">
        <button className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700" type="submit">{editando ? 'Guardar Cambios' : 'Agregar Reclamo'}</button>
        <button className={botonGris} type="button" onClick={cancelar}>Cancelar</button>
      </div>
    </form>
  </section>;
}
