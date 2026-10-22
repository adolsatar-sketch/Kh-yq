/* ============ خباب ويقين: التعريف والتخصيص، وغرفة اللعب ويه صديق ============ */
function viewMeet(root){
  const v=h(`<section class="view meet"><div class="meet-wrap">
    <figure class="sheet-frame"><img src="${SHEET}" alt="لوحة شخصيتي خباب ويقين"><figcaption>اللوحة الأصلية لخباب ويقين</figcaption></figure>
    <div class="meet-side">
      ${["k","y"].map(w=>`<div class="meet-card panel" data-who="${w}"><div class="mc-head">${faceHTML(w,1,70)}<div><h3 style="color:${CH[w].color}">${CH[w].name}</h3><p>${w==="k"?"مبادر ومرح، دايماً أول واحد يركض للمغامرة ويضحّك الكل.":"فضولية وذكية، تلاحظ التفاصيل وتحل الألغاز قبل الكل."}</p></div></div>
        <div class="mc-stage">${kidFigure(w)}</div>
        <div class="mc-acts">${[["walk","يمشي"],["run","يركض"],["jump","يقفز"],["turn","يلتفت"],["happy","يفرح"],["surprise","يتفاجأ"],["wait","ينتظر"],["talk","يحچي"]].map(([a,l])=>`<button class="chip" data-act="${a}">${w==="y"?l.replace(/^ي/,"ت"):l}</button>`).join("")}</div>
        <div class="mc-custom"><label>أجنحة <select data-wing="${w}"><option value="">بدون</option>${Object.entries(WINGS).filter(([k])=>itemOpen(ITEMS.wings.find(i=>i.id===k))).map(([k,x])=>`<option value="${k}" ${KIDS_CUSTOM[w].wings===k?"selected":""}>${x.name}</option>`).join("")}</select></label><label>إكسسوار <select data-acc="${w}"><option value="">بدون</option>${Object.entries(ACCS).filter(([k])=>itemOpen(ITEMS.acc.find(i=>i.id===k))).map(([k,x])=>`<option value="${k}" ${KIDS_CUSTOM[w].acc===k?"selected":""}>${x.name}</option>`).join("")}</select></label><div class="mc-wcol" data-wc="${w}"><span>لون الأجنحة</span>${PALETTE.slice(0,10).map(col=>`<button class="swatch" data-col="${col}" style="background:${col}" aria-label="لون الأجنحة" aria-pressed="${(KIDS_CUSTOM[w].wcol||"")===col}"></button>`).join("")}</div></div>
      </div>`).join("")}
      <p class="d-note">التخصيص (أجنحة، لونها، وإكسسوار) يظهر بالخريطة والغرف والحكايات، واللوحة الأصلية تبقى مثل ما هي. الأجنحة والإكسسوارات الجديدة تنفتح بالنجوم والمهمات، والملابس الكاملة بقصر الأزياء.</p>
    </div></div></section>`);
  root.appendChild(v);
  $$(".meet-card",v).forEach(c=>{ const w=c.dataset.who; $$("[data-act]",c).forEach(b=>b.onclick=()=>{ const fig=$(".kidfig",c); kidAct(fig,b.dataset.act); if(b.dataset.act==="talk") { const s=$$(".say",c); s.forEach(x=>x.remove()); const bb=h(`<span class="say">${esc(pick(w==="k"?["يلا نركض!","آني أسرع واحد بالبلدة","منو يسابقني؟"]:["لحظة… لاحظتي هاي الورقة؟","عندي فكرة!","خلّي أشوف التلميح"]))}</span>`); $(".mc-stage",c).appendChild(bb); setTimeout(()=>bb.remove(),2500);} Sound.soft(); }); });
  const upd=(w)=>{ Store.set("kidsCustom",KIDS_CUSTOM); const st=$(`.meet-card[data-who="${w}"] .mc-stage`,v); st.innerHTML=kidFigure(w); };
  $$("[data-wing]",v).forEach(s=>s.onchange=()=>{ KIDS_CUSTOM[s.dataset.wing].wings=s.value; upd(s.dataset.wing); });
  $$("[data-acc]",v).forEach(s=>s.onchange=()=>{ KIDS_CUSTOM[s.dataset.acc].acc=s.value; upd(s.dataset.acc); });
  $$("[data-wc]",v).forEach(box=>{ const w=box.dataset.wc; $$("[data-col]",box).forEach(b=>b.onclick=()=>{ KIDS_CUSTOM[w].wcol=b.dataset.col; if(!KIDS_CUSTOM[w].wings){ const first=ITEMS.wings.find(i=>i.id!=="none"&&itemOpen(i)); if(first){ KIDS_CUSTOM[w].wings=first.id; const sel=$(`[data-wing="${w}"]`,v); if(sel) sel.value=first.id; } } $$("[data-col]",box).forEach(x=>x.setAttribute("aria-pressed",x===b)); upd(w); kidAct($(`.meet-card[data-who="${w}"] .kidfig`,v),"happy"); }); });
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
