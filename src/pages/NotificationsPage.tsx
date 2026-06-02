import { useEffect, useMemo, useState } from "react";
import { mockNotifications } from "@/data/mockData";
import { useAuth } from "@/contexts/AuthContext";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { DataCard } from "@/components/dashboard/DataCard";

type AppNotification = {
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

function loadStoredNotifications(): AppNotification[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveStoredNotifications(items: AppNotification[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    /* ignore */
  }
}

const NotificationsPage = () => {
  const { user } = useAuth();

  const getInitialNotifications = (): AppNotification[] => {
    if (user?.role === "exam_office") {
      return [
        {
          id: "ex-n1",
          userId: user.id,
          type: "approved",
          title: "Exam Paper Moderated by HOD",
          body: "HOD has approved the CS301 final exam paper.",
          read: false,
          createdAt: new Date(Date.now() - 3600000).toISOString(),
        },
      ];
    }
    return mockNotifications as AppNotification[];
  };

  const [notifications, setNotifications] = useState<AppNotification[]>(
    getInitialNotifications,
  );

  useEffect(() => {
    if (!user) return;
    const stored = loadStoredNotifications().filter((n) => n.userId === user.id);
    if (stored.length === 0) return;
    setNotifications((prev) => {
      const existing = new Set(prev.map((p) => p.id));
      const merged = [...stored.filter((s) => !existing.has(s.id)), ...prev];
      return merged.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    });
  }, [user?.id]);

  const markAllRead = () =>
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  const markRead = (id: string) =>
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.read).length,
    [notifications],
  );

  useEffect(() => {
    if (!user) return;
    const stored = loadStoredNotifications();
    const map = new Map(stored.map((n) => [n.id, n]));
    notifications.forEach((n) => {
      if (n.userId !== user.id) return;
      const existing = map.get(n.id);
      if (!existing) return;
      if (existing.read !== n.read) map.set(n.id, { ...existing, read: n.read });
    });
    saveStoredNotifications(Array.from(map.values()));
  }, [notifications, user?.id]);

  const filtered = user
    ? notifications.filter((n) => !n.userId || n.userId === user.id)
    : notifications;

  return (
    <div className="ds-page-scroll">
      <PageHeader
        title="Notifications"
        subtitle={unreadCount > 0 ? `${unreadCount} unread` : "All caught up"}
      />
      <div className="ds-form-actions" style={{ marginBottom: 20 }}>
        <button type="button" className="btn btn-secondary btn-sm" onClick={markAllRead}>
          Mark all read
        </button>
      </div>
      <DataCard label="Inbox">
        {filtered.length === 0 ? (
          <div className="ds-empty">No notifications</div>
        ) : (
          <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
            {filtered.map((n) => (
              <li
                key={n.id}
                style={{
                  borderBottom: "1px solid #E8EAF2",
                  padding: "16px 0",
                }}
              >
                <button
                  type="button"
                  onClick={() => markRead(n.id)}
                  style={{
                    width: "100%",
                    textAlign: "left",
                    background: n.read ? "transparent" : "#EEF0FD",
                    border: "none",
                    borderRadius: 8,
                    padding: 12,
                    cursor: "pointer",
                  }}
                >
                  <p
                    className="ds-body-text"
                    style={{ fontWeight: n.read ? 400 : 600, marginBottom: 4 }}
                  >
                    {n.title}
                    {!n.read && (
                      <span
                        className="ds-badge ds-badge-warning"
                        style={{ marginLeft: 8 }}
                      >
                        New
                      </span>
                    )}
                  </p>
                  {n.body && (
                    <p className="ds-text-secondary" style={{ marginBottom: 4 }}>
                      {n.body}
                    </p>
                  )}
                  <span className="ds-text-secondary">
                    {new Date(n.createdAt).toLocaleString()}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </DataCard>
    </div>
  );
};

export default NotificationsPage;
