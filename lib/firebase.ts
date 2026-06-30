import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAivrw1GdVMKPxC04E6FLCQKiBP3q1DCfY",
  authDomain: "computer-science-platform.firebaseapp.com",
  projectId: "computer-science-platform",
  storageBucket: "computer-science-platform.firebasestorage.app",
  messagingSenderId: "990895587894",
  appId: "1:990895587894:web:9cf88dc09aea65f2af0e97",
  measurementId: "G-91JNWXQHN1"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);

