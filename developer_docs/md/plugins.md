# Guía rápida de plugins

La carpeta `plugin-src/` contiene el código fuente de los plugins.

Puntos importantes:

- `plugin-manager.ts` en `electron/` se encarga de cargar y gestionar plugins.
- Para desarrollar un nuevo plugin, crea una carpeta en `plugin-src/` con su `package.json` y un punto de entrada.
- Durante desarrollo, reinicia el proceso Electron si agregas nuevos plugins o usa el watcher interno si existe.

Ejemplo mínimo de estructura de plugin:

```
plugin-src/my-plugin/
  package.json
  index.js
```
