# Reporte de QA

## Resultado

Los diez criterios de aceptación cumplen en las verificaciones ejecutadas. Se completaron 11 pruebas automatizadas de lógica y componentes con Vitest/Testing Library y 2 ejecuciones del flujo integral en Chromium con Playwright, una de escritorio y otra móvil. No quedaron pruebas fallidas ni omitidas en estas suites.

Instalación reproducible con `npm ci`: correcta. `npm run build`: correcto. Se revisaron visualmente las capturas de escritorio y móvil producidas por las pruebas E2E. No hubo errores de JavaScript en el navegador durante el flujo integral.

## Checklist de aceptación

- [x] **Crear reclamo con código correcto y timestamp automático.** Se comprueba RG-0001 con lista vacía, máximo más uno con huecos, formato del timestamp automático y campos de solo lectura. La creación persiste el estatus PENDIENTE y prepara el código siguiente.
- [x] **Validación de Etapa 1 y Etapa 2 con sus mensajes exactos.** Se envían datos iniciales vacíos y se vacía el estatus final durante seguimiento. Se verifican `Debes llenar todos los campos de la primera etapa.` y `Debes llenar todos los campos de seguimiento.` en componentes y navegador real.
- [x] **Seguimiento solo accesible al editar.** Se comprueba que el botón está deshabilitado al crear; la acción de un registro existente abre seguimiento y propone fechas.
- [x] **Editar conserva el ID.** Se cambia el cliente y se verifica que se conserva RG-0001 y el timestamp original. Cancelar no persiste el borrador.
- [x] **Lista ordenada de más reciente a más antiguo.** Prueba de la función de selección usada por ambas vistas: timestamps descendentes y fechaReclamo como respaldo si falta timestamp.
- [x] **Los 5 filtros + búsqueda funcionan combinados y en tiempo real.** La prueba de componentes usa siete registros y va descartando uno por cada criterio; Chromium aplica búsqueda y los cinco selects juntos. Se comprueba búsqueda por cliente, producto, código y ubicación.
- [x] **Contador “Mostrando X de Y” y mensaje sin resultados.** Se verifican conteos totales, parciales, cero resultados y limpieza de filtros. El título indica resultados filtrados.
- [x] **Colores de estatus correctos.** Prueba del componente: DESPACHADO verde, PENDIENTE amarillo, NO PROCEDE y otros valores rojo. Chromium comprueba el color calculado de PENDIENTE; las capturas muestran DESPACHADO verde.
- [x] **Tabla en escritorio, tarjetas en móvil.** Chromium: 1440 × 1000 y 390 × 844. Se verifica visibilidad exclusiva de tabla/tarjetas, acciones disponibles y ausencia de desbordamiento horizontal del documento. La tabla dispone de contenedor con scroll horizontal.
- [x] **Persistencia tras recargar la página.** El flujo real crea, actualiza seguimiento y recarga; conserva los datos. Después elimina, recarga y verifica lista vacía. La prueba de componentes también desmonta y vuelve a montar la aplicación leyendo localStorage.

## Verificaciones adicionales

Se verificó la herencia de fechas sin sobrescribir fechas existentes, el guardado de conformidad y comentarios, el retorno a Etapa 1 tras guardar, la eliminación inmediata durante edición y la protección contra sobrescritura de un JSON corrupto. Las pruebas reales recorren las acciones desde la vista apropiada para cada pantalla.

## Cómo reproducir

```bash
npm ci
npm test
npm run build
npm run test:e2e
```

Para E2E se requiere Chromium: se utiliza `/usr/bin/chromium` cuando está disponible; en otro equipo ejecutar `npx playwright install chromium`. Cada ejecución usa almacenamiento aislado del navegador. Las capturas se generan en `test-results/` y los resultados de pruebas no se versionan.

## Límites de QA y puntos no definidos

No hay criterios incumplidos detectados dentro de lo probado. Firefox, Safari, dispositivos físicos, pruebas de carga y accesibilidad integral no se ejecutaron. No se ejecutó el despliegue remoto de GitHub Pages; la compilación que consume su workflow sí se verificó localmente.

Confirmación de eliminación: **no definido** en el requisito; se implementó y verificó eliminación sin confirmación. Backend, usuarios/roles, sincronización concurrente y evidencias como archivos: **no definido**, fuera de lo implementado. La validación de fecha cronológica entre áreas no fue solicitada y no se aplica. Estas limitaciones no se presentan como funciones implementadas ni pruebas aprobadas.
