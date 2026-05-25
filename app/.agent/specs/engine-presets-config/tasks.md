# Tasks: Engine Presets & Global Config (v3.4.0)

- [x] **Phase 1: Foundations & Types**
    - [x] Update `env.d.ts` with `PresetType`, `GlobalEnv`, and extended `DVContext`.
    - [x] Update `useStore.ts` to include `globalConfig` and `isRendering` state.
    - [x] Subtask PBT: Verificación de inmutabilidad del objeto `env` inyectado.

- [x] **Phase 2: Preset Resolver Logic**
    - [x] Implement `resolvePresets(manifest)` in `useStore.ts` to expand manifests.
    - [ ] Adapt `App.tsx` (DynamicField) to support grouped fields from presets.
    - [x] Checkpoint: Verificar que un manifest con `preset: "branding"` genera los campos de logo/color automáticamente.

- [x] **Phase 3: High-Level UI Modules**
    - [x] Create `src/components/EditorPanel.tsx` (Base Transform API).
    - [x] Create `src/components/FileManager.tsx` (Asset Management logic).
    - [ ] Implement `dv-utility-window` wrapper component.

- [x] **Phase 4: Shadow Bridge Injection**
    - [x] Update `PluginWrapper.tsx` to inject UI module HTML/CSS before plugin load.
    - [x] Implement `ctx.env` injection logic (syncing with global state).
    - [x] Checkpoint: Confirmar que el `dv-editor-panel` es visible dentro del plugin sin que este lo declare.

- [x] **Phase 5: Finalization & Branding**
    - [x] Update Documentation (Changelog, Manuals to v3.4.0).
    - [x] Commit and Tag `v3.4.0`.
    - [x] Build Production.
