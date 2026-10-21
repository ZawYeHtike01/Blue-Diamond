// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDYYpPjFfEf8wFB5Y9UaiLRHNMzUxnzGPM",
  authDomain: "bluediamond-f9c8b.firebaseapp.com",
  projectId: "bluediamond-f9c8b",
  storageBucket: "bluediamond-f9c8b.firebasestorage.app",
  messagingSenderId: "257957623303",
  appId: "1:257957623303:web:2e0698b95e3034e767dca2",
  measurementId: "G-Y06H9Z34ET"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);