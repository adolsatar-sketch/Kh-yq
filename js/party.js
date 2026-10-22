/* ============ Party: اللعب من جهازين ============
   طبقة اتصال منفصلة عن منطق الألعاب. ترتيب الطرق:
   1) خادم WebSocket الخاص بالموقع (server/relay.mjs) إذا site.config.js بيه relayUrl
   2) غرف Claude إذا الموقع مفتوح داخل claude.ai
   3) PeerJS (اتصال مباشر بين الجهازين عبر خادم PeerJS العام)
   رسائل اللعبة نفسها (hello/ready/start/act/st/…) ما تتغير مهما جان الطريق. */
const PEER_CDN = "https://cdn.jsdelivr.net/npm/peerjs@1.5.4/dist/peerjs.min.js";
const Party = (() => {
  const me = Object.assign({name:"", char:"y"}, Store.get("me", {}));
  const P = { me, state:"off", isHost:false, code:"", peer:null, other:null, ready:{me:false, other:false}, game:null, listeners:{}, transport:"", lastErr:"", peerAway:false, friendAt:null };
  const emitLocal = (t, d) => (P.listeners[t]||[]).slice().forEach(fn=>{ try{ fn(d); }catch(e){ console.error(e); } });
  P.on = (t, fn) => { (P.listeners[t] ||= []).push(fn); return () => { P.listeners[t] = (P.listeners[t]||[]).filter(f=>f!==fn); }; };
  P.connected = () => P.state==="connected";
  P.saveMe = () => Store.set("me", me);
  let conn=null, roomNs=null, retryT=null, pingT=null, lastSeen=0, peerLib=null;
  let ws=null, wsToken="", wsClosing=false, wsTries=0, wsResolve=null;
  function setState(s, err){ P.state=s; if(err) P.lastErr=err; emitLocal("status", s); }
  function hello(){ return {t:"hello", name:me.name, char:me.char}; }
  function deliver(msg){
    lastSeen=Date.now();
    if(!msg || typeof msg!=="object") return;
    if(msg.t==="hello"){
      P.other={name:String(msg.name||"صديق").slice(0,24), char:msg.char==="k"?"k":"y"}; P.peerAway=false;
      if(!P.isHost && P.other.char===me.char){ me.char = me.char==="k"?"y":"k"; P.saveMe(); send(hello()); setTimeout(()=>toast("صاحبك اختار "+CH[P.other.char].name+"، فإنتِ صرتي "+CH[me.char].name,"check"),100); }
      if(P.isHost && P.other.char===me.char){ P.other.char = me.char==="k"?"y":"k"; }
      const was=P.state; setState("connected");
      if(P.isHost && !msg.re){ send(Object.assign(hello(),{re:1})); if(P.game) send({t:"sync", game:P.game, snap:P.snapshot?P.snapshot():null}); }
      if(was!=="connected") toast("صاحبك "+P.other.name+" وياكم!","friends");
    }
    else if(msg.t==="ready"){ P.ready.other=!!msg.v; emitLocal("ready"); }
    else if(msg.t==="ping"){ send({t:"pong"}); }
    else if(msg.t==="at"){ P.friendAt=msg.node; }
    emitLocal(msg.t, msg);
  }
  function send(msg){ try{ if(ws && ws.readyState===1) ws.send(JSON.stringify({op:"msg", data:msg})); else if(roomNs) roomNs.emit("m", Object.assign({from:P.isHost?"A":"B"}, msg)).catch(()=>{}); else if(conn && conn.open) conn.send(msg); }catch(e){} }
  P.send = msg => send(msg);
  const mkCode = () => { const A="ABCDEFGHJKMNPQRSTUVWXYZ23456789"; let s=""; for(let i=0;i<5;i++) s+=A[Math.floor(Math.random()*A.length)]; return s; };
  const ERR = {not_found:"ما لگينا الغرفة. تأكدوا من الرمز، أو خلّي صاحبك يفتح غرفة جديدة.", expired:"الغرفة انتهت. خلّي صاحبك يفتح غرفة جديدة.", full:"الغرفة مليانة — بيها لاعبين.", too_big:"رسالة كبيرة هواية.", net:"ما گدرنا نتصل بخادم اللعب. تأكدوا من الإنترنت."};
  const session = { get(){ try{ return JSON.parse(sessionStorage.getItem("khy_room")||"null"); }catch(e){ return null; } }, set(v){ try{ v ? sessionStorage.setItem("khy_room", JSON.stringify(v)) : sessionStorage.removeItem("khy_room"); }catch(e){} } };

  /* ---------- 1) خادم WebSocket ---------- */
  function relayURL(){
    const u = ((window.KY_CONFIG||{}).relayUrl||"").trim(); if(!u) return "";
    if(/^wss?:\/\//.test(u)) return u;
    if(!/^https?:$/.test(location.protocol)) return "";
    return (location.protocol==="https:"?"wss://":"ws://")+location.host+(u.startsWith("/")?u:"/"+u);
  }
  function relayOpen(intent){
    return new Promise(res=>{
      wsResolve=res; wsClosing=false; P.transport="relay";
      let sock; try{ sock=new WebSocket(relayURL()); }catch(e){ res(false); return; }
      ws=sock;
      sock.onopen=()=>{ wsTries=0; sock.send(JSON.stringify(Object.assign({name:me.name, char:me.char}, intent))); };
      sock.onmessage=e=>{ let m; try{ m=JSON.parse(e.data); }catch(x){ return; } onRelay(m); };
      sock.onclose=()=>{ if(ws!==sock) return; ws=null; if(wsClosing || P.state==="off") return; if(wsResolve){ const r=wsResolve; wsResolve=null; if(!P.code){ setState("error", ERR.net); r(false); return; } } relayRetry(); };
      sock.onerror=()=>{};
    });
  }
  function onRelay(m){
    const done=v=>{ if(wsResolve){ const r=wsResolve; wsResolve=null; r(v); } };
    if(m.op==="created"){ P.code=m.code; wsToken=m.token; session.set({code:P.code, token:wsToken, host:true}); setState("waiting"); done(true); }
    else if(m.op==="joined"){ P.code=m.code; wsToken=m.token; P.isHost = m.slot==="A"; session.set({code:P.code, token:wsToken, host:P.isHost});
      if(m.peer && m.peer.online){ P.peerAway=false; send(hello()); setState(P.other?"connected":"joining"); if(P.isHost && P.game) send({t:"sync", game:P.game, snap:P.snapshot?P.snapshot():null}); }
      else if(m.peer){ P.peerAway=true; setState("reconnecting", "صاحبك انقطع… ننتظره يرجع."); }
      else setState(P.isHost?"waiting":"joining");
      done(true); }
    else if(m.op==="peer"){
      if(m.ev==="away"){ P.peerAway=true; setState("reconnecting","صاحبك انقطع… ننتظره يرجع."); }
      else if(m.ev==="back"||m.ev==="join"){ P.peerAway=false; if(m.ev==="back" && P.isHost){ send(hello()); } }
      else if(m.ev==="left"){ P.other=null; P.peerAway=false; P.ready.other=false; setState("waiting"); toast("صاحبك طلع من الغرفة","friends"); emitLocal("status","left"); }
    }
    else if(m.op==="msg") deliver(m.data);
    else if(m.op==="error"){ setState("error", ERR[m.code]||ERR.net); session.set(null); P.code=""; wsClosing=true; try{ ws&&ws.close(); }catch(e){} done(false); }
    else if(m.op==="ended"){ session.set(null); wsClosing=true; setState("lost", "الغرفة انتهت."); }
  }
  function relayRetry(){
    setState("reconnecting", "انقطع الاتصال… نرجّعه.");
    clearTimeout(retryT); wsTries++;
    if(wsTries>25){ setState("lost","انقطع الاتصال ولم يرجع. جرّبوا غرفة جديدة."); return; }
    retryT=setTimeout(()=>{ if(P.state==="off") return; relayOpen({op:"join", code:P.code, token:wsToken}); }, Math.min(8000, 600*wsTries));
  }

  /* ---------- 2) غرف Claude و 3) PeerJS ---------- */
  function loadPeer(){ if(window.Peer) return Promise.resolve(window.Peer); if(peerLib) return peerLib; peerLib = new Promise((res,rej)=>{ const s=document.createElement("script"); s.src=PEER_CDN; s.onload=()=>res(window.Peer); s.onerror=()=>{ peerLib=null; rej(new Error("lib")); }; document.head.appendChild(s); }); return peerLib; }
  async function roomApi(){ if(!window.claude || !window.claude.use) return null; try{ return await Promise.race([window.claude.use("room"), new Promise(r=>setTimeout(()=>r(null),4000))]); }catch(e){ return null; } }
  function bindConn(c){
    conn=c; c.on("open", ()=>{ clearTimeout(retryT); if(!P.isHost) send(hello()); });
    c.on("data", deliver);
    c.on("close", ()=>{ if(P.state==="off") return; setState("reconnecting","انقطع الاتصال… نرجّعه."); if(!P.isHost) scheduleRetry(); });
    c.on("error", ()=>{});
  }
  function scheduleRetry(n=0){ clearTimeout(retryT); if(n>30){ setState("lost","انقطع الاتصال ولم يرجع. جرّبوا غرفة جديدة."); return; } retryT=setTimeout(()=>{ if(P.state==="connected"||P.state==="off") return; try{ bindConn(P.peer.connect("khy-"+P.code,{reliable:true})); }catch(e){} scheduleRetry(n+1); }, 2000); }
  function startPing(){ clearInterval(pingT); pingT=setInterval(()=>{ if(P.state==="connected" && P.transport!=="relay"){ send({t:"ping"}); if(Date.now()-lastSeen>9000){ setState("reconnecting","انقطع الاتصال… نرجّعه."); if(!P.isHost && !roomNs) scheduleRetry(); } } }, 3000); }
  async function viaRoom(code){
    const room = await roomApi(); if(!room) return false;
    try{ roomNs = await room.join("khy-"+code.toLowerCase()); }catch(e){ roomNs=null; return false; }
    P.transport="claude";
    roomNs.on("m", m=>{ if(!m || m.isMe) return; const msg=m.data; if(!msg || msg.from===(P.isHost?"A":"B")) return; deliver(msg); });
    if(!P.isHost) send(hello()); else setState("waiting");
    return true;
  }

  P.create = async () => {
    P.leave(true); P.isHost=true; P.code=""; P.ready={me:false,other:false}; setState("opening");
    if(relayURL()){ const ok=await relayOpen({op:"create"}); if(ok) return P.code; if(P.state==="error") return null; }
    P.code=mkCode();
    if(await viaRoom(P.code)){ startPing(); return P.code; }
    try{ const Peer = await loadPeer(); P.transport="peer";
      const open = id => new Promise((res,rej)=>{ const pr = new Peer("khy-"+id, {debug:0}); pr.on("open", ()=>res(pr)); pr.on("error", e=>rej(e)); });
      let pr; for(let i=0;i<3;i++){ try{ pr = await open(P.code); break; }catch(e){ if(e && e.type==="unavailable-id"){ P.code=mkCode(); continue; } throw e; } }
      P.peer=pr; pr.on("connection", c=>{ if(conn && conn.open && conn!==c){ c.on("open",()=>{ c.send({t:"full"}); setTimeout(()=>c.close(),300); }); return; } bindConn(c); });
      pr.on("disconnected", ()=>{ try{ pr.reconnect(); }catch(e){} });
      pr.on("error", e=>{ if(e && e.type==="network") setState("reconnecting","انقطع الاتصال… نرجّعه."); });
      setState("waiting"); startPing(); return P.code;
    }catch(e){ setState("error", e && e.type==="browser-incompatible" ? "المتصفح ما يدعم الاتصال المباشر." : "ما گدرنا نفتح غرفة. تأكدوا من الإنترنت وجرّبوا مرة ثانية."); return null; }
  };
  P.join = async raw => {
    const code = String(raw||"").toUpperCase().replace(/[^A-Z0-9]/g,"").slice(0,5);
    if(code.length!==5){ setState("error","الرمز لازم يكون 5 حروف وأرقام."); return false; }
    P.leave(true); P.isHost=false; P.code=code; P.ready={me:false,other:false}; setState("joining");
    if(relayURL()){ P.code=""; const ok=await relayOpen({op:"join", code}); return ok; }
    if(await viaRoom(code)){ startPing(); setTimeout(()=>{ if(P.state==="joining") setState("error","ما لگينا الغرفة. تأكدوا من الرمز أو خلّي صاحبك يفتح الغرفة من جديد."); }, 12000); return true; }
    try{ const Peer = await loadPeer(); P.transport="peer";
      const pr = new Peer(undefined, {debug:0}); P.peer=pr;
      await new Promise((res,rej)=>{ pr.on("open",res); pr.on("error",rej); });
      pr.on("error", e=>{ if(e && e.type==="peer-unavailable"){ if(P.state==="joining") setState("error","ما لگينا الغرفة. يمكن الرمز غلط أو الغرفة انتهت."); } else if(e && e.type==="network") setState("reconnecting","انقطع الاتصال… نرجّعه."); });
      bindConn(pr.connect("khy-"+code, {reliable:true}));
      setTimeout(()=>{ if(P.state==="joining") setState("error","الغرفة ما ردّت. تأكدوا من الرمز."); }, 15000);
      startPing(); return true;
    }catch(e){ setState("error","ما گدرنا نتصل. تأكدوا من الإنترنت."); return false; }
  };
  // بعد إعادة تحميل الصفحة: نرجع لنفس المقعد بالغرفة
  P.resume = async () => { const s=session.get(); if(!s || !relayURL() || P.state!=="off") return false; P.isHost=!!s.host; P.code=s.code; wsToken=s.token; setState("joining"); return relayOpen({op:"join", code:s.code, token:s.token}); };
  P.leave = (silent) => {
    if(P.state!=="off" && !silent) send({t:"bye"});
    clearTimeout(retryT); clearInterval(pingT);
    if(ws){ wsClosing=true; try{ ws.send(JSON.stringify({op:"leave"})); }catch(e){} try{ ws.close(); }catch(e){} ws=null; }
    if(!silent) session.set(null);
    try{ conn && conn.close(); }catch(e){} conn=null;
    try{ roomNs && roomNs.leave(); }catch(e){} roomNs=null;
    try{ P.peer && P.peer.destroy(); }catch(e){} P.peer=null;
    P.other=null; P.game=null; P.code=""; P.ready={me:false,other:false}; P.peerAway=false; P.friendAt=null; wsToken="";
    setState("off");
  };
  P.setReady = v => { P.ready.me=v; send({t:"ready", v}); emitLocal("ready"); };
  P.link = () => { const u = new URL(location.href); u.hash=""; u.search="?room="+P.code; return u.toString(); };
  P.on("bye", ()=>{ P.peerAway=true; setState("reconnecting","صاحبك طلع… ممكن يرجع بنفس الرمز."); emitLocal("status","left"); });
  P.on("full", ()=>{ setState("error","الغرفة مليانة — بيها لاعبين."); });
  const routeFor = g => (g==="draw"||g==="show"||String(g).startsWith("tale:")) ? g : "play:"+g;
  P.on("start", m=>{ if(!P.isHost){ P.game=m.game; go(routeFor(m.game)); } });
  P.on("sync", m=>{ if(!P.isHost && m.game){ P.game=m.game; const r=routeFor(m.game); if(current!==r) go(r); setTimeout(()=>emitLocal("snap", m.snap), 50); } });
  P.on("exitgame", ()=>{ if(current.startsWith("play:")||current.startsWith("tale:")){ toast("صاحبك رجع للغرفة","check"); P.game=null; go("lobby"); } });
  P.on("status", ()=>{ const b=$("#netBadge"); if(!b) return; b.hidden = P.state==="off"; b.dataset.s=P.state; b.textContent = {connected:"متصلين: "+(P.other?P.other.name||"صديق":""), waiting:"بانتظار صديق · "+P.code, opening:"نفتح الغرفة…", joining:"ندخل الغرفة…", reconnecting:P.peerAway?"صاحبك انقطع…":"نعيد الاتصال…", lost:"انقطع الاتصال", error:"مشكلة بالاتصال"}[P.state]||""; b.onclick=()=>go("lobby"); });
  return P;
})();
