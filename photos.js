'use strict';
const mobilePhotos=matchMedia('(max-width: 760px)').matches;
function webImage(src){return mobilePhotos&&/\.webp$/.test(src)?src.replace(/\.webp$/,'-mobile.webp'):src}
function adaptPhotos(value){if(typeof value==='string')return webImage(value);if(Array.isArray(value))return value.map(adaptPhotos);if(value&&typeof value==='object'){for(const key of Object.keys(value))value[key]=adaptPhotos(value[key])}return value}
adaptPhotos(window.IMAGES);adaptPhotos(window.CATALOG);
const warmedPhotos=new Map();
function warmPhoto(src){if(!warmedPhotos.has(src)){const img=new Image();img.decoding='async';img.src=src;warmedPhotos.set(src,img.decode().then(()=>true).catch(()=>false))}return warmedPhotos.get(src)}
function warmNext(list,index){if(list.length>1)warmPhoto(list[(index+1)%list.length])}

for(const id of ['workshop-photo','workshop-backdrop-photo']){const el=document.getElementById(id);if(el){const initial=el.getAttribute('src');if(initial)el.src=webImage(initial);el.removeAttribute('srcset')}}
