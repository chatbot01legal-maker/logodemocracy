// VERSIÓN NUCLEAR_2026_2 - 2026-02-06
// ==============================================
// ABOLEGAL - Chat Logic
// ==============================================

// Configuración
const BACKEND_URL = window.location.origin;
const SESSION_KEY = 'abolegal_session_id';
const HISTORY_KEY = 'abolegal_chat_history';

// Elementos del DOM
const chatMessages = document.getElementById('chatMessages');
const userInput = document.getElementById('userInput');
const sendButton = document.getElementById('sendButton');

// Estado
let sessionId = generateSessionId();
let conversationHistory = JSON.parse(sessionStorage.getItem(HISTORY_KEY)) || [];
let isProcessing = false;

// Generar ID de sesión
function generateSessionId() {
    return 'abolegal-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
}

// Guardar historial
function saveHistory() {
    sessionStorage.setItem(HISTORY_KEY, JSON.stringify(conversationHistory));
}

// Mostrar indicador de "escribiendo"
function showTypingIndicator() {
    const typingDiv = document.createElement('div');
    typingDiv.className = 'message bot typing-indicator';
    typingDiv.id = 'typingIndicator';
    typingDiv.innerHTML = `
        <div class="typing-dots">
            <span></span>
            <span></span>
            <span></span>
        </div>
        <span>Lex está escribiendo...</span>
    `;
    chatMessages.appendChild(typingDiv);
    scrollToBottom();
}

// Ocultar indicador
function hideTypingIndicator() {
    const indicator = document.getElementById('typingIndicator');
    if (indicator) indicator.remove();
}

// Agregar mensaje al chat
function addMessage(text, isUser = false) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isUser ? 'user' : 'bot'}`;
    messageDiv.textContent = text;
    chatMessages.appendChild(messageDiv);

    conversationHistory.push({
        role: isUser ? 'user' : 'assistant',
        content: text,
        timestamp: new Date().toISOString()
    });

    if (conversationHistory.length > 50) {
        conversationHistory = conversationHistory.slice(-50);
    }

    saveHistory();
    scrollToBottom();
}

// Scroll al final
function scrollToBottom() {
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Enviar mensaje
async function sendMessage() {
    if (isProcessing) return;

    const message = userInput.value.trim();
    if (!message) return;

    addMessage(message, true);
    userInput.value = '';

    isProcessing = true;
    userInput.disabled = true;
    sendButton.disabled = true;

    showTypingIndicator();

    try {
        const response = await fetch(`${BACKEND_URL}/api/chat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sessionId, message })
        });

        const data = await response.json();
        hideTypingIndicator();
        addMessage(data.reply, false);

        if (data.context && data.context.widgetRelevant) {
            setTimeout(showScheduleButtonInChat, 500);
        }

    } catch (error) {
        hideTypingIndicator();
        addMessage('Lo siento, hubo un error. Por favor, intenta nuevamente.', false);
    } finally {
        isProcessing = false;
        userInput.disabled = false;
        sendButton.disabled = false;
        userInput.focus();
    }
}

// Cargar historial previo
function loadHistory() {
    if (conversationHistory.length === 0) {
        // 🔥 NO insertar mensaje aquí
        // El mensaje inicial vive SOLO en el HTML
        return;
    }

    conversationHistory.forEach(msg => {
        addMessage(msg.content, msg.role === 'user');
    });
}

// Inicializar chat
function initializeChat() {
    sendButton.addEventListener('click', sendMessage);

    userInput.addEventListener('keypress', e => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });

    userInput.focus();
    // ❌ loadHistory();  // DESACTIVADO: evita cargar mensajes anteriores
}

// Smooth scroll
function initializeSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', e => {
            e.preventDefault();
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) {
                window.scrollTo({
                    top: target.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    initializeChat();
    initializeSmoothScroll();
});

// ==============================
// CALENDAR & WIDGET (SIN CAMBIOS)
// ==============================
window.selectedDate = null;
window.selectedTime = null;

window.selectDate = function(date) {
    window.selectedDate = date;
    updateSelectedDateTime();
};

window.selectTime = function(time) {
    window.selectedTime = time;
    updateSelectedDateTime();
};

function updateSelectedDateTime() {
    const el = document.getElementById('selectedDateTime');
    if (el && window.selectedDate && window.selectedTime) {
        const [year, month, day] = window.selectedDate.split('-').map(Number);
        const d = new Date(year, month - 1, day).toLocaleDateString('es-CL', {
            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
        });
        el.innerHTML = `Fecha y hora seleccionadas: <span class="highlight">${d} a las ${window.selectedTime}</span>`;
    }
}

function showScheduleButtonInChat() {
    const div = document.createElement('div');
    div.className = 'chat-schedule-button';
    div.innerHTML = `
        <button class="schedule-btn" onclick="scrollToCalendarWidget()">
            <i class="fas fa-calendar-alt"></i> Agendar Videollamada con Abogado
        </button>
    `;
    chatMessages.appendChild(div);
    scrollToBottom();
}

window.scrollToCalendarWidget = function() {
    const section = document.getElementById('agendar');
    if (section) {
        window.scrollTo({
            top: section.offsetTop - 100,
            behavior: 'smooth'
        });
    }
};
