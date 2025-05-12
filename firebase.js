
// firebase.js - Firebase initialization and shared functions

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, query, where, orderBy, limit, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAQDF5RRmqx3hN8v1D91KpOxM12DtQnzyk",
  authDomain: "ubuntuplug.firebaseapp.com",
  projectId: "ubuntuplug",
  storageBucket: "ubuntuplug.appspot.com",
  messagingSenderId: "887406432080",
  appId: "1:887406432080:web:108e0de9c61d13f418a655",
  measurementId: "G-2J53SZ2K0N"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const db = getFirestore(app);

// Reference to opportunities collection
const opportunitiesRef = collection(db, "opportunities");

export { db, opportunitiesRef, addDoc, getDocs, query, where, orderBy, limit, serverTimestamp };

