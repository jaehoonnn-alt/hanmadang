/* 부스 데이터 불러오기·저장 (index.html, qr.html 공용)
   - booths.js 의 기본 내용 위에, 선생님이 화면에서 고친 내용(서버 저장)을 덮어씁니다.
   - 서버(/api/booths)에 연결되지 않으면 '미리보기 모드'로 이 기기에만 저장합니다. */
const HM = (() => {
  const KEY = "hm2026";
  const API = "/api/booths";
  const local = {
    get(k, d) { try { const v = localStorage.getItem(KEY + ":" + k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem(KEY + ":" + k, JSON.stringify(v)); } catch (e) {} },
  };
  const ses = {
    get(k) { try { return sessionStorage.getItem(KEY + ":" + k); } catch (e) { return null; } },
    set(k, v) { try { v == null ? sessionStorage.removeItem(KEY + ":" + k) : sessionStorage.setItem(KEY + ":" + k, v); } catch (e) {} },
  };
  const clone = (o) => JSON.parse(JSON.stringify(o));
  const DEFAULT = clone(BOOTHS);
  let mode = "loading";               // "server" | "local"
  let remote = local.get("remoteCache", []);

  function merged() {
    const map = new Map(DEFAULT.map((b) => [b.id, clone(b)]));
    const src = mode === "local" ? local.get("localEdits", []) : remote;
    for (const r of src) {
      if (r.deleted) map.delete(r.id);
      else map.set(r.id, { ...clone(r), edited: true, isNew: !DEFAULT.some((d) => d.id === r.id) });
    }
    return [...map.values()].filter((b) => !b.hidden).sort((a, b) => (a.n || 999) - (b.n || 999));
  }

  async function load() {
    try {
      const res = await fetch(API, { cache: "no-store" });
      const type = res.headers.get("content-type") || "";
      if (!res.ok || !type.includes("json")) throw new Error("no api");
      const data = await res.json();
      remote = data.items || [];
      local.set("remoteCache", remote);
      mode = "server";
    } catch (e) {
      mode = "local";
    }
    return merged();
  }

  async function post(payload) {
    if (mode === "local") {
      if (payload.password !== "2026") throw new Error("비밀번호가 맞지 않아요.");
      if (payload.action === "check") return { ok: true };
      let edits = local.get("localEdits", []).filter((r) => r.id !== payload.id);
      if (payload.action === "save") edits.push({ ...payload.booth, id: payload.id, updatedAt: new Date().toISOString() });
      if (payload.action === "delete") edits.push({ id: payload.id, deleted: true });
      local.set("localEdits", edits);
      return { ok: true };
    }
    const res = await fetch(API, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(payload) });
    let data = {};
    try { data = await res.json(); } catch (e) {}
    if (!res.ok) throw new Error(data.error || "저장하지 못했어요. 인터넷 연결을 확인하고 다시 눌러 주세요.");
    await load();
    return data;
  }

  return {
    local, ses, clone, merged, load, post,
    get mode() { return mode; },
    isDefault: (id) => DEFAULT.some((d) => d.id === id),
  };
})();
