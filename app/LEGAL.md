# Aviso Legal y Exención de Responsabilidad - Ember Motion Studio™ v5.9.1

*Fecha de vigencia: 2026 | Aplica a Ember Motion Studio™ v5.9.1+*

---

## 1. Licencia de Software (MIT)

El código propio de **Ember Motion Studio™** y del puente orquestador **DVGE** se distribuye bajo la **Licencia MIT**. Los componentes de terceros, incluido Remotion, conservan sus propias licencias y términos; no quedan relicenciados bajo MIT. Esto permite a cualquier persona usar, copiar, modificar, fusionar, publicar, distribuir, sublicenciar y/o **vender copias** del software, siempre que se incluya el aviso de copyright original y el aviso de permiso. **No se aplican restricciones adicionales** más allá de las de la propia MIT.

Texto oficial de la licencia: ver el archivo [LICENSE](LICENSE) del repositorio.

### 1.1 Marca "Ember Motion Studio™"

La denominación **Ember Motion Studio™** se usa como marca no registrada reivindicada (™) de **Jonatan Barón**. Este aviso:

- No constituye un registro de marca ni otorga derechos exclusivos registrados; la licencia MIT no incluye cesión de la marca.
- No constituye asesoría legal ni garantiza protección frente a demandas de terceros.
- Se mantiene **separada del copyright** del código: el copyright protege el código (MIT); la marca se rige por el derecho de marcas aplicable.

En forks o derivados debe conservarse el aviso de copyright del código; el uso del nombre comercial "Ember Motion Studio™" para productos derivados queda fuera del alcance de la licencia MIT y puede requerir autorización del titular de la marca.

---

## 2. Exención de Garantías (AS IS)

Este software se proporciona **"tal cual" (AS IS)**, sin garantía de ningún tipo, expresa o implícita, incluidas las garantías de comerciabilidad, idoneidad para un propósito particular y no infracción. Como desarrollador independiente, **Jonatan Barón** no garantiza que el software funcione sin interrupciones o esté libre de errores, especialmente en entornos de producción broadcast o transmisiones en vivo.

---

## 3. Componentes de Terceros — Remotion

El renderizado usa **Remotion** (https://www.remotion.dev). Remotion **no es MIT**: tiene su propia licencia dual que Ember Motion Studio™ no puede alterar ni re-licenciar:

- **Nivel gratuito (Free License)**: individuos, organizaciones sin fines de lucro y empresas de hasta 3 empleados. Cubre la creación de videos **incluso con fines comerciales** para quienes son elegibles.
- **Nivel comercial (Company License)**: organizaciones con fines de lucro que superen ese umbral deben adquirir su propia licencia directamente a Remotion.

Al usar Ember Motion Studio™, usted reconoce que:

a) El uso de los componentes integrados de Remotion está sujeto a la [Remotion License](https://www.remotion.dev/license).
b) Si su organización no es elegible para el nivel gratuito de Remotion, es **su responsabilidad** obtener la Company License directamente.
c) Jonatan Barón no otorga sublicencia sobre Remotion ni relicencia sus componentes bajo MIT. Los términos de Remotion se aplican a sus componentes y a su uso; el código propio de DVGE conserva su licencia MIT.
d) El nivel gratuito de Remotion no cubre la reventa de Remotion ni de derivados de su código; la venta de copias de Ember Motion Studio™ bajo MIT es independiente de esa restricción de Remotion.

---

## 4. Integraciones de Inteligencia Artificial

Ember Motion Studio™ utiliza el sistema **AI Context Builder** para facilitar la comunicación con modelos de lenguaje de terceros (Claude, GPT, DeepSeek).

- El usuario es responsable de los datos enviados a estos servicios.
- El autor no se hace responsable por los resultados, costos o infracciones de propiedad intelectual derivados del código generado por la IA.
- El usuario debe auditar y validar todo el código generado antes de su uso profesional.

---

## 5. Privacidad y Telemetría

Ember Motion Studio™ es una aplicación **local-first**: proyectos, assets y claves de API se guardan en el equipo del usuario.

- **Si la build incluye la configuración de PostHog y/o Sentry**, las integraciones configuradas pueden enviar telemetría automáticamente desde el inicio, sin consentimiento explícito previo por el momento. No debe asumirse que todas las builds habilitan ambos servicios.
- La identidad usa un **ID seudónimo persistente** derivado de la máquina (hash SHA-256 de `node-machine-id`). El hash permite correlacionar eventos de un mismo equipo; **no garantiza anonimato total** ni excluye que los datos sean personales.
- Según las integraciones configuradas, pueden recopilarse datos de hardware (GPU, CPU, RAM), versión de la app, plataforma, errores y métricas de uso. Los diagnósticos pueden incluir información contextual identificable.
- Los autores de plugins deben declarar y limitar cualquier transmisión de datos conforme a la [Política de Plugins](PLUGIN_POLICY.md).

Puede desactivar la telemetría bloqueando los hosts de PostHog/Sentry mediante un firewall o configuración de red; no existe actualmente un ajuste de opt-out dentro de la aplicación.

---

## 6. Limitación de Responsabilidad

EN NINGÚN CASO EL AUTOR SERÁ RESPONSABLE POR CUALQUIER RECLAMACIÓN, DAÑO O PÉRDIDA DE DATOS QUE SURJA DEL USO DE ESTE SOFTWARE. El usuario asume toda la responsabilidad por los riesgos derivados del uso de **Ember Motion Studio™** en flujos de trabajo profesionales.

---

## 7. Contacto Legal

Para consultas legales o notificaciones de infracción, por favor contactar a: <barojonatan8@gmail.com>.

---

*Copyright © 2026 Jonatan Barón. Código bajo Licencia MIT. La marca "Ember Motion Studio™" es una marca no registrada reivindicada por Jonatan Barón; la marca no está cubierta por la licencia MIT.*
