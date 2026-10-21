# Documentación funcional

## 1. Descripción general

Gestión de Reclamos y Garantías de productos. Una única pantalla permite registrar, modificar, consultar, filtrar, seguir el proceso por áreas y eliminar reclamos. Implementada con componentes funcionales de React, useState, useEffect y estilos Tailwind CSS.

## 2. Actores o roles inferidos

Operador de reclamos: persona que usa todas las acciones de la pantalla. Vendedor, Despacho, Bodega, Producción, Calidad y Comercialización aparecen como áreas o datos del proceso, sin usuarios separados. El cliente es el sujeto del reclamo.

Autenticación, permisos y asignación de acciones a roles: **no definido**. No se implementan restricciones por área.

## 3. Funcionalidades principales

Crear reclamos, editar datos iniciales, registrar seguimiento, conservar el código original, consultar registros del más reciente al más antiguo, buscar, aplicar cinco filtros combinados y eliminar inmediatamente. La lista se presenta como tabla o tarjetas según el ancho disponible.

## 4. Flujo de creación

1. Se carga la lista con `getClaims()` y se presenta Datos Iniciales.
2. Código de solo lectura: máximo código existente más uno. Lista vacía: RG-0001. Timestamp automático de solo lectura.
3. Se completan los campos obligatorios de la primera etapa. Seguimiento está deshabilitado.
4. Agregar Reclamo valida y guarda mediante `setClaims(claims)`. El estatus final inicial es PENDIENTE.
5. Se limpia el formulario, se calcula el siguiente código y se vuelve a Datos Iniciales. Los filtros activos se conservan; pueden ocultar el registro nuevo.

## 5. Flujo de edición

Editar en una fila o tarjeta carga el registro y abre Datos Iniciales. Código y timestamp conservan los valores originales. Guardar Cambios sustituye el reclamo correspondiente, persiste la lista y vuelve al formulario de creación en Etapa 1. Cancelar descarta las modificaciones sin persistirlas y regresa al estado inicial.

## 6. Flujo de seguimiento

Solo disponible al editar un registro existente. Se accede desde la acción Seguimiento en la lista o desde la pestaña Seguimiento del formulario de edición. Se puede alternar entre etapas conservando los cambios del formulario.

Las siete fechas vacías se completan al abrir la edición: cada una hereda la fecha anterior del flujo; la primera hereda fechaReclamo. Se conservan valores existentes. Son valores propuestos y editables; solo se persisten al guardar. No se propagan de nuevo en tiempo real al modificar una fecha. Calidad-Comentarios, estatus final, conformidad y Comentarios Generales completan el seguimiento. No existen transiciones de estado restringidas.

## 7. Flujo de eliminación

Eliminar quita el registro inmediatamente, actualiza el estado y llama a `setClaims(claims)`. Si se estaba editando ese registro, se cancela la edición; si se editaba otro, se conserva ese formulario.

Confirmación de eliminación: **no definido**. Por instrucción expresa se implementa sin confirmación. Recuperación o papelera: **no definido**, no implementado.

## 8. Reglas de validación

| Etapa | Regla | Mensaje exacto |
| --- | --- | --- |
| Datos Iniciales | Todos los campos obligatorios deben contener un valor distinto de vacío o espacios | Debes llenar todos los campos de la primera etapa. |
| Seguimiento | despachoFinalEstatus obligatorio | Debes llenar todos los campos de seguimiento. |

Los mensajes aparecen en un recuadro rojo con rol de alerta. Al guardar desde cualquier etapa se comprueban primero los datos iniciales y después el estatus final. Si falla una regla, se abre la etapa correspondiente. Las validaciones del formulario son explícitas para conservar los textos exactos solicitados.

Sugerencias, Evidencia, fechas del seguimiento, comentarios y conformidad son opcionales. Evidencia admite texto libre o URL y no se transforma en enlace ni carga archivos. Validación de URL, longitudes, fechas futuras y orden cronológico entre áreas: **no definido**, no se aplica. Las fechas se introducen con controles date del navegador.

## 9. Catálogos y opciones

| Campo | Opciones |
| --- | --- |
| Vendedor | CALL CENTER, ORIENTE, CADENAS, CENTRO, OCCIDENTE, OFICINA |
| Clasificación | GARANTÍA, REPARACIÓN FUERA DE GARANTÍA |
| Tipo de Reclamo | Mueble, Cama |
| Tipo de Problema | Madera, Tela, Patas, Tela y patas, Resorte, Fieltro, Espuma |
| Despacho Final Estatus | DESPACHADO, NO PROCEDE, PENDIENTE |
| Conformidad del Cliente | Inconformidad de cliente, Aceptación de cliente |

Seleccionar representa vacío en los selects; en filtros equivale a no restringir ese campo. No se añaden opciones al dominio.

## 10. Filtros y ordenamiento

Búsqueda parcial por cliente, producto, código o ubicación, sin distinguir mayúsculas/minúsculas. Se recortan espacios en los extremos de la consulta; los acentos se distinguen. Los cinco selects son Vendedor, Clasificación, Tipo de Reclamo, Estatus Final y Conformidad del Cliente.

Todos los criterios se combinan con AND; la búsqueda coincide si cualquiera de sus cuatro campos contiene el término. Se actualizan en cada cambio, sin botón Aplicar. Limpiar Filtros restablece búsqueda y selects. El contador muestra `Mostrando X de Y reclamos`, donde X es la cantidad visible y Y el total almacenado.

Con un criterio activo, el título es `Reclamos · resultados filtrados`. Sin resultados se muestra `No se encontraron reclamos con los filtros aplicados`, también si la lista inicial está vacía.

Orden descendente por timestamp; si falta, por fechaReclamo. No hay selector de orden. Fechas inválidas se consideran de antigüedad cero. Los empates conservan el orden de entrada de la lista.

## 11. Persistencia de datos

`src/utils/dataManager.js` expone exactamente `getClaims()` y `setClaims(claims)` usando JSON en la clave localStorage `reclamos-garantias`. La carga inicial ocurre en useEffect. Crear, editar o eliminar persiste la lista completa y actualiza el estado. Se escribe antes de confirmar el cambio de estado para no mostrar una operación como guardada si falla localStorage.

Sin backend definido. No existe sincronización entre dispositivos, usuarios o pestañas. Los registros permanecen tras recargar en el mismo origen y navegador; borrar los datos del navegador los elimina. Si JSON es ilegible o no es una lista, se informa el fallo y no se habilita el formulario ni se sobrescribe el contenido. Si la escritura falla se informa y se conserva el formulario. Migraciones y recuperación de datos corruptos: **no definido**.

## 12. Comportamiento responsive

Tarjeta blanca con sombra y bordes redondeados para formulario, filtros y lista. Formulario de una columna en pantallas pequeñas y dos desde 640 px. Filtros distribuidos en una, dos o tres columnas según el ancho.

Desde 768 px se presenta una tabla con scroll horizontal y columnas Código, Fecha, Cliente, Producto, Clasificación, Estatus Final, Conformidad Cliente y Acciones. Debajo de 768 px se presentan tarjetas con código, cliente, producto, clasificación, fecha, estatus, conformidad cuando existe y las tres acciones.

DESPACHADO: verde. PENDIENTE: amarillo. NO PROCEDE u otro valor: rojo. Los estatus se muestran también en texto. Editar usa índigo, Seguimiento gris y Eliminar rojo. Código, timestamp y los controles tienen etiquetas asociadas; los obligatorios se identifican visualmente y mediante aria-required.

## 13. Casos borde y funcionalidades no definidas

| Caso | Estado y comportamiento |
| --- | --- |
| Lista vacía | Código RG-0001 y mensaje sin coincidencias |
| Huecos en códigos | Se utiliza máximo existente más uno, no cantidad |
| Eliminar el código máximo | Puede reutilizarse al crear otro registro, conforme al máximo actual |
| Superar RG-9999 | Límite **no definido**; se conservan los dígitos necesarios, por ejemplo RG-10000 |
| Código de origen ajeno al patrón | Se ignora para calcular el máximo; no hay importación implementada |
| Timestamp ausente | Se ordena por fechaReclamo; no se inventa timestamp al editar |
| Empates de fecha | Desempate **no definido**; se conserva el orden de entrada |
| Evidencias adjuntas | Subida, vista previa y descarga: **no definido** |
| Roles, login y seguridad por usuario | **No definido** |
| Operaciones simultáneas entre pestañas | **No definido**; no hay resolución de conflictos |
| Historial/auditoría, notificaciones, plazos y responsables | **No definido** |
| Validación de cronología y reglas por tipo de producto | **No definido** |
| Paginación, exportación, importación, gráficos | **No definido** |
| Navegadores oficialmente soportados | **No definido**; QA ejecutado en Chromium |

## 14. Resumen de campos por etapa

| Etapa | Campo de datos | Control | Obligatorio / valor inicial |
| --- | --- | --- | --- |
| 1 | id | Texto, solo lectura | RG-0001 con lista vacía |
| 1 | timestamp | datetime-local, solo lectura | Automático al inicializar el formulario |
| 1 | vendedor | Select | Sí |
| 1 | fechaReclamo | date | Sí |
| 1 | cliente | Texto | Sí |
| 1 | ubicacion | Texto | Sí |
| 1 | producto | Texto | Sí |
| 1 | clasificacion | Select | Sí |
| 1 | tipoReclamo | Select | Sí |
| 1 | tipoProblema | Select | Sí |
| 1 | descripcion | Textarea | Sí |
| 1 | sugerencias | Textarea | No |
| 1 | evidencia | Texto/URL | No |
| 2 | despachoRecepcion | date | No / fechaReclamo |
| 2 | despachoEntregaBodega | date | No / fecha anterior |
| 2 | bodegaFechaProduccion | date | No / fecha anterior |
| 2 | produccionFechaReparacion | date | No / fecha anterior |
| 2 | produccionEntregaBodega | date | No / fecha anterior |
| 2 | calidadRevisionBPT | date | No / fecha anterior |
| 2 | comercializacionFechaRemision | date | No / fecha anterior |
| 2 | calidadComentarios | Textarea | No |
| 2 | despachoFinalEstatus | Select | Sí / PENDIENTE desde creación |
| 2 | conformidadClienteEstatus | Select | No |
| 2 | comentariosGenerales | Textarea | No |

## 15. Posibles mejoras futuras (no implementadas)

Opciones a evaluar por separado, sujetas a requisitos nuevos: confirmación o recuperación de eliminación, almacenamiento en backend y permisos por área, carga de evidencias, reglas cronológicas del seguimiento, resolución de conflictos entre pestañas y política de códigos históricos. No forman parte del comportamiento entregado.

## Supuestos tomados

- Generación de códigos: lista vacía equivale a base RG-0000; el primer registro es RG-0001. Con registros se calcula el máximo sufijo numérico válido, se suma uno y se formatea con un mínimo de cuatro dígitos. Esta decisión sigue la regla solicitada.
- La zona horaria de negocio es **no definida**. Timestamp usa fecha y hora local del navegador, se genera al abrir o reiniciar el formulario y se conserva al editar; no representa la última modificación.
- Se aplica herencia a las siete fechas de seguimiento al abrir la edición; cada valor vacío toma el anterior y la primera fecha toma fechaReclamo. No se sobrescriben fechas existentes ni se vuelve a propagar tras cambiar un control.
- Cambiar de etapa conserva el borrador; guardar desde cualquiera valida las dos etapas. Cancelar no guarda. Cambiar a otro reclamo reemplaza el borrador; advertencia por cambios sin guardar: **no definido**.
- Los filtros se conservan al guardar y al cancelar. La fecha mostrada en filas y tarjetas es fechaReclamo en formato YYYY-MM-DD; formato visual de fecha: **no definido**.
- Los límites responsive se fijan en 640 y 768 px conforme a los breakpoints de Tailwind; medidas exactas: **no definido**.
- Ante corrupción de almacenamiento se bloquea la escritura para conservar los datos. No se implementa recuperación automática ni migración de esquemas externos.
- El proyecto se ejecuta con Vite y Node.js 24; herramientas de compilación: **no definido** en la especificación funcional. El workflow de Pages existente se adapta para compilar React y subir dist/.
