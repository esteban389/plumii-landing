/**
 * ContactManager - Gestiona toda la funcionalidad de contacto
 * Maneja WhatsApp, botones de contacto y tooltips
 */
class ContactManager {
    constructor() {
        this.whatsappButton = document.getElementById('whatsappButton');
        this.whatsappTooltip = document.getElementById('whatsappTooltip');
        this.navContactBtn = document.getElementById('navContactBtn');
        this.floatingNavContact = document.getElementById('floatingNavContact');
        this.heroCTA = document.getElementById('heroCTA');
        
        // Configuración de WhatsApp
        this.whatsappConfig = {
            phoneNumber: '+573001234567', // Reemplazar con número real
            defaultMessage: 'Hola, me interesa conocer más sobre Plumii. ¿Podrían brindarme más información?'
        };
        
        // Banco de mensajes para tooltip
        this.tooltipMessages = [
            '¿Tienes dudas? Nosotros tenemos respuestas',
            '¡Conecta con nosotros ahora!',
            'Estamos aquí para ayudarte',
            '¿Necesitas información? ¡Escríbenos!',
            'Tu consulta es importante para nosotros',
            '¡Hablemos sobre educación inteligente!',
            '¿Listo para transformar tu institución?',
            'Descubre el futuro de la educación'
        ];
        
        this.currentMessageIndex = 0;
        this.messageChangeInterval = null;
        
        this.init();
    }

    init() {
        this.setupWhatsAppButton();
        this.setupContactButtons();
        this.setupTooltipRotation();
        this.setupHeroCTA();
    }

    /**
     * Configura el botón de WhatsApp
     */
    setupWhatsAppButton() {
        if (this.whatsappButton) {
            // Mostrar botón después de 5 segundos
            setTimeout(() => {
                this.showWhatsAppButton();
                this.showTooltip(); // Mostrar tooltip automáticamente
            }, 5000);

            // Event listener para click
            this.whatsappButton.addEventListener('click', () => {
                this.openWhatsAppChat();
            });

            // Event listeners para tooltip (opcional: mantener hover, pero no ocultar al salir)
            this.whatsappButton.addEventListener('mouseenter', () => {
                this.showTooltip();
            });
            // Eliminar hideTooltip en mouseleave para que el tooltip permanezca visible
        }
    }

    /**
     * Configura los botones de contacto
     */
    setupContactButtons() {
        const contactButtons = [this.navContactBtn, this.floatingNavContact];
        
        contactButtons.forEach(button => {
            if (button) {
                button.addEventListener('click', () => {
                    this.openWhatsAppChat();
                });
            }
        });
    }

    /**
     * Configura el CTA del hero
     */
    setupHeroCTA() {
        if (this.heroCTA) {
            this.heroCTA.addEventListener('click', () => {
                // Mostrar WhatsApp inmediatamente al hacer clic en CTA
                this.showWhatsAppButton();
                
                // Scroll suave a la siguiente sección
                const aboutSection = document.getElementById('about');
                if (aboutSection) {
                    aboutSection.scrollIntoView({ behavior: 'smooth' });
                }
            });
        }
    }

    /**
     * Configura la rotación de mensajes del tooltip
     */
    setupTooltipRotation() {
        if (this.whatsappTooltip) {
            // Cambiar mensaje cada 4 segundos
            this.messageChangeInterval = setInterval(() => {
                this.changeTooltipMessage();
            }, 4000);
        }
    }

    /**
     * Muestra el botón de WhatsApp y el tooltip juntos, con animación
     */
    showWhatsAppButton() {
        if (this.whatsappButton) {
            this.whatsappButton.style.opacity = '1';
            this.whatsappButton.style.visibility = 'visible';
            this.whatsappButton.style.transform = 'scale(1)';
        }
        this.showTooltip(); // Mostrar tooltip exactamente al mismo tiempo
    }

    /**
     * Muestra el tooltip con animación
     */
    showTooltip() {
        if (this.whatsappTooltip) {
            this.whatsappTooltip.style.transition = 'opacity 0.4s cubic-bezier(0.25,0.46,0.45,0.94), transform 0.4s cubic-bezier(0.25,0.46,0.45,0.94)';
            this.whatsappTooltip.style.opacity = '1';
            this.whatsappTooltip.style.visibility = 'visible';
            this.whatsappTooltip.style.transform = 'translateX(0) scale(1)';
        }
    }

    /**
     * Oculta el tooltip (solo si se desea en móvil o explícitamente)
     */
    hideTooltip() {
        if (this.whatsappTooltip) {
            this.whatsappTooltip.style.opacity = '0';
            this.whatsappTooltip.style.visibility = 'hidden';
            this.whatsappTooltip.style.transform = 'translateX(10px) scale(0.8)';
        }
    }

    /**
     * Cambia el mensaje del tooltip
     */
    changeTooltipMessage() {
        if (this.whatsappTooltip && this.tooltipMessages.length > 0) {
            // Ocultar tooltip temporalmente
            this.whatsappTooltip.style.opacity = '0';
            this.whatsappTooltip.style.transform = 'translateX(10px) scale(0.8)';
            
            setTimeout(() => {
                // Cambiar mensaje
                this.currentMessageIndex = (this.currentMessageIndex + 1) % this.tooltipMessages.length;
                this.whatsappTooltip.textContent = this.tooltipMessages[this.currentMessageIndex];
                
                // Mostrar tooltip con nuevo mensaje
                this.whatsappTooltip.style.opacity = '1';
                this.whatsappTooltip.style.transform = 'translateX(0) scale(1)';
            }, 200);
        }
    }

    /**
     * Obtiene un mensaje aleatorio del banco
     */
    getRandomMessage() {
        if (this.tooltipMessages.length === 0) return '';
        return this.tooltipMessages[Math.floor(Math.random() * this.tooltipMessages.length)];
    }

    /**
     * Actualiza la configuración de WhatsApp
     */
    updateWhatsAppConfig(phoneNumber, message) {
        this.whatsappConfig.phoneNumber = phoneNumber;
        this.whatsappConfig.defaultMessage = message;
    }

    /**
     * Agrega nuevos mensajes al banco de tooltips
     */
    addTooltipMessages(messages) {
        this.tooltipMessages.push(...messages);
    }

    /**
     * Limpia los intervalos al destruir
     */
    destroy() {
        if (this.messageChangeInterval) {
            clearInterval(this.messageChangeInterval);
        }
    }
}

export default ContactManager; 