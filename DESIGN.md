---
name: 삼합궁합
description: 펼쳐 놓은 한지 한 장 위에 먹으로 적은 목록과 주사 낙관 — 혈액형·MBTI·사주 궁합 방
colors:
  accent: "#b8331f"
  accent-strong: "#9a2a18"
  accent-weak: "rgba(184, 51, 31, .10)"
  success: "#3b6e4a"
  rank-1: "#b8942a"
  rank-2: "#8f9096"
  rank-3: "#a9784a"
  paper: "#e9dfc4"
  sheet: "#f5eedb"
  field: "#fbf7ec"
  sheet-2: "#e6dcc0"
  sheet-3: "#d9cdab"
  ink: "#2a211a"
  ink-2: "#6a5d4c"
  line: "rgba(42, 33, 26, .22)"
  line-strong: "rgba(42, 33, 26, .45)"
  map-dim: "#7a6b55"
  map-ring: "#8a7c66"
  map-flow: "#f1b3a5"
typography:
  display:
    fontFamily: "'Noto Serif KR', 'Nanum Myeongjo', 'Apple Myungjo', 'Batang', serif"
    fontSize: "40px"
    fontWeight: 900
    lineHeight: 1
    letterSpacing: "6px"
  headline:
    fontFamily: "'Noto Serif KR', 'Nanum Myeongjo', 'Apple Myungjo', 'Batang', serif"
    fontSize: "28px"
    fontWeight: 700
    lineHeight: 1.25
    letterSpacing: "-0.01em"
  title:
    fontFamily: "'Noto Serif KR', 'Nanum Myeongjo', 'Apple Myungjo', 'Batang', serif"
    fontSize: "21px"
    fontWeight: 700
    lineHeight: 1.25
    letterSpacing: "-0.01em"
  subtitle:
    fontFamily: "'Noto Serif KR', 'Nanum Myeongjo', 'Apple Myungjo', 'Batang', serif"
    fontSize: "16.5px"
    fontWeight: 700
    lineHeight: 1.25
    letterSpacing: "-0.01em"
  numeral:
    fontFamily: "'Noto Serif KR', 'Nanum Myeongjo', 'Apple Myungjo', 'Batang', serif"
    fontSize: "30px"
    fontWeight: 700
    lineHeight: 1.1
  body:
    fontFamily: "'Pretendard Variable', Pretendard, -apple-system, 'Apple SD Gothic Neo', 'Malgun Gothic', system-ui, sans-serif"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.55
    fontFeature: "'tnum'"
  input:
    fontFamily: "'Pretendard Variable', Pretendard, -apple-system, 'Apple SD Gothic Neo', 'Malgun Gothic', system-ui, sans-serif"
    fontSize: "16px"
    fontWeight: 400
  label:
    fontFamily: "'Pretendard Variable', Pretendard, -apple-system, 'Apple SD Gothic Neo', 'Malgun Gothic', system-ui, sans-serif"
    fontSize: "14px"
    fontWeight: 600
  caption:
    fontFamily: "'Pretendard Variable', Pretendard, -apple-system, 'Apple SD Gothic Neo', 'Malgun Gothic', system-ui, sans-serif"
    fontSize: "13px"
    fontWeight: 400
  chip:
    fontFamily: "'Pretendard Variable', Pretendard, -apple-system, 'Apple SD Gothic Neo', 'Malgun Gothic', system-ui, sans-serif"
    fontSize: "12px"
    fontWeight: 400
rounded:
  sm: "4px"
  md: "6px"
  seal: "7px"
  pill: "999px"
  circle: "50%"
spacing:
  "1": "4px"
  "2": "8px"
  "3": "12px"
  "4": "16px"
  "5": "20px"
  "6": "24px"
  "8": "32px"
  "16": "64px"
components:
  button-primary:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.sheet}"
    typography: "{typography.body}"
    rounded: "{rounded.sm}"
    padding: "0 20px"
    height: "44px"
  button-primary-hover:
    backgroundColor: "{colors.accent-strong}"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
    padding: "0 20px"
    height: "44px"
  button-ghost-hover:
    backgroundColor: "{colors.sheet}"
  button-block:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.sheet}"
    rounded: "{rounded.sm}"
    height: "48px"
    width: "100%"
  button-small:
    rounded: "{rounded.sm}"
    padding: "0 14px"
    height: "36px"
  input:
    backgroundColor: "{colors.field}"
    textColor: "{colors.ink}"
    typography: "{typography.input}"
    rounded: "{rounded.sm}"
    padding: "0 12px"
    height: "44px"
  tile:
    backgroundColor: "{colors.field}"
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
    height: "48px"
  tile-pressed:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.sheet}"
  chip:
    backgroundColor: "{colors.sheet-2}"
    textColor: "{colors.ink-2}"
    typography: "{typography.chip}"
    rounded: "{rounded.pill}"
    padding: "2px 8px"
  sheet:
    backgroundColor: "{colors.sheet}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "24px 20px"
  rank-card:
    backgroundColor: "{colors.field}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "12px 12px 12px 8px"
  seal:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.sheet}"
    typography: "{typography.numeral}"
    rounded: "{rounded.seal}"
    size: "68px"
  best-band:
    backgroundColor: "{colors.accent-weak}"
    rounded: "{rounded.md}"
    padding: "12px 14px"
  toast:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.sheet}"
    rounded: "{rounded.sm}"
    padding: "12px 20px"
  notice:
    backgroundColor: "transparent"
    textColor: "{colors.ink-2}"
    rounded: "{rounded.sm}"
    padding: "12px 16px"
---

# Design System: 삼합궁합

## Overview

**Creative North Star: "한지 위 먹과 주사(朱砂)"**

예전 궁합책을 펼친 한 장의 한지다. 화면 전체가 누런 한지 한 장이고, 그 위에 한 톤 밝은 종이 장이 1px 먹선으로만 구분되어 얹힌다. 카드가 그림자로 떠 있는 '앱 UI' 배치를 거부한다. 글은 먹으로 적히고, 점수와 강조는 주사 빨강 하나로만 찍힌다. 가장 잘 맞는 사람 옆에는 네모난 빨간 낙관이 한 번 쾅 찍히고, 유대 지도에서는 같은 종이 결 위에 먹선으로 인연이 이어진다.

밀도는 폰 한 손 기준이다. 600px 한 열, 44~48px 높이의 입력과 버튼, 16px 기본 입력 글자. 장식은 종이 질감(SVG 섬유 결 + 입자) 외에는 더하지 않는다. 명조는 제목·숫자 도장·한자 기둥에만 쓰고, 본문과 데이터는 산세리프가 맡는다. 2026-10-13에 '밤하늘 + 한지 카드' 세계는 사용자가 "AI 같다"고 거부했고, 이 세계가 그 자리를 대신한다.

**Key Characteristics:**
- 바탕과 종이 장 모두 질감 있는 한지, 떠 있는 카드와 드롭 섀도 없음
- 포인트 컬러는 주사 빨강 하나; 길(+) 이유에만 초록 하나를 보조로 허용
- 제목은 Noto Serif KR 700(로고만 900), 본문·데이터는 Pretendard 15px, tabular numerals
- 모서리는 6px/4px, 칩은 알약, 배지는 원
- 한 번 찍히는 낙관 모션과 살아 있는 유대 지도가 유일한 서명 모션

## Colors

누런 종이 네 단계와 먹 두 단계 위에 주사 빨강 하나가 찍히는 단일 포인트 팔레트다.

### Primary
- **주사 (accent)**: 낙관·로고 바탕, 주 버튼, 눌린 타일, 선택된 탭 밑줄, 1~3위 점수, 점수 막대 채움, 일주 한자, 포커스 링, 캐럿·선택 영역, 감점(-) 이유 숫자, 지도의 75점 이상 선과 나·선택 캐릭터 링. 화면 하나에서 가장 뜨거운 자리 몇 군데에만 쓴다.
- **진한 주사 (accent-strong)**: 주 버튼 호버에만.
- **옅은 주사 (accent-weak)**: 베스트 매치 띠 바탕, 포커스 할로(3px), 안내 단계 번호 원 바탕. 주사의 10% 투명 버전이라 종이 위에서 분홍빛 얼룩처럼 보인다.

### Secondary
- **길 초록 (success)**: 이유 목록에서 가점(+) 숫자에만. 다른 곳에서는 쓰지 않는다.
- **왕관 금·은·동 (rank-1 / rank-2 / rank-3)**: 1~3위 왕관 SVG의 `currentColor`에만. 채도를 죽인 먹빛 금속이라 종이 위에서 튀지 않는다.

### Neutral
- **한지 바탕 (paper)**: `body` 배경색. 그 위에 `--fiber`(가로로 긴 섬유, 520×260 타일)와 `--grain`(가는 입자, 240×240 타일) 두 SVG 노이즈가 겹친다. 이미지 파일 없음.
- **종이 장 (sheet)**: 섹션 카드 바탕이자 주사 위에 놓이는 글자색(버튼·낙관·토스트 글자). 질감은 바탕에서 비쳐 보이게 두고 따로 입히지 않는다.
- **입력 면 (field)**: 입력창·타일·세그먼트 버튼·순위 카드·사주 기둥 바탕. 종이 장보다 한 톤 밝아 "눌리는 면"임을 알린다. (style.css에 커스텀 프로퍼티 없이 직접 적혀 있음.)
- **종이 2 (sheet-2)**: 칩, 순위 배지 원, 점수 트랙·막대 바탕, 오행 알약.
- **종이 3 (sheet-3)**: 유대 지도 캔버스 바탕(여기에만 `--grain` 질감을 다시 입힘), 캔버스 글자 뒤 후광 획(HALO), 스크롤바 썸.
- **먹 (ink)**: 본문·제목·지도 라벨. 호버 시 테두리색.
- **옅은 먹 (ink-2)**: 보조 글자, 플레이스홀더, 라벨, 칩 글자, 비선택 탭.
- **먹선 (line)**: 가는 구분선, 펼친 순위 카드의 점선, 지도 캔버스 테두리.
- **진한 먹선 (line-strong)**: 종이 장·입력·타일·순위 카드·고스트 버튼·탭 밑줄 테두리. 모든 윤곽은 이 1px 선이 맡는다.
- **지도 먹선 (map-dim)**: 캔버스에서 60~74점(2px), 45~59점(1px), 45점 미만(1px 점선) 선.
- **지도 링 (map-ring)**: 나·선택이 아닌 캐릭터의 원 테두리(1.5px).
- **기운 (map-flow)**: 75점 이상 선 위로 흐르는 밝은 점선(2px, dash 5/23). 주사의 밝은 분홍.

### Named Rules
**The One Vermilion Rule.** 색으로 강조하는 자리는 주사 하나다. 두 번째 포인트 컬러는 없다. 초록은 '+' 숫자에만, 금·은·동은 왕관에만 허용되는 예외이며 둘 다 글자·배경으로 번지지 않는다.

**The Ink Outline Rule.** 면을 구분하는 것은 1px 먹선(line-strong)이지 그림자나 색 차이가 아니다. 종이 단계(paper → sheet → field)는 한 톤씩만 밝아진다.

## Typography

**Display Font:** Noto Serif KR 700/900 (Google Fonts; fallback Nanum Myeongjo, Apple Myungjo, Batang)
**Body Font:** Pretendard Variable (jsDelivr dynamic subset; fallback Apple SD Gothic Neo, Malgun Gothic, system-ui)

**Character:** 명조는 책 제목과 도장 글씨, 산세리프는 그 아래 적힌 데이터. 명조는 제목(h1~h3), 탭, 베스트 매치 이름, 낙관 숫자, 사주 한자 기둥에만 쓰고 본문 문장과 숫자 데이터는 모두 Pretendard다. 본문 전체에 `tnum`이 켜져 있어 점수 열이 맞는다.

### Hierarchy
- **Display** (900, 40px, 1, 자간 6px): 홈 로고 "三合" 한 곳. 주사 바탕 위 종이색 글자, -4° 회전.
- **Headline** (700, 28px, 1.25, -0.01em): 홈 h1. 방 화면의 h1은 24px.
- **Title** (700, 21px, 1.25): 종이 장 안 h2. 베스트 매치 이름은 20px 같은 서체.
- **Subtitle** (700, 16.5px, 1.25): h3. 탭 라벨은 15.5px 같은 서체.
- **Numeral** (700, 30px, 1.1): 낙관 숫자(-0.02em)와 사주 한자 기둥. 순위 점수는 Pretendard 700 22px, MBTI 미리보기는 Pretendard 700 24px/0.12em.
- **Body** (400, 15px, 1.55): 기본 문장. 이름은 600 16px, 이유 목록은 14px.
- **Input** (400, 16px): 모든 입력·셀렉트. 16px 미만이면 iOS가 포커스 때 확대하므로 내려가지 않는다.
- **Label** (600, 14px): 필드 이름, 알림(notice), 토스트, 작은 버튼. 타일·세그먼트 글자는 600 17px.
- **Caption** (400, 13px): `.small`, 보조 설명, 범례, 막대 라벨, 단계 번호.
- **Chip** (400, 12px): 칩, 기둥 라벨, 각주(12px/1.6).

### Named Rules
**The Serif-Only-For-Titles Rule.** 명조는 제목·탭·낙관·한자에만. 문장 본문, 폼, 데이터, 캔버스 라벨(13px Pretendard)은 산세리프다. 대문자 트래킹 소제목(아이브로) 없음.

## Layout

한 열. `.app`은 최대 600px, 가운데 정렬, 안쪽 여백 24px 16px 72px(아래 여백은 고정 토스트 자리). 폰 폭 320px에서 가로 스크롤이 없어야 한다.

세로 리듬은 8px 배수다. 종이 장 사이 16px, 장 안 h2 아래 16px, h3 위 24px 아래 8px, 필드 사이 20px, 문단 아래 8px, 순위 카드 사이 8px, 범례·안내 위 12px, 각주 위 32px, 로딩 상태 위아래 64px. 가로 간격은 행 12px, 타일 격자 8px, 칩 4~6px.

격자는 4열만 쓴다: 혈액형 타일(`repeat(4, 1fr)`), MBTI 세그먼트(4열 × 2행, 6px 행 간격), 사주 네 기둥. 순위 카드 요약은 `40px 1fr auto 22px` 2행 그리드(배지 / 이름 / 점수 / 쉐브론, 아래 행에 점수 트랙).

반응형 분기는 둘뿐이다. 520px 이하에서 방 머리 버튼이 40px 높이·14px 글자로 줄고, 420px 이하에서 앱 위 여백 16px, 종이 장 안쪽 20px 16px, 이름 15px, 칩이 이름 아래 줄로 내려가며, 지도 캔버스 높이 440px → 400px.

## Elevation & Depth

그림자가 없다. 깊이는 종이 네 단계의 한 톤 차이와 1px 먹선으로만 표현한다. 종이 장은 바탕 위에 그냥 놓이고, 순위 카드는 종이 장보다 한 톤 밝은 입력 면 위에 테두리로 구분되며, 눌리면 `scale(.97~.995)`로 종이가 눌리는 느낌만 준다. 모달·오버레이도 없다. 토스트는 먹 바탕에 종이색 글자로 화면 아래 24px에 고정되는 평평한 띠다.

`box-shadow` 속성이 쓰이는 자리는 셋뿐이고 어느 것도 떠오름을 뜻하지 않는다.

### Shadow Vocabulary
- **도장 이중 테 (seal ring)** (`box-shadow: inset 0 0 0 2px var(--sheet), inset 0 0 0 4px var(--accent)`): 낙관과 로고. 빨간 도장 안쪽의 종이색 선 한 줄. 바깥으로 번지지 않는다.
- **포커스 할로 (focus halo)** (`box-shadow: 0 0 0 3px var(--accent-weak)`; 테두리는 `--accent`): 입력·셀렉트 포커스. 나머지 요소는 `outline: 2px solid var(--accent); outline-offset: 2px`.
- **캔버스 기운 (canvas glow)** (`ctx.shadowBlur` 10 / 24, 색 `--accent`): 유대 지도에서 선택된 캐릭터와 그와 이어진 75점 이상 선에만. DOM에는 쓰지 않는다.

### Named Rules
**The No-Lift Rule.** 어떤 면도 드롭 섀도로 떠오르지 않는다. 그림자처럼 보이는 것은 도장 안쪽 테, 포커스 할로, 지도 캔버스의 기운뿐이다.

## Shapes

살짝 깎은 네모. 종이 장·순위 카드·베스트 띠는 6px, 입력·버튼·타일·알림·토스트·캔버스는 4px, 낙관은 7px, 칩과 오행 알약은 999px, 순위 배지·단계 번호·체크 아바타는 원이다. 테두리는 항상 1px(진한 먹선), 호버 시 같은 두께로 먹색이 된다. 펼친 순위 카드는 요약 아래에 1px 점선(line)을 긋고 위 모서리만 둥글게 남긴다.

도장은 각도를 가진다. 로고는 -4°, 낙관은 -7° 회전한 빨간 네모에 종이색 글자와 안쪽 이중 테. 아바타는 64×64 좌표계에 한 가지 선 굵기로 그린 12지지 동물 원형 아이콘이며 DOM(SVG)과 캔버스(Path2D)가 같은 경로 데이터를 쓴다.

## Components

### Buttons
- **Shape:** 살짝 깎은 네모(4px), 높이 44px, 좌우 20px, 600 15px.
- **Primary:** 주사 바탕에 종이색 글자. 호버 시 진한 주사. 전체 폭 `block` 변형은 48px·16px 글자.
- **Ghost:** 투명 바탕, 진한 먹선 테두리, 먹 글자. 호버 시 테두리 먹색·바탕 종이 장. 방 머리의 "새 방 만들기"·"링크 공유"가 이 모양.
- **Small:** 36px, 좌우 14px, 14px 글자(알림 안 행동).
- **Active / Disabled:** 누르면 `scale(.98)` 0.1s. 비활성은 불투명도 .5.
- **Focus:** 주사 2px 아웃라인, 2px 오프셋.

### Inputs / Fields
- **Style:** 입력 면 바탕, 1px 진한 먹선, 4px, 높이 44px, 좌우 12px, 16px 글자. 필드 이름은 600 14px, 아래 8px.
- **Focus:** 테두리 주사 + 3px 옅은 주사 할로(0.15s).
- **Variants:** 숫자 6.5em, 시간 10em, 셀렉트 자동 폭. 날짜·시간은 iOS 고유 폭을 막기 위해 `appearance: none`.
- **Error:** 주사 600 글자, 위 8px. 체크박스는 18px, `accent-color` 주사.

### Tiles / Segments (혈액형·MBTI 선택)
- **Style:** 입력 면 바탕, 1px 진한 먹선, 4px, 높이 48px(세그먼트 52px, 보조 글자 500 11px), 600 17px.
- **State:** 호버 테두리 먹색, 누르면 `scale(.97)`, `aria-pressed=true`면 주사 바탕·종이색 글자·주사 테두리. MBTI 미리보기는 주사 700 24px.

### Chips
- **Style:** 종이 2 바탕, 옅은 먹 글자, 12px, 2px 8px, 알약. 이름 옆 혈액형·MBTI 표시.
- **오행 알약 (el):** 13px, 4px 10px, 먹 글자. 0개는 투명 바탕에 1px 점선 테두리와 옅은 먹 글자.

### Cards / Containers
- **종이 장 (sheet):** 종이 장 바탕, 1px 진한 먹선, 6px, 안쪽 24px 20px(420px 이하 20px 16px), 아래 16px. 장 안 링크는 주사. 지도 장은 12px 12px 20px.
- **순위 카드 (rank):** `<details>` 한 장. 입력 면 바탕, 1px 진한 먹선, 6px. 호버 테두리 먹색, 누르면 `scale(.995)`. 요약 그리드에 배지(40px 원, 종이 2 바탕, 700 16px 옅은 먹; 1~3위는 투명 바탕에 36px 왕관 SVG를 금·은·동으로), 아바타, 이름(600 16px)+칩, 점수(700 22px, 1~3위는 주사), 22px 쉐브론(펼치면 180° 회전·주사). 아래 행에 6px 점수 트랙(종이 2 위 주사). 펼친 본문은 12px 12px 16px, 항목 막대(56px 1fr 36px, 8px 높이, 주사 .85), 이유 목록(14px, 점선 구분, + 초록 / - 주사 700 tnum).
- **알림 (notice):** 투명, 1px 진한 먹선, 4px, 12px 16px, 옅은 먹 14px, 오른쪽에 작은 버튼.
- **Shadow Strategy:** 없음(Elevation & Depth).

### Navigation
- **탭:** 1px 진한 먹선 밑줄 위에 명조 700 15.5px 버튼, 12px 12px, 옅은 먹. 호버 먹색, 선택되면 먹 글자 + 2px 주사 밑줄(-1px로 겹침). 간격 4px.
- **방 머리:** 왼쪽에 옅은 먹 crumb(호버 먹색)과 h1 24px, 진행 표시 14px; 오른쪽에 고스트 버튼 두 개(8px 간격). 520px 이하에서 버튼이 40px로 줄고 접힌다.
- **홈 masthead:** 가운데 정렬, 로고 도장(40px/900, 주사 바탕, -4°, 안쪽 이중 테) 아래 20px에 h1, 8px에 옅은 먹 태그라인.

### Seal (낙관) — Signature
베스트 매치 띠(옅은 주사 바탕, 6px, 12px 14px, 56px 아바타 + 13px 라벨 + 명조 20px 이름 + 13px 보조) 오른쪽 끝에 68×68 주사 네모(7px, -7°, 안쪽 이중 테), 종이색 명조 700 30px 점수. 방에 처음 들어오거나 시점을 바꾸거나 저장한 뒤 한 번만 `stamp` 모션: `scale(2) rotate(-16deg)` 투명에서 0.45s `cubic-bezier(.2,.8,.2,1)`로 눌려 `scale(.96)`을 거쳐 제자리. `prefers-reduced-motion`이면 모든 애니메이션·전환이 꺼진다.

### Bond Map (유대 지도) — Signature
종이 3 바탕에 입자 질감을 다시 입힌 440px 캔버스(4px, 1px 먹선, `touch-action: none`, 잡으면 grab/grabbing 커서). 캐릭터는 12지지 동물 아바타(반지름 22, 선택 27; 링은 나·선택이면 주사 3px, 아니면 지도 링 1.5px). 선은 점수 구간별로 주사 3px(75+), 지도 먹선 2px(60~74), 1px(45~59), 1px 점선(45 미만), 불투명도 .9/.7/.45. 75점 이상 선 위로는 기운 점선이 흐른다. 등장은 700ms 큐빅 이즈아웃, 60ms 스태거, 이후 ±1.6px 호흡. 라벨은 Pretendard 13px 먹 글자에 종이 3 후광 획 4px. 범례는 13px 옅은 먹, 16px 간격.

### Toast / Steps / Footnote
- **토스트:** 먹 바탕, 종이색 14px, 12px 20px, 4px, 화면 아래 24px 고정.
- **단계 번호:** 28px 원, 옅은 주사 바탕에 주사 700 13px, 본문과 12px 간격.
- **각주:** 옅은 먹 12px/1.6 가운데, 링크는 먹색. 재미용 풀이 고지는 항상 여기 둔다.

## Do's and Don'ts

### Do:
- **Do** 모든 면을 1px 진한 먹선(line-strong)으로 구분하고, 호버는 테두리를 먹색으로만 바꾼다.
- **Do** 새 강조는 주사 하나로만 찍는다: 바탕이면 종이색 글자, 글자면 먹 위 주사.
- **Do** 명조는 Noto Serif KR 700으로 제목·탭·낙관·한자에만, 본문·폼·데이터는 Pretendard 15px(`tnum`)로 쓴다.
- **Do** 입력·버튼은 44px(전체 폭 48px, 작은 36px), 입력 글자 16px, 모서리 4px을 지킨다.
- **Do** 누르는 면은 입력 면(field) 바탕으로 한 톤 밝히고, 눌림은 `scale(.97~.995)` 0.1s로 표현한다.
- **Do** 모션은 0.15s `cubic-bezier(.2,.8,.2,1)` 전환과 한 번 찍히는 낙관, 지도의 호흡만 두고, `prefers-reduced-motion`을 존중한다.
- **Do** 아이콘은 인라인 SVG(왕관·쉐브론·아바타)로 `currentColor`를 쓴다.

### Don't:
- **Don't** 드롭 섀도·블러·반투명 유리·그라데이션으로 면을 띄우지 않는다. 떠오르는 카드는 이 세계에 없다.
- **Don't** 주사 외의 두 번째 포인트 컬러를 들이지 않는다. 초록은 '+' 숫자, 금·은·동은 왕관 밖으로 나가지 않는다.
- **Don't** 종이 질감 외의 장식(별, 밤하늘, 일러스트 배경, 패턴 테두리)을 더하지 않는다.
- **Don't** 본문 문장·폼·숫자 데이터에 명조를 쓰지 않는다. 대문자 트래킹 아이브로 소제목을 만들지 않는다.
- **Don't** 6px·4px·알약·원 외의 모서리나 1px 외의 테두리 두께를 쓰지 않는다(낙관 7px은 도장 전용).
- **Don't** 600px 한 열을 넘는 다열 레이아웃이나 폰 폭 320px에서 가로 스크롤을 만드는 고정 폭을 쓰지 않는다.
