import { initializeApp } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-app.js";
import { getAuth, signOut } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-auth.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDV5HH28CrTr2uCWbIT08fhPxHHzg0ard8",
  authDomain: "signup-api-f104b.firebaseapp.com",
  projectId: "signup-api-f104b",
  storageBucket: "signup-api-f104b.appspot.com",
  messagingSenderId: "665757733610",
  appId: "1:665757733610:web:d86ce29ddf927f35283d93"
 };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
auth.languageCode = 'en';

// Handle logout
const logoutButton = document.getElementById("logout-button");
logoutButton.addEventListener("click", function () {
    signOut(auth)
        .then(() => {
            // Sign-out successful
            console.log("User signed out successfully");
            window.location.href = "/"; // Redirect to home page
        })
        .catch((error) => {
            // An error happened
            console.error(error);
        });
});