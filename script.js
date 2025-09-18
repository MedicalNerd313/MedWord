
const yearEl = document.getElementById('year');
yearEl.textContent = new Date().getFullYear();

// Theme toggle
const themeToggle = document.getElementById('themeToggle');
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'light') document.body.classList.add('light');

themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('light');
  localStorage.setItem('theme', document.body.classList.contains('light') ? 'light' : 'dark');
});

// Load data
const state = { words: [], facts: [] };

async function loadData() {
  const [wRes, fRes] = await Promise.all([
    fetch('data/words.json'),
    fetch('data/facts.json')
  ]);
  state.words = await wRes.json();
  state.facts = await fRes.json();
}

function seededIndex(len, offset=0) {
  const d = new Date();
  const seed = (d.getFullYear() * 372) + (d.getMonth() * 31) + d.getDate() + offset; // deterministic per day
  return len ? Math.abs(seed) % len : 0;
}

function renderWordOfDay() {
  const container = document.getElementById('wordContent');
  if (!state.words.length) { container.textContent = 'No words found. Add items to data/words.json'; return; }
  const idx = seededIndex(state.words.length);
  const w = state.words[idx];
  container.innerHTML = `
    <h3>${w.term}</h3>
    <div class="pron">${w.pronunciation || ''} ${w.partOfSpeech ? '• ' + w.partOfSpeech : ''}</div>
    <p>${w.shortDefinition || ''}</p>
    ${w.longDefinition ? `<details><summary>Learn more</summary><p>${w.longDefinition}</p></details>` : ''}
    ${w.example ? `<p><em>Example:</em> ${w.example}</p>` : ''}
    <div class="tags">${(w.tags||[]).map(t => `<span class='tag'>${t}</span>`).join('')}</div>
  `;
}

function renderFact() {
  const container = document.getElementById('factContent');
  if (!state.facts.length) { container.textContent = 'No facts yet. Add items to data/facts.json'; return; }
  const idx = seededIndex(state.facts.length, 7); // different offset so it changes independently
  const f = state.facts[idx];
  container.innerHTML = `
    <p>${f.fact}</p>
  `;
}

function setupSearch() {
  const input = document.getElementById('searchInput');
  const results = document.getElementById('results');
  function update() {
    const q = input.value.toLowerCase().trim();
    const filtered = state.words.filter(w => !q || w.term.toLowerCase().includes(q) || (w.shortDefinition||'').toLowerCase().includes(q));
    results.innerHTML = filtered.map(w => `
      <div class="result-item">
        <strong>${w.term}</strong> ${w.partOfSpeech ? '('+w.partOfSpeech+')' : ''}
        <div class="pron">${w.pronunciation || ''}</div>
        <div>${w.shortDefinition || ''}</div>
        ${(w.sources && w.sources.length) ? `<details><summary>Sources</summary><ul>` + w.sources.map(s => `<li><a href="${s.url}" target="_blank" rel="noopener">${s.name || s.url}</a></li>`).join('') + `</ul></details>` : ''}
      </div>
    `).join('');
  }
  input.addEventListener('input', update);
  update();
}

function setupQuiz() {
  const btn = document.getElementById('newQuiz');
  const area = document.getElementById('quizArea');

  function newQuestion() {
    area.hidden = false;
    area.innerHTML = '';
    if (state.words.length < 4) {
      area.innerHTML = '<p>Add at least 4 words to words.json to enable the quiz.</p>';
      return;
    }
    // pick correct answer
    const correctIdx = Math.floor(Math.random() * state.words.length);
    const correct = state.words[correctIdx];
    // pick 3 distractors
    const others = state.words.filter((_,i) => i !== correctIdx);
    for (let i = others.length - 1; i > 0; i--) { // shuffle
      const j = Math.floor(Math.random() * (i + 1));
      [others[i], others[j]] = [others[j], others[i]];
    }
    const options = [correct, ...others.slice(0,3)];
    // shuffle options
    for (let i = options.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [options[i], options[j]] = [options[j], options[i]];
    }
    const def = correct.shortDefinition || correct.longDefinition || 'Definition unavailable — add one in words.json.';
    const prompt = document.createElement('p');
    prompt.innerHTML = `<strong>Definition:</strong> ${def}`;
    area.appendChild(prompt);

    options.forEach(opt => {
      const btn = document.createElement('button');
      btn.className = 'option';
      btn.textContent = opt.term;
      btn.addEventListener('click', () => {
        document.querySelectorAll('.option').forEach(b => b.disabled = true);
        if (opt.term === correct.term) {
          btn.classList.add('correct');
        } else {
          btn.classList.add('wrong');
        }
      });
      area.appendChild(btn);
    });
  }

  btn.addEventListener('click', newQuestion);
}

function setupSourcesDialog() {
  const dialog = document.getElementById('sourcesDialog');
  const openBtn = document.getElementById('openSources');
  openBtn.addEventListener('click', (e) => {
    e.preventDefault();
    // Aggregate unique sources from both datasets
    const srcs = new Map();
    for (const w of state.words) {
      (w.sources||[]).forEach(s => srcs.set(s.url, s));
    }
    const list = document.getElementById('sourcesList');
    if (srcs.size === 0) {
      list.innerHTML = '<p>No sources added yet. Edit data/words.json to add citations.</p>';
    } else {
      list.innerHTML = '<ul>' + Array.from(srcs.values()).map(s => `<li><a href="${s.url}" target="_blank" rel="noopener">${s.name || s.url}</a></li>`).join('') + '</ul>';
    }
    dialog.showModal();
  });
}

async function init() {
  await loadData();
  renderWordOfDay();
  renderFact();
  setupSearch();
  setupQuiz();
  setupSourcesDialog();
}

init();
