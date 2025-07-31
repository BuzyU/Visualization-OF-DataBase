import { initializeApp } from "https://www.gstatic.com/firebasejs/9.24.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.24.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyCFn-QYrb0UBL1jDJojC2oz6-Sotqf2ty8",
  authDomain: "dynamic-sql.firebaseapp.com",
  projectId: "dynamic-sql",
  appId: "1:665809851568:web:e2e0ea802aec3f57185775",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

onAuthStateChanged(auth, async (user) => {
  if (user) {
    const token = await user.getIdToken();
    localStorage.setItem("idToken", token); // Optional for reuse

    fetch("https://dynamic-server.onrender.com/api/category/tree", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => {
        if (!res.ok) throw new Error("Unauthorized or server error");
        return res.json();
      })
      .then(data => {
        console.log("✅ Category Tree:", data);
        displayCategoryTree(data.data);
      })
      .catch(err => {
        console.error("❌ Auth or fetch failed:", err);
        alert("Failed to load category tree. Please try again.");
      });

  } else {
    console.log("🔒 No user signed in");
    window.location.href = "/login.html"; // Redirect to login
  }
});

// Recursive renderer
function renderTree(categories, container) {
  categories.forEach(cat => {
    const div = document.createElement("div");
    div.textContent = cat.name;
    container.appendChild(div);

    if (cat.children?.length) {
      const childContainer = document.createElement("div");
      childContainer.style.marginLeft = "20px";
      renderTree(cat.children, childContainer);
      container.appendChild(childContainer);
    }
  });
}

// Entrypoint to render category tree
function displayCategoryTree(categories) {
  const container = document.getElementById("categoryTree");
  container.innerHTML = "";
  renderTree(categories, container);
}
