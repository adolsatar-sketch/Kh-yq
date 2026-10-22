// حكاية مشتركة بين جهازين: الحوار يتقدم عند الاثنين، والاختيار بالتصويت
// التشغيل: cd server && npm start ، وبعدين: npm run test:e2e (من جذر المشروع)
import fs from 'node:fs'; const OUT=process.argv[2]||'test-output'; fs.mkdirSync(OUT,{recursive:true});
import { chromium } from 'playwright';
const U=process.env.BASE||'http://localhost:8787/'; const b=await chromium.launch(); const out=OUT;
const mk=async(n)=>{ const c=await b.newContext({viewport:{width:1100,height:760}}); const p=await c.newPage(); p.on('pageerror',e=>console.log(n,'ERR',e.message)); return p; };
const A=await mk('A'), B=await mk('B');
await A.goto(U+'#lobby'); await A.waitForTimeout(500); await A.click('[data-ch] button[data-c="k"]'); await A.click('[data-create]'); await A.waitForSelector('.lb-code b');
const link=await A.evaluate(()=>Party.link()); await B.goto(link); await B.waitForTimeout(500); await B.click('[data-join]'); await B.waitForTimeout(1200);
await A.click('[data-ready]'); await B.click('[data-ready]'); await A.waitForTimeout(500);
await A.click('[data-g="tales"]'); await A.waitForTimeout(600); await A.click('[data-t="lighthouse"]',{force:true}); await A.waitForTimeout(1800);
console.log('routes', await A.evaluate(()=>current), await B.evaluate(()=>current));
const nextOn=async(p)=>{ const n=await p.$('.dlg-next:not([hidden])'); if(n){ await n.click({force:true}); return true;} return false; };
// guest advances dialogue, host should follow
for(let i=0;i<3;i++){ await nextOn(B); await B.waitForTimeout(400); }
console.log('after guest next -> A task visible:', await A.evaluate(()=>!document.querySelector('[data-task]').hidden), 'B task visible:', await B.evaluate(()=>!document.querySelector('[data-task]').hidden));
// solve order puzzle on A by brute force is complex; jump: host triggers chapter 1 choice by evaluating to skip steps
// solve the boat-folding order puzzle on the guest (correct order known from data)
const want=["طوي الورقة نص","طوي الزوايا لجوّا","رفع الأطراف","فتح القارب"];
for(let i=0;i<4;i++){ const labels=await B.$$eval('.t-card',cs=>cs.map(c=>c.textContent)); const j=labels.findIndex(t=>t.includes(want[i])); if(j!==i){ await B.click(`.t-card[data-i="${i}"]`,{force:true}); await B.click(`.t-card[data-i="${j}"]`,{force:true}); } }
await B.click('[data-ok]',{force:true}); await B.waitForTimeout(900);
for(let i=0;i<3;i++){ await nextOn(A); await A.waitForTimeout(400); }
console.log('choice on both:', await A.$$eval('.tc-opt',x=>x.length), await B.$$eval('.tc-opt',x=>x.length));
await A.click('.tc-opt[data-o="0"]',{force:true}); await A.waitForTimeout(400);
console.log('A waiting text:', await A.evaluate(()=>document.querySelector('[data-task] .d-note')?.textContent));
await B.click('.tc-opt[data-o="1"]',{force:true}); await A.waitForTimeout(1200);
console.log('choices saved A:', await A.evaluate(()=>localStorage.getItem('gh_taleChoices')), 'B:', await B.evaluate(()=>localStorage.getItem('gh_taleChoices')));
await A.screenshot({path:out+'/mptale_A.png'}); await B.screenshot({path:out+'/mptale_B.png'});
await b.close();
