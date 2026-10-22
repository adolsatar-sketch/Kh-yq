/* =====================================================================
   عالم «مغامرات خباب ويقين»
   خريطة ورقية هادئة مرسومة (بدون لوحة القلعة كخلفية): ساحة ساعة القلعة بالنص،
   وتسع مناطق تتفرع منها. الضغط على منطقة يقرّب الكاميرا عليها وتطلع أماكنها الجانبية.
   لغة الحركة نفسها لغة الموقع القديم: مشي على المنحنى بـ easeInOutQuad ونطّات صغيرة،
   دخول المشهد .38s ease-out، ومغادرة المشهد بتكبير 1.18 .5s ease-in.
   ===================================================================== */

/* ---------- حالة العالم (تنحفظ على الجهاز) ---------- */
const WS = (() => {
  const base = {at:"hub", flags:{}, items:{}, gears:[], tickets:[], leaves:[], notes:[], lamps:[], visited:["hub"], opened:[], rewards:[], fresh:[], song:""};
  const s = Object.assign(base, Store.get("world", {}));
  // تحويل من نسخة سابقة: أماكن وأسماء قديمة
  if(s.at && !["hub"].includes(s.at)) s.at = "hub";
  if(s.items.sumoHat){ delete s.items.sumoHat; s.items.acornCap = true; }
  if(s.flags.hatReturned){ s.flags.capReturned = true; delete s.flags.hatReturned; }
  if(s.rewards.includes("acc_mushroom")) s.rewards = s.rewards.map(r=>r==="acc_mushroom"?"acc_acorn":r);
  s.tickets = s.tickets.map(t=>t==="elaf"?"forest":t);
  delete s.items.seed;
  return s;
})();
function saveWorld(){ Store.set("world", WS); }
const flag = k => !!WS.flags[k];
const hasItem = k => !!WS.items[k];
function setFlag(k, v=true){ if(WS.flags[k]===v) return; WS.flags[k]=v; saveWorld(); checkUnlocks(); }
const ITEM_INFO = {
  glassKey:{n:"المفتاح الزجاجي", art:()=>ART.glassKey()},
  hedgeKey:{n:"مفتاح السياج", art:()=>ART.key("#6E8A6A")},
  lantern:{n:"فانوس سِراج", art:()=>ART.lantern(true)},
  bell:{n:"جرس زعفرانة", art:()=>ART.bell()},
  acornCap:{n:"قبعة شوكة البلوطية", art:()=>ART.acornCap()},
  feather:{n:"ريشة أم الحكايات", art:()=>ART.feather()},
  clue:{n:"رسالة الجدّة المطوية", art:()=>ART.letter()}
};
function giveItem(k){ if(WS.items[k]) return false; WS.items[k]=true; saveWorld(); Sound.chime(); toast("لگيتوا: "+ITEM_INFO[k].n, "star"); checkUnlocks(); return true; }
function takeItem(k){ delete WS.items[k]; saveWorld(); }
const GEARS = {copper:{n:"ترس النحاس", c:"#C77B3A", at:"machine"}, glass:{n:"ترس الزجاج", c:"#8EC3CF", at:"greenhouse"}, iron:{n:"ترس الحديد", c:"#7D7F86", at:"abandoned"}, gold:{n:"ترس الذهب", c:"#D7B58C", at:"passage"}};
function giveGear(id){ if(WS.gears.includes(id)) return false; WS.gears.push(id); saveWorld(); Sound.win(); confetti(); toast(`${GEARS[id].n}! (${WS.gears.length} من 4)`, "gear"); addStars(2); checkUnlocks(); return true; }
const TICKETS = {
  forest:{n:"قطعة من قلب الغابة", how:"رتّبوا أوراق الخريف بقلب الغابة", at:"forest"},
  owl:{n:"قطعة من أم الحكايات", how:"خلّصوا أي حكاية من «حكاياتنا»", at:"library"},
  show:{n:"قطعة من مسرح القصر", how:"سوّوا أول عرض أزياء", at:"p_show"},
  train:{n:"قطعة من سائق القطار", how:"فوزوا بلعبة «قطار منتصف الخريف»", at:"g_train"},
  cat:{n:"قطعة من زعفرانة", how:"رجّعوا جرس زعفرانة الضايع", at:"station"}
};
function giveTicket(id){ if(WS.tickets.includes(id)) return false; WS.tickets.push(id); saveWorld(); Sound.chime(); toast(`قطعة تذكرة! (${WS.tickets.length} من 5)`, "star"); addStars(1); checkUnlocks(); return true; }

/* ---------- المكافآت التجميلية: تنفتح باللعب فقط (بدون دفع أو صناديق حظ) ---------- */
const REWARDS = {
  wings_maple:{n:"أجنحة أوراق الخريف", kind:"wings", id:"maple"},
  wings_gears:{n:"أجنحة ميكانيكية فكتورية", kind:"wings", id:"gears"},
  wings_petals:{n:"أجنحة البتلات", kind:"wings", id:"petals"},
  wings_glass:{n:"أجنحة الزجاج الملوّن", kind:"wings", id:"glass"},
  wings_crystal:{n:"أجنحة نجمية مضيئة", kind:"wings", id:"crystal"},
  acc_conductor:{n:"قبعة سائق القطار", kind:"acc", id:"conductor"},
  acc_lantern:{n:"فانوس صغير باليد", kind:"acc", id:"lantern"},
  acc_acorn:{n:"قبعة بلوط مثل قبعة شوكة", kind:"acc", id:"acorn"},
  acc_feather:{n:"ريشة البومة للشعر", kind:"acc", id:"feather"},
  sticker_stamp:{n:"ملصق طابع القلعة", kind:"sticker", id:"stamp"},
  sticker_owl:{n:"ملصق أم الحكايات", kind:"sticker", id:"owl"},
  decor_garland:{n:"إكليل أوراق لغرفة خباب ويقين", kind:"decor", id:"garland"},
  decor_clock:{n:"ساعة صغيرة لغرفة خباب ويقين", kind:"decor", id:"clock"},
  medal_clock:{n:"وسام ساعة الخريف", kind:"medal", id:"clock"}
};
const hasReward = id => WS.rewards.includes(id);
function grantReward(id){ if(!REWARDS[id] || hasReward(id)) return false; WS.rewards.push(id); saveWorld(); setTimeout(()=>toast("مكافأة جديدة: "+REWARDS[id].n, "gift"), 900); return true; }
const talesDone = () => { const p=Store.get("tales",{}); return Object.values(p).filter(n=>n>=3).length; };

/* ---------- المناطق (إحداثيات على خريطة 1000×1000) ---------- */
const REGIONS = {
  hub:{name:"ساحة ساعة القلعة", x:500, y:500, ic:"hub", tint:"#E9E1CC", desc:"قلب العالم: ساعة القلعة الكبيرة، ومنها الدروب لكل المناطق. هنا لوحة الألعاب ودفتر المهام واللعب ويه صديق."},
  workshop:{name:"ورشة الساعات", x:500, y:165, ic:"workshop", tint:"#E7DCC6", npc:"saadoun", desc:"ورشة العم سعدون: تروس وفوانيس، وغرف تحت الأرض."},
  observatory:{name:"المرصد", x:718, y:248, ic:"observatory", tint:"#DCE1E3", desc:"قبة زجاج ومنظار يطل على القلعة، وسلّم ضيق للسطح."},
  greenhouse:{name:"الدفيئة", x:832, y:448, ic:"greenhouse", tint:"#D9E3D2", npc:"narjis", desc:"بيت زجاج دافي، الخالة نرجس وألغاز الضوء والماي."},
  palace:{name:"قصر الأزياء", x:788, y:672, ic:"palace", tint:"#ECE0D9", npc:"rayhana", desc:"ريحانة الخيّاطة: ملابس وأجنحة ومسرح عرض."},
  kidsroom:{name:"غرفة خباب ويقين", x:610, y:818, ic:"kidsroom", tint:"#EFE6D3", direct:"study", desc:"غرفتهم الدافية: مذكرات، مرسم، رسائل، ورسم مشترك."},
  station:{name:"محطة القطار", x:390, y:818, ic:"station", tint:"#DDE4E2", npc:"cat", desc:"قطار منتصف الخريف، سباق العربات، والقطة زعفرانة."},
  forest:{name:"الغابة", x:212, y:672, ic:"forest", tint:"#D6E0CD", desc:"أشجار عالية وأوراق نادرة، ومتاهة الأوراق، ونفق مظلم."},
  garden:{name:"الحديقة القديمة", x:168, y:448, ic:"garden", tint:"#DFE5D1", npc:"shawka", desc:"سياج قديم، مقلاع الأوراق، صيد الفوانيس، وشوكة القنفذ."},
  library:{name:"المكتبة", x:282, y:248, ic:"library", tint:"#E6DCCC", npc:"owl", desc:"حكاياتنا وأم الحكايات، وجدار بيه أسرار."}
};
const REGION_IDS = Object.keys(REGIONS).filter(k=>k!=="hub");
const ROAD_EXTRA = [["library","workshop"],["workshop","observatory"],["forest","garden"],["greenhouse","palace"]];
/* الأماكن داخل كل منطقة: غرف، ألعاب، وصفحات */
const PLACES = {
  workshop:{region:"workshop", kind:"room", name:"طاولة العم سعدون", ic:"workshop", desc:"العم سعدون وتروس الساعة الواقفة."},
  machine:{region:"workshop", kind:"room", name:"غرفة التروس", ic:"gears", desc:"تروس وأنابيب وبخار تحت الورشة."},
  lanternroom:{region:"workshop", kind:"room", name:"غرفة الفوانيس", ic:"lantern", desc:"فوانيس مطفية تنتظر الترتيب الصحيح."},
  g_bridge:{region:"workshop", kind:"game", game:"bridge"},
  g_orchestra:{region:"workshop", kind:"game", game:"orchestra"},
  observatory:{region:"observatory", kind:"room", name:"قبة المرصد", ic:"observatory", desc:"منظار، نجوم، وطوابع بريد."},
  roof:{region:"observatory", kind:"room", name:"سطح القلعة", ic:"roof", desc:"فوق كل الأبراج… قلب ساعة الخريف."},
  greenhouse:{region:"greenhouse", kind:"room", name:"بين النباتات", ic:"greenhouse", desc:"الخالة نرجس ونباتاتها الزعلانة."},
  g_greenhouse:{region:"greenhouse", kind:"game", game:"greenhouse"},
  passageLG:{region:"greenhouse", kind:"room", name:"ممر الكتب الخضراء", ic:"vines", desc:"ممر بين الدفيئة والمكتبة، الأغصان مغطية الكتب."},
  p_studio:{region:"palace", kind:"route", route:"palace", name:"ورشة ريحانة", ic:"palace", desc:"تصميم ملابس وأجنحة بتحديات ريحانة."},
  p_show:{region:"palace", kind:"route", route:"show", name:"مسرح العرض", ic:"stage", desc:"عرض أزياء بأضواء وموسيقى، وحده أو ويه صديق."},
  study:{region:"kidsroom", kind:"route", route:"book", name:"الغرفة", ic:"kidsroom", desc:"مذكرات، مرسم، رسائل، رسم مشترك، وترتيب الغرفة."},
  station:{region:"station", kind:"room", name:"رصيف المحطة", ic:"station", desc:"زعفرانة وشبّاك التذاكر ورحلة القناطر."},
  g_train:{region:"station", kind:"game", game:"train"},
  g_race:{region:"station", kind:"game", game:"race"},
  abandoned:{region:"station", kind:"room", name:"الرصيف القديم", ic:"oldtrain", desc:"رصيف نايم من سنين. بابه يحتاج تذكرة."},
  forest:{region:"forest", kind:"room", name:"قلب الغابة", ic:"forest", desc:"أوراق ملوّنة، وعش قديم يخص سِراج."},
  g_maze:{region:"forest", kind:"game", game:"maze"},
  leaftunnel:{region:"forest", kind:"room", name:"نفق الأوراق", ic:"tunnel", desc:"نفق مظلم من الأغصان، يحتاج ضوء."},
  garden:{region:"garden", kind:"room", name:"سياج شوكة", ic:"garden", desc:"شوكة القنفذ ومقعد قديم بين الأشجار المقصوصة."},
  g_sling:{region:"garden", kind:"game", game:"sling"},
  g_lanterns:{region:"garden", kind:"game", game:"lanterns"},
  hidden:{region:"garden", kind:"room", name:"الحديقة المخفية", ic:"secretgarden", mystery:true, desc:"ورا السياج، حديقة ما يعرفها أحد."},
  library:{region:"library", kind:"room", name:"قاعة أم الحكايات", ic:"library", desc:"البومة الحارسة وكتاب حكاياتنا الكبير."},
  p_tales:{region:"library", kind:"route", route:"tales", name:"حكاياتنا", ic:"book", desc:"خمس حكايات تنلعب بخيارات تغيّر الطريق."},
  g_library:{region:"library", kind:"game", game:"library"},
  passage:{region:"library", kind:"room", name:"الممر خلف المكتبة", ic:"portrait", secret:true, desc:"ممر مخفي ورا لوحة قديمة."}
};
const NODES = PLACES;   // أسماء قديمة تستعملها الغرف
const GAME_AT = Object.fromEntries(Object.entries(PLACES).filter(([k,p])=>p.kind==="game").map(([k,p])=>[p.game,k]));
const placeName = id => { const p=PLACES[id]; if(!p) return REGIONS[id]?REGIONS[id].name:""; return p.kind==="game" && typeof KG!=="undefined" && KG[p.game] ? KG[p.game].title : p.name; };
const placeIcon = id => { const p=PLACES[id]; if(p && p.kind==="game" && KG[p.game] && KG[p.game].icon) return KG[p.game].icon(); return MAP_IC[(p||REGIONS[id]).ic] ? MAP_IC[(p||REGIONS[id]).ic]() : ""; };
const regionOf = id => PLACES[id] ? PLACES[id].region : (REGIONS[id] ? id : "hub");

/* كل قفل إله بدائل، وبعض المفاتيح تجي من الألعاب وتفتح مكان ثاني */
const LOCKS = {
  machine:{open:()=>flag("towerFixed"), why:()=>"باب غرفة التروس ينفتح لما تشتغل تروس الورشة. روحوا للعم سعدون."},
  roof:{open:()=>WS.gears.length>=4, why:()=>`السلّم للسطح يحتاج التروس الذهبية الأربعة — عندكم ${WS.gears.length}.`},
  abandoned:{open:()=>WS.tickets.length>=3, why:()=>`الباب يحتاج 3 قطع من التذكرة الممزقة — عندكم ${WS.tickets.length}. القطع بقلب الغابة، المكتبة، مسرح القصر، لعبة القطار، وعند زعفرانة.`},
  hidden:{open:()=>WS.leaves.length>=5 || hasItem("hedgeKey"), why:()=>`السياج سادّ الطريق. يفتحه: 5 أوراق نادرة (عندكم ${WS.leaves.length})، أو «مفتاح السياج» اللي تلگونه إذا فزتوا بمتاهة الأوراق.`},
  leaftunnel:{open:()=>hasItem("lantern") || !!progress.wins.kg_lanterns, why:()=>"النفق مظلم كلش. تحتاجون ضوء: رتّبوا فوانيس غرفة الفوانيس بالورشة، أو فوزوا بلعبة صيد الفوانيس."},
  passageLG:{open:()=>hasItem("glassKey") || talesDone()>=2, why:()=>`باب زجاجي مقفول. يفتحه: المفتاح الزجاجي من الخالة نرجس، أو أم الحكايات إذا خلّصتوا حكايتين (خلّصتوا ${talesDone()}).`},
  passage:{open:()=>flag("clueRead") || WS.notes.length>=3, why:()=>`ماكو طريق واضح… يمكن رسالة مطوية بغرفة خباب ويقين، أو 3 رسائل مخفية (لگيتوا ${WS.notes.length}).`}
};
const nodeOpen = id => !LOCKS[id] || LOCKS[id].open();
const nodeShown = id => !(PLACES[id] && PLACES[id].secret) || nodeOpen(id);
const NODE_IDS = Object.keys(PLACES);
function checkUnlocks(){
  let changed=false;
  NODE_IDS.forEach(id=>{ if(LOCKS[id] && nodeOpen(id) && !WS.opened.includes(id)){ WS.opened.push(id); WS.fresh.push(id); changed=true; setTimeout(()=>toast("انفتح مكان جديد: "+placeName(id), "lock"), 1500); } });
  if(changed) saveWorld();
  updateJournalDot();
}
/* مفاتيح تجي من الألعاب الثنائية */
function onGameWin(id){
  if(id==="maze") giveItem("hedgeKey");
  if(id==="lanterns") checkUnlocks();
  if(id==="train") giveTicket("train");
}

/* ---------- المهمات ---------- */
const QUESTS = [
  {id:"clock", main:true, title:"ساعة الخريف", art:()=>ART.gear("#B88A5A"),
    story:"ساعة القلعة الكبيرة وقفت، فصار الخريف عالق بين العصر والمغرب. العم سعدون يحتاج مساعدتكم.",
    steps:[
      {t:"قابلوا العم سعدون بورشة الساعات", done:()=>flag("metSaadoun"), at:"workshop"},
      {t:"شغّلوا تروس الورشة حتى تنفتح غرفة التروس", done:()=>flag("towerFixed"), at:"workshop"},
      {t:"لگوا التروس الذهبية الأربعة", prog:()=>[WS.gears.length,4], done:()=>WS.gears.length>=4, at:()=>nextGearNode(),
        sub:()=>Object.entries(GEARS).map(([k,g])=>({t:`${g.n} — ${placeName(g.at)}`, done:WS.gears.includes(k)}))},
      {t:"اصعدوا لسطح القلعة من المرصد وشغّلوا الساعة", done:()=>flag("clockRestored"), at:"roof"}
    ], reward:"wings_gears"},
  {id:"leaves", title:"أوراق الخريف النادرة", art:()=>ART.maple("#C9A27A"), prog:()=>[WS.leaves.length,8], at:()=>nextLeafNode(), hint:"8 أوراق تلمع موزّعة بالغرف والأنفاق. منظار المرصد يدلّكم.", reward:"wings_maple"},
  {id:"letters", title:"رسائل مخفية", art:()=>ART.letter(), prog:()=>[WS.notes.length,5], at:()=>nextNoteNode(), hint:"رسائل صغيرة بين الحجار والأغصان. 3 رسائل تكشف طريق سري.", reward:"sticker_owl"},
  {id:"tickets", title:"التذكرة الممزقة", art:()=>ART.ticket(), prog:()=>[WS.tickets.length,5], at:()=>{ const k=Object.keys(TICKETS).find(t=>!WS.tickets.includes(t)); return k?TICKETS[k].at:"abandoned"; },
    sub:()=>Object.entries(TICKETS).map(([k,t])=>({t:t.how, done:WS.tickets.includes(k)})), hint:"3 قطع تفتح الرصيف القديم، والخمسة تكمّل التذكرة.", reward:"acc_conductor"},
  {id:"lamps", title:"غرفة الفوانيس", art:()=>ART.lantern(), steps:[{t:"رتّبوا الفوانيس الخمسة بغرفة الفوانيس", done:()=>flag("lampsLit"), at:"lanternroom"}], reward:"acc_lantern"},
  {id:"bell", title:"جرس زعفرانة", art:()=>ART.bell(), steps:[
      {t:"اسألوا زعفرانة برصيف المحطة", done:()=>flag("metCat"), at:"station"},
      {t:"دوّروا الجرس بغرفة التروس", done:()=>hasItem("bell")||flag("catBell"), at:"machine"},
      {t:"رجّعوه لزعفرانة", done:()=>flag("catBell"), at:"station"}]},
  {id:"cap", title:"قبعة شوكة", art:()=>ART.acornCap(), steps:[
      {t:"شوكة القنفذ بالحديقة القديمة ضيّع قبعته", done:()=>flag("metShawka"), at:"garden"},
      {t:"دوّروها بنفق الأوراق بالغابة", done:()=>hasItem("acornCap")||flag("capReturned"), at:"leaftunnel"},
      {t:"رجّعوها لشوكة", done:()=>flag("capReturned"), at:"garden"}], reward:"acc_acorn"},
  {id:"stars", title:"نجوم المرصد", art:()=>ART.starB(), steps:[{t:"وصّلوا نجوم الفانوس بقبة المرصد", done:()=>flag("starsLinked"), at:"observatory"}], reward:"wings_crystal"},
  {id:"owl", title:"أم الحكايات", art:()=>ART.feather(), prog:()=>[Math.min(talesDone(),2),2], at:()=>"p_tales", hint:"خلّصوا حكايتين حتى تفتح أم الحكايات ممر الكتب الخضراء، وتنطيكم ريشتها.", reward:"acc_feather"}
];
const questDone = Q => Q.steps ? Q.steps.every(s=>s.done()) : (Q.prog()[0]>=Q.prog()[1]);
function questNext(Q){ if(Q.steps){ const s=Q.steps.find(s=>!s.done()); return s ? (typeof s.at==="function"?s.at():s.at) : null; } return questDone(Q) ? null : (Q.at ? Q.at() : null); }
function nextGearNode(){ const k=Object.keys(GEARS).find(g=>!WS.gears.includes(g) && nodeOpen(GEARS[g].at)) || Object.keys(GEARS).find(g=>!WS.gears.includes(g)); return k ? GEARS[k].at : "roof"; }
function checkQuestRewards(){ QUESTS.forEach(Q=>{ if(Q.reward && questDone(Q) && !hasReward(Q.reward)){ grantReward(Q.reward); addStars(3, "مهمة: "+Q.title); } }); }
function updateJournalDot(){ const d=$("#journalDot"); if(!d) return; const seen=Store.get("journalSeen",""); d.hidden = seen===journalSig(); }
const journalSig = () => QUESTS.map(Q=>Q.steps?Q.steps.filter(s=>s.done()).length:Q.prog()[0]).join(".")+"|"+WS.opened.length;

/* ---------- المقتنيات داخل الغرف ---------- */
const LEAF_SPOTS = [{at:"forest",x:22,y:34},{at:"forest",x:84,y:58},{at:"leaftunnel",x:76,y:30},{at:"hidden",x:78,y:62},{at:"roof",x:16,y:30},{at:"station",x:88,y:40},{at:"passageLG",x:70,y:28},{at:"observatory",x:12,y:62}];
const NOTE_SPOTS = [
  {at:"forest", x:58, y:76, t:"رسالة بين جذور الشجرة: «الشجاع مو اللي ما يخاف… هو اللي يمسك إيد صاحبه ويكمّل»."},
  {at:"workshop", x:88, y:30, t:"ورقة بين أدوات العم سعدون: «كل ترس صغير يدوّر شي أكبر منه»."},
  {at:"hidden", x:30, y:70, t:"ملاحظة بين الورد: «القصر يحب الضحك؛ كل ما تضحكون تضوي ثريا»."},
  {at:"library", x:12, y:60, t:"ورقة بكتاب قديم: «كل ورقة خريف كانت يوم من أيام الصيف الحلوة»."},
  {at:"abandoned", x:62, y:30, t:"ورقة صفرة على الشبّاك: «يا سعدون، إذا وقفت الساعة يوم، دوّر التروس بأماكن ناسها. — جدّتك»."}
];
function nextLeafNode(){ const i=LEAF_SPOTS.findIndex((s,k)=>!WS.leaves.includes(k)); return i<0?null:LEAF_SPOTS[i].at; }
function nextNoteNode(){ const i=NOTE_SPOTS.findIndex((s,k)=>!WS.notes.includes(k)); return i<0?null:NOTE_SPOTS[i].at; }
function collectLeaf(i, el){
  if(WS.leaves.includes(i)) return; WS.leaves.push(i); saveWorld(); if(el){ el.classList.add("got"); setTimeout(()=>el.remove(),600); }
  Sound.chime(); toast(`ورقة نادرة! (${WS.leaves.length} من ${LEAF_SPOTS.length})`, "star"); addStars(1); checkUnlocks(); checkQuestRewards();
}
function readNote(i, el){
  const first = !WS.notes.includes(i);
  if(first){ WS.notes.push(i); saveWorld(); addStars(1, "رسالة مخفية"); checkUnlocks(); checkQuestRewards(); }
  if(el) el.classList.add("found");
  modal(`<div class="letter">${esc(NOTE_SPOTS[i].t)}</div><p class="d-note">الرسائل: ${WS.notes.length} من ${NOTE_SPOTS.length}${WS.notes.length===3 && first?" — حسّيتوا بشي؟ جدار بالمكتبة صار يرن…":""}</p>`);
}
const leafHTML = (i, s) => WS.leaves.includes(i) ? "" : `<button class="rare" data-leaf="${i}" style="left:${s.x}%;top:${s.y}%" aria-label="ورقة نادرة">${ART.maple(["#D7B58C","#C97964","#B9805F","#C9A27A"][i%4])}</button>`;
const noteHTML = (i, s) => `<button class="xnote ${WS.notes.includes(i)?"found":""}" data-note="${i}" style="left:${s.x}%;top:${s.y}%" aria-label="رسالة مخفية">${ART.letter()}</button>`;
function bindCollectibles(root){
  $$("[data-leaf]",root).forEach(b=>b.onclick=e=>{ e.stopPropagation(); collectLeaf(+b.dataset.leaf, b); });
  $$("[data-note]",root).forEach(b=>b.onclick=e=>{ e.stopPropagation(); readNote(+b.dataset.note, b); });
}

/* ---------- رسوم الخريطة: حبر أخضر على ورق عاجي، تعبئة هادئة ---------- */
const INK="#26342F", FILL="#F5F0E3", SAGE="#A8B9A0", COP="#B88A5A", CORAL="#C97964";
const MAP_IC = {
  hub:()=>`<svg viewBox="0 0 120 120"><ellipse cx="60" cy="96" rx="52" ry="16" fill="#E2D8C1" stroke="${INK}" stroke-width="2"/><path d="M44 96V44l16-22 16 22v52z" fill="${FILL}" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/><path d="M40 46h40" stroke="${INK}" stroke-width="3"/><circle cx="60" cy="62" r="12" fill="#fff" stroke="${INK}" stroke-width="2.6"/><path d="M60 62V54M60 62l6 3" stroke="${INK}" stroke-width="2.4" stroke-linecap="round"/><path d="M54 96V82a6 6 0 0112 0v14" fill="${SAGE}" stroke="${INK}" stroke-width="2.4"/><path d="M60 22v-8" stroke="${INK}" stroke-width="2.4"/><path d="M60 14l10 3-10 3" fill="${CORAL}"/></svg>`,
  workshop:()=>`<svg viewBox="0 0 120 120"><path d="M18 98V54l42-26 42 26v44z" fill="${FILL}" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/><path d="M50 98V76h20v22" fill="#E2D8C1" stroke="${INK}" stroke-width="2.4"/><g transform="translate(60 56)" fill="${COP}" stroke="${INK}" stroke-width="2">${[0,45,90,135,180,225,270,315].map(a=>`<rect x="-3" y="-15" width="6" height="7" rx="1.5" transform="rotate(${a})"/>`).join("")}<circle r="10"/><circle r="3.5" fill="${INK}"/></g><path d="M86 40V24h8v24" fill="${FILL}" stroke="${INK}" stroke-width="2.4"/></svg>`,
  observatory:()=>`<svg viewBox="0 0 120 120"><path d="M22 98V66h76v32z" fill="${FILL}" stroke="${INK}" stroke-width="3"/><path d="M22 66a38 38 0 0176 0z" fill="#DCE1E3" stroke="${INK}" stroke-width="3"/><path d="M58 30h8v36h-8z" fill="${INK}" opacity=".65"/><path d="M66 46l30-18" stroke="${INK}" stroke-width="7" stroke-linecap="round"/><circle cx="98" cy="26" r="4" fill="${COP}"/><path d="M50 98V82h20v16" fill="#E2D8C1" stroke="${INK}" stroke-width="2.4"/><circle cx="28" cy="22" r="2" fill="${COP}"/><circle cx="16" cy="40" r="1.6" fill="${COP}"/></svg>`,
  greenhouse:()=>`<svg viewBox="0 0 120 120"><path d="M20 98V62a40 40 0 0180 0v36z" fill="#E4ECE1" stroke="${INK}" stroke-width="3"/><path d="M60 22v76M20 70h80M38 30l6 68M82 30l-6 68" stroke="${INK}" stroke-width="1.8" opacity=".75"/><circle cx="40" cy="88" r="7" fill="${SAGE}" stroke="${INK}" stroke-width="2"/><circle cx="80" cy="86" r="8" fill="${SAGE}" stroke="${INK}" stroke-width="2"/><circle cx="60" cy="90" r="5" fill="${CORAL}" stroke="${INK}" stroke-width="2"/></svg>`,
  palace:()=>`<svg viewBox="0 0 120 120"><path d="M16 98V48l44-24 44 24v50z" fill="${FILL}" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/><path d="M38 98V64a10 10 0 0120 0v34M62 98V64a10 10 0 0120 0v34" fill="#ECE0D9" stroke="${INK}" stroke-width="2.4"/><path d="M60 36v8M54 44h12" stroke="${INK}" stroke-width="2.4"/><circle cx="60" cy="50" r="4" fill="${COP}"/></svg>`,
  kidsroom:()=>`<svg viewBox="0 0 120 120"><path d="M22 98V54l38-28 38 28v44z" fill="${FILL}" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/><rect x="36" y="60" width="22" height="20" rx="3" fill="#F3E3C4" stroke="${INK}" stroke-width="2.4"/><path d="M47 60v20M36 70h22" stroke="${INK}" stroke-width="1.6"/><path d="M66 98V72h18v26" fill="${SAGE}" stroke="${INK}" stroke-width="2.4"/><path d="M76 40l2 6 6 0-5 4 2 6-5-4-5 4 2-6-5-4h6z" fill="${CORAL}"/></svg>`,
  station:()=>`<svg viewBox="0 0 120 120"><path d="M10 50l50-18 50 18" fill="none" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/><path d="M18 50v34M102 50v34" stroke="${INK}" stroke-width="3"/><circle cx="60" cy="44" r="7" fill="#fff" stroke="${INK}" stroke-width="2.2"/><rect x="34" y="64" width="44" height="22" rx="5" fill="#DDE4E2" stroke="${INK}" stroke-width="2.6"/><rect x="70" y="54" width="8" height="12" fill="${INK}" opacity=".7"/><circle cx="44" cy="88" r="5" fill="${INK}"/><circle cx="70" cy="88" r="5" fill="${INK}"/><path d="M6 98h108M6 104h108" stroke="${INK}" stroke-width="2"/></svg>`,
  forest:()=>`<svg viewBox="0 0 120 120">${[[34,62,22,"#C9A27A"],[62,50,26,"#B9805F"],[88,64,20,"#A8B9A0"],[50,78,18,"#D7B58C"]].map(([x,y,r,c])=>`<path d="M${x} ${y+r}v${26-r/3}" stroke="${INK}" stroke-width="3"/><circle cx="${x}" cy="${y}" r="${r}" fill="${c}" stroke="${INK}" stroke-width="2.6"/>`).join("")}<path d="M10 102h100" stroke="${INK}" stroke-width="2"/></svg>`,
  garden:()=>`<svg viewBox="0 0 120 120"><path d="M14 98V70q0-14 14-14h8q14 0 14 14v28M70 98V70q0-14 14-14h8q14 0 14 14v28" fill="#DFE5D1" stroke="${INK}" stroke-width="2.6"/><path d="M50 98V58a10 10 0 0120 0v40" fill="none" stroke="${INK}" stroke-width="3"/><path d="M60 40v-8" stroke="${INK}" stroke-width="2"/><path d="M55 32h10l-2 8h-6z" fill="#F3E3C4" stroke="${INK}" stroke-width="2"/><path d="M8 100h104" stroke="${INK}" stroke-width="2"/></svg>`,
  library:()=>`<svg viewBox="0 0 120 120"><path d="M14 46l46-22 46 22z" fill="${FILL}" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/><path d="M20 98V50h80v48z" fill="${FILL}" stroke="${INK}" stroke-width="3"/>${[30,46,74,90].map(x=>`<path d="M${x} 54v40" stroke="${INK}" stroke-width="3"/>`).join("")}<path d="M52 98V66h16v32" fill="#E6DCCC" stroke="${INK}" stroke-width="2.4"/><path d="M14 98h92" stroke="${INK}" stroke-width="3"/></svg>`,
  gears:()=>ART.gear("#C77B3A"), lantern:()=>ART.lantern(true), roof:()=>`<svg viewBox="0 0 60 60"><path d="M30 6L14 40h32z" fill="#DCE1E3" stroke="${INK}" stroke-width="2.5" stroke-linejoin="round"/><path d="M30 6V2l10 3-10 3" fill="${CORAL}"/><rect x="16" y="40" width="28" height="14" fill="${FILL}" stroke="${INK}" stroke-width="2.5"/><circle cx="30" cy="28" r="5" fill="#F3E3C4" stroke="${INK}" stroke-width="2"/></svg>`,
  vines:()=>`<svg viewBox="0 0 60 60"><rect x="10" y="12" width="10" height="38" fill="${CORAL}" stroke="${INK}" stroke-width="2"/><rect x="22" y="16" width="10" height="34" fill="${SAGE}" stroke="${INK}" stroke-width="2"/><rect x="34" y="10" width="12" height="40" fill="${COP}" stroke="${INK}" stroke-width="2"/><path d="M6 20c14 6 22-6 30 4s14 4 18 0M8 38c10-6 18 6 28-2s12 2 18 6" fill="none" stroke="#6E8A6A" stroke-width="3.5" stroke-linecap="round"/></svg>`,
  stage:()=>`<svg viewBox="0 0 60 60"><path d="M6 12h48v6H6z" fill="${CORAL}" stroke="${INK}" stroke-width="2"/><path d="M8 18c4 14 4 24 0 34M52 18c-4 14-4 24 0 34" fill="none" stroke="${CORAL}" stroke-width="6"/><path d="M14 46h32l6 8H8z" fill="${COP}" stroke="${INK}" stroke-width="2"/><circle cx="30" cy="34" r="5" fill="#F3E3C4" stroke="${INK}" stroke-width="2"/></svg>`,
  oldtrain:()=>`<svg viewBox="0 0 60 60"><rect x="8" y="22" width="40" height="22" rx="5" fill="#C7CDBE" stroke="${INK}" stroke-width="2.5"/><path d="M14 27h10v9H14zM28 27h10v9H28z" fill="#8C968A"/><path d="M6 14l10 6M50 14l-8 8" stroke="#6E8A6A" stroke-width="3" stroke-linecap="round"/><circle cx="18" cy="47" r="5" fill="${INK}"/><circle cx="40" cy="47" r="5" fill="${INK}"/></svg>`,
  tunnel:()=>`<svg viewBox="0 0 60 60"><path d="M6 54V30a24 24 0 0148 0v24z" fill="#3B5C54" stroke="${INK}" stroke-width="2.5"/><path d="M16 54V34a14 14 0 0128 0v20z" fill="#16302B"/>${[[10,24,"#C97964"],[24,10,"#D7B58C"],[44,14,"#B9805F"],[52,30,"#C9A27A"]].map(([x,y,c])=>`<circle cx="${x}" cy="${y}" r="5" fill="${c}"/>`).join("")}</svg>`,
  secretgarden:()=>`<svg viewBox="0 0 60 60"><path d="M12 54V30a18 18 0 0136 0v24" fill="#3B5C54" stroke="${INK}" stroke-width="2.5"/><path d="M8 30c8-14 14 0 22-10s16 6 22 10" fill="none" stroke="#6E8A6A" stroke-width="5" stroke-linecap="round"/><circle cx="20" cy="22" r="3" fill="${CORAL}"/><circle cx="40" cy="24" r="3" fill="#F3E3C4"/></svg>`,
  portrait:()=>`<svg viewBox="0 0 60 60"><rect x="10" y="8" width="40" height="46" rx="3" fill="${COP}" stroke="${INK}" stroke-width="2.5"/><rect x="16" y="14" width="28" height="34" fill="#3B5C54"/><circle cx="30" cy="27" r="7" fill="#F2D2B4"/><path d="M20 48c2-10 18-10 20 0" fill="${CORAL}"/></svg>`,
  book:()=>ART.book("#2E5A50")
};
MAP_IC.study=MAP_IC.kidsroom;
/* الأماكن حول كل منطقة: تتوزع على قوس متجه لنص الخريطة حتى ما تطلع برّه الشاشة */
function placePos(id){
  const p=PLACES[id], R=REGIONS[p.region]; const list=Object.keys(PLACES).filter(k=>PLACES[k].region===p.region);
  const n=list.length, i=list.indexOf(id);
  if(n===1) return [R.x, R.y+110];
  const base=Math.atan2(500-R.y, 500-R.x), spread=Math.min(2.6, .95*(n-1)), a=base+(n>1?(-spread/2+spread*i/(n-1)):0);
  const r=n>3?146:124; return [R.x+Math.cos(a)*r, R.y+Math.sin(a)*r];
}
const ptOf = id => REGIONS[id] ? [REGIONS[id].x, REGIONS[id].y] : placePos(id);
function roadD(a, b){ const [x1,y1]=ptOf(a), [x2,y2]=ptOf(b); const mx=(x1+x2)/2, my=(y1+y2)/2, dx=x2-x1, dy=y2-y1; const k=.12; return `M${x1} ${y1} Q${(mx-dy*k).toFixed(1)} ${(my+dx*k).toFixed(1)} ${x2} ${y2}`; }
function mapSVG(opts={}){
  const night=flag("night");
  const roads=REGION_IDS.map(r=>["hub",r]).concat(ROAD_EXTRA);
  return `<svg class="wm-svg" viewBox="0 0 1000 1000" aria-hidden="true">
    <defs><filter id="wmgrain"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" seed="7"/><feColorMatrix values="0 0 0 0 .35 0 0 0 0 .3 0 0 0 0 .2 0 0 0 .06 0"/></filter>
    <radialGradient id="wmvig" cx=".5" cy=".5" r=".72"><stop offset=".72" stop-color="#16302B" stop-opacity="0"/><stop offset="1" stop-color="#16302B" stop-opacity=".22"/></radialGradient>
    <filter id="wmsoft"><feGaussianBlur stdDeviation="18"/></filter></defs>
    <rect width="1000" height="1000" rx="28" fill="${night?"#E4DECC":FILL}"/>
    <rect width="1000" height="1000" rx="28" filter="url(#wmgrain)"/>
    <g filter="url(#wmsoft)" opacity=".85">${Object.entries(REGIONS).map(([k,R])=>`<ellipse cx="${R.x}" cy="${R.y}" rx="${k==="hub"?150:118}" ry="${k==="hub"?125:100}" fill="${R.tint}"/>`).join("")}</g>
    <g class="wm-roads">${roads.map(([a,b])=>`<path d="${roadD(a,b)}" class="road-base"/><path d="${roadD(a,b)}" class="road-ink"/>`).join("")}</g>
    ${opts.places!==false?`<g class="wm-sub-roads">${Object.keys(PLACES).filter(nodeShown).map(id=>{ const [x,y]=placePos(id), R=REGIONS[PLACES[id].region]; return `<path data-sr="${PLACES[id].region}" class="${nodeOpen(id)?"sr-open":"sr-locked"}" d="M${R.x} ${R.y} L${x.toFixed(1)} ${y.toFixed(1)}"/>`; }).join("")}</g>`:""}
    <g class="wm-compass" transform="translate(905 905)"><circle r="38" fill="none" stroke="${COP}" stroke-width="1.5"/><path d="M0-34L7 0 0 34-7 0z" fill="${INK}" opacity=".7"/><path d="M-34 0L0 6 34 0 0-6z" fill="${COP}" opacity=".6"/><text y="-44" text-anchor="middle" font-size="18" fill="${INK}" font-family="Almarai">ش</text></g>
    <g class="wm-deco" opacity=".55">${[[60,120],[930,140],[80,900],[700,960],[950,610],[40,300]].map(([x,y],i)=>`<g transform="translate(${x} ${y}) rotate(${i*47})"><path d="M0-12l3 7 6-2-2 7 7 1-5 5 5 3-8 1 1 5-7-3-7 3 1-5-8-1 5-3-5-5 7-1-2-7 6 2z" fill="${["#C9A27A","#B9805F","#A8B9A0"][i%3]}"/></g>`).join("")}</g>
    <rect x="10" y="10" width="980" height="980" rx="22" fill="none" stroke="${COP}" stroke-width="2" opacity=".55"/>
    <rect width="1000" height="1000" rx="28" fill="url(#wmvig)"/>
    ${night?`<g class="wm-stars">${Array.from({length:22},(_,i)=>`<circle cx="${(i*137)%980+10}" cy="${(i*89)%300+20}" r="${1.4+(i%3)*.6}" fill="#B88A5A" opacity=".7"/>`).join("")}</g>`:""}
    <path class="wm-walk" d="M0 0" fill="none"/>
  </svg>`;
}
function regionMarks(r){
  const ids=[r, ...Object.keys(PLACES).filter(k=>PLACES[k].region===r)];
  const m=[];
  if(QUESTS.some(Q=>Q.main && ids.includes(questNext(Q)))) m.push(["main","!","المهمة الرئيسية هنا"]);
  else if(QUESTS.some(Q=>!Q.main && ids.includes(questNext(Q)))) m.push(["side","!","مهمة جانبية"]);
  if(ids.some(id=>PLACES[id] && nodeOpen(id) && ROOM_PUZZLE_DONE[id] && !ROOM_PUZZLE_DONE[id]())) m.push(["puzzle","؟","لغز ما انحل"]);
  return m;
}
const ROOM_PUZZLE_DONE = {workshop:()=>flag("towerFixed"), machine:()=>WS.gears.includes("copper"), greenhouse:()=>WS.gears.includes("glass"), abandoned:()=>WS.gears.includes("iron"), passage:()=>WS.gears.includes("gold"), hidden:()=>flag("hiddenFound"), passageLG:()=>flag("booksOrdered"), roof:()=>flag("clockRestored"), lanternroom:()=>flag("lampsLit"), observatory:()=>flag("starsLinked"), forest:()=>WS.tickets.includes("forest"), study:()=>flag("roomTidy")};
function placeMarks(id){
  const m=[];
  if(QUESTS.some(Q=>questNext(Q)===id)) m.push(["main","!","مهمة"]);
  if(nodeOpen(id) && ROOM_PUZZLE_DONE[id] && !ROOM_PUZZLE_DONE[id]()) m.push(["puzzle","؟","لغز"]);
  if(nodeOpen(id) && (LEAF_SPOTS.some((s,i)=>s.at===id && !WS.leaves.includes(i)) || NOTE_SPOTS.some((s,i)=>s.at===id && !WS.notes.includes(i)))) m.push(["secret","✦","شي مخفي"]);
  return m;
}
const marksHTML = m => m.length?`<span class="wn-marks">${m.map(([c,s,t])=>`<i class="wm-mark ${c}" title="${t}">${s}</i>`).join("")}</span>`:"";

/* ---------- عرض العالم ---------- */
function viewWorld(root){
  checkUnlocks();
  const firstTime = !flag("mapRevealed");
  const fresh = WS.fresh.slice(); WS.fresh=[]; saveWorld();
  const atRegion = regionOf(WS.at);
  const v = h(`<section class="view world-map ${firstTime&&motionOK()?"revealing":""} ${flag("night")?"night":""}">
    <div class="wm-viewport"><div class="wm-map">
      ${mapSVG()}
      ${Object.entries(REGIONS).map(([k,R])=>`<button class="rnode ${k==="hub"?"hub":""} ${atRegion===k?"here":""}" data-region="${k}" style="left:${R.x/10}%;top:${R.y/10}%" aria-label="${esc(R.name)}"><span class="rn-art">${MAP_IC[R.ic]()}</span><span class="rn-tag">${esc(R.name)}</span>${marksHTML(regionMarks(k))}</button>`).join("")}
      ${Object.keys(PLACES).filter(id=>PLACES[id].region!=="kidsroom").map(id=>{ const [x,y]=placePos(id), shown=nodeShown(id), open=nodeOpen(id), mys=PLACES[id].mystery&&!open; if(!shown) return ""; return `<button class="pnode ${open?"":"locked"} ${fresh.includes(id)?"fresh":""}" data-place="${id}" data-of="${PLACES[id].region}" style="left:${x/10}%;top:${y/10}%" aria-label="${esc(mys?"مكان مجهول":placeName(id))}${open?"":" (مقفول)"}" tabindex="-1"><span class="pn-ic">${mys?'<b class="wn-q">؟</b>':placeIcon(id)}${open?"":`<span class="wn-lock">${IC.lock}</span>`}</span><span class="pn-tag">${esc(mys?"مكان مجهول":placeName(id))}</span>${marksHTML(placeMarks(id))}</button>`; }).join("")}
      <div class="wm-kids" id="wmKids">${kidFigure("k")}${kidFigure("y")}</div>
      <button class="wm-siraj" data-siraj hidden aria-label="سِراج عنده تلميح">${ART.siraj("idle")}</button>
    </div></div>
    <div class="wm-sheet panel" data-sheet hidden></div>
    <div class="map-ui wm-ui" data-ui>
      <button class="btn small" data-board>${IC.gift} لوحة الألعاب</button>
      <button class="btn ghost small" data-journal>${IC.quest} المهام</button>
      ${flag("clockRestored")?`<button class="btn ghost small" data-night>${flag("night")?"نهار":"ليل"}</button>`:""}
    </div>
    ${leafLayer(lowPower?2:5,"edge")}
  </section>`);
  root.appendChild(v);
  const vp=$(".wm-viewport",v), map=$(".wm-map",v), kids=$("#wmKids",v), walkPath=$(".wm-walk",v), sheet=$("[data-sheet]",v), sirajB=$("[data-siraj]",v);
  let zoomed=null, walking=false;
  // الخريطة مربعة تنعرض كاملة (contain) على أي شاشة؛ التقريب على منطقة بتحريك الكاميرا
  function layout(){
    const W=vp.clientWidth, H=vp.clientHeight, pad=10; const size=Math.max(260, Math.min(W-pad*2, H-pad*2)); map.style.width=size+"px"; map.style.height=size+"px";
    camera(zoomed, true);
  }
  function camera(r, instant){
    const W=vp.clientWidth, H=vp.clientHeight, size=map.clientWidth;
    let s=1, tx=(W-size)/2, ty=(H-size)/2;
    if(r){ const R=REGIONS[r]; const sheetH = sheet.hidden?0:sheet.offsetHeight; const avail=Math.max(160, Math.min(W, H-sheetH-16)); s=Math.min(2.1, Math.max(1.15, avail/(size*.36)));
      // مركز الكاميرا بين المنطقة وأماكنها الجانبية
      const ids=Object.keys(PLACES).filter(k=>PLACES[k].region===r && nodeShown(k)); const pts=[[R.x,R.y],...ids.map(placePos)]; const mx=pts.reduce((a,p)=>a+p[0],0)/pts.length, my=pts.reduce((a,p)=>a+p[1],0)/pts.length;
      const cx=mx/1000*size*s, cy=my/1000*size*s; tx=W/2-cx; ty=(H-sheetH)/2-cy; }
    map.style.transition = instant||!motionOK() ? "none" : "";
    map.style.transform=`translate(${tx}px,${ty}px) scale(${s})`;
    v.classList.toggle("zoomed", !!r); $$(".pnode",v).forEach(b=>{ const on=r && b.dataset.of===r; b.classList.toggle("show", !!on); b.tabIndex=on?0:-1; });
    $$(".wm-sub-roads path",v).forEach(p=>p.classList.toggle("show", p.dataset.sr===r));
    $$(".rnode",v).forEach(b=>b.classList.toggle("dim", !!r && b.dataset.region!==r));
  }
  const ro=new ResizeObserver(layout); ro.observe(vp);
  // مكان خباب ويقين
  const kidPt=id=>{ const [x,y]=ptOf(id); return [x+(id==="hub"?92:REGIONS[id]?66:44), y+(REGIONS[id]?48:30)]; };
  const kidsAt=(id)=>{ const [x,y]=kidPt(id); kids.style.left=(x/10)+"%"; kids.style.top=(y/10)+"%"; };
  kidsAt(firstTime ? "hub" : (PLACES[WS.at]&&nodeOpen(WS.at)?WS.at:atRegion));
  function walkTo(target, done){
    const from=WS.at; if(from===target || !motionOK()){ WS.at=target; saveWorld(); kidsAt(target); done&&done(); return; }
    // الطريق: من مكانهم للمنطقة، عبر الساحة إذا لازم، ثم للهدف (نفس منحنى ونطّات المشي القديم)
    const fr=regionOf(from), tr=regionOf(target); const P=[kidPt(from)];
    if(PLACES[from]) P.push(kidPt(fr));
    if(fr!==tr){ const direct=ROAD_EXTRA.some(([a,b])=>(a===fr&&b===tr)||(a===tr&&b===fr)); if(fr!=="hub" && tr!=="hub" && !direct) P.push(kidPt("hub")); P.push(kidPt(tr)); }
    if(PLACES[target]) P.push(kidPt(target));
    walkPath.setAttribute("d", catmull(P)); walking=true;
    const total=walkPath.getTotalLength(), dur=Math.min(1300, 260+total*1.1), t0=performance.now(); const figs=$$(".kidfig",kids); figs.forEach(f=>f.classList.add("walking"));
    const left=P[P.length-1][0]<P[0][0]; figs.forEach(f=>f.classList.toggle("face-l", left));
    const step=now=>{ const t=Math.min(1,(now-t0)/dur), e=t<.5?2*t*t:1-Math.pow(-2*t+2,2)/2; const p=walkPath.getPointAtLength(total*e); kids.style.left=(p.x/10)+"%"; kids.style.top=(p.y/10)+"%";
      figs.forEach((f,i)=>f.style.transform=`translateY(${-Math.abs(Math.sin(t*Math.PI*5+i*.6))*7}px)`);
      if(t<1) requestAnimationFrame(step); else { figs.forEach(f=>{ f.style.transform=""; f.classList.remove("walking","face-l"); }); walking=false; WS.at=target; if(!WS.visited.includes(target)) WS.visited.push(target); saveWorld(); $$(".rnode",v).forEach(b=>b.classList.toggle("here", b.dataset.region===regionOf(target))); if(Party.connected()) Party.send({t:"at", node:target}); done&&done(); } };
    requestAnimationFrame(step);
  }
  // فتح منطقة: الكاميرا تقرّب، والأماكن الجانبية تطلع، والورقة السفلية تعرض كل شي بوضوح
  function openRegion(r){
    if(walking) return; const R=REGIONS[r]; Sound.soft();
    if(R.direct){ walkTo(r, ()=>enterPlace(R.direct)); return; }
    walkTo(r, ()=>{ zoomed=r; Store.set("lastRegion", r); drawSheet(r); camera(r); });
  }
  function drawSheet(r){
    const R=REGIONS[r], ids=r==="hub"?[]:Object.keys(PLACES).filter(k=>PLACES[k].region===r && nodeShown(k));
    const ring=REGION_IDS, i=ring.indexOf(r);
    sheet.hidden=false;
    sheet.innerHTML=`<div class="ws-head"><span class="ws-ic">${MAP_IC[R.ic]()}</span><div><h2>${esc(R.name)}</h2><p>${esc(R.desc)}</p></div><button class="ibtn ws-x" data-out aria-label="كل المناطق">${IC.close}</button></div>
      ${R.npc?`<div class="pc-npc">${speakerFace(R.npc,0,40)}<p><b style="color:${speakerColor(R.npc)}">${esc(speakerName(R.npc))}:</b> ${esc(npcLine(R.npc))}</p></div>`:""}
      <div class="ws-list">${r==="hub"?hubActions():ids.map(id=>{ const o=nodeOpen(id), mys=PLACES[id].mystery&&!o; return `<button class="ws-item ${o?"":"locked"}" data-go="${id}"><span class="ws-i">${mys?'<b class="wn-q">؟</b>':placeIcon(id)}</span><span><b>${esc(mys?"مكان مجهول":placeName(id))}</b><small>${esc(o?(PLACES[id].kind==="game"?(KG[PLACES[id].game].tag||"")+" · لعبة ثنائية":PLACES[id].desc):"مقفول — اضغطوا حتى تعرفون شلون ينفتح")}</small></span>${o?"":IC.lock}${marksHTML(placeMarks(id))}</button>`; }).join("")}</div>
      ${r==="hub"?"":`<div class="ws-nav"><button class="btn ghost small" data-prev>${IC.right} ${esc(REGIONS[ring[(i+ring.length-1)%ring.length]].name)}</button><button class="btn ghost small" data-out>${IC.map} كل المناطق</button><button class="btn ghost small" data-next>${esc(REGIONS[ring[(i+1)%ring.length]].name)} ${IC.left}</button></div>`}`;
    $$("[data-out]",sheet).forEach(b=>b.onclick=()=>closeRegion());
    const pv=$("[data-prev]",sheet), nx=$("[data-next]",sheet);
    if(pv) pv.onclick=()=>{ closeRegion(true); openRegion(ring[(i+ring.length-1)%ring.length]); };
    if(nx) nx.onclick=()=>{ closeRegion(true); openRegion(ring[(i+1)%ring.length]); };
    $$("[data-go]",sheet).forEach(b=>b.onclick=()=>goPlace(b.dataset.go));
    $$("[data-hub]",sheet).forEach(b=>b.onclick=()=>HUB_ACTS[b.dataset.hub]());
    setTimeout(()=>camera(zoomed), 0);
  }
  function closeRegion(keep){ zoomed=null; sheet.hidden=true; if(!keep) Store.del("lastRegion"); camera(null); }
  function goPlace(id){
    if(!nodeOpen(id)){ lockedCard(id); return; }
    const b=$(`[data-place="${id}"]`,v);
    walkTo(id, ()=>enterPlace(id, b));
  }
  $$("[data-region]",v).forEach(b=>b.onclick=e=>{ e.stopPropagation(); if(zoomed===b.dataset.region){ closeRegion(); return; } openRegion(b.dataset.region); });
  $$("[data-place]",v).forEach(b=>b.onclick=e=>{ e.stopPropagation(); goPlace(b.dataset.place); });
  $$(".wm-kids .kidfig",v).forEach(k=>k.onclick=e=>{ e.stopPropagation(); kidAct(k,"jump"); Sound.soft(); });
  $("[data-board]",v).onclick=gameBoard;
  $("[data-journal]",v).onclick=()=>openJournal();
  const nb=$("[data-night]",v); if(nb) nb.onclick=()=>{ setFlag("night", !flag("night")); go("world",false); };
  // سِراج يطلع بس لما عنده تلميح مفيد (الخطوة الجاية بمكان ثاني)
  const hint=sirajHint();
  const showSiraj=()=>{ if(!hint || zoomed) return; sirajB.hidden=false; const [x,y]=ptOf(regionOf(WS.at)); sirajB.style.left=(x/10+5)+"%"; sirajB.style.top=((y-30)/10)+"%"; };
  const timers=[];
  if(hint && !firstTime) timers.push(setTimeout(showSiraj, 2600));
  sirajB.onclick=e=>{ e.stopPropagation(); sirajB.hidden=true; Store.set("hintSeen", hint.key);
    dialogue(v, [["siraj",1,hint.text], {ask:"نروح هناك؟", who:"siraj", opts:[{t:"إي، ودّينا", pick:()=>{ const t=hint.at; setTimeout(()=>{ if(PLACES[t]){ openRegion(PLACES[t].region); } else openRegion(t); }, 200); }},{t:"بعدين", then:[["siraj",0,"تمام. إذا احتجتوني، تلگوني بدفتر المهام."]]}]}]); };
  // أول دخول: الخريطة تنرسم وخباب ويقين يمشون للساحة، وسِراج يعرّف بنفسه
  if(firstTime){
    setFlag("mapRevealed");
    kids.style.opacity=0;
    const intro=()=>{ kids.style.opacity=""; kidsAt("hub"); dialogue(v,[["siraj",1,"أنا سِراج، دليل الممرات القديمة. كل طريق هنا يخفي حكاية."],["k",1,"يرّاعة تحچي! وبيها تروس!"],["siraj",0,"هاي ساحة ساعة القلعة. منها تتفرع الدروب: اضغطوا على أي منطقة وأقرّبلكم عليها."],["y",2,"والعلامات الصغيرة؟"],["siraj",1,"«!» مهمة، «؟» لغز، والقفل يعني يحتاج مفتاح أو مساعدة. وأطلعلكم بس إذا عندي تلميح."],["y",0,"الساعة الكبيرة واقفة… خلّي نروح لورشة الساعات."]], ()=>{ sirajB.hidden=true; }); };
    timers.push(setTimeout(intro, motionOK()?1500:100));
  } else if(fresh.length){ const f=fresh[fresh.length-1]; if(PLACES[f]) timers.push(setTimeout(()=>openRegion(PLACES[f].region), 500)); }
  else { const last=Store.get("lastRegion",null); if(last && REGIONS[last] && !REGIONS[last].direct){ zoomed=last; drawSheet(last); } }
  // صاحبك على الخريطة
  const offs=[];
  const placeFriend=()=>{ let f=$(".wm-friend",v); const at=Party.friendAt; if(!Party.connected() || !at || !(PLACES[at]||REGIONS[at])){ f&&f.remove(); return; }
    if(!f){ f=h(`<div class="wm-friend">${kidFigure(Party.other?Party.other.char:"y","ghost")}<b>${esc(Party.other?Party.other.name:"صديق")}</b></div>`); map.insertBefore(f, kids); }
    const [x,y]=ptOf(at); f.style.left=(x/10+3)+"%"; f.style.top=((y+30)/10)+"%"; };
  if(Party.connected()){ Party.send({t:"at", node:WS.at}); offs.push(Party.on("at", placeFriend), Party.on("status", placeFriend)); placeFriend(); }
  // للتنقل بالوصول السريع من دفتر المهام أو لوحة الألعاب
  const want=Store.get("walkTo",null); if(want){ Store.del("walkTo"); timers.push(setTimeout(()=>{ if(REGIONS[want]) openRegion(want); else if(PLACES[want]) openRegion(PLACES[want].region); }, 350)); }
  layout();
  return ()=>{ ro.disconnect(); timers.forEach(clearTimeout); offs.forEach(f=>f()); };
}
function sirajHint(){
  const Q=QUESTS.find(q=>!questDone(q) && questNext(q)) ; if(!Q) return null;
  const at=questNext(Q); if(!at) return null;
  const step=Q.steps ? Q.steps.find(s=>!s.done()) : null;
  const key=Q.id+":"+at+":"+(step?step.t:Q.prog()[0]);
  if(Store.get("hintSeen","")===key) return null;
  const name=placeName(at);
  const text = Q.main ? `تك… تك… سمعت الساعة تنادي. ${step?step.t:Q.title} — الطريق من «${name}».` : `لاحظت شي يلمع بـ«${name}». ${step?step.t:Q.hint||Q.title}.`;
  return {key, at, text};
}

/* ---------- كلام الشخصيات حسب اللي سويتوه ---------- */
function npcLine(id){
  const L = {
    siraj:()=> flag("clockRestored") ? "من رجعت الساعة تدق، ضوّي صار أحلى. بس لا تگولون إلي مغرور!" : "إذا ضعتوا، افتحوا دفتر المهام. أنا أطلع بس إذا عندي شي يفيد.",
    cat:()=> flag("catBell") ? "مياو! الجرس رجع يرن. القطار يحترم قطة بجرس." : hasItem("bell") ? "هذا… جرسي!؟" : "مياو… ضيّعت جرسي من صار الخريف. آخر مرة سمعته يرن بغرفة التروس.",
    narjis:()=> WS.gears.includes("glass") ? "نباتاتي فرحانة. ودوّروا الحديقة المخفية؛ ورودها أحلى من ورودي… بس لا تگولون إلي!" : "تعالوا شوفوا النباتات؛ كل وحدة تحتاج ضوء وماي بمقدار، ودفتري يگول شنو.",
    owl:()=> talesDone()>=2 ? "هوو هوو… حكايتين خلصت! الممر الأخضر انفتح إلكم." : (Object.keys(Store.get("taleChoices",{})).length ? "سمعت بخياراتكم بالحكايات… كل خيار يكتب صفحة جديدة." : "كل كتاب هنا حكاية تنلعب. خلّصوا وحدة وأنطيكم قطعة تذكرة."),
    rayhana:()=> progress.once_runway1 ? "عرضكم الأول جان يجنن! جرّبوا تحدياتي الثانية؛ عندي قطع ما شافها أحد." : "أنا ريحانة، خيّاطة القصر. اختاروا تحدي، صمموا، وأنا أقيّم.",
    shawka:()=> flag("capReturned") ? "قبعتي رجعت! هسه أگدر أتمشّى بالحديقة وراسي ما يبرد." : hasItem("acornCap") ? "قبعتي!!" : "قبعتي البلوطية طارت ويه الريح… شفتها تتدحرج صوب نفق الأوراق بالغابة.",
    saadoun:()=> !flag("towerFixed") ? "الساعة وقفت والخريف علگ! ساعدوني أدوّر تروس الورشة." : WS.gears.length<4 ? `باقي ${4-WS.gears.length} تروس ذهبية. جدّتي جانت تخبّيها بأماكن ناسها.` : flag("clockRestored") ? "دنگ… دنگ! الوقت رجع يمشي. شكراً يا أبطال." : "التروس الأربعة! اصعدوا للسطح من المرصد، ألحگكم."
  };
  return L[id] ? L[id]() : "";
}
function enterPlace(id, el){
  const p=PLACES[id]||{};
  // مكافآت تنطى لما توصلون المكان
  if(id==="library" && talesDone()>=1) setTimeout(()=>giveTicket("owl"), 400);
  if(id==="library" && talesDone()>=2 && !hasItem("feather")) setTimeout(()=>{ giveItem("feather"); checkQuestRewards(); }, 800);
  if(id==="p_show" && progress.once_runway1) giveTicket("show");
  if(p.kind==="game"){ sceneLeave(el, ()=>go("play:"+p.game)); return; }
  if(p.kind==="route"){ sceneLeave(el, ()=>go(p.route)); return; }
  sceneLeave(el, ()=>go("room:"+id));
}
function lockedCard(id){
  const L=LOCKS[id], p=PLACES[id]; const mys=p.mystery;
  const md=modal(`<div class="pc-head"><span class="pc-ic locked">${mys?`<b class="wn-q">؟</b>`:placeIcon(id)}</span><div><h2>${esc(mys?"مكان مجهول":placeName(id))} ${IC.lock}</h2><p>${esc(L.why())}</p></div></div>
    <div class="pc-npc">${speakerFace("siraj",0,44)}<p><b style="color:${speakerColor("siraj")}">سِراج:</b> ${esc(pick(["أكو أكثر من طريق يفتحه. شوفوا دفتر المهام.","ممكن نرجعله بعدين، الدروب ما تهرب.","حفظت الشرط. نروح نجمع اللي نحتاجه؟"]))}</p></div>
    <div class="row"><button class="btn" data-j>${IC.quest} دفتر المهام</button><button class="btn ghost" data-x>تمام</button></div>`, {cls:"autumn-sign"});
  $("[data-j]",md.el).onclick=()=>{ md.close(); openJournal("paths"); }; $("[data-x]",md.el).onclick=md.close;
}
/* انتقال الدخول: نفس خروج المقدمة القديمة (تكبير 1.18 وتلاشي .5s ease-in) من نقطة المكان */
function sceneLeave(el, fin){
  if(!motionOK()){ fin(); return; }
  const vw=$("#view"); if(el){ const r=el.getBoundingClientRect(); vw.style.transformOrigin=`${r.left+r.width/2}px ${r.top+r.height/2}px`; } else vw.style.transformOrigin="50% 50%";
  vw.classList.add("leaving"); Sound.chime(); setTimeout(()=>{ vw.classList.remove("leaving"); fin(); }, 480);
}
function trainRide(){
  WS.flags.trainRides=(WS.flags.trainRides||0)+1; saveWorld();
  modal(`<h2>رحلة على القناطر</h2><div class="ride"><div class="ride-far"></div><div class="ride-near"></div><div class="ride-train">${MAP_IC.station()}<span>${faceHTML("k",1,40)}${faceHTML("y",1,40)}</span></div></div><p class="d-note">القطار يمر فوگ الضباب… عدد الرحلات: ${WS.flags.trainRides}</p>`,{wide:true});
  Sound.chime(); addStarsOnce("train",1,"أول رحلة قطار");
}

/* ---------- الساحة ---------- */
const HUB_ACTS = {
  board:()=>gameBoard(), journal:()=>openJournal(), album:()=>openAlbum(), friend:()=>go("lobby"), meet:()=>go("meet"), intro:()=>go("open")
};
const hubActions = () => [["board","gift","لوحة الألعاب","كل الألعاب وأماكنها"],["journal","quest","دفتر المهام","المهمة الرئيسية والجانبية والطرق المقفولة"],["album","star","الألبوم","أوراق، رسائل، تذاكر، تروس"],["friend","friends","العب مع صديق","أنشئ غرفة أو ادخل برمز"],["meet","eye","تعرّفوا على خباب ويقين","اللوحة الأصلية، الحركات، والتخصيص"]].map(([k,ic,l,s])=>`<button class="ws-item" data-hub="${k}"><span class="ws-i">${IC[ic]}</span><span><b>${l}</b><small>${s}</small></span></button>`).join("");

/* ---------- لوحة الألعاب ---------- */
function gameBoard(){
  const md=modal(`<h2>لوحة الألعاب</h2><p style="margin:0">كل لعبة بمكانها بالعالم. العبوها هسه على نفس الجهاز، أو ويه صديق من جهاز ثاني.</p>
    <div class="board">${Object.entries(KG).map(([k,g])=>`<div class="poster"><span class="po-art">${g.icon?g.icon():""}</span><b>${esc(g.title)}</b><small>${esc(g.tag||"")} · ${esc(REGIONS[PLACES[GAME_AT[k]].region].name)}</small><span class="po-tags"><i>ثنائية</i><i>جهازين</i>${progress.wins["kg_"+k]?`<i class="won">فزتوا ${progress.wins["kg_"+k]}</i>`:""}</span><span class="po-btns"><button class="btn small" data-play="${k}">العبوا</button><button class="btn ghost small" data-walk="${PLACES[GAME_AT[k]].region}">المكان</button></span></div>`).join("")}
      <div class="poster"><span class="po-art">${ART.butterfly("#C97964","#D7B58C")}</span><b>عرض الأزياء المشترك</b><small>تصميم ومسرح متزامن · قصر الأزياء</small><span class="po-tags"><i>ثنائية</i><i>جهازين</i></span><span class="po-btns"><button class="btn small" data-route="show">العبوا</button></span></div>
      <div class="poster"><span class="po-art">${ART.book("#2E5A50")}</span><b>رسم مشترك</b><small>كل واحد بلونه ومؤشره · غرفة خباب ويقين</small><span class="po-tags"><i>ثنائية</i><i>جهازين</i></span><span class="po-btns"><button class="btn small" data-route="draw">ارسموا</button></span></div>
      <div class="poster"><span class="po-art">${ART.book("#8E4E40")}</span><b>حكاية مشتركة</b><small>اختيارات بالتصويت · المكتبة</small><span class="po-tags"><i>ثنائية</i><i>جهازين</i></span><span class="po-btns"><button class="btn small" data-route="tales">اختاروا حكاية</button></span></div>
    </div>`, {wide:true, cls:"board-modal"});
  $$("[data-play]",md.el).forEach(b=>b.onclick=()=>{ md.close(); go("play:"+b.dataset.play); });
  $$("[data-route]",md.el).forEach(b=>b.onclick=()=>{ md.close(); go(b.dataset.route); });
  $$("[data-walk]",md.el).forEach(b=>b.onclick=()=>{ md.close(); walkToNode(b.dataset.walk); });
}
function walkToNode(id){ Store.set("walkTo", PLACES[id]?PLACES[id].region:id); if(current!=="world") go("world"); else go("world", false); }

/* ---------- دفتر المهام ---------- */
function questHTML(Q){
  const done=questDone(Q), nxt=questNext(Q);
  let body="";
  if(Q.steps) body=`<ol class="q-steps">${Q.steps.map(s=>{ const d=s.done(); const pr=s.prog?s.prog():null; return `<li class="${d?"done":""}">${d?IC.check:"<i></i>"}<span>${esc(s.t)}${pr?` <b>(${pr[0]}/${pr[1]})</b>`:""}${s.sub&&!d?`<ul>${s.sub().map(x=>`<li class="${x.done?"done":""}">${esc(x.t)}</li>`).join("")}</ul>`:""}</span></li>`; }).join("")}</ol>`;
  else { const [a,b]=Q.prog(); body=`<div class="q-bar"><i style="width:${Math.min(100,a/b*100)}%"></i></div><p class="d-note">${a} من ${b}${Q.hint?" — "+esc(Q.hint):""}</p>${Q.sub?`<ul class="q-sub">${Q.sub().map(x=>`<li class="${x.done?"done":""}">${x.done?IC.check:""}${esc(x.t)}</li>`).join("")}</ul>`:""}`; }
  return `<div class="quest ${Q.main?"main":""} ${done?"done":""}"><div class="q-head"><span class="q-art">${Q.art()}</span><div><h3>${esc(Q.title)}</h3>${Q.story?`<p>${esc(Q.story)}</p>`:""}</div>${done?`<span class="q-ok">${IC.check} خلصت</span>`:nxt&&(PLACES[nxt]||REGIONS[nxt])?`<button class="btn small" data-where="${nxt}">وين؟</button>`:""}</div>${body}${Q.reward?`<p class="q-rew">${IC.gift} المكافأة: ${esc(REWARDS[Q.reward].n)} ${hasReward(Q.reward)?"✔":""}</p>`:""}</div>`;
}
function openJournal(tab="quests"){
  checkQuestRewards(); Store.set("journalSeen", journalSig()); updateJournalDot();
  const md=modal(`<div class="journal"><h2>${IC.quest} دفتر المهام</h2>
    <div class="seg j-tabs" role="tablist"><button data-t="quests">المهمات</button><button data-t="paths">الطرق</button><button data-t="rewards">الكنوز</button><button data-t="tales">الحكايات</button></div>
    <div data-body></div></div>`, {wide:true, cls:"journal-modal"});
  const body=$("[data-body]",md.el);
  const draw=t=>{
    $$("[data-t]",md.el).forEach(b=>b.setAttribute("aria-pressed", b.dataset.t===t));
    if(t==="quests") body.innerHTML = `<h3 class="j-h">المهمة الرئيسية</h3>${questHTML(QUESTS[0])}<h3 class="j-h">مهمات جانبية</h3>${QUESTS.slice(1).map(questHTML).join("")}`;
    else if(t==="paths") body.innerHTML = `<p class="d-note">الأماكن المقفولة وشلون تنفتح. كل قفل إله أكثر من طريق، وبعض المفاتيح تجي من الألعاب.</p><ul class="j-locks">${NODE_IDS.filter(id=>LOCKS[id]).map(id=>{ const o=nodeOpen(id), shown=nodeShown(id); return `<li class="${o?"open":""}">${o?IC.check:IC.lock}<span><b>${esc(shown||o?placeName(id):"مكان سري")}</b><small>${esc(REGIONS[PLACES[id].region].name)} — ${o?"مفتوح":esc(LOCKS[id].why())}</small></span>${o?`<button class="btn ghost small" data-where="${id}">روحوا</button>`:""}</li>`; }).join("")}</ul>`;
    else if(t==="rewards") body.innerHTML = `<div class="j-rew">${Object.entries(REWARDS).map(([k,r])=>`<div class="${hasReward(k)?"on":""}">${hasReward(k)?IC.gift:IC.lock}<span>${esc(r.n)}</span></div>`).join("")}</div><p class="d-note">الأجنحة والإكسسوارات المفتوحة تظهر بقصر الأزياء وبتخصيص خباب ويقين، والملصقات بالمرسم، والزينة بغرفتهم.</p><h3 class="j-h">أغراض بالجيب</h3><div class="j-items">${Object.keys(WS.items).filter(k=>ITEM_INFO[k]).length?Object.keys(WS.items).filter(k=>ITEM_INFO[k]).map(k=>`<span>${ITEM_INFO[k].art()}<small>${esc(ITEM_INFO[k].n)}</small></span>`).join(""):"<p class='d-note'>الجيب فارغ.</p>"}</div>`;
    else body.innerHTML = taleJournalHTML();
    $$("[data-where]",body).forEach(b=>b.onclick=()=>{ md.close(); walkToNode(b.dataset.where); });
  };
  $$("[data-t]",md.el).forEach(b=>b.onclick=()=>draw(b.dataset.t));
  draw(tab);
}
function openAlbum(){
  modal(`<h2>الألبوم</h2><p>الأوراق النادرة: ${WS.leaves.length} من ${LEAF_SPOTS.length}</p><div class="album">${LEAF_SPOTS.map((_,i)=>`<span class="${WS.leaves.includes(i)?"on":""}">${ART.maple(["#D7B58C","#C97964","#B9805F","#C9A27A"][i%4])}</span>`).join("")}</div>
    <p>التروس الذهبية: ${WS.gears.length} من 4</p><div class="album">${Object.entries(GEARS).map(([k,g])=>`<span class="${WS.gears.includes(k)?"on":""}" title="${g.n}">${ART.gear(g.c)}</span>`).join("")}</div>
    <p>قطع التذكرة: ${WS.tickets.length} من 5</p><div class="album">${Object.keys(TICKETS).map(k=>`<span class="${WS.tickets.includes(k)?"on":""}">${ART.ticket()}</span>`).join("")}</div>
    <p>الرسائل: ${WS.notes.length} من ${NOTE_SPOTS.length}</p>${WS.notes.map(i=>`<div class="letter" style="margin-top:8px">${esc(NOTE_SPOTS[i].t)}</div>`).join("")}
    <p>الأماكن اللي زرتوها: ${WS.visited.length}</p>`, {wide:true});
}

/* ---------- الخريطة الصغيرة (زر «الخريطة» بالشريط) ---------- */
function toggleMiniMap(){
  const ex=$(".mini-map"); if(ex){ ex.remove(); return; }
  const here=regionOf(WS.at);
  const m=h(`<div class="mini-map panel" role="dialog" aria-label="الخريطة الصغيرة"><div class="mm-title"><b>الخريطة</b><button class="ibtn" data-x aria-label="إغلاق">${IC.close}</button></div>
    <div class="mm">${mapSVG({places:false})}${Object.entries(REGIONS).map(([k,R])=>{ const mk=regionMarks(k); return `<button class="mm-dot ${here===k?"here":""} ${k==="hub"?"wgate":""}" style="left:${R.x/10}%;top:${R.y/10}%" data-n="${k}" aria-label="${esc(R.name)}"><span class="mm-l">${esc(R.name)}</span>${mk.length?`<i class="wm-mark ${mk[0][0]}">${mk[0][1]}</i>`:""}</button>`; }).join("")}</div>
    <div class="mm-legend"><span><i class="lg here"></i>أنتم هنا</span><span><i class="wm-mark main">!</i>مهمة</span><span><i class="wm-mark puzzle">؟</i>لغز</span><span><i class="wm-mark side">!</i>جانبية</span></div>
    <div class="row" style="margin-top:6px"><button class="btn small" data-world>${IC.map} الخريطة الكاملة</button><button class="btn ghost small" data-j>${IC.quest} المهام</button></div></div>`);
  document.body.appendChild(m);
  $("[data-x]",m).onclick=()=>m.remove();
  $$("[data-n]",m).forEach(b=>b.onclick=()=>{ m.remove(); walkToNode(b.dataset.n); });
  $("[data-world]",m).onclick=()=>{ m.remove(); Store.del("lastRegion"); go("world"); };
  $("[data-j]",m).onclick=()=>{ m.remove(); openJournal(); };
  setTimeout(()=>document.addEventListener("pointerdown", function off(e){ if(!m.contains(e.target) && !e.target.closest("#mapBtn")){ m.remove(); document.removeEventListener("pointerdown",off); } }),0);
}
const ROUTE_NODE = {tales:"p_tales", tale:"p_tales", palace:"p_studio", show:"p_show", book:"study", diary:"study", paint:"study", draw:"study", lobby:"hub", meet:"hub"};
routeHooks.push((kind,id)=>{ const n = kind==="room" ? id : kind==="play" ? GAME_AT[id] : ROUTE_NODE[kind]; if(n && PLACES[n] && nodeOpen(n) && WS.at!==n){ WS.at=n; if(!WS.visited.includes(n)) WS.visited.push(n); saveWorld(); } });

Object.assign(ROUTES, {
  world:{view:r=>viewWorld(r), title:()=>"خريطة القلعة", noBack:true}
});
