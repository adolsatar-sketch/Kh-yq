/* ============ router ============
   موجّه عام تستعمله الصفحتين (لعبة خباب ويقين وعالم أيلاف)؛ كل صفحة تسجّل مساراتها بنفسها.
   كل مسار إله أب واضح حتى زر «رجوع» ما يضيّع اللاعب. */
let cleanup = null, current = "open";
const ROUTES = {};
const ROUTE_ALIAS = {};
const routeHooks = [];   // تنادى عند كل انتقال (مثلاً لتحديث مكان اللاعب)
function go(route, push=true){
  if(cleanup){ try{cleanup();}catch(e){} cleanup=null; }
  let [kind,id] = String(route||"open").split(":");
  if(ROUTE_ALIAS[kind]){ kind=ROUTE_ALIAS[kind]; id=undefined; route=kind; }
  if(!ROUTES[kind]){ kind=ROUTES.world?"world":"open"; id=undefined; route=kind; }
  const R = ROUTES[kind];
  current = route;
  if(push){ try{ history.pushState({route},"", location.search+"#"+route); }catch(e){} }
  $$(".scrim,.mini-map,.dlg").forEach(x=>x.remove());
  const view = $("#view"); view.innerHTML="";
  $("#topbar").hidden = !!R.bare;
  $("#backBtn").style.visibility = R.noBack ? "hidden" : "";
  document.body.dataset.world = R.world || kind;
  $("#viewTitle").textContent = R.title ? R.title(id) : "";
  routeHooks.forEach(fn=>{ try{ fn(kind, id); }catch(e){ console.error(e); } });
  cleanup = R.view(view, id) || null;
}
window.addEventListener("popstate", e => { const r = (e.state && e.state.route) || (location.hash.slice(1)||"open"); go(r, false); });
$("#backBtn").onclick = () => { const [kind] = current.split(":"); const R=ROUTES[kind]; go((R && R.parent) || (ROUTES.world?"world":"open")); };
