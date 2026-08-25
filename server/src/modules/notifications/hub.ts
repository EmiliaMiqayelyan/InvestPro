type HubListener = (event: string, data: unknown) => void;

const listeners = new Map<string, Set<HubListener>>();

export function subscribeNotifications(userId: string, listener: HubListener): () => void {
  const set = listeners.get(userId) ?? new Set<HubListener>();
  set.add(listener);
  listeners.set(userId, set);
  return () => {
    set.delete(listener);
    if (set.size === 0) listeners.delete(userId);
  };
}

export function publishNotification(userId: string, event: string, data: unknown) {
  const set = listeners.get(userId);
  if (!set) return;
  for (const listener of set) {
    try {
      listener(event, data);
    } catch {
      /* ignore */
    }
  }
}
