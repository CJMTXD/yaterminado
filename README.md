# Gestión de Reclamos y Garantías

Aplicación React funcional con Tailwind CSS y persistencia en localStorage. Permite crear, editar, dar seguimiento, filtrar y eliminar reclamos, con tabla en escritorio y tarjetas en móvil.

## 1. Código e instalación

Requisitos: Node.js 24 LTS y npm. No requiere backend, base de datos, credenciales ni variables de entorno.

```bash
cd /workspace/yaterminado
npm ci
npm run dev
```

Vite informa el puerto del servidor (5173 por defecto). Abre ese puerto mediante el mecanismo de acceso de tu entorno. En un equipo local, puedes usar la dirección que imprime Vite.

```bash
npm test          # Pruebas de lógica y componentes
npm run build     # Compilación de producción en dist/
npm run preview   # Servir la compilación de producción
npm run test:e2e  # Chromium: escritorio y móvil; requiere npm run build previo
```

Las pruebas E2E usan `/usr/bin/chromium` si está instalado. En otros equipos, instala el navegador de Playwright con `npx playwright install chromium` (o `npx playwright install --with-deps chromium` cuando necesites sus dependencias del sistema). Playwright inicia y cierra su propio servidor de previsualización.

```text
.github/workflows/static.yml       GitHub Pages: instalar, probar y compilar
index.html                        Entrada HTML
package.json / package-lock.json  Dependencias y scripts
vite.config.js                    Vite, Tailwind y Vitest
playwright.config.js              Pruebas reales en dos tamaños de pantalla
src/
  main.jsx                        Entrada React
  styles.css                      Solo importación de Tailwind
  components/
    ClaimsManagement.jsx          Estado y operaciones de reclamos
    Campo.jsx                     Control reutilizable accesible
    FormularioReclamo.jsx          Datos Iniciales y Seguimiento
    FiltrosReclamos.jsx            Búsqueda y cinco filtros
    ListaReclamos.jsx              TablaReclamos, TarjetasReclamos y acciones
  utils/
    dataManager.js                getClaims() y setClaims(claims)
    reclamos.js                   Catálogos, campos, códigos, fechas y filtros
tests/
  setup.js                        Preparación y limpieza de pruebas
  reclamos.test.jsx               Pruebas de lógica y componentes
  e2e/flujo.spec.js                Flujo funcional en Chromium
docs/
  funcional.md                    Documentación funcional y supuestos
  qa.md                           Checklist y evidencia de QA
```

El flujo existente de GitHub Pages ahora construye y sube `dist/`. Se conservan sus disparadores: push a `main` o ejecución manual. La publicación requiere habilitar Pages con GitHub Actions en el repositorio. No se ha ejecutado ningún despliegue desde este trabajo.

Los datos pertenecen al origen y navegador donde se registran; cambiar de dominio o puerto usa otro almacenamiento. El repositorio no incluye datos precargados.

## 2. Documentación funcional

Consulta [docs/funcional.md](docs/funcional.md).

## 3. Reporte de QA

Consulta [docs/qa.md](docs/qa.md).
