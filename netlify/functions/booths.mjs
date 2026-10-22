// 부스 학습지 저장 API  (주소: /api/booths)
// - GET  : 선생님이 수정·추가·삭제한 부스 목록을 돌려줍니다.
// - POST : 비밀번호가 맞으면 저장(save) / 삭제(delete) / 원래대로(reset) 합니다.
// 비밀번호는 넷리파이 환경 변수 ADMIN_PASSWORD로 바꿀 수 있어요. (없으면 2026)
import { getStore } from "@netlify/blobs";

const password = () => (globalThis.Netlify?.env?.get("ADMIN_PASSWORD")) || "2026";
const json = (data, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" },
  });

export default async (req) => {
  const store = getStore({ name: "hanmadang-2026", consistency: "strong" });

  if (req.method === "GET") {
    const { blobs } = await store.list({ prefix: "booth/" });
    const items = await Promise.all(blobs.map((b) => store.get(b.key, { type: "json" })));
    return json({ items: items.filter(Boolean) });
  }
  if (req.method !== "POST") return json({ error: "지원하지 않는 요청이에요." }, 405);

  let body;
  try { body = await req.json(); } catch { return json({ error: "요청 내용을 읽을 수 없어요." }, 400); }
  if (String(body.password || "") !== password()) return json({ error: "비밀번호가 맞지 않아요." }, 401);
  if (body.action === "check") return json({ ok: true });

  const id = String(body.id || "").replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 40);
  if (!id) return json({ error: "부스 이름(id)이 없어요." }, 400);
  const key = "booth/" + id;
  const now = new Date().toISOString();

  if (body.action === "save") {
    const booth = body.booth;
    if (!booth || typeof booth !== "object" || !String(booth.title || "").trim())
      return json({ error: "부스 제목을 입력해 주세요." }, 400);
    if (JSON.stringify(booth).length > 300000) return json({ error: "내용이 너무 길어요." }, 413);
    const saved = { ...booth, id, updatedAt: now };
    delete saved.deleted;
    await store.setJSON(key, saved);
    return json({ ok: true, booth: saved });
  }
  if (body.action === "delete") {
    await store.setJSON(key, { id, deleted: true, updatedAt: now });
    return json({ ok: true });
  }
  if (body.action === "reset") {
    await store.delete(key);
    return json({ ok: true });
  }
  return json({ error: "알 수 없는 요청이에요." }, 400);
};

export const config = { path: "/api/booths" };
