# Visión general de la arquitectura

La aplicación está dividida en varias capas:

- **Electron**: en `electron/` se orquesta el proceso principal, preload y la integración con el sistema.
- **Frontend**: `app/` y `src/` contienen la UI, componentes React/TSX, y la build con Vite.
- **Engine/Remotion**: la carpeta `remotion-bundle/` y `src/remotion` contienen bundles y lógicas relacionadas al motor de render.
- **Plugins**: `plugin-src/` aloja plugins que pueden ser cargados por `plugin-manager.ts`.
- **Scripts y herramientas**: `scripts/` y `archives/tools/` contienen helpers para packaging y deploy.

Eventos y comunicación:

- IPC entre `electron/main.ts` y renderer vía canales definidos en `preload.ts`.
