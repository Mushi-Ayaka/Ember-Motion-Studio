# Proceso de release y creación de instaladores

Archivos y scripts relevantes:

- `scripts/build-installer.js`, `scripts/run-builder.js` — tareas de empaquetado.
- `prebuild.js` — tareas previas a la build.

Flujo recomendado:

1. Asegurar que `pnpm build` pasa sin errores.
2. Ejecutar `node scripts/build-installer.js` o el script específico del repo.
3. Validar instalador en máquinas Windows/mac según objetivo.

Checklist antes de release:

- Actualizar `CHANGELOG.md` y `version.ts`.
- Verificar firmas y códigos de licencia si aplica.
