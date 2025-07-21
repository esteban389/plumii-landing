/**
 * AnimationManager - Gestiona todas las animaciones y efectos visuales
 * Maneja animaciones de scroll, efectos hover y transiciones
 */
class AnimationManager {
    constructor() {
        this.spheres = document.querySelectorAll('.service-card__mouse-sphere');
        this.animatedElements = [];
        this.isAnimating = false;
        
        this.init();
    }

    init() {
        this.setupMouseSpheres();
        this.setupScrollAnimations();
        this.setupIntersectionObserver();
        this.setupValuesCircle();
        this.setupFeatureCards();
    }

    /**
     * Configura las esferas que siguen al mouse
     */
    setupMouseSpheres() {
        this.spheres.forEach((sphere, index) => {
            if (sphere) {
                this.animateSphere(sphere, index);
            }
        });
    }

    /**
     * Anima una esfera específica
     */
    animateSphere(sphere, index) {
        const serviceCard = sphere.closest('.service-card');
        if (!serviceCard) return;

        serviceCard.addEventListener('mousemove', (e) => {
            const rect = serviceCard.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // Aplicar transformación con delay basado en el índice
            const delay = index * 0.1;
            setTimeout(() => {
                sphere.style.transform = `translate(${x}px, ${y}px)`;
            }, delay * 1000);
        });

        serviceCard.addEventListener('mouseleave', () => {
            // Resetear posición
            setTimeout(() => {
                sphere.style.transform = 'translate(50%, 50%)';
            }, 200);
        });
    }

    /**
     * Configura animaciones basadas en scroll
     * (Solo tarjetas y esferas, no textos)
     */
    setupScrollAnimations() {
        // Animación de aparición de elementos
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, observerOptions);

        // Observar solo tarjetas animables
        const animatableElements = document.querySelectorAll(
            '.service-card, .feature-card, .community__card, .value-item'
        );

        animatableElements.forEach(el => {
            observer.observe(el);
        });
    }

    /**
     * Configura el Intersection Observer para animaciones
     * (Eliminado para textos)
     */
    setupIntersectionObserver() {
        // No hacer nada para textos
    }

    /**
     * Anima un elemento específico
     */
    animateElement(element) {
        if (element.classList.contains('animated')) return;
        
        element.classList.add('animated');
        
        // Aplicar animación según el tipo de elemento
        if (element.classList.contains('hero__title')) {
            this.animateHeroTitle(element);
        } else if (element.classList.contains('service-card')) {
            this.animateServiceCard(element);
        } else if (element.classList.contains('feature-card')) {
            this.animateFeatureCard(element);
        } else if (element.classList.contains('value-item')) {
            this.animateValueItem(element);
        } else {
            this.animateGenericElement(element);
        }
    }

    /**
     * Anima el título del hero
     */
    animateHeroTitle(element) {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            element.style.transition = 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, 200);
    }

    /**
     * Anima una tarjeta de servicio
     */
    animateServiceCard(element) {
        element.style.opacity = '0';
        element.style.transform = 'translateY(50px) scale(0.95)';
        
        setTimeout(() => {
            element.style.transition = 'all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            element.style.opacity = '1';
            element.style.transform = 'translateY(0) scale(1)';
        }, 100);
    }

    /**
     * Anima una tarjeta de funcionalidad
     */
    animateFeatureCard(element) {
        element.style.opacity = '0';
        element.style.transform = 'translateX(-30px)';
        
        setTimeout(() => {
            element.style.transition = 'all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            element.style.opacity = '1';
            element.style.transform = 'translateX(0)';
        }, 150);
    }

    /**
     * Anima un elemento de valor
     */
    animateValueItem(element) {
        element.style.opacity = '0';
        element.style.transform = 'scale(0.8) rotate(10deg)';
        
        setTimeout(() => {
            element.style.transition = 'all 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            element.style.opacity = '1';
            element.style.transform = 'scale(1) rotate(0deg)';
        }, 200);
    }

    /**
     * Anima un elemento genérico
     */
    animateGenericElement(element) {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            element.style.transition = 'all 0.5s ease-out';
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, 100);
    }

    /**
     * Lógica de la sección de valores (círculo)
     */
    setupValuesCircle() {
        const valuesCircle = document.querySelector('.values__circle');
        const valueItems = document.querySelectorAll('.value-item');
        const valueContents = document.querySelectorAll('.value-item__content');
        let isAnyItemHovered = false;
        let isAnyItemClicked = false;
        let clickedItem = null;

        function toggleCircleAnimation() {
            if (valuesCircle) {
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
        }

        function expandItem(item) {
            valueItems.forEach(valueItem => {
                valueItem.classList.remove('value-item--expanded');
                valueItem.classList.remove('value-item--dimmed');
            });
            item.classList.add('value-item--expanded');
            valueItems.forEach(valueItem => {
                if (valueItem !== item) {
                    valueItem.classList.add('value-item--dimmed');
                }
            });
            isAnyItemClicked = true;
            clickedItem = item;
            toggleCircleAnimation();
        }

        function resetToNormal() {
            if (clickedItem) {
                clickedItem.classList.remove('value-item--expanded');
                clickedItem = null;
            }
            valueItems.forEach(valueItem => {
                valueItem.classList.remove('value-item--dimmed');
            });
            isAnyItemClicked = false;
            isAnyItemHovered = false;
            toggleCircleAnimation();
        }

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
            item.addEventListener('click', function(e) {
                e.stopPropagation();
                if (isAnyItemClicked && clickedItem === item) {
                    resetToNormal();
                } else {
                    expandItem(item);
                }
            });
        });
        document.addEventListener('click', function(e) {
            if (isAnyItemClicked && !e.target.closest('.value-item')) {
                resetToNormal();
            }
        });
        // Reset si la sección deja de ser visible
        const valuesSection = document.querySelector('.values');
        if (valuesSection && 'IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.intersectionRatio < 0.3 && isAnyItemClicked) {
                        resetToNormal();
                    }
                });
            }, { threshold: 0.3, rootMargin: '0px' });
            observer.observe(valuesSection);
        }
    }

    /**
     * Lógica de expansión de cards en funcionalidades plus
     */
    setupFeatureCards() {
        const featureCards = document.querySelectorAll('.feature-card');
        let isAnyCardExpanded = false;
        let expandedCard = null;
        function expandCard(card) {
            featureCards.forEach(featureCard => {
                featureCard.classList.remove('feature-card--expanded');
            });
            card.classList.add('feature-card--expanded');
            isAnyCardExpanded = true;
            expandedCard = card;
        }
        function resetFeatures() {
            if (expandedCard) {
                expandedCard.classList.remove('feature-card--expanded');
                expandedCard = null;
            }
            isAnyCardExpanded = false;
        }
        featureCards.forEach(card => {
            card.addEventListener('click', function(e) {
                e.stopPropagation();
                if (isAnyCardExpanded && expandedCard === card) {
                    resetFeatures();
                } else {
                    expandCard(card);
                }
            });
        });
        document.addEventListener('click', function(e) {
            if (isAnyCardExpanded && !e.target.closest('.feature-card')) {
                resetFeatures();
            }
        });
    }

    /**
     * Aplica efecto shimmer a un elemento
     */
    applyShimmerEffect(element) {
        element.classList.add('shimmer');
        
        setTimeout(() => {
            element.classList.remove('shimmer');
        }, 1000);
    }

    /**
     * Aplica efecto de pulso
     */
    applyPulseEffect(element) {
        element.classList.add('pulse');
        
        setTimeout(() => {
            element.classList.remove('pulse');
        }, 600);
    }

    /**
     * Aplica efecto de rebote
     */
    applyBounceEffect(element) {
        element.classList.add('bounce');
        
        setTimeout(() => {
            element.classList.remove('bounce');
        }, 800);
    }

    /**
     * Anima elementos en secuencia
     */
    animateSequence(elements, delay = 100) {
        elements.forEach((element, index) => {
            setTimeout(() => {
                this.animateElement(element);
            }, index * delay);
        });
    }

    /**
     * Reinicia todas las animaciones
     */
    resetAnimations() {
        const animatedElements = document.querySelectorAll('.animated');
        animatedElements.forEach(el => {
            el.classList.remove('animated');
            el.style.opacity = '';
            el.style.transform = '';
            el.style.transition = '';
        });
    }

    /**
     * Pausa todas las animaciones
     */
    pauseAnimations() {
        this.isAnimating = false;
        document.body.style.setProperty('--animation-play-state', 'paused');
    }

    /**
     * Reanuda todas las animaciones
     */
    resumeAnimations() {
        this.isAnimating = true;
        document.body.style.setProperty('--animation-play-state', 'running');
    }

    /**
     * Para debugging: estadísticas
     */
    getStats() {
        return {
            spheres: this.spheres.length
        };
    }
}

export default AnimationManager; 