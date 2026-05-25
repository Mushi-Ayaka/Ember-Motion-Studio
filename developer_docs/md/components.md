# Guía de componentes y flujo de trabajo para agregar features

Estructura relevante:

- `src/components/` — componentes UI reutilizables.
- `src/` — estado global, rutas y puntos de entrada.
- `app/` — configuración de la app y archivos públicos.

Buenas prácticas para añadir una feature:

1. Identifica el entry point (por ejemplo `src/main.tsx` o `App.tsx`).
2. Crea el componente en `src/components/<FeatureName>/` con un archivo `index.tsx` y `styles.css` o `styles.module.css`.
3. Añade tipos en `src/types` o junto al componente si son locales.
4. Escribe pruebas unitarias en paralelo (si el repo usa tests) y valida visualmente con la app en `pnpm dev`.
5. Crea un PR con descripción, screenshots, y steps para QA.
