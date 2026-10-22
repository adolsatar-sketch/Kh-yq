/* =====================================================================
   المقدمة السينمائية: ضوء سِراج بالظلمة ← لوحة القلعة الأصلية تنكشف ←
   خباب يركض ويقين تمشي وتلتفت (القصاصة نفسها مع رأس يتحرك ورمش) ← العنوان.
   أول مرة تنعرض كاملة؛ بعدها الدخول مباشر للعالم، وتنعاد من القائمة.
   زر «تخطّي» دائماً، وتقليل الحركة يعرض المشهد الأخير ثابت.
   ===================================================================== */
function viewOpening(root){
  const full = motionOK();
  const v = h(`<section class="view cine ${full?"":"cine-static"}" aria-label="مقدمة مغامرات خباب ويقين">
    <div class="cine-sky"><i></i></div>
    <div class="cine-castle"><img src="${CASTLE}" alt="قلعة الخريف — اللوحة الأصلية" draggable="false" decoding="async"></div>
    <div class="cine-vig"></div>
    <svg class="cine-trail" viewBox="0 0 100 100" aria-hidden="true"><path d="M0 0"/></svg>
    <div class="cine-siraj" aria-hidden="true">${ART.siraj("idle")}</div>
    <p class="cine-cap" data-cap aria-live="polite"></p>
    <div class="cine-kids"><div class="ck ck-k">${kidFigure("k")}<span class="bubble" data-bk></span></div><div class="ck ck-y">${kidFigure("y")}<span class="bubble" data-by></span></div></div>
    <span class="bubble cine-sb" data-bs></span>
    <div class="cine-title">
      <p class="ct-pre">قلعة الخريف تقدّم</p>
      <h1 class="ct-h">مغامرات <span>خباب</span> و<span>يقين</span></h1>
      <p class="ct-sub">ساعة القلعة وقفت. سِراج يعرف الممرات، وإنتو تعرفون الشجاعة.</p>
      <div class="ct-cta">
        <button class="btn honey" data-start>${IC.map} ابدأوا المغامرة</button>
        <button class="btn ghost" data-meet>تعرّفوا على خباب ويقين</button>
        <button class="btn ghost" data-friend>${IC.friends} العب مع صديق</button>
      </div>
    </div>
    <button class="cine-skip" data-skip>تخطّي المقدمة</button>
  </section>`);
  root.appendChild(v);
  const timers=[]; let raf=0, done=false;
  const at=(ms,fn)=>timers.push(setTimeout(fn,ms));
  const cap=$("[data-cap]",v), sir=$(".cine-siraj",v), trail=$(".cine-trail path",v);
  const kf=$(".ck-k .kidfig",v), yf=$(".ck-y .kidfig",v);
  const say=(sel,t,ms=1700)=>{ const b=$(sel,v); b.textContent=t; b.classList.add("on"); at(ms,()=>b.classList.remove("on")); };
  const caption=t=>{ cap.classList.remove("on"); at(60,()=>{ cap.textContent=t; cap.classList.add("on"); }); };
  // نحمّل اللوحة بالخلفية حتى المشهد الأول ما ينتظرها (أسرع على الهاتف)
  const img=$(".cine-castle img",v); const ready=()=>v.classList.add("img-ok"); if(img.complete && img.naturalWidth) ready(); else img.onload=ready;
  // طيران سِراج: نفس منحنى المشي (catmull) ونفس easeInOutQuad
  // الأثر يترسم بإحداثيات البكسل حتى الخط يبقى متصل وبسمك واحد على أي شاشة
  function fly(points, dur, then){
    const W=v.clientWidth||1, H=v.clientHeight||1; trail.ownerSVGElement.setAttribute("viewBox",`0 0 ${W} ${H}`);
    trail.setAttribute("d", catmull(points.map(([x,y])=>[x*W/100, y*H/100]))); const L=trail.getTotalLength(); trail.style.strokeDasharray=L; trail.style.strokeDashoffset=L;
    const t0=performance.now();
    const step=now=>{ const t=Math.min(1,(now-t0)/dur), e=t<.5?2*t*t:1-Math.pow(-2*t+2,2)/2, p=trail.getPointAtLength(L*e);
      sir.style.left=(p.x/W*100)+"%"; sir.style.top=(p.y/H*100)+"%"; trail.style.strokeDashoffset=L*(1-e);
      if(t<1) raf=requestAnimationFrame(step); else then&&then(); };
    raf=requestAnimationFrame(step);
  }
  function finish(){
    if(done) return; done=true; timers.forEach(clearTimeout); cancelAnimationFrame(raf);
    v.classList.add("s1","s2","s3","s4","end"); sir.style.left="76%"; sir.style.top="24%";
    $$(".bubble",v).forEach(b=>b.classList.remove("on")); cap.classList.remove("on");
    Store.set("introSeen", true);
    setTimeout(()=>{ const s=$("[data-start]",v); s && s.focus({preventScroll:true}); }, 50);
  }
  if(full){
    v.classList.add("s1"); sir.style.left="4%"; sir.style.top="82%";
    at(250, ()=>fly([[4,82],[20,52],[38,70],[52,38],[68,52],[76,30]], 2300));
    at(500, ()=>{ caption("تك… تك…"); Sound.soft(); });
    at(2500, ()=>{ v.classList.add("s2"); caption("بقلعة الخريف، الساعة الكبيرة وقفت عن الدق… والخريف علگ بين العصر والمغرب."); });
    at(5200, ()=>{ v.classList.add("s3"); cap.classList.remove("on"); kidAct(kf,"run"); });
    at(5700, ()=>{ kidAct(yf,"walk"); });
    at(6000, ()=>fly([[76,30],[64,42],[52,48]], 900));
    at(6400, ()=>{ kidAct(kf,"jump"); say("[data-bk]","سمعتي؟ تك تك!"); Sound.pop(); });
    at(7300, ()=>{ kidAct(yf,"surprise"); say("[data-by]","ضو… يطير؟"); });
    at(8200, ()=>{ sir.classList.add("talk"); say("[data-bs]","أنا سِراج، دليل الممرات القديمة. كل طريق هنا يخفي حكاية.", 2600); Sound.chime(); });
    at(9900, ()=>{ kidAct(kf,"happy"); kidAct(yf,"happy"); fly([[52,48],[66,30],[76,24]], 800); });
    at(10300, ()=>{ v.classList.add("s4"); Store.set("introSeen", true); });
    at(11200, finish);
  } else finish();
  // أي ضغطة على المشهد قبل العنوان تسرّعه، و«تخطّي» يروح للعنوان مباشرة
  $("[data-skip]",v).onclick=e=>{ e.stopPropagation(); finish(); };
  v.addEventListener("keydown", e=>{ if(e.key==="Escape") finish(); });
  $("[data-start]",v).onclick=()=>{ finish(); sceneLeave(null, ()=>go("world")); };
  $("[data-meet]",v).onclick=()=>{ finish(); go("meet"); };
  $("[data-friend]",v).onclick=()=>{ finish(); go("lobby"); };
  $$(".ck .kidfig",v).forEach(k=>k.onclick=()=>{ kidAct(k,"jump"); Sound.soft(); });
  return ()=>{ timers.forEach(clearTimeout); cancelAnimationFrame(raf); };
}
Object.assign(ROUTES, { open:{view:r=>viewOpening(r), title:()=>"", bare:true} });
