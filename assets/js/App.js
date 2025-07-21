/**
 * App - Clase principal que orquesta toda la aplicación
 * Maneja el ciclo de vida y coordina todos los managers
 */
import NavigationManager from './managers/NavigationManager.js';
import ContactManager from './managers/ContactManager.js';
import AnimationManager from './managers/AnimationManager.js';
import PerformanceManager from './managers/PerformanceManager.js';

class App {
    constructor() {
        this.managers = new Map();
        this.isInitialized = false;
        this.isDestroyed = false;
        
        this.init();
    }

    /**
     * Inicializa la aplicación
     */
    async init() {
        try {
            console.log('🚀 Inicializando Plumii App...');
            
            // Esperar a que el DOM esté listo
            if (document.readyState === 'loading') {
                await new Promise(resolve => {
                    document.addEventListener('DOMContentLoaded', resolve);
                });
            }

            // Inicializar managers en orden de dependencia
            await this.initializeManagers();
            
            // Configurar eventos globales
            this.setupGlobalEvents();
            
            // Marcar como inicializada
            this.isInitialized = true;
            
            console.log('✅ Plumii App inicializada correctamente');
            
            // Emitir evento de inicialización
            this.emit('app:initialized');
            
        } catch (error) {
            console.error('❌ Error al inicializar la aplicación:', error);
            this.handleInitializationError(error);
        }
    }

    /**
     * Inicializa todos los managers
     */
    async initializeManagers() {
        const managerConfig = [
            {
                name: 'performance',
                class: PerformanceManager,
                priority: 1 // Mayor prioridad
            },
            {
                name: 'navigation',
                class: NavigationManager,
                priority: 2
            },
            {
                name: 'contact',
                class: ContactManager,
                priority: 3
            },
            {
                name: 'animation',
                class: AnimationManager,
                priority: 4 // Menor prioridad
            }
        ];

        // Ordenar por prioridad
        managerConfig.sort((a, b) => a.priority - b.priority);

        // Inicializar managers
        for (const config of managerConfig) {
            try {
                console.log(`📦 Inicializando ${config.name} manager...`);
                const manager = new config.class();
                this.managers.set(config.name, manager);
                console.log(`✅ ${config.name} manager inicializado`);
            } catch (error) {
                console.error(`❌ Error al inicializar ${config.name} manager:`, error);
                // Continuar con otros managers
            }
        }
    }

    /**
     * Configura eventos globales
     */
    setupGlobalEvents() {
        // Evento de visibilidad de página
        document.addEventListener('visibilitychange', () => {
            this.handleVisibilityChange();
        });

        // Evento de resize
        window.addEventListener('resize', () => {
            this.handleResize();
        });

        // Evento de scroll
        window.addEventListener('scroll', () => {
            this.handleScroll();
        });

        // Evento de beforeunload
        window.addEventListener('beforeunload', () => {
            this.handleBeforeUnload();
        });

        // Evento de error global
        window.addEventListener('error', (event) => {
            this.handleGlobalError(event);
        });

        // Evento de unhandledrejection
        window.addEventListener('unhandledrejection', (event) => {
            this.handleUnhandledRejection(event);
        });
    }

    /**
     * Maneja cambios de visibilidad de la página
     */
    handleVisibilityChange() {
        const isVisible = !document.hidden;
        
        if (isVisible) {
            this.resumeApp();
        } else {
            this.pauseApp();
        }
    }

    /**
     * Maneja eventos de resize
     */
    handleResize() {
        // Notificar a los managers sobre el resize
        this.managers.forEach(manager => {
            if (typeof manager.handleResize === 'function') {
                manager.handleResize();
            }
        });
    }

    /**
     * Maneja eventos de scroll
     */
    handleScroll() {
        // Notificar a los managers sobre el scroll
        this.managers.forEach(manager => {
            if (typeof manager.handleScroll === 'function') {
                manager.handleScroll();
            }
        });
    }

    /**
     * Maneja el evento beforeunload
     */
    handleBeforeUnload() {
        this.destroy();
    }

    /**
     * Maneja errores globales
     */
    handleGlobalError(event) {
        console.error('🚨 Error global detectado:', event.error);
        this.handleError(event.error);
    }

    /**
     * Maneja promesas rechazadas no manejadas
     */
    handleUnhandledRejection(event) {
        console.error('🚨 Promesa rechazada no manejada:', event.reason);
        this.handleError(event.reason);
    }

    /**
     * Maneja errores de inicialización
     */
    handleInitializationError(error) {
        console.error('❌ Error crítico de inicialización:', error);
        
        // Mostrar mensaje de error al usuario
        this.showErrorMessage('Error al cargar la aplicación. Por favor, recarga la página.');
    }

    /**
     * Maneja errores generales
     */
    handleError(error) {
        console.error('🚨 Error en la aplicación:', error);
        
        // Aquí se puede implementar logging de errores
        // Por ejemplo, enviar a un servicio de monitoreo
    }

    /**
     * Muestra mensaje de error al usuario
     */
    showErrorMessage(message) {
        // Crear elemento de error
        const errorElement = document.createElement('div');
        errorElement.className = 'app-error';
        errorElement.innerHTML = `
            <div class="app-error__content">
                <h3>⚠️ Error</h3>
                <p>${message}</p>
                <button onclick="location.reload()">Recargar página</button>
            </div>
        `;
        
        // Agregar estilos
        errorElement.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            color: white;
            font-family: Arial, sans-serif;
        `;
        
        document.body.appendChild(errorElement);
    }

    /**
     * Pausa la aplicación
     */
    pauseApp() {
        console.log('⏸️ Pausando aplicación...');
        
        this.managers.forEach(manager => {
            if (typeof manager.pause === 'function') {
                manager.pause();
            }
        });
    }

    /**
     * Reanuda la aplicación
     */
    resumeApp() {
        console.log('▶️ Reanudando aplicación...');
        
        this.managers.forEach(manager => {
            if (typeof manager.resume === 'function') {
                manager.resume();
            }
        });
    }

    /**
     * Obtiene un manager específico
     */
    getManager(name) {
        return this.managers.get(name);
    }

    /**
     * Obtiene todos los managers
     */
    getAllManagers() {
        return this.managers;
    }

    /**
     * Emite un evento personalizado
     */
    emit(eventName, data = null) {
        const event = new CustomEvent(eventName, {
            detail: data,
            bubbles: true
        });
        document.dispatchEvent(event);
    }

    /**
     * Escucha eventos personalizados
     */
    on(eventName, callback) {
        document.addEventListener(eventName, (event) => {
            callback(event.detail);
        });
    }

    /**
     * Obtiene estadísticas de la aplicación
     */
    getStats() {
        const stats = {
            isInitialized: this.isInitialized,
            isDestroyed: this.isDestroyed,
            managersCount: this.managers.size,
            managers: {}
        };

        // Obtener stats de cada manager
        this.managers.forEach((manager, name) => {
            if (typeof manager.getStats === 'function') {
                stats.managers[name] = manager.getStats();
            }
        });

        return stats;
    }

    /**
     * Destruye la aplicación y limpia recursos
     */
    destroy() {
        if (this.isDestroyed) return;
        
        console.log('🗑️ Destruyendo aplicación...');
        
        // Destruir managers
        this.managers.forEach((manager, name) => {
            try {
                if (typeof manager.destroy === 'function') {
                    manager.destroy();
                }
                console.log(`✅ ${name} manager destruido`);
            } catch (error) {
                console.error(`❌ Error al destruir ${name} manager:`, error);
            }
        });

        // Limpiar managers
        this.managers.clear();
        
        // Marcar como destruida
        this.isDestroyed = true;
        this.isInitialized = false;
        
        console.log('✅ Aplicación destruida correctamente');
    }
}

// Crear instancia global
window.PlumiiApp = new App();

// Exportar para uso modular
export default App; 