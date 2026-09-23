/* ==========================================================================
   WebWorldBD - Firebase Configuration & Initialization
   ========================================================================== */

const firebaseConfig = {
  apiKey: "AIzaSyCHSi0gYDulHe84PPNnSUNYbsNRTZjZMlc",
  authDomain: "movebox-9b766.firebaseapp.com",
  projectId: "movebox-9b766",
  storageBucket: "movebox-9b766.firebasestorage.app",
  messagingSenderId: "726875913332",
  appId: "1:726875913332:web:d1e191717fc8c9f4a36521",
  measurementId: "G-JDP02VP7HD"
};

// Initialize Firebase App, Auth, and Firestore
if (typeof firebase !== 'undefined') {
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }
  window.auth = firebase.auth();
  window.db = firebase.firestore();
}
