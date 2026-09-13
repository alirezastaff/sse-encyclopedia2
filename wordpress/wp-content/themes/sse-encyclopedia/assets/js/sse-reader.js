(function () {
  'use strict';

  var article = document.querySelector('[data-sse-article]');
  if (!article || typeof SSEReader === 'undefined') return;

  var articleId = article.getAttribute('data-sse-article');
  var api = SSEReader.restUrl;
  var notice = article.querySelector('[data-sse-notice]');
  var progressBar = article.querySelector('[data-sse-progress]');
  var content = article.querySelector('[data-sse-content]');
  var privateNote = article.querySelector('[data-sse-private-note]');

  function showNotice(message) {
    if (notice) notice.textContent = message;
  }

  function request(path, options) {
    var config = options || {};
    config.headers = Object.assign({ 'X-WP-Nonce': SSEReader.nonce, 'Content-Type': 'application/json' }, config.headers || {});
    return fetch(api + path, config).then(function (response) {
      if (!response.ok) throw new Error('request_failed');
      return response.json();
    });
  }

  function requireLogin() {
    showNotice('Please sign in to save reading data.');
  }

  function loadUserData() {
    if (!document.body.classList.contains('logged-in')) return;
    request('me/data').then(function (data) {
      var bookmarks = data.bookmarks || [];
      var readingList = data.reading_list || [];
      var progress = data.reading_progress || [];
      var bookmarkButton = article.querySelector('[data-sse-action="bookmark"]');
      var readingButton = article.querySelector('[data-sse-action="reading-list"]');
      var bookmarkActive = bookmarks.some(function (item) { return String(item.article_id) === String(articleId); });
      var readingActive = readingList.some(function (item) { return String(item.article_id) === String(articleId); });
      if (bookmarkButton) bookmarkButton.classList.toggle('is-active', bookmarkActive);
      if (readingButton) readingButton.classList.toggle('is-active', readingActive);
      var currentProgress = progress.find(function (item) { return String(item.article_id) === String(articleId); });
      if (currentProgress && progressBar) progressBar.style.width = Number(currentProgress.progress_percent || 0) + '%';
      if (currentProgress && currentProgress.scroll_position) window.scrollTo(0, Number(currentProgress.scroll_position));
    }).catch(function () {});
  }

  article.querySelectorAll('[data-sse-action]').forEach(function (button) {
    button.addEventListener('click', function () {
      var action = button.getAttribute('data-sse-action');
      if (action === 'dark-mode') {
        document.documentElement.classList.toggle('dark-mode');
        localStorage.setItem('sse-dark-mode', document.documentElement.classList.contains('dark-mode') ? '1' : '0');
        return;
      }
      if (!document.body.classList.contains('logged-in')) {
        requireLogin();
        return;
      }
      if (action === 'private-note') {
        var note = privateNote ? privateNote.value.trim() : '';
        if (!note) { showNotice('Write a note first.'); return; }
        request('private-notes', { method: 'POST', body: JSON.stringify({ article_id: articleId, content: note }) })
          .then(function () { if (privateNote) privateNote.value = ''; showNotice('Private note saved.'); })
          .catch(function () { showNotice('Unable to save private note.'); });
        return;
      }
      var path = action === 'bookmark' ? 'bookmarks/toggle' : action === 'reading-list' ? 'reading-list/toggle' : 'reading-list/status';
      var body = { article_id: articleId };
      if (action === 'reading-status') body.status = button.getAttribute('data-sse-status');
      request(path, { method: 'POST', body: JSON.stringify(body) })
        .then(function (data) {
          if (action === 'reading-status') {
            article.querySelectorAll('[data-sse-action="reading-status"]').forEach(function (item) { item.classList.toggle('is-active', item === button); });
          } else {
            button.classList.toggle('is-active', !!data.active);
          }
          showNotice('Saved.');
        })
        .catch(function () { showNotice('Unable to save this item.'); });
    });
  });

  function saveProgress() {
    if (!document.body.classList.contains('logged-in')) return;
    var documentHeight = document.documentElement.scrollHeight - window.innerHeight;
    var position = Math.max(0, window.scrollY);
    var percent = documentHeight > 0 ? Math.round((position / documentHeight) * 10000) / 100 : 0;
    request('progress', { method: 'POST', body: JSON.stringify({ article_id: articleId, progress_percent: percent, scroll_position: position }) }).catch(function () {});
    if (progressBar) progressBar.style.width = percent + '%';
  }

  window.addEventListener('scroll', saveProgress, { passive: true });
  window.addEventListener('beforeunload', saveProgress);
  if (localStorage.getItem('sse-dark-mode') === '1') document.documentElement.classList.add('dark-mode');
  loadUserData();

  if (content) {
    content.addEventListener('mouseup', function () {
      var selection = window.getSelection();
      var text = selection ? selection.toString().trim() : '';
      if (!text || !document.body.classList.contains('logged-in')) return;
      request('highlights', { method: 'POST', body: JSON.stringify({ article_id: articleId, selected_text: text }) })
        .then(function () { showNotice('Highlight saved.'); })
        .catch(function () { showNotice('Unable to save highlight.'); });
    });
  }
}());
