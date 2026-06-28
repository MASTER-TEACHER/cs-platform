// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAivrw1GdVMKPxC04E6FLCQKiBP3q1DCfY",
  authDomain: "computer-science-platform.firebaseapp.com",
  projectId: "computer-science-platform",
  storageBucket: "computer-science-platform.firebasestorage.app",
  messagingSenderId: "990895587894",
  appId: "1:990895587894:web:9cf88dc09aea65f2af0e97",
  measurementId: "G-91JNWXQHN1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);