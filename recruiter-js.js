

import { db } from './firebase.js';
import { collection, addDoc, doc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-auth.js";

const auth = getAuth();

document.addEventListener('DOMContentLoaded', function() {
  console.log("Document loaded");
  
  const jobPostForm = document.getElementById('recruiter-form');
  console.log("Job post form:", jobPostForm);
  
  if (!jobPostForm) {
    console.error("Job post form not found");
    return;
  }
  
  let currentUser = null;
  
  // Check if user is logged in
  onAuthStateChanged(auth, (user) => {
    if (user) {
      currentUser = user;
      console.log("User is logged in:", user.uid);
    } else {
      console.log("No user is logged in");
      // Handle not logged in state (redirect to login page or show message)
    }
  });
  
  // Handle job posting form submission
  jobPostForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    if (!currentUser) {
      alert("You must be logged in to post a job");
      return;
    }
    
    try {
      // Show loading state
      const submitButton = jobPostForm.querySelector('button[type="submit"]');
      const originalButtonText = submitButton.textContent;
      submitButton.disabled = true;
      submitButton.textContent = 'Posting...';
      
      // Get form data
      const title = document.getElementById('job-title').value;
      const companyName = document.getElementById('company-name').value;
      const description = document.getElementById('description').value;
      const location = document.getElementById('location').value;
      const type = document.getElementById('opportunity-type').value;
      const field = document.getElementById('field').value;
      const deadline = document.getElementById('closing-date').value;
      
      // Create job object
      const newJob = {
        title,
        companyName,
        description,
        location,
        type,
        field,
        deadline,
        postedAt: new Date().toISOString(),
        status: 'active'
      };
      
      // Add job to opportunities collection
      const opportunitiesRef = collection(db, 'opportunities');
      const docRef = await addDoc(opportunitiesRef, newJob);
      console.log("Job added to opportunities collection with ID:", docRef.id);
      
      // Get recruiter document reference
      const recruiterRef = doc(db, 'recruiterDB', currentUser.uid);
      const recruiterDoc = await getDoc(recruiterRef);
      
      if (!recruiterDoc.exists()) {
        throw new Error("Recruiter profile not found");
      }
      
      const recruiterData = recruiterDoc.data();
      console.log("Retrieved recruiter data:", recruiterData);
      
      // Create postedJobs object if it doesn't exist
      const postedJobs = recruiterData.postedJobs || {};
      
      // Add new job to postedJobs
      postedJobs[docRef.id] = newJob;
      
      console.log("Updated postedJobs object:", postedJobs);
      
      // Update recruiter document
      await updateDoc(recruiterRef, {
        postedJobs: postedJobs
      });
      
      console.log("Job successfully posted");
      
      // Reset form and button
      jobPostForm.reset();
      submitButton.disabled = false;
      submitButton.textContent = originalButtonText;
      
      // Show success message
      alert("Job successfully posted!");
      
    } catch (error) {
      console.error("Error posting job:", error);
      alert("Error posting job: " + error.message);
      
      // Reset button state
      const submitButton = jobPostForm.querySelector('button[type="submit"]');
      submitButton.disabled = false;
      submitButton.textContent = 'Post Job';
    }
  });
});