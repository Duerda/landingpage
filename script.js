const menuButton=document.querySelector('.menu-toggle');
const nav=document.querySelector('nav');
menuButton?.addEventListener('click',()=>{const open=nav.classList.toggle('open');menuButton.setAttribute('aria-expanded',String(open));});
nav?.querySelectorAll('a').forEach(link=>link.addEventListener('click',()=>{nav.classList.remove('open');menuButton?.setAttribute('aria-expanded','false');}));

const slides=[...document.querySelectorAll('.slide')];
const dots=document.querySelector('.dots');
const next=document.querySelector('.next');
const prev=document.querySelector('.prev');
const play=document.querySelector('.carousel-play');
let current=0;
let timer;
let playing=true;

slides.forEach((_,index)=>{
  const dot=document.createElement('button');
  dot.className=`dot${index===0?' active':''}`;
  dot.setAttribute('aria-label',`Mostrar imagem ${index+1}`);
  dot.addEventListener('click',()=>showSlide(index));
  dots?.appendChild(dot);
});
const dotButtons=()=>[...document.querySelectorAll('.dot')];
function showSlide(index){
  current=(index+slides.length)%slides.length;
  slides.forEach((slide,i)=>slide.classList.toggle('active',i===current));
  dotButtons().forEach((dot,i)=>dot.classList.toggle('active',i===current));
}
function start(){clearInterval(timer);timer=setInterval(()=>showSlide(current+1),4500);playing=true;if(play)play.textContent='Ⅱ';}
function stop(){clearInterval(timer);playing=false;if(play)play.textContent='▶';}
next?.addEventListener('click',()=>{showSlide(current+1);if(playing)start();});
prev?.addEventListener('click',()=>{showSlide(current-1);if(playing)start();});
play?.addEventListener('click',()=>playing?stop():start());
start();

let startX=0;
const carousel=document.querySelector('.carousel');
carousel?.addEventListener('touchstart',event=>{startX=event.changedTouches[0].screenX;},{passive:true});
carousel?.addEventListener('touchend',event=>{const distance=event.changedTouches[0].screenX-startX;if(Math.abs(distance)>45){distance<0?next?.click():prev?.click();}},{passive:true});
carousel?.addEventListener('mouseenter',()=>{if(playing)clearInterval(timer);});
carousel?.addEventListener('mouseleave',()=>{if(playing)start();});
