
// firebase.js - Firebase initialization and shared functions

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, query, where, orderBy, limit, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-firestore.js";



// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBrrU0NUzG1mSEPgtJgBzZSNcki-kowLHI",
  authDomain: "ubuntusa-3b893.firebaseapp.com",
  projectId: "ubuntusa-3b893",
  storageBucket: "ubuntusa-3b893.firebasestorage.app",
  messagingSenderId: "11896582174",
  appId: "1:11896582174:web:86857a82e946ad4d07be0f",
  measurementId: "G-JCFX6E7ZR4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const db = getFirestore(app);

// Reference to opportunities collection
const opportunitiesRef = collection(db, "opportunities");

export { db, opportunitiesRef, addDoc, getDocs, query, where, orderBy, limit, serverTimestamp };

