// assets/js/chatUI.js
// Gestor de la interfaz del chat: mensajes, spinner, scroll, eventos.
// No contiene lógica de negocio.

var ChatUI = (function() {
  'use strict';

  // Elementos del DOM
  var elements = {
    container: document.getElementById('chatMessages'),
    input: document.getElementById('chatInput'),
    sendButton: document.getElementById('btnSendChat'),
    popup: document.getElementById('chatPopup'),
    openButton: document.getElementById('btnOpenChat'),
    closeButton: document.getElementById('btnCloseChat')
  };

  // Crear spinner si no existe
  var spinnerElement = document.querySelector('.chat-spinner');
  if (!spinnerElement && elements.sendButton) {
    spinnerElement = document.createElement('span');
    spinnerElement.className = 'chat-spinner';
    spinnerElement.textContent = '⏳';
    spinnerElement.style.display = 'none';
    elements.sendButton.parentNode.insertBefore(spinnerElement, elements.sendButton);
  }

  // Funciones privadas
  function addMessage(text, type) {
    type = type || 'system';
    var msgDiv = document.createElement('div');
    msgDiv.className = 'chat-msg ' + type;
    // Permitir HTML en el mensaje (para formateo)
    msgDiv.innerHTML = text;
    elements.container.appendChild(msgDiv);
    scrollToBottom();
  }

  function scrollToBottom() {
    elements.container.scrollTo({
      top: elements.container.scrollHeight,
      behavior: 'smooth'
    });
  }

  function setLoading(loading) {
    if (elements.sendButton) elements.sendButton.disabled = loading;
    if (elements.input) elements.input.disabled = loading;
    if (spinnerElement) spinnerElement.style.display = loading ? 'inline-block' : 'none';
  }

  function clearInput() {
    if (elements.input) elements.input.value = '';
  }

  function getInputText() {
    return elements.input ? elements.input.value.trim() : '';
  }

  function focusInput() {
    if (elements.input) elements.input.focus();
  }

  function openPopup() {
    if (elements.popup) {
      elements.popup.classList.add('open');
      focusInput();
    }
  }

  function closePopup() {
    if (elements.popup) {
      elements.popup.classList.remove('open');
    }
  }

  // API pública
  return {
    showMessage: function(text, type) {
      addMessage(text, type);
    },

    showError: function(text) {
      addMessage('⚠️ ' + text, 'system');
    },

    setLoading: function(loading) {
      setLoading(loading);
    },

    getAndClearInput: function() {
      var text = getInputText();
      clearInput();
      return text;
    },

    focusInput: focusInput,

    openPopup: openPopup,

    closePopup: closePopup,

    onSendClick: function(callback) {
      if (elements.sendButton) {
        elements.sendButton.addEventListener('click', callback);
      }
    },

    onInputEnter: function(callback) {
      if (elements.input) {
        elements.input.addEventListener('keydown', function(e) {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            callback();
          }
        });
      }
    },

    onOpenPopup: function(callback) {
      if (elements.openButton) {
        elements.openButton.addEventListener('click', callback);
      }
    },

    onClosePopup: function(callback) {
      if (elements.closeButton) {
        elements.closeButton.addEventListener('click', callback);
      }
    }
  };
})();
