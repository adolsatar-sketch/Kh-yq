// صاحبك يظهر على الخريطة بمكانه ويتحرك وياه بدون إعادة رسم
import { chromium } from 'playwright'; import fs from 'node:fs';
const U=process.env.BASE||'http://localhost:8787/'; const b=await chromium.launch(); const out=process.argv[2]||'test-output'; fs.mkdirSync(out,{recursive:true});
const mk=async(n)=>{ const c=await b.newContext({viewport:{width:1280,height:760}}); const p=await c.newPage(); p.on('pageerror',e=>console.log(n,'ERR',e.message)); await p.goto(U+'#open'); await p.evaluate(()=>localStorage.setItem('gh_world',JSON.stringify({flags:{mapRevealed:true}}))); return p; };
const A=await mk('A'), B=await mk('B');
await A.goto(U+'#lobby'); await A.reload(); await A.waitForTimeout(500); await A.click('[data-ch] button[data-c="k"]'); await A.click('[data-create]'); await A.waitForSelector('.lb-code b');
await B.goto(await A.evaluate(()=>Party.link())); await B.waitForTimeout(500); await B.click('[data-join]'); await B.waitForTimeout(1200);
await A.evaluate(()=>go('world')); await B.evaluate(()=>go('world')); await A.waitForTimeout(800);
await B.evaluate(()=>{ document.querySelector('[data-region="garden"]').click(); }); await B.waitForTimeout(2500);
console.log('A sees friend at:', await A.evaluate(()=>[Party.friendAt, !!document.querySelector('.wm-friend'), document.querySelector('.wm-friend b')?.textContent]));
await A.evaluate(()=>document.querySelectorAll('.scrim').forEach(s=>s.remove())); await A.screenshot({path:out+'/friendmap.png'}); await b.close();
