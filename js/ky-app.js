/* ============ تشغيل «مغامرات خباب ويقين» ============ */
Object.assign(ROUTES, {
  meet:{view:(r)=>viewMeet(r), title:()=>"خباب ويقين", parent:"world"},
  paint:{view:(r,id)=>viewPaint(r,id), title:()=>"المرسم", parent:"book"},
  diary:{view:(r)=>viewDiary(r), title:()=>"دفتر المذكرات", parent:"book"},
  book:{view:r=>viewRoom(r,"study"), title:()=>"غرفة خباب ويقين", parent:"world"},
  draw:{view:r=>viewDraw(r), title:()=>"رسم مشترك", parent:"book"}
});
Object.assign(ROUTE_ALIAS, {hub:"world", explore:"world", intro:"open", forestgate:"world", arcade:"world", map:"world", forestintro:"world", cave:"world", jokes:"world", game:"world"});
routeHooks.push((kind,id)=>{ if(typeof Party!=="undefined" && Party.onRoute) Party.onRoute(kind+(id?":"+id:"")); });

/* ---------- القائمة: الإعدادات الثانوية بمكان واحد ---------- */
function syncToggles(){ document.documentElement.classList.toggle("calm", prefs.calm); }
function menuPop(){
  const ex=$(".menu-pop"); if(ex){ ex.remove(); return; }
  const m=h(`<div class="menu-pop" role="menu" aria-label="القائمة">
    <button role="menuitem" data-m="sound" aria-pressed="${prefs.sound}">${IC.sound}<span>${prefs.sound?"الأصوات شغّالة":"الأصوات مكتومة"}</span></button>
    <button role="menuitem" data-m="calm" aria-pressed="${prefs.calm||sysReduce.matches}">${IC.calm}<span>${prefs.calm||sysReduce.matches?"حركة الخلفية متوقفة":"إيقاف حركة الخلفية"}</span></button>
    <hr>
    <button role="menuitem" data-m="intro">${IC.restart}<span>إعادة مشاهدة المقدمة</span></button>
    <button role="menuitem" data-m="meet">${faceHTML("y",1,24)}<span>تعرّفوا على خباب ويقين</span></button>
    <button role="menuitem" data-m="board">${IC.gift}<span>لوحة الألعاب</span></button>
    <hr>
    <button role="menuitem" data-m="settings">${IC.gear}<span>الإعدادات والحفظ</span></button>
  </div>`);
  document.body.appendChild(m);
  const close=()=>m.remove();
  $$("[data-m]",m).forEach(b=>b.onclick=()=>{ const k=b.dataset.m; close();
    if(k==="sound"){ Sound.set(!prefs.sound); toast(prefs.sound?"الأصوات شغّالة":"الأصوات مكتومة","sound"); }
    else if(k==="calm"){ if(sysReduce.matches){ toast("الحركة مخفّضة من إعدادات الجهاز","calm"); return; } prefs.calm=!prefs.calm; Store.set("prefs",prefs); syncToggles(); toast(prefs.calm?"وقّفنا حركة الخلفية":"رجعت الحركة","calm"); go(current,false); }
    else if(k==="intro") go("open");
    else if(k==="meet") go("meet");
    else if(k==="board") gameBoard();
    else if(k==="settings") settingsBox();
  });
  setTimeout(()=>document.addEventListener("pointerdown", function off(e){ if(!m.contains(e.target) && !e.target.closest("#menuBtn")){ m.remove(); document.removeEventListener("pointerdown",off); } }),0);
}
function settingsBox(){
  const md=modal(`<h2>الإعدادات والحفظ</h2>
    <p>كل التقدّم (المهمات، الحكايات، الرسومات والمذكرات) ينحفظ على هذا الجهاز فقط داخل المتصفح. ما نجمع أي بيانات. اللعب مع صديق يمرر الاسم المستعار وحركات اللعب بس، وما يحفظها.</p>
    <div class="row"><button class="btn" data-export>${IC.save} نسخة من التقدّم</button><button class="btn ghost" data-import>${IC.upload} استرجاع نسخة</button><button class="btn danger" data-wipe>${IC.trash} مسح كل التقدّم</button></div>`, {wide:true});
  $("[data-export]",md.el).onclick=()=>{ const data={}; try{ Object.keys(localStorage).filter(k=>k.startsWith(STORE_PREFIX)).forEach(k=>data[k]=localStorage.getItem(k)); }catch(e){} offerDownload("مغامرات-خباب-ويقين-نسخة.json", JSON.stringify(data), ()=>modal(`<textarea rows="8" style="width:100%">${esc(JSON.stringify(data))}</textarea>`)); };
  $("[data-import]",md.el).onclick=()=>{ const f=$("#importFile"); f.onchange=async()=>{ try{ const d=JSON.parse(await f.files[0].text()); Object.entries(d).forEach(([k,v])=>{ if(k.startsWith(STORE_PREFIX)) localStorage.setItem(k,v); }); location.reload(); }catch(e){ toast("الملف مو نسخة صحيحة","close"); } }; f.click(); };
  $("[data-wipe]",md.el).onclick=()=>{ md.close(); confirmBox("تمسحون كل التقدّم والرسومات والمذكرات من هذا الجهاز؟","امسحوا كلشي",()=>{ Store.clearAll(); location.reload(); }); };
}

/* ---------- لمس الهاتف: لا سحب صور ولا تكبير بالنقر مرتين داخل مناطق اللعب ---------- */
document.addEventListener("dragstart", e=>{ if(e.target && (e.target.tagName==="IMG" || e.target.closest("svg"))) e.preventDefault(); });
document.addEventListener("dblclick", e=>{ if(e.target.closest("#app") && !e.target.closest("input,textarea")) e.preventDefault(); }, {passive:false});
// iOS القديم ما يحترم touch-action: نمنع النقرة الثانية السريعة من تكبير الصفحة داخل مناطق اللعب فقط
let lastTouchEnd=0;
document.addEventListener("touchend", e=>{ const now=Date.now(); if(now-lastTouchEnd<320 && e.target.closest(".view,.topbar,.dlg,.modal") && !e.target.closest("input,textarea,select,.letter,.dj-sheet")){ e.preventDefault(); e.target.click && e.target.closest("button,.btn,[data-node],[data-r]") && e.target.closest("button,.btn,[data-node],[data-r]").click(); } lastTouchEnd=now; }, {passive:false});
document.addEventListener("contextmenu", e=>{ if(e.target.closest(".view .kidfig, .view img, .view svg, .view canvas")) e.preventDefault(); });

/* ---------- الإقلاع ---------- */
fillIcons(); prefs.sound=false; syncToggles(); renderStars(false);
document.title = CONFIG.siteTitle;
$("#menuBtn").onclick=menuPop;
$("#mapBtn").onclick=toggleMiniMap;
$("#journalBtn").onclick=()=>openJournal();
$("#friendBtn").onclick=()=>go("lobby");
updateJournalDot();
if(!Store.ok) setTimeout(()=>toast("المتصفح ما يسمح بالحفظ — التقدّم يضيع عند الإغلاق","bulb"), 1200);
const start = location.hash.slice(1);
const validR = r => { const [k,id]=r.split(":"); if(ROUTE_ALIAS[k]) return true; if(!ROUTES[k]) return false; if(k==="play") return !!KG[id]; if(k==="tale") return !!TALEBOOK.find(t=>t.id===id); if(k==="room") return !!ROOMS[id] && nodeOpen(id); if(k==="region") return !!REGIONS[id]; return true; };
const roomQ = new URLSearchParams(location.search).get("room");
let savedRoom=null; try{ savedRoom=JSON.parse(sessionStorage.getItem("khy_room")||"null"); }catch(e){}
const sameRoom = savedRoom && (!roomQ || savedRoom.code===roomQ.toUpperCase());
const resumed = sameRoom ? Party.resume() : Promise.resolve(false);
// أول مرة تنعرض المقدمة كاملة، وبعدها الدخول مباشر للعالم (والمقدمة تنعاد من القائمة)
const firstRoute = roomQ && !sameRoom ? "lobby" : (validR(start) && start ? start : (Store.get("introSeen",false) ? "world" : "open"));
go(firstRoute, false);
resumed.then(ok=>{ if(ok && current!=="lobby") toast("رجعنا لغرفة اللعب ويه صديقك","friends"); });
try{ history.replaceState({route:current},"",location.search+"#"+current); }catch(e){}
