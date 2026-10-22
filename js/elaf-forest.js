/* =====================================================================
   عالم أيلاف — غابتها، ألعابها، نكتها، الكهف، وشخصياتها (جعموص وسومو).
   هذا العالم صار بصفحة مستقلة (elaf.html) ومنفصل عن لعبة خباب ويقين.
   ===================================================================== */
const settings = Object.assign({heroName:CONFIG.heroName, welcome:CONFIG.welcome, siteTitle:CONFIG.siteTitle, accent:CONFIG.accent, theme:"auto", secretLetter:CONFIG.secretLetter}, Store.get("settings", {}));
const heroName = () => settings.heroName || CONFIG.heroFallback;
// جعموص — دمية قماشية أصلية جالسة: راس كبير مدوّر، جسم صغير، ورقة عسلية فوق الراس
ART.jaamous = (state="idle") => {
  const eyes = state==="happy"
    ? '<path d="M64 100q12-14 24 0M112 100q12-14 24 0" fill="none" stroke="#2F2A20" stroke-width="6" stroke-linecap="round"/>'
    : `<g><circle cx="76" cy="100" r="15" fill="#2F2A20"/><circle cx="124" cy="100" r="15" fill="#2F2A20"/><circle cx="${state==="think"?80:71}" cy="${state==="think"?92:94}" r="5" fill="#fff"/><circle cx="${state==="think"?128:119}" cy="${state==="think"?92:94}" r="5" fill="#fff"/><circle cx="${state==="think"?84:80}" cy="104" r="2" fill="#fff" opacity=".7"/><rect class="lid" x="59" y="83" width="34" height="34" rx="17" fill="#9DBF8E"/><rect class="lid" x="107" y="83" width="34" height="34" rx="17" fill="#9DBF8E"/></g>`;
  const mouth = state==="happy" ? '<path d="M84 124q16 20 32 0z" fill="#8E4536" stroke="#2F2A20" stroke-width="3" stroke-linejoin="round"/><path d="M92 132q8 5 16 0" fill="#E9A79E"/>'
    : state==="think" ? '<path d="M92 128q8-4 16 0" fill="none" stroke="#2F2A20" stroke-width="4" stroke-linecap="round"/>'
    : '<path d="M86 124q14 12 28 0" fill="none" stroke="#2F2A20" stroke-width="4" stroke-linecap="round"/>';
  return `<svg class="jm jm-${state}" viewBox="0 0 200 220" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${CONFIG.companionName}">
  <ellipse cx="100" cy="212" rx="70" ry="7" fill="rgba(60,50,30,.16)"/>
  <ellipse cx="66" cy="196" rx="26" ry="16" fill="#7FA374" stroke="#4E6A46" stroke-width="3.5"/>
  <ellipse cx="134" cy="196" rx="26" ry="16" fill="#7FA374" stroke="#4E6A46" stroke-width="3.5"/>
  <ellipse cx="58" cy="196" rx="10" ry="8" fill="#F4EBD0" opacity=".9"/><ellipse cx="142" cy="196" rx="10" ry="8" fill="#F4EBD0" opacity=".9"/>
  <ellipse cx="100" cy="172" rx="48" ry="34" fill="#93B886" stroke="#4E6A46" stroke-width="3.5"/>
  <ellipse cx="100" cy="176" rx="24" ry="17" fill="#F4EBD0" stroke="#C9B98E" stroke-width="2.5"/>
  <ellipse cx="100" cy="176" rx="18" ry="12" fill="none" stroke="#C9B98E" stroke-width="2" stroke-dasharray="3 4"/>
  <ellipse cx="50" cy="166" rx="14" ry="20" transform="rotate(30 50 166)" fill="#88AC7E" stroke="#4E6A46" stroke-width="3.5"/>
  <g class="arm-r"><ellipse cx="150" cy="166" rx="14" ry="20" transform="rotate(-30 150 166)" fill="#88AC7E" stroke="#4E6A46" stroke-width="3.5"/></g>
  <circle cx="100" cy="94" r="72" fill="#9DBF8E" stroke="#4E6A46" stroke-width="3.5"/>
  <path d="M100 24V56" stroke="#4E6A46" stroke-width="2.5" stroke-dasharray="5 5"/>
  <path d="M40 120q60 30 120 0" stroke="#4E6A46" stroke-width="2" stroke-dasharray="4 6" fill="none" opacity=".5"/>
  <rect x="140" y="60" width="18" height="16" rx="3" transform="rotate(14 149 68)" fill="#B9A6DD" stroke="#7F6AA8" stroke-width="2"/>
  <path d="M144 64l9 7M153 64l-9 7" stroke="#7F6AA8" stroke-width="2" transform="rotate(14 149 68)"/>
  <path d="M100 24C98 14 100 8 106 2" stroke="#7A5A3A" stroke-width="4" fill="none" stroke-linecap="round"/>
  <path d="M104 8C120-6 148-2 152 12C136 24 116 22 104 8Z" fill="#E8C066" stroke="#B88F33" stroke-width="2.5"/>
  <path d="M108 9C122 6 136 8 148 12" stroke="#B88F33" stroke-width="2" fill="none"/>
  <ellipse cx="56" cy="122" rx="12" ry="7" fill="#E9A79E" opacity=".75"/><ellipse cx="144" cy="122" rx="12" ry="7" fill="#E9A79E" opacity=".75"/>
  ${eyes}${mouth}
  </svg>`;
};
ART.jmFace = () => `<svg viewBox="20 -6 160 180" xmlns="http://www.w3.org/2000/svg"><circle cx="100" cy="94" r="72" fill="#9DBF8E" stroke="#4E6A46" stroke-width="5"/><circle cx="76" cy="100" r="15" fill="#2F2A20"/><circle cx="124" cy="100" r="15" fill="#2F2A20"/><circle cx="71" cy="94" r="5" fill="#fff"/><circle cx="119" cy="94" r="5" fill="#fff"/><path d="M86 124q14 12 28 0" fill="none" stroke="#2F2A20" stroke-width="5" stroke-linecap="round"/><ellipse cx="56" cy="122" rx="12" ry="7" fill="#E9A79E" opacity=".75"/><ellipse cx="144" cy="122" rx="12" ry="7" fill="#E9A79E" opacity=".75"/><path d="M104 8C120-6 148-2 152 12C136 24 116 22 104 8Z" fill="#E8C066" stroke="#B88F33" stroke-width="3"/></svg>`;
// سومو — ضيف أصلي: فطر صغير ممتلئ بقبعة وردية منقّطة
ART.sumo = (state="idle") => `<svg class="sumo" viewBox="0 0 200 220" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${CONFIG.guestName}">
  <ellipse cx="100" cy="210" rx="52" ry="7" fill="rgba(60,50,30,.16)"/>
  <ellipse cx="78" cy="200" rx="16" ry="10" fill="#C9A77E" stroke="#8C6C48" stroke-width="3"/><ellipse cx="122" cy="200" rx="16" ry="10" fill="#C9A77E" stroke="#8C6C48" stroke-width="3"/>
  <path d="M56 110C52 160 62 198 100 198C138 198 148 160 144 110Z" fill="#F3E6C8" stroke="#8C6C48" stroke-width="3.5"/>
  <ellipse cx="48" cy="146" rx="12" ry="18" transform="rotate(20 48 146)" fill="#F3E6C8" stroke="#8C6C48" stroke-width="3"/>
  <ellipse cx="152" cy="146" rx="12" ry="18" transform="rotate(-20 152 146)" fill="#F3E6C8" stroke="#8C6C48" stroke-width="3"/>
  <path d="M18 108C20 52 62 22 100 22C138 22 180 52 182 108C150 120 50 120 18 108Z" fill="#D99BB0" stroke="#9A5C72" stroke-width="3.5"/>
  <circle cx="64" cy="66" r="11" fill="#FBF3E3"/><circle cx="104" cy="44" r="9" fill="#FBF3E3"/><circle cx="142" cy="72" r="12" fill="#FBF3E3"/><circle cx="40" cy="96" r="7" fill="#FBF3E3"/><circle cx="164" cy="98" r="6" fill="#FBF3E3"/>
  ${state==="happy" ? '<path d="M78 142q7-8 14 0M108 142q7-8 14 0" fill="none" stroke="#2F2A20" stroke-width="4.5" stroke-linecap="round"/>' : '<circle cx="85" cy="142" r="6.5" fill="#2F2A20"/><circle cx="115" cy="142" r="6.5" fill="#2F2A20"/><circle cx="87" cy="140" r="2" fill="#fff"/><circle cx="117" cy="140" r="2" fill="#fff"/>'}
  <ellipse cx="72" cy="156" rx="8" ry="5" fill="#E9A79E" opacity=".7"/><ellipse cx="128" cy="156" rx="8" ry="5" fill="#E9A79E" opacity=".7"/>
  <path d="M93 158q7 7 14 0" fill="none" stroke="#2F2A20" stroke-width="3.5" stroke-linecap="round"/>
</svg>`;
Object.assign(STICKERS, {
  jaamous:{label:CONFIG.companionName, src:svgURL(ART.jaamous("happy"))},
  sumo:{label:CONFIG.guestName, src:svgURL(ART.sumo("happy")), lock:"sumo"},
  hero:{label:CONFIG.heroName||"البطلة", src:GIRL, lock:"hero"}
});
["jaamous","sumo","hero"].forEach(k=>loadImg("stk_"+k, STICKERS[k].src));
/* ============ places & games registry ============ */
const GAMES = {
  fireflies:{title:"سماء اليراعات", place:"lake", how:"صيدي اليراعات قبل لا تختفي. كل وحدة تطير للسما وتضوّي نقطة من سرّ مخبّى.", icon:()=>ART.firefly(), best:v=>`أقل هاربات: ${v}`},
  basket:{title:"سلّة سومو", place:"apricot", how:"حرّكي سومو وخلّيه يلزم المشمش بالسلّة. الذهبية بيها نكتة… وانتبهي من النعال.", icon:()=>ART.apricot(true), best:v=>`أعلى نتيجة: ${v}`},
  dance:{title:"رقصة سومو", place:"square", how:"سومو يرقص حركات ورا بعض، وإنتِ عيديها بنفس الترتيب. كل مستوى حركة زيادة.", icon:()=>ART.sumo("happy"), best:v=>`أعلى مستوى: ${v}`},
  madlibs:{title:"سوالف مجنونة", place:"bridge", how:"اختاري كلمات عشوائية وشوفي شلون تطلع الحكاية. تقدرين تحفظيها بالدفتر.", icon:()=>ART.cloud(), best:v=>`حكايات: ${v}`},
  memory:{title:"ذاكرة أوراق الغابة", place:"lake", how:"تشوفين الأوراق ثانيتين بالبداية، بعدين اقلبي ورقتين بكل مرة ولاگي الأزواج.", icon:()=>ART.leaf(), best:v=>`أقل محاولات: ${v}`},
  story:{title:"رتّبي الحكاية", place:"bridge", how:"رتّبي المشاهد من البداية للنهاية. اسحبي البطاقة أو اضغطي بطاقتين للتبديل.", icon:()=>ART.butterfly(), best:v=>`أقل أخطاء: ${v}`},
  road:{title:"طريق "+CONFIG.companionName, place:"square", how:"غيّري المسار فوق وجوّا، اقفزي فوق الصخور، واجمعي النجوم. ماكو خسارة.", icon:()=>ART.starB(), best:v=>`أكثر نجوم: ${v}`},
  logic:{title:"لغز الجسر", place:"bridge", how:"ألغاز قصيرة تصعب شوي شوي. إذا احترتي، التلميح موجود.", icon:()=>ART.stone(), best:v=>`أقل أخطاء: ${v}`},
  bubbles:{title:"صيد الفقاعات", place:"square", how:"اضغطي الفقاعات قبل لا تطير. الذهبية بثلاث، وفقاعة سومو بخمسة.", icon:()=>ART.flower(), best:v=>`أعلى نتيجة: ${v}`},
  jokes:{title:"صندوق النكت العبيطة", place:"apricot", how:"افتحي الصندوق، اقري النكتة، وقيّمي شگد ضحكتي.", icon:()=>ART.jokeBox(), route:"jokes"}
};
const PLACES = {
  treehouse:{name:"بيت الشجرة", sub:"دفتر المذكرات", x:11, y:41, art:()=>ART.treehouse(), go:()=>go("diary")},
  studio:{name:"مرسم الفطر", sub:"الرسم", x:19, y:83, art:()=>ART.studio(), go:()=>go("paint")},
  square:{name:"ساحة الأصدقاء", sub:"ألعاب سريعة", x:38, y:68, art:()=>ART.square(), games:["dance","road","bubbles"]},
  apricot:{name:"شجرة المشمش", sub:"نكت وسلّة سومو", x:50, y:50, art:()=>ART.apricotTree(), games:["basket","jokes"]},
  bridge:{name:"الجسر القديم", sub:"ألغاز وسوالف", x:64, y:61, art:()=>ART.bridgeSign(), games:["madlibs","logic","story"]},
  lake:{name:"البحيرة", sub:"يراعات وذاكرة", x:83, y:90, art:()=>ART.pond(), games:["fireflies","memory"]},
  cave:{name:"الكهف المضيء", sub:"أسرار وتحديات", x:88, y:62, art:()=>ART.cave(), go:()=>go("cave")}
};
const PATH_ORDER = ["treehouse","studio","square","apricot","bridge","cave","lake"];
const SECRETS = [
  {id:"snail", x:7, y:73, art:()=>ART.snail(), msg:"حلزون نعسان على الصخرة. يگول: «على كيفج، الغابة ما تستعجل».", hint:"صخرة كبيرة يسار الطريق"},
  {id:"ladybug", x:15.5, y:56, art:()=>ART.ladybug(), msg:"دعسوقة على السياج تحسب نقاطها: ستة… وأيلاف السابعة.", hint:"السياج الخشبي يسار"},
  {id:"cloud", x:52, y:18, art:()=>ART.cloud(), msg:"غيمة صغيرة على شكل وسادة. تحجز مكان لقيلولة أيلاف.", hint:"بين الغيوم وسط السماء"},
  {id:"frog", x:72, y:86, art:()=>ART.frog(), msg:"ضفدع يغني لحن قصير، بس يستحي إذا أحد يسمعه.", hint:"قرب الماي تحت الجسر"},
  {id:"bird", x:30, y:30, art:()=>ART.bird(), msg:"عصفور يجمع خيوط للعش. أخذ خيط أزرق من فستان أيلاف.", hint:"بين أشجار اليسار البعيدة"},
  {id:"acorn", x:95, y:42, art:()=>ART.acorn(), msg:"بلوطة ذهبية! "+CONFIG.companionName+" يگول هاي أثمن كنز بالغابة… بعد أيلاف.", hint:"الشجرة الكبيرة يمين"}
];

/* ============ shared bits ============ */
function ambientLayer(n=8){
  if(!motionOK()) return '<div class="ambient"></div>';
  const cols=["#9DBF8E","#B7CF8F","#E8C066","#C9D9A8"];
  let s='<div class="ambient" aria-hidden="true"><div class="lightray" style="left:18%"></div><div class="lightray" style="left:62%;animation-delay:-4s"></div>';
  for(let i=0;i<n;i++) s+=`<span class="leaf-f" style="left:${Math.random()*100}%;animation-duration:${11+Math.random()*10}s;animation-delay:${-Math.random()*20}s">${ART.leaf(cols[i%4])}</span>`;
  for(let i=0;i<7;i++) s+=`<span class="ffly" style="left:${10+Math.random()*80}%;top:${45+Math.random()*45}%;animation-delay:${-Math.random()*6}s,${-Math.random()*3}s"></span>`;
  return s+'</div>';
}
function girlImg(cls="idle", alt){ return `<img class="girl ${cls}" src="${GIRL}" alt="${esc(alt||heroName())}" draggable="false">`; }
function jmHTML(state="idle", cls=""){ return `<div class="jm-wrap ${cls}">${ART.jaamous(state)}</div>`; }
function sumoHTML(state="idle"){ return `<div class="sumo-wrap">${ART.sumo(state)}</div>`; }

/* ============ INTRO ============ */
function viewIntro(root){
  const v = h(`<section class="view intro">
    <div class="forest-bg"></div>${ambientLayer(10)}
    <div class="intro-card panel">
      <h1 class="intro-title">${esc(settings.siteTitle)}</h1>
      <p class="intro-sub">${esc(CONFIG.introSub)}</p>
      <button class="btn honey" id="enterBtn" style="font-size:1.25rem;min-height:56px;padding:6px 30px">${esc(CONFIG.enterLabel)}</button>
    </div>
    <div class="intro-cast">
      <div style="position:relative">${girlImg("idle")}</div>
      <button class="jm-wrap" style="border:0;background:none;padding:0;position:relative" aria-label="سلّمي على ${CONFIG.companionName}">${ART.jaamous("idle")}<span class="bubble" style="bottom:100%;left:0;width:max-content;max-width:min(230px,58vw)">${esc(settings.welcome)}</span></button>
    </div>
  </section>`);
  root.appendChild(v);
  const jm = $(".jm-wrap", v), girl = $(".girl", v);
  setTimeout(()=>react(jm,"wave"), 700);
  jm.onclick = () => { react(jm,"hop"); Sound.soft(); };
  girl.onclick = () => { react(girl,"jump"); Sound.soft(); };
  $("#enterBtn").onclick = () => {
    Sound.chime();
    const fin = () => { go("map"); if(!Store.get("toured", false)) setTimeout(tour, 350); };
    if(motionOK()){ v.classList.add("leaving"); setTimeout(fin, 420); } else fin();
  };
  let mv;
  if(finePointer && motionOK()){ mv = e => { const dx=(e.clientX/innerWidth-.5), dy=(e.clientY/innerHeight-.5); girl.style.transform=`translate(${dx*10}px,${dy*6}px) rotate(${dx*3}deg)`; }; window.addEventListener("pointermove", mv); }
  return () => { mv && window.removeEventListener("pointermove", mv); };
}

/* ============ TOUR ============ */
function tour(){
  const steps = [
    {t:"أهلاً بغابتنا", b:`أنا ${CONFIG.companionName}، رفيق ${heroName()}. خلّيني أوريج الطريق بسرعة.`, s:"happy"},
    {t:"الخريطة", b:"كل مكان بالخريطة يفتح عالم صغير. اضغطي عليه ونمشي سوا. على الموبايل اسحبي الخريطة يمين ويسار، أو افتحي «كل الأماكن».", s:"idle"},
    {t:"الألعاب والنجوم", b:"ست ألعاب هادئة بالساحة والجسر والبحيرة. كل فوز يعطي نجوم صداقة تفتح ألوان وملصقات وسر بالكهف.", s:"think"},
    {t:"الرسم والمذكرات", b:"مرسم الفطر للرسم والحفظ، وبيت الشجرة للمذكرات. المذكرات تبقى على هذا الجهاز فقط.", s:"happy"}
  ];
  let i=0;
  const md = modal(`<div data-tour></div>`, {onClose:()=>Store.set("toured", true)});
  const box = $("[data-tour]", md.el);
  const draw = () => {
    const st = steps[i];
    box.innerHTML = `<div class="tour-body">${jmHTML(st.s)}<div><h2>${esc(st.t)}</h2><p style="margin:0">${esc(st.b)}</p></div></div>
      <div class="row" style="align-items:center;justify-content:space-between"><div class="tour-dots">${steps.map((_,k)=>`<i class="${k===i?"on":""}"></i>`).join("")}</div>
      <div style="display:flex;gap:8px"><button class="btn ghost small" data-skip>${i===steps.length-1?"إغلاق":"تخطّي"}</button>${i<steps.length-1?'<button class="btn small" data-next>التالي</button>':'<button class="btn honey small" data-done>يلا نبدي</button>'}</div></div>`;
    $("[data-skip]",box).onclick = md.close;
    const n=$("[data-next]",box); if(n) n.onclick=()=>{i++;draw();};
    const d=$("[data-done]",box); if(d) d.onclick=md.close;
  };
  draw();
}

/* ============ MAP ============ */
function viewMap(root){
  const H = 56.25; // viewBox height for 16:9 at width 100
  const pts = PATH_ORDER.map(k=>[PLACES[k].x, PLACES[k].y*H/100]);
  const d = catmull(pts);
  const found = new Set(progress.secrets);
  const v = h(`<section class="view mapview">
    <div class="mapscroll"><div class="mapscene">
      <div class="forest-bg"></div>
      <svg class="map-path" viewBox="0 0 100 ${H}" preserveAspectRatio="none" aria-hidden="true"><path d="${d}"/></svg>
      ${SECRETS.map(s=>`<button class="secret ${found.has(s.id)?"found":""}" data-secret="${s.id}" style="left:${s.x}%;top:${s.y}%" aria-label="شي صغير مخبّى">${s.art()}</button>`).join("")}
      ${Object.entries(PLACES).map(([k,p])=>`<button class="spot" data-place="${k}" style="left:${p.x}%;top:${p.y}%" aria-label="${p.name}: ${p.sub}"><span class="ring"></span><span class="lm">${p.art()}</span><span class="tag">${p.name}</span></button>`).join("")}
      <button class="critter fly" data-critter="butterfly" style="left:46%;top:36%" aria-label="فراشة">${ART.butterfly()}</button>
      <button class="critter" data-critter="rabbit" style="left:55%;top:76%;width:46px" aria-label="أرنب">${ART.rabbit()}</button>
      <div class="hero-token" id="heroTok">${girlImg("idle")}</div>
      <button class="jm-token" id="jmTok" aria-label="${CONFIG.companionName}"><div class="jm-wrap">${ART.jaamous("idle")}</div></button>
      ${ambientLayer(6)}
    </div></div>
    <div class="map-hint panel" id="mapHint">${esc(CONFIG.mapHint)}</div>
    <div class="map-ui"><button class="btn ghost" id="allPlaces">${IC.list} كل الأماكن</button><button class="btn honey" id="mapSurprise">${IC.gift} فاجئيني</button></div>
  </section>`);
  root.appendChild(v);
  const scene=$(".mapscene",v), scroll=$(".mapscroll",v), path=$(".map-path path",v), tok=$("#heroTok",v), jt=$("#jmTok",v);
  // path lengths for each place
  const total = path.getTotalLength(); const lens = {};
  PATH_ORDER.forEach(k=>{ const tx=PLACES[k].x, ty=PLACES[k].y*H/100; let best=0,bd=1e9; for(let i=0;i<=400;i++){ const p=path.getPointAtLength(total*i/400); const dd=(p.x-tx)**2+(p.y-ty)**2; if(dd<bd){bd=dd;best=total*i/400;} } lens[k]=best; });
  let at = Store.get("mapAt", "square"); if(!PLACES[at]) at="square";
  const place = (x,y) => { tok.style.left=(x-4.2)+"%"; tok.style.top=(y+5)+"%"; jt.style.left=(x+4)+"%"; jt.style.top=(y+6)+"%"; };
  place(PLACES[at].x, PLACES[at].y);
  // center scroll on hero
  requestAnimationFrame(()=>{ scroll.scrollLeft = Math.max(0, scene.offsetWidth*PLACES[at].x/100 - scroll.clientWidth/2); });
  let walking=false;
  function walkTo(k, done){
    if(walking) return; if(!motionOK() || k===at){ at=k; Store.set("mapAt",k); place(PLACES[k].x,PLACES[k].y); done(); return; }
    walking=true; const a=lens[at], b=lens[k], t0=performance.now(), dur=Math.min(650, 250+Math.abs(b-a)*4);
    const img=$(".girl",tok); img.classList.remove("idle");
    const step = now => { const t=Math.min(1,(now-t0)/dur), e=t<.5?2*t*t:1-Math.pow(-2*t+2,2)/2; const p=path.getPointAtLength(a+(b-a)*e); place(p.x, p.y/H*100); img.style.transform=`translateY(${-Math.abs(Math.sin(t*Math.PI*4))*8}px)`; if(t<1) requestAnimationFrame(step); else { img.style.transform=""; img.classList.add("idle"); walking=false; at=k; Store.set("mapAt",k); done(); } };
    requestAnimationFrame(step);
  }
  function openPlace(k){
    const p = PLACES[k]; Sound.soft();
    walkTo(k, ()=>{ if(p.go) p.go(); else signboard(k); });
  }
  $$("[data-place]",v).forEach(b=>b.onclick=()=>openPlace(b.dataset.place));
  // secrets
  $$("[data-secret]",v).forEach(b=>b.onclick=()=>{
    const s = SECRETS.find(x=>x.id===b.dataset.secret); if(progress.secrets.includes(s.id)) return;
    progress.secrets.push(s.id); saveProgress(); b.classList.add("found"); b.classList.remove("hinting"); Sound.chime();
    const md = modal(`<div class="tour-body"><div style="width:90px;flex:none">${s.art()}</div><div><h3>لقيتي سر صغير!</h3><p style="margin:0">${esc(s.msg)}</p></div></div><p class="d-note">الأسرار المكتشفة: ${progress.secrets.length} من ${SECRETS.length}</p>`);
    addStars(1, "سر جديد");
  });
  // hint for secrets after a while
  const hintT = setTimeout(()=>{ const left = SECRETS.filter(s=>!progress.secrets.includes(s.id)); if(!left.length) return; const s=left[Math.floor(Math.random()*left.length)]; const el=$(`[data-secret="${s.id}"]`,v); el && el.classList.add("hinting"); $("#mapHint",v).textContent = "شي يلمع هناك… تلميح: "+s.hint; }, 45000);
  // micro interactions
  jt.onclick = e => { e.stopPropagation(); react($(".jm-wrap",jt),"wave"); Sound.soft(); };
  $$("[data-critter]",v).forEach(c=>c.onclick=e=>{ e.stopPropagation(); react(c,"hop"); Sound.chime(); toast(c.dataset.critter==="rabbit"?"الأرنب يقول: مرحبا!":"الفراشة رقصت إلج", "star"); });
  scene.addEventListener("click", e => {
    if(e.target.closest("button")) return;
    const r = scene.getBoundingClientRect(); const x=(e.clientX-r.left)/r.width*100, y=(e.clientY-r.top)/r.height*100;
    const kinds=[ART.butterfly("#E9A79E","#B9A6DD"), ART.flower(), ART.butterfly(), ART.leaf("#E8C066")];
    const pc = h(`<span class="pop-critter" style="left:${x}%;top:${y}%">${kinds[Math.floor(Math.random()*kinds.length)]}</span>`); scene.appendChild(pc); setTimeout(()=>pc.remove(),1500); Sound.pop();
    react($(".girl",tok),"jump");
  });
  // parallax + follow (desktop, motion ok)
  let mv;
  if(finePointer && motionOK()){
    const fg = h(`<div class="fg-leaves" aria-hidden="true"><span style="position:absolute;left:-2%;top:-4%;width:16%;transform:rotate(160deg)">${ART.leaf("#86A97C")}</span><span style="position:absolute;right:-3%;bottom:-6%;width:14%;transform:rotate(-20deg)">${ART.leaf("#9DBF8E")}</span></div>`);
    v.appendChild(fg);
    const bg=$(".forest-bg",scene), img=$(".girl",tok);
    mv = e => { const dx=e.clientX/innerWidth-.5, dy=e.clientY/innerHeight-.5; fg.style.transform=`translate(${-dx*18}px,${-dy*12}px)`; bg.style.transform=`translate(${dx*6}px,${dy*4}px) scale(1.02)`; if(!walking) img.style.transform=`rotate(${dx*4}deg) translateX(${dx*6}px)`; };
    window.addEventListener("pointermove", mv);
  }
  $("#allPlaces",v).onclick = placesSheet;
  $("#mapSurprise",v).onclick = surprise;
  return () => { clearTimeout(hintT); mv && window.removeEventListener("pointermove", mv); };
}
function openActivity(g){ const a=GAMES[g]; if(!a) return; if(a.route) go(a.route); else go("game:"+g); }
function signboard(k){
  const p = PLACES[k];
  const md = modal(`<h2>${esc(p.name)}</h2><p style="margin:0">اختاري عالم:</p><div class="sign-opts">${p.games.map(g=>`<button class="sign-opt" data-g="${g}">${GAMES[g].icon()}<span><b>${esc(GAMES[g].title)}</b><small>${esc(GAMES[g].how)}</small>${progress.best[g]!=null&&GAMES[g].best?`<small style="display:block;font-weight:700">${esc(GAMES[g].best(progress.best[g]))}</small>`:""}</span></button>`).join("")}</div>`, {cls:"signboard"});
  $$("[data-g]",md.el).forEach(b=>b.onclick=()=>{ md.close(); openActivity(b.dataset.g); });
}
function placesSheet(){
  const order = CONFIG.gameOrder.filter(g=>GAMES[g]).concat(["jokes"]);
  const sm = s => s.replace("<svg","<svg width='34' height='34'");
  const md = modal(`<h2>كل الأماكن</h2><div class="places-list">
    <button class="btn ghost" data-r="diary">${sm(ART.treehouse())} بيت الشجرة — دفتر المذكرات</button>
    <button class="btn ghost" data-r="paint">${sm(ART.studio())} مرسم الفطر — الرسم</button>
    ${order.map(g=>`<button class="btn ghost" data-a="${g}">${sm(GAMES[g].icon())} ${esc(GAMES[g].title)} — ${esc(PLACES[GAMES[g].place].name)}</button>`).join("")}
    <button class="btn ghost" data-r="cave">${sm(ART.cave())} الكهف المضيء — أسرار وتحديات</button>
  </div>`);
  $$("[data-r]",md.el).forEach(b=>b.onclick=()=>{ md.close(); go(b.dataset.r); });
  $$("[data-a]",md.el).forEach(b=>b.onclick=()=>{ md.close(); openActivity(b.dataset.a); });
}
function surprise(){
  Sound.chime();
  if(Math.random()<.6){ const order=CONFIG.gameOrder.filter(g=>GAMES[g]); const g=order.concat(["jokes"])[Math.floor(Math.random()*(order.length+1))]; toast(`${CONFIG.companionName} اختار: ${GAMES[g].title}`, "gift"); setTimeout(()=>openActivity(g), 500); }
  else { const n=CONFIG.sweetNotes[Math.floor(Math.random()*CONFIG.sweetNotes.length)]; modal(`<div class="tour-body">${jmHTML("happy","wave")}<div><h3>مفاجأة صغيرة</h3><p style="margin:0">${esc(n)}</p></div></div>`); }
}
$("#surpriseBtn").onclick = surprise;

/* ============ GAME SHELL ============ */
const oneLiner = () => { const j = CONFIG.jokes[1+Math.floor(Math.random()*(CONFIG.jokes.length-1))]; return j.s+" "+j.p; };
function viewGame(root, id){
  const g = GAMES[id]; if(!g || g.route){ go("map"); return; }
  const worlds = {memory:"w-lake", story:"w-story", fireflies:"w-dusk", road:"w-meadow", logic:"w-bridge", bubbles:"w-sky", basket:"w-orchard", dance:"w-party", madlibs:"w-story"};
  const casts = {
    memory:[girlImg("idle"), jmHTML("think")], story:[girlImg("idle"), jmHTML("idle")],
    fireflies:[girlImg("idle"), jmHTML("think")], road:[girlImg("idle"), sumoHTML()],
    logic:[girlImg("idle"), jmHTML("think")], bubbles:[girlImg("idle"), sumoHTML("happy")],
    basket:[girlImg("idle"), jmHTML("happy")], dance:[girlImg("idle"), jmHTML("happy")], madlibs:[girlImg("idle"), sumoHTML("happy")]
  };
  const v = h(`<section class="view"><div class="world ${worlds[id]}">
    <div class="world-deco" aria-hidden="true">${decoFor(id)}</div>
    <div class="world-inner">
      <div class="world-head panel"><div><h2>${esc(g.title)}</h2><p>${esc(g.how)}</p></div>
        <div class="wh-side"><span class="chip" data-stat></span><span class="chip" data-best ${progress.best[id]==null?"hidden":""}>${IC.star}<span>${progress.best[id]!=null?esc(g.best(progress.best[id])):""}</span></span><button class="btn ghost small" data-restart>${IC.restart} إعادة</button></div>
      </div>
      <div data-body></div>
      <div class="world-cast"><div class="cast-r">${casts[id][0]}</div><div class="cast-l">${casts[id][1]}</div></div>
    </div></div></section>`);
  root.appendChild(v);
  const castR=$(".cast-r .girl",v), castL=$(".cast-l>div",v);
  let sayT;
  const sh = {
    body: $("[data-body]",v), root:v,
    stat: html => { $("[data-stat]",v).innerHTML = html; },
    setBest: txt => { const b=$("[data-best]",v); if(txt==null){ b.hidden=true; return; } b.hidden=false; $("span",b).textContent=txt; },
    onRestart: fn => { $("[data-restart]",v).onclick = fn; },
    cheer: () => { react(castR,"happy"); castL && react(castL,"hop"); },
    think: on => { castL && castL.classList.toggle("think", on); },
    say: (text, side="l") => { const host=$(side==="l"?".cast-l":".cast-r",v); $$(".say",v).forEach(x=>x.remove()); const b=h(`<span class="say">${esc(text)}</span>`); host.appendChild(b); clearTimeout(sayT); sayT=setTimeout(()=>b.remove(), 3600); },
    quiet: (value, better, bestKey=id) => { recordBest(bestKey, value, better); progress.wins[id]=(progress.wins[id]||0)+1; saveProgress(); if(bestKey===id) sh.setBest(g.best(progress.best[id])); },
    win: (value, better, line, rating=3, bestKey=id, bestTxt) => {
      const newBest = recordBest(bestKey, value, better);
      const first = !progress.wins[id]; progress.wins[id]=(progress.wins[id]||0)+1; saveProgress();
      const n = CONFIG.starsPerWin + (first?CONFIG.firstWinBonus:0) + (rating>=3?1:0);
      sh.setBest(bestTxt || g.best(progress.best[bestKey]));
      Sound.win(); confetti(); react(castR,"happy");
      setTimeout(()=>{
        const md = modal(`<div class="win-head">${rateStars(rating)}</div><div class="tour-body"><div style="width:110px;flex:none">${pick([ART.jaamous("happy"), ART.sumo("happy")])}</div><div><h2>${pick(["أحسنتِ يا "+heroName()+"!","عاشت إيدج!","يا سلام عليج!"])}</h2><p style="margin:0">${esc(line)}</p>${newBest?'<p style="margin:4px 0 0;font-weight:700">رقم قياسي جديد</p>':""}<p style="margin:4px 0 0">${IC.star.replace("<svg","<svg width='20' height='20' style='vertical-align:-4px'")} +${n} نجوم صداقة${first?" (أول فوز)":""}</p></div></div>
          <p class="win-joke"><b>نكتة الجائزة:</b> ${esc(oneLiner())}</p>
          <div class="row"><button class="btn honey" data-again>${IC.restart} العبي مرة ثانية</button><button class="btn ghost" data-map>رجوع للخريطة</button></div>`);
        $("[data-again]",md.el).onclick=()=>{ md.close(); sh.restart && sh.restart(); };
        $("[data-map]",md.el).onclick=()=>{ md.close(); go("map"); };
      }, 650);
      addStars(n);
    }
  };
  const fn = {memory:gMemory, story:gStory, fireflies:gFireflies, road:gRoad, logic:gLogic, bubbles:gBubbles, basket:gBasket, dance:gDance, madlibs:gMadlibs}[id];
  const c = fn(sh);
  return () => { clearTimeout(sayT); c && c(); };
}
function decoFor(id){
  const r=(a,b)=>a+Math.random()*(b-a);
  if(id==="memory") return Array.from({length:7},(_,i)=>`<span style="position:absolute;left:${r(0,92)}%;top:${r(50,95)}%;width:${r(50,90)}px;opacity:.55">${ART.leaf(i%2?"#9DBF8E":"#88AC7E")}</span>`).join("");
  if(id==="story"||id==="logic"||id==="madlibs") return Array.from({length:5},()=>`<span style="position:absolute;left:${r(0,90)}%;top:${r(2,30)}%;width:${r(80,140)}px;opacity:.7">${ART.cloud()}</span>`).join("");
  if(id==="fireflies") return Array.from({length:18},()=>`<span class="ffly" style="left:${r(0,100)}%;top:${r(0,100)}%"></span>`).join("");
  if(id==="road") return Array.from({length:6},()=>`<span style="position:absolute;left:${r(0,95)}%;top:${r(75,96)}%;width:${r(30,46)}px">${ART.flower()}</span>`).join("");
  if(id==="bubbles") return Array.from({length:4},()=>`<span style="position:absolute;left:${r(0,90)}%;top:${r(4,40)}%;width:${r(90,150)}px;opacity:.8">${ART.cloud()}</span>`).join("");
  if(id==="basket") return Array.from({length:6},()=>`<span style="position:absolute;left:${r(0,95)}%;top:${r(55,95)}%;width:${r(26,40)}px;opacity:.7">${ART.apricot()}</span>`).join("");
  if(id==="dance") return [0,1,2,3,4,5,6,7].map(i=>`<span style="position:absolute;left:${4+i*12.5}%;top:2%;width:28px;height:36px;background:${["#E9A79E","#E8C066","#8EC3CF","#B9A6DD","#9DBF8E"][i%5]};clip-path:polygon(0 0,100% 0,50% 100%)"></span>`).join("");
  return "";
}
function canvasStage(stage, draw){
  const cv=$("canvas",stage), ctx=cv.getContext("2d"); const S={cv,ctx,W:0,H:0};
  const size=()=>{ const r=stage.getBoundingClientRect(); const d=Math.min(2,window.devicePixelRatio||1); S.W=r.width; S.H=r.height; cv.width=Math.round(r.width*d); cv.height=Math.round(r.height*d); ctx.setTransform(d,0,0,d,0,0); draw && draw(); };
  const ro=new ResizeObserver(size); ro.observe(stage); S.stop=()=>ro.disconnect(); S.size=size; return S;
}
const imgReady = list => Promise.all(list.map(im=>im.complete&&im.naturalWidth?1:new Promise(r=>{im.onload=r;im.onerror=r;})));
function floatText(stage, x, y, text, color="#3D3A2E"){ const f=h(`<span class="floaty" style="left:${x}px;top:${y}px;color:${color}">${esc(text)}</span>`); stage.appendChild(f); setTimeout(()=>f.remove(), 1000); }

/* ---------- memory ---------- */
function gMemory(sh){
  const pool = [["leaf",ART.leaf()],["flower",ART.flower()],["acorn",ART.acorn()],["mushroom",ART.mushroom()],["butterfly",ART.butterfly()],["firefly",ART.firefly()],["snail",ART.snail()],["jaamous",ART.jmFace()],["frog",ART.frog()],["bird",ART.bird()],["apricot",ART.apricot()],["sumo",ART.sumo()]];
  let pairs = +(Store.get("memLevel",6)), moves=0, matched=0, first=null, lock=true, streak=0, t0=0, tick=null;
  const levels=[[6,"سهل"],[8,"متوسط"],[10,"صعب"]];
  sh.body.innerHTML = `<div style="display:grid;gap:12px;justify-items:center"><div class="seg" role="group" aria-label="المستوى">${levels.map(([n,l])=>`<button data-n="${n}" aria-pressed="${n===pairs}">${l}</button>`).join("")}</div><div class="mem-grid"></div></div>`;
  const grid = $(".mem-grid", sh.body);
  $$(".seg button", sh.body).forEach(b=>b.onclick=()=>{ pairs=+b.dataset.n; Store.set("memLevel",pairs); $$(".seg button",sh.body).forEach(x=>x.setAttribute("aria-pressed", x===b)); start(); });
  const secs = () => t0 ? Math.floor((Date.now()-t0)/1000) : 0;
  const upd = () => sh.stat(`المحاولات: ${moves} — الأزواج: ${matched}/${pairs} — ${secs()} ث`);
  const bestKey = () => "memory"+pairs;
  function start(){
    clearInterval(tick); moves=0; matched=0; first=null; lock=true; streak=0; t0=0; upd();
    const b=progress.best[bestKey()]; sh.setBest(b!=null?`أقل محاولات (${levels.find(l=>l[0]===pairs)[1]}): ${b}`:null);
    const pick2 = shuffle(pool).slice(0,pairs); const deck = shuffle(pick2.concat(pick2));
    grid.className = "mem-grid g"+pairs;
    grid.innerHTML = deck.map(([k,svg],i)=>`<button class="mcard open" data-k="${k}" aria-label="ورقة ${i+1}"><span class="in"><span class="fc back">${ART.leaf("#B7CF8F")}</span><span class="fc face">${svg}</span></span></button>`).join("");
    $$(".mcard",grid).forEach(c=>c.onclick=()=>flip(c));
    sh.say("ركّزي… عندج ثانيتين!");
    setTimeout(()=>{ $$(".mcard",grid).forEach(c=>c.classList.remove("open")); lock=false; }, 2000);
  }
  function flip(c){
    if(lock || c.classList.contains("open") || c.classList.contains("done")) return;
    if(!t0){ t0=Date.now(); tick=setInterval(upd,1000); }
    c.classList.add("open"); Sound.flip();
    if(!first){ first=c; return; }
    moves++; upd();
    if(first.dataset.k===c.dataset.k){
      [first,c].forEach(x=>{ x.classList.add("done"); x.classList.remove("open"); });
      first=null; matched++; streak++; Sound.chime(); sh.cheer(); upd();
      if(streak===2) sh.say("ضربتين ورا بعض! منو علّمج؟"); else if(streak===3) sh.say("ثلاثة! هاي ذاكرة لو كاميرا؟");
      if(matched===pairs){ clearInterval(tick); const rating = moves<=pairs*1.4?3:moves<=pairs*2?2:1; sh.win(moves,(a,b)=>a<b, `طابقتي ${pairs} أزواج بـ ${moves} محاولة و${secs()} ثانية.`, rating, bestKey(), `أقل محاولات (${levels.find(l=>l[0]===pairs)[1]}): ${Math.min(moves, progress.best[bestKey()]??moves)}`); }
    } else {
      streak=0; lock=true; const a=first; first=null;
      if(Math.random()<.25) sh.say(pick(["مو هاي… بس قريبة!","جعموص هم نسى وين حطها","الورقة تستحي، جربي غيرها"]));
      setTimeout(()=>{ a.classList.remove("open"); c.classList.remove("open"); lock=false; }, 800);
    }
  }
  sh.restart = start; sh.onRestart(start); start();
  return () => clearInterval(tick);
}
/* ---------- fireflies: name constellation ---------- */
function gFireflies(sh){
  sh.body.innerHTML = `<div style="display:grid;gap:10px"><div class="stage ff-stage"><canvas></canvas>
    <div class="stage-ov dusk-ov" data-ov><div class="panel"><h3>سماء اليراعات</h3><p>اليراعات تطير وتطفي بعد كم ثانية. كل وحدة تصيدينها تطير للسما وتضوّي نقطة من سرّ مخبّى بين النجوم.<br>الذهبية تضوّي نقطتين، والنعسانة بطيئة… بس تهرب فجأة.</p><button class="btn honey" data-go>يلا نصيد</button></div></div></div>
    <div class="ff-bar"><div class="ff-prog"><i data-prog></i></div><span class="chip" data-combo>صيد متتالي: 0</span></div></div>`;
  const stage=$(".stage",sh.body), ov=$("[data-ov]",sh.body), prog=$("[data-prog]",sh.body);
  const forest = loadImg("forest", FOREST);
  let pts=[], flies=[], travelers=[], lit=0, misses=0, spawnT=0, raf=0, last=0, running=false, finale=0, combo=0, lastCatch=0, bestCombo=0, ended=false, floats=[];
  const S = canvasStage(stage, ()=>{ if(!running) draw(performance.now()); });
  function sample(){
    const W=600, H=Math.round(600*((S.H&&S.W)?S.H/S.W:.625)), oc=document.createElement("canvas"); oc.width=W; oc.height=H; const o=oc.getContext("2d");
    const name = heroName(); let fs=150; o.font=`800 ${fs}px "Baloo Bhaijaan 2", Almarai, sans-serif`;
    while(o.measureText(name).width > W*.82 && fs>40){ fs-=8; o.font=`800 ${fs}px "Baloo Bhaijaan 2", Almarai, sans-serif`; }
    o.direction="rtl"; o.textAlign="center"; o.textBaseline="middle"; o.fillStyle="#000"; o.fillText(name, W/2, H*(H>W?.34:.38));
    const d=o.getImageData(0,0,W,H).data, out=[], step=9;
    for(let y=0;y<H;y+=step) for(let x=0;x<W;x+=step){ if(d[(y*W+x)*4+3]>140) out.push([x/W, y/H]); }
    let p=out; const MAX=44; if(p.length>MAX){ const k=p.length/MAX; p=Array.from({length:MAX},(_,i)=>out[Math.floor(i*k)]); }
    p.sort((a,b)=>b[0]-a[0]); // تضوّي من اليمين لليسار
    pts = p.map(([x,y])=>({x,y,on:false,tw:Math.random()*6}));
  }
  function reset(){ flies=[]; travelers=[]; lit=0; misses=0; spawnT=0; finale=0; combo=0; bestCombo=0; ended=false; floats=[]; sample(); upd(); }
  function upd(){ sh.stat(`ضوّت ${lit} من ${pts.length} — هربت ${misses}`); prog.style.width=(pts.length?lit/pts.length*100:0)+"%"; $("[data-combo]",sh.body).textContent=`صيد متتالي: ${combo}`; }
  function spawn(){
    const W=S.W,H=S.H, r=Math.random(), type = r<.13?"gold":r<.28?"sleepy":"norm";
    const sx = Math.random()<.5 ? (Math.random()<.5?-10:W+10) : Math.random()*W, sy = sx<0||sx>W ? H*(.35+Math.random()*.55) : H+10;
    const sp = (type==="sleepy"?.06:.11+Math.random()*.06)*Math.min(W,700);
    const a = Math.atan2(H*.55-sy, W/2-sx)+(Math.random()-.5);
    flies.push({x:sx,y:sy,vx:Math.cos(a)*sp,vy:Math.sin(a)*sp,sp,age:0,life:type==="sleepy"?7.5:5.5+Math.random()*2,type,ph:Math.random()*6,dart:0});
  }
  function catchAt(px,py){
    if(!running) return;
    const R=Math.max(34, S.W*.05); let best=null, bd=R;
    flies.forEach(f=>{ const d=Math.hypot(f.x-px,f.y-py); if(d<bd){ bd=d; best=f; } });
    if(!best){ combo=0; upd(); return; }
    flies.splice(flies.indexOf(best),1);
    const now=performance.now(); combo = now-lastCatch<1600 ? combo+1 : 1; lastCatch=now; bestCombo=Math.max(bestCombo,combo);
    const n = best.type==="gold"?2:1; Sound.chime();
    for(let i=0;i<n;i++){ const t=pts.find(p=>!p.on && !p.claimed); if(!t) break; t.claimed=true; travelers.push({x:best.x,y:best.y,sx:best.x,sy:best.y,t:0,p:t}); }
    floats.push({x:best.x,y:best.y,txt: best.type==="gold"?"ذهبية! +2": combo>=3?`${combo} ورا بعض!`:"+1", a:1});
    if(combo===4) sh.say("جعموص: إيدج أسرع من البرق!"); if(best.type==="sleepy" && Math.random()<.5) sh.say("النعسانة صحت بالسلّة… وتريد ترجع تنام");
    upd();
  }
  function draw(now){
    const {ctx,W,H}=S; if(!W) return; const t=now/1000;
    ctx.fillStyle="#1F2840"; ctx.fillRect(0,0,W,H);
    if(forest.complete && forest.naturalWidth){ const ir=forest.naturalWidth/forest.naturalHeight, cr=W/H; let sw,shh,sx,sy; if(ir>cr){ shh=forest.naturalHeight; sw=shh*cr; sx=(forest.naturalWidth-sw)/2; sy=0; } else { sw=forest.naturalWidth; shh=sw/cr; sx=0; sy=(forest.naturalHeight-shh)/2; } ctx.globalAlpha=.55; ctx.drawImage(forest,sx,sy,sw,shh,0,0,W,H); ctx.globalAlpha=1; }
    const g=ctx.createLinearGradient(0,0,0,H); g.addColorStop(0,"rgba(22,26,60,.78)"); g.addColorStop(.55,"rgba(30,36,70,.5)"); g.addColorStop(1,"rgba(20,30,40,.55)"); ctx.fillStyle=g; ctx.fillRect(0,0,W,H);
    // constellation
    if(finale>0){ ctx.strokeStyle=`rgba(255,236,170,${Math.min(.5,finale*.4)})`; ctx.lineWidth=1.2; ctx.beginPath(); pts.forEach((p,i)=>{ let nb=null,nd=1e9; pts.forEach((q,j)=>{ if(j<=i) return; const d=Math.hypot((p.x-q.x)*W,(p.y-q.y)*H); if(d<nd){nd=d;nb=q;} }); if(nb && nd<W*.06){ ctx.moveTo(p.x*W,p.y*H); ctx.lineTo(nb.x*W,nb.y*H); } }); ctx.stroke(); }
    pts.forEach(p=>{ const x=p.x*W, y=p.y*H; if(!p.on){ ctx.fillStyle="rgba(255,255,255,.07)"; ctx.beginPath(); ctx.arc(x,y,1.6,0,7); ctx.fill(); return; } const tw=.7+.3*Math.sin(t*2.4+p.tw)+(finale>0?.4:0); const r=5+tw*3; const rg=ctx.createRadialGradient(x,y,0,x,y,r*2.4); rg.addColorStop(0,`rgba(255,248,210,${.95})`); rg.addColorStop(.3,`rgba(255,226,130,${.6*tw})`); rg.addColorStop(1,"rgba(255,226,130,0)"); ctx.fillStyle=rg; ctx.beginPath(); ctx.arc(x,y,r*2.4,0,7); ctx.fill(); });
    // fireflies
    flies.forEach(f=>{ const fade = Math.min(1, f.age/.5, (f.life-f.age)/1); const pulse=.55+.45*Math.sin(t*(f.type==="sleepy"?1.6:4)+f.ph); const a=Math.max(0,fade)*pulse; const col=f.type==="gold"?"255,205,90":"255,236,150"; const r=f.type==="gold"?11:8; const rg=ctx.createRadialGradient(f.x,f.y,0,f.x,f.y,r*3); rg.addColorStop(0,`rgba(255,252,225,${a})`); rg.addColorStop(.25,`rgba(${col},${a*.75})`); rg.addColorStop(1,`rgba(${col},0)`); ctx.fillStyle=rg; ctx.beginPath(); ctx.arc(f.x,f.y,r*3,0,7); ctx.fill(); ctx.fillStyle=`rgba(70,64,90,${Math.max(0,fade)*.9})`; ctx.beginPath(); ctx.ellipse(f.x,f.y-r*.5,r*.35,r*.45,0,0,7); ctx.fill(); if(f.type==="sleepy"){ ctx.fillStyle=`rgba(230,230,255,${fade*.8})`; ctx.font="bold 12px sans-serif"; ctx.fillText("z", f.x+10, f.y-12-Math.sin(t*2)*3); } });
    travelers.forEach(tr=>{ ctx.fillStyle="rgba(255,240,180,.95)"; ctx.beginPath(); ctx.arc(tr.x,tr.y,4,0,7); ctx.fill(); ctx.strokeStyle="rgba(255,226,130,.35)"; ctx.lineWidth=3; ctx.beginPath(); ctx.moveTo(tr.x,tr.y); ctx.lineTo(tr.x-(tr.x-tr.sx)*.15, tr.y-(tr.y-tr.sy)*.15); ctx.stroke(); });
    floats.forEach(f=>{ ctx.globalAlpha=Math.max(0,f.a); ctx.fillStyle="#FFF2C8"; ctx.font=`800 ${Math.max(14,W*.022)}px "Baloo Bhaijaan 2", Almarai, sans-serif`; ctx.textAlign="center"; ctx.fillText(f.txt, f.x, f.y-20); ctx.globalAlpha=1; });
    if(finale>.6){ ctx.globalAlpha=Math.min(1,(finale-.6)*1.5); ctx.fillStyle="#FFF2C8"; ctx.textAlign="center"; ctx.font=`800 ${Math.max(18,W*.034)}px "Baloo Bhaijaan 2", Almarai, sans-serif`; ctx.fillText(`${heroName()} ضوّت سما الغابة`, W/2, H*.78); ctx.globalAlpha=1; }
  }
  function loop(now){
    raf=requestAnimationFrame(loop); const dt=Math.min(.05,(now-last)/1000); last=now; const W=S.W,H=S.H;
    if(!finale){
      const want = Math.min(7, 3+Math.floor(lit/10)); spawnT-=dt; if(flies.length<want && spawnT<=0){ spawn(); spawnT=.55+Math.random()*.5; }
      flies.forEach(f=>{ f.age+=dt; const wob=Math.sin(now/600+f.ph)*.9; const ang=Math.atan2(f.vy,f.vx)+wob*dt*2.2; let sp=f.sp; if(f.type==="sleepy" && f.age>f.life-1.4){ sp*=4.5; } f.vx=Math.cos(ang)*sp; f.vy=Math.sin(ang)*sp; f.x+=f.vx*dt; f.y+=f.vy*dt; if(f.x<20&&f.vx<0||f.x>W-20&&f.vx>0) f.vx*=-1; if(f.y<H*.12&&f.vy<0||f.y>H-16&&f.vy>0) f.vy*=-1; });
      const gone = flies.filter(f=>f.age>=f.life); if(gone.length){ misses+=gone.length; combo=0; flies=flies.filter(f=>f.age<f.life); upd(); }
    }
    travelers.forEach(tr=>{ tr.t=Math.min(1,tr.t+dt/.9); const e=1-Math.pow(1-tr.t,3); const tx=tr.p.x*W, ty=tr.p.y*H; tr.x=tr.sx+(tx-tr.sx)*e; tr.y=tr.sy+(ty-tr.sy)*e - Math.sin(tr.t*Math.PI)*H*.08; if(tr.t>=1 && !tr.p.on){ tr.p.on=true; lit++; upd(); } });
    travelers=travelers.filter(tr=>tr.t<1);
    floats.forEach(f=>{ f.a-=dt*1.2; f.y-=dt*30; }); floats=floats.filter(f=>f.a>0);
    if(!finale && lit>=pts.length && pts.length){ finale=.01; flies=[]; Sound.win(); sh.cheer(); sh.think(false); }
    if(finale){ finale+=dt; if(finale>2.6 && !ended){ ended=true; running=false; const rating = misses<=4?3:misses<=10?2:1; draw(now); cancelAnimationFrame(raf); sh.win(misses,(a,b)=>a<b, `ضوّيتي اسمج بالسما وهربت ${misses} يراعة بس. أطول صيد متتالي: ${bestCombo}.`, rating); return; } }
    draw(now);
  }
  function begin(){ reset(); ov.hidden=true; running=true; last=performance.now(); cancelAnimationFrame(raf); raf=requestAnimationFrame(loop); sh.think(true); }
  stage.addEventListener("pointerdown", e=>{ if(e.target.closest("button")) return; const r=stage.getBoundingClientRect(); catchAt(e.clientX-r.left, e.clientY-r.top); });
  $("[data-go]",sh.body).onclick=begin;
  const vis=()=>{ if(document.hidden){ cancelAnimationFrame(raf); } else if(running){ last=performance.now(); raf=requestAnimationFrame(loop); } };
  document.addEventListener("visibilitychange",vis);
  const ready = (document.fonts && document.fonts.ready) ? Promise.race([document.fonts.ready, new Promise(r=>setTimeout(r,1200))]) : Promise.resolve();
  ready.then(()=>{ reset(); draw(performance.now()); });
  sh.restart=()=>{ cancelAnimationFrame(raf); running=false; ov.hidden=false; reset(); draw(performance.now()); };
  sh.onRestart(sh.restart);
  return ()=>{ cancelAnimationFrame(raf); S.stop(); document.removeEventListener("visibilitychange",vis); };
}
/* ---------- Sumo basket ---------- */
function gBasket(sh){
  sh.body.innerHTML = `<div style="display:grid;gap:10px"><div class="stage bk-stage"><canvas></canvas>
    <div class="stage-ov" data-ov><div class="panel"><h3>سلّة سومو</h3><p>اسحبي إصبعج يمين ويسار (أو الأسهم) وخلّي سومو يلزم المشمش.<br>الذهبية بيها نكتة، والورق ما يضر… بس النعال يدوّخ سومو.</p><button class="btn honey" data-go>يلا نلزم</button></div></div></div>
    <div class="pad"><button class="btn ghost" data-l aria-label="يمين">${IC.right}</button><button class="btn ghost small" data-pause aria-label="إيقاف مؤقت">${IC.pause}</button><button class="btn ghost" data-r aria-label="يسار">${IC.left}</button></div>
    <div data-jokes></div></div>`;
  const stage=$(".stage",sh.body), ov=$("[data-ov]",sh.body);
  const im = {sumo:loadImg("bk_sumo",svgURL(ART.sumo())), sumoH:loadImg("bk_sumoh",svgURL(ART.sumo("happy"))), basket:loadImg("bk_bas",svgURL(ART.basket())), apr:loadImg("bk_apr",svgURL(ART.apricot())), gold:loadImg("bk_gold",svgURL(ART.apricot(true))), leaf:loadImg("bk_leaf",svgURL(ART.leaf("#B7CF8F"))), slip:loadImg("bk_slip",svgURL(ART.slipper())), tree:loadImg("bk_tree",svgURL(ART.apricotTree()))};
  const TOTAL=48;
  let x=.5, tx=.5, items=[], spawned=0, score=0, caught=0, golds=[], dizzy=0, happy=0, raf=0, last=0, running=false, paused=false, spawnT=0, floats=[], keys={}, streak=0;
  const S=canvasStage(stage, ()=>{ if(!running) draw(performance.now()); });
  const upd=()=>sh.stat(`النقاط: ${score} — المشمش: ${caught} — ذهبية: ${golds.length}`);
  function reset(){ x=tx=.5; items=[]; spawned=0; score=0; caught=0; golds=[]; dizzy=0; happy=0; floats=[]; streak=0; $("[data-jokes]",sh.body).innerHTML=""; upd(); }
  function spawn(){ const r=Math.random(); const k = r<.1?"gold": r<.25?"slip": r<.4?"leaf":"apr"; items.push({k, x:.08+Math.random()*.84, y:-.08, vy:(.18+spawned/TOTAL*.14)*(k==="leaf"?.6:1), rot:Math.random()*6, vr:(Math.random()-.5)*3, sw:Math.random()*6}); spawned++; }
  function draw(now){
    const {ctx,W,H}=S; if(!W) return; const t=now/1000;
    const g=ctx.createLinearGradient(0,0,0,H); g.addColorStop(0,"#DCEEF2"); g.addColorStop(.6,"#EFF3D8"); g.addColorStop(1,"#C9DCA4"); ctx.fillStyle=g; ctx.fillRect(0,0,W,H);
    // canopy
    ctx.fillStyle="#9DBF8E"; ctx.strokeStyle="#4E6A46"; ctx.lineWidth=3;
    for(let i=0;i<7;i++){ const cx=W*(i/6), cy=H*.02+Math.sin(i*1.7)*H*.03; ctx.beginPath(); ctx.ellipse(cx,cy,W*.13,H*.11,0,0,7); ctx.fill(); ctx.stroke(); }
    for(let i=0;i<7;i++){ const cx=W*(i/6), cy=H*.02+Math.sin(i*1.7)*H*.03; ctx.beginPath(); ctx.ellipse(cx,cy,W*.125,H*.1,0,0,7); ctx.fill(); }
    for(let i=0;i<9;i++){ ctx.drawImage(im.apr, W*(i/8)-10, H*.06+Math.sin(i*2.3)*H*.03, 22,22); }
    // ground
    ctx.fillStyle="#B3CE96"; ctx.beginPath(); ctx.ellipse(W/2,H*1.02,W*.8,H*.12,0,0,7); ctx.fill();
    const s=Math.min(W,H)*.1;
    items.forEach(it=>{ const px=it.x*W+Math.sin(t*2+it.sw)*(it.k==="leaf"?18:3), py=it.y*H; ctx.save(); ctx.translate(px,py); ctx.rotate(it.k==="apr"||it.k==="gold"?Math.sin(t*3+it.sw)*.2:it.rot); const w=it.k==="slip"?s*1.3:s; const hh=it.k==="slip"?s*.75:s; if(it.k==="gold"){ ctx.shadowColor="rgba(255,220,120,.9)"; ctx.shadowBlur=14; } ctx.drawImage(im[it.k], -w/2,-hh/2,w,hh); ctx.restore(); });
    // sumo + basket
    const sw=Math.min(W,H)*.26, shh=sw*1.1, sx=x*W, sy=H-shh*.98;
    ctx.fillStyle="rgba(60,50,30,.18)"; ctx.beginPath(); ctx.ellipse(sx,H-6,sw*.35,6,0,0,7); ctx.fill();
    ctx.save(); ctx.translate(sx,sy+shh/2); if(dizzy>0) ctx.rotate(Math.sin(t*14)*.12); ctx.drawImage(happy>0?im.sumoH:im.sumo,-sw/2,-shh/2,sw,shh); ctx.restore();
    const bw=sw*1.05, bh=bw*.5; ctx.drawImage(im.basket, sx-bw/2, sy+shh*.5, bw, bh);
    if(dizzy>0){ for(let i=0;i<3;i++){ const a=t*5+i*2.1; ctx.drawImage(im.gold, sx+Math.cos(a)*sw*.35-8, sy+Math.sin(a)*8-6, 16,16); } }
    floats.forEach(f=>{ ctx.globalAlpha=Math.max(0,f.a); ctx.fillStyle=f.c; ctx.textAlign="center"; ctx.font=`800 ${Math.max(15,W*.03)}px "Baloo Bhaijaan 2", Almarai, sans-serif`; ctx.fillText(f.txt,f.x,f.y); ctx.globalAlpha=1; });
    // progress
    ctx.fillStyle="rgba(122,90,58,.25)"; ctx.fillRect(W*.1,H-12,W*.8,5); ctx.fillStyle="#E8C066"; ctx.fillRect(W*.1,H-12,W*.8*Math.min(1,spawned/TOTAL),5);
  }
  function loop(now){
    raf=requestAnimationFrame(loop); if(paused) return; const dt=Math.min(.05,(now-last)/1000); last=now; const W=S.W,H=S.H;
    if(keys.l) tx=Math.max(.06,tx+dt*.9); if(keys.r) tx=Math.min(.94,tx-dt*.9);
    if(dizzy<=0) x+=(tx-x)*Math.min(1,dt*12); else dizzy-=dt; if(happy>0) happy-=dt;
    spawnT-=dt; if(spawned<TOTAL && spawnT<=0){ spawn(); spawnT=.62+Math.random()*.4; }
    const sw=Math.min(W,H)*.26, shh=sw*1.1, by=(H-shh*.98+shh*.55)/H, bw=sw*1.05/W*.5;
    items.forEach(it=>{ it.y+=it.vy*dt; it.rot+=it.vr*dt;
      if(!it.done && it.y>by-.02 && it.y<by+.05 && Math.abs(it.x-x)<bw){ it.done=true; const px=it.x*W, py=by*H-20;
        if(it.k==="apr"){ score++; caught++; streak++; happy=.3; Sound.pop(); floats.push({x:px,y:py,txt:streak>=5?`+1 (${streak}!)`:"+1",c:"#B8662E",a:1}); if(streak===8) sh.say("سومو: آني محترف مشمش رسمي"); }
        else if(it.k==="gold"){ score+=3; caught++; streak++; happy=.6; Sound.chime(); const j = golds.length===0 && !progress.once_mshmsha ? CONFIG.jokes[0] : pick(CONFIG.jokes.slice(1)); golds.push(j); floats.push({x:px,y:py,txt:"ذهبية! +3",c:"#B88F33",a:1}); sh.say("بيها نكتة! تنفتح بالنهاية"); }
        else if(it.k==="slip"){ dizzy=1.1; streak=0; Sound.bump(); floats.push({x:px,y:py,txt:"منو ذبّ النعال؟!",c:"#34507A",a:1}); if(Math.random()<.6) sh.say(pick(["سومو: هذا نعال أمي، أعرفه من الطيران","سومو شاف نجوم… بالنهار","جعموص يضحك: صارلك نعال لو تاج؟"])); }
        else { floats.push({x:px,y:py,txt:"ورقة، عادي",c:"#4E6A46",a:1}); }
        upd(); }
      if(!it.done && it.y>1.05 && (it.k==="apr"||it.k==="gold")){ it.done=true; streak=0; }
    });
    items=items.filter(it=>!it.done && it.y<1.1);
    floats.forEach(f=>{ f.a-=dt*1.1; f.y-=dt*40; }); floats=floats.filter(f=>f.a>0);
    draw(now);
    if(spawned>=TOTAL && !items.length){ running=false; cancelAnimationFrame(raf); finish(); }
  }
  function finish(){
    const max=TOTAL*1.3; const rating = score>=max*.75?3:score>=max*.45?2:1;
    const jh=$("[data-jokes]",sh.body);
    if(golds.length){ if(golds.includes(CONFIG.jokes[0])) progress.once_mshmsha=true; saveProgress();
      jh.innerHTML = `<div class="panel" style="padding:14px"><h3 style="font-family:var(--font-d);margin:0 0 8px">المشمشات الذهبية انفتحت</h3><div class="bk-jokes">${golds.map(j=>`<div class="bk-joke">${ART.apricot(true)}<div><p style="margin:0">${esc(j.s)}</p><p style="margin:2px 0 0;font-weight:700">${esc(j.p)}</p></div></div>`).join("")}</div></div>`; }
    else jh.innerHTML = `<div class="panel" style="padding:14px"><p style="margin:0">ولا مشمشة ذهبية هالمرة… سومو يگول المرة الجاية يلزمها بسنونه.</p></div>`;
    sh.win(score,(a,b)=>a>b, `سومو لزم ${caught} مشمشة وجمعتي ${score} نقطة.${golds.length?" وانفتحت "+golds.length+" مشمشة ذهبية — النكت جوّا تحت اللعبة.":""}`, rating);
  }
  function begin(){ reset(); ov.hidden=true; running=true; paused=false; last=performance.now(); cancelAnimationFrame(raf); raf=requestAnimationFrame(loop); }
  const toX = e => { const r=stage.getBoundingClientRect(); tx=Math.min(.94,Math.max(.06,(e.clientX-r.left)/r.width)); };
  let dragging=false;
  stage.addEventListener("pointerdown", e=>{ if(e.target.closest("button")) return; dragging=true; toX(e); });
  stage.addEventListener("pointermove", e=>{ if(dragging || e.pointerType==="mouse") toX(e); });
  window.addEventListener("pointerup", ()=>dragging=false);
  const hold=(sel,k)=>{ const b=$(sel,sh.body); b.addEventListener("pointerdown",()=>keys[k]=true); ["pointerup","pointerleave","pointercancel"].forEach(ev=>b.addEventListener(ev,()=>keys[k]=false)); };
  hold("[data-l]","l"); hold("[data-r]","r");
  $("[data-pause]",sh.body).onclick=()=>{ if(!running) return; paused=!paused; last=performance.now(); };
  const kd=e=>{ if(e.key==="ArrowRight"){keys.l=true;e.preventDefault();} if(e.key==="ArrowLeft"){keys.r=true;e.preventDefault();} if(e.key==="p"&&running){paused=!paused;last=performance.now();} };
  const ku=e=>{ if(e.key==="ArrowRight") keys.l=false; if(e.key==="ArrowLeft") keys.r=false; };
  window.addEventListener("keydown",kd); window.addEventListener("keyup",ku);
  const vis=()=>{ if(document.hidden && running) paused=true; }; document.addEventListener("visibilitychange",vis);
  $("[data-go]",sh.body).onclick=begin;
  imgReady(Object.values(im)).then(()=>{ reset(); draw(performance.now()); });
  sh.restart=()=>{ cancelAnimationFrame(raf); running=false; ov.hidden=false; reset(); draw(performance.now()); };
  sh.onRestart(sh.restart);
  return ()=>{ cancelAnimationFrame(raf); S.stop(); window.removeEventListener("keydown",kd); window.removeEventListener("keyup",ku); document.removeEventListener("visibilitychange",vis); };
}
/* ---------- Sumo dance (Simon) ---------- */
function gDance(sh){
  const MOVES=[
    {k:"shake", label:"هزّة", c:"#E9A79E", f:392},
    {k:"spin", label:"لفّة", c:"#8EC3CF", f:494},
    {k:"jump", label:"قفزة", c:"#E8C066", f:587},
    {k:"clap", label:"تصفيگ", c:"#B9A6DD", f:698}
  ];
  const FAILS=["سومو تعثّر برجله… ورجله الثانية تضحك عليه","سومو: آني مو غلطان، الموسيقى غلطانة","سومو اخترع حركة جديدة اسمها «الطيحة الحرة»","جعموص يصفّگ من بعيد… بس بالسخرية","سومو: خلّي نعيدها، هاي كانت بروفة"];
  const WINLINE=["سومو يرقص من الفرحة!","حتى الأرنب صار يرقص","سومو: إنتِ معلّمتي من اليوم"];
  sh.body.innerHTML = `<div class="dance panel">
    <div class="dance-top"><span class="chip" data-lvl>المستوى 1</span><span class="lives" data-lives></span></div>
    <div class="dance-stage"><div class="dance-sumo" data-sumo>${ART.sumo("idle")}</div><div class="dance-msg" data-msg>اضغطي «ابدئي» وراقبي سومو</div></div>
    <div class="dance-pads">${MOVES.map((m,i)=>`<button class="pad-btn" data-m="${i}" style="--c:${m.c}" disabled><span class="pk">${i+1}</span>${m.label}</button>`).join("")}</div>
    <div class="pad"><button class="btn honey" data-go>ابدئي</button></div></div>`;
  const sumo=$("[data-sumo]",sh.body), msg=$("[data-msg]",sh.body), pads=$$(".pad-btn",sh.body);
  let seq=[], inp=0, level=0, lives=3, busy=true, timers=[], playing=false;
  const T=(fn,ms)=>{ const id=setTimeout(fn,ms); timers.push(id); return id; };
  const clearT=()=>{ timers.forEach(clearTimeout); timers=[]; };
  const tone=f=>{ if(!prefs.sound) return; Sound._t ? Sound._t(f) : Sound.soft(); };
  function livesUI(){ $("[data-lives]",sh.body).innerHTML = [0,1,2].map(i=>`<span class="${i<lives?"on":""}">${ART.mushroom(i<lives?"#E9A79E":"#ccc")}</span>`).join(""); $("[data-lvl]",sh.body).textContent=`المستوى ${Math.max(1,level)}`; sh.stat(`المستوى ${Math.max(1,level)} — الفرص: ${lives}`); }
  function pose(k, dur=420){ sumo.className="dance-sumo p-"+k; sumo.innerHTML=ART.sumo(k==="fall"?"idle":"happy"); T(()=>{ sumo.className="dance-sumo"; sumo.innerHTML=ART.sumo("idle"); }, dur); }
  function lightPad(i, dur){ const p=pads[i]; p.classList.add("lit"); T(()=>p.classList.remove("lit"), dur); pose(MOVES[i].k, dur); Sound.note(MOVES[i].f); }
  function playSeq(){
    busy=true; pads.forEach(p=>p.disabled=true); msg.textContent="راقبي سومو…";
    const step=Math.max(300, 620-level*30);
    seq.forEach((m,i)=>T(()=>lightPad(m, step*.75), 500+i*step));
    T(()=>{ busy=false; inp=0; pads.forEach(p=>p.disabled=false); msg.textContent="دورج! عيدي الحركات"; }, 500+seq.length*step);
  }
  function nextLevel(){ level++; seq.push(Math.floor(Math.random()*4)); livesUI(); playSeq(); }
  function start(){ clearT(); seq=[]; level=0; lives=3; playing=true; $("[data-go]",sh.body).hidden=true; livesUI(); nextLevel(); }
  function press(i){
    if(busy||!playing) return; lightPad(i, 260);
    if(i===seq[inp]){ inp++; if(inp===seq.length){ busy=true; pads.forEach(p=>p.disabled=true);
        if(level>=10){ return end(true); }
        msg.textContent = pick(["صح! سومو يضيف حركة","حلو! هسه أصعب شوية","يا سلام، كمّلي"]); sh.cheer(); if(level===5) sh.say("جعموص: شنو هالرقص؟ اكو مسابقة؟"); T(nextLevel, 900); } }
    else { lives--; busy=true; pads.forEach(p=>p.disabled=true); Sound.bump(); clearT(); pose("fall", 1100); const f=pick(FAILS); msg.textContent=f; livesUI();
      if(lives<=0) T(()=>end(false), 1300); else T(()=>{ msg.textContent="نعيد نفس الرقصة"; T(playSeq, 700); }, 1500); }
  }
  function end(full){
    playing=false; pads.forEach(p=>p.disabled=true);
    const reached = full ? level : Math.max(0, level-1);
    if(reached>=5){ sh.win(reached,(a,b)=>a>b, `${full?"خلّصتي كل المستويات!":"وصلتي للمستوى "+reached+"."} ${pick(WINLINE)}`, reached>=9?3:reached>=7?2:1); }
    else { if(recordBest("dance", reached, (a,b)=>a>b)) sh.setBest(GAMES.dance.best(reached)); msg.textContent=`وصلتي المستوى ${reached}. سومو يريد رقصة ثانية — من المستوى 5 تبدي الجوائز.`; }
    $("[data-go]",sh.body).hidden=false; $("[data-go]",sh.body).textContent="رقصة جديدة";
  }
  pads.forEach((p,i)=>p.onclick=()=>press(i));
  const key=e=>{ const n=+e.key; if(n>=1&&n<=4){ e.preventDefault(); press(n-1); } };
  window.addEventListener("keydown",key);
  $("[data-go]",sh.body).onclick=start;
  livesUI();
  sh.restart=()=>{ clearT(); playing=false; seq=[]; level=0; lives=3; livesUI(); msg.textContent="اضغطي «ابدئي» وراقبي سومو"; const b=$("[data-go]",sh.body); b.hidden=false; b.textContent="ابدئي"; pads.forEach(p=>p.disabled=true); };
  sh.onRestart(sh.restart);
  return ()=>{ clearT(); window.removeEventListener("keydown",key); };
}
/* ---------- crazy stories (mad libs) ---------- */
const TALES = [
  {title:"الصبح الغريب", text:"بيوم من الأيام، {H} صحت الصبح ولگت {thing} نايم بفراشها. صرخت: «{exclaim}!» وركضت لجعموص، اللي كان دا ياكل {food} بالمگلوب. جعموص گال: «لا تخافين، هذا صديقي، يحب {hobby}». وبالأخير الكل رقصوا رقصة {dance} لحد ما سومو {sumo}.",
   blanks:[{k:"thing",q:"شنو اللي كان نايم بالفراش؟",o:["بطريق لابس نظارات","بطيخة تشخّر","ديناصور صغيّر","كيس شيبس عصبي"]},
     {k:"exclaim",q:"شنو صرخت؟",o:["يا ستّار","منو جابك هنا؟!","هذا مو وقت الزيارات","وين الريموت؟"]},
     {k:"food",q:"جعموص شنو جان ياكل؟",o:["باچة","شوربة عدس بالشوكة","كيك بالطرشي","تمن بالفلفل"]},
     {k:"hobby",q:"صديقه شنو يحب؟",o:["يعدّ الغيوم","يغني للطماطة","يكوي الجواريب","يتصارع ويه المخدّة"]},
     {k:"dance",q:"شنو اسم الرقصة؟",o:["الدبكة الفضائية","رقصة البطة المستعجلة","التانغو البغدادي","الهزّة المشمشية"]},
     {k:"sumo",q:"شنو صار لسومو؟",o:["نام واقف","طار ويه البالونات","صار يتكلم إنگليزي فجأة","وقع بصحن الحمص"]}]},
  {title:"عدول بالسوق", text:"{L} راح للسوق حتى يشتري هدية لـ{H}. أول شي شاف {seller} يبيع {item}، وگال: «هذا يشبه {H} بالضبط!». اشتراه بـ{price}. بالطريق، {event}. من وصل، {H} فتحت الهدية وگالت: «{reply}».",
   blanks:[{k:"seller",q:"منو جان البيّاع؟",o:["عمو ضفدع","سومو بنظارات شمسية","بطريق من القطب","جعموص متنكّر"]},
     {k:"item",q:"شنو يبيع؟",o:["مشمش يغنّي","غيمة بكيس","مظلة للشاي","جوارب تضحك"]},
     {k:"price",q:"بكم اشتراه؟",o:["ثلاث ضحكات","بوسة على الخد","كيلو باچة","نص بطيخة"]},
     {k:"event",q:"شنو صار بالطريق؟",o:["طاحت الهدية وصارت ترقص","طاردته دجاجة غاضبة","بدا يمطر جكليت","ضاع وسأل الشجرة عن الطريق"]},
     {k:"reply",q:"شنو گالت أيلاف؟",o:["هاي أحلى هدية بالعالم","ليش تتحرك؟!","رجّعه، أريد البطيخة","إنت أعبط واحد… وأحبك"]}]},
  {title:"مطعم سومو", text:"سومو فتح مطعم اسمه «{name}». أول زبونة جانت {H}، طلبت {dish}. سومو طبخ بكل حماس بس {oops}. جعموص صار نادل وگال للزبائن: «{waiter}». بالأخير المطعم صار مشهور بسبب {famous}.",
   blanks:[{k:"name",q:"شنو اسم المطعم؟",o:["الفطر السعيد","كبابنا أحلى من كبابكم","مطعم ماكو منيو","الصحن الطاير"]},
     {k:"dish",q:"أيلاف شنو طلبت؟",o:["بيتزا بالتمر","دولمة بالشوكولاتة","سندويچ غيمة","شاي بالآيس كريم"]},
     {k:"oops",q:"شنو صار بالمطبخ؟",o:["حرق الماي","الطباخة هربت","العجين صار حيوان أليف","الطماطة رفضت تنگطع"]},
     {k:"waiter",q:"شنو گال جعموص للزبائن؟",o:["الأكل مجاني إذا ضحكتوا","لا تسألون شنو بيه","التقييم خمس نجوم إجباري","الطبّاخ تعبان، اطبخوا بنفسكم"]},
     {k:"famous",q:"المطعم اشتهر بسبب؟",o:["ضحكة أيلاف","سومو يرقص ويه الصحون","النعال الطاير","الحساب بالنكت"]}]}
];
function gMadlibs(sh){
  let tale=null, ans={}, step=0, made=progress.best.madlibs||0;
  const fill = t => t.replace(/\{H\}/g, heroName()).replace(/\{L\}/g, CONFIG.loverName);
  function menu(){
    sh.stat(`حكايات مكتوبة: ${made}`);
    sh.body.innerHTML = `<div class="panel ml-card"><h3>اختاري حكاية</h3><div class="ml-tales">${TALES.map((t,i)=>`<button class="sign-opt" data-t="${i}">${ART.cloud()}<span><b>${esc(t.title)}</b><small>${t.blanks.length} اختيارات مجنونة</small></span></button>`).join("")}<button class="sign-opt" data-t="r">${ART.starB()}<span><b>فاجئيني بحكاية</b><small>اختيار عشوائي</small></span></button></div></div>`;
    $$("[data-t]",sh.body).forEach(b=>b.onclick=()=>{ const i=b.dataset.t==="r"?Math.floor(Math.random()*TALES.length):+b.dataset.t; tale=TALES[i]; ans={}; step=0; ask(); });
  }
  function ask(){
    const b=tale.blanks[step];
    sh.body.innerHTML = `<div class="panel ml-card"><div class="progress">${tale.blanks.map((_,i)=>`<i class="${i<=step?"on":""}"></i>`).join("")}</div><h3>${esc(fill(b.q))}</h3>
      <div class="ml-opts">${shuffle(b.o).map(o=>`<button class="lg-opt ml-opt" data-o="${esc(o)}">${esc(fill(o))}</button>`).join("")}</div>
      <div class="pad"><button class="btn ghost small" data-rand>${IC.gift} اختاري لي</button></div></div>`;
    $$("[data-o]",sh.body).forEach(x=>x.onclick=()=>choose(x.dataset.o));
    $("[data-rand]",sh.body).onclick=()=>choose(pick(b.o));
  }
  function choose(o){ ans[tale.blanks[step].k]=o; Sound.pop(); step++; if(step<tale.blanks.length) ask(); else reveal(); }
  function reveal(){
    const html = esc(fill(tale.text)).replace(/\{(\w+)\}/g,(m,k)=>`<mark>${esc(fill(ans[k]||""))}</mark>`);
    const plain = fill(tale.text).replace(/\{(\w+)\}/g,(m,k)=>fill(ans[k]||""));
    made++; sh.quiet(made,(a,b)=>a>b); sh.stat(`حكايات مكتوبة: ${made}`);
    const k="once_ml_"+tale.title; if(!progress[k]){ progress[k]=true; addStars(1,"حكاية جديدة"); }
    sh.body.innerHTML = `<div class="panel ml-card ml-story"><h3>${esc(tale.title)}</h3><p class="ml-text">${html}</p>
      <div class="pad"><button class="btn honey" data-save>${IC.save} احفظيها بالدفتر</button><button class="btn" data-again>${IC.restart} نفس الحكاية بكلمات ثانية</button><button class="btn ghost" data-menu>حكاية ثانية</button></div></div>`;
    Sound.win(); sh.cheer(); sh.say(pick(["سومو: هاي الحكاية لازم تنعرض بالسينما","جعموص ضحك لحد ما طلعت الحشوة","سومو: آني ما سويت هيچ شي… أظن"]),"l");
    $("[data-save]",sh.body).onclick=e=>{ const entries=loadDiary(); entries.push({id:"d"+Date.now().toString(36), date:new Date().toISOString().slice(0,10), title:"سالفة مجنونة: "+tale.title, text:plain, mood:"happy", sticker:"star", created:Date.now()}); Store.set("diary",entries); e.target.disabled=true; e.target.textContent="انحفظت بالدفتر"; toast("الحكاية صارت بدفتر "+heroName(),"check"); };
    $("[data-again]",sh.body).onclick=()=>{ ans={}; step=0; ask(); };
    $("[data-menu]",sh.body).onclick=menu;
  }
  sh.restart=menu; sh.onRestart(menu); menu();
}

/* ============ JOKE BOX ============ */
function viewJokes(root){
  let order=[], i=-1, opened=false;
  const first = !progress.once_jokefirst;
  const rest = shuffle(CONFIG.jokes.slice(1).map((_,k)=>k+1));
  order = first ? [0].concat(rest) : shuffle(CONFIG.jokes.map((_,k)=>k));
  const v=h(`<section class="view"><div class="world w-orchard"><div class="world-deco" aria-hidden="true">${decoFor("basket")}</div><div class="world-inner">
    <div class="world-head panel"><div><h2>صندوق النكت العبيطة</h2><p>افتحي الصندوق، اقري النكتة، وگولي شگد ضحكتي. النكت عبيطة عن قصد.</p></div><div class="wh-side"><span class="chip" data-laughs></span></div></div>
    <div class="panel jb">
      <button class="jb-box" data-open aria-label="افتحي الصندوق">${ART.jokeBox(false)}</button>
      <div class="jb-card" data-card hidden><p class="jb-s" data-s></p><button class="btn honey" data-why>شنو؟!</button><p class="jb-p" data-p hidden></p>
        <div class="jb-rate" data-rate hidden><span>شگد ضحكتي؟</span><button data-r="0" aria-label="ما ضحكت">${ART.mood.calm}</button><button data-r="1" aria-label="ابتسمت">${ART.mood.happy}</button><button data-r="2" aria-label="ضحكت هواي">${ART.mood.love}</button></div>
        <button class="btn ghost" data-next hidden>النكتة الجاية</button></div>
    </div>
    <div class="world-cast"><div class="cast-r">${girlImg("idle")}</div><div class="cast-l"><div class="jm-wrap" data-jm>${ART.jaamous("idle")}</div>${sumoHTML("idle")}</div></div>
  </div></div></section>`);
  root.appendChild(v);
  const laughs=()=>{ $("[data-laughs]",v).textContent=`ضحكات: ${progress.laughs||0}`; };
  laughs();
  const show=()=>{
    i=(i+1)%order.length; const j=CONFIG.jokes[order[i]];
    $("[data-card]",v).hidden=false; $("[data-s]",v).textContent=j.s; $("[data-p]",v).textContent=j.p; $("[data-p]",v).hidden=true; $("[data-rate]",v).hidden=true; $("[data-next]",v).hidden=true; $("[data-why]",v).hidden=false;
    const jm=$("[data-jm]",v); jm.innerHTML=ART.jaamous("think");
    if(order[i]===0){ progress.once_jokefirst=true; saveProgress(); }
  };
  $("[data-open]",v).onclick=()=>{ if(!opened){ opened=true; $("[data-open]",v).innerHTML=ART.jokeBox(true); Sound.chime(); addStarsOnce("jokebox",1,"فتحتي صندوق النكت"); } show(); };
  $("[data-why]",v).onclick=()=>{ $("[data-p]",v).hidden=false; $("[data-why]",v).hidden=true; $("[data-rate]",v).hidden=false; $("[data-next]",v).hidden=false; const jm=$("[data-jm]",v); jm.innerHTML=ART.jaamous("happy"); react(jm,"laugh"); react($(".cast-l .sumo-wrap",v),"laugh"); Sound.pop(); };
  $$("[data-r]",v).forEach(b=>b.onclick=()=>{ const r=+b.dataset.r; progress.laughs=(progress.laughs||0)+r; saveProgress(); laughs(); toast(["جعموص زعل… بس يحاول مرة ثانية","ابتسامة! تكفي","سومو وقع من الضحك"][r], r===2?"star":"check"); $("[data-rate]",v).hidden=true; if((progress.laughs||0)>=10) addStarsOnce("laugh10",2,"عشر ضحكات"); });
  $("[data-next]",v).onclick=show;
}
/* ---------- 2) story order ---------- */
const PANEL = (inner, bg="#EAF3F5") => `<svg viewBox="0 0 120 90" xmlns="http://www.w3.org/2000/svg"><rect width="120" height="90" fill="${bg}"/>${inner}</svg>`;
const groundP = (c="#B7CF8F") => `<path d="M0 70q30-8 60 0t60 0v20H0z" fill="${c}"/>`;
const STORIES = [
  {title:"بذرة صغيرة", panels:[
    PANEL(groundP("#C9A77E")+'<ellipse cx="60" cy="72" rx="6" ry="4" fill="#7A5A3A"/><path d="M60 40v-14M54 34l6-8 6 8" stroke="#8EC3CF" stroke-width="2" fill="none"/>'),
    PANEL(groundP()+'<path d="M60 72V54" stroke="#4E6A46" stroke-width="3"/><path d="M60 58c-8-2-12-8-10-12 6 0 10 4 10 12zM60 56c8-2 12-8 10-12-6 0-10 4-10 12z" fill="#9DBF8E" stroke="#4E6A46" stroke-width="1.5"/>'),
    PANEL(groundP()+'<path d="M60 72V36" stroke="#4E6A46" stroke-width="3"/><path d="M60 60c-10-2-14-8-12-12 6 0 12 4 12 12zM60 50c10-2 14-8 12-12-6 0-12 4-12 12z" fill="#9DBF8E" stroke="#4E6A46" stroke-width="1.5"/><ellipse cx="60" cy="32" rx="6" ry="8" fill="#E9A79E" stroke="#9A5C52" stroke-width="1.5"/>'),
    PANEL(groundP()+'<path d="M60 72V38" stroke="#4E6A46" stroke-width="3"/><path d="M60 60c-10-2-14-8-12-12 6 0 12 4 12 12z" fill="#9DBF8E" stroke="#4E6A46" stroke-width="1.5"/><g transform="translate(42 14) scale(.6)">'+ART.flower("#F3C1BA").replace(/<\/?svg[^>]*>/g,"")+'</g><g transform="translate(82 10) scale(.5)">'+ART.butterfly().replace(/<\/?svg[^>]*>/g,"")+'</g>')
  ]},
  {title:"يوم بالغابة", panels:[
    PANEL(groundP()+'<circle cx="60" cy="72" r="14" fill="#F2D27A"/><path d="M0 70q30-8 60 0t60 0v20H0z" fill="#B7CF8F"/>', "#F6DCC8"),
    PANEL(groundP()+'<circle cx="94" cy="20" r="10" fill="#F2D27A"/><path d="M30 76l30-10 34 10-32 10z" fill="#F3E6C8" stroke="#E9A79E" stroke-width="2"/><circle cx="58" cy="72" r="4" fill="#E9A79E"/>', "#D7EBF3"),
    PANEL(groundP("#9CB27E")+'<circle cx="30" cy="62" r="13" fill="#E89A6A"/>', "#F2C6A8"),
    PANEL(groundP("#5F7A5A")+'<path d="M90 16a10 10 0 1 0 6 18a8 8 0 1 1-6-18z" fill="#FFF2C8"/><circle cx="30" cy="20" r="1.6" fill="#fff"/><circle cx="50" cy="12" r="1.2" fill="#fff"/><circle cx="66" cy="28" r="1.4" fill="#fff"/><circle cx="20" cy="40" r="1" fill="#fff"/>', "#3D4766")
  ]},
  {title:"بعد المطر", panels:[
    PANEL(groundP()+'<g transform="translate(30 8) scale(.8)">'+ART.cloud().replace(/<\/?svg[^>]*>/g,"")+'</g>', "#E2E8EE"),
    PANEL(groundP()+'<g transform="translate(30 4) scale(.8)">'+ART.cloud().replace(/<\/?svg[^>]*>/g,"")+'</g>'+[40,52,64,76,46,70].map((x,i)=>`<path d="M${x} ${46+(i%2)*8}l-3 8" stroke="#4E8E9C" stroke-width="2.4" stroke-linecap="round"/>`).join(""), "#C9D3DD"),
    PANEL(groundP()+'<ellipse cx="60" cy="76" rx="26" ry="6" fill="#8EC3CF" stroke="#4E8E9C" stroke-width="1.5"/><path d="M46 74q6-3 12 0" stroke="#fff" stroke-width="1.5" fill="none"/>', "#DCE6EC"),
    PANEL(groundP()+'<ellipse cx="60" cy="76" rx="20" ry="5" fill="#8EC3CF"/>'+["#E9A79E","#E8C066","#9DBF8E","#8EC3CF","#B9A6DD"].map((c,i)=>`<path d="M${14+i*5} 70a${46-i*5} ${46-i*5} 0 0 1 ${92-i*10} 0" stroke="${c}" stroke-width="5" fill="none"/>`).join(""), "#E8F3F6")
  ]},
  {title:"العش الصغير", panels:[
    PANEL('<path d="M30 62q30 22 60 0" fill="#A07A50" stroke="#5A3F26" stroke-width="2"/><ellipse cx="60" cy="56" rx="10" ry="12" fill="#F4EBD0" stroke="#9C8A68" stroke-width="2"/>', "#E9F1D9"),
    PANEL('<path d="M30 62q30 22 60 0" fill="#A07A50" stroke="#5A3F26" stroke-width="2"/><path d="M50 58a10 12 0 0 0 20 0l-4-4-3 4-3-5-3 5-3-4z" fill="#F4EBD0" stroke="#9C8A68" stroke-width="2"/><circle cx="60" cy="46" r="8" fill="#F2D27A" stroke="#B88F33" stroke-width="1.5"/><circle cx="57" cy="44" r="1.4" fill="#2F2A20"/>', "#E9F1D9"),
    PANEL('<path d="M30 62q30 22 60 0" fill="#A07A50" stroke="#5A3F26" stroke-width="2"/><circle cx="60" cy="50" r="12" fill="#F2D27A" stroke="#B88F33" stroke-width="1.5"/><path d="M58 40l2-8 2 8z" fill="#E89A6A"/><path d="M55 40l5 6 5-6" fill="#E89A6A" stroke="#B86A3A" stroke-width="1"/><circle cx="55" cy="47" r="1.6" fill="#2F2A20"/><circle cx="65" cy="47" r="1.6" fill="#2F2A20"/>', "#E9F1D9"),
    PANEL('<path d="M10 80q30 10 50 0" fill="#A07A50"/><g transform="translate(46 20) scale(.75)">'+ART.bird().replace(/<\/?svg[^>]*>/g,"")+'</g><path d="M20 30q6-4 12 0M88 20q5-3 10 0" stroke="#4E8E9C" stroke-width="2" fill="none"/>', "#DCEFF3")
  ]}
];
function gStory(sh){
  let round=0, wrong=0, order=[], sel=null;
  function start(){ round=0; wrong=0; setRound(); }
  function setRound(){
    const n = STORIES[round].panels.length;
    do { order = shuffle([...Array(n).keys()]); } while(order.every((v,i)=>v===i));
    sel=null; draw();
  }
  function upd(){ sh.stat(`الحكاية ${round+1} من ${STORIES.length} — أخطاء: ${wrong}`); }
  function draw(){
    upd();
    const st = STORIES[round];
    sh.body.innerHTML = `<div class="sc-board panel"><h3>${esc(st.title)}</h3><div class="sc-row">${order.map((p,i)=>`<div class="sc-slot"><span class="sc-num">${["الأول","الثاني","الثالث","الرابع"][i]}</span><button class="sc-card" data-i="${i}" aria-label="مشهد بالمكان ${i+1}">${st.panels[p]}</button><div class="sc-move"><button data-mv="${i}" data-d="-1" aria-label="قدّمي المشهد" ${i===0?"disabled":""}>${IC.right}</button><button data-mv="${i}" data-d="1" aria-label="أخّري المشهد" ${i===order.length-1?"disabled":""}>${IC.left}</button></div></div>`).join("")}</div>
      <div class="row" style="justify-content:center"><button class="btn honey" data-check>${IC.check} تحقّقي من الترتيب</button></div></div>`;
    $$(".sc-card", sh.body).forEach(c=>bindCard(c));
    $$("[data-mv]", sh.body).forEach(b=>b.onclick=()=>{ const i=+b.dataset.mv, j=i+(+b.dataset.d); swap(i,j); });
    $("[data-check]", sh.body).onclick = check;
  }
  function swap(i,j){ if(j<0||j>=order.length||i===j) return; [order[i],order[j]]=[order[j],order[i]]; Sound.flip(); draw(); }
  function bindCard(c){
    let sx, sy, ghost=null, moved=false;
    c.addEventListener("pointerdown", e=>{ sx=e.clientX; sy=e.clientY; moved=false; c.setPointerCapture && c.setPointerCapture(e.pointerId); });
    c.addEventListener("pointermove", e=>{ if(sx==null) return; if(!moved && Math.hypot(e.clientX-sx,e.clientY-sy)>10){ moved=true; ghost=h(`<div class="drag-ghost">${c.innerHTML}</div>`); document.body.appendChild(ghost); c.style.opacity=.4; } if(ghost){ ghost.style.left=e.clientX+"px"; ghost.style.top=e.clientY+"px"; } });
    const end = e => { if(sx==null) return; sx=null; c.style.opacity=""; if(ghost){ ghost.remove(); ghost=null; const t=document.elementFromPoint(e.clientX,e.clientY); const tc=t&&t.closest(".sc-card"); if(tc) swap(+c.dataset.i, +tc.dataset.i); } else if(!moved){ tap(c); } };
    c.addEventListener("pointerup", end); c.addEventListener("pointercancel", ()=>{ sx=null; c.style.opacity=""; ghost&&ghost.remove(); ghost=null; });
    c.addEventListener("keydown", e=>{ if(e.key==="Enter"||e.key===" "){ e.preventDefault(); tap(c); } });
  }
  function tap(c){ const i=+c.dataset.i; if(sel==null){ sel=i; c.classList.add("sel"); Sound.soft(); } else if(sel===i){ sel=null; c.classList.remove("sel"); } else { const s=sel; sel=null; swap(s,i); } }
  function check(){
    const ok = order.every((v,i)=>v===i);
    $$(".sc-card", sh.body).forEach((c,i)=>{ c.classList.toggle("ok", order[i]===i); if(order[i]!==i){ c.classList.remove("bad"); void c.offsetWidth; c.classList.add("bad"); } });
    if(ok){ Sound.chime(); sh.cheer(); if(round<STORIES.length-1){ toast("حكاية مرتبة! التالية جاية","check"); setTimeout(()=>{ round++; setRound(); }, 900); } else sh.win(wrong, (a,b)=>a<b, `رتّبتي ${STORIES.length} حكايات${wrong?` بـ ${wrong} محاولة غلط بس`:" بدون أي غلط"}.`, wrong===0?3:wrong<=2?2:1); }
    else { wrong++; upd(); Sound.bump(); toast("المشاهد الخضراء بمكانها، رتّبي الباقي","bulb"); if(Math.random()<.4) sh.say(pick(["جعموص: الحكاية صارت فلم أكشن مو قصة","سومو: آني أحب النهاية بالبداية"])); }
  }
  sh.restart = start; sh.onRestart(start); start();
}

/* ---------- 4) Jaamous road ---------- */
function gRoad(sh){
  sh.body.innerHTML = `<div style="display:grid;gap:10px"><div class="stage" style="aspect-ratio:2/1;max-height:62vh"><canvas></canvas>
    <div class="stage-ov" data-ov><div class="panel"><h3 style="font-family:var(--font-d);margin:0 0 6px">جاهزة؟</h3><p style="margin:0 0 12px">↑ و ↓ أو السحب لتغيير المسار، والمسافة أو الضغط للقفز.</p><button class="btn honey" data-go>ابدئي المشي</button></div></div></div>
    <div class="pad"><button class="btn ghost" data-up aria-label="المسار الأعلى">${IC.up}</button><button class="btn" data-jump>${IC.jump} قفزة</button><button class="btn ghost" data-down aria-label="المسار الأسفل">${IC.down}</button><button class="btn ghost small" data-pause aria-label="إيقاف مؤقت">${IC.pause}</button></div></div>`;
  const stage=$(".stage",sh.body), cv=$("canvas",sh.body), ctx=cv.getContext("2d"), ov=$("[data-ov]",sh.body);
  const jmImg = loadImg("jm_road", svgURL(ART.jaamous("idle"))), jmHappy=loadImg("jm_road_h", svgURL(ART.jaamous("happy")));
  const spr = {star:loadImg("r_star",svgURL(ART.starB())), stone:loadImg("r_stone",svgURL(ART.stone())), log:loadImg("r_log",svgURL(ART.log())), puddle:loadImg("r_pud",svgURL(ART.puddle())), flower:loadImg("r_fl",svgURL(ART.flower())), gold:loadImg("r_gold",svgURL(ART.apricot(true))), flag:loadImg("r_flag", svgURL('<svg viewBox="0 0 40 80" xmlns="http://www.w3.org/2000/svg"><path d="M8 78V6" stroke="#7A5A3A" stroke-width="4" stroke-linecap="round"/><path d="M10 8h26l-7 10 7 10H10z" fill="#E9A79E" stroke="#9A5C52" stroke-width="2"/></svg>'))};
  let W=0,Hh=0,dpr=1, raf=0, running=false, paused=false, last=0;
  let lane=1, ly=1, jumpT=0, bumpT=0, items=[], got=0, totalStars=0, dist=0, endX=0, happyT=0, bumps=0, floats=[], streak=0, pts=0;
  const laneY = l => Hh*(0.5 + l*0.18);
  function size(){ const r=stage.getBoundingClientRect(); dpr=Math.min(2,window.devicePixelRatio||1); W=r.width; Hh=r.height; cv.width=W*dpr; cv.height=Hh*dpr; ctx.setTransform(dpr,0,0,dpr,0,0); if(!running) draw(); }
  function build(){
    items=[]; totalStars=0; got=0; bumps=0; dist=0; floats=[]; streak=0; pts=0; lane=1; ly=1; jumpT=0; bumpT=0;
    let x=-60; for(let i=0;i<34;i++){ x -= 150 + Math.random()*90; const l=Math.floor(Math.random()*3); const isStar = Math.random()<.58 || i<2; const kind = isStar?(Math.random()<.12?"gold":"star"):["stone","log","puddle"][Math.floor(Math.random()*3)]; if(isStar) totalStars++; items.push({x, l, kind, done:false}); if(isStar && Math.random()<.35){ const l2=(l+1+Math.floor(Math.random()*2))%3; items.push({x:x-40, l:l2, kind:"star", done:false}); totalStars++; } }
    endX = x - 200; upd();
  }
  function upd(){ sh.stat(`النجوم: ${got} / ${totalStars} — النقاط: ${pts}`); }
  function draw(){
    const t=performance.now()/1000;
    const g=ctx.createLinearGradient(0,0,0,Hh); g.addColorStop(0,"#DDEEF0"); g.addColorStop(.45,"#EEF3DA"); g.addColorStop(1,"#BFD69E"); ctx.fillStyle=g; ctx.fillRect(0,0,W,Hh);
    // hills parallax
    const off=(dist*0.15)%W;
    ctx.fillStyle="#C7DDB0"; ctx.beginPath(); ctx.moveTo(0,Hh*.42); for(let x=-W;x<=W*2;x+=40){ ctx.lineTo(x+off, Hh*.40 + Math.sin((x)/120)*Hh*.04); } ctx.lineTo(W,Hh); ctx.lineTo(0,Hh); ctx.fill();
    ctx.fillStyle="#B3CE96"; ctx.beginPath(); ctx.moveTo(0,Hh*.5); for(let x=-W;x<=W*2;x+=30){ ctx.lineTo(x+((dist*0.3)%W), Hh*.48 + Math.sin(x/80+1)*Hh*.03); } ctx.lineTo(W,Hh); ctx.lineTo(0,Hh); ctx.fill();
    // lanes
    for(let l=0;l<3;l++){ const y=laneY(l)+Hh*.04; ctx.fillStyle="rgba(240,226,190,.75)"; ctx.beginPath(); ctx.ellipse(W/2,y,W*.7,Hh*.045,0,0,Math.PI*2); ctx.fill(); }
    ctx.strokeStyle="rgba(122,90,58,.35)"; ctx.setLineDash([10,14]); ctx.lineWidth=2; for(let l=0;l<2;l++){ const y=(laneY(l)+laneY(l+1))/2+Hh*.04; ctx.beginPath(); ctx.lineDashOffset=-dist; ctx.moveTo(0,y); ctx.lineTo(W,y); ctx.stroke(); } ctx.setLineDash([]);
    // flowers scrolling
    for(let i=0;i<8;i++){ const fx=((i*W/8 + dist*0.9)%(W+40))-20; ctx.drawImage(spr.flower, fx, Hh*.93-10, 18,18); }
    const s = Hh*.16;
    // items
    items.forEach(it=>{ if(it.done) return; const x=it.x+dist; if(x<-80||x>W+80) return; const y=laneY(it.l); const im=spr[it.kind]; const bob = it.kind==="star"? Math.sin(t*4+it.x)*3:0; const w = it.kind==="log"?s*1.4:it.kind==="puddle"?s*1.4:s; const hgt = it.kind==="puddle"? s*.6 : it.kind==="log"? s*.8 : s; ctx.drawImage(im, x-w/2, y-hgt+s*.25+bob, w, hgt); });
    floats.forEach(f=>{ ctx.globalAlpha=Math.max(0,f.a); ctx.fillStyle=f.c; ctx.textAlign="center"; ctx.font=`800 ${Math.max(14,W*.024)}px "Baloo Bhaijaan 2", Almarai, sans-serif`; ctx.fillText(f.txt,f.x,f.y); ctx.globalAlpha=1; });
    const total=-endX; const pr=Math.min(1,Math.max(0,dist/(total+W*.82))); ctx.fillStyle="rgba(255,255,255,.6)"; ctx.fillRect(W*.08,10,W*.84,8); ctx.fillStyle="#E8C066"; ctx.fillRect(W*.92-W*.84*pr,10,W*.84*pr,8); ctx.drawImage(jmImg, W*.92-W*.84*pr-10, 2, 20, 22);
    const fx=endX+dist; if(fx>-40 && fx<W+40){ ctx.drawImage(spr.flag, fx-15, laneY(0)-s*1.4, s*.6, s*1.9); }
    // jaamous
    const jx=W*.82, jy = Hh*(0.5+ly*0.18), jh=s*1.35, jw=jh*200/220;
    const hop = jumpT>0 ? Math.sin((1-jumpT/0.7)*Math.PI)*Hh*.17 : Math.abs(Math.sin(t*7))*(running&&!paused?3:0);
    const wob = bumpT>0 ? Math.sin(bumpT*40)*.12 : 0;
    ctx.fillStyle="rgba(60,50,30,.18)"; ctx.beginPath(); ctx.ellipse(jx, jy+s*.22, jw*.35*(1-hop/(Hh*.3)), 5,0,0,Math.PI*2); ctx.fill();
    ctx.save(); ctx.translate(jx, jy+s*.25-hop); ctx.rotate(wob); ctx.drawImage(happyT>0?jmHappy:jmImg, -jw/2, -jh, jw, jh); ctx.restore();
  }
  function loop(now){
    raf=requestAnimationFrame(loop); if(paused) return;
    const dt=Math.min(.05,(now-last)/1000); last=now;
    const speed = W*.24*(bumpT>0?.35:1); dist += speed*dt;
    ly += (lane-ly)*Math.min(1,dt*10); if(jumpT>0) jumpT=Math.max(0,jumpT-dt); if(bumpT>0) bumpT=Math.max(0,bumpT-dt); if(happyT>0) happyT-=dt;
    const jx=W*.82, s=Hh*.16;
    items.forEach(it=>{ if(it.done) return; const x=it.x+dist; if(Math.abs(x-jx)<s*.45 && it.l===Math.round(ly)){ if(it.kind==="star"||it.kind==="gold"){ it.done=true; got++; streak++; const v=it.kind==="gold"?3:1; pts+=v*(streak>=5?2:1); happyT=.4; Sound.pop(); floats.push({x:jx,y:laneY(it.l)-s,txt:it.kind==="gold"?"مشمشة ذهبية +3":streak>=5?`+${v*2} (${streak} ورا بعض)`:"+1",c:"#B8662E",a:1}); if(streak===10) sh.say("سومو: جعموص صار نجم سينما"); upd(); } else if(jumpT<=0.08 || jumpT>0.62){ it.done=true; bumpT=.6; bumps++; streak=0; Sound.bump(); floats.push({x:jx,y:laneY(it.l)-s,txt:pick(["آخ!","منو حط الصخرة هنا؟","دوخة!"]),c:"#7A3A2E",a:1}); if(Math.random()<.35) sh.say(pick(["جعموص: آني تعمدت، كنت أختبر الصخرة","سومو يضحك من بعيد","جعموص: الحشوة بخير، لا تخافين"])); } } });
    floats.forEach(f=>{ f.a-=dt*1.2; f.y-=dt*36; }); floats=floats.filter(f=>f.a>0);
    draw();
    if(endX+dist > jx){ running=false; cancelAnimationFrame(raf); const ratio=got/Math.max(1,totalStars); sh.win(pts,(a,b)=>a>b, `${CONFIG.companionName} وصل للراية وجمع ${got} نجمة من ${totalStars} (${pts} نقطة)، وتعثّر ${bumps} مرات.`, ratio>=.8&&bumps<=2?3:ratio>=.5?2:1); }
  }
  function begin(){ build(); ov.hidden=true; running=true; paused=false; last=performance.now(); cancelAnimationFrame(raf); raf=requestAnimationFrame(loop); stage.focus(); }
  const up=()=>{ lane=Math.max(0,lane-1); Sound.soft(); }, down=()=>{ lane=Math.min(2,lane+1); Sound.soft(); }, jump=()=>{ if(jumpT<=0){ jumpT=.7; Sound.soft(); } };
  $("[data-go]",sh.body).onclick=begin; $("[data-up]",sh.body).onclick=up; $("[data-down]",sh.body).onclick=down; $("[data-jump]",sh.body).onclick=jump;
  $("[data-pause]",sh.body).onclick=()=>{ if(!running) return; paused=!paused; last=performance.now(); toast(paused?"وقفنا شوي":"نكمل", "pause"); };
  const key = e=>{ if(!running) return; if(["ArrowUp","w","W"].includes(e.key)){e.preventDefault();up();} else if(["ArrowDown","s","S"].includes(e.key)){e.preventDefault();down();} else if(e.key===" "){e.preventDefault();jump();} else if(e.key==="p"||e.key==="P"){ paused=!paused; last=performance.now(); } };
  window.addEventListener("keydown", key);
  let ty=null, tyT=0; stage.addEventListener("pointerdown", e=>{ if(e.target.closest("button")) return; ty=e.clientY; tyT=performance.now(); });
  stage.addEventListener("pointerup", e=>{ if(ty==null||!running) return; const dy=e.clientY-ty; ty=null; if(Math.abs(dy)>28){ dy<0?up():down(); } else jump(); });
  const vis = ()=>{ if(document.hidden && running){ paused=true; } };
  document.addEventListener("visibilitychange", vis);
  const ro = new ResizeObserver(size); ro.observe(stage);
  Promise.all(Object.values(spr).concat([jmImg]).map(im=>im.complete?1:new Promise(r=>{im.onload=r;im.onerror=r;}))).then(()=>{ build(); size(); });
  sh.restart = ()=>{ ov.hidden=false; running=false; cancelAnimationFrame(raf); build(); draw(); };
  sh.onRestart(sh.restart);
  return ()=>{ cancelAnimationFrame(raf); window.removeEventListener("keydown",key); document.removeEventListener("visibilitychange",vis); ro.disconnect(); };
}

/* ---------- 5) bridge logic ---------- */
const sv = (f) => f();
const LOGIC = [
  {q:"شنو يجي بعدين بالنمط؟", vis:()=>[ART.leaf(),ART.flower(),ART.leaf(),ART.flower(),"?"], opts:[ART.mushroom(),ART.leaf(),ART.flower()], a:1, svgOpts:true, hint:"النمط يتكرر كل قطعتين.", why:"ورقة، زهرة، ورقة، زهرة… فالجاية ورقة."},
  {q:"على الجسر 3 ضفادع. قفز 2 منهم للماي وإجو 4 جدد. كم ضفدع صار على الجسر؟", vis:()=>[ART.frog(),ART.frog(),ART.frog()], opts:["5","7","9"], a:0, hint:"ابدئي بـ 3، نقّصي 2، وزيدي 4.", why:"3 − 2 + 4 = 5"},
  {q:"حجارة الجسر مرقّمة: 2، 4، 6، 8… شنو رقم الحجارة الجاية؟", vis:()=>["2","4","6","8","?"], opts:["9","10","12"], a:1, hint:"كل حجارة تزيد بنفس المقدار.", why:"تزيد 2 كل مرة، فبعد 8 يجي 10."},
  {q:"الأرنب أطول من الضفدع، والعصفور أقصر من الضفدع. منو الأقصر؟", vis:()=>[ART.rabbit(),ART.frog(),ART.bird()], opts:["الأرنب","الضفدع","العصفور"], a:2, hint:"رتّبيهم: منو أطول من منو؟", why:"الأرنب > الضفدع > العصفور، فالعصفور الأقصر."},
  {q:"عصفورين وأرنب واحد. كم رجل عندهم سوا؟", vis:()=>[ART.bird(),ART.bird(),ART.rabbit()], opts:["6","8","10"], a:1, hint:"العصفور على رجلين، والأرنب على أربع.", why:"2 + 2 + 4 = 8"},
  {q:"شنو يجي بعدين؟", vis:()=>[ART.mushroom(),ART.mushroom(),ART.starB(),ART.mushroom(),ART.mushroom(),ART.starB(),ART.mushroom(),"?"], opts:[ART.starB(),ART.mushroom(),ART.leaf()], a:1, svgOpts:true, hint:"عدّي كم فطر قبل كل نجمة.", why:"فطر، فطر، نجمة… وإحنا بعد فطر واحد، فالجاي فطر."},
  {q:`${CONFIG.companionName} يعبر الجسر بـ 4 خطوات. ${CONFIG.guestName} يحتاج ضعف خطوات ${CONFIG.companionName} وخطوتين زيادة. كم خطوة يحتاج ${CONFIG.guestName}؟`, vis:()=>[ART.jmFace(),ART.sumo()], opts:["8","10","12"], a:1, hint:"الضعف أولاً، بعدين زيدي 2.", why:"4 × 2 = 8، و 8 + 2 = 10"},
  {q:"1، 1، 2، 3، 5، 8… شنو الرقم الجاي؟", vis:()=>["1","1","2","3","5","8","?"], opts:["11","12","13"], a:2, hint:"كل رقم يساوي مجموع الرقمين اللي قبله.", why:"5 + 8 = 13"},
  {q:"أيلاف عدها 3 مشمشات، عدول أعطاها ضعفهم، وسومو أكل وحدة بالسر. كم صار عندها؟", vis:()=>[ART.apricot(),ART.apricot(),ART.apricot()], opts:["8","9","5"], a:0, hint:"3 + (3×2) وبعدين ناقص وحدة.", why:"3 + 6 = 9، وسومو أكل وحدة فصارت 8."},
  {q:"إذا البارحة جان الخميس، شنو بعد باچر؟", vis:()=>[ART.cloud()], opts:["الأحد","السبت","الجمعة"], a:0, hint:"اليوم = بعد الخميس. وبعد باچر = اليوم + يومين.", why:"اليوم الجمعة، باچر السبت، وبعد باچر الأحد."},
  {q:"شنو اللي يمشي بدون رجلين، ويبچي بدون عيون؟", vis:()=>[ART.cloud(),ART.cloud()], opts:["الغيمة","الساعة","النهر"], a:0, hint:"تشوفيها بالسما، ومن تبچي ننبلّ.", why:"الغيمة: تتحرك بالسما وتمطر."},
  {q:"شنو الشي اللي كلما أخذتي منه يكبر؟", vis:()=>[ART.stone()], opts:["الحفرة","الظل","النهر"], a:0, hint:"فكّري بالتراب: إذا شلتي منه شنو يصير؟", why:"الحفرة، كلما أخذتي منها تراب كبرت."}
];
function gLogic(sh){
  let idx=0, wrong=0, tries=0;
  function start(){ idx=0; wrong=0; drawQ(); }
  function upd(){ sh.stat(`اللغز ${idx+1} من ${LOGIC.length} — أخطاء: ${wrong}`); }
  function drawQ(){
    tries=0; upd(); sh.think(true);
    const p = LOGIC[idx];
    sh.body.innerHTML = `<div class="lg-card panel"><div class="progress" aria-hidden="true">${LOGIC.map((_,i)=>`<i class="${i<=idx?"on":""}"></i>`).join("")}</div>
      <p class="lg-q">${esc(p.q)}</p>
      <div class="lg-vis">${p.vis().map(x=>x.startsWith("<svg")?x:`<span class="qbox">${esc(x)}</span>`).join("")}</div>
      <div class="lg-opts">${shuffle(p.opts.map((o,i)=>[o,i])).map(([o,i],n)=>`<button class="lg-opt" data-o="${i}" aria-label="${p.svgOpts?["الخيار الأول","الخيار الثاني","الخيار الثالث"][n]:esc(o)}">${p.svgOpts?o:esc(o)}</button>`).join("")}</div>
      <div data-help></div>
      <div class="pad"><button class="btn ghost small" data-hint>${IC.bulb} تلميح</button><button class="btn ghost small" data-show hidden>${IC.eye} أظهري الحل</button></div></div>`;
    $$(".lg-opt",sh.body).forEach(b=>b.onclick=()=>answer(+b.dataset.o,b));
    $("[data-hint]",sh.body).onclick=()=>{ $("[data-help]",sh.body).innerHTML=`<div class="lg-hint">${esc(p.hint)}</div>`; };
    $("[data-show]",sh.body).onclick=()=>reveal(false);
  }
  function answer(i,b){
    const p=LOGIC[idx];
    if(i===p.a){ b.classList.add("right"); Sound.chime(); sh.cheer(); if(Math.random()<.6) sh.say(pick(["جعموص: هاي العبقرية منين؟!","سومو: آني جنت راح أگول نفس الجواب… والله","جعموص: ضيفي نجمة لدماغج","سومو حكّ راسه الأصلع وگال: صح!"])); reveal(true); }
    else { wrong++; tries++; upd(); b.classList.remove("wrong"); void b.offsetWidth; b.classList.add("wrong"); Sound.bump(); $("[data-show]",sh.body).hidden=false; if(tries===1) $("[data-help]",sh.body).innerHTML=`<div class="lg-hint">${esc(p.hint)}</div>`; }
  }
  function reveal(solved){
    const p=LOGIC[idx];
    $$(".lg-opt",sh.body).forEach((b,k)=>{ b.disabled=true; if(k===p.a) b.classList.add("right"); });
    const last = idx===LOGIC.length-1;
    $("[data-help]",sh.body).innerHTML = `<div class="lg-hint"><b>${solved?"صح!":"الحل:"}</b> ${esc(p.why)}</div><div class="pad" style="margin-top:10px"><button class="btn honey" data-next>${last?"خلّصنا":"اللغز التالي"}</button></div>`;
    $("[data-next]",sh.body).onclick=()=>{ if(last){ sh.think(false); sh.win(wrong,(a,b)=>a<b, wrong?`حلّيتي ${LOGIC.length} ألغاز بـ ${wrong} محاولة غلط.`:"حلّيتي كل الألغاز من أول محاولة!", wrong<=1?3:wrong<=4?2:1); } else { idx++; drawQ(); } };
    $("[data-next]",sh.body).focus();
  }
  sh.restart=start; sh.onRestart(start); start();
}

/* ---------- 6) bubbles ---------- */
function gBubbles(sh){
  sh.body.innerHTML = `<div class="stage bub-stage" style="background:linear-gradient(180deg,rgba(255,255,255,.3),rgba(142,195,207,.25))"><div class="stage-ov" data-ov><div class="panel"><h3 style="font-family:var(--font-d);margin:0 0 6px">ثلاث جولات قصيرة</h3><p style="margin:0 0 12px">كل جولة 16 فقاعة. اضغطي اللي تقدرين عليها، وماكو استعجال.</p><button class="btn honey" data-go>ابدئي</button></div></div></div>`;
  const stage=$(".stage",sh.body), ov=$("[data-ov]",sh.body);
  const kinds=[ART.starB(),ART.leaf(),ART.flower(),ART.butterfly(),ART.heart()];
  let bubs=[], raf=0, round=0, spawned=0, score=0, popped=0, spawnT=0, last=0, running=false, combo=0, lastPop=0, missed=0;
  const PER=16;
  function upd(){ sh.stat(`الجولة ${Math.min(round,3)||1} من 3 — النقاط: ${score}${combo>=3?` — ×${combo>=6?3:2}`:""}`); }
  function startRound(){ round++; spawned=0; spawnT=0; upd(); toast(`الجولة ${round}`, "star"); }
  function begin(){ ov.hidden=true; bubs.forEach(b=>b.el.remove()); bubs=[]; round=0; score=0; popped=0; missed=0; combo=0; running=true; startRound(); last=performance.now(); cancelAnimationFrame(raf); raf=requestAnimationFrame(loop); }
  function spawn(){
    const W=stage.clientWidth, Hh=stage.clientHeight, rr=Math.random(), sumo=rr<.07, gold=!sumo&&rr<.19, s=Math.round(sumo?84:54+Math.random()*34);
    const el=h(`<button class="bub ${gold?"gold":""} ${sumo?"sumo-b":""}" style="--s:${s}px" aria-label="فقاعة">${sumo?ART.sumo("happy"):gold?ART.starB():kinds[Math.floor(Math.random()*kinds.length)]}</button>`);
    const b={el, x:Math.random()*(W-s), y:Hh-s*.4, s, vy:(sumo?70:42+Math.random()*30)+round*8, ph:Math.random()*6, gold, sumo, dead:false};
    el.style.transform=`translate(${b.x}px,${b.y}px)`;
    el.addEventListener("pointerdown", e=>{ e.preventDefault(); pop(b); });
    el.addEventListener("keydown", e=>{ if(e.key==="Enter"||e.key===" "){ e.preventDefault(); pop(b); } });
    stage.appendChild(el); bubs.push(b); spawned++;
  }
  function pop(b){
    if(b.dead) return; b.dead=true; const now=performance.now(); combo = now-lastPop<900 ? combo+1 : 1; lastPop=now; const mult = combo>=6?3:combo>=3?2:1; const val=(b.sumo?5:b.gold?3:1)*mult; score += val; popped++; upd(); Sound.pop(); floatText(stage, b.x+b.s/2, b.y, (mult>1?`×${mult} `:"")+"+"+val, b.sumo?"#9A5C72":b.gold?"#B88F33":"#4E8E9C"); if(b.sumo) sh.say(pick(["سومو: لا تفقعيني! …ماشي، خمس نقاط","سومو طار وضحك","سومو: آني الفقاعة الأغلى"])); else if(combo===6) sh.say("جعموص: هاي إيد لو رشاش فقاعات؟");
    b.el.classList.add("pop"); b.el.style.transform += " scale(1.35)";
    if(motionOK()){ const cx=b.x+b.s/2, cy=b.y+b.s/2; for(let i=0;i<6;i++){ const sp=h(`<span class="spark" style="left:${cx}px;top:${cy}px;background:${["#E8C066","#B9A6DD","#8EC3CF","#E9A79E"][i%4]}"></span>`); stage.appendChild(sp); requestAnimationFrame(()=>{ const a=i/6*Math.PI*2; sp.style.transform=`translate(${Math.cos(a)*34}px,${Math.sin(a)*34}px)`; sp.style.opacity=0; }); setTimeout(()=>sp.remove(),520);} }
    if(Math.random()<.3) sh.cheer();
    setTimeout(()=>b.el.remove(), 260);
  }
  function loop(now){
    raf=requestAnimationFrame(loop);
    const dt=Math.min(.05,(now-last)/1000); last=now;
    spawnT-=dt; if(spawned<PER && spawnT<=0){ spawn(); spawnT=.75+Math.random()*.5; }
    const t=now/1000;
    bubs.forEach(b=>{ if(b.dead) return; b.y-=b.vy*dt; const sx = motionOK()? Math.sin(t*1.4+b.ph)*14 : 0; b.el.style.transform=`translate(${b.x+sx}px,${b.y}px)`; if(b.y<-b.s-10){ b.dead=true; b.el.remove(); missed++; combo=0; } });
    bubs = bubs.filter(b=>!b.dead || b.el.isConnected);
    if(spawned>=PER && bubs.every(b=>b.dead)){
      if(round<3) startRound();
      else { running=false; cancelAnimationFrame(raf); sh.win(score,(a,b)=>a>b, `جمعتي ${score} نقطة من ثلاث جولات، وطارت ${missed} فقاعة بس.`, score>=110?3:score>=70?2:1); }
    }
  }
  $("[data-go]",sh.body).onclick=begin;
  sh.restart=()=>{ cancelAnimationFrame(raf); bubs.forEach(b=>b.el.remove()); bubs=[]; running=false; ov.hidden=false; score=0; round=0; upd(); };
  sh.onRestart(sh.restart); upd();
  const vis=()=>{ if(document.hidden){ cancelAnimationFrame(raf); } else if(running){ last=performance.now(); raf=requestAnimationFrame(loop); } };
  document.addEventListener("visibilitychange",vis);
  return ()=>{ cancelAnimationFrame(raf); document.removeEventListener("visibilitychange",vis); };
}


/* ============ CAVE ============ */
function viewCave(root){
  const s=progress.stars;
  const done = id => !!progress.wins[id];
  const letterOpen = progress.stars >= (CONFIG.unlocks.find(u=>u.type==="letter")||{at:25}).at;
  const v=h(`<section class="view"><div class="world w-cave"><div class="world-deco" aria-hidden="true">${Array.from({length:22},()=>`<span class="ffly" style="left:${Math.random()*100}%;top:${Math.random()*100}%"></span>`).join("")}</div>
    <div class="cave">
      <div class="lantern panel"><div style="width:90px;flex:none">${ART.cave()}</div><div><div class="big">${s}</div><div>نجمة صداقة جمعتيها</div></div><div style="margin-inline-start:auto;width:90px">${ART.jaamous(s>=10?"happy":"idle")}</div></div>
      <div class="panel" style="padding:16px"><h3 style="font-family:var(--font-d);margin:0 0 10px">الزينة اللي تنفتح</h3><ul class="unlocks">${CONFIG.unlocks.map(u=>`<li class="${s>=u.at?"on":""}">${s>=u.at?IC.star:IC.lock}<span>${esc(u.label)}</span><span style="margin-inline-start:auto;font-weight:700">${s>=u.at?"مفتوح":u.at+" نجمة"}</span></li>`).join("")}</ul></div>
      <div class="panel" style="padding:16px"><h3 style="font-family:var(--font-d);margin:0 0 10px">تحديات الكهف</h3><ul class="achv">${CONFIG.gameOrder.map(g=>`<li class="${done(g)?"on":""}">${done(g)?IC.check:GAMES[g].icon()}<span>خلّصي «${esc(GAMES[g].title)}»</span>${done(g)?"":`<button class="btn small" style="margin-inline-start:auto" data-play="${g}">العبي</button>`}</li>`).join("")}</ul></div>
      <div class="panel" style="padding:16px"><h3 style="font-family:var(--font-d);margin:0 0 10px">أسرار الخريطة: ${progress.secrets.length} من ${SECRETS.length}</h3><ul class="secrets-list">${SECRETS.map(x=>progress.secrets.includes(x.id)?`<li>${x.art()}<span>${esc(x.msg)}</span></li>`:`<li>${IC.lock}<span>سر ما انكشف بعد</span><button class="btn ghost small" style="margin-inline-start:auto" data-hint="${x.id}">تلميح</button></li>`).join("")}</ul></div>
      <div class="panel" style="padding:16px"><h3 style="font-family:var(--font-d);margin:0 0 10px">رسالة الكهف</h3>${letterOpen?`<div class="letter">${esc(settings.secretLetter)}</div>`:`<p style="margin:0">الرسالة مقفولة. تنفتح عند ${(CONFIG.unlocks.find(u=>u.type==="letter")||{at:25}).at} نجمة — باقي ${Math.max(0,(CONFIG.unlocks.find(u=>u.type==="letter")||{at:25}).at-s)}.</p>`}</div>
    </div></div></section>`);
  root.appendChild(v);
  $$("[data-play]",v).forEach(b=>b.onclick=()=>go("game:"+b.dataset.play));
  $$("[data-hint]",v).forEach(b=>b.onclick=()=>{ const x=SECRETS.find(k=>k.id===b.dataset.hint); toast("دوّري "+x.hint,"bulb"); });
}


/* مسارات صفحة عالم أيلاف */
Object.assign(ROUTES, {
  open:{view:(r)=>viewIntro(r), title:()=>settings.siteTitle, bare:true},
  map:{view:(r)=>viewMap(r), title:()=>settings.siteTitle, parent:"open"},
  paint:{view:(r,id)=>viewPaint(r,id), title:()=>"مرسم الفطر", parent:"map"},
  diary:{view:(r)=>viewDiary(r), title:()=>"دفتر المذكرات", parent:"map"},
  cave:{view:(r)=>viewCave(r), title:()=>"الكهف المضيء", parent:"map"},
  jokes:{view:(r)=>viewJokes(r), title:()=>"صندوق النكت العبيطة", parent:"map"},
  game:{view:(r,id)=>viewGame(r,id), title:id=>GAMES[id]?GAMES[id].title:"", parent:"map"}
});
Object.assign(ROUTE_ALIAS, {intro:"open", hub:"map"});
