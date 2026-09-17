# Política de Ecosistema y Plugins - Ember Motion Studio™ v5.9.1

*Fecha de vigencia: 2026 | Aplica a Ember Motion Studio™ v5.9.1+*

Esta política regula el desarrollo, distribución y uso de los complementos (en adelante "Plugins") dentro del ecosistema de Ember Motion Studio™ y el motor DVGE.

## 1. Responsabilidad y Auditoría de IA

Con la introducción del **AI Context Builder**, Ember facilita la generación de código mediante inteligencia artificial. El usuario reconoce y acepta que:

- El código generado por la IA es responsabilidad exclusiva del usuario.
- Ember Motion Studio™ no garantiza que el código generado sea seguro, óptimo o libre de errores.
- Se recomienda encarecidamente auditar el código fuente antes de su ejecución, especialmente si se planea su uso en entornos de producción.

## 2. Propiedad Intelectual de los Plugins

- Los plugins que usted desarrolle para su propio uso le pertenecen. **No hay cesión de derechos** por el hecho de usar Ember Motion Studio™.
- Los plugins publicados en el **catálogo oficial** son proyectos independientes; cada autor conserva el copyright de su plugin y elige su licencia (se recomienda MIT para el catálogo oficial).
- El código propio de Ember Motion Studio™ (puente DVGE e interfaz) es copyright de **Jonatan Barón** bajo licencia MIT; los componentes de terceros, incluido Remotion, conservan sus propias licencias y términos; los derechos de marca sobre el nombre comercial no se ceden. Consulte [LEGAL.md](LEGAL.md).

## 3. Seguridad y Sandbox

Ember Motion Studio™ implementa un Sandbox (Shadow DOM + proxy `fakeWindow`) como capa de contención para el sistema host. Conforme a esta política, los plugins **no deben**:

- Intentar eludir deliberadamente el aislamiento del Sandbox.
- Realizar telemetría no autorizada o enviar datos locales a servidores externos sin el consentimiento explícito del usuario.
- Incluir código malicioso u ofuscado diseñado para evadir la auditoría del motor.

Estas reglas son condiciones de uso del ecosistema y del catálogo oficial; **no añaden restricciones a la Licencia MIT del software**: quien distribuye copias de Ember Motion Studio™ bajo MIT no asume obligaciones más allá del aviso de copyright y permiso.

> **Nota**: el Sandbox reduce riesgos y previene colisiones de estilos, pero **no garantiza seguridad absoluta** frente a código malicioso. Instale plugins de terceros bajo su propio criterio.

## 4. Uso del Catálogo de Plugins

El acceso al Catálogo de Plugins es un servicio gratuito proporcionado por Ember Motion Studio™. Nos reservamos el derecho de retirar o actualizar cualquier plugin del catálogo por motivos de seguridad, estabilidad o infracción de términos.

## 5. Uso Comercial

El uso comercial de Ember Motion Studio™, su motor y los plugins está permitido bajo la Licencia MIT: puede vender, sublicenciar y distribuir copias cumpliendo el aviso de copyright. La marca "Ember Motion Studio™" no se cede; véase [LEGAL.md](LEGAL.md).

---

*(Actualizado para Ember v5.9.1 Stable)*

*Copyright © 2026 Jonatan Barón. Código bajo Licencia MIT; marca "Ember Motion Studio™" no registrada reivindicada por Jonatan Barón.*
