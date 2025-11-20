// javascript/main.js
document.addEventListener('DOMContentLoaded', () => {
  const projects = document.querySelectorAll('.project');
  const overlay = document.getElementById('project-overlay');
  const overlayContent = overlay ? overlay.querySelector('.overlay-content') : null;
  const overlayBg = overlay ? overlay.querySelector('.overlay-bg') : null;
  const closeBtn = document.getElementById('overlay-close');
  const main = document.querySelector('main');

  if (!overlay || !overlayContent || !closeBtn || !main) {
    console.warn('Overlay o elementos necesarios no encontrados.');
    return;
  }

  function sanitizeAndInject(doc) {
    // Remover links hacia index o "volver"
    Array.from(doc.querySelectorAll('a')).forEach(a => {
      const href = a.getAttribute('href') || '';
      const txt = (a.textContent || '').toLowerCase();

      if (/index\.html/.test(href) || /volver|back to|portfolio/i.test(txt)) {
        a.remove();
      }
    });

    // Remover scripts internos del proyecto
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

        // Inicializar lightbox dentro del overlay
        initLightboxInsideOverlay();
      })
      .catch(err => {
        overlayContent.innerHTML = `<p style="color:#f8d7da">No se pudo cargar el proyecto: ${err.message}</p>`;
      });
  }

  function closeOverlay() {
    overlay.classList.remove('open');
    overlayContent.innerHTML = '';
    document.body.classList.remove('no-scroll');
    main.classList.remove('hidden-behind');
    overlay.style.transformOrigin = '';
  }

  // Eventos de apertura
  projects.forEach(proj => {
    proj.addEventListener('click', (e) => {
      const url = proj.dataset.link || proj.dataset.url;
      if (!url) {
        console.warn('Project sin data-link:', proj);
        return;
      }

      openOverlayFrom(proj, url, e.clientX, e.clientY);
    });

    proj.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const url = proj.dataset.link || proj.dataset.url;
        openOverlayFrom(proj, url, window.innerWidth/2, window.innerHeight/2);
      }
    });
  });

  // Cerrar overlay
  closeBtn.addEventListener('click', closeOverlay);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay || e.target === overlayBg) closeOverlay();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('open')) closeOverlay();
  });

  // -------------------------------
  // LIGHTBOX DINÁMICO PARA PROYECTOS
  // -------------------------------
  function initLightboxInsideOverlay() {
    const overlayRoot = document.getElementById('project-overlay');

    // Crear solo si no existe
    let lightbox = document.getElementById('overlay-lightbox');
    if (!lightbox) {
      lightbox = document.createElement('div');
      lightbox.id = 'overlay-lightbox';
      lightbox.innerHTML = `
        <div class="lightbox-bg"></div>
        <img class="lightbox-img" src="">
        <button class="lightbox-close">✕</button>
      `;
      overlayRoot.appendChild(lightbox);

      // Cerrar
      lightbox.querySelector('.lightbox-close').onclick = () => lightbox.classList.remove('active');
      lightbox.querySelector('.lightbox-bg').onclick = () => lightbox.classList.remove('active');
    }

    // Imágenes dentro del overlay
    const imgs = overlayRoot.querySelectorAll('.highlight-gallery img');
    imgs.forEach(img => {
      img.style.cursor = 'pointer';
      img.onclick = () => {
        lightbox.querySelector('.lightbox-img').src = img.src;
        lightbox.classList.add('active');
      };
    });
  }
});

// -------------------------------
// CSS dinámico del lightbox
// -------------------------------
const css = `
#overlay-lightbox {
  display: none;
  position: fixed;
  top: 0; left: 0;
  width: 100%; height: 100%;
  justify-content: center;
  align-items: center;
  z-index: 999999;
}
#overlay-lightbox.active {
  display: flex;
}
#overlay-lightbox .lightbox-bg {
  position: absolute;
  top: 0; left: 0;
  width: 100%; height: 100%;
  background: rgba(0,0,0,0.85);
}
#overlay-lightbox .lightbox-img {
  max-width: 90%;
  max-height: 90%;
  z-index: 10;
  border-radius: 10px;
}
#overlay-lightbox .lightbox-close {
  position: absolute;
  top: 20px;
  right: 25px;
  font-size: 2.2rem;
  color: white;
  background: none;
  border: none;
  cursor: pointer;
  z-index: 20;
}
`;
const style = document.createElement("style");
style.textContent = css;
document.head.appendChild(style);
