import { sdk } from '@farcaster/miniapp-sdk';

/**
 * Detects if the app is running inside a Farcaster mini app context
 */
export function isMiniApp(): boolean {
    // Check URL parameters
    const url = new URL(window.location.href);
    if (url.searchParams.get('miniApp') === 'true') return true;

    // Check path
    if (url.pathname.startsWith('/miniapp')) return true;

    // Check SDK availability and context
    try {
        return typeof sdk !== 'undefined' && sdk.context !== null;
    } catch {
        return false;
    }
}

/**
 * Lazy loads the mini app SDK only when needed
 */
export async function loadMiniAppSDK() {
    if (isMiniApp()) {
        const { sdk } = await import('@farcaster/miniapp-sdk');
        return sdk;
    }
    return null;
}

/**
 * Checks if a specific SDK feature is available
 */
export function hasFeature(feature: string): boolean {
    try {
        return sdk.context.features?.includes(feature) || false;
    } catch {
        return false;
    }
}

/**
 * Gets the current mini app context
 */
export function getMiniAppContext() {
    try {
        return sdk.context;
    } catch {
        return null;
    }
}
