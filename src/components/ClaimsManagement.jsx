import React, { useEffect, useState } from 'react';
import { getClaims, setClaims } from '../utils/dataManager';
import { nuevoReclamo, completarFechas, iniciales, filtrosVacios, filtrarOrdenar } from '../utils/reclamos';
import FormularioReclamo from './FormularioReclamo';
import FiltrosReclamos from './FiltrosReclamos';
import ListaReclamos from './ListaReclamos';
export default function ClaimsManagement() {
  const [reclamos, actualizarReclamos] = useState([]);
  const [formulario, actualizarFormulario] = useState(() => nuevoReclamo([]));
  const [editando, actualizarEdicion] = useState(false);
  const [etapa, actualizarEtapa] = useState(1);
  const [filtros, actualizarFiltros] = useState(filtrosVacios);
  const [error, actualizarError] = useState('');
  const [errorDatos, actualizarErrorDatos] = useState('');
  const [cargado, actualizarCarga] = useState(false);
  useEffect(() => {
    try {
      const guardados = getClaims();
      actualizarReclamos(guardados);
      actualizarFormulario(nuevoReclamo(guardados));
      actualizarCarga(true);
    } catch { actualizarErrorDatos('No se pudieron cargar los reclamos del almacenamiento local.'); }
  }, []);
  function reiniciar(datos = reclamos) {
    actualizarFormulario(nuevoReclamo(datos)); actualizarEdicion(false); actualizarEtapa(1); actualizarError('');
  }
  function persistir(datos) {
    try { setClaims(datos); actualizarReclamos(datos); actualizarErrorDatos(''); return true; }
    catch { actualizarErrorDatos('No se pudieron guardar los reclamos en el almacenamiento local.'); return false; }
  }
  function guardar(evento) {
    evento.preventDefault();
    if (!iniciales.filter(([, , , opcional]) => !opcional).every(([campo]) => String(formulario[campo] || '').trim())) {
      actualizarEtapa(1); actualizarError('Debes llenar todos los campos de la primera etapa.'); return;
    }
    if (!formulario.despachoFinalEstatus) {
      actualizarEtapa(2); actualizarError('Debes llenar todos los campos de seguimiento.'); return;
    }
    const datos = editando ? reclamos.map(r => r.id === formulario.id ? { ...formulario } : r) : [...reclamos, { ...formulario }];
    if (persistir(datos)) reiniciar(datos);
  }
  function editar(reclamo, siguienteEtapa) {
    actualizarFormulario(completarFechas(reclamo)); actualizarEdicion(true); actualizarEtapa(siguienteEtapa); actualizarError('');
    document.getElementById('titulo-formulario')?.scrollIntoView?.({ behavior: 'smooth', block: 'start' });
  }
  function eliminar(id) {
    const datos = reclamos.filter(r => r.id !== id);
    if (persistir(datos)) {
      if (!editando || formulario.id === id) reiniciar(datos);
    }
  }
  const visibles = filtrarOrdenar(reclamos, filtros);
  return <main className="min-h-screen bg-slate-50 px-4 py-8 font-sans text-slate-900 sm:px-8">
    <div className="mx-auto max-w-7xl space-y-6">
      <header className="mb-8"><p className="mb-2 text-xs font-semibold uppercase tracking-widest text-blue-600">Reclamos y garantías</p><h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Gestión de Reclamos y Garantías</h1><p className="mt-3 text-slate-500">Registro y seguimiento de reclamos de productos.</p></header>
      {errorDatos && <p role="alert" className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">{errorDatos}</p>}
      {cargado && <FormularioReclamo {...{formulario, editando, etapa, guardar, error}} cambiar={(campo, valor) => actualizarFormulario(anterior => ({ ...anterior, [campo]: valor }))} cambiarEtapa={valor => { if (valor === 1 || editando) { actualizarEtapa(valor); actualizarError(''); } }} cancelar={() => reiniciar()}/>}
      <FiltrosReclamos filtros={filtros} cambiar={(campo, valor) => actualizarFiltros(anterior => ({ ...anterior, [campo]: valor }))} limpiar={() => actualizarFiltros({ ...filtrosVacios })} cantidad={visibles.length} total={reclamos.length}/>
      <ListaReclamos reclamos={visibles} filtrado={Object.values(filtros).some(Boolean)} editar={editar} eliminar={eliminar}/>
    </div>
  </main>;
}
