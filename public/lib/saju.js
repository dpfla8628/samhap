// 만세력: 생년월일시(한국 시각) → 년·월·일·시주. 외부 라이브러리 없음.
// 월·년 경계는 태양 황경(절기)으로, 일주는 율리우스일로, 시주는 진태양시(동경 127.5° 기준)로 계산한다.
export const GAN = ['갑', '을', '병', '정', '무', '기', '경', '신', '임', '계'];
export const JI = ['자', '축', '인', '묘', '진', '사', '오', '미', '신', '유', '술', '해'];
export const GAN_HAN = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
export const JI_HAN = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
export const GAN_EL = ['목', '목', '화', '화', '토', '토', '금', '금', '수', '수'];
export const JI_EL = ['수', '토', '목', '목', '토', '화', '화', '토', '금', '금', '토', '수'];
export const JI_ANIMAL = ['쥐', '소', '호랑이', '토끼', '용', '뱀', '말', '양', '원숭이', '닭', '개', '돼지'];

// 그레고리력 → 율리우스일(정오 기준 정수)
export function jdn(y, m, d) {
  const a = Math.floor((14 - m) / 12);
  const yy = y + 4800 - a;
  const mm = m + 12 * a - 3;
  return d + Math.floor((153 * mm + 2) / 5) + 365 * yy + Math.floor(yy / 4) - Math.floor(yy / 100) + Math.floor(yy / 400) - 32045;
}

// 태양 시황경(도). Meeus, Astronomical Algorithms 25장 저정밀 공식(오차 ≈ 0.01° ≈ 15분).
export function sunLongitude(jd) {
  const T = (jd - 2451545.0) / 36525;
  const L0 = 280.46646 + 36000.76983 * T + 0.0003032 * T * T;
  const M = (357.52911 + 35999.05029 * T - 0.0001537 * T * T) * Math.PI / 180;
  const C = (1.914602 - 0.004817 * T - 0.000014 * T * T) * Math.sin(M) + (0.019993 - 0.000101 * T) * Math.sin(2 * M) + 0.000289 * Math.sin(3 * M);
  const omega = (125.04 - 1934.136 * T) * Math.PI / 180;
  const lambda = L0 + C - 0.00569 - 0.00478 * Math.sin(omega);
  return ((lambda % 360) + 360) % 360;
}

// 한국 표준시의 UTC 오프셋(시간). IANA tz 기준: 1908-04-01 전 LMT(8:27:52), ~1911 UTC+8:30, 1954-03-21~1961-08-09 UTC+8:30, 서머타임 기간 +1시간.
const DST = [
  ['1948-06-01', '1948-09-13'], ['1949-04-03', '1949-09-11'], ['1950-04-01', '1950-09-10'], ['1951-05-06', '1951-09-09'],
  ['1955-05-05', '1955-09-09'], ['1956-05-20', '1956-09-30'], ['1957-05-05', '1957-09-22'], ['1958-05-04', '1958-09-21'],
  ['1959-05-03', '1959-09-20'], ['1960-05-01', '1960-09-18'], ['1987-05-10', '1987-10-11'], ['1988-05-08', '1988-10-09'],
];
export function kstOffsetHours(dateStr) {
  let off = 9;
  if (dateStr < '1908-04-01') off = 8 + 27 / 60 + 52 / 3600;
  else if (dateStr < '1912-01-01' || (dateStr >= '1954-03-21' && dateStr < '1961-08-10')) off = 8.5;
  // ponytail: 서머타임 경계를 날짜 단위로만 본다(실제 전환은 새벽 2~3시). 경계일 새벽 출생은 ±1시간 오차 가능.
  if (DST.some(([a, b]) => dateStr >= a && dateStr < b)) off += 1;
  return off;
}

const pad = (n) => String(n).padStart(2, '0');

/**
 * @param {string} birth 'YYYY-MM-DD' (양력, 한국 시각)
 * @param {string|null} time 'HH:MM' 또는 null(생시 모름)
 * @returns {{year:[g,j], month:[g,j], day:[g,j], hour:[g,j]|null, solarTime:string, lon:number}}
 */
export function fourPillars(birth, time) {
  const [y, mo, d] = birth.split('-').map(Number);
  const hasTime = typeof time === 'string' && /^\d{2}:\d{2}$/.test(time);
  const [hh, mi] = hasTime ? time.split(':').map(Number) : [12, 0]; // 생시 모르면 정오로 두고 시주는 비운다
  const off = kstOffsetHours(birth);

  // 생시 순간(UT)의 율리우스일(소수) — 절기 판정용
  const jd0 = jdn(y, mo, d); // 그 날 정오(UT)
  const utHours = hh + mi / 60 - off; // UT 기준 시각
  const jdUT = jd0 - 0.5 + utHours / 24;
  const lon = sunLongitude(jdUT);

  // 년주: 입춘(황경 315°) 이전의 1~2월생은 전년도
  let sy = y;
  if (mo <= 2 && lon < 315 && lon > 180) sy = y - 1;
  const yg = ((sy - 4) % 10 + 10) % 10;
  const yj = ((sy - 4) % 12 + 12) % 12;

  // 월주: 인월(입춘)부터 30°씩
  const mIdx = Math.floor(((lon - 315 + 360) % 360) / 30); // 0=인월
  const mj = (mIdx + 2) % 12;
  const mg = ((yg % 5) * 2 + 2 + mIdx) % 10;

  // 진태양시(동경 127.5° 기준): 표준시 - (오프셋 - 8.5h). 시지 판정에만 쓴다.
  let sMin = hh * 60 + mi - Math.round((off - 8.5) * 60);
  if (sMin < 0) sMin += 1440;
  if (sMin >= 1440) sMin -= 1440;
  const sh = Math.floor(sMin / 60);
  // 일주: 날짜 경계는 시계 자정(국내 만세력 앱의 일반 설정). 23시대 출생도 그날 일주 + 자시.
  const dIdx = ((jd0 + 49) % 60 + 60) % 60; // 1900-01-01 = 갑술(10), 2000-01-01 = 무오(54)
  const dg = dIdx % 10, dj = dIdx % 12;

  let hour = null;
  if (hasTime) {
    const hj = Math.floor(((sh + 1) % 24) / 2); // 23시→자(0), 1시→축(1) …
    const hg = ((dg % 5) * 2 + hj) % 10;
    hour = [hg, hj];
  }
  return { year: [yg, yj], month: [mg, mj], day: [dg, dj], hour, solarTime: `${pad(sh)}:${pad(sMin % 60)}`, lon };
}

export const ganji = ([g, j]) => GAN[g] + JI[j];
export const ganjiHan = ([g, j]) => GAN_HAN[g] + JI_HAN[j];

// 여덟 글자(생시 모르면 여섯)의 오행 분포
export function elementCount(p) {
  const c = { 목: 0, 화: 0, 토: 0, 금: 0, 수: 0 };
  for (const pl of [p.year, p.month, p.day, p.hour]) {
    if (!pl) continue;
    c[GAN_EL[pl[0]]]++;
    c[JI_EL[pl[1]]]++;
  }
  return c;
}
