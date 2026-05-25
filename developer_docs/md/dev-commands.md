# Instrucciones de desarrollo y comandos

Este documento centraliza los comandos y flujos usados durante el desarrollo.

Instalación (una sola vez):

```bash
pnpm install
```

Comandos de uso frecuente:

- Desarrollo (web + watcher): `pnpm dev` (ejecuta la build en modo dev y levanta la app web).
- Compilación de producción: `pnpm build`.
- Empaquetado/instalador: revisa `scripts/build-installer.js` y usa `node scripts/run-builder.js` según la configuración del proyecto.
- Servir documentación local: `npx http-server developer_docs -o`.

Notas:

- Muchas tareas están encapsuladas en `scripts/` y en `app/` — revisa esos archivos para automatizaciones específicas.
- Para cambios en plugins reinicia Electron o usa el watcher si existe.
