import { useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import { db } from "@/lib/firebase";
import { doc, setDoc, serverTimestamp, collection, addDoc } from "firebase/firestore";
import { toast } from "sonner";

export const FirebaseMigration = () => {
  const { user } = useAuthStore();

  useEffect(() => {
    if (!user?.email) return;

    const migrationDoneKey = `migration_done_${user.email}`;
    if (localStorage.getItem(migrationDoneKey)) return;

    const migrate = async () => {
      console.log("🚀 Starting one-time migration to Firebase for", user.email);
      let migratedCount = 0;

      try {
        // 1. Migrate Profile Data
        const profileData: any = {};
        const profileFields = [
          "name", "bio", "dob", "country", "state", "district", "village", 
          "farmSize", "experience", "crops", "photoUrl"
        ];

        profileFields.forEach(field => {
          const val = localStorage.getItem(`profile_${user.email}_${field}`);
          if (val) profileData[field] = val;
        });

        if (Object.keys(profileData).length > 0) {
          await setDoc(doc(db, "users", user.email), {
            ...profileData,
            migratedFromLocal: true,
            updatedAt: serverTimestamp()
          }, { merge: true });
          migratedCount++;
        }

        // 2. Migrate Community Posts (if any were local-only)
        const localPosts = localStorage.getItem("community_posts");
        if (localPosts) {
          const posts = JSON.parse(localPosts);
          if (Array.isArray(posts)) {
            for (const post of posts) {
              await addDoc(collection(db, "posts"), {
                ...post,
                author: post.author || user.email,
                createdAt: serverTimestamp(),
                migrated: true
              });
            }
            migratedCount++;
          }
        }

        // Mark as done
        localStorage.setItem(migrationDoneKey, "true");
        
        if (migratedCount > 0) {
          toast.success("Profile and data synchronized with cloud.");
        }
      } catch (error) {
        console.error("Migration failed:", error);
      }
    };

    migrate();
  }, [user]);

  return null;
};
