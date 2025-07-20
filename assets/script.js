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
});
