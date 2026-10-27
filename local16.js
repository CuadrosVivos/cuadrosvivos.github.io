'use strict';
// Local draft: presentation text and gallery navigation, reviewed before publication.
const referenceNote='Imágenes de referencia del trabajo artesanal. Cada pieza puede variar. Consultar stock de colores y tamaños disponibles.';
const panelNote='Combiná paneles de 30 × 30 cm en vertical, horizontal o creando distintas formas. Podés colocarlos juntos o separados; para formar una pared viva continua, elegí preferentemente la opción sin marco.';
function updatePieceCaption(){const note=document.querySelector('.product-gallery>.image-caption');if(!note)return;note.textContent=activeProduct?.featured?(activeProduct.photoCaption||'La foto corresponde a la pieza disponible. Consultame si querés una propuesta personalizada.'):(document.querySelector('#product-main').getAttribute('src')===CATALOG.panelImage?panelNote:referenceNote);}
const setImageBeforeLocal=setProductImage;
setProductImage=function(src){setImageBeforeLocal(src);updatePieceCaption();};
const featuredBeforeLocal=showFeatured;
showFeatured=function(piece){featuredBeforeLocal(piece);updatePieceCaption();document.querySelector('#product-details').innerHTML=`<details open><summary>Detalles</summary><p>${esc(piece.detail||piece.description)}${!piece.detail&&piece.width&&piece.height?' '+esc(piece.width+' × '+piece.height+' cm'):''}</p></details>`;};
const productBeforeLocal=showProduct;
showProduct=function(id,initial){productBeforeLocal(id,initial);updatePieceCaption();};
// Keep titles outside the images, and name the selected photo in the enlarged gallery.
const communityEntries=CATALOG.images.community;
document.querySelector('#community-track').innerHTML=communityEntries.map((p,i)=>`<article class="product-card"><button type="button" data-community-local="${i}" aria-label="Ver ${esc(p.name)}"><img src="${p.src}" alt="${esc(p.name)}" loading="lazy" decoding="async" draggable="false"><h3>${esc(p.name)}</h3></button></article>`).join('');
document.querySelectorAll('[data-community-local]').forEach(b=>b.addEventListener('click',()=>{openPhoto(inspiration,communityEntries[Number(b.dataset.communityLocal)].name);photoIndex=Number(b.dataset.communityLocal);updatePhoto();}));
const updateBeforeLocal=updatePhoto;
updatePhoto=function(){updateBeforeLocal();if(photoList===inspiration)document.querySelector('#photo-title').textContent=communityEntries[photoIndex]?.name||'Comunidad';};
// Creations uses the same side arrows and direct dragging as Community.
const creationsTrack=document.querySelector('.creation-grid');
const creationsWrap=document.createElement('div');creationsWrap.className='creations-carousel';creationsTrack.before(creationsWrap);creationsWrap.append(creationsTrack,document.querySelector('.creations-arrows'));
creationsTrack.setAttribute('aria-label','Galería de creaciones; arrastrá o usá las flechas');
let creationDrag=null,creationSuppress=false;
creationsTrack.addEventListener('dragstart',e=>e.preventDefault());
creationsTrack.addEventListener('pointerdown',e=>{if(e.pointerType==='mouse'&&e.button===0){creationSuppress=false;creationDrag={x:e.clientX,left:creationsTrack.scrollLeft};}});
window.addEventListener('pointermove',e=>{if(!creationDrag)return;const dx=e.clientX-creationDrag.x;if(Math.abs(dx)>5){creationSuppress=true;creationsTrack.classList.add('dragging');creationsTrack.scrollLeft=creationDrag.left-dx;}});
function finishCreationDrag(){creationDrag=null;creationsTrack.classList.remove('dragging');}
window.addEventListener('pointerup',finishCreationDrag);window.addEventListener('pointercancel',finishCreationDrag);window.addEventListener('blur',finishCreationDrag);
creationsTrack.addEventListener('click',e=>{if(creationSuppress){e.preventDefault();e.stopImmediatePropagation();creationSuppress=false;}},true);
const creationButtons=[...document.querySelectorAll('.creations-arrows button')];
function syncCreationArrows(){const max=creationsTrack.scrollWidth-creationsTrack.clientWidth;document.querySelector('.creations-arrows').hidden=max<=1;creationButtons[0].disabled=creationsTrack.scrollLeft<2;creationButtons[1].disabled=creationsTrack.scrollLeft>max-2;}
creationsTrack.addEventListener('scroll',syncCreationArrows,{passive:true});new ResizeObserver(syncCreationArrows).observe(creationsTrack);syncCreationArrows();

// Each folder provides one editable title, description and group of photographs.
const customBeforeMemories=showCustom;
function showMemoryGroup(g){openPhoto(g.images,g.name,true);let description=document.querySelector('#photo-description');if(!description){description=document.createElement('p');description.id='photo-description';document.querySelector('#photo-title').after(description);}description.textContent=g.description;description.hidden=false;}
const openBeforeMemory=openPhoto;
openPhoto=function(images,title,inquiry=false){openBeforeMemory(images,title,inquiry);const description=document.querySelector('#photo-description');if(description){description.textContent='';description.hidden=true;}};
showCustom=function(index){customBeforeMemories(index);if(index!==2)return;document.querySelector('#custom-detail-description').textContent='Dale un lugar especial a eso que querés conservar.';const groups=CATALOG.memoryGroups||[];document.querySelector('#custom-detail-photos').innerHTML=groups.map((g,i)=>`<article><h3>${esc(g.name)}</h3><button class="custom-group-photo" data-memory-group="${i}" aria-label="Ver ${esc(g.name)}"><img src="${g.images[0]}" alt="${esc(g.name)}" loading="lazy" decoding="async"><span>Ver galería ↗</span></button><p class="memory-description">${esc(g.description)}</p><p class="memory-caption">${esc(g.caption||'')}</p></article>`).join('');document.querySelectorAll('[data-memory-group]').forEach(button=>button.addEventListener('click',()=>showMemoryGroup(groups[Number(button.dataset.memoryGroup)])));};
if(CATALOG.memoryGroups?.length){const visual=document.querySelectorAll('.custom-grid article')[2].querySelector('.custom-visual');visual.classList.add('has-photo');visual.innerHTML=`<button class="custom-group-photo" id="desktop-memories" aria-label="Ver Recuerdos a la vista"><img src="${CATALOG.memoryGroups[0].images[0]}" alt="Recuerdos a la vista: ejemplos de objetos enmarcados" loading="lazy" decoding="async"><span>Ver propuestas ↗</span></button>`;visual.querySelector('button').addEventListener('click',()=>showCustom(2));}
