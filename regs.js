// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {getFirestore,setDoc,doc} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAScu7bniheHp8fZB8fFODg0UwGnW0VfcU",
  authDomain: "login-page-bd443.firebaseapp.com",
  projectId: "login-page-bd443",
  storageBucket: "login-page-bd443.appspot.com",
  messagingSenderId: "318481811551",
  appId: "1:318481811551:web:baf499ff0899f605dc73ea"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

//input


const submit = document.getElementById('Create-Account');
submit.addEventListener("click", function (event) {
  event.preventDefault()

  const email = document.getElementById('email').value;
  const password = document.getElementById('Pass').value;
  const firstName=document.getElementById('fName').value;
  const lastName=document.getElementById('lName').value;
  const db = getFirestore();
  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed up 
      const user = userCredential.user;
      const userData = {
        email:email,
        firstName: firstName,
        lastName:lastName
      };
      const docRef = doc(db,"users",user.uid);
      setDoc(docRef,userData)
      .then(()=>{
        window.location.href="index.html";
      })
      .catch((error)=>{
        console.error("error writing document",error);
      })
      
      // ...
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      alert(errorMessage)
      // ..
    });
})