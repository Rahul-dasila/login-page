import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore, getDocs, collection, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

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

const auth = getAuth();
const db = getFirestore();

onAuthStateChanged(auth, (user) => {
  if (user) {
    const uid = user.uid;

    const docRef = doc(db, "users", uid);
    getDoc(docRef)
      .then((docSnap) => {
        if (docSnap.exists()) {
          const userdata = docSnap.data();
          document.getElementById('loggedUserFName').innerText = userdata.firstName;
          document.getElementById('loggedUserEmail').innerText = userdata.email;
          document.getElementById('loggedUserLName').innerText = userdata.lastName;
        } else {
          console.log("No document found");
        }
      })
      .catch((error) => {
        console.log("Error getting document:", error);
      });

    // Fetch and display all users
    const usersCollection = collection(db, "users");
    getDocs(usersCollection)
      .then((querySnapshot) => {
        const allUsersTbody = document.getElementById('all-users');
        querySnapshot.forEach((doc) => {
          const userData = doc.data();
          const userRow = document.createElement('tr');
          userRow.innerHTML = `
        <td>${userData.firstName}</td>
        <td>${userData.lastName}</td>
        <td>${userData.email}</td>
      `;
          allUsersTbody.appendChild(userRow);
        });
      })
      .catch((error) => {
        console.log("Error getting documents:", error);
      });

  } else {
    console.log("No user is signed in");
    window.location.href = "index.html";
  }
});



const logoutButton = document.getElementById('logout');

logoutButton.addEventListener('click', () => {
  localStorage.removeItem('loggedInUserId');
  signOut(auth)
    .then(() => {
      window.location.href = 'index.html';
    })
    .catch((error) => {
      console.error('Error Signing out:', error);
    })
})

document.getElementById('download-csv').addEventListener('click', () => {
  const usersCollection = collection(db, "users");
  getDocs(usersCollection)
    .then((querySnapshot) => {
      let csvContent = "data:text/csv;charset=utf-8,";
      csvContent += "First Name,Last Name,Email\n"; // Add CSV headers

      querySnapshot.forEach((doc) => {
        const userData = doc.data();
        const row = `${userData.firstName},${userData.lastName},${userData.email}\n`;
        csvContent += row;
      });

      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", "users.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    })
    .catch((error) => {
      console.log("Error getting documents:", error);
    });
});