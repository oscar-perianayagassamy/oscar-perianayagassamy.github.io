// Effet de pluie sur les bandes latérales (canvas, aucune dépendance)
// Version allégée : ne dessine que sur les côtés, traits regroupés par niveau d'opacité.
(() => {
  const canvas = document.getElementById('pluie');
  const colonne = document.querySelector('.page');
  if (!canvas || !colonne) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const ctx = canvas.getContext('2d');
  const PENTE = 0.2;                    // inclinaison (0 = verticales)
  const DENSITE = 9000;                 // plus grand = moins de gouttes
  const OPACITES = [0.2, 0.35, 0.5];    // 3 niveaux, 1 seul tracé par niveau
  let w, h, gauche, droite, cote, groupes = [], enCours = false;

  function xAleatoire() {
    // tire une position uniquement dans les bandes latérales
    const r = Math.random() * cote;
    return r < gauche ? r : droite + (r - gauche);
  }

  function goutte(auHasard) {
    return {
      x: xAleatoire(),
      y: auHasard ? Math.random() * h : -20,
      l: 10 + Math.random() * 18,
      v: 9 + Math.random() * 9
    };
  }

  function initialiser() {
    w = window.innerWidth;
    h = window.innerHeight;
    canvas.width = w;                   // pas de surrésolution : plus léger
    canvas.height = h;
    ctx.lineWidth = 1;
    ctx.lineCap = 'round';
    const r = colonne.getBoundingClientRect();
    gauche = Math.max(r.left, 0);
    droite = Math.min(r.right, w);
    cote = gauche + (w - droite);
    const n = cote > 40 ? Math.round((cote * h) / DENSITE) : 0;
    groupes = OPACITES.map(() => []);
    for (let i = 0; i < n; i++) groupes[i % 3].push(goutte(true));
    if (n > 0 && !enCours) { enCours = true; requestAnimationFrame(image); }
  }

  function image() {
    if (!groupes[0].length) {           // écran trop étroit : on arrête tout
      ctx.clearRect(0, 0, w, h);
      enCours = false;
      return;
    }
    ctx.clearRect(0, 0, w, h);
    groupes.forEach((groupe, i) => {
      ctx.strokeStyle = 'rgba(255,255,255,' + OPACITES[i] + ')';
      ctx.beginPath();
      for (const g of groupe) {
        if (g.x < gauche || g.x > droite) {   // invisible derrière la colonne : on ne dessine pas
          ctx.moveTo(g.x, g.y);
          ctx.lineTo(g.x - g.l * PENTE, g.y + g.l);
        }
        g.y += g.v;
        g.x -= g.v * PENTE;
        if (g.y > h + 20 || g.x < -50) Object.assign(g, goutte(false));
      }
      ctx.stroke();
    });
    requestAnimationFrame(image);
  }

  window.addEventListener('resize', initialiser);
  initialiser();
})();
