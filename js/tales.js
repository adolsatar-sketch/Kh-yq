/* ============ حكاياتنا: playable tales ============ */
const SCN = {
  sky:(a="#F6C98B",b="#F3E6C8")=>`<defs><linearGradient id="sk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient></defs><rect width="1600" height="900" fill="url(#sk)"/>`,
  hills:(c1="#C98A4A",c2="#A86A38")=>`<path d="M0 640Q300 540 620 620T1240 600T1600 620V900H0Z" fill="${c1}"/><path d="M0 720Q400 640 820 720T1600 700V900H0Z" fill="${c2}"/>`,
  tree:(x=300)=>`<path d="M${x} 900V420" stroke="#5A3A24" stroke-width="70"/><path d="M${x} 560l-120-90M${x} 520l130-110" stroke="#5A3A24" stroke-width="30" stroke-linecap="round"/><circle cx="${x-120}" cy="380" r="150" fill="#C8552B"/><circle cx="${x+60}" cy="300" r="190" fill="#D9A53A"/><circle cx="${x+190}" cy="420" r="140" fill="#B33A26"/>`,
  house:(x=330,y=250)=>`<rect x="${x-80}" y="${y}" width="160" height="120" fill="#E7C99A" stroke="#5A3A24" stroke-width="8"/><path d="M${x-100} ${y}L${x} ${y-80}L${x+100} ${y}Z" fill="#7A2E2A" stroke="#5A3A24" stroke-width="8"/><rect x="${x-20}" y="${y+50}" width="40" height="70" fill="#5A3A24"/><rect x="${x+34}" y="${y+24}" width="30" height="30" fill="#FFD27A"/>`,
  clouds:()=>`<g fill="#FFF8EA" opacity=".9"><ellipse cx="1100" cy="180" rx="140" ry="50"/><ellipse cx="1180" cy="150" rx="90" ry="60"/><ellipse cx="500" cy="120" rx="110" ry="40"/></g>`,
  station:()=>`<rect x="200" y="380" width="1200" height="30" fill="#5A3A24"/><rect x="240" y="410" width="20" height="230" fill="#5A3A24"/><rect x="1340" y="410" width="20" height="230" fill="#5A3A24"/><path d="M160 380L800 250L1440 380Z" fill="#7A2E2A"/><circle cx="800" cy="330" r="46" fill="#F3E6C8" stroke="#3A2A1C" stroke-width="8"/><path d="M800 330V300M800 330L822 342" stroke="#3A2A1C" stroke-width="6"/><path d="M0 760H1600M0 800H1600" stroke="#3A2A1C" stroke-width="10"/>${Array.from({length:20},(_,i)=>`<rect x="${i*84}" y="752" width="20" height="56" fill="#6B4A2E"/>`).join("")}<g transform="translate(980 560)"><rect width="380" height="170" rx="20" fill="#2F5E57"/><rect x="20" y="20" width="70" height="60" fill="#FFD27A"/><rect x="110" y="20" width="70" height="60" fill="#FFD27A"/><rect x="200" y="20" width="70" height="60" fill="#FFD27A"/><circle cx="80" cy="180" r="34" fill="#3A2A1C"/><circle cx="300" cy="180" r="34" fill="#3A2A1C"/><rect x="290" y="-60" width="40" height="70" fill="#3A2A1C"/></g>`,
  city:(grey)=>`${[[120,420,200,300],[360,360,180,360],[580,440,220,280],[840,330,200,390],[1080,410,180,310],[1300,370,220,350]].map(([x,y,w,hh],i)=>`<rect x="${x}" y="${y}" width="${w}" height="${hh}" fill="${grey?"#A8A39A":["#E9A79E","#8EC3CF","#E8C066","#B9A6DD","#9DBF8E","#D9725F"][i]}" stroke="#4A4540" stroke-width="6"/>${[0,1].map(r=>[0,1].map(c=>`<rect x="${x+30+c*(w-90)}" y="${y+40+r*90}" width="40" height="50" fill="${grey?"#7D786F":"#FFF2C8"}"/>`).join("")).join("")}`).join("")}<path d="M0 720Q400 690 800 740T1600 720V900H0Z" fill="${grey?"#6E6A64":"#4E6A9C"}"/>`,
  sea:()=>`<rect y="560" width="1600" height="340" fill="#4E7FA0"/><path d="M0 600q50-20 100 0t100 0t100 0t100 0t100 0t100 0t100 0t100 0t100 0t100 0t100 0t100 0t100 0t100 0t100 0t100 0" stroke="#BFE0EC" stroke-width="6" fill="none"/><path d="M1240 560L1270 220H1350L1380 560Z" fill="#F3E6C8" stroke="#3A2A1C" stroke-width="8"/><path d="M1255 360h110M1262 460h96" stroke="#B5482A" stroke-width="40"/><rect x="1260" y="170" width="100" height="60" fill="#FFD27A" stroke="#3A2A1C" stroke-width="8"/><path d="M1250 170L1310 120L1370 170Z" fill="#7A2E2A"/>`,
  library:()=>`<rect width="1600" height="900" fill="#4A2E22"/>${[0,1,2,3].map(r=>`<rect x="80" y="${120+r*180}" width="1440" height="20" fill="#2B1A12"/>`+Array.from({length:30},(_,i)=>`<rect x="${90+i*47}" y="${40+r*180}" width="${36+((i*7)%10)}" height="${80+((i*13)%20)}" fill="${["#7A2E2A","#2F5E57","#D9A53A","#3E4A7A","#B5482A","#5B7F4A"][(i+r)%6]}" stroke="#1E120C" stroke-width="3"/>`).join("")).join("")}<rect y="780" width="1600" height="120" fill="#6B4A2E"/>`
};
const T_ICONS = {leaf:()=>ART.maple("#C8552B"), cloud:()=>ART.cloud(), star:()=>ART.starB(), key:()=>ART.key(), lantern:()=>ART.lantern(), ticket:()=>ART.ticket(), bird:()=>ART.paperBird(), gear:()=>ART.gear()};
const COLOR_DOT = c=>`<svg viewBox="0 0 40 40"><circle cx="20" cy="20" r="16" fill="${c}" stroke="#3A2A1C" stroke-width="3"/></svg>`;
const clockSVG = (hh,mm)=>{ const ha=(hh%12)*30+mm/2, ma=mm*6; return `<svg viewBox="0 0 80 80"><circle cx="40" cy="40" r="34" fill="#F3E6C8" stroke="#3A2A1C" stroke-width="4"/>${Array.from({length:12},(_,i)=>`<path d="M40 9v5" stroke="#3A2A1C" stroke-width="3" transform="rotate(${i*30} 40 40)"/>`).join("")}<path d="M40 40V22" stroke="#3A2A1C" stroke-width="5" stroke-linecap="round" transform="rotate(${ha} 40 40)"/><path d="M40 40V12" stroke="#B5482A" stroke-width="3" stroke-linecap="round" transform="rotate(${ma} 40 40)"/><circle cx="40" cy="40" r="3" fill="#3A2A1C"/></svg>`; };
const TALEBOOK = [
  {id:"treehouse", title:"البيت اللي فوق الشجرة", color:"#7A2E2A", chapters:[
    {title:"الرسالة اللي تتحرك", scene:()=>SCN.sky()+SCN.clouds()+SCN.hills()+SCN.tree(320)+SCN.house(330,240), steps:[
      {d:[["k",1,"يقين! شوفي، ورقة تطير وحدها فوق البيت!"],["y",2,"مو ورقة… رسالة ممزّقة. لازم نلگى قطعها الثلاث."]]},
      {p:"find", q:"دوّري على 3 قطع من الرسالة بالمشهد", items:[[12,70],[63,30],[88,78]], art:()=>`<svg viewBox="0 0 40 40"><path d="M4 6h28l4 6-3 22H6z" fill="#F7EEDC" stroke="#8C5A2B" stroke-width="2"/><path d="M10 14h18M10 20h14M10 26h16" stroke="#B5482A" stroke-width="2"/></svg>`},
      {d:[["y",1,"جمّعتها! مكتوب: «اتبعوا الخريطة، والرمز: ورقة، غيمة، نجمة، ورقة»."],["k",1,"حفظتها! يلا نلگى الخريطة."]]}
    ]},
    {title:"الخريطة", scene:()=>SCN.sky("#EBB57A")+SCN.clouds()+SCN.hills("#B87A44","#8E5A30")+SCN.tree(1250), steps:[
      {d:[["k",0,"الخريطة بيها أماكن بس ما بيها ترتيب."],["y",2,"نرتبها حسب الطريق: نبدي من الشجرة."]]},
      {p:"order", q:"رتّبي محطات الطريق من البداية للنهاية", items:[["الشجرة الكبيرة","leaf"],["النهر","cloud"],["التلة الذهبية","star"],["جسر الغيوم","bird"]]},
      {d:[["y",1,"صح! الطريق يوصل لجسر الغيوم."],["k",1,"آني أوصل أول! …لا لا، سوا."]]}
    ]},
    {title:"جسر الغيوم", scene:()=>SCN.sky("#F2B07A","#FBE3C8")+`<path d="M200 520Q800 380 1400 520" stroke="#FFF8EA" stroke-width="60" fill="none" stroke-linecap="round"/>`+SCN.clouds(), steps:[
      {d:[["y",0,"الجسر مقفول. بيه قفل رموز."],["k",2,"الرمز اللي بالرسالة… شنو جان؟"]]},
      {p:"symbols", q:"ادخلي الرمز اللي جان بالرسالة", seq:["leaf","cloud","star","leaf"], keys:["leaf","cloud","star","key"]},
      {d:[["k",1,"انفتح! والبيت فوق الشجرة صار بيه شبّاك جديد."],["y",1,"وهاي أول حكاية ننهيها سوا."]]}
    ]}
  ]},
  {id:"train", title:"قطار الساعة اللي نسى الوقت", color:"#2F5E57", chapters:[
    {title:"تذاكر ممزقة", scene:()=>SCN.sky("#E9C9A0")+SCN.station(), steps:[
      {d:[["y",2,"التذاكر كلها انشگت نصين!"],["k",1,"نجمع كل نص ويه نصه بالرقم."]]},
      {p:"match", q:"طابقي كل نص تذكرة ويه نصه", pairs:[["١","1"],["٢","2"],["٣","3"],["٤","4"]]},
      {d:[["k",1,"التذاكر رجعت! بس القطار ما يتحرك."],["y",0,"اسمع… صافرته تعزف لحن ناقص."]]}
    ]},
    {title:"الأصوات", scene:()=>SCN.sky("#D9B98A")+SCN.station(), steps:[
      {p:"notes", q:"اسمعي (أو شوفي) اللحن وعيديه بنفس الترتيب", seq:[0,2,1,3,2]},
      {d:[["y",1,"الصافرة رجعت تعزف!"],["k",2,"بس الساعة الكبيرة واقفة…"]]}
    ]},
    {title:"الساعة المتوقفة", scene:()=>SCN.sky("#C9A07A")+SCN.station(), steps:[
      {d:[["y",2,"مكتوب تحت الساعة: «القطار يطلع لما العقربين يتلاگون فوگ»."]]},
      {p:"choice", q:"وين نوگف عقارب الساعة؟", opts:[{h:clockSVG(12,0),ok:1},{h:clockSVG(6,30),r:"العقربين تحت مو فوگ"},{h:clockSVG(3,0),r:"العقرب الصغير على اليمين"}]},
      {d:[["k",1,"تووووت! القطار تذكّر الوقت!"],["y",1,"وتذكرتنا محفوظة بجيبي."]]}
    ]}
  ]},
  {id:"colors", title:"مدينة الألوان اللي نامت", color:"#B5482A", chapters:[
    {title:"الألوان الضايعة", scene:()=>SCN.sky("#CFCAC0","#E6E2DA")+SCN.city(true), steps:[
      {d:[["k",2,"ليش المدينة كلها رمادي؟"],["y",0,"الألوان نامت. نرجّع كل لون لمكانه."]]},
      {p:"match", q:"طابقي كل شي ويه لونه", pairs:[["الشمس",COLOR_DOT("#E8C066")],["العشب",COLOR_DOT("#5B7F4A")],["البحر",COLOR_DOT("#3E6FA0")],["الفراولة",COLOR_DOT("#C8352B")]], html:true},
      {d:[["y",1,"شوفي! أول بيت صحى."]]}
    ]},
    {title:"نهر الحبر", scene:()=>SCN.sky("#D9D3C6")+SCN.city(true)+`<path d="M0 820Q400 780 800 830T1600 810" stroke="#2B2B5A" stroke-width="70" fill="none"/>`, steps:[
      {d:[["k",0,"نهر حبر! لازم نعبر على الحجار الملونة بترتيب قوس قزح."]]},
      {p:"symbols", q:"اعبري الحجار بترتيب قوس قزح (أحمر ← بنفسجي)", seq:["r","o","y","g","b","p"], keys:["g","r","p","y","b","o"], colors:{r:"#C8352B",o:"#E08A2E",y:"#E8C066",g:"#5B7F4A",b:"#3E6FA0",p:"#7A5AA0"}},
      {d:[["y",1,"عبرنا! والنهر صار يلمع."]]}
    ]},
    {title:"اللوحة الجماعية", scene:()=>SCN.sky()+SCN.city(false), steps:[
      {d:[["y",2,"المدينة تحتاج لوحة كبيرة حتى تصحى كلها."],["k",1,"نرسمها سوا!"]]},
      {p:"draw", q:"ارسمي شي يصحّي المدينة — بيت، شمس، أي شي"},
      {d:[["k",1,"المدينة صحت كلها! والبيوت تصفّگ."],["y",1,"لوحتنا صارت على أكبر جدار."]]}
    ]}
  ]},
  {id:"lighthouse", title:"منارة آخر غيمة", color:"#3E4A7A", chapters:[
    {title:"القارب الورقي", scene:()=>SCN.sky("#9FB7D0","#E6EEF2")+SCN.sea(), steps:[
      {d:[["k",0,"المنارة بعيدة… نحتاج قارب."],["y",1,"نسوي قارب ورقي! بس لازم نطوي بالترتيب."]]},
      {p:"order", q:"رتّبي خطوات طي القارب", items:[["طوي الورقة نص","ticket"],["طوي الزوايا لجوّا","leaf"],["رفع الأطراف","bird"],["فتح القارب","star"]]},
      {d:[["y",1,"القارب يطفو!"]]}
    ]},
    {title:"مرايا الضوء", scene:()=>SCN.sky("#3E4A7A","#7A86A8")+SCN.sea(), steps:[
      {d:[["y",2,"ضوء المنارة طافي. المرايا مكسورة الاتجاه."],["k",1,"ندوّرها لحد ما الضوء يوصل!"]]},
      {p:"mirrors", q:"اضغطي على كل مرآة حتى توجّه الضوء للمنارة", n:4},
      {d:[["k",1,"المنارة ضوّت!"]]}
    ]},
    {title:"الغيمة الصغيرة", scene:()=>SCN.sky("#F6C98B")+SCN.clouds()+SCN.sea(), steps:[
      {d:[["y",0,"هاي آخر غيمة… ضايعة وما تعرف ترجع لأهلها."],["k",1,"ننفخها لحد المنارة!"]]},
      {p:"tap", q:"اضغطي على الغيمة حتى توصل للمنارة", n:10},
      {d:[["y",1,"رجعت لأهلها، وصارت تمطر ورد صغير."],["k",1,"أحلى مطر بالعالم."]]}
    ]}
  ]},
  {id:"library", title:"مكتبة الحكايات الناقصة", color:"#5B7F4A", chapters:[
    {title:"كتب بلا نهايات", scene:()=>SCN.library(), steps:[
      {d:[["y",2,"كل الكتب هنا نهاياتها ضايعة!"],["k",1,"الصفحات الأخيرة مخبّاة بين الرفوف."]]},
      {p:"find", q:"دوّري على 4 صفحات مخبّاة بين الرفوف", items:[[9,22],[71,42],[35,62],[90,82]], art:()=>`<svg viewBox="0 0 40 40"><path d="M6 4h22l6 6v26H6z" fill="#FFF7E6" stroke="#8C5A2B" stroke-width="2"/><path d="M11 14h18M11 20h18M11 26h12" stroke="#7A2E2A" stroke-width="2"/></svg>`},
      {d:[["k",1,"لگيناها كلها!"]]}
    ]},
    {title:"جمع التفاصيل", scene:()=>SCN.library(), steps:[
      {d:[["y",0,"المكتبة تسألنا عن مغامراتنا حتى ترجّع الصفحات."]]},
      {p:"choice", q:"شنو جان رمز جسر الغيوم؟", opts:[{t:"ورقة، غيمة، نجمة، ورقة",ok:1},{t:"نجمة، ورقة، غيمة",r:"قريبة… بس الترتيب غلط"},{t:"مفتاح، نجمة، فانوس",r:"لا، هذا مو رمزنا"}]},
      {p:"choice", q:"متى يطلع قطار الساعة؟", opts:[{t:"الساعة 6:30",r:"لا، العقربين جانوا تحت"},{t:"الساعة 12 بالضبط",ok:1},{t:"الساعة 3",r:"مو هيچ"}]},
      {d:[["k",1,"المكتبة رجّعت كل الصفحات!"]]}
    ]},
    {title:"نهايتنا", scene:()=>SCN.library(), steps:[
      {d:[["y",1,"بقى كتاب واحد… كتابنا. نهايته نكتبها إحنا."],["k",1,"ونرسم نهايته سوا!"]]},
      {p:"draw", q:"ارسمي نهاية الكتاب", write:"واكتبي سطر النهاية"},
      {d:[["y",1,"صارت أحلى نهاية. انحفظت بدفترنا."],["k",1,"والمكتبة صارت مكتملة!"]]}
    ]}
  ]}
];
function taleProg(){ return Store.get("tales",{}); }
function viewTales(root){
  const pr=taleProg();
  const v=h(`<section class="view tales"><div class="tl-wrap"><h2 class="w-title">حكاياتنا</h2><p class="w-sub">اختاري كتاب. كل حكاية ثلاث فصول، والتقدّم ينحفظ.</p>
    <div class="shelf">${TALEBOOK.map(t=>{ const done=pr[t.id]||0; return `<button class="tbook" data-t="${t.id}" style="--bc:${t.color}"><span class="tb-cover"><span class="tb-title">${esc(t.title)}</span><span class="tb-prog">${[0,1,2].map(i=>`<i class="${i<done?"on":""}"></i>`).join("")}</span></span></button>`; }).join("")}</div>
    <div class="tl-kids">${kidFigure("k")}${kidFigure("y")}</div></div>${leafLayer(6,"soft")}</section>`);
  root.appendChild(v);
  $$("[data-t]",v).forEach(b=>b.onclick=()=>{ if(motionOK()){ b.classList.add("opening"); Sound.flip(); setTimeout(()=>go("tale:"+b.dataset.t),700); } else go("tale:"+b.dataset.t); });
}
function viewTale(root, id){
  const T=TALEBOOK.find(t=>t.id===id); if(!T){ go("tales"); return; }
  const pr=taleProg(); let ch=Math.min(pr[id]||0, 2);
  const v=h(`<section class="view tale"><div class="tale-scene"><svg class="tale-bg" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" data-bg></svg><div class="tale-props" data-props></div><div class="tale-kids">${kidFigure("k")}${kidFigure("y")}</div>${leafLayer(5,"soft")}</div>
    <div class="tale-ui"><div class="tale-chs">${T.chapters.map((c,i)=>`<button class="chip" data-ch="${i}" ${i>(pr[id]||0)?"disabled":""}>${i+1}. ${esc(c.title)}</button>`).join("")}</div><div class="tale-task panel" data-task hidden></div></div></section>`);
  root.appendChild(v);
  const task=$("[data-task]",v), props=$("[data-props]",v), kids=$$(".tale-kids .kidfig",v);
  let dlgRef=null;
  const kidOf=w=>kids[w==="k"?0:1];
  function runChapter(i){
    ch=i; const C=T.chapters[i]; $("[data-bg]",v).innerHTML=C.scene(); props.innerHTML=""; task.hidden=true;
    $$("[data-ch]",v).forEach(b=>b.setAttribute("aria-pressed", +b.dataset.ch===i));
    kids.forEach((k,j)=>kidAct(k, j?"walk":"run"));
    let s=0; const next=()=>{ if(s>=C.steps.length){ done(); return; } const st=C.steps[s++]; if(st.d) { const lines=st.d; let li=0; dlgRef=dialogue(v, lines, next); kidAct(kidOf(lines[0][0]),"talk"); } else puzzle(st, next); };
    next();
  }
  function done(){
    const p=taleProg(); p[id]=Math.max(p[id]||0, ch+1); Store.set("tales",p);
    $$("[data-ch]",v).forEach(b=>b.disabled = +b.dataset.ch > p[id]);
    kids.forEach(k=>kidAct(k,"happy")); confetti(); Sound.win();
    const last = ch>=2;
    if(last) addStarsOnce("tale_"+id, 3, "خلّصتي حكاية «"+T.title+"»"); else addStarsOnce("tale_"+id+"_"+ch,1,"فصل جديد");
    const md=modal(`<div class="tour-body"><div class="win-kids">${faceHTML("k",1,60)}${faceHTML("y",1,60)}</div><div><h2>${last?"انتهت الحكاية!":"خلص الفصل "+(ch+1)}</h2><p style="margin:0">${esc(last?T.title+" صارت حكايتكم.":"الفصل الجاي: "+T.chapters[ch+1].title)}</p></div></div><div class="row">${last?`<button class="btn honey" data-shelf>رجوع للمكتبة</button>`:`<button class="btn honey" data-next>الفصل الجاي</button>`}<button class="btn ghost" data-stay>ابقي هنا</button></div>`);
    const n=$("[data-next]",md.el); if(n) n.onclick=()=>{ md.close(); runChapter(ch+1); };
    const sh=$("[data-shelf]",md.el); if(sh) sh.onclick=()=>{ md.close(); go("tales"); };
    $("[data-stay]",md.el).onclick=md.close;
  }
  function showTask(html){ task.hidden=false; task.innerHTML=html; }
  function solved(next){ Sound.chime(); kids.forEach(k=>kidAct(k,"happy")); task.hidden=true; props.innerHTML=""; setTimeout(next, 400); }
  function puzzle(st, next){
    const q=`<h3>${esc(st.q)}</h3>`;
    if(st.p==="find"){
      let got=0; showTask(q+`<p class="d-note" data-c>0 من ${st.items.length}</p>`);
      props.innerHTML = st.items.map(([x,y],i)=>`<button class="tprop" data-i="${i}" style="left:${x}%;top:${y}%" aria-label="قطعة مخفية">${st.art()}</button>`).join("");
      $$(".tprop",props).forEach(b=>b.onclick=()=>{ b.classList.add("got"); b.disabled=true; got++; $("[data-c]",task).textContent=`${got} من ${st.items.length}`; Sound.pop(); if(got===st.items.length) solved(next); });
    }
    else if(st.p==="order"){
      let ord=shuffle(st.items.map((_,i)=>i)); while(ord.every((v,i)=>v===i)) ord=shuffle(ord); let sel=null;
      const draw=()=>{ showTask(q+`<div class="t-order">${ord.map((k,i)=>`<button class="t-card ${sel===i?"sel":""}" data-i="${i}"><span class="t-n">${i+1}</span><span class="t-ic">${T_ICONS[st.items[k][1]]()}</span>${esc(st.items[k][0])}</button>`).join("")}</div><div class="row"><button class="btn honey" data-ok>${IC.check} تحقّقي</button></div><p class="d-note">اضغطي بطاقتين حتى تبدّلين مكانهم.</p>`);
        $$(".t-card",task).forEach(b=>b.onclick=()=>{ const i=+b.dataset.i; if(sel==null){ sel=i; } else { [ord[sel],ord[i]]=[ord[i],ord[sel]]; sel=null; Sound.flip(); } draw(); });
        $("[data-ok]",task).onclick=()=>{ if(ord.every((v,i)=>v===i)) solved(next); else { Sound.bump(); kidAct(kids[1],"surprise"); toast("مو هيچ الترتيب… جربي مرة ثانية","bulb"); } }; };
      draw();
    }
    else if(st.p==="symbols"){
      let entered=[]; const ic = k => st.colors ? COLOR_DOT(st.colors[k]) : T_ICONS[k]();
      const draw=()=>{ showTask(q+`<div class="t-slots">${st.seq.map((_,i)=>`<span class="t-slot">${entered[i]?ic(entered[i]):""}</span>`).join("")}</div><div class="t-keys">${st.keys.map(k=>`<button class="t-key" data-k="${k}">${ic(k)}</button>`).join("")}</div><div class="row"><button class="btn ghost small" data-clr>امسحي</button></div>`);
        $$(".t-key",task).forEach(b=>b.onclick=()=>{ entered.push(b.dataset.k); Sound.pop(); if(entered.length===st.seq.length){ if(entered.every((k,i)=>k===st.seq[i])){ draw(); setTimeout(()=>solved(next),300); return; } Sound.bump(); kidAct(kids[0],"surprise"); toast("الرمز غلط. "+(st.colors?"تذكّري ترتيب قوس قزح":"تذكّري الرسالة"),"bulb"); entered=[]; } draw(); });
        $("[data-clr]",task).onclick=()=>{ entered=[]; draw(); }; };
      draw();
    }
    else if(st.p==="match"){
      let left=null, done2=new Set(); const rights=shuffle(st.pairs.map((p,i)=>i));
      const draw=()=>{ showTask(q+`<div class="t-match"><div>${st.pairs.map((p,i)=>`<button class="t-m ${done2.has(i)?"ok":""} ${left===i?"sel":""}" data-l="${i}" ${done2.has(i)?"disabled":""}>${esc(p[0])}</button>`).join("")}</div><div>${rights.map(i=>`<button class="t-m ${done2.has(i)?"ok":""}" data-r="${i}" ${done2.has(i)?"disabled":""}>${st.html?st.pairs[i][1]:esc(st.pairs[i][1])}</button>`).join("")}</div></div>`);
        $$("[data-l]",task).forEach(b=>b.onclick=()=>{ left=+b.dataset.l; draw(); });
        $$("[data-r]",task).forEach(b=>b.onclick=()=>{ if(left==null){ toast("اختاري من اليمين أول","bulb"); return; } if(+b.dataset.r===left){ done2.add(left); Sound.chime(); left=null; if(done2.size===st.pairs.length){ draw(); setTimeout(()=>solved(next),300); return; } } else { Sound.bump(); left=null; } draw(); }); };
      draw();
    }
    else if(st.p==="choice"){
      showTask(q+`<div class="t-choices">${shuffle(st.opts.map((o,i)=>i)).map(i=>`<button class="t-ch" data-o="${i}">${st.opts[i].h||esc(st.opts[i].t)}</button>`).join("")}</div><p class="d-note" data-r></p>`);
      $$(".t-ch",task).forEach(b=>b.onclick=()=>{ const o=st.opts[+b.dataset.o]; if(o.ok) solved(next); else { b.classList.add("bad"); Sound.bump(); $("[data-r]",task).textContent=o.r||"جربي غيرها"; kidAct(kids[1],"talk"); } });
    }
    else if(st.p==="notes"){
      const cols=["#C8552B","#D9A53A","#5B7F4A","#3E6FA0"], f=[392,494,587,698]; let inp=[], playing=false;
      const draw=()=>{ showTask(q+`<div class="t-notes">${cols.map((c,i)=>`<button class="t-note" data-n="${i}" style="--c:${c}" aria-label="نغمة ${i+1}"></button>`).join("")}</div><div class="row"><button class="btn small" data-play>${IC.sound} اسمعي اللحن</button></div><p class="d-note">${inp.length} من ${st.seq.length}</p>`);
        $("[data-play]",task).onclick=play; $$(".t-note",task).forEach(b=>b.onclick=()=>{ if(playing) return; const n=+b.dataset.n; flash(n); if(n===st.seq[inp.length]){ inp.push(n); if(inp.length===st.seq.length){ setTimeout(()=>solved(next),300); return; } draw(); } else { Sound.bump(); toast("مو هاي النغمة. اسمعيها مرة ثانية","bulb"); inp=[]; draw(); } }); };
      const flash=n=>{ const b=$(`.t-note[data-n="${n}"]`,task); if(b){ b.classList.add("lit"); setTimeout(()=>b.classList.remove("lit"),300); } Sound.note(f[n]); };
      const play=()=>{ playing=true; inp=[]; st.seq.forEach((n,i)=>setTimeout(()=>flash(n), 300+i*550)); setTimeout(()=>{ playing=false; draw(); }, 300+st.seq.length*550); };
      draw(); setTimeout(play, 500);
    }
    else if(st.p==="mirrors"){
      const target=[1,3,0,2]; let rot=target.map(t=>(t+1+Math.floor(Math.random()*3))%4);
      const draw=()=>{ const okN=rot.filter((r,i)=>r===target[i]).length; showTask(q+`<div class="t-mirrors">${rot.map((r,i)=>`<button class="t-mir ${r===target[i]?"ok":""}" data-m="${i}" aria-label="مرآة ${i+1}"><span style="transform:rotate(${r*90+45}deg)"></span></button>`).join("")}</div><div class="t-beam"><i style="width:${okN/4*100}%"></i></div><p class="d-note">الضوء وصل ${okN} من 4 مرايا</p>`);
        $$(".t-mir",task).forEach(b=>b.onclick=()=>{ const i=+b.dataset.m; rot[i]=(rot[i]+1)%4; Sound.flip(); if(rot.every((r,j)=>r===target[j])){ draw(); setTimeout(()=>solved(next),400); return; } draw(); }); };
      draw();
    }
    else if(st.p==="tap"){
      let n=0; showTask(q+`<p class="d-note" data-c>0 من ${st.n}</p>`);
      props.innerHTML=`<button class="tcloud" style="left:12%;top:28%" aria-label="الغيمة الصغيرة">${ART.cloud()}</button>`;
      const c=$(".tcloud",props); c.onclick=()=>{ n++; c.style.left=(12+n*(64/st.n))+"%"; c.style.top=(28-n*1.2)+"%"; Sound.soft(); $("[data-c]",task).textContent=`${n} من ${st.n}`; if(n>=st.n) solved(next); };
    }
    else if(st.p==="draw"){
      showTask(q+`<canvas class="t-canvas" width="640" height="360"></canvas><div class="pal-colors">${["#3A2A1C","#C8552B","#E8C066","#5B7F4A","#3E6FA0","#B9A6DD","#FFFFFF"].map(c=>`<button class="swatch" data-c="${c}" style="background:${c}"></button>`).join("")}</div>${st.write?`<div class="field"><label for="tw">${esc(st.write)}</label><input id="tw" maxlength="120" placeholder="وعاشوا…"></div>`:""}<div class="row"><button class="btn ghost small" data-clr>امسحي</button><button class="btn honey" data-ok>${IC.check} خلصت</button></div>`);
      const cv=$(".t-canvas",task), cx=cv.getContext("2d"); cx.fillStyle="#FFFBEF"; cx.fillRect(0,0,640,360); let col="#3A2A1C", dn=false, lp=null, strokes=0;
      $$("[data-c]",task).forEach(b=>b.onclick=()=>col=b.dataset.c);
      const pos=e=>{ const r=cv.getBoundingClientRect(); return [(e.clientX-r.left)*640/r.width,(e.clientY-r.top)*360/r.height]; };
      cv.onpointerdown=e=>{ dn=true; lp=pos(e); cv.setPointerCapture(e.pointerId); strokes++; };
      cv.onpointermove=e=>{ if(!dn) return; const p=pos(e); cx.strokeStyle=col; cx.lineWidth=6; cx.lineCap="round"; cx.beginPath(); cx.moveTo(lp[0],lp[1]); cx.lineTo(p[0],p[1]); cx.stroke(); lp=p; };
      cv.onpointerup=()=>dn=false;
      $("[data-clr]",task).onclick=()=>{ cx.fillStyle="#FFFBEF"; cx.fillRect(0,0,640,360); strokes=0; };
      $("[data-ok]",task).onclick=()=>{ if(!strokes){ toast("ارسمي شي صغير أول","bulb"); return; } const line=st.write?($("#tw",task).value.trim()):""; const art=cv.toDataURL("image/jpeg",.7); const gal=Store.get("talesArt",[]); gal.unshift({t:T.title, line, art, at:Date.now()}); Store.set("talesArt", gal.slice(0,12)); if(st.write){ const entries=loadDiary(); entries.push({id:"d"+Date.now().toString(36), date:new Date().toISOString().slice(0,10), title:"نهاية: "+T.title, text:line||"رسمنا نهاية الكتاب سوا.", mood:"love", sticker:"star", created:Date.now()}); Store.set("diary",entries); } solved(next); };
    }
  }
  $$("[data-ch]",v).forEach(b=>b.onclick=()=>{ if(dlgRef) dlgRef.close(); runChapter(+b.dataset.ch); });
  runChapter(ch);
  return ()=>{ if(dlgRef) dlgRef.close(); };
}
Object.assign(ROUTES, {
  tales:{view:r=>viewTales(r), title:()=>"حكاياتنا", parent:"world"},
  tale:{view:(r,id)=>viewTale(r,id), title:id=>{ const t=TALEBOOK.find(x=>x.id===id); return t?t.title:"حكاية"; }, parent:"tales"}
});
function taleJournalHTML(){ return `<div class="j-tales">${TALEBOOK.map(t=>`<div class="j-tale"><span class="jt-c" style="background:${t.color}"></span><div><b>${esc(t.title)}</b></div></div>`).join("")}</div>`; }
