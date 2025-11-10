// Datos de problemas para cada tema
//Importacion de los problemas de un .json
import problemsData from './data/problems.json';


//Importacion de las funciones de progress.js
import { loadProgress, saveProgress, updateProgressBars } from './progress.js';

//Importacion de las funciones de problems.js
import { newProblem, showProblem } from './problems.js';

import { hideFeedback, showHint } from './utils.js';

//Verificar que los problemas se cargaron correctamente
//console.log(problemsData);

//Asignacion de los problemas a la variable problems
const problems = problemsData;
// Estado de la aplicación
const appState = {
currentTopic: 'operations', 
currentProblem: 0,
progress: {
    operations: { correct: 0, total: 0 },
    polynomials: { correct: 0, total: 0 },
    equations: { correct: 0, total: 0 },
    factoring: { correct: 0, total: 0 },
},
}

// Inicializar la aplicación
function initApp() {
// Cargar progreso desde localStorage
loadProgress(appState, updateProgressBars)

// Configurar eventos de los temas
document.querySelectorAll('.topic-item').forEach((item) => {
    item.addEventListener('click', function () {
    const topic = this.getAttribute('data-topic')
    switchTopic(topic)
    })
})

// Configurar eventos de los botones
setupEventListeners()

// Mostrar el primer problema
showProblem('operations', 0, problems, appState)

// Actualizar MathJax
if (window.MathJax) {
    MathJax.typeset()
}
}



// Cambiar de tema
function switchTopic(topic) {
// Actualizar tema activo en la UI
document.querySelectorAll('.topic-item').forEach((item) => {
    item.classList.remove('active')
})
document
    .querySelector(`.topic-item[data-topic="${topic}"]`)
    .classList.add('active')

// Actualizar contenido
document.querySelectorAll('.topic-content').forEach((content) => {
    content.classList.remove('active')
})
document.getElementById(`${topic}-content`).classList.add('active')

// Actualizar estado
appState.currentTopic = topic
appState.currentProblem = 0

// Mostrar problema actual
showProblem(topic, 0, problems, appState)

// Ocultar feedback y pasos
hideFeedback(topic)
}

// Configurar event listeners
function setupEventListeners() {
// Operaciones básicas
document
    .getElementById('check-operations')
    .addEventListener('click', () => checkAnswer('operations'))
document
    .getElementById('hint-operations')
    .addEventListener('click', () => showHint('operations', problems, appState))
document
    .getElementById('new-operations')
    .addEventListener('click', () => newProblem('operations', problems, appState))

// Polinomios
document
    .getElementById('check-polynomials')
    .addEventListener('click', () => checkAnswer('polynomials'))
document
    .getElementById('hint-polynomials')
    .addEventListener('click', () => showHint('polynomials', problems, appState))
document
    .getElementById('new-polynomials')
    .addEventListener('click', () => newProblem('polynomials', problems, appState))

// Ecuaciones
document
    .getElementById('check-equations')
    .addEventListener('click', () => checkAnswer('equations'))
document
    .getElementById('hint-equations')
    .addEventListener('click', () => showHint('equations', problems, appState))
document
    .getElementById('new-equations')
    .addEventListener('click', () => newProblem('equations', problems, appState))

// Factorización
document
    .getElementById('check-factoring')
    .addEventListener('click', () => checkAnswer('factoring'))
document
    .getElementById('hint-factoring')
    .addEventListener('click', () => showHint('factoring', problems, appState))
document
    .getElementById('new-factoring')
    .addEventListener('click', () => newProblem('factoring', problems, appState))
}




// Verificar respuesta
function checkAnswer(topic) {
const userAnswer = document
    .getElementById(`${topic}-answer`)
    .value.trim()
const problemData = problems[topic][appState.currentProblem]
const feedbackElement = document.getElementById(`${topic}-feedback`)
const stepsElement = document.getElementById(`${topic}-steps`)

// Actualizar contador de problemas intentados
appState.progress[topic].total++

// Normalizar respuestas para comparación
const normalizedUserAnswer = userAnswer
    .toLowerCase()
    .replace(/\s+/g, '')
const normalizedCorrectAnswer = problemData.answer
    .toLowerCase()
    .replace(/\s+/g, '')

if (normalizedUserAnswer === normalizedCorrectAnswer) {
    // Respuesta correcta
    feedbackElement.innerHTML = `
            <div class="feedback-title">
                <i class="fas fa-check-circle"></i> ¡Correcto!
            </div>
            <p>Has resuelto el problema correctamente. ¡Buen trabajo!</p>
        `
    feedbackElement.className = 'feedback-container feedback-correct'
    feedbackElement.style.display = 'block'

    // Actualizar progreso
    appState.progress[topic].correct++
} else {
    // Respuesta incorrecta
    feedbackElement.innerHTML = `
            <div class="feedback-title">
                <i class="fas fa-times-circle"></i> Respuesta incorrecta
            </div>
            <p>Tu respuesta: <strong>${
                userAnswer || '(vacío)'
            }</strong></p>
            <p>Respuesta correcta: <strong>${
                problemData.answer
            }</strong></p>
            <p>Revisa los pasos de solución a continuación:</p>
        `
    feedbackElement.className = 'feedback-container feedback-incorrect'
    feedbackElement.style.display = 'block'

    // Mostrar pasos de solución
    stepsElement.innerHTML = '<h3>Pasos para resolver:</h3>'
    problemData.steps.forEach((step, index) => {
    const stepElement = document.createElement('div')
    stepElement.className = 'step'
    stepElement.innerHTML = `<span class="step-number">Paso ${
        index + 1
    }:</span> ${step}`
    stepsElement.appendChild(stepElement)
    })
    stepsElement.style.display = 'block'
}

// Actualizar UI de progreso
updateProgressBars(appState)

// Guardar progreso
saveProgress(appState)
}

// Inicializar la aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', initApp)