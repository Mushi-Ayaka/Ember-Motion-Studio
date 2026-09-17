# Ember Motion Studio™ v5.9.1

[![Sitio Oficial](https://img.shields.io/badge/Sitio-Ember_Motion_Studio-E44C30?style=for-the-badge)](https://ember-motion-studio-landing.vercel.app/)

**Ember Motion Studio™** es un software de escritorio de alto rendimiento diseñado para gráficos o animaciones profesionales. Construido con React, Electron y Remotion, permite a los productores y editores crear, personalizar y exportar gráficos dinámicos (lower thirds, títulos, callouts) con retroalimentación en tiempo real y soporte nativo para ProRes 4444 + Alpha.

> [!IMPORTANT]
> **Estado del Proyecto**: Ember Motion Studio™ es actualmente un proyecto **Open Source** impulsado por un único desarrollador independiente bajo la **MIT License**. Estoy en desarrollo activo (Etapa GA).
> **Compromiso de Seguridad**: Los instaladores actuales no están firmados digitalmente debido a los costes de certificación para desarrolladores independientes. Como proyecto Open Source, priorizamos la transparencia: el código es totalmente auditable. Para instalar sin avisos, simplemente haz clic en "Más información" -> "Ejecutar de todos modos".

## Key Features (v5.9.1)

- **Studio Master Core**: Integración nativa del "Proyecto Vacío". Ahora puedes programar desde cero sin dependencias externas, utilizando el motor como un lienzo en blanco profesional.
- **Dynamic Inspector v2**: Extracción automática de propiedades mediante tags `/* @dv-prop */`. Soporta tipos complejos como `alignment`, `slider`, `easing` e `icon` con sincronización en tiempo real.
- **Transparency Transformer**: Sistema avanzado de estabilidad para exportaciones ProRes 4444, garantizando que el canal Alpha sea capturado perfectamente desde el fotograma 0.
- **Knowledge Bridge**: Generador de contextos para IA. Crea PDFs con reglas maestras para que Claude, Gemini o GPT generen plugins 100% compatibles con la arquitectura del motor.
- **Bilingual Interface**: Soporte completo para Inglés y Español, sincronizado a través de un sistema de i18n dinámico en toda la aplicación.
- **Atomic Async I/O**: Sistema de persistencia de proyectos ultra-resiliente que utiliza operaciones atómicas para prevenir la corrupción de datos en sesiones largas.

## Stack

- **Core**: React 18, Electron 29, Vite.
- **Rendering**: Remotion (Frame-accurate determinism).
- **State**: Zustand (Persistence & Global Sync).
- **Security**: Shadow DOM Sandboxing & Polyfilled Roots.

## Getting Started

### Requisitos Previos

- [Node.js](https://nodejs.org/) (v20 recomendado)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) para validar las dependencias reproducibles
- [pnpm](https://pnpm.io/) 9 (también puedes usar `npm` para ejecutar los scripts)
- **Google Chrome** (Instalado para el renderizado headless)

### Instalación para Desarrollo

1. Clonar el repositorio.
2. Entrar en la carpeta del proyecto:

   ```bash
   cd Ember-Motion-Studio/app
   ```

3. Instalar dependencias con el lockfile reproducible:

   ```bash
   pnpm install --frozen-lockfile
   ```

   Como alternativa:

   ```bash
   npm install
   ```

   Para validar el árbol de dependencias en un entorno aislado con Docker,
   ejecuta estos comandos desde `app/`:

   ```bash
   docker compose build
   docker compose run --rm deps
   ```

   Docker se utiliza para fijar y comprobar las dependencias. No debes copiar sus
   `node_modules` al entorno Windows: Electron, esbuild y otros paquetes incluyen
   binarios específicos de la plataforma.

4. Iniciar el entorno de desarrollo:

   ```bash
   npm run dev
   ```

### Producción

El ejecutable y el instalador `.exe` deben generarse en Windows, donde están
disponibles los binarios nativos y las herramientas de empaquetado de Electron.
Desde la raíz del repositorio puedes usar cualquiera de estos comandos:

```bash
npm run build
```

O, desde `app/`:

```bash
pnpm run build
```

El instalador se genera en `release/<version>/`. Docker no ejecuta el empaquetado
NSIS; se encarga únicamente de validar las dependencias para evitar diferencias
entre instalaciones.

## Estructura del Proyecto

```text
app/
├── electron/          # Lógica del proceso principal (IPC, Filesystem, Render API)
├── src/               # Interfaz de usuario (React, i18n, Global Store)
│   ├── components/    # Componentes de UI (Inspector, Project Manager, Modales)
│   ├── remotion/      # Composiciones de video y PluginWrapper
│   └── engine/        # Núcleo del motor y Sandbox (Bridge, TagExtractor)
└── TECHNICAL.md       # Documentación técnica profunda del motor
```

## 📜 Licencia

MIT — ver el archivo [LICENSE](LICENSE) para más detalles. Puedes usar, copiar, modificar, distribuir, sublicenciar y vender copias del software sujeto a incluir el aviso de copyright y de permiso.

Distribuido bajo la marca **Ember Motion Studio™** de Jonatan Barón (marca no registrada reivindicada). La marca no se cede con la licencia MIT; la licencia MIT cubre el código, no la marca. Ver [LEGAL.md](LEGAL.md).

© 2026 Jonatan Baron. All rights reserved.