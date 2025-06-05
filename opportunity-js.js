// import { db } from './firebase.js';
// import { collection, getDocs } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-firestore.js";

// // Get references to the opportunity grid and filters
// const opportunitiesGrid = document.querySelector('.opportunities-grid');
// const opportunityTypeFilter = document.getElementById('opportunity-type');
// const provinceFilter = document.getElementById('province');
// const fieldFilter = document.getElementById('field');
// const searchInput = document.getElementById('search-input');

// // Function to load and display opportunities
// async function loadOpportunities() {
//   try {
//     // Clear existing opportunities
//     opportunitiesGrid.innerHTML = '<p>Loading opportunities...</p>';

//     // Get filter values
//     const typeFilter = opportunityTypeFilter ? opportunityTypeFilter.value : 'all';
//     const provinceFilterValue = provinceFilter ? provinceFilter.value : 'all';
//     const fieldFilterValue = fieldFilter ? fieldFilter.value : 'all';
//     const searchQuery = searchInput ? searchInput.value.toLowerCase() : '';

//     let allOpportunities = [];

//     // Load opportunities from the opportunities collection
//     const opportunitiesRef = collection(db, "opportunities");
//     const opportunitiesSnapshot = await getDocs(opportunitiesRef);
//     opportunitiesSnapshot.forEach(doc => {
//       const data = doc.data();
//       allOpportunities.push({
//         id: doc.id,
//         ...data
//       });
//     });

//     console.log(`Loaded ${opportunitiesSnapshot.size} opportunities from opportunities collection`);

//     // Load jobs from recruiterDB collection
//     const recruitersRef = collection(db, "recruiterDB");
//     const recruitersSnapshot = await getDocs(recruitersRef);
//     let jobsFromRecruiters = 0;

//     recruitersSnapshot.forEach(recruiterDoc => {
//       const recruiterData = recruiterDoc.data();
//       if (recruiterData.postedJobs && Object.keys(recruiterData.postedJobs).length > 0) {
//         Object.entries(recruiterData.postedJobs).forEach(([jobId, jobData]) => {
//           const job = {
//             id: jobId,
//             ...jobData,
//             recruiterID: recruiterDoc.id,
//             companyName: recruiterData.companyName || recruiterData.company || jobData.companyName || jobData.company || "Unknown Company",
//             type: jobData.type || 'job'
//           };
//           allOpportunities.push(job);
//           jobsFromRecruiters++;
//         });
//       }
//     });

//     console.log(`Loaded ${jobsFromRecruiters} jobs from recruiterDB collection`);
//     console.log(`Total opportunities loaded: ${allOpportunities.length}`);

//     // Apply filters
//     let filteredOpportunities = allOpportunities;

//     // Filter by type
//     if (typeFilter && typeFilter !== 'all') {
//       filteredOpportunities = filteredOpportunities.filter(opp => {
//         const oppType = (opp.type || '').toLowerCase();
//         return oppType === typeFilter.toLowerCase();
//       });
//     }

//     // Filter by province/location
//     if (provinceFilterValue && provinceFilterValue !== 'all') {
//       filteredOpportunities = filteredOpportunities.filter(opp => {
//         const oppProvince = (opp.province || '').toLowerCase();
//         const oppLocation = (opp.location || '').toLowerCase();
//         return oppProvince === provinceFilterValue.toLowerCase() ||
//           oppLocation.includes(provinceFilterValue.toLowerCase());
//       });
//     }

//     // Filter by field/industry
//     if (fieldFilterValue && fieldFilterValue !== 'all') {
//       filteredOpportunities = filteredOpportunities.filter(opp => {
//         const oppField = (opp.field || '').toLowerCase();
//         const oppIndustry = (opp.industry || '').toLowerCase();
//         return oppField === fieldFilterValue.toLowerCase() ||
//           oppIndustry === fieldFilterValue.toLowerCase();
//       });
//     }

//     // Filter by search query
//     if (searchQuery) {
//       filteredOpportunities = filteredOpportunities.filter(opp => {
//         const title = (opp.title || '').toLowerCase();
//         const desc = (opp.description || '').toLowerCase();
//         const company = (opp.company || opp.companyName || '').toLowerCase();
//         return title.includes(searchQuery) ||
//           desc.includes(searchQuery) ||
//           company.includes(searchQuery);
//       });
//     }

//     // Clear loading message
//     opportunitiesGrid.innerHTML = '';

//     // Display filtered opportunities
//     if (filteredOpportunities.length === 0) {
//       opportunitiesGrid.innerHTML = '<p class="no-results">No opportunities found. Try adjusting your filters.</p>';
//     } else {
//       // Sort by most recent first
//       filteredOpportunities.sort((a, b) => {
//         const dateA = new Date(a.postedAt || 0);
//         const dateB = new Date(b.postedAt || 0);
//         return dateB - dateA;
//       });

//       filteredOpportunities.forEach(opp => {
//         displayOpportunity(opp);
//       });
//     }

//     console.log(`Displaying ${filteredOpportunities.length} filtered opportunities`);

//   } catch (error) {
//     console.error("Error in loadOpportunities:", error);
//     opportunitiesGrid.innerHTML = '<p class="error">Error loading opportunities. Please try again later.</p>';
//   }
// }


// // Function to display a single opportunity
// function displayOpportunity(opp) {
//   const opportunityElement = document.createElement('div');
//   opportunityElement.className = 'opportunity-card';

//   // Create category badge
//   const category = opp.type || 'job';
//   const badgeClass = getBadgeClass(category);

//   // Format deadline if exists
//   const deadlineDisplay = opp.deadline ? `<div class="deadline">Deadline: ${formatDate(opp.deadline)}</div>` : '';

//   // Display company name from either field
//   const companyName = opp.company || opp.companyName || 'Company not specified';
//   const companyLink = opp.companyLink || '#'; // Use company link or default to #

//   opportunityElement.innerHTML = `
//     <div class="opportunity-header">
//       <span class="badge ${badgeClass}">${capitalizeFirstLetter(category)}</span>
//       <h3>${opp.title || 'Untitled Opportunity'}</h3>
//     </div>
//     <div class="opportunity-details">
//       <div class="company">${companyName}</div>
//       <div class="location">${opp.location || opp.province || 'Location not specified'}</div>
//       ${deadlineDisplay}
//       <div class="field">Field: ${opp.field || 'Not specified'}</div>
//     </div>
//     <div class="opportunity-description">
//       ${opp.description ? truncateText(opp.description, 100) : 'No description provided.'}
//     </div>
//     <a href="${companyLink}" target="_blank" class="btn btn-secondary view-details">Apply Now</a>
//   `;

//   opportunitiesGrid.appendChild(opportunityElement);
// }
// // Helper functions
// function capitalizeFirstLetter(string) {
//   if (!string) return '';
//   return string.charAt(0).toUpperCase() + string.slice(1);
// }

// function truncateText(text, maxLength) {
//   if (!text) return '';
//   if (text.length <= maxLength) return text;
//   return text.substring(0, maxLength) + '...';
// }

// function formatDate(dateStr) {
//   if (!dateStr) return '';
//   try {
//     const date = new Date(dateStr);
//     return date.toLocaleDateString();
//   } catch (e) {
//     console.error("Error formatting date:", e);
//     return dateStr; // Return original string if can't format
//   }
// }

// function getBadgeClass(category) {
//   if (!category) return 'badge-default';
//   const categoryLower = category.toLowerCase();
//   switch (categoryLower) {
//     case 'internship': return 'badge-primary';
//     case 'bursary': return 'badge-success';
//     case 'scholarship': return 'badge-info';
//     case 'learnership': return 'badge-warning';
//     case 'job': return 'badge-secondary';
//     default: return 'badge-default';
//   }
// }

// function showOpportunityDetails(opp) {
//   // Log the opportunity being viewed
//   console.log('Viewing details for:', opp);

//   // Example: Display in alert (replace with modal or redirect to details page)
//   const details = `
//     Title: ${opp.title || 'No title'}
//     Company: ${opp.company || opp.companyName || 'No company'}
//     Location: ${opp.location || opp.province || 'Location not specified'}
//     Type: ${opp.type || 'Not specified'}
//     Field: ${opp.field || 'Not specified'}
//     Deadline: ${opp.deadline || 'Not specified'}
//     Description: ${opp.description || 'No description'}
//   `;

//   alert(details);
// }

// // Set up event listeners for filters
// if (opportunityTypeFilter) {
//   opportunityTypeFilter.addEventListener('change', loadOpportunities);
// }

// if (provinceFilter) {
//   provinceFilter.addEventListener('change', loadOpportunities);
// }

// if (fieldFilter) {
//   fieldFilter.addEventListener('change', loadOpportunities);
// }

// if (searchInput) {
//   searchInput.addEventListener('input', debounce(loadOpportunities, 300));
// }

// // Debounce function
// function debounce(func, delay) {
//   let debounceTimer;
//   return function() {
//     const context = this;
//     const args = arguments;
//     clearTimeout(debounceTimer);
//     debounceTimer = setTimeout(() => func.apply(context, args), delay);
//   };
// }

// // Initialize the page
// document.addEventListener('DOMContentLoaded', function() {
//   console.log("Opportunity page loaded, loading opportunities");
//   loadOpportunities();
// });


import { db } from './firebase.js';
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-firestore.js";

// Get references to the opportunity grid and filters
const opportunitiesGrid = document.querySelector('.opportunities-grid');
const opportunityTypeFilter = document.getElementById('opportunity-type');
const provinceFilter = document.getElementById('province');
const fieldFilter = document.getElementById('field');
const searchInput = document.getElementById('search-input');

// Function to load and display opportunities
async function loadOpportunities() {
  try {
    // Clear existing opportunities
    opportunitiesGrid.innerHTML = '<p>Loading opportunities...</p>';

    // Get filter values
    const typeFilter = opportunityTypeFilter ? opportunityTypeFilter.value.toLowerCase() : 'all';
    const provinceFilterValue = provinceFilter ? provinceFilter.value.toLowerCase() : 'all';
    const fieldFilterValue = fieldFilter ? fieldFilter.value.toLowerCase() : 'all';
    const searchQuery = searchInput ? searchInput.value.toLowerCase().trim() : '';

    let allOpportunities = [];

    // Load opportunities from the opportunities collection
    const opportunitiesRef = collection(db, "opportunities");
    const opportunitiesSnapshot = await getDocs(opportunitiesRef);
    opportunitiesSnapshot.forEach(doc => {
      const data = doc.data();
      allOpportunities.push({
        id: doc.id,
        ...data,
        province: data.province || data.location || '',
        field: data.field || data.industry || '',
        type: data.type || 'job',
        title: data.title || 'Untitled Opportunity',
        description: data.description || '',
        companyName: data.company || data.companyName || 'Unknown Company'
      });
    });

    console.log(`Loaded ${opportunitiesSnapshot.size} opportunities from opportunities collection`);

    // Load jobs from recruiterDB collection
    const recruitersRef = collection(db, "recruiterDB");
    const recruitersSnapshot = await getDocs(recruitersRef);
    let jobsFromRecruiters = 0;

    recruitersSnapshot.forEach(recruiterDoc => {
      const recruiterData = recruiterDoc.data();
      if (recruiterData.postedJobs && Object.keys(recruiterData.postedJobs).length > 0) {
        Object.entries(recruiterData.postedJobs).forEach(([jobId, jobData]) => {
          const job = {
            id: jobId,
            ...jobData,
            recruiterID: recruiterDoc.id,
            companyName: recruiterData.companyName || recruiterData.company || jobData.companyName || jobData.company || "Unknown Company",
            type: jobData.type || 'job',
            province: jobData.province || jobData.location || '',
            field: jobData.field || jobData.industry || '',
            title: jobData.title || 'Untitled Opportunity',
            description: jobData.description || ''
          };
          allOpportunities.push(job);
          jobsFromRecruiters++;
        });
      }
    });

    console.log(`Loaded ${jobsFromRecruiters} jobs from recruiterDB collection`);
    console.log(`Total opportunities loaded: ${allOpportunities.length}`);

    // Apply filters
    let filteredOpportunities = allOpportunities;

    // Filter by type
    if (typeFilter !== 'all') {
      filteredOpportunities = filteredOpportunities.filter(opp => {
        const oppType = (opp.type || '').toLowerCase();
        return oppType === typeFilter;
      });
      console.log(`After type filter (${typeFilter}): ${filteredOpportunities.length} opportunities`);
    }

    // Filter by province/location
    if (provinceFilterValue !== 'all') {
      filteredOpportunities = filteredOpportunities.filter(opp => {
        const oppProvince = (opp.province || '').toLowerCase().replace(/\s+/g, '-'); // Normalize spaces to dashes
        const oppLocation = (opp.location || '').toLowerCase().replace(/\s+/g, '-');
        const filterValue = provinceFilterValue.replace(/\s+/g, '-'); // Normalize filter value
        return oppProvince === filterValue || oppLocation.includes(filterValue);
      });
      console.log(`After province filter (${provinceFilterValue}): ${filteredOpportunities.length} opportunities`);
    }

    // Filter by field/industry
    if (fieldFilterValue !== 'all') {
      filteredOpportunities = filteredOpportunities.filter(opp => {
        const oppField = (opp.field || '').toLowerCase().replace(/\s+/g, '-'); // Normalize spaces to dashes
        const oppIndustry = (opp.industry || '').toLowerCase().replace(/\s+/g, '-');
        const filterValue = fieldFilterValue.replace(/\s+/g, '-'); // Normalize filter value
        return oppField === filterValue || oppIndustry === filterValue;
      });
      console.log(`After field filter (${fieldFilterValue}): ${filteredOpportunities.length} opportunities`);
    }

    // Filter by search query
    if (searchQuery) {
      filteredOpportunities = filteredOpportunities.filter(opp => {
        const title = (opp.title || '').toLowerCase();
        const desc = (opp.description || '').toLowerCase();
        const company = (opp.company || opp.companyName || '').toLowerCase();
        return title.includes(searchQuery) || desc.includes(searchQuery) || company.includes(searchQuery);
      });
      console.log(`After search filter (${searchQuery}): ${filteredOpportunities.length} opportunities`);
    }

    // Clear loading message
    opportunitiesGrid.innerHTML = '';

    // Display filtered opportunities
    if (filteredOpportunities.length === 0) {
      opportunitiesGrid.innerHTML = '<p class="no-results">No opportunities found. Try adjusting your filters.</p>';
    } else {
      // Sort by most recent first
      filteredOpportunities.sort((a, b) => {
        const dateA = new Date(a.postedAt || 0);
        const dateB = new Date(b.postedAt || 0);
        return dateB - dateA;
      });

      filteredOpportunities.forEach(opp => {
        displayOpportunity(opp);
      });
    }

    console.log(`Displaying ${filteredOpportunities.length} filtered opportunities`);

  } catch (error) {
    console.error("Error in loadOpportunities:", error);
    opportunitiesGrid.innerHTML = '<p class="error">Error loading opportunities. Please try again later.</p>';
  }
}

// Function to display a single opportunity
function displayOpportunity(opp) {
  const opportunityElement = document.createElement('div');
  opportunityElement.className = 'opportunity-card';

  // Create category badge
  const category = opp.type || 'job';
  const badgeClass = getBadgeClass(category);

  // Format deadline if exists
  const deadlineDisplay = opp.deadline ? `<div class="deadline">Deadline: ${formatDate(opp.deadline)}</div>` : '';

  // Display company name from either field
  const companyName = opp.company || opp.companyName || 'Company not specified';
  const companyLink = opp.companyLink || '#'; // Use company link or default to #

  opportunityElement.innerHTML = `
    <div class="opportunity-header">
      <span class="badge ${badgeClass}">${capitalizeFirstLetter(category)}</span>
      <h3>${opp.title || 'Untitled Opportunity'}</h3>
    </div>
    <div class="opportunity-details">
      <div class="company">${companyName}</div>
      <div class="location">${opp.location || opp.province || 'Location not specified'}</div>
      ${deadlineDisplay}
      <div class="field">Field: ${opp.field || opp.industry || 'Not specified'}</div>
    </div>
    <div class="opportunity-description">
      ${opp.description ? truncateText(opp.description, 100) : 'No description provided.'}
    </div>
    <a href="${companyLink}" target="_blank" class="btn btn-secondary view-details">Apply Now</a>
  `;

  opportunitiesGrid.appendChild(opportunityElement);
}

// Helper functions
function capitalizeFirstLetter(string) {
  if (!string) return '';
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
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

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
  console.log("Opportunity page loaded, loading opportunities");
  loadOpportunities();
});


