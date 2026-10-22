/* ============ تشغيل صفحة عالم أيلاف ============ */
function syncToggles(){ $("#soundBtn").setAttribute("aria-pressed", prefs.sound); $("#motionBtn").setAttribute("aria-pressed", prefs.calm || sysReduce.matches); document.documentElement.classList.toggle("calm", prefs.calm); }
$("#soundBtn").onclick=()=>{ Sound.set(!prefs.sound); syncToggles(); toast(prefs.sound?"أصوات الغابة شغّالة":"الأصوات مكتومة","sound"); };
$("#motionBtn").onclick=()=>{ if(sysReduce.matches){ toast("الحركة مخفّضة من إعدادات جهازج","calm"); return; } prefs.calm=!prefs.calm; Store.set("prefs",prefs); syncToggles(); toast(prefs.calm?"وقّفنا الحركة":"رجعت الحركة","calm"); go(current,false); };
fillIcons(); applyTheme(); prefs.sound=false; syncToggles(); renderStars(false);
document.title = settings.siteTitle;
if(!Store.ok) setTimeout(()=>toast("المتصفح ما يسمح بالحفظ — التقدّم يضيع عند الإغلاق","bulb"), 1200);
const start = location.hash.slice(1);
const validR = r => { const [k,id]=r.split(":"); if(!ROUTES[k]) return false; if(k==="game") return !!GAMES[id]; return true; };
go(validR(start) ? start : "open", false);
try{ history.replaceState({route:current},"",location.search+"#"+current); }catch(e){}
