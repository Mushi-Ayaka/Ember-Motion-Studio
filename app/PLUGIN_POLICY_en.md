# Ecosystem and Plugin Policy - Ember Motion Studio™

*Effective Date: 2026 | Applies to Ember Motion Studio™ v5.9.1+*

This policy regulates the development, distribution, and use of extensions and add-ons (hereinafter "Plugins") within the Ember Motion Studio™ ecosystem and the DVGE engine.

## 1. AI Responsibility and Auditing

With the introduction of the **AI Context Builder**, Ember facilitates code generation through AI. The user acknowledges and accepts that:

- AI-generated code is the sole responsibility of the user.
- Ember Motion Studio™ does not guarantee that generated code is safe, optimal, or error-free.
- Auditing the source code before execution is strongly recommended, especially for production use.

## 2. Plugin Intellectual Property

- Plugins you develop for your own use belong to you. **No rights are assigned** merely by using Ember Motion Studio™.
- Plugins published in the **official catalog** are independent projects; each author retains copyright over their plugin and chooses its license (MIT is recommended for the official catalog).
- Ember Motion Studio™'s own code (DVGE bridge and UI) is copyright of **Jonatan Barón** under the MIT license; third-party components, including Remotion, retain their own licenses and terms; trademark rights over the commercial name are not assigned. See [LEGAL_en.md](LEGAL_en.md).

## 3. Security and Sandbox

Ember Motion Studio™ implements a Sandbox (Shadow DOM + `fakeWindow` proxy) as a containment layer for the host system. Under this policy, plugins **must not**:

- Deliberately attempt to bypass Sandbox isolation.
- Perform unauthorized telemetry or send local data to external servers without the user's explicit consent.
- Include malicious or obfuscated code designed to evade engine auditing.

These rules are conditions for using the ecosystem and the official catalog; they **add no restrictions to the software's MIT License**: anyone distributing copies of Ember Motion Studio™ under MIT assumes no obligations beyond the copyright and permission notice.

> **Note**: the Sandbox reduces risk and prevents style collisions but **does not guarantee absolute security** against malicious code. Install third-party plugins at your own discretion.

## 4. Plugin Catalog Usage

Access to the Plugin Catalog is a free service provided by Ember Motion Studio™. We reserve the right to remove or update any plugin from the catalog for security, stability, or terms-of-service reasons.

## 5. Commercial Use

Commercial use of Ember Motion Studio™, its engine, and its plugins is permitted under the MIT License: you may sell, sublicense, and distribute copies while complying with the copyright notice. The "Ember Motion Studio™" trademark is not assigned; see [LEGAL_en.md](LEGAL_en.md).

---

*(Updated for Ember v5.9.1 Stable)*

*Copyright © 2026 Jonatan Barón. Code licensed under the MIT License; "Ember Motion Studio™" is an unregistered trademark claimed by Jonatan Barón.*
