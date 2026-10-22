// يزور كل المسارات على شاشة كمبيوتر وهاتف، يشغّل كل لعبة، ويطبع أي خطأ أو تمرير أفقي
// التشغيل: cd server && npm start ، وبعدين: npm run test:e2e (من جذر المشروع)
import fs from 'node:fs'; const OUT=process.argv[2]||'test-output'; fs.mkdirSync(OUT,{recursive:true});
// visits every route on desktop and phone, starts every duo game and Elaf game, reports errors
import { chromium } from 'playwright';
const U=''+(process.env.BASE||'http://localhost:8787/')+'index.html'; const out=OUT;
const b=await chromium.launch();
const routes=["open","world","meet","lobby","map","forestintro","jokes","cave","tales","tale:treehouse","tale:train","tale:colors","tale:lighthouse","tale:library","palace","show","book","diary","paint","paint:map","draw",
 "room:station","room:greenhouse","room:tower","room:library","room:balcony",
 ...["sling","bridge","maze","lanterns","library","orchestra","train","race","greenhouse"].map(g=>"play:"+g),
 ...["fireflies","basket","dance","madlibs","memory","story","road","logic","bubbles"].map(g=>"game:"+g)];
for(const [w,h] of [[1280,760],[390,844]]){
  const c=await b.newContext({viewport:{width:w,height:h}}); const p=await c.newPage();
  let errs=[]; p.on('pageerror',e=>errs.push(e.message)); p.on('console',m=>{ if(m.type()==='error' && !/fonts\.g|ERR_|net::/.test(m.text())) errs.push('console:'+m.text()); });
  await p.goto(U+'#open'); await p.waitForTimeout(400);
  await p.evaluate(()=>{ localStorage.setItem('gh_world', JSON.stringify({at:"plaza",flags:{mapRevealed:true},items:{},gears:[],tickets:[],leaves:[],notes:[],lamps:[],visited:["plaza"],opened:[],rewards:[],fresh:[]})); localStorage.setItem('gh_progress', JSON.stringify({stars:0,wins:{},best:{},secrets:[],once_runway1:true})); });
  const report=[];
  for(const r of routes){
    errs=[];
    await p.evaluate(r=>{ location.hash=r; location.reload(); }, r).catch(()=>{}); await p.waitForTimeout(1300);
    const cur=await p.evaluate(()=>current);
    // start duo games / elaf games when possible
    if(r.startsWith('play:')){ const go=await p.$('[data-go]'); if(go){ await go.click({force:true}); await p.waitForTimeout(700); } }
    if(r.startsWith('game:')){ const s=await p.$('.stage-ov:not([hidden]) .btn, [data-start], [data-go]'); if(s){ await s.click({force:true}).catch(()=>{}); await p.waitForTimeout(700); } }
    const overflow=await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth+2);
    if(w===390 && ['open','world','palace','book','tales','play:sling','game:memory','room:tower','lobby'].includes(r)) await p.screenshot({path:`${out}/sm_${r.replace(/[:]/g,'_')}_${w}.png`});
    report.push(`${r} -> ${cur}${overflow?' [H-OVERFLOW]':''}${errs.length?' ERR: '+errs.join(' | '):''}`);
  }
  console.log(`== ${w}x${h}\n`+report.filter(x=>x.includes('ERR')||x.includes('OVERFLOW')||!x.includes('-> '+x.split(' -> ')[0])).join('\n') || 'all ok');
  console.log(report.length,'routes visited');
  await c.close();
}
await b.close();
