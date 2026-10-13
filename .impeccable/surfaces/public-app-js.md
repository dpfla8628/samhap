---
version: 1
slug: "public-app-js"
primary_target: "public/app.js"
related_targets: ["public/style.css","public/index.html"]
---

# 방 화면 (/r/:id) — 수정 브리프

scope: 방 화면(입력·순위·유대 지도·내 사주)과 홈. 모드: Operate.
audience: 단톡방 친구들(20~30대), 궁합·사주·MBTI를 재미로 즐기는 사람. 폰에서 카톡 링크로 들어온다.
job: 내 정보를 넣고, 나와 가장 잘 맞는 친구를 찾고, 이유를 읽고, 방 전체의 관계를 본다.
constraints: 로그인 없음, 바닐라 JS, 글꼴 2종(제목 Noto Serif KR, 본문 Pretendard), 포인트 컬러 1개(주사), 배포 Cloudflare.
user answers (2026-10-13): 전체 바탕을 밝은 한지로; 제목만 명조, 본문은 산세리프 유지; 장식은 질감만 은은하게; 순위 줄은 눌리는 것처럼 보여야 함.

## Direction contract

THESIS: 예전 궁합책을 펼친 한 장의 한지. 카드가 떠 있는 '앱 UI' 배치를 거부하고, 종이 위에 먹으로 적힌 목록과 주사 낙관으로 점수를 찍는다.
OWN-WORLD: 누런 한지(#e9dfc4, SVG 섬유 결)와 한 톤 밝은 종이 장(#f5eedb, 1px 먹선 테두리, 그림자 없음), 먹(#2a211a)과 옅은 먹(#6a5d4c), 주사 빨강(#b8331f) 하나. 제목은 Noto Serif KR 700, 본문·데이터는 Pretendard. 낙관은 네모난 빨간 도장에 종이색 숫자.
STORY: 들어오면 종이 위에 내 이름과 친구들이 먹으로 적혀 있고, 가장 잘 맞는 친구 옆에 도장이 쾅 찍힌다. 줄을 누르면 이유가 펼쳐지고, 지도에서 캐릭터를 끌면 인연의 선이 따라온다.
FIRST VIEWPORT: 방 이름(명조)과 두 버튼, 탭 아래 종이 장. 종이 맨 위에 "가장 잘 맞는 사람" 띠와 낙관(68px), 그 아래 순위 카드 3~4장이 보인다. 각 카드에는 왕관/번호, 동물 아바타, 이름, 칩, 점수, 펼침 쉐브론, 점수 막대.
SIGNATURE: 낙관이 찍히는 모션(한 번)과 유대 지도의 살아 있는 힘 배치·끌기·강한 인연 위로 흐르는 기운.
QUALITY BAR: 종이 위 글자 대비 4.5:1 이상, 모든 입력 16px, 폰 폭 320px에서 가로 스크롤 없음, 순위 줄은 카드처럼 눌리는 모양(테두리·호버·쉐브론), 장식은 질감 외 추가하지 않음.

seed: user-brief-hanji-2026-10-13

## Concept roll
skipped-by-user-direction: 사용자가 세계를 말로 지정함(밝은 한지 바탕, 제목만 명조, 장식은 질감만, 주사 빨강 하나). 후보 7개 돌리기(concept-seed)는 하지 않았고, seed 줄의 값은 그 지시를 가리키는 표식이다. PRODUCT.md는 2026-10-13 리뷰 후 작성.
