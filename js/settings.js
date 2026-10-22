/* ============ SETTINGS ============ */
function applyTheme(){ const r=document.documentElement; r.dataset.accent=settings.accent; if(settings.theme==="auto") delete r.dataset.theme; else r.dataset.theme=settings.theme; document.title=settings.siteTitle; }
$("#settingsBtn").onclick = () => {
  const md = modal(`<h2>الإعدادات</h2>
    <div class="field"><label for="sName">اسم البطلة</label><input id="sName" value="${esc(settings.heroName)}" placeholder="${esc(CONFIG.heroFallback)}"></div>
    <div class="field"><label for="sTitle">اسم الموقع</label><input id="sTitle" value="${esc(settings.siteTitle)}"></div>
    <div class="field"><label for="sWel">رسالة الترحيب</label><input id="sWel" value="${esc(settings.welcome)}"></div>
    <div class="field"><label for="sLet">رسالة الكهف المضيء</label><textarea id="sLet" rows="4">${esc(settings.secretLetter)}</textarea></div>
    <div class="field"><label>لون الثيم</label><div class="seg" data-acc><button data-v="sage">مريمي</button><button data-v="lilac">خزامى</button><button data-v="apricot">مشمشي</button></div></div>
    <div class="field"><label>المظهر</label><div class="seg" data-thm><button data-v="auto">تلقائي</button><button data-v="light">نهاري</button><button data-v="dark">مسائي</button></div></div>
    <div class="row"><button class="btn honey" data-sv>${IC.check} احفظي الإعدادات</button><button class="btn ghost small" data-tour>شغّلي الجولة</button><button class="btn danger small" data-wipe>${IC.trash} مسح كل البيانات</button></div>
    <p class="d-note">باقي الرسائل والألعاب والفتوحات تتعدّل من كتلة CONFIG أعلى ملف الموقع.</p>`, {wide:true});
  let acc=settings.accent, thm=settings.theme;
  const seg=(sel,val,set)=>{ $$(sel+" button",md.el).forEach(b=>{ b.setAttribute("aria-pressed",b.dataset.v===val); b.onclick=()=>{ set(b.dataset.v); $$(sel+" button",md.el).forEach(x=>x.setAttribute("aria-pressed",x===b)); }; }); };
  seg("[data-acc]",acc,x=>{acc=x; document.documentElement.dataset.accent=x;}); seg("[data-thm]",thm,x=>{thm=x;});
  $("[data-sv]",md.el).onclick=()=>{ settings.heroName=$("#sName",md.el).value.trim(); settings.siteTitle=$("#sTitle",md.el).value.trim()||CONFIG.siteTitle; settings.welcome=$("#sWel",md.el).value.trim()||CONFIG.welcome; settings.secretLetter=$("#sLet",md.el).value||CONFIG.secretLetter; settings.accent=acc; settings.theme=thm; Store.set("settings",settings); applyTheme(); md.close(); toast("انحفظت الإعدادات","check"); go(current,false); };
  $("[data-tour]",md.el).onclick=()=>{ md.close(); tour(); };
  $("[data-wipe]",md.el).onclick=()=>{ md.close(); confirmBox("تمسحين النجوم والرسمة والمذكرات والإعدادات من هذا الجهاز؟","امسحي كلشي",()=>{ Store.clearAll(); location.reload(); }); };
};

