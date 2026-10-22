const SL_LEVELS = [
  {wind:0, towers:[[680,2,true],[820,3,true]]},
  {wind:1, towers:[[620,1,true],[740,3,true],[860,2,true]]},
  {wind:1, towers:[[640,2,true],[780,4,"dual"],[900,2,true]]}
];
function slBuild(lv){ const L=SL_LEVELS[lv]; const crates=[]; let id=0;
  L.towers.forEach(([x,n,cage])=>{ for(let i=0;i<n;i++) crates.push({id:id++,x,y:500-20-i*40,vx:0,vy:0,t:"c",ox:x,oy:500-20-i*40}); if(cage) crates.push({id:id++,x,y:500-20-n*40,vx:0,vy:0,t:cage==="dual"?"d":"b",ox:x,oy:500-20-n*40,hits:0,lastHit:0}); });
  return crates; }
KG.sling = {
  title:"مقلاع أوراق الخريف", tag:"تصويب تعاوني بحديقة القلعة", duo:true, tint:"#B5482A",
  icon:()=>ART.paperBird("#F2E6CF"),
  how:"حرّروا الطيور الورقية من أقفاصها. واحد يحدد الزاوية، والثاني يحدد القوة ويطلق، وبعد كل رمية تتبادلون الأدوار. القفص الذهبي يحتاج «إطلاق متزامن»: الاثنين يضغطون إطلاق بنفس الثانية.",
  roles:{A:"يبدي بالزاوية، وبعدين القوة", B:"يبدي بالقوة والإطلاق، وبعدين الزاوية"},
  keys:"الكيبورد: ↑↓ للزاوية، ←→ للقوة، المسافة للإطلاق.",
  bg:"background:linear-gradient(180deg,#F6C98B,#F3E6C8 60%,#C98A4A)",
  init(seed){ return {lv:0, angle:45, power:.6, wind:0, aimBy:"A", phase:"aim", shots:0, crates:slBuild(0), proj:[], freed:0, total:2, dual:{A:0,B:0}, msg:"", seed}; },
  act(S,a,by){
    const aimer=S.aimBy, powerer=aimer==="A"?"B":"A";
    if(a.k==="angle" && (by===aimer||by==="both")) S.angle=Math.max(10,Math.min(80,+a.v));
    if(a.k==="power" && (by===powerer||by==="both")) S.power=Math.max(.2,Math.min(1,+a.v));
    if(a.k==="fire" && S.phase==="aim" && (by===powerer||by==="both")){ slFire(S,0); }
    if(a.k==="dual" && S.phase==="aim"){ const r = by==="both" ? (a.by==="B"?"B":"A") : by; S.dual[r]=Date.now(); if(Math.abs(S.dual.A-S.dual.B)<1200){ slFire(S,-4); slFire(S,4); S.dual={A:0,B:0}; S.msg="إطلاق متزامن!"; } else S.msg="بانتظار الثاني يضغط…"; }
    if(a.k==="next" && S.lv<SL_LEVELS.length-1 && S.cleared){ S.lv++; S.crates=slBuild(S.lv); S.freed=0; S.cleared=false; S.total=S.crates.filter(c=>c.t!=="c").length; S.wind=SL_LEVELS[S.lv].wind?Math.round((Math.random()*2-1)*10)/10:0; S.phase="aim"; S.msg=""; }
    return S;
  },
  tick(S, dt){
    if(S.phase!=="fly") return S;
    const g=620, wind=S.wind*140;
    S.proj.forEach(p=>{ if(p.done) return; p.vy+=g*dt; p.vx+=wind*dt; p.x+=p.vx*dt; p.y+=p.vy*dt; p.t+=dt; if(p.y>490){ p.y=490; p.vy*=-.35; p.vx*=.6; if(Math.abs(p.vy)<40) p.done=true; } if(p.x>1060||p.x<-60||p.t>6) p.done=true;
      S.crates.forEach(c=>{ if(Math.abs(p.x-c.x)<30 && Math.abs(p.y-c.y)<30){ c.vx+=p.vx*.55; c.vy-=160; p.vx*=-.25; p.vy*=.4; p.x+= p.vx<0?-6:6; if(c.t==="d"){ if(Date.now()-c.lastHit<1500) c.hits++; else c.hits=1; c.lastHit=Date.now(); } } }); });
    for(const c of S.crates){ c.vy+=g*dt; c.x+=c.vx*dt; c.y+=c.vy*dt; if(c.y>480){ c.y=480; c.vy=0; c.vx*=.82; } }
    for(let pass=0;pass<3;pass++) for(let i=0;i<S.crates.length;i++) for(let j=i+1;j<S.crates.length;j++){ const a=S.crates[i], b=S.crates[j]; const dx=b.x-a.x, dy=b.y-a.y; if(Math.abs(dx)<40 && Math.abs(dy)<40){ const ox=40-Math.abs(dx), oy=40-Math.abs(dy); if(oy<ox){ const s=dy>0?1:-1; a.y-=s*oy/2; b.y+=s*oy/2; const top=s>0?a:b; top.vy=Math.min(top.vy,0); top.vx*=.9; } else { const s=dx>0?1:-1; a.x-=s*ox/2; b.x+=s*ox/2; const t=(a.vx+b.vx)/2; a.vx=t; b.vx=t; } } }
    S.crates.forEach(c=>{ c.x=Math.max(20,Math.min(990,c.x)); if(c.t!=="c" && !c.free){ const moved=Math.hypot(c.x-c.ox,c.y-c.oy)>34; if(moved && (c.t==="b" || c.hits>=2)){ c.free=true; S.freed++; } else if(c.t==="d" && moved && c.hits<2){ /* locked: put back gently */ c.x+= (c.ox-c.x)*.2; } } });
    const still = S.proj.every(p=>p.done) && S.crates.every(c=>Math.abs(c.vx)<6 && Math.abs(c.vy)<6);
    if(still){ S.phase="aim"; S.proj=[]; S.crates.forEach(c=>{ c.vx=0; c.vy=0; }); S.aimBy = S.aimBy==="A"?"B":"A"; if(SL_LEVELS[S.lv].wind) S.wind=Math.round((Math.random()*2-1)*10)/10; if(S.freed>=S.total){ S.cleared=true; S.msg = S.lv<SL_LEVELS.length-1 ? "تحررت كل الطيور! المرحلة الجاية؟" : ""; } else S.msg="تبادلتوا الأدوار"; }
    return S;
  },
  mount(ctx){
    ctx.stage.innerHTML=`<div class="sl"><canvas class="sl-cv" width="1000" height="560"></canvas>
      <div class="sl-ctl"><div class="sl-box" data-box="angle"><b>الزاوية <span data-av></span>°</b><input type="range" min="10" max="80" data-ang aria-label="الزاوية"><small data-who-a></small></div>
      <div class="sl-box" data-box="power"><b>القوة <span data-pv></span>%</b><input type="range" min="20" max="100" data-pow aria-label="القوة"><small data-who-p></small><button class="btn honey" data-fire>أطلقي</button></div>
      <div class="sl-box sl-dual" data-dualbox hidden><b>القفص الذهبي</b><small>الاثنين يضغطون خلال ثانية</small><div class="row" style="margin:0">${ctx.mine("A")?'<button class="btn" data-dual="A">إطلاق خباب</button>':""}${ctx.mine("B")?'<button class="btn" data-dual="B">إطلاق يقين</button>':""}</div></div>
      <button class="btn honey" data-next hidden>المرحلة الجاية</button></div><p class="sl-msg" data-msg></p></div>`;
    const st=ctx.stage;
    $("[data-ang]",st).oninput=e=>ctx.act({k:"angle",v:+e.target.value,by:ctx.state().aimBy});
    $("[data-pow]",st).oninput=e=>ctx.act({k:"power",v:+e.target.value/100,by:ctx.state().aimBy==="A"?"B":"A"});
    $("[data-fire]",st).onclick=()=>ctx.act({k:"fire",by:ctx.state().aimBy==="A"?"B":"A"});
    $$("[data-dual]",st).forEach(b=>b.onclick=()=>ctx.act({k:"dual",by:b.dataset.dual}));
    $("[data-next]",st).onclick=()=>ctx.act({k:"next"});
    ctx._img={bird:loadImg("sl_b",svgURL(ART.paperBird())), crate:loadImg("sl_c",svgURL(ART.crate())), leaf:loadImg("sl_l",svgURL(ART.maple("#C8552B"))), kid:loadImg("sl_k",BOY)};
  },
  key(e,S,ctx){ const aim=S.aimBy, pw=aim==="A"?"B":"A";
    if(e.key==="ArrowUp"&&ctx.mine(aim)){ e.preventDefault(); ctx.act({k:"angle",v:S.angle+2,by:aim}); }
    if(e.key==="ArrowDown"&&ctx.mine(aim)){ e.preventDefault(); ctx.act({k:"angle",v:S.angle-2,by:aim}); }
    if(e.key==="ArrowLeft"&&ctx.mine(pw)){ e.preventDefault(); ctx.act({k:"power",v:S.power+.04,by:pw}); }
    if(e.key==="ArrowRight"&&ctx.mine(pw)){ e.preventDefault(); ctx.act({k:"power",v:S.power-.04,by:pw}); }
    if(e.key===" "&&ctx.mine(pw)){ e.preventDefault(); ctx.act({k:"fire",by:pw}); } },
  render(S, ctx){
    const st=ctx.stage; if(!$(".sl",st)) return;
    const aim=S.aimBy, pw=aim==="A"?"B":"A";
    const ang=$("[data-ang]",st), pow=$("[data-pow]",st);
    if(document.activeElement!==ang) ang.value=S.angle; if(document.activeElement!==pow) pow.value=Math.round(S.power*100);
    $("[data-av]",st).textContent=Math.round(S.angle); $("[data-pv]",st).textContent=Math.round(S.power*100);
    ang.disabled=!ctx.mine(aim)||S.phase!=="aim"; pow.disabled=!ctx.mine(pw)||S.phase!=="aim"; $("[data-fire]",st).disabled=!ctx.mine(pw)||S.phase!=="aim";
    $("[data-who-a]",st).textContent="يتحكم: "+CH[ctx.charOf(aim)].name; $("[data-who-p]",st).textContent="يتحكم: "+CH[ctx.charOf(pw)].name;
    const hasDual=S.crates.some(c=>c.t==="d"&&!c.free); $("[data-dualbox]",st).hidden=!hasDual;
    $("[data-next]",st).hidden=!(S.cleared && S.lv<SL_LEVELS.length-1) || !ctx.isHost;
    $("[data-msg]",st).textContent=S.msg||"";
  },
  frame(S, ctx){
    const cv=$(".sl-cv",ctx.stage); if(!cv) return; const c=cv.getContext("2d"), I=ctx._img; const t=performance.now()/1000;
    const g=c.createLinearGradient(0,0,0,560); g.addColorStop(0,"#F6C98B"); g.addColorStop(1,"#F7E6C8"); c.fillStyle=g; c.fillRect(0,0,1000,560);
    c.fillStyle="#C98A4A"; c.beginPath(); c.moveTo(0,420); c.quadraticCurveTo(300,360,600,410); c.quadraticCurveTo(820,440,1000,400); c.lineTo(1000,560); c.lineTo(0,560); c.fill();
    c.fillStyle="#8E5A30"; c.fillRect(0,500,1000,60);
    // wind flag
    c.save(); c.translate(940,80); c.fillStyle="#5A3A24"; c.fillRect(-3,0,6,80); c.fillStyle="#B5482A"; c.beginPath(); c.moveTo(3,4); c.lineTo(3+S.wind*60+(S.wind>=0?10:-10),12+Math.sin(t*6)*3); c.lineTo(3,22); c.fill(); c.restore();
    c.fillStyle="#3A2A1C"; c.font="bold 18px Almarai, sans-serif"; c.textAlign="center"; c.fillText(S.wind?("الريح "+(S.wind>0?"←":"→")+" "+Math.abs(Math.round(S.wind*10))):"ماكو ريح", 940, 186);
    // slingshot
    c.strokeStyle="#5A3A24"; c.lineWidth=10; c.beginPath(); c.moveTo(110,500); c.lineTo(110,440); c.moveTo(110,450); c.lineTo(90,410); c.moveTo(110,450); c.lineTo(130,410); c.stroke();
    if(I.kid.complete) c.drawImage(I.kid, 20, 360, 52, 140);
    // trajectory preview
    if(S.phase==="aim"){ const a=S.angle*Math.PI/180, sp=300+S.power*650; let x=110,y=420,vx=Math.cos(a)*sp,vy=-Math.sin(a)*sp; c.fillStyle="rgba(90,58,36,.55)"; for(let i=0;i<22;i++){ for(let k=0;k<4;k++){ vy+=620*.012; vx+=S.wind*140*.012; x+=vx*.012; y+=vy*.012; } if(y>500) break; c.beginPath(); c.arc(x,y,3,0,7); c.fill(); } }
    S.crates.forEach(k=>{ if(k.t==="c"){ c.drawImage(I.crate,k.x-20,k.y-20,40,40); } else { c.save(); c.translate(k.x,k.y); c.strokeStyle=k.t==="d"?"#D9A53A":"#5A3A24"; c.lineWidth=3; if(!k.free){ c.fillStyle="rgba(255,248,230,.6)"; c.fillRect(-20,-20,40,40); c.drawImage(I.bird,-16,-10,32,22); for(let i=-16;i<=16;i+=8){ c.beginPath(); c.moveTo(i,-20); c.lineTo(i,20); c.stroke(); } c.strokeRect(-20,-20,40,40); if(k.t==="d"){ c.fillStyle="#D9A53A"; c.font="bold 14px sans-serif"; c.fillText("××",0,-26); } } c.restore(); if(k.free){ const fy=k.y-((t*120)%300); c.drawImage(I.bird,k.x-16+Math.sin(t*4)*10,fy-40,32,22); } } });
    S.proj.forEach(p=>{ if(p.done) return; c.save(); c.translate(p.x,p.y); c.rotate(p.t*8); c.drawImage(I.leaf,-14,-14,28,28); c.restore(); });
    c.fillStyle="#3A2A1C"; c.textAlign="right"; c.font="bold 18px Almarai, sans-serif"; c.fillText(`المرحلة ${S.lv+1}/${SL_LEVELS.length} · الطيور ${S.freed}/${S.total} · الرميات ${S.shots}`, 980, 30);
  },
  status:(S,ctx)=>`الدور: ${CH[ctx.charOf(S.aimBy)].name} يصوّب`,
  result(S){ if(S.cleared && S.lv===SL_LEVELS.length-1) return {title:"تحررت كل الطيور!", text:`خلّصتوا ${SL_LEVELS.length} مراحل بـ ${S.shots} رمية.`, rating:S.shots<=9?3:S.shots<=14?2:1}; return null; }
};
function slFire(S, off){ const a=(S.angle+off)*Math.PI/180, sp=300+S.power*650; S.proj.push({x:110,y:420,vx:Math.cos(a)*sp,vy:-Math.sin(a)*sp,t:0}); S.phase="fly"; S.shots++; S.msg=""; }
/* ---- 2. جسر الساعة ---- */
const CB_SYM = {sun:{n:"الشمس",d:'<circle cx="20" cy="20" r="8" fill="#E8C066"/><g stroke="#D9A53A" stroke-width="3">'+[0,45,90,135,180,225,270,315].map(a=>`<path d="M20 4v5" transform="rotate(${a} 20 20)"/>`).join("")+'</g>'}, moon:{n:"القمر",d:'<path d="M26 6a14 14 0 1 0 0 28a11 11 0 1 1 0-28z" fill="#B9A6DD"/>'}, star:{n:"النجمة",d:'<path d="M20 4l4 9 10 1-7 7 2 10-9-5-9 5 2-10-7-7 10-1z" fill="#F2D27A" stroke="#B88F33"/>'}, leaf:{n:"الورقة",d:'<path d="M6 34C4 18 16 6 34 6C34 24 22 36 6 34Z" fill="#C8552B"/>'}, key:{n:"المفتاح",d:'<circle cx="12" cy="20" r="7" fill="none" stroke="#8C6C48" stroke-width="4"/><path d="M19 20h15M29 20v6" stroke="#8C6C48" stroke-width="4"/>'}, bell:{n:"الجرس",d:'<path d="M10 28c2-4 2-14 10-16 8 2 8 12 10 16z" fill="#D9A53A" stroke="#8C6C48" stroke-width="2"/><circle cx="20" cy="31" r="3" fill="#8C6C48"/>'}};
const cbIcon = k => `<svg viewBox="0 0 40 40">${CB_SYM[k].d}</svg>`;
const CB_COL = {red:["أحمر","#C8352B"], blue:["أزرق","#3E6FA0"], gold:["ذهبي","#D9A53A"], green:["أخضر","#5B7F4A"]};
function cbRound(r, lv){
  const syms=["sun","moon","star","leaf"]; const lev={}; syms.forEach(s=>lev[s]=r()<.5?1:0);
  const lanterns=2+Math.floor(r()*4), add=1+Math.floor(r()*2), mult=lv>=2?2:1;
  const gearTarget = ((lanterns*mult + add -1) % 8) + 1;
  const bellsSym=shuffle(["key","bell","star","moon"]).slice(0,4); const cols=Object.keys(CB_COL); const colOf={}; bellsSym.forEach((s,i)=>colOf[s]=cols[i]);
  const seqLen=3+lv; const seq=Array.from({length:seqLen},()=>bellsSym[Math.floor(r()*4)]);
  return {lev, lanterns, add, mult, gearTarget, bellsSym, colOf, seq};
}
KG.bridge = {
  title:"جسر الساعة", tag:"ميكانيكي ومُفسّرة رموز", duo:true, tint:"#8C6C48", icon:()=>ART.gear(),
  how:"جسر القلعة مقفول بثلاث أقفال. خباب يشوف الرافعات والترس والأجراس بس ما يعرف الحل، ويقين تشوف كتاب الرموز. لازم تحچون سوا: كل واحد يوصف اللي يشوفه.",
  roles:{A:"الميكانيكي: يحرّك الرافعات والترس ويدق الأجراس", B:"المُفسّرة: تقرا كتاب الرموز وتوجّه"},
  bg:"background:linear-gradient(180deg,#3E3550,#5A4A60 50%,#8E6A50)",
  init(seed){ const r=rng(seed); return {lv:0, stage:0, R:cbRound(r,0), lev:{sun:0,moon:0,star:0,leaf:0}, gear:1, rung:[], tries:0, jam:"", seed, open:false}; },
  act(S,a,by){
    const mech = by==="A";
    if(a.k==="lever" && mech && S.stage===0){ S.lev[a.s]=S.lev[a.s]?0:1; S.jam=""; }
    if(a.k==="gear" && mech && S.stage===1){ S.gear = (S.gear % 8) + 1; S.jam=""; }
    if(a.k==="bell" && mech && S.stage===2){ S.rung.push(a.s); S.jam=""; if(S.rung.length>S.R.seq.length) S.rung=S.rung.slice(-S.R.seq.length); }
    if(a.k==="clear" && mech) { S.rung=[]; }
    if(a.k==="test" && mech){
      S.tries++;
      if(S.stage===0){ const wrong=Object.keys(S.R.lev).filter(k=>S.R.lev[k]!==S.lev[k]).length; if(!wrong){ S.stage=1; S.jam="القفل الأول انفتح!"; } else S.jam=`${wrong} رافعة بمكان غلط`; }
      else if(S.stage===1){ if(S.gear===S.R.gearTarget){ S.stage=2; S.jam="القفل الثاني انفتح!"; } else S.jam = S.gear<S.R.gearTarget?"الترس يحتاج رقم أكبر":"الترس يحتاج رقم أصغر"; }
      else if(S.stage===2){ const ok=S.rung.length===S.R.seq.length && S.rung.every((s,i)=>s===S.R.seq[i]); if(ok){ S.stage=3; S.jam=""; S.open=true; } else { S.jam="اللحن مو صحيح، امسحوا وعيدوا"; S.rung=[]; } }
    }
    if(a.k==="next" && S.stage===3 && S.lv<2){ S.lv++; const r=rng(S.seed+S.lv*977); S.R=cbRound(r,S.lv); S.stage=0; S.lev={sun:0,moon:0,star:0,leaf:0}; S.gear=1; S.rung=[]; S.open=false; S.jam="جسر جديد!"; }
    return S;
  },
  mount(ctx){ ctx.stage.innerHTML=`<div class="cb">${ctx.role==="both"?`<div class="seg cb-view"><button data-v="A" aria-pressed="true">بعيون ${CH[ctx.charOf("A")].name}</button><button data-v="B" aria-pressed="false">بعيون ${CH[ctx.charOf("B")].name}</button><button data-v="both" aria-pressed="false">الاثنين</button></div>`:""}<div class="cb-bridge" data-br></div><div class="cb-panels"><div class="cb-panel cb-mech" data-mech></div><div class="cb-panel cb-codex" data-codex></div></div></div>`;
    ctx._view = ctx.role==="both" ? "A" : ctx.role;
    $$("[data-v]",ctx.stage).forEach(b=>b.onclick=()=>{ ctx._view=b.dataset.v; $$("[data-v]",ctx.stage).forEach(x=>x.setAttribute("aria-pressed",x===b)); KG.bridge.render(ctx.state(),ctx); }); },
  render(S, ctx){
    const st=ctx.stage; if(!$(".cb",st)) return; const R=S.R; const view=ctx._view;
    $("[data-br]",st).innerHTML = `<div class="cb-locks">${[0,1,2].map(i=>`<span class="${S.stage>i?"on":""}">${IC.lock}</span>`).join("")}</div><div class="cb-deck ${S.open?"open":""}"><i></i><i></i></div><p class="cb-jam">${esc(S.jam||"")}</p><p class="d-note">الجسر ${S.lv+1} من 3 · المحاولات ${S.tries}</p>`;
    const showMech = view==="A"||view==="both", showCodex = view==="B"||view==="both";
    const mech=$("[data-mech]",st), codex=$("[data-codex]",st);
    mech.hidden=!showMech; codex.hidden=!showCodex;
    const can=ctx.mine("A");
    if(showMech) mech.innerHTML=`<h3>لوحة الميكانيكي</h3>
      <div class="cb-sec ${S.stage===0?"cur":S.stage>0?"done":""}"><b>١. الرافعات</b><div class="cb-levers">${Object.keys(S.lev).map(k=>`<button class="lever ${S.lev[k]?"up":""}" data-lev="${k}" ${!can||S.stage!==0?"disabled":""} aria-label="رافعة ${CB_SYM[k].n}: ${S.lev[k]?"فوگ":"جوّا"}">${cbIcon(k)}<span class="lv-stick"></span><small>${S.lev[k]?"فوگ":"جوّا"}</small></button>`).join("")}</div></div>
      <div class="cb-sec ${S.stage===1?"cur":S.stage>1?"done":""}"><b>٢. الترس</b><div class="cb-gear-row"><div class="cb-window">${Array.from({length:R.lanterns},()=>`<span>${ART.lantern()}</span>`).join("")}</div><button class="cb-gear" data-gear ${!can||S.stage!==1?"disabled":""} aria-label="الترس على ${S.gear}"><span style="transform:rotate(${S.gear*45}deg)">${ART.gear()}</span><b>${S.gear}</b></button></div><small>تشوف ${R.lanterns===1?"فانوس واحد":R.lanterns+" فوانيس"} بالشبّاك</small></div>
      <div class="cb-sec ${S.stage===2?"cur":""}"><b>٣. الأجراس</b><div class="cb-bells">${R.bellsSym.map(s=>`<button class="bellbtn" data-bell="${s}" ${!can||S.stage!==2?"disabled":""} aria-label="جرس ${CB_SYM[s].n}">${cbIcon(s)}</button>`).join("")}</div><div class="cb-rung">${S.rung.map(s=>cbIcon(s)).join("")||"<small>ما دگيتي بعد</small>"}</div><button class="btn ghost small" data-clr ${!can?"disabled":""}>امسحي الأجراس</button></div>
      <div class="row">${S.stage<3?`<button class="btn honey" data-test ${!can?"disabled":""}>اسحبي الرافعة الكبيرة</button>`:""}${S.stage===3&&S.lv<2&&ctx.isHost?'<button class="btn honey" data-next>الجسر الجاي</button>':""}</div>`;
    if(showCodex) codex.innerHTML=`<h3>كتاب الرموز</h3>
      <div class="cb-sec ${S.stage===0?"cur":""}"><b>١. الرافعات</b><ul class="cb-rules">${Object.keys(R.lev).map(k=>`<li>${cbIcon(k)} رافعة ${CB_SYM[k].n} لـ<b>${R.lev[k]?"فوگ":"جوّا"}</b></li>`).join("")}</ul></div>
      <div class="cb-sec ${S.stage===1?"cur":""}"><b>٢. الترس</b><p>رقم الترس = عدد الفوانيس اللي يشوفها الميكانيكي ${R.mult>1?"× "+R.mult+" ":""}+ ${R.add}${R.mult>1||R.lanterns*R.mult+R.add>8?" (إذا عدّى 8 يرجع يحسب من 1)":""}.</p></div>
      <div class="cb-sec ${S.stage===2?"cur":""}"><b>٣. الأجراس</b><p>دگّوا الألوان بهذا الترتيب:</p><div class="cb-colseq">${R.seq.map(s=>`<i style="background:${CB_COL[R.colOf[s]][1]}" title="${CB_COL[R.colOf[s]][0]}"></i>`).join("")}</div><ul class="cb-rules">${R.bellsSym.map(s=>`<li><i class="dot" style="background:${CB_COL[R.colOf[s]][1]}"></i> ${CB_COL[R.colOf[s]][0]} = جرس ${CB_SYM[s].n} ${cbIcon(s)}</li>`).join("")}</ul></div>`;
    $$("[data-lev]",st).forEach(b=>b.onclick=()=>ctx.act({k:"lever",s:b.dataset.lev,by:"A"}));
    const g=$("[data-gear]",st); if(g) g.onclick=()=>ctx.act({k:"gear",by:"A"});
    $$("[data-bell]",st).forEach(b=>b.onclick=()=>{ Sound.note({key:392,bell:523,star:659,moon:784,sun:880,leaf:440}[b.dataset.bell]||500); ctx.act({k:"bell",s:b.dataset.bell,by:"A"}); });
    const c=$("[data-clr]",st); if(c) c.onclick=()=>ctx.act({k:"clear",by:"A"});
    const tb=$("[data-test]",st); if(tb) tb.onclick=()=>ctx.act({k:"test",by:"A"});
    const nb=$("[data-next]",st); if(nb) nb.onclick=()=>ctx.act({k:"next"});
  },
  status:S=>`القفل ${Math.min(S.stage+1,3)} من 3`,
  result(S){ if(S.stage===3 && S.lv===2) return {title:"الجسور الثلاثة انفتحت!", text:`حليتوا ثلاث جسور بـ ${S.tries} محاولة.`, rating:S.tries<=12?3:S.tries<=20?2:1}; return null; }
};
/* ---- 3. متاهة أوراق مزدوجة ---- */
const TM_LEVELS = [
 ["#############","#Y...#.#...K#","#.##.#.#.##.#","#y#..A.B..#k#","#.#.##G##.#.#","#...#.b.#a..#","#############"],
 ["#############","#K..#...#..Y#","#.#.#.#.#.#.#","#k#...#...#y#","#.###.#.###.#","#..b#B#A#...#","#####.#.#####","####a.G.#####","#############"]
];
function tmFind(L,c){ for(let r=0;r<L.length;r++){ const x=L[r].indexOf(c); if(x>=0) return [r,x]; } return null; }
KG.maze = {
  title:"متاهة أوراق مزدوجة", tag:"كل واحد يشوف نص الأسرار", duo:true, tint:"#5B7F4A", icon:()=>ART.key(),
  how:"لازم الاثنين يوصلون للبوابة الذهبية بالنص. خباب يشوف أزراره والبوابات اللي تسد طريقه، ويقين تشوف أزرارها وبواباتها. البوابة تنفتح بس لما الثاني واگف على زره. وكل واحد يشوف مفتاح واحد بس، والبوابة الذهبية تحتاج المفتاحين.",
  roles:{A:"خباب: يشوف الأزرار الخضر والمفتاح الأحمر", B:"يقين: تشوف الأزرار البنفسجية والمفتاح الأزرق"},
  keys:"على نفس الجهاز: خباب بـ W A S D، ويقين بالأسهم.",
  bg:"background:linear-gradient(180deg,#7A5A3A,#4E3A28)",
  init(){ return tmLevel(0, 0); },
  act(S,a,by){
    if(a.k==="move"){ const who=by; if(who!=="A"&&who!=="B") return S; const p=S.pos[who], L=TM_LEVELS[S.lv]; const n=[p[0]+a.d[0], p[1]+a.d[1]]; const c=L[n[0]]&&L[n[0]][n[1]]; if(!c||c==="#") { S.bump=who; return S; }
      const o=S.pos[who==="A"?"B":"A"], oc=L[o[0]][o[1]];
      if(c==="A" && !(who==="B" && oc==="a")){ S.msg = who==="B"?"البوابة مسكّرة… "+"يمكن صاحبج لازم يوگف على زر؟":"هاي البوابة مو إلك"; return S; }
      if(c==="B" && !(who==="A" && oc==="b")){ S.msg = who==="A"?"البوابة مسكّرة… اسأل صاحبك عن زر":"هاي البوابة مو إلج"; return S; }
      if(c==="G" && S.keys!==3){ S.msg="البوابة الذهبية تحتاج المفتاحين"; return S; }
      S.pos[who]=n; S.moves++; S.msg="";
      const kk=tmFind(L,"k"), yy=tmFind(L,"y"); if(n[0]===kk[0]&&n[1]===kk[1] && !(S.keys&1)){ S.keys|=1; S.msg="المفتاح الأحمر!"; } if(n[0]===yy[0]&&n[1]===yy[1] && !(S.keys&2)){ S.keys|=2; S.msg="المفتاح الأزرق!"; }
      const ga=L[S.pos.A[0]][S.pos.A[1]], gb=L[S.pos.B[0]][S.pos.B[1]];
      if(ga==="G"&&gb==="G"){ S.done=true; S.msg = S.lv<TM_LEVELS.length-1 ? "وصلتوا! متاهة جديدة؟" : "وصلتوا!"; }
    }
    if(a.k==="next" && S.done && S.lv<TM_LEVELS.length-1){ const m=S.total+S.moves; return Object.assign(tmLevel(S.lv+1, m)); }
    return S;
  },
  mount(ctx){ ctx.stage.innerHTML=`<div class="tm">${ctx.role==="both"?`<div class="seg"><button data-v="both" aria-pressed="true">أشوف الاثنين</button><button data-v="A" aria-pressed="false">بعيون ${CH[ctx.charOf("A")].name}</button><button data-v="B" aria-pressed="false">بعيون ${CH[ctx.charOf("B")].name}</button></div>`:""}<div class="tm-grid" data-g></div><p class="tm-msg" data-msg></p><div class="tm-pads">${["A","B"].filter(r=>ctx.mine(r)).map(r=>`<div class="tm-pad" data-pad="${r}"><b>${CH[ctx.charOf(r)].name}</b><div class="dpad"><button data-d="-1,0" aria-label="فوگ">${IC.up}</button><button data-d="0,1" aria-label="يمين">${IC.right}</button><button data-d="0,-1" aria-label="يسار">${IC.left}</button><button data-d="1,0" aria-label="جوّا">${IC.down}</button></div></div>`).join("")}</div></div>`;
    ctx._view = ctx.role==="both" ? "both" : ctx.role;
    $$("[data-v]",ctx.stage).forEach(b=>b.onclick=()=>{ ctx._view=b.dataset.v; $$("[data-v]",ctx.stage).forEach(x=>x.setAttribute("aria-pressed",x===b)); KG.maze.render(ctx.state(),ctx); });
    $$("[data-pad]",ctx.stage).forEach(p=>{ const r=p.dataset.pad; $$("[data-d]",p).forEach(b=>b.onclick=()=>ctx.act({k:"move",d:b.dataset.d.split(",").map(Number),by:r})); });
    ctx._nextBtn = h(`<button class="btn honey" data-next hidden>المتاهة الجاية</button>`); $(".tm",ctx.stage).appendChild(ctx._nextBtn); ctx._nextBtn.onclick=()=>ctx.act({k:"next"});
  },
  key(e,S,ctx){ const m={w:[-1,0],s:[1,0],a:[0,-1],d:[0,1],ArrowUp:[-1,0],ArrowDown:[1,0],ArrowLeft:[0,-1],ArrowRight:[0,1]}; let d=m[e.key]||m[e.key.toLowerCase&&e.key.toLowerCase()]; if(!d) return; e.preventDefault();
    let r = ctx.role; if(r==="both") r = e.key.startsWith("Arrow") ? "B" : "A"; ctx.act({k:"move",d,by:r}); },
  render(S, ctx){
    const g=$("[data-g]",ctx.stage); if(!g) return; const L=TM_LEVELS[S.lv]; const view=ctx._view;
    const seeA = view==="A"||view==="both", seeB = view==="B"||view==="both";
    g.style.gridTemplateColumns=`repeat(${L[0].length},1fr)`;
    let html=""; for(let r=0;r<L.length;r++) for(let x=0;x<L[r].length;x++){ const c=L[r][x]; let cls="tm-c", inner="";
      if(c==="#") cls+=" wall"; else cls+=" floor";
      const oA=S.pos.A, oB=S.pos.B;
      if(c==="a"&&seeA){ cls+=" plate pa"+(oA[0]===r&&oA[1]===x?" on":""); }
      if(c==="b"&&seeB){ cls+=" plate pb"+(oB[0]===r&&oB[1]===x?" on":""); }
      if(c==="B"&&seeA){ cls+=" gate gb"+(L[oB[0]][oB[1]]==="b"?" open":""); }
      if(c==="A"&&seeB){ cls+=" gate ga"+(L[oA[0]][oA[1]]==="a"?" open":""); }
      if(c==="G"){ cls+=" goal"+(S.keys===3?" open":""); }
      if(c==="k"&&seeA&&!(S.keys&1)) inner=ART.key("#C8352B"); if(c==="y"&&seeB&&!(S.keys&2)) inner=ART.key("#3E6FA0");
      if(oA[0]===r&&oA[1]===x) inner+=`<span class="tm-tok">${faceHTML(ctx.charOf("A"),1,34)}</span>`;
      if(oB[0]===r&&oB[1]===x) inner+=`<span class="tm-tok b">${faceHTML(ctx.charOf("B"),1,34)}</span>`;
      html+=`<div class="${cls}">${inner}</div>`; }
    g.innerHTML=html;
    $("[data-msg]",ctx.stage).textContent=S.msg||"";
    if(ctx._nextBtn) ctx._nextBtn.hidden = !(S.done && S.lv<TM_LEVELS.length-1 && ctx.isHost);
  },
  status:S=>`المتاهة ${S.lv+1}/${TM_LEVELS.length} · المفاتيح ${(S.keys&1)+(S.keys>>1&1)}/2 · خطوات ${S.total+S.moves}`,
  result(S){ if(S.done && S.lv===TM_LEVELS.length-1){ const m=S.total+S.moves; return {title:"طلعتوا من المتاهة!", text:`وصلتوا للبوابة الذهبية بـ ${m} خطوة.`, rating:m<=120?3:m<=180?2:1}; } return null; }
};
function tmLevel(lv, total){ const L=TM_LEVELS[lv]; return {lv, pos:{A:tmFind(L,"K"), B:tmFind(L,"Y")}, keys:0, moves:0, total, msg:"", done:false}; }
/* ---- 4. صيد الفوانيس ---- */
KG.lanterns = {
  title:"صيد الفوانيس", tag:"تعاون سريع قبل لا تاخذها الريح", duo:true, tint:"#D9A53A", icon:()=>ART.lantern(),
  how:"الفوانيس تنزل من السما والريح تسحبها. تحركوا يمين ويسار وامسكوها. خباب عنده «اندفاع» سريع، ويقين عندها «مغناطيس» يسحب الفوانيس القريبة. اجمعوا 30 فانوس بثلاث موجات.",
  roles:{A:"خباب: حركة + اندفاع", B:"يقين: حركة + مغناطيس"},
  keys:"على نفس الجهاز: خباب A/D والقدرة W، يقين ←/→ والقدرة ↑.",
  bg:"background:linear-gradient(180deg,#2B2A4A,#5A4A6A 55%,#8E5A3A)",
  init(seed){ return {t:0, p:{A:{x:300,dir:0,cd:0,dash:0}, B:{x:700,dir:0,cd:0,mag:0}}, L:[], caught:0, lost:0, wave:1, wind:0, gust:0, spawn:0, nid:1, seed, fx:[]}; },
  act(S,a,by){ const r=by; if(!S.p[r]) return S;
    if(a.k==="dir") S.p[r].dir=Math.max(-1,Math.min(1,a.v|0));
    if(a.k==="skill" && S.p[r].cd<=0){ if(r==="A"){ S.p.A.dash=.35; S.p.A.cd=2.2; } else { S.p.B.mag=2; S.p.B.cd=5; } }
    return S; },
  tick(S, dt){
    if(S.paused) return S; S.t+=dt; const goal=[10,20,30][S.wave-1];
    S.gust-=dt; if(S.gust<=0){ S.wind = (Math.random()*2-1)*(40+S.wave*35); S.gust=3+Math.random()*3; }
    S.spawn-=dt; if(S.spawn<=0 && S.L.length<7+S.wave){ S.L.push({id:S.nid++, x:60+Math.random()*880, y:-30, vy:45+Math.random()*25+S.wave*8, ph:Math.random()*6, gold:Math.random()<.12}); S.spawn=.8-S.wave*.12+Math.random()*.4; }
    ["A","B"].forEach(r=>{ const p=S.p[r]; const sp = r==="A"&&p.dash>0 ? 900 : 300; p.x=Math.max(30,Math.min(970,p.x+p.dir*sp*dt)); p.cd=Math.max(0,p.cd-dt); if(p.dash>0) p.dash-=dt; if(p.mag>0) p.mag-=dt; });
    S.L.forEach(l=>{ l.y+=l.vy*dt; l.x+=(S.wind*dt)+Math.sin(S.t*2+l.ph)*12*dt; if(S.p.B.mag>0){ const dx=S.p.B.x-l.x, dy=470-l.y; const d=Math.hypot(dx,dy); if(d<260){ l.x+=dx/d*160*dt; l.y+=dy/d*90*dt; } }
      ["A","B"].forEach(r=>{ const p=S.p[r]; if(!l.got && Math.abs(l.x-p.x)<46 && l.y>400 && l.y<500){ l.got=true; S.caught+= l.gold?2:1; S.fx.push({x:l.x,y:l.y,t:S.t,g:l.gold}); } });
      if(!l.got && (l.y>540 || l.x<-40 || l.x>1040)){ l.got=true; S.lost++; } });
    S.L=S.L.filter(l=>!l.got); S.fx=S.fx.filter(f=>S.t-f.t<.8);
    if(S.caught>=goal && S.wave<3){ S.wave++; S.L=[]; S.banner=S.t; }
    return S;
  },
  mount(ctx){ ctx.stage.innerHTML=`<div class="ln"><canvas class="ln-cv" width="1000" height="560"></canvas><div class="ln-pads">${["A","B"].filter(r=>ctx.mine(r)).map(r=>`<div class="ln-pad" data-pad="${r}"><b>${CH[ctx.charOf(r)].name}</b><button class="btn ghost" data-dir="-1" aria-label="يسار">${IC.left}</button><button class="btn honey" data-skill>${r==="A"?"اندفاع":"مغناطيس"}</button><button class="btn ghost" data-dir="1" aria-label="يمين">${IC.right}</button></div>`).join("")}</div></div>`;
    $$("[data-pad]",ctx.stage).forEach(p=>{ const r=p.dataset.pad; $$("[data-dir]",p).forEach(b=>{ const v=+b.dataset.dir; b.addEventListener("pointerdown",e=>{ e.preventDefault(); ctx.act({k:"dir",v,by:r}); }); ["pointerup","pointerleave","pointercancel"].forEach(ev=>b.addEventListener(ev,()=>ctx.act({k:"dir",v:0,by:r}))); }); $("[data-skill]",p).onclick=()=>ctx.act({k:"skill",by:r}); });
    ctx._img={l:loadImg("ln_l",svgURL(ART.lantern())), k:loadImg("ln_k",CH[ctx.charOf("A")].img), y:loadImg("ln_y",CH[ctx.charOf("B")].img)};
    ctx._keys={}; ctx._ku=e=>{ const map={a:["A",-1],d:["A",1],ArrowLeft:["B",-1],ArrowRight:["B",1]}; const m=map[e.key]||map[e.key.toLowerCase()]; if(!m) return; let r=m[0]; if(ctx.role!=="both") r=ctx.role; ctx.act({k:"dir",v:0,by:r}); }; window.addEventListener("keyup",ctx._ku); },
  unmount(ctx){ if(ctx._ku) window.removeEventListener("keyup",ctx._ku); },
  key(e,S,ctx){ if(e.repeat) return; const map={a:["A",-1],d:["A",1],w:["A","s"],ArrowLeft:["B",-1],ArrowRight:["B",1],ArrowUp:["B","s"]}; const m=map[e.key]||map[e.key.toLowerCase()]; if(!m) return; e.preventDefault(); let r=m[0]; if(ctx.role!=="both") r=ctx.role; if(m[1]==="s") ctx.act({k:"skill",by:r}); else ctx.act({k:"dir",v:m[1],by:r}); },
  render(S,ctx){ $$("[data-pad]",ctx.stage).forEach(p=>{ const r=p.dataset.pad, cd=S.p[r].cd; const b=$("[data-skill]",p); b.disabled=cd>0; b.textContent=(r==="A"?"اندفاع":"مغناطيس")+(cd>0?` (${Math.ceil(cd)})`:""); }); },
  frame(S,ctx){ const cv=$(".ln-cv",ctx.stage); if(!cv) return; const c=cv.getContext("2d"), I=ctx._img, t=performance.now()/1000;
    const g=c.createLinearGradient(0,0,0,560); g.addColorStop(0,"#2B2A4A"); g.addColorStop(.6,"#5A4A6A"); g.addColorStop(1,"#8E5A3A"); c.fillStyle=g; c.fillRect(0,0,1000,560);
    for(let i=0;i<40;i++){ c.fillStyle=`rgba(255,255,255,${.3+.3*Math.sin(t+i)})`; c.fillRect((i*97)%1000,(i*53)%260,2,2); }
    c.fillStyle="#3A2A3A"; c.beginPath(); c.moveTo(0,470); for(let x=0;x<=1000;x+=50) c.lineTo(x,460-Math.sin(x/90)*12); c.lineTo(1000,560); c.lineTo(0,560); c.fill();
    c.strokeStyle="rgba(255,255,255,.25)"; c.lineWidth=2; for(let i=0;i<6;i++){ const y=80+i*60, off=(t*S.wind*1.4+i*120)%1000; c.beginPath(); c.moveTo(off,y); c.lineTo(off+S.wind*.6,y); c.stroke(); }
    S.L.forEach(l=>{ c.save(); c.translate(l.x,l.y); c.rotate(Math.sin(t*2+l.ph)*.15); if(l.gold){ c.shadowColor="#FFD27A"; c.shadowBlur=20; } c.drawImage(I.l,-18,-27,36,54); c.restore(); });
    if(S.p.B.mag>0){ c.strokeStyle="rgba(185,166,221,.6)"; c.lineWidth=4; c.beginPath(); c.arc(S.p.B.x,470,180+Math.sin(t*10)*10,Math.PI,0); c.stroke(); }
    [["A",I.k],["B",I.y]].forEach(([r,im])=>{ const p=S.p[r]; const hh=110, w=hh*(im.naturalWidth||1)/(im.naturalHeight||1); c.save(); c.translate(p.x,500); if(p.dir<0) c.scale(-1,1); c.translate(0,-Math.abs(Math.sin(t*10))*(p.dir?5:0)); if(r==="A"&&p.dash>0){ c.globalAlpha=.5; c.drawImage(im,-w/2-p.dir*-30,-hh,w,hh); c.globalAlpha=1; } c.drawImage(im,-w/2,-hh,w,hh); c.restore(); });
    S.fx.forEach(f=>{ c.fillStyle="#FFF2C8"; c.font="bold 22px Almarai, sans-serif"; c.textAlign="center"; c.fillText(f.g?"+2":"+1", f.x, f.y-30-(S.t-f.t)*60); });
    const goal=[10,20,30][S.wave-1]; c.fillStyle="#FFF2C8"; c.textAlign="right"; c.font="bold 20px Almarai, sans-serif"; c.fillText(`الموجة ${S.wave}/3 · الفوانيس ${S.caught}/${goal}`, 980, 32);
    if(S.banner && S.t-S.banner<1.6){ c.textAlign="center"; c.font="bold 44px 'Aref Ruqaa', serif"; c.fillText(`الموجة ${S.wave}`, 500, 260); } },
  status:S=>`الريح ${S.wind>0?"→":"←"} ${Math.abs(Math.round(S.wind/10))}`,
  result(S){ if(S.wave===3 && S.caught>=30) return {title:"السما صارت كلها فوانيس!", text:`جمعتوا ${S.caught} فانوس بـ ${Math.round(S.t)} ثانية، وطار ${S.lost} بس.`, rating:S.lost<=10?3:S.lost<=22?2:1}; return null; }
};
/* ---- 5. ذاكرة مكتبة القلعة ---- */
const LIB_SYMS = ["sun","moon","star","leaf","key","bell"];
KG.library = {
  title:"ذاكرة مكتبة القلعة", tag:"بطاقات رموز بتلميحات موزعة", duo:true, tint:"#3E4A7A", icon:()=>ART.book("#3E4A7A"),
  how:"بطاقات مقلوبة على رفوف المكتبة. بالبداية خباب يلمح النص الفوگاني، ويقين تلمح النص الجوّاني لثانيتين. بعدين تتناوبون: كل دور تقلبون بطاقتين. تگدرون تلعبون تعاون (نقاط مشتركة) أو منافسة.",
  roles:{A:"خباب: يلمح الرفوف الفوگانية", B:"يقين: تلمح الرفوف الجوّانية"},
  bg:"background:linear-gradient(180deg,#4A2E22,#2B1A12)",
  init(seed){ const r=rng(seed); const deck=[]; LIB_SYMS.forEach(s=>{deck.push(s,s);}); for(let i=deck.length-1;i>0;i--){ const j=Math.floor(r()*(i+1)); [deck[i],deck[j]]=[deck[j],deck[i]]; } return {deck, open:[], done:[], turn:"A", score:{A:0,B:0}, mode:"coop", peek:true, peekT:Date.now(), moves:0}; },
  act(S,a,by){
    if(a.k==="mode" && !S.moves){ S.mode=a.v; }
    if(a.k==="endpeek") S.peek=false;
    if(a.k==="flip"){ if(S.peek) return S; const turnOk = S.turn===by; if(!turnOk) return S; const i=a.i; if(S.open.length>=2 || S.open.includes(i) || S.done.includes(i)) return S; S.open.push(i);
      if(S.open.length===2){ S.moves++; const [x,y]=S.open; if(S.deck[x]===S.deck[y]){ S.done.push(x,y); S.score[S.turn]++; S.open=[]; S.last="match"; } else { S.last="miss"; S.pendingClose=Date.now(); } } }
    if(a.k==="close" && S.open.length===2){ S.open=[]; S.turn = S.turn==="A"?"B":"A"; }
    return S; },
  tick(S){ if(S.peek && Date.now()-S.peekT>2600) S.peek=false; if(S.pendingClose && Date.now()-S.pendingClose>900){ S.pendingClose=0; S.open=[]; S.turn=S.turn==="A"?"B":"A"; } return S; },
  mount(ctx){ ctx.stage.innerHTML=`<div class="lib"><div class="seg" data-mode><button data-m="coop">تعاون</button><button data-m="vs">منافسة</button></div><div class="lib-grid" data-g></div><p class="lib-turn" data-t></p></div>`; $$("[data-m]",ctx.stage).forEach(b=>b.onclick=()=>ctx.act({k:"mode",v:b.dataset.m})); },
  render(S,ctx){ const g=$("[data-g]",ctx.stage); if(!g) return;
    $$("[data-m]",ctx.stage).forEach(b=>{ b.setAttribute("aria-pressed",b.dataset.m===S.mode); b.disabled=S.moves>0||!ctx.isHost; });
    g.innerHTML=S.deck.map((s,i)=>{ const half = i<6?"A":"B"; const peekMine = S.peek && (ctx.role==="both" || ctx.role===half); const show = S.open.includes(i)||S.done.includes(i)||peekMine; return `<button class="lib-card ${show?"open":""} ${S.done.includes(i)?"done":""} ${peekMine&&!S.open.includes(i)?"peek":""}" data-i="${i}" aria-label="بطاقة ${i+1}">${show?cbIcon(s):ART.book(i%2?"#7A2E2A":"#2F5E57")}</button>`; }).join("");
    $$("[data-i]",g).forEach(b=>b.onclick=()=>ctx.act({k:"flip",i:+b.dataset.i,by:ctx.role==="both"?S.turn:ctx.role}));
    $("[data-t]",ctx.stage).innerHTML = S.peek ? "لمحة سريعة… ركّزوا!" : `الدور: <b>${CH[ctx.charOf(S.turn)].name}</b>${ctx.role!=="both"&&ctx.role!==S.turn?" — انتظري دورج":""}`; },
  status:S=>S.mode==="vs"?`خباب ${S.score.A} · يقين ${S.score.B}`:`الأزواج ${S.done.length/2}/6 · محاولات ${S.moves}`,
  result(S){ if(S.done.length===S.deck.length){ const tie=S.score.A===S.score.B, w=S.score.A>S.score.B?"A":"B"; return {title:S.mode==="vs"?(tie?"تعادل!":"فاز "+(w==="A"?"خباب":"يقين")+"!"):"المكتبة رتّبت رفوفها!", text:`خلّصتوا بـ ${S.moves} محاولة.`, rating:S.moves<=10?3:S.moves<=15?2:1}; } return null; }
};

/* ---- 6. أوركسترا الساعة ---- */
KG.orchestra = {
  title:"أوركسترا الساعة", tag:"إيقاع تعاوني بطبقتين", duo:true, tint:"#7A5AA0", icon:()=>ART.bell?ART.bell():ART.gear("#B9A6DD"),
  how:"النوتات تنزل على مسارين: مسار الطبل لخباب ومسار الأجراس ليقين. اضغطوا لما توصل النوتة للخط الذهبي. كل طبقة تكمّل الثانية، والنتيجة مشتركة.",
  roles:{A:"خباب: الطبل (F أو زر الطبل)", B:"يقين: الأجراس (J أو زر الجرس)"},
  keys:"F للطبل، J للأجراس.",
  bg:"background:linear-gradient(180deg,#2E2A3C,#4A3A5A)",
  init(seed){ const r=rng(seed); const notes=[]; let t=2; for(let i=0;i<48;i++){ const lane = i%4===0?"A":(r()<.5?"A":"B"); notes.push({t:+t.toFixed(2), l:lane}); t+= [0.5,0.5,0.75,1][Math.floor(r()*4)]; } return {start:Date.now()+1500, notes, hits:{}, score:0, combo:0, best:0, end:t+2}; },
  act(S,a,by){ if(a.k==="hit"){ const n=S.notes[a.i]; if(!n || S.hits[a.i] || n.l!==by) return S; S.hits[a.i]=a.q; if(a.q==="p"){ S.score+=3; S.combo++; } else if(a.q==="g"){ S.score+=2; S.combo++; } else S.combo=0; S.best=Math.max(S.best,S.combo); } if(a.k==="fin") S.fin=true; return S; },
  mount(ctx){ ctx.stage.innerHTML=`<div class="orc"><canvas class="orc-cv" width="600" height="520"></canvas><div class="orc-pads">${ctx.mine("A")?'<button class="btn orc-btn" data-l="A">طبل</button>':""}${ctx.mine("B")?'<button class="btn orc-btn b" data-l="B">جرس</button>':""}</div></div>`;
    ctx._local={}; ctx._t0 = null;
    const hit=l=>{ const S=ctx.state(); if(!S) return; const now=(Date.now()+(ctx._off||0)-S.start)/1000;
      let bi=-1,bd=9; S.notes.forEach((n,i)=>{ if(n.l!==l||S.hits[i]||ctx._local[i]) return; const d=Math.abs(n.t-now); if(d<bd){ bd=d; bi=i; } });
      Sound.note(l==="A"?196:784); ctx._flash={l,t:performance.now()};
      if(bi>=0 && bd<.28){ const q=bd<.1?"p":"g"; ctx._local[bi]=q; ctx.act({k:"hit",i:bi,q,by:l}); ctx._fb={txt:q==="p"?"ممتاز":"حلو",t:performance.now(),l}; } };
    ctx._hit=hit; $$("[data-l]",ctx.stage).forEach(b=>b.addEventListener("pointerdown",e=>{ e.preventDefault(); hit(b.dataset.l); })); },
  key(e,S,ctx){ const k=e.key.toLowerCase(); if(k==="f"&&ctx.mine("A")) ctx._hit("A"); if(k==="j"&&ctx.mine("B")) ctx._hit("B"); },
  tick(S){ S.hn=Date.now(); const now=(Date.now()-S.start)/1000; if(now>S.end) S.fin=true; S.notes.forEach((n,i)=>{ if(!S.hits[i] && now-n.t>.35){ S.hits[i]="m"; S.combo=0; } }); return S; },
  render(){},
  frame(S,ctx){ const cv=$(".orc-cv",ctx.stage); if(!cv) return; const c=cv.getContext("2d"); if(!ctx.isHost && S.hn && S.hn!==ctx._lastHn){ ctx._lastHn=S.hn; ctx._off=S.hn-Date.now(); } const now=(Date.now()+(ctx._off||0)-S.start)/1000;
    c.fillStyle="#2E2A3C"; c.fillRect(0,0,600,520); const lanes={A:150,B:450}; const hitY=440;
    Object.entries(lanes).forEach(([l,x])=>{ c.fillStyle=l==="A"?"rgba(200,85,43,.12)":"rgba(185,166,221,.12)"; c.fillRect(x-90,0,180,520); if(ctx._flash && ctx._flash.l===l && performance.now()-ctx._flash.t<120){ c.fillStyle="rgba(255,240,180,.25)"; c.fillRect(x-90,0,180,520); } c.fillStyle="#fff"; c.font="bold 18px Almarai, sans-serif"; c.textAlign="center"; c.fillText(l==="A"?CH[ctx.charOf("A")].name+" · طبل":CH[ctx.charOf("B")].name+" · أجراس", x, 30); });
    c.strokeStyle="#E8C066"; c.lineWidth=5; c.beginPath(); c.moveTo(20,hitY); c.lineTo(580,hitY); c.stroke();
    S.notes.forEach((n,i)=>{ const dy=(n.t-now)*260; const y=hitY-dy; if(y<-30||y>540) return; const h2=S.hits[i]||(ctx._local&&ctx._local[i]); if(h2==="p"||h2==="g") return; c.fillStyle = n.l==="A"?"#C8552B":"#B9A6DD"; c.beginPath(); c.arc(lanes[n.l],y,26,0,7); c.fill(); c.strokeStyle="#fff"; c.lineWidth=3; c.stroke(); });
    if(now<0){ c.fillStyle="#FFF2C8"; c.font="bold 60px Almarai"; c.textAlign="center"; c.fillText(Math.ceil(-now), 300, 260); }
    if(ctx._fb && performance.now()-ctx._fb.t<500){ c.fillStyle="#FFF2C8"; c.font="bold 26px Almarai"; c.fillText(ctx._fb.txt, lanes[ctx._fb.l], hitY-60); }
    c.fillStyle="#FFF2C8"; c.font="bold 18px Almarai"; c.textAlign="right"; c.fillText(`النقاط ${S.score} · متتالي ${S.combo}`, 590, 500); },
  status:S=>`النقاط ${S.score}`,
  result(S){ if(S.fin){ const max=S.notes.length*3; const p=S.score/max; return {title:"الساعة عزفت لحنكم!", text:`نتيجتكم ${S.score} من ${max}، وأطول سلسلة ${S.best}.`, rating:p>.8?3:p>.55?2:1}; } return null; }
};
ART.bell = () => `<svg viewBox="0 0 40 40">${CB_SYM.bell.d}</svg>`;

/* ---- 7. قطار منتصف الخريف ---- */
KG.train = {
  title:"قطار منتصف الخريف", tag:"سرعة ومسارات وتذاكر", duo:true, tint:"#2F5E57", icon:()=>ART.ticket(),
  how:"القطار يمشي على سكة بيها تفرعات. خباب يتحكم بالسرعة: يبطّأ بمناطق الأوراق ويوگف بالمحطات. يقين تبدّل التحويلة قبل كل تفرع حتى تجمعون التذاكر والفوانيس.",
  roles:{A:"خباب: السرعة والوقوف بالمحطات", B:"يقين: التحويلات (فوگ / جوّا)"},
  keys:"↑↓ للسرعة، المسافة للتحويلة.",
  bg:"background:linear-gradient(180deg,#F2B07A,#F3E6C8 60%,#8E6A50)",
  init(seed){ const r=rng(seed); const segs=[]; let x=600; for(let i=0;i<14;i++){ const kind = i%4===3?"station":"fork"; const up = r()<.5; segs.push({x, kind, items: kind==="fork"?{up: up?(r()<.3?"lantern":"ticket"):"leaves", down: up?"leaves":(r()<.3?"lantern":"ticket")}:null, done:false}); x+=520+Math.floor(r()*160); } return {x:0, v:120, target:120, sw:"up", segs, tickets:0, lanterns:0, stations:0, slowHits:0, end:x+300, track:"main", msg:""}; },
  act(S,a,by){ if(a.k==="speed" && by==="A") S.target=Math.max(0,Math.min(320,a.v)); if(a.k==="switch" && by==="B") S.sw = S.sw==="up"?"down":"up"; return S; },
  tick(S,dt){ S.v += (S.target-S.v)*Math.min(1,dt*2); S.x += S.v*dt;
    S.segs.forEach(sg=>{ if(sg.done) return;
      if(sg.kind==="fork" && S.x>sg.x){ sg.done=true; sg.took=S.sw; const it=sg.items[S.sw]; if(it==="ticket"){ S.tickets++; S.msg="تذكرة!"; } else if(it==="lantern"){ S.lanterns++; S.msg="فانوس!"; } else { if(S.v>140){ S.slowHits++; S.msg="أوراق كثيرة! بطّئوا بالمرة الجاية"; S.v=60; } else S.msg="عبرنا الأوراق بهدوء"; } }
      if(sg.kind==="station" && S.x>sg.x-40 && S.x<sg.x+60 && S.v<25){ sg.done=true; S.stations++; S.msg="وقفة مضبوطة بالمحطة!"; }
      if(sg.kind==="station" && S.x>sg.x+60 && !sg.done){ sg.done=true; S.msg="فاتتنا المحطة"; } });
    if(S.x>S.end) S.fin=true; return S; },
  mount(ctx){ ctx.stage.innerHTML=`<div class="tr"><canvas class="tr-cv" width="1000" height="420"></canvas><div class="tr-ctl">${ctx.mine("A")?`<div class="sl-box"><b>السرعة</b><input type="range" min="0" max="320" value="120" data-sp aria-label="السرعة"><button class="btn ghost small" data-stop>وگوف</button></div>`:""}${ctx.mine("B")?`<div class="sl-box"><b>التحويلة</b><button class="btn honey" data-sw>بدّلي</button><small data-swl></small></div>`:""}</div><p class="sl-msg" data-msg></p></div>`;
    const sp=$("[data-sp]",ctx.stage); if(sp) sp.oninput=e=>ctx.act({k:"speed",v:+e.target.value,by:"A"});
    const stp=$("[data-stop]",ctx.stage); if(stp) stp.onclick=()=>{ ctx.act({k:"speed",v:0,by:"A"}); if(sp) sp.value=0; };
    const sw=$("[data-sw]",ctx.stage); if(sw) sw.onclick=()=>ctx.act({k:"switch",by:"B"});
    ctx._img={t:loadImg("tr_t",svgURL(ART.ticket())), l:loadImg("tr_l",svgURL(ART.lantern())), f:loadImg("tr_f",svgURL(ART.maple("#C8552B")))}; },
  key(e,S,ctx){ if(e.key==="ArrowUp"&&ctx.mine("A")){ e.preventDefault(); ctx.act({k:"speed",v:S.target+20,by:"A"}); } if(e.key==="ArrowDown"&&ctx.mine("A")){ e.preventDefault(); ctx.act({k:"speed",v:S.target-20,by:"A"}); } if(e.key===" "&&ctx.mine("B")){ e.preventDefault(); ctx.act({k:"switch",by:"B"}); } },
  render(S,ctx){ const l=$("[data-swl]",ctx.stage); if(l) l.textContent = S.sw==="up"?"التفرع الجاي: فوگ":"التفرع الجاي: جوّا"; const sp=$("[data-sp]",ctx.stage); if(sp && document.activeElement!==sp) sp.value=S.target; $("[data-msg]",ctx.stage).textContent=S.msg||""; },
  frame(S,ctx){ const cv=$(".tr-cv",ctx.stage); if(!cv) return; const c=cv.getContext("2d"), I=ctx._img; const cam=S.x-200;
    const g=c.createLinearGradient(0,0,0,420); g.addColorStop(0,"#F2B07A"); g.addColorStop(1,"#F3E6C8"); c.fillStyle=g; c.fillRect(0,0,1000,420);
    c.fillStyle="#C98A4A"; for(let i=-1;i<8;i++){ const x=((i*180-cam*.3)%1260+1260)%1260-130; c.beginPath(); c.arc(x,330,120,Math.PI,0); c.fill(); }
    const yMain=280, yUp=200, yDn=360;
    c.strokeStyle="#3A2A1C"; c.lineWidth=6; c.beginPath(); c.moveTo(0,yMain); c.lineTo(1000,yMain); c.stroke();
    S.segs.forEach(sg=>{ const sx=sg.x-cam; if(sx<-300||sx>1300) return;
      if(sg.kind==="fork"){ [["up",yUp],["down",yDn]].forEach(([k,y])=>{ c.strokeStyle= (!sg.done && S.sw===k) ? "#B5482A" : "#3A2A1C"; c.lineWidth = (!sg.done && S.sw===k)?7:4; c.beginPath(); c.moveTo(sx-160,yMain); c.quadraticCurveTo(sx-80,y,sx,y); c.lineTo(sx+120,y); c.quadraticCurveTo(sx+200,y,sx+260,yMain); c.stroke(); const it=sg.items[k]; if(!(sg.done && sg.took===k)){ const im = it==="ticket"?I.t:it==="lantern"?I.l:I.f; if(it==="leaves"){ for(let j=0;j<5;j++) c.drawImage(im,sx-10+j*22,y-34,28,28); } else c.drawImage(im,sx+20,y-46,it==="ticket"?60:30,it==="ticket"?36:45); } }); }
      else { c.fillStyle="#7A2E2A"; c.fillRect(sx-50,yMain-110,120,20); c.fillStyle="#5A3A24"; c.fillRect(sx-46,yMain-90,8,90); c.fillRect(sx+58,yMain-90,8,90); c.fillStyle="#F3E6C8"; c.font="bold 16px Almarai"; c.textAlign="center"; c.fillText(sg.done?"✓":"محطة",sx+10,yMain-96); c.fillStyle="rgba(232,192,102,.35)"; c.fillRect(sx-40,yMain-6,100,12); } });
    let ty=yMain; const near=S.segs.find(sg=>sg.kind==="fork" && S.x>sg.x-160 && S.x<sg.x+260); if(near){ const k=near.done?near.took:S.sw; const yy=k==="up"?yUp:yDn; const d=S.x-near.x; ty = d<0 ? yMain+(yy-yMain)*Math.min(1,(d+160)/160) : d<120 ? yy : yy+(yMain-yy)*Math.min(1,(d-120)/140); }
    c.save(); c.translate(200,ty); c.fillStyle="#2F5E57"; c.fillRect(-90,-46,120,40); c.fillStyle="#3A2A1C"; c.fillRect(20,-60,20,20); c.fillStyle="#FFD27A"; c.fillRect(-80,-40,24,18); c.fillRect(-48,-40,24,18); c.fillStyle="#3A2A1C"; c.beginPath(); c.arc(-70,-4,10,0,7); c.arc(10,-4,10,0,7); c.fill(); c.fillStyle="#7A2E2A"; c.fillRect(-200,-40,100,34); c.restore();
    c.fillStyle="#3A2A1C"; c.font="bold 18px Almarai"; c.textAlign="right"; c.fillText(`السرعة ${Math.round(S.v)} · تذاكر ${S.tickets} · فوانيس ${S.lanterns} · محطات ${S.stations}`, 980, 30); },
  status:S=>`التقدم ${Math.min(100,Math.round(S.x/S.end*100))}%`,
  result(S){ if(S.fin){ const sc=S.tickets+S.lanterns*2+S.stations*2-S.slowHits; return {title:"وصل القطار!", text:`جمعتوا ${S.tickets} تذكرة و${S.lanterns} فانوس، ووگفتوا بـ ${S.stations} محطة.`, rating:sc>=16?3:sc>=10?2:1}; } return null; }
};

/* ---- 8. سباق عربات البلدة ---- */
KG.race = {
  title:"سباق عربات البلدة", tag:"سباق قصير بمسار خريفي", duo:true, tint:"#B33A26", icon:()=>ART.crate(),
  how:"كل واحد يسوق عربته بمساره: غيّر الحارة فوگ وجوّا، اتجنّب أكوام الأوراق، والتقط الأسهم الذهبية للتسريع. منافسة ودّية — أول واحد يوصل يفوز. على نفس الجهاز تسابقين يقين ضد خباب، أو خلّي الجهاز يسوق واحد.",
  roles:{A:"عربة خباب (W/S)", B:"عربة يقين (↑/↓)"},
  bg:"background:linear-gradient(180deg,#F6C98B,#C98A4A)",
  init(seed){ const r=rng(seed); const obs={A:[],B:[]}; ["A","B"].forEach(k=>{ let x=500; while(x<5200){ obs[k].push({x, lane:Math.floor(r()*3), t: r()<.3?"boost":"pile"}); x+=180+Math.floor(r()*140); } }); return {c:{A:{x:0,lane:1,v:220,boost:0,stun:0},B:{x:0,lane:1,v:220,boost:0,stun:0}}, obs, len:5400, go:Date.now()+2000, ai:true, winner:null}; },
  act(S,a,by){ const car=S.c[by]; if(!car) return S; if(a.k==="lane") car.lane=Math.max(0,Math.min(2,car.lane+a.d)); if(a.k==="ai") S.ai=!!a.v; return S; },
  tick(S,dt,ctx){ if(Date.now()<S.go || S.winner) return S;
    ["A","B"].forEach(k=>{ const c=S.c[k]; const base=240; c.v += ((c.boost>0?420:c.stun>0?90:base)-c.v)*Math.min(1,dt*3); c.x+=c.v*dt; c.boost-=dt; c.stun-=dt;
      S.obs[k].forEach(o=>{ if(!o.hit && Math.abs(o.x-c.x)<40 && o.lane===c.lane){ o.hit=true; if(o.t==="boost") c.boost=1.2; else c.stun=.7; } });
      if(k==="B" && ctx && ctx.solo && S.ai){ const next=S.obs.B.find(o=>!o.hit && o.x>c.x && o.x-c.x<160); if(next && Math.random()<.08){ if(next.t==="pile" && next.lane===c.lane) c.lane = c.lane===0?1:c.lane===2?1:(Math.random()<.5?0:2); if(next.t==="boost" && next.lane!==c.lane && Math.random()<.5) c.lane += Math.sign(next.lane-c.lane); } }
      if(c.x>=S.len && !S.winner) S.winner=k; });
    return S; },
  mount(ctx){ ctx.stage.innerHTML=`<div class="rc"><canvas class="rc-cv" width="1000" height="480"></canvas><div class="rc-pads">${["A","B"].filter(r=>ctx.mine(r)).map(r=>`<div class="ln-pad"><b>${CH[ctx.charOf(r)].name}</b><button class="btn ghost" data-r="${r}" data-d="-1" aria-label="فوگ">${IC.up}</button><button class="btn ghost" data-r="${r}" data-d="1" aria-label="جوّا">${IC.down}</button></div>`).join("")}${ctx.solo?'<label class="chip"><input type="checkbox" data-ai checked> الجهاز يسوق عربة يقين</label>':""}</div></div>`;
    $$("[data-r]",ctx.stage).forEach(b=>b.onclick=()=>ctx.act({k:"lane",d:+b.dataset.d,by:b.dataset.r})); const ai=$("[data-ai]",ctx.stage); if(ai) ai.onchange=()=>ctx.act({k:"ai",v:ai.checked});
    ctx._img={k:loadImg("rc_k",CH[ctx.charOf("A")].img), y:loadImg("rc_y",CH[ctx.charOf("B")].img), leaf:loadImg("rc_l",svgURL(ART.maple("#B33A26")))}; },
  key(e,S,ctx){ const m={w:["A",-1],s:["A",1],ArrowUp:["B",-1],ArrowDown:["B",1]}; const k=m[e.key]||m[e.key.toLowerCase()]; if(!k) return; e.preventDefault(); let r=k[0]; if(ctx.role!=="both") r=ctx.role; ctx.act({k:"lane",d:k[1],by:r}); },
  render(){},
  frame(S,ctx){ const cv=$(".rc-cv",ctx.stage); if(!cv) return; const c=cv.getContext("2d"), I=ctx._img;
    c.fillStyle="#E9C9A0"; c.fillRect(0,0,1000,480);
    [["A",0],["B",240]].forEach(([k,oy])=>{ const car=S.c[k], cam=car.x-160;
      c.fillStyle="#B98552"; c.fillRect(0,oy+30,1000,190); c.strokeStyle="rgba(255,255,255,.5)"; c.setLineDash([24,20]); c.lineWidth=3; for(let l=1;l<3;l++){ c.beginPath(); c.lineDashOffset=cam; c.moveTo(0,oy+30+l*63); c.lineTo(1000,oy+30+l*63); c.stroke(); } c.setLineDash([]);
      const fx=S.len-cam; if(fx<1000){ for(let i=0;i<6;i++){ c.fillStyle=i%2?"#fff":"#3A2A1C"; c.fillRect(fx,oy+30+i*32,16,32); } }
      S.obs[k].forEach(o=>{ const x=o.x-cam; if(x<-40||x>1040||o.hit) return; const y=oy+30+o.lane*63+31; if(o.t==="pile"){ for(let j=0;j<4;j++) c.drawImage(I.leaf,x-24+j*12,y-18+(j%2)*8,26,26); } else { c.fillStyle="#E8C066"; c.beginPath(); c.moveTo(x-18,y-14); c.lineTo(x+14,y); c.lineTo(x-18,y+14); c.fill(); } });
      const y=oy+30+car.lane*63+31; c.fillStyle="#7A2E2A"; c.fillRect(120,y-14,80,26); c.fillStyle="#3A2A1C"; c.beginPath(); c.arc(135,y+14,9,0,7); c.arc(185,y+14,9,0,7); c.fill();
      const im=k==="A"?I.k:I.y; if(im.complete){ const hh=60, w=hh*im.naturalWidth/im.naturalHeight; c.drawImage(im,160-w/2,y-hh+4,w,hh); }
      if(car.boost>0){ c.fillStyle="rgba(232,192,102,.6)"; c.fillRect(80,y-6,40,10); }
      c.fillStyle="#3A2A1C"; c.font="bold 18px Almarai"; c.textAlign="right"; c.fillText(`${CH[ctx.charOf(k)].name} · ${Math.min(100,Math.round(car.x/S.len*100))}%`, 980, oy+22); });
    const cd=(S.go-Date.now())/1000; if(cd>0){ c.fillStyle="#3A2A1C"; c.font="bold 70px Almarai"; c.textAlign="center"; c.fillText(Math.ceil(cd),500,260); } },
  status:S=>S.winner?"خلص السباق":"انطلقوا!",
  result(S){ if(S.winner){ return {title:`فاز ${S.winner==="A"?"خباب":"يقين"}!`, text:"سباق حلو! تگدرون تعيدون وتشوفون منو يفوز المرة الجاية.", rating:3}; } return null; }
};

/* ---- 9. مهمة الدفيئة ---- */
KG.greenhouse = {
  title:"مهمة الدفيئة", tag:"ضوء وماء لكل نبتة", duo:true, tint:"#5B7F4A", icon:()=>ART.flower("#F3C1BA"),
  how:"كل نبتة تحتاج شي معيّن: ضوء بس، ماي بس، الاثنين، أو ولا شي (تحب الظل). خباب يفتح ستائر الضوء للصفوف، ويقين تفتح صنابير الماي للأعمدة. لگوا التركيبة اللي ترضي كل النباتات.",
  roles:{A:"خباب: ستائر الضوء (الصفوف)", B:"يقين: صنابير الماي (الأعمدة)"},
  bg:"background:linear-gradient(180deg,#DDEBD0,#9DBF8E)",
  init(seed){ return ghLevel(0, seed, 0); },
  act(S,a,by){ if(a.k==="row" && by==="A") S.rows[a.i]=S.rows[a.i]?0:1; if(a.k==="col" && by==="B") S.cols[a.i]=S.cols[a.i]?0:1; if(a.k==="toggle"||a.k==="row"||a.k==="col"){ S.moves++; S.solved = ghOK(S); } if(a.k==="next" && S.solved && S.lv<2) return ghLevel(S.lv+1, S.seed, S.moves); return S; },
  mount(ctx){ ctx.stage.innerHTML=`<div class="gh" data-gh></div>`; },
  render(S,ctx){ const g=$("[data-gh]",ctx.stage); if(!g) return; const n=S.n;
    const need = (r,c)=>S.need[r*n+c]; const has=(r,c)=>[S.rows[r],S.cols[c]];
    const plant=(r,c)=>{ const [l,w]=has(r,c), nd=need(r,c), ok = nd[0]===l && nd[1]===w; return `<div class="gh-cell ${ok?"ok":"sad"} ${l?"lit":""} ${w?"wet":""}"><span class="gh-plant">${ART.flower(ok?"#F3C1BA":"#C9C2B0")}</span><span class="gh-need">${nd[0]?'<i class="sun"></i>':""}${nd[1]?'<i class="drop"></i>':""}${!nd[0]&&!nd[1]?'<i class="shade"></i>':""}</span></div>`; };
    g.innerHTML = `<div class="gh-board" style="grid-template-columns:auto repeat(${n},1fr)"><span></span>${Array.from({length:n},(_,c)=>`<button class="gh-tap ${S.cols[c]?"on":""}" data-col="${c}" ${ctx.mine("B")?"":"disabled"} aria-label="صنبور عمود ${c+1}">${S.cols[c]?"مفتوح":"مسكّر"}</button>`).join("")}
      ${Array.from({length:n},(_,r)=>`<button class="gh-shade ${S.rows[r]?"on":""}" data-row="${r}" ${ctx.mine("A")?"":"disabled"} aria-label="ستارة صف ${r+1}">${S.rows[r]?"ضوء":"ظل"}</button>${Array.from({length:n},(_,c)=>plant(r,c)).join("")}`).join("")}</div>
      <p class="d-note">الرموز فوگ كل نبتة: شمس = تحتاج ضوء، قطرة = تحتاج ماي، غيمة = تحب الظل والجفاف.</p>${S.solved&&S.lv<2&&ctx.isHost?'<button class="btn honey" data-next>الدفيئة الجاية</button>':""}`;
    $$("[data-row]",g).forEach(b=>b.onclick=()=>ctx.act({k:"row",i:+b.dataset.row,by:"A"}));
    $$("[data-col]",g).forEach(b=>b.onclick=()=>ctx.act({k:"col",i:+b.dataset.col,by:"B"}));
    const nb=$("[data-next]",g); if(nb) nb.onclick=()=>ctx.act({k:"next"}); },
  status:S=>`الدفيئة ${S.lv+1}/3 · تحريكات ${S.moves}`,
  result(S){ if(S.solved && S.lv===2) return {title:"الدفيئة كلها مزهرة!", text:`رضّيتوا كل النباتات بـ ${S.moves} تحريكة.`, rating:S.moves<=24?3:S.moves<=40?2:1}; return null; }
};
function ghLevel(lv, seed, moves){ const r=rng(seed+lv*131); const n=lv===0?3:lv===1?3:4; const R=Array.from({length:n},()=>r()<.5?1:0), C=Array.from({length:n},()=>r()<.5?1:0); if(!R.some(x=>x)) R[0]=1; if(!C.some(x=>x)) C[n-1]=1; const need=[]; for(let i=0;i<n;i++) for(let j=0;j<n;j++) need.push([R[i],C[j]]); const S={lv,n,need,rows:Array(n).fill(0),cols:Array(n).fill(0),moves,seed,solved:false}; return S; }
function ghOK(S){ for(let i=0;i<S.n;i++) for(let j=0;j<S.n;j++){ const nd=S.need[i*S.n+j]; if(nd[0]!==S.rows[i]||nd[1]!==S.cols[j]) return false; } return true; }

