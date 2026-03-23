// CSS and JS injected into the note iframe for interactive features.

export const INJECTED_CSS = `
<style id="sh-interactive">
.write-line {
  min-height: 38px !important;
  height: auto !important;
  border: none !important;
  border-bottom: 2px dashed #c4b5fd !important;
  padding: 6px 10px !important;
  border-radius: 6px 6px 0 0 !important;
  cursor: text !important;
  outline: none !important;
  transition: background 0.18s, border-color 0.18s !important;
  background: transparent !important;
  display: block !important;
  font-family: inherit !important;
  font-size: inherit !important;
  color: #1e293b !important;
  white-space: pre-wrap !important;
  word-break: break-word !important;
  box-sizing: border-box !important;
}

.write-line:empty::before {
  content: 'Wpisz tutaj swoje myśli…';
  color: #c4b5fd;
  font-style: italic;
  font-size: 13px;
  pointer-events: none;
}

.write-line:focus {
  border-bottom-color: #7c3aed !important;
  background: rgba(124, 58, 237, 0.04) !important;
}

.write-line[data-filled] {
  border-bottom-style: solid !important;
  border-bottom-color: #059669 !important;
  background: rgba(5, 150, 105, 0.03) !important;
}

details {
  border-radius: 10px !important;
  border: 1px solid transparent !important;
  transition: background 0.2s, border-color 0.2s !important;
  overflow: hidden !important;
}

details summary {
  padding: 10px 14px !important;
  cursor: pointer !important;
  user-select: none !important;
  list-style: none !important;
  display: flex !important;
  align-items: center !important;
  gap: 8px !important;
  border-radius: 10px !important;
  transition: background 0.15s !important;
}

details summary::-webkit-details-marker { display: none !important; }

details summary::before {
  content: '▶' !important;
  font-size: 9px !important;
  color: #94a3b8 !important;
  transition: transform 0.2s !important;
  flex-shrink: 0 !important;
  display: inline-block !important;
}

details[open] > summary::before { transform: rotate(90deg) !important; }
details summary:hover { background: #f1f5f9 !important; }
details[open] { background: #f8fafc !important; border-color: #e2e8f0 !important; }
details > div { transition: filter 0.3s ease, opacity 0.3s ease !important; }

/* Practice mode */
.practice-mode .write-line:empty::before {
  content: '✦ Uzupełnij tę lukę…' !important;
  color: #7c3aed !important;
  animation: sh-pulse 2s ease-in-out infinite !important;
}

.practice-mode details[open] > div {
  filter: blur(5px) !important;
  opacity: 0.6 !important;
  cursor: pointer !important;
  user-select: none !important;
  transition: filter 0.3s ease, opacity 0.3s ease !important;
}

.practice-mode details[open]:hover > div,
.practice-mode details[open] > div:hover {
  filter: blur(0) !important;
  opacity: 1 !important;
}

.practice-mode details[open]::after {
  content: 'Najedź, aby odkryć odpowiedź' !important;
  display: block !important;
  text-align: center !important;
  font-size: 11px !important;
  color: #7c3aed !important;
  padding: 4px 14px 8px !important;
  font-style: italic !important;
  opacity: 0.8 !important;
}

.practice-mode details[open]:hover::after { display: none !important; }

@keyframes sh-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.45; }
}
</style>
`;

export const INJECTED_JS = `
<script id="sh-interactive-js">
(function () {
  function setup() {
    document.querySelectorAll('.write-line').forEach(function (el, i) {
      el.setAttribute('contenteditable', 'true');
      el.dataset.blankId = String(i);
      el.addEventListener('input', function () {
        if (this.textContent.trim()) {
          this.dataset.filled = 'true';
        } else {
          delete this.dataset.filled;
        }
        reportProgress();
      });
    });

    document.querySelectorAll('details').forEach(function (el) {
      el.addEventListener('toggle', function () {
        if (this.open) this.dataset.opened = 'true';
        reportProgress();
      });
    });

    reportProgress();
    setTimeout(reportProgress, 2500);
  }

  function reportProgress() {
    var blanks = document.querySelectorAll('.write-line');
    var filled = document.querySelectorAll('.write-line[data-filled]');
    var allDetails = document.querySelectorAll('details');
    var openedDetails = document.querySelectorAll('details[data-opened]');
    window.parent.postMessage({
      type: 'sh-progress',
      blanks: { filled: filled.length, total: blanks.length },
      details: { opened: openedDetails.length, total: allDetails.length },
    }, '*');
  }

  window.addEventListener('message', function (e) {
    if (!e.data || e.data.type !== 'sh-set-mode') return;
    if (e.data.mode === 'practice') {
      document.body.classList.add('practice-mode');
      document.querySelectorAll('details').forEach(function (d) { d.open = false; });
    } else {
      document.body.classList.remove('practice-mode');
    }
    reportProgress();
  });

  // Selection reporting to parent
  document.addEventListener('mouseup', function () {
    var sel = window.getSelection();
    var text = sel ? sel.toString().trim() : '';
    if (text && text.length >= 3) {
      try {
        var range = sel.getRangeAt(0);
        var rect = range.getBoundingClientRect();
        window.parent.postMessage({
          type: 'sh-selection',
          text: text,
          rectTop: rect.top,
          rectBottom: rect.bottom,
          rectLeft: rect.left,
          rectRight: rect.right,
        }, '*');
      } catch (e) {}
    } else {
      window.parent.postMessage({ type: 'sh-selection', text: '' }, '*');
    }
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setup);
  } else {
    setup();
  }
})();
</script>
`;

export function buildIframeDoc(html: string): string {
  return html
    .replace(/<\/head>/i, INJECTED_CSS + '\n</head>')
    .replace(/<\/body>/i, INJECTED_JS + '\n</body>');
}
