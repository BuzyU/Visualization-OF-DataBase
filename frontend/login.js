import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";


const firebaseConfig = {
  apiKey: "AIzaSyCFn-QYrb0UBL1jDJojC2oz6-Sotqf2ty8",
  authDomain: "dynamic-sql.firebaseapp.com",
  projectId: "dynamic-sql",
  storageBucket: "dynamic-sql.appspot.com",
  messagingSenderId: "665809851568",
  appId: "1:665809851568:web:e2e0ea802aec3f57185775",
  measurementId: "G-G9RYKYVPN1"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Google Login
function googleLogin() {
  const provider = new GoogleAuthProvider();
  signInWithPopup(auth, provider)
    .then(result => result.user.getIdToken())
    .then(idToken => {
      localStorage.setItem("idToken", idToken);
      window.location.href = "/frontend/dashboard.html";
    })
    .catch(err => {
      console.error("Google login failed:", err);
      alert("Login failed.");
    });
}

// ✅ Make available to inline onclick:
window.googleLogin = googleLogin;
