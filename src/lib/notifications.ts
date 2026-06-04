export type AppNotification = {
  id: string;
  userId: string;
  type: string;
  title: string;
  body?: string;
  read: boolean;
  createdAt: string;
  fromRole?: string;
  fromName?: string;
};

const STORAGE_KEY = "auca_notifications_v1";

export function loadStoredNotifications(): AppNotification[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveStoredNotifications(items: AppNotification[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    // Dispatch storage event so other components and tabs know there's a change
    window.dispatchEvent(new Event("storage"));
  } catch {
    /* ignore */
  }
}

export function pushNotification(n: {
  userId: string;
  type: string;
  title: string;
  body?: string;
  fromRole?: string;
  fromName?: string;
}) {
  const notifications = loadStoredNotifications();
  const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  const newNotif: AppNotification = {
    id,
    userId: n.userId,
    type: n.type,
    title: n.title,
    body: n.body ?? "",
    read: false,
    createdAt: new Date().toISOString(),
    fromRole: n.fromRole,
    fromName: n.fromName,
  };
  notifications.unshift(newNotif);
  saveStoredNotifications(notifications);
  return newNotif;
}
