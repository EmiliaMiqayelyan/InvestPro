/**
 * In-process SSE fan-out. Lives on globalThis so it survives Next.js HMR
 * and stays aligned with the in-memory store.
 */

type HubListener = (event: string, data: unknown) => void;

interface NotificationHub {
  listeners: Map<string, Set<HubListener>>;
}

declare global {
  // eslint-disable-next-line no-var
  var __investProNotificationHub: NotificationHub | undefined;
}

function getHub(): NotificationHub {
  if (!globalThis.__investProNotificationHub) {
    globalThis.__investProNotificationHub = { listeners: new Map() };
  }
  return globalThis.__investProNotificationHub;
}

export function subscribeNotifications(userId: string, listener: HubListener): () => void {
  const hub = getHub();
  const set = hub.listeners.get(userId) ?? new Set<HubListener>();
  set.add(listener);
  hub.listeners.set(userId, set);
  return () => {
    set.delete(listener);
    if (set.size === 0) hub.listeners.delete(userId);
  };
}

export function publishNotification(userId: string, event: string, data: unknown) {
  const listeners = getHub().listeners.get(userId);
  if (!listeners) return;
  for (const listener of listeners) {
    try {
      listener(event, data);
    } catch {
      /* ignore a dead subscriber */
    }
  }
}

export function connectedNotificationClients(userId: string): number {
  return getHub().listeners.get(userId)?.size ?? 0;
}
