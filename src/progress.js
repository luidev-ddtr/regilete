
import problemsData from './data/problems.json';
// Cargar progreso desde localStorage
export function loadProgress(appState, updateProgressBars) {
    const savedProgress = localStorage.getItem('algebraProgress');
    if (savedProgress) {
        const loadedProgress = JSON.parse(savedProgress);
        // Itera sobre los temas en el estado inicial para asegurar la estructura correcta
        for (const topic in appState.progress) {
            if (loadedProgress[topic]) {
                // Combina el progreso guardado con la estructura por defecto
                appState.progress[topic] = { ...appState.progress[topic], ...loadedProgress[topic] };
            }
        }
        updateProgressBars(appState);
    }
}



// Guardar progreso en localStorage
export function saveProgress(appState) {
localStorage.setItem( 
    'algebraProgress',
    JSON.stringify(appState.progress)
)
}


// Actualizar barras de progreso
export function updateProgressBars(appState) {
for (const topic in appState.progress) {
    if (!problemsData[topic]) continue; // Saltar si el tema no tiene problemas (ej. 'practice')

    const progress = appState.progress[topic]
    const totalPossibleScore = problemsData[topic].reduce((sum, problem) => sum + problem.score, 0);

    const percentage = totalPossibleScore > 0 ? Math.min(100, Math.round((progress.score / totalPossibleScore) * 100)) : 0;


    document.getElementById(
    `${topic}-progress`
    ).textContent = `${percentage}%`
    document.getElementById(
    `${topic}-progress-bar`
    ).style.width = `${percentage}%`
    document.getElementById(`${topic}-correct`).textContent = progress.score
    document.getElementById(`${topic}-total`).textContent = progress.total
}
}
