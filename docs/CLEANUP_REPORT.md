# Informe de Limpieza — Ember Motion Studio™

> **Fecha:** 25/05/2026
> **Ramas:** `main` (v5.9.x), `v5.9-lts`, `v6` (nueva)
> **Total archivos en git:** ~249
> **Tamaño repo git comprimido:** ~63 MB
> **Basura estimada:** ~41% del repo (130+ archivos, ~26 MB)

---

## 🔴 CRÍTICO — Acción inmediata requerida

### 1. Historial de chat con IA en el repo
**Archivo:** `docs/overview.txt` (237 KB)
**Riesgo:** Contiene la conversación COMPLETA con una IA (Claude/Cursor) en formato JSON — mensajes del usuario, respuestas de la IA, tool calls, rutas locales del desarrollador (`c:\Users\Josue B\Desktop\...\Dynamic Vector Graphics Engine\...`), fragmentos de código y discusiones de bugs.
**Acción:** ELIMINAR del repo. Esto es un dump de sesión, no documentación.

### 2. Merge conflicts sin resolver (9 archivos)
**Archivos afectados:**
| Archivo | Impacto |
|---------|---------|
| `app/scripts/prebuild.js` | Script de BUILD — podría fallar en producción |
| `app/scripts/run-builder.js` | Script de BUILD — podría fallar en producción |
| `app/electron/resources/MASTER_PROMPT.md` | 🛑 **Prompt maestro del motor DVGE** (archivo crítico) |
| `app/build_guide.js` | Herramienta de desarrollo |
| `app/LEGAL_en.md` | Documento legal |
| `docs/legal/LEGAL.md` | Documento legal |
| `docs/legal/PLUGIN_POLICY.md` | Política de plugins |
| `docs/brand/BRAND_IDENTITY.md` | **5 bloques de conflicto** (el peor) |
| `app/documentation/persistent_context.md` | Contexto para IA |

**Riesgo:** Scripts de build con conflictos sin resolver pueden causar fallos silenciosos en producción.

---

## 🟠 ALTO — Impacto significativo

### 3. Outputs de build trackeados en git (~20 MB)
| Directorio | Archivos | Tamaño | Problema |
|---|---|---|---|
| `app/remotion-bundle/` | 31 archivos | ~18 MB | Output del script `bundle-remotion.js`. Sourcemaps (`.js.map`) de hasta 4.9 MB |
| `app/dist-electron/` | 8 archivos | ~2.35 MB | Output de `tsc && vite build`. Contiene `main.js` (2.2 MB) |

**Acción:** Dejar de trackear. Añadir al `.gitignore`. Los builds deben generarse, no committearse.

### 4. Lock file de npm en proyecto que usa pnpm
**Archivo:** `app/package-lock.json` (413 KB)
**Problema:** El proyecto usa `pnpm` (tiene `pnpm-lock.yaml`). `package-lock.json` es residuo de npm.
**Acción:** Eliminar.

---

## 🟡 MEDIO — Limpieza recomendada

### 5. Directorio `archives/` completo (~24 archivos, ~2 MB)
**Contiene:** Auditorías v4/v5, planes de implementación obsoletos, notas de monetización, prototipos en Python, documentación desactualizada.
**Archivos destacados:**
- `archives/v1_lottie_native/` — Prototipo Python abandonado (~45 archivos, ~78 MB en disco)
- `archives/MONETIZATION_NOTES.md` — Notas de monetización (información sensible)
- `archives/AUDIT_ENGINE_v58.md`, `QA_REMEDIATION_PLAN.md`, `implementation_plan.md` — Planes v4/v5 obsoletos
- `archives/KNOWLEDGE_BRIDGE.md.pdf` — PDF binario de 361 KB
- `archives/DVGE-Context-*.pdf` — PDFs de contexto generados

**Propuesta:** Mover a un tag de git (`archives-v5`) o eliminar. No tienen valor para v6.

### 6. Documentación legal duplicada y desorganizada
| Ubicación | Archivos | Estado |
|---|---|---|
| `app/LEGAL.md` + `app/LEGAL_en.md` + `app/PLUGIN_POLICY.md` + `app/PLUGIN_POLICY_en.md` | 4 archivos | Dispersos |
| `docs/legal/LEGAL.md` + `docs/legal/PLUGIN_POLICY.md` | 2 archivos | **Con merge conflicts** |

**Propuesta:** Definir una única ubicación (`app/legal/` o `docs/legal/`) y eliminar la otra copia.

### 7. Imágenes duplicadas en 3 ubicaciones (~1.85 MB)
Las imágenes (`logo.png`, `logo-square.png`, `icon.png`, `icon_highlight.png`, `element.png`, `elementSquare.png`) existen en:
- `app/public/` ← fuente de verdad
- `app/dist/` ← Vite copia automáticamente en build (no trackeado)
- `app/remotion-bundle/public/` ← trackeado innecesariamente

**Propuesta:** Eliminar de `app/remotion-bundle/public/`.

### 8. Archivos huérfanos y temporales
| Archivo | Problema |
|---|---|
| `app/scratch/minimal.html` | Página de prueba |
| `app/scratch/registry_test.json` | Archivo vacío |
| `app/scratch/verify_render.mjs` | Script con rutas absolutas del developer |
| `app/src/components/ManualView.tsx.tmp` | Archivo temporal de 65 B |
| `app/build_guide.js` | Script con merge conflicts |

### 9. Roadmaps duplicados y desactualizados
| Archivo | Contenido | Estado |
|---|---|---|
| `archives/roadmap.md` | Roadmap v4.0.0 | Obsoleto |
| `docs/ROADMAP.md` | Roadmap v6 | Puede integrarse en la planificación de v6 |

### 10. Doc de arquitectura triplicada
| Archivo | Tamaño |
|---|---|
| `docs/architecture/architecture_v6.md` | 14.7 KB |
| `docs/architecture/DVGE-v6-Architecture-Spec.md` | 1.3 KB (innecesario) |
| `developer_docs/md/architecture.md` | 736 B (duplica) |

---

## 🟢 BAJA — A considerar

### 11. `package.json` en la raíz
Solo delega scripts a `app/`. Útil para tener comandos cortos (`pnpm dev` vs `cd app && pnpm dev`). Se puede mantener o eliminar según preferencia.

### 12. `app/pnpm-workspace.yaml`
No define workspaces reales. Solo configura `allowBuilds`. Podría integrarse en `.npmrc` o `package.json`.

### 13. `app/CHANGELOG.md`
Solo cubre hasta v5.6.0. Faltan v5.7, v5.8, v5.9. Actualizar o eliminar.

---

## 📋 PROPUESTA DE ACCIÓN

### Fase 1 — Inmediata (v5.9-lts)
```bash
# 1. Eliminar chat history
git rm docs/overview.txt

# 2. Resolver merge conflicts en archivos críticos
#    - app/scripts/prebuild.js
#    - app/scripts/run-builder.js
#    - app/electron/resources/MASTER_PROMPT.md

# 3. Eliminar lock file de npm
git rm app/package-lock.json

# 4. Eliminar archivos temporales
git rm app/src/components/ManualView.tsx.tmp
git rm app/scratch/minimal.html app/scratch/registry_test.json app/scratch/verify_render.mjs

# 5. Eliminar build_guide.js
git rm app/build_guide.js
```

### Fase 2 — Semanas 1-2 (v6)
```bash
# 6. Dejar de trackear outputs de build
#    - Añadir al .gitignore: app/dist-electron/ y app/remotion-bundle/
#    - Eliminar del repo: git rm -r --cached app/dist-electron/ app/remotion-bundle/

# 7. Eliminar archives/ completo (o mover a tag)
git tag archives-v5 <commit-hash>
git rm -r archives/

# 8. Resolver merge conflicts restantes (docs legales, brand)

# 9. Consolidar docs legales en una sola ubicación

# 10. Eliminar imágenes duplicadas de remotion-bundle/public/
```

### Fase 3 — Organización (v6)
- Refinar `.gitignore`
- Decidir si mantener `package.json` raíz
- Actualizar `CHANGELOG.md`
- Decidir destino de `developer_docs/` vs `docs/`

---

## 📊 Resumen de impacto

| Fase | Archivos | Espacio recuperado | Riesgo |
|:----:|:--------:|:------------------:|:------:|
| 1 | ~7 | ~650 KB | Bajo (solo basura) |
| 2 | ~70 | ~22 MB | Medio (cambiar .gitignore) |
| 3 | ~50+ | ~3 MB | Bajo (organización) |
| **Total** | **~130** | **~26 MB (41% del repo)** | |

---

> **Nota:** La rama `v6` ya está creada desde `main`. La rama `v5.9-lts` fue actualizada con los 5 commits que le faltaban (fast-forward merge). Ambas están listas para trabajar por separado.
