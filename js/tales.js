/* ============ حكاياتنا: playable tales ============ */
const SCN = {
  sky:(a="#F6C98B",b="#F3E6C8")=>`<defs><linearGradient id="sk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient></defs><rect width="1600" height="900" fill="url(#sk)"/>`,
  hills:(c1="#C98A4A",c2="#A86A38")=>`<path d="M0 640Q300 540 620 620T1240 600T1600 620V900H0Z" fill="${c1}"/><path d="M0 720Q400 640 820 720T1600 700V900H0Z" fill="${c2}"/>`,
  tree:(x=300)=>`<path d="M${x} 900V420" stroke="#5A3A24" stroke-width="70"/><path d="M${x} 560l-120-90M${x} 520l130-110" stroke="#5A3A24" stroke-width="30" stroke-linecap="round"/><circle cx="${x-120}" cy="380" r="150" fill="#C8552B"/><circle cx="${x+60}" cy="300" r="190" fill="#D9A53A"/><circle cx="${x+190}" cy="420" r="140" fill="#B33A26"/>`,
  house:(x=330,y=250)=>`<rect x="${x-80}" y="${y}" width="160" height="120" fill="#E7C99A" stroke="#5A3A24" stroke-width="8"/><path d="M${x-100} ${y}L${x} ${y-80}L${x+100} ${y}Z" fill="#7A2E2A" stroke="#5A3A24" stroke-width="8"/><rect x="${x-20}" y="${y+50}" width="40" height="70" fill="#5A3A24"/><rect x="${x+34}" y="${y+24}" width="30" height="30" fill="#FFD27A"/>`,
  clouds:()=>`<g fill="#FFF8EA" opacity=".9"><ellipse cx="1100" cy="180" rx="140" ry="50"/><ellipse cx="1180" cy="150" rx="90" ry="60"/><ellipse cx="500" cy="120" rx="110" ry="40"/></g>`,
  station:()=>`<rect x="200" y="380" width="1200" height="30" fill="#5A3A24"/><rect x="240" y="410" width="20" height="230" fill="#5A3A24"/><rect x="1340" y="410" width="20" height="230" fill="#5A3A24"/><path d="M160 380L800 250L1440 380Z" fill="#7A2E2A"/><circle cx="800" cy="330" r="46" fill="#F3E6C8" stroke="#3A2A1C" stroke-width="8"/><path d="M800 330V300M800 330L822 342" stroke="#3A2A1C" stroke-width="6"/><path d="M0 760H1600M0 800H1600" stroke="#3A2A1C" stroke-width="10"/>${Array.from({length:20},(_,i)=>`<rect x="${i*84}" y="752" width="20" height="56" fill="#6B4A2E"/>`).join("")}<g transform="translate(980 560)"><rect width="380" height="170" rx="20" fill="#2F5E57"/><rect x="20" y="20" width="70" height="60" fill="#FFD27A"/><rect x="110" y="20" width="70" height="60" fill="#FFD27A"/><rect x="200" y="20" width="70" height="60" fill="#FFD27A"/><circle cx="80" cy="180" r="34" fill="#3A2A1C"/><circle cx="300" cy="180" r="34" fill="#3A2A1C"/><rect x="290" y="-60" width="40" height="70" fill="#3A2A1C"/></g>`,
  city:(grey)=>`${[[120,420,200,300],[360,360,180,360],[580,440,220,280],[840,330,200,390],[1080,410,180,310],[1300,370,220,350]].map(([x,y,w,hh],i)=>`<rect x="${x}" y="${y}" width="${w}" height="${hh}" fill="${grey?"#A8A39A":["#E9A79E","#8EC3CF","#E8C066","#B9A6DD","#9DBF8E","#D9725F"][i]}" stroke="#4A4540" stroke-width="6"/>${[0,1].map(r=>[0,1].map(c=>`<rect x="${x+30+c*(w-90)}" y="${y+40+r*90}" width="40" height="50" fill="${grey?"#7D786F":"#FFF2C8"}"/>`).join("")).join("")}`).join("")}<path d="M0 720Q400 690 800 740T1600 720V900H0Z" fill="${grey?"#6E6A64":"#4E6A9C"}"/>`,
  sea:()=>`<rect y="560" width="1600" height="340" fill="#4E7FA0"/><path d="M0 600q50-20 100 0t100 0t100 0t100 0t100 0t100 0t100 0t100 0t100 0t100 0t100 0t100 0t100 0t100 0t100 0t100 0" stroke="#BFE0EC" stroke-width="6" fill="none"/><path d="M1240 560L1270 220H1350L1380 560Z" fill="#F3E6C8" stroke="#3A2A1C" stroke-width="8"/><path d="M1255 360h110M1262 460h96" stroke="#B5482A" stroke-width="40"/><rect x="1260" y="170" width="100" height="60" fill="#FFD27A" stroke="#3A2A1C" stroke-width="8"/><path d="M1250 170L1310 120L1370 170Z" fill="#7A2E2A"/>`,
  library:()=>`<rect width="1600" height="900" fill="#4A2E22"/>${[0,1,2,3].map(r=>`<rect x="80" y="${120+r*180}" width="1440" height="20" fill="#2B1A12"/>`+Array.from({length:30},(_,i)=>`<rect x="${90+i*47}" y="${40+r*180}" width="${36+((i*7)%10)}" height="${80+((i*13)%20)}" fill="${["#7A2E2A","#2F5E57","#D9A53A","#3E4A7A","#B5482A","#5B7F4A"][(i+r)%6]}" stroke="#1E120C" stroke-width="3"/>`).join("")).join("")}<rect y="780" width="1600" height="120" fill="#6B4A2E"/>`
};
const T_ICONS = {leaf:()=>ART.maple("#C8552B"), cloud:()=>ART.cloud(), star:()=>ART.starB(), key:()=>ART.key(), lantern:()=>ART.lantern(), ticket:()=>ART.ticket(), bird:()=>ART.paperBird(), gear:()=>ART.gear()};
const COLOR_DOT = c=>`<svg viewBox="0 0 40 40"><circle cx="20" cy="20" r="16" fill="${c}" stroke="#3A2A1C" stroke-width="3"/></svg>`;
const clockSVG = (hh,mm)=>{ const ha=(hh%12)*30+mm/2, ma=mm*6; return `<svg viewBox="0 0 80 80"><circle cx="40" cy="40" r="34" fill="#F3E6C8" stroke="#3A2A1C" stroke-width="4"/>${Array.from({length:12},(_,i)=>`<path d="M40 9v5" stroke="#3A2A1C" stroke-width="3" transform="rotate(${i*30} 40 40)"/>`).join("")}<path d="M40 40V22" stroke="#3A2A1C" stroke-width="5" stroke-linecap="round" transform="rotate(${ha} 40 40)"/><path d="M40 40V12" stroke="#B5482A" stroke-width="3" stroke-linecap="round" transform="rotate(${ma} 40 40)"/><circle cx="40" cy="40" r="3" fill="#3A2A1C"/></svg>`; };

/* لمسة لوحة مائية فوق مشاهد الحكايات: ضوء دافي، ضباب بعيد، حبيبات ورق، وإطار معتم بالأطراف */
SCN.finish = (sun="#FFE2A8") => `<defs><radialGradient id="tsun" cx=".72" cy=".2" r=".6"><stop offset="0" stop-color="${sun}" stop-opacity=".55"/><stop offset="1" stop-color="${sun}" stop-opacity="0"/></radialGradient><radialGradient id="tvig" cx=".5" cy=".5" r=".75"><stop offset=".6" stop-color="#2B1A10" stop-opacity="0"/><stop offset="1" stop-color="#2B1A10" stop-opacity=".45"/></radialGradient><linearGradient id="tmist" x1="0" y1="0" x2="0" y2="1"><stop offset=".45" stop-color="#FFF4DE" stop-opacity="0"/><stop offset=".7" stop-color="#FFF4DE" stop-opacity=".12"/><stop offset="1" stop-color="#FFF4DE" stop-opacity="0"/></linearGradient><filter id="tgrain"><feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="2" seed="4"/><feColorMatrix values="0 0 0 0 .4 0 0 0 0 .3 0 0 0 0 .15 0 0 0 .09 0"/></filter></defs><rect width="1600" height="900" fill="url(#tmist)"/><rect width="1600" height="900" fill="url(#tsun)"/><rect width="1600" height="900" filter="url(#tgrain)"/><rect width="1600" height="900" fill="url(#tvig)"/>`;
SCN.tree = (x=300) => `<path d="M${x} 900V430" stroke="#5A3A24" stroke-width="66" stroke-linecap="round"/><path d="M${x} 600l-120-90M${x} 540l130-110M${x-60} 560l-40-70" stroke="#5A3A24" stroke-width="26" stroke-linecap="round"/>${[[-130,380,150,"#B33A26"],[60,300,190,"#D9A53A"],[190,420,140,"#C8552B"],[-40,240,130,"#E08A2E"],[-190,470,110,"#8E3B22"],[130,200,110,"#E8B04A"]].map(([dx,y,r,c],i)=>`<circle cx="${x+dx}" cy="${y}" r="${r}" fill="${c}" opacity="${.88+i%2*.08}"/><circle cx="${x+dx-r*.3}" cy="${y-r*.3}" r="${r*.45}" fill="#FFE2A8" opacity=".18"/>`).join("")}`;
SCN.hills = (c1="#C98A4A",c2="#A86A38") => `<path d="M0 560Q260 470 560 540T1120 500T1600 540V900H0Z" fill="${c1}" opacity=".45"/><path d="M0 640Q300 540 620 620T1240 600T1600 620V900H0Z" fill="${c1}"/><path d="M0 720Q400 640 820 720T1600 700V900H0Z" fill="${c2}"/>${Array.from({length:14},(_,i)=>`<path d="M${60+i*115} ${760+(i%3)*30}q8-18 16 0" stroke="#7A4A22" stroke-width="5" fill="none" opacity=".5"/>`).join("")}`;
/* مشاهد إضافية للحكايات المتفرعة */
SCN.rocks = () => `<path d="M520 640l60-90 70 90zM760 660l50-120 80 120zM1000 650l40-70 60 70z" fill="#4A4A5A" stroke="#2E2E3A" stroke-width="6"/>`;
SCN.shells = () => `<path d="M0 800H1600V900H0Z" fill="#E9D3A8"/>`;
SCN.car = () => `<rect width="1600" height="900" fill="#5A3A24"/><rect x="120" y="120" width="1360" height="520" rx="30" fill="#7A5232" stroke="#3A2A1C" stroke-width="10"/>${[0,1,2].map(i=>`<rect x="${220+i*420}" y="200" width="320" height="200" rx="14" fill="#F6C98B" stroke="#3A2A1C" stroke-width="8"/>`).join("")}<rect y="700" width="1600" height="200" fill="#3A2A1C"/>${Array.from({length:6},(_,i)=>`<rect x="${180+i*220}" y="520" width="150" height="110" rx="10" fill="${["#B5482A","#2F5E57","#D9A53A"][i%3]}" stroke="#2B1A12" stroke-width="6"/>`).join("")}`;
SCN.river = c => `<path d="M0 820Q400 780 800 830T1600 810" stroke="${c}" stroke-width="80" fill="none"/>`;
SCN.bird = (x=900,y=260) => `<g transform="translate(${x} ${y}) scale(4)">${ART.paperBird().replace(/<\/?svg[^>]*>/g,"")}</g>`;
SCN.turtle = () => `<g transform="translate(1060 690)"><ellipse rx="120" ry="60" fill="#5B7F4A" stroke="#2E4A2A" stroke-width="8"/><path d="M-60 -30l30 -20 40 0 30 20M-60 30l30 20 40 0 30 -20" stroke="#2E4A2A" stroke-width="6" fill="none"/><circle cx="150" cy="-10" r="34" fill="#7FA374" stroke="#2E4A2A" stroke-width="8"/><circle cx="160" cy="-18" r="6" fill="#2F2A20"/></g>`;

/* =====================================================================
   حكاياتنا — خمس حكايات تنلعب، كل وحدة ثلاث فصول.
   بكل حكاية 3 نقاط اختيار: الاختيار الأول يحدد طريق الفصل الثاني (مسارين)،
   الثاني يغيّر الحوار والمشهد اللاحق، والثالث يحدد النهاية (نهايتين).
   الاختيارات تنحفظ وتنذكر بعدين بالحكايات الثانية وبكلام شخصيات العالم.
   الشخصيات المتكررة بين الحكايات: «رسول» الطير الورقي، سعدون الصغير، والغيمة الصغيرة.
   ===================================================================== */
const PAGE = () => `<svg viewBox="0 0 40 40"><path d="M6 4h22l6 6v26H6z" fill="#FFF7E6" stroke="#8C5A2B" stroke-width="2"/><path d="M11 14h18M11 20h18M11 26h12" stroke="#7A2E2A" stroke-width="2"/></svg>`;
const SCRAP = () => `<svg viewBox="0 0 40 40"><path d="M4 6h28l4 6-3 22H6z" fill="#F7EEDC" stroke="#8C5A2B" stroke-width="2"/><path d="M10 14h18M10 20h14M10 26h16" stroke="#B5482A" stroke-width="2"/></svg>`;
const SHELL = () => `<svg viewBox="0 0 40 40"><path d="M20 4C8 10 4 24 8 34h24c4-10 0-24-12-30z" fill="#FFE7D0" stroke="#C99A3C" stroke-width="2"/><path d="M20 6v28M12 12l4 22M28 12l-4 22" stroke="#C99A3C" stroke-width="1.6"/><circle cx="20" cy="22" r="14" fill="rgba(255,240,180,.35)"/></svg>`;
const taleChoices = () => Store.get("taleChoices", {});
const taleEnds = () => Store.get("taleEnds", {});
const TC = (id, k) => (taleChoices()[id]||{})[k];
const TALEBOOK = [
  {id:"treehouse", title:"البيت اللي فوق الشجرة", color:"#7A2E2A",
    endings:{a:"بيت لكل الطيور", b:"مكتب بريد الغيوم"},
    ending:F=>F.end==="post"?"b":"a",
    chapters:[
      {title:"الرسالة اللي تتحرك", scene:()=>SCN.sky()+SCN.clouds()+SCN.hills()+SCN.tree(320)+SCN.house(330,240), steps:F=>[
        {d:[["k",1,"يقين! شوفي، ورقة تطير وحدها فوق البيت!"],["y",2,"مو ورقة… رسالة ممزّقة. لازم نلگى قطعها الثلاث."]]},
        {p:"find", q:"دوّروا على 3 قطع من الرسالة بالمشهد", items:[[12,70],[63,30],[88,78]], art:SCRAP},
        {d:[["y",1,"جمّعتها! مكتوب: «اتبعوا الطريق، والرمز: ورقة، غيمة، نجمة، ورقة»."],["k",2,"بس شوفي… طير ورقي طار من ورا الرسالة، وورا الورقة مرسومة خريطة!"]]},
        {c:"path", who:"k", ask:"نتبع منو؟", opts:[{v:"bird", t:"نلحگ الطير الورقي", then:[["k",1,"يلا! الطير أسرع من أي خريطة."]]},{v:"map", t:"نمشي حسب الخريطة", then:[["y",1,"الخريطة ما تطير. خلّي نمشي على كيفنا."]]}]}
      ]},
      {title:F=>F.path==="map"?"الخريطة":"الطير الورقي", scene:F=>F.path==="map"?SCN.sky("#EBB57A")+SCN.clouds()+SCN.hills("#B87A44","#8E5A30")+SCN.tree(1250):SCN.sky("#F2C08A")+SCN.clouds()+SCN.hills()+SCN.bird(1000,240), steps:F=>F.path==="map"?[
        {d:[["k",0,"الخريطة بيها أماكن بس ما بيها ترتيب."],["y",2,"نرتبها حسب الطريق: نبدي من الشجرة."]]},
        {p:"order", q:"رتّبوا محطات الطريق من البداية للنهاية", items:[["الشجرة الكبيرة","leaf"],["النهر","cloud"],["التلة الذهبية","star"],["جسر الغيوم","bird"]]},
        {d:[["y",2,"شوف! يم النهر طير ورقي عالگ بغصن."],["bird",0,"(الطير يرفرف) آني رسول… أوصّل الرسائل بين الحكايات، بس جناحي انلزگ."]]},
        {c:"help", who:"y", ask:"شنو نسوي ويه رسول؟", opts:[{v:"keep", t:"ياخذه خباب بجيبه لحد ما يرتاح", then:[["k",1,"تعال يمي، جيبي دافي."]]},{v:"free", t:"نصلّح جناحه وخليه يكمّل شغله", then:[["y",1,"لزگنا جناحه بورقة شجر. طير يا رسول!"]]}]}
      ]:[
        {d:[["k",1,"الطير يطير فوگ الغيوم! لازم نساعده يوصل."],["y",0,"كل ما نضغط عليه ياخذ نفس ويكمّل."]]},
        {p:"tap", q:"اضغطوا على الطير الورقي حتى يوصل للجسر", n:8, art:()=>ART.paperBird()},
        {d:[["bird",0,"(الطير يتكلم!) شكراً… آني رسول، أوصّل الرسائل بين الحكايات. بس تعبت هواية."]]},
        {c:"help", who:"y", ask:"رسول تعبان. شنو نسوي؟", opts:[{v:"keep", t:"يرتاح بجيب خباب ويجي ويانا", then:[["k",1,"تعال يمي، جيبي دافي."]]},{v:"free", t:"نخليه يرتاح فوگ الغيمة ويكمّل شغله", then:[["y",1,"نام فوگ الغيمة… ورجع يطير مرتاح."]]}]}
      ]},
      {title:"جسر الغيوم", scene:()=>SCN.sky("#F2B07A","#FBE3C8")+`<path d="M200 520Q800 380 1400 520" stroke="#FFF8EA" stroke-width="60" fill="none" stroke-linecap="round"/>`+SCN.clouds(), steps:F=>[
        {d:[["y",0,"الجسر مقفول. بيه قفل رموز."],["k",2, F.help==="keep"?"رسول يهمس من جيبي: «تذكروا الرسالة»…":"الرمز اللي بالرسالة… شنو جان؟"]]},
        {p:"symbols", q:"ادخلوا الرمز اللي جان بالرسالة", seq:["leaf","cloud","star","leaf"], keys:["leaf","cloud","star","key"]},
        {d:[["k",1,"انفتح! والبيت فوگ الشجرة صار بيه شبّاك جديد."],["y",2,"بس البيت فاضي… شنو نسوي بيه؟"]]},
        {c:"end", who:"y", ask:"البيت اللي فوق الشجرة يصير…", opts:[{v:"birds", t:"بيت لكل الطيور اللي تتعب"},{v:"post", t:"مكتب بريد للرسائل بين الحكايات"}]},
        {d:F=>F.end==="post"?[["k",1,"صار مكتب بريد الغيوم! وكل رسالة تطير منه لحكاية ثانية."],["y",1,F.help==="keep"?"ورسول صار ساعي البريد الرسمي، ويسكن بجيب خباب بالعطل.":"ورسول رجع، صار مدير البريد وعنده قبعة صغيرة."]]:[["y",1,"صار بيت للطيور! كل طير تعبان يلگى هنا عش دافي."],["k",1,F.help==="keep"?"ورسول طلع من جيبي وسوّى أول عش.":"ورسول جاب ويّاه طيور ورقية من كل الحكايات."]]}
      ]}
    ]},
  {id:"train", title:"قطار الساعة اللي نسى الوقت", color:"#2F5E57",
    endings:{a:"رجعة على الوقت", b:"المحطة الجاية"},
    ending:F=>F.end==="next"?"b":"a",
    chapters:[
      {title:"تذاكر ممزقة", scene:()=>SCN.sky("#E9C9A0")+SCN.station(), steps:F=>[
        {d:[["y",2,"التذاكر كلها انشگت نصين!"],["k",1,"نجمع كل نص ويه نصه بالرقم."]]},
        {p:"match", q:"طابقوا كل نص تذكرة ويه نصه", pairs:[["١","1"],["٢","2"],["٣","3"],["٤","4"]]},
        {d:[["k",1,"التذاكر رجعت! بس القطار ما يتحرك."],["y",0,"الصافرة ساكتة… منين نبدي نسأل؟"]]},
        {c:"ask", who:"k", ask:"منو نسأل؟", opts:[{v:"driver", t:"سائق القطار الصغير", then:[["k",1,"السائق طلع ولد بعمرنا… اسمه سعدون!"]]},{v:"luggage", t:"نفتّش عربة الأمتعة", then:[["y",1,"بعربة الأمتعة أكو قطة نايمة فوگ صندوق موسيقى."]]}]}
      ]},
      {title:F=>F.ask==="luggage"?"صندوق الموسيقى":"صافرة سعدون", scene:F=>F.ask==="luggage"?SCN.car():SCN.sky("#D9B98A")+SCN.station(), steps:F=>F.ask==="luggage"?[
        {d:[["cat",0,"مياو… آني جدّة زعفرانة. صندوق الموسيقى يعرف لحن الصافرة بس أوراقه طايرة."]]},
        {p:"find", q:"لگوا 3 أوراق نوتة بين الحقائب", items:[[20,40],[56,64],[84,36]], art:PAGE},
        {p:"notes", q:"اسمعوا اللحن من الصندوق وعيدوه", seq:[1,3,2,0]},
        {c:"tune", who:"y", ask:"شلون نخلي لحن الصافرة؟", opts:[{v:"fast", t:"سريع ومرح"},{v:"calm", t:"هادي مثل التهويدة"}]}
      ]:[
        {d:[["saadoun",1,"(سعدون الصغير) آني أعرف لحن الصافرة! بس انسيت آخره."],["k",1,"عيدها وياك، آني أحفظ!"]]},
        {p:"notes", q:"اسمعوا اللحن وعيدوه بنفس الترتيب", seq:[0,2,1,3,2]},
        {d:[["saadoun",1,"صح! يوم أكبر راح أصير صانع ساعات."],["y",2,"…سعدون؟ مثل العم سعدون ببرج الساعة؟"]]},
        {c:"tune", who:"k", ask:"شلون نخلي لحن الصافرة؟", opts:[{v:"fast", t:"سريع ومرح"},{v:"calm", t:"هادي مثل التهويدة"}]}
      ]},
      {title:"الساعة المتوقفة", scene:F=>SCN.sky(F.tune==="calm"?"#B9A6DD":"#C9A07A")+SCN.station(), steps:F=>[
        {d:[["y",2,"مكتوب تحت الساعة: «القطار يطلع لما العقربين يتلاگون فوگ»."]]},
        {p:"choice", q:"وين نوگف عقارب الساعة؟", opts:[{h:clockSVG(12,0),ok:1},{h:clockSVG(6,30),r:"العقربين تحت مو فوگ"},{h:clockSVG(3,0),r:"العقرب الصغير على اليمين"}]},
        {d:[["k",1,F.tune==="calm"?"الصافرة تغني بهدوء… تووو… والقطار يمشي.":"تووووت! القطار تذكّر الوقت وصار يركض!"]]},
        {c:"end", who:"y", ask:"القطار وصل لمفترق طرق…", opts:[{v:"home", t:"نرجع للمحطة اللي بدينا منها"},{v:"next", t:"نكمل للمحطة الجاية المجهولة"}]},
        {d:F=>F.end==="next"?[["y",1,"المحطة الجاية… هاي قلعة الخريف! نفس اللي نعيش بيها!"],["k",1,F.ask==="driver"?"وسعدون الصغير گال: «يوم من الأيام راح أصلّح ساعة هاي القلعة»!":"وجدّة زعفرانة نزلت هنا وصارت حارسة المحطة."]]:[["k",1,"رجعنا على الوقت بالضبط! ولا دقيقة تأخير."],["y",1,F.ask==="driver"?"وسعدون نطانا تذكرة مكتوب عليها: «صالحة لكل الحكايات».":"والقطة نامت مرة ثانية فوگ صندوق الموسيقى."]]}
      ]}
    ]},
  {id:"colors", title:"مدينة الألوان اللي نامت", color:"#B5482A",
    endings:{a:"لوحة المدينة", b:"هدية "+CONFIG.heroName},
    ending:F=>F.end==="elaf"?"b":"a",
    chapters:[
      {title:"الألوان الضايعة", scene:()=>SCN.sky("#CFCAC0","#E6E2DA")+SCN.city(true), steps:F=>[
        {d:[["k",2,"ليش المدينة كلها رمادي؟"],["y",0,"الألوان نامت. نرجّع كل لون لمكانه."]]},
        {p:"match", q:"طابقوا كل شي ويه لونه", pairs:[["الشمس",COLOR_DOT("#E8C066")],["العشب",COLOR_DOT("#5B7F4A")],["البحر",COLOR_DOT("#3E6FA0")],["الفراولة",COLOR_DOT("#C8352B")]], html:true},
        {d:[["y",1,"أول بيت صحى! بس بعده نعسان."]]},
        {c:"warm", who:"y", ask:"نصحّي أي ألوان أول؟", opts:[{v:"warm", t:"الدافية: أحمر وبرتقالي وأصفر", then:[["k",1,"مثل الخريف!"]]},{v:"cool", t:"الباردة: أزرق وأخضر وبنفسجي", then:[["y",1,"مثل الصبح بالبحر."]]}]}
      ]},
      {title:"نهر الحبر", scene:F=>SCN.sky(F.warm==="cool"?"#C6D6DE":"#E6CDB0")+SCN.city(true)+SCN.river("#2B2B5A"), steps:F=>[
        {d:[["k",0,"نهر حبر! لازم نعبر على الحجار الملونة."],["y",2,F.warm==="cool"?"بالترتيب البارد: من البنفسجي للأحمر.":"بترتيب قوس قزح: من الأحمر للبنفسجي."]]},
        F.warm==="cool"
          ? {p:"symbols", q:"اعبروا الحجار من البنفسجي للأحمر", seq:["p","b","g","y","o","r"], keys:["g","r","p","y","b","o"], colors:{r:"#C8352B",o:"#E08A2E",y:"#E8C066",g:"#5B7F4A",b:"#3E6FA0",p:"#7A5AA0"}}
          : {p:"symbols", q:"اعبروا الحجار بترتيب قوس قزح (أحمر ← بنفسجي)", seq:["r","o","y","g","b","p"], keys:["g","r","p","y","b","o"], colors:{r:"#C8352B",o:"#E08A2E",y:"#E8C066",g:"#5B7F4A",b:"#3E6FA0",p:"#7A5AA0"}},
        {d:[["y",1,"عبرنا! والنهر يسألنا…"]]},
        {c:"river", who:"k", ask:"النهر يريد لون جديد بدل الحبر:", opts:[{v:"gold", t:"ذهبي مثل أوراق الخريف"},{v:"blue", t:"أزرق مثل سما الصيف"}]}
      ]},
      {title:"اللوحة الجماعية", scene:F=>SCN.sky()+SCN.city(false)+SCN.river(F.river==="blue"?"#3E6FA0":"#D9A53A"), steps:F=>[
        {d:[["y",2,`النهر صار ${F.river==="blue"?"أزرق":"ذهبي"}! بس المدينة تحتاج لوحة كبيرة حتى تصحى كلها.`],["k",1,"نرسمها سوا!"]]},
        {p:"draw", q:"ارسموا شي يصحّي المدينة — بيت، شمس، أي شي"},
        {c:"end", who:"y", ask:"وين نخلي اللوحة؟", opts:[{v:"wall", t:"على أكبر جدار بالمدينة"},{v:"elaf", t:"نهديها لـ"+heroName()+" لغابتها"}]},
        {d:F=>F.end==="elaf"?[["jm",1,`${heroName()} علّقتها بالمرسم مال الفطر! تگول ألوانكم صارت تضوي بالليل.`],["k",1,"حتى المدينة صارت تزور الغابة كل خميس."]]:[["k",1,"المدينة صحت كلها! والبيوت تصفّگ."],["y",1,`وكل ما يمر النهر ال${F.river==="blue"?"أزرق":"ذهبي"} يم اللوحة، يلمع.`]]}
      ]}
    ]},
  {id:"lighthouse", title:"منارة آخر غيمة", color:"#3E4A7A",
    endings:{a:"الغيمة رجعت لأهلها", b:"غيمة القلعة"},
    ending:F=>F.end==="stay"?"b":"a",
    chapters:[
      {title:"القارب الورقي", scene:()=>SCN.sky("#9FB7D0","#E6EEF2")+SCN.sea(), steps:F=>[
        {d:[["k",0,"المنارة بعيدة… نحتاج قارب."],["y",1,"نسوي قارب ورقي! بس لازم نطوي بالترتيب."]]},
        {p:"order", q:"رتّبوا خطوات طي القارب", items:[["طوي الورقة نص","ticket"],["طوي الزوايا لجوّا","leaf"],["رفع الأطراف","bird"],["فتح القارب","star"]]},
        {d:[["y",1,"القارب يطفو! بس أكو طريقين للمنارة."]]},
        {c:"route", who:"k", ask:"أي طريق نبحر منه؟", opts:[{v:"short", t:"القصير بين الصخور", then:[["k",1,"أسرع! بس انتبهوا للظلمة."]]},{v:"long", t:"الطويل الهادي على الساحل", then:[["y",1,"يمكن نلگى أشياء حلوة على الطريق."]]}]}
      ]},
      {title:F=>F.route==="long"?"الساحل المضيء":"مرايا الضوء", scene:F=>F.route==="long"?SCN.sky("#6E7EA8","#BFD0DE")+SCN.sea()+SCN.shells()+SCN.turtle():SCN.sky("#3E4A7A","#7A86A8")+SCN.sea()+SCN.rocks(), steps:F=>F.route==="long"?[
        {d:[["y",2,"صدف يضوي على الساحل! ويمه سلحفاة كبيرة."],["k",1,"السلحفاة تگول: الصدف يشغّل ضوء المنارة."]]},
        {p:"find", q:"اجمعوا 4 صدفات مضيئة", items:[[16,86],[38,92],[60,88],[86,93]], art:SHELL},
        {d:[["y",1,"المنارة ضوّت من الصدف! والغيمة الصغيرة طلعت تبچي من ورا المنارة."]]},
        {c:"comfort", who:"y", ask:"الغيمة الصغيرة خايفة. شنو نگولها؟", opts:[{v:"brave", t:"«إنتِ شجاعة، تگدرين»"},{v:"together", t:"«لا تخافين، إحنا وياج»"}]}
      ]:[
        {d:[["y",2,"ضوء المنارة طافي. المرايا مكسورة الاتجاه."],["k",1,"ندوّرها لحد ما الضوء يوصل!"]]},
        {p:"mirrors", q:"اضغطوا على كل مرآة حتى توجّه الضوء للمنارة", n:4},
        {d:[["k",1,"المنارة ضوّت! وشوفي… غيمة صغيرة تبچي فوگ الصخور."]]},
        {c:"comfort", who:"k", ask:"الغيمة الصغيرة خايفة. شنو نگولها؟", opts:[{v:"brave", t:"«إنتِ شجاعة، تگدرين»"},{v:"together", t:"«لا تخافين، إحنا وياج»"}]}
      ]},
      {title:"الغيمة الصغيرة", scene:()=>SCN.sky("#F6C98B")+SCN.clouds()+SCN.sea(), steps:F=>[
        {d:[["y",0,F.comfort==="brave"?"الغيمة مسحت دموعها وگالت: «آني شجاعة»!":"الغيمة لزمت إيدينا وابتسمت."],["k",1,"ننفخها لحد المنارة!"]]},
        {p:"tap", q:"اضغطوا على الغيمة حتى توصل للمنارة", n:10},
        {c:"end", who:"y", ask:"وصلنا المنارة. شنو تختار الغيمة؟", opts:[{v:"home", t:"ترجع لأهلها بالسما البعيدة"},{v:"stay", t:"تبقى ويانا وتصير غيمة القلعة"}]},
        {d:F=>F.end==="stay"?[["k",1,"صارت غيمة القلعة! تظلل علينا بالصيف وتمطر ورد بالخريف."],["jm",1,`و${heroName()} تگول شافتها بالغابة على شكل وسادة!`]]:[["y",1,"رجعت لأهلها، وصارت تمطر ورد صغير."],["k",1,F.route==="long"?"والسلحفاة لوّحتلنا من الساحل.":"وأحلى مطر بالعالم."]]}
      ]}
    ]},
  {id:"library", title:"مكتبة الحكايات الناقصة", color:"#5B7F4A",
    endings:{a:"الكتاب بالمكتبة", b:"الكتاب بدفترنا"},
    ending:F=>F.end==="book"?"b":"a",
    chapters:[
      {title:"كتب بلا نهايات", scene:()=>SCN.library(), steps:F=>[
        {d:[["y",2,"كل الكتب هنا نهاياتها ضايعة!"],["owl",0,"هوو… الصفحات الأخيرة مخبّاة بين الرفوف."]]},
        {p:"find", q:"دوّروا على 4 صفحات مخبّاة بين الرفوف", items:[[9,22],[71,42],[35,62],[90,82]], art:PAGE},
        {c:"shelf", who:"y", ask:"نبدي بأي رف؟", opts:[{v:"adv", t:"رف المغامرات"},{v:"mys", t:"رف الأسرار"}]}
      ]},
      {title:"جمع التفاصيل", scene:()=>SCN.library(), steps:F=>[
        {d:[["owl",0,F.shelf==="mys"?"رف الأسرار يسألكم عن تفاصيل صغيرة…":"رف المغامرات يسألكم عن رحلاتكم…"]]},
        ...memoryQuestions(F.shelf),
        {d:[["k",1,"المكتبة رجّعت كل الصفحات!"],["y",2,"بس بقى كتاب واحد… كتابنا. منو يكتب أول سطر؟"]]},
        {c:"writer", who:"owl", ask:"منو يكتب أول سطر بنهاية كتابكم؟", opts:[{v:"k", t:"خباب"},{v:"y", t:"يقين"}]}
      ]},
      {title:"نهايتنا", scene:()=>SCN.library(), steps:F=>[
        {d:[[F.writer==="k"?"k":"y",1,F.writer==="k"?"آني أبدي: «جان يا ما جان، ولدين يحبون المغامرة…»":"آني أبدي: «بقلعة الخريف، جان أكو سر صغير…»"]]},
        {p:"draw", q:"ارسموا نهاية الكتاب", write:"واكتبوا سطر النهاية"},
        {c:"end", who:"owl", ask:"وين يعيش كتابكم؟", opts:[{v:"shelf", t:"بالمكتبة حتى يقراه الكل"},{v:"book", t:"بدفترنا الخاص"}]},
        {d:F=>F.end==="book"?[["y",1,"انحفظت النهاية بدفترنا. نقراها كل ما نشتاق."],["owl",1,"وآني أحفظ نسخة صغيرة بقلبي."]]:[["owl",1,"صار بأحلى رف. وكل طفل يزور المكتبة يقرا نهايتكم."],["k",1,"والمكتبة صارت مكتملة!"]]}
      ]}
    ]}
];
NPCS.bird = {name:()=>"رسول", color:"#8C6A48", art:()=>ART.paperBird(), face:()=>ART.paperBird()};

/* أسئلة مكتبة الحكايات تتذكر شنو اخترتوا بالحكايات الثانية (ربط بين الحكايات) */
function memoryQuestions(shelf){
  const ends=taleEnds(), Q=[];
  const tb=TALEBOOK.find(t=>t.id==="treehouse"), tr=TALEBOOK.find(t=>t.id==="train");
  if(shelf==="adv"){
    if(TC("treehouse","end")) Q.push({p:"choice", q:"شنو صار البيت اللي فوق الشجرة بحكايتكم؟", opts:[{t:tb.endings.a, ok:TC("treehouse","end")!=="post", r:"لا… تذكروا شنو اخترتوا"},{t:tb.endings.b, ok:TC("treehouse","end")==="post", r:"لا… تذكروا شنو اخترتوا"},{t:"صار قصر",r:"هذا مو بحكايتنا"}]});
    else Q.push({p:"choice", q:"شنو جان رمز جسر الغيوم؟", opts:[{t:"ورقة، غيمة، نجمة، ورقة",ok:1},{t:"نجمة، ورقة، غيمة",r:"قريبة… بس الترتيب غلط"},{t:"مفتاح، نجمة، فانوس",r:"لا، هذا مو رمزنا"}]});
    if(TC("train","ask")) Q.push({p:"choice", q:"منو ساعدكم بقطار الساعة؟", opts:[{t:"سعدون الصغير", ok:TC("train","ask")==="driver", r:"مو هو… تذكروا"},{t:"جدّة زعفرانة", ok:TC("train","ask")==="luggage", r:"مو هي… تذكروا"},{t:"سومو",r:"سومو جان بالغابة!"}]});
    else Q.push({p:"choice", q:"متى يطلع قطار الساعة؟", opts:[{t:"الساعة 6:30",r:"لا، العقربين جانوا تحت"},{t:"الساعة 12 بالضبط",ok:1},{t:"الساعة 3",r:"مو هيچ"}]});
  } else {
    Q.push({p:"choice", q:"شنو اسم قطة محطة القطار بقلعة الخريف؟", opts:[{t:"زعفرانة",ok:1},{t:"نرجس",r:"نرجس هي البستانية"},{t:"رسول",r:"رسول طير ورقي"}]});
    if(TC("lighthouse","end")) Q.push({p:"choice", q:"وين صارت الغيمة الصغيرة بحكايتكم؟", opts:[{t:"رجعت لأهلها", ok:TC("lighthouse","end")!=="stay", r:"تذكروا اختياركم"},{t:"صارت غيمة القلعة", ok:TC("lighthouse","end")==="stay", r:"تذكروا اختياركم"},{t:"صارت مطر بالبحر",r:"لا"}]});
    else Q.push({p:"choice", q:`شنو اسم رفيق ${heroName()} بالغابة؟`, opts:[{t:CONFIG.companionName,ok:1},{t:CONFIG.guestName,r:CONFIG.guestName+" ضيف الغابة"},{t:"سعدون",r:"سعدون صانع الساعات"}]});
  }
  return Q;
}
const chTitle = (C,F) => typeof C.title==="function" ? C.title(F) : C.title;
function taleProg(){ return Store.get("tales",{}); }
function taleJournalHTML(){
  const pr=taleProg(), ends=taleEnds();
  return `<p class="d-note">كل حكاية إلها نهايتين. ارجعوا لأي فصل مفتوح وجرّبوا الخيار الثاني بدون ما يضيع تقدّمكم.</p><div class="j-tales">${TALEBOOK.map(t=>{ const ch=taleChoices()[t.id]||{}; const n=Object.keys(ch).length; return `<div class="j-tale"><span class="jt-c" style="background:${t.color}"></span><div><b>${esc(t.title)}</b><p>الفصول: ${Math.min(pr[t.id]||0,3)} من 3 · خيارات: ${n}</p></div><span class="j-ends">${Object.entries(t.endings).map(([k,e])=>`<i class="${(ends[t.id]||[]).includes(k)?"on":""}">${esc((ends[t.id]||[]).includes(k)?e:"نهاية مخفية")}</i>`).join("")}</span></div>`; }).join("")}</div>`;
}
function viewTales(root){
  const pr=taleProg(), ends=taleEnds();
  const v=h(`<section class="view tales"><div class="tl-wrap"><h2 class="w-title">حكاياتنا</h2><p class="w-sub">اختاروا كتاب. كل حكاية ثلاث فصول، وبيها اختيارات تغيّر الطريق والنهاية. التقدّم ينحفظ.</p>
    <div class="shelf">${TALEBOOK.map(t=>{ const done=pr[t.id]||0, e=ends[t.id]||[]; return `<button class="tbook" data-t="${t.id}" style="--bc:${t.color}"><span class="tb-cover"><span class="tb-title">${esc(t.title)}</span><span class="tb-prog">${[0,1,2].map(i=>`<i class="${i<done?"on":""}"></i>`).join("")}</span><span class="tb-ends">${["a","b"].map(k=>`<i class="${e.includes(k)?"on":""}" title="نهاية"></i>`).join("")}</span></span></button>`; }).join("")}</div>
    <div class="tl-kids">${kidFigure("k")}${npcHTML("owl")}${kidFigure("y")}</div>
    <div class="row" style="justify-content:center"><button class="btn ghost" data-ends>${IC.quest} سجل النهايات</button>${Party.connected()&&Party.isHost?`<span class="chip">متصلين: اختاروا كتاب وتلعبونه سوا</span>`:""}</div></div>${leafLayer(6,"soft")}</section>`);
  root.appendChild(v);
  $("[data-ends]",v).onclick=()=>openJournal("tales");
  $$("[data-t]",v).forEach(b=>b.onclick=()=>{ const go2=()=>{ if(Party.connected()){ if(!Party.isHost){ toast("صاحب الغرفة يختار الحكاية","bulb"); return; } Party.game="tale:"+b.dataset.t; Party.send({t:"start", game:"tale:"+b.dataset.t}); } go("tale:"+b.dataset.t); }; if(motionOK()){ b.classList.add("opening"); Sound.flip(); setTimeout(go2,700); } else go2(); });
}

/* ---------- محرك الحكاية ---------- */
function viewTale(root, id){
  const T=TALEBOOK.find(t=>t.id===id); if(!T){ go("tales"); return; }
  const net = Party.connected() && Party.game==="tale:"+id;
  const pr=taleProg(); let ch=Math.min(pr[id]||0, 2);
  const F=Object.assign({}, taleChoices()[id]||{});
  const v=h(`<section class="view tale"><div class="tale-scene"><svg class="tale-bg" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" data-bg></svg><div class="tale-props" data-props></div><div class="tale-kids">${kidFigure("k")}${kidFigure("y")}</div>${leafLayer(5,"soft")}</div>
    <div class="tale-ui"><div class="tale-chs" data-chs></div>${net?`<span class="chip tale-net">${IC.friends} حكاية مشتركة ويه ${esc(Party.other?Party.other.name:"صديق")}</span>`:""}<div class="tale-task panel" data-task hidden></div></div></section>`);
  root.appendChild(v);
  const task=$("[data-task]",v), props=$("[data-props]",v), kids=$$(".tale-kids .kidfig",v);
  let dlgRef=null, steps=[], si=0, token=0;
  const saveChoice=(k,val)=>{ F[k]=val; const all=taleChoices(); all[id]=Object.assign(all[id]||{}, {[k]:val}); Store.set("taleChoices", all); };
  function drawChs(){ const p=taleProg(); $("[data-chs]",v).innerHTML=T.chapters.map((c,i)=>`<button class="chip" data-ch="${i}" aria-pressed="${i===ch}" ${i>(p[id]||0)?"disabled":""}>${i+1}. ${esc(chTitle(c,F))}</button>`).join("");
    $$("[data-ch]",v).forEach(b=>b.onclick=()=>{ if(net && !Party.isHost){ toast("صاحب الغرفة يختار الفصل","bulb"); return; } jump(+b.dataset.ch, 0, true); }); }
  function clear(){ if(dlgRef){ dlgRef.close(); dlgRef=null; } task.hidden=true; task.innerHTML=""; props.innerHTML=""; token++; }
  function jump(i, s=0, announce=false){
    clear(); ch=i; const C=T.chapters[i]; $("[data-bg]",v).innerHTML=(typeof C.scene==="function"?C.scene(F):C.scene)+SCN.finish(id==="lighthouse"?"#E6F0FF":id==="library"?"#FFD9A0":"#FFE2A8"); steps=C.steps(F); si=s; drawChs();
    if(s===0) kids.forEach((k,j)=>kidAct(k, j?"walk":"run"));
    if(announce && net) Party.send({t:"tstep", ch:i, s, F});
    run();
  }
  function advance(){ si++; if(net) Party.send({t:"tstep", ch, s:si, F}); run(); }
  function run(){
    if(si>=steps.length){ done(); return; }
    const st=steps[si], my=++token;
    if(st.d){ const lines=typeof st.d==="function"?st.d(F):st.d; dlgRef=dialogue(v, lines, ()=>{ dlgRef=null; if(my===token) advance(); }); }
    else if(st.c) choiceStep(st, my);
    else talePuzzle(st, {T, v, task, props, kids}, ()=>{ if(my===token){ Sound.chime(); kids.forEach(k=>kidAct(k,"happy")); task.hidden=true; props.innerHTML=""; setTimeout(()=>{ if(my===token) advance(); }, 400); } });
  }
  // نقطة اختيار: بالحكاية المشتركة الاثنين يصوّتون، وإذا اختلفوا القرار بالدور (خباب، يقين…)
  const votes={};
  function choiceStep(st, my){
    const who=st.who||"y";
    const draw=(wait)=>{ task.hidden=false; task.innerHTML=`<div class="tc-head">${speakerFace(who,2,56)}<div><b style="color:${speakerColor(who)}">${esc(speakerName(who))}</b><h3>${esc(st.ask)}</h3></div></div><div class="tc-opts">${st.opts.map((o,i)=>`<button class="btn ${F[st.c]===o.v?"honey":"ghost"} tc-opt" data-o="${i}" ${wait?"disabled":""}><span class="dlg-k">${i+1}</span>${esc(o.t)}</button>`).join("")}</div>${F[st.c]&&!wait?`<p class="d-note">اخترتوا قبل: «${esc((st.opts.find(o=>o.v===F[st.c])||{}).t||"")}». تقدرون تغيّرون.</p>`:""}${wait?`<p class="d-note">${esc(wait)}</p>`:""}`;
      $$(".tc-opt",task).forEach(b=>b.onclick=()=>pickOpt(+b.dataset.o)); };
    const resolve=k=>{ const o=st.opts[k]; saveChoice(st.c, o.v); Sound.chime(); task.hidden=true; const fig=kids[who==="k"?0:1]; if(fig) kidAct(fig,"happy");
      if(o.then){ dlgRef=dialogue(v, o.then, ()=>{ dlgRef=null; if(my===token) advance(); }); } else advance(); };
    const pickOpt=k=>{
      if(!net){ resolve(k); return; }
      const me=Party.me.char; votes[me]=k; Party.send({t:"tvote", key:st.c, ch, s:si, k}); tryResolve();
    };
    const tryResolve=()=>{ const mine=votes[Party.me.char], theirs=votes[Party.me.char==="k"?"y":"k"];
      if(mine==null){ draw(); return; }
      if(theirs==null){ draw("بانتظار اختيار صاحبك…"); return; }
      if(!Party.isHost){ draw("ننتظر القرار…"); return; }
      let k=mine; if(mine!==theirs){ const turn=(Object.keys(F).length%2===0)?"k":"y"; k=votes[turn]; toast(`اختلفتوا! هالمرة القرار لـ${CH[turn].name}`,"bulb"); }
      delete votes.k; delete votes.y; Party.send({t:"tpick", ch, s:si, k}); resolve(k); };
    choiceStep.vote=(m)=>{ if(m.ch!==ch || m.s!==si) return; votes[Party.me.char==="k"?"y":"k"]=m.k; tryResolve(); };
    choiceStep.pick=(m)=>{ if(m.ch!==ch || m.s!==si) return; delete votes.k; delete votes.y; resolve(m.k); };
    draw();
  }
  function done(){
    clear();
    const p=taleProg(); p[id]=Math.max(p[id]||0, ch+1); Store.set("tales",p); drawChs();
    kids.forEach(k=>kidAct(k,"happy")); confetti(); Sound.win();
    const last = ch>=2;
    let endTxt="";
    if(last){ const e=T.ending(F), all=taleEnds(); const list=new Set(all[id]||[]); const isNew=!list.has(e); list.add(e); all[id]=[...list]; Store.set("taleEnds", all); endTxt=`النهاية: «${T.endings[e]}»${isNew?" — نهاية جديدة!":""}${list.size<2?" · أكو نهاية ثانية مخفية، جرّبوا خيار مختلف.":" · لگيتوا النهايتين!"}`; addStarsOnce("tale_"+id, 3, "خلّصتوا «"+T.title+"»"); if(isNew && list.size===2) addStars(2, "النهايتين"); if(typeof checkUnlocks==="function") checkUnlocks(); }
    else addStarsOnce("tale_"+id+"_"+ch,1,"فصل جديد");
    if(last && F.end==="book" && id==="library"){ const entries=loadDiary(); entries.push({id:"d"+Date.now().toString(36), date:new Date().toISOString().slice(0,10), title:"نهاية: "+T.title, text:"كتابنا: "+(T.endings.b), mood:"love", sticker:"star", created:Date.now()}); Store.set("diary",entries); }
    const md=modal(`<div class="tour-body"><div class="win-kids">${faceHTML("k",1,60)}${faceHTML("y",1,60)}</div><div><h2>${last?"انتهت الحكاية!":"خلص الفصل "+(ch+1)}</h2><p style="margin:0">${esc(last?endTxt:"الفصل الجاي: "+chTitle(T.chapters[ch+1],F))}</p></div></div><div class="row">${last?`<button class="btn honey" data-shelf>رجوع للمكتبة</button><button class="btn ghost" data-retry>جرّبوا اختيار ثاني</button>`:`<button class="btn honey" data-next>الفصل الجاي</button>`}<button class="btn ghost" data-stay>ابقوا هنا</button></div>`);
    const n=$("[data-next]",md.el); if(n) n.onclick=()=>{ md.close(); if(net && !Party.isHost) return; jump(ch+1,0,true); };
    const sh=$("[data-shelf]",md.el); if(sh) sh.onclick=()=>{ md.close(); go("tales"); };
    const rt=$("[data-retry]",md.el); if(rt) rt.onclick=()=>{ md.close(); if(net && !Party.isHost) return; jump(0,0,true); };
    $("[data-stay]",md.el).onclick=md.close;
  }
  const offs=[];
  if(net){
    offs.push(Party.on("tstep", m=>{ Object.assign(F, m.F||{}); const all=taleChoices(); all[id]=Object.assign(all[id]||{}, F); Store.set("taleChoices", all); if(m.ch!==ch){ jump(m.ch, m.s); return; } if(m.s!==si){ clear(); si=m.s; run(); } }));
    offs.push(Party.on("tvote", m=>{ if(choiceStep.vote) choiceStep.vote(m); }));
    offs.push(Party.on("tpick", m=>{ if(choiceStep.pick) choiceStep.pick(m); }));
    if(!Party.isHost) Party.send({t:"tsync"}); else offs.push(Party.on("tsync", ()=>Party.send({t:"tstep", ch, s:si, F})));
  }
  jump(ch, 0, Party.isHost);
  return ()=>{ clear(); offs.forEach(f=>f()); choiceStep.vote=choiceStep.pick=null; };
}

/* ---------- ألغاز الحكايات ---------- */
function talePuzzle(st, {T, v, task, props, kids}, solved){
  const q=`<h3>${esc(st.q)}</h3>`;
  const showTask=html=>{ task.hidden=false; task.innerHTML=html; };
  if(st.p==="find"){
    let got=0; showTask(q+`<p class="d-note" data-c>0 من ${st.items.length}</p>`);
    props.innerHTML = st.items.map(([x,y],i)=>`<button class="tprop" data-i="${i}" style="left:${x}%;top:${y}%" aria-label="شي مخفي">${st.art()}</button>`).join("");
    $$(".tprop",props).forEach(b=>b.onclick=()=>{ b.classList.add("got"); b.disabled=true; got++; $("[data-c]",task).textContent=`${got} من ${st.items.length}`; Sound.pop(); if(got===st.items.length) solved(); });
  }
  else if(st.p==="order"){
    let ord=shuffle(st.items.map((_,i)=>i)); while(ord.every((x,i)=>x===i)) ord=shuffle(ord); let sel=null;
    const draw=()=>{ showTask(q+`<div class="t-order">${ord.map((k,i)=>`<button class="t-card ${sel===i?"sel":""}" data-i="${i}"><span class="t-n">${i+1}</span><span class="t-ic">${T_ICONS[st.items[k][1]]()}</span>${esc(st.items[k][0])}</button>`).join("")}</div><div class="row"><button class="btn honey" data-ok>${IC.check} تحقّقوا</button></div><p class="d-note">اضغطوا بطاقتين حتى تبدّلون مكانهم.</p>`);
      $$(".t-card",task).forEach(b=>b.onclick=()=>{ const i=+b.dataset.i; if(sel==null){ sel=i; } else { [ord[sel],ord[i]]=[ord[i],ord[sel]]; sel=null; Sound.flip(); } draw(); });
      $("[data-ok]",task).onclick=()=>{ if(ord.every((x,i)=>x===i)) solved(); else { Sound.bump(); kidAct(kids[1],"surprise"); toast("مو هيچ الترتيب… جرّبوا مرة ثانية","bulb"); } }; };
    draw();
  }
  else if(st.p==="symbols"){
    let entered=[]; const ic = k => st.colors ? COLOR_DOT(st.colors[k]) : T_ICONS[k]();
    const draw=()=>{ showTask(q+`<div class="t-slots">${st.seq.map((_,i)=>`<span class="t-slot">${entered[i]?ic(entered[i]):""}</span>`).join("")}</div><div class="t-keys">${st.keys.map(k=>`<button class="t-key" data-k="${k}">${ic(k)}</button>`).join("")}</div><div class="row"><button class="btn ghost small" data-clr>امسحوا</button></div>`);
      $$(".t-key",task).forEach(b=>b.onclick=()=>{ entered.push(b.dataset.k); Sound.pop(); if(entered.length===st.seq.length){ if(entered.every((k,i)=>k===st.seq[i])){ draw(); setTimeout(solved,300); return; } Sound.bump(); kidAct(kids[0],"surprise"); toast("الرمز غلط. "+(st.colors?"تذكّروا الترتيب":"تذكّروا الرسالة"),"bulb"); entered=[]; } draw(); });
      $("[data-clr]",task).onclick=()=>{ entered=[]; draw(); }; };
    draw();
  }
  else if(st.p==="match"){
    let left=null, done2=new Set(); const rights=shuffle(st.pairs.map((p,i)=>i));
    const draw=()=>{ showTask(q+`<div class="t-match"><div>${st.pairs.map((p,i)=>`<button class="t-m ${done2.has(i)?"ok":""} ${left===i?"sel":""}" data-l="${i}" ${done2.has(i)?"disabled":""}>${esc(p[0])}</button>`).join("")}</div><div>${rights.map(i=>`<button class="t-m ${done2.has(i)?"ok":""}" data-r="${i}" ${done2.has(i)?"disabled":""}>${st.html?st.pairs[i][1]:esc(st.pairs[i][1])}</button>`).join("")}</div></div>`);
      $$("[data-l]",task).forEach(b=>b.onclick=()=>{ left=+b.dataset.l; draw(); });
      $$("[data-r]",task).forEach(b=>b.onclick=()=>{ if(left==null){ toast("اختاروا من اليمين أول","bulb"); return; } if(+b.dataset.r===left){ done2.add(left); Sound.chime(); left=null; if(done2.size===st.pairs.length){ draw(); setTimeout(solved,300); return; } } else { Sound.bump(); left=null; } draw(); }); };
    draw();
  }
  else if(st.p==="choice"){
    showTask(q+`<div class="t-choices">${shuffle(st.opts.map((o,i)=>i)).map(i=>`<button class="t-ch" data-o="${i}">${st.opts[i].h||esc(st.opts[i].t)}</button>`).join("")}</div><p class="d-note" data-r></p>`);
    $$(".t-ch",task).forEach(b=>b.onclick=()=>{ const o=st.opts[+b.dataset.o]; if(o.ok) solved(); else { b.classList.add("bad"); Sound.bump(); $("[data-r]",task).textContent=o.r||"جرّبوا غيرها"; kidAct(kids[1],"talk"); } });
  }
  else if(st.p==="notes"){
    const cols=["#C8552B","#D9A53A","#5B7F4A","#3E6FA0"], f=[392,494,587,698]; let inp=[], playing=false;
    const flash=n=>{ const b=$(`.t-note[data-n="${n}"]`,task); if(b){ b.classList.add("lit"); setTimeout(()=>b.classList.remove("lit"),300); } Sound.note(f[n]); };
    const play=()=>{ playing=true; inp=[]; st.seq.forEach((n,i)=>setTimeout(()=>flash(n), 300+i*550)); setTimeout(()=>{ playing=false; draw(); }, 300+st.seq.length*550); };
    const draw=()=>{ showTask(q+`<div class="t-notes">${cols.map((c,i)=>`<button class="t-note" data-n="${i}" style="--c:${c}" aria-label="نغمة ${i+1}"></button>`).join("")}</div><div class="row"><button class="btn small" data-play>${IC.sound} اسمعوا اللحن</button></div><p class="d-note">${inp.length} من ${st.seq.length}</p>`);
      $("[data-play]",task).onclick=play; $$(".t-note",task).forEach(b=>b.onclick=()=>{ if(playing) return; const n=+b.dataset.n; flash(n); if(n===st.seq[inp.length]){ inp.push(n); if(inp.length===st.seq.length){ setTimeout(solved,300); return; } draw(); } else { Sound.bump(); toast("مو هاي النغمة. اسمعوها مرة ثانية","bulb"); inp=[]; draw(); } }); };
    draw(); setTimeout(play, 500);
  }
  else if(st.p==="mirrors"){
    const target=[1,3,0,2]; let rot=target.map(t=>(t+1+Math.floor(Math.random()*3))%4);
    const draw=()=>{ const okN=rot.filter((r,i)=>r===target[i]).length; showTask(q+`<div class="t-mirrors">${rot.map((r,i)=>`<button class="t-mir ${r===target[i]?"ok":""}" data-m="${i}" aria-label="مرآة ${i+1}"><span style="transform:rotate(${r*90+45}deg)"></span></button>`).join("")}</div><div class="t-beam"><i style="width:${okN/4*100}%"></i></div><p class="d-note">الضوء وصل ${okN} من 4 مرايا</p>`);
      $$(".t-mir",task).forEach(b=>b.onclick=()=>{ const i=+b.dataset.m; rot[i]=(rot[i]+1)%4; Sound.flip(); if(rot.every((r,j)=>r===target[j])){ draw(); setTimeout(solved,400); return; } draw(); }); };
    draw();
  }
  else if(st.p==="tap"){
    let n=0; showTask(q+`<p class="d-note" data-c>0 من ${st.n}</p>`);
    props.innerHTML=`<button class="tcloud" style="left:12%;top:28%" aria-label="اضغطوا">${st.art?st.art():ART.cloud()}</button>`;
    const c=$(".tcloud",props); c.onclick=()=>{ n++; c.style.left=(12+n*(64/st.n))+"%"; c.style.top=(28-n*1.2)+"%"; Sound.soft(); $("[data-c]",task).textContent=`${n} من ${st.n}`; if(n>=st.n) solved(); };
  }
  else if(st.p==="draw"){
    showTask(q+`<canvas class="t-canvas" width="640" height="360"></canvas><div class="pal-colors">${["#3A2A1C","#C8552B","#E8C066","#5B7F4A","#3E6FA0","#B9A6DD","#FFFFFF"].map(c=>`<button class="swatch" data-c="${c}" style="background:${c}" aria-label="لون"></button>`).join("")}</div>${st.write?`<div class="field"><label for="tw">${esc(st.write)}</label><input id="tw" maxlength="120" placeholder="وعاشوا…"></div>`:""}<div class="row"><button class="btn ghost small" data-clr>امسحوا</button><button class="btn honey" data-ok>${IC.check} خلصنا</button></div>`);
    const cv=$(".t-canvas",task), cx=cv.getContext("2d"); cx.fillStyle="#FFFBEF"; cx.fillRect(0,0,640,360); let col="#3A2A1C", dn=false, lp=null, strokes=0;
    $$("[data-c]",task).forEach(b=>b.onclick=()=>col=b.dataset.c);
    const pos=e=>{ const r=cv.getBoundingClientRect(); return [(e.clientX-r.left)*640/r.width,(e.clientY-r.top)*360/r.height]; };
    cv.onpointerdown=e=>{ dn=true; lp=pos(e); cv.setPointerCapture(e.pointerId); strokes++; };
    cv.onpointermove=e=>{ if(!dn) return; const p=pos(e); cx.strokeStyle=col; cx.lineWidth=6; cx.lineCap="round"; cx.beginPath(); cx.moveTo(lp[0],lp[1]); cx.lineTo(p[0],p[1]); cx.stroke(); lp=p; };
    cv.onpointerup=()=>dn=false;
    $("[data-clr]",task).onclick=()=>{ cx.fillStyle="#FFFBEF"; cx.fillRect(0,0,640,360); strokes=0; };
    $("[data-ok]",task).onclick=()=>{ if(!strokes){ toast("ارسموا شي صغير أول","bulb"); return; } const line=st.write?($("#tw",task).value.trim()):""; const art=cv.toDataURL("image/jpeg",.7); const gal=Store.get("talesArt",[]); gal.unshift({t:T.title, line, art, at:Date.now()}); Store.set("talesArt", gal.slice(0,12)); solved(); };
  }
}
Object.assign(ROUTES, {
  tales:{view:r=>viewTales(r), title:()=>"حكاياتنا", parent:"world"},
  tale:{view:(r,id)=>viewTale(r,id), title:id=>{ const t=TALEBOOK.find(x=>x.id===id); return t?t.title:"حكاية"; }, parent:"tales"}
});
