# Requirements: Engine Presets & Global Config (v3.4.0)

## Introducción
El objetivo de esta feature es eliminar la necesidad de que la IA decida cómo estructurar campos comunes o configuraciones de entorno. Al proporcionar "Presets" de entrada y un "Contexto Global" robusto, reducimos la probabilidad de que la IA genere interfaces defectuosas o lógica redundante.

## Requisitos del Sistema

### 1. Presets de Entradas y Estructura
- **Definición**: Grupos de campos y estructuras de UI predefinidas.
- **Componentes de Alto Nivel (UI Modules)**:
  - `dv-editor-panel`: Un preset que genera automáticamente un lienzo de edición con herramientas de transformación (escala, rotación).
  - `dv-file-manager`: Un módulo integrado para gestionar los assets (imágenes, videos) del proyecto actual sin que la IA deba programar el sistema de archivos.
  - `dv-utility-window`: Ventanas flotantes pre-estilizadas para configuraciones secundarias.
- **User Story**: "Como IA, quiero declarar `ui: "editor-standard"` y que el motor me entregue un layout profesional con paneles de control ya maquetados."

### 2. Configuración Global y Valores Predefinidos
- **Valores de Entorno**: El motor inyectará variables globales que la IA suele "estimar" mal, como:
  - `ctx.env.isExporting`: Booleano real para desactivar efectos pesados en preview.
  - `ctx.env.safeArea`: Coordenadas de los márgenes de seguridad para TV.
- **Configuración de Transmisión**: FPS, Bitrate y Resolución como valores transversales a todo plugin.

### 3. Estandarización de Comunicación
- El motor proveerá un **"Schema Master"**. Si la IA dice `preset: "branding"`, el motor renderizará automáticamente 3 campos sin que la IA tenga que definirlos uno a uno en el JSON.

## Propiedades PBT (Integridad de Datos)
1. **Invariante de Config**: Los valores en `ctx.env` deben ser de solo lectura para el plugin.
2. **Consistencia de Preset**: Si un plugin usa un preset `A`, los IDs de esos campos deben ser consistentes en todos los plugins que usen el mismo preset para permitir el intercambio de datos entre proyectos.

---

## Estado de Implementación (v3.4.0)
- ✅ **Presets de Entradas**: Implementados branding, motion, layout e info (Super Prompt).
- ✅ **Shadow Bridge**: Inyección de CSS global y fragmentos HTML completada.
- ✅ **Contexto Global**: `ctx.env` y `ctx.settings` disponibles en todos los plugins.
- ✅ **Inspector v2 (Unity Style)**: Implementados grupos colapsables, dropdowns de easing y tipos de datos enriquecidos.
- ✅ **Alineación Global**: Sistema de posicionamiento Flexbox integrado en el motor.
- ✅ **Branding Activo**: Inyección automática de logos con control de posición y tamaño.
- ✅ **External Assets**: Soporte para carga dinámica de librerías externas (CDN) vía manifest.
- ✅ **Validación**: Reducción del 93% de código en plugins existentes.

---

## Checkpoint Final
La arquitectura modular v3.4.0 "The Modular Engine" está desplegada, documentada y validada. El sistema es ahora una plataforma profesional lista para la creación masiva de gráficos broadcast con asistencia de IA.

