// Mouse sphere functionality for services section
document.addEventListener('DOMContentLoaded', function() {
    const servicesGrid = document.querySelector('.services');
    const sphere1 = document.getElementById('sphere1');
    const sphere2 = document.getElementById('sphere2');
    const serviceCards = document.querySelectorAll('.service-card');
    
    let isMouseInGrid = false;
    let mouseX = 0;
    let mouseY = 0;
    
    // Update sphere position for a specific card
    function updateCardSphere(sphere, card) {
        const rect = card.getBoundingClientRect();
        
        // Calculate mouse position relative to the card
        const relativeX = mouseX - rect.left;
        const relativeY = mouseY - rect.top;
        
        // Always show sphere when mouse is in grid, position relative to card
        if (isMouseInGrid) {
            sphere.style.left = relativeX + 'px';
            sphere.style.top = relativeY + 'px';
            sphere.style.opacity = '1';
        } else {
            sphere.style.opacity = '0';
        }
    }
    
    // Update all spheres
    function updateSpheres() {
        updateCardSphere(sphere1, serviceCards[0]);
        updateCardSphere(sphere2, serviceCards[1]);
        
        requestAnimationFrame(updateSpheres);
    }
    
    // Mouse move event
    document.addEventListener('mousemove', function(e) {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        // Check if mouse is in the services grid
        const rect = servicesGrid.getBoundingClientRect();
        isMouseInGrid = mouseX >= rect.left && 
                       mouseX <= rect.right && 
                       mouseY >= rect.top && 
                       mouseY <= rect.bottom;
    });
    
    // Mouse enter services grid
    servicesGrid.addEventListener('mouseenter', function() {
        isMouseInGrid = true;
    });
    
    // Mouse leave services grid
    servicesGrid.addEventListener('mouseleave', function() {
        isMouseInGrid = false;
        sphere1.style.opacity = '0';
        sphere2.style.opacity = '0';
    });
    
    // Start the animation loop
    updateSpheres();
});

// Values circle animation control
document.addEventListener('DOMContentLoaded', function() {
    const valuesCircle = document.querySelector('.values__circle');
    const valueItems = document.querySelectorAll('.value-item');
    const valueContents = document.querySelectorAll('.value-item__content');
    
    // Track if any item is being hovered or clicked
    let isAnyItemHovered = false;
    let isAnyItemClicked = false;
    let clickedItem = null;
    
    // Function to pause/resume circle animation
    function toggleCircleAnimation() {
        if (isAnyItemHovered || isAnyItemClicked) {
            valuesCircle.style.animationPlayState = 'paused';
            valueContents.forEach(content => {
                content.style.animationPlayState = 'paused';
            });
        } else {
            valuesCircle.style.animationPlayState = 'running';
            valueContents.forEach(content => {
                content.style.animationPlayState = 'running';
            });
        }
    }
    
    // Function to expand item and show description
    function expandItem(item) {
        // Reset all items
        valueItems.forEach(valueItem => {
            valueItem.classList.remove('value-item--expanded');
            valueItem.classList.remove('value-item--dimmed');
        });
        
        // Expand clicked item
        item.classList.add('value-item--expanded');
        
        // Dim all other items
        valueItems.forEach(valueItem => {
            if (valueItem !== item) {
                valueItem.classList.add('value-item--dimmed');
            }
        });
        
        // Pause animation
        isAnyItemClicked = true;
        clickedItem = item;
        toggleCircleAnimation();
    }
    
    // Function to reset to normal state
    function resetToNormal() {
        if (clickedItem) {
            clickedItem.classList.remove('value-item--expanded');
            clickedItem = null;
        }
        
        // Remove dimmed class from all items
        valueItems.forEach(valueItem => {
            valueItem.classList.remove('value-item--dimmed');
        });
        
        isAnyItemClicked = false;
        isAnyItemHovered = false; // Reset hover state as well
        toggleCircleAnimation();
    }
    
    // Add hover listeners to each value item
    valueItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            if (!isAnyItemClicked) {
                isAnyItemHovered = true;
                toggleCircleAnimation();
            }
        });
        
        item.addEventListener('mouseleave', function() {
            if (!isAnyItemClicked) {
                isAnyItemHovered = false;
                toggleCircleAnimation();
            }
        });
        
        // Add click listener to each value item
        item.addEventListener('click', function() {
            if (isAnyItemClicked && clickedItem === item) {
                // If clicking the same item again, reset to normal
                resetToNormal();
            } else {
                // Expand clicked item
                expandItem(item);
            }
        });
    });
    
    // Add click listener to document to reset when clicking outside
    document.addEventListener('click', function(e) {
        if (isAnyItemClicked && !e.target.closest('.value-item')) {
            resetToNormal();
        }
    });
    
    // Intersection Observer to reset when container is not visible
    const valuesSection = document.querySelector('.values');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            // If less than 30% of the section is visible, reset the expanded item
            if (entry.intersectionRatio < 0.3 && isAnyItemClicked) {
                resetToNormal();
            }
        });
    }, {
        threshold: 0.3,
        rootMargin: '0px'
    });
    
    // Start observing the values section
    if (valuesSection) {
        observer.observe(valuesSection);
    }
});

// Features cards expansion functionality
document.addEventListener('DOMContentLoaded', function() {
    const featureCards = document.querySelectorAll('.feature-card');
    
    // Track if any card is expanded
    let isAnyCardExpanded = false;
    let expandedCard = null;
    
    // Function to expand card
    function expandCard(card) {
        // Reset all cards
        featureCards.forEach(featureCard => {
            featureCard.classList.remove('feature-card--expanded');
        });
        
        // Expand clicked card
        card.classList.add('feature-card--expanded');
        
        // Update state
        isAnyCardExpanded = true;
        expandedCard = card;
    }
    
    // Function to reset to normal state
    function resetFeatures() {
        if (expandedCard) {
            expandedCard.classList.remove('feature-card--expanded');
            expandedCard = null;
        }
        
        isAnyCardExpanded = false;
    }
    
    // Add click listeners to each feature card
    featureCards.forEach(card => {
        card.addEventListener('click', function() {
            if (isAnyCardExpanded && expandedCard === card) {
                // If clicking the same card again, reset to normal
                resetFeatures();
            } else {
                // Expand clicked card
                expandCard(card);
            }
        });
    });
    
    // Add click listener to document to reset when clicking outside
    document.addEventListener('click', function(e) {
        if (isAnyCardExpanded && !e.target.closest('.feature-card')) {
            resetFeatures();
        }
    });
});

// ===== SCROLL TO TOP FUNCTIONALITY =====
document.addEventListener('DOMContentLoaded', function() {
    const scrollToTopBtn = document.getElementById('scrollToTop');
    const heroSection = document.querySelector('.hero');
    
    if (!scrollToTopBtn || !heroSection) return;
    
    // Get hero section height to determine when to show button
    const heroHeight = heroSection.offsetHeight;
    
    // Show/hide button based on scroll position
    function toggleScrollButton() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > heroHeight) {
            scrollToTopBtn.classList.add('show');
        } else {
            scrollToTopBtn.classList.remove('show');
        }
    }
    
    // Smooth scroll to top
    function scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
    
    // Event listeners
    window.addEventListener('scroll', toggleScrollButton);
    scrollToTopBtn.addEventListener('click', scrollToTop);
    
    // Initial check
    toggleScrollButton();
});
