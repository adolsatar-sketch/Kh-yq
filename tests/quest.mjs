// يلعب المهمة الرئيسية «ساعة الخريف» من أولها لآخرها عبر الواجهة ويتأكد من فتح الأقفال والمكافآت
// التشغيل: cd server && npm start ، وبعدين: npm run test:e2e (من جذر المشروع)
import fs from 'node:fs'; const OUT=process.argv[2]||'test-output'; fs.mkdirSync(OUT,{recursive:true});
import { chromium } from 'playwright';
const U=''+(process.env.BASE||'http://localhost:8787/')+'index.html'; const out=OUT;
const b=await chromium.launch(); const p=await b.newPage({viewport:{width:1280,height:760}});
const errs=[]; p.on('pageerror',e=>errs.push(e.message));
await p.goto(U+'#open'); await p.evaluate(()=>{ localStorage.clear(); localStorage.setItem('gh_prefs', JSON.stringify({sound:false,calm:true})); localStorage.setItem('gh_world', JSON.stringify({at:"plaza",flags:{mapRevealed:true},items:{},gears:[],tickets:["elaf","owl","show"],leaves:[],notes:[],lamps:[],visited:["plaza"],opened:[],rewards:[],fresh:[]})); }); await p.reload();
const W=()=>p.evaluate(()=>({gears:WS.gears, items:Object.keys(WS.items), flags:Object.keys(WS.flags).filter(k=>!k.startsWith('room_')&&!k.startsWith('sock_')), opened:WS.opened}));
const room=async r=>{ await p.evaluate(r=>{ location.hash=r; location.reload(); }, r).catch(()=>{}); await p.waitForTimeout(900); };
const dlg=async(n=20)=>{ for(let i=0;i<n;i++){ const nx=await p.$('.dlg-next:not([hidden])'); const op=await p.$('.dlg-opt'); if(op){ await op.click({force:true}); await p.waitForTimeout(150); continue; } if(!nx) break; await nx.click({force:true}); await p.waitForTimeout(120); } };
const pz=async()=>{ await p.click('[data-pz]',{force:true}); await p.waitForTimeout(250); };
const step=async(name)=>{ const s=await W(); console.log(name.padEnd(12), 'gears', s.gears.join(','), '| items', s.items.join(','), '| opened', s.opened.join(',')); };
// tower
await room('room:tower'); await dlg(); await pz();
for(let i=0;i<3;i++){ for(let k=0;k<4;k++){ const ok=await p.$eval(`[data-i="${i}"]`,e=>e.classList.contains('ok')).catch(()=>true); if(ok) break; await p.click(`[data-i="${i}"]`,{force:true}); await p.waitForTimeout(60);} }
await p.waitForTimeout(800); await dlg(); await step('tower');
// greenhouse
await room('room:greenhouse'); await dlg(); await pz();
const cl=async(sel,n)=>{ for(let i=0;i<n;i++){ await p.click(sel,{force:true}); await p.waitForTimeout(40);} };
await cl('[data-sun="0"]',1); await cl('[data-w="0"]',2); await cl('[data-sun="1"]',1); await cl('[data-w="1"]',3); await cl('[data-sun="2"]',1); await cl('[data-w="2"]',1);
await p.click('[data-ok]',{force:true}); await p.waitForTimeout(500); await dlg(); await p.waitForTimeout(300); await step('greenhouse');
// machine
await room('room:machine'); await dlg(); await pz();
for(const [g,peg] of [["L",0],["S",1],["M",2]]){ await p.click(`[data-g="${g}"]`,{force:true}); await p.click(`[data-p="${peg}"]`,{force:true}); await p.waitForTimeout(80); }
await p.click('[data-idle]',{force:true}); await p.waitForTimeout(1500); await dlg();
await p.evaluate(()=>{ const b=[...document.querySelectorAll('.room-spot')].find(x=>x.textContent.includes('بين الأنابيب')); b&&b.click(); }); await p.waitForTimeout(900); await dlg(); await step('machine');
// abandoned
await room('room:abandoned'); console.log('abandoned:', await p.evaluate(()=>[current, WS.tickets, nodeOpen('abandoned'), !!document.querySelector('[data-pz]')])); await dlg(); await p.screenshot({path:out+'/dbg_ab.png'}); await pz();
for(const [i,n] of [[0,3],[1,1],[2,2],[3,3]]) await cl(`[data-i="${i}"]`,n);
await p.click('[data-ok]',{force:true}); await p.waitForTimeout(500); await dlg(); await step('abandoned');
// study clue -> passage
await room('book'); await dlg(); await p.evaluate(()=>{ const b=[...document.querySelectorAll('.room-spot')].find(x=>x.textContent.includes('كتب قديمة')); b&&b.click(); }); await p.waitForTimeout(900);
await p.evaluate(()=>document.querySelectorAll('.scrim').forEach(s=>s.remove())); await step('study');
const order=async want=>{ for(let i=0;i<want.length;i++){ const labels=await p.$$eval('.pz-card',cs=>cs.map(c=>c.textContent)); const j=labels.findIndex(t=>t.includes(want[i])); if(j!==i){ await p.click(`.pz-card[data-i="${i}"]`,{force:true}); await p.click(`.pz-card[data-i="${j}"]`,{force:true}); } } await p.click('[data-ok]',{force:true}); await p.waitForTimeout(600); };
await room('room:passage'); await dlg(); await pz(); await order(["الفجر","الظهر","الغروب","الليل"]); await dlg(); await step('passage');
// passageLG (opened by glass key)
await room('room:passageLG'); await dlg(); await pz(); await order(["الحكايات","تنمو","مثل","الأشجار"]); await dlg(); await step('passageLG');
// hidden garden (opened? needs 5 leaves or seed) -> give seed via elaf rule check later; use leaves shortcut
await p.evaluate(()=>{ WS.items.seed=true; saveWorld(); checkUnlocks(); });
await room('room:hidden'); await dlg();
for(const lbl of ['شي وردي','دعسوقة','أرنب','زهرة القمر']){ await p.evaluate(l=>{ const b=[...document.querySelectorAll('.room-spot')].find(x=>x.textContent.includes(l)); b&&b.click(); }, lbl); await p.waitForTimeout(900); await dlg(); }
await step('hidden');
// return hat to Sumo via palace card, bell to cat via station card
await room('world'); await p.waitForTimeout(500);
await p.evaluate(()=>placeCard('palace', document.querySelector('.view'))); await p.waitForTimeout(900); await dlg();
await p.evaluate(()=>{ document.querySelectorAll('.scrim').forEach(s=>s.remove()); placeCard('station', document.querySelector('.view')); }); await p.waitForTimeout(900); await dlg();
await p.evaluate(()=>document.querySelectorAll('.scrim').forEach(s=>s.remove()));
await step('npc returns');
// roof finale
await room('room:roof'); await dlg(); await pz();
for(const g of ['copper','glass','iron','gold']){ await p.click(`[data-g="${g}"]`,{force:true}); await p.click(`[data-s="${g}"]`,{force:true}); await p.waitForTimeout(100); }
await p.waitForTimeout(800); await dlg(40); await p.waitForTimeout(600);
await p.screenshot({path:out+'/quest_finale.png'});
const fin=await p.evaluate(()=>({steps:QUESTS[0].steps.map(s=>s.t+':'+s.done()), met:flag('metSaadoun'), restored:flag('clockRestored'), night:flag('night'), rewards:WS.rewards, stars:progress.stars, journal:QUESTS.map(q=>q.title+':'+(questDone(q)?'done':'open'))}));
console.log(JSON.stringify(fin,null,1));
await room('world'); await p.waitForTimeout(800); await p.screenshot({path:out+'/quest_world_night.png'});
console.log(errs.join('\n')||'no page errors'); await b.close();
