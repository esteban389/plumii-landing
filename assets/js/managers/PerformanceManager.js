/**
 * PerformanceManager - Gestiona optimizaciones de rendimiento
 * Maneja lazy loading, throttling, debouncing y gestión de recursos
 */
class PerformanceManager {
    constructor() {
        this.images = document.querySelectorAll('img[data-src]');
        this.observers = new Map();
        this.throttledFunctions = new Map();
        this.debouncedFunctions = new Map();
        this.resourceCache = new Map();
        
        this.init();
    }

    init() {
        this.setupLazyLoading();
        this.setupPerformanceMonitoring();
        this.setupResourceOptimization();
    }

    /**
     * Configura lazy loading para imágenes
     */
    setupLazyLoading() {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.loadImage(entry.target);
                        observer.unobserve(entry.target);
                    }
                });
            }, {
                rootMargin: '50px 0px',
                threshold: 0.01
            });

            this.images.forEach(img => {
                imageObserver.observe(img);
            });
        } else {
            // Fallback para navegadores que no soportan IntersectionObserver
            this.loadAllImages();
        }
    }

    /**
     * Carga una imagen específica
     */
    loadImage(img) {
        const src = img.getAttribute('data-src');
        if (!src) return;

        // Crear nueva imagen para precarga
        const tempImage = new Image();
        
        tempImage.onload = () => {
            img.src = src;
            img.classList.add('loaded');
            img.removeAttribute('data-src');
        };

        tempImage.onerror = () => {
            img.classList.add('error');
            console.warn(`Failed to load image: ${src}`);
        };

        tempImage.src = src;
    }

    /**
     * Carga todas las imágenes (fallback)
     */
    loadAllImages() {
        this.images.forEach(img => {
            this.loadImage(img);
        });
    }

    /**
     * Configura monitoreo de rendimiento
     */
    setupPerformanceMonitoring() {
        // Monitorear métricas de rendimiento
        if ('performance' in window) {
            this.observePerformanceMetrics();
        }

        // Monitorear eventos de scroll y resize con throttling
        this.setupThrottledEvents();
    }

    /**
     * Observa métricas de rendimiento
     */
    observePerformanceMetrics() {
        // Observar métricas web vitals si están disponibles
        if ('PerformanceObserver' in window) {
            try {
                const observer = new PerformanceObserver((list) => {
                    list.getEntries().forEach((entry) => {
                        this.handlePerformanceMetric(entry);
                    });
                });

                observer.observe({ entryTypes: ['navigation', 'resource'] });
            } catch (e) {
                console.warn('PerformanceObserver not supported:', e);
            }
        }
    }

    /**
     * Maneja métricas de rendimiento
     */
    handlePerformanceMetric(entry) {
        switch (entry.entryType) {
            case 'navigation':
                this.logNavigationMetrics(entry);
                break;
            case 'resource':
                this.logResourceMetrics(entry);
                break;
        }
    }

    /**
     * Registra métricas de navegación
     */
    logNavigationMetrics(entry) {
        const metrics = {
            domContentLoaded: entry.domContentLoadedEventEnd - entry.domContentLoadedEventStart,
            loadComplete: entry.loadEventEnd - entry.loadEventStart,
            domInteractive: entry.domInteractive - entry.fetchStart,
            firstPaint: entry.domContentLoadedEventEnd - entry.fetchStart
        };

        console.log('Navigation Metrics:', metrics);
    }

    /**
     * Registra métricas de recursos
     */
    logResourceMetrics(entry) {
        if (entry.initiatorType === 'img') {
            const loadTime = entry.responseEnd - entry.fetchStart;
            console.log(`Image load time for ${entry.name}: ${loadTime}ms`);
        }
    }

    /**
     * Configura eventos con throttling
     */
    setupThrottledEvents() {
        // Throttle scroll events
        const throttledScroll = this.throttle(() => {
            this.handleScroll();
        }, 16); // ~60fps

        window.addEventListener('scroll', throttledScroll);

        // Throttle resize events
        const throttledResize = this.throttle(() => {
            this.handleResize();
        }, 100);

        window.addEventListener('resize', throttledResize);
    }

    /**
     * Maneja eventos de scroll optimizados
     */
    handleScroll() {
        // Aquí se pueden agregar optimizaciones específicas para scroll
        // Por ejemplo, pausar animaciones cuando no están visibles
    }

    /**
     * Maneja eventos de resize optimizados
     */
    handleResize() {
        // Recalcular layouts y posiciones cuando sea necesario
        this.updateLayouts();
    }

    /**
     * Actualiza layouts después de resize
     */
    updateLayouts() {
        // Forzar reflow solo cuando sea necesario
        requestAnimationFrame(() => {
            // Actualizar posiciones de elementos flotantes
            const floatingElements = document.querySelectorAll('.floating-nav, .floating-logo');
            floatingElements.forEach(el => {
                // Trigger reflow si es necesario
                el.style.transform = el.style.transform;
            });
        });
    }

    /**
     * Configura optimización de recursos
     */
    setupResourceOptimization() {
        // Precargar recursos críticos
        this.preloadCriticalResources();
        
        // Configurar cache de recursos
        this.setupResourceCache();
    }

    /**
     * Precarga recursos críticos
     */
    preloadCriticalResources() {
        const criticalResources = [
            './assets/images/hero.webp',
            './assets/images/logo.webp'
        ];

        criticalResources.forEach(resource => {
            this.preloadResource(resource);
        });
    }

    /**
     * Precarga un recurso específico
     */
    preloadResource(url) {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = this.getResourceType(url);
        link.href = url;
        document.head.appendChild(link);
    }

    /**
     * Determina el tipo de recurso basado en la URL
     */
    getResourceType(url) {
        if (url.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i)) {
            return 'image';
        } else if (url.match(/\.(woff|woff2|ttf|eot)$/i)) {
            return 'font';
        } else if (url.match(/\.(css)$/i)) {
            return 'style';
        } else if (url.match(/\.(js)$/i)) {
            return 'script';
        }
        return 'fetch';
    }

    /**
     * Configura cache de recursos
     */
    setupResourceCache() {
        // Cache para datos que se usan frecuentemente
        this.cacheResource('scrollPositions', {});
        this.cacheResource('elementPositions', {});
    }

    /**
     * Cachea un recurso
     */
    cacheResource(key, data) {
        this.resourceCache.set(key, data);
    }

    /**
     * Obtiene un recurso del cache
     */
    getCachedResource(key) {
        return this.resourceCache.get(key);
    }

    /**
     * Función throttle para optimizar eventos frecuentes
     */
    throttle(func, delay) {
        let lastCall = 0;
        return function (...args) {
            const now = Date.now();
            if (now - lastCall >= delay) {
                lastCall = now;
                func.apply(this, args);
            }
        };
    }

    /**
     * Función debounce para optimizar eventos que deben esperar
     */
    debounce(func, delay) {
        let timeoutId;
        return function (...args) {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                func.apply(this, args);
            }, delay);
        };
    }

    /**
     * Optimiza el rendimiento de animaciones
     */
    optimizeAnimations() {
        // Usar transform y opacity para animaciones
        const animatedElements = document.querySelectorAll('.animated');
        animatedElements.forEach(el => {
            el.style.willChange = 'transform, opacity';
        });
    }

    /**
     * Limpia recursos no utilizados
     */
    cleanup() {
        // Limpiar observers
        this.observers.forEach(observer => {
            observer.disconnect();
        });
        this.observers.clear();

        // Limpiar cache
        this.resourceCache.clear();

        // Limpiar funciones throttled/debounced
        this.throttledFunctions.clear();
        this.debouncedFunctions.clear();
    }

    /**
     * Obtiene estadísticas de rendimiento
     */
    getPerformanceStats() {
        return {
            imagesLoaded: this.images.length,
            cachedResources: this.resourceCache.size,
            observers: this.observers.size
        };
    }
}

export default PerformanceManager; 