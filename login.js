import { auth } from "./firebase-config.js";
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";

// EMAIL/PASSWORD LOGIN
document.getElementById("loginBtn").addEventListener("click", async () => {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!email || !password) {
    alert("Please enter email and password");
    return;
  }

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);

    alert("Login Successful! 🎉 Redirecting...");
    window.location.href = "mood.html";

  } catch (error) {
    alert("Login Failed: " + error.message);
  }
});

// GOOGLE LOGIN
document.getElementById("googleBtn").addEventListener("click", async () => {
  try {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);

    alert("Google Login Successful! 🎉");
    window.location.href = "mood.html";

  } catch (error) {
    alert("Google Login Error: " + error.message);
  }
});
