import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAao3A5qY2CfJfSpjJq3VK8pXVgP0HAFCo",
  authDomain: "moodlens-188a5.firebaseapp.com",
  projectId: "moodlens-188a5",
  storageBucket: "moodlens-188a5.firebasestorage.app",
  messagingSenderId: "175504126348",
  appId: "1:175504126348:web:af68e5600665ff99c5a6a9",
  measurementId: "G-7H1HRGEM9T"
};

const app = initializeApp(firebaseConfig);

// EXPORT AUTH + DB
export const auth = getAuth(app);
export const db = getFirestore(app);
