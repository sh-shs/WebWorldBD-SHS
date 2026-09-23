/* ==========================================================================
   WebWorldBD - Firebase Configuration & Initialization
   ========================================================================== */

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  onAuthStateChanged,
  signOut,
  updateProfile
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyCHSi0gYDulHe84PPNnSUNYbsNRTZjZMlc",
  authDomain: "movebox-9b766.firebaseapp.com",
  projectId: "movebox-9b766",
  storageBucket: "movebox-9b766.firebasestorage.app",
  messagingSenderId: "726875913332",
  appId: "1:726875913332:web:d1e191717fc8c9f4a36521",
  measurementId: "G-JDP02VP7HD"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Expose Firebase Auth services globally for application scripts
window.FirebaseModule = {
  app,
  auth,
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  onAuthStateChanged,
  signOut,
  updateProfile
};
