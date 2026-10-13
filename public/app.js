import { compat, describeIlju, pillarsOf } from './lib/score.js';
import { GAN, JI, GAN_HAN, JI_HAN, GAN_EL, JI_EL, ganji } from './lib/saju.js';
import { MBTI_NAME, BLOOD_KEYWORD } from './lib/rules.js';

const $app = document.getElementById('app');
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const h = (strings, ...vals) => strings.reduce((out, s, i) => out + s + (i < vals.length ? (vals[i] instanceof Raw ? vals[i].v : esc(vals[i])) : ''), '');
class Raw { constructor(v) { this.v = v; } }
const raw = (v) => new Raw(v);

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
  const el = document.createElement('div'); el.className = 'toast'; el.textContent = msg; document.body.appendChild(el);
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
      <h3 style="margin-top:0">이렇게 돌아가요</h3>
      <p>1. 방을 열면 링크가 생겨요. 단톡방에 붙여넣으세요.</p>
      <p>2. 들어온 사람마다 혈액형·MBTI·생년월일(생시)을 넣어요.</p>
      <p>3. 생시로 사주 네 기둥을 세우고, 세 체계를 합쳐 나와 가장 잘 맞는 친구 순위가 나와요. 방 전체의 유대 지도도 볼 수 있어요.</p>
    </section>
    ${FOOT}`;
  $app.querySelector('#create').addEventListener('submit', async (e) => {
    e.preventDefault();
    const f = e.target, err = f.querySelector('.error');
    f.querySelector('button').disabled = true;
    try {
      const { id } = await api('/api/rooms', 'POST', { name: f.name.value, size: +f.size.value });
      store.set(id, { owner: true });
      location.hash = '#/r/' + id;
    } catch (ex) { err.textContent = ex.message; err.classList.remove('hidden'); f.querySelector('button').disabled = false; }
  });
}

// ───────────────────────── 입력 폼 ─────────────────────────
function memberForm(init = {}) {
  const mbti = init.mbti || '';
  const seg = (i, a, b, la, lb) => `<div class="seg" data-i="${i}">
      <button type="button" aria-pressed="${mbti[i] === a}" data-v="${a}">${a}<small>${la}</small></button>
      <button type="button" aria-pressed="${mbti[i] === b}" data-v="${b}">${b}<small>${lb}</small></button></div>`;
  return `
    <form id="member" autocomplete="off">
      <label class="field"><span>이름 (방에서 부르는 이름)</span><input type="text" name="name" maxlength="12" value="${esc(init.name || '')}" required></label>
      <div class="field"><span class="field-name">혈액형</span>
        <div class="tiles" id="blood">${['A', 'B', 'O', 'AB'].map((t) => `<button type="button" class="tile" aria-pressed="${init.blood === t}" data-v="${t}">${t}</button>`).join('')}</div></div>
      <div class="field"><span class="field-name">MBTI</span>
        <div class="seg-grid" id="mbti">${seg(0, 'E', 'I', '외향', '내향')}${seg(1, 'S', 'N', '감각', '직관')}${seg(2, 'T', 'F', '사고', '감정')}${seg(3, 'J', 'P', '판단', '인식')}</div>
        <p class="mbti-preview" id="mbtiPreview">${mbti ? `${mbti} <small style="font-size:14px;letter-spacing:0">${MBTI_NAME[mbti] || ''}</small>` : '&nbsp;'}</p></div>
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
    preview.innerHTML = v.length === 4 ? `${v} <small style="font-size:14px;letter-spacing:0">${MBTI_NAME[v]}</small>` : (v || '&nbsp;');
  });
  f.notime.addEventListener('change', () => { f.time.disabled = f.notime.checked; if (f.notime.checked) f.time.value = ''; });
  f.addEventListener('submit', async (e) => {
    e.preventDefault();
    const err = f.querySelector('.error'); err.classList.add('hidden');
    const data = {
      name: f.name.value.trim(), blood: root.querySelector('#blood [aria-pressed=true]')?.dataset.v,
      mbti: readMbti(root), birth: f.birth.value, time: f.notime.checked ? null : f.time.value || null,
    };
    if (!data.blood) return showErr(err, '혈액형을 골라주세요');
    if (data.mbti.length !== 4) return showErr(err, 'MBTI 네 글자를 모두 골라주세요');
    if (!data.birth) return showErr(err, '생년월일을 넣어주세요');
    if (!f.notime.checked && !data.time) return showErr(err, '태어난 시각을 넣거나 "몰라요"를 체크하세요');
    f.querySelector('button[type=submit]').disabled = true;
    try { await onSubmit(data); } catch (ex) { showErr(err, ex.message); f.querySelector('button[type=submit]').disabled = false; }
  });
}
const readMbti = (root) => [0, 1, 2, 3].map((i) => root.querySelector(`#mbti .seg[data-i="${i}"] [aria-pressed=true]`)?.dataset.v || '').join('');
const showErr = (el, msg) => { el.textContent = msg; el.classList.remove('hidden'); };

// ───────────────────────── 방 ─────────────────────────
let room, roomId, me, tab = 'rank', viewAs = null, pollTimer, stamped = false, selectedNode = null;

async function loadRoom(id) {
  roomId = id;
  const saved = store.get(id);
  try { room = await api('/api/rooms/' + id); } catch (ex) { $app.innerHTML = `<section class="sheet"><h2>방을 찾을 수 없어요</h2><p>${esc(ex.message)}</p><p><a href="#/">새 방 열기</a></p></section>`; return; }
  me = room.members.find((m) => m.id === saved.memberId) || null;
  if (!viewAs || !room.members.some((m) => m.id === viewAs)) viewAs = me?.id || null;
  renderRoom();
  clearInterval(pollTimer);
  pollTimer = setInterval(async () => { // ponytail: 20초 폴링. 실시간이 필요하면 Durable Object/WebSocket.
    if (document.hidden || location.hash !== '#/r/' + id) return;
    try { const fresh = await api('/api/rooms/' + id); if (JSON.stringify(fresh) !== JSON.stringify(room)) { room = fresh; me = room.members.find((m) => m.id === saved.memberId) || null; renderRoom(); } } catch { /* 잠시 후 재시도 */ }
  }, 20000);
}

function shareLink() {
  const url = location.origin + '/#/r/' + roomId;
  const text = `[삼합궁합] ${room.name} — 혈액형·MBTI·사주 합친 궁합 보기`;
  if (navigator.share) navigator.share({ title: '삼합궁합', text, url }).catch(() => {});
  else navigator.clipboard?.writeText(url).then(() => toast('링크를 복사했어요')).catch(() => prompt('링크를 복사하세요', url));
}

function renderRoom() {
  const head = `
    <header class="roomhead">
      <div><a href="#/" class="small" style="color:#c9bda0;text-decoration:none">三合 삼합궁합</a><h1>${esc(room.name)}</h1></div>
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
      <nav class="tabs" role="tablist">${tabs.map(([k, l]) => `<button role="tab" aria-selected="${tab === k}" data-tab="${k}">${l}</button>`).join('')}</nav>
      <div id="panel"></div>${FOOT}`;
    $app.querySelector('.tabs').addEventListener('click', (e) => { const b = e.target.closest('button'); if (b) { tab = b.dataset.tab; renderRoom(); } });
    const panel = $app.querySelector('#panel');
    if (tab === 'rank') renderRank(panel, others);
    else if (tab === 'map') renderMap(panel);
    else renderMe(panel);
  }
  $app.querySelector('#share').addEventListener('click', shareLink);
}

function perspective() {
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
      ${raw(perspective()).v}
      ${rows.length === 0 ? `<p class="muted">아직 다른 사람이 없어요. 링크를 공유해 친구를 불러오세요.</p>` : `
      <h2 style="margin-bottom:6px">${esc(base.name)}님과 잘 맞는 순서</h2>
      <p class="muted small">점수 = 혈액형 25% + MBTI 35% + 사주 40%. 항목을 누르면 이유가 펼쳐져요.</p>
      <ol class="rank">${rows.map(({ m, c }, i) => `
        <li><details>
          <summary>
            <span class="no">${i + 1}</span>
            <span class="who"><b>${esc(m.name)}</b><span class="chips"><span class="chip">${m.blood}형</span><span class="chip">${m.mbti}</span><span class="chip">${ganji(pillarsOf(m).day)}일주</span></span></span>
            <span class="grade">${c.grade}</span>
            <span class="seal ${doStamp ? 'stamp' : ''}" style="animation-delay:${i * 70}ms">${c.total}</span>
          </summary>
          <div class="detail">
            <div class="bars">
              ${bar('blood', '혈액형', c.blood.score)}${bar('mbti', 'MBTI', c.mbti.score)}${bar('saju', '사주', c.saju.score)}
            </div>
            <ul class="reasons">
              <li><b>혈액형 ${base.blood}·${m.blood}</b> — ${esc(c.blood.reason)}</li>
              <li><b>MBTI ${base.mbti}·${m.mbti}</b> — ${esc(c.mbti.reason)}. ${esc(c.mbti.tier)}</li>
              ${c.saju.reasons.slice(0, 6).map((r) => `<li class="${r.delta > 0 ? 'plus' : 'minus'}">${r.delta > 0 ? '+' : ''}${r.delta} ${esc(r.text)}</li>`).join('')}
              ${c.saju.hourKnown ? '' : '<li class="muted">한쪽이 생시를 몰라 시주는 빼고 봤어요.</li>'}
            </ul>
          </div>
        </details></li>`).join('')}
      </ol>`}
    </section>`;
  panel.querySelector('#viewAs').addEventListener('change', (e) => { viewAs = e.target.value; stamped = false; renderRoom(); });
}
const bar = (cls, label, v) => `<div class="bar ${cls}"><span>${label}</span><i><b style="width:${v}%"></b></i><span>${v}</span></div>`;

// ───────────────────────── 유대 지도 ─────────────────────────
function renderMap(panel) {
  const ms = room.members;
  panel.innerHTML = `<section class="sheet" style="padding:12px">
    <canvas class="sky" id="sky" aria-label="방 전체 궁합 유대 지도"></canvas>
    <div class="legend"><span><i style="background:#f0c75e"></i>75점 이상</span><span><i style="background:#8fb0e0"></i>60~74</span><span><i style="background:#6b6478"></i>45~59</span><span><i style="background:#b7321d"></i>45점 미만</span></div>
    <p class="muted small" style="margin:8px 0 0">별을 누르면 그 사람과 모두의 궁합이 보여요. 가까이 모일수록 잘 맞는 무리예요.</p>
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
    for (const p of nodes) { p.x = Math.min(W - 40, Math.max(40, p.x + (W / 2 - p.x) * 0.002)); p.y = Math.min(H - 30, Math.max(30, p.y + (H / 2 - p.y) * 0.002)); }
  }
  const color = (s) => s >= 75 ? '#f0c75e' : s >= 60 ? '#8fb0e0' : s >= 45 ? '#6b6478' : '#b7321d';
  function draw() {
    ctx.clearRect(0, 0, W, H);
    for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) {
      const s = score[i][j], sel = selectedNode !== null && (i === selectedNode || j === selectedNode);
      if (selectedNode !== null && !sel) continue;
      ctx.strokeStyle = color(s); ctx.globalAlpha = sel ? 0.95 : 0.25 + (s / 100) * 0.5; ctx.lineWidth = sel ? 2.5 : 0.8 + (s / 100) * 2;
      ctx.beginPath(); ctx.moveTo(nodes[i].x, nodes[i].y); ctx.lineTo(nodes[j].x, nodes[j].y); ctx.stroke();
      if (sel) { ctx.globalAlpha = 1; ctx.fillStyle = '#f2e8cf'; ctx.font = '12px Gowun Batang, serif'; ctx.fillText(String(s), (nodes[i].x + nodes[j].x) / 2 + 4, (nodes[i].y + nodes[j].y) / 2 - 4); }
    }
    ctx.globalAlpha = 1;
    nodes.forEach((p, i) => {
      const isSel = i === selectedNode, isMe = p.m.id === me?.id;
      ctx.fillStyle = isSel ? '#fff4c2' : isMe ? '#f0c75e' : '#e8dcc0';
      star(ctx, p.x, p.y, isSel ? 9 : 6);
      ctx.fillStyle = '#f2e8cf'; ctx.font = `${isMe || isSel ? 'bold ' : ''}13px Gowun Batang, serif`; ctx.textAlign = 'center';
      ctx.fillText(p.m.name, p.x, p.y + 20);
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
    pick.innerHTML = `<h3>${esc(m.name)}의 별자리</h3><p class="small">${list.map(([o, s]) => `<span class="chip" style="color:${color(s)};border-color:${color(s)}">${esc(o.name)} ${s}</span>`).join(' ')}</p>`;
  });
}

// ───────────────────────── 내 사주 ─────────────────────────
function renderMe(panel) {
  const target = room.members.find((m) => m.id === viewAs) || room.members[0];
  const p = pillarsOf(target), d = describeIlju(target);
  const col = (label, pl, isDay) => pl
    ? `<div class="pillar"><div class="lbl">${label}</div><div class="han ${isDay ? 'day' : ''}">${GAN_HAN[pl[0]]}<br>${JI_HAN[pl[1]]}</div><div class="kor">${GAN[pl[0]]}${JI[pl[1]]} · ${GAN_EL[pl[0]]}${JI_EL[pl[1]]}</div></div>`
    : `<div class="pillar"><div class="lbl">${label}</div><div class="han muted">?<br>?</div><div class="kor muted">생시 모름</div></div>`;
  const mine = target.id === me?.id;
  panel.innerHTML = `
    <section class="sheet talisman">
      ${raw(perspective()).v}
      <h2>${esc(target.name)}의 사주</h2>
      <div class="pillars">${col('시주', p.hour)}${col('일주', p.day, true)}${col('월주', p.month)}${col('년주', p.year)}</div>
      <p class="muted small">${esc(target.birth)}${target.time ? ` ${esc(target.time)} (진태양시 ${esc(p.solarTime)})` : ' · 생시 모름'} · 입춘·절기 기준으로 세움</p>
      <h3>${d.ilju}일주</h3>
      <p>${esc(d.text)}</p>
      <div class="elements">${Object.entries(p.elements).map(([e, c]) => `<span class="el ${e}">${e} ${c}</span>`).join('')}</div>
      <h3>혈액형 · MBTI</h3>
      <p>${target.blood}형 — ${BLOOD_KEYWORD[target.blood]}<br>${target.mbti} — ${MBTI_NAME[target.mbti]}</p>
      ${mine ? `<div class="row" style="margin-top:16px"><button class="btn ghost" id="edit">내 정보 수정</button><button class="btn ghost" id="del">내 정보 삭제</button></div>` : ''}
    </section>
    <div id="editBox"></div>`;
  panel.querySelector('#viewAs').addEventListener('change', (e) => { viewAs = e.target.value; renderRoom(); });
  if (!mine) return;
  panel.querySelector('#edit').addEventListener('click', () => {
    const box = panel.querySelector('#editBox');
    box.innerHTML = `<section class="sheet"><h2>내 정보 수정</h2>${memberForm(me)}</section>`;
    bindForm(box, async (data) => {
      room = await api(`/api/rooms/${roomId}/members/${me.id}`, 'PUT', { ...data, token: store.get(roomId).token });
      me = room.members.find((m) => m.id === me.id); pillarCacheBust(); stamped = false; toast('저장했어요'); renderRoom();
    });
    box.scrollIntoView({ behavior: 'smooth' });
  });
  panel.querySelector('#del').addEventListener('click', async () => {
    if (!confirm('내 정보를 이 방에서 지울까요?')) return;
    room = await api(`/api/rooms/${roomId}/members/${me.id}`, 'DELETE', { token: store.get(roomId).token });
    store.set(roomId, { owner: store.get(roomId).owner }); me = null; viewAs = null; renderRoom();
  });
}
const pillarCacheBust = () => {}; // 생년월일이 바뀌면 키가 달라지므로 캐시 무효화 불필요

// ───────────────────────── 라우터 ─────────────────────────
function route() {
  clearInterval(pollTimer); selectedNode = null;
  const m = location.hash.match(/^#\/r\/([a-z0-9]+)/);
  if (m) loadRoom(m[1]); else renderHome();
}
window.addEventListener('hashchange', route);
route();
