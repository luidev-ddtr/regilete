// ui.js - Capa de interfaz de usuario con animaciones

/**
 * Actualiza el tema activo en la interfaz
 */
export function updateActiveTopicUI(topic) {
    document.querySelectorAll('.topic-item').forEach((item) => {
        item.classList.remove('active');
    });
    
    document
        .querySelector(`.topic-item[data-topic="${topic}"]`)
        .classList.add('active');
}

/**
 * Actualiza el contenido visible del tema
 */
export function updateTopicContentUI(topic) {
    document.querySelectorAll('.topic-content').forEach((content) => {
        content.classList.remove('active');
    });
    
    document.getElementById(`${topic}-content`).classList.add('active');
}

/**
 * Muestra feedback de respuesta correcta
 */
export function showCorrectFeedback(topic) {
    const feedbackElement = document.getElementById(`${topic}-feedback`);
    
    feedbackElement.innerHTML = `
        <div class="feedback-title">
            <i class="fas fa-check-circle"></i> ¡Correcto!
        </div>
        <p>Has resuelto el problema correctamente. ¡Buen trabajo!</p>
    `;
    feedbackElement.className = 'feedback-container feedback-correct';
    feedbackElement.style.display = 'block';
}

/**
 * Muestra feedback de respuesta incorrecta con los pasos de solución
 */
export function showIncorrectFeedback(topic, userAnswer, correctAnswer, steps) {
    const feedbackElement = document.getElementById(`${topic}-feedback`);
    const stepsElement = document.getElementById(`${topic}-steps`);
    
    feedbackElement.innerHTML = `
        <div class="feedback-title">
            <i class="fas fa-times-circle"></i> Respuesta incorrecta
        </div>
        <p>Tu respuesta: <strong>${userAnswer || '(vacío)'}</strong></p>
        <p>Respuesta correcta: <strong>${correctAnswer}</strong></p>
        <p>Revisa los pasos de solución a continuación:</p>
    `;
    feedbackElement.className = 'feedback-container feedback-incorrect';
    feedbackElement.style.display = 'block';
    
    stepsElement.innerHTML = '<h3>Pasos para resolver:</h3>';
    steps.forEach((step, index) => {
        const stepElement = document.createElement('div');
        stepElement.className = 'step';
        stepElement.innerHTML = `<span class="step-number">Paso ${index + 1}:</span> ${step}`;
        stepsElement.appendChild(stepElement);
    });
    stepsElement.style.display = 'block';
}

/**
 * Anima un elemento cuando su valor cambia
 */
function animateValueChange(element) {
    element.classList.remove('updated');
    void element.offsetWidth; // Trigger reflow
    element.classList.add('updated');
    setTimeout(() => {
        element.classList.remove('updated');
    }, 500);
}

/**
 * Actualiza las barras de progreso en la UI
 */
export function updateProgressBarsUI(appState, problemsData) {
    for (const topic in appState.progress) {
        if (!problemsData[topic]) continue;
        
        const progress = appState.progress[topic];
        const totalPossibleScore = problemsData[topic].reduce(
            (sum, problem) => sum + problem.score, 
            0
        );
        
        const percentage = totalPossibleScore > 0 
            ? Math.min(100, Math.round((progress.score / totalPossibleScore) * 100)) 
            : 0;
        
        // Actualizar porcentaje con animación
        const percentageElement = document.getElementById(`${topic}-progress`);
        percentageElement.textContent = `${percentage}%`;
        animateValueChange(percentageElement);
        
        // Actualizar barra de progreso
        const progressBar = document.getElementById(`${topic}-progress-bar`);
        progressBar.style.width = `${percentage}%`;
        
        // Actualizar puntuación con animación
        const scoreElement = document.getElementById(`${topic}-correct`);
        scoreElement.textContent = progress.score;
        animateValueChange(scoreElement);
        
        // Actualizar intentos con animación
        const totalElement = document.getElementById(`${topic}-total`);
        totalElement.textContent = progress.total;
        animateValueChange(totalElement);
        
        // Agregar efecto especial si la puntuación es alta (>80%)
        const progressContainer = percentageElement.closest('.progress-container');
        if (percentage >= 80) {
            progressContainer.setAttribute('data-score-high', 'true');
        } else {
            progressContainer.removeAttribute('data-score-high');
        }
    }
}

/**
 * Muestra el problema en la UI
 */
export function displayProblem(topic, problemText) {
    document.getElementById(`${topic}-problem`).textContent = `\\( ${problemText} \\)`;
    document.getElementById(`${topic}-answer`).value = '';
    
    if (window.MathJax) {
        MathJax.typeset([`#${topic}-problem`]);
    }
}

/**
 * Muestra mensaje cuando todos los problemas están resueltos
 */
export function showAllProblemsCompleted(topic) {
    document.getElementById(`${topic}-problem`).textContent = 
        "¡Has resuelto todos los problemas de este tema!";
    document.getElementById(`new-${topic}`).disabled = true;
}

/**
 * Oculta el feedback y los pasos de solución
 */
export function hideFeedbackUI(topic) {
    document.getElementById(`${topic}-feedback`).style.display = 'none';
    document.getElementById(`${topic}-steps`).style.display = 'none';
    document.getElementById(`${topic}-hint`).style.display = 'none';
}

/**
 * Muestra la pista para el problema actual
 */
export function showHintUI(topic, hintText) {
    const hintElement = document.getElementById(`${topic}-hint`);
    const hintTextElement = document.getElementById(`${topic}-hint-text`);
    
    if (hintText && hintTextElement) {
        hintTextElement.textContent = hintText;
    }
    hintElement.style.display = 'block';
}

/**
 * Muestra el modal de victoria
 */
export function showVictoryModalUI(topic, type, score, attempts) {
    const modal = document.getElementById('victory-modal');
    const header = document.getElementById('victory-header');
    const message = document.getElementById('victory-message');
    
    const topicNames = {
        operations: 'Operaciones Básicas',
        polynomials: 'Polinomios',
        equations: 'Ecuaciones',
        factoring: 'Factorización'
    };
    const topicName = topicNames[topic] || 'este tema';
    
    if (type === 'legendary') {
        header.innerHTML = `
            <i class="fas fa-crown" style="color: #ffc107;"></i>
            <h2>¡Victoria Legendaria!</h2>
        `;
        message.textContent = `¡Felicidades! Has resuelto todos los problemas de ${topicName}. ¡Eres un verdadero maestro del álgebra!`;
    } else {
        header.innerHTML = `
            <i class="fas fa-trophy" style="color: #28a745;"></i>
            <h2>¡Has completado el tema!</h2>
        `;
        message.textContent = `¡Excelente trabajo! Has alcanzado la puntuación objetivo para el tema de ${topicName}.`;
    }
    
    document.getElementById('victory-score').textContent = score;
    document.getElementById('victory-attempts').textContent = attempts;
    modal.style.display = 'flex';
}

/**
 * Oculta el modal de victoria
 */
export function hideVictoryModalUI() {
    document.getElementById('victory-modal').style.display = 'none';
}

/**
 * Obtiene el valor de la respuesta del usuario
 */
export function getUserAnswer(topic) {
    return document.getElementById(`${topic}-answer`).value.trim();
}

/**
 * Actualiza MathJax en toda la página
 */
export function updateMathJax() {
    if (window.MathJax) {
        MathJax.typeset();
    }
}