import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: "aibot-9a106.firebaseapp.com",
  projectId: "aibot-9a106",
  storageBucket: "aibot-9a106.firebasestorage.app",
  messagingSenderId: "272163835988",
  appId: "1:272163835988:web:4c390c5e5504771a275dc1",
};
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
