/* ============ شخصيات عالم القلعة الثانوية ============
   مرسومة بنفس لغة رسم جعموص وسومو: أشكال مدوّرة، حدود أغمق من اللون، خدود وردية، ظل ناعم.
   كل دالة تاخذ (state, crop) — crop=true ترجع الوجه فقط للحوار. */
const npcSVG = (vb, crop, cropVB, label, body) => `<svg class="npc" viewBox="${crop?cropVB:vb}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${label}">${body}</svg>`;
const npcEyes = (lx, rx, y, happy, r=5.5) => happy
  ? `<path d="M${lx-7} ${y+2}q7-8 14 0M${rx-7} ${y+2}q7-8 14 0" fill="none" stroke="#2F2A20" stroke-width="4" stroke-linecap="round"/>`
  : `<circle cx="${lx}" cy="${y}" r="${r}" fill="#2F2A20"/><circle cx="${rx}" cy="${y}" r="${r}" fill="#2F2A20"/><circle cx="${lx+2}" cy="${y-2}" r="1.8" fill="#fff"/><circle cx="${rx+2}" cy="${y-2}" r="1.8" fill="#fff"/>`;

// العم سعدون — صانع ساعات البرج: نظارات مدوّرة، شوارب بيضاء، مريلة بيها ترس
ART.saadoun = (state="idle", crop=false) => npcSVG("0 0 200 240", crop, "40 18 120 120", "العم سعدون", `
  ${crop?"":`<ellipse cx="100" cy="232" rx="60" ry="7" fill="rgba(60,50,30,.16)"/>
  <rect x="76" y="198" width="18" height="30" rx="8" fill="#5A4636" stroke="#3A2A1C" stroke-width="3"/><rect x="106" y="198" width="18" height="30" rx="8" fill="#5A4636" stroke="#3A2A1C" stroke-width="3"/>
  <path d="M54 206C50 150 68 120 100 120C132 120 150 150 146 206Z" fill="#8C6A48" stroke="#5A3F26" stroke-width="3.5"/>
  <path d="M78 130h44l8 76H70z" fill="#EAD9B6" stroke="#9C8460" stroke-width="3"/>
  <rect x="86" y="166" width="28" height="22" rx="5" fill="#DCC69C" stroke="#9C8460" stroke-width="2.5"/>
  <circle cx="100" cy="164" r="9" fill="#D9A53A" stroke="#8C6A2A" stroke-width="3" stroke-dasharray="4 2.5"/><circle cx="100" cy="164" r="3" fill="#5A3F26"/>
  <ellipse cx="56" cy="164" rx="12" ry="24" transform="rotate(18 56 164)" fill="#8C6A48" stroke="#5A3F26" stroke-width="3"/>
  <g class="arm-r"><ellipse cx="144" cy="164" rx="12" ry="24" transform="rotate(-18 144 164)" fill="#8C6A48" stroke="#5A3F26" stroke-width="3"/><path d="M150 184v10" stroke="#B88F33" stroke-width="2.4"/><circle cx="150" cy="203" r="10" fill="#F3E6C8" stroke="#B88F33" stroke-width="3"/><path d="M150 203v-6M150 203h4" stroke="#3A2A1C" stroke-width="1.8" stroke-linecap="round"/></g>`}
  <ellipse cx="51" cy="84" rx="8" ry="11" fill="#F2D2B4" stroke="#9C7456" stroke-width="3"/><ellipse cx="149" cy="84" rx="8" ry="11" fill="#F2D2B4" stroke="#9C7456" stroke-width="3"/>
  <circle cx="100" cy="80" r="50" fill="#F2D2B4" stroke="#9C7456" stroke-width="3.5"/>
  <path d="M54 72c-8 6-6 18 2 22M146 72c8 6 6 18-2 22" stroke="#F4F0E6" stroke-width="8" stroke-linecap="round" fill="none"/>
  <path d="M52 62C54 26 146 26 148 62C128 54 72 54 52 62Z" fill="#4A5A70" stroke="#2E3A48" stroke-width="3.5"/><path d="M48 63q52-12 104 0" stroke="#2E3A48" stroke-width="5" fill="none" stroke-linecap="round"/>
  <path d="M70 66q12-6 22 0M108 66q12-6 22 0" stroke="#F4F0E6" stroke-width="5" stroke-linecap="round" fill="none"/>
  ${npcEyes(82,118,84,state==="happy",4.6)}
  <circle cx="82" cy="84" r="13" fill="rgba(220,240,250,.35)" stroke="#6E5236" stroke-width="3.5"/><circle cx="118" cy="84" r="13" fill="rgba(220,240,250,.35)" stroke="#6E5236" stroke-width="3.5"/><path d="M95 84h10" stroke="#6E5236" stroke-width="3"/>
  <ellipse cx="100" cy="98" rx="7" ry="6" fill="#E9B79C" stroke="#9C7456" stroke-width="2"/>
  <ellipse cx="66" cy="104" rx="9" ry="5" fill="#E9A79E" opacity=".7"/><ellipse cx="134" cy="104" rx="9" ry="5" fill="#E9A79E" opacity=".7"/>
  <path d="M74 108c8-10 20-8 26-2c6-6 18-8 26 2c-8 8-20 8-26 2c-6 6-18 6-26-2z" fill="#F7F3EA" stroke="#BDB3A0" stroke-width="2"/>
  <path d="M90 118q10 ${state==="happy"?9:5} 20 0" stroke="#6E4A34" stroke-width="3" fill="none" stroke-linecap="round"/>`);

// الخالة نرجس — بستانية الدفيئة: قبعة قش بشريطة نحاسية ومرشّة ماي
ART.narjis = (state="idle", crop=false) => npcSVG("0 0 210 240", crop, "40 10 120 125", "الخالة نرجس", `
  ${crop?"":`<ellipse cx="100" cy="232" rx="60" ry="7" fill="rgba(60,50,30,.16)"/>
  <ellipse cx="84" cy="222" rx="13" ry="8" fill="#6B4A2E" stroke="#3A2A1C" stroke-width="2.5"/><ellipse cx="116" cy="222" rx="13" ry="8" fill="#6B4A2E" stroke="#3A2A1C" stroke-width="2.5"/>
  <path d="M56 214C54 162 70 126 100 126C130 126 146 162 144 214Z" fill="#7FA374" stroke="#4E6A46" stroke-width="3.5"/>
  <path d="M80 142h40l6 68H74z" fill="#F4EBD0" stroke="#C9B98E" stroke-width="3"/>
  <g transform="translate(92 164)">${[0,72,144,216,288].map(a=>`<ellipse cx="8" cy="2" rx="4" ry="6" transform="rotate(${a} 8 8)" fill="#E9A79E"/>`).join("")}<circle cx="8" cy="8" r="3" fill="#E8C066"/></g>
  <ellipse cx="58" cy="166" rx="12" ry="24" transform="rotate(16 58 166)" fill="#88AC7E" stroke="#4E6A46" stroke-width="3"/>
  <g class="arm-r"><ellipse cx="142" cy="166" rx="12" ry="24" transform="rotate(-30 142 166)" fill="#88AC7E" stroke="#4E6A46" stroke-width="3"/>
  <path d="M150 176h36l-5 30h-26z" fill="#8EC3CF" stroke="#4E8E9C" stroke-width="3" stroke-linejoin="round"/><path d="M184 182l20-12" stroke="#4E8E9C" stroke-width="5" stroke-linecap="round"/><path d="M156 176q14-20 28 0" fill="none" stroke="#4E8E9C" stroke-width="3"/></g>`}
  <path d="M58 88c-8-34 12-54 42-54s50 20 42 54c-8-14-20-22-42-22s-34 8-42 22z" fill="#6E4A34" stroke="#4A3020" stroke-width="3"/>
  <circle cx="100" cy="86" r="44" fill="#EFC9A8" stroke="#9C7456" stroke-width="3.5"/>
  <path d="M60 80c2-18 14-28 40-28s38 10 40 28c-10-10-22-14-40-14s-30 4-40 14z" fill="#6E4A34"/>
  <ellipse cx="100" cy="50" rx="72" ry="15" fill="#E8C98A" stroke="#A8864A" stroke-width="3.5"/><path d="M64 50C66 18 134 18 136 50Z" fill="#E8C98A" stroke="#A8864A" stroke-width="3.5"/><path d="M66 43q34 9 68 0" stroke="#C8552B" stroke-width="7" fill="none"/>
  <g transform="translate(122 30)">${[0,72,144,216,288].map(a=>`<ellipse cx="8" cy="1" rx="4.5" ry="7" transform="rotate(${a} 8 8)" fill="#F3C1BA" stroke="#C8705F" stroke-width="1"/>`).join("")}<circle cx="8" cy="8" r="3.5" fill="#E8C066"/></g>
  ${npcEyes(84,116,92,state==="happy")}
  <ellipse cx="70" cy="104" rx="8" ry="5" fill="#E9A79E" opacity=".75"/><ellipse cx="130" cy="104" rx="8" ry="5" fill="#E9A79E" opacity=".75"/>
  <path d="M90 110q10 ${state==="happy"?10:6} 20 0" stroke="#8E4536" stroke-width="3" fill="${state==="happy"?"#C8705F":"none"}" stroke-linecap="round"/>`);

// أم الحكايات — بومة المكتبة: نظارات ذهبية وكتاب صغير تحت جناحها
ART.owl = (state="idle", crop=false) => npcSVG("0 0 200 220", crop, "34 38 132 112", "أم الحكايات", `
  ${crop?"":`<ellipse cx="100" cy="214" rx="56" ry="6" fill="rgba(60,50,30,.16)"/><path d="M18 200h164" stroke="#7A5A3A" stroke-width="10" stroke-linecap="round"/>
  <path d="M84 196v8M90 196v8M110 196v8M116 196v8" stroke="#D98A3A" stroke-width="4" stroke-linecap="round"/>`}
  <ellipse cx="100" cy="128" rx="62" ry="72" fill="#B98A5E" stroke="#6E4A30" stroke-width="3.5"/>
  <ellipse cx="100" cy="146" rx="38" ry="48" fill="#F1E2C4" stroke="#C9B08A" stroke-width="2.5"/>
  <path d="M84 132l6 5 6-5M104 132l6 5 6-5M92 150l6 5 6-5M84 166l6 5 6-5M104 166l6 5 6-5" fill="none" stroke="#C9A47A" stroke-width="2.4" stroke-linecap="round"/>
  ${crop?"":`<path d="M42 118c-12 40-2 70 24 82c-4-30 0-62 8-82z" fill="#A27650" stroke="#6E4A30" stroke-width="3"/><g class="arm-r"><path d="M158 118c12 40 2 70-24 82c4-30 0-62-8-82z" fill="#A27650" stroke="#6E4A30" stroke-width="3"/></g>
  <rect x="130" y="160" width="30" height="22" rx="3" transform="rotate(-12 145 171)" fill="#7A2E2A" stroke="#3A1E14" stroke-width="2.5"/><path d="M136 166h18" transform="rotate(-12 145 171)" stroke="#E8C066" stroke-width="2"/>`}
  <path d="M52 74l-8-32 32 18zM148 74l8-32-32 18z" fill="#B98A5E" stroke="#6E4A30" stroke-width="3" stroke-linejoin="round"/>
  <circle cx="76" cy="96" r="22" fill="#FBF3E2" stroke="#6E4A30" stroke-width="3"/><circle cx="124" cy="96" r="22" fill="#FBF3E2" stroke="#6E4A30" stroke-width="3"/>
  ${state==="happy"?`<path d="M64 98q12-12 24 0M112 98q12-12 24 0" fill="none" stroke="#2F2A20" stroke-width="5" stroke-linecap="round"/>`:`<circle cx="78" cy="98" r="10" fill="#2F2A20"/><circle cx="122" cy="98" r="10" fill="#2F2A20"/><circle cx="81" cy="94" r="3.4" fill="#fff"/><circle cx="125" cy="94" r="3.4" fill="#fff"/>`}
  <circle cx="76" cy="96" r="25" fill="none" stroke="#C99A3C" stroke-width="3"/><circle cx="124" cy="96" r="25" fill="none" stroke="#C99A3C" stroke-width="3"/><path d="M98 92q2-4 4 0" stroke="#C99A3C" stroke-width="3" fill="none"/>
  <path d="M93 112l7 13 7-13z" fill="#E8A040" stroke="#8C5A2B" stroke-width="2" stroke-linejoin="round"/>
  <ellipse cx="58" cy="122" rx="8" ry="5" fill="#E9A79E" opacity=".6"/><ellipse cx="142" cy="122" rx="8" ry="5" fill="#E9A79E" opacity=".6"/>`);

// زعفرانة — قطة محطة القطار: قبعة سائق، وطوق بيه مكان جرس
ART.cat = (state="idle", crop=false, bell=false) => npcSVG("0 0 200 220", crop, "40 22 120 118", "زعفرانة", `
  ${crop?"":`<ellipse cx="100" cy="212" rx="56" ry="6" fill="rgba(60,50,30,.16)"/>
  <path d="M146 196c44 0 44-46 18-56" stroke="#B8662E" stroke-width="18" fill="none" stroke-linecap="round"/><path d="M146 196c44 0 44-46 18-56" stroke="#F0A35E" stroke-width="11" fill="none" stroke-linecap="round" class="cat-tail"/>
  <path d="M60 206C52 162 68 122 100 122C132 122 148 162 140 206Z" fill="#F0A35E" stroke="#B8662E" stroke-width="3.5"/>
  <ellipse cx="100" cy="172" rx="22" ry="28" fill="#FBEBD2"/>
  <ellipse cx="80" cy="204" rx="14" ry="9" fill="#F7C38E" stroke="#B8662E" stroke-width="3"/><ellipse cx="120" cy="204" rx="14" ry="9" fill="#F7C38E" stroke="#B8662E" stroke-width="3"/>`}
  <path d="M56 80l2-42 32 24zM144 80l-2-42-32 24z" fill="#F0A35E" stroke="#B8662E" stroke-width="3.5" stroke-linejoin="round"/><path d="M62 70l2-22 16 13zM138 70l-2-22-16 13z" fill="#F3C1BA"/>
  <ellipse cx="100" cy="94" rx="54" ry="46" fill="#F0A35E" stroke="#B8662E" stroke-width="3.5"/>
  <path d="M88 54q12 8 24 0M84 64q16 8 32 0" stroke="#D9803A" stroke-width="4" fill="none" stroke-linecap="round"/>
  <path d="M60 56C62 30 138 30 140 56Z" fill="#2E3E5C" stroke="#1E2A40" stroke-width="3"/><rect x="58" y="51" width="84" height="10" rx="4" fill="#D9A53A" stroke="#8C6A2A" stroke-width="2"/><path d="M58 60q-10 8 0 12h36l-6-12z" fill="#1E2A40"/>
  ${state==="happy"?`<path d="M72 96q8-9 16 0M112 96q8-9 16 0" fill="none" stroke="#2F2A20" stroke-width="4" stroke-linecap="round"/>`:`<ellipse cx="80" cy="96" rx="9" ry="11" fill="#6FA35A"/><ellipse cx="120" cy="96" rx="9" ry="11" fill="#6FA35A"/><ellipse cx="80" cy="96" rx="3" ry="9" fill="#2F2A20"/><ellipse cx="120" cy="96" rx="3" ry="9" fill="#2F2A20"/><circle cx="83" cy="91" r="2" fill="#fff"/><circle cx="123" cy="91" r="2" fill="#fff"/>`}
  <path d="M94 108h12l-6 7z" fill="#D9725F"/><path d="M100 115q-6 7-13 2M100 115q6 7 13 2" stroke="#8E4536" stroke-width="2.5" fill="none" stroke-linecap="round"/>
  <path d="M60 108l-20-4M60 114l-20 4M140 108l20-4M140 114l20 4" stroke="#8E5A30" stroke-width="2" stroke-linecap="round"/>
  <ellipse cx="68" cy="110" rx="8" ry="5" fill="#E9A79E" opacity=".7"/><ellipse cx="132" cy="110" rx="8" ry="5" fill="#E9A79E" opacity=".7"/>
  ${crop?"":`<path d="M70 132q30 14 60 0" stroke="#C8352B" stroke-width="7" fill="none" stroke-linecap="round"/>${bell?`<circle cx="100" cy="144" r="8" fill="#E8C066" stroke="#8C6A2A" stroke-width="2.5"/><path d="M96 146h8" stroke="#8C6A2A" stroke-width="2"/>`:`<circle cx="100" cy="142" r="4" fill="none" stroke="#8C6A2A" stroke-width="2" stroke-dasharray="2 2"/>`}`}`);

// جرس زعفرانة الضايع
ART.bell = () => `<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><path d="M20 4c-8 0-12 6-12 14v8l-4 6h32l-4-6v-8c0-8-4-14-12-14z" fill="#E8C066" stroke="#8C6A2A" stroke-width="2.5" stroke-linejoin="round"/><circle cx="20" cy="34" r="4" fill="#8C6A2A"/><path d="M14 14q4-5 8-4" stroke="#FFF2C8" stroke-width="2.4" fill="none" stroke-linecap="round"/></svg>`;
// قبعة سومو الوردية المنقّطة
ART.sumoHat = () => `<svg viewBox="0 0 60 40" xmlns="http://www.w3.org/2000/svg"><path d="M4 32C6 14 18 4 30 4s24 10 26 28C44 37 16 37 4 32Z" fill="#D99BB0" stroke="#9A5C72" stroke-width="2.5"/><circle cx="18" cy="20" r="4" fill="#FBF3E3"/><circle cx="32" cy="12" r="3.4" fill="#FBF3E3"/><circle cx="44" cy="22" r="4.4" fill="#FBF3E3"/></svg>`;
ART.feather = () => `<svg viewBox="0 0 40 60" xmlns="http://www.w3.org/2000/svg"><path d="M20 56C10 40 8 18 22 4c10 14 8 36-2 52z" fill="#B98A5E" stroke="#6E4A30" stroke-width="2"/><path d="M20 56C20 40 21 22 22 6M20 40l-6-6M21 30l6-6M21 22l-5-5" stroke="#6E4A30" stroke-width="1.6" fill="none"/></svg>`;
ART.seed = () => `<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><path d="M20 6c10 6 12 22 0 30C8 28 10 12 20 6z" fill="#C99B63" stroke="#7A5A3A" stroke-width="2.4"/><path d="M20 10v22" stroke="#7A5A3A" stroke-width="1.6"/><path d="M20 6c2-4 6-5 9-4-1 4-5 6-9 4z" fill="#9DBF8E" stroke="#4E6A46" stroke-width="1.6"/></svg>`;
ART.letter = () => `<svg viewBox="0 0 40 30" xmlns="http://www.w3.org/2000/svg"><rect x="2" y="2" width="36" height="26" fill="#F7EEDC" stroke="#8C5A2B" stroke-width="2"/><path d="M2 2l18 14 18-14" fill="none" stroke="#8C5A2B" stroke-width="2"/><circle cx="20" cy="18" r="4" fill="#B5482A"/></svg>`;
ART.glassKey = () => ART.key("#8EC3CF");
ART.clockFace = (hh=10, mm=10) => clockSVG(hh, mm);

const NPCS = {
  saadoun:{name:()=>"العم سعدون", color:"#7A5A3A", art:s=>ART.saadoun(s), face:m=>ART.saadoun(m===1?"happy":"idle", true)},
  narjis:{name:()=>"الخالة نرجس", color:"#4E6A46", art:s=>ART.narjis(s), face:m=>ART.narjis(m===1?"happy":"idle", true)},
  owl:{name:()=>"أم الحكايات", color:"#6E4A30", art:s=>ART.owl(s), face:m=>ART.owl(m===1?"happy":"idle", true)},
  cat:{name:()=>"زعفرانة", color:"#B8662E", art:s=>ART.cat(s,false,!!(typeof WS!=="undefined" && WS.flags.catBell)), face:m=>ART.cat(m===1?"happy":"idle", true)},
  elaf:{name:()=>heroName(), color:"#4F7350", art:()=>`<img class="girl idle" src="${GIRL}" alt="${esc(heroName())}" draggable="false">`, face:()=>`<img src="${GIRL}" alt="" style="position:absolute;width:150%;left:-25%;top:-6%">`},
  jm:{name:()=>CONFIG.companionName, color:"#4E6A46", art:s=>ART.jaamous(s||"idle"), face:()=>ART.jmFace()},
  sumo:{name:()=>CONFIG.guestName, color:"#9A5C72", art:s=>ART.sumo(s||"idle"), face:()=>ART.sumo("happy").replace('viewBox="0 0 200 220"','viewBox="10 10 180 180"')}
};
function npcHTML(id, state="idle", cls=""){ const n=NPCS[id]; return `<div class="npc-fig npc-${id} ${cls}" data-npc="${id}">${n.art(state)}</div>`; }

/* شكل خباب ويقين بالمشاهد: قصاصة الشخصية + التخصيص الإضافي (أجنحة/إكسسوار) فوقها بدون لمس اللوحة الأصلية */
const KIDS_CUSTOM = Object.assign({k:{wings:"",acc:""}, y:{wings:"",acc:""}}, Store.get("kidsCustom",{}));
function kidFigure(who, cls=""){
  const c=KIDS_CUSTOM[who]||{};
  const acc = c.acc && ACCS[c.acc] ? `<div class="kf-acc kf-acc-${ACCS[c.acc].slot||"head"} kf-acc-${who}">${ACCS[c.acc].svg()}</div>` : "";
  return `<div class="kidfig ${cls}" data-kid="${who}"><span class="kf-shadow"></span>${c.wings&&WINGS[c.wings]?`<div class="kf-wings">${WINGS[c.wings].svg(c.wcol||WINGS[c.wings].c)}</div>`:""}${charImg(who)}${acc}</div>`;
}
