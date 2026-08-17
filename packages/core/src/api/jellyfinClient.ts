import { Jellyfin } from '@jellyfin/sdk';
import { getDeviceId } from '../utils/deviceId';

export type Platform = 'web' | 'tizen';

function getBrowserName(): string {
    if (platform === 'tizen') return 'Samsung Smart TV';

    const ua = navigator.userAgent;
    if (ua.includes('Firefox/')) return 'Firefox';
    if (ua.includes('Edg/')) return 'Edge';
    if (ua.includes('OPR/') || ua.includes('Opera/')) return 'Opera';
    if (ua.includes('Chrome/')) return 'Chrome';
    if (ua.includes('Safari/')) return 'Safari';
    return 'Browser';
}

let clientName = 'Pelagica';
let clientVersion = '0.0.0';
let platform: Platform = 'web';
let jellyfinInstance: Jellyfin | null = null;

// Consuming apps must call this once at startup with their own package.json
// name/version, since the Jellyfin client identifies itself to the server.
export function setClientInfo(info: { name: string; version: string; platform?: Platform }) {
    clientName = info.name;
    clientVersion = info.version;
    platform = info.platform ?? 'web';
    jellyfinInstance = null;
}

export function getPlatform(): Platform {
    return platform;
}

export function isTizen(): boolean {
    return platform === 'tizen';
}

export function getJellyfinInstance(): Jellyfin {
    if (!jellyfinInstance) {
        jellyfinInstance = new Jellyfin({
            clientInfo: { name: clientName, version: clientVersion },
            deviceInfo: { name: getBrowserName(), id: getDeviceId() },
        });
    }
    return jellyfinInstance;
}

export function createApi(server: string, token?: string) {
    return getJellyfinInstance().createApi(server, token);
}
