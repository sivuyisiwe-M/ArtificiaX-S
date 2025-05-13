

// opportunity.js - Display opportunities from the database

import { opportunitiesRef, getDocs, query, where, orderBy, limit } from './firebase.js';

document.addEventListener('DOMContentLoaded', function() {
    const opportunitiesGrid = document.querySelector('.opportunities-grid');
    const opportunityTypeFilter = document.getElementById('opportunity-type');
    const provinceFilter = document.getElementById('province');
    const fieldFilter = document.getElementById('field');

    // Load opportunities when page loads
    loadOpportunities();

    // Add event listeners for filters
    if (opportunityTypeFilter) {
        opportunityTypeFilter.addEventListener('change', loadOpportunities);
    }
    if (provinceFilter) {
        provinceFilter.addEventListener('change', loadOpportunities);
    }
    if (fieldFilter) {
        fieldFilter.addEventListener('change', loadOpportunities);
    }

    // Function to load opportunities with filters
    async function loadOpportunities() {
        if (!opportunitiesGrid) return;

        try {
            // Clear existing cards
            opportunitiesGrid.innerHTML = '';

            // Get filter values
            const typeFilter = opportunityTypeFilter ? opportunityTypeFilter.value : 'all';
            const provinceFilter = document.getElementById('province') ? document.getElementById('province').value : 'all';
            const fieldFilter = document.getElementById('field') ? document.getElementById('field').value : 'all';

            // Build query based on filters
            let q = query(opportunitiesRef, orderBy('createdAt', 'desc'));

            // Apply type filter if not "all"
            if (typeFilter !== 'all') {
                q = query(q, where('type', '==', typeFilter));
            }

            // Apply province filter (customize based on your actual field names)
            if (provinceFilter !== 'all') {
                // Convert UI friendly values to match what's stored in database
                const locationValue = convertProvinceFilterToLocationValue(provinceFilter);
                q = query(q, where('location', '==', locationValue));
            }

            // Note: For field filtering, you'll need to add a 'field' property to your opportunities
            // when they're created in recruiter.js

            // Limit results for performance
            q = query(q, limit(50));

            // Execute query
            const querySnapshot = await getDocs(q);
            
            if (querySnapshot.empty) {
                opportunitiesGrid.innerHTML = '<p class="no-results">No opportunities found matching your criteria.</p>';
                return;
            }

            // Create cards for each opportunity
            querySnapshot.forEach((doc) => {
                const opportunity = doc.data();
                const card = createOpportunityCard(opportunity, doc.id);
                opportunitiesGrid.appendChild(card);
            });

        } catch (error) {
            console.error("Error loading opportunities: ", error);
            opportunitiesGrid.innerHTML = '<p class="error">Error loading opportunities. Please try again later.</p>';
        }
    }

    // Helper function to convert province filter values to location values
    function convertProvinceFilterToLocationValue(provinceFilter) {
        const provinceMap = {
            'gauteng': 'Gauteng',
            'western-cape': 'Western Cape',
            'eastern-cape': 'Eastern Cape',
            'kzn': 'KwaZulu-Natal',
            'free-state': 'Free State',
            'north-west': 'North West',
            'limpopo': 'Limpopo',
            'mpumalanga': 'Mpumalanga',
            'northern-cape': 'Northern Cape'
        };
        
        return provinceMap[provinceFilter] || provinceFilter;
    }

    // Function to create opportunity card
    function createOpportunityCard(opportunity, id) {
        const card = document.createElement('div');
        card.className = 'opportunity-card';
        
        const closingDate = new Date(opportunity.closingDate);
        const formattedDate = closingDate.toLocaleDateString('en-ZA', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });

        card.innerHTML = `
            <img src="/api/placeholder/300/180" alt="${opportunity.title}" class="opp-image">
            <div class="opp-content">
                <span class="opp-type ${opportunity.type}">${capitalizeFirstLetter(opportunity.type)}</span>
                <h4>${opportunity.title}</h4>
                <div class="opp-meta">
                    <span>${opportunity.company}</span>
                    <span>Closing: ${formattedDate}</span>
                </div>
                <p>${opportunity.description.length > 120 ? opportunity.description.substring(0, 120) + '...' : opportunity.description}</p>
                <div class="opp-footer">
                    <div class="opp-province">
                        <i class="fa-solid fa-location-dot"></i>
                        <span>${opportunity.location}</span>
                    </div>
                    <a href="#" class="btn btn-primary apply-btn" data-id="${id}">Apply Now</a>
                </div>
            </div>
        `;

        // Add event listener for apply button (if needed)
        const applyBtn = card.querySelector('.apply-btn');
        if (applyBtn) {
            applyBtn.addEventListener('click', function(e) {
                e.preventDefault();
                // Implement application logic here or redirect to application page
                alert(`Applying for opportunity: ${opportunity.title}`);
                // Alternative: window.location.href = `/apply.html?id=${id}`;
            });
        }

        return card;
    }

    // Helper function to capitalize first letter
    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
});