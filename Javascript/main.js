// javascript/main.js
document.addEventListener('DOMContentLoaded', () => {
  const projects = document.querySelectorAll('.project');
  const overlay = document.getElementById('project-overlay'); // debe existir en index.html
  const overlayContent = overlay ? overlay.querySelector('.overlay-content') : null;
  const overlayBg = overlay ? overlay.querySelector('.overlay-bg') : null;
  const closeBtn = document.getElementById('overlay-close');
  const main = document.querySelector('main');

  if (!overlay || !overlayContent || !closeBtn || !main) {
    console.warn('Overlay o elementos necesarios no encontrados. Verificá el HTML.');
    return;
  }

  function sanitizeAndInject(doc) {
    // removemos header/nav/footer y links 'volver' o index
    ['header','nav','footer'].forEach(sel => {
      const el = doc.querySelector(sel);
      if (el) el.remove();
    });
    Array.from(doc.querySelectorAll('a')).forEach(a => {
      const href = a.getAttribute('href') || '';
      const txt = (a.textContent || '').toLowerCase();
      if (/index\.html/.test(href) || /volver|back to|volver al portfolio/i.test(txt)) a.remove();
    });
    Array.from(doc.querySelectorAll('script')).forEach(s => s.remove());
    return doc.body ? doc.body.innerHTML : doc.documentElement.innerHTML;
  }

  function openOverlayFrom(projectEl, url, clickX, clickY) {
    const cx = (clickX / window.innerWidth) * 100 + '%';
    const cy = (clickY / window.innerHeight) * 100 + '%';
    overlay.style.setProperty('--cx', cx);
    overlay.style.setProperty('--cy', cy);
    overlay.style.transformOrigin = `${clickX}px ${clickY}px`;

    overlay.classList.add('open');
    overlayContent.innerHTML = '<div class="loader">Cargando proyecto...</div>';
    document.body.classList.add('no-scroll');
    main.classList.add('hidden-behind');

    fetch(url, { cache: 'no-store' })
      .then(r => {
        if (!r.ok) throw new Error('Error al cargar el proyecto');
        return r.text();
      })
      .then(htmlText => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlText, 'text/html');
        overlayContent.innerHTML = sanitizeAndInject(doc);
        overlayContent.scrollTop = 0;
      })
      .catch(err => {
        overlayContent.innerHTML = `<p style="color:#f8d7da">No se pudo cargar el proyecto. ${err.message}</p>`;
      });
  }

  function closeOverlay() {
    overlay.classList.remove('open');
    overlayContent.innerHTML = '';
    document.body.classList.remove('no-scroll');
    main.classList.remove('hidden-behind');
    overlay.style.transformOrigin = '';
  }

  // listeners
  projects.forEach(proj => {
    // requiere que en HTML cada .project tenga data-link="/proyectos/xxx.html"
    proj.addEventListener('click', (e) => {
      const url = proj.dataset.link || proj.dataset.url;
      if (!url) {
        console.warn('Project element sin data-link/data-url:', proj);
        return;
      }
      const clickX = e.clientX || (window.innerWidth / 2);
      const clickY = e.clientY || (window.innerHeight / 2);
      openOverlayFrom(proj, url, clickX, clickY);
    });

    proj.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const url = proj.dataset.link || proj.dataset.url;
        openOverlayFrom(proj, url, window.innerWidth/2, window.innerHeight/2);
      }
    });
  });

  closeBtn.addEventListener('click', closeOverlay);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay || e.target === overlayBg) closeOverlay();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('open')) closeOverlay();
  });
});
