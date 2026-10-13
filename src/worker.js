// 삼합궁합 API: 방 하나 = JSON 한 줄. 계산은 전부 브라우저가 한다.
const json = (body, status = 200) => new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' } });
const bad = (msg, status = 400) => json({ error: msg }, status);
const ALPHABET = 'abcdefghjkmnpqrstuvwxyz23456789';
const rid = (n) => Array.from(crypto.getRandomValues(new Uint8Array(n)), (b) => ALPHABET[b % ALPHABET.length]).join('');

const MBTI = /^[EI][SN][TF][JP]$/;
function validMember(m) {
  const name = String(m.name ?? '').trim();
  if (name.length < 1 || name.length > 12) return '이름은 1~12자';
  if (!['A', 'B', 'O', 'AB'].includes(m.blood)) return '혈액형은 A/B/O/AB';
  if (!MBTI.test(m.mbti ?? '')) return 'MBTI 네 글자가 필요해요';
  if (!/^\d{4}-\d{2}-\d{2}$/.test(m.birth ?? '')) return '생년월일 형식 오류';
  const y = +m.birth.slice(0, 4);
  if (y < 1900 || y > 2100 || Number.isNaN(Date.parse(m.birth))) return '생년월일은 1900~2100년';
  if (m.time != null && m.time !== '' && !/^\d{2}:\d{2}$/.test(m.time)) return '생시 형식 오류';
  return null;
}
const pick = (m) => ({ name: String(m.name).trim(), blood: m.blood, mbti: m.mbti, birth: m.birth, time: m.time || null });
const publicRoom = (room) => ({ ...room, members: room.members.map(({ token, ...m }) => m) });

async function loadRoom(env, id) {
  const row = await env.DB.prepare('SELECT data FROM rooms WHERE id = ?').bind(id).first();
  return row ? JSON.parse(row.data) : null;
}
async function saveRoom(env, room) {
  // ponytail: read-modify-write without a version check; 방 인원 ≤ 60, 동시 입력 충돌은 드묾. 문제 되면 updated_at 비교로 낙관적 잠금.
  await env.DB.prepare('INSERT INTO rooms (id, data, updated_at) VALUES (?1, ?2, ?3) ON CONFLICT(id) DO UPDATE SET data = ?2, updated_at = ?3')
    .bind(room.id, JSON.stringify(room), Date.now()).run();
}

export default {
  async fetch(req, env) {
    const url = new URL(req.url);
    if (!url.pathname.startsWith('/api/')) return env.ASSETS.fetch(req);
    const parts = url.pathname.split('/').filter(Boolean); // ['api','rooms',id,'members',mid]
    let body = {};
    if (req.method !== 'GET') { try { body = await req.json(); } catch { return bad('JSON 본문이 필요해요'); } }

    if (parts[1] !== 'rooms') return bad('없는 경로', 404);

    if (parts.length === 2 && req.method === 'POST') {
      const name = String(body.name ?? '').trim().slice(0, 30) || '이름 없는 방';
      const size = Math.min(60, Math.max(2, +body.size || 2));
      const room = { id: rid(8), name, size, createdAt: Date.now(), members: [] };
      await saveRoom(env, room);
      return json({ id: room.id });
    }

    const room = await loadRoom(env, parts[2]);
    if (!room) return bad('방을 찾을 수 없어요', 404);

    if (parts.length === 3 && req.method === 'GET') return json(publicRoom(room));

    if (parts[3] !== 'members') return bad('없는 경로', 404);

    if (parts.length === 4 && req.method === 'POST') {
      const err = validMember(body); if (err) return bad(err);
      if (room.members.length >= 60) return bad('방이 가득 찼어요');
      const member = { id: rid(6), token: rid(16), ...pick(body) };
      room.members.push(member);
      await saveRoom(env, room);
      return json({ memberId: member.id, token: member.token, room: publicRoom(room) });
    }

    const member = room.members.find((m) => m.id === parts[4]);
    if (!member) return bad('없는 사람', 404);
    if (member.token !== body.token) return bad('수정 권한이 없어요', 403);

    if (req.method === 'PUT') {
      const err = validMember(body); if (err) return bad(err);
      Object.assign(member, pick(body));
      await saveRoom(env, room);
      return json(publicRoom(room));
    }
    if (req.method === 'DELETE') {
      room.members = room.members.filter((m) => m.id !== member.id);
      await saveRoom(env, room);
      return json(publicRoom(room));
    }
    return bad('지원하지 않는 메서드', 405);
  },
};
