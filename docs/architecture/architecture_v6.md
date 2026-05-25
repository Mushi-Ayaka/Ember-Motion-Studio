# Arquitectura y Especificación de Contratos — Ember Motion Studio v6

## 1. Visión del Ecosistema y Repositorios

El ecosistema de Ember evoluciona hacia una arquitectura de código distribuido y responsabilidades aisladas. Se estructuran 4 repositorios independientes para optimizar la seguridad, agilizar el desarrollo y permitir un modelo comercial *Open Core*.

```
                                  [ ECOSISTEMA EMBER v6 ]
                                             │
      ┌──────────────────────────────────────┴──────────────────────────────────────┐
      ▼                                                                             ▼
[ CÓDIGO ABIERTO / MIT ]                                                      [ COMERCIAL / PRIVADO ]
  ├── github.com/Mushi-Ayaka/dvge                                               ├── github.com/Mushi-Ayaka/ember-motion-studio
  │    └── Paquete: @dvge/runtime-bridge (npm)                                   │    └── Aplicación comercial (Electron, React, Zustand)
  │    └── Núcleo agnóstico del motor y sandbox.                                 └── github.com/Mushi-Ayaka/ember-market
  └── github.com/Mushi-Ayaka/ember-registry                                          └── CDN privado (Cloudflare R2 + Workers)
       └── Repositorio comunitario gratuito.                                         └── Módulos y plantillas premium encriptadas.
       └── Automatizado vía GitHub Actions y submit.ember.io.
```

---

## 2. DVGE Runtime Bridge (`@dvge/runtime-bridge`) — Contrato Público (MIT)

El motor base es un **Runtime Bridge y Contrato de Animación Determinista**. No contiene interfaces de usuario ni depende de tecnologías propietarias de renderizado o composición (como Remotion). Su única meta es asegurar que dado un frame $N$, el resultado visual sea idéntico en cualquier dispositivo y momento.

### 2.1 Responsabilidades del Core
1. **Contrato de Renderizado**: Servir como API expuesta para la ejecución controlada de la lógica visual.
2. **Aislamiento en Sandbox (Iron Wall)**: Montar un Shadow DOM sellado en cada instancia de plantilla. Inyectar polifills protectores (como `fakeWindow` y un sistema básico de mitigación de alcance global) y aplicar políticas restrictivas sobre `fetch` y almacenamiento local según los permisos autorizados.
3. **Tag Extractor**: Analizar estáticamente el código fuente de los templates en busca de anotaciones `@dv-prop` para construir automáticamente el esquema dinámico de propiedades utilizable por el inspector.
4. **Librería de Visual Skills**: Proveer implementaciones matemáticas puras para animaciones deterministas (`lerp`, `spring`, `clamp`, `loop`, `typewriter`, etc.) desvinculadas del reloj de la CPU.

### 2.2 El Contrato `window.renderDVGE`
Cualquier plantilla compatible con el motor debe registrar el hook global de renderizado:

```typescript
window.renderDVGE = function (frame: number, props: Record<string, any>, ctx: DVGEContext): void;
```

#### Definición de Interfaces (Contratos de Tipos)
```typescript
interface DVGEContext {
  frame: number;             // Frame global solicitado por el orquestador
  root: ShadowRoot;          // El Shadow Root del contenedor de la plantilla
  props: Record<string, any>;// Parámetros evaluados y parseados desde el Inspector
  state: Record<string, any>;// Estado volátil persistido entre renders de la misma instancia
  refs: Record<string, HTMLElement>; // Caché rápida de referencias a nodos DOM internos
  utils: DVGEUtils;          // Kit matemático y de animación determinista
  layer?: DVGELayerContext;  // Opcional: Metadatos específicos del layer en v6
}

interface DVGELayerContext {
  id: string;        // ID único del Layer en el timeline de Ember Studio
  localFrame: number;// El frame relativo de la capa (inicia en 0 al activarse)
  opacity: number;   // Opacidad aplicada en la composición global (0.0 - 1.0)
  blendMode: string; // Modo de mezcla (e.g., "normal", "multiply", "screen")
}

interface DVGEUtils {
  lerp: (start: number, end: number, t: number) => number;
  clamp: (val: number, min: number, max: number) => number;
  spring: (frame: number, config: SpringConfig) => number;
  loop: (frame: number, duration: number) => number;
  // ... funciones adicionales de apoyo
}
```

### 2.3 Taxonomía y Esquema del Manifiesto (`manifest.json` v5.x)
El motor carga y valida estrictamente el archivo de configuración del componente antes de su montaje:

```json
{
  "id": "com.mushi-ayaka.text-reveal",
  "name": "Text Reveal Custom",
  "version": "1.0.0",
  "author": "Jonatan Barón",
  "type": "template",
  "description": "Revelación elegante de texto con comportamiento determinista.",
  "minEngineVersion": "6.0.0",
  "permissions": ["network"],
  "schema": [
    {
      "name": "title",
      "label": "Texto Principal",
      "type": "string",
      "default": "Ember Motion Studio"
    },
    {
      "name": "primaryColor",
      "label": "Color Primario",
      "type": "color",
      "default": "#E44C30"
    }
  ]
}
```
*   **Permissions**: Permisos soportados: `"network"` (para realizar llamadas de fetch externas) e `"storage"` (lectura/escritura en disco bajo sandbox).
*   **Types de Schema**: `string`, `number`, `boolean`, `color`, `image` (ruta de archivo local resuelta en runtime), `select` (menú desplegable), `code` (caja de texto monoespaciada para scripts), `info` (bloque informativo de solo lectura) y `prompt` (zona de inyección contextual para Inteligencias Artificiales).

---

## 3. Ember Motion Studio — Capa Comercial (Privado)

La aplicación de escritorio (Electron + React + Zustand) representa el editor interactivo y la suite de herramientas premium de producción.

### 3.1 Lienzo Virtual Fluido (Responsive Canvas)
Se erradica el emulador de pantalla 16:9 con dimensiones estáticas (`baseWidth = 1920` / `baseHeight = 1080`) que forzaba escalas CSS deformando orientaciones de pantalla (e.g., Portrait / Celular).

*   **Lienzo Reactivo**: El editor inyecta dinámicamente las dimensiones reales configuradas en el proyecto hacia el `:host` del Shadow DOM de DVGE.
*   **Variables de Entorno CSS**: El editor expone variables CSS nativas en el host del sandbox (`--dv-w` y `--dv-h`) para que los diseñadores estructuren sus layouts con dependencias fluidas (usando `var(--dv-w)` en lugar de píxeles estáticos).

### 3.2 Timeline Director Multidimensional
El Timeline de v6 introduce una dimensión de secuencia narrativa e hilos paralelos:

1.  **Composición Simultánea (Layers)**: Multiples capas montadas concurrentemente. Cada una inicializa un runtime de `@dvge/runtime-bridge` aislado.
2.  **Secuencia y Continuidad (Clips)**: Segmentos colocados en serie sobre el timeline. Cada clip corresponde a una ejecución de renderizado.
3.  **Transiciones en Solapamiento (Outro-to-Intro)**: Durante una transición, coexisten dos runtimes simultáneos (el clip saliente y el entrante). El timeline envía de manera balanceada los comandos de frame a ambos runtimes y los combina visualmente.
4.  **Desacoplamiento de Frames**: El motor no asume un frame global lineal para todos los clips. Cada layer tiene su `localFrame` interno que comienza en `0` en su frame exacto de activación, permitiendo reposicionar clips en el timeline sin alterar su lógica de animación interna.

### 3.3 Layer Compositor
Módulo encargado de fusionar los fotogramas resultantes del render de cada capa antes de dibujarlos en la pantalla del editor o enviarlos a la cola de exportación.
Aplica transformaciones de opacidad y blend modes (como `multiply`, `screen`, `overlay`) mezclando los buffers en una capa intermedia Canvas/WebGL a 60fps constantes.

```
[ Layer 1 (Top) ]   ---> Buffer 1 (RGBA)  ──┐
                                            ├──> [ Layer Compositor (WebGL) ] ──> Frame Final (RGBA)
[ Layer 2 (Base) ]  ---> Buffer 2 (RGBA)  ──┘
```

### 3.4 Native Render Orchestrator (C/C++)
Para maximizar el rendimiento y aislar errores, el motor de render nativo no corre dentro del hilo principal de Electron, sino como un **proceso nativo de C++ independiente (proceso hijo)**.

*   **Aislamiento de Fallos (Sandbox)**: Un error fatal de asignación de memoria o fallo de compilación en el render nativo no detiene la ejecución del editor principal Ember Studio.
*   **Comunicación vía IPC**: Electron se comunica con el Native Orchestrator a través de sockets locales del sistema operativo (Named Pipes en Windows, Unix Sockets en Linux/macOS) usando mensajes JSON/Protobuf ligeros.
*   **Headless Renderer**: El Orchestrator orquesta múltiples hilos de Chromium en modo Headless, solicitando los fotogramas secuenciales de cada capa de manera síncrona.
*   **FFmpeg Memory Pipe**: Los buffers de píxeles generados en crudo (raw bitstream) son transmitidos directamente al proceso de FFmpeg en memoria compartida (Shared Memory), eliminando la necesidad de escribir miles de imágenes intermedias a disco (PNG frames) acelerando exponencialmente la creación del contenedor final ProRes 4444.

---

## 4. Ecosistema de Contenido (Registry / Market)

### 4.1 ember-registry (Contenido Gratuito)
*   **Modelo de Datos**: Catálogo central en un JSON público autohospedado en GitHub.
*   **Automatización de Contribuciones**: Los creadores de plantillas utilizan la interfaz visual web `submit.ember.io`. Al completar el formulario, un servicio en segundo plano interactúa con la API de GitHub para abrir un Pull Request en el repositorio del registro.
*   **GitHub Actions CI**: Los PRs ejecutan tests automáticos que instalan la plantilla en un entorno virtualizado de DVGE, validan su manifest y garantizan que no haga llamadas prohibidas de red o disco. Tras pasar las validaciones, se mergea y publica de forma automática en el CDN de distribución.

### 4.2 ember-market (Contenido Premium - v7+)
*   **Distribución Segura**: Los archivos PRO están empaquetados en un formato binario propietario y cifrado (`.dvge-pro`).
*   **Signed URLs**: Las descargas se realizan a través de Cloudflare Workers que verifican la validez de la clave de licencia con la pasarela de Lemon Squeezy en tiempo real, generando URLs firmadas de vida corta (15 minutos).

---

## 5. Contratos de Comunicación (IPC)

### 5.1 Estructura del Job de Renderizado (Ember Studio ↔ Orchestrator C++)
```json
{
  "type": "CREATE_RENDER_JOB",
  "payload": {
    "jobId": "job_01h9e48z...",
    "canvas": {
      "width": 1080,
      "height": 1920,
      "fps": 60
    },
    "durationFrames": 300,
    "outputPath": "C:/Users/Josue/Exports/animation.mov",
    "timeline": {
      "layers": [
        {
          "layerId": "layer_01",
          "templatePath": "C:/Users/Josue/Ember/packages/text-reveal",
          "zIndex": 1,
          "startFrame": 0,
          "endFrame": 150,
          "opacity": 1.0,
          "blendMode": "normal",
          "props": {
            "title": "Bienvenido a v6",
            "primaryColor": "#E44C30"
          }
        },
        {
          "layerId": "layer_02",
          "templatePath": "C:/Users/Josue/Ember/packages/spark-effects",
          "zIndex": 2,
          "startFrame": 100,
          "endFrame": 300,
          "opacity": 0.8,
          "blendMode": "screen",
          "props": {
            "intensity": 50
          }
        }
      ]
    }
  }
}
```

### 5.2 Estructura del Progreso del Renderizado (Orchestrator C++ ↔ Ember Studio)
```json
{
  "type": "RENDER_PROGRESS",
  "payload": {
    "jobId": "job_01h9e48z...",
    "status": "rendering",
    "currentFrame": 142,
    "totalFrames": 300,
    "fps": 45.8
  }
}
```

---

## 6. Seguridad y Protección de Código Comercial

La viabilidad comercial de Ember Motion Studio depende de salvaguardar sus características Pro/Enterprise.

1.  **V8 Snapshots (Electron Kernel)**: La lógica que valida las licencias de Lemon Squeezy y activa las herramientas PRO no viaja como JS plano en el archivo `.asar`. Se compila mediante `mksnapshot` directamente a bytecode binario nativo de V8. Esto evita la ingeniería inversa y el bypass trivial de licencias en la app de escritorio.
2.  **Validación Asimétrica Offline**: Cuando el usuario activa su licencia en línea, el servidor de validación firma criptográficamente un token local con una clave privada. Si la app inicia sin conexión a internet, el código de validación del V8 Snapshot verifica la validez del token local utilizando una clave pública incrustada.
3.  **Seguridad NPM**:
    *   **Versiones Ancladas**: En el repositorio de Ember Studio, los archivos `package.json` utilizan dependencias exactas y ancladas (sin caracteres comodín como `^` o `~`) para evitar ataques de inyección de paquetes maliciosos durante las instalaciones automáticas de CI.
    *   **NPM Provenance**: Las builds de distribución pública del motor base `@dvge/runtime-bridge` se compilarán en GitHub Actions utilizando la flag `--provenance` de npm, garantizando que el paquete de npm corresponde exactamente al código fuente auditado en el repositorio de GitHub.
    *   **Políticas Strict en pnpm**: Configuración estricta en `pnpm-workspace.yaml` y `.npmrc` (`strict-peer-dependencies=true` y `shamefully-hoist=false`) para evitar el acoplamiento implícito y vulnerabilidades de dependencias fantasma.

---

## 7. Versionado y Estrategia de Transición

*   **v5.9 (LTS)**: Declarada versión de Soporte a Largo Plazo. Solo se liberarán parches de seguridad y bugs críticos del motor antiguo. No incorporará capas ni el renderizador C++.
*   **v6.0 (Beta)**: Incorpora la reestructuración completa. Introduce breaking changes intencionales en el lienzo (erradicación de la caja rígida de 1920x1080) y la adopción del motor multinúcleo en C++.
*   **Retrocompatibilidad de Plantillas**: Las plantillas creadas en v5.x se ejecutan de manera fluida en la v6. Si una plantilla no utiliza variables relativas de CSS o no detecta el objeto `ctx.layer`, el editor la renderizará de manera contenida aplicando una capa de compatibilidad (letterboxing responsivo transparente) para preservar el comportamiento visual original sin romper la composición de capas.
