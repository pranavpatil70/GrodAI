// // Import the functions you need from the SDKs you need
// import { initializeApp } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-app.js";
// import { getAuth, signInWithEmailAndPassword,GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-auth.js";

// // Your web app's Firebase configuration
// const firebaseConfig = {
//   apiKey: "AIzaSyDV5HH28CrTr2uCWbIT08fhPxHHzg0ard8",
//   authDomain: "signup-api-f104b.firebaseapp.com",
//   projectId: "signup-api-f104b",
//   storageBucket: "signup-api-f104b.appspot.com",
//   messagingSenderId: "665757733610",
//   appId: "1:665757733610:web:d86ce29ddf927f35283d93"
//  };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const auth = getAuth(app);
// auth.languageCode = 'en';
// const provider = new GoogleAuthProvider();

// // Get form elements
// const email = document.getElementById("email");
// const password = document.getElementById("password");
// const submit = document.getElementById("login");
// const googleLogin = document.getElementById("google-button");
// googleLogin.addEventListener("click", function(){
//   signInWithPopup(auth, provider)
//   .then((result) => {
//     // This gives you a Google Access Token. You can use it to access the Google API.
//     const credential = GoogleAuthProvider.credentialFromResult(result);
//     const user = result.user;
//     console.log(user);
//     window.location.href = "index.html"

//   }).catch((error) => {
//     // Handle Errors here.
//     const errorCode = error.code;
//     const errorMessage = error.message;
//     // The email of the user's account used.
//     // ...
//   });
// })

// // Handle form submission
// submit.addEventListener("click", function (event) {
//  event.preventDefault();

//  // Sign in user with email and password
//  signInWithEmailAndPassword(auth, email.value, password.value)
//     .then((userCredential) => {
//       // Signed in 
//       const user = userCredential.user;
//       alert("Logged in successfully!");

//       window.location.href = "index.html";
//       // You can redirect the user or perform other actions here
//     })
//     .catch((error) => {
//       const errorCode = error.code;
//       const errorMessage = error.message;
//       alert(errorMessage);
//     });
// });

// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, sendEmailVerification } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-auth.js";

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

// Get form elements
const email = document.getElementById("email");
const password = document.getElementById("password");
const submit = document.getElementById("login");
const googleLogin = document.getElementById("google-button");

googleLogin.addEventListener("click", function() {
  signInWithPopup(auth, provider)
    .then((result) => {
      // This gives you a Google Access Token. You can use it to access the Google API.
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const user = result.user;
      console.log(user);
      window.location.href = "/index"
    })
    .catch((error) => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      // The email of the user's account used.
      // ...
    });
});

// Handle form submission
submit.addEventListener("click", function(event) {
  event.preventDefault();

  // Sign in user with email and password
  signInWithEmailAndPassword(auth, email.value, password.value)
    .then((userCredential) => {
      const user = userCredential.user;

      // Check if the user's email is verified
      if (user.emailVerified) {
        // Email is verified, allow the user to log in
        alert("Logged in successfully!");
        window.location.href = "/index";
      } else {
        // Email is not verified, send the verification link again
        sendEmailVerification(user)
          .then(() => {
            alert("Email verification link sent! Please check your inbox and verify your email before logging in.");
          })
          .catch((error) => {
            const errorMessage = error.message;
            alert(errorMessage);
          });
      }
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      alert(errorMessage);
    });
});