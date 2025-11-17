
// ============================================
// utils.js - Utilidades generales
// ============================================

import * as UI from './ui.js';

export function hideFeedback(topic) {
    UI.hideFeedbackUI(topic);
}

export function showHint(topic, problems, appState) {
    const problemData = problems[topic][appState.currentProblem];
    
    if (problemData.hint) {
        UI.showHintUI(topic, problemData.hint);
    }
}