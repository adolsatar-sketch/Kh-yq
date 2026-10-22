/* ============ storage (safe) ============ */
// كل موقع إله بادئة حفظ خاصة حتى ما تختلط بياناته (عالم أيلاف يستعمل elaf_)
const STORE_PREFIX = window.STORE_PREFIX || "gh_";
const Store = (() => {
  let ok = true, mem = {};
  try { const k="__gh_t"; localStorage.setItem(k,"1"); localStorage.removeItem(k); } catch(e){ ok = false; }
  return {
    ok,
    get(k, d){ try{ const v = ok ? localStorage.getItem(STORE_PREFIX+k) : mem[k]; return v==null ? d : JSON.parse(v); }catch(e){ return d; } },
    set(k, v){ const s = JSON.stringify(v); if(!ok){ mem[k]=s; return true; } try{ localStorage.setItem(STORE_PREFIX+k, s); return true; }catch(e){ toast("ما قدرت أحفظ — مساحة الجهاز ممتلئة"); return false; } },
    del(k){ try{ ok ? localStorage.removeItem(STORE_PREFIX+k) : delete mem[k]; }catch(e){} },
    clearAll(){ try{ Object.keys(localStorage).filter(k=>k.startsWith(STORE_PREFIX)).forEach(k=>localStorage.removeItem(k)); }catch(e){} mem={}; }
  };
})();

const prefs = Object.assign({sound:false, calm:false}, Store.get("prefs", {}));

/* ============ helpers ============ */
const $ = (s, r=document) => r.querySelector(s);
const $$ = (s, r=document) => Array.from(r.querySelectorAll(s));
function h(html){ const t=document.createElement("template"); t.innerHTML=html.trim(); return t.content.firstElementChild; }
const esc = s => String(s??"").replace(/[&<>"']/g, c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const shuffle = a => { a=a.slice(); for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];} return a; };
const svgURL = s => "data:image/svg+xml;charset=utf-8,"+encodeURIComponent(s);
const sysReduce = window.matchMedia ? matchMedia("(prefers-reduced-motion: reduce)") : {matches:false};
const motionOK = () => !prefs.calm && !sysReduce.matches;
const finePointer = window.matchMedia && matchMedia("(pointer:fine)").matches;
// أجهزة ضعيفة أو توفير بيانات: نقلل الأوراق المتطايرة والـparallax
const lowPower = (()=>{ try{ const c=navigator.connection; return (navigator.hardwareConcurrency && navigator.hardwareConcurrency<=2) || (navigator.deviceMemory && navigator.deviceMemory<=2) || !!(c && c.saveData); }catch(e){ return false; } })();
document.documentElement.style.setProperty("--forest", `url("${new URL(FOREST, location.href).href}")`); // رابط كامل حتى ما ينحسب نسبةً لمجلد css

/* ============ icons ============ */
const IC = {
  back:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M9 5l7 7-7 7"/></svg>',
  star:'<svg viewBox="0 0 24 24"><path d="M12 2.8l2.7 5.6 6.1.8-4.4 4.3 1 6.1L12 16.8l-5.4 2.8 1-6.1-4.4-4.3 6.1-.8z" fill="#E8C066" stroke="#B88F33" stroke-width="1.4" stroke-linejoin="round"/></svg>',
  gift:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3.5" y="9" width="17" height="11" rx="2"/><path d="M2.5 9h19M12 9v11M12 9c-2-4-6-4-6-1.5S10 9 12 9zm0 0c2-4 6-4 6-1.5S14 9 12 9z"/></svg>',
  sound:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z"/><path class="w1" d="M15.5 9a4 4 0 010 6M18 6.5a7.5 7.5 0 010 11"/></svg>',
  calm:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 3c-3 4-6 6-6 10a6 6 0 0012 0c0-4-3-6-6-10z"/><path d="M12 9v9"/></svg>',
  gear:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3.2"/><path d="M12 2.5v3M12 18.5v3M4.6 4.6l2.1 2.1M17.3 17.3l2.1 2.1M2.5 12h3M18.5 12h3M4.6 19.4l2.1-2.1M17.3 6.7l2.1-2.1"/></svg>',
  restart:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12a8 8 0 108-8H8"/><path d="M10 1.5L7.5 4 10 6.5"/></svg>',
  close:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>',
  list:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M8 6h12M8 12h12M8 18h12"/><circle cx="4" cy="6" r="1.2" fill="currentColor"/><circle cx="4" cy="12" r="1.2" fill="currentColor"/><circle cx="4" cy="18" r="1.2" fill="currentColor"/></svg>',
  up:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M5 15l7-7 7 7"/></svg>',
  down:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M5 9l7 7 7-7"/></svg>',
  left:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M15 5l-7 7 7 7"/></svg>',
  right:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M9 5l7 7-7 7"/></svg>',
  jump:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20V6M6 11l6-6 6 6"/><path d="M5 22h14"/></svg>',
  pen:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20l1-4L16 5l3 3L8 19z"/><path d="M14 7l3 3"/></svg>',
  brush:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 4l6 6-7 7-6-6z"/><path d="M7 11c-3 0-4 3-4 6 0 2-1 3-1 3s5 1 7-1 2-4 2-4"/></svg>',
  crayon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 19l2-6 9-9 4 4-9 9z"/><path d="M7 13l4 4M5 19l-2 2"/></svg>',
  eraser:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 20h12M4 15l9-9 6 6-7 7H8z"/><path d="M9 10l6 6"/></svg>',
  move:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v18M3 12h18M12 3l-3 3M12 3l3 3M12 21l-3-3M12 21l3-3M3 12l3-3M3 12l3 3M21 12l-3-3M21 12l-3 3"/></svg>',
  undo:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 8H7l3-3M7 8l3 3"/><path d="M7 8h8a5 5 0 010 10h-4"/></svg>',
  redo:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 8h7l-3-3M17 8l-3 3"/><path d="M17 8H9a5 5 0 000 10h4"/></svg>',
  trash:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"/></svg>',
  save:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v12M7 10l5 5 5-5M4 20h16"/></svg>',
  upload:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 15V3M7 8l5-5 5 5M4 20h16"/></svg>',
  plus:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>',
  bulb:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18h6M10 21h4M12 3a6 6 0 00-4 10.5c.8.8 1 1.5 1 2.5h6c0-1 .2-1.7 1-2.5A6 6 0 0012 3z"/></svg>',
  eye:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></svg>',
  lock:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="5" y="10" width="14" height="10" rx="2"/><path d="M8 10V7a4 4 0 018 0v3"/></svg>',
  check:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7"/></svg>',
  menu:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M4 7h16M4 12h16M4 17h16"/></svg>',
  quest:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 3h11l3 3v15H5z"/><path d="M9 9h6M9 13h6M9 17h3"/><path d="M15 3v4h4"/></svg>',
  map:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6l6-2 6 2 6-2v14l-6 2-6-2-6 2z"/><path d="M9 4v14M15 6v14"/></svg>',
  friends:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="8" r="3.2"/><circle cx="16.5" cy="9" r="2.6"/><path d="M2.5 20c.6-3.6 2.8-5.5 5.5-5.5s4.9 1.9 5.5 5.5M13.5 15.2c.9-.8 1.9-1.2 3-1.2 2.3 0 4 1.6 4.5 4.5"/></svg>',
  door:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 21V5a7 7 0 0114 0v16z"/><path d="M3 21h18"/><circle cx="15" cy="13" r="1" fill="currentColor"/></svg>',
  pause:'<svg viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="5" width="4" height="14" rx="1.5"/><rect x="14" y="5" width="4" height="14" rx="1.5"/></svg>'
};
function fillIcons(root=document){ $$("[data-ic]", root).forEach(el=>{ el.innerHTML = IC[el.dataset.ic]||""; el.style.display="inline-flex"; }); }

/* ============ original art (SVG) ============ */
const ART = {};
ART.butterfly = (c1="#B9A6DD", c2="#E8C066") => `<svg viewBox="0 0 60 50" xmlns="http://www.w3.org/2000/svg"><g class="wing"><path d="M30 25C20 6 4 6 6 20C7 30 20 30 30 26Z" fill="${c1}" stroke="#5E4D86" stroke-width="1.6"/><path d="M30 26C20 30 10 40 16 45C22 48 28 36 30 28Z" fill="${c2}" stroke="#5E4D86" stroke-width="1.6"/><path d="M30 25C40 6 56 6 54 20C53 30 40 30 30 26Z" fill="${c1}" stroke="#5E4D86" stroke-width="1.6"/><path d="M30 26C40 30 50 40 44 45C38 48 32 36 30 28Z" fill="${c2}" stroke="#5E4D86" stroke-width="1.6"/></g><rect x="28.5" y="16" width="3" height="20" rx="1.5" fill="#4A3E5E"/><path d="M30 17q-4-8-7-9M30 17q4-8 7-9" stroke="#4A3E5E" stroke-width="1.4" fill="none"/></svg>`;
ART.bird = () => `<svg viewBox="0 0 60 50" xmlns="http://www.w3.org/2000/svg"><ellipse cx="30" cy="30" rx="18" ry="15" fill="#8EC3CF" stroke="#4E8E9C" stroke-width="2"/><path d="M26 30q8 10 18 0q-8-2-18 0z" fill="#6FAAB8" stroke="#4E8E9C" stroke-width="1.6"/><circle cx="20" cy="25" r="2.6" fill="#2F2A20"/><path d="M12 28l-7 2 7 2z" fill="#E8C066" stroke="#B88F33" stroke-width="1.2"/><ellipse cx="24" cy="34" rx="6" ry="4" fill="#F4EBD0"/><path d="M26 45v3M32 45v3" stroke="#B88F33" stroke-width="2" stroke-linecap="round"/></svg>`;
ART.rabbit = () => `<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><ellipse cx="22" cy="14" rx="5" ry="13" fill="#F4EBD0" stroke="#9C8A68" stroke-width="2"/><ellipse cx="34" cy="13" rx="5" ry="13" transform="rotate(12 34 13)" fill="#F4EBD0" stroke="#9C8A68" stroke-width="2"/><ellipse cx="22" cy="15" rx="2" ry="8" fill="#E9A79E"/><ellipse cx="30" cy="42" rx="18" ry="15" fill="#F4EBD0" stroke="#9C8A68" stroke-width="2"/><circle cx="29" cy="30" r="12" fill="#F4EBD0" stroke="#9C8A68" stroke-width="2"/><circle cx="25" cy="28" r="2" fill="#2F2A20"/><circle cx="33" cy="28" r="2" fill="#2F2A20"/><path d="M27 33q2 2 4 0" stroke="#2F2A20" stroke-width="1.5" fill="none"/><circle cx="47" cy="46" r="5" fill="#fff" stroke="#9C8A68" stroke-width="1.5"/></svg>`;
ART.frog = () => `<svg viewBox="0 0 60 50" xmlns="http://www.w3.org/2000/svg"><ellipse cx="30" cy="34" rx="22" ry="14" fill="#9DBF8E" stroke="#4E6A46" stroke-width="2"/><circle cx="19" cy="20" r="8" fill="#9DBF8E" stroke="#4E6A46" stroke-width="2"/><circle cx="41" cy="20" r="8" fill="#9DBF8E" stroke="#4E6A46" stroke-width="2"/><circle cx="19" cy="20" r="4" fill="#2F2A20"/><circle cx="41" cy="20" r="4" fill="#2F2A20"/><circle cx="20" cy="19" r="1.3" fill="#fff"/><circle cx="42" cy="19" r="1.3" fill="#fff"/><path d="M20 34q10 7 20 0" stroke="#2F2A20" stroke-width="2" fill="none" stroke-linecap="round"/><ellipse cx="14" cy="32" rx="3" ry="2" fill="#E9A79E" opacity=".8"/><ellipse cx="46" cy="32" rx="3" ry="2" fill="#E9A79E" opacity=".8"/></svg>`;
ART.leaf = (c="#9DBF8E") => `<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><path d="M10 50C8 26 26 8 52 8C52 34 36 52 10 50Z" fill="${c}" stroke="#4E6A46" stroke-width="2.2"/><path d="M12 48C22 36 34 24 48 12" stroke="#4E6A46" stroke-width="2" fill="none"/><path d="M24 36l-2-10M32 28l-1-10M24 36l10 1M32 28l10 0" stroke="#4E6A46" stroke-width="1.5"/></svg>`;
ART.flower = (c="#FBF6E8") => `<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><g stroke="#B6A57A" stroke-width="1.6" fill="${c}">${[0,45,90,135,180,225,270,315].map(a=>`<ellipse cx="30" cy="15" rx="6.5" ry="11" transform="rotate(${a} 30 30)"/>`).join("")}</g><circle cx="30" cy="30" r="8" fill="#E8C066" stroke="#B88F33" stroke-width="2"/></svg>`;
ART.acorn = () => `<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><path d="M18 26C18 44 24 54 30 56C36 54 42 44 42 26Z" fill="#D9A06A" stroke="#7A5A3A" stroke-width="2.2"/><path d="M12 26C12 14 22 10 30 10C38 10 48 14 48 26Z" fill="#8C6C48" stroke="#5A3F26" stroke-width="2.2"/><path d="M16 20h28M14 24h32" stroke="#5A3F26" stroke-width="1.3" opacity=".6"/><path d="M30 10V4" stroke="#5A3F26" stroke-width="3" stroke-linecap="round"/></svg>`;
ART.mushroom = (c="#E9A79E") => `<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><path d="M22 32C20 44 22 54 30 54C38 54 40 44 38 32Z" fill="#F3E6C8" stroke="#8C6C48" stroke-width="2"/><path d="M6 32C6 16 18 6 30 6C42 6 54 16 54 32C42 36 18 36 6 32Z" fill="${c}" stroke="#9A5C52" stroke-width="2.2"/><circle cx="20" cy="20" r="4" fill="#FBF3E3"/><circle cx="34" cy="14" r="3.5" fill="#FBF3E3"/><circle cx="42" cy="24" r="4" fill="#FBF3E3"/></svg>`;
ART.firefly = () => `<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><circle cx="30" cy="38" r="14" fill="#FFF2B0" opacity=".55"/><ellipse cx="30" cy="38" rx="7" ry="8" fill="#F7DE7A" stroke="#B88F33" stroke-width="1.6"/><ellipse cx="30" cy="24" rx="7" ry="8" fill="#5E5A70" stroke="#3D3A4E" stroke-width="1.6"/><ellipse cx="20" cy="26" rx="8" ry="5" transform="rotate(-30 20 26)" fill="#E6F2F6" stroke="#8EA7B0" stroke-width="1.4" opacity=".9"/><ellipse cx="40" cy="26" rx="8" ry="5" transform="rotate(30 40 26)" fill="#E6F2F6" stroke="#8EA7B0" stroke-width="1.4" opacity=".9"/><circle cx="27" cy="20" r="1.5" fill="#fff"/><circle cx="33" cy="20" r="1.5" fill="#fff"/><path d="M27 16q-3-6-6-7M33 16q3-6 6-7" stroke="#3D3A4E" stroke-width="1.4" fill="none"/></svg>`;
ART.snail = () => `<svg viewBox="0 0 60 50" xmlns="http://www.w3.org/2000/svg"><path d="M6 42C10 36 20 36 50 38C54 40 54 44 50 44H8Z" fill="#E7D3AE" stroke="#8C6C48" stroke-width="2"/><circle cx="32" cy="26" r="14" fill="#C99B63" stroke="#7A5A3A" stroke-width="2"/><path d="M32 26m-9 0a9 9 0 1018 0a6 6 0 10-12 0a3 3 0 106 0" fill="none" stroke="#7A5A3A" stroke-width="2"/><path d="M10 38V28M14 38V30" stroke="#8C6C48" stroke-width="2" stroke-linecap="round"/><circle cx="10" cy="27" r="2" fill="#2F2A20"/><circle cx="14" cy="29" r="2" fill="#2F2A20"/></svg>`;
ART.ladybug = () => `<svg viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg"><circle cx="25" cy="12" r="7" fill="#3D3A2E"/><ellipse cx="25" cy="28" rx="15" ry="16" fill="#D9725F" stroke="#7A3A2E" stroke-width="2"/><path d="M25 12v32" stroke="#3D3A2E" stroke-width="2"/><circle cx="18" cy="24" r="3" fill="#3D3A2E"/><circle cx="32" cy="24" r="3" fill="#3D3A2E"/><circle cx="19" cy="35" r="2.5" fill="#3D3A2E"/><circle cx="31" cy="35" r="2.5" fill="#3D3A2E"/></svg>`;
ART.stone = () => `<svg viewBox="0 0 60 40" xmlns="http://www.w3.org/2000/svg"><path d="M6 32C4 18 16 8 30 8C46 8 56 18 54 30C52 38 10 40 6 32Z" fill="#B8B4A4" stroke="#6E6955" stroke-width="2.2"/><path d="M16 22c6-4 14-6 22-4" stroke="#fff" stroke-width="2" opacity=".5" fill="none"/><path d="M38 30c4-2 8-1 10 1" stroke="#7FA37A" stroke-width="3" fill="none" stroke-linecap="round"/></svg>`;
ART.log = () => `<svg viewBox="0 0 70 40" xmlns="http://www.w3.org/2000/svg"><rect x="6" y="10" width="58" height="22" rx="11" fill="#A07A50" stroke="#5A3F26" stroke-width="2.2"/><ellipse cx="58" cy="21" rx="7" ry="11" fill="#D9B88A" stroke="#5A3F26" stroke-width="2"/><ellipse cx="58" cy="21" rx="3" ry="5" fill="none" stroke="#8C6C48" stroke-width="1.5"/><path d="M14 18h30M18 26h26" stroke="#5A3F26" stroke-width="1.5" opacity=".6"/><path d="M28 10c0-6 6-8 8-4" stroke="#7FA37A" stroke-width="3" fill="none" stroke-linecap="round"/></svg>`;
ART.puddle = () => `<svg viewBox="0 0 70 30" xmlns="http://www.w3.org/2000/svg"><ellipse cx="35" cy="16" rx="30" ry="11" fill="#8EC3CF" stroke="#4E8E9C" stroke-width="2"/><path d="M20 14q8-4 16 0M40 18q6-3 12 0" stroke="#fff" stroke-width="2" fill="none" opacity=".7"/></svg>`;
ART.starB = () => `<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><path d="M30 5l7 15 16 2-12 11 3 16-14-8-14 8 3-16L7 22l16-2z" fill="#F2D27A" stroke="#B88F33" stroke-width="2.4" stroke-linejoin="round"/><circle cx="25" cy="28" r="2" fill="#5A3F26"/><circle cx="35" cy="28" r="2" fill="#5A3F26"/><path d="M26 34q4 3 8 0" stroke="#5A3F26" stroke-width="1.8" fill="none" stroke-linecap="round"/></svg>`;
ART.heart = () => `<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><path d="M30 52C10 38 6 28 8 20C10 10 24 8 30 18C36 8 50 10 52 20C54 28 50 38 30 52Z" fill="#E9A79E" stroke="#9A5C52" stroke-width="2.2"/></svg>`;
ART.cloud = () => `<svg viewBox="0 0 80 50" xmlns="http://www.w3.org/2000/svg"><path d="M16 40C6 40 4 28 14 26C12 14 28 10 34 18C38 8 56 8 58 22C70 20 76 32 68 40Z" fill="#FBF6E8" stroke="#B8B4C8" stroke-width="2"/></svg>`;
// landmarks
ART.treehouse = () => `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg"><path d="M30 70h60v8H30z" fill="#8C6C48" stroke="#5A3F26" stroke-width="2.5"/><path d="M38 38h44v32H38z" fill="#E7C99A" stroke="#7A5A3A" stroke-width="2.5"/><path d="M30 40L60 16 90 40z" fill="#B88F70" stroke="#5A3F26" stroke-width="2.5" stroke-linejoin="round"/><path d="M34 37l26-20 26 20" stroke="#7FA37A" stroke-width="4" fill="none" opacity=".7"/><rect x="52" y="48" width="16" height="22" rx="8" fill="#7A5A3A"/><rect x="42" y="44" width="8" height="8" fill="#FFF2B0" stroke="#7A5A3A" stroke-width="1.5"/><path d="M46 78v34M58 78v34M46 86h12M46 96h12M46 106h12" stroke="#7A5A3A" stroke-width="3" stroke-linecap="round"/><path d="M78 58c6 0 10 6 6 10" stroke="#E9A79E" stroke-width="2" fill="none"/><circle cx="84" cy="70" r="3" fill="#E9A79E"/></svg>`;
ART.studio = () => `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg"><path d="M40 62C36 86 38 108 60 108C82 108 84 86 80 62Z" fill="#F3E6C8" stroke="#8C6C48" stroke-width="2.5"/><rect x="52" y="82" width="16" height="26" rx="8" fill="#B9A6DD" stroke="#6B5596" stroke-width="2"/><circle cx="64" cy="96" r="1.8" fill="#6B5596"/><path d="M8 64C8 32 32 12 60 12C88 12 112 32 112 64C88 72 32 72 8 64Z" fill="#E9A79E" stroke="#9A5C52" stroke-width="2.5"/><circle cx="36" cy="38" r="7" fill="#FBF3E3"/><circle cx="64" cy="26" r="6" fill="#FBF3E3"/><circle cx="88" cy="44" r="8" fill="#FBF3E3"/><path d="M92 96l18-30" stroke="#7A5A3A" stroke-width="4" stroke-linecap="round"/><path d="M108 68c4-6 10-4 8 2l-4 4z" fill="#8EC3CF" stroke="#4E8E9C" stroke-width="1.6"/><circle cx="22" cy="100" r="5" fill="#E8C066"/><circle cx="14" cy="108" r="4" fill="#8EC3CF"/><circle cx="28" cy="110" r="4" fill="#B9A6DD"/></svg>`;
ART.bridgeSign = () => `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg"><path d="M58 50v62" stroke="#7A5A3A" stroke-width="6" stroke-linecap="round"/><path d="M18 28h76l12 12-12 12H18z" fill="#D9B88A" stroke="#7A5A3A" stroke-width="2.5" stroke-linejoin="round"/><path d="M30 36h52M30 44h40" stroke="#7A5A3A" stroke-width="2.5" stroke-linecap="round" opacity=".55"/><path d="M50 110c4-10 14-10 18 0" stroke="#7FA37A" stroke-width="4" fill="none"/></svg>`;
ART.pond = () => `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg"><ellipse cx="60" cy="86" rx="52" ry="20" fill="#A7D3DC" stroke="#4E8E9C" stroke-width="2.5"/><path d="M30 84a14 7 0 1028 0l-14 0z" fill="#9DBF8E" stroke="#4E6A46" stroke-width="2"/><path d="M66 92a12 6 0 1024 0l-12 0z" fill="#88AC7E" stroke="#4E6A46" stroke-width="2"/><g transform="translate(40 40) scale(.9)">${'<ellipse cx="30" cy="34" rx="22" ry="14" fill="#9DBF8E" stroke="#4E6A46" stroke-width="2"/><circle cx="19" cy="20" r="8" fill="#9DBF8E" stroke="#4E6A46" stroke-width="2"/><circle cx="41" cy="20" r="8" fill="#9DBF8E" stroke="#4E6A46" stroke-width="2"/><circle cx="19" cy="20" r="4" fill="#2F2A20"/><circle cx="41" cy="20" r="4" fill="#2F2A20"/><path d="M20 34q10 7 20 0" stroke="#2F2A20" stroke-width="2" fill="none"/>'}</g><circle cx="94" cy="78" r="5" fill="#F3B9C6" stroke="#9A5C72" stroke-width="1.5"/></svg>`;
ART.square = () => `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg"><path d="M14 30v80M106 30v80" stroke="#7A5A3A" stroke-width="5" stroke-linecap="round"/><path d="M14 34q46 26 92 0" stroke="#7A5A3A" stroke-width="2" fill="none"/>${[[24,40,"#E9A79E"],[38,47,"#E8C066"],[52,51,"#8EC3CF"],[66,51,"#B9A6DD"],[80,47,"#9DBF8E"],[94,40,"#E9A79E"]].map(([x,y,c])=>`<path d="M${x-6} ${y-4}h12l-6 13z" fill="${c}" stroke="#7A5A3A" stroke-width="1.4"/>`).join("")}<path d="M24 96l36-14 40 14-38 14z" fill="#F3E6C8" stroke="#B6A57A" stroke-width="2"/><path d="M36 92l40 12M48 87l40 12M42 102l34-12" stroke="#E9A79E" stroke-width="3" opacity=".7"/></svg>`;
ART.cave = () => `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg"><defs><radialGradient id="cg" cx=".5" cy=".7" r=".6"><stop offset="0" stop-color="#FFF2B0"/><stop offset=".55" stop-color="#E8C066" stop-opacity=".7"/><stop offset="1" stop-color="#3D3A4E"/></radialGradient></defs><path d="M6 110C6 60 26 22 60 22C94 22 114 60 114 110Z" fill="#A8A296" stroke="#5E5A4E" stroke-width="2.5"/><path d="M30 110C30 76 42 56 60 56C78 56 90 76 90 110Z" fill="url(#cg)" stroke="#5E5A4E" stroke-width="2.5"/><path d="M20 70c6-4 12-4 16 0M84 52c6-4 12-2 14 2" stroke="#7FA37A" stroke-width="4" fill="none" stroke-linecap="round"/><path d="M60 72l3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1z" fill="#FFF7D0"/></svg>`;
ART.apricot = (gold=false) => `<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><path d="M30 12C14 12 8 26 10 36C12 48 22 54 30 54C38 54 48 48 50 36C52 26 46 12 30 12Z" fill="${gold?"#F2C94C":"#F0A35E"}" stroke="${gold?"#B88F33":"#B8662E"}" stroke-width="2.4"/><path d="M30 14C26 24 26 40 30 52" stroke="${gold?"#D9A53A":"#D98848"}" stroke-width="2" fill="none"/><ellipse cx="20" cy="28" rx="5" ry="8" fill="#fff" opacity="${gold?.6:.35}"/><path d="M30 13C30 8 32 5 34 3" stroke="#7A5A3A" stroke-width="3" stroke-linecap="round"/><path d="M33 7C40 0 50 3 50 8C44 12 37 12 33 7Z" fill="#9DBF8E" stroke="#4E6A46" stroke-width="1.8"/>${gold?'<path d="M48 18l2 4 4 1-3 3 1 4-4-2-4 2 1-4-3-3 4-1z" fill="#FFF7D0"/>':""}</svg>`;
ART.slipper = () => `<svg viewBox="0 0 70 40" xmlns="http://www.w3.org/2000/svg"><path d="M6 24C6 14 16 10 30 12L58 16C66 18 66 30 58 32L20 34C10 34 6 30 6 24Z" fill="#5B7FB0" stroke="#34507A" stroke-width="2.4"/><path d="M26 13C30 22 40 24 48 16" stroke="#E9A79E" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M14 28h40" stroke="#34507A" stroke-width="1.5" opacity=".5"/></svg>`;
ART.basket = () => `<svg viewBox="0 0 120 60" xmlns="http://www.w3.org/2000/svg"><path d="M20 22C20 6 100 6 100 22" stroke="#7A5A3A" stroke-width="5" fill="none"/><path d="M6 22h108l-12 34H18z" fill="#D9B88A" stroke="#7A5A3A" stroke-width="3" stroke-linejoin="round"/><path d="M12 32h96M16 44h88M34 22l4 34M60 22v34M86 22l-4 34" stroke="#A07A50" stroke-width="2.4"/></svg>`;
ART.apricotTree = () => `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg"><path d="M54 112V70M54 86l-14-12M56 80l14-10" stroke="#7A5A3A" stroke-width="8" stroke-linecap="round"/><path d="M20 62C8 50 16 26 36 26C40 10 70 6 80 20C100 16 112 36 104 52C112 68 92 80 78 72C70 82 44 82 38 74C24 80 10 74 20 62Z" fill="#9DBF8E" stroke="#4E6A46" stroke-width="3"/>${[[34,42],[60,30],[86,44],[48,60],[76,62],[94,58]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="6" fill="#F0A35E" stroke="#B8662E" stroke-width="1.6"/>`).join("")}<circle cx="70" cy="46" r="6.5" fill="#F2C94C" stroke="#B88F33" stroke-width="1.6"/></svg>`;
ART.jokeBox = (open=false) => `<svg viewBox="0 0 160 130" xmlns="http://www.w3.org/2000/svg"><path d="M20 58h120v62H20z" fill="#C99B63" stroke="#7A5A3A" stroke-width="3.5"/><path d="M20 78h120M20 98h120" stroke="#7A5A3A" stroke-width="2" opacity=".45"/><rect x="68" y="66" width="24" height="18" rx="4" fill="#E8C066" stroke="#7A5A3A" stroke-width="2.5"/>${open?'<path d="M18 56L30 14h124l-14 42z" fill="#D9B88A" stroke="#7A5A3A" stroke-width="3.5" transform="rotate(-14 20 56)"/><g fill="#F2D27A"><circle cx="54" cy="44" r="4"/><circle cx="80" cy="30" r="5"/><circle cx="104" cy="42" r="3.5"/></g>':'<path d="M14 40h132v18H14z" fill="#D9B88A" stroke="#7A5A3A" stroke-width="3.5"/>'}</svg>`;
ART.mood = {
  happy:'<svg viewBox="0 0 50 50"><circle cx="25" cy="25" r="21" fill="#F2D27A" stroke="#B88F33" stroke-width="2"/><path d="M16 21q3-4 6 0M28 21q3-4 6 0" stroke="#5A3F26" stroke-width="2.4" fill="none" stroke-linecap="round"/><path d="M15 29q10 11 20 0z" fill="#8E4536"/></svg>',
  calm:'<svg viewBox="0 0 50 50"><circle cx="25" cy="25" r="21" fill="#BCD7B4" stroke="#4F7350" stroke-width="2"/><path d="M15 22q4 3 7 0M28 22q4 3 7 0" stroke="#2F3A28" stroke-width="2.4" fill="none" stroke-linecap="round"/><path d="M18 31q7 5 14 0" stroke="#2F3A28" stroke-width="2.4" fill="none" stroke-linecap="round"/></svg>',
  love:'<svg viewBox="0 0 50 50"><circle cx="25" cy="25" r="21" fill="#F3C1BA" stroke="#9A5C52" stroke-width="2"/><path d="M19 23c-4-3-6-6-3-8 2-1 3 1 3 2 0-1 1-3 3-2 3 2 1 5-3 8zM31 23c-4-3-6-6-3-8 2-1 3 1 3 2 0-1 1-3 3-2 3 2 1 5-3 8z" fill="#C8705F"/><path d="M18 31q7 6 14 0" stroke="#5A3F26" stroke-width="2.4" fill="none" stroke-linecap="round"/></svg>',
  sleepy:'<svg viewBox="0 0 50 50"><circle cx="25" cy="25" r="21" fill="#CFC5E8" stroke="#6B5596" stroke-width="2"/><path d="M15 23h7M28 23h7" stroke="#3D3450" stroke-width="2.4" stroke-linecap="round"/><ellipse cx="25" cy="33" rx="3" ry="4" fill="#3D3450"/><path d="M36 10h5l-5 5h5" stroke="#6B5596" stroke-width="1.8" fill="none"/></svg>',
  sad:'<svg viewBox="0 0 50 50"><circle cx="25" cy="25" r="21" fill="#BFDCE4" stroke="#4E8E9C" stroke-width="2"/><circle cx="18" cy="22" r="2.4" fill="#2F3A40"/><circle cx="32" cy="22" r="2.4" fill="#2F3A40"/><path d="M18 34q7-6 14 0" stroke="#2F3A40" stroke-width="2.4" fill="none" stroke-linecap="round"/><path d="M33 27q2 4 0 5q-2-1 0-5z" fill="#4E8E9C"/></svg>'
};
const MOOD_LABEL = {happy:"فرحانة", calm:"رايقة", love:"مشتاقة", sleepy:"نعسانة", sad:"زعلانة شوي"};

// sticker images (used in paint + diary)
const STICKERS = {
  leaf:{label:"ورقة", src:svgURL(ART.leaf())},
  flower:{label:"زهرة", src:svgURL(ART.flower())},
  star:{label:"نجمة", src:svgURL(ART.starB())},
  butterfly:{label:"فراشة", src:svgURL(ART.butterfly())},
  mushroom:{label:"فطر", src:svgURL(ART.mushroom())},
  heart:{label:"قلب", src:svgURL(ART.heart())}
};
const IMG = {};
function loadImg(key, src){ if(IMG[key]) return IMG[key]; const im = new Image(); im.decoding="async"; im.src = src; IMG[key]=im; return im; }
Object.entries(STICKERS).forEach(([k,v])=>loadImg("stk_"+k, v.src));

/* ============ sound (WebAudio, opt-in) ============ */
const Sound = (() => {
  let ctx=null, amb=null, chirpT=null;
  function ensure(){ if(!ctx){ try{ ctx = new (window.AudioContext||window.webkitAudioContext)(); }catch(e){ return null; } } if(ctx.state==="suspended") ctx.resume(); return ctx; }
  function tone(f1,f2,dur,type="sine",vol=.12,delay=0){ if(!prefs.sound) return; const c=ensure(); if(!c) return; const t=c.currentTime+delay; const o=c.createOscillator(), g=c.createGain(); o.type=type; o.frequency.setValueAtTime(f1,t); o.frequency.exponentialRampToValueAtTime(f2,t+dur); g.gain.setValueAtTime(0.0001,t); g.gain.exponentialRampToValueAtTime(vol,t+.02); g.gain.exponentialRampToValueAtTime(0.0001,t+dur); o.connect(g).connect(c.destination); o.start(t); o.stop(t+dur+.05); }
  function chirp(){ if(!prefs.sound) return; const b=2200+Math.random()*1400; tone(b,b*1.35,.09,"sine",.04); tone(b*1.1,b*.9,.08,"sine",.035,.12); if(Math.random()<.5) tone(b,b*1.4,.08,"sine",.03,.26); }
  function startAmb(){ const c=ensure(); if(!c||amb) return; const len=c.sampleRate*3, buf=c.createBuffer(1,len,c.sampleRate), d=buf.getChannelData(0); let last=0; for(let i=0;i<len;i++){ const w=Math.random()*2-1; last=(last+.02*w)/1.02; d[i]=last*3.2; } const src=c.createBufferSource(); src.buffer=buf; src.loop=true; const lp=c.createBiquadFilter(); lp.type="lowpass"; lp.frequency.value=520; const g=c.createGain(); g.gain.value=.05; const lfo=c.createOscillator(), lg=c.createGain(); lfo.frequency.value=.07; lg.gain.value=.03; lfo.connect(lg).connect(g.gain); src.connect(lp).connect(g).connect(c.destination); src.start(); lfo.start(); amb={src,lfo,g}; const loop=()=>{ chirp(); chirpT=setTimeout(loop, 4000+Math.random()*6000); }; chirpT=setTimeout(loop,1500); }
  function stopAmb(){ if(amb){ try{amb.src.stop(); amb.lfo.stop();}catch(e){} amb=null; } clearTimeout(chirpT); }
  return {
    set(on){ prefs.sound=on; Store.set("prefs",prefs); if(on) startAmb(); else stopAmb(); },
    pop(){ tone(520,1100,.12,"sine",.1); }, flip(){ tone(700,500,.08,"triangle",.06); },
    chime(){ tone(880,880,.25,"sine",.08); tone(1320,1320,.3,"sine",.06,.1); },
    win(){ [660,830,990,1320].forEach((f,i)=>tone(f,f,.3,"sine",.07,i*.12)); },
    bump(){ tone(180,90,.18,"triangle",.1); }, note(f){ tone(f,f*1.01,.28,"triangle",.09); }, soft(){ tone(400,600,.1,"sine",.05); }
  };
})();

/* ============ shared helpers (عالم أيلاف ولعبة خباب ويقين) ============ */
function react(el, cls){ if(!el) return; el.classList.remove(cls); void el.offsetWidth; el.classList.add(cls); setTimeout(()=>el.classList.remove(cls), 1100); }
function catmull(pts){ let d=`M${pts[0][0]} ${pts[0][1]}`; for(let i=0;i<pts.length-1;i++){ const p0=pts[i-1]||pts[i], p1=pts[i], p2=pts[i+1], p3=pts[i+2]||p2; const c1=[p1[0]+(p2[0]-p0[0])/6, p1[1]+(p2[1]-p0[1])/6], c2=[p2[0]-(p3[0]-p1[0])/6, p2[1]-(p3[1]-p1[1])/6]; d+=` C${c1[0].toFixed(2)} ${c1[1].toFixed(2)} ${c2[0].toFixed(2)} ${c2[1].toFixed(2)} ${p2[0]} ${p2[1]}`; } return d; }
const pick = a => a[Math.floor(Math.random()*a.length)];
function rateStars(n){ return `<span class="rate" aria-label="${n} من 3">${[1,2,3].map(i=>`<span class="${i<=n?"on":""}">${IC.star}</span>`).join("")}</span>`; }

/* ============ UI primitives ============ */
function toast(msg, icon="star"){ const t=h(`<div class="toast panel" role="status">${IC[icon]||""}<span>${esc(msg)}</span></div>`); document.body.appendChild(t); setTimeout(()=>t.remove(), 2700); }
function modal(inner, {wide=false, cls="", onClose}={}){
  const prevFocus = document.activeElement;
  const s = h(`<div class="scrim" role="dialog" aria-modal="true"><div class="modal panel ${wide?"wide":""} ${cls}"><button class="ibtn x" aria-label="إغلاق">${IC.close}</button></div></div>`);
  const m = $(".modal", s); m.insertAdjacentHTML("beforeend", inner);
  const close = () => { s.remove(); document.removeEventListener("keydown", onKey); onClose && onClose(); prevFocus && prevFocus.focus && prevFocus.focus(); };
  const onKey = e => { if(e.key==="Escape") close(); };
  $(".x", s).onclick = close; s.addEventListener("click", e=>{ if(e.target===s) close(); });
  document.addEventListener("keydown", onKey);
  document.body.appendChild(s);
  setTimeout(()=>{ const f=$("input,textarea,.btn", m)||$(".x",m); f && f.focus(); }, 30);
  return {el:m, close};
}
function confirmBox(text, yes="نعم", onYes){ const md = modal(`<h3>${esc(text)}</h3><div class="row"><button class="btn danger" data-y>${esc(yes)}</button><button class="btn ghost" data-n>تراجع</button></div>`); $("[data-y]",md.el).onclick=()=>{md.close(); onYes();}; $("[data-n]",md.el).onclick=md.close; }
function confetti(){ if(!motionOK()) return; const c=h('<div class="confetti"></div>'); const cols=["#9DBF8E","#E8C066","#B9A6DD","#E9A79E","#8EC3CF"]; for(let i=0;i<26;i++){ const sp=document.createElement("span"); sp.innerHTML=ART.leaf(cols[i%5]); sp.style.left=Math.random()*100+"%"; sp.style.animationDelay=(Math.random()*.6)+"s"; sp.style.animationDuration=(2+Math.random()*1.4)+"s"; c.appendChild(sp);} document.body.appendChild(c); setTimeout(()=>c.remove(),3800); }
async function offerDownload(filename, data, fallbackShow){
  try{
    const dl = window.claude && window.claude.use ? await window.claude.use("downloads") : null;
    if(dl){ try{ await dl.save({filename, data}); toast("تم الحفظ", "check"); return; }catch(e){ if(e && e.code==="declined"){ toast("ما انحفظ الملف", "close"); return; } } }
  }catch(e){}
  if(!window.claude){ try{ const blob = data instanceof Blob ? data : new Blob([data],{type:"application/json"}); const url=URL.createObjectURL(blob); const a=document.createElement("a"); a.href=url; a.download=filename; document.body.appendChild(a); a.click(); a.remove(); setTimeout(()=>URL.revokeObjectURL(url),4000); toast("تم الحفظ","check"); return; }catch(e){} }
  fallbackShow();
}

/* ============ stars, unlocks, progress ============ */
const progress = Object.assign({stars:0, wins:{}, best:{}, secrets:[], seenUnlocks:0}, Store.get("progress", {}));
function saveProgress(){ Store.set("progress", progress); }
const isUnlocked = key => CONFIG.unlocks.some(u => u.value===key && progress.stars>=u.at);
function addStars(n, why){
  const before = progress.stars; progress.stars += n; saveProgress(); renderStars(true);
  CONFIG.unlocks.forEach(u => { if(before<u.at && progress.stars>=u.at) setTimeout(()=>toast("انفتح: "+u.label, "lock"), 1200); });
  if(why) toast(`+${n} ${n===1?"نجمة":"نجوم"} — ${why}`);
}
function renderStars(b){ $("#starCount").textContent = progress.stars; if(b){ const p=$("#starPill"); p.classList.remove("bump"); void p.offsetWidth; p.classList.add("bump"); } }
function recordBest(id, value, better){ const cur = progress.best[id]; if(cur==null || better(value, cur)){ progress.best[id]=value; saveProgress(); return true; } return false; }

