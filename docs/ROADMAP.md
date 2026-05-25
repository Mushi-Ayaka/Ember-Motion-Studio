# DVGE Studio - Roadmap de Innovación

Este documento rastrea las ideas y funcionalidades planificadas para las versiones 6.0+ del motor.

## 🚀 Próximas Funcionalidades (Agentic Bridge)

### 1. Historial de Iteraciones (Context Loop)

**Estado:** Idea / Planificado
**Descripción:** Implementar un registro de cambios y feedback dentro del contexto del proyecto.
**Por qué:** Para evitar que la IA repita errores. Si una IA genera código que no funciona, el usuario puede anotar el fallo. En la siguiente generación, la IA leerá este historial y buscará una solución alternativa.
**Implementación:** Añadir un campo `iterationLogs` en el store y una sección dedicada en el PDF de contexto.

### 2. Inyección Dinámica de Agentes y Skills

**Estado:** Idea
**Descripción:** Permitir que los templates definan perfiles de IA específicos (ej: un agente experto en partículas, otro en tipografía suiza).
**Por qué:** Para especializar el comportamiento de la IA según la estética del template.

### 3. Sistema de Presets de Animación Nativa

**Estado:** Idea
**Descripción:** Crear un catálogo de curvas de animación (easings) y comportamientos (springs) pre-calculados que la IA pueda invocar por nombre.

---

### *Última actualización: 2026-04-29*
