// 12지지 동물 아바타. 64×64 좌표계, 한 가지 선 굵기. DOM(SVG)과 캔버스(Path2D) 양쪽에서 같은 데이터를 쓴다.
// 각 항목: head = [cx, cy, r] 또는 null, paths = 선으로 그리는 경로, dots = [x, y, r] 채운 점, fills = 채운 경로
const A = [
  { // 자 쥐
    head: [32, 37, 15], paths: ['M18 21a7 7 0 1 1 0 .1', 'M46 21a7 7 0 1 1 0 .1', 'M12 42l12 2M12 49l12-3M52 42l-12 2M52 49l-12-3'],
    dots: [[26, 35, 1.8], [38, 35, 1.8], [32, 44, 2.6]],
  },
  { // 축 소
    head: [32, 37, 15], paths: ['M18 24c-8-8-6-18 4-14M46 24c8-8 6-18-4-14', 'M14 32c-5 0-5 7 0 7M50 32c5 0 5 7 0 7', 'M22 44h20a5 5 0 0 1 0 8H22a5 5 0 0 1 0-8z'],
    dots: [[26, 32, 1.8], [38, 32, 1.8], [28, 48, 1.6], [36, 48, 1.6]],
  },
  { // 인 호랑이
    head: [32, 37, 16], paths: ['M20 21a6 6 0 1 1 0 .1', 'M44 21a6 6 0 1 1 0 .1', 'M27 23l2 6M32 22v7M37 23l-2 6', 'M15 38l7 1M15 44l7-1M49 38l-7 1M49 44l-7-1', 'M32 43q-4 4-6 2M32 43q4 4 6 2'],
    dots: [[26, 34, 1.8], [38, 34, 1.8]], fills: ['M29 40h6l-3 3z'],
  },
  { // 묘 토끼
    head: [32, 40, 14], paths: ['M25 29c-5-24 6-26 5-2', 'M39 29c5-24-6-26-5-2', 'M32 46q-4 3-6 0M32 46q4 3 6 0'],
    dots: [[26, 38, 1.8], [38, 38, 1.8]], fills: ['M29 42h6l-3 3z'],
  },
  { // 진 용
    head: [32, 38, 15], paths: ['M23 24l-5-14M41 24l5-14', 'M24 29l6 2M40 29l-6 2', 'M17 36c-9-2-10 8-4 9M47 36c9-2 10 8 4 9', 'M26 46q6 4 12 0'],
    dots: [[26, 35, 1.8], [38, 35, 1.8], [29, 42, 1.4], [35, 42, 1.4]],
  },
  { // 사 뱀
    head: null, paths: ['M32 17c9 0 14 9 14 19s-5 16-14 16-14-6-14-16 5-19 14-19z', 'M25 23q7-5 14 0', 'M32 52v7M32 59l-3 4M32 59l3 4'],
    dots: [[26, 34, 1.8], [38, 34, 1.8]], fillHead: 'M32 17c9 0 14 9 14 19s-5 16-14 16-14-6-14-16 5-19 14-19z',
  },
  { // 오 말
    head: null, paths: ['M32 18c8 0 13 9 13 21s-5 18-13 18-13-6-13-18 5-21 13-21z', 'M23 22l-5-12 10 8M41 22l5-12-10 8', 'M22 20l4-8 4 6 2-8 4 6 4-8 2 10'],
    dots: [[26, 34, 1.8], [38, 34, 1.8], [27, 50, 1.6], [37, 50, 1.6]], fillHead: 'M32 18c8 0 13 9 13 21s-5 18-13 18-13-6-13-18 5-21 13-21z',
  },
  { // 미 양
    head: [32, 39, 14], paths: ['M20 25c-11 0-11-13-1-12 7 1 6 10 1 12z', 'M44 25c11 0 11-13 1-12-7 1-6 10-1 12z', 'M21 27q4-7 10-3 2-5 7 0 4-2 6 3', 'M19 36l-8 5M45 36l8 5', 'M28 46q4 3 8 0'],
    dots: [[26, 37, 1.8], [38, 37, 1.8], [30, 43, 1.3], [34, 43, 1.3]],
  },
  { // 신 원숭이
    head: [32, 37, 16], paths: ['M14 37a6 6 0 1 1 0 .1', 'M50 37a6 6 0 1 1 0 .1', 'M27 45q5 4 10 0'],
    dots: [[26, 34, 1.8], [38, 34, 1.8], [30, 41, 1.3], [34, 41, 1.3]], fills2: ['M22 30q10-9 20 0 4 14-10 20-14-6-10-20z'],
  },
  { // 유 닭
    head: [32, 38, 14], paths: ['M24 24l2-10 4 8 2-10 4 8 2-10 2 10', 'M46 36l10 3-10 4z', 'M33 51q4 8-3 7'],
    dots: [[37, 34, 2]],
  },
  { // 술 개
    head: [32, 37, 15], paths: ['M18 26c-10 0-10 22 0 20M46 26c10 0 10 22 0 20', 'M32 45v3M32 48q-6 2-8-2M32 48q6 2 8-2', 'M24 28l4 2M40 28l-4 2'],
    dots: [[26, 34, 1.8], [38, 34, 1.8]], fills: ['M28 42a4 3 0 1 0 8 0a4 3 0 1 0-8 0z'],
  },
  { // 해 돼지
    head: [32, 38, 15], paths: ['M19 27l-5-14 14 8M45 27l5-14-14 8', 'M24 44a8 6 0 1 0 16 0a8 6 0 1 0-16 0z'],
    dots: [[24, 33, 1.8], [40, 33, 1.8], [29, 44, 1.6], [35, 44, 1.6]],
  },
];
export const AVATAR = A;

/** DOM용 SVG 문자열 */
export function avatarSVG(ji, size = 40, { ink = '#1f1a17', paper = '#f8f5ee', ring = '#ddd5c5', ringWidth = 1.5 } = {}) {
  const a = A[ji];
  const head = a.head ? `<circle cx="${a.head[0]}" cy="${a.head[1]}" r="${a.head[2]}" fill="${paper}"/>` : `<path d="${a.fillHead}" fill="${paper}"/>`;
  return `<svg class="avatar" width="${size}" height="${size}" viewBox="0 0 64 64" aria-hidden="true">
    <circle cx="32" cy="32" r="31" fill="${paper}" stroke="${ring}" stroke-width="${ringWidth}"/>
    <g fill="none" stroke="${ink}" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round">${head}${a.paths.map((d) => `<path d="${d}"/>`).join('')}</g>
    ${(a.fills2 || []).map((d) => `<path d="${d}" fill="#eee8da" stroke="${ink}" stroke-width="2.6" stroke-linejoin="round"/>`).join('')}
    ${(a.fills || []).map((d) => `<path d="${d}" fill="${ink}"/>`).join('')}
    ${a.dots.map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${ink}"/>`).join('')}
  </svg>`;
}

const cache = new Map();
/** 캔버스용: 중심 (x,y), 반지름 r */
export function drawAvatar(ctx, ji, x, y, r, { ink = '#1f1a17', paper = '#f8f5ee', ring = '#ddd5c5', ringWidth = 2 } = {}) {
  if (!cache.has(ji)) {
    const a = A[ji];
    cache.set(ji, {
      head: a.head ? null : new Path2D(a.fillHead), paths: a.paths.map((d) => new Path2D(d)),
      fills: (a.fills || []).map((d) => new Path2D(d)), fills2: (a.fills2 || []).map((d) => new Path2D(d)), a,
    });
  }
  const c = cache.get(ji), a = c.a, s = (r * 2) / 64;
  ctx.save();
  ctx.translate(x - r, y - r); ctx.scale(s, s);
  ctx.beginPath(); ctx.arc(32, 32, 31, 0, Math.PI * 2); ctx.fillStyle = paper; ctx.fill();
  ctx.lineWidth = ringWidth / s; ctx.strokeStyle = ring; ctx.stroke();
  ctx.lineWidth = 2.6; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.strokeStyle = ink; ctx.fillStyle = paper;
  if (a.head) { ctx.beginPath(); ctx.arc(a.head[0], a.head[1], a.head[2], 0, Math.PI * 2); ctx.fill(); ctx.stroke(); }
  else { ctx.fill(c.head); ctx.stroke(c.head); }
  for (const p of c.paths) ctx.stroke(p);
  for (const p of c.fills2) { ctx.fillStyle = '#eee8da'; ctx.fill(p); ctx.stroke(p); }
  ctx.fillStyle = ink;
  for (const p of c.fills) ctx.fill(p);
  for (const [dx, dy, dr] of a.dots) { ctx.beginPath(); ctx.arc(dx, dy, dr, 0, Math.PI * 2); ctx.fill(); }
  ctx.restore();
}
