// يلعب المهمة الرئيسية «ساعة الخريف» والمهمات الجانبية عبر الواجهة ويتأكد من الأقفال البديلة والمكافآت
// التشغيل: cd server && npm start ، وبعدين: npm run test:e2e (من جذر المشروع)
import fs from 'node:fs'; const OUT=process.argv[2]||'test-output'; fs.mkdirSync(OUT,{recursive:true});
import { chromium } from 'playwright';
const U=''+(process.env.BASE||'http://localhost:8787/')+'index.html'; const out=OUT;
const b=await chromium.launch(); const p=await b.newPage({viewport:{width:1280,height:760}});
const errs=[]; p.on('pageerror',e=>errs.push(e.message));
await p.goto(U+'#open'); await p.evaluate(()=>{ localStorage.clear(); localStorage.setItem('gh_prefs', JSON.stringify({sound:false,calm:true})); localStorage.setItem('gh_introSeen','true'); localStorage.setItem('gh_world', JSON.stringify({at:"hub",flags:{mapRevealed:true},items:{},gears:[],tickets:["owl","show"],leaves:[],notes:[],lamps:[],visited:["hub"],opened:[],rewards:[],fresh:[]})); }); await p.reload();
const W=()=>p.evaluate(()=>({gears:WS.gears, items:Object.keys(WS.items), tickets:WS.tickets, opened:WS.opened, rewards:WS.rewards}));
const room=async r=>{ await p.evaluate(r=>{ location.hash=r; location.reload(); }, r).catch(()=>{}); await p.waitForTimeout(900); };
const dlg=async(n=24)=>{ for(let i=0;i<n;i++){ const nx=await p.$('.dlg-next:not([hidden])'); const op=await p.$('.dlg-opt'); if(op){ await op.click({force:true}); await p.waitForTimeout(150); continue; } if(!nx) break; await nx.click({force:true}); await p.waitForTimeout(120); } };
const pz=async()=>{ await p.click('[data-pz]',{force:true}); await p.waitForTimeout(250); };
const spot=async lbl=>{ await p.evaluate(l=>{ const b=[...document.querySelectorAll('.room-spot')].find(x=>x.textContent.includes(l)); b&&b.click(); }, lbl); await p.waitForTimeout(900); };
const talk=async()=>{ await p.click('[data-talk]',{force:true}); await p.waitForTimeout(900); await dlg(); };
const cl=async(sel,n)=>{ for(let i=0;i<n;i++){ await p.click(sel,{force:true}); await p.waitForTimeout(40);} };
const order=async want=>{ for(let i=0;i<want.length;i++){ const labels=await p.$$eval('.pz-card',cs=>cs.map(c=>c.textContent)); const j=labels.findIndex(t=>t.includes(want[i])); if(j!==i){ await p.click(`.pz-card[data-i="${i}"]`,{force:true}); await p.click(`.pz-card[data-i="${j}"]`,{force:true}); } } await p.click('[data-ok]',{force:true}); await p.waitForTimeout(600); };
const step=async(name)=>{ const s=await W(); console.log(name.padEnd(12), 'gears', s.gears.join(','), '| items', s.items.join(','), '| tickets', s.tickets.join(','), '| opened', s.opened.join(',')); };
const locked=id=>p.evaluate(id=>!nodeOpen(id), id);

// الورشة: العم سعدون وتروس الورشة تفتح غرفة التروس
console.log('machine locked before workshop:', await locked('machine'));
await room('room:workshop'); await dlg(); await pz();
for(let i=0;i<3;i++){ for(let k=0;k<4;k++){ const ok=await p.$eval(`[data-i="${i}"]`,e=>e.classList.contains('ok')).catch(()=>true); if(ok) break; await p.click(`[data-i="${i}"]`,{force:true}); await p.waitForTimeout(60);} }
await p.waitForTimeout(800); await dlg(); await step('workshop');
// الدفيئة
await room('room:greenhouse'); await dlg(); await pz();
await cl('[data-sun="0"]',1); await cl('[data-w="0"]',2); await cl('[data-sun="1"]',1); await cl('[data-w="1"]',3); await cl('[data-sun="2"]',1); await cl('[data-w="2"]',1);
await p.click('[data-ok]',{force:true}); await p.waitForTimeout(500); await dlg(); await p.waitForTimeout(300); await step('greenhouse');
// غرفة التروس + جرس زعفرانة
await room('room:machine'); await dlg(); await pz();
for(const [g,peg] of [["L",0],["S",1],["M",2]]){ await p.click(`[data-g="${g}"]`,{force:true}); await p.click(`[data-p="${peg}"]`,{force:true}); await p.waitForTimeout(80); }
await p.click('[data-idle]',{force:true}); await p.waitForTimeout(1500); await dlg();
await spot('بين الأنابيب'); await dlg(); await step('machine');
// المحطة: نرجّع الجرس لزعفرانة → قطعة تذكرة
await room('room:station'); await dlg(); await talk(); await step('station');
// غرفة الفوانيس: نسجّل ترتيب سِراج ونعيده → فانوس
await room('room:lanternroom'); await dlg(); await pz();
const seq=[]; for(let t=0;t<60 && seq.length<5;t++){ const on=await p.$$eval('.lp.on',l=>l.map(x=>+x.dataset.l)); if(on.length===1 && seq[seq.length-1]!==on[0]) seq.push(on[0]); await p.waitForTimeout(120); }
await p.waitForTimeout(1000); for(const i of seq){ await p.click(`[data-l="${i}"]`,{force:true}); await p.waitForTimeout(80); }
await p.waitForTimeout(900); await dlg(); console.log('lantern sequence', seq.join(','), 'lampsLit', await p.evaluate(()=>flag('lampsLit')));
// الغابة: ترتيب ألوان الخريف → تذكرة، ونفق الأوراق ينفتح بالفانوس → قبعة شوكة
await room('room:forest'); await dlg(); await pz(); await order(["أخضر","أصفر","برتقالي","أحمر","بني"]); await dlg(); await step('forest');
console.log('leaftunnel open (lantern):', !(await locked('leaftunnel')));
await room('room:leaftunnel'); await dlg(); await spot('شي مدوّر'); await dlg();
await room('room:garden'); await dlg(); await talk(); console.log('cap returned', await p.evaluate(()=>[flag('capReturned'), hasReward('acc_acorn')]));
// الحديقة المخفية: مفتوحة بمفتاح السياج من الفوز بالمتاهة (قفل بديل)
console.log('hidden locked before maze:', await locked('hidden')); await p.evaluate(()=>onGameWin('maze')); console.log('hidden open after maze key:', !(await locked('hidden')));
await room('room:hidden'); await dlg();
for(const lbl of ['صندوق موسيقى','دعسوقة','أرنب','زهرة القمر']){ await spot(lbl); await dlg(); }
console.log('hidden found', await p.evaluate(()=>flag('hiddenFound')));
// الرصيف القديم (3 تذاكر)
console.log('abandoned open:', !(await locked('abandoned')));
await room('room:abandoned'); await dlg(); await pz();
for(const [i,n] of [[0,3],[1,1],[2,2],[3,3]]) await cl(`[data-i="${i}"]`,n);
await p.click('[data-ok]',{force:true}); await p.waitForTimeout(500); await dlg(); await step('abandoned');
// غرفة خباب ويقين: ترتيب الغرفة + الرسالة المطوية تفتح الممر خلف المكتبة
await room('book'); await dlg(); await pz();
for(const [g,pl] of [["book","shelf"],["brush","easel"],["letter","box"],["ball","chest"]]){ await p.click(`[data-g="${g}"]`,{force:true}); await p.click(`[data-p="${pl}"]`,{force:true}); await p.waitForTimeout(80); }
await p.waitForTimeout(700); await dlg();
await spot('كتب قديمة'); await p.evaluate(()=>document.querySelectorAll('.scrim').forEach(s=>s.remove())); console.log('roomTidy', await p.evaluate(()=>flag('roomTidy')), 'passage open', !(await locked('passage')));
await room('room:passage'); await dlg(); await pz(); await order(["الفجر","الظهر","الغروب","الليل"]); await dlg(); await step('passage');
await room('room:passageLG'); await dlg(); await pz(); await order(["الحكايات","تنمو","مثل","الأشجار"]); await dlg(); await step('passageLG');
// المرصد: النجوم من الأصغر للأكبر
await room('room:observatory'); await dlg(); await pz();
const stars=await p.$$eval('.st-b',bs=>bs.map(b=>[+b.dataset.st, parseFloat(b.querySelector('i').style.width)]).sort((a,c)=>a[1]-c[1]).map(x=>x[0]));
for(const i of stars){ await p.click(`[data-st="${i}"]`,{force:true}); await p.waitForTimeout(60); }
await p.waitForTimeout(900); await dlg(); console.log('starsLinked', await p.evaluate(()=>flag('starsLinked')));
// السطح والنهاية
console.log('roof open:', !(await locked('roof')));
await room('room:roof'); await dlg(); await pz();
for(const g of ['copper','glass','iron','gold']){ await p.click(`[data-g="${g}"]`,{force:true}); await p.click(`[data-s="${g}"]`,{force:true}); await p.waitForTimeout(100); }
await p.waitForTimeout(800); await dlg(40); await p.waitForTimeout(600);
await p.screenshot({path:out+'/quest_finale.png'});
const fin=await p.evaluate(()=>({steps:QUESTS[0].steps.map(s=>s.t+':'+s.done()), restored:flag('clockRestored'), night:flag('night'), rewards:WS.rewards, stars:progress.stars, journal:QUESTS.map(q=>q.title+':'+(questDone(q)?'done':'open'))}));
console.log(JSON.stringify(fin,null,1));
await room('world'); await p.waitForTimeout(800); await p.screenshot({path:out+'/quest_world_night.png'});
console.log(errs.join('\n')||'no page errors'); await b.close();
