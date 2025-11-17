// ============================================
// problems.js - Lógica de manejo de problemas
// ============================================

import * as UI from './ui.js';

export function newProblem(topic, problems, appState) {
    const totalProblems = problems[topic].length;
    const solvedProblems = appState.progress[topic].solvedProblems;
    
    const unsolvedIndices = [];
    for (let i = 0; i < totalProblems; i++) {
        if (!solvedProblems.includes(i)) {
            unsolvedIndices.push(i);
        }
    } 
    
    if (unsolvedIndices.length > 0) {
        const randomIndex = Math.floor(Math.random() * unsolvedIndices.length);
        const newIndex = unsolvedIndices[randomIndex];
        
        appState.currentProblem = newIndex;
        showProblem(topic, newIndex, problems, appState);
    } else {
        UI.showAllProblemsCompleted(topic);
    }
}

export function showProblem(topic, index, problems, appState) {
    const problemData = problems[topic][index];
    
    UI.displayProblem(topic, problemData.problem);

    // Habilitar botones para el nuevo problema
    document.getElementById(`check-${topic}`).disabled = false;
    document.getElementById(`new-${topic}`).disabled = false;
    document.getElementById(`hint-${topic}`).disabled = false;
    
    UI.hideFeedbackUI(topic);
}
