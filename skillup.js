
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCeeRzjQMaTEV0xg40jNgQvCYqxaB1iNEA",
  authDomain: "skill-up-5219f.firebaseapp.com",
  projectId: "skill-up-5219f",
  storageBucket: "skill-up-5219f.firebasestorage.app",
  messagingSenderId: "473313118649",
  appId: "1:473313118649:web:969cc581db1ac5a8cb0e68",
  measurementId: "G-LZRGDGRK7S"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);






document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("course-container");

  db.collection("courses").get().then(snapshot => {
    snapshot.forEach(doc => {
      const data = doc.data();
      const tile = document.createElement("div");
      tile.className = "Computer Literacy";
      tile.className = "Digital Marketing";
      tile.className = "Web Dev";
      tile.className = "Data Analysis";
      tile.className = "Cybersecurity";
      tile.className = "Cloud Computing";
      tile.className = "IT Support";
      tile.className = "Coding(Python, Java)";
      tile.className = "AI, ML";
      tile.className = "Business Management";
      tile.className = "Sales & Customer Service";
      tile.className = "Entrepreneaurial Thinking";
      tile.className = "Business Planning";
      tile.className = "Djying";
      tile.className = "Innovation & Design Thinking";
      tile.className = "Plumbing";
      tile.className = "Hairdressing & Beauty Therapy";
      tile.className = "Tiling & Painting";
      tile.className = "Sewing & Fashion Design";
      tile.className = "Professional Email & ";
      tile.innerHTML = `
        <h3>${data.name}</h3>
        <p><strong>Level:</strong> ${data.level}</p>
        <p><strong>Category:</strong> ${data.category}</p>
        <a href="${data.link}" target="_blank">Go to Course</a>
      `;
      container.appendChild(tile);
    });
  }).catch(error => {
    container.innerHTML = "<p>Error loading courses.</p>";
    console.error(error);
  });
});


