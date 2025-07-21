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

// ===== HERO CTA FUNCTIONALITY =====
document.addEventListener('DOMContentLoaded', function() {
    const heroCTA = document.getElementById('heroCTA');
    const aboutSection = document.querySelector('.about');
    
    if (!heroCTA || !aboutSection) return;
    
    // Smooth scroll to about section
    function scrollToAbout() {
        aboutSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
        
        // Mostrar botón de WhatsApp instantáneamente
        const whatsappButton = document.getElementById('whatsappButton');
        if (whatsappButton && !whatsappButton.classList.contains('show')) {
            whatsappButton.classList.add('show');
            // Mostrar tooltip después de un pequeño delay
            setTimeout(() => {
                const tooltip = document.getElementById('whatsappTooltip');
                if (tooltip) {
                    // Establecer mensaje aleatorio inicial
                    tooltip.textContent = getRandomMessage();
                    tooltip.classList.add('show');
                    
                    // Configurar cambio periódico de mensajes (cada 8 segundos)
                    setInterval(changeTooltipMessage, 8000);
                }
            }, 300);
        }
    }
    
    // Event listener
    heroCTA.addEventListener('click', scrollToAbout);
});

// ===== WHATSAPP BUTTON FUNCTIONALITY =====
// Configuración del botón de WhatsApp
const WHATSAPP_CONFIG = {
    phoneNumber: '+573001234567', // Número de WhatsApp (formato internacional)
    message: 'Hola! Me interesa conocer más sobre Plumii. ¿Podrían brindarme información sobre su plataforma educativa?' // Mensaje predeterminado
};

// Banco de mensajes para el tooltip
const TOOLTIP_MESSAGES = [
    '¿Tienes dudas? Nosotros tenemos respuestas',
    '¿Necesitas más información? ¡Conversemos!',
    '¿Quieres saber más sobre Plumii?',
    '¿Tienes preguntas? Estamos aquí para ayudarte',
    '¿Te interesa transformar tu institución educativa?',
    '¿Quieres conocer cómo Plumii puede ayudarte?',
    '¿Listo para el futuro de la educación?',
    '¿Tienes dudas sobre nuestra plataforma?',
    '¿Quieres una demo personalizada?',
    '¿Te gustaría conocer nuestros precios?',
    '¿Necesitas asesoría educativa?',
    '¿Quieres revolucionar tu colegio?',
    '¿Tienes dudas sobre la implementación?',
    '¿Quieres conocer casos de éxito?',
    '¿Te interesa la innovación educativa?'
];

// Función para obtener un mensaje aleatorio
function getRandomMessage() {
    const randomIndex = Math.floor(Math.random() * TOOLTIP_MESSAGES.length);
    return TOOLTIP_MESSAGES[randomIndex];
}

// Función para cambiar el mensaje del tooltip
function changeTooltipMessage() {
    const tooltip = document.getElementById('whatsappTooltip');
    if (tooltip && tooltip.classList.contains('show')) {
        // Agregar clase para transición
        tooltip.classList.add('changing');
        
        setTimeout(() => {
            // Cambiar mensaje
            tooltip.textContent = getRandomMessage();
            
            // Remover clase de transición
            tooltip.classList.remove('changing');
        }, 150);
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const whatsappButton = document.getElementById('whatsappButton');
    
    if (!whatsappButton) return;
    
    // Mostrar botón después de 5 segundos
    setTimeout(() => {
        whatsappButton.classList.add('show');
        // Mostrar tooltip después de un pequeño delay
        setTimeout(() => {
            const tooltip = document.getElementById('whatsappTooltip');
            if (tooltip) {
                // Establecer mensaje aleatorio inicial
                tooltip.textContent = getRandomMessage();
                tooltip.classList.add('show');
                
                // Configurar cambio periódico de mensajes (cada 8 segundos)
                setInterval(changeTooltipMessage, 8000);
            }
        }, 300);
    }, 5000);
    
    // Función para abrir WhatsApp
    function openWhatsApp() {
        // Codificar el mensaje para URL
        const encodedMessage = encodeURIComponent(WHATSAPP_CONFIG.message);
        
        // Crear URL de WhatsApp
        const whatsappURL = `https://wa.me/${WHATSAPP_CONFIG.phoneNumber}?text=${encodedMessage}`;
        
        // Abrir en nueva pestaña
        window.open(whatsappURL, '_blank');
    }
    
    // Event listener
    whatsappButton.addEventListener('click', openWhatsApp);
    
    // ===== NAVIGATION CONTACT BUTTON =====
    const navContactBtn = document.getElementById('navContactBtn');
    
    if (navContactBtn) {
        navContactBtn.addEventListener('click', openWhatsApp);
    }
    
    // ===== SMOOTH SCROLL NAVIGATION =====
    const navLinks = document.querySelectorAll('.nav__link');
    
    // Función para hacer scroll suave a una sección
    function smoothScrollToSection(sectionId) {
        const section = document.getElementById(sectionId);
        if (section) {
            const headerHeight = document.querySelector('.header').offsetHeight;
            const sectionTop = section.offsetTop - headerHeight - 20;
            
            window.scrollTo({
                top: sectionTop,
                behavior: 'smooth'
            });
        }
    }
    
    // Event listeners para enlaces de navegación
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const sectionId = this.getAttribute('data-section');
            smoothScrollToSection(sectionId);
        });
    });
    
    // ===== FLOATING NAVIGATION MENU =====
    const floatingNav = document.getElementById('floatingNav');
    const floatingNavToggle = document.getElementById('floatingNavToggle');
    const floatingNavMenu = document.querySelector('.floating-nav__menu');
    const floatingNavItems = document.querySelectorAll('.floating-nav__item');
    const floatingLogo = document.getElementById('floatingLogo');
    
    if (floatingNav && floatingNavToggle && floatingNavMenu) {
        // Toggle del menú flotante
        floatingNavToggle.addEventListener('click', function() {
            floatingNavMenu.classList.toggle('show');
            
            // Rotar el ícono del toggle
            const svg = this.querySelector('svg');
            if (floatingNavMenu.classList.contains('show')) {
                svg.style.transform = 'rotate(45deg)';
            } else {
                svg.style.transform = 'rotate(0deg)';
            }
        });
        
        // Event listeners para elementos del menú flotante
        floatingNavItems.forEach(item => {
            item.addEventListener('click', function() {
                // Si es el botón de contacto, abrir WhatsApp
                if (this.classList.contains('floating-nav__item--contact')) {
                    openWhatsApp();
                } else {
                    const sectionId = this.getAttribute('data-section');
                    smoothScrollToSection(sectionId);
                }
                
                // Cerrar menú después de hacer clic
                setTimeout(() => {
                    floatingNavMenu.classList.remove('show');
                    const svg = floatingNavToggle.querySelector('svg');
                    svg.style.transform = 'rotate(0deg)';
                }, 300);
            });
        });
        
        // Cerrar menú al hacer clic fuera
        document.addEventListener('click', function(e) {
            if (!floatingNav.contains(e.target)) {
                floatingNavMenu.classList.remove('show');
                const svg = floatingNavToggle.querySelector('svg');
                svg.style.transform = 'rotate(0deg)';
            }
        });
        
        // Control de visibilidad del menú flotante (solo para desktop)
        function checkScreenSize() {
            const isMobile = window.innerWidth <= 768;
            
            if (isMobile) {
                // En móvil, siempre visible
                floatingNav.style.opacity = '1';
                floatingNav.style.visibility = 'visible';
                floatingNav.style.transform = 'none';
                if (floatingLogo) {
                    floatingLogo.classList.add('show');
                }
            } else {
                // En desktop, controlar por scroll
                const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                const heroHeight = document.querySelector('.hero').offsetHeight;
                
                if (scrollTop > heroHeight * 0.5) {
                    floatingNav.style.opacity = '1';
                    floatingNav.style.visibility = 'visible';
                    floatingNav.style.transform = 'translateY(-50%) scale(1)';
                    if (floatingLogo) {
                        floatingLogo.classList.add('show');
                    }
                } else {
                    floatingNav.style.opacity = '0';
                    floatingNav.style.visibility = 'hidden';
                    floatingNav.style.transform = 'translateY(-50%) scale(0.8)';
                    if (floatingLogo) {
                        floatingLogo.classList.remove('show');
                    }
                    
                    // Cerrar menú si está abierto
                    if (floatingNavMenu.classList.contains('show')) {
                        floatingNavMenu.classList.remove('show');
                        const svg = floatingNavToggle.querySelector('svg');
                        svg.style.transform = 'rotate(0deg)';
                    }
                }
            }
        }
        
        // Estado inicial
        floatingNav.style.transition = 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        
        // Event listeners
        window.addEventListener('scroll', checkScreenSize);
        window.addEventListener('resize', checkScreenSize);
        
        // Verificación inicial
        checkScreenSize();
    }
});
