// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAQDF5RRmqx3hN8v1D91KpOxM12DtQnzyk",
  authDomain: "ubuntuplug.firebaseapp.com",
  projectId: "ubuntuplug",
  storageBucket: "ubuntuplug.firebasestorage.app",
  messagingSenderId: "887406432080",
  appId: "1:887406432080:web:108e0de9c61d13f418a655",
  measurementId: "G-2J53SZ2K0N"
};


// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Get references to the database
const database = firebase.database();
const auth = firebase.auth();

// DOM elements
const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');
const loginEmail = document.getElementById('login-email');
const loginRole = document.getElementById('login-role');
const signupEmail = document.getElementById('signup-email');
const signupRole = document.getElementById('signup-role');

// Handle signup
signupForm.addEventListener('submit', function(e) {
  e.preventDefault();
  
  const fullName = signupForm.querySelector('input[type="text"]').value;
  const email = signupEmail.value;
  const password = signupForm.querySelector('input[type="password"]').value;
  const role = signupRole.value;
  
  if (!fullName || !email || !password || !role) {
    alert('Please fill all required fields');
    return;
  }
  
  // Create user with email and password
  auth.createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      // Get user ID from authentication
      const userId = userCredential.user.uid;
      const timestamp = new Date().toISOString();
      
      // Create user data object
      const userData = {
        fullName: fullName,
        email: email,
        role: role,
        createdAt: timestamp,
        lastLogin: timestamp,
        profileComplete: false
      };
      
      // Store user data in the appropriate database based on role
      if (role === 'user') {
        // Add to userRegistration
        database.ref('userRegistration/' + userId).set({
          ...userData,
          skills: [],
          education: [],
          experience: [],
          appliedJobs: {}
        })
        .then(() => {
          window.location.href = 'opportunity.html';
        })
        .catch((error) => {
          console.error("Error writing user data: ", error);
          alert("Registration failed. Please try again.");
        });
      } else if (role === 'recruiter') {
        // Add to employerRegistration
        database.ref('employerRegistration/' + userId).set({
          ...userData,
          companyName: "", // These can be filled in later by the user
          contactPerson: fullName,
          companySize: "",
          industry: "",
          location: "",
          description: "",
          website: "",
          postedJobs: {}
        })
        .then(() => {
          window.location.href = 'recruiter.html';
        })
        .catch((error) => {
          console.error("Error writing employer data: ", error);
          alert("Registration failed. Please try again.");
        });
      }
    })
    .catch((error) => {
      console.error("Auth error: ", error);
      alert(error.message);
    });
});

// Handle login
loginForm.addEventListener('submit', function(e) {
  e.preventDefault();
  
  const email = loginEmail.value;
  const password = loginForm.querySelector('input[type="password"]').value;
  const role = loginRole.value;
  
  if (!email || !password || !role) {
    alert('Please fill all required fields');
    return;
  }
  
  // Sign in with email and password
  auth.signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      const userId = userCredential.user.uid;
      const timestamp = new Date().toISOString();
      
      // Check if user exists in the correct database based on selected role
      if (role === 'user') {
        database.ref('userRegistration/' + userId).once('value')
          .then((snapshot) => {
            if (snapshot.exists()) {
              // Update last login time
              database.ref('userRegistration/' + userId + '/lastLogin').set(timestamp);
              window.location.href = 'opportunity.html';
            } else {
              alert("No user record found or incorrect role selected.");
              auth.signOut();
            }
          });
      } else if (role === 'recruiter') {
        database.ref('employerRegistration/' + userId).once('value')
          .then((snapshot) => {
            if (snapshot.exists()) {
              // Update last login time
              database.ref('employerRegistration/' + userId + '/lastLogin').set(timestamp);
              window.location.href = 'recruiter.html';
            } else {
              alert("No employer record found or incorrect role selected.");
              auth.signOut();
            }
          });
      }
    })
    .catch((error) => {
      console.error("Login error: ", error);
      alert(error.message);
    });
});

// Password reset functionality
document.querySelector('a[href="#"]').addEventListener('click', function(e) {
  e.preventDefault();
  const email = prompt("Enter your email to reset password:");
  
  if (email) {
    auth.sendPasswordResetEmail(email)
      .then(() => {
        alert("Password reset email sent. Check your inbox.");
      })
      .catch((error) => {
        console.error("Password reset error: ", error);
        alert(error.message);
      });
  }
});