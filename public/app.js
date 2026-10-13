import { compat, describeIlju, pillarsOf } from './lib/score.js';
import { GAN, JI, GAN_HAN, JI_HAN, GAN_EL, JI_EL, ganji } from './lib/saju.js';
import { MBTI_NAME, BLOOD_KEYWORD } from './lib/rules.js';

const $app = document.getElementById('app');
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

async function api(path, method = 'GET', body) {
  const res = await fetch(path, { method, headers: body ? { 'content-type': 'application/json' } : {}, body: body ? JSON.stringify(body) : undefined });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || '요청에 실패했어요');
  return data;
}
const store = {
  get: (roomId) => { try { return JSON.parse(localStorage.getItem('samhap:' + roomId)) || {}; } catch { return {}; } },
  set: (roomId, v) => { try { localStorage.setItem('samhap:' + roomId, JSON.stringify(v)); } catch { /* 사생활 모드 등 */ } },
};
let toastTimer;
function toast(msg) {
  document.querySelector('.toast')?.remove();
  const el = document.createElement('div'); el.className = 'toast'; el.setAttribute('role', 'status'); el.textContent = msg; document.body.appendChild(el);
  clearTimeout(toastTimer); toastTimer = setTimeout(() => el.remove(), 2200);
}

const FOOT = `<p class="footnote">혈액형·MBTI·사주 궁합은 과학적 근거가 없는 재미용 풀이예요. 점수는 널리 퍼진 궁합표를 합쳐 만든 값입니다.</p>`;

// ───────────────────────── 홈 ─────────────────────────
function renderHome() {
  $app.innerHTML = `
    <header class="masthead"><span class="logo">三合</span><h1>삼합궁합</h1><p class="tagline">혈액형 · MBTI · 사주, 셋을 합쳐 본 우리 방 궁합</p></header>
    <section class="sheet talisman">
      <h2>방 열기</h2>
      <form id="create">
        <label class="field"><span>방 이름</span><input type="text" name="name" maxlength="30" placeholder="예: 고3 7반 단톡방" required></label>
        <label class="field"><span>인원수</span><input type="number" name="size" min="2" max="60" value="6" required> <span class="muted small">나중에 더 들어와도 돼요</span></label>
        <button class="btn primary block" type="submit">방 열고 링크 받기</button>
        <p class="error hidden"></p>
      </form>
    </section>
    <section class="sheet">
      <h3 style="margin-top:0;margin-bottom:16px">이렇게 돌아가요</h3>
      <ol class="steps">
        <li><i>1</i><span>방을 열면 링크가 생겨요. 단톡방에 붙여넣으세요.</span></li>
        <li><i>2</i><span>들어온 사람마다 혈액형·MBTI·생년월일(생시)을 넣어요.</span></li>
        <li><i>3</i><span>세 체계를 합쳐 나와 가장 잘 맞는 친구 순위와 방 전체 유대 지도가 나와요.</span></li>
      </ol>
    </section>
    ${FOOT}`;
  $app.querySelector('#create').addEventListener('submit', async (e) => {
    e.preventDefault();
    const f = e.target, err = f.querySelector('.error');
    const btn = f.querySelector('button'); btn.disabled = true; btn.textContent = '방 여는 중…';
    try {
      const { id } = await api('/api/rooms', 'POST', { name: f.name.value, size: +f.size.value });
      store.set(id, { owner: true });
      location.assign('/r/' + id);
    } catch (ex) { err.textContent = ex.message; err.classList.remove('hidden'); btn.disabled = false; btn.textContent = '방 열고 링크 받기'; }
  });
}

// ───────────────────────── 입력 폼 ─────────────────────────
function memberForm(init = {}) {
  const mbti = init.mbti || '';
  const seg = (i, a, b, la, lb) => `<div class="seg" data-i="${i}">
      <button type="button" aria-pressed="${mbti[i] === a}" data-v="${a}">${a}<small>${la}</small></button>
      <button type="button" aria-pressed="${mbti[i] === b}" data-v="${b}">${b}<small>${lb}</small></button></div>`;
  return `
    <form id="member" autocomplete="off" novalidate>
      <label class="field"><span>이름 (방에서 부르는 이름)</span><input type="text" name="name" maxlength="12" value="${esc(init.name || '')}" required></label>
      <div class="field"><span class="field-name">혈액형</span>
        <div class="tiles" id="blood" role="group" aria-label="혈액형">${['A', 'B', 'O', 'AB'].map((t) => `<button type="button" class="tile" aria-pressed="${init.blood === t}" data-v="${t}">${t}</button>`).join('')}</div></div>
      <div class="field"><span class="field-name">MBTI</span>
        <div class="seg-grid" id="mbti" role="group" aria-label="MBTI">${seg(0, 'E', 'I', '외향', '내향')}${seg(1, 'S', 'N', '감각', '직관')}${seg(2, 'T', 'F', '사고', '감정')}${seg(3, 'J', 'P', '판단', '인식')}</div>
        <p class="mbti-preview" id="mbtiPreview">${mbti ? `${mbti} <small>${MBTI_NAME[mbti] || ''}</small>` : '&nbsp;'}</p></div>
      <label class="field"><span>생년월일 (양력)</span><input type="date" name="birth" min="1900-01-01" max="2100-12-31" value="${esc(init.birth || '')}" required></label>
      <div class="field"><span class="field-name">태어난 시각</span>
        <div class="row"><input type="time" name="time" value="${esc(init.time || '')}" style="width:auto" ${init.time === null && init.birth ? 'disabled' : ''}>
        <label class="check"><input type="checkbox" name="notime" ${init.time === null && init.birth ? 'checked' : ''}> 몰라요</label></div>
        <p class="muted small" style="margin-top:6px">시각을 알면 시주까지 네 기둥, 모르면 세 기둥으로 봐요.</p></div>
      <button class="btn primary block" type="submit">${init.id ? '수정 저장' : '궁합 보기'}</button>
      <p class="error hidden"></p>
    </form>`;
}
function bindForm(root, onSubmit) {
  const f = root.querySelector('#member');
  root.querySelector('#blood').addEventListener('click', (e) => {
    const b = e.target.closest('button'); if (!b) return;
    root.querySelectorAll('#blood button').forEach((x) => x.setAttribute('aria-pressed', x === b));
  });
  const preview = root.querySelector('#mbtiPreview');
  root.querySelector('#mbti').addEventListener('click', (e) => {
    const b = e.target.closest('button'); if (!b) return;
    b.parentElement.querySelectorAll('button').forEach((x) => x.setAttribute('aria-pressed', x === b));
    const v = readMbti(root);
    preview.innerHTML = v.length === 4 ? `${v} <small>${MBTI_NAME[v]}</small>` : (v || '&nbsp;');
  });
  f.notime.addEventListener('change', () => { f.time.disabled = f.notime.checked; if (f.notime.checked) f.time.value = ''; });
  f.addEventListener('submit', async (e) => {
    e.preventDefault();
    const err = f.querySelector('.error'); err.classList.add('hidden');
    const data = {
      name: f.name.value.trim(), blood: root.querySelector('#blood [aria-pressed=true]')?.dataset.v,
      mbti: readMbti(root), birth: f.birth.value, time: f.notime.checked ? null : f.time.value || null,
    };
    if (!data.name) return showErr(err, '이름을 넣어주세요');
    if (!data.blood) return showErr(err, '혈액형을 골라주세요');
    if (data.mbti.length !== 4) return showErr(err, 'MBTI 네 글자를 모두 골라주세요');
    if (!data.birth) return showErr(err, '생년월일을 넣어주세요');
    if (!f.notime.checked && !data.time) return showErr(err, '태어난 시각을 넣거나 "몰라요"를 체크하세요');
    const btn = f.querySelector('button[type=submit]'), label = btn.textContent;
    btn.disabled = true; btn.textContent = '사주 세우는 중…';
    try { await onSubmit(data); } catch (ex) { showErr(err, ex.message); err.scrollIntoView({ block: 'nearest' }); btn.disabled = false; btn.textContent = label; }
  });
}
const readMbti = (root) => [0, 1, 2, 3].map((i) => root.querySelector(`#mbti .seg[data-i="${i}"] [aria-pressed=true]`)?.dataset.v || '').join('');
const showErr = (el, msg) => { el.textContent = msg; el.classList.remove('hidden'); el.scrollIntoView({ block: 'nearest' }); };

// ───────────────────────── 방 ─────────────────────────
let room, roomId, me, tab = 'rank', viewAs = null, pollTimer, stamped = false, selectedNode = null;

async function loadRoom(id) {
  roomId = id;
  const saved = store.get(id);
  $app.innerHTML = '<p class="loading">방을 불러오는 중…</p>';
  try { room = await api('/api/rooms/' + id); } catch (ex) { $app.innerHTML = `<section class="sheet"><h2>방을 찾을 수 없어요</h2><p>링크가 틀렸거나 방이 지워졌어요. 공유받은 링크를 다시 확인해 주세요.</p><p><a href="/">새 방 열기</a></p></section>`; return; }
  me = room.members.find((m) => m.id === saved.memberId) || null;
  if (!viewAs || !room.members.some((m) => m.id === viewAs)) viewAs = me?.id || null;
  document.title = `${room.name} — 삼합궁합`;
  renderRoom();
  clearInterval(pollTimer);
  pollTimer = setInterval(async () => { // ponytail: 20초 폴링. 실시간이 필요하면 Durable Object/WebSocket.
    if (document.hidden || roomId !== id) return;
    try { const fresh = await api('/api/rooms/' + id); if (JSON.stringify(fresh) !== JSON.stringify(room)) { room = fresh; me = room.members.find((m) => m.id === saved.memberId) || null; renderRoom(); } } catch { /* 잠시 후 재시도 */ }
  }, 20000);
}

function shareLink() {
  const url = location.origin + '/r/' + roomId;
  const text = `[삼합궁합] ${room.name} — 혈액형·MBTI·사주 합친 궁합 보기`;
  if (navigator.share) navigator.share({ title: '삼합궁합', text, url }).catch(() => {});
  else navigator.clipboard?.writeText(url).then(() => toast('링크를 복사했어요')).catch(() => prompt('링크를 복사하세요', url));
}

function renderRoom() {
  const head = `
    <header class="roomhead">
      <div><a href="/" class="crumb">三合 삼합궁합</a><h1>${esc(room.name)}</h1></div>
      <div class="row"><span class="progress">${room.members.length}/${room.size}명 입력</span><button class="btn ghost" id="share">링크 공유</button></div>
    </header>`;
  if (!me) {
    $app.innerHTML = head + `
      <section class="sheet talisman"><h2>내 정보 넣기</h2>${memberForm()}</section>
      ${room.members.length ? `<section class="sheet"><h3 style="margin-top:0">먼저 들어온 사람</h3><p>${room.members.map((m) => esc(m.name)).join(', ')}</p>
        <p class="muted small">입력 없이 구경만 하려면 <a href="#" id="peek">여기</a>를 눌러요.</p></section>` : ''}
      ${FOOT}`;
    bindForm($app, async (data) => {
      const res = await api(`/api/rooms/${roomId}/members`, 'POST', data);
      store.set(roomId, { ...store.get(roomId), memberId: res.memberId, token: res.token });
      room = res.room; me = room.members.find((m) => m.id === res.memberId); viewAs = me.id; stamped = false;
      renderRoom();
    });
    $app.querySelector('#peek')?.addEventListener('click', (e) => { e.preventDefault(); viewAs = room.members[0].id; me = { id: null, peek: true }; renderRoom(); });
  } else {
    const others = room.members.filter((m) => m.id !== viewAs);
    const tabs = [['rank', '궁합 순위'], ['map', '유대 지도'], ['me', me.peek ? '사주 보기' : '내 사주']];
    $app.innerHTML = head + `
      ${me.peek ? '<div class="notice"><span>구경 중이에요. 내 정보를 넣으면 나와의 궁합이 나와요.</span><button class="btn ghost small" id="join">내 정보 넣기</button></div>' : ''}
      <nav class="tabs" role="tablist">${tabs.map(([k, l]) => `<button role="tab" aria-selected="${tab === k}" data-tab="${k}">${l}</button>`).join('')}</nav>
      <div id="panel" role="tabpanel"></div>${FOOT}`;
    $app.querySelector('#join')?.addEventListener('click', () => { me = null; viewAs = null; renderRoom(); });
    $app.querySelector('.tabs').addEventListener('click', (e) => { const b = e.target.closest('button'); if (b) { tab = b.dataset.tab; renderRoom(); } });
    const panel = $app.querySelector('#panel');
    if (tab === 'rank') renderRank(panel, others);
    else if (tab === 'map') renderMap(panel);
    else renderMe(panel);
  }
  $app.querySelector('#share').addEventListener('click', shareLink);
}

function perspective() {
  if (room.members.length < 2) return '';
  const sel = `<label class="row" style="margin-bottom:12px"><span>기준:</span><select id="viewAs" style="width:auto">${room.members.map((m) => `<option value="${m.id}" ${m.id === viewAs ? 'selected' : ''}>${esc(m.name)}${m.id === me?.id ? ' (나)' : ''}</option>`).join('')}</select></label>`;
  return sel;
}

function renderRank(panel, others) {
  const base = room.members.find((m) => m.id === viewAs);
  if (!base) return;
  const rows = others.map((m) => ({ m, c: compat(base, m) })).sort((a, b) => b.c.total - a.c.total);
  const doStamp = !stamped; stamped = true;
  panel.innerHTML = `
    <section class="sheet">
      ${perspective()}
      ${rows.length === 0 ? `<div class="empty"><h2>아직 ${esc(base.name)}님뿐이에요</h2><p class="muted">링크를 단톡방에 올리면 친구들이 들어와 순위가 생겨요.</p><button class="btn primary" id="shareEmpty">링크 공유</button></div>` : `
      <div class="best">
        <div><div class="label">${esc(base.name)}님과 가장 잘 맞는 사람</div><div class="name">${esc(rows[0].m.name)}</div><div class="sub">${rows[0].c.grade} · 혈액형 ${rows[0].c.blood.score} · MBTI ${rows[0].c.mbti.score} · 사주 ${rows[0].c.saju.score}</div></div>
        <span class="seal ${doStamp ? 'stamp' : ''}" aria-label="${rows[0].c.total}점">${rows[0].c.total}</span>
      </div>
      <h2 style="margin-bottom:4px">잘 맞는 순서</h2>
      <p class="muted small" style="margin-bottom:8px">혈액형 25% + MBTI 35% + 사주 40%. 이름을 누르면 이유가 펼쳐져요.</p>
      <ol class="rank">${rows.map(({ m, c }, i) => `
        <li><details>
          <summary>
            ${badge(i + 1)}
            <span class="who"><b>${esc(m.name)}</b><span class="chips"><span class="chip">${m.blood}형</span><span class="chip">${m.mbti}</span><span class="chip">${ganji(pillarsOf(m).day)}일주</span></span></span>
            <span class="score"><b>${c.total}</b><span>${c.grade}</span></span>
            <span class="track"><i style="width:${c.total}%;animation-delay:${i * 60}ms"></i></span>
          </summary>
          <div class="detail">
            <div class="bars">
              ${bar('blood', '혈액형', c.blood.score)}${bar('mbti', 'MBTI', c.mbti.score)}${bar('saju', '사주', c.saju.score)}
            </div>
            <ul class="reasons">
              <li><span class="tag">혈액형 ${base.blood}·${m.blood}</span><span>${esc(c.blood.reason)}</span></li>
              <li><span class="tag">MBTI ${base.mbti}·${m.mbti}</span><span>${esc(c.mbti.reason)}. ${esc(c.mbti.tier)}</span></li>
              ${c.saju.reasons.slice(0, 6).map((r) => `<li class="${r.delta > 0 ? 'plus' : 'minus'}"><span class="d">${r.delta > 0 ? '+' : ''}${r.delta}</span><span>${esc(r.text)}</span></li>`).join('')}
              ${c.saju.hourKnown ? '' : '<li class="muted"><span class="d"></span><span>한쪽이 생시를 몰라 시주는 빼고 봤어요.</span></li>'}
            </ul>
          </div>
        </details></li>`).join('')}
      </ol>`}
    </section>`;
  panel.querySelector('#viewAs')?.addEventListener('change', (e) => { viewAs = e.target.value; stamped = false; renderRoom(); });
  panel.querySelector('#shareEmpty')?.addEventListener('click', shareLink);
}
const bar = (cls, label, v) => `<div class="bar ${cls}"><span>${label}</span><i><b style="width:${v}%"></b></i><span>${v}</span></div>`;
const CROWN = `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M3 18h18v2H3v-2zm0-2 1.2-9 4.8 4 3-6 3 6 4.8-4L21 16H3z"/></svg>`;
const badge = (n) => n <= 3
  ? `<span class="badge top r${n}" aria-label="${n}위">${CROWN}</span>`
  : `<span class="badge" aria-label="${n}위">${n}</span>`;

// ───────────────────────── 유대 지도 ─────────────────────────
function renderMap(panel) {
  const ms = room.members;
  panel.innerHTML = `<section class="sheet" style="padding:12px">
    <canvas class="sky" id="sky" aria-label="방 전체 궁합 유대 지도"></canvas>
    <div class="legend">
      <span><svg width="24" height="6" aria-hidden="true"><line x1="0" y1="3" x2="24" y2="3" stroke="#b8331f" stroke-width="3"/></svg>75점 이상</span>
      <span><svg width="24" height="6" aria-hidden="true"><line x1="0" y1="3" x2="24" y2="3" stroke="#8e8676" stroke-width="2"/></svg>60~74</span>
      <span><svg width="24" height="6" aria-hidden="true"><line x1="0" y1="3" x2="24" y2="3" stroke="#8e8676" stroke-width="1"/></svg>45~59</span>
      <span><svg width="24" height="6" aria-hidden="true"><line x1="0" y1="3" x2="24" y2="3" stroke="#8e8676" stroke-width="1" stroke-dasharray="4 4"/></svg>45점 미만</span>
    </div>
    <p class="muted small" style="margin:12px 0 0">별을 누르면 그 사람과 모두의 궁합이 보여요. 가까이 모일수록 잘 맞는 무리예요.</p>
    <div id="pick"></div></section>`;
  if (ms.length < 2) { panel.querySelector('#pick').innerHTML = '<p class="muted">두 명 이상 모이면 별자리가 그려져요.</p>'; }
  const canvas = panel.querySelector('#sky');
  const dpr = window.devicePixelRatio || 1;
  const W = canvas.clientWidth, H = canvas.clientHeight;
  canvas.width = W * dpr; canvas.height = H * dpr;
  const ctx = canvas.getContext('2d'); ctx.scale(dpr, dpr);

  const n = ms.length;
  const score = Array.from({ length: n }, () => new Array(n).fill(0));
  for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) score[i][j] = score[j][i] = compat(ms[i], ms[j]).total;
  // 간단 힘-기반 배치: 모두 밀어내고, 궁합 높을수록 당긴다. ponytail: 동기 300회 반복, 60명까지 충분.
  const nodes = ms.map((m, i) => ({ m, x: W / 2 + Math.cos(i / n * Math.PI * 2) * Math.min(W, H) * 0.32, y: H / 2 + Math.sin(i / n * Math.PI * 2) * Math.min(W, H) * 0.32 }));
  for (let it = 0; it < 300 && n > 1; it++) {
    const k = 1 - it / 300;
    for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) {
      const a = nodes[i], b = nodes[j];
      let dx = b.x - a.x, dy = b.y - a.y, d = Math.hypot(dx, dy) || 1; dx /= d; dy /= d;
      const want = 60 + (100 - score[i][j]) * 2.2; // 점수 높을수록 짧은 거리
      const f = (d - want) * 0.02 * k;
      a.x += dx * f; a.y += dy * f; b.x -= dx * f; b.y -= dy * f;
    }
    for (const p of nodes) { p.x = Math.min(W - 56, Math.max(56, p.x + (W / 2 - p.x) * 0.002)); p.y = Math.min(H - 44, Math.max(28, p.y + (H / 2 - p.y) * 0.002)); }
  }
  const ACCENT = '#b8331f', PAPER = '#f1ece2', DIM = '#8e8676';
  const color = (s) => s >= 75 ? ACCENT : DIM;
  const FONT = '500 13px "Pretendard Variable", Pretendard, sans-serif';
  function draw() {
    ctx.clearRect(0, 0, W, H);
    for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) {
      const s = score[i][j], sel = selectedNode !== null && (i === selectedNode || j === selectedNode);
      if (selectedNode !== null && !sel) continue;
      ctx.strokeStyle = color(s);
      ctx.globalAlpha = sel ? 1 : s >= 75 ? 0.9 : s >= 60 ? 0.7 : 0.45;
      ctx.lineWidth = s >= 75 ? 3 : s >= 60 ? 2 : 1;
      ctx.setLineDash(s < 45 ? [4, 5] : []);
      ctx.beginPath(); ctx.moveTo(nodes[i].x, nodes[i].y); ctx.lineTo(nodes[j].x, nodes[j].y); ctx.stroke();
      if (sel) { ctx.setLineDash([]); ctx.globalAlpha = 1; ctx.fillStyle = PAPER; ctx.font = FONT; ctx.textAlign = 'left'; ctx.fillText(String(s), (nodes[i].x + nodes[j].x) / 2 + 6, (nodes[i].y + nodes[j].y) / 2 - 6); }
    }
    ctx.setLineDash([]); ctx.globalAlpha = 1;
    nodes.forEach((p, i) => {
      const isSel = i === selectedNode, isMe = p.m.id === me?.id;
      ctx.fillStyle = isMe ? ACCENT : PAPER;
      star(ctx, p.x, p.y, isSel ? 10 : 7);
      if (isSel) { ctx.strokeStyle = PAPER; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(p.x, p.y, 15, 0, Math.PI * 2); ctx.stroke(); }
      const label = p.m.name + (isMe ? ' (나)' : '');
      ctx.font = (isMe || isSel ? '700 ' : '500 ') + '13px "Pretendard Variable", Pretendard, sans-serif'; ctx.textAlign = 'center';
      ctx.lineJoin = 'round'; ctx.lineWidth = 4; ctx.strokeStyle = '#17141d'; ctx.strokeText(label, p.x, p.y + 24); // 선 위에서도 읽히도록 후광
      ctx.fillStyle = PAPER; ctx.fillText(label, p.x, p.y + 24);
    });
  }
  function star(c, x, y, r) { c.beginPath(); for (let k = 0; k < 8; k++) { const rr = k % 2 ? r * 0.45 : r, a = k / 8 * Math.PI * 2 - Math.PI / 2; c.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr); } c.closePath(); c.fill(); }
  draw();
  canvas.addEventListener('pointerdown', (e) => {
    const r = canvas.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top;
    let best = null, bd = 28;
    nodes.forEach((p, i) => { const d = Math.hypot(p.x - x, p.y - y); if (d < bd) { bd = d; best = i; } });
    selectedNode = best === selectedNode ? null : best;
    draw();
    const pick = panel.querySelector('#pick');
    if (selectedNode === null) { pick.innerHTML = ''; return; }
    const m = ms[selectedNode];
    const list = ms.map((o, j) => j === selectedNode ? null : [o, score[selectedNode][j]]).filter(Boolean).sort((a, b) => b[1] - a[1]);
    pick.innerHTML = `<h3 style="margin-top:16px">${esc(m.name)}의 별자리</h3><p class="small" style="display:flex;gap:6px;flex-wrap:wrap">${list.map(([o, s]) => `<span class="chip" ${s >= 75 ? 'style="background:var(--accent-weak);color:var(--accent)"' : ''}>${esc(o.name)} <b>${s}</b></span>`).join('')}</p>`;
  });
}

// ───────────────────────── 내 사주 ─────────────────────────
function renderMe(panel) {
  const target = room.members.find((m) => m.id === viewAs) || room.members[0];
  const p = pillarsOf(target), d = describeIlju(target);
  const col = (label, pl, isDay) => pl
    ? `<div class="pillar ${isDay ? 'day' : ''}"><div class="lbl">${label}</div><div class="han ${isDay ? 'day' : ''}">${GAN_HAN[pl[0]]}<br>${JI_HAN[pl[1]]}</div><div class="kor">${GAN[pl[0]]}${JI[pl[1]]} · ${GAN_EL[pl[0]]}${JI_EL[pl[1]]}</div></div>`
    : `<div class="pillar"><div class="lbl">${label}</div><div class="han muted">?<br>?</div><div class="kor muted">생시 모름</div></div>`;
  const mine = target.id === me?.id;
  panel.innerHTML = `
    <section class="sheet talisman">
      ${perspective()}
      <h2>${esc(target.name)}의 사주</h2>
      <div class="pillars">${col('시주', p.hour)}${col('일주', p.day, true)}${col('월주', p.month)}${col('년주', p.year)}</div>
      <p class="muted small">${esc(target.birth)}${target.time ? ` ${esc(target.time)} (진태양시 ${esc(p.solarTime)})` : ' · 생시 모름'} · 입춘·절기 기준으로 세움</p>
      <h3>${d.ilju}일주</h3>
      <p>${esc(d.text)}</p>
      <div class="elements">${Object.entries(p.elements).map(([e, c]) => `<span class="el ${c ? '' : 'zero'}">${e}<b>${c}</b></span>`).join('')}</div>
      <h3>혈액형 · MBTI</h3>
      <p>${target.blood}형 — ${BLOOD_KEYWORD[target.blood]}<br>${target.mbti} — ${MBTI_NAME[target.mbti]}</p>
      ${mine ? `<div class="row" style="margin-top:16px"><button class="btn ghost" id="edit">내 정보 수정</button><button class="btn ghost" id="del">내 정보 삭제</button></div>` : ''}
    </section>
    <div id="editBox"></div>`;
  panel.querySelector('#viewAs')?.addEventListener('change', (e) => { viewAs = e.target.value; renderRoom(); });
  if (!mine) return;
  panel.querySelector('#edit').addEventListener('click', () => {
    const box = panel.querySelector('#editBox');
    box.innerHTML = `<section class="sheet"><h2>내 정보 수정</h2>${memberForm(me)}</section>`;
    bindForm(box, async (data) => {
      room = await api(`/api/rooms/${roomId}/members/${me.id}`, 'PUT', { ...data, token: store.get(roomId).token });
      me = room.members.find((m) => m.id === me.id); stamped = false; toast('저장했어요'); renderRoom();
    });
    box.scrollIntoView({ behavior: 'smooth' });
  });
  panel.querySelector('#del').addEventListener('click', async () => {
    if (!confirm('내 정보를 이 방에서 지울까요?')) return;
    room = await api(`/api/rooms/${roomId}/members/${me.id}`, 'DELETE', { token: store.get(roomId).token });
    store.set(roomId, { owner: store.get(roomId).owner }); me = null; viewAs = null; renderRoom();
  });
}

// ───────────────────────── 라우터 ─────────────────────────
function route() {
  clearInterval(pollTimer); selectedNode = null;
  const m = location.pathname.match(/^\/r\/([a-z0-9]+)/) || location.hash.match(/^#\/r\/([a-z0-9]+)/);
  if (m) loadRoom(m[1]); else renderHome();
}
window.addEventListener('hashchange', route);
route();
