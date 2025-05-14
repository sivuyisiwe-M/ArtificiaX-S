// // opportunity.js - Display opportunities from the database

// import { opportunitiesRef, getDocs, query, where, orderBy, limit } from './firebase.js';

// document.addEventListener('DOMContentLoaded', function () {
//     const opportunitiesGrid = document.querySelector('.opportunities-grid');
//     const opportunityTypeFilter = document.getElementById('opportunity-type');
//     const provinceFilter = document.getElementById('province');
//     const fieldFilter = document.getElementById('field');

//     // Load opportunities on page load
//     loadOpportunities();

//     // Re-load on filter change
//     if (opportunityTypeFilter) opportunityTypeFilter.addEventListener('change', loadOpportunities);
//     if (provinceFilter) provinceFilter.addEventListener('change', loadOpportunities);
//     if (fieldFilter) fieldFilter.addEventListener('change', loadOpportunities);

//     async function loadOpportunities() {
//         if (!opportunitiesGrid) return;

//         try {
//             opportunitiesGrid.innerHTML = ''; // Clear previous results

//             // Get filter values
//             const typeFilter = opportunityTypeFilter ? opportunityTypeFilter.value : 'all';
//             const province = provinceFilter ? provinceFilter.value : 'all';
//             const field = fieldFilter ? fieldFilter.value : 'all';

//             const locationValue = convertProvinceFilterToLocationValue(province);

//             console.log("Filters:", { typeFilter, locationValue, field });

//             // Build query dynamically
//             let filters = [];

//             if (typeFilter !== 'all') {
//                 filters.push(where('type', '==', typeFilter));
//             }

//             if (province !== 'all') {
//                 filters.push(where('location', '==', locationValue));
//             }

//             if (field !== 'all') {
//                 filters.push(where('field', '==', field));
//             }

//             filters.push(orderBy('createdAt', 'desc'));
//             filters.push(limit(50));

//             const q = query(opportunitiesRef, ...filters);

//             const querySnapshot = await getDocs(q);

//             if (querySnapshot.empty) {
//                 opportunitiesGrid.innerHTML = '<p class="no-results">No opportunities found matching your criteria.</p>';
//                 return;
//             }

//             querySnapshot.forEach((doc) => {
//                 const opportunity = doc.data();
//                 const card = createOpportunityCard(opportunity, doc.id);
//                 opportunitiesGrid.appendChild(card);
//             });

//         } catch (error) {
//             console.error("Error loading opportunities: ", error);
//             opportunitiesGrid.innerHTML = '<p class="error">Error loading opportunities. Please try again later.</p>';
//         }
//     }

//     function convertProvinceFilterToLocationValue(provinceFilter) {
//         const provinceMap = {
//             'gauteng': 'Gauteng',
//             'western-cape': 'Western Cape',
//             'eastern-cape': 'Eastern Cape',
//             'kzn': 'KwaZulu-Natal',
//             'free-state': 'Free State',
//             'north-west': 'North West',
//             'limpopo': 'Limpopo',
//             'mpumalanga': 'Mpumalanga',
//             'northern-cape': 'Northern Cape'
//         };

//         return provinceMap[provinceFilter] || provinceFilter;
//     }

//     function createOpportunityCard(opportunity, id) {
//         const card = document.createElement('div');
//         card.className = 'opportunity-card';

//         const closingDate = new Date(opportunity.closingDate);
//         const formattedDate = closingDate.toLocaleDateString('en-ZA', {
//             day: 'numeric',
//             month: 'long',
//             year: 'numeric'
//         });

//         card.innerHTML = `
//             <img src="/api/placeholder/300/180" alt="${opportunity.title}" class="opp-image">
//             <div class="opp-content">
//                 <span class="opp-type ${opportunity.type}">${capitalizeFirstLetter(opportunity.type)}</span>
//                 <h4>${opportunity.title}</h4>
//                 <div class="opp-meta">
//                     <span>${opportunity.company}</span>
//                     <span>Closing: ${formattedDate}</span>
//                 </div>
//                 <p>${opportunity.description.length > 120 ? opportunity.description.substring(0, 120) + '...' : opportunity.description}</p>
//                 <div class="opp-footer">
//                     <div class="opp-province">
//                         <i class="fa-solid fa-location-dot"></i>
//                         <span>${opportunity.location}</span>
//                     </div>
//                     <a href="#" class="btn btn-primary apply-btn" data-id="${id}">Apply Now</a>
//                 </div>
//             </div>
//         `;

//         const applyBtn = card.querySelector('.apply-btn');
//         if (applyBtn) {
//             applyBtn.addEventListener('click', function (e) {
//                 e.preventDefault();
//                 alert(`Applying for opportunity: ${opportunity.title}`);
//                 // Optionally redirect:
//                 // window.location.href = `/apply.html?id=${id}`;
//             });
//         }

//         return card;
//     }

//     function capitalizeFirstLetter(string) {
//         return string.charAt(0).toUpperCase() + string.slice(1);
//     }
// });




// opportunity-js.js

import { getDocs, query, where } from 'https://www.gstatic.com/firebasejs/10.5.0/firebase-firestore.js';
import { opportunitiesRef } from './firebase.js';

document.addEventListener('DOMContentLoaded', function () {
    const typeFilter = document.getElementById('opportunity-type');
    const provinceFilter = document.getElementById('province');
    const fieldFilter = document.getElementById('field');
    const grid = document.querySelector('.opportunities-grid');

    typeFilter.addEventListener('change', loadAndFilterOpportunities);
    provinceFilter.addEventListener('change', loadAndFilterOpportunities);
    fieldFilter.addEventListener('change', loadAndFilterOpportunities);

    // Load on page load
    loadAndFilterOpportunities();

    async function loadAndFilterOpportunities() {
        const selectedType = typeFilter.value;
        const selectedProvince = provinceFilter.value;
        const selectedField = fieldFilter.value;

        try {
            const snapshot = await getDocs(opportunitiesRef);
            let opportunities = [];

            snapshot.forEach(doc => {
                const data = doc.data();
                if (data.status === 'active') {
                    opportunities.push({ id: doc.id, ...data });
                }
            });

            // Filter in JS
            opportunities = opportunities.filter(op => {
                const matchesType = selectedType === 'all' || op.type?.toLowerCase() === selectedType;
                const matchesProvince = selectedProvince === 'all' || op.location?.toLowerCase().includes(selectedProvince);
                const matchesField = selectedField === 'all' || op.field?.toLowerCase() === selectedField;

                return matchesType && matchesProvince && matchesField;
            });

            displayOpportunities(opportunities);

        } catch (error) {
            console.error("Error loading opportunities:", error);
        }
    }

    function displayOpportunities(opportunities) {
        grid.innerHTML = '';

        if (opportunities.length === 0) {
            grid.innerHTML = '<p>No opportunities found for selected filters.</p>';
            return;
        }

        opportunities.forEach(op => {
            const card = document.createElement('div');
            card.className = 'opportunity-card';
            card.innerHTML = `
                <h4>${op.title}</h4>
                <p><strong>Company:</strong> ${op.company}</p>
                <p><strong>Location:</strong> ${op.location}</p>
                <p><strong>Type:</strong> ${op.type}</p>
                <p><strong>Field:</strong> ${op.field}</p>
                <p><strong>Closing:</strong> ${new Date(op.closingDate.seconds * 1000).toLocaleDateString()}</p>
                <p>${op.description}</p>
            `;
            grid.appendChild(card);
        });
    }
});
