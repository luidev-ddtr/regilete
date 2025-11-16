// Ocultar feedback y pasos
export function hideFeedback(topic) {
document.getElementById(`${topic}-feedback`).style.display = 'none'
document.getElementById(`${topic}-steps`).style.display = 'none'
document.getElementById(`${topic}-hint`).style.display = 'none'
}

// Mostrar pista
export function showHint(topic, problems, appState) {
const hintElement = document.getElementById(`${topic}-hint`)
const hintTextElement = document.getElementById(`${topic}-hint-text`)
const problemData = problems[topic][appState.currentProblem]

if (problemData.hint && hintTextElement) {
    hintTextElement.textContent = problemData.hint
}
hintElement.style.display = 'block'
}
 