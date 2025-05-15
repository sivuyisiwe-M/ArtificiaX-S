


import { opportunitiesRef, addDoc, serverTimestamp } from './source/firebase.js';
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-auth.js";

document.addEventListener('DOMContentLoaded', () => {
    const recruiterForm = document.getElementById('recruiter-form');
    const auth = getAuth();

    onAuthStateChanged(auth, (user) => {
        if (user && recruiterForm) {
            recruiterForm.addEventListener('submit', submitOpportunity);
        } else {
            window.location.href = '/login.html';
        }
    });

    async function submitOpportunity(e) {
        e.preventDefault();

        const title = document.getElementById('job-title').value;
        const company = document.getElementById('company-name').value;
        const location = document.getElementById('location').value;
        const field = document.getElementById('field').value;
        const type = document.getElementById('opportunity-type').value;
        const closingDate = document.getElementById('closing-date').value;
        const description = document.getElementById('description').value;

        if (!title || !company || !location || !type || !closingDate || !description) {
            alert("Please fill out all fields.");
            return;
        }

        try {
            await addDoc(opportunitiesRef, {
                title,
                company,
                location,
                type,
                field,
                closingDate,
                description,
                createdAt: serverTimestamp(),
                status: "active"
            });

            alert("Opportunity successfully posted!");
            recruiterForm.reset();
        } catch (err) {
            console.error("Error adding document:", err);
            alert("Failed to post opportunity.");
        }
    }
});
