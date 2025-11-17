// ============================================
// progress.js - Lógica de manejo de progreso
// ============================================

export function loadProgress(appState, updateUICallback) {
    const savedProgress = localStorage.getItem('algebraProgress');
    if (savedProgress) {
        const loadedProgress = JSON.parse(savedProgress);
        for (const topic in appState.progress) {
            if (loadedProgress[topic]) {
                appState.progress[topic] = { 
                    ...appState.progress[topic], 
                    ...loadedProgress[topic] 
                };
            }
        }
        updateUICallback();
    } 
}

export function saveProgress(appState) {
    localStorage.setItem(
        'algebraProgress',
        JSON.stringify(appState.progress)
    );
}