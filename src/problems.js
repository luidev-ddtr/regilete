import { hideFeedback } from './utils.js'


export function newProblem(topic, problems, appState) {
// Seleccionar un problema aleatorio
    const totalProblems = problems[topic].length;
    const solvedProblems = appState.progress[topic].solvedProblems;

    // Crear una lista de índices de problemas no resueltos
    const unsolvedIndices = [];
    for (let i = 0; i < totalProblems; i++) {
        if (!solvedProblems.includes(i)) {
            unsolvedIndices.push(i);
        }
    }

    if (unsolvedIndices.length > 0) {
        // Seleccionar un índice aleatorio de la lista de no resueltos
        const randomIndex = Math.floor(Math.random() * unsolvedIndices.length);
        const newIndex = unsolvedIndices[randomIndex];

        appState.currentProblem = newIndex;
        showProblem(topic, newIndex, problems, appState);
    } else {
        // Si todos los problemas están resueltos, se puede mostrar un mensaje o deshabilitar el botón
        document.getElementById(`${topic}-problem`).textContent = "¡Has resuelto todos los problemas de este tema!";
        document.getElementById(`new-${topic}`).disabled = true; // Deshabilitar botón
    }
}  

export function showProblem(topic, index, problems, appState) {
const problemData = problems[topic][index]
document.getElementById(
    `${topic}-problem`
).textContent = `\\( ${problemData.problem} \\)`
document.getElementById(`${topic}-answer`).value = ''

 // Habilitar botones por si estaban deshabilitados
 document.getElementById(`new-${topic}`).disabled = false;

// Actualizar MathJax
if (window.MathJax) {
    MathJax.typeset([`#${topic}-problem`])
}

// Ocultar feedback y pasos
hideFeedback(topic)
}
