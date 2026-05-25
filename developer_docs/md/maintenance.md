# Plantillas y mantenimiento de la documentación

Convenciones para la documentación:

- Un archivo `.md` por tema dentro de `developer_docs/md/`.
- Mantener `developer_docs/manifest.json` actualizado para que `index.html` muestre los archivos.
- Añade la ruta relativa `md/tu-archivo.md` al `manifest.json` o ejecuta el script de regeneración.

Regenerar manifest automáticamente:

```bash
node developer_docs/scripts/generate-manifest.js
```
