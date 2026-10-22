/* =====================================================================
   خادم اللعب عن بعد — مغامرات خباب ويقين
   - غرف بلاعبين اثنين برمز قصير (5 حروف/أرقام) ورابط دعوة.
   - الخادم ما يفهم منطق الألعاب؛ بس يمرّر الرسائل بين المقعدين A و B (طبقة اتصال منفصلة).
   - انقطاع لاعب: مقعده يبقى محجوز فترة سماح، ويرجع له بنفس «التذكرة» (token) بدون حساب.
   - الغرف تنتهي إذا ظلت فارغة أو مر عليها وقت طويل؛ والرمز الغلط أو المنتهي يرجع خطأ واضح.
   - يخدم ملفات الموقع نفسه (اختياري) ويرجع site.config.js يدل على نفس الخادم.
   الإعداد: انظر ../.env.example
   ===================================================================== */
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";
import { WebSocketServer } from "ws";

const __dir = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dir, "..");
loadEnv(path.join(ROOT, ".env"));
loadEnv(path.join(__dir, ".env"));

const CFG = {
  port: +(process.env.PORT || 8787),
  host: process.env.HOST || "0.0.0.0",
  origins: (process.env.ALLOWED_ORIGINS || "").split(",").map(s => s.trim()).filter(Boolean),
  roomTtlMs: +(process.env.ROOM_TTL_HOURS || 6) * 3600e3,
  idleMs: +(process.env.ROOM_IDLE_MINUTES || 30) * 60e3,
  graceMs: +(process.env.SEAT_GRACE_SECONDS || 120) * 1e3,
  serveStatic: (process.env.SERVE_STATIC || "1") !== "0",
  maxMsgBytes: 64 * 1024,
  maxMsgsPerSec: 80
};

function loadEnv(file){
  try{
    for(const line of fs.readFileSync(file, "utf8").split(/\r?\n/)){
      const m = /^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/.exec(line); if(!m || line.trim().startsWith("#")) continue;
      if(process.env[m[1]] === undefined) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
    }
  }catch(e){ /* ملف .env اختياري */ }
}

/* ---------- الغرف ---------- */
const ALPHA = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
const rooms = new Map();           // code -> room
const ended = new Map();           // code -> endedAt (حتى نگول «الغرفة انتهت» بدل «ما موجودة»)
const mkCode = () => { let c; do { c = Array.from(crypto.randomBytes(5), b => ALPHA[b % ALPHA.length]).join(""); } while(rooms.has(c) || ended.has(c)); return c; };
const mkToken = () => crypto.randomBytes(16).toString("hex");
const cleanName = n => String(n || "").replace(/[<>]/g, "").trim().slice(0, 24) || "صديق";
const cleanChar = c => c === "k" ? "k" : "y";

function newRoom(){
  const code = mkCode();
  const room = { code, created: Date.now(), lastActive: Date.now(), seats: { A: null, B: null } };
  rooms.set(code, room);
  return room;
}
function endRoom(room, reason){
  for(const s of ["A","B"]){ const seat = room.seats[s]; if(seat && seat.ws){ send(seat.ws, { op: "ended", reason }); try{ seat.ws.close(4000, reason); }catch(e){} } if(seat) clearTimeout(seat.graceT); }
  rooms.delete(room.code); ended.set(room.code, Date.now());
}
const other = s => s === "A" ? "B" : "A";
function send(ws, obj){ if(ws && ws.readyState === 1){ try{ ws.send(JSON.stringify(obj)); }catch(e){} } }
function peerInfo(seat){ return seat ? { name: seat.name, char: seat.char, online: !!seat.ws } : null; }

function seatUp(room, slot, ws, {name, char, token}){
  const prev = room.seats[slot];
  if(prev){ clearTimeout(prev.graceT); if(prev.ws && prev.ws !== ws){ try{ prev.ws.close(4001, "replaced"); }catch(e){} } }
  const seat = { ws, name: cleanName(name), char: cleanChar(char), token: token || mkToken(), graceT: null };
  room.seats[slot] = seat; room.lastActive = Date.now();
  ws.khy = { code: room.code, slot };
  return { seat, rejoin: !!prev };
}

function onMessage(ws, raw){
  if(raw.length > CFG.maxMsgBytes){ send(ws, { op: "error", code: "too_big" }); return; }
  // تحديد معدل بسيط حتى ما ينضغط الخادم
  const now = Date.now(); ws.rate = ws.rate && now - ws.rate.t < 1000 ? { t: ws.rate.t, n: ws.rate.n + 1 } : { t: now, n: 1 };
  if(ws.rate.n > CFG.maxMsgsPerSec) return;
  let m; try{ m = JSON.parse(raw); }catch(e){ return; }
  if(!m || typeof m !== "object") return;

  if(m.op === "create"){
    const room = newRoom();
    const { seat } = seatUp(room, "A", ws, m);
    send(ws, { op: "created", code: room.code, slot: "A", token: seat.token, ttl: CFG.roomTtlMs });
    return;
  }
  if(m.op === "join"){
    const code = String(m.code || "").toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 5);
    const room = rooms.get(code);
    if(!room){ send(ws, { op: "error", code: ended.has(code) ? "expired" : "not_found" }); return; }
    // رجوع لنفس المقعد بالتذكرة
    let slot = ["A","B"].find(s => room.seats[s] && m.token && room.seats[s].token === m.token);
    if(!slot){
      if(!room.seats.B) slot = "B";
      else if(!room.seats.A) slot = "A";
      else { send(ws, { op: "error", code: "full" }); return; }
    }
    const { seat, rejoin } = seatUp(room, slot, ws, { name: m.name, char: m.char, token: room.seats[slot] && room.seats[slot].token });
    send(ws, { op: "joined", code, slot, token: seat.token, rejoin, peer: peerInfo(room.seats[other(slot)]) });
    const o = room.seats[other(slot)];
    if(o && o.ws) send(o.ws, { op: "peer", ev: rejoin ? "back" : "join", peer: peerInfo(seat) });
    return;
  }
  const k = ws.khy; if(!k) return;
  const room = rooms.get(k.code); if(!room){ send(ws, { op: "ended", reason: "expired" }); return; }
  room.lastActive = now;
  if(m.op === "msg"){
    const o = room.seats[other(k.slot)];
    if(o && o.ws) send(o.ws, { op: "msg", data: m.data });
    return;
  }
  if(m.op === "leave"){
    const o = room.seats[other(k.slot)];
    room.seats[k.slot] = null; ws.khy = null;
    if(o && o.ws) send(o.ws, { op: "peer", ev: "left" });
    if(!room.seats.A && !room.seats.B) endRoom(room, "empty");
    return;
  }
  if(m.op === "ping"){ send(ws, { op: "pong", t: m.t }); }
}

function onClose(ws){
  const k = ws.khy; if(!k) return;
  const room = rooms.get(k.code); if(!room) return;
  const seat = room.seats[k.slot]; if(!seat || seat.ws !== ws) return;
  seat.ws = null;
  const o = room.seats[other(k.slot)];
  if(o && o.ws) send(o.ws, { op: "peer", ev: "away" });
  // نحجز المقعد فترة حتى يرجع نفس اللاعب
  seat.graceT = setTimeout(() => {
    if(room.seats[k.slot] !== seat || seat.ws) return;
    room.seats[k.slot] = null;
    const o2 = room.seats[other(k.slot)];
    if(o2 && o2.ws) send(o2.ws, { op: "peer", ev: "left" });
    if(!room.seats.A && !room.seats.B) endRoom(room, "empty");
  }, CFG.graceMs);
}

/* ---------- HTTP: صحة الخادم + ملفات الموقع ---------- */
const MIME = { ".html":"text/html; charset=utf-8", ".js":"text/javascript; charset=utf-8", ".mjs":"text/javascript; charset=utf-8", ".css":"text/css; charset=utf-8", ".png":"image/png", ".webp":"image/webp", ".jpg":"image/jpeg", ".jpeg":"image/jpeg", ".svg":"image/svg+xml", ".json":"application/json", ".ico":"image/x-icon", ".md":"text/plain; charset=utf-8", ".txt":"text/plain; charset=utf-8" };
const BLOCK = /(^|\/)(\.|node_modules|server|tests?)(\/|$)|\.env/;
const server = http.createServer((req, res) => {
  const url = new URL(req.url, "http://x");
  if(url.pathname === "/health"){ res.writeHead(200, { "content-type": "application/json" }); res.end(JSON.stringify({ ok: true, rooms: rooms.size })); return; }
  if(!CFG.serveStatic){ res.writeHead(404); res.end(); return; }
  if(url.pathname === "/site.config.js"){ res.writeHead(200, { "content-type": MIME[".js"], "cache-control": "no-store" }); res.end(`window.KY_CONFIG = { relayUrl: "/ws" };\n`); return; }
  let p = decodeURIComponent(url.pathname); if(p.endsWith("/")) p += "index.html";
  const rel = path.normalize(p).replace(/^([/\\])+/, "");
  if(BLOCK.test(rel.replace(/\\/g, "/"))){ res.writeHead(404); res.end(); return; }
  const file = path.join(ROOT, rel);
  if(!file.startsWith(ROOT)){ res.writeHead(403); res.end(); return; }
  fs.stat(file, (err, st) => {
    if(err || !st.isFile()){ res.writeHead(404, { "content-type": "text/plain; charset=utf-8" }); res.end("مو موجود"); return; }
    res.writeHead(200, { "content-type": MIME[path.extname(file).toLowerCase()] || "application/octet-stream", "content-length": st.size, "cache-control": /\.(png|webp|jpe?g)$/i.test(file) ? "public, max-age=86400" : "no-cache" });
    fs.createReadStream(file).pipe(res);
  });
});

const wss = new WebSocketServer({ noServer: true, maxPayload: CFG.maxMsgBytes });
server.on("upgrade", (req, socket, head) => {
  const url = new URL(req.url, "http://x");
  if(url.pathname !== "/ws"){ socket.destroy(); return; }
  if(CFG.origins.length && !CFG.origins.includes(req.headers.origin)){ socket.write("HTTP/1.1 403 Forbidden\r\n\r\n"); socket.destroy(); return; }
  wss.handleUpgrade(req, socket, head, ws => wss.emit("connection", ws, req));
});
wss.on("connection", ws => {
  ws.isAlive = true;
  ws.on("pong", () => { ws.isAlive = true; });
  ws.on("message", (data) => onMessage(ws, data.toString()));
  ws.on("close", () => onClose(ws));
  ws.on("error", () => {});
  send(ws, { op: "hello", v: 1 });
});

// نبض لكشف الاتصالات الميتة + تنظيف الغرف القديمة
const beat = setInterval(() => {
  wss.clients.forEach(ws => { if(!ws.isAlive){ try{ ws.terminate(); }catch(e){} return; } ws.isAlive = false; try{ ws.ping(); }catch(e){} });
  const now = Date.now();
  for(const room of rooms.values()){
    const anyone = room.seats.A?.ws || room.seats.B?.ws;
    if(now - room.created > CFG.roomTtlMs || (!anyone && now - room.lastActive > CFG.idleMs)) endRoom(room, "expired");
  }
  for(const [c, t] of ended) if(now - t > 24 * 3600e3) ended.delete(c);
}, 20000);
wss.on("close", () => clearInterval(beat));

export function start(port = CFG.port){
  return new Promise(resolve => server.listen(port, CFG.host, () => resolve(server)));
}
export function stop(){ clearInterval(beat); wss.clients.forEach(ws => ws.terminate()); return new Promise(r => server.close(r)); }
export const _rooms = rooms;

if(process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)){
  start().then(() => console.log(`khy relay: http://localhost:${CFG.port}  (ws: /ws, static: ${CFG.serveStatic ? "on" : "off"})`));
}
