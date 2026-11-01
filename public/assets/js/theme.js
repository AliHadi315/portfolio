// Light/dark switch. The snippet in each page's <head> sets data-theme before the first paint (the saved pick, else the
// system setting). This shows the header switch, saves a pick on this device, and keeps following the system until one is made.
(() => {
  const root = document.documentElement, buttons = [...document.querySelectorAll('.theme-toggle')];
  const systemLight = matchMedia('(prefers-color-scheme: light)');
  let saved = null;
  try { saved = localStorage.getItem('theme'); } catch { /* storage blocked (private window): the switch still works on this page */ }
  const sync = () => buttons.forEach(b => b.setAttribute('aria-pressed', root.dataset.theme === 'light'));
  systemLight.addEventListener('change', e => {
    if (saved === 'light' || saved === 'dark') return; // the visitor's pick wins over the system
    root.dataset.theme = e.matches ? 'light' : 'dark';
    sync();
  });
  for (const b of buttons) {
    b.hidden = false;
    b.addEventListener('click', () => {
      saved = root.dataset.theme === 'light' ? 'dark' : 'light';
      root.dataset.theme = saved;
      try { localStorage.setItem('theme', saved); } catch { /* not remembered, but applied to this page */ }
      sync();
    });
  }
  sync();
})();
