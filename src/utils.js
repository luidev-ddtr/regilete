// Ocultar feedback y pasos
export function hideFeedback(topic) {
document.getElementById(`${topic}-feedback`).style.display = 'none'
document.getElementById(`${topic}-steps`).style.display = 'none'
document.getElementById(`${topic}-hint`).style.display = 'none'
}



// Mostrar pista
export function showHint(topic) {
const hintElement = document.getElementById(`${topic}-hint`)
hintElement.style.display = 'block'
}
