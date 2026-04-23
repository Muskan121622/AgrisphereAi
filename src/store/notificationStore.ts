import { create } from "zustand";
import { persist } from "zustand/middleware";

export type NotificationType =
  | "weather"
  | "market"
  | "disease"
  | "community"
  | "system"
  | "irrigation"
  | "schemes";

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: number | { toDate: () => Date } | { seconds: number; nanoseconds: number };
  read: boolean;
  actionUrl?: string;
}

interface NotificationStore {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (
    notification: Omit<Notification, "id" | "timestamp" | "read"> & {
      id?: string;
      read?: boolean;
    },
  ) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearAll: () => void;
}

// Custom User Sound
const playNotificationSound = () => {
  try {
    const audio = new Audio("/universfield-new-notification-026-380249.mp3");
    audio.volume = 0.5; // Set reasonable volume
    audio.play().catch((e) => console.error("Audio playback error:", e));
  } catch (e) {
    console.error("Audio play failed", e);
  }
};

export const useNotificationStore = create<NotificationStore>()(
  persist(
    (set, get) => ({
      notifications: [],
      unreadCount: 0,

      addNotification: (data) => {
        const { notifications } = get();

        // Deduplication check if ID is provided
        if (data.id && notifications.some((n) => n.id === data.id)) {
          return; // Skip duplicate
        }

        const newNotification: Notification = {
          id: data.id || Date.now().toString(),
          timestamp: Date.now(),
          read: data.read ?? true,
          ...data,
        };

        // Play Sound
        playNotificationSound();

        set((state) => ({
          notifications: [newNotification, ...state.notifications],
          unreadCount: state.unreadCount + (newNotification.read ? 0 : 1),
        }));
      },

      markAsRead: (id) =>
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, read: true } : n,
          ),
          unreadCount: state.notifications.filter((n) => n.id !== id && !n.read)
            .length, // Recalculate accurately
        })),

      markAllAsRead: () =>
        set((state) => ({
          notifications: state.notifications.map((n) => ({ ...n, read: true })),
          unreadCount: 0,
        })),

      clearAll: () => set({ notifications: [], unreadCount: 0 }),
    }),
    {
      name: "agrisphere-notifications",
    },
  ),
);
