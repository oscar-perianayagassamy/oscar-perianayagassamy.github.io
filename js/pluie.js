// Effet de pluie sur les bandes latérales (canvas, aucune dépendance)
(() => {
  const canvas = document.getElementById('pluie');
  if (!canvas) return;
  // Respecte le réglage « réduire les animations »
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const ctx = canvas.getContext('2d');
  const PENTE = 0.2;          // inclinaison des gouttes (0 = verticales)
  const DENSITE = 7000;       // plus grand = moins de gouttes
  let w, h, gouttes = [];

  function nouvelle(auHasard) {
    return {
      x: Math.random() * (w + 100),
      y: auHasard ? Math.random() * h : -20,
      longueur: 10 + Math.random() * 18,
      vitesse: 9 + Math.random() * 9,
      opacite: 0.15 + Math.random() * 0.3
    };
  }

  function initialiser() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = window.innerWidth;
    h = window.innerHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.lineWidth = 1;
    ctx.lineCap = 'round';
    gouttes = Array.from({ length: Math.round((w * h) / DENSITE) }, () => nouvelle(true));
  }

  function image() {
    ctx.clearRect(0, 0, w, h);
    for (const g of gouttes) {
      ctx.strokeStyle = 'rgba(255,255,255,' + g.opacite + ')';
      ctx.beginPath();
      ctx.moveTo(g.x, g.y);
      ctx.lineTo(g.x - g.longueur * PENTE, g.y + g.longueur);
      ctx.stroke();
      g.y += g.vitesse;
      g.x -= g.vitesse * PENTE;
      if (g.y > h + 20 || g.x < -50) Object.assign(g, nouvelle(false));
    }
    requestAnimationFrame(image);
  }

  window.addEventListener('resize', initialiser);
  initialiser();
  image();
})();
