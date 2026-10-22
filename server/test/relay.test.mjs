import { test, before, after } from "node:test";
import assert from "node:assert/strict";
process.env.PORT = "0"; process.env.SEAT_GRACE_SECONDS = "1"; process.env.SERVE_STATIC = "1";
const { start, stop } = await import("../relay.mjs");
import WebSocket from "ws";
let port;
before(async () => { const s = await start(0); port = s.address().port; });
after(async () => { await stop(); });
const open = () => new Promise((res, rej) => { const ws = new WebSocket(`ws://127.0.0.1:${port}/ws`); const q = []; let waiters = []; ws.on("message", d => { const m = JSON.parse(d); if(waiters.length) waiters.shift()(m); else q.push(m); }); ws.next = () => q.length ? Promise.resolve(q.shift()) : new Promise(r => waiters.push(r)); ws.on("open", () => res(ws)); ws.on("error", rej); });
const sendj = (ws, o) => ws.send(JSON.stringify(o));
async function until(ws, op, ev){ for(;;){ const m = await ws.next(); if(m.op === op && (!ev || m.ev === ev)) return m; } }

test("create, join, relay messages both ways", async () => {
  const a = await open(); await until(a, "hello");
  sendj(a, { op: "create", name: "ورقة", char: "k" });
  const c = await until(a, "created"); assert.match(c.code, /^[A-Z0-9]{5}$/);
  const b = await open(); await until(b, "hello");
  sendj(b, { op: "join", code: c.code.toLowerCase(), name: "غيمة", char: "y" });
  const j = await until(b, "joined"); assert.equal(j.slot, "B"); assert.equal(j.peer.name, "ورقة");
  const pj = await until(a, "peer"); assert.equal(pj.ev, "join"); assert.equal(pj.peer.char, "y");
  sendj(a, { op: "msg", data: { t: "hello", x: 1 } }); assert.deepEqual((await until(b, "msg")).data, { t: "hello", x: 1 });
  sendj(b, { op: "msg", data: { t: "act" } }); assert.equal((await until(a, "msg")).data.t, "act");
  a.close(); b.close();
});

test("wrong code, full room, and reconnect to the same seat", async () => {
  const x = await open(); await until(x, "hello");
  sendj(x, { op: "join", code: "ZZZZZ" }); assert.equal((await until(x, "error")).code, "not_found");
  const a = await open(); await until(a, "hello"); sendj(a, { op: "create", name: "A" }); const c = await until(a, "created");
  const b = await open(); await until(b, "hello"); sendj(b, { op: "join", code: c.code, name: "B" }); const jb = await until(b, "joined");
  sendj(x, { op: "join", code: c.code }); assert.equal((await until(x, "error")).code, "full");
  b.close(); assert.equal((await until(a, "peer", "away")).ev, "away");
  const b2 = await open(); await until(b2, "hello"); sendj(b2, { op: "join", code: c.code, token: jb.token, name: "B" });
  const r = await until(b2, "joined"); assert.equal(r.slot, "B"); assert.equal(r.rejoin, true);
  assert.equal((await until(a, "peer", "back")).ev, "back");
  a.close(); b2.close(); x.close();
});

test("seat frees after grace and the room ends when empty", async () => {
  const a = await open(); await until(a, "hello"); sendj(a, { op: "create" }); const c = await until(a, "created");
  sendj(a, { op: "leave" }); await new Promise(r => setTimeout(r, 100));
  const x = await open(); await until(x, "hello"); sendj(x, { op: "join", code: c.code }); assert.equal((await until(x, "error")).code, "expired");
  a.close(); x.close();
});

test("serves the site and a same-origin config", async () => {
  const cfg = await (await fetch(`http://127.0.0.1:${port}/site.config.js`)).text(); assert.match(cfg, /relayUrl: "\/ws"/);
  const idx = await fetch(`http://127.0.0.1:${port}/`); assert.equal(idx.status, 200);
  const hidden = await fetch(`http://127.0.0.1:${port}/server/relay.mjs`); assert.equal(hidden.status, 404);
  const env = await fetch(`http://127.0.0.1:${port}/.env.example`); assert.equal(env.status, 404);
});
