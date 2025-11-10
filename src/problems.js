import { hideFeedback } from './utils.js'


export function newProblem(topic) {
// Seleccionar un problema aleatorio
const totalProblems = problems[topic].length
let newIndex
do {
    newIndex = Math.floor(Math.random() * totalProblems)
} while (newIndex === appState.currentProblem && totalProblems > 1)

appState.currentProblem = newIndex
showProblem(topic, newIndex)

// Ocultar feedback y pistas
hideFeedback(topic)
}



export function showProblem(topic, index, problems) {
const problemData = problems[topic][index]
document.getElementById(
    `${topic}-problem`
).textContent = `\\( ${problemData.problem} \\)`
document.getElementById(`${topic}-answer`).value = ''

// Actualizar MathJax
if (window.MathJax) {
    MathJax.typeset([`#${topic}-problem`])
}

// Ocultar feedback y pasos
hideFeedback(topic)
}
