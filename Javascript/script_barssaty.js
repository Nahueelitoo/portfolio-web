// javascript/script_barssaty.js
(function () {
  function initLightbox() {
    const imgs = document.querySelectorAll('.highlight-gallery img');
    if (!imgs.length) return;

    let lightbox = document.getElementById('lightbox');
    if (!lightbox) {
      lightbox = document.createElement('div');
      lightbox.id = 'lightbox';
      document.body.appendChild(lightbox);
    }

    imgs.forEach(img => {
      img.addEventListener('click', () => {
        lightbox.classList.add('active');
        const clone = document.createElement('img');
        clone.src = img.src;
        lightbox.innerHTML = '';
        lightbox.appendChild(clone);
      });
    });

    lightbox.addEventListener('click', () => {
      lightbox.classList.remove('active');
    });
  }

  // Si la página se carga normalmente
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLightbox);
  } else {
    initLightbox();
  }

  // Si se carga dentro del overlay del portfolio
  window.addEventListener('load', initLightbox);
})();
