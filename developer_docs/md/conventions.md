# Convenciones de código, linting y formateo

Reglas generales:

- TypeScript estricta: preferir tipos explícitos en public APIs.
- Nombres: `PascalCase` para componentes, `camelCase` para funciones/variables.
- Evitar `any` salvo en pruebas o migraciones temporales.

Formateo y linting:

- Usa Prettier/ESLint si están configurados en el repo; si no, mantener formato consistente: 2 espacios, punto y coma opcional.
- Añade reglas al repo si crees necesario (`.eslintrc`, `.prettierrc`).

Commits y PRs:

- Mensajes claros con referencia a issue o ticket.
- PRs pequeños y con descripción y pasos para probar.
