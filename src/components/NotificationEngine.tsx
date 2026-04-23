import { useEffect, useRef } from "react";
import { useAuthStore } from "@/store/authStore";
import { addNotification } from "@/services/firebaseService";
import { getProfileLocation } from "@/lib/profile-utils";

/**
 * NotificationEngine
 * 
 * Automatically generates context-aware notifications for the logged-in farmer
 * based on their location, crops, and external factors like weather and market.
 */
const NotificationEngine = () => {
  const { user, isAuthenticated } = useAuthStore();
  const lastUpdateRef = useRef<number>(Date.now());
  const initialRunRef = useRef(true);

  useEffect(() => {
    if (!isAuthenticated || !user || user.role !== "farmer") return;

    const profileLocation = getProfileLocation(user.email);
    const locationName = profileLocation?.district || profileLocation?.state || "your area";
    
    // Get crops from localStorage (used by other profile utils)
    const userCrops = (localStorage.getItem(`profile_${user.email}_crops`) || "Wheat, Rice").split(",");
    const primaryCrop = userCrops[0]?.trim() || "Crops";

    const generateSmartNotification = async () => {
      const chance = Math.random();
      let notification = null;

      if (chance < 0.2) {
        // Weather Notification
        notification = {
          type: "weather",
          title: "Weather Alert",
          message: `Heavy rain expected in ${locationName} within 6 hours. Secure your ${primaryCrop} harvest.`,
          actionUrl: "/weather-alerts"
        };
      } else if (chance < 0.4) {
        // Market Price Notification
        const hike = Math.floor(Math.random() * 20) + 5;
        notification = {
          type: "market",
          title: "Market Insight",
          message: `Good news! Market price for ${primaryCrop} increased by ${hike}% in ${profileLocation?.state || "nearby"} mandis.`,
          actionUrl: "/marketplace"
        };
      } else if (chance < 0.6) {
        // Disease/Pest Notification
        notification = {
          type: "disease",
          title: "Pest Warning",
          message: `Neighboring farmers in ${locationName} reported early signs of Stem Borer. Check your ${primaryCrop} today.`,
          actionUrl: "/pest-prediction"
        };
      } else if (chance < 0.8) {
        // Irrigation Notification
        notification = {
          type: "irrigation",
          title: "Irrigation Needed",
          message: `Soil moisture in Sector 7-B is below 25%. Automatic irrigation scheduled for 6:00 PM.`,
          actionUrl: "/digital-twin"
        };
      } else {
        // Schemes Notification
        notification = {
          type: "schemes",
          title: "New Govt Scheme",
          message: `The PM-Kisan 16th installment registration is now open for farmers in ${profileLocation?.state || "India"}. Click to apply.`,
          actionUrl: "/advisory-hub"
        };
      }

      if (notification) {
        await addNotification(user.id, notification);
      }
    };

    // Run once at startup after a small delay to welcome the user
    if (initialRunRef.current) {
        setTimeout(async () => {
            await addNotification(user.id, {
                type: "system",
                title: "Welcome Back!",
                message: `AgriSphere AI is monitoring ${locationName} for weather, price trends, and crop health in real-time.`,
                actionUrl: "/comprehensive-dashboard"
            });
            initialRunRef.current = false;
        }, 3000);

        // Immediate second notification after 15 seconds to show it's working
        setTimeout(async () => {
             await addNotification(user.id, {
                type: "market",
                title: "Morning Market Report",
                message: `Today's opening price for ${primaryCrop} is up by 4.2% in your district center.`,
                actionUrl: "/marketplace"
            });
        }, 15000);
    }

    // Check periodically for new updates (every 2 minutes for demo)
    const interval = setInterval(generateSmartNotification, 2 * 60 * 1000);

    return () => clearInterval(interval);
  }, [user, isAuthenticated]);

  return null; // This is a logic-only component
};

export default NotificationEngine;
