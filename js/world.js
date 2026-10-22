/* =====================================================================
   عالم «مغامرات خباب ويقين» — موسم الخريف بعالم أيلاف
   خريطة متفرعة فوق لوحة القلعة الأصلية، مسارات تنفتح بالمفاتيح والألغاز والمساعدة،
   مهمة رئيسية (ساعة الخريف) ومهمات جانبية، دفتر مهام، وخريطة حكاية.
   الحركة نفسها حركة خريطة أيلاف: درب منقّط، حلقات نابضة، ومشي على المنحنى بنفس التوقيت.
   ===================================================================== */

/* ---------- حالة العالم (تنحفظ على الجهاز) ---------- */
const WS = (() => {
  const base = {at:"plaza", flags:{}, items:{}, gears:[], tickets:[], leaves:[], notes:[], lamps:[], visited:["plaza"], opened:[], rewards:[], fresh:[], song:""};
  const s = Object.assign(base, Store.get("world", {}));
  const legacy = Store.get("explore", null);       // تقدّم «ساحة الاستكشاف» القديمة ينتقل كما هو
  if(legacy && !s.migrated){ s.leaves = Array.from(new Set([...(s.leaves||[]), ...(legacy.leaves||[])])); s.notes = Array.from(new Set([...(s.notes||[]), ...(legacy.notes||[])])); if(legacy.room) s.flags.roomTidy = true; s.flags.trainRides = legacy.train||0; }
  s.migrated = true;
  return s;
})();
function saveWorld(){ Store.set("world", WS); }
const flag = k => !!WS.flags[k];
const hasItem = k => !!WS.items[k];
function setFlag(k, v=true){ if(WS.flags[k]===v) return; WS.flags[k]=v; saveWorld(); checkUnlocks(); }
const ITEM_INFO = {
  glassKey:{n:"المفتاح الزجاجي", art:()=>ART.glassKey()},
  seed:{n:"بذرة "+CONFIG.heroName, art:()=>ART.seed()},
  bell:{n:"جرس زعفرانة", art:()=>ART.bell()},
  sumoHat:{n:"قبعة "+CONFIG.guestName, art:()=>ART.sumoHat()},
  feather:{n:"ريشة أم الحكايات", art:()=>ART.feather()},
  clue:{n:"رسالة الجدّة المطوية", art:()=>ART.letter()}
};
function giveItem(k){ if(WS.items[k]) return false; WS.items[k]=true; saveWorld(); Sound.chime(); toast("لگيتوا: "+ITEM_INFO[k].n, "star"); checkUnlocks(); return true; }
function takeItem(k){ delete WS.items[k]; saveWorld(); }
const GEARS = {copper:{n:"ترس النحاس", c:"#C77B3A", at:"machine"}, glass:{n:"ترس الزجاج", c:"#8EC3CF", at:"greenhouse"}, iron:{n:"ترس الحديد", c:"#7D7F86", at:"abandoned"}, gold:{n:"ترس الذهب", c:"#E8C066", at:"passage"}};
function giveGear(id){ if(WS.gears.includes(id)) return false; WS.gears.push(id); saveWorld(); Sound.win(); confetti(); toast(`${GEARS[id].n}! (${WS.gears.length} من 4)`, "gear"); addStars(2); checkUnlocks(); return true; }
const TICKETS = {
  elaf:{n:"قطعة من "+CONFIG.heroName, how:"العبوا لعبة وحدة بغابة "+CONFIG.heroName+" أو اكتشفوا سر صغير بيها، وبعدين سلّموا عليها", at:"forest"},
  owl:{n:"قطعة من أم الحكايات", how:"خلّصوا أي حكاية من «حكاياتنا»", at:"library"},
  show:{n:"قطعة من مسرح القصر", how:"سوّوا أول عرض أزياء", at:"palace"},
  train:{n:"قطعة من سائق القطار", how:"فوزوا بلعبة «قطار منتصف الخريف»", at:"station"},
  cat:{n:"قطعة من زعفرانة", how:"رجّعوا جرس زعفرانة الضايع", at:"station"}
};
function giveTicket(id){ if(WS.tickets.includes(id)) return false; WS.tickets.push(id); saveWorld(); Sound.chime(); toast(`قطعة تذكرة! (${WS.tickets.length} من 5)`, "star"); addStars(1); checkUnlocks(); return true; }

/* ---------- المكافآت التجميلية: تنفتح باللعب فقط (بدون دفع أو صناديق حظ) ---------- */
const REWARDS = {
  wings_maple:{n:"أجنحة أوراق الخريف", kind:"wings", id:"maple"},
  wings_gears:{n:"أجنحة ميكانيكية فكتورية", kind:"wings", id:"gears"},
  wings_petals:{n:"أجنحة البتلات", kind:"wings", id:"petals"},
  wings_glass:{n:"أجنحة الزجاج الملوّن", kind:"wings", id:"glass"},
  acc_conductor:{n:"قبعة سائق القطار", kind:"acc", id:"conductor"},
  acc_lantern:{n:"فانوس صغير باليد", kind:"acc", id:"lantern"},
  acc_mushroom:{n:"قبعة فطر وردية", kind:"acc", id:"mushroom"},
  acc_feather:{n:"ريشة البومة للشعر", kind:"acc", id:"feather"},
  sticker_stamp:{n:"ملصق طابع القلعة", kind:"sticker", id:"stamp"},
  sticker_owl:{n:"ملصق أم الحكايات", kind:"sticker", id:"owl"},
  decor_garland:{n:"إكليل أوراق لغرفة الدفتر", kind:"decor", id:"garland"},
  decor_clock:{n:"ساعة صغيرة لغرفة الدفتر", kind:"decor", id:"clock"},
  medal_clock:{n:"وسام ساعة الخريف", kind:"medal", id:"clock"}
};
const hasReward = id => WS.rewards.includes(id);
function grantReward(id){ if(!REWARDS[id] || hasReward(id)) return false; WS.rewards.push(id); saveWorld(); setTimeout(()=>toast("مكافأة جديدة: "+REWARDS[id].n, "gift"), 900); return true; }
const talesDone = () => { const p=Store.get("tales",{}); return Object.values(p).filter(n=>n>=3).length; };
const forestWins = () => (CONFIG.gameOrder||[]).filter(g=>progress.wins[g]).length;

/* ---------- العقد والمسارات (إحداثيات % على لوحة القلعة) ---------- */
const NODES = {
  plaza:{name:"ساحة الاستكشاف", x:44, y:88, gate:5, ic:"plaza", npc:"jm", desc:"نقطة الرجوع: لوحة الألعاب، دفتر المهام، الألبوم، واللعب ويه صديق."},
  lanterns:{name:"درب الفوانيس", x:9, y:72, ic:"lantern", desc:"درب مضوّي بالفوانيس. هنا لعبة «صيد الفوانيس» قبل لا تاخذها الريح."},
  bridge:{name:"الجسر الحجري", x:26, y:67, ic:"bridge", desc:"جسر قديم فوق الضباب. منه يبدي طريق القطار لغابة "+CONFIG.heroName+"."},
  station:{name:"محطة القطار", x:17, y:50, ic:"train", npc:"cat", room:true, desc:"زعفرانة تحرس المحطة. قطار منتصف الخريف ورحلة على القناطر."},
  forest:{name:"غابة "+CONFIG.heroName, x:9, y:26, gate:1, ic:"forest", npc:"elaf", desc:"غابة الألعاب: عالم "+CONFIG.heroName+" بكل ألعابه ونكته وأسراره."},
  abandoned:{name:"المحطة المهجورة", x:5, y:45, ic:"oldtrain", room:true, desc:"محطة نامت من سنين. بابها يحتاج تذكرة كاملة."},
  garden:{name:"حديقة القلعة", x:33, y:80, ic:"garden", desc:"سياج وأشجار مقصوصة: مقلاع أوراق الخريف ومتاهة الأوراق المزدوجة."},
  hidden:{name:"الحديقة المخفية", x:18, y:90, ic:"secretgarden", room:true, mystery:true, desc:"ورا الأغصان، حديقة ما يعرفها أحد."},
  greenhouse:{name:"الدفيئة", x:59, y:58, ic:"greenhouse", npc:"narjis", room:true, desc:"بيت زجاج دافي، الخالة نرجس وألغاز الضوء والماي."},
  passageLG:{name:"ممر الكتب الخضراء", x:48, y:55, ic:"vines", room:true, desc:"ممر سري بين الدفيئة والمكتبة، الأغصان مغطية الكتب."},
  gate:{name:"بوابة القلعة", x:55, y:41, ic:"castlegate", desc:"جسر البوابة المتحرك: لعبة «جسر الساعة» تفتحه بالتعاون."},
  library:{name:"مكتبة الحكايات", x:41, y:35, gate:2, ic:"library", npc:"owl", room:true, desc:"«حكاياتنا»: كتب تنفتح وتصير حكايات تنلعب، وأم الحكايات تحرسها."},
  study:{name:"غرفة دفترنا", x:35, y:20, gate:4, ic:"study", room:true, desc:"غرفة دافية بشبّاك خريفي: مذكرات، رسم، رسائل ورسم مشترك."},
  passage:{name:"الممر خلف اللوحة", x:27, y:32, ic:"portrait", room:true, secret:true, desc:"ممر مخفي ورا لوحة قديمة، جدرانه مليانة صور."},
  tower:{name:"برج الساعة", x:63, y:27, ic:"clock", npc:"saadoun", room:true, desc:"الساعة الكبيرة واقفة، والعم سعدون يدوّر على حل."},
  machine:{name:"غرفة الآلات", x:69, y:40, ic:"gears", room:true, desc:"تروس وأنابيب وبخار تحت البرج."},
  roof:{name:"سطح القلعة", x:46, y:8, ic:"roof", room:true, desc:"فوق كل الأبراج… هنا قلب ساعة الخريف."},
  palaceRoad:{name:"درب العربات", x:70, y:84, ic:"cart", desc:"درب حجري نازل من القصر: سباق عربات البلدة."},
  palace:{name:"قصر الأزياء", x:88, y:44, gate:3, ic:"palace", npc:"sumo", desc:"قاعة زجاج وثريات: "+CONFIG.heroName+" الستايلست، ورشة ملابس وأجنحة ومسرح عرض."},
  balcony:{name:"الشرفة", x:84, y:14, ic:"balcony", room:true, desc:"شرفة تطل على العالم كله، وبيها منظار وطوابع."}
};
const EDGES = [
  ["plaza","lanterns",[[26,84]]], ["plaza","bridge",[[36,74]]], ["bridge","station",[]], ["station","forest",[[12,38]]], ["station","abandoned",[]],
  ["plaza","garden",[[38,85]]], ["garden","hidden",[[24,88]]],
  ["plaza","greenhouse",[[54,77]]], ["greenhouse","gate",[[58,48]]], ["greenhouse","passageLG",[]], ["passageLG","library",[]],
  ["gate","library",[]], ["gate","tower",[]], ["library","study",[]], ["study","passage",[]], ["tower","machine",[]], ["machine","roof",[[60,14]]],
  ["plaza","palaceRoad",[[58,91]]], ["palaceRoad","palace",[[82,68]]], ["palace","balcony",[]]
];
/* كل قفل له بدائل حتى ما ينجبر اللاعب يعيد لعبة كاملة */
const LOCKS = {
  abandoned:{open:()=>WS.tickets.length>=3, why:()=>`الباب يحتاج 3 قطع من التذكرة الممزقة — عندكم ${WS.tickets.length}. القطع عند ${CONFIG.heroName}، أم الحكايات، مسرح القصر، سائق القطار، وزعفرانة.`},
  hidden:{open:()=>WS.leaves.length>=5 || hasItem("seed"), why:()=>`الأغصان سادّة الطريق. يفتحه: 5 أوراق نادرة (عندكم ${WS.leaves.length})، أو «بذرة ${CONFIG.heroName}» من غابتها بعد ما تفوزون بلعبتين هناك.`},
  passageLG:{open:()=>hasItem("glassKey") || talesDone()>=2, why:()=>`باب زجاجي مقفول. يفتحه: المفتاح الزجاجي من الخالة نرجس بالدفيئة، أو أم الحكايات إذا خلّصتوا حكايتين (خلّصتوا ${talesDone()}).`},
  passage:{open:()=>flag("clueRead") || WS.notes.length>=3, why:()=>`ماكو طريق واضح… يمكن رسالة بغرفة دفترنا، أو 3 رسائل مخفية (لگيتوا ${WS.notes.length}).`},
  machine:{open:()=>flag("towerFixed"), why:()=>"الباب ينفتح لما تشتغل تروس البرج. روحوا للعم سعدون."},
  roof:{open:()=>WS.gears.length>=4, why:()=>`السلّم للسطح يحتاج التروس الذهبية الأربعة — عندكم ${WS.gears.length}.`},
  balcony:{open:()=>!!progress.once_runway1 || flag("hatReturned"), why:()=>`باب الشرفة يفتحه أول عرض أزياء، أو إذا رجّعتوا قبعة ${CONFIG.guestName}.`}
};
const nodeOpen = id => !LOCKS[id] || LOCKS[id].open();
const nodeShown = id => !NODES[id].secret || nodeOpen(id);
const NODE_IDS = Object.keys(NODES);
function neighbors(id){ return EDGES.filter(e=>e[0]===id||e[1]===id).map(e=>e[0]===id?e[1]:e[0]); }
function routeTo(from, to){
  const prev={[from]:null}, q=[from];
  while(q.length){ const n=q.shift(); if(n===to) break; neighbors(n).forEach(m=>{ if(!(m in prev) && nodeShown(m) && (nodeOpen(m) || m===to)){ prev[m]=n; q.push(m); } }); }
  if(!(to in prev)) return null; const r=[]; for(let n=to;n!=null;n=prev[n]) r.unshift(n); return r;
}
function checkUnlocks(){
  let changed=false;
  NODE_IDS.forEach(id=>{ if(LOCKS[id] && nodeOpen(id) && !WS.opened.includes(id)){ WS.opened.push(id); WS.fresh.push(id); changed=true; setTimeout(()=>toast("انفتح طريق جديد: "+NODES[id].name, "lock"), 1500); } });
  if(changed) saveWorld();
  updateJournalDot();
}

/* ---------- المهمات ---------- */
const QUESTS = [
  {id:"clock", main:true, title:"ساعة الخريف", art:()=>ART.gear("#E8C066"),
    story:"ساعة البرج وقفت، فصار الخريف عالق بين العصر والمغرب. العم سعدون يحتاج مساعدتكم.",
    steps:[
      {t:"قابلوا العم سعدون ببرج الساعة", done:()=>flag("metSaadoun"), at:"tower"},
      {t:"شغّلوا تروس البرج حتى تنفتح غرفة الآلات", done:()=>flag("towerFixed"), at:"tower"},
      {t:"لگوا التروس الذهبية الأربعة", prog:()=>[WS.gears.length,4], done:()=>WS.gears.length>=4, at:()=>nextGearNode(),
        sub:()=>Object.entries(GEARS).map(([k,g])=>({t:`${g.n} — ${NODES[g.at].name}`, done:WS.gears.includes(k)}))},
      {t:"اصعدوا لسطح القلعة وشغّلوا الساعة", done:()=>flag("clockRestored"), at:"roof"}
    ], reward:"wings_gears"},
  {id:"leaves", title:"أوراق الخريف النادرة", art:()=>ART.maple("#E8C066"), prog:()=>[WS.leaves.length,8], at:()=>nextLeafNode(), hint:"8 أوراق ذهبية تلمع: 4 على الخريطة و4 بغرف بعيدة. الشرفة بيها منظار يدلّكم.", reward:"wings_maple"},
  {id:"letters", title:"رسائل مخفية", art:()=>ART.letter(), prog:()=>[WS.notes.length,5], at:()=>nextNoteNode(), hint:"رسائل صغيرة بين الحجار والأغصان. 3 رسائل تكشف طريق سري.", reward:"sticker_owl"},
  {id:"tickets", title:"التذكرة الممزقة", art:()=>ART.ticket(), prog:()=>[WS.tickets.length,5], at:()=>{ const k=Object.keys(TICKETS).find(t=>!WS.tickets.includes(t)); return k?TICKETS[k].at:"abandoned"; },
    sub:()=>Object.entries(TICKETS).map(([k,t])=>({t:t.how, done:WS.tickets.includes(k)})), hint:"3 قطع تفتح المحطة المهجورة، والخمسة تكمّل التذكرة.", reward:"acc_conductor"},
  {id:"lamps", title:"فوانيس الدرب", art:()=>ART.lantern(), prog:()=>[WS.lamps.length,5], at:()=>"plaza", hint:"خمس فوانيس مطفية على الخريطة. اضغطوا عليها حتى تضوي.", reward:"acc_lantern"},
  {id:"bell", title:"جرس زعفرانة", art:()=>ART.bell(), steps:[
      {t:"اسألوا زعفرانة بمحطة القطار", done:()=>flag("metCat"), at:"station"},
      {t:"دوّروا الجرس بغرفة الآلات", done:()=>hasItem("bell")||flag("catBell"), at:"machine"},
      {t:"رجّعوه لزعفرانة", done:()=>flag("catBell"), at:"station"}]},
  {id:"hat", title:"قبعة "+CONFIG.guestName, art:()=>ART.sumoHat(), steps:[
      {t:CONFIG.guestName+" بقصر الأزياء ضيّع قبعته", done:()=>flag("metSumo"), at:"palace"},
      {t:"دوّروها بالحديقة المخفية", done:()=>hasItem("sumoHat")||flag("hatReturned"), at:"hidden"},
      {t:"رجّعوها لـ"+CONFIG.guestName, done:()=>flag("hatReturned"), at:"palace"}], reward:"acc_mushroom"},
  {id:"owl", title:"أم الحكايات", art:()=>ART.feather(), prog:()=>[Math.min(talesDone(),2),2], at:()=>"library", hint:"خلّصوا حكايتين حتى تفتح أم الحكايات ممر الكتب الخضراء، وتنطيكم ريشتها.", reward:"acc_feather"}
];
const questDone = Q => Q.steps ? Q.steps.every(s=>s.done()) : (Q.prog()[0]>=Q.prog()[1]);
function questNext(Q){ if(Q.steps){ const s=Q.steps.find(s=>!s.done()); return s ? (typeof s.at==="function"?s.at():s.at) : null; } return questDone(Q) ? null : (Q.at ? Q.at() : null); }
function nextGearNode(){ const k=Object.keys(GEARS).find(g=>!WS.gears.includes(g) && nodeOpen(GEARS[g].at)) || Object.keys(GEARS).find(g=>!WS.gears.includes(g)); return k ? GEARS[k].at : "roof"; }
function checkQuestRewards(){ QUESTS.forEach(Q=>{ if(Q.reward && questDone(Q) && !hasReward(Q.reward)){ grantReward(Q.reward); addStars(3, "مهمة: "+Q.title); } }); }
function updateJournalDot(){ const d=$("#journalDot"); if(!d) return; const seen=Store.get("journalSeen",""); d.hidden = seen===journalSig(); }
const journalSig = () => QUESTS.map(Q=>Q.steps?Q.steps.filter(s=>s.done()).length:Q.prog()[0]).join(".")+"|"+WS.opened.length;

/* ---------- المقتنيات على الخريطة وبالغرف ---------- */
const LEAF_SPOTS = [{at:"map",x:6,y:40},{at:"map",x:22,y:58},{at:"map",x:48,y:64},{at:"map",x:90,y:58},{at:"hidden",x:78,y:62},{at:"roof",x:16,y:30},{at:"station",x:88,y:40},{at:"passageLG",x:70,y:28}];
const NOTE_SPOTS = [
  {at:"map", x:24, y:62, t:"رسالة بين أقواس الجسر: «الشجاع مو اللي ما يخاف… هو اللي يمسك إيد صاحبه ويكمّل»."},
  {at:"map", x:50, y:93, t:"ورقة تحت حجر الدرب: «كل ورقة خريف كانت يوم من أيام الصيف الحلوة»."},
  {at:"hidden", x:30, y:70, t:"ملاحظة بين الورد: «القصر يحب الضحك؛ كل ما تضحكون تضوي ثريا»."},
  {at:"map", x:13, y:33, t:"رسالة بالشجرة: «"+CONFIG.loverName+" خبّى هاي الكلمة هنا: إنتِ أحلى مغامرة»."},
  {at:"abandoned", x:62, y:30, t:"ورقة صفرة على الشبّاك: «يا سعدون، إذا وقفت الساعة يوم، دوّر التروس بأماكن ناسها. — جدّتك»."}
];
const LAMP_SPOTS = [[7,55],[68,56],[51,74],[44,77],[20,65]];
function nextLeafNode(){ const i=LEAF_SPOTS.findIndex((s,k)=>!WS.leaves.includes(k)); return i<0?null:(LEAF_SPOTS[i].at==="map"?"plaza":LEAF_SPOTS[i].at); }
function nextNoteNode(){ const i=NOTE_SPOTS.findIndex((s,k)=>!WS.notes.includes(k)); return i<0?null:(NOTE_SPOTS[i].at==="map"?"plaza":NOTE_SPOTS[i].at); }
function collectLeaf(i, el){
  if(WS.leaves.includes(i)) return; WS.leaves.push(i); saveWorld(); if(el){ el.classList.add("got"); setTimeout(()=>el.remove(),600); }
  Sound.chime(); toast(`ورقة نادرة! (${WS.leaves.length} من ${LEAF_SPOTS.length})`, "star"); addStars(1); checkUnlocks(); checkQuestRewards();
}
function readNote(i, el){
  const first = !WS.notes.includes(i);
  if(first){ WS.notes.push(i); saveWorld(); addStars(1, "رسالة مخفية"); checkUnlocks(); checkQuestRewards(); }
  if(el) el.classList.add("found");
  modal(`<div class="letter">${esc(NOTE_SPOTS[i].t)}</div><p class="d-note">الرسائل: ${WS.notes.length} من ${NOTE_SPOTS.length}${WS.notes.length>=3 && first && WS.notes.length===3?" — حسّيتوا بشي؟ جدار بالقلعة صار يرن…":""}</p>`);
}
const leafHTML = (i, s) => WS.leaves.includes(i) ? "" : `<button class="rare" data-leaf="${i}" style="left:${s.x}%;top:${s.y}%" aria-label="ورقة نادرة">${ART.maple(["#E8C066","#C8552B","#B33A26","#D9A53A"][i%4])}</button>`;
const noteHTML = (i, s) => `<button class="xnote ${WS.notes.includes(i)?"found":""}" data-note="${i}" style="left:${s.x}%;top:${s.y}%" aria-label="رسالة مخفية">${ART.letter()}</button>`;
function bindCollectibles(root){
  $$("[data-leaf]",root).forEach(b=>b.onclick=e=>{ e.stopPropagation(); collectLeaf(+b.dataset.leaf, b); });
  $$("[data-note]",root).forEach(b=>b.onclick=e=>{ e.stopPropagation(); readNote(+b.dataset.note, b); });
}

/* ---------- أيقونات العقد (مداليات صغيرة) ---------- */
const NODE_IC = {
  plaza:()=>`<svg viewBox="0 0 60 60"><path d="M10 46h40M14 46V28l16-12 16 12v18" fill="#F3E2C4" stroke="#6E4A22" stroke-width="3" stroke-linejoin="round"/><path d="M24 46V34h12v12" fill="#C99A3C" stroke="#6E4A22" stroke-width="2.5"/><circle cx="30" cy="26" r="3" fill="#B5482A"/></svg>`,
  lantern:()=>ART.lantern(), bridge:()=>`<svg viewBox="0 0 60 60"><path d="M4 40h52v8H4z" fill="#B8A890" stroke="#5A4A36" stroke-width="2.5"/><path d="M10 48a20 20 0 0140 0" fill="#7FA3B0" stroke="#5A4A36" stroke-width="2.5"/><path d="M4 40q26-20 52 0" fill="none" stroke="#5A4A36" stroke-width="3"/></svg>`,
  train:()=>`<svg viewBox="0 0 60 60"><rect x="8" y="22" width="40" height="22" rx="5" fill="#2F5E57" stroke="#1E3A36" stroke-width="2.5"/><rect x="14" y="27" width="10" height="9" fill="#FFD27A"/><rect x="28" y="27" width="10" height="9" fill="#FFD27A"/><rect x="40" y="12" width="8" height="12" fill="#3A2A1C"/><circle cx="18" cy="47" r="5" fill="#3A2A1C"/><circle cx="40" cy="47" r="5" fill="#3A2A1C"/></svg>`,
  oldtrain:()=>`<svg viewBox="0 0 60 60"><rect x="8" y="22" width="40" height="22" rx="5" fill="#8A7A66" stroke="#4A3A2A" stroke-width="2.5"/><path d="M14 27h10v9H14zM28 27h10v9H28z" fill="#5A4A3A"/><path d="M6 14l10 6M50 14l-8 8" stroke="#6E8A5A" stroke-width="3" stroke-linecap="round"/><circle cx="18" cy="47" r="5" fill="#3A2A1C"/><circle cx="40" cy="47" r="5" fill="#3A2A1C"/></svg>`,
  forest:()=>ART.treehouse(), garden:()=>`<svg viewBox="0 0 60 60"><ellipse cx="18" cy="38" rx="12" ry="14" fill="#5B7F4A" stroke="#2E4A2A" stroke-width="2.5"/><ellipse cx="42" cy="34" rx="12" ry="18" fill="#4E6A46" stroke="#2E4A2A" stroke-width="2.5"/><path d="M4 52h52" stroke="#6E4A22" stroke-width="4"/><circle cx="30" cy="22" r="5" fill="#C8552B"/></svg>`,
  secretgarden:()=>`<svg viewBox="0 0 60 60"><path d="M12 54V30a18 18 0 0136 0v24" fill="#3A4A2E" stroke="#2E4A2A" stroke-width="3"/><path d="M8 30c8-14 14 0 22-10s16 6 22 10" fill="none" stroke="#5B7F4A" stroke-width="5" stroke-linecap="round"/><circle cx="20" cy="22" r="3" fill="#E9A79E"/><circle cx="40" cy="24" r="3" fill="#F3C1BA"/></svg>`,
  greenhouse:()=>`<svg viewBox="0 0 60 60"><path d="M10 50V32a20 20 0 0140 0v18z" fill="rgba(200,235,230,.8)" stroke="#6E5A2A" stroke-width="2.5"/><path d="M30 12v38M10 36h40M18 18l4 32M42 18l-4 32" stroke="#6E5A2A" stroke-width="1.8"/><circle cx="22" cy="44" r="4" fill="#5B7F4A"/><circle cx="38" cy="44" r="4" fill="#C8552B"/></svg>`,
  vines:()=>`<svg viewBox="0 0 60 60"><rect x="10" y="12" width="10" height="38" fill="#7A2E2A" stroke="#3A1E14" stroke-width="2"/><rect x="22" y="16" width="10" height="34" fill="#2F5E57" stroke="#1E3A36" stroke-width="2"/><rect x="34" y="10" width="12" height="40" fill="#D9A53A" stroke="#6E4A22" stroke-width="2"/><path d="M6 20c14 6 22-6 30 4s14 4 18 0M8 38c10-6 18 6 28-2s12 2 18 6" fill="none" stroke="#5B7F4A" stroke-width="3.5" stroke-linecap="round"/></svg>`,
  castlegate:()=>`<svg viewBox="0 0 60 60"><path d="M8 52V18l6-6 6 6v6h20v-6l6-6 6 6v34z" fill="#C9B89A" stroke="#5A4A36" stroke-width="2.5" stroke-linejoin="round"/><path d="M22 52V38a8 8 0 0116 0v14z" fill="#3A2A1C"/><path d="M22 40h16M22 46h16M30 30v22" stroke="#8C6A48" stroke-width="2"/></svg>`,
  library:()=>ART.book("#7A2E2A"), study:()=>`<svg viewBox="0 0 60 60"><path d="M10 14h18c2 0 2 2 2 4v32c0-2-2-4-4-4H10z" fill="#F7EEDC" stroke="#6E4A22" stroke-width="2.5"/><path d="M50 14H32c-2 0-2 2-2 4v32c0-2 2-4 4-4h16z" fill="#F7EEDC" stroke="#6E4A22" stroke-width="2.5"/><path d="M14 22h10M14 28h12M36 22h10" stroke="#3E6FA0" stroke-width="2"/><path d="M46 6l6 6-14 22-6 2 2-6z" fill="#C8552B" stroke="#6E2419" stroke-width="2"/></svg>`,
  portrait:()=>`<svg viewBox="0 0 60 60"><rect x="10" y="8" width="40" height="46" rx="3" fill="#C99A3C" stroke="#6E4A22" stroke-width="3"/><rect x="16" y="14" width="28" height="34" fill="#3E4A7A"/><circle cx="30" cy="27" r="7" fill="#F2D2B4"/><path d="M20 48c2-10 18-10 20 0" fill="#7A2E2A"/></svg>`,
  clock:()=>clockSVG(10,10), gears:()=>ART.gear("#C77B3A"),
  roof:()=>`<svg viewBox="0 0 60 60"><path d="M30 4L14 40h32z" fill="#3E4A6A" stroke="#1E2A40" stroke-width="2.5" stroke-linejoin="round"/><path d="M30 4v-2l12 4-12 4" fill="#C8352B"/><rect x="16" y="40" width="28" height="14" fill="#C9B89A" stroke="#5A4A36" stroke-width="2.5"/><circle cx="30" cy="28" r="5" fill="#FFD27A"/></svg>`,
  cart:()=>`<svg viewBox="0 0 60 60"><path d="M8 26h40l-4 16H12z" fill="#B33A26" stroke="#5A1E14" stroke-width="2.5" stroke-linejoin="round"/><circle cx="18" cy="46" r="7" fill="#F3E6C8" stroke="#3A2A1C" stroke-width="3"/><circle cx="40" cy="46" r="7" fill="#F3E6C8" stroke="#3A2A1C" stroke-width="3"/><path d="M48 26l6-10" stroke="#3A2A1C" stroke-width="3" stroke-linecap="round"/></svg>`,
  palace:()=>ART.butterfly("#E9A79E","#E8C066"),
  balcony:()=>`<svg viewBox="0 0 60 60"><path d="M6 34h48v6H6z" fill="#C9B89A" stroke="#5A4A36" stroke-width="2.5"/><path d="M10 40v14M20 40v14M30 40v14M40 40v14M50 40v14" stroke="#5A4A36" stroke-width="3"/><path d="M22 34V20l14-8" stroke="#3A2A1C" stroke-width="4" stroke-linecap="round"/><circle cx="38" cy="11" r="5" fill="#8EC3CF" stroke="#3A2A1C" stroke-width="2.5"/></svg>`
};

/* ---------- علامات صغيرة فوق العقد: «!» مهمة، «؟» لغز، «✦» شي مخفي ---------- */
const ROOM_PUZZLE_DONE = {tower:()=>flag("towerFixed"), machine:()=>WS.gears.includes("copper"), greenhouse:()=>WS.gears.includes("glass"), abandoned:()=>WS.gears.includes("iron"), passage:()=>WS.gears.includes("gold"), hidden:()=>flag("hiddenFound"), passageLG:()=>flag("booksOrdered"), roof:()=>flag("clockRestored"), balcony:()=>flag("postcard")};
function nodeMarks(id){
  const m=[];
  if(QUESTS.some(Q=>Q.main && questNext(Q)===id)) m.push(["main","!","المهمة الرئيسية هنا"]);
  else if(QUESTS.some(Q=>!Q.main && questNext(Q)===id)) m.push(["side","!","مهمة جانبية"]);
  if(nodeOpen(id) && ROOM_PUZZLE_DONE[id] && !ROOM_PUZZLE_DONE[id]()) m.push(["puzzle","؟","لغز ما انحل"]);
  const hidden = LEAF_SPOTS.some((s,i)=>s.at===id && !WS.leaves.includes(i)) || NOTE_SPOTS.some((s,i)=>s.at===id && !WS.notes.includes(i));
  if(hidden && nodeOpen(id)) m.push(["secret","✦","شي مخفي"]);
  return m;
}

/* ---------- الخريطة ---------- */
const MAP_H = 56.25;
const ptOf = id => [NODES[id].x, NODES[id].y*MAP_H/100];
function edgePoints(a, b){ const e=EDGES.find(e=>(e[0]===a&&e[1]===b)||(e[0]===b&&e[1]===a)); const wp=(e?e[2]:[]).map(p=>[p[0],p[1]*MAP_H/100]); return e && e[0]===b ? wp.slice().reverse() : wp; }
function routePoints(route){ const pts=[ptOf(route[0])]; for(let i=1;i<route.length;i++){ pts.push(...edgePoints(route[i-1],route[i]), ptOf(route[i])); } return pts; }

function viewWorld(root){
  checkUnlocks();
  const firstTime = !flag("mapRevealed");
  const fresh = WS.fresh.slice(); WS.fresh=[]; saveWorld();
  const kidsHTML = `<div class="wm-kids" id="wmKids">${kidFigure("k")}${kidFigure("y")}</div>`;
  const friendAt = Party.connected() && Party.friendAt && NODES[Party.friendAt] ? Party.friendAt : null;
  const v = h(`<section class="view world-map ${firstTime&&motionOK()?"revealing":""}">
    <div class="mapscroll"><div class="mapscene wm-scene">
      <img class="wm-img" src="${CASTLE}" alt="خريطة العالم: القلعة الخريفية والبلدة والدروب" draggable="false">
      <div class="sky-tint ${flag("night")?"night":""}"></div>
      <svg class="map-path wm-paths" viewBox="0 0 100 ${MAP_H}" preserveAspectRatio="none" aria-hidden="true">
        ${EDGES.filter(e=>nodeShown(e[0])&&nodeShown(e[1])).map(e=>{ const open=nodeOpen(e[0])&&nodeOpen(e[1]); const isFresh=fresh.includes(e[0])||fresh.includes(e[1]); return `<path class="wm-edge ${open?"open":"locked"} ${isFresh?"fresh":""}" data-e="${e[0]}-${e[1]}" d="${catmull([ptOf(e[0]),...edgePoints(e[0],e[1]),ptOf(e[1])])}"/>`; }).join("")}
        <path class="wm-walk" d="M0 0"/>
      </svg>
      ${LAMP_SPOTS.map(([x,y],i)=>`<button class="wm-lamp ${WS.lamps.includes(i)?"lit":""}" data-lamp="${i}" style="left:${x}%;top:${y}%" aria-label="فانوس ${WS.lamps.includes(i)?"مضوّي":"مطفي"}"><i></i></button>`).join("")}
      ${LEAF_SPOTS.map((s,i)=>s.at==="map"?leafHTML(i,s):"").join("")}
      ${NOTE_SPOTS.map((s,i)=>s.at==="map"?noteHTML(i,s):"").join("")}
      ${NODE_IDS.filter(nodeShown).map(id=>{ const n=NODES[id], open=nodeOpen(id), mystery=n.mystery && !open; const marks=open||id==="roof"||id==="abandoned"?nodeMarks(id):[];
        return `<button class="spot wnode ${n.gate?"wgate":""} ${open?"":"locked"} ${fresh.includes(id)?"fresh":""} ${WS.at===id?"here":""}" data-node="${id}" style="left:${n.x}%;top:${n.y}%" aria-label="${esc(mystery?"مكان مجهول":n.name)}${open?"":" (مقفول)"}">
          <span class="ring"></span><span class="lm wn-ic">${mystery?`<b class="wn-q">؟</b>`:NODE_IC[n.ic]()}${open?"":`<span class="wn-lock">${IC.lock}</span>`}</span>
          <span class="tag">${n.gate?`<i class="wn-num">${n.gate}</i>`:""}${esc(mystery?"مكان مجهول":n.name)}</span>
          ${marks.length?`<span class="wn-marks">${marks.map(([c,s,t])=>`<i class="wm-mark ${c}" title="${t}">${s}</i>`).join("")}</span>`:""}
        </button>`; }).join("")}
      ${friendAt?`<div class="wm-friend" style="left:${NODES[friendAt].x}%;top:${NODES[friendAt].y}%">${kidFigure(Party.other?Party.other.char:"y","ghost")}<b>${esc(Party.other?Party.other.name:"صديق")}</b></div>`:""}
      ${kidsHTML}
      ${leafLayer(lowPower?4:9)}
    </div></div>
    <div class="wm-here panel" data-here></div>
    <div class="map-ui wm-ui">
      <button class="btn ghost small" data-home>${IC.back} للساحة</button>
      <button class="btn honey small" data-board>${IC.gift} لوحة الألعاب</button>
      <button class="btn ghost small" data-journal>${IC.quest} المهام</button>
      ${flag("clockRestored")?`<button class="btn ghost small" data-night>${flag("night")?"☀ نهار":"☾ ليل"}</button>`:""}
    </div>
  </section>`);
  root.appendChild(v);
  const scene=$(".wm-scene",v), scroll=$(".mapscroll",v), kids=$("#wmKids",v), walkPath=$(".wm-walk",v);
  const place=(x,y)=>{ kids.style.left=x+"%"; kids.style.top=y+"%"; };
  const startAt = firstTime ? null : (NODES[WS.at] && nodeOpen(WS.at) ? WS.at : "plaza");
  if(startAt) place(NODES[startAt].x, NODES[startAt].y); else place(44, 104);
  const center=(x, smooth)=>{ const left=Math.max(0, scene.offsetWidth*x/100 - scroll.clientWidth/2); if(smooth && motionOK()) scroll.scrollTo({left, behavior:"smooth"}); else scroll.scrollLeft=left; };
  requestAnimationFrame(()=>center(NODES[startAt||"plaza"].x));
  function here(){
    const n=NODES[WS.at]||NODES.plaza; const main=QUESTS[0]; const nxt=questNext(main); const step=main.steps.find(s=>!s.done());
    $("[data-here]",v).innerHTML = `<span class="wh-at">${speakerFace(Party.me.char||"y",0,34)}<span>أنتم بـ <b>${esc(n.name)}</b></span></span>${step?`<button class="wh-next" data-next="${nxt}">${IC.quest}<span>${esc(step.t)}</span></button>`:`<span class="wh-next done">${IC.check}<span>ساعة الخريف تشتغل!</span></span>`}`;
    const nb=$("[data-next]",v); if(nb) nb.onclick=()=>{ const id=nb.dataset.next; if(NODES[id]) focusNode(id); };
  }
  here();
  let walking=false;
  function walkRoute(route, done){
    if(!route || route.length<2 || !motionOK()){ const last=route?route[route.length-1]:WS.at; WS.at=last; saveWorld(); place(NODES[last].x,NODES[last].y); done&&done(); return; }
    walking=true; walkPath.setAttribute("d", catmull(routePoints(route)));
    const total=walkPath.getTotalLength(), dur=Math.min(1400, 250+total*6), t0=performance.now();
    const figs=$$(".kidfig",kids); figs.forEach(f=>f.classList.add("walking"));
    // نفس مشي أيلاف على الخريطة: easeInOutQuad + نطّات صغيرة
    const step=now=>{ const t=Math.min(1,(now-t0)/dur), e=t<.5?2*t*t:1-Math.pow(-2*t+2,2)/2; const p=walkPath.getPointAtLength(total*e); place(p.x, p.y/MAP_H*100);
      figs.forEach((f,i)=>f.style.transform=`translateY(${-Math.abs(Math.sin((t*Math.PI*5)+(i*.6)))*7}px)`);
      if(t<1) requestAnimationFrame(step); else { figs.forEach(f=>{ f.style.transform=""; f.classList.remove("walking"); }); walking=false; WS.at=route[route.length-1]; if(!WS.visited.includes(WS.at)) WS.visited.push(WS.at); saveWorld(); $$(".wnode",v).forEach(b=>b.classList.toggle("here", b.dataset.node===WS.at)); here(); if(Party.connected()) Party.send({t:"at", node:WS.at}); done&&done(); } };
    requestAnimationFrame(step);
  }
  function focusNode(id){ center(NODES[id].x, true); const b=$(`[data-node="${id}"]`,v); if(b){ b.classList.remove("pulse"); void b.offsetWidth; b.classList.add("pulse"); } }
  function openNode(id){
    if(walking) return; Sound.soft();
    if(!nodeOpen(id)){ const r=routeTo(WS.at, neighbors(id).find(nb=>nodeOpen(nb)&&nodeShown(nb))||WS.at); walkRoute(r, ()=>lockedCard(id)); return; }
    const r=routeTo(WS.at, id); if(!r){ toast("الطريق لهناك مقفول بعد","lock"); return; }
    walkRoute(r, ()=>placeCard(id, v));
  }
  $$("[data-node]",v).forEach(b=>b.onclick=e=>{ e.stopPropagation(); openNode(b.dataset.node); });
  bindCollectibles(v);
  $$("[data-lamp]",v).forEach(b=>b.onclick=e=>{ e.stopPropagation(); const i=+b.dataset.lamp; if(WS.lamps.includes(i)){ Sound.soft(); return; } WS.lamps.push(i); saveWorld(); b.classList.add("lit"); Sound.note(523+i*80); toast(`ضوّيتوا فانوس (${WS.lamps.length} من 5)`,"star"); if(WS.lamps.length===5){ addStars(2,"كل فوانيس الدرب"); checkQuestRewards(); } });
  $$(".wm-kids .kidfig",v).forEach(k=>k.onclick=e=>{ e.stopPropagation(); kidAct(k,"jump"); Sound.soft(); });
  scene.addEventListener("click", e=>{ if(e.target.closest("button")) return; const r=scene.getBoundingClientRect(); const x=(e.clientX-r.left)/r.width*100, y=(e.clientY-r.top)/r.height*100; const pc=h(`<span class="pop-critter" style="left:${x}%;top:${y}%">${ART.maple(["#C8552B","#E08A2E","#D9A53A"][Math.floor(Math.random()*3)])}</span>`); scene.appendChild(pc); setTimeout(()=>pc.remove(),1500); Sound.pop(); });
  $("[data-home]",v).onclick=()=>openNode("plaza");
  $("[data-board]",v).onclick=gameBoard;
  $("[data-journal]",v).onclick=()=>openJournal();
  const nb=$("[data-night]",v); if(nb) nb.onclick=()=>{ setFlag("night", !flag("night")); go("world",false); };
  // parallax وطبقة أوراق أمامية مثل خريطة أيلاف
  let mv;
  if(finePointer && motionOK() && !lowPower){
    const img=$(".wm-img",v), amb=$(".ambient",v);
    mv=e=>{ const dx=e.clientX/innerWidth-.5, dy=e.clientY/innerHeight-.5; if(amb) amb.style.transform=`translate(${-dx*18}px,${-dy*12}px)`; img.style.transform=`translate(${dx*6}px,${dy*4}px) scale(1.02)`; };
    window.addEventListener("pointermove", mv);
  }
  // أول دخول: الدرب ينرسم، المحطات تطلع، وخباب ويقين يمشون للساحة
  const timers=[];
  if(firstTime){
    setFlag("mapRevealed");
    timers.push(setTimeout(()=>walkRoute(null), 0));
    const intro=()=>dialogue(v,[["jm",1,`هلا خباب ويقين! آني ${CONFIG.companionName}، رفيق ${heroName()}. هاي خريطة الموسم الجديد.`],["k",1,"شگد بيها طرق! منين نبدي؟"],["jm",0,"الساحة نقطة الرجوع. الدروب المنقطة مفتوحة، واللي عليها قفل تحتاج مفتاح، لغز، أو مساعدة أحد."],["y",2,"وشنو هاي العلامات الصغيرة؟ «!» و«؟» و«✦»؟"],["jm",1,"«!» مهمة، «؟» لغز ما انحل، و«✦» شي مخفي. وكل مهماتكم مكتوبة بدفتر المهام."],["y",0,"شوفوا! الساعة فوگ البرج واقفة… خلّي نروح للعم سعدون."]], ()=>focusNode("tower"));
    if(motionOK()){ kids.style.transition="left 1.1s ease-out, top 1.1s ease-out"; timers.push(setTimeout(()=>{ place(NODES.plaza.x,NODES.plaza.y); WS.at="plaza"; saveWorld(); }, 900)); timers.push(setTimeout(()=>{ kids.style.transition=""; v.classList.remove("revealing"); intro(); }, 2300)); }
    else { place(NODES.plaza.x,NODES.plaza.y); WS.at="plaza"; saveWorld(); intro(); }
  } else if(fresh.length){ timers.push(setTimeout(()=>focusNode(fresh[fresh.length-1]), 500)); }
  const offs=[];
  if(Party.connected()){ Party.send({t:"at", node:WS.at}); offs.push(Party.on("at", ()=>{ if(!walking) go("world", false); })); }
  return ()=>{ timers.forEach(clearTimeout); mv && window.removeEventListener("pointermove", mv); offs.forEach(f=>f()); };
}

/* ---------- بطاقة المكان: نفس لوحة أيلاف الخشبية بس بطابع خريفي ---------- */
function npcLine(id){
  const L = {
    jm:()=> WS.gears.length===4 && !flag("clockRestored") ? "التروس الأربعة وياكم! السطح ينتظركم." : flag("clockRestored") ? `من اشتغلت الساعة، ${heroName()} تگول الغابة صارت تغني بالليل.` : pick(["إذا ضعتوا، افتحوا دفتر المهام. أو اسألوني!", "الفوانيس المطفية على الدرب تحب أحد يضوّيها.", `${heroName()} تسلّم عليكم. غابتها عبر الجسر والقطار.`]),
    elaf:()=> WS.tickets.includes("elaf") ? (hasItem("seed")?"البذرة اللي نطيتكم تفتح أغصان الحديقة المخفية. ديروا بالكم عليها!":`تعالوا العبوا بغابتي. إذا فزتوا بلعبتين أنطيكم بذرة سحرية.`) : (forestWins()||progress.secrets.length) ? "شفتكم بالغابة! تفضّلوا، هاي قطعة تذكرة لگيتها جوّا صندوق النكت." : "هلا بيكم! العبوا لعبة وحدة بغابتي، أو لگوا سر صغير، وعندي هدية إلكم.",
    cat:()=> flag("catBell") ? "مياو! الجرس رجع يرن. القطار يحترم قطة بجرس." : hasItem("bell") ? "هذا… جرسي!؟" : "مياو… ضيّعت جرسي من صار الخريف. آخر مرة سمعته يرن بغرفة الآلات.",
    narjis:()=> WS.gears.includes("glass") ? "نباتاتي فرحانة. ودوّروا الحديقة المخفية؛ ورودها أحلى من ورودي… بس لا تگولون إلي!" : "تعالوا شوفوا النباتات؛ كل وحدة تحتاج ضوء وماي بمقدار، ودفتري يگول شنو.",
    owl:()=> talesDone()>=2 ? "هوو هوو… حكايتين خلصت! الممر الأخضر انفتح إلكم." : (Object.keys(Store.get("taleChoices",{})).length ? "سمعت بخياراتكم بالحكايات… كل خيار يكتب صفحة جديدة." : "كل كتاب هنا حكاية تنلعب. خلّصوا وحدة وأنطيكم قطعة تذكرة."),
    sumo:()=> flag("hatReturned") ? "قبعتي رجعت! هسه أگدر أمشي بالعرض وراسي ما يبرد." : hasItem("sumoHat") ? "قبعتي!!" : "قبعتي الوردية طارت ويه الريح… يمكن وگعت بمكان مخفي بين الورد.",
    saadoun:()=> !flag("towerFixed") ? "الساعة وقفت والخريف علگ! ساعدوني أدوّر التروس." : WS.gears.length<4 ? `باقي ${4-WS.gears.length} تروس ذهبية. جدّتي جانت تخبّيها بأماكن ناسها.` : flag("clockRestored") ? "دنگ… دنگ! الوقت رجع يمشي. شكراً يا أبطال." : "التروس الأربعة! اصعدوا للسطح، ألحگكم."
  };
  return L[id] ? L[id]() : "";
}
function placeCard(id, host){
  const n=NODES[id]; const acts=NODE_ACTS[id] ? NODE_ACTS[id]() : [];
  if(n.room && nodeOpen(id)) acts.unshift({l:"ادخلوا", ic:"door", hot:true, run:()=>enterRoom(id)});
  const marks=nodeMarks(id);
  const md = modal(`<div class="pc-head"><span class="pc-ic">${NODE_IC[n.ic]()}</span><div><h2>${esc(n.name)}${n.gate?` <small class="pc-gate">بوابة ${n.gate}</small>`:""}</h2><p>${esc(n.desc)}</p></div></div>
    ${n.npc?`<div class="pc-npc">${speakerFace(n.npc,0,52)}<p><b style="color:${speakerColor(n.npc)}">${esc(speakerName(n.npc))}:</b> ${esc(npcLine(n.npc))}</p></div>`:""}
    ${marks.length?`<p class="pc-marks">${marks.map(([c,s,t])=>`<span><i class="wm-mark ${c}">${s}</i>${t}</span>`).join("")}</p>`:""}
    <div class="sign-opts">${acts.map((a,i)=>`<button class="sign-opt ${a.hot?"hot":""}" data-a="${i}" ${a.dis?"disabled":""}>${a.art?a.art():IC[a.ic||"star"]}<span><b>${esc(a.l)}</b>${a.s?`<small>${esc(a.s)}</small>`:""}</span></button>`).join("")}</div>`, {cls:"signboard autumn-sign"});
  $$("[data-a]",md.el).forEach(b=>b.onclick=()=>{ md.close(); acts[+b.dataset.a].run(); });
  if(n.npc==="cat") setFlag("metCat"); if(n.npc==="sumo") setFlag("metSumo");
  // المكافآت اللي تنطى من بطاقة المكان
  if(id==="forest" && !WS.tickets.includes("elaf") && (forestWins()||progress.secrets.length)) setTimeout(()=>giveTicket("elaf"), 400);
  if(id==="forest" && WS.tickets.includes("elaf") && forestWins()>=2 && !hasItem("seed")) setTimeout(()=>giveItem("seed"), 700);
  if(id==="library" && talesDone()>=1) setTimeout(()=>giveTicket("owl"), 400);
  if(id==="library" && talesDone()>=2 && !hasItem("feather")){ setTimeout(()=>{ giveItem("feather"); checkQuestRewards(); }, 800); }
  if(id==="palace" && progress.once_runway1) setTimeout(()=>giveTicket("show"), 400);
  if(id==="station" && progress.wins.kg_train) setTimeout(()=>giveTicket("train"), 400);
  if(id==="palace" && hasItem("sumoHat") && !flag("hatReturned")) setTimeout(()=>{ md.close(); dialogue(host||$("#view"), [["sumo",1,"قبعتي!! وين لگيتوها؟"],["y",1,"بالحديقة المخفية، بين الورد."],["sumo",1,"خذوا هاي قبعة فطر صغيرة مثلي، تذكار. وباب الشرفة صار مفتوح إلكم!"]], ()=>{ takeItem("sumoHat"); setFlag("hatReturned"); checkQuestRewards(); addStars(2); }); }, 500);
  if(id==="station" && hasItem("bell") && !flag("catBell")) setTimeout(()=>{ md.close(); dialogue(host||$("#view"), [["cat",1,"جرسي! رنّته تعرفها كل قطارات الخريف."],["k",1,"لگيناه بين الأنابيب بغرفة الآلات!"],["cat",1,"خذوا قطعة التذكرة اللي جنت حارستها. ميااو شكراً."]], ()=>{ takeItem("bell"); setFlag("catBell"); giveTicket("cat"); checkQuestRewards(); }); }, 500);
}
function lockedCard(id){
  const n=NODES[id], L=LOCKS[id];
  const md=modal(`<div class="pc-head"><span class="pc-ic locked">${n.mystery?`<b class="wn-q">؟</b>`:NODE_IC[n.ic]()}</span><div><h2>${esc(n.mystery?"مكان مجهول":n.name)} ${IC.lock}</h2><p>${esc(L.why())}</p></div></div>
    <div class="pc-npc">${faceHTML("y",2,52)}<p><b style="color:${CH.y.color}">يقين:</b> ${esc(pick(["ممكن نرجعله بعدين. نشوف دفتر المهام؟","أكو أكثر من طريقة نفتحه… خلّي نفكّر.","حفظت الشرط. نروح نجمع اللي نحتاجه؟"]))}</p></div>
    <div class="row"><button class="btn honey" data-j>${IC.quest} دفتر المهام</button><button class="btn ghost" data-x>تمام</button></div>`, {cls:"signboard autumn-sign"});
  $("[data-j]",md.el).onclick=()=>{ md.close(); openJournal(); }; $("[data-x]",md.el).onclick=md.close;
}
const playAct = (id, s) => ({l:KG[id].title, s:s||KG[id].tag, art:KG[id].icon, run:()=>go("play:"+id)});
const NODE_ACTS = {
  plaza:()=>[
    {l:"لوحة الألعاب", s:"كل الألعاب وأماكنها", ic:"gift", run:gameBoard},
    {l:"دفتر المهام", s:"المهمة الرئيسية والجانبية والمكافآت", ic:"quest", run:()=>openJournal()},
    {l:"الألبوم", s:"أوراق، رسائل، تذاكر، تروس", ic:"star", run:openAlbum},
    {l:"العب مع صديق", s:"أنشئ غرفة أو ادخل برمز", ic:"friends", run:()=>go("lobby")},
    {l:"تعرّفوا على خباب ويقين", s:"اللوحة الأصلية، الحركات، والتخصيص", art:()=>faceHTML("y",1,40), run:()=>go("meet")}
  ],
  lanterns:()=>[playAct("lanterns")],
  bridge:()=>[{l:"اقروا اللوحة الصغيرة", s:"لوحة خشبية على حافة الجسر", ic:"eye", run:()=>modal(`<div class="letter">«من هنا يمشي القطار لغابة ${heroName()}. اللي يعبر الجسر بقلب طيب، الضباب يفتحله الطريق.»</div>`)}],
  forest:()=>[{l:"ادخلوا غابة "+heroName(), s:"الغابة الأولى بكل ألعابها", art:()=>ART.treehouse(), hot:true, run:()=>go("map")},{l:"صندوق النكت العبيطة", art:()=>ART.jokeBox(), run:()=>go("jokes")}],
  station:()=>[playAct("train"), {l:"رحلة على القناطر", s:"ركوب القطار والتفرّج", ic:"eye", run:trainRide}],
  garden:()=>[playAct("sling"), playAct("maze")],
  greenhouse:()=>[playAct("greenhouse")],
  gate:()=>[playAct("bridge")],
  library:()=>[{l:"حكاياتنا", s:"خمس حكايات تنلعب بخيارات تغيّر الطريق", art:()=>ART.book("#2F5E57"), hot:true, run:()=>go("tales")}, playAct("library")],
  tower:()=>[playAct("orchestra")],
  palaceRoad:()=>[playAct("race")],
  palace:()=>[{l:"ورشة الستايلست", s:heroName()+" تصمم وياكم ملابس وأجنحة", art:()=>ART.butterfly("#E9A79E","#E8C066"), hot:true, run:()=>go("palace")},{l:"مسرح العرض", s:"عرض أزياء بأضواء وموسيقى", ic:"star", run:()=>go("show")}]
};
function enterRoom(id){ const el=$(`[data-node="${id}"]`); sceneLeave(el, ()=>go(id==="study"?"book":"room:"+id)); }
/* انتقال الدخول: نفس خروج مقدمة أيلاف (تكبير 1.18 وتلاشي .5s ease-in) من نقطة المكان */
function sceneLeave(el, fin){
  if(!motionOK()){ fin(); return; }
  const vw=$("#view"); if(el){ const r=el.getBoundingClientRect(); vw.style.transformOrigin=`${r.left+r.width/2}px ${r.top+r.height/2}px`; } else vw.style.transformOrigin="50% 50%";
  vw.classList.add("leaving"); Sound.chime(); setTimeout(()=>{ vw.classList.remove("leaving"); fin(); }, 480);
}
function trainRide(){
  WS.flags.trainRides=(WS.flags.trainRides||0)+1; saveWorld();
  modal(`<h2>رحلة على القناطر</h2><div class="ride"><div class="ride-far"></div><div class="ride-near"></div><div class="ride-train">${NODE_IC.train()}<span>${faceHTML("k",1,40)}${faceHTML("y",1,40)}</span></div></div><p class="d-note">القطار يمر فوگ الضباب… عدد الرحلات: ${WS.flags.trainRides}</p>`,{wide:true});
  Sound.chime(); addStarsOnce("train",1,"أول رحلة قطار");
}

/* ---------- لوحة الألعاب: إعلانات مثبّتة على لوح خشب بالساحة ---------- */
const GAME_AT = {sling:"garden", maze:"garden", lanterns:"lanterns", bridge:"gate", library:"library", orchestra:"tower", train:"station", race:"palaceRoad", greenhouse:"greenhouse"};
function gameBoard(){
  const md=modal(`<h2>لوحة الألعاب</h2><p style="margin:0">كل لعبة بمكانها بالعالم. تقدرون تلعبونها هسه، أو تمشون لمكانها. الألعاب الثنائية تنلعب على نفس الجهاز أو من جهازين.</p>
    <div class="board">${Object.entries(KG).map(([k,g])=>`<div class="poster" style="--tint:${g.tint||"#B5482A"}"><span class="pin"></span><span class="po-art">${g.icon?g.icon():""}</span><b>${esc(g.title)}</b><small>${esc(g.tag||"")} · ${esc(NODES[GAME_AT[k]].name)}</small><span class="po-tags"><i>ثنائية</i><i>جهازين</i>${progress.wins["kg_"+k]?`<i class="won">فزتوا ${progress.wins["kg_"+k]}</i>`:""}</span><span class="po-btns"><button class="btn small" data-play="${k}">العبوا</button><button class="btn ghost small" data-walk="${GAME_AT[k]}">روحوا للمكان</button></span></div>`).join("")}
      <div class="poster" style="--tint:#C76B8E"><span class="pin"></span><span class="po-art">${ART.butterfly("#E9A79E","#E8C066")}</span><b>عرض الأزياء المشترك</b><small>تصميم ومسرح متزامن · قصر الأزياء</small><span class="po-tags"><i>ثنائية</i><i>جهازين</i></span><span class="po-btns"><button class="btn small" data-route="show">العبوا</button></span></div>
      <div class="poster" style="--tint:#2F5E57"><span class="pin"></span><span class="po-art">${ART.book("#2F5E57")}</span><b>رسم مشترك</b><small>كل واحد بلونه ومؤشره · غرفة دفترنا</small><span class="po-tags"><i>ثنائية</i><i>جهازين</i></span><span class="po-btns"><button class="btn small" data-route="draw">ارسموا</button></span></div>
      <div class="poster solo" style="--tint:#4F7350"><span class="pin"></span><span class="po-art">${ART.treehouse()}</span><b>ألعاب غابة ${esc(heroName())}</b><small>${(CONFIG.gameOrder||[]).length} ألعاب فردية + صندوق النكت</small><span class="po-tags"><i>فردية</i></span><span class="po-btns"><button class="btn small" data-route="map">للغابة</button></span></div>
    </div>`, {wide:true, cls:"board-modal"});
  $$("[data-play]",md.el).forEach(b=>b.onclick=()=>{ md.close(); go("play:"+b.dataset.play); });
  $$("[data-route]",md.el).forEach(b=>b.onclick=()=>{ md.close(); go(b.dataset.route); });
  $$("[data-walk]",md.el).forEach(b=>b.onclick=()=>{ md.close(); walkToNode(b.dataset.walk); });
}
function walkToNode(id){ Store.set("walkTo", id); if(current!=="world") go("world"); else go("world", false); }

/* ---------- دفتر المهام ---------- */
function questHTML(Q){
  const done=questDone(Q), nxt=questNext(Q);
  let body="";
  if(Q.steps) body=`<ol class="q-steps">${Q.steps.map(s=>{ const d=s.done(); const pr=s.prog?s.prog():null; return `<li class="${d?"done":""}">${d?IC.check:"<i></i>"}<span>${esc(s.t)}${pr?` <b>(${pr[0]}/${pr[1]})</b>`:""}${s.sub&&!d?`<ul>${s.sub().map(x=>`<li class="${x.done?"done":""}">${esc(x.t)}</li>`).join("")}</ul>`:""}</span></li>`; }).join("")}</ol>`;
  else { const [a,b]=Q.prog(); body=`<div class="q-bar"><i style="width:${Math.min(100,a/b*100)}%"></i></div><p class="d-note">${a} من ${b}${Q.hint?" — "+esc(Q.hint):""}</p>${Q.sub?`<ul class="q-sub">${Q.sub().map(x=>`<li class="${x.done?"done":""}">${x.done?IC.check:""}${esc(x.t)}</li>`).join("")}</ul>`:""}`; }
  return `<div class="quest ${Q.main?"main":""} ${done?"done":""}"><div class="q-head"><span class="q-art">${Q.art()}</span><div><h3>${esc(Q.title)}</h3>${Q.story?`<p>${esc(Q.story)}</p>`:""}</div>${done?`<span class="q-ok">${IC.check} خلصت</span>`:nxt&&NODES[nxt]?`<button class="btn small" data-where="${nxt}">وين؟</button>`:""}</div>${body}${Q.reward?`<p class="q-rew">${IC.gift} المكافأة: ${esc(REWARDS[Q.reward].n)} ${hasReward(Q.reward)?"✔":""}</p>`:""}</div>`;
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
    else if(t==="paths") body.innerHTML = `<p class="d-note">الأماكن المقفولة وشلون تنفتح. كل قفل إله أكثر من طريق.</p><ul class="j-locks">${NODE_IDS.filter(id=>LOCKS[id]).map(id=>{ const o=nodeOpen(id), shown=nodeShown(id); return `<li class="${o?"open":""}">${o?IC.check:IC.lock}<span><b>${esc(shown||o?NODES[id].name:"مكان سري")}</b><small>${o?"مفتوح":esc(LOCKS[id].why())}</small></span>${o?`<button class="btn ghost small" data-where="${id}">روحوا</button>`:""}</li>`; }).join("")}</ul>`;
    else if(t==="rewards") body.innerHTML = `<div class="j-rew">${Object.entries(REWARDS).map(([k,r])=>`<div class="${hasReward(k)?"on":""}">${hasReward(k)?IC.gift:IC.lock}<span>${esc(r.n)}</span></div>`).join("")}</div><p class="d-note">الأجنحة والإكسسوارات المفتوحة تظهر بقصر الأزياء وبتخصيص خباب ويقين، والملصقات بالمرسم، والزينة بغرفة دفترنا.</p><h3 class="j-h">أغراض بالجيب</h3><div class="j-items">${Object.keys(WS.items).length?Object.keys(WS.items).map(k=>`<span>${ITEM_INFO[k].art()}<small>${esc(ITEM_INFO[k].n)}</small></span>`).join(""):"<p class='d-note'>الجيب فارغ.</p>"}</div>`;
    else body.innerHTML = taleJournalHTML();
    $$("[data-where]",body).forEach(b=>b.onclick=()=>{ md.close(); walkToNode(b.dataset.where); });
  };
  $$("[data-t]",md.el).forEach(b=>b.onclick=()=>draw(b.dataset.t));
  draw(tab);
}
function openAlbum(){
  modal(`<h2>الألبوم</h2><p>الأوراق النادرة: ${WS.leaves.length} من ${LEAF_SPOTS.length}</p><div class="album">${LEAF_SPOTS.map((_,i)=>`<span class="${WS.leaves.includes(i)?"on":""}">${ART.maple(["#E8C066","#C8552B","#B33A26","#D9A53A"][i%4])}</span>`).join("")}</div>
    <p>التروس الذهبية: ${WS.gears.length} من 4</p><div class="album">${Object.entries(GEARS).map(([k,g])=>`<span class="${WS.gears.includes(k)?"on":""}" title="${g.n}">${ART.gear(g.c)}</span>`).join("")}</div>
    <p>قطع التذكرة: ${WS.tickets.length} من 5</p><div class="album">${Object.keys(TICKETS).map(k=>`<span class="${WS.tickets.includes(k)?"on":""}">${ART.ticket()}</span>`).join("")}</div>
    <p>الرسائل: ${WS.notes.length} من ${NOTE_SPOTS.length}</p>${WS.notes.map(i=>`<div class="letter" style="margin-top:8px">${esc(NOTE_SPOTS[i].t)}</div>`).join("")}
    <p>الفوانيس المضوّية: ${WS.lamps.length} من 5 · الأماكن اللي زرتوها: ${WS.visited.length} من ${NODE_IDS.length}</p>`, {wide:true});
}

/* ---------- خريطة الحكاية المصغّرة (زر «الخريطة» بالشريط) ---------- */
function toggleMiniMap(){
  const ex=$(".mini-map"); if(ex){ ex.remove(); return; }
  const [kind,id]=current.split(":"); const here = kind==="world" ? WS.at : (ROUTE_NODE[kind==="room"?id:kind] || WS.at);
  const W=100, H=MAP_H;
  const m=h(`<div class="mini-map panel" role="dialog" aria-label="خريطة الحكاية"><div class="mm-title"><b>خريطة الحكاية</b><button class="ibtn" data-x aria-label="إغلاق">${IC.close}</button></div>
    <div class="mm"><img src="${CASTLE}" alt=""><svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="none">${EDGES.filter(e=>nodeShown(e[0])&&nodeShown(e[1])).map(e=>`<path class="${nodeOpen(e[0])&&nodeOpen(e[1])?"open":"locked"}" d="${catmull([ptOf(e[0]),...edgePoints(e[0],e[1]),ptOf(e[1])])}"/>`).join("")}</svg>
    ${NODE_IDS.filter(nodeShown).map(id=>{ const o=nodeOpen(id), mk=nodeMarks(id); return `<button class="mm-dot ${here===id?"here":""} ${o?"":"locked"} ${NODES[id].gate?"wgate":""}" style="left:${NODES[id].x}%;top:${NODES[id].y}%" data-n="${id}" aria-label="${esc(NODES[id].mystery&&!o?"مكان مجهول":NODES[id].name)}">${mk.length?`<i class="wm-mark ${mk[0][0]}">${mk[0][1]}</i>`:""}</button>`; }).join("")}</div>
    <div class="mm-legend"><span><i class="lg here"></i>أنتم هنا</span><span><i class="lg open"></i>مفتوح</span><span><i class="lg locked"></i>مقفول</span><span><i class="wm-mark main">!</i>مهمة</span><span><i class="wm-mark puzzle">؟</i>لغز</span><span><i class="wm-mark secret">✦</i>سر</span></div>
    <div class="row" style="margin-top:6px"><button class="btn small" data-world>${IC.map} الخريطة الكاملة</button><button class="btn ghost small" data-j>${IC.quest} المهام</button></div></div>`);
  document.body.appendChild(m);
  $("[data-x]",m).onclick=()=>m.remove();
  $$("[data-n]",m).forEach(b=>b.onclick=()=>{ m.remove(); walkToNode(b.dataset.n); });
  $("[data-world]",m).onclick=()=>{ m.remove(); go("world"); };
  $("[data-j]",m).onclick=()=>{ m.remove(); openJournal(); };
  setTimeout(()=>document.addEventListener("pointerdown", function off(e){ if(!m.contains(e.target) && !e.target.closest("#mapBtn")){ m.remove(); document.removeEventListener("pointerdown",off); } }),0);
}
const ROUTE_NODE = {map:"forest", game:"forest", jokes:"forest", cave:"forest", tales:"library", tale:"library", palace:"palace", show:"palace", book:"study", diary:"study", paint:"study", draw:"study", lobby:"plaza", meet:"plaza"};

/* ---------- المقدمة: مشهد افتتاحي بلوحة القلعة كاملة ---------- */
function viewOpening(root){
  const back = flag("mapRevealed");
  const v=h(`<section class="view opening">
    <div class="op-frame"><img class="op-castle" src="${CASTLE}" alt="القلعة الخريفية فوق التلة، الدرب الحجري، الدفيئة، والقصر الزجاجي"></div>
    <div class="ambient" aria-hidden="true">${motionOK()?'<div class="lightray" style="left:22%"></div><div class="lightray" style="left:64%;animation-delay:-4s"></div>':""}</div>
    ${leafLayer(lowPower?6:16)}
    <div class="curtain l"></div><div class="curtain r"></div>
    <div class="op-card panel">
      <h1 class="op-h">مغامرات خباب ويقين</h1>
      <p class="op-sub">موسم الخريف وصل لعالم ${esc(heroName())}: قلعة مضيئة، دروب تتفرع، حكايات تنلعب، وألعاب ويه صديق.</p>
      <div class="op-cta"><button class="btn honey big" data-enter>${back?"كمّلوا المغامرة":"ادخلوا العالم"}</button><button class="btn ghost" data-meet>تعرّفوا على خباب ويقين</button><button class="btn ghost" data-friend>${IC.friends} العب مع صديق</button></div>
    </div>
    <div class="op-kids">${kidFigure("k","walk-in-r")}<button class="jm-wrap op-jm" aria-label="${CONFIG.companionName}">${ART.jaamous("idle")}<span class="bubble">${esc(back?"رجعتوا! الساعة بعدها تنتظركم.":"هلا! "+heroName()+" دزّتني أستقبلكم.")}</span></button>${kidFigure("y","walk-in-l")}</div>
  </section>`);
  root.appendChild(v);
  setTimeout(()=>v.classList.add("open"), 120);
  const kids=$$(".kidfig",v), jm=$(".op-jm",v);
  kids.forEach(k=>k.addEventListener("animationend", e=>{ if(e.animationName==="inR"||e.animationName==="inL") k.classList.remove("walk-in-r","walk-in-l"); }));
  setTimeout(()=>react($(".jm-wrap",v),"wave"), 1200);
  kids.forEach(k=>k.onclick=()=>{ kidAct(k,"jump"); Sound.soft(); });
  jm.onclick=()=>{ react(jm,"hop"); Sound.soft(); };
  let dl=null;
  const t=setTimeout(()=>{ if(!$(".dlg") && !back) dl=dialogue(v,[["k",1,"هلا هلا! آني خباب، وهاي يقين."],["y",0,"وصلتوا بوقت الغروب. بس… ليش الشمس ما تنزل؟"],["jm",0,"لأن ساعة البرج وقفت، والخريف علگ. نحتاجكم!"],["k",1,"يلا! آني أول واحد يوصل."]]); }, motionOK()?2600:300);
  $("[data-enter]",v).onclick=()=>{ dl&&dl.close(); Sound.chime(); if(motionOK()){ v.classList.add("leaving"); setTimeout(()=>go("world"), 480); } else go("world"); };
  $("[data-meet]",v).onclick=()=>{ dl&&dl.close(); go("meet"); };
  $("[data-friend]",v).onclick=()=>{ dl&&dl.close(); go("lobby"); };
  let mv; if(finePointer && motionOK() && !lowPower){ const img=$(".op-frame",v); mv=e=>{ const dx=e.clientX/innerWidth-.5, dy=e.clientY/innerHeight-.5; img.style.transform=`translate(${-dx*10}px,${-dy*6}px)`; kids.forEach((k,i)=>k.style.translate=`${dx*(i?14:-14)}px 0`); }; window.addEventListener("pointermove",mv); }
  return ()=>{ clearTimeout(t); dl&&dl.close(); mv&&window.removeEventListener("pointermove",mv); };
}

Object.assign(ROUTES, {
  open:{view:r=>viewOpening(r), title:()=>"مغامرات خباب ويقين", bare:true},
  world:{view:r=>{ const c=viewWorld(r); const w=Store.get("walkTo",null); if(w){ Store.del("walkTo"); setTimeout(()=>{ const b=$(`[data-node="${w}"]`); if(b) b.click(); }, 350); } return c; }, title:()=>"خريطة العالم", parent:"open"}
});
