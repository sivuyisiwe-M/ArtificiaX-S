
// import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-app.js";
// import { getFirestore } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-firestore.js";


// // Your web app's Firebase configuration
// const firebaseConfig = {
//   apiKey: "AIzaSyAQDF5RRmqx3hN8v1D91KpOxM12DtQnzyk",
//   authDomain: "ubuntuplug.firebaseapp.com",
//   databaseURL: "https://ubuntuplug-default-rtdb.firebaseio.com",
//   projectId: "ubuntuplug",
//   storageBucket: "ubuntuplug.firebasestorage.app",
//   messagingSenderId: "887406432080",
//   appId: "1:887406432080:web:108e0de9c61d13f418a655",
//   measurementId: "G-2J53SZ2K0N"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const db = getFirestore(app);

// export { db };

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAQDF5RRmqx3hN8v1D91KpOxM12DtQnzyk",
  authDomain: "ubuntuplug.firebaseapp.com",
  databaseURL: "https://ubuntuplug-default-rtdb.firebaseio.com",
  projectId: "ubuntuplug",
  storageBucket: "ubuntuplug.firebasestorage.app",
  messagingSenderId: "887406432080",
  appId: "1:887406432080:web:108e0de9c61d13f418a655",
  measurementId: "G-2J53SZ2K0N"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db, app };