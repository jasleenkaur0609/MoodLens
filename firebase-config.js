import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-domain",
  projectId: "your-project-ID",
  storageBucket: "your-storage-bucket",
  messagingSenderId: "your-sender-ID",
  appId: "your-app-id",
  measurementId: "your-ID"
};

const app = initializeApp(firebaseConfig);

// EXPORT AUTH + DB
export const auth = getAuth(app);
export const db = getFirestore(app);
