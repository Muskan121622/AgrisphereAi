import { useAuthStore } from "@/store/authStore";

export interface ProfileLocation {
  state: string;
  district: string;
  village: string;
  fullAddress: string;
}

/**
 * Retrieves the user's saved profile location from localStorage.
 */
export const getProfileLocation = (email: string | undefined): ProfileLocation | null => {
  if (!email) return null;

  try {
    const state = localStorage.getItem(`profile_${email}_state`) || "";
    const district = localStorage.getItem(`profile_${email}_district`) || "";
    const village = localStorage.getItem(`profile_${email}_village`) || "";

    if (!state && !district && !village) return null;

    const parts = [village, district, state].filter(Boolean);
    
    return {
      state,
      district,
      village,
      fullAddress: parts.join(", ")
    };
  } catch (error) {
    console.error("Error reading profile location:", error);
    return null;
  }
};
