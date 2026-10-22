/* ============ Fashion palace: dolls, wardrobe, wings, runway ============ */
const PALETTE = ["#2F5E57","#7A2E2A","#B5482A","#D9A53A","#E9A79E","#F3E6C8","#3E4A7A","#8EC3CF","#B9A6DD","#5B7F4A","#2B2B33","#FFFFFF","#C76B8E","#6B4A2E"];
const WINGS = {
  feather:{name:"ريش", c:"#F3E6C8", svg:c=>wingSet(`<path d="M150 220C110 150 40 110 8 140C30 160 20 190 40 200C20 220 30 250 56 250C40 280 70 300 96 286C90 320 130 320 146 270Z" fill="${c}" stroke="#8C6C48" stroke-width="2.5"/><path d="M146 240C110 200 60 170 20 150M140 255C100 235 60 230 44 228M134 268C110 262 84 268 70 280" stroke="#8C6C48" stroke-width="1.6" fill="none"/>`)},
  butterfly:{name:"فراشة", c:"#B9A6DD", svg:c=>wingSet(`<path d="M150 230C120 130 30 90 12 140C0 180 60 220 140 240Z" fill="${c}" stroke="#4A3E5E" stroke-width="2.5"/><path d="M146 245C90 250 30 300 60 340C90 370 130 300 148 260Z" fill="#E8C066" stroke="#4A3E5E" stroke-width="2.5"/><circle cx="70" cy="150" r="14" fill="#FFF" opacity=".55"/><circle cx="84" cy="310" r="10" fill="#FFF" opacity=".5"/>`)},
  maple:{name:"أوراق خريف", c:"#C8552B", svg:c=>wingSet(`<g transform="translate(40 120) scale(2.4) rotate(-20 20 20)">${ART.maple(c).replace(/<\/?svg[^>]*>/g,"")}</g><g transform="translate(30 230) scale(2) rotate(-50 20 20)">${ART.maple("#D9A53A").replace(/<\/?svg[^>]*>/g,"")}</g><g transform="translate(80 170) scale(1.6) rotate(10 20 20)">${ART.maple("#8E3B22").replace(/<\/?svg[^>]*>/g,"")}</g>`)},
  glass:{name:"زجاج ملوّن", c:"#3E4A7A", svg:c=>wingSet(`<path d="M150 230L120 120L40 100L10 170L50 250L110 270Z" fill="${c}" stroke="#2B2215" stroke-width="4"/><path d="M120 120L80 190L10 170M80 190L110 270M80 190L40 100M80 190L50 250" stroke="#2B2215" stroke-width="3"/><path d="M120 120L80 190L40 100Z" fill="#D9A53A" opacity=".75"/><path d="M80 190L50 250L110 270Z" fill="#B5482A" opacity=".75"/><path d="M10 170L80 190L50 250Z" fill="#2F5E57" opacity=".7"/>`)},
  gears:{name:"ميكانيكية فكتورية", c:"#B88F33", svg:c=>wingSet(`<path d="M150 230C120 170 70 140 20 150L36 180L16 210L50 226L36 262L84 262L96 292L140 260Z" fill="#6B4A2E" stroke="#2B2215" stroke-width="3"/><g transform="translate(40 150) scale(.9)">${ART.gear(c).replace(/<\/?svg[^>]*>/g,"")}</g><g transform="translate(82 196) scale(.7)">${ART.gear("#D9A53A").replace(/<\/?svg[^>]*>/g,"")}</g><path d="M60 180L140 236M50 230L140 250" stroke="${c}" stroke-width="3"/>`)},
  petals:{name:"بتلات", c:"#E9A79E", svg:c=>wingSet(`<ellipse cx="80" cy="170" rx="70" ry="34" transform="rotate(-30 80 170)" fill="${c}" stroke="#9A5C52" stroke-width="2.5"/><ellipse cx="70" cy="240" rx="64" ry="28" transform="rotate(-5 70 240)" fill="#F3C1BA" stroke="#9A5C52" stroke-width="2.5"/><ellipse cx="90" cy="300" rx="50" ry="22" transform="rotate(25 90 300)" fill="${c}" stroke="#9A5C52" stroke-width="2.5"/>`)},
  crystal:{name:"شفافة مضيئة", c:"#8EC3CF", svg:c=>wingSet(`<path d="M150 230C110 120 20 80 6 150C0 210 70 250 146 248Z" fill="${c}" fill-opacity=".38" stroke="#FFFFFF" stroke-width="3"/><path d="M146 252C80 260 20 320 50 360C80 390 130 320 148 262Z" fill="${c}" fill-opacity=".3" stroke="#FFFFFF" stroke-width="3"/><path d="M146 240C100 180 50 140 24 140M146 250C100 280 70 320 56 350" stroke="#FFFFFF" stroke-width="1.5" opacity=".9"/>`, true)}
};
function wingSet(left, glow){ return `<svg class="wings ${glow?"glow":""}" viewBox="0 0 300 520" xmlns="http://www.w3.org/2000/svg"><g class="w-l">${left}</g><g class="w-r" transform="translate(300 0) scale(-1 1)">${left}</g></svg>`; }
const ACCS = {
  crown:{name:"تاج أوراق", svg:()=>`<svg viewBox="0 0 120 50" xmlns="http://www.w3.org/2000/svg">${[10,30,50,70,90].map((x,i)=>`<g transform="translate(${x} ${i%2?8:0}) scale(.6)">${ART.maple(["#C8552B","#D9A53A","#B33A26"][i%3]).replace(/<\/?svg[^>]*>/g,"")}</g>`).join("")}</svg>`},
  flowers:{name:"إكليل ورد", svg:()=>`<svg viewBox="0 0 120 40" xmlns="http://www.w3.org/2000/svg">${[12,34,56,78,100].map((x,i)=>`<g transform="translate(${x-10} ${i%2?10:4}) scale(.36)">${ART.flower(["#F3C1BA","#FBF6E8","#E8C066"][i%3]).replace(/<\/?svg[^>]*>/g,"")}</g>`).join("")}</svg>`},
  tophat:{name:"قبعة عالية", svg:()=>`<svg viewBox="0 0 120 70" xmlns="http://www.w3.org/2000/svg"><rect x="34" y="6" width="52" height="50" rx="4" fill="#2B2B33"/><rect x="34" y="40" width="52" height="8" fill="#7A2E2A"/><ellipse cx="60" cy="58" rx="54" ry="10" fill="#2B2B33"/></svg>`},
  beret:{name:"بيريه", svg:()=>`<svg viewBox="0 0 120 50" xmlns="http://www.w3.org/2000/svg"><ellipse cx="60" cy="30" rx="54" ry="18" fill="#7A2E2A"/><circle cx="60" cy="12" r="4" fill="#7A2E2A"/></svg>`},
  conductor:{name:"قبعة سائق القطار", svg:()=>`<svg viewBox="0 0 120 60" xmlns="http://www.w3.org/2000/svg"><path d="M22 40C24 12 96 12 98 40Z" fill="#2E3E5C" stroke="#1E2A40" stroke-width="3"/><rect x="20" y="36" width="80" height="9" rx="4" fill="#D9A53A" stroke="#8C6A2A" stroke-width="2"/><path d="M20 44q-10 8 0 12h40l-6-12z" fill="#1E2A40"/><circle cx="60" cy="26" r="6" fill="#D9A53A"/></svg>`},
  mushroom:{name:"قبعة فطر وردية", svg:()=>ART.sumoHat()},
  feather:{name:"ريشة البومة", slot:"hair", svg:()=>ART.feather()},
  lantern:{name:"فانوس صغير", slot:"hand", svg:()=>ART.lantern(true)},
  glasses:{name:"نظارات", svg:()=>`<svg viewBox="0 0 120 40" xmlns="http://www.w3.org/2000/svg"><circle cx="38" cy="20" r="14" fill="rgba(200,230,240,.3)" stroke="#6B4A2E" stroke-width="4"/><circle cx="82" cy="20" r="14" fill="rgba(200,230,240,.3)" stroke="#6B4A2E" stroke-width="4"/><path d="M52 20h16" stroke="#6B4A2E" stroke-width="4"/></svg>`}
};
const CATS = [
  {k:"dress", name:"فساتين", who:"y"}, {k:"top", name:"بلايز"}, {k:"bottom", name:"بناطيل وتنانير"}, {k:"jacket", name:"جاكيتات"}, {k:"shoes", name:"أحذية"}, {k:"wings", name:"أجنحة"}, {k:"acc", name:"إكسسوارات"}
];
const ITEMS = {
  dress:[{id:"aline",n:"قصة A",at:0},{id:"puff",n:"منفوش",at:0},{id:"wrap",n:"لفّة ميدي",at:3},{id:"slip",n:"ساتان حديث",at:6},{id:"tiered",n:"طبقات بوهو",at:10},{id:"gown",n:"فستان سهرة",at:18}],
  top:[{id:"tee",n:"تيشيرت",at:0},{id:"blouse",n:"بلوزة كشكش",at:0},{id:"sweater",n:"بلوفر",at:2},{id:"vest",n:"صدرية",at:5}],
  bottom:[{id:"jeans",n:"جينز",at:0},{id:"wide",n:"بنطلون واسع",at:0},{id:"shorts",n:"شورت",at:2},{id:"skirt",n:"تنورة A",at:0},{id:"pleat",n:"تنورة بليسيه",at:4}],
  jacket:[{id:"none",n:"بدون",at:0},{id:"blazer",n:"بليزر",at:0},{id:"denim",n:"جاكيت جينز",at:3},{id:"coat",n:"معطف فكتوري",at:7},{id:"cape",n:"كاب",at:12},{id:"cardigan",n:"كارديغان",at:5}],
  shoes:[{id:"boots",n:"بوت",at:0},{id:"sneakers",n:"سنيكرز",at:0},{id:"mary",n:"ماري جين",at:2},{id:"sandals",n:"صندل",at:8}],
  wings:[{id:"none",n:"بدون",at:0}].concat(Object.entries(WINGS).map(([k,w],i)=>({id:k,n:w.name,at:[0,0,4,8,12,15,22][i]||0, q:"wings_"+k}))),
  acc:[{id:"none",n:"بدون",at:0}].concat(Object.entries(ACCS).map(([k,a])=>({id:k,n:a.name,at:{crown:0,flowers:0,tophat:6,beret:3,glasses:9}[k]??999, q:"acc_"+k})))
};
/* القطعة تنفتح بنجوم الألعاب، أو كمكافأة مهمة بالعالم (بدون دفع أو حظ) */
const itemOpen = it => progress.stars>=it.at || !!(it.q && typeof hasReward==="function" && hasReward(it.q));
const itemHow = it => it.at<999 ? `${it.at} نجمة${it.q&&REWARDS[it.q]?" أو مهمة":""}` : "مكافأة مهمة";
const unlockedOf = cat => ITEMS[cat].filter(itemOpen);
const DEFAULT_LOOK = {
  k:{mode:"set", top:{id:"vest",c:"#7A2E2A"}, bottom:{id:"wide",c:"#6B4A2E"}, jacket:{id:"coat",c:"#3A2A22"}, shoes:{id:"boots",c:"#6B4A2E"}, dress:{id:"aline",c:"#2F5E57"}, wings:{id:"none",c:"#C8552B"}, acc:{id:"none"}, len:2, fit:1},
  y:{mode:"dress", top:{id:"blouse",c:"#F3E6C8"}, bottom:{id:"skirt",c:"#2F5E57"}, jacket:{id:"none",c:"#2F5E57"}, shoes:{id:"boots",c:"#6B4A2E"}, dress:{id:"puff",c:"#2F5E57"}, wings:{id:"none",c:"#B9A6DD"}, acc:{id:"none"}, len:1, fit:1}
};
function dollSVG(who, L, opts={}){
  const skin="#F3D2BE", skinS="#E2B79F", fit=[.94,1,1.07][L.fit??1], lenY=[372,412,458][L.len??1];
  const fx = d => `<g transform="translate(150 0) scale(${fit} 1) translate(-150 0)">${d}</g>`;
  const col = (o,dflt)=> (o&&o.c)||dflt;
  const shade = c => { const m=/^#?([0-9a-f]{6})$/i.exec(c||""); if(!m) return "#3A2A1C"; const n=parseInt(m[1],16); const f=x=>Math.round(x*.72).toString(16).padStart(2,"0"); return "#"+f(n>>16&255)+f(n>>8&255)+f(n&255); };
  const isDress = L.mode==="dress" && L.dress && L.dress.id;
  let back="", body="", cloth="", top="", hair="", front="";
  // wings
  const W = L.wings && L.wings.id!=="none" && WINGS[L.wings.id] ? `<g class="doll-wings">${WINGS[L.wings.id].svg(L.wings.c||WINGS[L.wings.id].c).replace(/^<svg[^>]*>|<\/svg>$/g,"")}</g>` : "";
  // back hair
  if(who==="y") back=`<path d="M86 110C70 190 60 260 92 318C112 300 118 250 120 200L180 200C182 250 188 300 208 318C240 260 230 190 214 110Z" fill="#7A4A2A"/><path d="M214 96C250 110 262 170 244 240C236 270 222 280 214 270C230 220 228 160 206 120Z" fill="#7A4A2A"/>`;
  // body (skin)
  body = `<rect x="139" y="170" width="22" height="30" fill="${skin}"/>
    <path d="M104 206L90 318" stroke="${skin}" stroke-width="20" stroke-linecap="round"/><path d="M196 206L210 318" stroke="${skin}" stroke-width="20" stroke-linecap="round"/>
    <circle cx="90" cy="322" r="11" fill="${skin}"/><circle cx="210" cy="322" r="11" fill="${skin}"/>
    <rect x="127" y="290" width="20" height="170" rx="9" fill="${who==="y"?"#4A3A30":skin}"/><rect x="153" y="290" width="20" height="170" rx="9" fill="${who==="y"?"#4A3A30":skin}"/>
    <path d="M104 200Q150 186 196 200L190 296L110 296Z" fill="${skin}"/>`;
  // shoes
  const sc=col(L.shoes,"#6B4A2E"), sid=L.shoes?L.shoes.id:"boots";
  const shoe = sid==="boots" ? `<path d="M124 420h26v44h-34c-4 0-6-4-4-8l12-6z" fill="${sc}" stroke="#2B2215" stroke-width="2"/><path d="M150 420h26v40l12 6c2 4 0 8-4 8h-34z" fill="${sc}" stroke="#2B2215" stroke-width="2"/><path d="M128 430h18M128 440h18M154 430h18M154 440h18" stroke="#2B2215" stroke-width="1.5" opacity=".6"/>`
    : sid==="sneakers" ? `<path d="M120 452h30v14h-34c-4 0-4-6 0-8z" fill="${sc}" stroke="#2B2215" stroke-width="2"/><path d="M150 452h30l4 6c4 2 4 8 0 8h-34z" fill="${sc}" stroke="#2B2215" stroke-width="2"/><path d="M116 466h34M150 466h34" stroke="#fff" stroke-width="3"/>`
    : sid==="mary" ? `<path d="M120 454h30v12h-32c-4 0-4-8 2-12z" fill="${sc}" stroke="#2B2215" stroke-width="2"/><path d="M150 454h30c6 4 6 12 2 12h-32z" fill="${sc}" stroke="#2B2215" stroke-width="2"/><path d="M126 454v-6h20v6M154 454v-6h20v6" stroke="${sc}" stroke-width="3" fill="none"/>`
    : `<path d="M120 462h30v6h-32z" fill="${sc}"/><path d="M150 462h32v6h-32z" fill="${sc}"/><path d="M126 462l10-14M142 462l-6-14M156 462l10-14M172 462l-6-14" stroke="${sc}" stroke-width="3"/>`;
  // bottom / dress
  if(isDress){
    const c=col(L.dress,"#2F5E57"), id=L.dress.id, hem=lenY;
    const flare = {aline:40,puff:62,wrap:26,slip:14,tiered:46,gown:84}[id]||40;
    const bodice=`<path d="M104 200Q150 186 196 200L188 292L112 292Z" fill="${c}" stroke="${shade(c)}" stroke-width="2"/>`;
    const sleeves = id==="slip" ? `<path d="M120 196V184M180 196V184" stroke="${c}" stroke-width="3"/>` : id==="puff"||id==="gown" ? `<ellipse cx="102" cy="214" rx="20" ry="16" fill="${c}" stroke="${shade(c)}" stroke-width="2"/><ellipse cx="198" cy="214" rx="20" ry="16" fill="${c}" stroke="${shade(c)}" stroke-width="2"/>` : `<path d="M104 204L94 250" stroke="${c}" stroke-width="24" stroke-linecap="round"/><path d="M196 204L206 250" stroke="${c}" stroke-width="24" stroke-linecap="round"/>`;
    let skirt = `<path d="M112 288L188 288L${188+flare} ${hem}Q150 ${hem+14} ${112-flare} ${hem}Z" fill="${c}" stroke="${shade(c)}" stroke-width="2"/>`;
    if(id==="puff") skirt = `<path d="M${112-flare+8} ${hem-6}Q150 ${hem+22} ${188+flare-8} ${hem-6}L${188+flare-12} ${hem+6}Q150 ${hem+30} ${112-flare+12} ${hem+6}Z" fill="#F3E6C8" stroke="#C9B98E" stroke-width="2"/>`+skirt;
    if(id==="tiered") skirt = [0,1,2].map(i=>{ const y0=288+i*(hem-288)/3, y1=288+(i+1)*(hem-288)/3, f0=flare*i/3, f1=flare*(i+1)/3; return `<path d="M${112-f0} ${y0}L${188+f0} ${y0}L${188+f1} ${y1}Q150 ${y1+8} ${112-f1} ${y1}Z" fill="${c}" stroke="${shade(c)}" stroke-width="2"/>`; }).join("");
    if(id==="wrap") skirt += `<path d="M188 292L130 ${hem}" stroke="${shade(c)}" stroke-width="3"/>`;
    if(id==="gown") skirt += `<path d="M${112-flare/2} ${hem-40}Q150 ${hem-10} ${188+flare/2} ${hem-40}" stroke="#E8C066" stroke-width="3" fill="none"/>`;
    const belt = `<path d="M110 286h80" stroke="${id==="slip"?shade(c):"#6B4A2E"}" stroke-width="${id==="slip"?3:8}"/>`;
    cloth = fx(skirt + bodice + belt + sleeves + (id==="aline"||id==="puff"? `<path d="M128 194Q150 214 172 194" fill="#F3E6C8" stroke="#C9B98E" stroke-width="2"/>`:""));
  } else {
    const bc=col(L.bottom,"#6B4A2E"), bid=L.bottom.id;
    let bottom="";
    if(bid==="jeans") bottom=`<path d="M110 288L190 288L186 452L156 452L150 330L144 452L114 452Z" fill="${bc}" stroke="${shade(bc)}" stroke-width="2"/><path d="M128 300L126 450M172 300L174 450" stroke="#D9A53A" stroke-width="1.5" stroke-dasharray="4 4"/>`;
    else if(bid==="wide") bottom=`<path d="M108 288L192 288L204 452L156 452L150 330L144 452L96 452Z" fill="${bc}" stroke="${shade(bc)}" stroke-width="2"/>`;
    else if(bid==="shorts") bottom=`<path d="M108 288L192 288L196 352L156 352L150 320L144 352L104 352Z" fill="${bc}" stroke="${shade(bc)}" stroke-width="2"/>`;
    else if(bid==="pleat") bottom=`<path d="M110 288L190 288L${226} ${lenY}L${74} ${lenY}Z" fill="${bc}" stroke="${shade(bc)}" stroke-width="2"/>`+[0,1,2,3,4,5].map(i=>`<path d="M${120+i*12} 292L${86+i*26} ${lenY}" stroke="${shade(bc)}" stroke-width="1.5"/>`).join("");
    else bottom=`<path d="M110 288L190 288L${228} ${lenY}Q150 ${lenY+12} ${72} ${lenY}Z" fill="${bc}" stroke="${shade(bc)}" stroke-width="2"/>`;
    const tc=col(L.top,"#F3E6C8"), tid=L.top.id;
    let t=`<path d="M104 200Q150 186 196 200L190 296L110 296Z" fill="${tc}" stroke="${shade(tc)}" stroke-width="2"/>`;
    if(tid==="tee") t+=`<path d="M104 204L96 240" stroke="${tc}" stroke-width="26" stroke-linecap="round"/><path d="M196 204L204 240" stroke="${tc}" stroke-width="26" stroke-linecap="round"/>`;
    if(tid==="sweater") t+=`<path d="M104 204L92 312" stroke="${tc}" stroke-width="25" stroke-linecap="round"/><path d="M196 204L208 312" stroke="${tc}" stroke-width="25" stroke-linecap="round"/><path d="M112 286h76" stroke="${shade(tc)}" stroke-width="6"/>`;
    if(tid==="blouse") t+=`<ellipse cx="102" cy="212" rx="18" ry="15" fill="${tc}" stroke="${shade(tc)}" stroke-width="2"/><ellipse cx="198" cy="212" rx="18" ry="15" fill="${tc}" stroke="${shade(tc)}" stroke-width="2"/><path d="M126 194Q150 222 174 194" fill="#FFF" stroke="${shade(tc)}" stroke-width="2"/>`;
    if(tid==="vest") t=`<path d="M104 204L94 300" stroke="#F3E6C8" stroke-width="24" stroke-linecap="round"/><path d="M196 204L206 300" stroke="#F3E6C8" stroke-width="24" stroke-linecap="round"/><path d="M104 200Q150 186 196 200L190 296L110 296Z" fill="#F3E6C8"/><path d="M110 202L150 250L190 202L188 300L112 300Z" fill="${tc}" stroke="${shade(tc)}" stroke-width="2"/>${[260,276,292].map(y=>`<circle cx="150" cy="${y-6}" r="3" fill="#D9A53A"/>`).join("")}`;
    cloth = fx(bottom + t + `<path d="M110 290h80" stroke="#6B4A2E" stroke-width="7"/><rect x="144" y="285" width="12" height="10" fill="none" stroke="#D9A53A" stroke-width="2"/>`);
  }
  // jacket
  const J=L.jacket; if(J && J.id && J.id!=="none"){ const jc=col(J,"#3A2A22"), sh=shade(jc);
    const jl = J.id==="coat"?370:J.id==="cardigan"?330:312;
    let j = `<path d="M98 200Q150 184 202 200L${J.id==="coat"?214:196} ${jl}L156 ${jl}L150 230L144 ${jl}L${J.id==="coat"?86:104} ${jl}Z" fill="${jc}" stroke="${sh}" stroke-width="2"/><path d="M102 204L88 318" stroke="${jc}" stroke-width="26" stroke-linecap="round"/><path d="M198 204L212 318" stroke="${jc}" stroke-width="26" stroke-linecap="round"/>`;
    if(J.id==="blazer"||J.id==="coat") j+=`<path d="M126 196L144 240L136 200M174 196L156 240L164 200" fill="${sh}" stroke="${sh}" stroke-width="2"/>`;
    if(J.id==="coat") j+=`<path d="M98 200L86 370M202 200L214 370" stroke="#B5482A" stroke-width="3"/>${[250,280,310].map(y=>`<circle cx="140" cy="${y}" r="3.5" fill="#D9A53A"/><circle cx="160" cy="${y}" r="3.5" fill="#D9A53A"/>`).join("")}`;
    if(J.id==="denim") j+=`<path d="M110 240h30M160 240h30" stroke="#D9A53A" stroke-width="1.5" stroke-dasharray="3 3"/>`;
    if(J.id==="cape") j=`<path d="M100 200Q150 180 200 200L240 380Q150 400 60 380Z" fill="${jc}" stroke="${sh}" stroke-width="2" opacity=".96"/><path d="M130 196Q150 210 170 196" stroke="#D9A53A" stroke-width="4" fill="none"/>`;
    top += fx(j);
  }
  // head
  const head = `<circle cx="150" cy="118" r="62" fill="${skin}"/><ellipse cx="88" cy="126" rx="10" ry="14" fill="${skinS}"/><ellipse cx="212" cy="126" rx="10" ry="14" fill="${skinS}"/>
    <ellipse cx="128" cy="130" rx="9" ry="11" fill="#3A2418"/><ellipse cx="172" cy="130" rx="9" ry="11" fill="#3A2418"/><circle cx="125" cy="126" r="3.4" fill="#fff"/><circle cx="169" cy="126" r="3.4" fill="#fff"/>
    <path d="M116 112q12-6 22 0M162 112q12-6 22 0" stroke="#5A3420" stroke-width="3" fill="none" stroke-linecap="round"/>
    <path d="M148 140q3 4 6 0" stroke="${skinS}" stroke-width="2.4" fill="none"/>
    <path d="M136 156q14 10 28 0" stroke="#A04A3A" stroke-width="3.4" fill="none" stroke-linecap="round"/>
    <ellipse cx="112" cy="148" rx="11" ry="6" fill="#EBA49A" opacity=".55"/><ellipse cx="188" cy="148" rx="11" ry="6" fill="#EBA49A" opacity=".55"/>`;
  hair = who==="k" ? `<path d="M88 112C84 60 120 44 152 46C192 46 218 70 212 112C204 92 192 84 176 86C170 76 156 74 146 82C132 74 112 84 104 98C98 96 92 102 88 112Z" fill="#2E1F17"/><path d="M118 70l-6-12M150 52l2-12M184 64l8-10" stroke="#2E1F17" stroke-width="6" stroke-linecap="round"/>`
    : `<path d="M86 118C80 64 118 46 152 46C190 46 220 66 214 118C206 94 186 86 168 92C162 82 140 80 130 92C116 86 98 96 86 118Z" fill="#7A4A2A"/><path d="M92 100C88 140 84 170 90 200M208 100C214 140 216 170 210 200" stroke="#7A4A2A" stroke-width="12" stroke-linecap="round"/><g transform="translate(196 52) scale(.7) rotate(20)">${ART.maple("#D9A53A").replace(/<\/?svg[^>]*>/g,"")}</g>`;
  // accessories
  const A=L.acc&&L.acc.id; let acc="";
  if(A==="crown") acc=`<g transform="translate(96 40) scale(.9)">${ACCS.crown.svg().replace(/<\/?svg[^>]*>/g,"")}</g>`;
  if(A==="flowers") acc=`<g transform="translate(92 54) scale(.98)">${ACCS.flowers.svg().replace(/<\/?svg[^>]*>/g,"")}</g>`;
  if(A==="tophat") acc=`<g transform="translate(92 6) scale(.98)">${ACCS.tophat.svg().replace(/<\/?svg[^>]*>/g,"")}</g>`;
  if(A==="beret") acc=`<g transform="translate(94 40) scale(.94)">${ACCS.beret.svg().replace(/<\/?svg[^>]*>/g,"")}</g>`;
  if(A==="conductor") acc=`<g transform="translate(90 18) scale(1)">${ACCS.conductor.svg().replace(/<\/?svg[^>]*>/g,"")}</g>`;
  if(A==="mushroom") acc=`<g transform="translate(96 8) scale(1.8)">${ART.sumoHat().replace(/<\/?svg[^>]*>/g,"")}</g>`;
  if(A==="feather") acc=`<g transform="translate(196 34) rotate(24) scale(1.2)">${ART.feather().replace(/<\/?svg[^>]*>/g,"")}</g>`;
  if(A==="lantern") acc=`<g transform="translate(200 300) scale(1.1)">${ART.lantern(true).replace(/<\/?svg[^>]*>/g,"")}</g>`;
  if(A==="glasses") acc=`<g transform="translate(90 110)">${ACCS.glasses.svg().replace(/<\/?svg[^>]*>/g,"")}</g>`;
  if(who==="y" && A!=="mushroom" && A!=="conductor") acc=`<g transform="translate(194 52) rotate(18) scale(.9)">${ART.maple("#D98A2E").replace(/<\/?svg[^>]*>/g,"")}</g>`+acc;
  const scarf = who==="k" && !isDress ? `<path d="M126 190Q150 204 174 190L170 206Q150 214 130 206Z" fill="#B5482A"/><path d="M160 204L166 250L156 248Z" fill="#B5482A"/>` : "";
  return `<svg class="doll" viewBox="0 0 300 520" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${CH[who].name}">${W}${back}${body}${shoe}${cloth}${top}${scarf}${head}${hair}${acc}</svg>`;
}
function lookStore(){ return Object.assign({k:JSON.parse(JSON.stringify(DEFAULT_LOOK.k)), y:JSON.parse(JSON.stringify(DEFAULT_LOOK.y))}, Store.get("looks",{})); }
function viewPalace(root, opts={}){
  const looks = lookStore(); let who = opts.who || "y", cat = "dress", shared = opts.shared;
  const v=h(`<section class="view palace"><div class="pal-bg"></div><div class="chandelier" aria-hidden="true"></div>${leafLayer(6,"soft")}
    <div class="pal-wrap">
      <div class="pal-stage panel"><div class="pal-doll" data-doll></div>
        <div class="pal-elaf"><img class="girl idle" src="${GIRL}" alt="${esc(heroName())} الستايلست" draggable="false"><span class="say" data-tip>${esc(heroName())}: أنا الستايلست اليوم! اختاروا تحدي وصمموا.</span></div>
        ${opts.shared?"":`<button class="pal-sumo" data-sumo aria-label="${CONFIG.guestName}">${ART.sumo(flag("hatReturned")?"happy":"idle").replace('<ellipse cx="100" cy="210"', flag("hatReturned")?'<g transform="translate(46 0) scale(1.8)">'+ART.sumoHat().replace(/<\/?svg[^>]*>/g,"")+'</g><ellipse cx="100" cy="210"':'<ellipse cx="100" cy="210"')}</button>`}
        <div class="seg pal-who"><button data-who="k">${faceHTML("k",0,28)} خباب</button><button data-who="y">${faceHTML("y",0,28)} يقين</button></div></div>
      <div class="pal-tools panel">
        <div class="pal-cats" role="tablist">${CATS.map(c=>`<button data-cat="${c.k}" role="tab">${c.name}</button>`).join("")}</div>
        <div class="pal-items" data-items></div>
        <div class="pal-colors" data-colors></div>
        <div class="pal-chal" data-chal></div>
        <div class="pal-sliders"><label>الطول <input type="range" min="0" max="2" step="1" data-len></label><label>المقاس <input type="range" min="0" max="2" step="1" data-fit></label></div>
        <div class="row" style="margin-top:8px">${shared?"":`<button class="btn honey" data-show>${IC.star} مسرح العرض</button>`}<button class="btn ghost small" data-reset>${IC.restart} الشكل الأصلي</button></div>
        <p class="d-note">القطع المقفولة تنفتح بنجوم الألعاب. عندج الآن ${progress.stars} نجمة.</p>
      </div>
    </div></section>`);
  root.appendChild(v);
  const L = () => looks[who];
  const save = () => { Store.set("looks", looks); if(shared) shared.onChange(who, looks[who]); };
  function drawDoll(){ $("[data-doll]",v).innerHTML = dollSVG(who, L()); }
  function drawItems(){
    $$("[data-cat]",v).forEach(b=>{ b.setAttribute("aria-selected", b.dataset.cat===cat); b.hidden = CATS.find(c=>c.k===b.dataset.cat).who && CATS.find(c=>c.k===b.dataset.cat).who!==who && false; });
    const list=ITEMS[cat]; const cur = cat==="dress" ? (L().mode==="dress"?L().dress.id:"") : (L()[cat]||{}).id;
    $("[data-items]",v).innerHTML = list.map(it=>{ const lock=!itemOpen(it); return `<button class="pal-item ${lock?"locked":""}" data-it="${it.id}" aria-pressed="${cur===it.id}" ${lock?`title="تنفتح: ${itemHow(it)}"`:""}>${lock?IC.lock:""}<span>${it.n}</span>${lock?`<small>${itemHow(it)}</small>`:""}</button>`; }).join("");
    $$("[data-it]",v).forEach(b=>b.onclick=()=>{ if(b.classList.contains("locked")){ toast("تنفتح بنجوم الألعاب أو بمهمات العالم — شوفوا دفتر المهام","lock"); return; } const id=b.dataset.it; if(cat==="dress"){ L().mode="dress"; L().dress.id=id; } else { if(cat==="top"||cat==="bottom") L().mode="set"; L()[cat]=Object.assign(L()[cat]||{}, {id}); } Sound.pop(); save(); drawDoll(); drawItems(); kidDance(); });
    const target = cat==="dress"?L().dress:L()[cat];
    $("[data-colors]",v).innerHTML = cat==="acc" ? "" : PALETTE.map(c=>`<button class="swatch" data-col="${c}" style="background:${c}" aria-label="لون" aria-pressed="${target&&target.c===c}"></button>`).join("");
    $$("[data-col]",v).forEach(b=>b.onclick=()=>{ const t = cat==="dress"?L().dress:L()[cat]; if(!t) return; t.c=b.dataset.col; save(); drawDoll(); drawItems(); });
    $("[data-len]",v).value=L().len??1; $("[data-fit]",v).value=L().fit??1;
  }
  const kidDance=()=>{ const d=$("[data-doll]",v); kidAct(d,"happy"); drawChal(); tip(); };
  let chal = Store.get("styleChal", STYLE_CHALLENGES[0].id), tipT;
  const tipEl=$("[data-tip]",v);
  function tip(force){ const C=STYLE_CHALLENGES.find(c=>c.id===chal); const miss=C.rules.filter(r=>!r[1](L())); if(!force && Math.random()<.5) return; tipEl.textContent = heroName()+": "+(miss.length ? pick(["حلو! ","يجنن! ","ممم… ","خوش اختيار! "])+"بس لتحدي «"+C.n+"» جرّبوا: "+miss[0][0]+"." : pick(["هاي الإطلالة كاملة! ","واو، جاهزين للمسرح! "])+"قيّموها وشوفوا."); kidAct($(".pal-elaf",v),"talk"); }
  function drawChal(){ const C=STYLE_CHALLENGES.find(c=>c.id===chal); const box=$("[data-chal]",v);
    box.innerHTML=`<b>تحدي ${esc(heroName())}:</b><div class="pal-cats">${STYLE_CHALLENGES.map(c=>`<button data-ch="${c.id}" aria-selected="${c.id===chal}">${esc(c.n)}${progress["once_style_"+c.id]?" ✔":""}</button>`).join("")}</div><ul class="q-sub">${C.rules.map(r=>{ const ok=r[1](L()); return `<li class="${ok?"done":""}">${ok?IC.check:"<i class='dotx'></i>"}${esc(r[0])}</li>`; }).join("")}</ul><button class="btn small" data-rate>${IC.star} خلّي ${esc(heroName())} تقيّم</button>`;
    $$("[data-ch]",box).forEach(b=>b.onclick=()=>{ chal=b.dataset.ch; Store.set("styleChal",chal); drawChal(); tip(true); });
    $("[data-rate]",box).onclick=()=>{ const n=styleScore(C, L()); Sound.chime(); tipEl.textContent=heroName()+": "+["نبدي من جديد؟ اختاروا قطعة وحدة من القائمة.","بداية حلوة! بعد شوية.","قريبة كلش! ناقص شي واحد.","تحفة! ثلاث نجوم من الستايلست."][n]; kidAct($(".pal-elaf",v),"happy"); if(n===3){ confetti(); addStarsOnce("style_"+C.id, 2, "تحدي «"+C.n+"»"); drawChal(); } };
  }
  $$("[data-cat]",v).forEach(b=>b.onclick=()=>{ cat=b.dataset.cat; drawItems(); });
  const setWho=w=>{ who=w; $$("[data-who]",v).forEach(b=>b.setAttribute("aria-pressed",b.dataset.who===w)); drawDoll(); drawItems(); };
  $$("[data-who]",v).forEach(b=>b.onclick=()=>setWho(b.dataset.who));
  if(shared && shared.lock){ $(".pal-who",v).hidden=true; }
  $("[data-len]",v).oninput=e=>{ L().len=+e.target.value; save(); drawDoll(); };
  $("[data-fit]",v).oninput=e=>{ L().fit=+e.target.value; save(); drawDoll(); };
  const sb=$("[data-show]",v); if(sb) sb.onclick=()=>go("show");
  $("[data-reset]",v).onclick=()=>{ looks[who]=JSON.parse(JSON.stringify(DEFAULT_LOOK[who])); save(); setWho(who); };
  setWho(who); drawChal();
  const sumoB=$("[data-sumo]",v); if(sumoB) sumoB.onclick=()=>{ react(sumoB,"hop"); setFlag("metSumo"); dialogue(v, hasItem("sumoHat") && !flag("hatReturned") ? [["sumo",1,"قبعتي!! خلّوني أشوفها… روحوا للخريطة وسلّموها بقصر الأزياء."]] : [["sumo",flag("hatReturned")?1:0,npcLine("sumo")]]); };
  return {setWho, looks, redraw:()=>{ drawDoll(); drawItems(); }};
}
/* تحديات ستايلست: أيلاف تختار موضوع وتقيّم الإطلالة (بدون عقاب، بس تلميحات) */
const WARM=["#7A2E2A","#B5482A","#D9A53A","#6B4A2E","#C8552B"], NIGHT=["#3E4A7A","#2B2B33","#B9A6DD"], SOFT=["#E9A79E","#5B7F4A","#FFFFFF","#F3E6C8","#C76B8E","#8EC3CF"];
const lookColors = L => (L.mode==="dress" ? [L.dress.c] : [L.top.c, L.bottom.c]).concat(L.jacket && L.jacket.id!=="none" ? [L.jacket.c] : []);
const accId = L => (L.acc&&L.acc.id)||"none", wingId = L => (L.wings&&L.wings.id)||"none";
const STYLE_CHALLENGES = [
  {id:"autumn", n:"خريف ذهبي", rules:[["لون دافي (أحمر، برتقالي، ذهبي أو بني)", L=>lookColors(L).some(c=>WARM.includes(c))],["أجنحة أوراق خريف أو تاج أوراق", L=>wingId(L)==="maple"||accId(L)==="crown"],["بوت أو جاكيت", L=>L.shoes.id==="boots"||(L.jacket&&L.jacket.id!=="none")]]},
  {id:"party", n:"حفلة القلعة", rules:[["فستان سهرة، ساتان، أو معطف/كاب", L=>(L.mode==="dress"&&["gown","slip"].includes(L.dress.id))||["coat","cape"].includes(L.jacket&&L.jacket.id)],["قبعة عالية أو تاج", L=>["tophat","crown"].includes(accId(L))],["أجنحة لامعة (زجاج أو شفافة)", L=>["glass","crystal"].includes(wingId(L))]]},
  {id:"garden", n:"نزهة بالحديقة", rules:[["سنيكرز أو ماري جين", L=>["sneakers","mary"].includes(L.shoes.id)],["إكليل ورد", L=>accId(L)==="flowers"],["لون فاتح (وردي، أخضر، أبيض)", L=>lookColors(L).some(c=>SOFT.includes(c))]]},
  {id:"train", n:"رحلة القطار", rules:[["معطف فكتوري أو جاكيت جينز", L=>["coat","denim"].includes(L.jacket&&L.jacket.id)],["قبعة سائق القطار أو بيريه", L=>["conductor","beret"].includes(accId(L))],["بوت", L=>L.shoes.id==="boots"]]},
  {id:"night", n:"نجوم الليل", rules:[["لون ليلي (كحلي، أسود، بنفسجي)", L=>lookColors(L).some(c=>NIGHT.includes(c))],["أجنحة شفافة مضيئة أو زجاج ملوّن", L=>["crystal","glass"].includes(wingId(L))],["فانوس صغير أو نظارات", L=>["lantern","glasses"].includes(accId(L))]]}
];
const styleScore = (C, L) => C ? C.rules.filter(r=>r[1](L)).length : 0;
/* runway show (solo or shared with a friend) */
const THEMES = ["خريف ذهبي","حفلة القلعة","نجوم الليل","نزهة بالحديقة","رحلة القطار","مطر وغيمة"];
function runwayMusic(){ if(!prefs.sound) return ()=>{}; const notes=[523,659,784,659,587,698,880,698,523,659,784,1046]; let i=0; const t=setInterval(()=>{ Sound.note(notes[i%notes.length]); if(i%3===0) Sound.note(notes[i%notes.length]/2); i++; }, 330); return ()=>clearInterval(t); }
function runwayHTML(looks, theme, walk){
  return `<div class="runway"><div class="rw-lights">${[0,1,2,3].map(i=>`<i style="--d:${i*.7}s;--x:${12+i*25}%"></i>`).join("")}</div><div class="rw-curtain l"></div><div class="rw-curtain r"></div>
    <div class="rw-title">${esc(theme)}</div><div class="rw-floor"></div>
    <div class="rw-model rw-a walk-${walk}">${dollSVG("k",looks.k)}</div><div class="rw-model rw-b walk-${walk}">${dollSVG("y",looks.y)}</div></div>`;
}
function viewShow(root){
  const net = Party.connected() && Party.game==="show";
  const myWho = net ? Party.me.char : null;
  let theme = Store.get("showTheme", THEMES[0]), walk="calm";
  const v=h(`<section class="view showroom"><div class="sr-wrap">
    <div class="panel sr-head"><div><h2>عرض الأزياء ${net?"المشترك":""}</h2><p>${net?`إنتِ تصممين ${CH[myWho].name}، وصاحبج يصمم الثاني. لما تجهزون، العرض يبدي بنفس الوقت عند الاثنين.`:"صممي الشخصيتين، اختاري الموضوع وطريقة المشي، وشغّلي العرض."}</p></div>
      <div class="sr-ctl"><label>الموضوع <select data-theme>${THEMES.map(t=>`<option ${t===theme?"selected":""}>${t}</option>`).join("")}</select></label><label>المشي <select data-walk><option value="calm">هادئ</option><option value="hop">قفزات</option><option value="spin">دوران</option></select></label><button class="btn honey" data-play>${net?"آني جاهزة":"شغّلي العرض"}</button><span class="chip" data-st></span></div></div>
    <div data-design></div><div data-stage></div></div></section>`);
  root.appendChild(v);
  const pal = viewPalace($("[data-design]",v), {who: myWho||"y", shared: net ? {lock:true, onChange:(w,l)=>Party.send({t:"look", who:w, look:l})} : null});
  $("[data-design] .palace",v).classList.add("embedded");
  let stopMusic=()=>{}, readyMe=false, readyOther=false;
  let judgeT=0;
  function play(){ const looks=lookStore(); if(net && Party.otherLook) looks[Party.me.char==="k"?"y":"k"]=Party.otherLook; const st=$("[data-stage]",v); st.innerHTML=runwayHTML(looks, theme, walk); st.scrollIntoView({behavior:motionOK()?"smooth":"auto"}); stopMusic(); stopMusic=runwayMusic(); setTimeout(()=>{ stopMusic(); stopMusic=()=>{}; }, 14000); Sound.chime(); confetti(); addStarsOnce("runway1",2,"أول عرض أزياء"); if(typeof checkUnlocks==="function") checkUnlocks(); readyMe=readyOther=false;
    clearTimeout(judgeT); const C=STYLE_CHALLENGES.find(c=>c.n===theme);
    judgeT=setTimeout(()=>{ if(!document.body.contains(v)) return; const a=styleScore(C,looks.k), b=styleScore(C,looks.y), sum=a+b;
      modal(`<h2>لجنة التحكيم: ${esc(heroName())} و${esc(CONFIG.guestName)}</h2><div class="judge"><div>${faceHTML("k",a>=2?1:0,56)}<b>خباب</b>${rateStars(C?a:3)}</div><div>${faceHTML("y",b>=2?1:0,56)}<b>يقين</b>${rateStars(C?b:3)}</div></div><p>${C?`موضوع «${esc(theme)}»: مجموعكم ${sum} من 6. `:"موضوع حر: كل الإطلالات تفوز! "}${esc(sum>=5||!C?pick(["المسرح كله صفّق!",CONFIG.guestName+" رقص من الفرح!"]):"عرض حلو! "+heroName()+" تگول: شوفوا تحدي الموضوع بالورشة حتى تكملون النجوم.")}</p>`);
      if(C && sum===6) addStarsOnce("duo_"+C.id, 3, "عرض مشترك كامل");
    }, motionOK()?12500:600); upd(); }
  function upd(){ $("[data-st]",v).textContent = net ? (readyMe?(readyOther?"يلا!":"بانتظار صاحبج"):"") : ""; }
  $("[data-theme]",v).onchange=e=>{ theme=e.target.value; Store.set("showTheme",theme); if(net) Party.send({t:"theme", theme}); };
  $("[data-walk]",v).onchange=e=>{ walk=e.target.value; if(net) Party.send({t:"walk", walk}); };
  $("[data-play]",v).onclick=()=>{ if(!net){ play(); return; } readyMe=true; Party.send({t:"showready", look:lookStore()[myWho]}); upd(); if(readyOther){ Party.send({t:"showgo", at:Date.now()}); play(); } };
  const offs=[];
  if(net){
    offs.push(Party.on("look", m=>{ Party.otherLook=m.look; }));
    offs.push(Party.on("theme", m=>{ theme=m.theme; $("[data-theme]",v).value=theme; }));
    offs.push(Party.on("walk", m=>{ walk=m.walk; $("[data-walk]",v).value=walk; }));
    offs.push(Party.on("showready", m=>{ Party.otherLook=m.look; readyOther=true; upd(); if(readyMe){ Party.send({t:"showgo"}); play(); } }));
    offs.push(Party.on("showgo", ()=>play()));
    Party.send({t:"look", who:myWho, look:lookStore()[myWho]});
  }
  return ()=>{ stopMusic(); clearTimeout(judgeT); offs.forEach(f=>f()); };
}
Object.assign(ROUTES, {
  palace:{view:r=>{ viewPalace(r); }, title:()=>"قصر الأزياء", parent:"world"},
  show:{view:r=>viewShow(r), title:()=>"مسرح العرض", parent:"palace"}
});
