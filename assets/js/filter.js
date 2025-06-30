

// Travel blog filtering functionality
document.addEventListener('DOMContentLoaded', function() {
    const filterButtons = document.querySelectorAll('.filter-item');
    const countryCards = document.querySelectorAll('.country-card');

    // Add click event listeners to filter buttons
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filterValue = this.getAttribute('data-filter');
            
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Filter countries with smooth animation
            filterCountries(filterValue);
        });
    });

    function filterCountries(filter) {
        countryCards.forEach(card => {
            const continent = card.getAttribute('data-continent');
            
            if (filter === 'all' || continent === filter) {
                // Show card
                card.classList.remove('hidden');
            } else {
                // Hide card
                card.classList.add('hidden');
            }
        });

        // Update results count
        updateResultsCount(filter);
    }

    function updateResultsCount(filter) {
        const visibleCards = Array.from(countryCards).filter(card => {
            const continent = card.getAttribute('data-continent');
            return filter === 'all' || continent === filter;
        });

        // Update count badges
        const counts = {
            all: countryCards.length,
            asia: Array.from(countryCards).filter(card => card.getAttribute('data-continent') === 'asia').length,
            europe: Array.from(countryCards).filter(card => card.getAttribute('data-continent') === 'europe').length,
            oceania: Array.from(countryCards).filter(card => card.getAttribute('data-continent') === 'oceania').length
        };

        Object.keys(counts).forEach(continent => {
            const countElement = document.getElementById(`count-${continent}`);
            if (countElement) {
                countElement.textContent = counts[continent];
            }
        });

        // Add a subtle notification (optional)
        console.log(`Showing ${visibleCards.length} destination(s) for ${filter === 'all' ? 'all continents' : filter}`);
    }

    // Add keyboard support
    document.addEventListener('keydown', function(e) {
        if (e.altKey) {
            switch(e.key) {
                case '1':
                    e.preventDefault();
                    document.querySelector('[data-filter="all"]').click();
                    break;
                case '2':
                    e.preventDefault();
                    document.querySelector('[data-filter="asia"]').click();
                    break;
                case '3':
                    e.preventDefault();
                    document.querySelector('[data-filter="europe"]').click();
                    break;
                case '4':
                    e.preventDefault();
                    document.querySelector('[data-filter="oceania"]').click();
                    break;
            }
        }
    });

    // Initialize with all countries showing
    countryCards.forEach(card => {
        card.classList.remove('hidden');
    });
});
