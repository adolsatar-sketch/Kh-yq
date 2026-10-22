// متصفحين منفصلين: إنشاء غرفة، رمز غلط، رابط دعوة، جاهزية، لعبة متزامنة، دردشة، انقطاع ورجوع
// التشغيل: cd server && npm start ، وبعدين: npm run test:e2e (من جذر المشروع)
import fs from 'node:fs'; const OUT=process.argv[2]||'test-output'; fs.mkdirSync(OUT,{recursive:true});
import { chromium } from 'playwright';
const out=OUT; const U=process.env.BASE||'http://localhost:8787/';
const b = await chromium.launch();
const mk=async(name)=>{ const c=await b.newContext({viewport:{width:1100,height:760}}); const p=await c.newPage(); p.on('pageerror',e=>console.log(name,'PAGEERR',e.message)); p.on('console',m=>{ if(m.type()==='error') console.log(name,'console',m.text()); }); return {c,p}; };
const A=await mk('A'), B=await mk('B');
const log=(...a)=>console.log(...a);
await A.p.goto(U+'#lobby'); await A.p.waitForTimeout(700);
await A.p.fill('#nick','ورقة ذهبية'); await A.p.click('[data-ch] button[data-c="k"]');
await A.p.click('[data-create]'); await A.p.waitForSelector('.lb-code b');
const code=await A.p.textContent('.lb-code b'); log('room code', code, 'transport', await A.p.evaluate(()=>Party.transport));
// wrong code first
await B.p.goto(U+'#lobby'); await B.p.waitForTimeout(500); await B.p.fill('#nick','غيمة');
await B.p.fill('[data-code]','ZZZZZ'); await B.p.click('[data-join]'); await B.p.waitForTimeout(800);
log('wrong code error:', await B.p.textContent('[data-err]'));
// join via invite link
const link=await A.p.evaluate(()=>Party.link()); log('invite link', link);
await B.p.goto(link); await B.p.waitForTimeout(600); await B.p.click('[data-join]'); await B.p.waitForTimeout(1500);
log('A state', await A.p.evaluate(()=>[Party.state, Party.other&&Party.other.name, Party.other&&Party.other.char]), 'B state', await B.p.evaluate(()=>[Party.state, Party.other&&Party.other.name, Party.me.char]));
await A.p.click('[data-ready]'); await B.p.click('[data-ready]'); await A.p.waitForTimeout(600);
await A.p.screenshot({path:out+'/mp_lobby_A.png'});
await A.p.click('[data-g="maze"]'); await A.p.waitForTimeout(1200);
log('B route', await B.p.evaluate(()=>current));
await A.p.click('[data-go]'); await A.p.waitForTimeout(1200);
const grid=()=>A.p.evaluate(()=>document.querySelector('[data-g]')?.innerHTML.length+':'+[...document.querySelectorAll('.tm-tok')].map(t=>[...t.parentElement.parentElement.children].indexOf(t.parentElement)).join(','));
const before=await grid();
for(const k of ['ArrowRight','ArrowDown','ArrowLeft','ArrowUp','ArrowRight']) { await B.p.keyboard.press(k); await B.p.waitForTimeout(150); }
await A.p.waitForTimeout(600); const after=await grid(); log('A sees B moves:', before, '->', after, before!==after?'SYNC OK':'NO CHANGE');
// chat
await B.p.fill('[data-chat]','هلا من الجهاز الثاني'); await B.p.click('[data-send]'); await A.p.waitForTimeout(500);
log('A chat log:', await A.p.textContent('[data-log]'));
for(const k of ['ArrowLeft','ArrowLeft']) { await B.p.keyboard.press(k); await B.p.waitForTimeout(150); }
await A.p.waitForTimeout(600); const after2=await grid(); log('more moves:', after, '->', after2, after!==after2?'SYNC OK':'NO CHANGE');
await B.p.screenshot({path:out+'/mp_game_B.png'});
// B reloads page (same tab) -> resumes seat
await B.p.reload(); await B.p.waitForTimeout(3000);
log('after B reload:', await B.p.evaluate(()=>[Party.state, current, Party.code]), 'A:', await A.p.evaluate(()=>Party.state));
await B.p.goto('about:blank'); await A.p.waitForTimeout(1500);
log('A after B left tab:', await A.p.evaluate(()=>[Party.state, Party.peerAway, document.querySelector('#netBadge').textContent]));
await A.p.screenshot({path:out+'/mp_away_A.png'});
await B.p.goBack(); await B.p.waitForTimeout(3500);
log('B back:', await B.p.evaluate(()=>[Party.state, current]), 'A:', await A.p.evaluate(()=>[Party.state, Party.peerAway]));
// صاحب الغرفة يعيد تحميل الصفحة بنص الجولة
const beforeHost=await grid(); await A.p.reload(); await A.p.waitForTimeout(7000);
log('after host reload A:', await A.p.evaluate(()=>[Party.state, current, Party.transport]), 'B:', await B.p.evaluate(()=>Party.state));
const afterHost=await grid(); log('round kept after host reload:', beforeHost, '->', afterHost, beforeHost===afterHost?'SAME ROUND':'CHANGED');
await B.p.keyboard.press('ArrowRight'); await A.p.waitForTimeout(800); const afterHost2=await grid(); log('moves after host reload:', afterHost!==afterHost2?'SYNC OK':'NO CHANGE');
await b.close();
