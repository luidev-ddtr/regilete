// main.js - Lógica de negocio principal con sistema de logros

import problemsData from '../data/problems.json';
import { loadProgress, saveProgress } from './progress.js';
import { newProblem, showProblem } from './problems.js';
import { showHint } from './utils.js';
import * as UI from './ui.js';
import { checkAchievements, loadAchievementProgress } from './achievements.js';
import { createConfetti, createEpicConfetti, createMediumConfetti } from './confeti.js';

const problems = problemsData;
 
const appState = {
    currentTopic: 'operations', 
    currentProblem: 0,
    progress: {
        operations: { score: 0, total: 0, solvedProblems: [] },
        polynomials: { score: 0, total: 0, solvedProblems: [] },
        equations: { score: 0, total: 0, solvedProblems: [] },
        factoring: { score: 0, total: 0, solvedProblems: [] },
    },
};

function initApp() {
    // Cargar progreso de logros
    loadAchievementProgress();
    
    // Cargar progreso desde localStorage
    loadProgress(appState, () => UI.updateProgressBarsUI(appState, problemsData));
    
    document.querySelectorAll('.topic-item').forEach((item) => {
        item.addEventListener('click', function () {
            const topic = this.getAttribute('data-topic');
            switchTopic(topic);
        });
    });
    
    setupEventListeners();
    
    document.getElementById('modal-close-button').addEventListener('click', UI.hideVictoryModalUI);
    document.getElementById('modal-next-topic-button').addEventListener('click', () => switchTopic('polynomials'));
    
    showProblem('operations', 0, problems, appState);
    
    UI.updateMathJax();
}

function switchTopic(topic) {
    // Evitar cambiar a un tema que no tiene problemas definidos
    if (!problems[topic]) return;

    UI.updateActiveTopicUI(topic);
    UI.updateTopicContentUI(topic);
    
    appState.currentTopic = topic;
    
    newProblem(topic, problems, appState);
    
    UI.hideFeedbackUI(topic);
}

function setupEventListeners() {
    document.getElementById('check-operations')
        .addEventListener('click', () => checkAnswer('operations'));
    document.getElementById('hint-operations')
        .addEventListener('click', () => showHint('operations', problems, appState));
    document.getElementById('new-operations')
        .addEventListener('click', () => newProblem('operations', problems, appState));
    
    document.getElementById('check-polynomials')
        .addEventListener('click', () => checkAnswer('polynomials'));
    document.getElementById('hint-polynomials')
        .addEventListener('click', () => showHint('polynomials', problems, appState));
    document.getElementById('new-polynomials')
        .addEventListener('click', () => newProblem('polynomials', problems, appState));
    
    document.getElementById('check-equations')
        .addEventListener('click', () => checkAnswer('equations'));
    document.getElementById('hint-equations')
        .addEventListener('click', () => showHint('equations', problems, appState));
    document.getElementById('new-equations')
        .addEventListener('click', () => newProblem('equations', problems, appState));
    
    document.getElementById('check-factoring')
        .addEventListener('click', () => checkAnswer('factoring'));
    document.getElementById('hint-factoring')
        .addEventListener('click', () => showHint('factoring', problems, appState));
    document.getElementById('new-factoring')
        .addEventListener('click', () => newProblem('factoring', problems, appState));
}

function checkAnswer(topic) {
    console.log(`Verificando respuesta para: ${topic}`);
    console.log(`Progreso antes:`, appState.progress[topic]);
    
    const userAnswer = UI.getUserAnswer(topic);
    const problemData = problems[topic][appState.currentProblem];
    
    appState.progress[topic].total++;
    
    const normalizedUserAnswer = userAnswer.toLowerCase().replace(/\s+/g, '');
    const normalizedCorrectAnswer = problemData.answer.toLowerCase().replace(/\s+/g, '');
    
    if (normalizedUserAnswer === normalizedCorrectAnswer) {
        if (!appState.progress[topic].solvedProblems.includes(appState.currentProblem)) {
            appState.progress[topic].score += problemData.score;
            appState.progress[topic].solvedProblems.push(appState.currentProblem);
        }
 
        UI.showCorrectFeedback(topic);

        // Deshabilitar botones para evitar clics durante la transición
        document.getElementById(`check-${topic}`).disabled = true;
        document.getElementById(`new-${topic}`).disabled = true;

        // Esperar 3.5 segundos antes de cambiar de problema
        setTimeout(() => {
            const exerciseContainer = document.getElementById(`${topic}-content`).querySelector('.exercise-container');
            exerciseContainer.classList.add('fade-out');

            // Esperar a que termine la animación de fade-out (300ms)
            setTimeout(() => {
                newProblem(topic, problems, appState);
                exerciseContainer.classList.remove('fade-out'); // Prepara para el fade-in
            }, 300);
        }, 3500); // 3.5 segundos de espera

    } else {
        UI.showIncorrectFeedback(topic, userAnswer, problemData.answer, problemData.steps);
        
        const penalty = Math.round(problemData.score * 0.25);
        appState.progress[topic].score = Math.max(0, appState.progress[topic].score - penalty);
    }
    
    console.log(`Progreso después:`, appState.progress[topic]);
    
    // Actualizar UI de progreso
    UI.updateProgressBarsUI(appState, problemsData);
    
    // Calcular porcentaje para verificar logros
    const totalPossibleScore = problems[topic].reduce(
        (sum, problem) => sum + problem.score, 
        0
    );
    const percentage = totalPossibleScore > 0 
        ? Math.round((appState.progress[topic].score / totalPossibleScore) * 100) 
        : 0;
    
    // Verificar y mostrar logros
    checkAchievements(topic, percentage, problemsData);
    
    // Confeti para umbrales especiales
    if (percentage === 75) {
        createMediumConfetti();
    } else if (percentage === 100) {
        createEpicConfetti();
    }
    
    // Verificar condición de victoria
    checkVictoryCondition(topic);
    
    // Guardar progreso
    saveProgress(appState);
}

function checkVictoryCondition(topic) {
    const topicProgress = appState.progress[topic];
    const totalProblemsInTopic = problems[topic].length;
    const totalPossibleScore = problems[topic].reduce(
        (sum, problem) => sum + problem.score, 
        0
    );
    
    const allProblemsSolved = topicProgress.solvedProblems.length === totalProblemsInTopic;
    const targetScoreReached = topicProgress.score >= totalPossibleScore;
    
    if (allProblemsSolved) {
        UI.showVictoryModalUI(topic, 'legendary', topicProgress.score, topicProgress.total);
        createEpicConfetti();
    } else if (targetScoreReached) {
        UI.showVictoryModalUI(topic, 'normal', topicProgress.score, topicProgress.total);
        createConfetti();
    }
}

document.addEventListener('DOMContentLoaded', initApp);