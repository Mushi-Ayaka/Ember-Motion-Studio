# Technical Design: DVGE Next-Gen Architecture & QA Remediation

## 1. Visión General y Arquitectura
Este documento define la arquitectura para elevar DVGE a la versión 4.0 (Next-Gen). Combina las resoluciones críticas de seguridad y estabilidad del `QA_REMEDIATION_PLAN.md` con las mejoras de API y físicas nativas delineadas en `DVGE_NEXT_GEN_PROPOSALS.md`.

El objetivo es transformar el motor en un entorno **100% determinístico** (frame-based, sin GSAP), **aislado** (sandbox seguro) y **robusto** (sin bloqueos de hilo ni corrupción de datos).

## 2. Componentes e Interfaces

### 2.1. Plugin Sandbox (Security & Reliability)
- **Bloqueo del Contexto Global:** La ejecución en `new Function` inyectará un prototipo vacío o redefinirá `window`, `process`, `require` y `globalThis` como `undefined` para evitar acceso a `ipcRenderer`.
- **Graceful Degradation:** El hook `update` estará encapsulado en un bloque `try/catch`. En caso de fallo, el plugin se deshabilita (`hasStarted = false`) y se emite un log a la UI.
- **Validación Estricta:** El `schema` de `manifest.json` pasará por un filtro de sanitización (asegurando que es un Array) antes de inyectarse en los componentes de React, respaldado por un Error Boundary global.

### 2.2. Motor de Tiempo y Utilidades Nativas (The Deterministic API)
- **`ctx.timeline`**: Se inyecta un objeto de tiempo normalizado.
  - `progress`: `[0.0 - 1.0]` (frame actual / frames totales).
  - `introProgress`, `outroProgress`: Normalización de entrada y salida basada en duraciones predefinidas.
- **`dvEngine.utils`**:
  - `spring(t, stiffness, damping)`: Física de resortes.
  - `typewriter(text, frame, framesPerChar)`: Substrings dinámicos.
  - `tickerOffset(...)`: Loops infinitos sin salto.
- **Estado Oficial (`ctx.state`, `ctx.refs`)**: Memoria oficial persistente del ciclo de vida del plugin.

### 2.3. Subsistema I/O (Main Thread Unblocking)
- **I/O Atómico:** La función de autoguardado escribirá primero en `project.json.tmp` y luego usará `fs.renameSync/rename` para evitar archivos corruptos en apagones.
- **I/O Asíncrono:** Migración de `fs.writeFileSync` a `fs.promises.writeFile` en operaciones intensivas para liberar el Event Loop de Node.

## 3. Estrategia de Desarrollo de Plugins (Ecosistema)
- Deprecación absoluta de librerías en tiempo real (GSAP, Anime.js). Todo el movimiento debe basarse exclusivamente en `ctx.frame` y `dvEngine.utils`.
- Refactorización inminente de `cinematic-opener-gsap` y `scoreboard-pro` para cumplir con este nuevo dogma matemático.
- Actualización de `AI_PLUGIN_GUIDE.md` para instruir a los LLMs sobre las restricciones estáticas.

## 4. Archivos Impactados (Análisis de Impacto)

| Archivo | Acción | Descripción de Cambios |
| :--- | :--- | :--- |
| `app/src/remotion/PluginWrapper.tsx` | Modificar | Sellar Sandbox (Fake Window), Try/Catch en update, Inyectar `ctx.timeline`, `ctx.state`, `ctx.refs`. |
| `app/electron/project-manager.ts` | Modificar | Implementar autoguardado asíncrono y atómico (`.tmp`). |
| `app/src/App.tsx` | Modificar | Sanitización de `manifest.schema` y React Error Boundaries. |
| `app/electron/plugin-manager.ts` | Modificar | Validación estática de lectura de manifiestos. |
| `app/src/remotion/PluginWrapper.tsx` | Modificar | Extender `dvUtils` con `spring`, `typewriter`. |
| `app/AI_PLUGIN_GUIDE.md` | Modificar | Prohibir GSAP. Añadir nueva API `ctx.timeline`. Aclarar `motion` preset. |
| `Plugins (cinematic/scoreboard)` | Refactor | Eliminar dependencias CDN y migrar a Vanilla JS (Frame Math). |

## 5. Criterios de Corrección y Testing (PBT)
- **Invariante de Seguridad:** Ningún código malicioso dentro de `activePluginFiles.js` puede resolver la referencia `window.ipcRenderer`.
- **Invariante de I/O:** Una interrupción abrupta del proceso (SIGKILL) durante el evento de guardado no debe resultar en un archivo `project.json` corrupto (vacío o JSON malformado).
- **Invariante de Renderizado:** La función de render exportado (Remotion) debe generar un MP4 idéntico independientemente de las interrupciones del hilo principal, garantizado por matemática basada exclusivamente en `frame`.
