# 🏗️ Arquitectura JavaScript - Patrón Manager

## 📋 Descripción General

La aplicación Plumii Landing Page utiliza una arquitectura modular basada en el **patrón Manager**, que centraliza y organiza la gestión de diferentes funcionalidades del sitio web.

## 🎯 Beneficios del Patrón Manager

- **Modularidad**: Cada funcionalidad está encapsulada en su propio manager
- **Mantenibilidad**: Código organizado y fácil de mantener
- **Reutilización**: Managers pueden ser reutilizados en otros proyectos
- **Escalabilidad**: Fácil agregar nuevas funcionalidades
- **Testing**: Cada manager puede ser testeado independientemente

## 📁 Estructura de Archivos

```
assets/js/
├── App.js                    # Clase principal que orquesta todos los managers
├── managers/
│   ├── NavigationManager.js  # Maneja navegación y scroll
│   ├── ContactManager.js     # Maneja WhatsApp y contacto
│   ├── AnimationManager.js   # Maneja animaciones y efectos
│   └── PerformanceManager.js # Maneja optimizaciones de rendimiento
└── README.md                # Esta documentación
```

## 🔧 Managers Implementados

### 1. NavigationManager
**Responsabilidades:**
- Smooth scroll entre secciones
- Navegación principal y flotante
- Control de visibilidad de elementos flotantes
- Botón "Scroll to Top"
- Comportamiento responsive

**Métodos principales:**
```javascript
- setupSmoothScroll()      // Configura navegación suave
- toggleFloatingMenu()     // Alterna menú flotante
- checkScreenSize()        // Controla visibilidad responsive
- scrollToSection()        // Scroll a sección específica
```

### 2. ContactManager
**Responsabilidades:**
- Botón de WhatsApp con tooltip
- Botones de contacto en navegación
- CTA del hero
- Rotación de mensajes en tooltip
- Configuración de WhatsApp

**Métodos principales:**
```javascript
- setupWhatsAppButton()    // Configura botón WhatsApp
- openWhatsAppChat()       // Abre chat de WhatsApp
- changeTooltipMessage()   // Cambia mensaje del tooltip
- updateWhatsAppConfig()   // Actualiza configuración
```

### 3. AnimationManager
**Responsabilidades:**
- Animaciones de scroll
- Efectos hover y transiciones
- Esferas que siguen al mouse
- Animaciones de entrada de elementos
- Efectos visuales especiales

**Métodos principales:**
```javascript
- setupMouseSpheres()      // Configura esferas del mouse
- animateElement()         // Anima elemento específico
- setupScrollAnimations()  // Configura animaciones de scroll
- applyShimmerEffect()     // Aplica efecto shimmer
```

### 4. PerformanceManager
**Responsabilidades:**
- Lazy loading de imágenes
- Throttling y debouncing
- Monitoreo de rendimiento
- Optimización de recursos
- Cache de datos

**Métodos principales:**
```javascript
- setupLazyLoading()       // Configura lazy loading
- throttle()              // Función throttle
- debounce()              // Función debounce
- optimizeAnimations()    // Optimiza animaciones
```

## 🚀 Clase App Principal

La clase `App` actúa como orquestador principal:

### Inicialización
```javascript
// La aplicación se inicializa automáticamente
window.PlumiiApp = new App();
```

### Acceso a Managers
```javascript
// Obtener manager específico
const navManager = window.PlumiiApp.getManager('navigation');
const contactManager = window.PlumiiApp.getManager('contact');

// Obtener todos los managers
const allManagers = window.PlumiiApp.getAllManagers();
```

### Eventos Personalizados
```javascript
// Escuchar eventos de la aplicación
window.PlumiiApp.on('app:initialized', () => {
    console.log('Aplicación inicializada');
});

// Emitir eventos personalizados
window.PlumiiApp.emit('custom:event', { data: 'value' });
```

## 🛠️ Utilidades Globales

### PlumiiUtils
```javascript
// Logging
window.PlumiiUtils.log('Mensaje', 'info|warn|error|success');

// Estadísticas
const stats = window.PlumiiUtils.getStats();

// Acceso a managers
const manager = window.PlumiiUtils.getManager('navigation');

// Reiniciar aplicación
window.PlumiiUtils.restart();
```

### PlumiiDebug (solo en modo debug)
```javascript
// Activar modo debug
window.PlumiiConfig.debug = true;

// Funciones de debug disponibles
window.PlumiiDebug.getStats();
window.PlumiiDebug.getManager('navigation');
window.PlumiiDebug.restart();
window.PlumiiDebug.log('Mensaje de debug');
```

## 📊 Configuración

### PlumiiConfig
```javascript
window.PlumiiConfig = {
    debug: false,           // Modo debug
    version: '1.0.0',       // Versión de la app
    environment: 'production' // Entorno
};
```

## 🔄 Ciclo de Vida

### 1. Inicialización
```javascript
// DOMContentLoaded → validateDependencies() → validateDOM() → initializeManagers()
```

### 2. Ejecución
```javascript
// Los managers funcionan independientemente
// La App coordina eventos globales
```

### 3. Destrucción
```javascript
// beforeunload → destroy() → cleanup() → clear managers
```

## 🎨 Personalización

### Agregar Nuevo Manager
1. Crear archivo en `managers/NuevoManager.js`
2. Implementar métodos estándar (`init`, `destroy`, etc.)
3. Registrar en `App.js` en `initializeManagers()`

### Ejemplo de Manager Personalizado
```javascript
class CustomManager {
    constructor() {
        this.init();
    }

    init() {
        // Inicialización
    }

    destroy() {
        // Limpieza
    }

    getStats() {
        // Estadísticas
    }
}
```

## 🐛 Debugging

### Modo Debug
```javascript
// Activar en consola
window.PlumiiConfig.debug = true;
window.location.reload();
```

### Logs Disponibles
- `[Plumii timestamp]` - Logs generales
- `[Plumii timestamp] ✅` - Éxitos
- `[Plumii timestamp] ❌` - Errores
- `[Plumii timestamp] ⚠️` - Advertencias

### Estadísticas en Tiempo Real
```javascript
// Ver estadísticas completas
console.log(window.PlumiiUtils.getStats());

// Ver stats de manager específico
const navManager = window.PlumiiUtils.getManager('navigation');
console.log(navManager.getStats());
```

## 🔧 Mantenimiento

### Agregar Funcionalidad
1. Identificar el manager apropiado
2. Agregar método al manager
3. Documentar la funcionalidad
4. Probar en diferentes dispositivos

### Optimización
1. Usar `PerformanceManager` para métricas
2. Monitorear uso de memoria
3. Optimizar animaciones con `will-change`
4. Implementar lazy loading donde sea necesario

## 📱 Compatibilidad

### Navegadores Soportados
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

### Características Requeridas
- ES6 Modules
- IntersectionObserver
- Promise
- Map/Set
- CustomEvent

## 🚀 Próximas Mejoras

- [ ] Sistema de plugins
- [ ] Cache inteligente
- [ ] Métricas avanzadas
- [ ] Testing automatizado
- [ ] Documentación interactiva

---

**Desarrollado con ❤️ para Plumii** 