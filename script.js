// Sections are only hidden for the scroll reveal once this script is running (the `js` class),
// and the reveal is set up first, so a blocked script or a bug further down can't leave the page blank.
document.documentElement.classList.add('js');
const io = new IntersectionObserver(es => es.forEach(e => e.isIntersecting && (e.target.classList.add('in'), io.unobserve(e.target))), { rootMargin: '0px 0px -8% 0px' });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

const EMAIL = 'meselmanialihadi@gmail.com';
const $ = s => document.querySelector(s);
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const wait = ms => new Promise(r => setTimeout(r, reduce ? 0 : ms));
$('#y').textContent = new Date().getFullYear();

// ---- Simulated RAG demo. Edit questions, sources and answers here. ----
const QA = [
  { q: 'What do you build?',
    st: ['1536-d · 18ms', 'top-k 12 · 41ms', 'kept 3 · 22ms'],
    src: [['about.md', .93], ['experience/develoop.md', .88], ['services.md', .81]],
    a: 'At Develoop Group I build RAG pipelines, LLM agents and bilingual websites and online stores. I also take freelance web projects, and build my own apps like UniMate and Baleegh.', ms: 640 },
  { q: 'How do you use AI in your apps?',
    st: ['1536-d · 16ms', 'top-k 12 · 38ms', 'kept 3 · 25ms'],
    src: [['projects/isacademy-rag.md', .95], ['projects/sightline.md', .90], ['projects/baleegh.md', .82]],
    a: 'Isacademy answers questions over PDFs in English or Arabic, with page-level citations. Sightline describes what a camera sees for people with low vision. Baleegh uses AI to prioritise citizen reports for municipalities.', ms: 702 },
  { q: 'Do you code with AI?',
    st: ['1536-d · 15ms', 'top-k 12 · 36ms', 'kept 3 · 21ms'],
    src: [['workflow.md', .94], ['process.md', .89], ['toolbox.md', .80]],
    a: 'Yes, every day. I build web and AI projects with coding agents like Claude Code, Codex and Antigravity, and research with ChatGPT, Gemini and Claude. AI makes me faster, but I review, test and understand every line before it ships.', ms: 615 },
  { q: 'Is AI-written code safe?',
    st: ['1536-d · 16ms', 'top-k 12 · 39ms', 'kept 3 · 22ms'],
    src: [['workflow.md', .93], ['process.md', .88], ['toolbox.md', .81]],
    a: 'Only if someone checks it. AI drafts fast, but I review every line, test it, and fix anything that looks wrong before it ships. Client passwords and data never go into AI tools.', ms: 630 },
  { q: 'Can you build my online store?',
    st: ['1536-d · 17ms', 'top-k 12 · 40ms', 'kept 3 · 23ms'],
    src: [['services/websites.md', .96], ['experience/develoop.md', .87], ['projects/al-qaysr.md', .79]],
    a: 'Yes. I build fast, mobile-first stores in English, Arabic or both, with product options, cash on delivery or online payments, delivery fees by area, and orders sent straight to your WhatsApp.', ms: 660 },
  { q: 'Can you add AI to my existing app?',
    st: ['1536-d · 17ms', 'top-k 12 · 44ms', 'kept 3 · 20ms'],
    src: [['process.md', .91], ['services.md', .87], ['projects/unimate-web.md', .78]],
    a: 'Usually, yes. We pick one feature where AI saves real time, I build a working demo on your data within days, and I review and test every line before it goes live.', ms: 588 },
  { q: 'Are you open to work?',
    st: ['1536-d · 14ms', 'top-k 12 · 35ms', 'kept 3 · 19ms'],
    src: [['contact.md', .95], ['about.md', .86], ['cv.pdf#p1', .80]],
    a: "Yes, remotely: freelance web projects and the right AI or web role. I'm based in Beirut and work in English and Arabic. Email me at meselmanialihadi@gmail.com.", ms: 570 },
];
const stages = [...document.querySelectorAll('.stage')];
const asks = [...document.querySelectorAll('.ask')];
let run = 0, auto = true;

async function play(i) {
  const id = ++run, live = () => id === run, d = QA[i];
  asks.forEach((b, j) => b.setAttribute('aria-pressed', i === j));
  $('#q').textContent = ''; $('#a').textContent = ''; $('#a').classList.remove('done');
  $('#chunks').innerHTML = ''; $('#tot').textContent = '—'; $('#demo-announce').textContent = '';
  stages.forEach(s => { s.className = 'stage'; s.querySelector('small').textContent = s.dataset.idle; });

  for (const c of d.q) { $('#q').textContent += c; await wait(26); if (!live()) return; }
  await wait(250); if (!live()) return;
  for (let k = 0; k < 3; k++) {
    stages[k].classList.add('active'); await wait(480); if (!live()) return;
    stages[k].classList.replace('active', 'done'); stages[k].querySelector('small').textContent = d.st[k];
    if (k === 1) $('#chunks').innerHTML = d.src.map(([s, v]) => `<li><span>${s}</span><i style="--w:${v * 100}%"></i><b>${v.toFixed(2)}</b></li>`).join('');
  }
  const gen = stages[3]; gen.classList.add('active'); gen.querySelector('small').textContent = 'streaming…';
  const tokens = d.a.match(/\S+\s*/g);
  for (const t of tokens) { $('#a').textContent += t; await wait(38); if (!live()) return; }
  gen.classList.replace('active', 'done'); gen.querySelector('small').textContent = `${tokens.length} tokens`;
  $('#a').classList.add('done');
  $('#tot').textContent = `${d.ms} ms · grounded in ${d.src.length} sources`;
  // The typed text isn't a live region (it would be read letter by letter); announce the full answer once,
  // and only for questions the visitor clicked, never during autoplay.
  if (!auto) $('#demo-announce').textContent = `${d.q} ${d.a}`;
  if (auto && !reduce) { await wait(4200); if (live() && auto) play((i + 1) % QA.length); }
}
asks.forEach(b => b.addEventListener('click', () => { auto = false; play(+b.dataset.i); }));
// Start the demo once it's on screen, so the first load stays light (on phones it starts below the fold)
new IntersectionObserver((es, obs) => {
  if (es[0].isIntersecting) { obs.disconnect(); if (run === 0) play(0); }
}, { threshold: 0.3 }).observe($('.demo'));

// ---- Headline word rotator ----
if (!reduce) (async () => {
  const words = ['think', 'talk', 'sell', 'remember', 'reason'], el = $('#rot');
  for (let w = 0; ; w = (w + 1) % words.length) {
    await wait(2400);
    while (el.textContent) { el.textContent = el.textContent.slice(0, -1); await wait(45); }
    for (const c of words[(w + 1) % words.length]) { el.textContent += c; await wait(80); }
  }
})();

// ---- Project filter ----
const filters = [...document.querySelectorAll('.filter')], projs = [...document.querySelectorAll('.proj')];
filters.forEach(f => f.addEventListener('click', () => {
  filters.forEach(x => x.setAttribute('aria-pressed', x === f));
  projs.forEach(p => p.hidden = f.dataset.f !== 'all' && !p.dataset.tags.split(' ').includes(f.dataset.f));
}));

// ---- GitHub repos: loaded live, so new public repos show up without editing this page ----
const GITHUB_USER = 'AliHadi315';
const LANG_COLORS = { Dart: '#00b4ab', PHP: '#777bb4', TypeScript: '#3178c6', JavaScript: '#f1e05a', 'C++': '#f34b7d',
  Python: '#3572a5', Kotlin: '#a97bff', Java: '#b07219', HTML: '#e34c26', CSS: '#663399', Swift: '#f05138' };
(async () => {
  const list = $('#gh-list');
  const shown = new Set([...document.querySelectorAll('[data-repo]')].map(el => el.dataset.repo.toLowerCase()));
  shown.add('portfolio'); // this site's own repo: don't list the portfolio inside itself
  try {
    const res = await fetch(`https://api.github.com/users/${GITHUB_USER}/repos?per_page=100&sort=pushed`);
    if (!res.ok) throw new Error(`GitHub returned ${res.status}: ${(await res.text()).slice(0, 200)}`);
    const data = await res.json();
    if (!Array.isArray(data)) throw new Error(`GitHub response is not a list of repositories: ${JSON.stringify(data).slice(0, 200)}`);
    const invalid = data.filter(r => typeof r?.name !== 'string');
    if (invalid.length) console.warn(`Skipping ${invalid.length} GitHub entries without a name`, invalid);
    const repos = data.filter(r => typeof r?.name === 'string' &&
      !r.fork && !r.archived && !shown.has(r.name.toLowerCase()) && !(r.topics || []).includes('no-portfolio'));
    if (!repos.length) { list.innerHTML = '<li class="gh-note">New repositories will appear here automatically.</li>'; return; }
    list.replaceChildren(...repos.map(r => {
      const li = document.createElement('li');
      li.innerHTML = `<a class="gh-row" target="_blank" rel="noopener noreferrer"><strong></strong><p></p><span class="gh-meta"></span><svg class="icon arrow"><use href="#i-arrow"/></svg></a>`;
      const a = li.firstChild;
      // Only link a repo's "website" if it's a real web address; anything else (e.g. javascript:) links the repo itself
      const site = /^https?:\/\//i.test(r.homepage ?? '') ? r.homepage : null;
      if (r.homepage && !site) console.warn(`Ignoring non-web homepage for ${r.name}: ${r.homepage}`);
      a.href = site ?? `https://github.com/${GITHUB_USER}/${encodeURIComponent(r.name)}`;
      a.querySelector('strong').textContent = r.name.replace(/[-_]+/g, ' ');
      const p = a.querySelector('p');
      p.textContent = r.description || 'No description yet.';
      if (!r.description) p.className = 'none';
      const meta = a.querySelector('.gh-meta');
      if (r.language) {
        const lang = document.createElement('span');
        lang.innerHTML = '<i></i>';
        lang.firstChild.style.setProperty('--c', LANG_COLORS[r.language] || 'var(--muted)');
        lang.append(r.language);
        meta.append(lang);
      }
      if (r.stargazers_count) meta.append(Object.assign(document.createElement('span'), { textContent: `★ ${r.stargazers_count}` }));
      meta.append(Object.assign(document.createElement('span'), {
        textContent: 'updated ' + new Date(r.pushed_at).toLocaleDateString('en', { month: 'short', year: 'numeric' }) }));
      return li;
    }));
  } catch (err) {
    console.error('Could not load GitHub repositories:', err);
    list.innerHTML = `<li class="gh-note">Couldn't load repositories right now. <a href="https://github.com/${GITHUB_USER}" target="_blank" rel="noopener noreferrer">See them on GitHub ↗</a></li>`;
  }
})();

// ---- Demo store: EN/AR switch (right-to-left), options, delivery fee by area ----
const store = $('#store'), area = $('#area');
const translatable = [...store.querySelectorAll('[data-ar]')];
translatable.forEach(el => el.dataset.en = el.textContent);
store.querySelectorAll('.lang button').forEach(b => b.addEventListener('click', () => {
  const ar = b.dataset.lang === 'ar';
  store.dir = ar ? 'rtl' : 'ltr';
  store.lang = ar ? 'ar' : 'en';
  translatable.forEach(el => el.textContent = ar ? el.dataset.ar : el.dataset.en);
  store.querySelectorAll('.lang button').forEach(x => x.setAttribute('aria-pressed', x === b));
}));
store.querySelectorAll('.opts').forEach(group => group.addEventListener('click', e => {
  const pick = e.target.closest('button');
  if (!pick) return;
  group.querySelectorAll('button').forEach(x => x.setAttribute('aria-pressed', x === pick));
  if (pick.classList.contains('sw')) store.querySelector('.thumb').style.setProperty('--shirt', pick.style.getPropertyValue('--sw'));
}));
const SHIRT_PRICE = 24;
const updateTotal = () => $('#store-total').textContent = '$' + (SHIRT_PRICE + Number(area.value));
area.addEventListener('change', updateTotal);
updateTotal();

// ---- Card spotlight ----
document.querySelectorAll('.spot').forEach(el => el.addEventListener('pointermove', e => {
  const r = el.getBoundingClientRect();
  el.style.setProperty('--mx', e.clientX - r.left + 'px');
  el.style.setProperty('--my', e.clientY - r.top + 'px');
}));

// ---- Copy email ----
$('#copy').addEventListener('click', async e => {
  const label = e.currentTarget.querySelector('span');
  try { await navigator.clipboard.writeText(EMAIL); label.textContent = 'copied!'; }
  catch { location.href = 'mailto:' + EMAIL; }
  setTimeout(() => label.textContent = 'copy', 1800);
});

// ---- Mobile menu ----
const btn = $('.menu-btn'), menu = $('#mobile-menu');
function setMenu(open) {
  menu.classList.toggle('open', open); menu.inert = !open;
  btn.setAttribute('aria-expanded', open);
  btn.querySelector('use').setAttribute('href', open ? '#i-x' : '#i-menu');
  btn.querySelector('.sr-only').textContent = open ? 'Close menu' : 'Open menu';
  document.body.style.overflow = open ? 'hidden' : '';
}
btn.addEventListener('click', () => setMenu(!menu.classList.contains('open')));
menu.addEventListener('click', e => e.target.closest('a') && setMenu(false));
addEventListener('keydown', e => e.key === 'Escape' && setMenu(false));

// ---- Active nav ----
const navLinks = [...document.querySelectorAll('.nav-links a')];
const spy = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) navLinks.forEach(a => a.setAttribute('aria-current', a.hash === '#' + e.target.id));
}), { rootMargin: '-45% 0px -50% 0px' });
document.querySelectorAll('main section[id]').forEach(s => spy.observe(s));
