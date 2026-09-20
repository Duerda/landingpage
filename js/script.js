const menu = document.querySelector('.menu');
const nav = document.querySelector('nav');
menu?.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menu.setAttribute('aria-expanded', String(open));
  menu.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
});
nav?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  nav.classList.remove('open'); menu?.setAttribute('aria-expanded', 'false');
}));
document.querySelector('#contact-form')?.addEventListener('submit', event => {
  event.preventDefault();
  const status = document.querySelector('.form-status');
  status.textContent = 'Mensagem preparada — em uma próxima etapa, conectamos este formulário ao canal de atendimento da cafeteria.';
  event.currentTarget.reset();
});
