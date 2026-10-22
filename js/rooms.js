/* =====================================================================
   غرف وأماكن جانبية — كل مكان بيه شخصية أو لغز أو قطعة قصة أو مكافأة.
   الأماكن الخارجية: «كاميرا» تقرّب على جزء من لوحة القلعة الأصلية (الملف نفسه بدون تعديل).
   الأماكن الداخلية: رسم SVG بنفس ألوان اللوحة، وبعضها بيه شبّاك يطل على اللوحة.
   ===================================================================== */
const P = {
  shelf:(x,y,w,hh,seed=1)=>{ let s=`<rect x="${x}" y="${y}" width="${w}" height="${hh}" fill="#3A2418" stroke="#1E120C" stroke-width="6"/>`; const rows=Math.max(1,Math.floor(hh/120)); for(let r=0;r<rows;r++){ const yy=y+16+r*(hh-20)/rows, bh=(hh-20)/rows-24; let xx=x+12, i=0; while(xx<x+w-30){ const bw=18+((i*7+seed*13+r*5)%16); s+=`<rect x="${xx}" y="${yy+((i*5)%12)}" width="${bw}" height="${bh-((i*5)%12)}" rx="3" fill="${["#7A2E2A","#2F5E57","#D9A53A","#3E4A7A","#B5482A","#5B7F4A","#8C6A48"][(i+r+seed)%7]}" stroke="#1E120C" stroke-width="2.5"/><path d="M${xx+4} ${yy+20} h${bw-8}" stroke="#E8C066" stroke-width="2" opacity=".6"/>`; xx+=bw+3; i++; } s+=`<rect x="${x}" y="${yy+bh}" width="${w}" height="14" fill="#5A3A24" stroke="#1E120C" stroke-width="3"/>`; } return s; },
  candle:(x,y)=>`<g><circle cx="${x}" cy="${y-30}" r="40" fill="rgba(255,200,110,.18)"/><rect x="${x-7}" y="${y-22}" width="14" height="30" rx="3" fill="#F3E6C8" stroke="#8C6A48" stroke-width="2"/><path class="flame" d="M${x} ${y-44}c8 10 6 18 0 20c-6-2-8-10 0-20z" fill="#FFC85A" stroke="#E08A2E" stroke-width="2"/><rect x="${x-16}" y="${y+6}" width="32" height="8" rx="3" fill="#B88F33"/></g>`,
  frame:(x,y,w,hh,inner)=>`<g><rect x="${x-14}" y="${y-14}" width="${w+28}" height="${hh+28}" rx="6" fill="#C99A3C" stroke="#6E4A22" stroke-width="5"/><rect x="${x-4}" y="${y-4}" width="${w+8}" height="${hh+8}" fill="none" stroke="#8C6A2A" stroke-width="3"/><svg x="${x}" y="${y}" width="${w}" height="${hh}" viewBox="0 0 100 120" preserveAspectRatio="none">${inner}</svg></g>`,
  gear:(cx,cy,r,c="#B88F33",cls="spin")=>{ const n=Math.max(8,Math.round(r/9)); let t=""; for(let i=0;i<n;i++) t+=`<rect x="${-r*.14}" y="${-r-r*.18}" width="${r*.28}" height="${r*.36}" rx="${r*.05}" transform="rotate(${i*360/n})"/>`; return `<g transform="translate(${cx} ${cy})"><g class="${cls}" fill="${c}" stroke="#3A2A1C" stroke-width="${Math.max(2,r/22)}">${t}<circle r="${r}"/><circle r="${r*.62}" fill="none" stroke="rgba(0,0,0,.25)"/><circle r="${r*.2}" fill="#3A2A1C"/>${[0,90,180,270].map(a=>`<rect x="${-r*.06}" y="${-r*.6}" width="${r*.12}" height="${r*.4}" transform="rotate(${a})" fill="rgba(0,0,0,.25)" stroke="none"/>`).join("")}</g></g>`; },
  pipe:d=>`<path d="${d}" fill="none" stroke="#5A4636" stroke-width="30" stroke-linecap="round"/><path d="${d}" fill="none" stroke="#8C7A66" stroke-width="18" stroke-linecap="round"/><path d="${d}" fill="none" stroke="rgba(255,255,255,.18)" stroke-width="5" stroke-linecap="round"/>`,
  vine:(d,c="#4E6A46")=>`<path d="${d}" fill="none" stroke="${c}" stroke-width="10" stroke-linecap="round"/>${d.match(/[\d.]+ [\d.]+/g).slice(1).map((p,i)=>{ const [x,y]=p.split(" ").map(Number); return `<ellipse cx="${x}" cy="${y}" rx="18" ry="9" transform="rotate(${i*47%180} ${x} ${y})" fill="${["#5B7F4A","#7FA374","#C8552B"][i%3]}"/>`; }).join("")}`,
  flowers:(x,y,n=7,s=1)=>{ let o=""; for(let i=0;i<n;i++){ const fx=x+(i*53%140)-70, fy=y+(i*37%40)-20, c=["#E9A79E","#F3C1BA","#FBF6E8","#E8C066","#C8552B","#B9A6DD"][i%6]; o+=`<g transform="translate(${fx} ${fy}) scale(${s})"><path d="M0 0v40" stroke="#4E6A46" stroke-width="4"/>${[0,72,144,216,288].map(a=>`<ellipse cx="0" cy="-10" rx="7" ry="11" transform="rotate(${a})" fill="${c}" stroke="rgba(0,0,0,.2)" stroke-width="1"/>`).join("")}<circle r="5" fill="#E8C066"/></g>`; } return o; },
  rail:(y,c="#E9DCC4")=>`<rect x="0" y="${y}" width="1600" height="22" fill="${c}" stroke="#6E5A40" stroke-width="4"/>${Array.from({length:21},(_,i)=>`<path d="M${i*80+20} ${y+22}v120" stroke="#6E5A40" stroke-width="16" stroke-linecap="round"/><path d="M${i*80+20} ${y+22}v120" stroke="${c}" stroke-width="10" stroke-linecap="round"/>`).join("")}<rect x="0" y="${y+140}" width="1600" height="30" fill="${c}" stroke="#6E5A40" stroke-width="4"/>`,
  lamp:(x,y,on=true)=>`<g><path d="M${x} ${y}v220" stroke="#2E2418" stroke-width="12"/>${on?`<circle cx="${x}" cy="${y-20}" r="60" fill="rgba(255,200,90,.25)"/>`:""}<path d="M${x-22} ${y-50}h44l-6 50h-32z" fill="${on?"#FFD27A":"#6E6458"}" stroke="#2E2418" stroke-width="5"/><path d="M${x-28} ${y-50}l28-24 28 24z" fill="#2E2418"/></g>`,
  steam:(x,y)=>`<g class="steam" style="transform-origin:${x}px ${y}px"><circle cx="${x}" cy="${y}" r="22" fill="rgba(255,255,255,.35)"/><circle cx="${x+18}" cy="${y-24}" r="16" fill="rgba(255,255,255,.28)"/><circle cx="${x-10}" cy="${y-48}" r="12" fill="rgba(255,255,255,.2)"/></g>`,
  winView:(cx,cy,r,fx,fy,zoom)=>{ const W=1600*zoom, H=W*CASTLE_H/CASTLE_W; return `<defs><clipPath id="cw${cx}"><circle cx="${cx}" cy="${cy}" r="${r}"/></clipPath></defs><image href="${CASTLE}" x="${cx-fx*W}" y="${cy-fy*H}" width="${W}" height="${H}" clip-path="url(#cw${cx})" preserveAspectRatio="none"/>`; },
  rectView:(x,y,w,hh,fx,fy,zoom,id)=>{ const W=1600*zoom, H=W*CASTLE_H/CASTLE_W; return `<defs><clipPath id="rv${id}"><rect x="${x}" y="${y}" width="${w}" height="${hh}" rx="${w/2}" ry="${w/2}"/></clipPath></defs><image href="${CASTLE}" x="${x+w/2-fx*W}" y="${y+hh/2-fy*H}" width="${W}" height="${H}" clip-path="url(#rv${id})" preserveAspectRatio="none"/>`; }
};
const wallBg = (a,b) => `<defs><linearGradient id="wl" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient><radialGradient id="glowc" cx=".5" cy=".4" r=".7"><stop offset="0" stop-color="rgba(255,210,140,.35)"/><stop offset="1" stop-color="rgba(0,0,0,0)"/></radialGradient></defs><rect width="1600" height="900" fill="url(#wl)"/><rect width="1600" height="900" fill="url(#glowc)"/>`;
const floorBg = (y,c1,c2) => `<path d="M0 ${y}H1600V900H0Z" fill="${c1}"/>${Array.from({length:12},(_,i)=>`<path d="M${i*150-200} 900L${i*140+60} ${y}" stroke="${c2}" stroke-width="3" opacity=".5"/>`).join("")}<path d="M0 ${y}H1600" stroke="rgba(0,0,0,.35)" stroke-width="8"/>`;
const SKY = {dawn:["#F3C1BA","#FBE3C8"], noon:["#8EC3CF","#E6F2F0"], sunset:["#E08A2E","#F6C98B"], night:["#1E2A50","#3E4A7A"]};
const skyFrame = (k, hh, mm) => `<rect width="100" height="120" fill="${SKY[k][0]}"/><rect y="60" width="100" height="60" fill="${SKY[k][1]}"/>${k==="night"?'<circle cx="74" cy="22" r="10" fill="#FFF2C8"/><circle cx="20" cy="18" r="2" fill="#fff"/><circle cx="40" cy="30" r="1.6" fill="#fff"/>':k==="dawn"?'<circle cx="50" cy="66" r="14" fill="#FFD9A0"/>':k==="sunset"?'<circle cx="30" cy="60" r="16" fill="#FFC85A"/>':'<circle cx="70" cy="22" r="13" fill="#FFF2B0"/>'}<path d="M0 96Q50 80 100 96V120H0z" fill="#5A3A24"/><g transform="translate(30 70) scale(.5)">${clockSVG(hh,mm).replace(/<\/?svg[^>]*>/g,"")}</g>`;

/* ---------- محرك الغرف ---------- */
function viewRoom(root, id){
  const R = ROOMS[id]; if(!R || !nodeOpen(id)){ go("world"); return; }
  const firstVisit = !WS.flags["room_"+id];
  const v = h(`<section class="view room room-${id}">
    <div class="mapscroll"><div class="mapscene room-stage">
      ${R.cam?`<div class="room-cam"><img src="${CASTLE}" alt="${esc(NODES[id].name)} من لوحة القلعة" draggable="false"></div>`:""}
      <svg class="room-art" viewBox="0 0 1600 900" preserveAspectRatio="none" aria-hidden="true">${R.bg?R.bg():""}${R.props?R.props():""}</svg>
      <div class="room-tint" style="${R.tint?`background:${R.tint}`:""}"></div>
      <div data-spots></div>
      ${LEAF_SPOTS.map((s,i)=>s.at===id?leafHTML(i,s):"").join("")}
      ${NOTE_SPOTS.map((s,i)=>s.at===id?noteHTML(i,s):"").join("")}
      ${R.npc?`<button class="room-npc" data-talk style="left:${R.npc.x}%;bottom:${R.npc.b||8}%;height:${R.npc.h||34}%" aria-label="كلّموا ${esc(NPCS[R.npc.id].name())}">${npcHTML(R.npc.id, "idle")}</button>`:""}
      <div class="room-kids" style="left:${R.kidsX||14}%">${kidFigure("k")}${kidFigure("y")}</div>
      ${R.motes===false?"":`<div class="ambient" aria-hidden="true">${motionOK()&&!lowPower?Array.from({length:8},()=>`<span class="ffly mote" style="left:${10+Math.random()*80}%;top:${15+Math.random()*60}%;animation-delay:${-Math.random()*6}s,${-Math.random()*3}s"></span>`).join(""):""}</div>`}
      ${R.leaves?leafLayer(lowPower?3:7,"soft"):""}
    </div></div>
    <div class="room-ui panel"><span class="ru-ic">${NODE_IC[NODES[id].ic]()}</span><div><b>${esc(NODES[id].name)}</b><p data-obj></p></div></div>
    <div class="map-ui room-bar" data-bar></div>
    <div class="tale-task panel room-task" data-task hidden></div>
  </section>`);
  root.appendChild(v);
  const stage=$(".room-stage",v), scroll=$(".mapscroll",v), task=$("[data-task]",v), kidsEl=$(".room-kids",v);
  // كاميرا على اللوحة الأصلية: تقرّب على نقطة المكان (بدون أي تعديل على الملف)
  let ro;
  if(R.cam){
    const img=$(".room-cam img",v); const [cx,cy,z]=R.cam;
    const fit=()=>{ const W=stage.clientWidth, H=stage.clientHeight; let iw=Math.max(W, H*CASTLE_W/CASTLE_H)*z, ih=iw*CASTLE_H/CASTLE_W; let l=W/2-cx*iw, t=H/2-cy*ih; l=Math.min(0,Math.max(W-iw,l)); t=Math.min(0,Math.max(H-ih,t)); img.style.width=iw+"px"; img.style.height=ih+"px"; img.style.left=l+"px"; img.style.top=t+"px"; };
    ro=new ResizeObserver(fit); ro.observe(stage); fit();
  }
  // على الشاشات الضيقة المشهد ينسحب يمين ويسار مثل خريطة أيلاف؛ نبدي من مكان خباب ويقين
  requestAnimationFrame(()=>{ const extra=stage.scrollWidth-scroll.clientWidth; if(extra<=0) return; scroll.scrollLeft = R.focusX!=null ? extra*R.focusX : Math.max(0, stage.scrollWidth*(R.kidsX||14)/100 - scroll.clientWidth*.25); });
  const ctx = {
    id, v, task, stage,
    say:(lines, done)=>dialogue(v, lines, done),
    walk:(x, done)=>walkKids(kidsEl, x, done),
    open:html=>{ task.hidden=false; task.innerHTML=`<button class="ibtn task-x" aria-label="إغلاق">${IC.close}</button>`+html; $(".task-x",task).onclick=()=>{ task.hidden=true; }; return task; },
    close:()=>{ task.hidden=true; task.innerHTML=""; },
    refresh:()=>{ drawSpots(); drawBar(); obj(); const art=$(".room-art",v); if(art && ctx._drawn) art.innerHTML=(R.bg?R.bg():"")+(R.props?R.props():""); ctx._drawn=true; },
    cheer:()=>{ $$(".kidfig",kidsEl).forEach(k=>kidAct(k,"happy")); }
  };
  const obj=()=>{ $("[data-obj]",v).textContent = R.objective ? R.objective() : NODES[id].desc; };
  function drawSpots(){
    const me = Party.connected() ? Party.me.char : null;
    const list=(R.spots?R.spots():[]).filter(s=>!s.hide || !s.hide()).filter(s=>!s.who || !me || s.who===me);
    $("[data-spots]",v).innerHTML = list.map((s,i)=>`<button class="room-spot ${s.glow===false?"":"glow"} ${s.cls||""}" data-s="${i}" style="left:${s.x}%;top:${s.y}%;${s.w?`width:${s.w}px;height:${s.w}px`:""}" aria-label="${esc(s.label)}">${s.art?s.art():`<span class="rs-eye">${IC.eye}</span>`}<span class="rs-tag">${esc(s.label)}${s.who?` <small>(${CH[s.who].name} يشوفها)</small>`:""}</span></button>`).join("");
    $$("[data-s]",v).forEach(b=>b.onclick=e=>{ e.stopPropagation(); const s=list[+b.dataset.s]; Sound.soft(); ctx.walk(s.x, ()=>s.on(ctx, b)); });
  }
  function drawBar(){
    const acts=[];
    if(R.puzzle && !R.puzzle.done()) acts.push(`<button class="btn honey" data-pz>${IC.bulb} ${esc(R.puzzle.title)}</button>`);
    (R.actions?R.actions():[]).forEach((a,i)=>acts.push(`<button class="btn ${a.hot?"honey":""} small" data-act="${i}">${esc(a.l)}</button>`));
    acts.push(`<button class="btn ghost small" data-out>${IC.map} للخريطة</button>`);
    $("[data-bar]",v).innerHTML=acts.join("");
    const pz=$("[data-pz]",v); if(pz) pz.onclick=()=>runPuzzle();
    $$("[data-act]",v).forEach(b=>b.onclick=()=>R.actions()[+b.dataset.act].run(ctx));
    $("[data-out]",v).onclick=()=>sceneLeave(null, ()=>go("world"));
  }
  function runPuzzle(){ if(!R.puzzle || R.puzzle.done()) return; R.puzzle.run(ctx, ()=>{ ctx.close(); Sound.win(); confetti(); ctx.cheer(); R.puzzle.reward(ctx); setTimeout(()=>ctx.refresh(), 50); }); }
  ctx.runPuzzle = runPuzzle;
  bindCollectibles(v);
  const talk=$("[data-talk]",v); if(talk) talk.onclick=()=>{ const fig=$(".npc-fig",talk); react(fig,"hop"); ctx.walk(R.npc.x-10, ()=>ctx.say(R.talk ? R.talk(ctx) : [[R.npc.id,0,npcLine(R.npc.id)]], ()=>{ met(); ctx.refresh(); })); };
  $$(".room-kids .kidfig",v).forEach(k=>k.onclick=()=>{ kidAct(k,"jump"); Sound.soft(); });
  ctx.refresh();
  const met=()=>{ if(R.npc){ const k={saadoun:"metSaadoun",cat:"metCat",sumo:"metSumo",narjis:"metNarjis",owl:"metOwl"}[R.npc.id]; if(k) setFlag(k); } };
  // المقدمة تنحسب «انشافت» بس لما تخلص، حتى لو انسدت الصفحة بالنص ترجع تطلع
  const seen=()=>{ WS.flags["room_"+id]=true; saveWorld(); met(); ctx.refresh(); };
  if(firstVisit){ if(R.intro) setTimeout(()=>{ if(document.body.contains(v)) ctx.say(R.intro(ctx), seen); }, motionOK()?700:100); else seen(); }
  const off = Party.connected() ? Party.on("room", m=>{ if(m.id===id && m.ev==="refresh") ctx.refresh(); }) : null;
  return ()=>{ ro && ro.disconnect(); off && off(); };
}
// مشي مجموعة الأطفال داخل المشهد: نفس منحنى ونطّات مشي أيلاف على الخريطة
function walkKids(el, x, done){
  const from=parseFloat(el.style.left)||14, to=Math.max(4,Math.min(80,x-6));
  if(!motionOK() || Math.abs(to-from)<2){ el.style.left=to+"%"; done&&done(); return; }
  const dur=Math.min(650, 250+Math.abs(to-from)*12), t0=performance.now(), figs=$$(".kidfig",el);
  figs.forEach(f=>f.classList.toggle("face-l", to<from));
  const step=now=>{ const t=Math.min(1,(now-t0)/dur), e=t<.5?2*t*t:1-Math.pow(-2*t+2,2)/2; el.style.left=(from+(to-from)*e)+"%"; figs.forEach((f,i)=>f.style.transform=`translateY(${-Math.abs(Math.sin(t*Math.PI*4+i*.6))*8}px)`); if(t<1) requestAnimationFrame(step); else { figs.forEach(f=>f.style.transform=""); done&&done(); } };
  requestAnimationFrame(step);
}
const inspect = (lines) => (ctx)=>ctx.say(lines);

/* ---------- ألغاز الغرف ---------- */
function puzzleGears(ctx, solved, {title, text, n=3}){
  const target=Array.from({length:n},(_,i)=>[2,0,3,1][i%4]); let g=target.map(t=>(t+1+Math.floor(Math.random()*3))%4);
  const draw=()=>{ ctx.open(`<h3>${esc(title)}</h3><p>${esc(text)}</p><div class="gears">${g.map((r,i)=>`<button class="gearbtn ${r===target[i]?"ok":""}" data-i="${i}" aria-label="ترس ${i+1}"><span style="transform:rotate(${(r-target[i])*90}deg)">${ART.gear(["#B88F33","#8C6C48","#D9A53A","#C77B3A"][i])}<i></i></span></button>`).join("")}</div><p class="d-note">${g.filter((r,i)=>r===target[i]).length} من ${n} بمكانها</p>`);
    $$("[data-i]",ctx.task).forEach(b=>b.onclick=()=>{ const i=+b.dataset.i; g[i]=(g[i]+1)%4; Sound.flip(); if(g.every((r,j)=>r===target[j])){ draw(); setTimeout(solved,500); return; } draw(); }); };
  draw();
}
function puzzleOrder(ctx, solved, {title, text, items, render, check}){
  let ord=shuffle(items.map((_,i)=>i)); while(ord.every((x,i)=>x===i)) ord=shuffle(ord); let sel=null;
  const draw=()=>{ ctx.open(`<h3>${esc(title)}</h3><p>${esc(text)}</p><div class="pz-row">${ord.map((k,i)=>`<button class="pz-card ${sel===i?"sel":""}" data-i="${i}">${render(items[k],k)}</button>`).join("")}</div><div class="row" style="justify-content:center"><button class="btn honey" data-ok>${IC.check} تحقّقوا</button></div><p class="d-note">اضغطوا على قطعتين حتى تبدّلون مكانهم.</p>`);
    $$(".pz-card",ctx.task).forEach(b=>b.onclick=()=>{ const i=+b.dataset.i; if(sel==null) sel=i; else { [ord[sel],ord[i]]=[ord[i],ord[sel]]; sel=null; Sound.flip(); } draw(); });
    $("[data-ok]",ctx.task).onclick=()=>{ if(ord.every((x,i)=>x===i)) solved(); else { Sound.bump(); $$(".room-kids .kidfig",ctx.v).forEach(k=>kidAct(k,"surprise")); toast(check||"بعد مو صح… فكّروا مرة ثانية","bulb"); } }; };
  draw();
}

/* ---------- الأماكن ---------- */
const ROOMS = {
  station:{
    cam:[.16,.53,2.6], tint:"linear-gradient(180deg,rgba(40,20,10,0),rgba(40,20,10,.35))", leaves:true,
    props:()=>`<rect x="0" y="690" width="1600" height="210" fill="#6E5A44"/><path d="M0 700H1600" stroke="#3A2A1C" stroke-width="10"/><path d="M0 780H1600M0 830H1600" stroke="#2E2418" stroke-width="12"/>${Array.from({length:20},(_,i)=>`<rect x="${i*84}" y="770" width="22" height="72" fill="#5A3A24"/>`).join("")}
      <g transform="translate(980 420)"><rect width="520" height="260" rx="26" fill="#2F5E57" stroke="#1E3A36" stroke-width="8"/><rect x="30" y="40" width="100" height="80" rx="8" fill="#FFD27A" stroke="#1E3A36" stroke-width="5"/><rect x="160" y="40" width="100" height="80" rx="8" fill="#FFD27A" stroke="#1E3A36" stroke-width="5"/><rect x="290" y="40" width="100" height="80" rx="8" fill="#FFD27A" stroke="#1E3A36" stroke-width="5"/><rect x="420" y="-80" width="56" height="100" fill="#2E2418"/><path d="M0 200H520" stroke="#D9A53A" stroke-width="10"/><circle cx="110" cy="275" r="44" fill="#2E2418" stroke="#8C6A48" stroke-width="8"/><circle cx="410" cy="275" r="44" fill="#2E2418" stroke="#8C6A48" stroke-width="8"/>${P.steam(450,-110)}</g>
      <g transform="translate(140 300)"><rect width="300" height="380" fill="#C9B89A" stroke="#5A4A36" stroke-width="8"/><path d="M-30 0L150 -110L330 0Z" fill="#7A2E2A" stroke="#4A1E14" stroke-width="8"/><circle cx="150" cy="-30" r="44" fill="#F3E6C8" stroke="#3A2A1C" stroke-width="6"/><path d="M150 -30V-60M150 -30L172 -18" stroke="#3A2A1C" stroke-width="5"/><rect x="40" y="120" width="220" height="120" rx="8" fill="#3A2A1C"/><rect x="56" y="136" width="188" height="88" fill="#FFE7B0"/><text x="150" y="196" text-anchor="middle" font-size="40" font-family="Aref Ruqaa,serif" fill="#7A2E2A">التذاكر</text></g>${P.lamp(560,470)}`,
    npc:{id:"cat", x:36, b:20, h:26}, kidsX:52,
    intro:()=>[["cat",0,"مياو! أهلاً بمحطة منتصف الخريف. آني زعفرانة، حارسة التذاكر."],["k",1,"قطة بقبعة سائق! هذا أحلى شي شفته اليوم."],{ask:"زعفرانة تسأل: «شنو تحبون أكثر بالقطار؟»", who:"cat", opts:[{t:"السرعة!", pick:()=>setFlag("trainLove","speed"), then:[["cat",1,"سريعين؟ إذن لعبة القطار إلكم. خباب يمسك السرعة."]]},{t:"المناظر من الشبّاك", pick:()=>setFlag("trainLove","view"), then:[["cat",1,"عيونكم حلوة. جرّبوا رحلة القناطر، المنظر يجنن."]]}]},["cat",0,"بس… ضيّعت جرسي. بدونه القطارات ما تسمعني. آخر مرة رن بغرفة الآلات."]],
    talk:()=>[["cat",0,npcLine("cat")]].concat(WS.tickets.length>=3 && !flag("room_abandoned") ? [["cat",2,"عندكم 3 قطع تذكرة؟ باب المحطة المهجورة يسمعكم هسه. هي بنهاية الخط."]] : []),
    spots:()=>[
      {x:30,y:46,label:"شبّاك التذاكر",on:(ctx)=>{ const got=WS.tickets; modal(`<h2>شبّاك التذاكر</h2><p>قطع التذكرة الممزقة: ${got.length} من 5</p><div class="album">${Object.keys(TICKETS).map(k=>`<span class="${got.includes(k)?"on":""}">${ART.ticket()}</span>`).join("")}</div><ul class="q-sub">${Object.entries(TICKETS).map(([k,t])=>`<li class="${got.includes(k)?"done":""}">${got.includes(k)?IC.check:""}${esc(t.how)}</li>`).join("")}</ul><p class="d-note">3 قطع تفتح المحطة المهجورة.</p>`); }},
      {x:66,y:70,label:"عجلة القطار",on:inspect([["k",1,"العجلة دافية! القطار يحب يمشي."],["y",2,"مكتوب عليها: «صُنعت ببرج الساعة». يعني العم سعدون يعرف القطار!"]])}
    ],
    actions:()=>[{l:"العبوا «قطار منتصف الخريف»",hot:true,run:()=>go("play:train")},{l:"رحلة على القناطر",run:()=>trainRide()}],
    objective:()=> flag("catBell") ? "زعفرانة فرحانة. القطار ينتظركم." : hasItem("bell") ? "رجّعوا الجرس لزعفرانة!" : "زعفرانة ضيّعت جرسها. والتذاكر الممزقة تفتح المحطة المهجورة."
  },

  abandoned:{
    cam:[.05,.47,3.2], tint:"linear-gradient(180deg,rgba(60,70,90,.35),rgba(30,30,40,.55))",
    props:()=>`<rect x="0" y="700" width="1600" height="200" fill="#4A4038"/><path d="M0 780H1600M0 830H1600" stroke="#2E2418" stroke-width="12"/>
      <g transform="translate(160 440)" opacity=".95"><rect width="560" height="250" rx="24" fill="#6E6458" stroke="#3A322A" stroke-width="8"/>${[30,160,290,420].map(x=>`<rect x="${x}" y="40" width="100" height="80" rx="8" fill="#3A322A"/>`).join("")}<path d="M20 30c60 40 100-10 160 20s120 0 180 30" ${""}fill="none" stroke="#5B7F4A" stroke-width="12" stroke-linecap="round"/><circle cx="110" cy="265" r="44" fill="#2E2418"/><circle cx="450" cy="265" r="44" fill="#2E2418"/></g>
      <g transform="translate(1080 260)"><rect width="300" height="200" rx="8" fill="#3A2A1C" stroke="#8C6A48" stroke-width="8"/><text x="150" y="50" text-anchor="middle" font-size="34" font-family="Aref Ruqaa,serif" fill="#E8D6B8">جدول القطارات</text>${[0,1,2].map(r=>`<rect x="30" y="${74+r*38}" width="240" height="22" fill="#5A4A3A"/>`).join("")}</g>
      ${[0,1,2,3].map(i=>`<g transform="translate(${880+i*110} 520)"><path d="M0 0v180" stroke="#2E2418" stroke-width="10"/><rect x="-26" y="-70" width="52" height="80" rx="10" fill="#2E2418"/><circle cx="0" cy="-30" r="18" class="sig" data-sig="${i}" fill="#555"/></g>`).join("")}
      <path d="M0 0c120 60 200 0 300 80M1600 40c-140 20-180 120-300 100" fill="none" stroke="rgba(230,230,230,.35)" stroke-width="2"/>`,
    kidsX:60,
    intro:()=>[["y",2,"الباب انفتح بالتذكرة! كل شي هنا نايم من سنين."],["k",0,"شوفي الإشارات… مطفية. والجدول عليه ألوان."],["y",1,"إذا رتّبنا ألوان الإشارات مثل الجدول، يمكن المحطة تصحى."]],
    spots:()=>[
      {x:77,y:38,label:"جدول القطارات",who:Party.connected()?"y":null,on:()=>modal(`<h2>جدول القطارات</h2><div class="letter">«قطار منتصف الخريف يطلع لما الإشارات تضوي: أخضر، أحمر، أصفر، أخضر — من اليمين لليسار.»</div><div class="sig-key">${["#5B9F4A","#C8352B","#E8C066","#5B9F4A"].map(c=>`<i style="background:${c}"></i>`).join("")}</div>${Party.connected()?'<p class="d-note">بس يقين تشوف الجدول. گولي لصاحبج شنو الألوان!</p>':""}`)},
      {x:30,y:56,label:"عربة قديمة",on:inspect([["k",2,"العربة مليانة أوراق يابسة… وبيها مقعد صغير مكتوب عليه «سعدون، 7 سنين»."],["y",1,"يعني العم سعدون جان يركب هنا وهو صغير!"]])}
    ],
    puzzle:{title:"شغّلوا الإشارات", done:()=>WS.gears.includes("iron"),
      run:(ctx, solved)=>{ const C=["#555","#C8352B","#E8C066","#5B9F4A"], target=[3,1,2,3]; let s=[0,0,0,0];
        const draw=()=>{ ctx.open(`<h3>إشارات المحطة</h3><p>اضغطوا كل إشارة حتى يتبدل لونها. الترتيب الصحيح مكتوب بجدول القطارات.</p><div class="sigs">${s.map((c,i)=>`<button class="sig-btn" data-i="${i}" style="--c:${C[c]}" aria-label="إشارة ${i+1}"><i></i></button>`).join("")}</div><div class="row" style="justify-content:center"><button class="btn honey" data-ok>${IC.check} شغّلوا</button></div>`);
          $$("[data-i]",ctx.task).forEach(b=>b.onclick=()=>{ const i=+b.dataset.i; s[i]=s[i]%3+1; Sound.flip(); draw(); });
          $("[data-ok]",ctx.task).onclick=()=>{ if(s.every((c,i)=>c===target[i])) solved(); else { Sound.bump(); toast("الإشارات ما اشتغلت. شوفوا الجدول مرة ثانية","bulb"); } }; };
        draw(); },
      reward:(ctx)=>{ ctx.say([["k",1,"تووووت! المحطة صحت والقطار القديم صفّر!"],["y",1,"وطلع من المدخنة… ترس حديد!"]], ()=>{ giveGear("iron"); ctx.refresh(); }); }},
    objective:()=> WS.gears.includes("iron") ? "المحطة صحت. ترس الحديد وياكم." : "رتّبوا ألوان الإشارات حسب جدول القطارات."
  },

  hidden:{
    cam:[.14,.86,2.8], tint:"radial-gradient(ellipse at 50% 30%,rgba(255,230,180,.15),rgba(30,40,20,.35))", leaves:true,
    props:()=>`<path d="M300 900V420a500 380 0 011000 0V900" fill="none" stroke="#3A4A2E" stroke-width="60"/>${P.vine("M260 900C260 700 320 520 520 380S1000 260 1180 380 1340 700 1340 900")}
      <g transform="translate(800 640)"><ellipse rx="190" ry="44" fill="#A7D3DC" stroke="#6E8A8A" stroke-width="8"/><rect x="-30" y="-150" width="60" height="150" fill="#D9CDB4" stroke="#6E5A40" stroke-width="6"/><ellipse cy="-150" rx="90" ry="24" fill="#A7D3DC" stroke="#6E8A8A" stroke-width="6"/><path class="water" d="M0 -170c-20 30-40 60-60 130M0 -170c20 30 40 60 60 130" stroke="rgba(255,255,255,.7)" stroke-width="5" fill="none"/></g>
      ${P.flowers(180,820,9,1.4)}${P.flowers(1420,820,9,1.4)}${P.flowers(600,860,7,1.1)}${P.flowers(1020,860,7,1.1)}`,
    kidsX:38,
    intro:()=>[["y",1,"واااو… الحديقة المخفية! بيها نافورة وورد ما شفناه بأي مكان."],["k",1,"أكيد بيها أشياء مخبّاة. آني ألگاها أول!"],["y",2,"لا تركض على الورد! خلّي ندوّر بهدوء."]],
    spots:()=>[
      {x:12,y:62,label:"شي وردي منقّط",cls:"faint",hide:()=>hasItem("sumoHat")||flag("hatReturned"),art:()=>ART.sumoHat(),on:(ctx)=>{ giveItem("sumoHat"); WS.flags.hf_hat=true; saveWorld(); ctx.say([["k",1,"هاي قبعة "+CONFIG.guestName+"! لازم نرجعها له بقصر الأزياء."]]); checkHidden(ctx); }},
      {x:88,y:78,label:"دعسوقة",cls:"faint",hide:()=>flag("hf_bug"),art:()=>ART.ladybug(),on:(ctx)=>{ setFlag("hf_bug"); ctx.say([["y",1,"دعسوقة تحسب نقاطها… مثل اللي بغابة "+heroName()+"! يمكن هي بنت عمها."]]); checkHidden(ctx); }},
      {x:58,y:86,label:"أرنب نايم",cls:"faint",hide:()=>flag("hf_rabbit"),art:()=>ART.rabbit(),on:(ctx)=>{ setFlag("hf_rabbit"); ctx.say([["k",0,"ششش… أرنب نايم بين الورد."]]); checkHidden(ctx); }},
      {x:46,y:30,label:"زهرة القمر",cls:"faint",hide:()=>flag("hf_moon"),art:()=>ART.flower("#E6EEF2"),on:(ctx)=>{ setFlag("hf_moon"); ctx.say([["y",1,"زهرة القمر! تضوي حتى بالنهار."]]); checkHidden(ctx); }}
    ],
    objective:()=> flag("hiddenFound") ? "لگيتوا كل أسرار الحديقة." : `دوّروا 4 أشياء مخبّاة بين الورد (${["hf_hat","hf_bug","hf_rabbit","hf_moon"].filter(f=>flag(f)).length}/4).`
  },

  greenhouse:{
    cam:[.575,.55,3.4], tint:"linear-gradient(180deg,rgba(220,255,230,.1),rgba(40,60,30,.3))",
    props:()=>`<g opacity=".55" stroke="#6E5A2A" stroke-width="6" fill="none">${Array.from({length:9},(_,i)=>`<path d="M${i*200} 0V900"/>`).join("")}<path d="M0 300H1600M0 600H1600"/></g>
      <rect x="0" y="640" width="1600" height="260" fill="#6B4A2E"/><rect x="0" y="630" width="1600" height="20" fill="#8C6A48"/>
      ${[[420,"#E9A79E"],[800,"#5B7F4A"],[1180,"#7FA374"]].map(([x,c],i)=>`<g transform="translate(${x} 640)"><path d="M-70 0h140l-20 110h-100z" fill="#B5622E" stroke="#5A2E14" stroke-width="6"/>${i===0?`<path d="M0 0V-140" stroke="#4E6A46" stroke-width="8"/>${[0,72,144,216,288].map(a=>`<ellipse cx="0" cy="-170" rx="20" ry="30" transform="rotate(${a} 0 -150)" fill="${c}" stroke="#9A5C52" stroke-width="3"/>`).join("")}<circle cy="-150" r="14" fill="#E8C066"/>`:i===1?Array.from({length:7},(_,k)=>`<path d="M0 0Q${-90+k*30} -120 ${-110+k*36} -170" stroke="${c}" stroke-width="14" fill="none" stroke-linecap="round"/>`).join(""):`<rect x="-26" y="-170" width="52" height="170" rx="26" fill="${c}" stroke="#4E6A46" stroke-width="5"/><rect x="-74" y="-110" width="40" height="70" rx="20" fill="${c}" stroke="#4E6A46" stroke-width="5"/><circle cx="0" cy="-176" r="12" fill="#E9A79E"/>`}</g>`).join("")}`,
    npc:{id:"narjis", x:4, b:14, h:36}, kidsX:22,
    intro:()=>[["narjis",1,"هلا حبايبي! تعالوا تعالوا، الدفيئة دافية."],["narjis",0,"نباتاتي الثلاث زعلانة: كل وحدة تحتاج ضوء وماي بمقدار، ونسيت شنو بالضبط."],["y",2,"عندج دفتر؟ آني أحب أقرا الملاحظات."],["narjis",1,"على الطاولة! وإذا رجّعتوا نباتاتي فرحانة، عندي شي يلمع إلكم."]],
    spots:()=>[{x:82,y:56,label:"دفتر الخالة نرجس",art:()=>ART.book("#5B7F4A"),on:()=>modal(`<h2>دفتر البستانية</h2><div class="letter">• الوردة: تحب الشمس، وماي متوسط (2).\n• السرخس: يحب الظل، ويشرب هواية (3).\n• الصبّار: يحب الشمس، وماي قليل بس (1).</div>`)}],
    puzzle:{title:"فرّحوا النباتات", done:()=>WS.gears.includes("glass"),
      run:(ctx, solved)=>{ const names=["الوردة","السرخس","الصبّار"], need=[[1,2],[0,3],[1,1]]; const st=[[0,0],[1,0],[0,0]];
        const draw=()=>{ ctx.open(`<h3>ضوء وماي</h3><p>لكل نبتة: اختاروا شمس لو ظل، وكم مرة تسقونها. الملاحظات بدفتر الخالة نرجس.</p><div class="gh-pots">${names.map((n,i)=>`<div class="gh-pot"><b>${n}</b><button class="btn small ghost" data-sun="${i}">${st[i][0]?"☀ شمس":"☁ ظل"}</button><button class="btn small ghost" data-w="${i}">💧 ×${st[i][1]}</button></div>`).join("")}</div><div class="row" style="justify-content:center"><button class="btn honey" data-ok>${IC.check} تحقّقوا</button></div><p class="d-note" data-r></p>`);
          $$("[data-sun]",ctx.task).forEach(b=>b.onclick=()=>{ const i=+b.dataset.sun; st[i][0]=1-st[i][0]; Sound.soft(); draw(); });
          $$("[data-w]",ctx.task).forEach(b=>b.onclick=()=>{ const i=+b.dataset.w; st[i][1]=(st[i][1]+1)%4; Sound.pop(); draw(); });
          $("[data-ok]",ctx.task).onclick=()=>{ const ok=st.map((s,i)=>s[0]===need[i][0]&&s[1]===need[i][1]); if(ok.every(Boolean)) solved(); else { Sound.bump(); $("[data-r]",ctx.task).textContent = "فرحانة: "+(names.filter((_,i)=>ok[i]).join("، ")||"ولا وحدة بعد"); } }; };
        draw(); },
      reward:(ctx)=>{ ctx.say([["narjis",1,"شوفوا شلون فتّحت! يا عيني عليكم."],["narjis",0,"هذا ترس زجاج لگيته بأصيص قديم، وهذا مفتاح زجاجي يفتح ممر الكتب الخضراء."],["y",1,"شكراً خالة نرجس!"]], ()=>{ giveGear("glass"); giveItem("glassKey"); ctx.refresh(); }); }},
    actions:()=>[{l:"العبوا «مهمة الدفيئة» (ثنائية)",run:()=>go("play:greenhouse")}],
    objective:()=> WS.gears.includes("glass") ? "النباتات فرحانة. المفتاح الزجاجي يفتح ممر الكتب الخضراء." : "ساعدوا الخالة نرجس تفرّح نباتاتها."
  },

  passageLG:{
    bg:()=>wallBg("#2E3A28","#1E2418")+floorBg(700,"#3A2A1C","#1E120C"),
    props:()=>`${P.shelf(60,120,560,560,2)}${P.shelf(980,120,560,560,4)}${P.vine("M40 80C200 200 260 60 420 180S700 120 640 400")}${P.vine("M1560 60C1400 200 1300 80 1180 240S960 260 1000 520")}${P.vine("M0 640C200 560 360 700 600 620")}
      <g transform="translate(680 250)"><rect width="240" height="420" rx="120" fill="#4E7A5A" opacity=".5"/><path d="M120 0v420M0 200h240" stroke="#C99A3C" stroke-width="6"/></g>`,
    kidsX:40, leaves:true,
    intro:()=>[["k",2,"الأغصان ماكلة الكتب!"],["y",2,"بس الكتب الأربعة اللي بالنص… كل وحدة مكتوب عليها كلمة. يمكن تصير جملة؟"]],
    puzzle:{title:"رتّبوا الكلمات", done:()=>flag("booksOrdered"),
      run:(ctx, solved)=>puzzleOrder(ctx, solved, {title:"الكتب الأربعة", text:"رتّبوا الكتب حتى تصير جملة تفتح الممر (من اليمين لليسار).", items:[["الحكايات","#7A2E2A"],["تنمو","#2F5E57"],["مثل","#D9A53A"],["الأشجار","#5B7F4A"]], render:([w,c])=>`<span class="spine" style="--c:${c}">${w}</span>`, check:"الجملة ما صارت مفهومة بعد"}),
      reward:(ctx)=>{ ctx.say([["y",1,"«الحكايات تنمو مثل الأشجار»! الأغصان انسحبت."],["k",1,"والممر صار طريق مختصر بين الدفيئة والمكتبة."]], ()=>{ setFlag("booksOrdered"); grantReward("decor_garland"); addStars(2); ctx.refresh(); }); }},
    objective:()=> flag("booksOrdered") ? "الممر مفتوح بين الدفيئة والمكتبة." : "رتّبوا الكتب الأربعة."
  },

  library:{
    bg:()=>wallBg("#4A2E22","#2B1A12")+floorBg(720,"#5A3A24","#2B1A12"),
    props:()=>`${P.shelf(40,80,420,620,1)}${P.shelf(1140,80,420,620,3)}<g transform="translate(560 120)"><path d="M0 560V200a240 200 0 01480 0v360z" fill="#3E4A7A" stroke="#C99A3C" stroke-width="10"/>${P.rectView(30,40,420,500,.41,.36,3.2,"lib")}<path d="M240 40v500M30 260h420" stroke="#C99A3C" stroke-width="8"/></g>${P.candle(520,720)}${P.candle(1080,720)}
      <g transform="translate(640 600)"><path d="M0 60L160 10L320 60V120H0z" fill="#7A2E2A" stroke="#3A1E14" stroke-width="6"/><path d="M160 10V110" stroke="#E8C066" stroke-width="5"/><path d="M20 70h120M180 70h120M20 90h110M180 90h110" stroke="#F3E6C8" stroke-width="4"/></g>`,
    npc:{id:"owl", x:74, b:30, h:24}, kidsX:20,
    intro:()=>[["owl",0,"هوو هوو… أهلاً بالمكتبة. آني أم الحكايات."],["owl",0,"كل كتاب هنا حكاية تنلعب، وكل اختيار تختارونه يغيّر طريقها."],{ask:"أم الحكايات: «شنو تحبون بالحكايات؟»", who:"owl", opts:[{t:"المغامرة والركض!", pick:()=>setFlag("taleTaste","adventure"), then:[["owl",1,"خباب يحب الركض، واضح. ابدوا بقطار الساعة."]]},{t:"الألغاز والأسرار", pick:()=>setFlag("taleTaste","mystery"), then:[["owl",1,"يقين عيونها تلمع! مكتبة الحكايات الناقصة تنتظرج."]]}]},["owl",0,"خلّصوا حكاية وحدة وأنطيكم قطعة من التذكرة الممزقة."]],
    talk:()=>[["owl",0,npcLine("owl")]],
    spots:()=>[{x:50,y:74,label:"الكتاب الكبير: حكاياتنا",art:()=>ART.book("#2F5E57"),w:64,on:()=>sceneLeave(null, ()=>go("tales"))},
      {x:18,y:30,label:"رف قديم",on:inspect([["y",2,"كتاب عنوانه «ساعة الخريف» بس صفحاته فاضية."],["k",1,"يمكن إحنا اللي راح نكتبه!"]])}],
    actions:()=>[{l:"حكاياتنا",hot:true,run:()=>go("tales")},{l:"«ذاكرة مكتبة القلعة» (ثنائية)",run:()=>go("play:library")},{l:"سجل النهايات",run:()=>openJournal("tales")}],
    objective:()=> `حكايات مخلّصة: ${talesDone()} من 5. الكتاب الكبير يودّيكم لحكاياتنا.`
  },

  passage:{
    bg:()=>wallBg("#3A2A3A","#1E141E")+floorBg(720,"#2E2418","#140C08"),
    props:()=>`${[["dawn",6,0],["noon",12,0],["sunset",5,0],["night",9,0]].map(([k,hh,mm],i)=>P.frame(220+i*320,170,200,250,skyFrame(k,hh,mm))).join("")}${P.candle(140,700)}${P.candle(1460,700)}<path d="M0 120H1600" stroke="#C99A3C" stroke-width="6"/>`,
    kidsX:44, motes:true,
    intro:()=>[["y",2,"ممر سري ورا اللوحة! والجدران مليانة صور بيها ساعات."],["k",2,"كل صورة بيها سماء مختلفة… فجر، ظهر، غروب، ليل."],["y",1,"رسالة الجدّة گالت: «دوّر التروس بأماكن ناسها». وهاي صور ناسها!"]],
    puzzle:{title:"رتّبوا الصور", done:()=>WS.gears.includes("gold"),
      run:(ctx, solved)=>{ const items=[["dawn",6,0,"الفجر"],["noon",12,0,"الظهر"],["sunset",5,0,"الغروب"],["night",9,0,"الليل"]];
        puzzleOrder(ctx, solved, {title:"من الفجر لحد ما تنام النجوم", text:"رتّبوا الصور حسب وقت اليوم (من اليمين لليسار).", items, render:([k,hh,mm,n])=>`<svg viewBox="0 0 100 120" class="pz-sky">${skyFrame(k,hh,mm)}</svg><small>${n}</small>`, check:"الوقت ما يمشي هيچ… فكّروا من الصبح لليل"}); },
      reward:(ctx)=>{ ctx.say([["k",1,"الصورة الأخيرة انفتحت مثل باب صغير!"],["y",1,"وبيها ترس ذهب، ورسالة: «يا سعدون، الوقت ما يضيع؛ بس ينتظر أحد يدوّره»."]], ()=>{ giveGear("gold"); setFlag("lore"); grantReward("wings_glass"); ctx.refresh(); }); }},
    objective:()=> WS.gears.includes("gold") ? "ترس الذهب وياكم، ورسالة الجدّة." : "رتّبوا الصور الأربع حسب وقت اليوم."
  },

  tower:{
    bg:()=>wallBg("#5A3A2C","#2B1C17")+floorBg(740,"#6B4A2E","#2B1A12"),
    props:()=>`<g transform="translate(800 380)"><circle r="300" fill="#2E2418" stroke="#C99A3C" stroke-width="16"/>${P.winView(0,0,280,.63,.27,4).replace(`clip-path="url(#cw0)"`,`clip-path="url(#cwT)"`).replace(`id="cw0"`,`id="cwT"`)}${Array.from({length:12},(_,i)=>`<path d="M0 -280v40" stroke="#F3E6C8" stroke-width="10" transform="rotate(${i*30})"/>`).join("")}<path d="M0 0V-200" stroke="#2E2418" stroke-width="18" stroke-linecap="round" transform="rotate(${flag("clockRestored")?0:-60})"/><path d="M0 0V-140" stroke="#2E2418" stroke-width="24" stroke-linecap="round" transform="rotate(${flag("clockRestored")?0:150})"/><circle r="22" fill="#C99A3C"/></g>
      ${P.gear(200,620,120,"#8C6C48",flag("towerFixed")?"spin":"")}${P.gear(1400,600,140,"#B88F33",flag("towerFixed")?"spin-r":"")}${P.gear(1250,760,70,"#C77B3A",flag("towerFixed")?"spin":"")}`,
    npc:{id:"saadoun", x:70, b:8, h:38}, kidsX:22,
    intro:()=>[["saadoun",0,"أهلاً أهلاً! انتبهوا للتروس. آني العم سعدون، صانع ساعة البرج."],["saadoun",0,"الساعة وقفت يوم بدا الخريف، فالشمس علگت بين العصر والمغرب."],["k",1,"إحنا نصلّحها! شنو نسوي؟"],{ask:"العم سعدون: «شلون تحبون نبدي؟»", who:"saadoun", opts:[{t:"خباب: آني أدوّر التروس هسه!", pick:()=>setFlag("towerWay","rush"), then:[["saadoun",1,"حماس! بس على كيفك، كل ترس إله علامة حمرة لازم تقابل السهم."]]},{t:"يقين: نقرا دفترك أول", pick:()=>setFlag("towerWay","read"), then:[["saadoun",1,"شاطرة! الدفتر يگول: العلامات الحمر تقابل الأسهم، وبعدين ينفتح باب الآلات."]]}]},["saadoun",0,"وبعدها نحتاج أربع تروس ذهبية ضاعت من زمان. جدّتي خبّتها بأماكن ناسها."]],
    talk:()=>[["saadoun",0,npcLine("saadoun")]].concat(flag("lore")&&!flag("loreTold")?[["saadoun",1,"رسالة جدّتي! «الوقت ما يضيع؛ بس ينتظر أحد يدوّره»… جانت تحچيلي هاي وآني صغير."]]:[]),
    puzzle:{title:"دوّروا تروس البرج", done:()=>flag("towerFixed"),
      run:(ctx, solved)=>puzzleGears(ctx, solved, {title:"تروس البرج", text:(flag("towerWay")==="read"?"حسب دفتر العم سعدون: ":"")+"دوّروا التروس حتى كل علامة حمرة تقابل السهم.", n:3}),
      reward:(ctx)=>{ ctx.say([["saadoun",1,"تك… تك… التروس دارت! باب غرفة الآلات انفتح."],["saadoun",0,"بس الساعة بعدها واقفة: تحتاج التروس الذهبية الأربعة. دفتر مهامكم يگول وين ممكن تكون."]], ()=>{ setFlag("towerFixed"); addStars(2,"شغّلتوا تروس البرج"); ctx.refresh(); }); }},
    actions:()=>[{l:"«أوركسترا الساعة» (ثنائية)",run:()=>go("play:orchestra")}],
    objective:()=> !flag("towerFixed") ? "كلّموا العم سعدون ودوّروا تروس البرج." : WS.gears.length<4 ? `التروس الذهبية: ${WS.gears.length} من 4.` : "اصعدوا لسطح القلعة!"
  },

  machine:{
    bg:()=>wallBg("#3A3430","#1E1A18")+floorBg(760,"#4A4038","#1E1A18"),
    props:()=>`${P.pipe("M0 200H400Q460 200 460 260V700")}${P.pipe("M1600 160H1200Q1140 160 1140 220V520")}${P.pipe("M600 0V120Q600 180 660 180H900")}${P.gear(260,520,150,"#7D7F86","spin")}${P.gear(470,420,80,"#C77B3A","spin-r")}${P.gear(1340,560,170,"#8C6C48","spin-r")}${P.gear(1120,720,90,"#B88F33","spin")}${P.steam(460,260)}${P.steam(1140,220)}
      <g transform="translate(700 520)"><rect width="200" height="200" rx="14" fill="#5A4636" stroke="#2E2418" stroke-width="8"/>${[0,1,2].map(i=>`<path d="M${40+i*60} 170V${80-i*10}" stroke="#2E2418" stroke-width="12" stroke-linecap="round"/><circle cx="${40+i*60}" cy="${70-i*10}" r="16" fill="#C8352B"/>`).join("")}</g>`,
    kidsX:36,
    intro:()=>[["k",1,"واو! تروس بحجم البيت!"],["y",2,"بس السلسلة ناقصة. بين المحرك والساعة أكو ثلاث أماكن فاضية."]],
    spots:()=>[{x:14,y:30,label:"بين الأنابيب",hide:()=>hasItem("bell")||flag("catBell"),on:(ctx)=>{ ctx.say([["y",1,"شي يرن بين الأنابيب… جرس صغير!"],["k",1,"جرس زعفرانة! نرجّعه للمحطة."]], ()=>{ giveItem("bell"); ctx.refresh(); }); }},
      {x:86,y:22,label:"لوحة نحاس",on:inspect([["y",2,"مكتوب: «كل ترس يدوّر اللي جنبه بالعكس»."],["k",0,"يعني إذا الساعة دارت بالمقلوب، نزيد ترس واحد!"]])}],
    puzzle:{title:"صلّحوا سلسلة التروس", done:()=>WS.gears.includes("copper"),
      run:(ctx, solved)=>{ const sizes={S:"صغير",M:"وسط",L:"كبير",X:"عملاق"}, need=["L","S","M"]; let slot=[null,null,null], sel=null, stage=1, idler=false;
        const draw=()=>{ const all=slot.every((s,i)=>s===need[i]);
          ctx.open(`<h3>سلسلة التروس</h3>${stage===1?`<p>اختاروا ترس، بعدين حطّوه بالمكان اللي يناسب حجمه (الدوائر المنقطة).</p>
            <div class="chain">${["محرك",...slot.map((s,i)=>`<button class="peg peg-${need[i]} ${s?"full":""}" data-p="${i}" aria-label="مكان ${i+1}">${s?ART.gear(s===need[i]?"#C77B3A":"#9A8A7A"):""}</button>`),"ساعة"].map(x=>typeof x==="string"&&!x.startsWith("<")?`<span class="chain-end">${x}</span>`:x).join("")}</div>
            <div class="tray">${Object.entries(sizes).map(([k,n])=>`<button class="tray-g g-${k} ${sel===k?"sel":""}" data-g="${k}">${ART.gear("#C77B3A")}<small>${n}</small></button>`).join("")}</div>`
          :`<p>السلسلة تدور! بس سهم الساعة يدور <b>بالمقلوب</b> ↺. شنو نسوي؟</p><div class="chain spinning ${idler?"":"rev"}"><span class="chain-end">محرك</span>${need.map(s=>`<span class="peg peg-${s} full">${ART.gear("#C77B3A")}</span>`).join("")}${idler?`<span class="peg peg-S full">${ART.gear("#B88F33")}</span>`:""}<span class="chain-end">${idler?"↻":"↺"} ساعة</span></div><div class="row" style="justify-content:center"><button class="btn" data-idle>زيدوا ترس صغير عكّاس</button><button class="btn ghost" data-flip>اقلبوا الساعة</button></div>`}`);
          $$("[data-g]",ctx.task).forEach(b=>b.onclick=()=>{ sel=b.dataset.g; Sound.soft(); draw(); });
          $$("[data-p]",ctx.task).forEach(b=>b.onclick=()=>{ if(!sel){ toast("اختاروا ترس أول","bulb"); return; } const i=+b.dataset.p; slot[i]=sel; Sound.flip(); if(sel!==need[i]){ Sound.bump(); toast("مو قياسه… شوفوا حجم الدائرة","bulb"); } sel=null; if(slot.every((s,j)=>s===need[j])){ stage=2; Sound.chime(); } draw(); });
          const id=$("[data-idle]",ctx.task); if(id) id.onclick=()=>{ idler=true; Sound.chime(); draw(); setTimeout(solved, 900); };
          const fl=$("[data-flip]",ctx.task); if(fl) fl.onclick=()=>{ Sound.bump(); toast("الساعة مثبّتة بالجدار… بس التروس تتغير. شوفوا لوحة النحاس","bulb"); };
        };
        draw(); },
      reward:(ctx)=>{ ctx.say([["k",1,"دارت صح! وطلع ترس نحاس من الصندوق!"],["y",1,"وصوت البرج صار تك… تك… أقوى."]], ()=>{ giveGear("copper"); ctx.refresh(); }); }},
    objective:()=> WS.gears.includes("copper") ? "ترس النحاس وياكم." + (!hasItem("bell")&&!flag("catBell")?" وشي يرن بين الأنابيب…":"") : "صلّحوا سلسلة التروس بين المحرك والساعة."
  },

  roof:{
    cam:[.44,.1,2.6], tint:"linear-gradient(180deg,rgba(40,30,80,.25),rgba(0,0,0,.25))",
    props:()=>`<path d="M0 760L300 700H1300L1600 760V900H0Z" fill="#5A5068" stroke="#2E2A3C" stroke-width="8"/>${Array.from({length:14},(_,i)=>`<path d="M${i*120} 900L${300+i*72} 700" stroke="#3E3650" stroke-width="3"/>`).join("")}
      <g transform="translate(800 460)"><circle r="220" fill="#2E2418" stroke="#C99A3C" stroke-width="18"/>${[[-110,-110,"copper"],[110,-110,"glass"],[-110,110,"iron"],[110,110,"gold"]].map(([x,y,k])=>`<g transform="translate(${x} ${y})"><circle r="62" fill="#1E140E" stroke="${GEARS[k].c}" stroke-width="6" stroke-dasharray="10 8"/>${WS.flags["sock_"+k]||flag("clockRestored")?P.gear(0,0,54,GEARS[k].c,flag("clockRestored")?"spin":""):""}</g>`).join("")}<circle r="30" fill="#C99A3C"/></g>
      <path d="M1380 700V420" stroke="#3A2A1C" stroke-width="12"/><path class="flag" d="M1386 424h150l-30 40 30 40h-150z" fill="#C8352B"/>`,
    kidsX:16, leaves:true,
    intro:()=>[["k",1,"إحنا فوگ كل شي! شوفي البلدة كلها."],["y",2,"وهذا قلب ساعة الخريف. بيه أربع أماكن، كل مكان بلون ترس."],["saadoun",1,"لحگتكم! (يلهث) …ركّبوا كل ترس بمكانه، وبعدين اختاروا أول لحن تدقّه الساعة."]],
    puzzle:{title:"ركّبوا التروس وشغّلوا الساعة", done:()=>flag("clockRestored"),
      run:(ctx, solved)=>{ let sel=null; const keys=Object.keys(GEARS);
        const draw=()=>{ const placed=keys.filter(k=>WS.flags["sock_"+k]);
          ctx.open(`<h3>قلب ساعة الخريف</h3><p>اختاروا ترس، بعدين المكان اللي بنفس لونه.</p><div class="sockets">${keys.map(k=>`<button class="sock ${WS.flags["sock_"+k]?"full":""}" data-s="${k}" style="--c:${GEARS[k].c}" aria-label="مكان ${GEARS[k].n}">${WS.flags["sock_"+k]?ART.gear(GEARS[k].c):""}</button>`).join("")}</div><div class="tray">${keys.filter(k=>!WS.flags["sock_"+k]).map(k=>`<button class="tray-g ${sel===k?"sel":""}" data-g="${k}">${ART.gear(GEARS[k].c)}<small>${GEARS[k].n}</small></button>`).join("")}</div><p class="d-note">${placed.length} من 4</p>`);
          $$("[data-g]",ctx.task).forEach(b=>b.onclick=()=>{ sel=b.dataset.g; Sound.soft(); draw(); });
          $$("[data-s]",ctx.task).forEach(b=>b.onclick=()=>{ if(!sel) return; if(b.dataset.s===sel){ WS.flags["sock_"+sel]=true; saveWorld(); Sound.chime(); sel=null; if(keys.every(k=>WS.flags["sock_"+k])){ setTimeout(()=>{ ctx.close(); song(); }, 400); return; } } else { Sound.bump(); toast("اللون ما يطابق","bulb"); } draw(); });
        };
        const song=()=>ctx.say([{ask:"شنو أول لحن تدقّه ساعة الخريف؟", who:"saadoun", opts:[
          {t:"لحن الأوراق الهادي", pick:()=>{ WS.song="leaves"; }}, {t:"ضحكة "+CONFIG.guestName+" (لحن يرقّص)", pick:()=>{ WS.song="sumo"; }}, {t:"أغنية "+heroName()+" من الغابة", pick:()=>{ WS.song="elaf"; }}]}], ()=>{ saveWorld(); solved(); });
        draw(); },
      reward:(ctx)=>finale(ctx)},
    objective:()=> flag("clockRestored") ? "الساعة تشتغل. الخريف رجع يمشي: نهار وليل." : "ركّبوا التروس الأربعة بقلب الساعة."
  },

  balcony:{
    cam:[.5,.5,1], focusX:.5, tint:"linear-gradient(180deg,rgba(0,0,0,0) 60%,rgba(30,20,10,.45))",
    props:()=>P.rail(700),
    kidsX:10, motes:false,
    intro:()=>[["y",1,"من هنا نشوف العالم كله!"],["k",1,"حتى المحطة المهجورة والحديقة المخفية… وغابة "+heroName()+" هناك ورا الأوراق."]],
    spots:()=>[{x:80,y:62,label:"المنظار",art:()=>`<svg viewBox="0 0 60 60"><path d="M10 44l30-22" stroke="#3A2A1C" stroke-width="12" stroke-linecap="round"/><circle cx="44" cy="20" r="9" fill="#8EC3CF" stroke="#3A2A1C" stroke-width="4"/><path d="M24 40l-8 16M24 40l8 16" stroke="#3A2A1C" stroke-width="4"/></svg>`,w:62,on:telescope},
      {x:22,y:62,label:"طوابع وبطاقات",art:()=>ART.ticket(),w:60,on:(ctx)=>postcard(ctx)}],
    objective:()=> "المنظار يدلّكم على الأشياء الباقية، والطوابع تسوي بطاقة بريد من اللوحة."
  }
};
/* غرفة دفترنا: غرفة دافية بشبّاك خريفي — كل شي بيها يفتح نشاط (بدل شبكة بطاقات) */
ROOMS.study = {
  bg:()=>wallBg("#7A4A30","#3A2418")+floorBg(700,"#6B4A2E","#3A2418"),
  props:()=>`<g transform="translate(560 70)"><rect x="-20" y="-20" width="520" height="460" rx="20" fill="#5A3A24" stroke="#C99A3C" stroke-width="10"/>${P.rectView(0,0,480,420,.5,.45,1.6,"study").replace(/rx="240" ry="240"/,'rx="16" ry="16"')}<path d="M240 0v420M0 210h480" stroke="#5A3A24" stroke-width="14"/><path d="M-40 -30h560" stroke="#7A2E2A" stroke-width="22" stroke-linecap="round"/><path d="M-20 -24c40 160 30 300 -10 460M500 -24c-40 160-30 300 10 460" fill="none" stroke="#9B3B2E" stroke-width="40" opacity=".85"/></g>
    ${P.shelf(30,140,220,520,5)}
    <g transform="translate(300 300)"><path d="M0 400L60 0M180 400L120 0M90 0V420" stroke="#6B4A2E" stroke-width="14" stroke-linecap="round"/><rect x="10" y="40" width="160" height="200" fill="#FFFBEF" stroke="#8C6A48" stroke-width="6"/><circle cx="60" cy="110" r="26" fill="#E8C066"/><path d="M30 200q40-50 120-30" stroke="#5B7F4A" stroke-width="10" fill="none"/></g>
    <g transform="translate(860 560)"><rect width="520" height="40" rx="8" fill="#8C6A48" stroke="#3A2418" stroke-width="6"/><path d="M30 40v200M490 40v200" stroke="#6B4A2E" stroke-width="22"/><path d="M120 -10l90-30 90 30v20H120z" fill="#7A2E2A" stroke="#3A1E14" stroke-width="5"/>${P.candle(440,0)}</g>
    <g transform="translate(560 640)"><ellipse cx="120" cy="20" rx="140" ry="30" fill="#A07A50" stroke="#3A2418" stroke-width="6"/><path d="M120 50v120" stroke="#6B4A2E" stroke-width="20"/></g>
    <g transform="translate(1180 120)"><rect width="300" height="220" rx="8" fill="#C9A47A" stroke="#6B4A2E" stroke-width="10"/>${[[20,20,"#FBF3E2"],[120,30,"#F1DDB0"],[210,16,"#FBF3E2"],[40,120,"#FBF3E2"],[150,120,"#F1DDB0"]].map(([x,y,c],i)=>`<rect x="${x}" y="${y}" width="80" height="70" fill="${c}" transform="rotate(${i%2?4:-4} ${x+40} ${y+35})" stroke="#8C6A48" stroke-width="2"/><circle cx="${x+40}" cy="${y+4}" r="6" fill="#B5482A"/>`).join("")}</g>
    <g transform="translate(1400 420)"><rect width="110" height="150" rx="10" fill="#B5482A" stroke="#5A1E14" stroke-width="6"/><rect x="20" y="30" width="70" height="12" rx="4" fill="#2B1C17"/><path d="M55 150v130" stroke="#3A2418" stroke-width="14"/></g>
    ${hasReward("decor_garland")?`<path d="M40 40Q800 160 1560 40" fill="none" stroke="#6E4A22" stroke-width="4"/>${Array.from({length:14},(_,i)=>`<g transform="translate(${80+i*105} ${60+Math.sin(i/13*Math.PI)*90}) scale(1.4)">${ART.maple(["#C8552B","#D9A53A","#B33A26"][i%3]).replace(/<\/?svg[^>]*>/g,"")}</g>`).join("")}`:""}
    ${hasReward("decor_clock")?`<g transform="translate(1110 60) scale(1.6)">${clockSVG(9,0).replace(/<\/?svg[^>]*>/g,"")}</g>`:""}
    ${hasReward("acc_lantern")?`<g transform="translate(900 470) scale(1.8)">${ART.lantern(true).replace(/<\/?svg[^>]*>/g,"")}</g>`:""}
    ${hasItem("feather")?`<g transform="translate(1300 450) scale(1.6)">${ART.feather().replace(/<\/?svg[^>]*>/g,"")}</g>`:""}
    ${WS.tickets.length>=5?`<g transform="translate(1210 380)"><rect width="150" height="100" fill="#C99A3C" stroke="#6E4A22" stroke-width="6"/><g transform="translate(15 15) scale(2)">${ART.ticket().replace(/<\/?svg[^>]*>/g,"")}</g></g>`:""}
    ${hasReward("medal_clock")?`<g transform="translate(490 130)"><path d="M0 0l20 50 20-50" fill="#B5482A"/><circle cx="20" cy="70" r="28" fill="#E8C066" stroke="#8C6A2A" stroke-width="5"/><g transform="translate(4 54) scale(.4)">${clockSVG(12,0).replace(/<\/?svg[^>]*>/g,"")}</g></g>`:""}
    ${flag("hatReturned")?`<g transform="translate(100 60)"><rect width="120" height="90" fill="#FBF3E2" stroke="#C99A3C" stroke-width="8"/><g transform="translate(20 6) scale(.4)">${ART.sumo("happy").replace(/<\/?svg[^>]*>/g,"")}</g></g>`:""}`,
  kidsX:44, motes:true,
  intro:()=>[["y",1,"غرفة دفترنا! دافية، والشبّاك يطل على القلعة."],["k",1,"كل شي هنا يشتغل: الدفتر، المرسم، صندوق الرسائل، وطاولة الرسم المشترك."],["y",2,"وبين الكتب القديمة… شي ورق مطوي؟"]],
  spots:()=>[
    {x:64,y:60,label:"المذكرات",art:()=>ART.book("#7A2E2A"),w:58,on:()=>go("diary")},
    {x:24,y:44,label:"المرسم",art:()=>ART.studio(),w:62,on:()=>go("paint")},
    {x:91,y:54,label:"صندوق الرسائل",art:()=>ART.letter(),w:52,on:()=>letterBox()},
    {x:43,y:70,label:"رسم مشترك",art:()=>ART.butterfly("#E9A79E","#E8C066"),w:56,on:()=>go("draw")},
    {x:83,y:26,label:"قوالب الرسم",art:()=>`<svg viewBox="0 0 60 60"><rect x="8" y="8" width="44" height="44" fill="#FBF3E2" stroke="#8C6A48" stroke-width="3"/><path d="M14 20h32M14 30h24M14 40h28" stroke="#3E6FA0" stroke-width="2"/></svg>`,w:52,on:templatesBox},
    {x:52,y:30,label:"معرض رسومات الحكايات",on:galleryBox},
    {x:10,y:42,label:"كتب قديمة",hide:()=>flag("clueRead"),cls:"faint",art:()=>ART.letter(),on:(ctx)=>{ modal(`<div class="letter">«يا سعدون الصغير،\nإذا ضعت بالقلعة، دوّر اللوحة اللي بيها أربع سماوات… وراها ممر يوصل لقلب الوقت.\n— جدّتك»</div><p class="d-note">انكشف «الممر خلف اللوحة» على الخريطة.</p>`); giveItem("clue"); setFlag("clueRead"); ctx.refresh(); }}
  ],
  actions:()=>[{l:"المذكرات",hot:true,run:()=>go("diary")},{l:"المرسم",run:()=>go("paint")},{l:"رسم مشترك",run:()=>go("draw")}],
  objective:()=> "المذكرات والرسومات تنحفظ على هذا الجهاز فقط، وما نجمع أي بيانات. التنزيل كصورة من المرسم."
};
function templatesBox(){ const md=modal(`<h2>قوالب للرسم</h2><div class="br-tpls">${Object.entries(TEMPLATES).map(([k,n])=>`<button class="br-tpl" data-t="${k}"><canvas width="160" height="120" data-prev="${k}"></canvas><span>${n}</span></button>`).join("")}</div>`,{wide:true}); $$("[data-prev]",md.el).forEach(c=>drawTemplate(c.getContext("2d"),160,120,c.dataset.prev)); $$("[data-t]",md.el).forEach(b=>b.onclick=()=>{ md.close(); go("paint:"+b.dataset.t); }); }
function galleryBox(){ const gal=Store.get("talesArt",[]); modal(`<h2>معرض رسومات الحكايات</h2>${gal.length?`<div class="br-gal">${gal.map(g=>`<figure><img src="${g.art}" alt="رسمة"><figcaption>${esc(g.t)}${g.line?" — "+esc(g.line):""}</figcaption></figure>`).join("")}</div>`:`<p>المعرض فاضي. الرسومات اللي ترسمونها بالحكايات تتعلّق هنا.</p>`}`,{wide:true}); }
function checkHidden(ctx){ const all=["hf_hat","hf_bug","hf_rabbit","hf_moon"].every(f=>flag(f)||(f==="hf_hat"&&(hasItem("sumoHat")||flag("hatReturned")))); if(all && !flag("hiddenFound")){ setFlag("hiddenFound"); grantReward("wings_petals"); addStars(3,"أسرار الحديقة المخفية"); confetti(); } ctx.refresh(); }
function telescope(){
  const leaves=LEAF_SPOTS.map((s,i)=>({...s,i})).filter(s=>!WS.leaves.includes(s.i)), notes=NOTE_SPOTS.map((s,i)=>({...s,i})).filter(s=>!WS.notes.includes(s.i));
  const where=at=>at==="map"?"على الخريطة":NODES[at].name+(nodeOpen(at)?"":" (مقفول بعد)");
  modal(`<h2>المنظار</h2><p>يقين تشوف بالمنظار…</p><ul class="q-sub">${leaves.map(s=>`<li>${ART.maple("#E8C066")} ورقة نادرة — ${esc(where(s.at))}</li>`).join("")}${notes.map(s=>`<li>${ART.letter()} رسالة — ${esc(where(s.at))}</li>`).join("")}${WS.lamps.length<5?`<li>${ART.lantern(false)} ${5-WS.lamps.length} فوانيس مطفية على الدروب</li>`:""}</ul>${!leaves.length&&!notes.length?"<p>ماكو شي مخفي بعد. عاشت عيونكم!</p>":""}`);
}
function postcard(ctx){
  const frames={gold:["#C99A3C","#6E4A22"],wood:["#8C6A48","#3A2A1C"],leaf:["#B33A26","#5A1E14"]};
  const md=modal(`<h2>بطاقة بريد من القلعة</h2><canvas class="pc-cv" width="900" height="600"></canvas>
    <div class="field"><label>الإطار</label><div class="seg" data-f>${Object.keys(frames).map(k=>`<button data-v="${k}">${{gold:"ذهبي",wood:"خشب",leaf:"أوراق"}[k]}</button>`).join("")}</div></div>
    <div class="field"><label>الطابع</label><div class="seg" data-st><button data-v="clock">ساعة</button><button data-v="leaf">ورقة</button><button data-v="ticket">تذكرة</button></div></div>
    <div class="field"><label for="pcm">رسالة قصيرة</label><input id="pcm" maxlength="40" placeholder="سلامات من قلعة الخريف!"></div>
    <div class="row"><button class="btn honey" data-dl>${IC.save} حفظ البطاقة PNG</button></div><p class="d-note">اللوحة تنرسم كاملة داخل الإطار بدون أي تغيير عليها.</p>`, {wide:true});
  let fr="gold", stp="clock"; const cv=$(".pc-cv",md.el), c=cv.getContext("2d"), img=new Image(); img.src=CASTLE;
  const svgImg=s=>{ const im=new Image(); im.src=svgURL(s); return im; };
  const stamps={clock:svgImg(clockSVG(10,10)), leaf:svgImg(ART.maple("#C8552B")), ticket:svgImg(ART.ticket())};
  const draw=()=>{ const [a,b]=frames[fr]; c.fillStyle=a; c.fillRect(0,0,900,600); c.strokeStyle=b; c.lineWidth=10; c.strokeRect(14,14,872,572); c.fillStyle="#FFF8EA"; c.fillRect(40,40,820,462);
    if(img.complete && img.naturalWidth){ const w=812, hh=w*CASTLE_H/CASTLE_W; c.drawImage(img, 44, 44+(454-hh)/2, w, hh); }
    c.fillStyle="#FFF8EA"; c.fillRect(40,510,820,60); c.fillStyle="#2E2118"; c.font="bold 30px 'Aref Ruqaa', serif"; c.textAlign="center"; c.direction="rtl"; c.fillText(($("#pcm",md.el).value||"سلامات من قلعة الخريف!"), 430, 550);
    const s=stamps[stp]; c.fillStyle="#FBF3E2"; c.fillRect(770,58,80,90); c.strokeStyle="#B5482A"; c.lineWidth=3; c.setLineDash([6,4]); c.strokeRect(770,58,80,90); c.setLineDash([]); if(s.complete) c.drawImage(s, 780, 70, 60, 60); };
  img.onload=draw; Object.values(stamps).forEach(s=>s.onload=draw);
  const seg=(sel,set,val)=>{ $$(sel+" button",md.el).forEach(b=>{ b.setAttribute("aria-pressed",b.dataset.v===val); b.onclick=()=>{ set(b.dataset.v); $$(sel+" button",md.el).forEach(x=>x.setAttribute("aria-pressed",x===b)); draw(); }; }); };
  seg("[data-f]",v=>fr=v,fr); seg("[data-st]",v=>stp=v,stp); $("#pcm",md.el).oninput=draw; draw();
  $("[data-dl]",md.el).onclick=()=>{ cv.toBlob(bl=>offerDownload("بطاقة-القلعة.png", bl, ()=>modal(`<img src="${cv.toDataURL()}" style="width:100%" alt="بطاقة بريد">`)), "image/png"); if(!flag("postcard")){ setFlag("postcard"); grantReward("sticker_stamp"); addStars(1,"أول بطاقة بريد"); } };
}

/* ---------- النهاية: الساعة ترجع تدق ---------- */
function finale(ctx){
  const songLine = {leaves:["y",1,"لحن الأوراق… حتى الريح صارت تغني ويّاه."], sumo:["k",1,"الساعة تضحك مثل "+CONFIG.guestName+"! والبلدة كلها ترقص."], elaf:["y",1,"أغنية "+heroName()+"! أكيد سمعتها من غابتها."]}[WS.song] || ["k",1,"دنگ… دنگ!"];
  const lines=[["saadoun",1,"دنگ… دنگ… دنگ! الساعة رجعت تدق!"], songLine, ["k",1,"الشمس نزلت! صار مغرب… وبعدين ليل!"]];
  if(flag("hatReturned")) lines.push(["sumo",1,"وآني أرقص بقبعتي على السطح المجاور!"]);
  if(flag("catBell")) lines.push(["cat",1,"مياو! وجرسي يرن ويه الساعة؛ كل القطارات طلعت بوقتها."]);
  if(talesDone()>=1) lines.push(["owl",1,`هوو… ${talesDone()} حكايات خلصت، وهاي صارت أحلاها.`]);
  if(WS.lamps.length>=5) lines.push(["y",1,"والفوانيس اللي ضوّيناها صارت مثل نجوم على الدروب."]);
  if(flag("lore")) lines.push(["saadoun",0,"جدّتي جانت تگول: «الوقت ما يضيع؛ بس ينتظر أحد يدوّره». إنتو دوّرتوه."]);
  lines.push(["jm",1,`${heroName()} تگول: الغابة صارت إلها ليل ونجوم من جديد. شكراً يا أبطال!`], ["k",1,"يقين… شنو المغامرة الجاية؟"], ["y",2,"يمكن نخلّص كل الحكايات… أو نلعب ويه صديق من بعيد!"]);
  $(".room-stage",ctx.v).classList.add("finale");
  ctx.say(lines, ()=>{ setFlag("clockRestored"); setFlag("night"); grantReward("medal_clock"); grantReward("decor_clock"); addStars(5, "ساعة الخريف رجعت تدق"); checkQuestRewards(); confetti(); ctx.refresh();
    modal(`<div class="tour-body"><div class="win-kids">${faceHTML("k",1,66)}${faceHTML("y",1,66)}</div><div><h2>ساعة الخريف رجعت تدق!</h2><p style="margin:0">خلّصتوا المهمة الرئيسية. هسه الخريطة بيها ليل ونهار، وأجنحة التروس انفتحت بقصر الأزياء.</p></div></div><div class="row"><button class="btn honey" data-w>${IC.map} شوفوا الخريطة بالليل</button></div>`).el.querySelector("[data-w]").onclick=()=>{ $$(".scrim").forEach(x=>x.remove()); go("world"); }; });
}

Object.assign(ROUTES, { room:{view:(r,id)=>viewRoom(r,id), title:id=>NODES[id]?NODES[id].name:"", parent:"world"} });
