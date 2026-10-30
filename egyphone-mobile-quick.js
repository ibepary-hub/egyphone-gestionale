/* EGYPHONE exclusive: mobile quick actions, no data writes */
(function(){
 const isEgy=()=>document.documentElement.dataset.btBrand==='egyphone';
 let overlay=null,previousFocus=null;
 function close(){if(!overlay)return;overlay.hidden=true;document.body.style.removeProperty('overflow');previousFocus?.focus?.();}
 function show(){
  if(!isEgy())return;
  if(typeof isAdmin==='function'&&!isAdmin()){if(typeof setCategory==='function')setCategory('RicambiHub');return;}
  previousFocus=document.activeElement;
  if(!overlay){
   overlay=document.createElement('div');overlay.className='egyQuickOverlay';overlay.hidden=true;
   overlay.innerHTML='<div class="egyQuickSheet" role="dialog" aria-modal="true" aria-labelledby="egyQuickHeading"><h2 id="egyQuickHeading">Nuova pratica</h2><p>Scegli come iniziare.</p><button type="button" data-quick-target="AccettazioneRapida">⚡ Accettazione rapida</button><button type="button" data-quick-target="AccettazioneCompleta">🔧 Riparazione / accettazione completa</button><button type="button" data-quick-close>Annulla</button></div>';
   overlay.addEventListener('click',e=>{if(e.target===overlay||e.target.closest('[data-quick-close]'))close();const button=e.target.closest('[data-quick-target]');if(button){const category=button.dataset.quickTarget;close();if(typeof setCategory==='function')setCategory(category);}});
   document.body.appendChild(overlay);
  }
  overlay.hidden=false;document.body.style.overflow='hidden';overlay.querySelector('button')?.focus();
 }
 document.addEventListener('click',e=>{
  if(!isEgy()||!document.body.classList.contains('logged-in'))return;
  const b=e.target.closest('#mobileBottomNav [data-smart-action="scanner"]');
  if(b){e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();show();}
 },true);
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&overlay&&!overlay.hidden)close();});
 function label(){
  if(!isEgy())return;
  const b=document.querySelector('#mobileBottomNav [data-smart-action="scanner"]');
  if(!b)return;b.setAttribute('aria-label','Nuova pratica: accettazione rapida o completa');
  const icon=b.querySelector('b'),txt=b.querySelector('span');if(icon)icon.textContent='＋';if(txt)txt.textContent='Rapida';
 }
 document.addEventListener('DOMContentLoaded',()=>{label();const nav=document.getElementById('mobileBottomNav');if(nav)new MutationObserver(label).observe(nav,{childList:true,subtree:true,characterData:true});});
})();
