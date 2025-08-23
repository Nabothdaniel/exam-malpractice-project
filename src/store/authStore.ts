import { create } from "zustand";
import { persist } from "zustand/middleware";
import { auth, db } from "../firebase/firebase";
import {
  signInWithEmailAndPassword,
  signOut,
  User as FirebaseUser,
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

interface User {
  id: string;
  email: string;
  name: string;
  role: "superadmin" | "admin" | "investigator" | "viewer";
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  userProfile: User | null; // 🔹 separate profile state
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  fetchUserProfile: () => Promise<void>; // 🔹 auto-fetch for logged-in user
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      userProfile: null,

      // 🔹 LOGIN
      login: async (email: string, password: string) => {
        try {
          const cred = await signInWithEmailAndPassword(auth, email, password);
          const fbUser: FirebaseUser = cred.user;

          // Fetch role + profile from Firestore
          const userDoc = await getDoc(doc(db, "users", fbUser.uid));

          if (!userDoc.exists()) {
            throw new Error("User record not found in Firestore");
          }

          const data = userDoc.data() as {
            role: "superadmin" | "admin" | "investigator" | "viewer";
            name?: string;
            email?: string;
          };

          const user: User = {
            id: fbUser.uid,
            email: fbUser.email || data.email || "",
            name: data.name || fbUser.email?.split("@")[0] || "Unknown",
            role: data.role,
          };

          set({ user, userProfile: user, isAuthenticated: true });
          return true;
        } catch (error) {
          console.error("Login failed:", error);
          return false;
        }
      },

      // 🔹 LOGOUT
      logout: async () => {
        await signOut(auth);
        set({ user: null, userProfile: null, isAuthenticated: false });
      },

      // 🔹 FETCH USER PROFILE (based on logged-in UID)
      fetchUserProfile: async () => {
        try {
          const currentUser = get().user;
          if (!currentUser) return;

          const userDoc = await getDoc(doc(db, "users", currentUser.id));

          if (userDoc.exists()) {
            const data = userDoc.data() as {
              role: "superadmin" | "admin" | "investigator" | "viewer";
              name?: string;
              email?: string;
            };

            const profile: User = {
              id: currentUser.id,
              email: currentUser.email,
              name: data.name || currentUser.name,
              role: data.role,
            };

            set({ userProfile: profile });
          }
        } catch (error) {
          console.error("Error fetching profile:", error);
        }
      },
    }),
    { name: "auth-storage" },
  ),
);
