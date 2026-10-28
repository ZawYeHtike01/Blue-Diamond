
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getFunctions } from "firebase/functions";

const firebaseConfig = {
  apiKey: "AIzaSyDYYpPjFfEf8wFB5Y9UaiLRHNMzUxnzGPM",
  authDomain: "bluediamond-f9c8b.firebaseapp.com",
  projectId: "bluediamond-f9c8b",
  storageBucket: "bluediamond-f9c8b.firebasestorage.app",
  messagingSenderId: "257957623303",
  appId: "1:257957623303:web:2e0698b95e3034e767dca2",
  measurementId: "G-Y06H9Z34ET",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

// Production Cloud Functions
export const functions = getFunctions(app, "us-central1");

if (typeof window !== "undefined") {
  getAnalytics(app);
}

export default app;
