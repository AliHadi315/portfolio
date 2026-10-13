// All the text the script writes on the page: interface labels and the demo's questions and answers,
// in English and Arabic. Both pages load this before script.js (the behaviour); the Arabic page (/ar/)
// gets its text by <html lang>.
const AR = document.documentElement.lang === 'ar';
// Isolates a Latin snippet like "1536-d · 18ms" so right-to-left Arabic text doesn't reorder its parts
const ltr = s => AR ? `⁦${s}⁩` : s;
const T = AR ? {
  streaming: 'يبثّ…', tokens: n => `${n} رمزًا`, grounded: (ms, n) => `${ltr(`${ms} ms`)} · من ${n} مصادر`,
  words: ['تفكّر', 'تتحدّث', 'تبيع', 'تتذكّر', 'تستنتج'],
  updated: 'آخر تحديث ', dateLocale: 'ar-LB-u-nu-latn',
  loadFail: 'تعذّر تحميل المستودعات الآن.', seeOnGitHub: 'شاهدها على GitHub ↗',
  copy: 'نسخ', copied: 'تم النسخ!', openMenu: 'فتح القائمة', closeMenu: 'إغلاق القائمة',
} : {
  streaming: 'streaming…', tokens: n => `${n} tokens`, grounded: (ms, n) => `${ms} ms · grounded in ${n} sources`,
  words: ['think', 'talk', 'sell', 'remember', 'reason'],
  updated: 'updated ', dateLocale: 'en',
  loadFail: "Couldn't load repositories right now.", seeOnGitHub: 'See them on GitHub ↗',
  copy: 'copy', copied: 'copied!', openMenu: 'Open menu', closeMenu: 'Close menu',
};

// ---- Simulated RAG demo. Edit questions, sources and answers here (qAr/aAr: the Arabic page). ----
const QA = [
  { q: 'What do you build?',
    st: ['1536-d · 18ms', 'top-k 12 · 41ms', 'kept 3 · 22ms'],
    src: [['about.md', .93], ['experience/develoop.md', .88], ['services.md', .81]],
    a: 'At Develoop Group I build RAG pipelines, LLM agents and bilingual websites and online stores. I also take freelance web projects, and build my own apps like UniMate and Baleegh.', ms: 640,
    qAr: 'ماذا تبني؟',
    aAr: 'في Develoop Group أبني أنظمة RAG ووكلاء LLM ومواقع ومتاجر إلكترونية ثنائية اللغة. وأعمل أيضًا على مشاريع ويب مستقلة، وأبني تطبيقاتي الخاصة مثل UniMate وبلّغ.' },
  { q: 'How do you use AI in your apps?',
    st: ['1536-d · 16ms', 'top-k 12 · 38ms', 'kept 3 · 25ms'],
    src: [['projects/isacademy-rag.md', .95], ['projects/sightline.md', .90], ['projects/baleegh.md', .82]],
    a: 'Isacademy answers questions over PDFs in English or Arabic, with page-level citations. Sightline describes what a camera sees for people with low vision. Baleegh uses AI to prioritise citizen reports for municipalities.', ms: 702,
    qAr: 'كيف تستخدم الذكاء الاصطناعي في تطبيقاتك؟',
    aAr: 'يجيب Isacademy عن الأسئلة من ملفات PDF بالعربية أو الإنجليزية، مع الإشارة إلى الصفحة. ويصف Sightline ما تراه الكاميرا للأشخاص ضعاف البصر. ويستخدم بلّغ الذكاء الاصطناعي لترتيب أولوية بلاغات المواطنين للبلديات.' },
  { q: 'Do you code with AI?',
    st: ['1536-d · 15ms', 'top-k 12 · 36ms', 'kept 3 · 21ms'],
    src: [['workflow.md', .94], ['process.md', .89], ['toolbox.md', .80]],
    a: 'Yes, every day. I build web and AI projects with coding agents like Claude Code, Codex and Antigravity, and research with ChatGPT, Gemini and Claude. AI makes me faster, but I review, test and understand every line before it ships.', ms: 615,
    qAr: 'هل تبرمج بالذكاء الاصطناعي؟',
    aAr: 'نعم، كل يوم. أبني مشاريع الويب والذكاء الاصطناعي مع وكلاء برمجة مثل Claude Code وCodex وAntigravity، وأبحث باستخدام ChatGPT وGemini وClaude. الذكاء الاصطناعي يجعلني أسرع، لكنني أراجع كل سطر وأختبره وأفهمه قبل إطلاقه.' },
  { q: 'Is AI-written code safe?',
    st: ['1536-d · 16ms', 'top-k 12 · 39ms', 'kept 3 · 22ms'],
    src: [['workflow.md', .93], ['process.md', .88], ['toolbox.md', .81]],
    a: 'Only if someone checks it. AI drafts fast, but I review every line, test it, and fix anything that looks wrong before it ships. Client passwords and data never go into AI tools.', ms: 630,
    qAr: 'هل الكود الذي يكتبه الذكاء الاصطناعي آمن؟',
    aAr: 'فقط إذا راجعه أحد. الذكاء الاصطناعي يكتب المسودة بسرعة، لكنني أراجع كل سطر وأختبره وأصلح أي خلل قبل الإطلاق. ولا تدخل كلمات مرور العملاء أو بياناتهم في أدوات الذكاء الاصطناعي أبدًا.' },
  { q: 'Can you build my online store?',
    st: ['1536-d · 17ms', 'top-k 12 · 40ms', 'kept 3 · 23ms'],
    src: [['services/websites.md', .96], ['experience/develoop.md', .87], ['projects/al-qaysr.md', .79]],
    a: 'Yes. I build fast, mobile-first stores in English, Arabic or both, with product options, cash on delivery or online payments, delivery fees by area, and orders sent straight to your WhatsApp.', ms: 660,
    qAr: 'هل يمكنك بناء متجري الإلكتروني؟',
    aAr: 'نعم. أبني متاجر سريعة مصمّمة للجوّال أولًا بالعربية أو الإنجليزية أو كلتيهما، مع خيارات للمنتجات، والدفع عند الاستلام أو الدفع الإلكتروني، ورسوم توصيل حسب المنطقة، وطلبات تصل مباشرة إلى واتساب.' },
  { q: 'Can you add AI to my existing app?',
    st: ['1536-d · 17ms', 'top-k 12 · 44ms', 'kept 3 · 20ms'],
    src: [['process.md', .91], ['services.md', .87], ['projects/unimate-web.md', .78]],
    a: 'Usually, yes. We pick one feature where AI saves real time, I build a working demo on your data within days, and I review and test every line before it goes live.', ms: 588,
    qAr: 'هل يمكنك إضافة الذكاء الاصطناعي إلى تطبيقي الحالي؟',
    aAr: 'غالبًا نعم. نختار ميزة واحدة يوفّر فيها الذكاء الاصطناعي وقتًا حقيقيًا، وأبني نموذجًا عمليًا على بياناتك خلال أيام، وأراجع كل سطر وأختبره قبل الإطلاق.' },
  { q: 'Are you open to work?',
    st: ['1536-d · 14ms', 'top-k 12 · 35ms', 'kept 3 · 19ms'],
    src: [['contact.md', .95], ['about.md', .86], ['cv.pdf#p1', .80]],
    a: "Yes, remotely: freelance web projects and the right AI or web role. I'm based in Beirut and work in English and Arabic. Email me at meselmanialihadi@gmail.com.", ms: 570,
    qAr: 'هل أنت متاح للعمل؟',
    aAr: 'نعم، عن بُعد: مشاريع ويب مستقلة، ووظيفة مناسبة في الذكاء الاصطناعي أو الويب. أنا مقيم في بيروت وأعمل بالعربية والإنجليزية. راسلني على meselmanialihadi@gmail.com.' },
];
if (AR) QA.forEach(d => Object.assign(d, { q: d.qAr, a: d.aAr }));
