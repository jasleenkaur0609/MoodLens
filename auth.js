// IMPORTS
import { auth, db } from "./firebase-config.js";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";

import {
  doc,
  setDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

const signupBtn = document.getElementById("signupBtn");
const googleBtn = document.getElementById("googleSignup");

// ------------------ EMAIL SIGNUP ------------------
signupBtn.addEventListener("click", async (e) => {
  e.preventDefault();

  const fullName = document.getElementById("fullName").value.trim();
  const email = document.getElementById("signupEmail").value.trim();
  const password = document.getElementById("signupPassword").value.trim();
  const confirmPassword = document.getElementById("confirmPassword").value.trim();

  if (password !== confirmPassword) {
    alert("Passwords do not match!");
    return;
  }

  try {
    // CREATE AUTH USER
    const userCred = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCred.user;

    // STORE USER IN FIRESTORE
    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      fullName: fullName,
      email: email,
      createdAt: serverTimestamp()
    });

    alert("Signup Successful!");
    window.location.href = "mood.html";

  } catch (error) {
    console.error("Signup Error:", error);
    alert(error.message);
  }
});

// ------------------ GOOGLE SIGNUP ------------------
googleBtn.addEventListener("click", async () => {
  try {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      fullName: user.displayName,
      email: user.email,
      createdAt: serverTimestamp()
    });

    alert("Google Signup Successful!");
    window.location.href = "mood.html";

  } catch (error) {
    console.error(error);
    alert(error.message);
  }
});
