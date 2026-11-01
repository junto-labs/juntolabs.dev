document.documentElement.classList.add('js');

// Close the Tools menu on an outside click or Escape.
const tools = document.querySelector('nav details');
if (tools) {
  document.addEventListener('click', (e) => { if (!tools.contains(e.target)) tools.open = false; });
  tools.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') { tools.open = false; tools.querySelector('summary').focus(); }
  });
}

// Ease sections in as they scroll into view.
const reveals = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const seen = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (e.isIntersecting) { e.target.classList.add('in'); seen.unobserve(e.target); }
    }
  }, { rootMargin: '0px 0px -10% 0px' });
  reveals.forEach((el) => seen.observe(el));
} else {
  reveals.forEach((el) => el.classList.add('in'));
}

// Draw the arrows in "How Junto works" between the boxes, wherever the grid puts them.
const flow = document.querySelector('.flow');
if (flow) {
  const svg = flow.querySelector('.wires');
  const NS = 'http://www.w3.org/2000/svg';
  const colors = {
    gray: ['#6B7280', '#9AA0A9'],
    orange: ['#E8590C', '#F08A4B'],
    blue: ['#1D5FD1', '#7FA6EC'],
    purple: ['#6544F0', '#A895F7'],
    green: ['#1F8A4C', '#6CC191'],
  };

  const box = (name) => {
    const f = flow.getBoundingClientRect();
    const b = flow.querySelector(`[data-node="${name}"]`).getBoundingClientRect();
    return {
      l: b.left - f.left, r: b.right - f.left, t: b.top - f.top, b: b.bottom - f.top,
      cx: (b.left + b.right) / 2 - f.left, cy: (b.top + b.bottom) / 2 - f.top,
    };
  };

  const add = (tag, attrs, text) => {
    const el = document.createElementNS(NS, tag);
    for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
    if (text) el.textContent = text;
    svg.appendChild(el);
  };

  const wire = (d, color, label, x, y, anchor = 'middle', mono = false) => {
    add('path', { d, fill: 'none', stroke: colors[color][0], 'stroke-width': 2, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'marker-end': `url(#head-${color})` });
    add('text', { x, y, fill: colors[color][1], 'text-anchor': anchor, class: mono ? 'mono' : '' }, label);
  };

  const draw = () => {
    if (getComputedStyle(svg).display === 'none') return;
    svg.replaceChildren();
    const defs = document.createElementNS(NS, 'defs');
    for (const [name, [stroke]] of Object.entries(colors)) {
      defs.insertAdjacentHTML('beforeend',
        `<marker id="head-${name}" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 Z" fill="${stroke}"/></marker>`);
    }
    svg.appendChild(defs);

    const sys = box('sys'), intake = box('intake'), baton = box('baton'), broker = box('broker'), world = box('world');
    const warden = box('warden'), actors = box('actors'), know = box('know'), ledger = box('ledger');
    const y = baton.cy, gap = 6;
    const across = (a, b, label) => wire(`M${a.r + gap} ${y} H${b.l - gap}`, 'gray', label, (a.r + b.l) / 2, y - 12);

    across(sys, intake, 'new work');
    across(intake, baton, 'WorkItem');
    across(baton, broker, 'side effects');
    across(broker, world, 'writes');

    wire(`M${baton.cx - 28} ${baton.t - gap} V${warden.b + gap}`, 'blue', 'may I?', baton.cx - 40, (baton.t + warden.b) / 2 + 4, 'end');
    wire(`M${baton.cx + 28} ${warden.b + gap} V${baton.t - gap}`, 'blue', 'allow / deny', baton.cx + 40, (baton.t + warden.b) / 2 + 4, 'start');

    const mid = (baton.r + broker.l) / 2, start = baton.t + 32;
    wire(`M${baton.r + gap} ${start} H${mid} V${actors.cy} H${actors.l - gap}`, 'orange', 'next / pass', mid + 12, (start + actors.cy) / 2, 'start', true);

    wire(`M${know.l - gap} ${know.cy} H${actors.r + gap}`, 'purple', 'context', (actors.r + know.l) / 2, know.cy - 12);
    wire(`M${baton.cx} ${baton.b + gap} V${ledger.t - gap}`, 'green', 'evidence', baton.cx + 12, (baton.b + ledger.t) / 2 + 4, 'start');
  };

  new ResizeObserver(draw).observe(flow);
  document.fonts?.ready.then(draw);
}
