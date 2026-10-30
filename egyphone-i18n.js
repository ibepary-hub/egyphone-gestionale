/* EGYPHONE: presentation-only Egyptian Arabic interface.
   Does not translate user data, repair records, fiscal XML or database values. */
(()=>{
'use strict';
const KEY='egyphone.uiLanguage.v1', DOC_KEY='egyphone.documentLanguage.v1';
const dict={
'Il mio spazio':'الرئيسية','Il tuo laboratorio, organizzato.':'مركز الصيانة بتاعك منظم',
'Il mio laboratorio':'مركز الصيانة بتاعي','Impostazioni e DYMO':'الإعدادات والطابعة',
'Impostazioni':'الإعدادات','Utenti e ruoli':'الموظفين والصلاحيات',
'Registro accessi':'سجل الدخول','Riparazioni':'التصليحات',
'Nuova accettazione':'استلام جهاز جديد','Accettazione rapida':'استلام سريع',
'Accettazione con firma':'استلام بالتوقيع','Magazzino ricambi':'مخزن قطع الغيار',
'Acquisti e scorte':'المشتريات والمخزون','Ritiro usato':'استلام أجهزة مستعملة',
'Movimenti magazzino':'حركة المخزن','Uscite e rientri':'الصادر والمرتجع',
'Etichette libere':'استيكرات حرة','Vendite ricambi':'بيع قطع الغيار',
'Fatture clienti':'فواتير العملاء','Clienti':'العملاء',
'Orari e presenze':'الحضور وساعات الشغل','Backup':'نسخة احتياطية',
'Sicurezza e backup':'الأمان والنسخ الاحتياطي','Dashboard':'الرئيسية',
'Home':'الرئيسية','Pratiche':'التصليحات','Altro':'المزيد',
'Rapida':'سريع','Ricambi':'قطع الغيار','Movimenti':'الحركات',
'Scorte Zero':'المخزون الناقص','Aggiorna':'تحديث','Esci':'خروج',
'Salva':'حفظ','Annulla':'إلغاء','Chiudi':'قفل','Stampa':'طباعة',
'Cerca':'بحث','Nome':'الاسم','Telefono':'التليفون','Indirizzo':'العنوان',
'Cliente':'العميل','Dispositivo':'الجهاز','Stato':'الحالة','Note':'ملاحظات',
'Prezzo':'السعر','Totale':'الإجمالي','Data':'التاريخ',
'Numero':'الرقم','Descrizione':'الوصف','Azioni':'الإجراءات',
'Nuova riparazione':'تصليح جديد','Nuova vendita':'بيع جديد',
'Genera fattura':'إنشاء فاتورة','Consegna':'تسليم',
'Il tuo spazio di lavoro':'مساحة شغلك',
'Ecco cosa succede nel tuo laboratorio.':'شوف إيه اللي بيحصل في مركز الصيانة بتاعك.',
'IL MIO SPAZIO':'الرئيسية','IL TUO SPAZIO DI LAVORO':'مساحة شغلك',
'AMMINISTRAZIONE':'الإدارة','GESTIONE E SISTEMA':'الإدارة والنظام',
'IL LABORATORIO':'مركز الصيانة','MAGAZZINO':'المخزن',
'VENDITE E DOCUMENTI':'المبيعات والمستندات',
'Scansiona':'مسح','Cerca ovunque: prodotto, colore, codice, richiesta…':'دوّر على منتج أو كود أو طلب…'
};
let lang=localStorage.getItem(KEY)==='eg'?'eg':'it', translating=false;
let observers=[];
const reverse=Object.fromEntries(Object.entries(dict).map(([it,ar])=>[ar,it]));
function eligible(el){
 if(!el||!el.closest||el.closest('#egyI18nControls,#egyDocControls,.egyQuickOverlay'))return false;
 return !el.closest('script,style,textarea,input,select,option,[contenteditable],.egyVerseBody,[lang="ar"],.egyInvoiceColumn,#egyInvoiceForm,.saleDialog');
}
function translate(){
 if(translating)return;
 translating=true;
 observers.forEach(({observer})=>observer.disconnect());
 try{
  document.documentElement.lang=lang==='eg'?'ar-EG':'it';
  document.body.classList.toggle('egy-ui-arabic',lang==='eg');
  for(const root of [document.getElementById('mainMenu'),document.querySelector('.app'),document.getElementById('mobileBottomNav')].filter(Boolean)){
   const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);
   let node,count=0;
   while((node=walker.nextNode())&&count++<14000){
    if(!node.parentElement||!eligible(node.parentElement))continue;
    const value=node.nodeValue,trimmed=value.trim();if(!trimmed)continue;
    // Derive from actual DOM text, not a cached node that the app may have rewritten.
    const original=reverse[trimmed]||trimmed;
    const next=lang==='eg'?(dict[original]||original):original;
    if(value!==value.replace(trimmed,next))node.nodeValue=value.replace(trimmed,next);
   }
  }
  document.querySelectorAll('#egyI18nControls [data-lang]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.lang===lang)));
 }finally{
  translating=false;
  observers.forEach(({observer,target})=>observer.observe(target,{subtree:true,childList:true,characterData:true}));
 }
}
function renderControls(){
 if(document.getElementById('egyI18nControls'))return;
 const wrap=document.createElement('div');wrap.id='egyI18nControls';wrap.className='egyI18nControls';
 wrap.innerHTML='<span>Lingua / اللغة</span><button type="button" data-lang="it">🇮🇹 Italiano</button><button type="button" data-lang="eg">🇪🇬 مصري</button>';
 wrap.addEventListener('click',e=>{const b=e.target.closest('[data-lang]');if(!b)return;lang=b.dataset.lang;localStorage.setItem(KEY,lang);translate();});
 (document.querySelector('.studioHeaderTitle')||document.querySelector('header')||document.body).append(wrap);
 const doc=document.createElement('div');doc.id='egyDocControls';doc.className='egyDocControls';
 doc.innerHTML='<label for="egyDocumentLanguage">Lingua documenti / لغة المستندات</label><select id="egyDocumentLanguage"><option value="it">🇮🇹 Italiano</option><option value="eg">🇪🇬 عربي مصري</option></select><small>Preferenza per le stampe future. I documenti fiscali ufficiali restano in italiano; nessuna traduzione dei PDF ancora attiva.</small>';
 doc.querySelector('select').value=localStorage.getItem(DOC_KEY)==='eg'?'eg':'it';
 doc.querySelector('select').addEventListener('change',e=>localStorage.setItem(DOC_KEY,e.target.value));
 // Put document preference in settings, not inside the sliding menu.
 const settings=document.getElementById('settingsView')||document.querySelector('[data-category-view="Impostazioni"]')||document.getElementById('settingsPanel');
 if(settings)settings.prepend(doc);
 else {doc.hidden=true;document.body.append(doc);}
 // If the settings view is rendered later, move the same control there.
 const findSettings=()=>{
  const target=document.getElementById('settingsView')||document.querySelector('[data-category-view="Impostazioni"]')||document.getElementById('settingsPanel');
  if(target&&doc.parentElement!==target){target.prepend(doc);doc.hidden=false;}
 };
 document.addEventListener('click',e=>{if(e.target.closest('[data-category="Impostazioni"],#settingsMenuItem'))setTimeout(findSettings,100);},true);
}
function boot(){
 if(document.documentElement.dataset.btBrand!=='egyphone')return;
 renderControls();translate();
 const targets=[document.querySelector('.app'),document.getElementById('mainMenu'),document.getElementById('mobileBottomNav')].filter(Boolean);
 targets.forEach(target=>{
  const observer=new MutationObserver(mutations=>{
   if(translating)return;
   // Only repaint after a genuine application render, never after our own translations.
   if(!mutations.some(m=>m.type==='childList'||m.type==='characterData'))return;
   translate();
  });
  observers.push({observer,target});
  observer.observe(target,{subtree:true,childList:true,characterData:true});
 });
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();
