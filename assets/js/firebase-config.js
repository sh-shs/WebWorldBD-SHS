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
  updateProfile,
  updatePassword,
  deleteUser,
  EmailAuthProvider,
  reauthenticateWithCredential
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  getDocs,
  serverTimestamp,
  arrayUnion
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAwb8imMQ_WtL7Lp56wo8P8EHBlS4OxtMI",
  authDomain: "web-worldbd.firebaseapp.com",
  projectId: "web-worldbd",
  storageBucket: "web-worldbd.firebasestorage.app",
  messagingSenderId: "255296358027",
  appId: "1:255296358027:web:b2bf1baf074f62aa06768e",
  measurementId: "G-KRHD6HY3Z6"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Expose Firebase Auth & Firestore services globally for application scripts
window.FirebaseModule = {
  app,
  auth,
  db,
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  onAuthStateChanged,
  signOut,
  updateProfile,
  updatePassword,
  deleteUser,
  EmailAuthProvider,
  reauthenticateWithCredential,
  // Firestore exports
  doc,
  getDoc,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  getDocs,
  serverTimestamp,
  arrayUnion
};
