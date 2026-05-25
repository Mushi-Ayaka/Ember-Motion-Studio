# Depuración y troubleshooting

Puntos para depurar rápidamente:

- Abre DevTools en renderer para inspeccionar componentes y network.
- Logs del proceso principal aparecen en la salida donde lanzaste Electron (terminal).
- `electron/resources/telemetry/` contiene artefactos y logs que pueden ayudar.
- Para problemas de plugins, aumenta el logging en `plugin-manager.ts` y reinicia Electron.

Checks comunes:

- ¿Se está cargando el bundle correcto? revisa `remotion-bundle/` y `app/dist/`.
- ¿Errores de TypeScript? ejecuta `pnpm build` y revisa `tsconfig.json`.
