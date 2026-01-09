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

    // Check SDK availability
    try {
        return typeof sdk !== 'undefined';
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
export async function hasFeature(feature: string): Promise<boolean> {
    try {
        const context = await sdk.context;
        // ClientFeatures is an object with boolean properties
        const features = context.features as Record<string, boolean> | undefined;
        return features ? features[feature] === true : false;
    } catch {
        return false;
    }
}

/**
 * Gets the current mini app context
 */
export async function getMiniAppContext() {
    try {
        return await sdk.context;
    } catch {
        return null;
    }
}
