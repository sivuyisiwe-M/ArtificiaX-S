


// opportunity-js.js working

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



