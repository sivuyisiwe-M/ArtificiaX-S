


// // opportunity-js.js working

// import { getDocs, query, where } from 'https://www.gstatic.com/firebasejs/10.5.0/firebase-firestore.js';
// import { opportunitiesRef } from './firebase.js';

// document.addEventListener('DOMContentLoaded', function () {
//     const typeFilter = document.getElementById('opportunity-type');
//     const provinceFilter = document.getElementById('province');
//     const fieldFilter = document.getElementById('field');
//     const grid = document.querySelector('.opportunities-grid');

//     typeFilter.addEventListener('change', loadAndFilterOpportunities);
//     provinceFilter.addEventListener('change', loadAndFilterOpportunities);
//     fieldFilter.addEventListener('change', loadAndFilterOpportunities);

//     // Load on page load
//     loadAndFilterOpportunities();

//     async function loadAndFilterOpportunities() {
//         const selectedType = typeFilter.value;
//         const selectedProvince = provinceFilter.value;
//         const selectedField = fieldFilter.value;

//         try {
//             const snapshot = await getDocs(opportunitiesRef);
//             let opportunities = [];

//             snapshot.forEach(doc => {
//                 const data = doc.data();
//                 if (data.status === 'active') {
//                     opportunities.push({ id: doc.id, ...data });
//                 }
//             });

//             // Filter in JS
//             opportunities = opportunities.filter(op => {
//                 const matchesType = selectedType === 'all' || op.type?.toLowerCase() === selectedType;
//                 const matchesProvince = selectedProvince === 'all' || op.location?.toLowerCase().includes(selectedProvince);
//                 const matchesField = selectedField === 'all' || op.field?.toLowerCase() === selectedField;

//                 return matchesType && matchesProvince && matchesField;
//             });

//             displayOpportunities(opportunities);

//         } catch (error) {
//             console.error("Error loading opportunities:", error);
//         }
//     }

//     function displayOpportunities(opportunities) {
//         grid.innerHTML = '';

//         if (opportunities.length === 0) {
//             grid.innerHTML = '<p>No opportunities found for selected filters.</p>';
//             return;
//         }

//         opportunities.forEach(op => {
//             const card = document.createElement('div');
//             card.className = 'opportunity-card';
//             card.innerHTML = `
//                 <h4>${op.title}</h4>
//                 <p><strong>Company:</strong> ${op.company}</p>
//                 <p><strong>Location:</strong> ${op.location}</p>
//                 <p><strong>Type:</strong> ${op.type}</p>
//                 <p><strong>Field:</strong> ${op.field}</p>
//                 <p><strong>Closing:</strong> ${new Date(op.closingDate.seconds * 1000).toLocaleDateString()}</p>
//                 <p>${op.description}</p>
//             `;
//             grid.appendChild(card);
//         });
//     }
// });










// opportunity.js - Display opportunities from the database
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-firestore.js";

// Your web app's Firebase configuration - Matches your firebase.js
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

// Initialize Firebase directly in this file to avoid import issues
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// opportunity.js - Complete implementation for displaying opportunities including recruiter jobs

document.addEventListener('DOMContentLoaded', function() {
  // Initialize Firebase directly - no imports to avoid module issues
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

  // Initialize Firebase using the global namespace approach
  firebase.initializeApp(firebaseConfig);
  const db = firebase.firestore();
  
  console.log("Firebase initialized in opportunity.js");
  
  // Get reference to the opportunities grid
  const opportunitiesGrid = document.querySelector('.opportunities-grid');
  const opportunityTypeFilter = document.getElementById('opportunity-type');
  const provinceFilter = document.getElementById('province');
  const fieldFilter = document.getElementById('field');
  const searchInput = document.getElementById('search-input');
  
  // Function to load and display opportunities
  async function loadOpportunities() {
    try {
      // Clear existing opportunities
      if (opportunitiesGrid) {
        opportunitiesGrid.innerHTML = '<p>Loading opportunities...</p>';
      } else {
        console.error("Opportunities grid not found in the document");
        return;
      }
      
      // Get filter values
      const typeFilter = opportunityTypeFilter ? opportunityTypeFilter.value : 'all';
      const provinceFilterValue = provinceFilter ? provinceFilter.value : 'all';
      const fieldFilterValue = fieldFilter ? fieldFilter.value : 'all';
      const searchQuery = searchInput ? searchInput.value.toLowerCase() : '';
      
      console.log("Loading opportunities with filters:", {
        type: typeFilter,
        province: provinceFilterValue,
        field: fieldFilterValue,
        search: searchQuery
      });
      
      let allOpportunities = [];
      
      // 1. Load opportunities from the opportunities collection
      console.log("Fetching from opportunities collection...");
      try {
        const opportunitiesSnapshot = await db.collection('opportunities').get();
        console.log(`Found ${opportunitiesSnapshot.size} items in opportunities collection`);
        
        opportunitiesSnapshot.forEach(doc => {
          const data = doc.data();
          allOpportunities.push({
            id: doc.id,
            ...data
          });
          console.log(`Added opportunity: ${doc.id}`);
        });
      } catch (error) {
        console.error("Error fetching opportunities:", error);
      }
      
      // 2. Load jobs from recruiterDB collection
      console.log("Fetching from recruiterDB collection...");
      try {
        const recruitersSnapshot = await db.collection('recruiterDB').get();
        console.log(`Found ${recruitersSnapshot.size} recruiters`);
        
        recruitersSnapshot.forEach(recruiterDoc => {
          const recruiterData = recruiterDoc.data();
          console.log(`Checking recruiter ${recruiterDoc.id} for jobs...`);
          
          // Check if recruiter has posted jobs
          if (recruiterData.postedJobs && Object.keys(recruiterData.postedJobs).length > 0) {
            console.log(`Recruiter ${recruiterDoc.id} has ${Object.keys(recruiterData.postedJobs).length} jobs`);
            
            // Process each job
            Object.entries(recruiterData.postedJobs).forEach(([jobId, jobData]) => {
              const job = {
                id: jobId,
                ...jobData,
                // Add recruiter information
                recruiterID: recruiterDoc.id,
                companyName: recruiterData.companyName || recruiterData.company || "Unknown Company",
                // If job type is not specified, default to 'job'
                type: jobData.type || 'job'
              };
              
              allOpportunities.push(job);
              console.log(`Added job ${jobId} from recruiter ${recruiterDoc.id}`);
            });
          } else {
            console.log(`Recruiter ${recruiterDoc.id} has no jobs or postedJobs is missing`);
          }
        });
      } catch (error) {
        console.error("Error fetching recruiter jobs:", error);
      }
      
      console.log(`Total opportunities before filtering: ${allOpportunities.length}`);
      
      // Apply filters
      let filteredOpportunities = allOpportunities;
      
      // Filter by type
      if (typeFilter && typeFilter !== 'all') {
        filteredOpportunities = filteredOpportunities.filter(opp => {
          const oppType = (opp.type || '').toLowerCase();
          return oppType === typeFilter.toLowerCase();
        });
      }
      
      // Filter by province/location
      if (provinceFilterValue && provinceFilterValue !== 'all') {
        filteredOpportunities = filteredOpportunities.filter(opp => {
          const oppProvince = (opp.province || '').toLowerCase();
          const oppLocation = (opp.location || '').toLowerCase();
          return oppProvince === provinceFilterValue.toLowerCase() || 
                 oppLocation.includes(provinceFilterValue.toLowerCase());
        });
      }
      
      // Filter by field/industry
      if (fieldFilterValue && fieldFilterValue !== 'all') {
        filteredOpportunities = filteredOpportunities.filter(opp => {
          const oppField = (opp.field || '').toLowerCase();
          const oppIndustry = (opp.industry || '').toLowerCase();
          return oppField === fieldFilterValue.toLowerCase() || 
                 oppIndustry === fieldFilterValue.toLowerCase();
        });
      }
      
      // Filter by search query
      if (searchQuery) {
        filteredOpportunities = filteredOpportunities.filter(opp => {
          const title = (opp.title || '').toLowerCase();
          const desc = (opp.description || '').toLowerCase();
          const company = (opp.company || opp.companyName || '').toLowerCase();
          return title.includes(searchQuery) || 
                 desc.includes(searchQuery) || 
                 company.includes(searchQuery);
        });
      }
      
      console.log(`Filtered opportunities: ${filteredOpportunities.length}`);
      
      // Clear loading message
      opportunitiesGrid.innerHTML = '';
      
      // Display filtered opportunities
      if (filteredOpportunities.length === 0) {
        opportunitiesGrid.innerHTML = '<p class="no-results">No opportunities found. Try adjusting your filters.</p>';
      } else {
        filteredOpportunities.forEach(opp => {
          displayOpportunity(opp);
        });
      }
    } catch (error) {
      console.error("Error in loadOpportunities:", error);
      if (opportunitiesGrid) {
        opportunitiesGrid.innerHTML = '<p class="error">Error loading opportunities. Please try again later.</p>';
      }
    }
  }
  
  // Function to display a single opportunity
  function displayOpportunity(opp) {
    try {
      const opportunityElement = document.createElement('div');
      opportunityElement.className = 'opportunity-card';
      
      // Create category badge
      const category = opp.type || 'job';
      const badgeClass = getBadgeClass(category);
      
      // Format deadline if exists
      const deadlineDisplay = opp.deadline ? `<div class="deadline">Deadline: ${formatDate(opp.deadline)}</div>` : '';
      
      // Display company name from either field
      const companyName = opp.company || opp.companyName || 'Company not specified';
      
      opportunityElement.innerHTML = `
        <div class="opportunity-header">
          <span class="badge ${badgeClass}">${capitalizeFirstLetter(category)}</span>
          <h3>${opp.title || 'Untitled Opportunity'}</h3>
        </div>
        <div class="opportunity-details">
          <div class="company">${companyName}</div>
          <div class="location">${opp.location || opp.province || 'Location not specified'}</div>
          ${deadlineDisplay}
        </div>
        <div class="opportunity-description">
          ${opp.description ? truncateText(opp.description, 100) : 'No description provided.'}
        </div>
        <a href="#" class="btn btn-secondary view-details" data-id="${opp.id}">View Details</a>
      `;
      
      // Add event listener to the view details button
      const viewDetailsBtn = opportunityElement.querySelector('.view-details');
      viewDetailsBtn.addEventListener('click', function(e) {
        e.preventDefault();
        showOpportunityDetails(opp);
      });
      
      opportunitiesGrid.appendChild(opportunityElement);
    } catch (error) {
      console.error("Error displaying opportunity:", error, opp);
    }
  }
  
  // Helper functions
  function capitalizeFirstLetter(string) {
    if (!string) return '';
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
  
  function truncateText(text, maxLength) {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  }
  
  function formatDate(dateStr) {
    if (!dateStr) return '';
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString();
    } catch (e) {
      console.error("Error formatting date:", e);
      return dateStr; // Return original string if can't format
    }
  }

  function getBadgeClass(category) {
    if (!category) return 'badge-default';
    const categoryLower = category.toLowerCase();
    switch (categoryLower) {
      case 'internship': return 'badge-primary';
      case 'bursary': return 'badge-success';
      case 'scholarship': return 'badge-info';
      case 'learnership': return 'badge-warning';
      case 'job': return 'badge-secondary';
      default: return 'badge-default';
    }
  }
  
  function showOpportunityDetails(opp) {
    // Log the opportunity being viewed
    console.log('Viewing details for:', opp);
    
    // Example: Display in alert (replace with modal or redirect to details page)
    const details = `
      Title: ${opp.title || 'No title'}
      Company: ${opp.company || opp.companyName || 'No company'}
      Location: ${opp.location || opp.province || 'Location not specified'}
      Type: ${opp.type || 'Not specified'}
      Description: ${opp.description || 'No description'}
    `;
    
    alert(details);
    
    // You would typically implement a modal or redirect to a details page here
  }
  
  // Set up event listeners for filters
  if (opportunityTypeFilter) {
    opportunityTypeFilter.addEventListener('change', loadOpportunities);
  }
  
  if (provinceFilter) {
    provinceFilter.addEventListener('change', loadOpportunities);
  }
  
  if (fieldFilter) {
    fieldFilter.addEventListener('change', loadOpportunities);
  }
  
  if (searchInput) {
    searchInput.addEventListener('input', debounce(loadOpportunities, 300));
  }
  
  // Debounce function
  function debounce(func, delay) {
    let debounceTimer;
    return function() {
      const context = this;
      const args = arguments;
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => func.apply(context, args), delay);
    };
  }
  
  // Add a button to manually refresh opportunities if needed
  const viewAllBtn = document.querySelector('.view-all-btn');
  if (viewAllBtn) {
    viewAllBtn.addEventListener('click', function(e) {
      e.preventDefault();
      loadOpportunities();
    });
  }
  
  // Load opportunities on page load
  console.log("Initial load of opportunities");
  loadOpportunities();
});