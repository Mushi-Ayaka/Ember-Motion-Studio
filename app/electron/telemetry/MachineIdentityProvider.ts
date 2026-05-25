import { machineIdSync } from 'node-machine-id';
import * as crypto from 'crypto';

/**
 * Proveedor de Identidad Anónima para Telemetría.
 * Genera un ID único basado en el hardware del equipo sin exponer datos sensibles.
 */
export class MachineIdentityProvider {
    private static cachedId: string | null = null;

    /**
     * Obtiene el ID único anónimo de la máquina.
     * Utiliza un hash SHA-256 del ID de hardware para garantizar anonimato total.
     */
    public static getAnonymousId(): string {
        if (this.cachedId) return this.cachedId;

        try {
            // Obtenemos el ID de hardware (nativo del sistema)
            const rawId = machineIdSync();
            
            // Generamos un hash para que no sea reversible ni identifique el hardware real
            this.cachedId = crypto
                .createHash('sha256')
                .update(rawId)
                .digest('hex');

            return this.cachedId;
        } catch (error) {
            console.error('[Telemetry] Error generating Machine ID:', error);
            return 'anonymous-fallback-id';
        }
    }
}
