

// Cargar progreso desde localStorage
export function loadProgress(appState) {
const savedProgress = localStorage.getItem('algebraProgress')
if (savedProgress) {
    appState.progress = JSON.parse(savedProgress)
    updateProgressBars(appState)
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
    const progress = appState.progress[topic]
    const percentage =
    progress.total > 0
        ? Math.round((progress.correct / progress.total) * 100)
        : 0

    document.getElementById(
    `${topic}-progress`
    ).textContent = `${percentage}%`
    document.getElementById(
    `${topic}-progress-bar`
    ).style.width = `${percentage}%`
    document.getElementById(`${topic}-correct`).textContent =
    progress.correct
    document.getElementById(`${topic}-total`).textContent = progress.total
}
}