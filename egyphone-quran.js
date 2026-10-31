/* EGYPHONE standalone Quran audio player. No changes to authentication, data or billing. */
(()=>{
'use strict';
if(document.documentElement.dataset.btBrand!=='egyphone')return;
const names=`Al-Fatiha|Al-Baqara|Al-Imran|An-Nisa|Al-Maida|Al-Anam|Al-Araf|Al-Anfal|At-Tawba|Yunus|Hud|Yusuf|Ar-Rad|Ibrahim|Al-Hijr|An-Nahl|Al-Isra|Al-Kahf|Maryam|Ta-Ha|Al-Anbiya|Al-Hajj|Al-Muminun|An-Nur|Al-Furqan|Ash-Shuara|An-Naml|Al-Qasas|Al-Ankabut|Ar-Rum|Luqman|As-Sajda|Al-Ahzab|Saba|Fatir|Ya-Sin|As-Saffat|Sad|Az-Zumar|Ghafir|Fussilat|Ash-Shura|Az-Zukhruf|Ad-Dukhan|Al-Jathiya|Al-Ahqaf|Muhammad|Al-Fath|Al-Hujurat|Qaf|Adh-Dhariyat|At-Tur|An-Najm|Al-Qamar|Ar-Rahman|Al-Waqia|Al-Hadid|Al-Mujadila|Al-Hashr|Al-Mumtahana|As-Saff|Al-Jumua|Al-Munafiqun|At-Taghabun|At-Talaq|At-Tahrim|Al-Mulk|Al-Qalam|Al-Haqqa|Al-Maarij|Nuh|Al-Jinn|Al-Muzzammil|Al-Muddaththir|Al-Qiyama|Al-Insan|Al-Mursalat|An-Naba|An-Naziat|Abasa|At-Takwir|Al-Infitar|Al-Mutaffifin|Al-Inshiqaq|Al-Buruj|At-Tariq|Al-Ala|Al-Ghashiya|Al-Fajr|Al-Balad|Ash-Shams|Al-Layl|Ad-Duha|Ash-Sharh|At-Tin|Al-Alaq|Al-Qadr|Al-Bayyina|Az-Zalzala|Al-Adiyat|Al-Qaria|At-Takathur|Al-Asr|Al-Humaza|Al-Fil|Quraysh|Al-Maun|Al-Kawthar|Al-Kafirun|An-Nasr|Al-Masad|Al-Ikhlas|Al-Falaq|An-Nas`.split('|');
let number=Number(localStorage.getItem('egyphone.quran.surah')||55);
if(number<1||number>114)number=55;
let repeat=false, continuous=false, panel, audio, button, status;
const source=n=>'https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/'+n+'.mp3';
function label(){return String(number).padStart(3,'0')+' · '+names[number-1]}
function update(){
 if(!panel)return;
 panel.querySelector('#egyQTitle').textContent=label();
 panel.querySelector('#egyQSelect').value=String(number);
 panel.querySelector('#egyQPlay').textContent=audio&&!audio.paused?'❚❚ Pausa':'▶ Ascolta';
 panel.querySelector('#egyQProgress').value=audio?.duration?Math.round(100*audio.currentTime/audio.duration):0;
 panel.querySelector('#egyQStatus').textContent=status||'Pronto per ascoltare';
}
function setSurah(n,play=false){number=Math.min(114,Math.max(1,n));localStorage.setItem('egyphone.quran.surah',String(number));if(audio){audio.pause();audio.removeAttribute('src');audio.load();}status='Sura selezionata';update();if(play)start();}
function start(){
 if(!audio)return;
 if(audio.src!==source(number)){audio.src=source(number);audio.load();}
 status='Caricamento audio…';update();
 const promise=audio.play();if(promise&&promise.catch)promise.catch(()=>{status='Audio non disponibile. Riprova.';update();});
}
function toggle(){if(audio&&!audio.paused){audio.pause();update();}else start();}
function build(){
 if(document.getElementById('egyQuranButton'))return;
 button=document.createElement('button');button.id='egyQuranButton';button.type='button';button.textContent='☪';button.title='Apri lettore Corano';button.setAttribute('aria-label','Apri lettore Corano');button.addEventListener('click',()=>{panel.hidden=!panel.hidden;button.setAttribute('aria-expanded',String(!panel.hidden));});
 panel=document.createElement('section');panel.id='egyQuranPanel';panel.hidden=true;
 panel.setAttribute('aria-label','Lettore del Sacro Corano');
 panel.innerHTML='<div class="egyQHead"><div><b>☪ Sacro Corano</b><small>Recitazione di Mishary Alafasy</small></div><button id="egyQClose" type="button" aria-label="Chiudi lettore">×</button></div><div class="egyQBody"><label for="egyQSelect">Scegli la sura</label><select id="egyQSelect"></select><strong id="egyQTitle"></strong><div class="egyQActions"><button type="button" id="egyQPrev">❮</button><button type="button" id="egyQPlay">▶ Ascolta</button><button type="button" id="egyQNext">❯</button></div><input id="egyQProgress" type="range" min="0" max="100" value="0" aria-label="Avanzamento recitazione"><div class="egyQOptions"><label><input id="egyQRepeat" type="checkbox"> Ripeti sura</label><label><input id="egyQContinuous" type="checkbox"> Sura successiva</label></div><label for="egyQVolume">Volume</label><input id="egyQVolume" type="range" min="0" max="100" value="80"><small id="egyQStatus" role="status">Pronto per ascoltare</small><small>Streaming da Al Quran Cloud · Richiede internet</small></div>';
 const select=panel.querySelector('#egyQSelect');
 names.forEach((name,i)=>{const opt=document.createElement('option');opt.value=String(i+1);opt.textContent=String(i+1)+'. '+name;select.append(opt);});
 audio=document.createElement('audio');audio.preload='none';audio.volume=.8;audio.id='egyQAudio';document.body.append(audio);
 document.body.append(button,panel);
 select.addEventListener('change',()=>setSurah(Number(select.value)));
 panel.querySelector('#egyQClose').addEventListener('click',()=>{panel.hidden=true;button.setAttribute('aria-expanded','false');});
 panel.querySelector('#egyQPlay').addEventListener('click',toggle);
 panel.querySelector('#egyQPrev').addEventListener('click',()=>setSurah(number===1?114:number-1,true));
 panel.querySelector('#egyQNext').addEventListener('click',()=>setSurah(number===114?1:number+1,true));
 panel.querySelector('#egyQRepeat').addEventListener('change',e=>repeat=e.target.checked);
 panel.querySelector('#egyQContinuous').addEventListener('change',e=>continuous=e.target.checked);
 panel.querySelector('#egyQVolume').addEventListener('input',e=>audio.volume=Number(e.target.value)/100);
 panel.querySelector('#egyQProgress').addEventListener('change',e=>{if(Number.isFinite(audio.duration)&&audio.duration>0)audio.currentTime=Number(e.target.value)*audio.duration/100;});
 audio.addEventListener('play',()=>{status='In riproduzione';update();});audio.addEventListener('pause',update);
 audio.addEventListener('timeupdate',update);audio.addEventListener('error',()=>{status='Streaming non disponibile. Riprova più tardi.';update();});
 audio.addEventListener('ended',()=>{if(repeat){audio.currentTime=0;start();}else if(continuous&&number<114)setSurah(number+1,true);else{status='Recitazione terminata';update();}});
 // Never initiate audio without a deliberate press on play or next.
 update();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',build);else build();
})();