/* =====================================================================
   غرف وأماكن جانبية — كل مكان بيه شخصية أو لغز أو قطعة قصة أو مكافأة.
   كل المشاهد مرسومة SVG بألوان الهوية الهادئة (صنوبري، عاجي، مريمي، نحاسي، مرجاني).
   لوحة القلعة الأصلية ما تصير خلفية دائمة: تنعرض بس بمشهد خاص بالمرصد وبالمقدمة.
   ===================================================================== */
const PAL = {pine:"#203A35", pine2:"#2A4A43", pine3:"#16302B", ivory:"#F5F0E3", ivory2:"#EAE3D2", sage:"#A8B9A0", sage2:"#6E8A6A", copper:"#B88A5A", coral:"#C97964", ink:"#26342F", wood:"#6F5E4C", wood2:"#4D4237", amber:"#E8B05C"};
const BOOKS = ["#C97964","#2F5E57","#B88A5A","#6E8A6A","#A8B9A0","#8E6E5A","#D7B58C"];
const P = {
  shelf:(x,y,w,hh,seed=1)=>{ let s=`<rect x="${x}" y="${y}" width="${w}" height="${hh}" rx="6" fill="${PAL.wood2}" stroke="${PAL.ink}" stroke-width="4"/>`; const rows=Math.max(1,Math.floor(hh/120)); for(let r=0;r<rows;r++){ const yy=y+16+r*(hh-20)/rows, bh=(hh-20)/rows-24; let xx=x+12, i=0; while(xx<x+w-30){ const bw=18+((i*7+seed*13+r*5)%16); s+=`<rect x="${xx}" y="${yy+((i*5)%12)}" width="${bw}" height="${bh-((i*5)%12)}" rx="3" fill="${BOOKS[(i+r+seed)%7]}" stroke="${PAL.ink}" stroke-width="2"/><path d="M${xx+4} ${yy+20} h${bw-8}" stroke="${PAL.ivory}" stroke-width="2" opacity=".45"/>`; xx+=bw+3; i++; } s+=`<rect x="${x}" y="${yy+bh}" width="${w}" height="12" fill="${PAL.wood}" stroke="${PAL.ink}" stroke-width="2.5"/>`; } return s; },
  candle:(x,y)=>`<g><circle cx="${x}" cy="${y-30}" r="40" fill="rgba(232,176,92,.16)"/><rect x="${x-7}" y="${y-22}" width="14" height="30" rx="3" fill="${PAL.ivory}" stroke="${PAL.copper}" stroke-width="2"/><path class="flame" d="M${x} ${y-44}c8 10 6 18 0 20c-6-2-8-10 0-20z" fill="${PAL.amber}" stroke="${PAL.coral}" stroke-width="1.6"/><rect x="${x-16}" y="${y+6}" width="32" height="8" rx="3" fill="${PAL.copper}"/></g>`,
  frame:(x,y,w,hh,inner)=>`<g><rect x="${x-12}" y="${y-12}" width="${w+24}" height="${hh+24}" rx="6" fill="${PAL.copper}" stroke="${PAL.ink}" stroke-width="3"/><svg x="${x}" y="${y}" width="${w}" height="${hh}" viewBox="0 0 100 120" preserveAspectRatio="none">${inner}</svg></g>`,
  gear:(cx,cy,r,c=PAL.copper,cls="spin")=>{ const n=Math.max(8,Math.round(r/9)); let t=""; for(let i=0;i<n;i++) t+=`<rect x="${-r*.14}" y="${-r-r*.18}" width="${r*.28}" height="${r*.36}" rx="${r*.05}" transform="rotate(${i*360/n})"/>`; return `<g transform="translate(${cx} ${cy})"><g class="${cls}" fill="${c}" stroke="${PAL.ink}" stroke-width="${Math.max(2,r/26)}">${t}<circle r="${r}"/><circle r="${r*.62}" fill="none" stroke="rgba(0,0,0,.18)"/><circle r="${r*.2}" fill="${PAL.ink}"/></g></g>`; },
  pipe:d=>`<path d="${d}" fill="none" stroke="${PAL.ink}" stroke-width="30" stroke-linecap="round" opacity=".8"/><path d="${d}" fill="none" stroke="#8C8A7C" stroke-width="18" stroke-linecap="round"/><path d="${d}" fill="none" stroke="rgba(255,255,255,.18)" stroke-width="5" stroke-linecap="round"/>`,
  vine:(d,c=PAL.sage2)=>`<path d="${d}" fill="none" stroke="${c}" stroke-width="10" stroke-linecap="round"/>${d.match(/[\d.]+ [\d.]+/g).slice(1).map((p,i)=>{ const [x,y]=p.split(" ").map(Number); return `<ellipse cx="${x}" cy="${y}" rx="18" ry="9" transform="rotate(${i*47%180} ${x} ${y})" fill="${[PAL.sage2,PAL.sage,PAL.coral][i%3]}"/>`; }).join("")}`,
  flowers:(x,y,n=7,s=1)=>{ let o=""; for(let i=0;i<n;i++){ const fx=x+(i*53%140)-70, fy=y+(i*37%40)-20, c=["#E3B3A6",PAL.ivory,"#D7B58C",PAL.coral,"#C9C3DA"][i%5]; o+=`<g transform="translate(${fx} ${fy}) scale(${s})"><path d="M0 0v40" stroke="${PAL.sage2}" stroke-width="4"/>${[0,72,144,216,288].map(a=>`<ellipse cx="0" cy="-10" rx="7" ry="11" transform="rotate(${a})" fill="${c}" stroke="rgba(0,0,0,.15)" stroke-width="1"/>`).join("")}<circle r="5" fill="${PAL.copper}"/></g>`; } return o; },
  lamp:(x,y,on=true)=>`<g><path d="M${x} ${y}v220" stroke="${PAL.ink}" stroke-width="10"/>${on?`<circle cx="${x}" cy="${y-20}" r="60" fill="rgba(232,176,92,.22)"/>`:""}<path d="M${x-22} ${y-50}h44l-6 50h-32z" fill="${on?PAL.amber:"#8C8A7C"}" stroke="${PAL.ink}" stroke-width="4"/><path d="M${x-28} ${y-50}l28-24 28 24z" fill="${PAL.ink}"/></g>`,
  steam:(x,y)=>`<g class="steam" style="transform-origin:${x}px ${y}px"><circle cx="${x}" cy="${y}" r="22" fill="rgba(255,255,255,.35)"/><circle cx="${x+18}" cy="${y-24}" r="16" fill="rgba(255,255,255,.28)"/><circle cx="${x-10}" cy="${y-48}" r="12" fill="rgba(255,255,255,.2)"/></g>`,
  rails:(y)=>`<rect x="0" y="${y}" width="1600" height="${900-y}" fill="#8F8A78"/>${Array.from({length:20},(_,i)=>`<rect x="${i*84}" y="${y+60}" width="24" height="80" rx="3" fill="${PAL.wood}"/>`).join("")}<path d="M0 ${y+70}H1600M0 ${y+124}H1600" stroke="${PAL.ink}" stroke-width="10"/>`,
  castle:(x,y,s=1,c=PAL.pine2)=>`<g transform="translate(${x} ${y}) scale(${s})" fill="${c}" opacity=".55"><rect x="-120" y="-80" width="240" height="80"/><rect x="-150" y="-150" width="50" height="150"/><rect x="100" y="-140" width="50" height="140"/><rect x="-30" y="-210" width="60" height="210"/><path d="M-160-150l35-50 35 50zM90-140l35-46 35 46zM-40-210l40-60 40 60z"/><circle cx="0" cy="-150" r="16" fill="${PAL.ivory}" opacity=".7"/></g>`,
  cloud:(x,y,s=1)=>`<g transform="translate(${x} ${y}) scale(${s})" fill="${PAL.ivory}" opacity=".7"><ellipse cx="0" cy="0" rx="70" ry="24"/><ellipse cx="-34" cy="-14" rx="34" ry="24"/><ellipse cx="22" cy="-20" rx="40" ry="28"/></g>`
};
const wallBg = (a,b) => `<defs><linearGradient id="wl" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient><radialGradient id="glowc" cx=".5" cy=".4" r=".7"><stop offset="0" stop-color="rgba(245,240,227,.22)"/><stop offset="1" stop-color="rgba(0,0,0,0)"/></radialGradient></defs><rect width="1600" height="900" fill="url(#wl)"/><rect width="1600" height="900" fill="url(#glowc)"/>`;
const floorBg = (y,c1,c2) => `<path d="M0 ${y}H1600V900H0Z" fill="${c1}"/>${Array.from({length:12},(_,i)=>`<path d="M${i*150-200} 900L${i*140+60} ${y}" stroke="${c2}" stroke-width="3" opacity=".45"/>`).join("")}<path d="M0 ${y}H1600" stroke="rgba(0,0,0,.25)" stroke-width="6"/>`;
// مشهد خارجي هادئ: سماء، تلال ناعمة، وظل القلعة البعيد (رسم، مو اللوحة)
const outBg = (s1,s2,h1,h2,g,opts={}) => `<defs><linearGradient id="sk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${s1}"/><stop offset="1" stop-color="${s2}"/></linearGradient></defs><rect width="1600" height="900" fill="url(#sk)"/>${opts.stars?Array.from({length:40},(_,i)=>`<circle cx="${(i*197)%1600}" cy="${(i*83)%380+20}" r="${1.5+(i%3)}" fill="${PAL.ivory}" opacity="${.4+(i%4)*.15}"/>`).join(""):`${P.cloud(260,140,1.2)}${P.cloud(1220,110,1)}`}${opts.castle===false?"":P.castle(opts.cx||1240, 520, opts.cs||1)}<path d="M0 520Q260 440 520 500T1060 470T1600 500V900H0Z" fill="${h1}"/><path d="M0 610Q300 550 640 600T1280 580T1600 600V900H0Z" fill="${h2}"/><rect y="${opts.ground||700}" width="1600" height="${900-(opts.ground||700)}" fill="${g}"/>`;
const SKY = {dawn:["#E3B3A6","#F5E6D3"], noon:["#A9C6C8","#EAF0EC"], sunset:["#C97964","#E9C9A6"], night:["#203A35","#3B5C54"]};
const skyFrame = (k, hh, mm) => `<rect width="100" height="120" fill="${SKY[k][0]}"/><rect y="60" width="100" height="60" fill="${SKY[k][1]}"/>${k==="night"?'<circle cx="74" cy="22" r="10" fill="#F5F0E3"/><circle cx="20" cy="18" r="2" fill="#fff"/><circle cx="40" cy="30" r="1.6" fill="#fff"/>':k==="dawn"?'<circle cx="50" cy="66" r="14" fill="#F3D3B0"/>':k==="sunset"?'<circle cx="30" cy="60" r="16" fill="#E8B05C"/>':'<circle cx="70" cy="22" r="13" fill="#F5F0E3"/>'}<path d="M0 96Q50 80 100 96V120H0z" fill="#4D4237"/><g transform="translate(30 70) scale(.5)">${clockSVG(hh,mm).replace(/<\/?svg[^>]*>/g,"")}</g>`;
const strip = s => s.replace(/<\/?svg[^>]*>/g,"");

/* ---------- محرك الغرف ---------- */
function viewRoom(root, id){
  const R = ROOMS[id]; if(!R || !nodeOpen(id)){ go("world"); return; }
  const firstVisit = !WS.flags["room_"+id];
  const v = h(`<section class="view room room-${id}">
    <div class="mapscroll"><div class="mapscene room-stage">
      <svg class="room-art" viewBox="0 0 1600 900" preserveAspectRatio="none" aria-hidden="true">${R.bg?R.bg():""}${R.props?R.props():""}</svg>
      <div class="room-tint" style="${R.tint?`background:${R.tint}`:""}"></div>
      <div data-spots></div>
      ${LEAF_SPOTS.map((s,i)=>s.at===id?leafHTML(i,s):"").join("")}
      ${NOTE_SPOTS.map((s,i)=>s.at===id?noteHTML(i,s):"").join("")}
      ${R.npc?`<button class="room-npc" data-talk style="left:${R.npc.x}%;bottom:${R.npc.b||8}%;height:${R.npc.h||34}%" aria-label="كلّموا ${esc(NPCS[R.npc.id].name())}">${npcHTML(R.npc.id, "idle")}</button>`:""}
      <div class="room-kids" style="left:${R.kidsX||14}%">${kidFigure("k")}${kidFigure("y")}</div>
      ${R.motes===false?"":`<div class="ambient" aria-hidden="true">${motionOK()&&!lowPower?Array.from({length:6},()=>`<span class="ffly mote" style="left:${10+Math.random()*80}%;top:${15+Math.random()*60}%;animation-delay:${-Math.random()*6}s,${-Math.random()*3}s"></span>`).join(""):""}</div>`}
      ${R.leaves?leafLayer(lowPower?2:4,"soft"):""}
    </div></div>
    <div class="room-ui panel"><span class="ru-ic">${placeIcon(id)}</span><div><b>${esc(placeName(id))}</b><p data-obj></p></div></div>
    <div class="map-ui room-bar" data-bar></div>
    <div class="tale-task panel room-task" data-task hidden></div>
  </section>`);
  root.appendChild(v);
  const stage=$(".room-stage",v), scroll=$(".mapscroll",v), task=$("[data-task]",v), kidsEl=$(".room-kids",v);
  // على الشاشات الضيقة المشهد ينسحب يمين ويسار؛ نبدي من مكان خباب ويقين
  requestAnimationFrame(()=>{ const extra=stage.scrollWidth-scroll.clientWidth; if(extra<=0) return; scroll.scrollLeft = R.focusX!=null ? extra*R.focusX : Math.max(0, stage.scrollWidth*(R.kidsX||14)/100 - scroll.clientWidth*.25); });
  const ctx = {
    id, v, task, stage,
    say:(lines, done)=>dialogue(v, lines, done),
    walk:(x, done)=>walkKids(kidsEl, x, done),
    open:html=>{ task.hidden=false; task.innerHTML=`<button class="ibtn task-x" aria-label="إغلاق">${IC.close}</button>`+html; $(".task-x",task).onclick=()=>{ task.hidden=true; }; return task; },
    close:()=>{ task.hidden=true; task.innerHTML=""; },
    refresh:()=>{ drawSpots(); drawBar(); obj(); const art=$(".room-art",v); if(art && ctx._drawn) art.innerHTML=(R.bg?R.bg():"")+(R.props?R.props():""); ctx._drawn=true; const tk=$("[data-talk]",v); if(tk && ctx._npcDrawn) tk.innerHTML=npcHTML(R.npc.id,"idle"); ctx._npcDrawn=true; },
    cheer:()=>{ $$(".kidfig",kidsEl).forEach(k=>kidAct(k,"happy")); }
  };
  const obj=()=>{ $("[data-obj]",v).textContent = R.objective ? R.objective() : PLACES[id].desc; };
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
  const met=()=>{ if(R.npc){ const k={saadoun:"metSaadoun",cat:"metCat",narjis:"metNarjis",owl:"metOwl",shawka:"metShawka",siraj:"metSiraj"}[R.npc.id]; if(k) setFlag(k); } };
  // المقدمة تنحسب «انشافت» بس لما تخلص، حتى لو انسدت الصفحة بالنص ترجع تطلع
  const seen=()=>{ WS.flags["room_"+id]=true; saveWorld(); met(); ctx.refresh(); };
  if(firstVisit){ if(R.intro) setTimeout(()=>{ if(document.body.contains(v)) ctx.say(R.intro(ctx), seen); }, motionOK()?700:100); else seen(); }
  const off = Party.connected() ? Party.on("room", m=>{ if(m.id===id && m.ev==="refresh") ctx.refresh(); }) : null;
  return ()=>{ off && off(); };
}
// مشي مجموعة الأطفال داخل المشهد: نفس منحنى ونطّات المشي على الخريطة
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
  const draw=()=>{ ctx.open(`<h3>${esc(title)}</h3><p>${esc(text)}</p><div class="gears">${g.map((r,i)=>`<button class="gearbtn ${r===target[i]?"ok":""}" data-i="${i}" aria-label="ترس ${i+1}"><span style="transform:rotate(${(r-target[i])*90}deg)">${ART.gear([PAL.copper,"#8E6E5A","#D7B58C","#C77B3A"][i])}<i></i></span></button>`).join("")}</div><p class="d-note">${g.filter((r,i)=>r===target[i]).length} من ${n} بمكانها</p>`);
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
// ترتيب الأغراض بأماكنها: اختاروا غرض، بعدين مكانه
function puzzleMatch(ctx, solved, {title, text, items, places}){
  let sel=null; const put={};
  const draw=()=>{ ctx.open(`<h3>${esc(title)}</h3><p>${esc(text)}</p><div class="tray">${items.filter(it=>!put[it.k]).map(it=>`<button class="tray-g ${sel===it.k?"sel":""}" data-g="${it.k}">${it.art()}<small>${esc(it.n)}</small></button>`).join("")}</div><div class="match-places">${places.map(p=>`<button class="mp ${Object.values(put).includes(p.k)?"full":""}" data-p="${p.k}">${p.art()}<small>${esc(p.n)}</small></button>`).join("")}</div><p class="d-note">${Object.keys(put).length} من ${items.length} بمكانها</p>`);
    $$("[data-g]",ctx.task).forEach(b=>b.onclick=()=>{ sel=b.dataset.g; Sound.soft(); draw(); });
    $$("[data-p]",ctx.task).forEach(b=>b.onclick=()=>{ if(!sel){ toast("اختاروا غرض أول","bulb"); return; } const it=items.find(x=>x.k===sel); if(it.to===b.dataset.p){ put[sel]=b.dataset.p; Sound.chime(); sel=null; if(Object.keys(put).length===items.length){ draw(); setTimeout(solved,400); return; } } else { Sound.bump(); toast(it.miss||"مو مكانه… فكّروا وين ينحط","bulb"); } draw(); });
  };
  draw();
}

/* ---------- الأماكن ---------- */
const ROOMS = {
  /* ===== ورشة الساعات ===== */
  workshop:{
    bg:()=>wallBg("#3B4F48","#22332D")+floorBg(740,PAL.wood,PAL.wood2),
    props:()=>`<g transform="translate(800 360)"><circle r="250" fill="${PAL.ivory2}" stroke="${PAL.copper}" stroke-width="14"/><circle r="226" fill="none" stroke="${PAL.ink}" stroke-width="3" opacity=".4"/>${Array.from({length:12},(_,i)=>`<path d="M0 -224v34" stroke="${PAL.ink}" stroke-width="9" transform="rotate(${i*30})"/>`).join("")}<path d="M0 0V-170" stroke="${PAL.ink}" stroke-width="16" stroke-linecap="round" transform="rotate(${flag("clockRestored")?0:-60})"/><path d="M0 0V-120" stroke="${PAL.coral}" stroke-width="20" stroke-linecap="round" transform="rotate(${flag("clockRestored")?0:150})"/><circle r="20" fill="${PAL.copper}"/></g>
      ${P.gear(200,620,120,"#8E6E5A",flag("towerFixed")?"spin":"")}${P.gear(1400,600,140,PAL.copper,flag("towerFixed")?"spin-r":"")}${P.gear(1250,760,70,"#C77B3A",flag("towerFixed")?"spin":"")}
      <g transform="translate(1080 660)"><rect width="360" height="30" rx="6" fill="${PAL.wood}" stroke="${PAL.ink}" stroke-width="4"/><path d="M30 30v120M330 30v120" stroke="${PAL.wood2}" stroke-width="18"/><g transform="translate(60 -40) scale(1.2)">${strip(ART.lantern(true))}</g><g transform="translate(230 -30) scale(.8)">${strip(ART.gear("#D7B58C"))}</g></g>`,
    npc:{id:"saadoun", x:70, b:8, h:38}, kidsX:22,
    intro:()=>[["saadoun",0,"أهلاً أهلاً! انتبهوا للتروس. آني العم سعدون، صانع ساعة القلعة."],["saadoun",0,"الساعة وقفت يوم بدا الخريف، فالشمس علگت بين العصر والمغرب."],["k",1,"إحنا نصلّحها! شنو نسوي؟"],{ask:"العم سعدون: «شلون تحبون نبدي؟»", who:"saadoun", opts:[{t:"خباب: آني أدوّر التروس هسه!", pick:()=>setFlag("towerWay","rush"), then:[["saadoun",1,"حماس! بس على كيفك، كل ترس إله علامة لازم تقابل السهم."]]},{t:"يقين: نقرا دفترك أول", pick:()=>setFlag("towerWay","read"), then:[["saadoun",1,"شاطرة! الدفتر يگول: العلامات تقابل الأسهم، وبعدين ينفتح باب غرفة التروس."]]}]},["saadoun",0,"وبعدها نحتاج أربع تروس ذهبية ضاعت من زمان. جدّتي خبّتها بأماكن ناسها."]],
    talk:()=>[["saadoun",0,npcLine("saadoun")]].concat(flag("lore")&&!flag("loreTold")?[["saadoun",1,"رسالة جدّتي! «الوقت ما يضيع؛ بس ينتظر أحد يدوّره»… جانت تحچيلي هاي وآني صغير."]]:[]),
    spots:()=>[{x:12,y:38,label:"دفتر العم سعدون",art:()=>ART.book("#8E6E5A"),w:56,on:inspect([["y",2,"مرسوم بالدفتر: ورشة، غرفة تروس تحتها، وغرفة فوانيس… وسهم يأشّر للمرصد ومكتوب «السطح»."],["k",1,"يعني الساعة الكبيرة نوصللها من المرصد!"]])}],
    puzzle:{title:"دوّروا تروس الورشة", done:()=>flag("towerFixed"),
      run:(ctx, solved)=>puzzleGears(ctx, solved, {title:"تروس الورشة", text:(flag("towerWay")==="read"?"حسب دفتر العم سعدون: ":"")+"دوّروا التروس حتى كل علامة تقابل السهم.", n:3}),
      reward:(ctx)=>{ ctx.say([["saadoun",1,"تك… تك… التروس دارت! باب غرفة التروس انفتح."],["saadoun",0,"بس الساعة بعدها واقفة: تحتاج التروس الذهبية الأربعة. دفتر مهامكم يگول وين ممكن تكون."]], ()=>{ setFlag("towerFixed"); addStars(2,"شغّلتوا تروس الورشة"); ctx.refresh(); }); }},
    actions:()=>[{l:"«جسر الساعة» (ثنائية)",run:()=>go("play:bridge")},{l:"«أوركسترا الساعة» (ثنائية)",run:()=>go("play:orchestra")}],
    objective:()=> !flag("towerFixed") ? "كلّموا العم سعدون ودوّروا تروس الورشة." : WS.gears.length<4 ? `التروس الذهبية: ${WS.gears.length} من 4.` : "اصعدوا لسطح القلعة من المرصد!"
  },

  machine:{
    bg:()=>wallBg("#38433E","#1F2A26")+floorBg(760,"#55564C","#2A2E28"),
    props:()=>`${P.pipe("M0 200H400Q460 200 460 260V700")}${P.pipe("M1600 160H1200Q1140 160 1140 220V520")}${P.pipe("M600 0V120Q600 180 660 180H900")}${P.gear(260,520,150,"#7D7F86","spin")}${P.gear(470,420,80,"#C77B3A","spin-r")}${P.gear(1340,560,170,"#8E6E5A","spin-r")}${P.gear(1120,720,90,PAL.copper,"spin")}${P.steam(460,260)}${P.steam(1140,220)}
      <g transform="translate(700 520)"><rect width="200" height="200" rx="14" fill="${PAL.wood2}" stroke="${PAL.ink}" stroke-width="6"/>${[0,1,2].map(i=>`<path d="M${40+i*60} 170V${80-i*10}" stroke="${PAL.ink}" stroke-width="12" stroke-linecap="round"/><circle cx="${40+i*60}" cy="${70-i*10}" r="16" fill="${PAL.coral}"/>`).join("")}</g>`,
    kidsX:36,
    intro:()=>[["k",1,"واو! تروس بحجم البيت!"],["y",2,"بس السلسلة ناقصة. بين المحرك والساعة أكو ثلاث أماكن فاضية."]],
    spots:()=>[{x:14,y:30,label:"بين الأنابيب",hide:()=>hasItem("bell")||flag("catBell"),on:(ctx)=>{ ctx.say([["y",1,"شي يرن بين الأنابيب… جرس صغير!"],["k",1,"جرس زعفرانة! نرجّعه لرصيف المحطة."]], ()=>{ giveItem("bell"); ctx.refresh(); }); }},
      {x:86,y:22,label:"لوحة نحاس",on:inspect([["y",2,"مكتوب: «كل ترس يدوّر اللي جنبه بالعكس»."],["k",0,"يعني إذا الساعة دارت بالمقلوب، نزيد ترس واحد!"]])}],
    puzzle:{title:"صلّحوا سلسلة التروس", done:()=>WS.gears.includes("copper"),
      run:(ctx, solved)=>{ const sizes={S:"صغير",M:"وسط",L:"كبير",X:"عملاق"}, need=["L","S","M"]; let slot=[null,null,null], sel=null, stage=1, idler=false;
        const draw=()=>{
          ctx.open(`<h3>سلسلة التروس</h3>${stage===1?`<p>اختاروا ترس، بعدين حطّوه بالمكان اللي يناسب حجمه (الدوائر المنقطة).</p>
            <div class="chain">${["محرك",...slot.map((s,i)=>`<button class="peg peg-${need[i]} ${s?"full":""}" data-p="${i}" aria-label="مكان ${i+1}">${s?ART.gear(s===need[i]?"#C77B3A":"#9A9A8C"):""}</button>`),"ساعة"].map(x=>typeof x==="string"&&!x.startsWith("<")?`<span class="chain-end">${x}</span>`:x).join("")}</div>
            <div class="tray">${Object.entries(sizes).map(([k,n])=>`<button class="tray-g g-${k} ${sel===k?"sel":""}" data-g="${k}">${ART.gear("#C77B3A")}<small>${n}</small></button>`).join("")}</div>`
          :`<p>السلسلة تدور! بس سهم الساعة يدور <b>بالمقلوب</b> ↺. شنو نسوي؟</p><div class="chain spinning ${idler?"":"rev"}"><span class="chain-end">محرك</span>${need.map(s=>`<span class="peg peg-${s} full">${ART.gear("#C77B3A")}</span>`).join("")}${idler?`<span class="peg peg-S full">${ART.gear(PAL.copper)}</span>`:""}<span class="chain-end">${idler?"↻":"↺"} ساعة</span></div><div class="row" style="justify-content:center"><button class="btn" data-idle>زيدوا ترس صغير عكّاس</button><button class="btn ghost" data-flip>اقلبوا الساعة</button></div>`}`);
          $$("[data-g]",ctx.task).forEach(b=>b.onclick=()=>{ sel=b.dataset.g; Sound.soft(); draw(); });
          $$("[data-p]",ctx.task).forEach(b=>b.onclick=()=>{ if(!sel){ toast("اختاروا ترس أول","bulb"); return; } const i=+b.dataset.p; slot[i]=sel; Sound.flip(); if(sel!==need[i]){ Sound.bump(); toast("مو قياسه… شوفوا حجم الدائرة","bulb"); } sel=null; if(slot.every((s,j)=>s===need[j])){ stage=2; Sound.chime(); } draw(); });
          const id=$("[data-idle]",ctx.task); if(id) id.onclick=()=>{ idler=true; Sound.chime(); draw(); setTimeout(solved, 900); };
          const fl=$("[data-flip]",ctx.task); if(fl) fl.onclick=()=>{ Sound.bump(); toast("الساعة مثبّتة بالجدار… بس التروس تتغير. شوفوا لوحة النحاس","bulb"); };
        };
        draw(); },
      reward:(ctx)=>{ ctx.say([["k",1,"دارت صح! وطلع ترس نحاس من الصندوق!"],["y",1,"وصوت الورشة صار تك… تك… أقوى."]], ()=>{ giveGear("copper"); ctx.refresh(); }); }},
    objective:()=> WS.gears.includes("copper") ? "ترس النحاس وياكم." + (!hasItem("bell")&&!flag("catBell")?" وشي يرن بين الأنابيب…":"") : "صلّحوا سلسلة التروس بين المحرك والساعة."
  },

  /* غرفة الفوانيس: سِراج يضوّي ترتيب، وإنتو تعيدونه */
  lanternroom:{
    bg:()=>wallBg("#2A3F3A","#16302B")+floorBg(740,"#3E4A43","#22302B"),
    props:()=>`<path d="M0 120Q800 40 1600 120" fill="none" stroke="${PAL.copper}" stroke-width="4" opacity=".6"/>${[0,1,2,3,4].map(i=>`<g transform="translate(${260+i*270} ${flag("lampsLit")?150:170})"><path d="M0 -60v50" stroke="${PAL.copper}" stroke-width="3"/><g transform="translate(-40 -10) scale(2)">${strip(ART.lantern(flag("lampsLit")))}</g></g>`).join("")}${P.shelf(60,420,260,300,6)}${P.candle(1480,730)}`,
    tint:"radial-gradient(ellipse at 50% 30%,rgba(232,176,92,.12),rgba(16,48,43,.35))",
    npc:{id:"siraj", x:78, b:34, h:16}, kidsX:30,
    intro:()=>[["siraj",1,"هاي غرفتي! هنا صحيت أول مرة، بين الفوانيس وتكتكة الساعات."],["k",1,"الفوانيس كلها مطفية!"],["siraj",0,"تضوي بس إذا انشعلت بالترتيب الصحيح. آني أضوّي الترتيب مرة، وإنتو تعيدونه."],["y",2,"يعني لازم نركّز… خباب، إنت احفظ الأولى، وآني الباقي."]],
    talk:()=>[["siraj",0,flag("lampsLit")?"خذوا فانوسي الصغير؛ يضوّي نفق الأوراق بالغابة.":"آني جاهز. اضغطوا «ضوّوا الفوانيس» وركّزوا."]],
    puzzle:{title:"ضوّوا الفوانيس", done:()=>flag("lampsLit"),
      run:(ctx, solved)=>{ const seq=shuffle([0,1,2,3,4]); let pos=0, showing=true;
        const draw=(lit=-1, msg)=>{ ctx.open(`<h3>فوانيس سِراج</h3><p>${msg||"شوفوا سِراج شلون يضوّي الفوانيس، بعدين اضغطوها بنفس الترتيب."}</p><div class="lamps-pz">${[0,1,2,3,4].map(i=>`<button class="lp ${i===lit||(!showing&&seq.slice(0,pos).includes(i))?"on":""}" data-l="${i}" ${showing?"disabled":""} aria-label="فانوس ${i+1}">${ART.lantern(i===lit||(!showing&&seq.slice(0,pos).includes(i)))}</button>`).join("")}</div><div class="row" style="justify-content:center"><button class="btn ghost small" data-replay ${showing?"disabled":""}>${IC.restart} سِراج يعيدها</button></div>`);
          $$("[data-l]",ctx.task).forEach(b=>b.onclick=()=>{ const i=+b.dataset.l; if(showing) return; if(i===seq[pos]){ pos++; Sound.chime(); if(pos===seq.length){ draw(-1,"كلها ضوّت!"); setTimeout(solved,500); return; } draw(); } else { Sound.bump(); pos=0; toast("انطفت… سِراج يعيدها مرة ثانية","bulb"); play(); } });
          const rp=$("[data-replay]",ctx.task); if(rp) rp.onclick=()=>{ pos=0; play(); };
        };
        const play=()=>{ showing=true; let k=0; const d=motionOK()?650:900; draw(-1,"سِراج يضوّي…"); const tick=()=>{ if(!document.body.contains(ctx.task)) return; if(k<seq.length){ draw(seq[k],"سِراج يضوّي…"); Sound.soft(); k++; setTimeout(tick,d); } else { showing=false; draw(); } }; setTimeout(tick,400); };
        play(); },
      reward:(ctx)=>{ ctx.say([["siraj",1,"شوفوا! الغرفة كلها صارت دافية."],["siraj",0,"هذا فانوسي الصغير. خذوه؛ نفق الأوراق بالغابة يحتاج ضوء."],["y",1,"شكراً سِراج! إنت أحلى يرّاعة بالقلعة."]], ()=>{ setFlag("lampsLit"); giveItem("lantern"); checkQuestRewards(); ctx.refresh(); }); }},
    objective:()=> flag("lampsLit") ? "الفوانيس ضوّت، وفانوس سِراج وياكم." : "أعيدوا ترتيب الفوانيس اللي يضوّيه سِراج."
  },

  /* ===== المرصد ===== */
  observatory:{
    bg:()=>`<defs><linearGradient id="obs" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#203A35"/><stop offset="1" stop-color="#3B5C54"/></linearGradient></defs><rect width="1600" height="900" fill="url(#obs)"/><path d="M0 560Q800 40 1600 560V0H0Z" fill="#16302B" opacity=".6"/>${Array.from({length:34},(_,i)=>`<circle cx="${(i*211)%1500+50}" cy="${(i*97)%360+40}" r="${1.4+(i%3)}" fill="${PAL.ivory}" opacity="${.35+(i%4)*.15}"/>`).join("")}${floorBg(740,"#4D5A52","#2A3530")}`,
    props:()=>`<path d="M100 740V560Q800 120 1500 560V740" fill="none" stroke="${PAL.copper}" stroke-width="10" opacity=".55"/><path d="M800 140V740" stroke="${PAL.copper}" stroke-width="4" opacity=".4"/>
      <g transform="translate(980 560)"><path d="M0 0L-60 180M0 0L60 180M0 0V180" stroke="${PAL.ink}" stroke-width="10" stroke-linecap="round"/><g transform="rotate(-32)"><rect x="-30" y="-50" width="320" height="64" rx="30" fill="${PAL.copper}" stroke="${PAL.ink}" stroke-width="6"/><rect x="250" y="-60" width="60" height="84" rx="14" fill="#8E6E5A" stroke="${PAL.ink}" stroke-width="6"/><circle cx="310" cy="-18" r="22" fill="#A9C6C8" stroke="${PAL.ink}" stroke-width="5"/></g></g>
      <g transform="translate(260 520)"><rect width="300" height="220" rx="8" fill="${PAL.wood}" stroke="${PAL.ink}" stroke-width="5"/>${[0,1,2].map(i=>`<rect x="${24+i*92}" y="24" width="72" height="90" fill="${PAL.ivory}" transform="rotate(${i%2?4:-4} ${60+i*92} 70)" stroke="${PAL.copper}" stroke-width="2"/>`).join("")}</g>
      ${flag("starsLinked")?`<path d="M300 220L420 150L560 210L700 130L840 190L980 120" fill="none" stroke="${PAL.amber}" stroke-width="4" opacity=".8"/>`:""}`,
    kidsX:42, motes:false,
    intro:()=>[["y",1,"مرصد! قبة زجاج ومنظار كبير."],["k",1,"ومن هنا يطلع سلّم ضيّق للسطح."],["siraj",0,"(يطير من ورا المنظار) النجوم هنا تنام. إذا وصّلتوها صح، تشوفون شي حلو. وبالمنظار… تشوفون القلعة كلها."]],
    spots:()=>[
      {x:62,y:44,label:"المنظار",art:()=>`<svg viewBox="0 0 60 60"><path d="M10 44l30-22" stroke="${PAL.ink}" stroke-width="12" stroke-linecap="round"/><circle cx="44" cy="20" r="9" fill="#A9C6C8" stroke="${PAL.ink}" stroke-width="4"/><path d="M24 40l-8 16M24 40l8 16" stroke="${PAL.ink}" stroke-width="4"/></svg>`,w:62,on:()=>castleView()},
      {x:84,y:30,label:"دليل الأشياء المخفية",on:()=>telescope()},
      {x:26,y:66,label:"طوابع وبطاقات",art:()=>ART.ticket(),w:56,on:(ctx)=>postcard(ctx)}
    ],
    puzzle:{title:"وصّلوا النجوم", done:()=>flag("starsLinked"),
      run:(ctx, solved)=>{ const S=[[18,64,5],[34,30,11],[50,58,3],[66,22,13],[80,52,8],[48,14,6.5]]; const order=S.map((s,i)=>i).sort((a,b)=>S[a][2]-S[b][2]); let got=[];
        const draw=()=>{ const pts=got.map(i=>S[i]); ctx.open(`<h3>نجوم المرصد</h3><p>سِراج يگول: «النجوم تصحى من الأصغر للأكبر، مثل فوانيسي». اضغطوا النجوم بالترتيب.</p><div class="stars-pz"><svg viewBox="0 0 100 80" preserveAspectRatio="none"><polyline points="${pts.map(p=>p[0]+","+p[1]).join(" ")}" fill="none" stroke="${PAL.amber}" stroke-width=".8" stroke-linecap="round"/></svg>${S.map(([x,y,r],i)=>`<button class="st-b ${got.includes(i)?"on":""}" data-st="${i}" style="left:${x}%;top:${y/80*100}%" aria-label="نجمة ${i+1}"><i style="width:${8+r*2.4}px;height:${8+r*2.4}px"></i></button>`).join("")}</div><p class="d-note">${got.length} من ${S.length}</p>`);
          $$("[data-st]",ctx.task).forEach(b=>b.onclick=()=>{ const i=+b.dataset.st; if(got.includes(i)) return; if(i===order[got.length]){ got.push(i); Sound.chime(); if(got.length===S.length){ draw(); setTimeout(solved,600); return; } } else { Sound.bump(); got=[]; toast("النجوم رجعت نامت… ابدوا من الأصغر","bulb"); } draw(); });
        };
        draw(); },
      reward:(ctx)=>{ ctx.say([["k",1,"صارت شكل فانوس بالسما!"],["siraj",1,"هذا شكلي! يعني… شكل فانوسي. النجوم تعرفني."],["y",1,"ورقة الطوابع لمعت؛ نگدر نسوي بطاقة من القلعة."]], ()=>{ setFlag("starsLinked"); addStars(2,"نجوم المرصد"); checkQuestRewards(); ctx.refresh(); }); }},
    actions:()=>[{l:"السلّم للسطح",run:()=>{ if(nodeOpen("roof")) sceneLeave(null,()=>go("room:roof")); else lockedCard("roof"); }}],
    objective:()=> flag("starsLinked") ? "المنظار يطل على القلعة، والطوابع تسوي بطاقة بريد." : "وصّلوا النجوم من الأصغر للأكبر."
  },

  roof:{
    bg:()=>outBg("#16302B","#2A4A43","#2F4F47","#26423C","#3B4A44",{stars:true, castle:false, ground:760}),
    props:()=>`<path d="M0 760L300 700H1300L1600 760V900H0Z" fill="#55605A" stroke="${PAL.ink}" stroke-width="6"/>${Array.from({length:14},(_,i)=>`<path d="M${i*120} 900L${300+i*72} 700" stroke="#3B4A44" stroke-width="3"/>`).join("")}
      <g transform="translate(800 440)"><circle r="220" fill="${PAL.ivory2}" stroke="${PAL.copper}" stroke-width="14"/>${[[-110,-110,"copper"],[110,-110,"glass"],[-110,110,"iron"],[110,110,"gold"]].map(([x,y,k])=>`<g transform="translate(${x} ${y})"><circle r="62" fill="${PAL.pine3}" stroke="${GEARS[k].c}" stroke-width="5" stroke-dasharray="10 8"/>${WS.flags["sock_"+k]||flag("clockRestored")?P.gear(0,0,54,GEARS[k].c,flag("clockRestored")?"spin":""):""}</g>`).join("")}<circle r="28" fill="${PAL.copper}"/></g>
      <path d="M1380 700V420" stroke="${PAL.ink}" stroke-width="10"/><path class="flag" d="M1386 424h150l-30 40 30 40h-150z" fill="${PAL.coral}"/>`,
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
          {t:"لحن الأوراق الهادي", pick:()=>{ WS.song="leaves"; }}, {t:"تكتكة سِراج (لحن يرقّص)", pick:()=>{ WS.song="siraj"; }}, {t:"دندنة شوكة بالحديقة القديمة", pick:()=>{ WS.song="garden"; }}]}], ()=>{ saveWorld(); solved(); });
        draw(); },
      reward:(ctx)=>finale(ctx)},
    objective:()=> flag("clockRestored") ? "الساعة تشتغل. الخريف رجع يمشي: نهار وليل." : "ركّبوا التروس الأربعة بقلب الساعة."
  },

  /* ===== الدفيئة ===== */
  greenhouse:{
    bg:()=>wallBg("#D9E3D2","#B9C8B2")+`<g opacity=".5" stroke="${PAL.sage2}" stroke-width="5" fill="none">${Array.from({length:9},(_,i)=>`<path d="M${i*200} 0V900"/>`).join("")}<path d="M0 300H1600M0 600H1600"/></g>`,
    props:()=>`<rect x="0" y="640" width="1600" height="260" fill="#8E7A62"/><rect x="0" y="630" width="1600" height="16" fill="${PAL.wood}"/>
      ${[[420,"#E3B3A6"],[800,PAL.sage2],[1180,PAL.sage]].map(([x,c],i)=>`<g transform="translate(${x} 640)"><path d="M-70 0h140l-20 110h-100z" fill="${PAL.coral}" stroke="${PAL.ink}" stroke-width="5"/>${i===0?`<path d="M0 0V-140" stroke="${PAL.sage2}" stroke-width="8"/>${[0,72,144,216,288].map(a=>`<ellipse cx="0" cy="-170" rx="20" ry="30" transform="rotate(${a} 0 -150)" fill="${c}" stroke="#A9786C" stroke-width="3"/>`).join("")}<circle cy="-150" r="14" fill="${PAL.copper}"/>`:i===1?Array.from({length:7},(_,k)=>`<path d="M0 0Q${-90+k*30} -120 ${-110+k*36} -170" stroke="${c}" stroke-width="14" fill="none" stroke-linecap="round"/>`).join(""):`<rect x="-26" y="-170" width="52" height="170" rx="26" fill="${c}" stroke="${PAL.sage2}" stroke-width="5"/><rect x="-74" y="-110" width="40" height="70" rx="20" fill="${c}" stroke="${PAL.sage2}" stroke-width="5"/><circle cx="0" cy="-176" r="12" fill="#E3B3A6"/>`}</g>`).join("")}`,
    npc:{id:"narjis", x:4, b:14, h:36}, kidsX:22, motes:false,
    intro:()=>[["narjis",1,"هلا حبايبي! تعالوا تعالوا، الدفيئة دافية."],["narjis",0,"نباتاتي الثلاث زعلانة: كل وحدة تحتاج ضوء وماي بمقدار، ونسيت شنو بالضبط."],["y",2,"عندج دفتر؟ آني أحب أقرا الملاحظات."],["narjis",1,"على الطاولة! وإذا رجّعتوا نباتاتي فرحانة، عندي شي يلمع إلكم."]],
    spots:()=>[{x:82,y:56,label:"دفتر الخالة نرجس",art:()=>ART.book(PAL.sage2),on:()=>modal(`<h2>دفتر البستانية</h2><div class="letter">• الوردة: تحب الشمس، وماي متوسط (2).\n• السرخس: يحب الظل، ويشرب هواية (3).\n• الصبّار: يحب الشمس، وماي قليل بس (1).</div>`)}],
    puzzle:{title:"فرّحوا النباتات", done:()=>WS.gears.includes("glass"),
      run:(ctx, solved)=>{ const names=["الوردة","السرخس","الصبّار"], need=[[1,2],[0,3],[1,1]]; const st=[[0,0],[1,0],[0,0]];
        const draw=()=>{ ctx.open(`<h3>ضوء وماي</h3><p>لكل نبتة: اختاروا شمس لو ظل، وكم مرة تسقونها. الملاحظات بدفتر الخالة نرجس.</p><div class="gh-pots">${names.map((n,i)=>`<div class="gh-pot"><b>${n}</b><button class="btn small ghost" data-sun="${i}">${st[i][0]?"☀ شمس":"☁ ظل"}</button><button class="btn small ghost" data-w="${i}">💧 ×${st[i][1]}</button></div>`).join("")}</div><div class="row" style="justify-content:center"><button class="btn honey" data-ok>${IC.check} تحقّقوا</button></div><p class="d-note" data-r></p>`);
          $$("[data-sun]",ctx.task).forEach(b=>b.onclick=()=>{ const i=+b.dataset.sun; st[i][0]=1-st[i][0]; Sound.soft(); draw(); });
          $$("[data-w]",ctx.task).forEach(b=>b.onclick=()=>{ const i=+b.dataset.w; st[i][1]=(st[i][1]+1)%4; Sound.pop(); draw(); });
          $("[data-ok]",ctx.task).onclick=()=>{ const ok=st.map((s,i)=>s[0]===need[i][0]&&s[1]===need[i][1]); if(ok.every(Boolean)) solved(); else { Sound.bump(); $("[data-r]",ctx.task).textContent = "فرحانة: "+(names.filter((_,i)=>ok[i]).join("، ")||"ولا وحدة بعد"); } }; };
        draw(); },
      reward:(ctx)=>{ ctx.say([["narjis",1,"شوفوا شلون فتّحت! يا عيني عليكم."],["narjis",0,"هذا ترس زجاج لگيته بأصيص قديم، وهذا مفتاح زجاجي يفتح ممر الكتب الخضراء."],["y",1,"شكراً خالة نرجس!"]], ()=>{ giveGear("glass"); giveItem("glassKey"); ctx.refresh(); }); }},
    actions:()=>[{l:"«مهمة الدفيئة» (ثنائية)",run:()=>go("play:greenhouse")}],
    objective:()=> WS.gears.includes("glass") ? "النباتات فرحانة. المفتاح الزجاجي يفتح ممر الكتب الخضراء." : "ساعدوا الخالة نرجس تفرّح نباتاتها."
  },

  passageLG:{
    bg:()=>wallBg("#2F4A40","#1C2E28")+floorBg(700,"#4D4A3E","#2A2A22"),
    props:()=>`${P.shelf(60,120,560,560,2)}${P.shelf(980,120,560,560,4)}${P.vine("M40 80C200 200 260 60 420 180S700 120 640 400")}${P.vine("M1560 60C1400 200 1300 80 1180 240S960 260 1000 520")}${P.vine("M0 640C200 560 360 700 600 620")}
      <g transform="translate(680 250)"><rect width="240" height="420" rx="120" fill="${PAL.sage2}" opacity=".45"/><path d="M120 0v420M0 200h240" stroke="${PAL.copper}" stroke-width="5"/></g>`,
    kidsX:40, leaves:true,
    intro:()=>[["k",2,"الأغصان ماكلة الكتب!"],["y",2,"بس الكتب الأربعة اللي بالنص… كل وحدة مكتوب عليها كلمة. يمكن تصير جملة؟"]],
    puzzle:{title:"رتّبوا الكلمات", done:()=>flag("booksOrdered"),
      run:(ctx, solved)=>puzzleOrder(ctx, solved, {title:"الكتب الأربعة", text:"رتّبوا الكتب حتى تصير جملة تفتح الممر (من اليمين لليسار).", items:[["الحكايات",PAL.coral],["تنمو","#2F5E57"],["مثل",PAL.copper],["الأشجار",PAL.sage2]], render:([w,c])=>`<span class="spine" style="--c:${c}">${w}</span>`, check:"الجملة ما صارت مفهومة بعد"}),
      reward:(ctx)=>{ ctx.say([["y",1,"«الحكايات تنمو مثل الأشجار»! الأغصان انسحبت."],["k",1,"والممر صار طريق مختصر بين الدفيئة والمكتبة."]], ()=>{ setFlag("booksOrdered"); grantReward("decor_garland"); addStars(2); ctx.refresh(); }); }},
    objective:()=> flag("booksOrdered") ? "الممر مفتوح بين الدفيئة والمكتبة." : "رتّبوا الكتب الأربعة."
  },

  /* ===== محطة القطار ===== */
  station:{
    bg:()=>outBg("#A9C6C8","#EAF0EC","#B9C8B2","#A8B9A0","#8F8A78",{cx:1300,cs:.9}),
    props:()=>`${P.rails(700)}
      <g transform="translate(980 420)"><rect width="520" height="260" rx="26" fill="#2F5E57" stroke="${PAL.ink}" stroke-width="6"/>${[30,160,290].map(x=>`<rect x="${x}" y="40" width="100" height="80" rx="8" fill="${PAL.ivory}" stroke="${PAL.ink}" stroke-width="4"/>`).join("")}<rect x="420" y="-80" width="56" height="100" fill="${PAL.ink}"/><path d="M0 200H520" stroke="${PAL.copper}" stroke-width="8"/><circle cx="110" cy="275" r="44" fill="${PAL.ink}" stroke="${PAL.copper}" stroke-width="6"/><circle cx="410" cy="275" r="44" fill="${PAL.ink}" stroke="${PAL.copper}" stroke-width="6"/>${P.steam(450,-110)}</g>
      <g transform="translate(140 300)"><rect width="300" height="380" fill="${PAL.ivory2}" stroke="${PAL.ink}" stroke-width="6"/><path d="M-30 0L150 -110L330 0Z" fill="${PAL.coral}" stroke="${PAL.ink}" stroke-width="6"/><circle cx="150" cy="-30" r="40" fill="${PAL.ivory}" stroke="${PAL.ink}" stroke-width="5"/><path d="M150 -30V-58M150 -30L170 -18" stroke="${PAL.ink}" stroke-width="5"/><rect x="40" y="120" width="220" height="120" rx="8" fill="${PAL.pine}"/><rect x="56" y="136" width="188" height="88" fill="${PAL.ivory}"/><text x="150" y="196" text-anchor="middle" font-size="40" font-family="Aref Ruqaa,serif" fill="${PAL.pine}">التذاكر</text></g>${P.lamp(560,470)}`,
    npc:{id:"cat", x:36, b:20, h:26}, kidsX:52, leaves:true,
    intro:()=>[["cat",0,"مياو! أهلاً بمحطة منتصف الخريف. آني زعفرانة، حارسة التذاكر."],["k",1,"قطة بقبعة سائق! هذا أحلى شي شفته اليوم."],{ask:"زعفرانة تسأل: «شنو تحبون أكثر بالقطار؟»", who:"cat", opts:[{t:"السرعة!", pick:()=>setFlag("trainLove","speed"), then:[["cat",1,"سريعين؟ إذن لعبة القطار إلكم. خباب يمسك السرعة."]]},{t:"المناظر من الشبّاك", pick:()=>setFlag("trainLove","view"), then:[["cat",1,"عيونكم حلوة. جرّبوا رحلة القناطر، المنظر يجنن."]]}]},["cat",0,"بس… ضيّعت جرسي. بدونه القطارات ما تسمعني. آخر مرة رن بغرفة التروس تحت الورشة."]],
    talk:()=>{ if(hasItem("bell") && !flag("catBell")){ takeItem("bell"); setFlag("catBell"); giveTicket("cat"); checkQuestRewards(); return [["k",1,"زعفرانة! لگينا جرسج بين الأنابيب."],["cat",1,"جرسي!! (ترن ترن) هسه القطارات تسمعني. خذوا هاي قطعة تذكرة، شكراً!"]]; }
      return [["cat",0,npcLine("cat")]].concat(WS.tickets.length>=3 && !flag("room_abandoned") ? [["cat",2,"عندكم 3 قطع تذكرة؟ باب الرصيف القديم يسمعكم هسه. هو بنهاية الخط."]] : []); },
    spots:()=>[
      {x:30,y:46,label:"شبّاك التذاكر",on:()=>{ const got=WS.tickets; modal(`<h2>شبّاك التذاكر</h2><p>قطع التذكرة الممزقة: ${got.length} من 5</p><div class="album">${Object.keys(TICKETS).map(k=>`<span class="${got.includes(k)?"on":""}">${ART.ticket()}</span>`).join("")}</div><ul class="q-sub">${Object.entries(TICKETS).map(([k,t])=>`<li class="${got.includes(k)?"done":""}">${got.includes(k)?IC.check:""}${esc(t.how)}</li>`).join("")}</ul><p class="d-note">3 قطع تفتح الرصيف القديم.</p>`); }},
      {x:66,y:70,label:"عجلة القطار",on:inspect([["k",1,"العجلة دافية! القطار يحب يمشي."],["y",2,"مكتوب عليها: «صُنعت بورشة الساعات». يعني العم سعدون يعرف القطار!"]])}
    ],
    actions:()=>[{l:"«قطار منتصف الخريف» (ثنائية)",hot:true,run:()=>go("play:train")},{l:"«سباق العربات» (ثنائية)",run:()=>go("play:race")},{l:"رحلة على القناطر",run:()=>trainRide()}],
    objective:()=> flag("catBell") ? "زعفرانة فرحانة. القطار ينتظركم." : hasItem("bell") ? "رجّعوا الجرس لزعفرانة! كلّموها." : "زعفرانة ضيّعت جرسها. والتذاكر الممزقة تفتح الرصيف القديم."
  },

  abandoned:{
    bg:()=>outBg("#7E8C88","#C9C3B4","#6E7A72","#5E6A63","#5A564C",{cx:300,cs:.8}),
    tint:"linear-gradient(180deg,rgba(32,58,53,.18),rgba(22,48,43,.35))",
    props:()=>`${P.rails(720)}
      <g transform="translate(160 440)" opacity=".95"><rect width="560" height="250" rx="24" fill="#7C7A70" stroke="${PAL.ink}" stroke-width="6"/>${[30,160,290,420].map(x=>`<rect x="${x}" y="40" width="100" height="80" rx="8" fill="#4D4D45"/>`).join("")}<path d="M20 30c60 40 100-10 160 20s120 0 180 30" fill="none" stroke="${PAL.sage2}" stroke-width="12" stroke-linecap="round"/><circle cx="110" cy="265" r="44" fill="${PAL.ink}"/><circle cx="450" cy="265" r="44" fill="${PAL.ink}"/></g>
      <g transform="translate(1080 260)"><rect width="300" height="200" rx="8" fill="${PAL.pine}" stroke="${PAL.copper}" stroke-width="6"/><text x="150" y="50" text-anchor="middle" font-size="34" font-family="Aref Ruqaa,serif" fill="${PAL.ivory}">جدول القطارات</text>${[0,1,2].map(r=>`<rect x="30" y="${74+r*38}" width="240" height="22" fill="${PAL.pine2}"/>`).join("")}</g>
      ${[0,1,2,3].map(i=>`<g transform="translate(${880+i*110} 520)"><path d="M0 0v180" stroke="${PAL.ink}" stroke-width="10"/><rect x="-26" y="-70" width="52" height="80" rx="10" fill="${PAL.ink}"/><circle cx="0" cy="-30" r="18" fill="#6E6E66"/></g>`).join("")}`,
    kidsX:60,
    intro:()=>[["y",2,"الباب انفتح بالتذكرة! كل شي هنا نايم من سنين."],["k",0,"شوفي الإشارات… مطفية. والجدول عليه ألوان."],["y",1,"إذا رتّبنا ألوان الإشارات مثل الجدول، يمكن الرصيف يصحى."]],
    spots:()=>[
      {x:77,y:38,label:"جدول القطارات",who:Party.connected()?"y":null,on:()=>modal(`<h2>جدول القطارات</h2><div class="letter">«قطار منتصف الخريف يطلع لما الإشارات تضوي: أخضر، مرجاني، عاجي، أخضر — من اليمين لليسار.»</div><div class="sig-key">${[PAL.sage2,PAL.coral,PAL.ivory,PAL.sage2].map(c=>`<i style="background:${c}"></i>`).join("")}</div>${Party.connected()?'<p class="d-note">بس يقين تشوف الجدول. گولوا لصديقكم شنو الألوان!</p>':""}`)},
      {x:30,y:56,label:"عربة قديمة",on:inspect([["k",2,"العربة مليانة أوراق يابسة… وبيها مقعد صغير مكتوب عليه «سعدون، 7 سنين»."],["y",1,"يعني العم سعدون جان يركب هنا وهو صغير!"]])}
    ],
    puzzle:{title:"شغّلوا الإشارات", done:()=>WS.gears.includes("iron"),
      run:(ctx, solved)=>{ const C=["#6E6E66",PAL.coral,PAL.ivory,PAL.sage2], target=[3,1,2,3]; let s=[0,0,0,0];
        const draw=()=>{ ctx.open(`<h3>إشارات الرصيف</h3><p>اضغطوا كل إشارة حتى يتبدل لونها. الترتيب الصحيح مكتوب بجدول القطارات.</p><div class="sigs">${s.map((c,i)=>`<button class="sig-btn" data-i="${i}" style="--c:${C[c]}" aria-label="إشارة ${i+1}"><i></i></button>`).join("")}</div><div class="row" style="justify-content:center"><button class="btn honey" data-ok>${IC.check} شغّلوا</button></div>`);
          $$("[data-i]",ctx.task).forEach(b=>b.onclick=()=>{ const i=+b.dataset.i; s[i]=s[i]%3+1; Sound.flip(); draw(); });
          $("[data-ok]",ctx.task).onclick=()=>{ if(s.every((c,i)=>c===target[i])) solved(); else { Sound.bump(); toast("الإشارات ما اشتغلت. شوفوا الجدول مرة ثانية","bulb"); } }; };
        draw(); },
      reward:(ctx)=>{ ctx.say([["k",1,"تووووت! الرصيف صحى والقطار القديم صفّر!"],["y",1,"وطلع من المدخنة… ترس حديد!"]], ()=>{ giveGear("iron"); ctx.refresh(); }); }},
    objective:()=> WS.gears.includes("iron") ? "الرصيف صحى. ترس الحديد وياكم." : "رتّبوا ألوان الإشارات حسب جدول القطارات."
  },

  /* ===== الغابة ===== */
  forest:{
    bg:()=>outBg("#C9D3C0","#EDE6D2","#9DB096","#86A07F","#7C8A6A",{castle:false, ground:720}),
    props:()=>`${[[140,"#C9A27A",1.2],[420,"#B9805F",1.5],[1180,"#A8B9A0",1.4],[1460,"#D7B58C",1.1]].map(([x,c,s])=>`<g transform="translate(${x} 720) scale(${s})"><path d="M-18 0V-220h36V0z" fill="#6F5E4C" stroke="${PAL.ink}" stroke-width="3"/><circle cy="-260" r="110" fill="${c}" stroke="${PAL.ink}" stroke-width="3" opacity=".95"/><circle cx="-70" cy="-210" r="60" fill="${c}" stroke="${PAL.ink}" stroke-width="3"/><circle cx="70" cy="-220" r="66" fill="${c}" stroke="${PAL.ink}" stroke-width="3"/></g>`).join("")}
      <g transform="translate(800 600)"><ellipse rx="90" ry="34" fill="#8E6E5A" stroke="${PAL.ink}" stroke-width="4"/><path d="M-80 -8c30-30 130-30 160 0" fill="none" stroke="#6F5E4C" stroke-width="10"/>${[0,1,2].map(i=>`<circle cx="${-30+i*30}" cy="-14" r="10" fill="${PAL.copper}" opacity=".7"/>`).join("")}</g>`,
    kidsX:30, leaves:true,
    intro:()=>[["k",1,"الغابة كلها ألوان! أخضر وأصفر وأحمر."],["y",2,"وشوف هذا العش… بيه تروس صغيرة بدل القش!"],["siraj",0,"(بصوت واطي) هذا… عشّي القديم. قبل لا يركّبني العم سعدون بالورشة، جنت ضو صغير ضايع هنا."]],
    spots:()=>[
      {x:50,y:62,label:"العش القديم",art:()=>ART.gear(PAL.copper),w:52,on:(ctx)=>ctx.say([["siraj",0,"الجدّة لگتني هنا ليلة باردة. خلّتني بفانوس، وسعدون الصغير ركّبلي أجنحة من تروس الساعة."],["y",1,"يعني إنت أقدم من الساعة نفسها؟"],["siraj",1,"لا لا! بس أعرف كل ممراتها. ولهذا أطلع بس لما تحتاجوني."]], ()=>{ setFlag("sirajLore"); ctx.refresh(); })},
      {x:20,y:40,label:"شجرة البلوط الكبيرة",on:inspect([["y",2,"الأوراق هنا تتغيّر شوي شوي: أول شي خضرة، بعدين تصفر، تصير برتقالية، تحمر… وآخر شي بنية وتطيح."],["k",1,"حفظتها! أخضر، أصفر، برتقالي، أحمر، بني."]])}
    ],
    puzzle:{title:"رتّبوا أوراق الخريف", done:()=>WS.tickets.includes("forest"),
      run:(ctx, solved)=>puzzleOrder(ctx, solved, {title:"ألوان الخريف", text:"رتّبوا الأوراق حسب ما يتغيّر لونها بالخريف (من اليمين لليسار).", items:[["أخضر","#6E8A6A"],["أصفر","#D7B58C"],["برتقالي","#C9A27A"],["أحمر",PAL.coral],["بني","#8E6E5A"]], render:([n,c])=>`${ART.maple(c)}<small>${n}</small>`, check:"الشجرة تگول: بعد مو هيچ"}),
      reward:(ctx)=>{ ctx.say([["k",1,"الأوراق طارت ورقصت!"],["y",1,"وبين الأوراق… قطعة تذكرة ممزقة!"]], ()=>{ giveTicket("forest"); ctx.refresh(); }); }},
    actions:()=>[{l:"«متاهة الأوراق» (ثنائية)",hot:true,run:()=>go("play:maze")},{l:"نفق الأوراق",run:()=>{ if(nodeOpen("leaftunnel")) sceneLeave(null,()=>go("room:leaftunnel")); else lockedCard("leaftunnel"); }}],
    objective:()=> WS.tickets.includes("forest") ? "الغابة هادئة. المتاهة تنطيكم مفتاح السياج." : "رتّبوا أوراق الخريف حسب ألوانها."
  },

  leaftunnel:{
    bg:()=>`<rect width="1600" height="900" fill="#16302B"/><path d="M-100 900V420Q800 -120 1700 420V900Z" fill="#203A35"/><path d="M200 900V520Q800 80 1400 520V900Z" fill="#2A4A43"/><path d="M420 900V600Q800 300 1180 600V900Z" fill="#16302B"/>${floorBg(760,"#3B4A44","#22302B")}`,
    props:()=>`${Array.from({length:26},(_,i)=>`<g transform="translate(${(i*131)%1600} ${(i*71)%420+40}) rotate(${i*37}) scale(${1+(i%3)*.3})">${strip(ART.maple(["#C9A27A","#B9805F","#C97964","#D7B58C"][i%4]))}</g>`).join("")}
      <circle cx="${hasItem("lantern")?380:800}" cy="560" r="300" fill="rgba(232,176,92,.16)"/>${[[300,760],[1240,780],[980,800]].map(([x,y])=>`<g transform="translate(${x} ${y})"><path d="M-6 0v-30" stroke="${PAL.ivory}" stroke-width="8"/><ellipse cy="-36" rx="30" ry="16" fill="#A9C6C8" opacity=".85"/></g>`).join("")}`,
    tint:"radial-gradient(ellipse at 30% 60%,rgba(232,176,92,.10),rgba(10,24,20,.45))",
    kidsX:20, motes:true,
    intro:()=>[["k",2,"ظلمة! بس الفانوس يضوّي الطريق."],["y",2,"الأغصان مسوية سقف، والفطر يلمع شوية."],["k",1,"شوفي! شي مدوّر يلمع بين الأوراق… مثل قبعة صغيرة!"]],
    spots:()=>[
      {x:72,y:72,label:"شي مدوّر بين الأوراق",cls:"faint",hide:()=>hasItem("acornCap")||flag("capReturned"),art:()=>ART.acornCap(),w:54,on:(ctx)=>{ giveItem("acornCap"); ctx.say([["y",1,"قبعة بلوطية صغيرة! أكيد هاي قبعة شوكة."],["k",1,"نرجّعها له بالحديقة القديمة."]], ()=>ctx.refresh()); }},
      {x:52,y:80,label:"فطر يلمع",on:inspect([["y",2,"الفطر يلمع أقوى لما نحچي بهدوء."],["k",0,"(يهمس) …صحيح!"]])}
    ],
    objective:()=> flag("capReturned") ? "النفق هادئ. شوكة رجعت قبعته." : hasItem("acornCap") ? "رجّعوا القبعة لشوكة بالحديقة القديمة." : "دوّروا بين الأوراق بضو الفانوس."
  },

  /* ===== الحديقة القديمة ===== */
  garden:{
    bg:()=>outBg("#C6D5CF","#F0EBDC","#B5C6A6","#A3B794","#8FA07E",{cx:1320,cs:.8}),
    props:()=>`${[160,520,1080,1440].map((x,i)=>`<g transform="translate(${x} 700)"><rect x="-90" y="-220" width="180" height="220" rx="80" fill="${[PAL.sage2,"#7E9A74"][i%2]}" stroke="${PAL.ink}" stroke-width="4"/></g>`).join("")}
      <g transform="translate(800 700)"><path d="M-80 0V-200a80 80 0 01160 0V0" fill="none" stroke="${PAL.ink}" stroke-width="10"/><path d="M-80 -150c40-40 120-40 160 0" fill="none" stroke="${PAL.sage2}" stroke-width="18" stroke-linecap="round"/>${P.flowers(0,-170,5,.7)}</g>
      <g transform="translate(300 640)"><rect width="220" height="22" rx="6" fill="${PAL.wood}" stroke="${PAL.ink}" stroke-width="3"/><path d="M20 22v60M200 22v60" stroke="${PAL.wood2}" stroke-width="12"/></g>${P.flowers(1260,820,8,1.1)}${P.flowers(140,840,6,1)}`,
    npc:{id:"shawka", x:60, b:10, h:18}, kidsX:24, leaves:true,
    intro:()=>[["shawka",0,"أهلاً… آني شوكة، ساكن الحديقة القديمة من زمان."],["k",1,"قنفذ! بس… راسك بدون شي؟"],["shawka",2,"قبعتي البلوطية طارت ويه الريح. شفتها تتدحرج صوب نفق الأوراق بالغابة."],{ask:"شوكة: «تساعدوني؟»", who:"shawka", opts:[{t:"أكيد! نروح هسه", pick:()=>setFlag("shawkaPromise"), then:[["shawka",1,"النفق مظلم؛ تحتاجون ضوء. سِراج عنده فانوس، أو فوزوا بصيد الفوانيس."]]},{t:"نلعب شوية ونرجع", then:[["shawka",0,"تمام. المقلاع وصيد الفوانيس هنا. والسياج ورا… يخبّي حديقة ما يعرفها أحد."]]}]}],
    talk:()=>{ if(hasItem("acornCap") && !flag("capReturned")){ takeItem("acornCap"); setFlag("capReturned"); checkQuestRewards(); return [["y",1,"شوكة! جبنالك قبعتك من النفق."],["shawka",1,"قبعتي!! (يلبسها ويدور) هسه راسي ما يبرد. خذوا قبعة بلوط مثلها، هدية."]].concat(flag("shawkaPromise")?[["shawka",0,"وعدتوني ووفيتوا. هذا أحلى شي."]]:[]); }
      return [["shawka",flag("capReturned")?1:0,npcLine("shawka")]]; },
    spots:()=>[
      {x:50,y:44,label:"باب السياج",on:()=>{ if(nodeOpen("hidden")) sceneLeave(null,()=>go("room:hidden")); else lockedCard("hidden"); }},
      {x:26,y:66,label:"المقعد القديم",on:inspect([["k",0,"محفور عليه: «هنا جلسنا أنا وسعدون نعدّ الأوراق»."],["y",1,"الجدّة مرة ثانية! كل مكان بيه ذكرى منها."]])}
    ],
    actions:()=>[{l:"«مقلاع الأوراق» (ثنائية)",hot:true,run:()=>go("play:sling")},{l:"«صيد الفوانيس» (ثنائية)",run:()=>go("play:lanterns")}],
    objective:()=> flag("capReturned") ? "شوكة فرحان بقبعته. السياج يخبّي حديقة سرية." : hasItem("acornCap") ? "رجّعوا القبعة لشوكة! كلّموه." : "شوكة ضيّع قبعته البلوطية."
  },

  hidden:{
    bg:()=>outBg("#D6E0CD","#F2EDDF","#A8B9A0","#93A88A","#8FA07E",{castle:false}),
    props:()=>`<path d="M300 900V420a500 380 0 011000 0V900" fill="none" stroke="#5E7A58" stroke-width="56"/>${P.vine("M260 900C260 700 320 520 520 380S1000 260 1180 380 1340 700 1340 900")}
      <g transform="translate(800 640)"><ellipse rx="190" ry="44" fill="#A9C6C8" stroke="#6E8A8A" stroke-width="6"/><rect x="-30" y="-150" width="60" height="150" fill="${PAL.ivory2}" stroke="${PAL.copper}" stroke-width="5"/><ellipse cy="-150" rx="90" ry="24" fill="#A9C6C8" stroke="#6E8A8A" stroke-width="5"/><path class="water" d="M0 -170c-20 30-40 60-60 130M0 -170c20 30 40 60 60 130" stroke="rgba(255,255,255,.7)" stroke-width="5" fill="none"/></g>
      ${P.flowers(180,820,9,1.4)}${P.flowers(1420,820,9,1.4)}${P.flowers(600,860,7,1.1)}${P.flowers(1020,860,7,1.1)}`,
    kidsX:38, leaves:true,
    intro:()=>[["y",1,"واااو… الحديقة المخفية! بيها نافورة وورد ما شفناه بأي مكان."],["k",1,"أكيد بيها أشياء مخبّاة. آني ألگاها أول!"],["y",2,"لا تركض على الورد! خلّي ندوّر بهدوء."]],
    spots:()=>[
      {x:12,y:62,label:"صندوق موسيقى صغير",cls:"faint",hide:()=>flag("hf_box"),art:()=>ART.clockFace(3,0),on:(ctx)=>{ setFlag("hf_box"); ctx.say([["k",1,"صندوق موسيقى! يدق نفس لحن ساعة القلعة."],["y",2,"يمكن الجدّة جانت تسمعه هنا."]]); checkHidden(ctx); }},
      {x:88,y:78,label:"دعسوقة",cls:"faint",hide:()=>flag("hf_bug"),art:()=>ART.ladybug(),on:(ctx)=>{ setFlag("hf_bug"); ctx.say([["y",1,"دعسوقة تحسب نقاطها… سبعة! نفس عدد أيام الأسبوع."]]); checkHidden(ctx); }},
      {x:58,y:86,label:"أرنب نايم",cls:"faint",hide:()=>flag("hf_rabbit"),art:()=>ART.rabbit(),on:(ctx)=>{ setFlag("hf_rabbit"); ctx.say([["k",0,"ششش… أرنب نايم بين الورد."]]); checkHidden(ctx); }},
      {x:46,y:30,label:"زهرة القمر",cls:"faint",hide:()=>flag("hf_moon"),art:()=>ART.flower("#E6EEF2"),on:(ctx)=>{ setFlag("hf_moon"); ctx.say([["y",1,"زهرة القمر! تضوي حتى بالنهار."]]); checkHidden(ctx); }}
    ],
    objective:()=> flag("hiddenFound") ? "لگيتوا كل أسرار الحديقة." : `دوّروا 4 أشياء مخبّاة بين الورد (${["hf_box","hf_bug","hf_rabbit","hf_moon"].filter(f=>flag(f)).length}/4).`
  },

  /* ===== المكتبة ===== */
  library:{
    bg:()=>wallBg("#2F4A44","#1A302A")+floorBg(720,"#5E5446","#3A342D"),
    props:()=>`${P.shelf(40,80,420,620,1)}${P.shelf(1140,80,420,620,3)}<g transform="translate(560 120)"><path d="M0 560V200a240 200 0 01480 0v360z" fill="#3B5C54" stroke="${PAL.copper}" stroke-width="8"/>${[[30,40,"#A9C6C8"],[250,40,"#E3B3A6"],[30,270,"#D7B58C"],[250,270,PAL.sage]].map(([x,y,c])=>`<rect x="${x}" y="${y}" width="200" height="210" fill="${c}" opacity=".55"/>`).join("")}<path d="M240 40v500M30 260h420" stroke="${PAL.copper}" stroke-width="6"/><circle cx="240" cy="150" r="40" fill="${PAL.ivory}" opacity=".6"/></g>${P.candle(520,720)}${P.candle(1080,720)}
      <g transform="translate(640 600)"><path d="M0 60L160 10L320 60V120H0z" fill="${PAL.coral}" stroke="${PAL.ink}" stroke-width="5"/><path d="M160 10V110" stroke="${PAL.copper}" stroke-width="4"/><path d="M20 70h120M180 70h120M20 90h110M180 90h110" stroke="${PAL.ivory}" stroke-width="4"/></g>`,
    npc:{id:"owl", x:74, b:30, h:24}, kidsX:20,
    intro:()=>[["owl",0,"هوو هوو… أهلاً بالمكتبة. آني أم الحكايات."],["owl",0,"كل كتاب هنا حكاية تنلعب، وكل اختيار تختارونه يغيّر طريقها."],{ask:"أم الحكايات: «شنو تحبون بالحكايات؟»", who:"owl", opts:[{t:"المغامرة والركض!", pick:()=>setFlag("taleTaste","adventure"), then:[["owl",1,"خباب يحب الركض، واضح. ابدوا بقطار الساعة."]]},{t:"الألغاز والأسرار", pick:()=>setFlag("taleTaste","mystery"), then:[["owl",1,"يقين عيونها تلمع! مكتبة الحكايات الناقصة تنتظرج."]]}]},["owl",0,"خلّصوا حكاية وحدة وأنطيكم قطعة من التذكرة الممزقة."]],
    talk:()=>[["owl",0,npcLine("owl")]],
    spots:()=>[{x:50,y:74,label:"الكتاب الكبير: حكاياتنا",art:()=>ART.book("#2F5E57"),w:64,on:()=>sceneLeave(null, ()=>go("tales"))},
      {x:18,y:30,label:"رف قديم",on:inspect([["y",2,"كتاب عنوانه «ساعة الخريف» بس صفحاته فاضية."],["k",1,"يمكن إحنا اللي راح نكتبه!"]])},
      {x:90,y:44,label:"لوحة قديمة على الجدار",hide:()=>!nodeOpen("passage"),on:()=>sceneLeave(null,()=>go("room:passage"))}],
    actions:()=>[{l:"حكاياتنا",hot:true,run:()=>go("tales")},{l:"«ذاكرة مكتبة القلعة» (ثنائية)",run:()=>go("play:library")},{l:"سجل النهايات",run:()=>openJournal("tales")}],
    objective:()=> `حكايات مخلّصة: ${talesDone()} من 5. الكتاب الكبير يودّيكم لحكاياتنا.`
  },

  passage:{
    bg:()=>wallBg("#34443F","#1C2824")+floorBg(720,"#3E3A33","#24221E"),
    props:()=>`${[["dawn",6,0],["noon",12,0],["sunset",5,0],["night",9,0]].map(([k,hh,mm],i)=>P.frame(220+i*320,170,200,250,skyFrame(k,hh,mm))).join("")}${P.candle(140,700)}${P.candle(1460,700)}<path d="M0 120H1600" stroke="${PAL.copper}" stroke-width="4"/>`,
    kidsX:44, motes:true,
    intro:()=>[["y",2,"ممر سري ورا اللوحة! والجدران مليانة صور بيها ساعات."],["k",2,"كل صورة بيها سماء مختلفة… فجر، ظهر، غروب، ليل."],["y",1,"رسالة الجدّة گالت: «دوّر التروس بأماكن ناسها». وهاي صور ناسها!"]],
    puzzle:{title:"رتّبوا الصور", done:()=>WS.gears.includes("gold"),
      run:(ctx, solved)=>{ const items=[["dawn",6,0,"الفجر"],["noon",12,0,"الظهر"],["sunset",5,0,"الغروب"],["night",9,0,"الليل"]];
        puzzleOrder(ctx, solved, {title:"من الفجر لحد ما تنام النجوم", text:"رتّبوا الصور حسب وقت اليوم (من اليمين لليسار).", items, render:([k,hh,mm,n])=>`<svg viewBox="0 0 100 120" class="pz-sky">${skyFrame(k,hh,mm)}</svg><small>${n}</small>`, check:"الوقت ما يمشي هيچ… فكّروا من الصبح لليل"}); },
      reward:(ctx)=>{ ctx.say([["k",1,"الصورة الأخيرة انفتحت مثل باب صغير!"],["y",1,"وبيها ترس ذهب، ورسالة: «يا سعدون، الوقت ما يضيع؛ بس ينتظر أحد يدوّره»."]], ()=>{ giveGear("gold"); setFlag("lore"); grantReward("wings_glass"); ctx.refresh(); }); }},
    objective:()=> WS.gears.includes("gold") ? "ترس الذهب وياكم، ورسالة الجدّة." : "رتّبوا الصور الأربع حسب وقت اليوم."
  }
};

/* غرفة خباب ويقين: غرفة دافية فاتحة — كل شي بيها يفتح نشاط، ولغز ترتيب الغرفة */
const easelArt = () => `<svg viewBox="0 0 60 60"><path d="M14 56L26 6M46 56L34 6M30 6v52" stroke="${PAL.wood}" stroke-width="4" stroke-linecap="round"/><rect x="12" y="14" width="36" height="28" fill="${PAL.ivory}" stroke="${PAL.copper}" stroke-width="2.5"/><circle cx="24" cy="26" r="5" fill="${PAL.coral}"/><path d="M16 38q12-10 28-4" stroke="${PAL.sage2}" stroke-width="3" fill="none"/></svg>`;
const ballArt = () => `<svg viewBox="0 0 60 60"><circle cx="30" cy="32" r="22" fill="${PAL.coral}" stroke="${PAL.ink}" stroke-width="2.5"/><path d="M8 32h44M30 10c10 8 10 36 0 44" stroke="${PAL.ivory}" stroke-width="3" fill="none"/></svg>`;
const chestArt = () => `<svg viewBox="0 0 60 60"><rect x="8" y="24" width="44" height="28" rx="4" fill="${PAL.wood}" stroke="${PAL.ink}" stroke-width="2.5"/><path d="M8 24q22-16 44 0" fill="#8E6E5A" stroke="${PAL.ink}" stroke-width="2.5"/><rect x="26" y="30" width="8" height="8" rx="2" fill="${PAL.copper}"/></svg>`;
const shelfArt = () => `<svg viewBox="0 0 60 60"><rect x="8" y="8" width="44" height="46" rx="3" fill="${PAL.wood2}" stroke="${PAL.ink}" stroke-width="2.5"/>${[0,1,2,3].map(i=>`<rect x="${12+i*9}" y="14" width="7" height="16" fill="${BOOKS[i]}"/>`).join("")}<path d="M8 32h44" stroke="${PAL.ink}" stroke-width="2.5"/></svg>`;
ROOMS.study = {
  bg:()=>wallBg("#EFE6D3","#DCCFB4")+floorBg(700,"#B59A7A","#8E7A62"),
  props:()=>`<g transform="translate(560 70)"><rect x="-20" y="-20" width="520" height="460" rx="20" fill="${PAL.wood}" stroke="${PAL.copper}" stroke-width="6"/><rect width="480" height="420" rx="14" fill="#C9D3C0"/>${P.castle(240,380,1.1,PAL.pine2)}<path d="M0 300Q120 250 240 290T480 280V420H0Z" fill="${PAL.sage}"/>${P.cloud(120,90,.8)}<path d="M240 0v420M0 210h480" stroke="${PAL.wood}" stroke-width="12"/><path d="M-40 -30h560" stroke="${PAL.coral}" stroke-width="18" stroke-linecap="round"/><path d="M-20 -24c40 160 30 300 -10 460M500 -24c-40 160-30 300 10 460" fill="none" stroke="${PAL.coral}" stroke-width="34" opacity=".75"/></g>
    ${P.shelf(30,140,220,520,5)}
    <g transform="translate(300 300)"><path d="M0 400L60 0M180 400L120 0M90 0V420" stroke="${PAL.wood}" stroke-width="12" stroke-linecap="round"/><rect x="10" y="40" width="160" height="200" fill="${PAL.ivory}" stroke="${PAL.copper}" stroke-width="5"/><circle cx="60" cy="110" r="26" fill="${PAL.copper}"/><path d="M30 200q40-50 120-30" stroke="${PAL.sage2}" stroke-width="10" fill="none"/></g>
    <g transform="translate(860 560)"><rect width="520" height="36" rx="8" fill="${PAL.wood}" stroke="${PAL.ink}" stroke-width="4"/><path d="M30 36v200M490 36v200" stroke="${PAL.wood2}" stroke-width="20"/><path d="M120 -10l90-30 90 30v20H120z" fill="${PAL.coral}" stroke="${PAL.ink}" stroke-width="4"/>${P.candle(440,0)}</g>
    <g transform="translate(1180 120)"><rect width="300" height="220" rx="8" fill="#D7C2A0" stroke="${PAL.wood}" stroke-width="8"/>${[[20,20,PAL.ivory],[120,30,"#F1E3C4"],[210,16,PAL.ivory],[40,120,PAL.ivory],[150,120,"#F1E3C4"]].map(([x,y,c],i)=>`<rect x="${x}" y="${y}" width="80" height="70" fill="${c}" transform="rotate(${i%2?4:-4} ${x+40} ${y+35})" stroke="${PAL.copper}" stroke-width="2"/><circle cx="${x+40}" cy="${y+4}" r="6" fill="${PAL.coral}"/>`).join("")}</g>
    <g transform="translate(1400 420)"><rect width="110" height="150" rx="10" fill="${PAL.coral}" stroke="${PAL.ink}" stroke-width="5"/><rect x="20" y="30" width="70" height="12" rx="4" fill="${PAL.pine}"/><path d="M55 150v130" stroke="${PAL.wood2}" stroke-width="12"/></g>
    ${flag("roomTidy")?"":`<g opacity=".95"><g transform="translate(700 760) scale(1.4)">${strip(ballArt())}</g><g transform="translate(420 780) rotate(-20) scale(1.3)">${strip(ART.book(PAL.coral))}</g><g transform="translate(1040 800) rotate(14) scale(1.1)">${strip(ART.letter())}</g></g>`}
    ${hasReward("decor_garland")?`<path d="M40 40Q800 160 1560 40" fill="none" stroke="${PAL.wood}" stroke-width="4"/>${Array.from({length:14},(_,i)=>`<g transform="translate(${80+i*105} ${60+Math.sin(i/13*Math.PI)*90}) scale(1.4)">${strip(ART.maple(["#C9A27A",PAL.coral,"#D7B58C"][i%3]))}</g>`).join("")}`:""}
    ${hasReward("decor_clock")?`<g transform="translate(1110 60) scale(1.6)">${strip(clockSVG(9,0))}</g>`:""}
    ${hasReward("acc_lantern")?`<g transform="translate(900 470) scale(1.8)">${strip(ART.lantern(true))}</g>`:""}
    ${hasItem("feather")?`<g transform="translate(1300 450) scale(1.6)">${strip(ART.feather())}</g>`:""}
    ${WS.tickets.length>=5?`<g transform="translate(1210 380)"><rect width="150" height="100" fill="${PAL.copper}" stroke="${PAL.ink}" stroke-width="4"/><g transform="translate(15 15) scale(2)">${strip(ART.ticket())}</g></g>`:""}
    ${hasReward("medal_clock")?`<g transform="translate(490 130)"><path d="M0 0l20 50 20-50" fill="${PAL.coral}"/><circle cx="20" cy="70" r="28" fill="${PAL.copper}" stroke="${PAL.ink}" stroke-width="4"/><g transform="translate(4 54) scale(.4)">${strip(clockSVG(12,0))}</g></g>`:""}
    ${flag("capReturned")?`<g transform="translate(100 60)"><rect width="120" height="90" fill="${PAL.ivory}" stroke="${PAL.copper}" stroke-width="6"/><g transform="translate(26 4) scale(.42)">${strip(ART.shawka("happy",false,true))}</g></g>`:""}`,
  kidsX:44, motes:false,
  intro:()=>[["y",1,"غرفتنا! دافية، والشبّاك يطل على القلعة."],["k",1,"كل شي هنا يشتغل: الدفتر، المرسم، صندوق الرسائل، وطاولة الرسم المشترك."],["y",2,"بس… الغرفة مكركبة شوية. والكتب القديمة بيها ورق مطوي؟"]],
  spots:()=>[
    {x:64,y:60,label:"المذكرات",art:()=>ART.book(PAL.coral),w:58,on:()=>go("diary")},
    {x:24,y:44,label:"المرسم",art:()=>easelArt(),w:62,on:()=>go("paint")},
    {x:91,y:54,label:"صندوق الرسائل",art:()=>ART.letter(),w:52,on:()=>letterBox()},
    {x:43,y:70,label:"رسم مشترك",art:()=>ART.butterfly(PAL.coral,"#D7B58C"),w:56,on:()=>go("draw")},
    {x:83,y:26,label:"قوالب الرسم",art:()=>`<svg viewBox="0 0 60 60"><rect x="8" y="8" width="44" height="44" fill="${PAL.ivory}" stroke="${PAL.copper}" stroke-width="3"/><path d="M14 20h32M14 30h24M14 40h28" stroke="${PAL.sage2}" stroke-width="2"/></svg>`,w:52,on:templatesBox},
    {x:52,y:30,label:"معرض رسومات الحكايات",on:galleryBox},
    {x:10,y:42,label:"كتب قديمة",hide:()=>flag("clueRead"),cls:"faint",art:()=>ART.letter(),on:(ctx)=>{ modal(`<div class="letter">«يا سعدون الصغير،\nإذا ضعت بالقلعة، دوّر اللوحة اللي بيها أربع سماوات بالمكتبة… وراها ممر يوصل لقلب الوقت.\n— جدّتك»</div><p class="d-note">انكشف «الممر خلف المكتبة» على الخريطة.</p>`); giveItem("clue"); setFlag("clueRead"); ctx.refresh(); }}
  ],
  puzzle:{title:"رتّبوا الغرفة", done:()=>flag("roomTidy"),
    run:(ctx, solved)=>puzzleMatch(ctx, solved, {title:"ترتيب غرفة خباب ويقين", text:"كل غرض إله مكان. اختاروا الغرض، بعدين مكانه.",
      items:[{k:"book",n:"كتاب",art:()=>ART.book(PAL.coral),to:"shelf"},{k:"brush",n:"فرشاة",art:()=>IC.brush,to:"easel",miss:"الفرشاة تحب المرسم"},{k:"letter",n:"رسالة",art:()=>ART.letter(),to:"box"},{k:"ball",n:"كرة",art:()=>ballArt(),to:"chest",miss:"الكرة مكانها بصندوق الألعاب"}],
      places:[{k:"shelf",n:"الرف",art:()=>shelfArt()},{k:"easel",n:"المرسم",art:()=>easelArt()},{k:"box",n:"صندوق الرسائل",art:()=>`<svg viewBox="0 0 60 60"><rect x="12" y="16" width="36" height="34" rx="6" fill="${PAL.coral}" stroke="${PAL.ink}" stroke-width="2.5"/><rect x="20" y="24" width="20" height="5" rx="2" fill="${PAL.pine}"/></svg>`},{k:"chest",n:"صندوق الألعاب",art:()=>chestArt()}]}),
    reward:(ctx)=>{ ctx.say([["k",1,"الغرفة صارت تلمع!"],["y",1,"وحتى سِراج يگدر يطير بيها بدون ما يدعم بشي."]], ()=>{ setFlag("roomTidy"); addStars(2,"رتّبتوا الغرفة"); ctx.refresh(); }); }},
  actions:()=>[{l:"المذكرات",hot:true,run:()=>go("diary")},{l:"المرسم",run:()=>go("paint")},{l:"رسم مشترك",run:()=>go("draw")}],
  objective:()=> flag("roomTidy") ? "المذكرات والرسومات تنحفظ على هذا الجهاز فقط، وما نجمع أي بيانات." : "الغرفة مكركبة: رتّبوها، وبعدين اكتبوا أو ارسموا."
};
function templatesBox(){ const md=modal(`<h2>قوالب للرسم</h2><div class="br-tpls">${Object.entries(TEMPLATES).map(([k,n])=>`<button class="br-tpl" data-t="${k}"><canvas width="160" height="120" data-prev="${k}"></canvas><span>${n}</span></button>`).join("")}</div>`,{wide:true}); $$("[data-prev]",md.el).forEach(c=>drawTemplate(c.getContext("2d"),160,120,c.dataset.prev)); $$("[data-t]",md.el).forEach(b=>b.onclick=()=>{ md.close(); go("paint:"+b.dataset.t); }); }
function galleryBox(){ const gal=Store.get("talesArt",[]); modal(`<h2>معرض رسومات الحكايات</h2>${gal.length?`<div class="br-gal">${gal.map(g=>`<figure><img src="${g.art}" alt="رسمة"><figcaption>${esc(g.t)}${g.line?" — "+esc(g.line):""}</figcaption></figure>`).join("")}</div>`:`<p>المعرض فاضي. الرسومات اللي ترسمونها بالحكايات تتعلّق هنا.</p>`}`,{wide:true}); }
function checkHidden(ctx){ const all=["hf_box","hf_bug","hf_rabbit","hf_moon"].every(f=>flag(f)); if(all && !flag("hiddenFound")){ setFlag("hiddenFound"); grantReward("wings_petals"); addStars(3,"أسرار الحديقة المخفية"); confetti(); } ctx.refresh(); }
function telescope(){
  const leaves=LEAF_SPOTS.map((s,i)=>({...s,i})).filter(s=>!WS.leaves.includes(s.i)), notes=NOTE_SPOTS.map((s,i)=>({...s,i})).filter(s=>!WS.notes.includes(s.i));
  const where=at=>placeName(at)+" · "+REGIONS[regionOf(at)].name+(nodeOpen(at)?"":" (مقفول بعد)");
  modal(`<h2>دليل الأشياء المخفية</h2><p>يقين تشوف بالمنظار، وسِراج يأشّر…</p><ul class="q-sub">${leaves.map(s=>`<li>${ART.maple("#D7B58C")} ورقة نادرة — ${esc(where(s.at))}</li>`).join("")}${notes.map(s=>`<li>${ART.letter()} رسالة — ${esc(where(s.at))}</li>`).join("")}</ul>${!leaves.length&&!notes.length?"<p>ماكو شي مخفي بعد. عاشت عيونكم!</p>":""}`);
}
/* مشهد خاص: لوحة القلعة الأصلية كاملة من عدسة المنظار (بدون أي تعديل عليها) */
function castleView(){
  const md=modal(`<div class="castle-view"><img src="${CASTLE}" alt="لوحة القلعة الأصلية كما تنشاف من المنظار" draggable="false"></div><p class="d-note">من عدسة المنظار: القلعة كلها، كل برج بيه مكان زرتوه أو راح تزورونه.</p><div class="row"><button class="btn ghost" data-x>رجوع</button></div>`, {wide:true, cls:"castle-view-modal"});
  $("[data-x]",md.el).onclick=md.close; addStarsOnce("castleView",1,"شفتوا القلعة من المنظار");
}
function postcard(ctx){
  const frames={copper:[PAL.copper,PAL.ink],pine:[PAL.pine,PAL.copper],coral:[PAL.coral,PAL.ink]};
  const md=modal(`<h2>بطاقة بريد من القلعة</h2><canvas class="pc-cv" width="900" height="600"></canvas>
    <div class="field"><label>الإطار</label><div class="seg" data-f>${Object.keys(frames).map(k=>`<button data-v="${k}">${{copper:"نحاسي",pine:"صنوبري",coral:"مرجاني"}[k]}</button>`).join("")}</div></div>
    <div class="field"><label>الطابع</label><div class="seg" data-st><button data-v="clock">ساعة</button><button data-v="leaf">ورقة</button><button data-v="ticket">تذكرة</button></div></div>
    <div class="field"><label for="pcm">رسالة قصيرة</label><input id="pcm" maxlength="40" placeholder="سلامات من قلعة الخريف!"></div>
    <div class="row"><button class="btn honey" data-dl>${IC.save} حفظ البطاقة PNG</button></div><p class="d-note">اللوحة تنرسم كاملة داخل الإطار بدون أي تغيير عليها.</p>`, {wide:true});
  let fr="copper", stp="clock"; const cv=$(".pc-cv",md.el), c=cv.getContext("2d"), img=new Image(); img.src=CASTLE;
  const svgImg=s=>{ const im=new Image(); im.src=svgURL(s); return im; };
  const stamps={clock:svgImg(clockSVG(10,10)), leaf:svgImg(ART.maple(PAL.coral)), ticket:svgImg(ART.ticket())};
  const draw=()=>{ const [a,b]=frames[fr]; c.fillStyle=a; c.fillRect(0,0,900,600); c.strokeStyle=b; c.lineWidth=6; c.strokeRect(14,14,872,572); c.fillStyle=PAL.ivory; c.fillRect(40,40,820,462);
    if(img.complete && img.naturalWidth){ const w=812, hh=w*CASTLE_H/CASTLE_W; c.drawImage(img, 44, 44+(454-hh)/2, w, hh); }
    c.fillStyle=PAL.ivory; c.fillRect(40,510,820,60); c.fillStyle=PAL.ink; c.font="bold 30px 'Aref Ruqaa', serif"; c.textAlign="center"; c.direction="rtl"; c.fillText(($("#pcm",md.el).value||"سلامات من قلعة الخريف!"), 430, 550);
    const s=stamps[stp]; c.fillStyle="#FBF8F0"; c.fillRect(770,58,80,90); c.strokeStyle=PAL.coral; c.lineWidth=3; c.setLineDash([6,4]); c.strokeRect(770,58,80,90); c.setLineDash([]); if(s.complete) c.drawImage(s, 780, 70, 60, 60); };
  img.onload=draw; Object.values(stamps).forEach(s=>s.onload=draw);
  const seg=(sel,set,val)=>{ $$(sel+" button",md.el).forEach(b=>{ b.setAttribute("aria-pressed",b.dataset.v===val); b.onclick=()=>{ set(b.dataset.v); $$(sel+" button",md.el).forEach(x=>x.setAttribute("aria-pressed",x===b)); draw(); }; }); };
  seg("[data-f]",v=>fr=v,fr); seg("[data-st]",v=>stp=v,stp); $("#pcm",md.el).oninput=draw; draw();
  $("[data-dl]",md.el).onclick=()=>{ cv.toBlob(bl=>offerDownload("بطاقة-القلعة.png", bl, ()=>modal(`<img src="${cv.toDataURL()}" style="width:100%" alt="بطاقة بريد">`)), "image/png"); if(!flag("postcard")){ setFlag("postcard"); grantReward("sticker_stamp"); addStars(1,"أول بطاقة بريد"); } };
}

/* ---------- النهاية: الساعة ترجع تدق، وكل اختيار سويتوه يرجع بسطر ---------- */
function finale(ctx){
  const songLine = {leaves:["y",1,"لحن الأوراق… حتى الريح صارت تغني ويّاه."], siraj:["siraj",1,"تك تك دنگ! هذا لحني! كل الفوانيس ترقص."], garden:["shawka",1,"هاي دندنتي! سمعتها الساعة من الحديقة."]}[WS.song] || ["k",1,"دنگ… دنگ!"];
  const lines=[["saadoun",1,"دنگ… دنگ… دنگ! الساعة رجعت تدق!"], songLine, ["k",1,"الشمس نزلت! صار مغرب… وبعدين ليل!"]];
  if(flag("capReturned")) lines.push(["shawka",1,"وآني أتمشّى بقبعتي تحت النجوم!"]);
  if(flag("catBell")) lines.push(["cat",1,"مياو! وجرسي يرن ويه الساعة؛ كل القطارات طلعت بوقتها."]);
  if(progress.once_runway1) lines.push(["rayhana",1,"وأجنحة التروس اللي خيّطتها إلكم؟ هسه تلمع بضو الساعة."]);
  if(talesDone()>=1) lines.push(["owl",1,`هوو… ${talesDone()} حكايات خلصت، وهاي صارت أحلاها.`]);
  if(flag("lampsLit")) lines.push(["siraj",1,"والفوانيس اللي ضوّيتوها بغرفتي صارت مثل نجوم على الدروب."]);
  if(flag("lore")) lines.push(["saadoun",0,"جدّتي جانت تگول: «الوقت ما يضيع؛ بس ينتظر أحد يدوّره». إنتو دوّرتوه."]);
  lines.push(["siraj",0,"وآني؟ راح أبقى دليل الممرات. كل طريق بعده يخفي حكاية."], ["k",1,"يقين… شنو المغامرة الجاية؟"], ["y",2,"يمكن نخلّص كل الحكايات… أو نلعب ويه صديق من جهاز ثاني!"]);
  $(".room-stage",ctx.v).classList.add("finale");
  ctx.say(lines, ()=>{ setFlag("clockRestored"); setFlag("night"); grantReward("medal_clock"); grantReward("decor_clock"); addStars(5, "ساعة الخريف رجعت تدق"); checkQuestRewards(); confetti(); ctx.refresh();
    modal(`<div class="tour-body"><div class="win-kids">${faceHTML("k",1,66)}${faceHTML("y",1,66)}</div><div><h2>ساعة الخريف رجعت تدق!</h2><p style="margin:0">خلّصتوا المهمة الرئيسية. هسه الخريطة بيها ليل ونهار، وأجنحة التروس انفتحت بقصر الأزياء.</p></div></div><div class="row"><button class="btn honey" data-w>${IC.map} شوفوا الخريطة بالليل</button></div>`).el.querySelector("[data-w]").onclick=()=>{ $$(".scrim").forEach(x=>x.remove()); go("world"); }; });
}

Object.assign(ROUTES, { room:{view:(r,id)=>viewRoom(r,id), title:id=>placeName(id), parent:"world"} });
