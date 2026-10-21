import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen, within, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ClaimsManagement from '../src/components/ClaimsManagement';
import { Estatus } from '../src/components/ListaReclamos';
import { getClaims, setClaims } from '../src/utils/dataManager';
import { siguienteCodigo, nuevoReclamo, completarFechas, filtrarOrdenar, filtrosVacios } from '../src/utils/reclamos';
function ejemplo(id = 'RG-0001', cambios = {}) {
  return { ...nuevoReclamo([]), id, timestamp: '2026-10-20T10:30', vendedor: 'CENTRO', fechaReclamo: '2026-10-19', cliente: 'Ana', ubicacion: 'San Salvador', producto: 'Sofá', clasificacion: 'GARANTÍA', tipoReclamo: 'Mueble', tipoProblema: 'Tela', descripcion: 'Tela dañada', ...cambios };
}
function formulario() { return within(screen.getByRole('region', { name: /Nuevo reclamo|Editar reclamo/ })); }
const abrir = (datos = []) => { setClaims(datos); return render(<ClaimsManagement/>); };
describe('Gestión de Reclamos y Garantías', () => {
  it('genera el siguiente código usando el máximo existente y no la cantidad', () => {
    expect(siguienteCodigo([])).toBe('RG-0001');
    expect(siguienteCodigo([{ id: 'RG-0042' }, { id: 'RG-0002' }])).toBe('RG-0043');
    expect(siguienteCodigo([{ id: 'RG-9999' }])).toBe('RG-10000');
  });
  it('valida Etapa 1, crea un reclamo, limpia el formulario y persiste al recargar', async () => {
    const usuario = userEvent.setup();
    const vista = abrir();
    expect(formulario().getByLabelText('Código', { exact: false })).toHaveValue('RG-0001');
    expect(formulario().getByLabelText('Timestamp', { exact: false }).value).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/);
    expect(formulario().getByLabelText('Timestamp', { exact: false })).toHaveAttribute('readonly');
    expect(formulario().getByRole('button', { name: 'Seguimiento' })).toBeDisabled();
    await usuario.click(screen.getByRole('button', { name: 'Agregar Reclamo' }));
    expect(screen.getByRole('alert')).toHaveTextContent('Debes llenar todos los campos de la primera etapa.');
    for (const [etiqueta, valor] of [['Vendedor', 'CENTRO'], ['Clasificación', 'GARANTÍA'], ['Tipo de Reclamo', 'Mueble'], ['Tipo de Problema', 'Tela']]) await usuario.selectOptions(formulario().getByLabelText(etiqueta, { exact: false }), valor);
    for (const [etiqueta, valor] of [['Cliente', 'Ana'], ['Sucursal/Ubicación', 'San Salvador'], ['Producto', 'Sofá'], ['Descripción', 'Tela dañada']]) await usuario.type(formulario().getByLabelText(etiqueta, { exact: false }), valor);
    fireEvent.change(formulario().getByLabelText('Fecha de Reclamo', { exact: false }), { target: { value: '2026-10-19' } });
    await usuario.click(screen.getByRole('button', { name: 'Agregar Reclamo' }));
    expect(getClaims()).toHaveLength(1);
    expect(getClaims()[0]).toMatchObject({ id: 'RG-0001', cliente: 'Ana', despachoFinalEstatus: 'PENDIENTE' });
    expect(formulario().getByLabelText('Código', { exact: false })).toHaveValue('RG-0002');
    expect(formulario().getByLabelText('Cliente', { exact: false })).toHaveValue('');
    vista.unmount();
    render(<ClaimsManagement/>);
    expect(screen.getByRole('status')).toHaveTextContent('Mostrando 1 de 1 reclamos');
    expect(within(screen.getByRole('table')).getByText('Ana')).toBeInTheDocument();
  });
  it('edita conservando ID y timestamp; permite cancelar sin guardar', async () => {
    const usuario = userEvent.setup(); abrir([ejemplo()]);
    await usuario.click(within(screen.getByRole('table')).getByRole('button', { name: 'Editar RG-0001' }));
    await usuario.clear(formulario().getByLabelText('Cliente', { exact: false }));
    await usuario.type(formulario().getByLabelText('Cliente', { exact: false }), 'Beatriz');
    await usuario.click(screen.getByRole('button', { name: 'Guardar Cambios' }));
    expect(getClaims()[0]).toMatchObject({ id: 'RG-0001', timestamp: '2026-10-20T10:30', cliente: 'Beatriz' });
    await usuario.click(within(screen.getByRole('table')).getByRole('button', { name: 'Editar RG-0001' }));
    await usuario.type(formulario().getByLabelText('Cliente', { exact: false }), ' sin guardar');
    await usuario.click(screen.getByRole('button', { name: 'Cancelar' }));
    expect(getClaims()[0].cliente).toBe('Beatriz');
    expect(screen.getByRole('button', { name: 'Agregar Reclamo' })).toBeInTheDocument();
  });
  it('valida Etapa 2, guarda seguimiento y reinicia en Etapa 1', async () => {
    const usuario = userEvent.setup(); abrir([ejemplo()]);
    await usuario.click(within(screen.getByRole('table')).getByRole('button', { name: 'Seguimiento RG-0001' }));
    expect(formulario().getByLabelText('Despacho-Recepción', { exact: false })).toHaveValue('2026-10-19');
    await usuario.selectOptions(formulario().getByLabelText('Despacho Final-Estatus', { exact: false }), '');
    await usuario.click(screen.getByRole('button', { name: 'Guardar Cambios' }));
    expect(screen.getByRole('alert')).toHaveTextContent('Debes llenar todos los campos de seguimiento.');
    await usuario.selectOptions(formulario().getByLabelText('Despacho Final-Estatus', { exact: false }), 'DESPACHADO');
    await usuario.selectOptions(formulario().getByLabelText('Conformidad del Cliente-Estatus', { exact: false }), 'Aceptación de cliente');
    await usuario.type(formulario().getByLabelText('Comentarios Generales', { exact: false }), 'Entregado');
    await usuario.click(screen.getByRole('button', { name: 'Guardar Cambios' }));
    expect(getClaims()[0]).toMatchObject({ id: 'RG-0001', despachoFinalEstatus: 'DESPACHADO', conformidadClienteEstatus: 'Aceptación de cliente', comentariosGenerales: 'Entregado', comercializacionFechaRemision: '2026-10-19' });
    expect(formulario().getByLabelText('Código', { exact: false })).toBeInTheDocument();
  });
  it('aplica búsqueda y los cinco filtros combinados en tiempo real y los limpia', async () => {
    const usuario = userEvent.setup();
    const objetivo = ejemplo('RG-0001', { conformidadClienteEstatus: 'Aceptación de cliente' });
    const campos = ['vendedor', 'clasificacion', 'tipoReclamo', 'despachoFinalEstatus', 'conformidadClienteEstatus'];
    const alternativos = ['ORIENTE', 'REPARACIÓN FUERA DE GARANTÍA', 'Cama', 'DESPACHADO', 'Inconformidad de cliente'];
    abrir([objetivo, ...campos.map((campo, i) => ejemplo(`RG-000${i + 2}`, { ...objetivo, id: `RG-000${i + 2}`, [campo]: alternativos[i] })), ejemplo('RG-0007', { cliente: 'Luis', conformidadClienteEstatus: 'Aceptación de cliente' })]);
    const filtros = within(screen.getByRole('region', { name: 'Filtros' }));
    await usuario.type(filtros.getByRole('searchbox'), 'ana');
    expect(screen.getByRole('status')).toHaveTextContent('Mostrando 6 de 7 reclamos');
    const etiquetas = ['Vendedor', 'Clasificación', 'Tipo de Reclamo', 'Estatus Final', 'Conformidad del Cliente'];
    for (let i = 0; i < campos.length; i++) {
      await usuario.selectOptions(filtros.getByLabelText(etiquetas[i], { exact: false }), objetivo[campos[i]]);
      expect(screen.getByRole('status')).toHaveTextContent(`Mostrando ${5 - i} de 7 reclamos`);
    }
    expect(screen.getByRole('heading', { name: 'Reclamos · resultados filtrados' })).toBeInTheDocument();
    await usuario.type(filtros.getByRole('searchbox'), ' sin coincidencias');
    expect(screen.getByText('No se encontraron reclamos con los filtros aplicados')).toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveTextContent('Mostrando 0 de 7 reclamos');
    await usuario.click(screen.getByRole('button', { name: 'Limpiar Filtros' }));
    expect(screen.getByRole('status')).toHaveTextContent('Mostrando 7 de 7 reclamos');
  });
  it('busca por cada campo y ordena por timestamp con fechaReclamo como respaldo', () => {
    const datos = [ejemplo('RG-0001', { timestamp: '', fechaReclamo: '2026-10-18' }), ejemplo('RG-0002'), ejemplo('RG-0003', { timestamp: '2026-10-21T10:00' })];
    expect(filtrarOrdenar(datos, filtrosVacios).map(r => r.id)).toEqual(['RG-0003', 'RG-0002', 'RG-0001']);
    for (const busqueda of ['ANA', 'sofá', 'RG-0001', 'salvador']) expect(filtrarOrdenar([datos[0]], { ...filtrosVacios, busqueda })).toHaveLength(1);
  });
  it('hereda fechas sin reemplazar fechas existentes', () => {
    const datos = completarFechas(ejemplo('RG-0001', { despachoEntregaBodega: '2026-10-21' }));
    expect(datos.despachoRecepcion).toBe('2026-10-19');
    expect(datos.bodegaFechaProduccion).toBe('2026-10-21');
  });
  it('elimina inmediatamente, persiste y cancela la edición del reclamo eliminado', async () => {
    const usuario = userEvent.setup(); abrir([ejemplo()]);
    const tabla = within(screen.getByRole('table'));
    await usuario.click(tabla.getByRole('button', { name: 'Editar RG-0001' }));
    await usuario.click(tabla.getByRole('button', { name: 'Eliminar RG-0001' }));
    expect(getClaims()).toEqual([]);
    expect(screen.getByRole('button', { name: 'Agregar Reclamo' })).toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveTextContent('Mostrando 0 de 0 reclamos');
  });
  it('asigna verde, amarillo y rojo a los estatus', () => {
    const { rerender } = render(<Estatus valor="DESPACHADO"/>);
    expect(screen.getByText('DESPACHADO')).toHaveClass('bg-green-100');
    rerender(<Estatus valor="PENDIENTE"/>);
    expect(screen.getByText('PENDIENTE')).toHaveClass('bg-yellow-100');
    rerender(<Estatus valor="NO PROCEDE"/>);
    expect(screen.getByText('NO PROCEDE')).toHaveClass('bg-red-100');
    rerender(<Estatus valor="OTRO"/>);
    expect(screen.getByText('OTRO')).toHaveClass('bg-red-100');
  });
  it('muestra tabla y tarjetas con reglas responsive y las mismas acciones', () => {
    abrir([ejemplo()]);
    const tabla = screen.getByRole('table');
    expect(tabla.parentElement).toHaveClass('hidden', 'md:block', 'overflow-x-auto');
    const tarjeta = screen.getByRole('article');
    expect(tarjeta.parentElement).toHaveClass('md:hidden');
    expect(within(tarjeta).getByText('Ana')).toBeInTheDocument();
    expect(within(tarjeta).getAllByRole('button')).toHaveLength(3);
  });
  it('no sobrescribe datos si el almacenamiento contiene JSON corrupto', () => {
    localStorage.setItem('reclamos-garantias', '{'); render(<ClaimsManagement/>);
    expect(screen.getByRole('alert')).toHaveTextContent('No se pudieron cargar');
    expect(screen.queryByRole('button', { name: 'Agregar Reclamo' })).not.toBeInTheDocument();
    expect(localStorage.getItem('reclamos-garantias')).toBe('{');
  });
});
