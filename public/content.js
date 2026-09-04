// Leaderboard Pro Content Script
// Scrapes the target table (<p id="GridResultados"> / #table-5-column)
// and the quiz metadata label (label.pull-right.inline with #strNiveles, #strPreguntas, #strPunteo)

(function () {
  console.log('[Leaderboard Pro] Content script initialized.');

  function extractLeaderboardTable() {
    // 1. Look for the metadata label containing strNiveles, strPreguntas, strPunteo
    const nivelesEl = document.getElementById('strNiveles') ||
      document.querySelector('.btn-grey #strNiveles') ||
      document.querySelector('.btn-grey span:first-child');

    const preguntasEl = document.getElementById('strPreguntas') ||
      document.querySelector('.btn-success #strPreguntas') ||
      document.querySelector('.btn-success span:first-child');

    const punteoEl = document.getElementById('strPunteo') ||
      document.querySelector('.btn-primary #strPunteo') ||
      document.querySelector('.btn-primary span:first-child');

    const metaLabel = document.querySelector('label.pull-right.inline') ||
      nivelesEl?.closest('label') ||
      preguntasEl?.closest('label') ||
      punteoEl?.closest('label');

    // 2. Look for GridResultados or table-5-column
    const gridEl = document.getElementById('GridResultados');
    const tableEl = document.getElementById('table-5-column') || (gridEl ? gridEl.querySelector('table') : null);

    if (gridEl || tableEl || metaLabel || nivelesEl) {
      // Build complete HTML containing metadata label and table
      let metaHtml = '';
      if (metaLabel) {
        metaHtml = metaLabel.outerHTML;
      } else if (nivelesEl || preguntasEl || punteoEl) {
        const nVal = nivelesEl?.textContent?.trim() || '1';
        const pVal = preguntasEl?.textContent?.trim() || '20';
        const ptVal = punteoEl?.textContent?.trim() || '250';
        metaHtml = `<label class="pull-right inline">
          <span class="btn btn-app btn-sm btn-grey no-hover">
            <span id="strNiveles" class="line-height-1 bigger-140">${nVal}</span>
            <br>
            <span class="line-height-1 smaller-90">Niveles </span>
          </span>
          <span class="btn btn-app btn-sm btn-success no-hover">
            <span id="strPreguntas" class="line-height-1 bigger-170">${pVal}</span>
            <br>
            <span class="line-height-1 smaller-90">Preguntas </span>
          </span>
          <span class="btn btn-app btn-sm btn-primary no-hover">
            <span id="strPunteo" class="line-height-1 bigger-170">${ptVal}</span>
            <br>
            <span class="line-height-1 smaller-90">Punteo </span>
          </span>
        </label>`;
      }

      const tableHtml = gridEl ? gridEl.outerHTML : (tableEl ? tableEl.outerHTML : '');
      const htmlContent = `${metaHtml}\n${tableHtml}`.trim();

      const rawNiveles = nivelesEl?.textContent?.trim() || '1';
      const rawPreguntas = parseInt(preguntasEl?.textContent?.trim() || '20', 10) || 20;
      const rawPunteo = parseInt(punteoEl?.textContent?.trim() || '250', 10) || 250;

      const quizMeta = {
        niveles: rawNiveles,
        preguntas: rawPreguntas,
        punteo: rawPunteo,
      };

      if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
        chrome.storage.local.get(['leaderboard_html_source', 'leaderboard_quiz_meta'], (result) => {
          const hasHtmlChanged = result.leaderboard_html_source !== htmlContent;
          const hasMetaChanged = JSON.stringify(result.leaderboard_quiz_meta) !== JSON.stringify(quizMeta);

          if (hasHtmlChanged || hasMetaChanged) {
            chrome.storage.local.set({
              leaderboard_html_source: htmlContent,
              leaderboard_quiz_meta: quizMeta,
              leaderboard_last_update: Date.now(),
            }, () => {
              console.log('[Leaderboard Pro] Datos y Quiz Meta actualizados en Chrome Storage:', quizMeta);
              try {
                chrome.runtime.sendMessage({
                  type: 'LEADERBOARD_DOM_UPDATED',
                  quizMeta,
                });
              } catch (e) {
                // Extension context might be disconnected
              }
            });
          }
        });
      }
    }
  }

  // Initial check
  extractLeaderboardTable();

  // Poll DOM every 2000 ms (2 seconds)
  setInterval(extractLeaderboardTable, 2000);

  // Also observe DOM mutations for immediate response
  const observer = new MutationObserver(() => {
    extractLeaderboardTable();
  });

  observer.observe(document.body || document.documentElement, {
    childList: true,
    subtree: true,
    characterData: true,
  });
})();
