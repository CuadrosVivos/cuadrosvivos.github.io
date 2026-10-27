'use strict';
const customBefore17=showCustom;
showCustom=function(index){
 const dialog=document.querySelector('#custom-detail-dialog');dialog.classList.remove('compact-custom','memory-custom');customBefore17(index);
 if(![1,2].includes(index))return;
 dialog.classList.add('compact-custom');if(index===2)dialog.classList.add('memory-custom');
 const groups=index===1?CATALOG.souvenirGroups:CATALOG.memoryGroups||[];
 const body=dialog.querySelector('.simple-dialog');
 let header=body.querySelector('.custom-compact-head');if(header)header.replaceWith(...header.childNodes);
 const title=document.querySelector('#custom-detail-title'),description=document.querySelector('#custom-detail-description');
 if(index===2)description.textContent=groups[0]?.description||customProposals[2].description;
 header=document.createElement('div');header.className='custom-compact-head';title.before(header);header.append(title,description);
 const entries=groups.flatMap(g=>g.images.map(src=>({src,name:g.name,group:g})));
 const gallery=document.querySelector('#custom-detail-photos');gallery.innerHTML=entries.length?`<div class="compact-photo-stage"><button type="button" class="compact-main-photo" aria-label="Ampliar foto"><img alt="" draggable="false"></button><button type="button" class="compact-prev" aria-label="Foto anterior">←</button><button type="button" class="compact-next" aria-label="Foto siguiente">→</button></div><p class="compact-photo-name"></p><div class="compact-thumbs" aria-label="Elegir foto">${entries.map((e,i)=>`<button type="button" data-compact-photo="${i}" aria-label="Ver ${esc(e.name)}, foto ${i+1}"><img src="${e.src}" alt="" loading="lazy" decoding="async"></button>`).join('')}</div>`:'<p>Pronto sumaremos nuevos ejemplos.</p>';
 if(!entries.length)return;
 let pos=0;
 function choose(n){pos=(n+entries.length)%entries.length;const entry=entries[pos];gallery.querySelector('.compact-main-photo img').src=entry.src;gallery.querySelector('.compact-main-photo img').alt=entry.name;gallery.querySelector('.compact-photo-name').textContent=entry.name+' · '+(pos+1)+' de '+entries.length;gallery.querySelectorAll('[data-compact-photo]').forEach((b,i)=>b.setAttribute('aria-pressed',String(i===pos)));gallery.querySelectorAll('.compact-prev,.compact-next').forEach(b=>b.hidden=entries.length<2);}
 gallery.querySelectorAll('[data-compact-photo]').forEach(b=>b.addEventListener('click',()=>choose(Number(b.dataset.compactPhoto))));
 gallery.querySelector('.compact-prev').onclick=()=>choose(pos-1);gallery.querySelector('.compact-next').onclick=()=>choose(pos+1);
 const main=gallery.querySelector('.compact-main-photo');let startX=null,moved=false;
 main.addEventListener('pointerdown',e=>{startX=e.clientX;moved=false;});main.addEventListener('dragstart',e=>e.preventDefault());
 main.addEventListener('pointerup',e=>{if(startX!==null&&Math.abs(e.clientX-startX)>35){moved=true;choose(pos+(e.clientX<startX?1:-1));}startX=null;});main.addEventListener('pointercancel',()=>{startX=null;});
 main.addEventListener('click',()=>{if(moved){moved=false;return;}const entry=entries[pos];if(index===2)showMemoryGroup(entry.group);else openPhoto(entry.group.images,entry.name,true);photoIndex=entry.group.images.indexOf(entry.src);updatePhoto();});
 gallery.onkeydown=e=>{if(['ArrowLeft','ArrowRight'].includes(e.key)){e.preventDefault();choose(pos+(e.key==='ArrowRight'?1:-1));}};
 choose(0);
};
// The entire workshop panel opens its proposal; links and contact buttons retain their own action.
document.querySelectorAll('#talleres .workshop-options article').forEach(card=>{card.classList.add('workshop-clickable');card.addEventListener('click',e=>{if(e.target.closest('button,a,input,summary'))return;card.querySelector('[data-workshop-detail]')?.click();});});
