/* ============ v3 core: assets, characters, dialogue ============ */
const CH = {
  k:{name:"خباب", img:BOY, color:"#9B3B2E", trait:"مبادر ومرح", faces:[[15,1240,160,250],[170,1240,160,250],[335,1240,165,250]]},
  y:{name:"يقين", img:GIRLY, color:"#2F5E57", trait:"فضولية وذكية", faces:[[515,1240,170,250],[685,1240,165,250],[850,1240,170,250]]}
};
// face: 0 = هادئ، 1 = فرحان، 2 = يفكّر — عرض جزء من لوحة الشخصيات الأصلية بدون تعديل الملف
function faceHTML(who, mood=0, size=64){
  const [x,y,w,hh] = CH[who].faces[mood]; const sc = size/w;
  return `<span class="cameo" style="width:${size}px;height:${Math.round(hh*sc*.78)}px"><span style="background-image:url(${SHEET});background-size:${1024*sc}px ${1536*sc}px;background-position:${-x*sc}px ${-(y+8)*sc}px"></span></span>`;
}
function charImg(who, cls="", alt){ return `<img class="kid ${cls}" src="${CH[who].img}" alt="${esc(alt||CH[who].name)}" draggable="false">`; }
function kidAct(el, act){ if(!el) return; const cls="act-"+act; el.classList.remove(cls); void el.offsetWidth; el.classList.add(cls); setTimeout(()=>el.classList.remove(cls), 1300); }
/* حوار بنفس أسلوب حكايات أيلاف: لوحة ورقية تحت المشهد، وجه المتكلم وسطر واحد بكل مرة.
   السطر: [who, mood, text] و who = k | y | أي شخصية من NPCS.
   سطر اختيار: {ask:"سؤال", who:"y", opts:[{t:"الجواب", pick:()=>{}, then:[سطور إضافية]}]} */
function speakerFace(w, m=0, size=64){
  if(CH[w]) return faceHTML(w, m, size);
  const n = NPCS[w]; return `<span class="cameo npc-cameo" style="width:${size}px;height:${size}px">${n ? n.face(m) : ""}</span>`;
}
const speakerName = w => CH[w] ? CH[w].name : (NPCS[w] ? NPCS[w].name() : "");
const speakerColor = w => CH[w] ? CH[w].color : (NPCS[w] ? NPCS[w].color : "#2E2118");
function dialogue(host, lines, done){
  lines = lines.slice(); let i=0, closed=false;
  const box=h(`<div class="dlg panel" role="dialog" aria-live="polite"><div class="dlg-face"></div><div class="dlg-body"><b class="dlg-name"></b><p class="dlg-text"></p><div class="dlg-opts" hidden></div></div><button class="btn small dlg-next">التالي</button></div>`);
  host.appendChild(box);
  const nextBtn=$(".dlg-next",box), opts=$(".dlg-opts",box);
  const show=()=>{
    const L=lines[i]; const isAsk = !Array.isArray(L);
    const w = isAsk ? (L.who||"y") : L[0], m = isAsk ? 2 : L[1], t = isAsk ? L.ask : L[2];
    $(".dlg-face",box).innerHTML=speakerFace(w,m,72);
    const nm=$(".dlg-name",box); nm.textContent=speakerName(w); nm.style.color=speakerColor(w);
    $(".dlg-text",box).textContent = typeof t==="function" ? t() : t;
    box.dataset.who = CH[w] ? w : "npc";
    opts.hidden = !isAsk; nextBtn.hidden = isAsk;
    if(isAsk){
      opts.innerHTML = L.opts.map((o,k)=>`<button class="btn ghost small dlg-opt" data-o="${k}"><span class="dlg-k">${k+1}</span>${esc(o.t)}</button>`).join("");
      $$(".dlg-opt",opts).forEach(b=>b.onclick=()=>choose(+b.dataset.o));
      setTimeout(()=>{ const f=$(".dlg-opt",opts); f && f.focus(); }, 20);
    } else { nextBtn.textContent = i===lines.length-1?"يلا":"التالي"; }
    const fig = host.querySelector(`.kidfig[data-kid="${w}"]`); if(fig) kidAct(fig, isAsk?"wait":"talk");
    Sound.soft();
  };
  const choose=k=>{ const o=lines[i].opts[k]; if(!o) return; Sound.chime(); if(o.pick) o.pick(); if(o.then) lines.splice(i+1,0,...o.then); next(); };
  const close=()=>{ if(closed) return; closed=true; box.remove(); document.removeEventListener("keydown",kd); };
  const next=()=>{ i++; if(i>=lines.length){ close(); done&&done(); } else show(); };
  const kd=e=>{ if(closed) return; const L=lines[i]; if(!Array.isArray(L)){ const n=+e.key; if(n>=1 && n<=L.opts.length){ e.preventDefault(); choose(n-1); } return; } if(e.key==="Enter" && (document.activeElement===document.body || document.activeElement===nextBtn)){ e.preventDefault(); next(); } };
  nextBtn.onclick=next; document.addEventListener("keydown",kd);
  show(); if(!nextBtn.hidden) nextBtn.focus();
  return {close};
}
function leafLayer(n=14, cls=""){
  if(!motionOK()) return `<div class="ambient ${cls}"></div>`;
  const cols=["#C8552B","#E08A2E","#B33A26","#D9A53A","#8E3B22"];
  let s=`<div class="ambient ${cls}" aria-hidden="true">`;
  for(let i=0;i<n;i++) s+=`<span class="leaf-f maple" style="left:${Math.random()*100}%;animation-duration:${9+Math.random()*9}s;animation-delay:${-Math.random()*18}s;width:${16+Math.random()*16}px">${ART.maple(cols[i%5])}</span>`;
  return s+"</div>";
}
ART.maple = (c="#C8552B") => `<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><path d="M20 2l3 8 6-3-2 8 8-1-5 6 6 3-9 2 1 6-8-4-8 4 1-6-9-2 6-3-5-6 8 1-2-8 6 3z" fill="${c}" stroke="rgba(80,30,10,.5)" stroke-width="1"/><path d="M20 12v26" stroke="rgba(80,30,10,.55)" stroke-width="1.4"/></svg>`;
ART.lantern = (on=true) => `<svg viewBox="0 0 40 60" xmlns="http://www.w3.org/2000/svg">${on?'<circle cx="20" cy="34" r="18" fill="rgba(255,200,90,.35)"/>':""}<path d="M14 6h12l-2 6h-8z" fill="#3A2A1C"/><path d="M20 0v6" stroke="#3A2A1C" stroke-width="2"/><path d="M10 14h20l-3 34H13z" fill="${on?"#FFD27A":"#7A6A55"}" stroke="#3A2A1C" stroke-width="2.4"/><path d="M20 14v34M11 26h18M12 38h16" stroke="#3A2A1C" stroke-width="1.5" opacity=".6"/><path d="M12 48h16v5H12z" fill="#3A2A1C"/></svg>`;
ART.gear = (c="#B88F33") => `<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><g fill="${c}" stroke="#5A3F26" stroke-width="2">${[0,45,90,135,180,225,270,315].map(a=>`<rect x="26" y="2" width="8" height="12" rx="2" transform="rotate(${a} 30 30)"/>`).join("")}<circle cx="30" cy="30" r="18"/></g><circle cx="30" cy="30" r="6" fill="#3A2A1C"/></svg>`;
ART.ticket = () => `<svg viewBox="0 0 60 36" xmlns="http://www.w3.org/2000/svg"><path d="M4 4h52v10a4 4 0 000 8v10H4V22a4 4 0 000-8z" fill="#F2D9A6" stroke="#8C5A2B" stroke-width="2"/><path d="M40 6v24" stroke="#8C5A2B" stroke-dasharray="3 3"/><path d="M10 12h24M10 18h18M10 24h22" stroke="#B5482A" stroke-width="2"/></svg>`;
ART.paperBird = (c="#F2E6CF") => `<svg viewBox="0 0 60 40" xmlns="http://www.w3.org/2000/svg"><path d="M4 22L30 10l26 4-20 6 8 16-14-12z" fill="${c}" stroke="#6E5236" stroke-width="2" stroke-linejoin="round"/><path d="M30 10l6 10" stroke="#6E5236" stroke-width="1.4"/><circle cx="44" cy="14" r="1.6" fill="#3A2A1C"/></svg>`;
ART.crate = () => `<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><rect x="2" y="2" width="36" height="36" rx="3" fill="#B98552" stroke="#5A3F26" stroke-width="3"/><path d="M4 4l32 32M36 4L4 36" stroke="#7A5232" stroke-width="3"/><rect x="2" y="2" width="36" height="36" rx="3" fill="none" stroke="#5A3F26" stroke-width="3"/></svg>`;
ART.key = (c="#D9A53A") => `<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="20" r="8" fill="none" stroke="${c}" stroke-width="4"/><path d="M20 20h16M30 20v6M35 20v5" stroke="${c}" stroke-width="4" stroke-linecap="round"/></svg>`;
ART.book = (c="#7A2E2A") => `<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><path d="M8 10h20c2 0 2 2 2 4v38c0-2-2-4-4-4H8z" fill="${c}" stroke="#3A1E14" stroke-width="2"/><path d="M52 10H32c-2 0-2 2-2 4v38c0-2 2-4 4-4h18z" fill="${c}" stroke="#3A1E14" stroke-width="2"/><path d="M12 16h12M12 22h10M36 16h12M36 22h10" stroke="#E8C066" stroke-width="2"/></svg>`;
