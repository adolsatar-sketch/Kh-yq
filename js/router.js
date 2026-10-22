/* ============ router ============
   كل مسار إله أب واضح حتى زر «رجوع» ما يضيّع اللاعب، والساحة/الخريطة دايماً نقطة الرجوع. */
let cleanup = null, current = "open";
const ROUTES = {
  meet:{view:(r)=>viewMeet(r), title:()=>"خباب ويقين", parent:"world"},
  map:{view:(r)=>viewMap(r), title:()=>"غابة "+heroName(), parent:"world"},
  forestintro:{view:(r)=>{ Store.set("forestIntro", true); return viewIntro(r); }, title:()=>"غابة "+heroName(), bare:true},
  paint:{view:(r,id)=>viewPaint(r,id), title:()=>"المرسم", parent:"book"},
  diary:{view:(r)=>viewDiary(r), title:()=>"دفتر المذكرات", parent:"book"},
  cave:{view:(r)=>viewCave(r), title:()=>"الكهف المضيء", parent:"map"},
  jokes:{view:(r)=>viewJokes(r), title:()=>"صندوق النكت العبيطة", parent:"map"},
  game:{view:(r,id)=>viewGame(r,id), title:id=>GAMES[id]?GAMES[id].title:"", parent:"map"}
};
// أسماء المسارات القديمة تتحول للجديدة حتى الروابط المحفوظة تبقى تشتغل
const ROUTE_ALIAS = {hub:"world", explore:"world", intro:"open", forestgate:"world", arcade:"world"};
function go(route, push=true){
  if(cleanup){ try{cleanup();}catch(e){} cleanup=null; }
  let [kind,id] = String(route||"open").split(":");
  if(ROUTE_ALIAS[kind]){ kind=ROUTE_ALIAS[kind]; id=undefined; route=kind; }
  if(!ROUTES[kind]){ kind="world"; id=undefined; route="world"; }
  const R = ROUTES[kind];
  current = route;
  if(push){ try{ history.pushState({route},"", location.search+"#"+route); }catch(e){} }
  $$(".scrim,.mini-map,.dlg").forEach(x=>x.remove());
  const view = $("#view"); view.innerHTML="";
  $("#topbar").hidden = !!R.bare;
  document.body.dataset.world = R.world || kind;
  $("#viewTitle").textContent = R.title ? R.title(id) : "مغامرات خباب ويقين";
  // مكان خباب ويقين على الخريطة يتبع المكان اللي دخلوه
  if(typeof WS!=="undefined"){ const n = kind==="room" ? id : kind==="play" ? (GAME_AT[id]) : ROUTE_NODE[kind]; if(n && NODES[n] && nodeOpen(n) && WS.at!==n){ WS.at=n; if(!WS.visited.includes(n)) WS.visited.push(n); saveWorld(); } }
  cleanup = R.view(view, id) || null;
  Party.onRoute && Party.onRoute(route);
}
window.addEventListener("popstate", e => { const r = (e.state && e.state.route) || (location.hash.slice(1)||"open"); go(r, false); });
$("#backBtn").onclick = () => { const [kind] = current.split(":"); const R=ROUTES[kind]; go((R && R.parent) || "world"); };
