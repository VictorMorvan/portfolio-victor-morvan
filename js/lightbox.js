/* ============================================================
   lightbox.js — Zoom plein écran sur les images
   ============================================================ */

(function () {
  const lb = document.createElement('div');
  lb.id = 'lightbox';
  lb.style.cssText = `
    display:none; position:fixed; inset:0; z-index:9999;
    background:rgba(0,0,0,.88); align-items:center; justify-content:center;
    flex-direction:column; gap:12px; cursor:zoom-out;
  `;
  lb.innerHTML = `
    <button id="lb-close" aria-label="Fermer" style="
      position:absolute; top:18px; right:22px; background:none; border:none;
      color:#fff; font-size:2rem; cursor:pointer; line-height:1;">&#x2715;</button>
    <img id="lb-img" src="" alt="" style="
      max-width:92vw; max-height:88vh; border-radius:8px;
      object-fit:contain; box-shadow:0 8px 40px rgba(0,0,0,.6);">
    <p id="lb-caption" style="color:#ccc; font-size:.85rem; text-align:center; max-width:80vw;"></p>
  `;
  document.body.appendChild(lb);

  function open(src, alt) {
    document.getElementById('lb-img').src = src;
    document.getElementById('lb-caption').textContent = alt || '';
    lb.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }

  function close() {
    lb.style.display = 'none';
    document.getElementById('lb-img').src = '';
    document.body.style.overflow = '';
  }

  lb.addEventListener('click', function (e) {
    if (e.target === lb || e.target.id === 'lb-close') close();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && lb.style.display === 'flex') close();
  });

  /* Rendre les images des cartes cliquables */
  document.addEventListener('click', function (e) {
    const img = e.target.closest('.capture-slot img');
    if (img) {
      e.preventDefault();
      open(img.src, img.alt);
    }
  });

  window.openLightbox = open;
})();