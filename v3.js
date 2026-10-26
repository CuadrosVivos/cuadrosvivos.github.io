'use strict';
const prefersStill=matchMedia('(prefers-reduced-motion: reduce)');
const money=value=>new Intl.NumberFormat('es-AR',{style:'currency',currency:'ARS',maximumFractionDigits:0}).format(value);
const safeLink=value=>{try{const u=new URL(value);return ['http:','https:'].includes(u.protocol)?u.href:null}catch{return null}};
const photos=key=>(CATALOG.images[key]||[]).map(x=>x.src);
for(const [key,g] of Object.entries(groups)){
 if(photos(key).length)IMAGES[key]=photos(key);
 g.cover=IMAGES[key][0];
}
$('#modalities').innerHTML=Object.entries(groups).map(([key,g],i)=>`<article class="modality-v3"><button data-mode="${key}" class="modality-photo" aria-label="Ver ${esc(g.name)}"><img src="${g.cover}" alt="${esc(g.name)}" loading="lazy" decoding="async"><span class="mode-number">1.${i+1}</span></button><div class="mode-copy"><p class="eyebrow">${['CUADRO ARMADO','KIT PARA ARMAR','CON TIERRA, SIN PLANTAS'][i]}</p><h3>${g.heading}</h3><p>${g.description}</p><button class="text-link" data-mode="${key}">Elegí medida y acabado ↗</button></div></article>`).join('');
$$('[data-mode]').forEach(b=>b.addEventListener('click',()=>showProduct(b.dataset.mode)));
$('#modalities').addEventListener('scroll',()=>{const cards=$$('#modalities article');let nearest=0,delta=Infinity;cards.forEach((c,i)=>{const d=Math.abs(c.offsetLeft-$('#modalities').offsetLeft-$('#modalities').scrollLeft);if(d<delta){delta=d;nearest=i}});$('#modality-position').textContent=`${nearest+1} de 3`},{passive:true});
let selectedColor='',specialColor=false,currentPrice=null;
function sizeLabel(s){return `${s.width} × ${s.height} cm · ${s.orientation}${s.quantity===3?' · Conjunto de 3 cuadros':''}`}
function sizeValue(){const value=$('#pref-size').value;if(value==='special')return $('#special-size').value.trim()||'Medida especial a coordinar';const s=CATALOG.sizes[Number(value)];return value!==''&&s?sizeLabel(s):''}
function updatePrice(){const value=$('#pref-size').value;$('#special-size-label').hidden=value!=='special';currentPrice=null;if(value==='special')$('#price-display').textContent='Medida especial · Solicitar presupuesto';else if(value==='')$('#price-display').textContent='Elegí una medida para ver el precio.';else {const s=CATALOG.sizes[Number(value)];const price=s?.prices[activeProduct.id];if(typeof price==='number'){currentPrice=price;$('#price-display').textContent=money(price)+(s.quantity===3?' · Precio por el conjunto de 3 cuadros':'')}else $('#price-display').textContent='Precio a confirmar · Consultanos por esta medida';}}
$('#pref-size').addEventListener('change',updatePrice);
function renderColors(){selectedColor='';specialColor=false;$('#special-color-label').hidden=true;$('#special-color').value='';$('#color-selected').textContent='Indicá tu preferencia';$('#color-picker').open=false;const colors=['Madera clara','Madera oscura','Blanco','Rosa','Vintage de colores','Otros'];$('#color-options').innerHTML=colors.map((c,i)=>`<button type="button" class="color-option" data-color="${i}">${c}</button>`).join('');$$('[data-color]').forEach(b=>b.addEventListener('click',()=>{selectedColor=colors[Number(b.dataset.color)];specialColor=selectedColor==='Otros';$('#special-color-label').hidden=!specialColor;$('#color-selected').textContent=selectedColor;$('#color-picker').open=false}));}
function gallery(images,initial){$('#product-thumbs').innerHTML=images.map((src,i)=>`<button data-src="${src}" aria-label="Ver foto ${i+1}" aria-pressed="false"><img src="${src}" alt="Vista ${i+1}" loading="lazy" decoding="async"></button>`).join('');$$('#product-thumbs button').forEach(b=>b.addEventListener('click',()=>setProductImage(b.dataset.src)));setProductImage(initial||images[0]);}
showProduct=function(id,initial){const g=groups[id];activeProduct={id,name:g.name,images:IMAGES[id]};$('#product-title').textContent=g.name;$('#product-kicker').textContent='CUADROS VIVOS / '+['ARMADO','KIT PARA ARMAR','SIN PLANTAS'][g.mode];$('#product-description').textContent='Cuadros de madera hechos de forma artesanal, impermeabilizados en su interior y barnizados en su exterior para mayor durabilidad. '+g.description;$('#product-main').alt=g.name;gallery(IMAGES[id],initial||g.cover);$('#product-preferences').hidden=false;$('#pref-size').innerHTML='<option value="">Elegí una medida</option>'+CATALOG.sizes.map((s,i)=>`<option value="${i}">${esc(sizeLabel(s))} — ${typeof s.prices[id]==='number'?money(s.prices[id]):'Consultar precio'}</option>`).join('')+'<option value="special">Solicitar medida especial</option>';$('#special-size').value='';renderColors();updatePrice();$('.availability').textContent='Disponibilidad a confirmar · Coordinamos el pedido con vos';$('#delivery-note').textContent=id==='sin-plantas'?'Retiro en Trelew, entrega local a coordinar o envío por encomienda.':'Retiro en Trelew o entrega a domicilio en Trelew y zonas cercanas, a coordinar. Recomendamos estas opciones: el transporte por encomienda puede dañar las plantas.';$('#delivery-note').textContent+=' Consultá disponibilidad: si hay stock, el retiro puede coordinarse para el día siguiente; si requiere preparación, lo acordamos según el pedido.';$('#add-product').textContent='Agregar a mi consulta +';$('#add-product').hidden=false;$('#consult-product').hidden=false;$('#consult-product').textContent='Consultar por este cuadro ↗';$('#product-details').innerHTML=`<details><summary>Descripción y qué incluye</summary><p>${esc(activeProduct.id==='armado'?'Marco, tierra y plantas ya colocadas, listo para ser colgado.':g.includes)}</p></details><details><summary>Cuidados</summary><p>Ubicalo donde reciba buena luz. Regá cuando la tierra se seque y evitá la acumulación de agua.</p><button class="text-link" id="detail-guide">Leer guía de cuidados ↗</button></details>`;$('#detail-guide').addEventListener('click',()=>{$('#product-dialog').close();showGuide('cuidados')});openDialog($('#product-dialog'));};
productSelection=function(){if(activeProduct.featured)return {name:activeProduct.sold?'Quiero uno similar a '+activeProduct.name:activeProduct.name,details:[activeProduct.description,activeProduct.width&&activeProduct.height?`${activeProduct.width} × ${activeProduct.height} cm`:'',activeProduct.sold?'Pieza de referencia vendida · Cotizar una similar':typeof activeProduct.price==='number'?money(activeProduct.price):'Precio a consultar'].filter(Boolean).join(' · ')};return {name:activeProduct.name,details:[sizeValue()&&'Medida: '+sizeValue(),(specialColor?$('#special-color').value.trim()||'Otro acabado a coordinar':selectedColor)&&'Marco: '+(specialColor?$('#special-color').value.trim()||'Otro acabado a coordinar':selectedColor),typeof currentPrice==='number'?'Precio mostrado: '+money(currentPrice):'Presupuesto a confirmar'].filter(Boolean).join(' · ')}};
function renderAvailable(type='all'){$$('[data-available]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.available===type));let list=type==='all'?[...CATALOG.featured,...CATALOG.creationsAvailable]:type==='cuadros'?[...CATALOG.featured]:[...CATALOG.creationsAvailable];list=list.filter(p=>!p.sold && !/encargo/i.test(p.status||""));const statusRank=p=>p.sold?2:/encargo/i.test(p.status||'')?1:0;list.sort((a,b)=>statusRank(a)-statusRank(b));$('#frame-catalog').setAttribute('aria-label',type==='all'?'Galería de piezas':type==='cuadros'?'Galería de cuadros vivos':'Galería de creaciones');$('#frame-catalog').innerHTML=list.length?list.map((p,i)=>`<article class="product-card available-card"><button data-featured="${i}"><div class="card-image"><img src="${p.images[0]}" alt="${esc(p.name)}" loading="lazy" decoding="async">${p.badge||p.status?`<span class="badge">${esc(p.badge||p.status)}</span>`:''}</div><h4>${esc(p.name)}</h4><p>${esc(p.description)} ${p.width&&p.height?`${p.width} × ${p.height} cm`:''}</p><p class="card-price" ${p.sold?'hidden':''}>${typeof p.oldPrice==='number'&&typeof p.price==='number'&&p.oldPrice>p.price?`<del>${money(p.oldPrice)}</del> `:''}${typeof p.price==='number'?money(p.price):'Consultar precio'}</p></button></article>`).join(''):`<div class="available-empty"><p class="eyebrow">${type==='cuadros'?'CUADROS VIVOS':'OTRAS CREACIONES'}</p><h3>Pronto, nuevas piezas por acá</h3><p>Estamos preparando la selección con sus fotos y precios. Mientras tanto, ${type==='cuadros'?'podés elegir cómo querés recibir tu cuadro en las opciones de arriba.':'contanos qué estás buscando.'}</p><button class="text-link" id="empty-inquiry">${type==='cuadros'?'Consultar por un cuadro':'Consultar por una creación'} ↗</button></div>`;$$('[data-featured]').forEach(b=>b.addEventListener('click',()=>showFeatured(list[Number(b.dataset.featured)])));$('#empty-inquiry')?.addEventListener('click',()=>{addSelection({name:type==='cuadros'?'Cuadro vivo por encargo':'Otras creaciones',details:''});goContact()});$('.available-controls .arrows, .catalog-head .arrows').hidden=!list.length;}
function showFeatured(p){activeProduct={...p,id:'featured',featured:true};$('#product-title').textContent=p.name;$('#product-kicker').textContent=p.sold?'PIEZA DE REFERENCIA':'DISPONIBLES';$('#product-description').textContent=p.description;$('#product-main').alt=p.name;gallery(p.images);$('#product-preferences').hidden=true;$('.availability').textContent=[p.sold?'Vendido · No disponible':p.status,p.sold?'':typeof p.price==='number'?money(p.price):'Consultar precio'].filter(Boolean).join(' · ');$('#product-details').innerHTML=`<details open><summary>Detalles</summary><p>${esc(p.description)} ${p.width&&p.height?`${p.width} × ${p.height} cm`:''}</p></details>`;const sold=p.status==='Vendido';$('#consult-product').hidden=false;$('#add-product').hidden=sold;$('#consult-product').textContent=sold?'Quiero uno similar ↗':'Consultar por esta pieza ↗';$('#add-product').textContent='Agregar a mi consulta +';openDialog($('#product-dialog'));}
$$('[data-available]').forEach(b=>b.addEventListener('click',()=>renderAvailable(b.dataset.available)));renderAvailable();
let photoList=[],photoIndex=0;
function updatePhoto(){$('#photo-large').src=photoList[photoIndex];warmNext(photoList,photoIndex);$('#photo-position').textContent=`${photoIndex+1} / ${photoList.length}`}
function openPhoto(images,title,inquiry=false){photoList=images;photoIndex=0;$('#photo-title').textContent=title;$('#photo-inquiry').hidden=!inquiry;$('#photo-inquiry').onclick=()=>{addSelection({name:title,details:''});goContact()};updatePhoto();openDialog($('#photo-dialog'))}
$('#photo-prev').addEventListener('click',()=>{photoIndex=(photoIndex-1+photoList.length)%photoList.length;updatePhoto()});$('#photo-next').addEventListener('click',()=>{photoIndex=(photoIndex+1)%photoList.length;updatePhoto()});$('#photo-dialog').addEventListener('keydown',e=>{if(['ArrowLeft','ArrowRight'].includes(e.key)){e.preventDefault();photoIndex=(photoIndex+(e.key==='ArrowRight'?1:-1)+photoList.length)%photoList.length;updatePhoto()}});
const inspiration=photos('community').length?photos('community'):photos('inspiration').length?photos('inspiration'):[IMAGES.armado[4]||IMAGES.armado[0],IMAGES.armado[6]||IMAGES.armado[1],IMAGES.armado[9]||IMAGES.armado[2],photos('taller')[5]||workshopImages[0],...photos('hero')];
$('#community-track').innerHTML=inspiration.map((src,i)=>`<article class="product-card"><button data-community="${i}" aria-label="Ampliar foto de inspiración ${i+1}"><img src="${src}" alt="${i<3?'Detalle de un cuadro vivo artesanal':'Plantas y momentos compartidos'}" loading="lazy" decoding="async"></button></article>`).join('');$$('[data-community]').forEach(b=>b.addEventListener('click',()=>{openPhoto(inspiration,'Encontrá tu inspiración');photoIndex=Number(b.dataset.community);updatePhoto()}));
const customCard=$$('.custom-grid article')[1];if(false){const cover=customCard.querySelector('.custom-visual');cover.innerHTML=`<button id="souvenir-photo" aria-label="Ver ejemplos de centros de mesa y souvenirs"><img src="${photos('souvenirs')[0]}" alt="Souvenirs con suculentas para una celebración" loading="lazy" decoding="async"><span>Ver ejemplos ↗</span></button>`;cover.classList.add('has-photo');$('#souvenir-photo').addEventListener('click',()=>openPhoto(photos('souvenirs'),'Centros de mesa y souvenirs con suculentas',true));let idx=0,timer;cover.addEventListener('pointerenter',e=>{if(e.pointerType==='mouse'&&!prefersStill.matches)timer=setInterval(()=>{cover.querySelector('img').src=photos('souvenirs')[(++idx)%photos('souvenirs').length]},2200)});cover.addEventListener('pointerleave',()=>clearInterval(timer));}
// A slow, pausable hero slideshow; reduced-motion preferences disable automatic changes.
const heroPics=photos('hero'),hero=$('.hero'),heroImage=$('.hero>img');let heroIndex=0,heroPaused=false,heroTimer;
if(heroPics.length){heroImage.removeAttribute('srcset');heroImage.src=heroPics[0];warmNext(heroPics,0);heroImage.alt='Suculentas de un cuadro vivo de Ulises Adam';$('#hero-controls').innerHTML=heroPics.map((_,i)=>`<button data-hero="${i}" aria-label="Ver portada ${i+1}" aria-pressed="${i===0}"></button>`).join('')+'<button id="pause-hero" aria-label="Pausar animaciones" aria-pressed="false">Ⅱ</button>';let heroRequest=0;async function heroSlide(i){const request=++heroRequest;if(!await warmPhoto(heroPics[i])||request!==heroRequest)return;heroIndex=i;heroImage.src=heroPics[i];warmNext(heroPics,i);$$('[data-hero]').forEach(b=>b.setAttribute('aria-pressed',Number(b.dataset.hero)===i));}$$('[data-hero]').forEach(b=>b.addEventListener('click',()=>heroSlide(Number(b.dataset.hero))));const pauseButton=$('#pause-hero');pauseButton.addEventListener('click',()=>{heroPaused=!heroPaused;document.body.classList.toggle('motion-paused',heroPaused);pauseButton.textContent=heroPaused?'▶':'Ⅱ';pauseButton.setAttribute('aria-label',heroPaused?'Reanudar animaciones':'Pausar animaciones');pauseButton.setAttribute('aria-pressed',String(heroPaused))});heroTimer=setInterval(()=>{if(!heroPaused&&!prefersStill.matches&&!document.hidden&&!navigator.connection?.saveData&&hero.getBoundingClientRect().bottom>0)heroSlide((heroIndex+1)%heroPics.length)},4000);}
const featuredWorkshop=CATALOG.workshops.find(w=>['sí','si'].includes(String(w.featured).toLowerCase()));
if(featuredWorkshop){const w=featuredWorkshop;let date=w.date?new Date(String(w.date).slice(0,10)+'T12:00:00'):null;const dateText=date&&!isNaN(date)?date.toLocaleDateString('es-AR',{day:'numeric',month:'long'}):'Fecha a confirmar';$('#workshop-callout').hidden=false;$('#workshop-callout').innerHTML=`<div><p class="eyebrow">PRÓXIMO TALLER ABIERTO</p><h3>${esc(w.name)}</h3><p>${dateText}${w.start?' · '+esc(String(w.start).slice(0,5)):''}${w.place?' · '+esc(w.place):''}${typeof w.price==='number'?' · '+money(w.price):''}</p>${safeLink(w.link)?`<a class="text-link" href="${esc(safeLink(w.link))}" target="_blank" rel="noopener">Ver ubicación ↗</a>`:''}</div><button class="button light" id="workshop-callout-inquiry">Quiero participar ↗</button>`;$('#workshop-callout-inquiry').addEventListener('click',()=>{addSelection({name:'Taller abierto: '+w.name,details:dateText+' '+(w.place||'')});goContact()});const dateNote=$('.workshop-options .date-note');if(dateNote)dateNote.textContent=`${dateText}${w.start?' · '+String(w.start).slice(0,5):''}${w.place?' · '+w.place:''}`;}

// Additional photographs remain examples until a price and availability are confirmed.
if(photos('portrait').length){$('.portrait-placeholder').innerHTML=`<img src="${photos('portrait')[0]}" alt="Ulises trabajando en una creación artesanal" loading="lazy" decoding="async">`;}
$('.creation-grid').innerHTML=CATALOG.creationsAvailable.map((p,i)=>`<article class="product-card"><button data-creation-photo="${i}"><img src="${p.images[0]}" alt="${esc(p.name)}" loading="lazy" decoding="async"><h3>${esc(p.name)}</h3><p>${p.sold?'Vendido · No disponible':typeof p.price==='number'?money(p.price):'Consultar precio'}</p></button></article>`).join('');$$('[data-creation-photo]').forEach(b=>b.addEventListener('click',()=>showFeatured(CATALOG.creationsAvailable[Number(b.dataset.creationPhoto)])));
// Keep the supplied photographs; unify their presentation through a common color treatment.
function heroTone(){const pic=CATALOG.images.hero[heroIndex];heroImage.style.filter='saturate(.94) contrast(.97) brightness(.98)';heroImage.style.objectPosition='center 48%';}
heroTone();new MutationObserver(heroTone).observe(heroImage,{attributes:true,attributeFilter:['src']});


$('#all-creations').addEventListener('click',()=>{renderAvailable('creaciones');$('#available-tabs').scrollIntoView({behavior:prefersStill.matches?'instant':'smooth',block:'start'});});
const workshopDescriptions={
open:{title:'Taller abierto',kicker:'2.1 / VENÍ A COMPARTIR',body:'<p>Vení por tu cuenta o con alguien más y compartí la experiencia de armar un cuadro vivo con otras personas. Un encuentro para crear, aprender y disfrutar del proceso, con fecha, horario e inscripción previa.</p><p class="date-note">Próxima fecha · A confirmar</p><p>Al finalizar, cada participante se lleva su cuadro vivo armado.</p><p class="image-caption">Registrá tu interés. La consulta no confirma un cupo.</p>',action:'Quiero enterarme ↗',inquiry:'Me interesa la próxima fecha del taller abierto (preinscripción)'},
private:{title:'Taller para tu grupo',kicker:'2.2 / UN ENCUENTRO A TU MEDIDA',body:'<p>Compartí unas dos horas de creatividad y naturaleza para celebrar un cumpleaños o disfrutar un encuentro con amigos.</p><p>Llevo todos los materiales necesarios para que cada participante arme su cuadro vivo. Podemos hacerlo en tu casa, al aire libre o en un espacio interior; si necesitás otro lugar, lo coordinamos juntos.</p><p>La comida y las bebidas pueden estar a cargo del grupo o incluirse en la propuesta, a convenir.</p><p><strong>Al finalizar, cada participante se lleva su cuadro vivo armado.</strong></p><p class="date-note">Grupo privado · Valor por persona a consultar</p>',action:'Organicemos tu taller ↗',inquiry:'Quiero organizar un taller para mi grupo'}
};
$$('[data-workshop-detail]').forEach(b=>b.addEventListener('click',()=>{const w=workshopDescriptions[b.dataset.workshopDetail];$('#workshop-detail-title').textContent=w.title;$('#workshop-detail-kicker').textContent=w.kicker;$('#workshop-detail-body').innerHTML=w.body;if(b.dataset.workshopDetail==='open'&&featuredWorkshop){$('#workshop-detail-body .date-note').textContent=[featuredWorkshop.name,featuredWorkshop.date?.slice(0,10),featuredWorkshop.start,featuredWorkshop.place].filter(Boolean).join(' · ')}$('#workshop-detail-contact').textContent=w.action;$('#workshop-detail-contact').onclick=()=>{addSelection({name:w.inquiry,details:''});goContact()};openDialog($('#workshop-dialog'))}));
$$('.workshop-gallery').forEach(b=>b.addEventListener('click',()=>openPhoto(photos('taller'),'Galería de talleres')));
let workshopPaused=false;
$('#workshop-pause').addEventListener('click',()=>{workshopPaused=!workshopPaused;$('#workshop-pause').textContent=workshopPaused?'Reanudar fondo ▶':'Pausar fondo Ⅱ';$('#workshop-pause').setAttribute('aria-pressed',String(workshopPaused));$('#talleres').classList.toggle('background-paused',workshopPaused)});
setInterval(()=>{const r=$('#talleres').getBoundingClientRect();if(!workshopPaused&&!heroPaused&&!prefersStill.matches&&!document.hidden&&!navigator.connection?.saveData&&!$('dialog[open]')&&r.bottom>0&&r.top<innerHeight)workshopSlide((workshopIndex+1)%workshopImages.length)},4500);
// Touch navigation in the full gallery without shifting the underlying page.
let galleryTouch=0;$('#photo-large').addEventListener('touchstart',e=>{galleryTouch=e.changedTouches[0].clientX},{passive:true});$('#photo-large').addEventListener('touchend',e=>{const dx=e.changedTouches[0].clientX-galleryTouch;if(Math.abs(dx)>45){photoIndex=(photoIndex+(dx<0?1:-1)+photoList.length)%photoList.length;updatePhoto()}},{passive:true});

// Close the detail without resetting the current group or horizontal position.
$('#return-to-gallery').addEventListener('click',()=>$('#product-dialog').close());

// Compact choices on phones; the full cards remain on desktop.
const mobileModes=document.createElement('div');mobileModes.className='mobile-modes';mobileModes.setAttribute('aria-label','Elegí cómo recibir tu cuadro');
mobileModes.innerHTML=[['armado','1.1','Cuadro armado','Con suculentas · Listo para disfrutar'],['kit','1.2','Kit para armar','Cuadro con tierra + suculentas para plantar'],['sin-plantas','1.3','Cuadro con tierra','Sin plantas · Usá tus propias suculentas']].map(([id,n,title,detail])=>`<button type="button" data-mobile-mode="${id}"><span class="mobile-mode-number">${n}</span><span><strong>${title}</strong><small>${detail}</small></span><span aria-hidden="true">↗</span></button>`).join('');
$('#modalities').before(mobileModes);$$('[data-mobile-mode]').forEach(b=>b.addEventListener('click',()=>showProduct(b.dataset.mobileMode)));

// One compact navigation flow on mobile; details remain available in dialogs.
const customProposals=[
 {title:'Decoraciones a medida',detail:'Tu espacio, tu forma',description:'¿Querés darle vida a una pared? ¿Viste una creación que te gustaría adaptar a tu espacio? Pensemos juntos una propuesta a tu medida.'},
 {title:'Centros de mesa y souvenirs',detail:'Pequeños detalles, grandes momentos',description:'Suculentas para acompañar una celebración, un encuentro o un recuerdo compartido.'},
 {title:'Objetos con historia',detail:'Eso que guardás, ahora a la vista',description:'¿Tenés una medalla o un objeto que querés destacar? Podemos pensar un marco o una forma especial de mostrarlo.'}
];
const customMobile=document.createElement('div');customMobile.className='mobile-modes custom-mobile-modes';
customMobile.innerHTML=customProposals.map((p,i)=>`<button type="button" data-custom-detail="${i}"><span class="mobile-mode-number">4.${i+1}</span><span><strong>${esc(p.title)}</strong><small>${esc(p.detail)}</small></span><span aria-hidden="true">↗</span></button>`).join('');
$('.custom-grid').before(customMobile);
function showCustom(index){const p=customProposals[index];$('#custom-detail-title').textContent=p.title;$('#custom-detail-description').textContent=p.description;const groups=index===1?CATALOG.souvenirGroups:[];$('#custom-detail-photos').innerHTML=groups.map((g,i)=>`<article><h3>${esc(g.name)}</h3><button class="custom-group-photo" data-souvenir-group="${i}" aria-label="Ver fotos de ${esc(g.name)}"><img src="${g.images[0]}" alt="${esc(g.name)}" loading="lazy" decoding="async"><span>${g.images.length} fotos · Ver galería ↗</span></button></article>`).join('');$$('[data-souvenir-group]').forEach(b=>b.addEventListener('click',()=>{const g=groups[Number(b.dataset.souvenirGroup)];openPhoto(g.images,g.name,true)}));$('#custom-detail-inquiry').onclick=()=>{addSelection({name:p.title,details:''});goContact()};openDialog($('#custom-detail-dialog'))}
$$('[data-custom-detail]').forEach(b=>b.addEventListener('click',()=>showCustom(Number(b.dataset.customDetail))));
// Each souvenir folder is one proposal, with its pictures grouped together.
if(CATALOG.souvenirGroups.length){const visual=$$('.custom-grid article')[1].querySelector('.custom-visual');visual.innerHTML=`<button class="custom-group-photo" id="desktop-souvenirs"><img src="${CATALOG.souvenirGroups[0].images[0]}" alt="Souvenirs con suculentas" loading="lazy" decoding="async"><span>Ver propuestas ↗</span></button>`;visual.classList.add('has-photo');$('#desktop-souvenirs').addEventListener('click',()=>showCustom(1))}
// Visible workshop thumbnails replace the separate gallery launch button.
$('.workshop-gallery-strip').innerHTML=photos('taller').map((src,i)=>`<button type="button" data-workshop-photo="${i}" aria-label="Ampliar foto ${i+1} del taller"><img src="${src}" alt="Momento del taller ${i+1}" loading="lazy" decoding="async" decoding="async"></button>`).join('');
$$('[data-workshop-photo]').forEach(b=>b.addEventListener('click',()=>{openPhoto(photos('taller'),'Galería de talleres');photoIndex=Number(b.dataset.workshopPhoto);updatePhoto()}));
let workshopGalleryIndex=0;
setInterval(()=>{const track=$('.workshop-gallery-strip'),r=track.getBoundingClientRect();if(prefersStill.matches||heroPaused||workshopPaused||document.hidden||navigator.connection?.saveData||$('dialog[open]')||r.bottom<0||r.top>innerHeight||track.children.length<2)return;workshopGalleryIndex=(workshopGalleryIndex+1)%track.children.length;track.scrollTo({left:track.children[workshopGalleryIndex].offsetLeft-track.children[0].offsetLeft,behavior:'smooth'})},4500);
// Contact and portrait share one mobile panel, with a collapsible form.
if(photos('portrait').length){$('.mobile-contact-portrait').src=photos('portrait')[0];$('.mobile-contact-portrait').loading='lazy';}
const contactScreen=matchMedia('(max-width:760px)');
function contactLayout(){const panel=$('#contact-form-panel');panel.open=!contactScreen.matches;}
contactLayout();contactScreen.addEventListener('change',contactLayout);
function directInquiry(){const details=selection.length?'Hola, me interesa:\n'+selection.map(s=>'- '+s.name+(s.details?' ('+s.details+')':'')).join('\n'):'Hola, me gustaría hacer una consulta sobre Cuadros Vivos.';$('#direct-whatsapp').href='https://wa.me/5491153776987?text='+encodeURIComponent(details);$('#direct-email').href='mailto:ulises_adam@yahoo.com.ar?subject='+encodeURIComponent('Consulta desde Cuadros Vivos')+'&body='+encodeURIComponent(details)}
const previousRenderSelection=renderSelection;
renderSelection=function(){previousRenderSelection();directInquiry()};directInquiry();
// Opening a prepared inquiry still offers the optional form without forcing it.
const previousGoContact=goContact;
goContact=function(){closeDialogs();directInquiry();location.hash='contacto';if(!contactScreen.matches)setTimeout(()=>$('#contact-form input').focus({preventScroll:true}),100)};
// Do not append an empty message label when the optional field is blank.
$('#contact-form').addEventListener('submit',()=>{if(!$('[name=mensaje]').value.trim()){$('#message-preview').value=$('#message-preview').value.replace(/Mensaje:\s*$/,'').trim();const text=$('#message-preview').value;$('#send-whatsapp').href='https://wa.me/5491153776987?text='+encodeURIComponent(text);$('#send-email').href='mailto:ulises_adam@yahoo.com.ar?subject='+encodeURIComponent('Consulta desde Cuadros Vivos')+'&body='+encodeURIComponent(text)}});

// Small cutout illustrations make the three mobile choices explicit.
const drawnModes=[
 ['armado','1.1','Cuadro armado','Con suculentas · Listo para disfrutar','assets/opcion-armado.webp'],
 ['kit','1.2','Kit para armar','Cuadro con tierra + suculentas para plantar','assets/opcion-kit-plus.webp'],
 ['sin-plantas','1.3','Cuadro con tierra','Sin plantas · Usá tus propias suculentas','assets/opcion-sin-plantas.webp']
];
const modesHint=document.createElement('p');modesHint.className='mode-entry-hint';modesHint.textContent='Elegí una opción para ver fotos, medidas y precios';mobileModes.before(modesHint);
mobileModes.innerHTML=drawnModes.map(([id,num,title,description,src])=>`<button type="button" class="illustrated-mode" data-mobile-mode="${id}"><span class="mobile-mode-number">${num}</span><span class="illustrated-mode-copy"><strong>${title}</strong><small>${description}</small><span class="mode-entry-action">Ver opciones →</span></span><img src="${src}" alt="" decoding="async" loading="lazy" decoding="async"></button>`).join('');
$$('[data-mobile-mode]').forEach(b=>b.addEventListener('click',()=>showProduct(b.dataset.mobileMode)));
$$('#modalities .mode-copy .text-link').forEach(b=>b.textContent='Ver opciones →');
// Fixed preview stages keep image changes from moving navigation controls.
function addImageStage(img,container,buttonClass){const stage=document.createElement('div');stage.className='stable-image-stage';img.before(stage);stage.append(img);const toggle=document.createElement('button');toggle.type='button';toggle.className='text-link whole-image '+buttonClass;toggle.textContent='Ver foto completa';stage.after(toggle);toggle.addEventListener('click',()=>{const whole=stage.classList.toggle('show-whole');toggle.textContent=whole?'Ajustar al recuadro':'Ver foto completa'});return stage}
addImageStage($('#product-main'),$('.product-gallery'),'product-whole');
addImageStage($('#photo-large'),$('.photo-view'),'gallery-whole');
const swipeHint=document.createElement('p');swipeHint.className='photo-hint';swipeHint.textContent='Deslizá para ver más';$('.photo-navigation').after(swipeHint);
// The footer uses one thin row rather than a tall stack.
const footerBrand=$('footer .brand');footerBrand.innerHTML='Cuadros Vivos <span>por Ulises Adam</span>';
// Keep the full selection list and gallery consistent when products have several photos.
for(const p of [...CATALOG.featured,...CATALOG.creationsAvailable]){if(!p.images.length)continue;}

// Keep the plus sign as small white UI text, separate from the two illustrations.
const kitDrawing=document.querySelector('.illustrated-mode[data-mobile-mode="kit"]>img');
if(kitDrawing){const parts=document.createElement('span');parts.className='kit-components';parts.setAttribute('aria-hidden','true');parts.innerHTML='<svg viewBox="0 0 900 724" focusable="false"><image href="assets/opcion-kit-plus.webp" width="2172" height="724"/></svg><span class="kit-text-plus">+</span><svg viewBox="1335 0 837 724" focusable="false"><image href="assets/opcion-kit-plus.webp" width="2172" height="724"/></svg>';kitDrawing.replaceWith(parts);}

// Keep navigation beside the filters and in view while browsing the pieces.
const availableControls=document.createElement('div');availableControls.className='available-controls';
const availableTabs=$('#available-tabs');availableTabs.before(availableControls);availableControls.append(availableTabs,$('.catalog-head .arrows'));
const creationsIntro=$('#creaciones .section-head>div>p:not(.eyebrow)');
const creationsIntroRow=document.createElement('div');creationsIntroRow.className='creations-intro-row';
creationsIntro.before(creationsIntroRow);creationsIntroRow.append(creationsIntro,$('#all-creations'));
const originalFeaturedView=showFeatured;
showFeatured=function(piece){originalFeaturedView(piece);const complete=['Mujer','Niña Magda'].includes(piece.name);const stage=$('#product-main').closest('.stable-image-stage');stage.classList.toggle('show-whole',complete);$('.product-whole').textContent=complete?'Ajustar al recuadro':'Ver foto completa'};
const originalModeView=showProduct;
showProduct=function(...args){originalModeView(...args);$('#product-main').closest('.stable-image-stage').classList.remove('show-whole');$('.product-whole').textContent='Ver foto completa'};



// The upper section itself ends in a curve: the next background shows below it.
const boundarySections=[...document.querySelectorAll('main>section[id]')];
boundarySections.slice(0,-1).forEach((section,i)=>{
 const curveHeight=matchMedia('(max-width:760px)').matches?28:42;
 const points=Array.from({length:101},(_,n)=>{
  const x=n/100;const y=21-12*Math.sin(x*Math.PI*2+0.25);
  return [x*1440,y];
 });
 section.style.position='relative';section.style.zIndex=String(10-i);
 section.style.setProperty('padding-bottom',(parseFloat(getComputedStyle(section).paddingBottom)+curveHeight+8)+'px','important');
 section.style.marginBottom=-curveHeight+'px';
 const next=boundarySections[i+1];next.style.setProperty('padding-top',Math.max(44,parseFloat(getComputedStyle(next).paddingTop))+'px','important');
 section.style.clipPath='polygon(0 0,100% 0,'+points.slice().reverse().map(([x,y])=>`${x/14.4}% calc(100% - ${(42-y)*curveHeight/42}px)`).join(',')+')';
 const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');
 svg.setAttribute('viewBox','0 0 1440 42');svg.setAttribute('preserveAspectRatio','none');svg.setAttribute('aria-hidden','true');svg.classList.add('section-curve');
 svg.style.height=curveHeight+'px';
 const curvePath=(list)=>'M'+list.map(p=>p.join(' ')).join(' L');
 svg.innerHTML='<path fill="none" stroke="#BF963C" stroke-width="2"/>';
 const updateGap=()=>{const gap=20/section.clientWidth*1440;const left=points.filter(p=>p[0]<720-gap);const right=points.filter(p=>p[0]>720+gap);svg.firstChild.setAttribute('d',curvePath(left)+' '+curvePath(right));};updateGap();new ResizeObserver(updateGap).observe(section);
 document.body.append(svg);
 svg.style.position='absolute';svg.style.bottom='auto';svg.style.zIndex='14';
 const placeStroke=()=>{const r=section.getBoundingClientRect();svg.style.top=(scrollY+r.bottom-curveHeight)+'px';svg.style.left=r.left+'px';svg.style.width=r.width+'px';};placeStroke();
 const strokeObserver=new ResizeObserver(placeStroke);strokeObserver.observe(document.querySelector('main'));window.addEventListener('resize',placeStroke);
 const flower=document.createElementNS('http://www.w3.org/2000/svg','svg');
 flower.setAttribute('viewBox','0 0 48 32');flower.setAttribute('aria-hidden','true');flower.classList.add('boundary-flower');
 flower.style.cssText='position:absolute;left:50%;transform:translateX(-50%);bottom:'+Math.round(curveHeight*.43)+'px;width:32px;height:32px;pointer-events:none;z-index:9';
 flower.innerHTML='<g fill="none" stroke="#BF963C" stroke-width="1.15" stroke-linecap="round" stroke-linejoin="round"><path d="M24 29 C13 29 7 23 5 17 C13 15 20 20 24 29 C28 20 35 15 43 17 C41 23 35 29 24 29Z M24 24 C15 21 12 14 14 8 C21 9 25 15 24 24 C23 15 27 9 34 8 C36 14 33 21 24 24Z M18 10 Q19 4 24 1 Q29 4 30 10 M9 17 Q7 12 9 8 Q13 8 15 11 M39 17 Q41 12 39 8 Q35 8 33 11"/></g>';
 document.body.append(flower);
 flower.style.position='absolute';flower.style.zIndex='15';flower.style.bottom='auto';
 const placeFlower=()=>{const r=section.getBoundingClientRect();const y=(21-12*Math.sin(Math.PI+.25))*curveHeight/42;flower.style.top=(scrollY+r.bottom-curveHeight+y-16)+'px';flower.style.left=(r.left+r.width/2)+'px';};placeFlower();new ResizeObserver(placeFlower).observe(document.querySelector('main'));window.addEventListener('resize',placeFlower);
});
// A persistent control works even when the operating system hides scrollbars.
const communityTrack=document.querySelector('#community-track');
const communityNav=document.createElement('div');communityNav.className='community-navigation';
communityNav.innerHTML='<button type="button" aria-label="Fotos anteriores de Comunidad">←</button><label><span>Deslizá para ver más fotos</span><input type="range" min="0" max="100" value="0" aria-label="Recorrer fotos de Comunidad"></label><button type="button" aria-label="Más fotos de Comunidad">→</button>';
communityTrack.after(communityNav);
const communityRange=communityNav.querySelector('input');
const syncCommunity=()=>{const max=communityTrack.scrollWidth-communityTrack.clientWidth;communityRange.value=max>0?100*communityTrack.scrollLeft/max:0;communityNav.hidden=max<=1;};
communityRange.addEventListener('input',()=>{communityTrack.scrollLeft=(communityTrack.scrollWidth-communityTrack.clientWidth)*communityRange.value/100;});
communityNav.querySelectorAll('button').forEach((b,i)=>b.addEventListener('click',()=>communityTrack.scrollBy({left:(i?1:-1)*communityTrack.clientWidth*.75,behavior:'smooth'})));
communityTrack.addEventListener('scroll',syncCommunity,{passive:true});new ResizeObserver(syncCommunity).observe(communityTrack);
let communityDrag=null,communitySuppressClick=false;
communityTrack.addEventListener('dragstart',e=>e.preventDefault());
communityTrack.addEventListener('pointerdown',e=>{if(e.pointerType==='mouse'&&e.button===0){communitySuppressClick=false;communityDrag={x:e.clientX,left:communityTrack.scrollLeft};}});
window.addEventListener('pointermove',e=>{if(!communityDrag)return;const dx=e.clientX-communityDrag.x;if(Math.abs(dx)>5){communitySuppressClick=true;communityTrack.classList.add('dragging');communityTrack.scrollLeft=communityDrag.left-dx;}});
window.addEventListener('pointerup',()=>{communityDrag=null;communityTrack.classList.remove('dragging');});
window.addEventListener('blur',()=>{communityDrag=null;communityTrack.classList.remove('dragging');});
communityTrack.addEventListener('click',e=>{if(communitySuppressClick){e.preventDefault();e.stopImmediatePropagation();communitySuppressClick=false;}},true);
syncCommunity();

if(matchMedia('(min-width:761px)').matches)document.getElementById('contact-form-panel').open=false;

document.querySelector('.about .eyebrow')?.remove();document.querySelector('.about h2')?.remove();

const communityWrap=document.createElement('div');communityWrap.className='community-carousel';communityTrack.before(communityWrap);communityWrap.append(communityTrack,communityNav);

const creationArrows=document.createElement('div');creationArrows.className='creations-arrows';creationArrows.innerHTML='<button type="button" aria-label="Creaciones anteriores">←</button><button type="button" aria-label="Más creaciones">→</button>';document.querySelector('.creations-intro-row').append(creationArrows);creationArrows.querySelectorAll('button').forEach((b,i)=>b.addEventListener('click',()=>{const track=document.querySelector('.creation-grid');track.scrollBy({left:(i?1:-1)*track.clientWidth*.8,behavior:prefersStill.matches?'instant':'smooth'})}));
