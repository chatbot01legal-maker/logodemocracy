// assets/js/platform/events/EventBus.js
// Sistema de eventos globales.

var EventBus = (function () {
  'use strict';

  var _listeners = {};

  function emit(eventName, detail) {
    var event = new CustomEvent(eventName, {
      detail: detail || {}
    });

    document.dispatchEvent(event);
  }

  function on(eventName, callback) {
    if (!_listeners[eventName]) {
      _listeners[eventName] = [];
    }

    var listener = function (e) {
      callback(e.detail);
    };

    _listeners[eventName].push({
      callback: callback,
      listener: listener
    });

    document.addEventListener(eventName, listener);

    return listener;
  }

  function off(eventName, callback) {
    if (!_listeners[eventName]) return;

    _listeners[eventName] = _listeners[eventName].filter(function (entry) {

      if (entry.callback === callback) {
        document.removeEventListener(eventName, entry.listener);
        return false;
      }

      return true;
    });
  }

  function once(eventName, callback) {

    function wrapper(detail) {
      callback(detail);
      off(eventName, wrapper);
    }

    on(eventName, wrapper);
  }

  return {
    emit: emit,
    on: on,
    off: off,
    once: once
  };

})();
