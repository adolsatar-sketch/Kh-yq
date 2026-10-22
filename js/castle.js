/* ============ خباب ويقين: التعريف والتخصيص، وغرفة اللعب ويه صديق ============ */
/* شاشة التعريف: مشهد هادئ من العالم — الشخصيتين بالنص، تعريف قصير، وزر متابعة.
   الألوان والأجنحة بنافذة «تخصيص المظهر» منفصلة، وكل خيار يغيّر الشكل فعلاً. */
const KID_INTRO = {
  k:{trait:"مبادر ومرح", line:"أول واحد يركض للمغامرة، ويضحّك الكل حتى لو الطريق صعب.", says:["يلا نركض!","آني أسرع واحد بالقلعة","منو يسابقني؟","سمعتوا الساعة؟ تك تك!"], acts:["jump","run","happy","turn"]},
  y:{trait:"فضولية وذكية", line:"تلاحظ التفاصيل الصغيرة، وتحل الألغاز قبل الكل.", says:["لحظة… لاحظتوا هاي الورقة؟","عندي فكرة!","خلّوني أشوف التلميح","كل باب إله مفتاح"], acts:["turn","happy","surprise","wait"]}
};
function viewMeet(root){
  const v=h(`<section class="view meet2">
    <div class="mt-stage">
      <svg class="mt-bg" viewBox="0 0 1200 600" preserveAspectRatio="xMidYMax slice" aria-hidden="true"><defs><linearGradient id="mtsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2A4A43"/><stop offset="1" stop-color="#3B5C54"/></linearGradient></defs><rect width="1200" height="600" fill="url(#mtsky)"/>${P.castle(600,400,1.1,"#16302B")}<path d="M0 420Q300 360 600 410T1200 400V600H0Z" fill="#4D6A5F"/><path d="M0 480Q320 440 640 475T1200 470V600H0Z" fill="#A8B9A0"/><path d="M520 600Q580 520 600 480Q620 520 680 600Z" fill="#EAE3D2" opacity=".7"/>${P.lamp(170,420)}${P.lamp(1030,420)}</svg>
      <div class="mt-kids">${["k","y"].map(w=>`<div class="mt-kid mt-${w}" data-who="${w}"><span class="bubble" data-b></span><button class="mt-fig" aria-label="حرّكوا ${CH[w].name}">${kidFigure(w)}</button></div>`).join("")}</div>
    </div>
    <div class="mt-info">
      ${["k","y"].map(w=>`<div class="mt-card" data-card="${w}">${faceHTML(w,1,52)}<div><h3 style="color:${CH[w].color}">${CH[w].name} <small>${KID_INTRO[w].trait}</small></h3><p>${KID_INTRO[w].line}</p></div></div>`).join("")}
      <p class="d-note mt-tip">اضغطوا على خباب أو يقين حتى يتحركون.</p>
      <div class="mt-cta"><button class="btn honey" data-go>${IC.map} يلا للمغامرة</button><button class="btn ghost" data-custom>${IC.brush} تخصيص المظهر</button></div>
    </div></section>`);
  root.appendChild(v);
  const timers=[]; const at=(ms,f)=>timers.push(setTimeout(f,ms));
  const say=(w,t)=>{ const b=$(`.mt-${w} [data-b]`,v); b.textContent=t; b.classList.add("on"); clearTimeout(b._t); b._t=setTimeout(()=>b.classList.remove("on"),2200); };
  const turn={k:0,y:0};
  $$(".mt-fig",v).forEach(btn=>btn.onclick=()=>{ const w=btn.closest("[data-who]").dataset.who, I=KID_INTRO[w], i=turn[w]++%I.acts.length; kidAct($(".kidfig",btn), I.acts[i]); say(w, I.says[i]); Sound.soft(); });
  // دخول هادئ: كل واحد يمشي لمكانه، بعدين يعرّف بنفسه
  if(motionOK()){ v.classList.add("enter"); at(60,()=>v.classList.add("in")); at(900,()=>{ kidAct($(".mt-k .kidfig",v),"happy"); say("k","آني خباب!"); }); at(1900,()=>{ kidAct($(".mt-y .kidfig",v),"turn"); say("y","وآني يقين. أهلاً بكم!"); }); }
  $("[data-go]",v).onclick=()=>sceneLeave(null,()=>go("world"));
  $("[data-custom]",v).onclick=()=>customizeBox(()=>{ $$(".mt-fig",v).forEach(b=>{ const w=b.closest("[data-who]").dataset.who; b.innerHTML=kidFigure(w); }); });
  return ()=>timers.forEach(clearTimeout);
}
/* تخصيص المظهر: خيارات صغيرة معنونة، تنحفظ وتظهر بالخريطة والغرف والحكايات */
const WING_COLORS = [["#F5F0E3","عاجي"],["#A8B9A0","ميرمية"],["#B88A5A","نحاسي"],["#C97964","مرجاني"],["#203A35","صنوبري"],["#A9C6C8","سماوي"],["#D7B58C","ذهبي هادئ"],["#C9C3DA","بنفسجي فاتح"]];
function customizeBox(onChange){
  let who="y";
  const md=modal(`<h2>تخصيص المظهر</h2><div class="seg cz-who"><button data-w="k">${faceHTML("k",0,28)} خباب</button><button data-w="y">${faceHTML("y",0,28)} يقين</button></div><div class="cz" data-body></div>`, {wide:true, cls:"cz-modal"});
  const body=$("[data-body]",md.el);
  const draw=()=>{
    const c=KIDS_CUSTOM[who];
    const wings=ITEMS.wings.filter(i=>i.id!=="none"), accs=ITEMS.acc.filter(i=>i.id!=="none");
    const openW=wings.filter(itemOpen), openA=accs.filter(itemOpen), locked=wings.length+accs.length-openW.length-openA.length;
    $$("[data-w]",md.el).forEach(b=>b.setAttribute("aria-pressed",b.dataset.w===who));
    body.innerHTML=`<div class="cz-prev">${kidFigure(who)}</div><div class="cz-opts">
      <fieldset><legend>الأجنحة</legend><div class="cz-chips"><button data-wing="" aria-pressed="${!c.wings}">بدون</button>${openW.map(i=>`<button data-wing="${i.id}" aria-pressed="${c.wings===i.id}">${esc(i.n)}</button>`).join("")}</div></fieldset>
      ${c.wings?`<fieldset><legend>لون الأجنحة</legend><div class="cz-colors">${WING_COLORS.map(([col,n])=>`<button data-col="${col}" aria-pressed="${(c.wcol||"")===col}" aria-label="${n}"><i style="background:${col}"></i><small>${n}</small></button>`).join("")}</div></fieldset>`:""}
      <fieldset><legend>إكسسوار</legend><div class="cz-chips"><button data-acc="" aria-pressed="${!c.acc}">بدون</button>${openA.map(i=>`<button data-acc="${i.id}" aria-pressed="${c.acc===i.id}">${esc(i.n)}</button>`).join("")}</div></fieldset>
      ${locked?`<p class="d-note">${locked} خيارات بعدها مقفولة — تنفتح بنجوم الألعاب ومهمات العالم. الملابس الكاملة بقصر الأزياء.</p>`:""}</div>`;
    const save=()=>{ Store.set("kidsCustom",KIDS_CUSTOM); draw(); onChange&&onChange(); kidAct($(".cz-prev .kidfig",body),"happy"); Sound.pop(); };
    $$("[data-wing]",body).forEach(b=>b.onclick=()=>{ c.wings=b.dataset.wing; save(); });
    $$("[data-col]",body).forEach(b=>b.onclick=()=>{ c.wcol=b.dataset.col; save(); });
    $$("[data-acc]",body).forEach(b=>b.onclick=()=>{ c.acc=b.dataset.acc; save(); });
  };
  $$("[data-w]",md.el).forEach(b=>b.onclick=()=>{ who=b.dataset.w; draw(); });
  draw();
}

function viewLobby(root){
  const me=Party.me;
  const v=h(`<section class="view lobby"><div class="lobby-wrap">
    <h2 class="w-title">العب مع صديق</h2><p class="w-sub">كل واحد يفتح الموقع من جهازه. واحد يفتح غرفة، والثاني يدخل بالرمز أو الرابط. ما نحتاج حساب — اسم مستعار يكفي.</p>
    <div class="panel lb-me"><div class="field"><label for="nick">اسمك المستعار</label><input id="nick" maxlength="20" value="${esc(me.name)}" placeholder="مثلاً: ورقة ذهبية"></div>
      <div class="field"><label>شخصيتك</label><div class="seg" data-ch><button data-c="k">${faceHTML("k",0,30)} خباب</button><button data-c="y">${faceHTML("y",0,30)} يقين</button></div></div></div>
    <div class="lb-actions" data-actions>
      <div class="panel lb-box"><h3>أنشئ غرفة</h3><p>نولّد رمز ورابط تدزّه لصديقك.</p><button class="btn honey" data-create>أنشئ غرفة</button></div>
      <div class="panel lb-box"><h3>ادخل غرفة</h3><div class="lb-join"><input data-code maxlength="5" placeholder="الرمز" aria-label="رمز الغرفة" autocomplete="off" autocapitalize="characters"><button class="btn" data-join>ادخل</button></div></div>
    </div>
    <div class="panel lb-room" data-room hidden></div>
    <p class="lb-err" data-err role="alert"></p>
    <details class="panel lb-help"><summary>شلون يشتغل اللعب عن بعد؟</summary><p>كل واحد يفتح الموقع من جهازه ومن مكانه. اللي يفتح الغرفة ياخذ رمز من 5 حروف ورابط؛ يدزه لصاحبه (رسالة، واتساب…). صاحبه يفتح الرابط أو يكتب الرمز. ما نطلب حساب ولا بيانات — اسم مستعار بس. إذا انقطع واحد، مقعده يبقى محجوز دقيقتين ويرجع لنفس الجولة. الغرفة تنتهي إذا ظلت فارغة.</p></details>
  </div></section>`);
  root.appendChild(v);
  const nick=$("#nick",v), err=$("[data-err]",v), room=$("[data-room]",v);
  const setChar=c=>{ me.char=c; Party.saveMe(); $$("[data-ch] button",v).forEach(b=>b.setAttribute("aria-pressed",b.dataset.c===c)); };
  setChar(me.char||"y");
  $$("[data-ch] button",v).forEach(b=>b.onclick=()=>{ if(Party.connected() && Party.other && Party.other.char===b.dataset.c){ toast("صاحبك اختار هاي الشخصية","bulb"); return; } setChar(b.dataset.c); if(Party.connected()) Party.send({t:"hello",name:me.name,char:me.char}); draw(); });
  nick.oninput=()=>{ me.name=nick.value.trim().slice(0,20); Party.saveMe(); };
  const q=new URLSearchParams(location.search).get("room"); if(q && Party.state==="off") $("[data-code]",v).value=q.toUpperCase();
  const needName=()=>{ if(!me.name){ me.name = CH[me.char].name+" "+Math.floor(10+Math.random()*89); nick.value=me.name; Party.saveMe(); } };
  $("[data-create]",v).onclick=async()=>{ needName(); err.textContent=""; await Party.create(); draw(); };
  $("[data-join]",v).onclick=async()=>{ needName(); err.textContent=""; await Party.join($("[data-code]",v).value); draw(); };
  $("[data-code]",v).onkeydown=e=>{ if(e.key==="Enter") $("[data-join]",v).click(); };
  function draw(){
    const st=Party.state; $$("[data-ch] button",v).forEach(b=>b.setAttribute("aria-pressed",b.dataset.c===me.char));
    $("[data-actions]",v).hidden = st!=="off" && st!=="error";
    err.textContent = st==="error" ? Party.lastErr : "";
    if(st==="off"||st==="error"){ room.hidden=true; return; }
    room.hidden=false;
    const other=Party.other, mine=me.char, theirs=other?other.char:(mine==="k"?"y":"k");
    const label={opening:"نفتح الغرفة…", waiting:"بانتظار صديقك يدخل", joining:"ندخل الغرفة…", connected:"متصلين", reconnecting:(Party.lastErr||"نعيد الاتصال…")+" خلّوا الصفحة مفتوحة", lost:Party.lastErr||"انقطع الاتصال"}[st]||st;
    room.innerHTML=`<div class="lb-status" data-s="${st}"><i></i>${label}${{relay:" · عبر خادم اللعب",claude:" · عبر Claude",peer:" · اتصال مباشر"}[Party.transport]||""}</div>
      ${Party.code?`<div class="lb-code"><span>رمز الغرفة</span><b>${Party.code}</b><div class="row" style="margin:0;justify-content:center"><button class="btn small" data-copy>${IC.save} انسخ الرابط</button>${navigator.share?`<button class="btn ghost small" data-share>شارك</button>`:""}</div></div>`:""}
      <div class="lb-pair"><div class="lb-p">${kidFigure(mine)}<b>${esc(me.name||"أنت")}</b><small>${Party.ready.me?"جاهز":"مو جاهز بعد"}</small></div>
        <div class="lb-vs">×</div>
        <div class="lb-p ${other?"":"ghost"}">${kidFigure(theirs)}<b>${other?esc(other.name):"…"}</b><small>${other?(Party.ready.other?"جاهز":"مو جاهز بعد"):"ما دخل بعد"}</small></div></div>
      <div class="row" style="justify-content:center"><button class="btn ${Party.ready.me?"ghost":"honey"}" data-ready ${st!=="connected"?"disabled":""}>${Party.ready.me?"إلغاء الجاهزية":"آني جاهز"}</button><button class="btn ghost" data-leave>اطلع من الغرفة</button></div>
      ${st==="connected"?`<h3 class="lb-pick-h">${Party.isHost?"اختر اللعبة":"صاحب الغرفة يختار اللعبة"}</h3><div class="lb-games">${Object.entries(KG).filter(([k,g])=>g.duo).map(([k,g])=>`<button class="lb-game" data-g="${k}" ${Party.isHost&&Party.ready.me&&Party.ready.other?"":"disabled"}>${g.icon?g.icon():""}<b>${esc(g.title)}</b></button>`).join("")}<button class="lb-game" data-g="draw" ${Party.isHost&&Party.ready.me&&Party.ready.other?"":"disabled"}>${ART.book("#2F5E57")}<b>رسم مشترك</b></button><button class="lb-game" data-g="show" ${Party.isHost&&Party.ready.me&&Party.ready.other?"":"disabled"}>${ART.butterfly("#E9A79E","#E8C066")}<b>عرض الأزياء المشترك</b></button><button class="lb-game" data-g="tales" ${Party.isHost&&Party.ready.me&&Party.ready.other?"":"disabled"}>${ART.book("#7A2E2A")}<b>حكاية مشتركة</b></button></div>${Party.isHost&&!(Party.ready.me&&Party.ready.other)?'<p class="d-note">لازم الاثنين يضغطون «جاهز» حتى تنفتح الألعاب.</p>':""}`:""}`;
    const cp=$("[data-copy]",room); if(cp) cp.onclick=async()=>{ try{ await navigator.clipboard.writeText(Party.link()); toast("انتسخ الرابط","check"); }catch(e){ prompt("انسخ الرابط:", Party.link()); } };
    const sh=$("[data-share]",room); if(sh) sh.onclick=()=>navigator.share({title:"مغامرات خباب ويقين", text:"تعال نلعب! رمز الغرفة: "+Party.code, url:Party.link()}).catch(()=>{});
    $("[data-ready]",room).onclick=()=>{ Party.setReady(!Party.ready.me); draw(); };
    $("[data-leave]",room).onclick=()=>{ Party.leave(); draw(); };
    $$("[data-g]",room).forEach(b=>b.onclick=()=>{ const g=b.dataset.g; if(g==="tales"){ toast("اختاروا كتاب، وصاحبك يدخل وياكم","bulb"); go("tales"); return; } Party.game=g; Party.send({t:"start", game:g}); go(g==="draw"?"draw":g==="show"?"show":"play:"+g); });
  }
  const offs=[Party.on("status",draw), Party.on("ready",draw), Party.on("hello",draw)];
  draw();
  return ()=>offs.forEach(f=>f());
}
// non-play start routes for guest


Object.assign(ROUTES, {
  lobby:{view:r=>viewLobby(r), title:()=>"العب مع صديق", parent:"world"},
  play:{view:(r,id)=>viewPlay(r,id), title:id=>KG[id]?KG[id].title:"", parent:"world"}
});
