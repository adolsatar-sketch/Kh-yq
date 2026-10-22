/* ============ دفترنا: المذكرات، المرسم، الرسائل، الرسم المشترك — نسخة لعبة خباب ويقين ============ */
const KY_MOOD = {happy:"فرحانين", calm:"رايقين", love:"مشتاقين", sleepy:"نعسانين", sad:"زعلانين شوي"};
/* ============ PAINT ============ */
const BASE_COLORS = ["#3D3A2E","#7A5A3A","#4F7350","#9DBF8E","#8EC3CF","#4E8E9C","#B9A6DD","#E9A79E","#E8C066","#FBF6E8"];
function viewPaint(root, tpl){
  const saved = Store.get("paint", null);
  const st = { bg: (tpl && TEMPLATES[tpl]) ? tpl : (saved?.bg || "paper"), items: (tpl && TEMPLATES[tpl]) ? [] : (saved?.items || []) };
  let tool="pen", color="#3D3A2E", size=6, undo=[], redo=[], selected=-1, drawing=null, dragging=null;
  const unlockedColors = CONFIG.unlocks.filter(u=>u.type==="color");
  const v = h(`<section class="view"><div class="paint">
    <div class="tools panel" role="toolbar" aria-label="أدوات الرسم">
      <h4>الأداة</h4>
      <div class="tool-row">
        <button class="tool" data-t="pen" aria-label="قلم (P)" title="قلم (P)">${IC.pen}</button>
        <button class="tool" data-t="brush" aria-label="فرشاة ناعمة (B)" title="فرشاة ناعمة (B)">${IC.brush}</button>
        <button class="tool" data-t="crayon" aria-label="طبشور (C)" title="طبشور (C)">${IC.crayon}</button>
        <button class="tool" data-t="eraser" aria-label="ممحاة (E)" title="ممحاة (E)">${IC.eraser}</button>
        <button class="tool" data-t="move" aria-label="تحريك الملصقات (M)" title="تحريك الملصقات (M)">${IC.move}</button>
      </div>
      <h4>اللون</h4>
      <div class="tool-row" data-colors>${BASE_COLORS.map(c=>`<button class="swatch" data-c="${c}" style="background:${c}" aria-label="لون ${c}"></button>`).join("")}${unlockedColors.map(u=>`<button class="swatch ${progress.stars>=u.at?"":"locked"}" data-c="${u.value}" style="background:${u.value}" aria-label="${esc(u.label)}" title="${progress.stars>=u.at?esc(u.label):"يفتح عند "+u.at+" نجوم"}"></button>`).join("")}<label class="swatch" style="display:grid;place-items:center;overflow:hidden;background:conic-gradient(#E9A79E,#E8C066,#9DBF8E,#8EC3CF,#B9A6DD,#E9A79E)" title="لون مخصص"><input type="color" value="#3D3A2E" style="opacity:0;width:100%;height:100%;border:0;padding:0" aria-label="لون مخصص" data-custom></label></div>
      <h4>السماكة: <span data-sz>6</span></h4>
      <input type="range" min="2" max="48" value="6" data-size aria-label="السماكة">
      <h4>الخلفية</h4>
      <div class="seg" role="group"><button data-bg="paper">ورقة</button><button data-bg="sky">سماء</button><button data-bg="forest">غابة</button></div><div class="seg" role="group" style="flex-wrap:wrap">${Object.entries(TEMPLATES).map(([k,n])=>`<button data-bg="${k}">${n}</button>`).join("")}</div>
      <h4>ملصقات</h4>
      <div class="tool-row">${Object.entries(STICKERS).map(([k,s])=>`<button class="stk-btn ${s.lock && !isUnlocked(s.lock)?"locked":""}" data-stk="${k}" aria-label="ملصق ${esc(s.label)}" title="${s.lock && !isUnlocked(s.lock)?"يفتح بنجوم الصداقة":esc(s.label)}"><img src="${s.src}" alt=""></button>`).join("")}</div>
      <div class="tool-row" data-stk-ctl hidden><button class="btn ghost small" data-stk-del>${IC.trash} احذفوا الملصق</button></div>
      <div class="tool-row"><button class="tool" data-undo aria-label="تراجع (Ctrl+Z)" title="تراجع">${IC.undo}</button><button class="tool" data-redo aria-label="إعادة (Ctrl+Y)" title="إعادة">${IC.redo}</button><button class="tool" data-clear aria-label="مسح اللوحة" title="مسح اللوحة">${IC.trash}</button></div>
      <button class="btn honey" data-png>${IC.save} احفظوا الرسمة PNG</button>
      <p class="d-note" style="margin:0">الرسمة تنحفظ مسودة تلقائياً على هذا الجهاز.</p>
    </div>
    <div class="canvas-wrap"><div class="canvas-box"><canvas data-bgc></canvas><canvas data-dc aria-label="لوحة الرسم"></canvas></div></div>
  </div></section>`);
  root.appendChild(v);
  const box=$(".canvas-box",v), bgc=$("[data-bgc]",v), dc=$("[data-dc]",v), bx=bgc.getContext("2d"), dx=dc.getContext("2d");
  const forestImg = loadImg("forest", FOREST);
  let W=0,Hc=0,dpr=1;
  function sizeC(){ const r=box.getBoundingClientRect(); dpr=Math.min(2,window.devicePixelRatio||1); W=r.width; Hc=r.height; [bgc,dc].forEach(c=>{ c.width=Math.round(W*dpr); c.height=Math.round(Hc*dpr); }); bx.setTransform(dpr,0,0,dpr,0,0); dx.setTransform(dpr,0,0,dpr,0,0); renderAll(); }
  function paintBg(ctx,w,hh){
    ctx.clearRect(0,0,w,hh);
    if(st.bg==="paper"){ ctx.fillStyle="#FFFBEF"; ctx.fillRect(0,0,w,hh); ctx.strokeStyle="rgba(142,195,207,.35)"; ctx.lineWidth=1; for(let y=hh*.08;y<hh;y+=hh*.07){ ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(w,y); ctx.stroke(); } }
    else if(st.bg==="sky"){ const g=ctx.createLinearGradient(0,0,0,hh); g.addColorStop(0,"#CFE6F0"); g.addColorStop(.7,"#EEF4F2"); g.addColorStop(1,"#E5EFD3"); ctx.fillStyle=g; ctx.fillRect(0,0,w,hh); }
    else if(TEMPLATES[st.bg]) drawTemplate(ctx,w,hh,st.bg);
    else { ctx.fillStyle="#EEF3DA"; ctx.fillRect(0,0,w,hh); if(forestImg.complete && forestImg.naturalWidth){ const ir=forestImg.naturalWidth/forestImg.naturalHeight, cr=w/hh; let sw,sh2,sx,sy; if(ir>cr){ sh2=forestImg.naturalHeight; sw=sh2*cr; sx=(forestImg.naturalWidth-sw)/2; sy=0; } else { sw=forestImg.naturalWidth; sh2=sw/cr; sx=0; sy=(forestImg.naturalHeight-sh2)/2; } ctx.globalAlpha=.75; ctx.drawImage(forestImg,sx,sy,sw,sh2,0,0,w,hh); ctx.globalAlpha=1; } }
  }
  function rnd(seed){ let s=seed|0||1; return ()=>((s=Math.imul(s^s>>>15,1|s),s^=s+Math.imul(s^s>>>7,61|s),((s^s>>>14)>>>0)/4294967296)); }
  function drawItem(ctx,it,w,hh){
    if(it.t==="k"){ const im=IMG["stk_"+it.k]; if(!im||!im.complete) return; const sw=it.s*w, ar=(im.naturalHeight||1)/(im.naturalWidth||1), shh=sw*ar; ctx.drawImage(im, it.x*w-sw/2, it.y*hh-shh/2, sw, shh); return; }
    const p=it.p; if(!p.length) return; const lw=it.w*w/800;
    ctx.save(); ctx.lineCap="round"; ctx.lineJoin="round";
    if(it.tool==="eraser") ctx.globalCompositeOperation="destination-out";
    if(it.tool==="crayon"){ const r=rnd(it.seed); ctx.fillStyle=it.c; for(let i=1;i<p.length;i++){ const ax=p[i-1][0]*w, ay=p[i-1][1]*hh, bx2=p[i][0]*w, by=p[i][1]*hh; const d=Math.hypot(bx2-ax,by-ay), n=Math.max(1,Math.ceil(d/1.5)); for(let k=0;k<n;k++){ const t=k/n, x=ax+(bx2-ax)*t, y=ay+(by-ay)*t; for(let j=0;j<3;j++){ if(r()<.55){ ctx.globalAlpha=.35+r()*.5; ctx.fillRect(x+(r()-.5)*lw, y+(r()-.5)*lw, 1.4, 1.4); } } } } ctx.restore(); return; }
    ctx.strokeStyle=it.tool==="eraser"?"#000":it.c; ctx.lineWidth=lw;
    if(it.tool==="brush"){ ctx.globalAlpha=.32; ctx.shadowColor=it.c; ctx.shadowBlur=lw*.8; ctx.lineWidth=lw*1.4; }
    ctx.beginPath(); ctx.moveTo(p[0][0]*w,p[0][1]*hh);
    if(p.length===1) ctx.lineTo(p[0][0]*w+.1,p[0][1]*hh);
    for(let i=1;i<p.length-1;i++){ const mx=(p[i][0]+p[i+1][0])/2*w, my=(p[i][1]+p[i+1][1])/2*hh; ctx.quadraticCurveTo(p[i][0]*w,p[i][1]*hh,mx,my); }
    if(p.length>1){ const l=p[p.length-1]; ctx.lineTo(l[0]*w,l[1]*hh); }
    ctx.stroke(); ctx.restore();
  }
  function renderAll(){ paintBg(bx,W,Hc); dx.clearRect(0,0,W,Hc); st.items.forEach(it=>drawItem(dx,it,W,Hc)); if(drawing) drawItem(dx,drawing,W,Hc); if(tool==="move" && selected>=0 && st.items[selected]){ const it=st.items[selected]; const im=IMG["stk_"+it.k]; const sw=it.s*W, shh=sw*((im&&im.naturalHeight||1)/(im&&im.naturalWidth||1)); dx.save(); dx.setLineDash([6,5]); dx.strokeStyle="#B88F33"; dx.lineWidth=2; dx.strokeRect(it.x*W-sw/2-4, it.y*Hc-shh/2-4, sw+8, shh+8); dx.restore(); } }
  let saveT; function persist(){ clearTimeout(saveT); saveT=setTimeout(()=>Store.set("paint", st), 500); }
  function snap(){ undo.push(JSON.stringify(st.items)); if(undo.length>40) undo.shift(); redo=[]; syncUR(); }
  function syncUR(){ $("[data-undo]",v).disabled=!undo.length; $("[data-redo]",v).disabled=!redo.length; }
  function setTool(t){ tool=t; $$("[data-t]",v).forEach(b=>b.setAttribute("aria-pressed", b.dataset.t===t)); if(t!=="move"){ selected=-1; $("[data-stk-ctl]",v).hidden=true; } box.style.cursor = t==="move"?"grab":"crosshair"; renderAll(); }
  function setColor(c){ color=c; $$("[data-c]",v).forEach(b=>b.setAttribute("aria-pressed", b.dataset.c===c)); if(tool==="eraser"||tool==="move") setTool("pen"); }
  function setBg(b){ st.bg=b; $$("[data-bg]",v).forEach(x=>x.setAttribute("aria-pressed", x.dataset.bg===b)); renderAll(); persist(); }
  $$("[data-t]",v).forEach(b=>b.onclick=()=>setTool(b.dataset.t));
  $$("[data-c]",v).forEach(b=>b.onclick=()=>setColor(b.dataset.c));
  $("[data-custom]",v).oninput=e=>{ color=e.target.value; $$("[data-c]",v).forEach(b=>b.setAttribute("aria-pressed","false")); if(tool==="eraser"||tool==="move") setTool("pen"); };
  $("[data-size]",v).oninput=e=>{ size=+e.target.value; $("[data-sz]",v).textContent=size; if(tool==="move" && selected>=0){ st.items[selected].s = .06 + size/48*.34; renderAll(); persist(); } };
  $$("[data-bg]",v).forEach(b=>b.onclick=()=>{ snap(); setBg(b.dataset.bg); });
  $$("[data-stk]",v).forEach(b=>b.onclick=()=>{ snap(); st.items.push({t:"k",k:b.dataset.stk,x:.5+(Math.random()-.5)*.2,y:.5+(Math.random()-.5)*.2,s:.18}); selected=st.items.length-1; setTool("move"); $("[data-stk-ctl]",v).hidden=false; renderAll(); persist(); Sound.pop(); });
  $("[data-stk-del]",v).onclick=()=>{ if(selected<0) return; snap(); st.items.splice(selected,1); selected=-1; $("[data-stk-ctl]",v).hidden=true; renderAll(); persist(); };
  const doUndo=()=>{ if(!undo.length) return; redo.push(JSON.stringify(st.items)); st.items=JSON.parse(undo.pop()); selected=-1; syncUR(); renderAll(); persist(); };
  const doRedo=()=>{ if(!redo.length) return; undo.push(JSON.stringify(st.items)); st.items=JSON.parse(redo.pop()); selected=-1; syncUR(); renderAll(); persist(); };
  $("[data-undo]",v).onclick=doUndo; $("[data-redo]",v).onclick=doRedo;
  $("[data-clear]",v).onclick=()=>confirmBox("تمسحون اللوحة كلها؟","امسحوا",()=>{ snap(); st.items=[]; selected=-1; renderAll(); persist(); });
  // pointer drawing
  const pos = e => { const r=dc.getBoundingClientRect(); return [ (e.clientX-r.left)/r.width, (e.clientY-r.top)/r.height ]; };
  function hitSticker(x,y){ for(let i=st.items.length-1;i>=0;i--){ const it=st.items[i]; if(it.t!=="k") continue; const im=IMG["stk_"+it.k]; const ar=(im&&im.naturalHeight||1)/(im&&im.naturalWidth||1); const hw=it.s/2, hh2=it.s*ar*W/Hc/2; if(Math.abs(x-it.x)<hw && Math.abs(y-it.y)<hh2) return i; } return -1; }
  dc.addEventListener("pointerdown", e=>{
    e.preventDefault(); dc.setPointerCapture && dc.setPointerCapture(e.pointerId); const [x,y]=pos(e);
    if(tool==="move"){ const i=hitSticker(x,y); selected=i; $("[data-stk-ctl]",v).hidden = i<0; if(i>=0){ snap(); dragging={i, ox:x-st.items[i].x, oy:y-st.items[i].y}; box.style.cursor="grabbing"; } renderAll(); return; }
    const pr = e.pressure && e.pointerType==="pen" ? .5+e.pressure : 1;
    drawing={t:"s", tool, c:color, w:size*pr, p:[[+x.toFixed(4),+y.toFixed(4)]], seed:Math.floor(Math.random()*1e9)}; renderAll();
  });
  dc.addEventListener("pointermove", e=>{
    if(dragging){ const [x,y]=pos(e); const it=st.items[dragging.i]; it.x=Math.min(1,Math.max(0,x-dragging.ox)); it.y=Math.min(1,Math.max(0,y-dragging.oy)); renderAll(); return; }
    if(!drawing) return; const evs = e.getCoalescedEvents ? e.getCoalescedEvents() : [e];
    evs.forEach(ev=>{ const [x,y]=pos(ev); const l=drawing.p[drawing.p.length-1]; if(Math.hypot((x-l[0])*W,(y-l[1])*Hc)>1.6) drawing.p.push([+x.toFixed(4),+y.toFixed(4)]); });
    renderAll();
  });
  const endDraw=()=>{ if(dragging){ dragging=null; box.style.cursor="grab"; persist(); return; } if(!drawing) return; snap(); st.items.push(drawing); drawing=null; renderAll(); persist(); };
  dc.addEventListener("pointerup", endDraw); dc.addEventListener("pointercancel", endDraw); dc.addEventListener("pointerleave", e=>{ if(e.pointerType==="mouse" && e.buttons===0) endDraw(); });
  const key=e=>{ if(e.target.matches("input,textarea")) return; const k=e.key.toLowerCase();
    if((e.ctrlKey||e.metaKey) && k==="z"){ e.preventDefault(); e.shiftKey?doRedo():doUndo(); return; }
    if((e.ctrlKey||e.metaKey) && k==="y"){ e.preventDefault(); doRedo(); return; }
    const map={p:"pen",b:"brush",c:"crayon",e:"eraser",m:"move"}; if(map[k] && !e.ctrlKey && !e.metaKey) setTool(map[k]);
    if((k==="delete"||k==="backspace") && tool==="move" && selected>=0){ snap(); st.items.splice(selected,1); selected=-1; renderAll(); persist(); } };
  window.addEventListener("keydown", key);
  $("[data-png]",v).onclick=()=>{
    const ow=1600, oh=1200, oc=document.createElement("canvas"); oc.width=ow; oc.height=oh; const o=oc.getContext("2d");
    paintBg(o,ow,oh); const lc=document.createElement("canvas"); lc.width=ow; lc.height=oh; const l=lc.getContext("2d"); st.items.forEach(it=>drawItem(l,it,ow,oh)); o.drawImage(lc,0,0);
    const name = `رسمة-خباب-ويقين-${new Date().toISOString().slice(0,10)}.png`;
    oc.toBlob(blob=>{ offerDownload(name, blob, ()=>{ const url=oc.toDataURL("image/png"); modal(`<h3>رسمتكم جاهزة</h3><p style="margin:0 0 10px">اضغطوا مطولاً على الصورة واختاروا «حفظ الصورة».</p><img src="${url}" alt="الرسمة" style="width:100%;border-radius:12px;border:2px solid var(--panel-edge)">`); }); addStarsOnce("paint_save", 1, "أول لوحة محفوظة"); }, "image/png");
  };
  setTool("pen"); setColor(color); setBg(st.bg); syncUR();
  const ro=new ResizeObserver(()=>sizeC()); ro.observe(box);
  forestImg.onload = renderAll; Object.keys(STICKERS).forEach(k=>{ const im=IMG["stk_"+k]; if(!im.complete) im.addEventListener("load", renderAll, {once:true}); });
  return ()=>{ ro.disconnect(); window.removeEventListener("keydown", key); clearTimeout(saveT); Store.set("paint", st); };
}
function addStarsOnce(key, n, why){ const k="once_"+key; if(progress[k]) return; progress[k]=true; addStars(n, why); }

/* ============ DIARY ============ */
const AR_MONTHS=["كانون الثاني","شباط","آذار","نيسان","أيار","حزيران","تموز","آب","أيلول","تشرين الأول","تشرين الثاني","كانون الأول"];
const AR_DAYS=["الأحد","الاثنين","الثلاثاء","الأربعاء","الخميس","الجمعة","السبت"];
const pd = d => { const [y,m,dd]=d.split("-").map(Number); return new Date(y,m-1,dd); };
const iso = dt => `${dt.getFullYear()}-${String(dt.getMonth()+1).padStart(2,"0")}-${String(dt.getDate()).padStart(2,"0")}`;
function fmtDate(d){ const dt=pd(d); return `${AR_DAYS[dt.getDay()]} ${dt.getDate()} ${AR_MONTHS[dt.getMonth()]} ${dt.getFullYear()}`; }
function loadDiary(){ let e = Store.get("diary", null); if(e===null){ e = CONFIG.demoDiary.map((d,i)=>Object.assign({id:"demo"+i, demo:true, created:Date.now()-i}, d)); Store.set("diary", e); } return Array.isArray(e)?e:[]; }
function viewDiary(root){
  let entries = loadDiary(), q="", moodF="", mode=Store.get("diaryMode","list"), cal=new Date(); cal.setDate(1);
  const save = () => Store.set("diary", entries);
  const sorted = () => entries.slice().sort((a,b)=> b.date.localeCompare(a.date) || (b.created||0)-(a.created||0));
  const v = h(`<section class="view"><div class="dj">
    <header class="dj-head panel paper-tex">
      <div class="dj-title"><div class="dj-cover">${ART.book("#2E5A50")}</div><div><h2>دفتر خباب ويقين</h2><p>صفحات صغيرة من أيامكم. محفوظة على هذا الجهاز فقط${Store.ok?"":" — الحفظ الدائم غير متاح بهذا المتصفح، صدّروا نسخة قبل الإغلاق"}.</p></div></div>
      <div class="dj-stats" data-stats></div>
      <button class="btn honey dj-new" data-new>${IC.plus} صفحة جديدة</button>
    </header>
    <div class="dj-bar panel">
      <input type="search" placeholder="ابحثوا بالعنوان أو النص" aria-label="بحث بالمذكرات" data-q>
      <div class="dj-moods" role="group" aria-label="فلتر المزاج"><button data-mf="" aria-pressed="true">الكل</button>${Object.keys(ART.mood).map(k=>`<button data-mf="${k}" aria-pressed="false" title="${KY_MOOD[k]}" aria-label="${KY_MOOD[k]}">${ART.mood[k]}</button>`).join("")}</div>
      <div class="seg" role="group" aria-label="طريقة العرض"><button data-mode="list">صفحات</button><button data-mode="cal">تقويم</button></div>
    </div>
    <div data-main></div>
    <footer class="dj-foot"><span>نسخة احتياطية:</span><button class="btn ghost small" data-exp>${IC.save} تصدير</button><button class="btn ghost small" data-imp>${IC.upload} استيراد</button></footer>
  </div></section>`);
  root.appendChild(v);
  const main=$("[data-main]",v);
  function stats(){
    const now=new Date(), ym=iso(now).slice(0,7), days=new Set(entries.map(e=>e.date));
    let streak=0; const d=new Date(); if(!days.has(iso(d))) d.setDate(d.getDate()-1); while(days.has(iso(d))){ streak++; d.setDate(d.getDate()-1); }
    $("[data-stats]",v).innerHTML = `<div><b>${entries.length}</b><span>صفحة</span></div><div><b>${entries.filter(e=>e.date.startsWith(ym)).length}</b><span>هذا الشهر</span></div><div><b>${streak}</b><span>أيام ورا بعض</span></div>`;
  }
  function filtered(){ const ql=q.trim().toLowerCase(); return sorted().filter(e=>(!ql || (e.title+" "+e.text).toLowerCase().includes(ql)) && (!moodF || e.mood===moodF)); }
  const card = e => { const dt=pd(e.date); return `<button class="dj-card ${e.pinned?"pinned":""}" data-id="${esc(e.id)}"><span class="dj-date"><b>${dt.getDate()}</b><span>${AR_DAYS[dt.getDay()]}</span></span><span class="dj-txt"><span class="dj-h">${esc(e.title||"بدون عنوان")}${e.demo?'<span class="demo-tag">مثال</span>':""}</span><span class="dj-ex">${esc(e.text)}</span><span class="dj-meta"><span class="dj-mood">${ART.mood[e.mood]||ART.mood.calm}</span>${esc(KY_MOOD[e.mood]||"")}${e.pinned?`<span class="dj-pin">${IC.star} مثبّتة</span>`:""}</span></span>${e.sticker&&STICKERS[e.sticker]&&(!STICKERS[e.sticker].lock||isUnlocked(STICKERS[e.sticker].lock))?`<img class="dj-stk" src="${STICKERS[e.sticker].src}" alt="">`:""}</button>`; };
  function renderList(){
    const list=filtered();
    if(!entries.length){ main.innerHTML=`<div class="panel d-empty">${npcHTML("siraj","idle")}<h3 style="font-family:var(--font-d);margin:0">الدفتر ينتظر أول صفحة</h3><p>اكتبوا شي صغير عن يومكم — كلمة وحدة تكفي.</p><button class="btn" data-new2>${IC.plus} اكتبوا أول صفحة</button></div>`; $("[data-new2]",main).onclick=()=>edit(null); return; }
    if(!list.length){ main.innerHTML=`<div class="panel d-empty"><p>ماكو صفحة تطابق البحث أو المزاج. جرّبوا غيرها.</p></div>`; return; }
    const pinned=list.filter(e=>e.pinned), rest=list.filter(e=>!e.pinned);
    let html=""; if(pinned.length) html+=`<section class="dj-sec"><h3 class="dj-mh">المثبّتة <small>${pinned.length}</small></h3><div class="dj-grid">${pinned.map(card).join("")}</div></section>`;
    const groups={}; rest.forEach(e=>{ (groups[e.date.slice(0,7)] ||= []).push(e); });
    Object.keys(groups).sort().reverse().forEach(m=>{ const [y,mm]=m.split("-"); html+=`<section class="dj-sec"><h3 class="dj-mh">${AR_MONTHS[+mm-1]} ${y} <small>${groups[m].length} ${groups[m].length===1?"صفحة":"صفحات"}</small></h3><div class="dj-grid">${groups[m].map(card).join("")}</div></section>`; });
    main.innerHTML=html;
    $$(".dj-card",main).forEach(b=>b.onclick=()=>read(b.dataset.id));
  }
  function renderCal(){
    const y=cal.getFullYear(), m=cal.getMonth(), first=new Date(y,m,1).getDay(), dim=new Date(y,m+1,0).getDate(); const today=iso(new Date());
    const byDay={}; filtered().forEach(e=>{ (byDay[e.date] ||= []).push(e); });
    const lead=(first+1)%7; // الأسبوع يبدأ بالسبت
    let cells=""; for(let i=0;i<lead;i++) cells+=`<span class="dj-day empty"></span>`;
    for(let d=1; d<=dim; d++){ const k=`${y}-${String(m+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`; const es=byDay[k]; cells+=`<button class="dj-day ${es?"has":""} ${k===today?"today":""}" data-day="${k}" aria-label="${fmtDate(k)}${es?" — "+es.length+" صفحة":""}"><span>${d}</span>${es?`<i>${ART.mood[es[0].mood]||ART.mood.calm}</i>`:""}</button>`; }
    main.innerHTML=`<div class="panel dj-cal"><div class="dj-calnav"><button class="ibtn" data-cm="-1" aria-label="الشهر السابق">${IC.right}</button><h3>${AR_MONTHS[m]} ${y}</h3><button class="ibtn" data-cm="1" aria-label="الشهر الجاي">${IC.left}</button></div>
      <div class="dj-week">${["سبت","أحد","اثنين","ثلاثاء","أربعاء","خميس","جمعة"].map(d=>`<span>${d}</span>`).join("")}</div><div class="dj-days">${cells}</div>
      <p class="d-note" style="margin:10px 0 0">اضغطوا يوم بيه صفحة حتى تقرونها، أو يوم فارغ حتى تكتبون بيه.</p></div>`;
    $$("[data-cm]",main).forEach(b=>b.onclick=()=>{ cal.setMonth(cal.getMonth()+(+b.dataset.cm)); renderCal(); });
    $$("[data-day]",main).forEach(b=>b.onclick=()=>{ const es=byDay[b.dataset.day]; if(es) read(es[0].id); else edit(null, b.dataset.day); });
  }
  function render(){ stats(); $$("[data-mode]",v).forEach(b=>b.setAttribute("aria-pressed", b.dataset.mode===mode)); mode==="cal"?renderCal():renderList(); }
  function read(id){
    const list=sorted(); let idx=list.findIndex(e=>e.id===id); if(idx<0) return;
    const md=modal(`<div data-page></div>`, {wide:true, cls:"dj-reader"});
    const page=$("[data-page]",md.el);
    const draw=()=>{ const e=list[idx];
      page.innerHTML=`<article class="dj-sheet"><header><div class="dj-sheet-mood">${ART.mood[e.mood]||ART.mood.calm}</div><div><p class="dj-sheet-date">${fmtDate(e.date)} — ${esc(KY_MOOD[e.mood]||"")}</p><h2>${esc(e.title||"بدون عنوان")}</h2></div>${e.sticker&&STICKERS[e.sticker]?`<img src="${STICKERS[e.sticker].src}" alt="" class="dj-sheet-stk">`:""}</header><div class="dj-sheet-body">${esc(e.text)}</div></article>
        <div class="row" style="justify-content:space-between;align-items:center"><div style="display:flex;gap:8px"><button class="btn ghost small" data-nav="1" ${idx>=list.length-1?"disabled":""}>${IC.right} الأقدم</button><button class="btn ghost small" data-nav="-1" ${idx<=0?"disabled":""}>الأحدث ${IC.left}</button></div>
        <div style="display:flex;gap:8px;flex-wrap:wrap"><button class="btn ghost small" data-pin>${IC.star} ${e.pinned?"إلغاء التثبيت":"ثبّتوها"}</button><button class="btn small" data-ed>${IC.pen} تعديل</button><button class="btn danger small" data-del aria-label="حذف">${IC.trash}</button></div></div>`;
      $$("[data-nav]",page).forEach(b=>b.onclick=()=>{ idx+= +b.dataset.nav; draw(); });
      $("[data-pin]",page).onclick=()=>{ const t=entries.find(x=>x.id===e.id); t.pinned=!t.pinned; e.pinned=t.pinned; save(); draw(); render(); };
      $("[data-ed]",page).onclick=()=>{ md.close(); edit(entries.find(x=>x.id===e.id)); };
      $("[data-del]",page).onclick=()=>{ md.close(); confirmBox("تحذفون هاي الصفحة؟","احذفوا",()=>{ entries=entries.filter(x=>x.id!==e.id); save(); render(); toast("انحذفت الصفحة","trash"); }); };
    };
    draw();
  }
  function edit(entry, date){
    const isNew=!entry; const draft=isNew?Store.get("diaryDraft",null):null;
    const e = entry ? Object.assign({},entry) : Object.assign({id:"d"+Date.now().toString(36)+Math.random().toString(36).slice(2,6), date:date||iso(new Date()), title:"", text:"", mood:"happy", sticker:"", created:Date.now()}, draft&&!date?{title:draft.title,text:draft.text,mood:draft.mood||"happy"}:{});
    const md = modal(`<h2>${isNew?"صفحة جديدة":"تعديل الصفحة"}</h2>${draft&&isNew&&!date&&(draft.title||draft.text)?'<p class="d-note">رجّعنا المسودة اللي ما انحفظت.</p>':""}
      <div class="dj-form">
        <div class="field"><label for="dd">التاريخ</label><input id="dd" type="date" value="${esc(e.date)}" required></div>
        <div class="field" style="grid-column:1/-1"><label for="dt">العنوان</label><input id="dt" type="text" maxlength="80" value="${esc(e.title)}" placeholder="مثلاً: قهوة الصبح"></div>
        <div class="field" style="grid-column:1/-1"><label for="dx">شنو صار؟ <small data-wc></small></label><textarea id="dx" rows="7" placeholder="اكتبوا براحتكم…">${esc(e.text)}</textarea></div>
        <div class="field" style="grid-column:1/-1"><label>المزاج</label><div class="moods">${Object.keys(ART.mood).map(k=>`<button type="button" data-m="${k}" aria-pressed="${e.mood===k}" title="${KY_MOOD[k]}"><span style="display:block;width:30px;margin:0 auto">${ART.mood[k]}</span><small>${KY_MOOD[k]}</small></button>`).join("")}</div></div>
        <div class="field" style="grid-column:1/-1"><label>ملصق (اختياري)</label><div class="stks"><button type="button" data-s="" aria-pressed="${!e.sticker}" aria-label="بدون ملصق">${IC.close}</button>${Object.entries(STICKERS).filter(([k,s])=>!s.lock||isUnlocked(s.lock)).map(([k,s])=>`<button type="button" data-s="${k}" aria-pressed="${e.sticker===k}" aria-label="${esc(s.label)}"><img src="${s.src}" alt=""></button>`).join("")}</div></div>
      </div>
      <div class="row"><button class="btn honey" data-sv>${IC.check} احفظوا الصفحة</button><button class="btn ghost" data-cancel>إلغاء</button></div>`, {wide:true});
    const tx=$("#dx",md.el), wc=$("[data-wc]",md.el);
    const count=()=>{ const n=tx.value.trim()?tx.value.trim().split(/\s+/).length:0; wc.textContent=`(${n} كلمة)`; };
    count();
    let dT; const keepDraft=()=>{ if(!isNew) return; clearTimeout(dT); dT=setTimeout(()=>Store.set("diaryDraft",{title:$("#dt",md.el).value,text:tx.value,mood:e.mood}),400); };
    tx.oninput=()=>{ count(); keepDraft(); }; $("#dt",md.el).oninput=keepDraft;
    $$("[data-m]",md.el).forEach(b=>b.onclick=()=>{ e.mood=b.dataset.m; $$("[data-m]",md.el).forEach(x=>x.setAttribute("aria-pressed",x===b)); keepDraft(); });
    $$("[data-s]",md.el).forEach(b=>b.onclick=()=>{ e.sticker=b.dataset.s; $$("[data-s]",md.el).forEach(x=>x.setAttribute("aria-pressed",x===b)); });
    $("[data-cancel]",md.el).onclick=md.close;
    $("[data-sv]",md.el).onclick=()=>{ e.date=$("#dd",md.el).value||e.date; e.title=$("#dt",md.el).value.trim(); e.text=tx.value.trim(); if(!e.title && !e.text){ toast("اكتبوا عنوان أو نص قبل الحفظ","bulb"); return; } e.updated=Date.now(); delete e.demo;
      const i=entries.findIndex(x=>x.id===e.id); if(i>=0) entries[i]=e; else entries.push(e); save(); if(isNew) Store.del("diaryDraft"); clearTimeout(dT); md.close();
      cal=pd(e.date); cal.setDate(1); render(); toast("انحفظت الصفحة","check"); if(isNew) addStarsOnce("diary_first",1,"أول صفحة بالدفتر"); };
  }
  $("[data-new]",v).onclick=()=>edit(null);
  $("[data-q]",v).oninput=e=>{ q=e.target.value; render(); };
  $$("[data-mf]",v).forEach(b=>b.onclick=()=>{ moodF=b.dataset.mf; $$("[data-mf]",v).forEach(x=>x.setAttribute("aria-pressed",x===b)); render(); });
  $$("[data-mode]",v).forEach(b=>b.onclick=()=>{ mode=b.dataset.mode; Store.set("diaryMode",mode); render(); });
  $("[data-exp]",v).onclick=()=>{ const data=JSON.stringify({app:"ghabatna-diary", version:2, exported:new Date().toISOString(), entries},null,2); offerDownload(`مذكرات-خباب-ويقين-${iso(new Date())}.json`, data, ()=>{ const md=modal(`<h3>نسخة المذكرات</h3><p style="margin:0 0 8px">انسخوا النص واحفظواه بملف.</p><textarea style="width:100%;min-height:220px;direction:ltr;font-family:monospace;font-size:.8rem;border-radius:12px;border:2px solid var(--panel-edge);background:var(--paper);padding:10px" readonly>${esc(data)}</textarea><div class="row"><button class="btn" data-copy>انسخوا</button></div>`); $("[data-copy]",md.el).onclick=()=>{ const ta=$("textarea",md.el); ta.select(); try{ navigator.clipboard.writeText(data).then(()=>toast("انتسخ","check"),()=>{document.execCommand("copy");toast("انتسخ","check");}); }catch(err){ document.execCommand("copy"); toast("انتسخ","check"); } }; }); };
  const fileIn=$("#importFile");
  $("[data-imp]",v).onclick=()=>{ fileIn.value=""; fileIn.click(); };
  fileIn.onchange=()=>{ const f=fileIn.files[0]; if(!f) return; const r=new FileReader(); r.onload=()=>{ try{ const d=JSON.parse(r.result); const arr=Array.isArray(d)?d:d.entries; if(!Array.isArray(arr)) throw 0; let added=0; arr.forEach(x=>{ if(!x||typeof x.date!=="string") return; const clean={id:String(x.id||("d"+Math.random().toString(36).slice(2))), date:x.date.slice(0,10), title:String(x.title||""), text:String(x.text||""), mood:ART.mood[x.mood]?x.mood:"calm", sticker:STICKERS[x.sticker]?x.sticker:"", pinned:!!x.pinned, created:+x.created||Date.now()}; const i=entries.findIndex(e=>e.id===clean.id); if(i>=0) entries[i]=clean; else { entries.push(clean); added++; } }); save(); render(); toast(`استوردنا ${added} صفحة جديدة`,"check"); }catch(err){ toast("الملف مو نسخة مذكرات صالحة","close"); } }; r.readAsText(f); };
  render();
}

/* ============ دفترنا ============ */
const TEMPLATES = {letter:"ورقة رسالة", map:"خريطة كنز", dress:"تصميم فستان", wings:"تصميم جناح", journal:"صفحة يوميات"};
function drawTemplate(ctx, w, hh, kind){
  ctx.fillStyle="#FBF3E2"; ctx.fillRect(0,0,w,hh); ctx.strokeStyle="rgba(140,90,43,.35)"; ctx.lineWidth=Math.max(1,w/800);
  const s=w/800;
  if(kind==="letter"){ ctx.strokeStyle="rgba(181,72,42,.45)"; ctx.strokeRect(24*s,24*s,w-48*s,hh-48*s); ctx.strokeStyle="rgba(62,111,160,.25)"; for(let y=110*s;y<hh-40*s;y+=38*s){ ctx.beginPath(); ctx.moveTo(60*s,y); ctx.lineTo(w-60*s,y); ctx.stroke(); } ctx.fillStyle="rgba(122,46,42,.6)"; ctx.font=`${28*s}px serif`; ctx.textAlign="center"; ctx.fillText("✉",w/2,70*s); }
  else if(kind==="map"){ ctx.fillStyle="#F1DDB0"; ctx.fillRect(0,0,w,hh); ctx.strokeStyle="rgba(122,90,58,.5)"; ctx.setLineDash([10*s,10*s]); ctx.beginPath(); ctx.moveTo(80*s,hh-80*s); ctx.bezierCurveTo(300*s,hh-300*s,500*s,200*s,w-120*s,120*s); ctx.stroke(); ctx.setLineDash([]); ctx.strokeStyle="#B5482A"; ctx.lineWidth=6*s; ctx.beginPath(); ctx.moveTo(w-140*s,100*s); ctx.lineTo(w-100*s,140*s); ctx.moveTo(w-100*s,100*s); ctx.lineTo(w-140*s,140*s); ctx.stroke(); ctx.beginPath(); ctx.arc(80*s,80*s,40*s,0,7); ctx.strokeStyle="rgba(122,90,58,.6)"; ctx.lineWidth=2*s; ctx.stroke(); ctx.fillStyle="rgba(122,90,58,.7)"; ctx.font=`bold ${22*s}px serif`; ctx.textAlign="center"; ctx.fillText("N",80*s,62*s); }
  else if(kind==="dress"||kind==="wings"){ ctx.strokeStyle="rgba(122,90,58,.28)"; for(let x=0;x<w;x+=40*s){ ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,hh); ctx.stroke(); } for(let y=0;y<hh;y+=40*s){ ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(w,y); ctx.stroke(); }
    ctx.strokeStyle="rgba(60,40,30,.35)"; ctx.lineWidth=3*s; ctx.setLineDash([8*s,8*s]); ctx.beginPath(); const cx=w/2;
    if(kind==="dress"){ ctx.arc(cx,110*s,46*s,0,7); ctx.moveTo(cx-60*s,170*s); ctx.lineTo(cx+60*s,170*s); ctx.lineTo(cx+50*s,300*s); ctx.lineTo(cx+150*s,hh-60*s); ctx.lineTo(cx-150*s,hh-60*s); ctx.lineTo(cx-50*s,300*s); ctx.closePath(); }
    else { ctx.ellipse(cx,hh/2,20*s,120*s,0,0,7); ctx.moveTo(cx-20*s,hh/2-60*s); ctx.bezierCurveTo(cx-300*s,hh/2-300*s,cx-380*s,hh/2+40*s,cx-20*s,hh/2+30*s); ctx.moveTo(cx+20*s,hh/2-60*s); ctx.bezierCurveTo(cx+300*s,hh/2-300*s,cx+380*s,hh/2+40*s,cx+20*s,hh/2+30*s); }
    ctx.stroke(); ctx.setLineDash([]); }
  else if(kind==="journal"){ ctx.fillStyle="rgba(232,192,102,.25)"; ctx.fillRect(0,0,w,90*s); ctx.fillStyle="rgba(122,46,42,.7)"; ctx.font=`bold ${26*s}px serif`; ctx.textAlign="right"; ctx.fillText("اليوم:", w-40*s, 56*s); ctx.strokeStyle="rgba(62,111,160,.25)"; for(let y=140*s;y<hh-30*s;y+=40*s){ ctx.beginPath(); ctx.moveTo(40*s,y); ctx.lineTo(w*.55,y); ctx.stroke(); } ctx.strokeStyle="rgba(122,90,58,.4)"; ctx.strokeRect(w*.6,120*s,w*.36,hh*.55); }
}
function letterBox(){
  const md=modal(`<h2>رسالة</h2><div class="letter-paper"><div class="field"><label for="lto">إلى</label><input id="lto" maxlength="40" placeholder="مثلاً: يقين"></div><div class="field"><label for="ltx">الرسالة</label><textarea id="ltx" rows="8" placeholder="اكتبوا براحتكم…"></textarea></div></div><div class="row"><button class="btn honey" data-s>${IC.check} احفظوها بالدفتر</button></div>`,{wide:true});
  $("[data-s]",md.el).onclick=()=>{ const to=$("#lto",md.el).value.trim(), tx=$("#ltx",md.el).value.trim(); if(!tx){ toast("اكتبوا شي أول","bulb"); return; } const e=loadDiary(); e.push({id:"d"+Date.now().toString(36), date:new Date().toISOString().slice(0,10), title:"رسالة"+(to?" إلى "+to:""), text:tx, mood:"love", sticker:"heart", created:Date.now()}); Store.set("diary",e); md.close(); toast("انحفظت الرسالة بالمذكرات","check"); };
}
/* shared drawing (solo or with a friend) */
function viewDraw(root){
  const net = Party.connected() && Party.game==="draw";
  const myCol = net ? (Party.isHost?"#B5482A":"#2F5E57") : "#B5482A";
  let col=myCol, size=6, strokes=[], cur=null;
  const v=h(`<section class="view drawroom"><div class="dr-wrap">
    <div class="panel dr-bar"><b>${net?"رسم مشترك ويه "+esc(Party.other?Party.other.name:"صديق"):"رسم مشترك"}</b>
      <div class="pal-colors">${["#B5482A","#2F5E57","#D9A53A","#3E6FA0","#7A5AA0","#3A2A1C","#E9A79E","#FFFFFF"].map(c=>`<button class="swatch" data-c="${c}" style="background:${c}" aria-pressed="${c===col}"></button>`).join("")}</div>
      <label>السماكة <input type="range" min="2" max="30" value="6" data-sz></label>
      <button class="btn ghost small" data-undo>${IC.undo} تراجعوا</button><button class="btn ghost small" data-clear>${IC.trash} مسح</button><button class="btn honey small" data-png>${IC.save} حفظ PNG</button></div>
    <div class="dr-box"><canvas data-cv></canvas><div class="dr-cursors" data-cur></div></div>
    <p class="d-note">${net?"كل واحد يشوف مؤشر الثاني ولونه. الرسمة ما تنحفظ إلا إذا حفظتوها.":"افتحوا «العب مع صديق» واختاروا «رسم مشترك» حتى ترسمون من جهازين."}</p></div></section>`);
  root.appendChild(v);
  const box=$(".dr-box",v), cv=$("[data-cv]",v), cx=cv.getContext("2d"); let W=0,H=0;
  const size2=()=>{ const r=box.getBoundingClientRect(); const d=Math.min(2,devicePixelRatio||1); W=r.width; H=r.height; cv.width=W*d; cv.height=H*d; cx.setTransform(d,0,0,d,0,0); redraw(); };
  function seg(s){ cx.strokeStyle=s.c; cx.lineWidth=s.w*W/800; cx.lineCap="round"; cx.lineJoin="round"; cx.beginPath(); s.p.forEach((p,i)=>i?cx.lineTo(p[0]*W,p[1]*H):cx.moveTo(p[0]*W,p[1]*H)); if(s.p.length===1) cx.lineTo(s.p[0][0]*W+.1,s.p[0][1]*H); cx.stroke(); }
  function redraw(){ cx.fillStyle="#FFFBEF"; cx.fillRect(0,0,W,H); strokes.forEach(seg); if(cur) seg(cur); }
  const ro=new ResizeObserver(size2); ro.observe(box);
  const pos=e=>{ const r=cv.getBoundingClientRect(); return [+((e.clientX-r.left)/r.width).toFixed(4), +((e.clientY-r.top)/r.height).toFixed(4)]; };
  let lastSend=0;
  cv.onpointerdown=e=>{ cv.setPointerCapture(e.pointerId); cur={c:col,w:size,p:[pos(e)],by:Party.isHost?"A":"B",id:Math.random().toString(36).slice(2,8)}; redraw(); };
  cv.onpointermove=e=>{ const p=pos(e); if(net && performance.now()-lastSend>60){ lastSend=performance.now(); Party.send({t:"cur", p, c:col}); } if(!cur) return; cur.p.push(p); seg({c:cur.c,w:cur.w,p:cur.p.slice(-2)}); if(net && cur.p.length%6===0) Party.send({t:"part", s:{...cur, p:cur.p.slice(-7)}}); };
  const end=()=>{ if(!cur) return; strokes.push(cur); if(net) Party.send({t:"stroke", s:cur}); cur=null; };
  cv.onpointerup=end; cv.onpointercancel=end;
  $$("[data-c]",v).forEach(b=>b.onclick=()=>{ col=b.dataset.c; $$("[data-c]",v).forEach(x=>x.setAttribute("aria-pressed",x===b)); });
  $("[data-sz]",v).oninput=e=>size=+e.target.value;
  $("[data-undo]",v).onclick=()=>{ const me=Party.isHost||!net?"A":"B"; for(let i=strokes.length-1;i>=0;i--){ if(!net || strokes[i].by===me){ const [s]=strokes.splice(i,1); if(net) Party.send({t:"unstroke", id:s.id}); break; } } redraw(); };
  $("[data-clear]",v).onclick=()=>confirmBox("تمسحون الرسمة كلها؟","امسحوا",()=>{ strokes=[]; redraw(); if(net) Party.send({t:"clearall"}); });
  $("[data-png]",v).onclick=()=>{ cv.toBlob(b=>offerDownload("رسم-مشترك.png", b, ()=>modal(`<img src="${cv.toDataURL()}" style="width:100%">`)), "image/png"); };
  const offs=[];
  if(net){
    const curs=$("[data-cur]",v);
    offs.push(Party.on("cur", m=>{ let d=$(".rc",curs); if(!d){ d=h(`<span class="rc"><i></i><b>${esc(Party.other?Party.other.name:"صديق")}</b></span>`); curs.appendChild(d); } d.style.left=(m.p[0]*100)+"%"; d.style.top=(m.p[1]*100)+"%"; d.style.setProperty("--c", m.c); }));
    offs.push(Party.on("part", m=>{ seg(m.s); }));
    offs.push(Party.on("stroke", m=>{ strokes.push(m.s); redraw(); }));
    offs.push(Party.on("unstroke", m=>{ strokes=strokes.filter(s=>s.id!==m.id); redraw(); }));
    offs.push(Party.on("clearall", ()=>{ strokes=[]; redraw(); }));
    offs.push(Party.on("hello", ()=>{ if(Party.isHost) strokes.forEach(s=>Party.send({t:"stroke", s})); }));
  }
  return ()=>{ ro.disconnect(); offs.forEach(f=>f()); };
}
Object.assign(ROUTES, {
  book:{view:r=>viewRoom(r,"study"), title:()=>"غرفة دفترنا", parent:"world"},
  draw:{view:r=>viewDraw(r), title:()=>"رسم مشترك", parent:"book"}
});
ROUTES.paint = {view:(r,id)=>viewPaint(r,id), title:()=>"المرسم", parent:"book"};
