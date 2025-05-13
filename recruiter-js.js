

import { opportunitiesRef, addDoc, serverTimestamp } from './firebase.js';
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-auth.js";

document.addEventListener('DOMContentLoaded', function() {
    const recruiterForm = document.getElementById('recruiter-form');
    const auth = getAuth();

    onAuthStateChanged(auth, (user) => {
        if (user) {
            if (recruiterForm) {
                recruiterForm.addEventListener('submit', submitOpportunity);
            }
        } else {
            // User is not authenticated, redirect to login page
            window.location.href = '/login.html';
        }
    });

    // Handle form submission for new opportunities
    async function submitOpportunity(event) {
        event.preventDefault();

        // Get form values
        const jobTitle = document.getElementById('job-title').value;
        const companyName = document.getElementById('company-name').value;
        const location = document.getElementById('location').value;
        const opportunityType = document.getElementById('opportunity-type').value;
        const closingDate = document.getElementById('closing-date').value;
        const description = document.getElementById('description').value;

        // Basic validation
        if (!jobTitle || !companyName || !location || !opportunityType || !closingDate || !description) {
            alert("Please fill out all fields.");
            return;
        }

        try {
            // Add new opportunity to Firestore
            const newOpportunity = {
                title: jobTitle,
                company: companyName,
                location: location,
                type: opportunityType,
                closingDate: closingDate,
                description: description,
                createdAt: serverTimestamp(),
                status: 'active'
            };

            const docRef = await addDoc(opportunitiesRef, newOpportunity);
            console.log("Opportunity posted with ID: ", docRef.id);

            // Success message
            alert("Opportunity successfully posted!");
            recruiterForm.reset();

        } catch (error) {
            console.error("Error posting opportunity: ", error);
            alert("Error posting opportunity. Please try again.");
        }
    }
});