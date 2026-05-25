import * as si from 'systeminformation';
import { screen } from 'electron';

/**
 * Escáner de Hardware para Telemetría.
 * Extrae especificaciones técnicas necesarias para validar el rendimiento del motor.
 */
export class HardwareScanner {
    /**
     * Obtiene un resumen del hardware actual.
     */
    public static async getHardwareSummary() {
        try {
            const [cpu, mem, graphics, os] = await Promise.all([
                si.cpu(),
                si.mem(),
                si.graphics(),
                si.osInfo()
            ]);

            const primaryDisplay = screen.getPrimaryDisplay();

            return {
                cpu: {
                    manufacturer: cpu.manufacturer,
                    brand: cpu.brand,
                    cores: cpu.cores,
                    speed: cpu.speed
                },
                ram: {
                    total: Math.round(mem.total / (1024 * 1024 * 1024)), // GB
                    free: Math.round(mem.free / (1024 * 1024 * 1024))
                },
                gpu: graphics.controllers.map(g => ({
                    model: g.model,
                    vram: g.vram,
                    vendor: g.vendor
                })),
                os: {
                    platform: os.platform,
                    distro: os.distro,
                    release: os.release,
                    arch: os.arch
                },
                display: {
                    resolution: `${primaryDisplay.size.width}x${primaryDisplay.size.height}`,
                    scaleFactor: primaryDisplay.scaleFactor
                }
            };
        } catch (error) {
            console.error('[Telemetry] Error scanning hardware:', error);
            return null;
        }
    }
}
