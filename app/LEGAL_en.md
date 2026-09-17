# Legal Notice and Disclaimer — Ember Motion Studio™

*Effective Date: 2026 | Applies to Ember Motion Studio™ v5.9.1+*

---

## 1. Software License (MIT)

The project's own code in **Ember Motion Studio™** and the **DVGE** orchestration bridge is distributed under the **MIT License**. Third-party components, including Remotion, retain their own licenses and terms; they are not relicensed under MIT. This grants any person the right to use, copy, modify, merge, publish, distribute, sublicense, and/or **sell copies** of the software, provided the original copyright notice and this permission notice are included. **No additional restrictions** beyond those of the MIT License itself apply.

Official license text: see the [LICENSE](LICENSE) file in the repository.

### 1.1 The "Ember Motion Studio™" Trademark

The name **Ember Motion Studio™** is used as an unregistered trademark (™) claimed by **Jonatan Barón**. This notice:

- Does not constitute a trademark registration and does not grant registered exclusive rights; the MIT license does not assign the trademark.
- Does not constitute legal advice and does not protect against third-party claims or lawsuits.
- Remains **separate from the code copyright**: copyright protects the code (MIT); the trademark is governed by applicable trademark law.

Forks and derivatives must retain the code copyright notice; use of the commercial name "Ember Motion Studio™" for derivative products falls outside the scope of the MIT license and may require authorization from the trademark holder.

---

## 2. Disclaimer of Warranties ("AS IS")

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.

As an independent developer, **Jonatan Barón** does not guarantee that the software will operate without interruptions or be error-free, especially in critical production environments or live broadcast workflows.

---

## 3. Third-Party Components — Remotion

Rendering uses **Remotion** (https://www.remotion.dev). Remotion is **not MIT**: it has its own dual license which Ember Motion Studio™ cannot alter or relicense:

- **Free tier**: individuals, non-profits, and for-profit organizations with up to 3 employees. It covers video creation **including commercial use** for eligible parties.
- **Commercial tier (Company License)**: for-profit organizations above that threshold must obtain their own license directly from Remotion.

By using Ember Motion Studio™, you acknowledge that:

a) Use of the integrated Remotion components is subject to the [Remotion License](https://www.remotion.dev/license).
b) If your organization is not eligible for Remotion's free tier, it is **your responsibility** to obtain a Company License directly.
c) Jonatan Barón does not sublicense Remotion or relicense its components under MIT. Remotion's terms apply to its components and their use; DVGE's own code retains its MIT license.
d) Remotion's free tier does not cover selling, renting, or sublicensing Remotion or derivatives of its code; selling copies of Ember Motion Studio™ under MIT is independent of that Remotion restriction.

---

## 4. Artificial Intelligence Integrations

Ember Motion Studio™ uses the **AI Context Builder** to communicate with third-party language models (Claude, GPT, DeepSeek).

- The user is responsible for the data sent to these services.
- The author is not liable for results, costs, or intellectual property infringements arising from AI-generated code.
- The user must audit and validate all generated code before professional use.

---

## 5. Privacy and Telemetry

Ember Motion Studio™ is a **local-first application**: projects, assets, and API keys are stored on the user's machine.

- **If the build includes PostHog and/or Sentry configuration**, the configured integrations may send telemetry automatically from startup, without prior explicit consent at this time. Not every build should be assumed to enable both services.
- Identity uses a **persistent pseudonymous ID** derived from the machine (SHA-256 hash of `node-machine-id`). The hash allows events from the same machine to be correlated; it **does not guarantee complete anonymity** or rule out personal data.
- Depending on the configured integrations, collected data may include hardware details (GPU, CPU, RAM), app version, platform, errors, and usage metrics. Diagnostics may include identifiable contextual information.
- Plugin authors must declare and limit any data transmission in accordance with the [Plugin Policy](PLUGIN_POLICY_en.md).

You can disable telemetry by blocking PostHog/Sentry hosts via firewall or network configuration; there is currently no in-app opt-out setting.

---

## 6. Limitation of Liability

IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY CLAIM, DAMAGES, OR DATA LOSS ARISING FROM THE USE OF THIS SOFTWARE. The user assumes full responsibility for all risks arising from the use of **Ember Motion Studio™** in professional workflows.

---

## 7. Legal Contact

For legal inquiries, infringement notifications, or licensing questions:

📧 barojonatan8@gmail.com

---

*Copyright © 2026 Jonatan Barón. Code licensed under the MIT License. "Ember Motion Studio™" is an unregistered trademark claimed by Jonatan Barón; the trademark is not covered by the MIT license.*
