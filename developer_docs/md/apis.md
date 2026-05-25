# APIs internas y servicios

Lugares clave:

- `electron/` — lógica del proceso principal y managers (`main.ts`, `plugin-manager.ts`, `project-manager.ts`).
- `electron/preload.ts` — expone canales seguros IPC al renderer.
- `src/services/` — implementaciones de servicios usados por la UI.
- `remotion-api.ts` — integración con el motor de render (si aplica).

Recomendaciones:

- Antes de cambiar un canal IPC, busca sus consumidores con una búsqueda de texto (`grep`/IDE) para evitar ruptura entre main/renderer.
- Documenta los eventos IPC en `developer_docs/md/apis.md` cuando agregues nuevos canales.
