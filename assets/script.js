/**
 * Plumii Landing Page - Script Principal
 * Arquitectura modular basada en el patrón Manager
 */

// Importar la aplicación principal
import App from './js/App.js';

// Configuración global
window.PlumiiConfig = {
    debug: false, // Cambiar a true para modo debug
    version: '1.0.0',
    environment: 'production'
};

// Función de utilidad para logging
function log(message, type = 'info') {
    if (window.PlumiiConfig.debug || type === 'error') {
        const timestamp = new Date().toISOString();
        const prefix = `[Plumii ${timestamp}]`;
        
        switch (type) {
            case 'error':
                console.error(prefix, message);
                break;
            case 'warn':
                console.warn(prefix, message);
                break;
            case 'success':
                console.log(prefix, '✅', message);
                break;
            default:
                console.log(prefix, message);
        }
    }
}

// Función de utilidad para manejo de errores
function handleError(error, context = '') {
    log(`Error en ${context}: ${error.message}`, 'error');
    
    // En producción, enviar error a servicio de monitoreo
    if (window.PlumiiConfig.environment === 'production') {
        // Aquí se puede implementar envío a Sentry, LogRocket, etc.
        console.error('Error reportado:', {
            message: error.message,
            stack: error.stack,
            context,
            url: window.location.href,
            userAgent: navigator.userAgent
        });
    }
}

// Función de utilidad para validar dependencias
function validateDependencies() {
    const required = [
        'IntersectionObserver',
        'Promise',
        'Map',
        'Set'
    ];
    
    const missing = required.filter(feature => !(feature in window));
    
    if (missing.length > 0) {
        throw new Error(`Navegador no compatible. Faltan: ${missing.join(', ')}`);
    }
    
    return true;
}

// Función de utilidad para verificar elementos del DOM
function validateDOM() {
    const requiredElements = [
        'hero',
        'about',
        'services',
        'values',
        'features',
        'community'
    ];
    
    const missing = requiredElements.filter(id => !document.getElementById(id));
    
    if (missing.length > 0) {
        log(`Elementos faltantes en el DOM: ${missing.join(', ')}`, 'warn');
    }
    
    return missing.length === 0;
}

// Función de inicialización principal
async function initializePlumii() {
    try {
        log('Iniciando Plumii Landing Page...', 'info');
        
        // Validar dependencias
        validateDependencies();
        log('Dependencias validadas', 'success');
        
        // Validar DOM
        validateDOM();
        log('DOM validado', 'success');
        
        // La aplicación se inicializa automáticamente
        // El App.js maneja toda la lógica de inicialización
        
        log('Plumii Landing Page iniciado correctamente', 'success');
        
    } catch (error) {
        handleError(error, 'initializePlumii');
        
        // Mostrar mensaje de error al usuario
        showFatalError('Error al cargar la página. Por favor, recarga.');
    }
}

// Función para mostrar error fatal
function showFatalError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.innerHTML = `
        <div style="
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 99999;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            color: white;
        ">
            <div style="
                text-align: center;
                padding: 2rem;
                background: rgba(255, 255, 255, 0.1);
                border-radius: 1rem;
                backdrop-filter: blur(10px);
                max-width: 500px;
                margin: 1rem;
            ">
                <h1 style="margin: 0 0 1rem 0; font-size: 2rem;">⚠️ Error</h1>
                <p style="margin: 0 0 2rem 0; font-size: 1.1rem; opacity: 0.9;">${message}</p>
                <button onclick="location.reload()" style="
                    background: white;
                    color: #667eea;
                    border: none;
                    padding: 0.75rem 1.5rem;
                    border-radius: 0.5rem;
                    font-size: 1rem;
                    cursor: pointer;
                    transition: all 0.3s ease;
                " onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
                    🔄 Recargar página
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(errorDiv);
}

// Función para obtener estadísticas de la aplicación
function getAppStats() {
    if (window.PlumiiApp) {
        return window.PlumiiApp.getStats();
    }
    return { error: 'Aplicación no inicializada' };
}

// Función para acceder a managers específicos
function getManager(name) {
    if (window.PlumiiApp) {
        return window.PlumiiApp.getManager(name);
    }
    return null;
}

// Función para reiniciar la aplicación
function restartApp() {
    if (window.PlumiiApp) {
        window.PlumiiApp.destroy();
        delete window.PlumiiApp;
    }
    
    // Reinicializar
    setTimeout(() => {
        window.PlumiiApp = new App();
    }, 100);
}

// Exponer funciones útiles globalmente
window.PlumiiUtils = {
    log,
    getStats: getAppStats,
    getManager,
    restart: restartApp,
    config: window.PlumiiConfig
};

// Event listeners para debugging
if (window.PlumiiConfig.debug) {
    // Exponer funciones de debug
    window.PlumiiDebug = {
        getStats: getAppStats,
        getManager,
        restart: restartApp,
        log: (msg) => log(msg, 'info')
    };
    
    // Log de eventos importantes
    document.addEventListener('app:initialized', () => {
        log('Aplicación inicializada - Debug mode activo', 'success');
    });
}

// === Institution Carousel (único bloque, centrado real y funcional) ===
document.addEventListener('DOMContentLoaded', () => {
    const carousel = document.getElementById('institutionCarousel');
    if (!carousel) return;
    const track = document.getElementById('institutionCarouselTrack');
    const slides = Array.from(track.children);
    const prevBtn = document.getElementById('institutionCarouselPrev');
    const nextBtn = document.getElementById('institutionCarouselNext');
    const dots = Array.from(document.querySelectorAll('#institutionCarouselDots .institution-carousel__dot'));
    let current = 1; // Empieza en el primer slide real

    let autoplayTimer = null;

    function clearAutoplay() {
        if (autoplayTimer) {
            clearTimeout(autoplayTimer);
            autoplayTimer = null;
        }
    }

    function startAutoplay() {
        clearAutoplay();
        autoplayTimer = setTimeout(() => {
            goTo(current + 1);
        }, 2000);
    }

    // Carousel infinito: clonar primer y último slide
    const firstClone = slides[0].cloneNode(true);
    const lastClone = slides[slides.length - 1].cloneNode(true);
    track.appendChild(firstClone);
    track.insertBefore(lastClone, slides[0]);
    const allSlides = Array.from(track.children); // Incluye clones

    function getCardWidth() {
        return allSlides[1].offsetWidth; // El primer real
    }
    function getGap() {
        const style = window.getComputedStyle(track);
        return parseFloat(style.gap) || 0;
    }
    function goTo(index, instant = false) {
        if (index < 1) {
            current = 0;
            updateCarousel();
            setTimeout(() => {
                // Salto instantáneo al último real
                track.style.transition = 'none';
                current = allSlides.length - 2;
                updateCarousel();
                // Forzar reflow para que el navegador aplique el cambio
                void track.offsetWidth;
                track.style.transition = '';
            }, 400);
            return;
        } else if (index > allSlides.length - 2) {
            current = allSlides.length - 1;
            updateCarousel();
            setTimeout(() => {
                track.style.transition = 'none';
                current = 1;
                updateCarousel();
                void track.offsetWidth;
                track.style.transition = '';
            }, 400);
            return;
        } else {
            current = index;
            updateCarousel();
        }
    }
    function updateCarousel() {
        const cardWidth = getCardWidth();
        const gap = getGap();
        const containerWidth = carousel.offsetWidth;
        const sidePad = (containerWidth - cardWidth) / 2;
        track.style.paddingLeft = sidePad + 'px';
        track.style.paddingRight = sidePad + 'px';
        const offset = (cardWidth + gap) * current;
        track.style.transform = `translateX(-${offset}px)`;
        allSlides.forEach((slide, i) => {
            slide.classList.remove('active', 'prev', 'next');
        });
        // Solo marcar las reales
        const realSlides = allSlides.slice(1, allSlides.length - 1);
        const realIndex = current - 1;
        realSlides.forEach((slide, i) => {
            if (i === realIndex) slide.classList.add('active');
            else if (i === realIndex - 1) slide.classList.add('prev');
            else if (i === realIndex + 1) slide.classList.add('next');
        });
        if (dots) {
            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === realIndex);
                dot.setAttribute('aria-current', i === realIndex ? 'true' : 'false');
            });
        }
        startAutoplay();
    }
    // Click en cards no activas
    allSlides.forEach((slide, i) => {
        slide.onclick = null;
        slide.addEventListener('click', () => {
            // Solo permitir clicks en reales
            if (i > 0 && i < allSlides.length - 1 && (i !== current)) goTo(i);
            else startAutoplay();
        });
    });
    // Dots de navegación
    dots.forEach((dot, i) => {
        dot.onclick = null;
        dot.addEventListener('click', (e) => {
            e.stopPropagation();
            goTo(i + 1);
            startAutoplay();
        });
    });
    prevBtn.addEventListener('click', () => {
        goTo(current - 1);
        startAutoplay();
    });
    nextBtn.addEventListener('click', () => {
        goTo(current + 1);
        startAutoplay();
    });
    window.addEventListener('resize', () => {
        updateCarousel();
        startAutoplay();
    });
    // Swipe support for mobile
    let startX = null;
    track.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
    });
    track.addEventListener('touchend', (e) => {
        if (startX === null) return;
        const endX = e.changedTouches[0].clientX;
        if (endX - startX > 40) goTo(current - 1);
        else if (startX - endX > 40) goTo(current + 1);
        startX = null;
        startAutoplay();
    });
    setTimeout(() => {
        updateCarousel();
        // Salto inicial para que el primer real esté centrado
        track.style.transition = 'none';
        updateCarousel();
        void track.offsetWidth;
        track.style.transition = '';
    }, 50);
});

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializePlumii);
} else {
    initializePlumii();
}

// Manejar errores no capturados
window.addEventListener('error', (event) => {
    handleError(event.error, 'Global Error Handler');
});

window.addEventListener('unhandledrejection', (event) => {
    handleError(event.reason, 'Unhandled Promise Rejection');
});

// Exportar para uso modular
export {
    initializePlumii,
    getAppStats,
    getManager,
    restartApp,
    log,
    handleError
};
