/* ============ toggles & boot ============ */
function syncToggles(){ $("#soundBtn").setAttribute("aria-pressed", prefs.sound); $("#motionBtn").setAttribute("aria-pressed", prefs.calm || sysReduce.matches); document.documentElement.classList.toggle("calm", prefs.calm); }
$("#soundBtn").onclick=()=>{ Sound.set(!prefs.sound); syncToggles(); toast(prefs.sound?"أصوات الغابة شغّالة":"الأصوات مكتومة","sound"); };
$("#motionBtn").onclick=()=>{ if(sysReduce.matches){ toast("الحركة مخفّضة من إعدادات جهازج","calm"); return; } prefs.calm=!prefs.calm; Store.set("prefs",prefs); syncToggles(); toast(prefs.calm?"وقّفنا الحركة":"رجعت الحركة","calm"); go(current,false); };
fillIcons(); applyTheme(); prefs.sound=false; syncToggles(); renderStars(false);
if(!Store.ok) setTimeout(()=>toast("المتصفح ما يسمح بالحفظ — التقدّم يضيع عند الإغلاق","bulb"), 1200);
$("#mapBtn").onclick=toggleMiniMap;
$("#journalBtn").onclick=()=>openJournal();
$("#friendBtn").onclick=()=>go("lobby");
updateJournalDot();

const start = location.hash.slice(1);
const validR = r => { const [k,id]=r.split(":"); if(!ROUTES[k]) return false; if(k==="game") return !!GAMES[id]; if(k==="play") return !!KG[id]; if(k==="tale") return !!TALEBOOK.find(t=>t.id===id); if(k==="room") return !!ROOMS[id] && nodeOpen(id); return true; };
const roomQ = new URLSearchParams(location.search).get("room");
// نرجع للغرفة (إذا جانت مفتوحة بهذا التبويب) قبل رسم الصفحة، حتى اللعبة تعرف إنها لعبة مشتركة
let savedRoom=null; try{ savedRoom=JSON.parse(sessionStorage.getItem("khy_room")||"null"); }catch(e){}
const sameRoom = savedRoom && (!roomQ || savedRoom.code===roomQ.toUpperCase());
const resumed = sameRoom ? Party.resume() : Promise.resolve(false);
go(roomQ && !sameRoom ? "lobby" : (validR(start) ? start : (sameRoom ? "lobby" : "open")), false);
resumed.then(ok=>{ if(ok && current!=="lobby") toast("رجعنا لغرفة اللعب ويه صديقك","friends"); });
try{ history.replaceState({route:current},"",location.search+"#"+current); }catch(e){}
