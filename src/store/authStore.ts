import { create } from "zustand";
import { persist } from "zustand/middleware";
import { auth } from "@/lib/firebase";
import axios from "axios";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  User as FirebaseUser,
} from "firebase/auth";
import { saveUserProfile, getUserProfile } from "@/services/firebaseService";

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: "farmer" | "government" | "buyer";
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (
    email: string,
    password: string,
    role?: "farmer" | "government" | "buyer",
  ) => Promise<void>;
  setUser: (user: User) => void;
  signup: (
    email: string,
    password: string,
    name: string,
    role?: "farmer" | "government" | "buyer",
  ) => Promise<void>;
  logout: () => Promise<void>;
  initializeAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,

      loading: true,
      setUser: (user: User) =>
        set({ user, isAuthenticated: true, loading: false }),
      login: async (
        email: string,
        password: string,
        role: "farmer" | "government" | "buyer" = "farmer",
      ) => {
        try {
          const userCredential = await signInWithEmailAndPassword(
            auth,
            email,
            password,
          );
          const firebaseUser = userCredential.user;
          
          // Fetch additional profile data from Firestore (gracefully handle permission errors)
          let profileData = null;
          try {
            profileData = await getUserProfile(firebaseUser.uid);
          } catch (e) {
            console.warn("Could not fetch user profile from Firestore, using auth defaults", e);
          }

          const user: User = {
            id: firebaseUser.uid,
            name:
              profileData?.name || 
              firebaseUser.displayName ||
              firebaseUser.email?.split("@")[0] ||
              "User",
            email: firebaseUser.email || "",
            avatar: profileData?.photoUrl || firebaseUser.photoURL || undefined,
            role: profileData?.role || role,
          };
          set({ user, isAuthenticated: true, loading: false });
        } catch (error: any) {
          console.error("Login error:", error);
          set({ loading: false });
          // Provide a more helpful error message for "offline" / Firestore not setup errors
          if (error?.message?.includes("offline")) {
             throw new Error("Unable to connect to database. Please ensure Firestore is enabled in the console.");
          }
          throw error;
        }
      },
      signup: async (
        email: string,
        password: string,
        name: string,
        role: "farmer" | "government" | "buyer" = "farmer",
      ) => {
        try {
          const userCredential = await createUserWithEmailAndPassword(
            auth,
            email,
            password,
          );
          const firebaseUser = userCredential.user;
          // Update display name
          await updateProfile(firebaseUser, {
            displayName: name,
          });
          const user: User = {
            id: firebaseUser.uid,
            name: name,
            email: firebaseUser.email || "",
            avatar: firebaseUser.photoURL || undefined,
            role: role, // Use selected role
          };

          try {
            // Save to Firestore as well
            await saveUserProfile(firebaseUser.uid, {
              username: name,
              name,
              email: firebaseUser.email || email,
              photoUrl: firebaseUser.photoURL || "",
              bio: "",
              country: "India",
              role,
            });
          } catch (profileError) {
            console.error("Profile Firestore bootstrap error:", profileError);
          }

          localStorage.setItem("agrisphere_username", name);
          localStorage.setItem("agrisphere_email", firebaseUser.email || email);
          localStorage.setItem("agrisphere_user_id", firebaseUser.uid);
          set({ user, isAuthenticated: true, loading: false });
        } catch (error: any) {
          console.error("Signup error:", error);
          set({ loading: false });
          if (error?.message?.includes("offline")) {
             throw new Error("Unable to connect to database. Please ensure Firestore is enabled in the console.");
          }
          throw error;
        }
      },
      logout: async () => {
        try {
          await signOut(auth);
          set({ user: null, isAuthenticated: false, loading: false });
        } catch (error) {
          console.error("Logout error:", error);
          throw error;
        }
      },
      initializeAuth: () => {
        onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
          if (firebaseUser) {
            // Fetch deep profile data on auth change
            let profileData = null;
            try {
              profileData = await getUserProfile(firebaseUser.uid);
            } catch (err) {
              console.error("Failed to load profile on auth init", err);
            }

            const persistedState = get();
            const currentRole = profileData?.role || persistedState.user?.role || "farmer";

            const user: User = {
              id: firebaseUser.uid,
              name:
                profileData?.name || 
                firebaseUser.displayName ||
                firebaseUser.email?.split("@")[0] ||
                "User",
              email: firebaseUser.email || "",
              avatar: profileData?.photoUrl || firebaseUser.photoURL || undefined,
              role: currentRole as any,
            };
            localStorage.setItem("agrisphere_user_id", firebaseUser.uid);

            // AUTO-SYNC Profile to LocalStorage for downstream features (Seed Finder, Advisory Hub)
            if (profileData && firebaseUser.email) {
              const emailKey = firebaseUser.email;
              localStorage.setItem(`profile_${emailKey}_state`, profileData.state || "");
              localStorage.setItem(`profile_${emailKey}_district`, profileData.district || "");
              localStorage.setItem(`profile_${emailKey}_village`, profileData.village || "");
              localStorage.setItem(`profile_${emailKey}_city`, profileData.city || "");
              localStorage.setItem(`profile_${emailKey}_country`, profileData.country || "India");
              localStorage.setItem(`profile_${emailKey}_farmSize`, profileData.farmSize || "");
              localStorage.setItem(`profile_${emailKey}_farmerType`, profileData.farmerType || "Small");
            }

            set({ user, isAuthenticated: true, loading: false });
          } else {
            set({ user: null, isAuthenticated: false, loading: false });
          }
        });
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);
