/* ============ Party: two-device play (PeerJS on the web, room inside claude.ai) ============ */
const PEER_CDN = "https://cdn.jsdelivr.net/npm/peerjs@1.5.4/dist/peerjs.min.js";
const Party = (() => {
  const me = Object.assign({name:"", char:"y"}, Store.get("me", {}));
  const P = { me, state:"off", isHost:false, code:"", peer:null, other:null, ready:{me:false, other:false}, game:null, listeners:{}, transport:"", lastErr:"" };
  const emitLocal = (t, d) => (P.listeners[t]||[]).slice().forEach(fn=>{ try{ fn(d); }catch(e){ console.error(e); } });
  P.on = (t, fn) => { (P.listeners[t] ||= []).push(fn); return () => { P.listeners[t] = (P.listeners[t]||[]).filter(f=>f!==fn); }; };
  P.connected = () => P.state==="connected";
  P.saveMe = () => Store.set("me", me);
  let conn=null, roomNs=null, retryT=null, pingT=null, lastSeen=0, peerLib=null;
  function setState(s, err){ P.state=s; if(err) P.lastErr=err; emitLocal("status", s); }
  function deliver(msg){
    lastSeen=Date.now();
    if(!msg || typeof msg!=="object") return;
    if(msg.t==="hello"){ P.other={name:String(msg.name||"صديق").slice(0,24), char:msg.char==="k"?"k":"y"}; if(!P.isHost && P.other.char===me.char){ me.char = me.char==="k"?"y":"k"; P.saveMe(); send({t:"hello", name:me.name, char:me.char}); setTimeout(()=>toast("صاحبك اختار "+CH[P.other.char].name+"، فإنتِ صرتي "+CH[me.char].name,"check"),100); } if(P.isHost && P.other.char===me.char){ P.other.char = me.char==="k"?"y":"k"; } setState("connected"); if(P.isHost){ send({t:"hello", name:me.name, char:me.char}); if(P.game) send({t:"sync", game:P.game, snap:P.snapshot?P.snapshot():null}); } }
    else if(msg.t==="ready"){ P.ready.other=!!msg.v; emitLocal("ready"); }
    else if(msg.t==="ping"){ send({t:"pong"}); }
    emitLocal(msg.t, msg);
  }
  function send(msg){ try{ if(roomNs) roomNs.emit("m", Object.assign({from:P.isHost?"A":"B"}, msg)).catch(()=>{}); else if(conn && conn.open) conn.send(msg); }catch(e){} }
  P.send = msg => send(msg);
  function loadPeer(){ if(window.Peer) return Promise.resolve(window.Peer); if(peerLib) return peerLib; peerLib = new Promise((res,rej)=>{ const s=document.createElement("script"); s.src=PEER_CDN; s.onload=()=>res(window.Peer); s.onerror=()=>{ peerLib=null; rej(new Error("lib")); }; document.head.appendChild(s); }); return peerLib; }
  async function roomApi(){ if(!window.claude || !window.claude.use) return null; try{ return await Promise.race([window.claude.use("room"), new Promise(r=>setTimeout(()=>r(null),4000))]); }catch(e){ return null; } }
  const mkCode = () => { const A="ABCDEFGHJKMNPQRSTUVWXYZ23456789"; let s=""; for(let i=0;i<5;i++) s+=A[Math.floor(Math.random()*A.length)]; return s; };
  function bindConn(c){
    conn=c; c.on("open", ()=>{ clearTimeout(retryT); if(!P.isHost) send({t:"hello", name:me.name, char:me.char}); });
    c.on("data", deliver);
    c.on("close", ()=>{ if(P.state==="off") return; setState("reconnecting"); if(!P.isHost) scheduleRetry(); });
    c.on("error", ()=>{});
  }
  function scheduleRetry(n=0){ clearTimeout(retryT); if(n>30){ setState("lost","انقطع الاتصال ولم يرجع. جرّبوا غرفة جديدة."); return; } retryT=setTimeout(()=>{ if(P.state==="connected"||P.state==="off") return; try{ bindConn(P.peer.connect("khy-"+P.code,{reliable:true})); }catch(e){} scheduleRetry(n+1); }, 2000); }
  function startPing(){ clearInterval(pingT); pingT=setInterval(()=>{ if(P.state==="connected"){ send({t:"ping"}); if(Date.now()-lastSeen>9000){ setState("reconnecting"); if(!P.isHost && !roomNs) scheduleRetry(); } } }, 3000); }
  async function viaRoom(code){
    const room = await roomApi(); if(!room) return false;
    try{ roomNs = await room.join("khy-"+code.toLowerCase()); }catch(e){ roomNs=null; return false; }
    P.transport="claude";
    roomNs.on("m", m=>{ if(!m || m.isMe) return; const msg=m.data; if(!msg || msg.from===(P.isHost?"A":"B")) return; deliver(msg); });
    if(!P.isHost) send({t:"hello", name:me.name, char:me.char}); else setState("waiting");
    return true;
  }
  P.create = async () => {
    P.leave(true); P.isHost=true; P.code=mkCode(); P.ready={me:false,other:false}; setState("opening");
    if(await viaRoom(P.code)){ startPing(); return P.code; }
    try{ const Peer = await loadPeer(); P.transport="peer";
      const open = id => new Promise((res,rej)=>{ const pr = new Peer("khy-"+id, {debug:0}); pr.on("open", ()=>res(pr)); pr.on("error", e=>rej(e)); });
      let pr; for(let i=0;i<3;i++){ try{ pr = await open(P.code); break; }catch(e){ if(e && e.type==="unavailable-id"){ P.code=mkCode(); continue; } throw e; } }
      P.peer=pr; pr.on("connection", c=>{ if(conn && conn.open && conn!==c){ c.on("open",()=>{ c.send({t:"full"}); setTimeout(()=>c.close(),300); }); return; } bindConn(c); });
      pr.on("disconnected", ()=>{ try{ pr.reconnect(); }catch(e){} });
      pr.on("error", e=>{ if(e && e.type==="network") setState("reconnecting"); });
      setState("waiting"); startPing(); return P.code;
    }catch(e){ setState("error", e && e.type==="browser-incompatible" ? "المتصفح ما يدعم الاتصال المباشر." : "ما گدرنا نفتح غرفة. تأكدوا من الإنترنت وجرّبوا مرة ثانية."); return null; }
  };
  P.join = async raw => {
    const code = String(raw||"").toUpperCase().replace(/[^A-Z0-9]/g,"").slice(0,5);
    if(code.length!==5){ setState("error","الرمز لازم يكون 5 حروف وأرقام."); return false; }
    P.leave(true); P.isHost=false; P.code=code; P.ready={me:false,other:false}; setState("joining");
    if(await viaRoom(code)){ startPing(); setTimeout(()=>{ if(P.state==="joining") setState("error","ما لگينا الغرفة. تأكدي من الرمز أو خلّي صاحبك يفتح الغرفة من جديد."); }, 12000); return true; }
    try{ const Peer = await loadPeer(); P.transport="peer";
      const pr = new Peer(undefined, {debug:0}); P.peer=pr;
      await new Promise((res,rej)=>{ pr.on("open",res); pr.on("error",rej); });
      pr.on("error", e=>{ if(e && e.type==="peer-unavailable"){ if(P.state==="joining") setState("error","ما لگينا الغرفة. يمكن الرمز غلط أو الغرفة انتهت."); } else if(e && e.type==="network") setState("reconnecting"); });
      bindConn(pr.connect("khy-"+code, {reliable:true}));
      setTimeout(()=>{ if(P.state==="joining") setState("error","الغرفة ما ردّت. تأكدي من الرمز."); }, 15000);
      startPing(); return true;
    }catch(e){ setState("error","ما گدرنا نتصل. تأكدي من الإنترنت."); return false; }
  };
  P.leave = (silent) => {
    if(P.state!=="off" && !silent) send({t:"bye"});
    clearTimeout(retryT); clearInterval(pingT);
    try{ conn && conn.close(); }catch(e){} conn=null;
    try{ roomNs && roomNs.leave(); }catch(e){} roomNs=null;
    try{ P.peer && P.peer.destroy(); }catch(e){} P.peer=null;
    P.other=null; P.game=null; P.code=""; P.ready={me:false,other:false};
    setState("off");
  };
  P.setReady = v => { P.ready.me=v; send({t:"ready", v}); emitLocal("ready"); };
  P.link = () => { const u = new URL(location.href); u.hash=""; u.search="?room="+P.code; return u.toString(); };
  P.on("bye", ()=>{ setState("reconnecting"); P.other=P.other; emitLocal("status","left"); });
  P.on("full", ()=>{ setState("error","الغرفة مليانة — بيها لاعبين."); });
  P.on("start", m=>{ if(!P.isHost){ P.game=m.game; go("play:"+m.game); } });
  P.on("sync", m=>{ if(!P.isHost && m.game){ P.game=m.game; if(current!=="play:"+m.game) go("play:"+m.game); setTimeout(()=>emitLocal("snap", m.snap), 50); } });
  P.on("exitgame", ()=>{ if(current.startsWith("play:")){ toast("صاحبك رجع للغرفة","check"); P.game=null; go("lobby"); } });
  P.on("status", s=>{ const b=$("#netBadge"); if(!b) return; b.hidden = P.state==="off"; b.dataset.s=P.state; b.textContent = {connected:"متصلين: "+(P.other?P.other.name||"صديق":""), waiting:"بانتظار صديق · "+P.code, opening:"نفتح الغرفة…", joining:"ندخل الغرفة…", reconnecting:"نعيد الاتصال…", lost:"انقطع الاتصال", error:"مشكلة بالاتصال"}[P.state]||""; });
  return P;
})();
