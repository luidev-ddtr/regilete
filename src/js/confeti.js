// confetti.js - Sistema de confeti para celebraciones

/**
 * Crea efecto de confeti en la pantalla
 * @param {number} duration - Duración en milisegundos
 * @param {number} particleCount - Cantidad de partículas
 */
export function createConfetti(duration = 3000, particleCount = 50) {
    const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff', '#ffa500', '#ff69b4'];
    const shapes = ['●', '■', '▲', '★', '♦'];
    
    for (let i = 0; i < particleCount; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.textContent = shapes[Math.floor(Math.random() * shapes.length)];
            confetti.style.left = Math.random() * 100 + '%';
            confetti.style.color = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.fontSize = (Math.random() * 20 + 10) + 'px';
            confetti.style.animationDuration = (Math.random() * 2 + 2) + 's';
            confetti.style.animationDelay = (Math.random() * 0.5) + 's';
            
            document.body.appendChild(confetti);
            
            // Remover después de la animación
            setTimeout(() => {
                confetti.remove();
            }, duration);
        }, Math.random() * 500);
    }
}

/**
 * Confeti especial para logros de 100%
 */
export function createEpicConfetti() {
    createConfetti(5000, 100);
    
    // Segunda ola de confeti
    setTimeout(() => {
        createConfetti(4000, 80);
    }, 1000);
    
    // Tercera ola más intensa
    setTimeout(() => {
        createConfetti(3000, 60);
    }, 2000);
}

/**
 * Confeti moderado para logros de 75%
 */
export function createMediumConfetti() {
    createConfetti(3000, 50);
    
    // Segunda ola más suave
    setTimeout(() => {
        createConfetti(2000, 30);
    }, 800);
}