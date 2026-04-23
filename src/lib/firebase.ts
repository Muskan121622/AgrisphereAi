import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

// Firebase configuration provided by user
const firebaseConfig = {
  apiKey: "AIzaSyDtc9xgCZ9u8CDnc6ZpRrhENMgNF4D5LHY",
  authDomain: "agrisphere-5d56c.firebaseapp.com",
  projectId: "agrisphere-5d56c",
  storageBucket: "agrisphere-5d56c.firebasestorage.app",
  messagingSenderId: "412533049904",
  appId: "1:412533049904:web:44eca2aec0442b9833fbf5",
  measurementId: "G-QFE60X5R5L"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;

// Initialize Firebase Authentication, Firestore, and get references to the services
export const auth = getAuth(app);
export const db = getFirestore(app);

export { app, analytics };
export default app;
