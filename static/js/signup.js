import { initializeApp } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-auth.js";
import { getDatabase, ref, set, onValue } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-database.js";

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
const provider = new GoogleAuthProvider();

const database = getDatabase(app, "https://signup-api-f104b-default-rtdb.firebaseio.com/"); // Initialize Realtime Database

// Get form elements
const name = document.getElementById('Name');
const email = document.getElementById('email');
const password = document.getElementById("password");
const confirm = document.getElementById('confirm_password');
const submit = document.getElementById('signup');
const googleLogin = document.getElementById("google-button");
googleLogin.addEventListener("click", function(){
  signInWithPopup(auth, provider)
  .then((result) => {
    // This gives you a Google Access Token. You can use it to access the Google API.
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const user = result.user;
    console.log(user);
    window.location.href = "/login";

  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    // ...
  });

})

// Handle form submission
submit.addEventListener("click", function (event) {
 event.preventDefault();

 // Validate password and confirm password
 if (password.value !== confirm.value) {
     alert("Passwords do not match.");
     return;
 }

 // Create user with email and password
 createUserWithEmailAndPassword(auth, email.value, password.value)
        .then((userCredential) => {
            // Send email verification
            sendEmailVerification(userCredential.user)
                .then(() => {
                    alert("Email verification link sent! Please check your inbox.");
                });

            // Signed up
            const user = userCredential.user;
            alert("Account created successfully!");

            // Store user data in Realtime Database
            const userRef = ref(database, 'users/' + user.uid);
            set(userRef, {
                name: name.value,
                email: email.value,
                password: password.value
            });

            window.location.href = "/login"; // Redirect to login page
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            alert(errorMessage);
        });
});