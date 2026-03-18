/**
 * PWA: Service worker registration and offline detection
 */

const SW_PATH = '/sw.js';

/**
 * Register the service worker
 * @returns {Promise<ServiceWorkerRegistration|undefined>}
 */
export function registerServiceWorker() {
  if (!('serviceWorker' in navigator)) return Promise.resolve(undefined);
  return navigator.serviceWorker.register(SW_PATH, { scope: '/' }).then(
    (reg) => reg,
    () => undefined
  );
}

/**
 * Check if the app is currently offline
 * @returns {boolean}
 */
export function isOffline() {
  return !navigator.onLine;
}

/**
 * Check if the app has ever been loaded (SW installed and cache populated)
 * We consider "ever loaded" true if the SW is controlling the page
 * @returns {boolean}
 */
export function hasBeenLoadedBefore() {
  return navigator.serviceWorker?.controller != null;
}
