// public/js/toast.js

class ModularToast {
    constructor() {
        this.duration = 3500; // Tempo em milissegundos (3.5s) que o toast fica na tela
        this.init();
    }

    init() {
        // 1. Injeta o CSS nativo apenas uma vez na página
        if (!document.getElementById('modular-toast-styles')) {
            const style = document.createElement('style');
            style.id = 'modular-toast-styles';
            style.innerHTML = `
                .modular-toast-container {
                    position: fixed;
                    bottom: 25px;
                    right: 25px;
                    z-index: 9999;
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                }
                .modular-toast {
                    min-width: 280px;
                    max-width: 400px;
                    color: #ffffff;
                    border-radius: 6px;
                    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
                    overflow: hidden;
                    transform: translateX(120%);
                    transition: transform 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
                    display: flex;
                    flex-direction: column;
                }
                .modular-toast.show {
                    transform: translateX(0);
                }
                .modular-toast.success {
                    background-color: #198754; /* Verde sucesso */
                }
                .modular-toast.error {
                    background-color: #dc3545; /* Vermelho erro */
                }
                .modular-toast-content {
                    padding: 16px 20px;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    font-weight: 600;
                    font-size: 1rem;
                }
                .modular-toast-icon {
                    font-size: 1.3rem;
                }
                /* Fundo da barra */
                .modular-toast-progress-bg {
                    width: 100%;
                    height: 5px;
                    background-color: rgba(255, 255, 255, 0.3);
                }
                /* A barra branca animada que diminui */
                .modular-toast-progress-bar {
                    height: 100%;
                    background-color: #ffffff;
                    width: 100%;
                    transform-origin: left;
                }
                @keyframes shrinkProgress {
                    from { width: 100%; }
                    to { width: 0%; }
                }
            `;
            document.head.appendChild(style);
        }

        // 2. Cria o container global dos toasts se não existir
        if (!document.getElementById('modular-toast-container')) {
            const container = document.createElement('div');
            container.id = 'modular-toast-container';
            container.className = 'modular-toast-container';
            document.body.appendChild(container);
        }
    }

    show(message, type) {
        const container = document.getElementById('modular-toast-container');

        // Cria a estrutura HTML do toast individual
        const toast = document.createElement('div');
        toast.className = `modular-toast ${type}`;

        // Define o ícone do Bootstrap Icons baseado no tipo
        const iconClass = type === 'success' ? 'bi-check-circle-fill' : 'bi-x-circle-fill';

        toast.innerHTML = `
            <div class="modular-toast-content">
                <i class="bi ${iconClass} modular-toast-icon"></i>
                <span>${message}</span>
            </div>
            <div class="modular-toast-progress-bg">
                <div class="modular-toast-progress-bar" style="animation: shrinkProgress ${this.duration}ms linear forwards;"></div>
            </div>
        `;

        // Adiciona na tela
        container.appendChild(toast);

        // Força o navegador a recalcular o layout para a animação de entrada funcionar
        void toast.offsetWidth;

        // Dispara a animação de entrada
        toast.classList.add('show');

        // Lógica de auto-destruição vinculada ao tempo da barra de progresso
        setTimeout(() => {
            toast.classList.remove('show');

            // Aguarda a animação de saída terminar para remover a tag HTML e limpar a RAM
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 400);
        }, this.duration);
    }

    // Métodos rápidos para facilitar a chamada
    success(message) {
        this.show(message, 'success');
    }

    error(message) {
        this.show(message, 'error');
    }
}

// Expõe a instância globalmente para ser chamada de qualquer lugar
const Toast = new ModularToast();