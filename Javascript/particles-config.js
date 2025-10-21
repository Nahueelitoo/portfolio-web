particlesJS("particles-hover", {
  particles: {
    number: { value: 90, density: { enable: true, value_area: 800 } },
    color: { value: "#e0aaff" },
    shape: { type: "circle" },
    opacity: {
      value: 0.85,
      random: false,
      anim: { enable: true, speed: 0.2, opacity_min: 0.45, sync: false }
    },
    size: {
      value: 3.5,
      random: true,
      anim: { enable: true, speed: 1, size_min: 1, sync: false }
    },
    line_linked: { enable: false },
    move: {
      enable: true,
      speed: 0.6,
      direction: "none",
      random: true,
      straight: false,
      out_mode: "out"
    }
  },
  interactivity: {
    detect_on: "window", // <<< importante para detectar hover aun con canvas "debajo"
    events: {
      onhover: { enable: true, mode: "repulse" },
      onclick: { enable: false },
      resize: true
    },
    modes: { repulse: { distance: 110, duration: 0.6 } }
  },
  retina_detect: true
});

// Asegúrate de tener esto después de la inicialización de particlesJS
const canvas = document.querySelector('.particles-js-canvas-el');
if (canvas) {
  canvas.style.position = 'fixed';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  canvas.style.zIndex = '-1'; // detrás de todo
}
