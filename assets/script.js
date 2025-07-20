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
