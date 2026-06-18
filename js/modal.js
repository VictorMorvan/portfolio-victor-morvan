/* ============================================================
   modal.js — Fiche complète SAÉ
   Lit le contenu directement depuis la carte HTML.
   4 onglets : Compétences | Outils | Captures | Démarche
   ============================================================ */

(function () {

  const modalHTML = `
  <div id="sae-modal" role="dialog" aria-modal="true" aria-labelledby="modal-title-text">
    <div class="sae-modal-overlay" id="modal-overlay"></div>
    <div class="sae-modal-panel">
      <div class="sae-modal-header">
        <div class="modal-header-left">
          <div class="modal-code-sem">
            <span class="modal-code" id="modal-code"></span>
            <span class="modal-sem"  id="modal-sem"></span>
          </div>
          <p class="modal-title" id="modal-title-text"></p>
        </div>
        <button class="modal-close" id="modal-close" aria-label="Fermer">&#x2715;</button>
      </div>

      <div class="sae-modal-body">
        <p class="modal-intro" id="modal-intro"></p>

        <div class="modal-blocs-label" id="modal-blocs-wrap">
          <span>Blocs de compétences :</span>
          <div class="modal-tabs" id="modal-blocs"></div>
        </div>

        <div class="modal-tabs" id="modal-tabs" style="margin-top:18px;border-bottom:1px solid rgba(255,255,255,.15);padding-bottom:8px;">
          <button class="modal-tab active" data-panel="panel-comp">
            <i class="fa-solid fa-graduation-cap"></i> Compétences
          </button>
          <button class="modal-tab" data-panel="panel-tools">
            <i class="fa-solid fa-screwdriver-wrench"></i> Outils
          </button>
          <button class="modal-tab" data-panel="panel-imgs">
            <i class="fa-regular fa-image"></i> Captures
          </button>
          <button class="modal-tab" data-panel="panel-demarche" id="tab-demarche" style="display:none;">
            <i class="fa-solid fa-sitemap"></i> Démarche
          </button>
        </div>

        <div class="modal-tab-content">
          <div class="modal-panel-content active" id="panel-comp">
            <ul id="modal-comp-list" style="list-style:none;padding:0;margin:0;display:flex;flex-direction:column;gap:8px;"></ul>
          </div>
          <div class="modal-panel-content" id="panel-tools">
            <div id="modal-tools-list" style="display:flex;flex-wrap:wrap;gap:8px;padding-top:8px;"></div>
          </div>
          <div class="modal-panel-content" id="panel-imgs">
            <div class="modal-images" id="modal-images-grid"></div>
            <div id="modal-links" style="margin-top:14px;display:flex;gap:10px;flex-wrap:wrap;"></div>
          </div>
          <div class="modal-panel-content" id="panel-demarche">
            <div id="modal-demarche-content" style="padding-top:8px;"></div>
          </div>
        </div>
      </div>
    </div>
  </div>`;

  document.body.insertAdjacentHTML('beforeend', modalHTML);

  const modal   = document.getElementById('sae-modal');
  const overlay = document.getElementById('modal-overlay');
  const btnClose= document.getElementById('modal-close');

  /* ── Onglets ── */
  document.getElementById('modal-tabs').addEventListener('click', function (e) {
    const btn = e.target.closest('.modal-tab');
    if (!btn) return;
    document.querySelectorAll('#modal-tabs .modal-tab').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.modal-panel-content').forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById(btn.dataset.panel).classList.add('active');
  });

  /* ── Fermeture ── */
  function closeModal() {
    modal.classList.remove('is-open');
    document.body.style.overflow = '';
  }
  btnClose.addEventListener('click', closeModal);
  overlay.addEventListener('click', closeModal);
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeModal();
  });

  /* ── Ouverture ── */
  window.openSAEModal = function (cardId) {
    const card = document.getElementById(cardId);
    if (!card) return;

    /* Reset onglets */
    document.querySelectorAll('#modal-tabs .modal-tab').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.modal-panel-content').forEach(p => p.classList.remove('active'));
    document.querySelector('#modal-tabs [data-panel="panel-comp"]').classList.add('active');
    document.getElementById('panel-comp').classList.add('active');

    /* Code + Semestre */
    const codeEl = card.querySelector('.sae-code-badge');
    const semEl  = card.querySelector('.sae-sem-badge');
    document.getElementById('modal-code').textContent = codeEl ? codeEl.textContent.trim() : '';
    document.getElementById('modal-sem').textContent  = semEl  ? semEl.textContent.trim()  : '';

    /* Titre */
    const titleEl = card.querySelector('.sae-card-title');
    document.getElementById('modal-title-text').textContent = titleEl ? titleEl.textContent.trim() : '';

    /* Contexte */
    const ctxEl = card.querySelector('.sae-card-context');
    document.getElementById('modal-intro').innerHTML = ctxEl ? ctxEl.innerHTML : '';

    /* Blocs */
    const blocsEl = card.querySelector('.sae-blocs-mini');
    document.getElementById('modal-blocs').innerHTML = blocsEl ? blocsEl.innerHTML : '';

    /* Compétences */
    const compList = document.getElementById('modal-comp-list');
    compList.innerHTML = '';
    card.querySelectorAll('.competence-tag').forEach(tag => {
      const li = document.createElement('li');
      li.innerHTML = `<span style="display:flex;align-items:flex-start;gap:8px;">
        <i class="fa-solid fa-check" style="color:#4ade80;margin-top:3px;flex-shrink:0;"></i>
        <span>${tag.textContent.replace(/^\s*✓?\s*/, '').trim()}</span>
      </span>`;
      compList.appendChild(li);
    });

    /* Outils */
    const toolsList = document.getElementById('modal-tools-list');
    toolsList.innerHTML = '';
    card.querySelectorAll('.outil-tag').forEach(tag => {
      const span = document.createElement('span');
      span.className = 'outil-tag';
      span.innerHTML = tag.innerHTML;
      toolsList.appendChild(span);
    });

    /* Captures */
    const grid = document.getElementById('modal-images-grid');
    grid.innerHTML = '';
    card.querySelectorAll('.capture-slot img').forEach(img => {
      const wrapper = document.createElement('div');
      wrapper.className = 'modal-img-wrapper';
      const clone = document.createElement('img');
      clone.src = img.src;
      clone.alt = img.alt;
      clone.style.cssText = 'width:100%;border-radius:6px;cursor:zoom-in;';
      clone.addEventListener('click', function () {
        if (window.openLightbox) window.openLightbox(img.src, img.alt);
      });
      wrapper.appendChild(clone);
      grid.appendChild(wrapper);
    });

    /* Liens téléchargement */
    const linksDiv = document.getElementById('modal-links');
    linksDiv.innerHTML = '';
    card.querySelectorAll('.btn-download-sae').forEach(a => {
      linksDiv.appendChild(a.cloneNode(true));
    });

    /* ── Onglet Démarche (contenu caché dans la carte) ── */
    const extraEl = card.querySelector('.sae-modal-extra');
    const tabDemarche = document.getElementById('tab-demarche');
    const panelDemarche = document.getElementById('modal-demarche-content');

    if (extraEl && extraEl.innerHTML.trim()) {
      tabDemarche.style.display = '';
      panelDemarche.innerHTML = '';

      extraEl.querySelectorAll('.extra-section').forEach(section => {
        const title = section.dataset.title || '';
        const wrapper = document.createElement('div');
        wrapper.style.cssText = 'margin-bottom:20px;';
        wrapper.innerHTML = `
          <h4 style="font-size:.95rem;font-weight:700;color:#93c5fd;margin:0 0 10px;display:flex;align-items:center;gap:8px;">
            <i class="${section.dataset.icon || 'fa-solid fa-circle-dot'}"></i> ${title}
          </h4>
          <div style="font-size:.9rem;line-height:1.7;color:rgba(255,255,255,.85);">${section.innerHTML}</div>`;
        panelDemarche.appendChild(wrapper);
      });
    } else {
      tabDemarche.style.display = 'none';
    }

    modal.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  };

})();