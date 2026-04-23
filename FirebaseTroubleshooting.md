# Resolving Firebase Auth & Firestore Setup

If you are seeing errors like `auth/configuration-not-found` or `Failed to get document because the client is offline`, follow these exact steps in your Firebase Console to fix the configuration.

---

## 1. Enable Email/Password Auth (Fixes "configuration-not-found")

1.  Open the [Firebase Console](https://console.firebase.google.com/).
2.  Click on your **AgriSphere** project.
3.  Go to **Build** > **Authentication**.
4.  Click on the **Sign-in method** tab.
5.  Click **Add new provider** > **Email/Password**.
6.  Toggle **Enable** and click **Save**.

---

## 2. Enable Cloud Firestore (Fixes "client is offline")

If your app stalls at "Creating Account..." or gives an offline error, you likely haven't initialized the database yet.

1.  In the Firebase Console, go to **Build** > **Firestore Database**.
2.  Click **Create database**.
3.  **Location**: Choose a region close to you (e.g., `asia-south1` or `nam5`).
4.  **Security Rules**: Select **Start in test mode** for now.
    *   *This allows you to read/write data immediately for 30 days while we build.*
5.  Click **Create**.

---

## 3. Verify Database Connectivity

Once the database is created:
1.  Refresh your AgriSphere application (in your browser).
2.  Try signing up again.
3.  Check the **Firestore** tab in the console; you should see a `users` collection appear once you successfully register!

> [!TIP]
> If you are still seeing "offline" errors after these steps, check your internet connection or ensure your API key in `src/lib/firebase.ts` matches exactly what is in Project Settings > General > Your Apps.
