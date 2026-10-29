// 지도교사 등록부 API  (주소: /api/register)
// - 선생님: 학교·성명·서명 제출 (비밀번호 없음)
// - 장학사: 비밀번호로 목록 보기·삭제 (서명은 개인정보라 목록은 비밀번호가 있어야만 보여요)
// 비밀번호는 넷리파이 환경 변수 REGISTER_PASSWORD 로 바꿀 수 있어요. (없으면 0000)
// 학습지 저장 공간(hanmadang-2026)과는 완전히 다른 저장 공간을 써요.
import { getStore } from "@netlify/blobs";

const password = () => (globalThis.Netlify?.env?.get("REGISTER_PASSWORD")) || "0000";
const json = (data, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" },
  });
const clean = (v, max) => String(v ?? "").replace(/[\u0000-\u001f]/g, " ").trim().slice(0, max);

// 엑셀 '부스운영현황' 기준 지도교사 명단 (부스 번호는 배치도 번호)
const ROSTER = [
  {
  "n": 1,
  "school": "백제초등학교",
  "teachers": [
  "김재연"
  ]
  },
  {
  "n": 2,
  "school": "홍주초등학교",
  "teachers": [
  "추성국"
  ]
  },
  {
  "n": 3,
  "school": "홍주초등학교",
  "teachers": [
  "추성국"
  ]
  },
  {
  "n": 4,
  "school": "천안동성중학교",
  "teachers": [
  "김가영"
  ]
  },
  {
  "n": 5,
  "school": "공주중학교",
  "teachers": [
  "박인영"
  ]
  },
  {
  "n": 6,
  "school": "봉황중학교",
  "teachers": [
  "배윤섭"
  ]
  },
  {
  "n": 7,
  "school": "이인중학교",
  "teachers": [
  "윤혜경"
  ]
  },
  {
  "n": 8,
  "school": "공주북중학교",
  "teachers": [
  "이남영"
  ]
  },
  {
  "n": 9,
  "school": "국립공주대학교사범대학부설중학교",
  "teachers": [
  "김지훈"
  ]
  },
  {
  "n": 10,
  "school": "온양용화중학교",
  "teachers": [
  "박규빈"
  ]
  },
  {
  "n": 11,
  "school": "아산배방중학교",
  "teachers": [
  "도은영"
  ]
  },
  {
  "n": 12,
  "school": "인주중학교",
  "teachers": [
  "정은례"
  ]
  },
  {
  "n": 13,
  "school": "서산부춘중학교",
  "teachers": [
  "김민수"
  ]
  },
  {
  "n": 14,
  "school": "대산중학교",
  "teachers": [
  "유민정"
  ]
  },
  {
  "n": 15,
  "school": "대철중학교",
  "teachers": [
  "이광빈"
  ]
  },
  {
  "n": 16,
  "school": "연무중학교",
  "teachers": [
  "김택수"
  ]
  },
  {
  "n": 17,
  "school": "금산중학교",
  "teachers": [
  "문아란"
  ]
  },
  {
  "n": 18,
  "school": "홍산중학교",
  "teachers": [
  "백지희"
  ]
  },
  {
  "n": 19,
  "school": "서천중학교",
  "teachers": [
  "나소영"
  ]
  },
  {
  "n": 20,
  "school": "한산중학교",
  "teachers": [
  "김광록"
  ]
  },
  {
  "n": 21,
  "school": "임성중학교",
  "teachers": [
  "강사라"
  ]
  },
  {
  "n": 22,
  "school": "태안여자중학교",
  "teachers": [
  "구연하"
  ]
  },
  {
  "n": 23,
  "school": "천안여자고등학교",
  "teachers": [
  "박태형"
  ]
  },
  {
  "n": 24,
  "school": "서천고등학교",
  "teachers": [
  "이건영"
  ]
  },
  {
  "n": 25,
  "school": "한일고등학교",
  "teachers": [
  "이동규"
  ]
  },
  {
  "n": 26,
  "school": "한일고등학교",
  "teachers": [
  "이동규"
  ]
  },
  {
  "n": 27,
  "school": "충남과학고등학교",
  "teachers": [
  "김솔이"
  ]
  },
  {
  "n": 28,
  "school": "충남과학고등학교",
  "teachers": [
  "최재웅"
  ]
  },
  {
  "n": 29,
  "school": "충남과학고등학교",
  "teachers": [
  "최재웅"
  ]
  },
  {
  "n": 30,
  "school": "대산고등학교",
  "teachers": [
  "김준수"
  ]
  },
  {
  "n": 31,
  "school": "건양대학교병설 건양고등학교",
  "teachers": [
  "한선린",
  "강나영"
  ]
  },
  {
  "n": 32,
  "school": "건양대학교병설 건양고등학교",
  "teachers": [
  "이은경",
  "곽인호"
  ]
  },
  {
  "n": 33,
  "school": "태안여자고등학교",
  "teachers": [
  "황수재"
  ]
  },
  {
  "n": 34,
  "school": "충남과학고등학교",
  "teachers": [
  "최재준"
  ]
  },
  {
  "n": null,
  "group": "방탈출게임",
  "school": "석송초등학교 · 유구초등학교",
  "teachers": [
  "장세미",
  "한대희"
  ]
  },
  {
  "n": null,
  "group": "대형교구체험",
  "school": "청송초등학교 · 주산초등학교 · 온양용화중학교 · 천안성성초등학교 · 서림초등학교",
  "teachers": [
  "이동욱",
  "김연희",
  "김미영",
  "조주상",
  "박정우"
  ]
  },
  {
  "n": null,
  "group": "종이접기 특강",
  "school": "충청남도교육청과학교육원",
  "teachers": [
  "유재헌"
  ]
  },
  {
  "n": null,
  "group": "수학과 진로진학",
  "school": "송간초등학교 · 충청남도교육청진로융합교육원",
  "teachers": [
  "송소림",
  "백승관"
  ]
  },
  {
  "n": null,
  "group": "수학 퀴즈 대회",
  "school": "천안아름초등학교 · 온양여자고등학교",
  "teachers": [
  "유소연",
  "윤석현"
  ]
  },
  {
  "n": null,
  "group": "창의수학 탐구대회 우수 동아리 발표",
  "school": "서산동문초등학교 · 충남과학고등학교",
  "teachers": [
  "전형옥",
  "김솔이"
  ]
  }
  ];

export default async (req) => {
  if (req.method !== "POST") return json({ error: "지원하지 않는 요청이에요." }, 405);
  const store = getStore({ name: "hanmadang-register", consistency: "strong" });
  let body;
  try { body = await req.json(); } catch { return json({ error: "요청 내용을 읽을 수 없어요." }, 400); }

  if (body.action === "submit") {
    const school = clean(body.school, 60), name = clean(body.name, 30), booth = clean(body.booth, 80);
    const sig = String(body.signature || "");
    if (!school) return json({ error: "학교 이름을 적어 주세요." }, 400);
    if (!name) return json({ error: "성명을 적어 주세요." }, 400);
    if (!sig.startsWith("data:image/png;base64,") || sig.length < 500) return json({ error: "서명을 해 주세요." }, 400);
    if (sig.length > 400000) return json({ error: "서명 그림이 너무 커요. 지우고 다시 서명해 주세요." }, 413);
    const at = new Date().toISOString();
    const key = "sign/" + Date.now() + "-" + Math.random().toString(36).slice(2, 8);
    await store.setJSON(key, { key, school, name, booth, signature: sig, at });
    return json({ ok: true, at });
  }

  if (String(body.password || "") !== password()) return json({ error: "비밀번호가 맞지 않아요." }, 401);

  if (body.action === "list") {
    const { blobs } = await store.list({ prefix: "sign/" });
    const items = (await Promise.all(blobs.map((b) => store.get(b.key, { type: "json" })))).filter(Boolean);
    items.sort((a, b) => a.at.localeCompare(b.at));
    return json({ items, roster: ROSTER });
  }
  if (body.action === "delete") {
    const key = String(body.key || "");
    if (!key.startsWith("sign/")) return json({ error: "잘못된 항목이에요." }, 400);
    await store.delete(key);
    return json({ ok: true });
  }
  return json({ error: "알 수 없는 요청이에요." }, 400);
};

export const config = { path: "/api/register" };
