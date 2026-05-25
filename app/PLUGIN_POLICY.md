# Política de Ecosistema y Plugins - Ember Motion Studio v5.9.0

Esta política regula el desarrollo, distribución y uso de los complementos (en adelante "Plugins") dentro del ecosistema de Ember Motion Studio.

## 1. Responsabilidad y Auditoría de IA

Con la introducción del **AI Context Builder**, Ember facilita la generación de código mediante inteligencia artificial. El usuario reconoce y acepta que:
- El código generado por la IA es responsabilidad exclusiva del usuario.
- Ember Motion Studio no garantiza que el código generado sea seguro, óptimo o libre de errores.
- Se recomienda encarecidamente auditar el código fuente antes de su ejecución, especialmente si se planea su uso en entornos de producción.

## 2. Propiedad Intelectual

A menos que se especifique lo contrario, **Jonatan Barón** se reserva los derechos de propiedad y explotación de los plugins incluidos en el catálogo oficial de Ember Motion Studio. Los plugins desarrollados por usuarios para su uso privado pertenecen a sus respectivos autores, siempre que no utilicen fragmentos sustanciales de código propietario del motor sin autorización.

## 3. Seguridad y Sandbox

Ember Motion Studio implementa un Sandbox (Shadow DOM + fakeWindow Proxy) para proteger el sistema host. Queda prohibido:
- Intentar vulnerar el aislamiento del Sandbox.
- Desarrollar plugins que realicen telemetría no autorizada o envíen datos locales a servidores externos sin el consentimiento explícito del usuario.
- Incluir código malicioso u ofuscado diseñado para evadir la auditoría del motor.

## 4. Uso del Catálogo de Plugins

El acceso al Catálogo de Plugins es un servicio gratuito proporcionado por Ember Motion Studio. Nos reservamos el derecho de retirar o actualizar cualquier plugin del catálogo por motivos de seguridad, estabilidad o infracción de términos.

(Actualizado para Ember v5.9.0 Stable)
