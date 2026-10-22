/* ============ duo game kit ============ */
const KG = {}; // registry of castle duo games
function viewPlay(root, id){
  const def = KG[id]; if(!def){ go("world"); return; }
  // بعد إعادة تحميل الصفحة الغرفة ترجع بنفس اللعبة حتى قبل ما يكمل الاتصال
  const net = Party.game===id && ["connected","reconnecting","joining"].includes(Party.state);
  const isHost = !net || Party.isHost;
  const role = net ? (Party.me.char==="k"?"A":"B") : "both";
  const charOf = r => r==="A"?"k":"y";
  let S = null, raf=0, last=0, lastSend=0, lastSnap=0, ended=false, paused=false, started=false;
  const v = h(`<section class="view play play-${id}"><div class="play-bg"><div class="play-cam"></div><div class="play-tint" style="${def.bg||""}"></div></div>${leafLayer(6,"soft")}
    <div class="play-wrap">
      <header class="play-head panel"><div class="ph-title">${def.icon?`<span class="ph-ic">${def.icon()}</span>`:""}<div><h2>${esc(def.title)}</h2><p>${esc(def.tag||"")}</p></div></div>
        <div class="ph-side"><span class="chip" data-stat></span><span class="chip net-chip" data-net>${net?"لعب مع "+esc(Party.other?Party.other.name||"صديق":"صديق"):"على نفس الجهاز"}</span></div></header>
      <div class="roles">${["A","B"].map(r=>`<div class="role ${role===r||role==="both"?"mine":""}" data-role="${r}">${faceHTML(charOf(r),0,44)}<div><b>${CH[charOf(r)].name}${net&&role===r?" (إنتِ)":""}</b><small>${esc(def.roles[r])}</small></div></div>`).join("")}</div>
      <div class="play-stage" data-stage></div>
      ${net?`<div class="chat panel"><div class="chat-log" data-log aria-live="polite"></div><div class="chat-row">${["هنا!","وگفي على الزر","لحظة","يلا","شنو تشوفين؟","عاشت إيدك"].map(q=>`<button class="chip" data-q="${q}">${q}</button>`).join("")}<input data-chat maxlength="80" placeholder="اكتبي رسالة…" aria-label="رسالة"><button class="btn small" data-send>إرسال</button></div></div>`:""}<div class="play-bar"><button class="btn ghost small" data-help>${IC.bulb} تعليمات</button>${isHost?`<button class="btn ghost small" data-pause>${IC.pause} توقف</button><button class="btn ghost small" data-restart>${IC.restart} إعادة</button>`:""}<button class="btn ghost small" data-exit>خروج</button></div>
    </div>
    <div class="stage-ov play-ov" data-ov><div class="panel"><h3>${esc(def.title)}</h3><p>${esc(def.how)}</p>${net?"":`<p class="d-note">بنفس الجهاز تتحكمين بالدورين. للعب من جهازين افتحي «العب مع صديق» من الساحة.</p>`}${isHost?'<button class="btn honey" data-go>ابدئي</button>':'<p><b>صاحبك يبدي اللعبة…</b></p>'}</div></div>
  </section>`);
  root.appendChild(v);
  const stage=$("[data-stage]",v), ov=$("[data-ov]",v);
  const camOff = GAME_CAM[id] ? paintCam($(".play-cam",v), ...GAME_CAM[id]) : null;
  const ctx = {
    id, net, role, isHost, solo:!net, stage, root:v, charOf,
    mine: r => role==="both" || role===r,
    stat: html => { $("[data-stat]",v).innerHTML=html; },
    act: a => { if(ended && a.k!=="again") return; if(isHost){ apply(a, role==="both" ? (a.by||"A") : role); } else Party.send({t:"act", a}); },
    say: (who, text) => { const r=["A","B"].find(x=>charOf(x)===who)||"A"; const el=$(`[data-role="${r}"]`,v); $$(".say",v).forEach(x=>x.remove()); const b=h(`<span class="say">${esc(text)}</span>`); el.appendChild(b); setTimeout(()=>b.remove(),3200); },
    sfx: k => (Sound[k]||Sound.soft)(),
    state: () => S
  };
  function broadcast(force){ if(!net || !isHost) return; const now=performance.now(); if(!force && now-lastSend<90) return; lastSend=now; Party.send({t:"st", s:S}); if(force || now-lastSnap>1000){ lastSnap=now; try{ sessionStorage.setItem("khy_snap_"+id, JSON.stringify({S, ended})); }catch(e){} } }
  function apply(a, by){ const n = def.act(S, a, by, ctx); if(n) S=n; broadcast(true); render(); checkEnd(); }
  function render(){ if(S) def.render(S, ctx); $("[data-stat]",v).innerHTML = def.status? def.status(S, ctx) : ""; }
  function checkEnd(){ if(!S || ended) return; const r = def.result && def.result(S); if(r){ ended=true; finish(r); } }
  function finish(r){
    try{ sessionStorage.removeItem("khy_snap_"+id); }catch(e){}
    cancelAnimationFrame(raf); broadcast(true);
    const first = !progress.wins["kg_"+id]; progress.wins["kg_"+id]=(progress.wins["kg_"+id]||0)+1; saveProgress();
    const n = 2 + (first?1:0) + ((r.rating||1)>=3?1:0);
    Sound.win(); confetti();
    setTimeout(()=>{
      const md = modal(`<div class="win-head">${rateStars(r.rating||1)}</div><div class="tour-body"><div class="win-kids">${faceHTML("k",1,66)}${faceHTML("y",1,66)}</div><div><h2>${esc(r.title||"عاشت إيدكم!")}</h2><p style="margin:0">${esc(r.text||"")}</p><p style="margin:4px 0 0">${IC.star.replace("<svg","<svg width='20' height='20' style='vertical-align:-4px'")} +${n} نجوم — تفتح ملابس وأجنحة بقصر الأزياء</p></div></div>
        <div class="row">${isHost?`<button class="btn honey" data-again>${IC.restart} جولة ثانية</button>`:""}<button class="btn ghost" data-out>رجوع</button></div>`);
      const a=$("[data-again]",md.el); if(a) a.onclick=()=>{ md.close(); restart(); };
      $("[data-out]",md.el).onclick=()=>{ md.close(); exit(); };
    }, 500);
    addStars(n);
  }
  function loop(now){ raf=requestAnimationFrame(loop); const dt=Math.min(.05,(now-last)/1000); last=now; if(paused || !S) return;
    if(isHost && def.tick){ const n=def.tick(S, dt, ctx); if(n) S=n; broadcast(false); checkEnd(); }
    if(def.frame) def.frame(S, ctx, dt); }
  function start(seed){ S = def.init(seed||Math.floor(Math.random()*1e9), ctx); ended=false; paused=false; started=true; ov.hidden=true; if(def.mount) def.mount(ctx); render(); broadcast(true); last=performance.now(); cancelAnimationFrame(raf); if(def.tick||def.frame) raf=requestAnimationFrame(loop); }
  function restart(){ if(!isHost) return; if(def.unmount) def.unmount(ctx); stage.innerHTML=""; start(); if(net) Party.send({t:"restart"}); }
  function exit(){ if(net){ Party.send({t:"exitgame"}); Party.game=null; go("lobby"); } else go("world"); }
  $("[data-help]",v).onclick=()=>modal(`<h3>${esc(def.title)}</h3><p>${esc(def.how)}</p><p><b>${CH[charOf("A")].name}:</b> ${esc(def.roles.A)}<br><b>${CH[charOf("B")].name}:</b> ${esc(def.roles.B)}</p>${def.keys?`<p class="d-note">${esc(def.keys)}</p>`:""}`);
  const pb=$("[data-pause]",v); if(pb) pb.onclick=()=>{ if(!started) return; paused=!paused; S.paused=paused; broadcast(true); pb.innerHTML = paused?`${IC.check} كمّلي`:`${IC.pause} توقف`; toast(paused?"وقفنا شوي":"نكمل","pause"); last=performance.now(); };
  const rb=$("[data-restart]",v); if(rb) rb.onclick=restart;
  $("[data-exit]",v).onclick=exit;
  const gob=$("[data-go]",v); if(gob) gob.onclick=()=>start();
  const offs=[];
  if(net){
    const log=$("[data-log]",v); const addMsg=(who,txt)=>{ const p=h(`<p><b>${esc(who)}:</b> ${esc(txt)}</p>`); log.appendChild(p); while(log.children.length>6) log.firstChild.remove(); log.scrollTop=log.scrollHeight; };
    const sendChat=txt=>{ txt=String(txt||"").trim().slice(0,80); if(!txt) return; Party.send({t:"chat", m:txt}); addMsg("إنتِ",txt); };
    $$("[data-q]",v).forEach(b=>b.onclick=()=>sendChat(b.dataset.q));
    $("[data-send]",v).onclick=()=>{ const i=$("[data-chat]",v); sendChat(i.value); i.value=""; };
    $("[data-chat]",v).onkeydown=e=>{ if(e.key==="Enter"){ sendChat(e.target.value); e.target.value=""; } };
    offs.push(Party.on("chat", m=>{ addMsg(Party.other?Party.other.name:"صديق", String(m.m||"").slice(0,80)); Sound.soft(); }));
    offs.push(Party.on("act", m=>{ if(isHost && S) apply(m.a, role==="A"?"B":"A"); }));
    offs.push(Party.on("st", m=>{ if(!isHost && m.s){ const fresh=!S; S=m.s; if(fresh){ ov.hidden=true; started=true; if(def.mount) def.mount(ctx); last=performance.now(); cancelAnimationFrame(raf); if(def.frame) raf=requestAnimationFrame(loop); } paused=!!S.paused; render(); if(def.result && def.result(S) && !ended){ ended=true; finish(def.result(S)); } } }));
    offs.push(Party.on("restart", ()=>{ if(!isHost){ ended=false; if(def.unmount) def.unmount(ctx); stage.innerHTML=""; S=null; $$(".scrim").forEach(x=>x.remove()); } }));
    offs.push(Party.on("snap", sn=>{ if(sn && sn.S && !isHost){ S=sn.S; ov.hidden=true; if(def.mount && !stage.childElementCount) def.mount(ctx); render(); } }));
    Party.snapshot = () => ({S});
    // انقطاع صاحبك: نوقف الجولة مؤقتاً ونعرض حالة إعادة الاتصال، وترجع من نفس النقطة
    const banner=h(`<div class="net-wait panel" hidden role="status"><b>${IC.friends} صاحبك انقطع…</b><span>ننتظره يرجع. الجولة محفوظة وتكمل من نفس النقطة.</span></div>`); v.appendChild(banner);
    let autoPaused=false;
    offs.push(Party.on("status", st=>{ const away = Party.state==="reconnecting"; banner.hidden=!away;
      if(isHost && away && !paused && started){ paused=true; autoPaused=true; if(S){ S.paused=true; } }
      if(isHost && Party.state==="connected" && autoPaused){ paused=false; autoPaused=false; if(S){ S.paused=false; broadcast(true); } last=performance.now(); }
      if(Party.state==="off"||Party.state==="lost"){ banner.hidden=false; $("span",banner).textContent="انقطع الاتصال. ارجعوا لغرفة اللعب وافتحوا غرفة جديدة."; } }));
  }
  // صاحب الغرفة رجع بعد إعادة تحميل: نكمل نفس الجولة من آخر لقطة محفوظة
  if(net && isHost){ let snap=null; try{ snap=JSON.parse(sessionStorage.getItem("khy_snap_"+id)||"null"); }catch(e){} if(snap && snap.S && !snap.ended){ S=snap.S; started=true; ov.hidden=true; if(def.mount) def.mount(ctx); render(); last=performance.now(); if(def.tick||def.frame) raf=requestAnimationFrame(loop); setTimeout(()=>toast("رجعنا لنفس الجولة","check"),300); } }
  const kd = e => { if(def.key && S && !paused && !ended && !e.target.matches("input,textarea")) def.key(e, S, ctx); };
  window.addEventListener("keydown", kd);
  return () => { camOff && camOff(); cancelAnimationFrame(raf); window.removeEventListener("keydown",kd); offs.forEach(f=>f()); if(def.unmount) def.unmount(ctx); Party.snapshot=null; };
}
// seeded rng
function rng(seed){ let s=seed>>>0||1; return ()=>{ s^=s<<13; s>>>=0; s^=s>>17; s^=s<<5; s>>>=0; return s/4294967296; }; }
