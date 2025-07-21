/**
 * NavigationManager - Gestiona toda la navegación del sitio
 * Maneja smooth scroll, navegación principal y flotante
 */
class NavigationManager {
    constructor() {
        this.navLinks = document.querySelectorAll('.nav__link');
        this.floatingNavItems = document.querySelectorAll('.floating-nav__item');
        this.floatingNavToggle = document.getElementById('floatingNavToggle');
        this.floatingNavMenu = document.querySelector('.floating-nav__menu');
        this.floatingNav = document.getElementById('floatingNav');
        this.floatingLogo = document.getElementById('floatingLogo');
        this.scrollToTopBtn = document.getElementById('scrollToTop');
        
        this.init();
    }

    init() {
        this.setupSmoothScroll();
        this.setupFloatingNav();
        this.setupScrollToTop();
        this.setupResponsiveBehavior();
    }

    /**
     * Configura el smooth scroll para todos los enlaces de navegación
     */
    setupSmoothScroll() {
        const allNavButtons = [...this.navLinks, ...this.floatingNavItems];
        
        allNavButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const targetSection = button.getAttribute('data-section');
                this.scrollToSection(targetSection);
                
                // Cerrar menú flotante si está abierto
                if (this.floatingNavMenu.classList.contains('show')) {
                    this.closeFloatingMenu();
                }
            });
        });
    }

    /**
     * Realiza scroll suave a una sección específica
     */
    scrollToSection(sectionId) {
        const targetElement = document.getElementById(sectionId);
        if (targetElement) {
            const offsetTop = targetElement.offsetTop - 80; // Ajuste para header
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    }

    /**
     * Configura el menú flotante
     */
    setupFloatingNav() {
        if (this.floatingNavToggle) {
            this.floatingNavToggle.addEventListener('click', () => {
                this.toggleFloatingMenu();
            });
        }
    }

    /**
     * Alterna la visibilidad del menú flotante
     */
    toggleFloatingMenu() {
        const isOpen = this.floatingNavMenu.classList.contains('show');
        
        if (isOpen) {
            this.closeFloatingMenu();
        } else {
            this.openFloatingMenu();
        }
    }

    /**
     * Abre el menú flotante
     */
    openFloatingMenu() {
        this.floatingNavMenu.classList.add('show');
        const svg = this.floatingNavToggle.querySelector('svg');
        if (svg) {
            svg.style.transform = 'rotate(90deg)';
        }
    }

    /**
     * Cierra el menú flotante
     */
    closeFloatingMenu() {
        this.floatingNavMenu.classList.remove('show');
        const svg = this.floatingNavToggle.querySelector('svg');
        if (svg) {
            svg.style.transform = 'rotate(0deg)';
        }
    }

    /**
     * Configura el botón de scroll to top
     */
    setupScrollToTop() {
        if (this.scrollToTopBtn) {
            this.scrollToTopBtn.addEventListener('click', () => {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });
            // Mostrar/ocultar según scroll
            window.addEventListener('scroll', () => this.updateScrollToTopVisibility());
            this.updateScrollToTopVisibility();
        }
    }

    /**
     * Configura el comportamiento responsive
     */
    setupResponsiveBehavior() {
        this.checkScreenSize();
        window.addEventListener('resize', () => this.checkScreenSize());
        window.addEventListener('scroll', () => this.checkScreenSize());
    }

    /**
     * Controla la visibilidad de elementos flotantes según el tamaño de pantalla
     */
    checkScreenSize() {
        const isMobile = window.innerWidth <= 768;
        
        if (isMobile) {
            // En móvil, siempre visible
            this.showFloatingElements();
        } else {
            // En desktop, controlar por scroll
            this.handleDesktopScroll();
        }
    }

    /**
     * Muestra elementos flotantes en móvil
     */
    showFloatingElements() {
        if (this.floatingNav) {
            this.floatingNav.style.opacity = '1';
            this.floatingNav.style.visibility = 'visible';
            this.floatingNav.style.transform = 'none';
        }
        
        if (this.floatingLogo) {
            this.floatingLogo.classList.add('show');
        }
    }

    /**
     * Maneja la visibilidad en desktop según scroll
     */
    handleDesktopScroll() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const heroHeight = document.querySelector('.hero')?.offsetHeight || 0;
        
        if (scrollTop > heroHeight * 0.5) {
            this.showFloatingElements();
        } else {
            this.hideFloatingElements();
        }
    }

    /**
     * Oculta elementos flotantes
     */
    hideFloatingElements() {
        if (this.floatingNav) {
            this.floatingNav.style.opacity = '0';
            this.floatingNav.style.visibility = 'hidden';
            this.floatingNav.style.transform = 'translateY(-50%) scale(0.8)';
        }
        
        if (this.floatingLogo) {
            this.floatingLogo.classList.remove('show');
        }
        
        // Cerrar menú si está abierto
        if (this.floatingNavMenu?.classList.contains('show')) {
            this.closeFloatingMenu();
        }
    }

    /**
     * Actualiza la visibilidad del botón scroll to top
     */
    updateScrollToTopVisibility() {
        if (!this.scrollToTopBtn) return;
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const heroSection = document.querySelector('.hero');
        const heroHeight = heroSection ? heroSection.offsetHeight : 300;
        if (scrollTop > heroHeight) {
            this.scrollToTopBtn.classList.add('show');
        } else {
            this.scrollToTopBtn.classList.remove('show');
        }
    }

    /**
     * Para debugging: estadísticas
     */
    getStats() {
        return {
            navLinks: this.navLinks.length,
            floatingNavItems: this.floatingNavItems.length,
            scrollToTopBtn: !!this.scrollToTopBtn
        };
    }
}

export default NavigationManager; 