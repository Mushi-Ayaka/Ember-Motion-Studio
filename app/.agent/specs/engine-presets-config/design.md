# Technical Design: Engine Presets & Global Config (v3.4.0)

## Visión General
Este sistema permite abstraer la complejidad de la UI y la configuración del entorno, proporcionando "bloques de construcción" (Presets) que el motor resuelve en tiempo de ejecución. Esto garantiza que la IA no necesite generar código redundante y que los plugins sean más ligeros y robustos.

## Arquitectura de Componentes

> **✅ Validación en Producción (v3.4.0)**: Migrar el plugin `html-to-video-editor` (generado por IA) a este sistema modular resultó en una reducción de código del **93%**, pasando de ~1,896 líneas a apenas ~117 líneas. Todo el Boilerplate de UI se delegó exitosamente al motor.

### 1. Preset Resolver (Zustand + Logic)
El motor de plugins ahora tendrá un paso intermedio de "Resolución de Manifest":
- Si el manifest declara `preset: "branding"`, el motor lo expande a tres campos técnicos (`logoUrl`, `primaryColor`, `brandTitle`).
- Esto se gestionará en un nuevo `PresetManager` dentro de `useStore.ts`.

### 2. UI Injection Bridge (PluginWrapper)
Los componentes de alto nivel (`dv-editor-panel`, `dv-file-manager`) funcionarán mediante inyección de fragmentos:
- **HTML Injection**: El motor inyectará un bloque de HTML base en el Shadow DOM *antes* del HTML del plugin.
- **CSS Injection**: Inyección de variables CSS globales (ej: `--dv-safe-area-top`) y estilos de utilidad.
- **JS Hooks**: Los presets pueden registrar sus propios hooks de ciclo de vida que se ejecutan en paralelo a los del plugin.

## Modelos de Datos

```typescript
// env.d.ts additions
type PresetType = 'branding' | 'motion' | 'layout' | 'editor-full';

interface GlobalEnv {
  isExporting: boolean;
  resolution: { width: number, height: number };
  safeArea: { top: number, left: number, right: number, bottom: number };
}

interface DVContext {
  // ... existing
  env: GlobalEnv;
  global: Record<string, any>; // Configuración persistente del motor
}
```

## Manejo de Errores
- **Fallback de Presets**: Si un preset no se encuentra o tiene una versión incompatible, el motor registrará un error en la consola pero permitirá que el plugin cargue con sus campos nativos para evitar pantallas negras.
- **Validación de Tipos**: Verificación estricta de que los valores de los presets coincidan con el tipo de dato esperado (`image` para logos, `color` para branding).

## Estrategia de Testing
- **Unit Testing**: Probar el `PresetResolver` con diferentes combinaciones de manifests.
- **E2E Testing (Browser)**: Verificar que los campos de los presets aparecen en el Sidebar y que sus valores llegan al `PluginWrapper`.

## Archivos Impactados

| Archivo | Cambio |
| :--- | :--- |
| `src/env.d.ts` | Extensión de interfaces core. |
| `src/store/useStore.ts` | Lógica de gestión de presets y estado `env`. |
| `src/remotion/PluginWrapper.tsx` | Inyección de HTML/CSS de Presets. |
| `src/App.tsx` | Renderizado modular del Sidebar. |
| `src/components/EditorPanel.tsx` | Implementación del módulo de edición. |
| `src/components/FileManager.tsx` | Implementación del gestor de assets. |

---

## Checkpoint 2
He estructurado el diseño para que el motor sea quien "mande" sobre la UI, dejando que el plugin solo se preocupe de la lógica creativa. ¿Ves algún punto ciego en la inyección de los paneles de edición o el gestor de archivos?
