import * as Sentry from '@sentry/electron/main';
import { PostHog } from 'posthog-node';
import { MachineIdentityProvider } from './MachineIdentityProvider';
import { HardwareScanner } from './HardwareScanner';
import { app } from 'electron';

const SENTRY_DSN = process.env.VITE_SENTRY_DSN || '';
const POSTHOG_API_KEY = process.env.VITE_POSTHOG_KEY || '';
const POSTHOG_HOST = process.env.VITE_POSTHOG_HOST || 'https://app.posthog.com';

/**
 * Orquestador Central de Telemetría (Telemetry Hub).
 * v5.7 - Optimizado para sincronización con el Dashboard.
 */
export class TelemetryHub {
    private static posthog: PostHog | null = null;
    private static isInitialized = false;
    private static eventQueue: { event: string, properties: any }[] = [];

    public static async initialize() {
        if (this.isInitialized) return;

        const machineId = MachineIdentityProvider.getAnonymousId();

        // Log de diagnóstico para asegurar que la API Key está llegando al proceso principal
        if (!POSTHOG_API_KEY) {
            console.error('[Telemetry] CRÍTICO: VITE_POSTHOG_KEY no encontrada.');
        } else {
            console.log('[Telemetry] Inicializando PostHog. API Key detectada:', POSTHOG_API_KEY.substring(0, 6) + '...');
        }

        if (SENTRY_DSN) {
            try {
                Sentry.init({
                    dsn: SENTRY_DSN,
                    release: `ember@${app.getVersion()}`,
                    initialScope: {
                        user: { id: machineId },
                        tags: { machine_id: machineId }
                    }
                });
            } catch (e) {
                console.error('[Telemetry] Sentry init failed:', e);
            }
        }

        if (POSTHOG_API_KEY) {
            try {
                this.posthog = new PostHog(POSTHOG_API_KEY, {
                    host: POSTHOG_HOST,
                    flushAt: 1,
                    flushInterval: 0
                });
            } catch (e) {
                console.error('[Telemetry] PostHog init failed:', e);
            }
        }

        this.isInitialized = true;
        this.flushQueue();
        
        // Iniciar ciclo de vida de telemetría (Inmediato + Recurrente)
        this.startTelemetryCycle();
    }

    private static async startTelemetryCycle() {
        // Latido inicial
        await this.sendHeartbeat();

        // Latido recurrente cada 5 minutos
        setInterval(async () => {
            console.log('[Telemetry] Ejecutando latido de mantenimiento...');
            await this.sendHeartbeat();
        }, 5 * 60 * 1000);
    }

    private static flushQueue() {
        if (!this.posthog || this.eventQueue.length === 0) return;
        while (this.eventQueue.length > 0) {
            const item = this.eventQueue.shift();
            if (item) this.trackEvent(item.event, item.properties);
        }
    }

    private static async sendHeartbeat() {
        if (!this.posthog) return;

        try {
            const hardware = await HardwareScanner.getHardwareSummary();
            const machineId = MachineIdentityProvider.getAnonymousId();
            const version = app.getVersion();
            const gpuString = hardware?.gpu?.map(g => `${g.vendor} ${g.model} (${g.vram}MB)`).join(', ') || 'N/A';

            // 1. Identificar (Actualiza la 'Person' en PostHog)
            this.posthog.identify({
                distinctId: machineId,
                properties: {
                    $name: `EMBER-User-${machineId.substring(0, 4)}`,
                    gpu: gpuString,
                    version: version,
                    os: process.platform,
                    cpu: hardware?.cpu?.brand,
                    ram: hardware?.ram?.total + 'GB',
                    last_seen: new Date().toISOString()
                }
            });

            // 2. Capturar Evento
            this.posthog.capture({
                distinctId: machineId,
                event: 'app_heartbeat',
                properties: {
                    version,
                    gpu: gpuString,
                    ...hardware
                }
            });

            // 3. Forzar vaciado inmediato
            await this.posthog.flush();
            console.log('[Telemetry] Heartbeat & Identity sincronizados con éxito.');
        } catch (err) {
            console.error('[Telemetry] Error en ciclo de latido:', err);
        }
    }

    public static trackEvent(eventName: string, properties: Record<string, any> = {}) {
        if (!this.isInitialized || !this.posthog) {
            this.eventQueue.push({ event: eventName, properties });
            return;
        }

        const machineId = MachineIdentityProvider.getAnonymousId();
        this.posthog.capture({
            distinctId: machineId,
            event: eventName,
            properties: {
                ...properties,
                app_version: app.getVersion()
            }
        });
        
        // Flush defensivo para eventos trackeados
        this.posthog.flush().catch(err => {
            console.error('[Telemetry] Fallo silenciado en flush:', err.message);
        });
    }

    public static async shutdown() {
        if (this.posthog) {
            await this.posthog.shutdown();
        }
    }
}
