// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDt2CXtgnGCBo0CFmrvnAYwgh1iBrmsi-A",
  authDomain: "ubuntu-plug.firebaseapp.com",
  projectId: "ubuntu-plug",
  storageBucket: "ubuntu-plug.firebasestorage.app",
  messagingSenderId: "666310061191",
  appId: "1:666310061191:web:89f8c03ba001cc69699c22",
  measurementId: "G-2XNGY72N58"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// --- Community Forum Logic ---

// Function to fetch and display community posts
async function loadPosts() {
    const postsListDiv = document.getElementById('posts-list');
    postsListDiv.innerHTML = 'Loading posts...'; // Show loading state

    try {
        // Get all documents from the 'community_posts' collection
        // You might want to order them, e.g., by creation date
        const querySnapshot = await db.collection("communityPosts")
                                      .orderBy("createdAt", "desc") // Assuming you add a 'createdAt' field
                                      .get();

        postsListDiv.innerHTML = ''; // Clear loading state

        if (querySnapshot.empty) {
            postsListDiv.innerHTML = '<p>No posts yet. Be the first to share something!</p>';
        } else {
            querySnapshot.forEach((doc) => {
                // doc.data() is never undefined for query doc snapshots
                console.log(doc.id, " => ", doc.data());

                // Create HTML elements to display each post
                const postData = doc.data();
                const postElement = document.createElement('div');
                postElement.classList.add('post'); // Add a class for styling

                // Basic structure: Title and Content
                postElement.innerHTML = `
                    <h3>${postData.title}</h3>
                    <p>${postData.content}</p>
                    <small>Posted by ${postData.author || 'Anonymous'}</small>
                    <hr>
                `;

                postsListDiv.appendChild(postElement);
            });
        }

    } catch (error) {
        console.error("Error fetching posts: ", error);
        postsListDiv.innerHTML = '<p>Error loading posts. Please try again later.</p>';
    }
}

// Call loadPosts when the page loads
window.addEventListener('load', loadPosts);

// --- Contact Form Logic ---

// Get the contact form element
const contactForm = document.getElementById('contact-form');

// Add an event listener for form submission
contactForm.addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevent the default form submission (page reload)

    // Get the input values
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;

    // Basic validation (optional, you can add more)
    if (!name || !email || !message) {
        alert('Please fill in all fields.');
        return;
    }

    // Create an object with the form data
    const formData = {
        name: name,
        email: email,
        message: message,
        timestamp: firebase.firestore.FieldValue.serverTimestamp() // Add a server-generated timestamp
        // You might add a 'status' field here, like 'pending' for moderation
    };

    try {
        // Add the document to the 'contact_submissions' collection in Firestore
        const docRef = await db.collection("contactMessages").add(formData);
        console.log("Contact submission written with ID: ", docRef.id);

        alert('Your message has been sent!');
        contactForm.reset(); // Clear the form after successful submission

    } catch (error) {
        console.error("Error adding document: ", error);
        alert('There was an error sending your message. Please try again.');
    }
});
