import { db } from "../lib/firebase";
import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  collection, 
  query, 
  where, 
  getDocs,
  addDoc,
  serverTimestamp,
  orderBy,
  limit,
  deleteDoc,
  onSnapshot
} from "firebase/firestore";

/**
 * AI ADVISORY CHAT
 */

export const saveAiChatMessage = async (uid: string, message: { role: string; content: string }) => {
  try {
    await addDoc(collection(db, "users", uid, "ai_chats"), {
      ...message,
      timestamp: serverTimestamp()
    });
  } catch (error) {
    console.error("Error saving AI chat message:", error);
  }
};

export const getAiChatHistory = async (uid: string) => {
  try {
    const q = query(collection(db, "users", uid, "ai_chats"), orderBy("timestamp", "asc"), limit(50));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ 
      id: doc.id, 
      ...doc.data(),
      timestamp: doc.data().timestamp?.toDate() || new Date()
    }));
  } catch (error) {
    console.error("Error fetching AI chat history:", error);
    return [];
  }
};

/**
 * CHAT & SOCIAL
 */

export const getFarmersList = async (): Promise<Record<string, unknown>[]> => {
  try {
    const q = query(collection(db, "users"), limit(100));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Record<string, unknown>[];
  } catch (error) {
    console.error("Error getting farmers list:", error);
    return [];
  }
};

export const sendMessage = async (messageData: { senderId: string; receiverId: string; text: string; participants: string[] }) => {
  try {
    const docRef = await addDoc(collection(db, "messages"), {
      ...messageData,
      createdAt: serverTimestamp(),
      read: false
    });
    return { id: docRef.id };
  } catch (error) {
    console.error("Error sending message:", error);
    throw error;
  }
};

export const getMessagesStream = (userId: string, contactId: string, callback: (msgs: unknown[]) => void) => {
  const q = query(
    collection(db, "messages"),
    where("participants", "array-contains", userId),
    orderBy("createdAt", "asc")
  );

  return onSnapshot(q, (snapshot) => {
    const msgs = snapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() } as Record<string, any>))
      .filter((m) => m.participants.includes(contactId));
    callback(msgs);
  });
};

/**
 * NOTIFICATIONS
 */

export const addNotification = async (uid: string, notification: { type: string; title: string; message: string; actionUrl?: string }) => {
  try {
    await addDoc(collection(db, "users", uid, "notifications"), {
      ...notification,
      timestamp: serverTimestamp(),
      read: false
    });
  } catch (error) {
    console.error("Error adding notification:", error);
  }
};

export const getNotificationsStream = (uid: string, callback: (notifs: unknown[]) => void) => {
  const q = query(collection(db, "users", uid, "notifications"), orderBy("timestamp", "desc"), limit(20));
  return onSnapshot(q, (snapshot) => {
    callback(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  });
};

export const markNotificationRead = async (uid: string, notifId: string) => {
  try {
    const docRef = doc(db, "users", uid, "notifications", notifId);
    await updateDoc(docRef, { read: true });
  } catch (error) {
    console.error("Error marking notification as read:", error);
  }
};

export const saveUserProfile = async (uid: string, profileData: any) => {
  try {
    const userDocRef = doc(db, "users", uid);
    await setDoc(userDocRef, {
      ...profileData,
      updatedAt: serverTimestamp()
    }, { merge: true });
    return { success: true };
  } catch (error) {
    console.error("Error saving user profile:", error);
    throw error;
  }
};

export const getUserProfile = async (uid: string) => {
  try {
    const userDocRef = doc(db, "users", uid);
    const userDoc = await getDoc(userDocRef);
    if (userDoc.exists()) {
      return userDoc.data() as Record<string, unknown>;
    }
    return null;
  } catch (error) {
    console.error("Error getting user profile:", error);
    throw error;
  }
};

/**
 * COMMUNITY
 */

export const createPost = async (postData: any) => {
  try {
    const docRef = await addDoc(collection(db, "posts"), {
      ...postData,
      createdAt: serverTimestamp(),
      likes: 0
    });
    return { id: docRef.id };
  } catch (error) {
    console.error("Error creating post:", error);
    throw error;
  }
};

export const getPosts = async () => {
  try {
    const q = query(collection(db, "posts"), orderBy("createdAt", "desc"), limit(50));
    const querySnapshot = await getDocs(q);
    const posts = await Promise.all(querySnapshot.docs.map(async (postDoc) => {
      const postData = postDoc.data();
      const commentsQ = query(collection(db, "posts", postDoc.id, "comments"), orderBy("createdAt", "asc"));
      const commentsSnapshot = await getDocs(commentsQ);
      const comments = commentsSnapshot.docs.map(cDoc => ({ id: cDoc.id, ...cDoc.data() }));
      return { id: postDoc.id, ...postData, comments };
    }));
    return posts;
  } catch (error) {
    console.error("Error getting posts:", error);
    throw error;
  }
};

export const createComment = async (postId: string, commentData: any) => {
  try {
    const docRef = await addDoc(collection(db, "posts", postId, "comments"), {
      ...commentData,
      createdAt: serverTimestamp()
    });
    return { id: docRef.id };
  } catch (error) {
    console.error("Error creating comment:", error);
    throw error;
  }
};

/**
 * MARKETPLACE
 */

export const createListing = async (listingData: any) => {
  try {
    const docRef = await addDoc(collection(db, "marketplace"), {
      ...listingData,
      createdAt: serverTimestamp()
    });
    return { id: docRef.id };
  } catch (error) {
    console.error("Error creating listing:", error);
    throw error;
  }
};

export const getListings = async (category?: string) => {
  try {
    let q;
    if (category) {
      q = query(collection(db, "marketplace"), where("category", "==", category), orderBy("createdAt", "desc"));
    } else {
      q = query(collection(db, "marketplace"), orderBy("createdAt", "desc"));
    }
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error getting listings:", error);
    throw error;
  }
};

/**
 * NEGOTIATIONS
 */

export const createNegotiation = async (negotiationData: any) => {
  try {
    const docRef = await addDoc(collection(db, "negotiations"), {
      ...negotiationData,
      status: "Pending",
      createdAt: serverTimestamp()
    });
    return { id: docRef.id };
  } catch (error) {
    console.error("Error creating negotiation:", error);
    throw error;
  }
};

export const getNegotiations = async (filters: { buyerName?: string, sellerName?: string }) => {
  try {
    let q = query(collection(db, "negotiations"), orderBy("createdAt", "desc"));
    
    if (filters.buyerName) {
      q = query(collection(db, "negotiations"), where("buyerName", "==", filters.buyerName), orderBy("createdAt", "desc"));
    } else if (filters.sellerName) {
      q = query(collection(db, "negotiations"), where("sellerName", "==", filters.sellerName), orderBy("createdAt", "desc"));
    }
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error getting negotiations:", error);
    throw error;
  }
};

export const updateNegotiationStatus = async (id: string, status: string) => {
  try {
    const docRef = doc(db, "negotiations", id);
    await updateDoc(docRef, { status, updatedAt: serverTimestamp() });
    return { success: true };
  } catch (error) {
    console.error("Error updating negotiation status:", error);
    throw error;
  }
};

/**
 * DEMANDS
 */

export const getDemands = async () => {
  try {
    const q = query(collection(db, "demands"), orderBy("createdAt", "desc"), limit(20));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error getting demands:", error);
    throw error;
  }
};

/**
 * DIGITAL TWIN / REPORTS
 */

export const saveAiReport = async (uid: string, reportType: string, reportData: Record<string, unknown>) => {
  try {
    const docRef = await addDoc(collection(db, "reports"), {
      uid,
      type: reportType,
      data: reportData,
      createdAt: serverTimestamp()
    });
    return { id: docRef.id };
  } catch (error) {
    console.error("Error saving AI report:", error);
    throw error;
  }
};

export const getAiReports = async (uid: string, reportType: string) => {
  try {
    const q = query(
      collection(db, "reports"),
      where("uid", "==", uid),
      where("type", "==", reportType),
      orderBy("createdAt", "desc")
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Record<string, unknown>[];
  } catch (error) {
    console.error("Error fetching AI reports:", error);
    return [];
  }
};

export const submitCropLossCase = async (data: Record<string, unknown>) => {
  try {
    const docRef = await addDoc(collection(db, "cases"), {
      ...data,
      status: "Pending",
      createdAt: serverTimestamp(),
    });
    return { id: docRef.id };
  } catch (error) {
    console.error("Error submitting crop loss case:", error);
    throw error;
  }
};

export const updateCaseStatus = async (caseId: string, status: string) => {
  try {
    const docRef = doc(db, "cases", caseId);
    await setDoc(docRef, { status, updatedAt: serverTimestamp() }, { merge: true });
  } catch (error) {
    console.error("Error updating case status:", error);
    throw error;
  }
};

export const getGovStatsAggregation = async () => {
  try {
    const [usersSnap, reportsSnap, listingsSnap, casesSnap] = await Promise.all([
      getDocs(collection(db, "users")),
      getDocs(collection(db, "reports")),
      getDocs(collection(db, "listings")),
      getDocs(collection(db, "cases"))
    ]);

    return {
      overview: {
        totalFarmers: usersSnap.size,
        activeFarmers: Math.round(usersSnap.size * 0.8), // Mock active count
        diseaseDetections: reportsSnap.docs.filter(d => d.data().type === 'disease-scan').length,
        pestAlerts: reportsSnap.docs.filter(d => d.data().type === 'pest-prediction').length,
        fieldsMapped: usersSnap.docs.filter(d => d.data().farmLocation).length,
      },
      market: {
        totalListings: listingsSnap.size,
        listings: listingsSnap.docs.slice(0, 5).map(d => ({ id: d.id, ...d.data() })),
      },
      cropLoss: {
        pendingCases: casesSnap.docs.filter(d => d.data().status === 'Pending').length,
        totalDisbursed: casesSnap.docs.filter(d => d.data().status === 'Approved').length * 25000,
      }
    };
  } catch (error) {
    console.error("Error aggregating gov stats:", error);
    throw error;
  }
};

export const createDemand = async (demandData: any) => {
  try {
    const docRef = await addDoc(collection(db, "demands"), {
      ...demandData,
      createdAt: serverTimestamp()
    });
    return { id: docRef.id };
  } catch (error) {
    console.error("Error creating demand:", error);
    throw error;
  }
};

export const deleteDemand = async (id: string) => {
  try {
    await deleteDoc(doc(db, "demands", id));
  } catch (error) {
    console.error("Error deleting demand:", error);
    throw error;
  }
};

/**
 * INTERACTIONS
 */

export const createInteraction = async (interactionData: any) => {
  try {
    const docRef = await addDoc(collection(db, "interactions"), {
      ...interactionData,
      timestamp: serverTimestamp()
    });
    return { id: docRef.id };
  } catch (error) {
    console.error("Error creating interaction:", error);
    throw error;
  }
};

export const getInteractions = async (buyerId: string) => {
  try {
    const q = query(collection(db, "interactions"), where("buyerId", "==", buyerId), orderBy("timestamp", "desc"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error getting interactions:", error);
    throw error;
  }
};
