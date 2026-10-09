/* =========================================================
   REY FILÓSOFO · MI BIBLIOTECA
   Gestión de cursos y carpetas personales.
   - Listar cursos
   - Borrar curso
   - Renombrar curso
   - Mover curso a carpeta
   - Crear / renombrar / eliminar carpeta
   ========================================================= */

(function () {
  'use strict';

  var state = {
    libraries: [],
    folders: [],
    loading: false,
    error: null
  };

  // ─── Helpers ────────────────────────────────────────

  function getRoot() {
    return document.getElementById('rf-biblioteca-root');
  }

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#039;');
  }

  function apiGet(path) {
    return window.ApiClient.get('reyfilosofo', path);
  }
  function apiPost(path, body) {
    return window.ApiClient.post('reyfilosofo', path, body || {});
  }
  function apiPatch(path, body) {
    return window.ApiClient.patch
      ? window.ApiClient.patch('reyfilosofo', path, body || {})
      : fetch('/api/reyfilosofo' + path, {
          method: 'PATCH',
          headers: buildAuthHeaders(),
          body: JSON.stringify(body || {})
        }).then(handleFetch);
  }
  function apiDelete(path) {
    return window.ApiClient.delete
      ? window.ApiClient.delete('reyfilosofo', path)
      : fetch('/api/reyfilosofo' + path, {
          method: 'DELETE',
          headers: buildAuthHeaders()
        }).then(handleFetch);
  }

  function buildAuthHeaders() {
    var h = { 'Content-Type': 'application/json', 'Accept': 'application/json' };
    try {
      if (window.LDIdentityProvider && LDIdentityProvider.getToken) {
        var t = LDIdentityProvider.getToken();
        if (t) h['Authorization'] = 'Bearer ' + t;
      }
    } catch (e) {}
    return h;
  }
  function handleFetch(res) {
    if (!res.ok) {
      return res.json().then(function (d) {
        throw new Error(d && d.error ? d.error : 'Error HTTP ' + res.status);
      }).catch(function (e) {
        throw e instanceof Error ? e : new Error('Error HTTP ' + res.status);
      });
    }
    if (res.status === 204) return null;
    return res.json();
  }

  // ─── Data ───────────────────────────────────────────

  function isLoggedIn() {
    try {
      if (typeof CurrentUser !== 'undefined' && CurrentUser.exists && CurrentUser.exists()) {
        return true;
      }
    } catch (e) {}
    return false;
  }

  async function load() {
    state.loading = true;
    state.error = null;
    state.guest = false;

    if (!isLoggedIn()) {
      state.guest = true;
      state.loading = false;
      render();
      return;
    }

    render();

    try {
      var data = await apiGet('/library/list');
      state.libraries = (data && data.libraries) || [];
      state.folders = (data && data.folders) || [];
    } catch (err) {
      var msg = err && err.message ? err.message : 'Error cargando';
      // Detectar errores de auth para no mostrar el técnico
      if (/token|sesi[oó]n|acceso/i.test(msg)) {
        state.guest = true;
      } else {
        state.error = msg;
      }
    } finally {
      state.loading = false;
      render();
    }
  }

  async function deleteLibrary(id) {
    if (!confirm('¿Borrar este curso? Esta acción no se puede deshacer.')) return;
    try {
      await apiDelete('/library/' + id);
      state.libraries = state.libraries.filter(function (l) { return l._id !== id; });
      render();
    } catch (err) {
      alert('No se pudo borrar: ' + err.message);
    }
  }

  async function renameLibrary(id) {
    var lib = state.libraries.find(function (l) { return l._id === id; });
    if (!lib) return;
    var newName = prompt('Nuevo nombre para el curso:', lib.title);
    if (newName === null) return;
    newName = newName.trim();
    if (!newName) return;
    try {
      var res = await apiPatch('/library/' + id, { title: newName });
      if (res && res.library) {
        lib.title = res.library.title;
      } else {
        lib.title = newName;
      }
      render();
    } catch (err) {
      alert('No se pudo renombrar: ' + err.message);
    }
  }

  async function moveLibrary(id, folderId) {
    try {
      await apiPost('/library/' + id + '/move', { folderId: folderId || null });
      var lib = state.libraries.find(function (l) { return l._id === id; });
      if (lib) lib.folderId = folderId || null;
      render();
    } catch (err) {
      alert('No se pudo mover: ' + err.message);
    }
  }

  async function createFolder() {
    var name = prompt('Nombre de la nueva carpeta:');
    if (name === null) return;
    name = name.trim();
    if (!name) return;
    try {
      var res = await apiPost('/library/folders', { name: name });
      if (res && res.folder) {
        state.folders.push(res.folder);
      }
      render();
    } catch (err) {
      alert('No se pudo crear: ' + err.message);
    }
  }

  async function renameFolder(id) {
    var folder = state.folders.find(function (f) { return f._id === id; });
    if (!folder) return;
    var newName = prompt('Nuevo nombre para la carpeta:', folder.name);
    if (newName === null) return;
    newName = newName.trim();
    if (!newName) return;
    try {
      await apiPatch('/library/folders/' + id, { name: newName });
      folder.name = newName;
      render();
    } catch (err) {
      alert('No se pudo renombrar: ' + err.message);
    }
  }

  async function deleteFolder(id) {
    if (!confirm('¿Eliminar esta carpeta? Los cursos dentro quedarán sin carpeta (no se borran).')) return;
    try {
      await apiDelete('/library/folders/' + id);
      state.folders = state.folders.filter(function (f) { return f._id !== id; });
      state.libraries.forEach(function (l) {
        if (l.folderId === id) l.folderId = null;
      });
      render();
    } catch (err) {
      alert('No se pudo eliminar: ' + err.message);
    }
  }


  async function renameDocument(libId, order) {
    var lib = state.libraries.find(function (l) { return l._id === libId; });
    if (!lib) return;
    var doc = (lib.documents || []).find(function (d) { return String(d.order) === String(order); });
    if (!doc) return;

    var newTitle = prompt('Nuevo título del documento:', doc.title);
    if (newTitle === null) return;
    newTitle = newTitle.trim();
    if (!newTitle) return;

    try {
      await apiPatch('/library/' + libId + '/document/' + order, { title: newTitle });
      doc.title = newTitle;
      render();
    } catch (err) {
      alert('No se pudo renombrar: ' + err.message);
    }
  }

  async function moveDocument(libId, order) {
    // Opciones: todos los cursos menos el actual
    var targets = state.libraries.filter(function (l) { return l._id !== libId; });
    if (!targets.length) {
      alert('No hay otros cursos para mover este documento. Creá uno primero.');
      return;
    }

    var options = targets.map(function (l, i) {
      return (i + 1) + '. ' + l.title;
    }).join('\n');

    var sel = prompt(
      'Mover este documento a otro curso.\n\nElegí el número:\n' + options,
      '1'
    );
    if (sel === null) return;

    var idx = parseInt(sel, 10) - 1;
    if (isNaN(idx) || idx < 0 || idx >= targets.length) {
      alert('Opción inválida.');
      return;
    }

    var target = targets[idx];

    try {
      var res = await apiPost('/library/' + libId + '/document/' + order + '/move', {
        targetLibraryId: target._id
      });

      if (res.sourceDeleted) {
        // El curso origen quedó vacío y se borró.
        state.libraries = state.libraries.filter(function (l) { return l._id !== libId; });
      }

      await load();
    } catch (err) {
      alert('No se pudo mover: ' + err.message);
    }
  }

  async function deleteDocument(libId, order) {
    var lib = state.libraries.find(function (l) { return l._id === libId; });
    if (!lib) return;
    var docCount = (lib.documents || []).length;
    var isLast = docCount === 1;

    var msg = isLast
      ? 'Este es el último documento del curso. Si lo borrás, se eliminará también el curso "' + lib.title + '". ¿Continuar?'
      : '¿Borrar este documento? Esta acción no se puede deshacer.';

    if (!confirm(msg)) return;

    try {
      var res = await apiDelete('/library/' + libId + '/document/' + order);

      if (res && res.courseDeleted) {
        state.libraries = state.libraries.filter(function (l) { return l._id !== libId; });
        render();
      } else {
        await load();
      }
    } catch (err) {
      alert('No se pudo borrar: ' + err.message);
    }
  }

  // ─── Render ─────────────────────────────────────────

  function render() {
    var root = getRoot();
    if (!root) return;

    if (state.loading) {
      root.innerHTML = '<div class="rfb-loading">Cargando biblioteca…</div>';
      return;
    }

    if (state.guest) {
      root.innerHTML = '' +
        '<div class="rfb-guest">' +
          '<div class="rfb-guest-mark">📚</div>' +
          '<h2 class="rfb-guest-title">Tu biblioteca personal</h2>' +
          '<p class="rfb-guest-text">' +
            'Inicia sesión para crear y organizar tu propia biblioteca de cursos. ' +
            'Cada curso son cinco documentos breves, y podés moverlos entre carpetas a tu gusto.' +
          '</p>' +
          '<button class="rfb-btn rfb-btn--primary" data-action="open-auth">' +
            'Iniciar sesión o crear cuenta →' +
          '</button>' +
        '</div>';
      return;
    }

    if (state.error) {
      root.innerHTML = '<div class="rfb-error">No se pudo cargar la biblioteca. ' + esc(state.error) + '</div>';
      return;
    }

    if (!state.libraries.length && !state.folders.length) {
      root.innerHTML = '' +
        '<div class="rfb-empty">' +
          '<p>Todavía no tenés cursos.</p>' +
          '<p class="rfb-empty-hint">Creá uno desde <strong>Crea tu propia librería</strong>.</p>' +
        '</div>';
      return;
    }

    var html = '';

    // ─── Header con acciones ───
    html += '<div class="rfb-header">' +
      '<div class="rfb-count">' + state.libraries.length + ' curso' + (state.libraries.length === 1 ? '' : 's') +
      (state.folders.length ? ' · ' + state.folders.length + ' carpeta' + (state.folders.length === 1 ? '' : 's') : '') +
      '</div>' +
      '<button class="rfb-btn rfb-btn--ghost" data-action="new-folder">+ Nueva carpeta</button>' +
      '</div>';

    // ─── Cursos sueltos (sin carpeta) ───
    var loose = state.libraries.filter(function (l) { return !l.folderId; });
    if (loose.length) {
      html += '<section class="rfb-section">';
      html += '<h3 class="rfb-section-title">Sin carpeta</h3>';
      html += '<ul class="rfb-list">';
      loose.forEach(function (lib) {
        html += renderLibraryItem(lib);
      });
      html += '</ul></section>';
    }

    // ─── Carpetas ───
    state.folders.forEach(function (folder) {
      var inside = state.libraries.filter(function (l) { return l.folderId === folder._id; });
      html += '<section class="rfb-section rfb-folder">';
      html += '<div class="rfb-folder-header">';
      html += '<h3 class="rfb-section-title rfb-section-title--folder">📁 ' + esc(folder.name) + '</h3>';
      html += '<div class="rfb-folder-actions">';
      html += '<button class="rfb-icon-btn" title="Renombrar carpeta" data-action="rename-folder" data-folder="' + folder._id + '">✎</button>';
      html += '<button class="rfb-icon-btn rfb-icon-btn--danger" title="Eliminar carpeta" data-action="delete-folder" data-folder="' + folder._id + '">✕</button>';
      html += '</div></div>';

      if (inside.length) {
        html += '<ul class="rfb-list">';
        inside.forEach(function (lib) {
          html += renderLibraryItem(lib);
        });
        html += '</ul>';
      } else {
        html += '<p class="rfb-folder-empty">Carpeta vacía.</p>';
      }
      html += '</section>';
    });

    root.innerHTML = html;
  }

  function renderLibraryItem(lib) {
    var opts = '<option value="">— Sin carpeta —</option>';
    state.folders.forEach(function (f) {
      var sel = (f._id === lib.folderId) ? ' selected' : '';
      opts += '<option value="' + f._id + '"' + sel + '>' + esc(f.name) + '</option>';
    });

    var docs = lib.documents || [];
    var docsHtml = '';
    if (docs.length) {
      docsHtml = '<details class="rfb-docs"><summary class="rfb-docs-summary">' +
        '📄 ' + docs.length + ' documentos' +
        '</summary><ul class="rfb-docs-list">';
      docs.forEach(function (d) {
        docsHtml += '<li class="rfb-doc-item" data-doc-order="' + d.order + '" data-lib="' + lib._id + '">' +
          '<span class="rfb-doc-order">' + (d.order || '·') + '.</span>' +
          '<span class="rfb-doc-title">' + esc(d.title || 'Sin título') + '</span>' +
          '<span class="rfb-doc-actions">' +
            '<button class="rfb-icon-btn rfb-icon-btn--sm" title="Renombrar documento" data-action="rename-doc" data-lib="' + lib._id + '" data-order="' + d.order + '">✎</button>' +
            '<button class="rfb-icon-btn rfb-icon-btn--sm" title="Mover a otro curso" data-action="move-doc" data-lib="' + lib._id + '" data-order="' + d.order + '">→</button>' +
            '<button class="rfb-icon-btn rfb-icon-btn--sm rfb-icon-btn--danger" title="Borrar documento" data-action="delete-doc" data-lib="' + lib._id + '" data-order="' + d.order + '">✕</button>' +
          '</span>' +
          '</li>';
      });
      docsHtml += '</ul></details>';
    } else {
      docsHtml = '<div class="rfb-item-meta">Sin documentos</div>';
    }

    return '' +
      '<li class="rfb-item" data-lib="' + lib._id + '">' +
        '<div class="rfb-item-info">' +
          '<div class="rfb-item-title">' + esc(lib.title) + '</div>' +
          docsHtml +
        '</div>' +
        '<div class="rfb-item-actions">' +
          '<select class="rfb-select" data-action="move" data-lib="' + lib._id + '">' + opts + '</select>' +
          '<button class="rfb-icon-btn" title="Renombrar" data-action="rename-lib" data-lib="' + lib._id + '">✎</button>' +
          '<button class="rfb-icon-btn rfb-icon-btn--danger" title="Borrar" data-action="delete-lib" data-lib="' + lib._id + '">✕</button>' +
        '</div>' +
      '</li>';
  }

  // ─── Eventos ────────────────────────────────────────

  function bindEvents() {
    var root = getRoot();
    if (!root || root._rfbBound) return;
    root._rfbBound = true;

    root.addEventListener('click', function (ev) {
      var t = ev.target.closest('[data-action]');
      if (!t) return;
      var action = t.dataset.action;

      if (action === 'open-auth') {
        // Abrir el flujo de login del header (o redirigir a la vista Usuario).
        if (window.HeaderAuth && typeof HeaderAuth.openLogin === 'function') {
          HeaderAuth.openLogin();
        } else if (window.ReyFilosofo && typeof window.ReyFilosofo.navigateTo === 'function') {
          window.ReyFilosofo.navigateTo('usuario');
        } else {
          window.location.href = '/pages/rey-filosofo.html';
        }
        return;
      }
      if (action === 'new-folder') return createFolder();
      if (action === 'rename-lib') return renameLibrary(t.dataset.lib);
      if (action === 'delete-lib') return deleteLibrary(t.dataset.lib);
      if (action === 'rename-folder') return renameFolder(t.dataset.folder);
      if (action === 'delete-folder') return deleteFolder(t.dataset.folder);
      if (action === 'rename-doc') return renameDocument(t.dataset.lib, t.dataset.order);
      if (action === 'move-doc') return moveDocument(t.dataset.lib, t.dataset.order);
      if (action === 'delete-doc') return deleteDocument(t.dataset.lib, t.dataset.order);
    });

    root.addEventListener('change', function (ev) {
      var t = ev.target.closest('[data-action="move"]');
      if (!t) return;
      moveLibrary(t.dataset.lib, t.value || null);
    });
  }

  // ─── Ciclo de vida ──────────────────────────────────

  function mount() {
    render();
    bindEvents();
    load();
  }

  function unmount() {}

  window.ReyFilosofoBiblioteca = {
    mount: mount,
    unmount: unmount,
    reload: load,
    getState: function () { return JSON.parse(JSON.stringify(state)); }
  };
})();
