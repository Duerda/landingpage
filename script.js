const trigger = document.querySelector('.nav-trigger');
const mobileNav = document.querySelector('.mobile-nav');
trigger?.addEventListener('click', () => {
  const open = mobileNav.classList.toggle('open');
  trigger.setAttribute('aria-expanded', String(open));
});
mobileNav?.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
  mobileNav.classList.remove('open');
  trigger?.setAttribute('aria-expanded', 'false');
}));

const track = document.querySelector('.journal-track');
const slides = [...document.querySelectorAll('.journal-track figure')];
const counter = document.querySelector('.journal-count');
const previous = document.querySelector('.journal-prev');
const next = document.querySelector('.journal-next');
let index = 0;
function updateJournal() {
  const gap = 15;
  const slideWidth = slides[0]?.getBoundingClientRect().width || 0;
  track.style.transform = `translateX(-${index * (slideWidth + gap)}px)`;
  if (counter) counter.textContent = `${String(index + 1).padStart(2, '0')} / ${String(slides.length).padStart(2, '0')}`;
}
next?.addEventListener('click', () => { index = (index + 1) % slides.length; updateJournal(); });
previous?.addEventListener('click', () => { index = (index - 1 + slides.length) % slides.length; updateJournal(); });
window.addEventListener('resize', updateJournal);
updateJournal();

let touchStart = 0;
track?.addEventListener('touchstart', (event) => { touchStart = event.changedTouches[0].screenX; }, { passive: true });
track?.addEventListener('touchend', (event) => {
  const distance = event.changedTouches[0].screenX - touchStart;
  if (Math.abs(distance) > 45) distance < 0 ? next?.click() : previous?.click();
}, { passive: true });

const reveal = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.animate([
        { opacity: 0, transform: 'translateY(18px)' },
        { opacity: 1, transform: 'translateY(0)' }
      ], { duration: 650, easing: 'cubic-bezier(.2,.8,.2,1)', fill: 'forwards' });
      reveal.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll('.manifesto, .menu-item, .photo-journal, .address-section').forEach((element) => reveal.observe(element));
