import { initializeApp } from "https://www.gstatic.com/firebasejs/9.24.0/firebase-app.js";
import { getAuth, onAuthStateChanged, getIdToken } from "https://www.gstatic.com/firebasejs/9.24.0/firebase-auth.js";

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
    localStorage.setItem("idToken", token); // Optional

    fetch("http://localhost:3000/api/category/tree", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(res => res.json())
    .then(data => {
      console.log("✅ Category Tree:", data);
      displayCategoryTree(data.data); // See below
    })
    .catch(err => {
      console.error("❌ Auth failed:", err);
    });

  } else {
    console.log("🔒 No user signed in");
    // Optionally redirect to login
    window.location.href = "/login.html";
  }
});

function renderTree(categories, container = document.getElementById('categoryTree')) {
  container.innerHTML = '';
  categories.forEach(cat => {
    const div = document.createElement('div');
    div.textContent = cat.name;
    if (cat.children?.length) {
      const childContainer = document.createElement('div');
      childContainer.style.marginLeft = '20px';
      renderTree(cat.children, childContainer);
      div.appendChild(childContainer);
    }
    container.appendChild(div);
  });

  function displayCategoryTree(categories) {
  const container = document.getElementById("categoryTree");
  container.innerHTML = "";

  categories.forEach(cat => {
    const div = document.createElement("div");
    div.textContent = cat.name;
    container.appendChild(div);
  });
}
}