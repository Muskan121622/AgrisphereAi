import {
  Bell,
  Check,
  Trash2,
  X,
  CloudRain,
  TrendingUp,
  AlertTriangle,
  MessageCircle,
  Info,
  Droplets,
  Landmark,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Notification,
  NotificationType,
} from "@/store/notificationStore";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuthStore } from "@/store/authStore";
import { getNotificationsStream, markNotificationRead } from "@/services/firebaseService";

const getIcon = (type: string) => {
  switch (type) {
    case "weather":
      return <CloudRain className="h-4 w-4 text-blue-500" />;
    case "market":
      return <TrendingUp className="h-4 w-4 text-green-500" />;
    case "disease":
      return <AlertTriangle className="h-4 w-4 text-red-500" />;
    case "community":
      return <MessageCircle className="h-4 w-4 text-purple-500" />;
    case "irrigation":
      return <Droplets className="h-4 w-4 text-cyan-500" />;
    case "schemes":
      return <Landmark className="h-4 w-4 text-orange-500" />;
    default:
      return <Info className="h-4 w-4 text-slate-500" />;
  }
};

interface FirestoreTimestamp {
  toDate: () => Date;
}

const isFirestoreTimestamp = (ts: unknown): ts is FirestoreTimestamp => {
  const t = ts as Record<string, unknown>;
  return !!ts && typeof ts === 'object' && 'toDate' in t && typeof t.toDate === 'function';
};

const NotificationCenter = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [open, setOpen] = useState(false);
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const prevUnreadCount = useRef(0);

  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    if (!user) return;

    const unsubscribe = getNotificationsStream(user.id, (notifs: unknown[]) => {
      // Cast firestore objects to store-compatible format
      const formattedNotifs = notifs as Notification[];

      // Play sound if we have more unread notifications than before
      const currentUnread = formattedNotifs.filter(n => !n.read).length;
      
      if (currentUnread > prevUnreadCount.current) {
        try {
          const audio = new Audio("/universfield-new-notification-026-380249.mp3");
          audio.volume = 0.5;
          audio.play().catch(e => console.error("Audio block:", e));
        } catch (e) {
          console.error("Audio error", e);
        }
      }
      
      prevUnreadCount.current = currentUnread;
      setNotifications(formattedNotifs);
    });

    return () => unsubscribe();
  }, [user]); 

  const handleNotificationClick = async (notifId: string, actionUrl?: string) => {
    if (user) {
        try {
            await markNotificationRead(user.id, notifId);
        } catch (e) {
            console.error("Failed to mark as read but continuing navigation", e);
        }
    }
    
    if (actionUrl) {
      setOpen(false); 
      if (actionUrl.startsWith('http')) {
        window.open(actionUrl, '_blank');
      } else {
        navigate(actionUrl);
      }
    }
  };

  const markAllAsRead = async () => {
    if (!user) return;
    for (const n of notifications) {
        if (!n.read) await markNotificationRead(user.id, n.id);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative hover:bg-slate-800 rounded-full w-10 h-10"
        >
          <Bell
            className={cn(
              "h-5 w-5 text-slate-200 transition-all",
              unreadCount > 0 && "animate-swing",
            )}
          />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-slate-950 animate-in zoom-in">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-80 md:w-96 p-0 bg-slate-950 border-slate-800 shadow-2xl"
        align="end"
      >
        <div className="flex items-center justify-between p-4 border-b border-slate-800">
          <h4 className="font-semibold text-white flex items-center gap-2">
            {t("notifications.title", "Notifications")}{" "}
            <Badge variant="secondary" className="text-xs bg-slate-900">
              {unreadCount} {t("notifications.new", "New")}
            </Badge>
          </h4>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 hover:text-green-400"
              onClick={markAllAsRead}
              title={t("notifications.markAll", "Mark all read")}
            >
              <Check className="h-4 w-4" />
            </Button>
            <Badge variant="outline" className="text-[10px] text-blue-500 border-blue-900/50 flex gap-1 items-center">
                <ShieldCheck className="w-3 h-3" /> Cloud
            </Badge>
          </div>
        </div>

        <ScrollArea className="h-[400px]">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center space-y-4">
              <Bell className="h-12 w-12 text-slate-800" />
              <p className="text-slate-500 text-sm">
                {t("notifications.empty", "No new notifications.")}
              </p>
            </div>
          ) : (
            <div className="flex flex-col divide-y divide-slate-800">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={cn(
                    "p-4 flex gap-4 transition-colors hover:bg-slate-900 cursor-pointer",
                    !notification.read ? "bg-slate-900/40" : "",
                  )}
                  onClick={() =>
                    handleNotificationClick(
                      notification.id,
                      notification.actionUrl,
                    )
                  }
                >
                  <div
                    className={cn(
                      "mt-1 h-8 w-8 rounded-full flex items-center justify-center shrink-0 bg-slate-900 border border-slate-800",
                      !notification.read && "border-blue-500/30",
                    )}
                  >
                    {getIcon(notification.type)}
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex justify-between items-start">
                      <p
                        className={cn(
                          "text-sm font-medium text-slate-300",
                          !notification.read && "text-white font-bold",
                        )}
                      >
                        {notification.title}
                      </p>
                      <span className="text-[10px] text-slate-500 whitespace-nowrap ml-2">
                        {isFirestoreTimestamp(notification.timestamp)
                          ? formatDistanceToNow(notification.timestamp.toDate(), { addSuffix: true }) 
                          : notification.timestamp && typeof notification.timestamp === 'number' 
                            ? formatDistanceToNow(new Date(notification.timestamp), { addSuffix: true }) 
                            : 'just now'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 line-clamp-2">
                      {notification.message}
                    </p>
                  </div>
                  {!notification.read && (
                    <div className="h-2 w-2 rounded-full bg-blue-500 mt-2 shrink-0 animate-pulse" />
                  )}
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationCenter;
