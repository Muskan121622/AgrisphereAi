import { useAuthStore } from "@/store/authStore";

export interface ProfileLocation {
  state: string;
  district: string;
  village: string;
  city: string;
  country: string;
  fullAddress: string;
}

/**
 * Retrieves the user's saved profile location from localStorage.
 */
export const getProfileLocation = (
  email: string | undefined,
): ProfileLocation | null => {
  if (!email) return null;

  try {
    const state = localStorage.getItem(`profile_${email}_state`) || "";
    const district = localStorage.getItem(`profile_${email}_district`) || "";
    const village = localStorage.getItem(`profile_${email}_village`) || "";
    const city = localStorage.getItem(`profile_${email}_city`) || "";
    const country = localStorage.getItem(`profile_${email}_country`) || "India";

    if (!state && !district && !village && !city) return null;

    const parts = [village, city, district, state, country].filter(Boolean);
    const uniqueParts = [
      ...new Set(parts.map((part) => part.trim()).filter(Boolean)),
    ];

    if (uniqueParts.length === 0) return null;

    return {
      state,
      district,
      village,
      city,
      country,
      fullAddress: uniqueParts.join(", "),
    };
  } catch (error) {
    console.error("Error reading profile location:", error);
    return null;
  }
};
