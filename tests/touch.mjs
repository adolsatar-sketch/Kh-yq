// لمس الهاتف (محاكاة Chromium لهاتف، مو Safari حقيقي): منع تحديد النص والقائمة عند الضغط المطوّل،
// منع التكبير بالنقر مرتين داخل مناطق اللعب، وبقاء التكبير بإصبعين والحقول قابلة للتحديد
import { chromium } from 'playwright';
const U=(process.env.BASE||'http://localhost:8787/')+'index.html';
const b=await chromium.launch();
const c=await b.newContext({viewport:{width:390,height:844}, isMobile:true, hasTouch:true, deviceScaleFactor:3, userAgent:'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1'});
const p=await c.newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message));
await p.goto(U+'#world'); await p.evaluate(()=>{ localStorage.setItem('gh_introSeen','true'); localStorage.setItem('gh_world',JSON.stringify({flags:{mapRevealed:true}})); }); await p.reload(); await p.waitForTimeout(900);
const style=sel=>p.evaluate(sel=>{ const e=document.querySelector(sel); if(!e) return null; const s=getComputedStyle(e); return {sel, userSelect:s.userSelect||s.webkitUserSelect, callout:s.webkitTouchCallout||'(n/a in chromium)', touchAction:s.touchAction, tap:s.webkitTapHighlightColor}; }, sel);
const rows=[];
for(const sel of ['.rnode','.rn-tag','#menuBtn','.topbar h1','.wm-kids .kidfig img','.wm-ui .btn']) rows.push(await style(sel));
await p.evaluate(()=>go('room:workshop')); await p.waitForTimeout(900);
for(const sel of ['.dlg','.dlg-text','.room-spot','.room-ui b','.room-npc']) rows.push(await style(sel));
await p.evaluate(()=>go('lobby')); await p.waitForTimeout(600); rows.push(await style('#nick'));
console.table(rows.filter(Boolean));
// القائمة عند الضغط المطوّل على الصور تنمنع
await p.evaluate(()=>go('world')); await p.waitForTimeout(700);
const ctx=await p.evaluate(()=>{ const img=document.querySelector('.wm-kids img'); const ev=new MouseEvent('contextmenu',{bubbles:true,cancelable:true}); img.dispatchEvent(ev); return ev.defaultPrevented; });
console.log('contextmenu on character image prevented:', ctx);
// نقرتين سريعتين على زر: ما يصير تكبير، والزر يشتغل
const vp0=await p.evaluate(()=>visualViewport.scale);
await p.tap('[data-region="garden"]'); await p.waitForTimeout(80); await p.tap('[data-region="garden"]'); await p.waitForTimeout(1500);
console.log('visual viewport scale after double tap:', vp0, '->', await p.evaluate(()=>visualViewport.scale));
console.log('viewport meta allows pinch zoom:', await p.evaluate(()=>!/user-scalable\s*=\s*no|maximum-scale\s*=\s*1(\D|$)/.test(document.querySelector('meta[name=viewport]').content)));
console.log('horizontal overflow on world:', await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1));
console.log(errs.join('\n')||'no page errors'); await b.close();
