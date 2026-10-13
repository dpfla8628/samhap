import test from 'node:test';
import assert from 'node:assert/strict';
import * as R from '../public/lib/rules.js';
import { compat, sipsin, pillarsOf } from '../public/lib/score.js';
import { fourPillars, ganji } from '../public/lib/saju.js';

test('MBTI 행렬은 16×16 대칭', () => {
  for (const a of R.MBTI_ORDER) for (const b of R.MBTI_ORDER) {
    assert.equal(R.MBTI_MATRIX[a].length, 16);
    assert.equal(R.MBTI_MATRIX[a][R.MBTI_ORDER.indexOf(b)], R.MBTI_MATRIX[b][R.MBTI_ORDER.indexOf(a)], `${a}-${b}`);
  }
});

test('혈액형 10쌍 모두 점수·이유 존재', () => {
  const T = ['A', 'B', 'O', 'AB'];
  for (const a of T) for (const b of T) {
    const k = R.bloodKey(a, b);
    assert.ok(R.BLOOD_SCORE[k] > 0, k); assert.ok(R.BLOOD_REASON[k], k);
  }
});

test('지지 관계표: 각 지지는 충·육합 상대가 정확히 하나', () => {
  for (let j = 0; j < 12; j++) {
    assert.equal(R.JI_CHUNG.filter((p) => p.includes(j)).length, 1, `충 ${j}`);
    assert.equal(R.JI_YUKHAP.filter((p) => p.includes(j)).length, 1, `육합 ${j}`);
    assert.equal(R.JI_WONJIN.filter((p) => p.includes(j)).length, 1, `원진 ${j}`);
    assert.equal(R.JI_HAE.filter((p) => p.includes(j)).length, 1, `해 ${j}`);
    assert.equal(R.JI_PA.filter((p) => p.includes(j)).length, 1, `파 ${j}`);
  }
});

test('십신: 갑→기 정재, 갑→경 편관, 갑→병 식신, 갑→계 정인, 갑→을 겁재', () => {
  assert.equal(sipsin(0, 5), '정재'); assert.equal(sipsin(0, 6), '편관'); assert.equal(sipsin(0, 2), '식신');
  assert.equal(sipsin(0, 9), '정인'); assert.equal(sipsin(0, 1), '겁재'); assert.equal(sipsin(0, 0), '비견');
});

const people = [
  { name: '가', blood: 'A', mbti: 'INFP', birth: '1995-03-14', time: '08:30' },
  { name: '나', blood: 'O', mbti: 'ENFJ', birth: '1998-11-02', time: null },
  { name: '다', blood: 'B', mbti: 'ESTJ', birth: '2001-02-03', time: '23:45' },
  { name: '라', blood: 'AB', mbti: 'ISTP', birth: '1988-07-20', time: '00:10' },
];
test('궁합 점수는 대칭이고 0~100 범위', () => {
  for (const a of people) for (const b of people) {
    if (a === b) continue;
    const x = compat(a, b), y = compat(b, a);
    assert.equal(x.total, y.total, `${a.name}-${b.name}`);
    assert.equal(x.saju.score, y.saju.score);
    assert.ok(x.total >= 0 && x.total <= 100);
    assert.ok(x.saju.reasons.length > 0);
  }
});

test('만세력 기본 검증', () => {
  // 1900-01-01 = 갑술일, 2000-01-01 = 무오일 (위키 干支纪日 기준)
  assert.equal(ganji(fourPillars('1900-01-01', null).day), '갑술');
  assert.equal(ganji(fourPillars('2000-01-01', null).day), '무오');
  // 2000년은 경진년; 입춘(2000-02-04) 전은 기묘년
  assert.equal(ganji(fourPillars('2000-03-01', null).year), '경진');
  assert.equal(ganji(fourPillars('2000-01-20', null).year), '기묘');
  assert.equal(ganji(fourPillars('2000-01-20', null).month), '정축');
  // 자정 경계: 23시대 출생도 그날 일주 + 자시
  const late = fourPillars('2000-01-01', '23:45');
  assert.equal(ganji(late.day), '무오'); assert.equal(late.hour[1], 0);
  // 시두법: 갑기일 → 갑자시, 을경일 → 병자시
  assert.equal(ganji(fourPillars('2000-01-03', '00:40').hour), '병자');
  assert.equal(ganji(fourPillars('2000-01-07', '00:40').hour), '갑자');
});

const four = (b, t) => { const p = fourPillars(b, t); return [p.year, p.month, p.day, p.hour].map((x) => x ? ganji(x) : '-').join(' '); };
test('만세력 외부 검증 예시(연구 노트 manseryeok_algorithm.md)', () => {
  assert.equal(four('1992-10-24', '05:30'), '임신 경술 계유 을묘');
  assert.equal(four('2000-01-01', '12:00'), '기묘 병자 무오 무오');
  assert.equal(four('2024-03-10', '23:30'), '갑진 정묘 계유 임자');
  assert.equal(four('2025-02-03', '22:30'), '갑진 정축 계묘 계해'); // 입춘(23:10 KST) 직전
  assert.equal(four('2025-02-03', '23:30'), '을사 무인 계묘 임자'); // 입춘 직후
  assert.equal(four('1900-01-31', '12:00'), '기해 정축 갑진 경오');
  assert.equal(four('1987-07-15', '10:00'), '정묘 정미 을축 경진'); // 서머타임 -1h → 09:00, 진태양시 08:30 → 진시
  assert.equal(four('1949-10-01', null), '기축 계유 갑자 -');
  assert.equal(four('1998-03-15', null).split(' ')[2], '신유');
});
