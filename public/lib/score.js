// 두 사람의 궁합 점수. 혈액형 25% · MBTI 35% · 사주 40%.
import { fourPillars, elementCount, GAN, JI, GAN_EL, JI_EL, JI_ANIMAL, ganji } from './saju.js';
import * as R from './rules.js';

export const WEIGHT = { blood: 0.25, mbti: 0.35, saju: 0.40 };

const pillarCache = new Map();
export function pillarsOf(m) {
  const k = `${m.birth}|${m.time || ''}`;
  if (!pillarCache.has(k)) pillarCache.set(k, { ...fourPillars(m.birth, m.time), elements: null });
  const p = pillarCache.get(k);
  if (!p.elements) p.elements = elementCount(p);
  return p;
}

export function bloodCompat(a, b) {
  const k = R.bloodKey(a, b);
  return { score: R.BLOOD_SCORE[k], reason: R.BLOOD_REASON[k] };
}

export function mbtiCompat(a, b) {
  const score = R.MBTI_MATRIX[a][R.MBTI_ORDER.indexOf(b)];
  return { score, tier: R.MBTI_TIER_TEXT[score], reason: R.mbtiReason(a, b) };
}

// 십신(일간 a 기준으로 본 b)
export function sipsin(a, b) {
  const ea = GAN_EL[a], eb = GAN_EL[b];
  const same = a % 2 === b % 2;
  if (ea === eb) return same ? '비견' : '겁재';
  if (R.SAENG[ea] === eb) return same ? '식신' : '상관';
  if (R.GEUK[ea] === eb) return same ? '편재' : '정재';
  if (R.GEUK[eb] === ea) return same ? '편관' : '정관';
  return same ? '편인' : '정인';
}
const SIPSIN_SCORE = { 정재: 5, 정관: 5, 상관: 6, 정인: 6, 식신: 5, 편인: 5, 비견: 4, 겁재: 2, 편재: -3, 편관: -3 };
const SIPSIN_TEXT = {
  정재: '서로를 바르게 이끌고 책임지는 짝 관계', 정관: '서로를 바르게 이끌고 책임지는 짝 관계',
  상관: '서로 돌봐주고 키워주는 상생의 사이', 정인: '서로 돌봐주고 키워주는 상생의 사이',
  식신: '한쪽이 베풀고 한쪽이 받는 편안한 사이', 편인: '한쪽이 베풀고 한쪽이 받는 편안한 사이',
  비견: '성향이 닮아 친구처럼 편하지만 경쟁심도 생김', 겁재: '비슷한 듯 다른 결, 주도권 다툼 주의',
  편재: '힘겨루기가 생기기 쉬운 긴장 관계', 편관: '힘겨루기가 생기기 쉬운 긴장 관계',
};

// 두 지지 사이의 모든 관계 → [[점수, 설명]]
function jiRelations(a, b) {
  const out = [];
  if (R.hasPair(R.JI_YUKHAP, a, b)) out.push([12, '육합: 서로 끌리고 편안한 사이']);
  const sam = R.sameGroup(R.JI_SAMHAP, a, b);
  if (sam) out.push(sam[1] === a || sam[1] === b ? [8, '삼합: 뜻이 맞아 함께 일을 이루는 사이'] : [4, '삼합(약): 같은 목표를 향하지만 힘은 약함']);
  if (R.sameGroup(R.JI_BANGHAP, a, b)) out.push([4, '방합: 같은 계절의 기운, 동질감이 있는 사이']);
  if (a === b) out.push(R.JI_JAHYEONG.includes(a) ? [-5, '자형: 닮았지만 스스로 꼬이는 사이'] : [3, '같은 글자: 정서가 비슷해 공감이 잘 됨']);
  if (R.hasPair(R.JI_CHUNG, a, b)) out.push([-12, '충: 강하게 끌리지만 부딪힘도 잦은 사이']);
  if (R.hasPair(R.JI_WONJIN, a, b)) out.push([-10, '원진: 이유 없이 서운하고 미워지는 사이']);
  if (R.hasPair(R.JI_HYEONG, a, b)) out.push([-8, '형: 갈등과 다툼이 생기기 쉬운 사이']);
  if (R.hasPair(R.JI_HAE, a, b)) out.push([-5, '해: 서로를 은근히 방해하는 사이']);
  if (R.hasPair(R.JI_PA, a, b)) out.push([-4, '파: 진행 중인 일에 차질이 생기기 쉬운 사이']);
  if (R.hasPair(R.JI_GWIMUN, a, b)) out.push([-3, '귀문: 예민하게 서로를 의심·집착하기 쉬운 사이']);
  return out;
}

export function sajuCompat(ma, mb) {
  const A = pillarsOf(ma), B = pillarsOf(mb);
  const reasons = []; // {delta, text}
  const add = (delta, text) => { if (delta) reasons.push({ delta, text }); };

  // (1) 일간 ↔ 일간
  const ga = A.day[0], gb = B.day[0];
  if (R.hasPair(R.GAN_HAP, ga, gb)) add(12, `일간 천간합(${GAN[ga]}${GAN[gb]}): 서로에게 강하게 끌려 하나가 되려는 인연`);
  else if (R.hasPair(R.GAN_CHUNG, ga, gb)) add(-8, `일간 천간충(${GAN[ga]}${GAN[gb]}): 가치관이 정반대라 부딪히기 쉬움`);
  else { const s = sipsin(ga, gb); add(SIPSIN_SCORE[s], `일간 ${s}: ${SIPSIN_TEXT[s]}`); }

  // (2)~(5) 지지끼리: 일지 1.0, 월지 0.6, 년지(띠) 0.5, 시지 0.3
  const slots = [['일지', A.day[1], B.day[1], 1], ['월지', A.month[1], B.month[1], 0.6], ['띠', A.year[1], B.year[1], 0.5]];
  if (A.hour && B.hour) slots.push(['시지', A.hour[1], B.hour[1], 0.3]);
  for (const [label, ja, jb, w] of slots) {
    for (const [d, text] of jiRelations(ja, jb)) {
      const name = label === '띠' ? `${JI_ANIMAL[ja]}띠·${JI_ANIMAL[jb]}띠` : `${JI[ja]}${JI[jb]}`;
      add(Math.round(d * w), `${label} ${name} ${text}`);
    }
  }

  // (6) 교차 합·충 (같은 자리끼리 제외)
  const pa = [A.year, A.month, A.day, A.hour].filter(Boolean), pb = [B.year, B.month, B.day, B.hour].filter(Boolean);
  let gh = 0, gc = 0, jh = 0, jc = 0;
  pa.forEach((x, i) => pb.forEach((y, j) => {
    if (i === j) return;
    if (R.hasPair(R.GAN_HAP, x[0], y[0])) gh++;
    if (R.hasPair(R.GAN_CHUNG, x[0], y[0])) gc++;
    const sam = R.sameGroup(R.JI_SAMHAP, x[1], y[1]);
    if (R.hasPair(R.JI_YUKHAP, x[1], y[1]) || (sam && (sam[1] === x[1] || sam[1] === y[1]))) jh++;
    if (R.hasPair(R.JI_CHUNG, x[1], y[1]) || R.hasPair(R.JI_WONJIN, x[1], y[1])) jc++;
  }));
  add(Math.min(gh, 3), gh ? `교차 천간합 ${gh}개: 전체적으로 끌리는 기운이 많음` : '');
  add(-Math.min(gc, 3), gc ? `교차 천간충 ${gc}개: 곳곳에서 의견이 갈릴 수 있음` : '');
  add(Math.min(jh, 4), jh ? `교차 지지합 ${jh}개: 자리마다 손발이 맞는 구석이 있음` : '');
  add(-Math.min(jc, 4), jc ? `교차 지지충·원진 ${jc}개: 사소한 엇박자가 생기기 쉬움` : '');

  // (7) 오행 보완
  const EA = A.elements, EB = B.elements;
  const fills = [], lacks = [];
  for (const e of ['목', '화', '토', '금', '수']) {
    if (EA[e] === 0 && EB[e] >= 2) fills.push(`${ma.name}에게 없는 ${e} 기운을 ${mb.name}이(가) 채워줌`);
    if (EB[e] === 0 && EA[e] >= 2) fills.push(`${mb.name}에게 없는 ${e} 기운을 ${ma.name}이(가) 채워줌`);
    if (EA[e] === 0 && EB[e] === 0) lacks.push(`둘 다 ${e} 기운이 없음`);
  }
  fills.slice(0, 3).forEach((t) => add(3, t)); // 상한 +9
  lacks.slice(0, 3).forEach((t) => add(-1, t)); // 하한 -3
  const top = (E) => Object.entries(E).sort((x, y) => y[1] - x[1])[0];
  const ta = top(EA), tb = top(EB);
  if (ta[0] === tb[0] && ta[1] >= 4 && tb[1] >= 4) add(-3, `둘 다 ${ta[0]} 기운이 과해 부딪힘`);
  // 간이 용신(억부)
  const yongsin = (X, Y, nx, ny) => {
    const el = GAN_EL[X.day[0]];
    const gen = Object.keys(R.SAENG).find((k) => R.SAENG[k] === el); // 나를 생하는 오행
    const self = X.elements[el] + X.elements[gen];
    if (self <= 2 && Y.elements[el] + Y.elements[gen] >= 3) add(4, `신약한 ${nx}을(를) ${ny}의 기운이 받쳐줌`);
    else if (self >= 5 && Y.elements[R.SAENG[el]] + Y.elements[R.GEUK[el]] + Y.elements[Object.keys(R.GEUK).find((k) => R.GEUK[k] === el)] >= 3) add(4, `강한 ${nx}의 기운을 ${ny}이(가) 풀어줌`);
  };
  yongsin(A, B, ma.name, mb.name); yongsin(B, A, mb.name, ma.name);

  const clean = reasons.filter((r) => r.delta && r.text);
  const raw = clean.reduce((s, r) => s + r.delta, 0);
  const score = Math.max(0, Math.min(100, Math.round(50 + raw)));
  clean.sort((x, y) => Math.abs(y.delta) - Math.abs(x.delta));
  return { score, reasons: clean, hourKnown: !!(A.hour && B.hour) };
}

export function compat(a, b) {
  const blood = bloodCompat(a.blood, b.blood);
  const mbti = mbtiCompat(a.mbti, b.mbti);
  const saju = sajuCompat(a, b);
  const total = Math.round(blood.score * WEIGHT.blood + mbti.score * WEIGHT.mbti + saju.score * WEIGHT.saju);
  return { total, grade: R.grade(total), blood, mbti, saju };
}

// 내 일주 설명
export function describeIlju(m) {
  const p = pillarsOf(m);
  const [g, j] = p.day;
  return {
    ilju: ganji(p.day),
    text: `${R.GAN_IMAGE[g]}(${GAN[g]}${GAN_EL[g]}) 위에 ${JI_SEASON_TEXT(j)} ${JI_ANIMAL[j]}(${JI[j]}${JI_EL[j]})가 앉은 일주. ${R.GAN_KEYWORD[g]}.`,
  };
}
const JI_SEASON_TEXT = (j) => R.JI_SEASON[j];
