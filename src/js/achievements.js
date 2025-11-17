// achievements.js - Sistema de logros y trofeos

/**
 * Definición de logros por tema
 * Cada logro tiene un umbral, título, icono y mensaje
 */
const ACHIEVEMENTS = {
    operations: [
        { threshold: 25, title: '¡Primeros Pasos!', icon: '🎯', message: '¡Has alcanzado el 25%! Sigues avanzando muy bien.' },
        { threshold: 50, title: '¡A Medio Camino!', icon: '🚀', message: '¡50% completado! Estás en el camino correcto.' },
        { threshold: 75, title: '¡Casi lo Logras!', icon: '🔥', message: '¡75% alcanzado! ¡La victoria está cerca!' },
        { threshold: 100, title: '¡Maestro de Operaciones!', icon: '👑', message: '¡100% completado! ¡Eres un campeón!' }
    ],
    polynomials: [
        { threshold: 25, title: '¡Aprendiz de Polinomios!', icon: '📐', message: '¡25% completado! Los polinomios ya no son un misterio.' },
        { threshold: 50, title: '¡Explorador Algebraico!', icon: '🧭', message: '¡50% alcanzado! Dominas los polinomios.' },
        { threshold: 75, title: '¡Experto en Polinomios!', icon: '⚡', message: '¡75% completado! ¡Impresionante progreso!' },
        { threshold: 100, title: '¡Rey de los Polinomios!', icon: '👑', message: '¡Perfecto! Has dominado los polinomios completamente.' }
    ],
    equations: [
        { threshold: 25, title: '¡Resolviendo Ecuaciones!', icon: '🎲', message: '¡25% completado! Las ecuaciones empiezan a ser fáciles.' },
        { threshold: 50, title: '¡Detective Algebraico!', icon: '🔍', message: '¡50% alcanzado! Encuentras soluciones con facilidad.' },
        { threshold: 75, title: '¡Solucionador Experto!', icon: '💎', message: '¡75% logrado! ¡Eres imparable!' },
        { threshold: 100, title: '¡Maestro de Ecuaciones!', icon: '🏆', message: '¡Perfección total! Has resuelto todas las ecuaciones.' }
    ],
    factoring: [
        { threshold: 25, title: '¡Factorizando con Éxito!', icon: '🧩', message: '¡25% completado! La factorización ya no te asusta.' },
        { threshold: 50, title: '¡Desglosador Algebraico!', icon: '🎪', message: '¡50% alcanzado! Factorizas como un profesional.' },
        { threshold: 75, title: '¡Experto en Factorización!', icon: '✨', message: '¡75% logrado! ¡Tu habilidad es sobresaliente!' },
        { threshold: 100, title: '¡Leyenda de la Factorización!', icon: '🌟', message: '¡100% perfecto! Eres una leyenda del álgebra.' }
    ]
};

/**
 * Almacena los logros ya mostrados para no repetirlos
 */
const shownAchievements = {
    operations: new Set(),
    polynomials: new Set(),
    equations: new Set(),
    factoring: new Set()
};

/**
 * Verifica si se debe mostrar un logro basado en el porcentaje de progreso
 */
export function checkAchievements(topic, percentage, problemsData) {
    const topicAchievements = ACHIEVEMENTS[topic];
    if (!topicAchievements) return;

    // Buscar logros que se han alcanzado pero no se han mostrado
    for (const achievement of topicAchievements) {
        if (percentage >= achievement.threshold && !shownAchievements[topic].has(achievement.threshold)) {
            // Marcar como mostrado
            shownAchievements[topic].add(achievement.threshold);
            
            // Mostrar el logro
            showAchievementNotification(achievement, topic);
            
            // Guardar en localStorage
            saveAchievementProgress(topic, achievement.threshold);
        }
    }
}

/**
 * Muestra la notificación del logro con animación
 */
function showAchievementNotification(achievement, topic) {
    // Crear el elemento de notificación
    const notification = document.createElement('div');
    notification.className = 'achievement-notification';
    notification.innerHTML = `
        <div class="achievement-icon">${achievement.icon}</div>
        <div class="achievement-content">
            <div class="achievement-title">${achievement.title}</div>
            <div class="achievement-message">${achievement.message}</div>
        </div>
    `;

    // Agregar al body
    document.body.appendChild(notification);

    // Reproducir sonido (opcional - puedes comentar si no quieres sonido)
    playAchievementSound(achievement.threshold);

    // Animar entrada
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);

    // Remover después de 8 segundos (el doble de tiempo)
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 500);
    }, 5500);
}

/**
 * Reproduce un sonido de logro (usando Web Audio API)
 */
function playAchievementSound(threshold) {
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        // Diferentes tonos según el umbral
        const frequencies = {
            25: 523.25,  // C5
            50: 659.25,  // E5
            75: 783.99,  // G5
            100: 1046.50 // C6
        };

        oscillator.frequency.value = frequencies[threshold] || 523.25;
        oscillator.type = 'sine';

        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.5);
    } catch (e) {
        // Si hay error con audio, simplemente no reproducir
        console.log('Audio not available');
    }
}

/**
 * Guarda el progreso de logros en localStorage
 */
function saveAchievementProgress(topic, threshold) {
    const key = 'algebraAchievements';
    let saved = JSON.parse(localStorage.getItem(key) || '{}');
    
    if (!saved[topic]) {
        saved[topic] = [];
    }
    
    if (!saved[topic].includes(threshold)) {
        saved[topic].push(threshold);
    }
    
    localStorage.setItem(key, JSON.stringify(saved));
}

/**
 * Carga el progreso de logros desde localStorage
 */
export function loadAchievementProgress() {
    const key = 'algebraAchievements';
    const saved = JSON.parse(localStorage.getItem(key) || '{}');
    
    // Restaurar los logros mostrados
    for (const topic in saved) {
        if (saved[topic] && Array.isArray(saved[topic])) {
            saved[topic].forEach(threshold => {
                shownAchievements[topic].add(threshold);
            });
        }
    }
}

/**
 * Resetea todos los logros (útil para testing o reiniciar progreso)
 */
export function resetAchievements() {
    localStorage.removeItem('algebraAchievements');
    for (const topic in shownAchievements) {
        shownAchievements[topic].clear();
    }
}

/**
 * Obtiene estadísticas de logros desbloqueados
 */
export function getAchievementStats() {
    const stats = {};
    
    for (const topic in ACHIEVEMENTS) {
        const total = ACHIEVEMENTS[topic].length;
        const unlocked = shownAchievements[topic].size;
        stats[topic] = {
            total,
            unlocked,
            percentage: Math.round((unlocked / total) * 100)
        };
    }
    
    return stats;
}