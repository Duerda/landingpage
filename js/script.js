const menuData = {
  cafes: [
    { name: 'Espresso Delícia', description: 'Intenso, doce e com final de chocolate.', price: 7.5, image: 'assets/cafe-interior.jpg' },
    { name: 'Latte da Casa', description: 'Leite vaporizado, espresso e calma.', price: 12, image: 'assets/cafe-interior.jpg' },
    { name: 'Coado do Dia', description: 'Um grão especial escolhido para hoje.', price: 9, image: 'assets/cafe-interior.jpg' },
    { name: 'Cappuccino', description: 'Creme de leite, canela e aconchego.', price: 13.5, image: 'assets/pastries.jpg' },
    { name: 'Cold Brew', description: 'Extração lenta, gelada e refrescante.', price: 14, image: 'assets/cafe-interior.jpg' },
    { name: 'Mocha', description: 'Espresso, chocolate e leite cremoso.', price: 15, image: 'assets/pastries.jpg' },
  ],
  doces: [
    { name: 'Bolo de cenoura', description: 'Fatia generosa com calda de chocolate.', price: 12, image: 'assets/pastries.jpg' },
    { name: 'Croissant de amêndoas', description: 'Folhado, dourado e recheado na casa.', price: 14.5, image: 'assets/pastries.jpg' },
    { name: 'Cookie de chocolate', description: 'Crocante por fora, macio por dentro.', price: 9, image: 'assets/pastries.jpg' },
    { name: 'Torta de maçã', description: 'Maçã, canela e massa amanteigada.', price: 15, image: 'assets/pastries.jpg' },
    { name: 'Pão de mel', description: 'Mel, especiarias e cobertura delicada.', price: 8, image: 'assets/pastries.jpg' },
    { name: 'Brigadeiro de café', description: 'Pequeno, intenso e impossível de parar.', price: 6, image: 'assets/pastries.jpg' },
  ],
  salgados: [
    { name: 'Pão de queijo', description: 'Quentinho, mineiro e sem economia de queijo.', price: 8, image: 'assets/pastries.jpg' },
    { name: 'Toast caprese', description: 'Pão rústico, tomate, pesto e muçarela.', price: 18, image: 'assets/cafe-interior.jpg' },
    { name: 'Quiche do dia', description: 'Massa dourada e recheio que muda sempre.', price: 17, image: 'assets/pastries.jpg' },
    { name: 'Sanduíche Delícia', description: 'Presunto, queijo, folhas e molho da casa.', price: 20, image: 'assets/cafe-interior.jpg' },
    { name: 'Focaccia', description: 'Azeite, alecrim e uma borda irresistível.', price: 13, image: 'assets/pastries.jpg' },
    { name: 'Tostado de cogumelos', description: 'Cogumelos, queijo cremoso e ervas.', price: 21, image: 'assets/cafe-interior.jpg' },
  ],
};

const state = { category: 'cafes', order: [] };
const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const money = (value) => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

function toast(message) {
  const element = $('#toast');
  element.textContent = message;
  element.classList.add('show');
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => element.classList.remove('show'), 2600);
}

function renderMenu() {
  const grid = $('#menu-grid');
  const items = menuData[state.category];
  grid.innerHTML = items.map((item, index) => `<article class="menu-card"><div class="menu-card-image"><img src="${item.image}" alt="${item.name}" loading="lazy"></div><div class="menu-card-content"><h3>${item.name}</h3><p>${item.description}</p><div class="menu-card-bottom"><span class="menu-price">${money(item.price)}</span><button class="add-item" data-menu-index="${index}" aria-label="Adicionar ${item.name}">＋</button></div></div></article>`).join('');
  $$('[data-menu-index]', grid).forEach((button) => button.addEventListener('click', () => addToOrder(items[Number(button.dataset.menuIndex)])));
}

function addToOrder(item) {
  const existing = state.order.find((orderItem) => orderItem.name === item.name);
  if (existing) existing.quantity += 1;
  else state.order.push({ ...item, quantity: 1 });
  updateOrder();
  toast(`${item.name} entrou no pedido`);
}

function orderTotal() { return state.order.reduce((total, item) => total + item.price * item.quantity, 0); }
function updateOrder() {
  const count = state.order.reduce((total, item) => total + item.quantity, 0);
  const bar = $('#order-bar');
  bar.hidden = count === 0;
  $('#order-count').textContent = `${count} ${count === 1 ? 'item' : 'itens'}`;
  $('#order-total').textContent = money(orderTotal());
  $('#drawer-total').textContent = money(orderTotal());
  $('#order-items').innerHTML = state.order.length ? state.order.map((item, index) => `<div class="order-item"><div><strong>${item.name}</strong><small>${item.quantity} × ${money(item.price)}</small></div><div><span class="order-item-price">${money(item.price * item.quantity)}</span><button class="remove-order" data-order-index="${index}" aria-label="Remover ${item.name}">×</button></div></div>`).join('') : '<p class="empty-order">Seu pedido está esperando um café.</p>';
  $$('[data-order-index]').forEach((button) => button.addEventListener('click', () => { state.order.splice(Number(button.dataset.orderIndex), 1); updateOrder(); }));
}

function openReservation() { $('#reservation-modal').hidden = false; document.body.classList.add('modal-open'); $('#reservation-modal input')?.focus(); }
function closeReservation() { $('#reservation-modal').hidden = true; document.body.classList.remove('modal-open'); }

function init() {
  renderMenu();
  updateOrder();

  $$('.menu-tab').forEach((tab) => tab.addEventListener('click', () => { state.category = tab.dataset.category; $$('.menu-tab').forEach((button) => button.classList.toggle('active', button === tab)); renderMenu(); }));
  $('#order-open').addEventListener('click', () => { $('#order-drawer').classList.add('is-open'); $('#order-drawer').setAttribute('aria-hidden', 'false'); });
  $('#order-close').addEventListener('click', () => { $('#order-drawer').classList.remove('is-open'); $('#order-drawer').setAttribute('aria-hidden', 'true'); });
  $('#finish-order').addEventListener('click', () => { if (!state.order.length) return; toast('Pedido anotado — retire na nossa casa!'); $('#order-drawer').classList.remove('is-open'); });

  $('#reserve-open').addEventListener('click', openReservation);
  $('#reserve-open-visit').addEventListener('click', openReservation);
  $('#reservation-close').addEventListener('click', closeReservation);
  $('#reservation-modal').addEventListener('click', (event) => { if (event.target.id === 'reservation-modal') closeReservation(); });
  $('#reservation-form').addEventListener('submit', (event) => { event.preventDefault(); const date = new FormData(event.currentTarget).get('date'); const readableDate = new Date(`${date}T12:00:00`).toLocaleDateString('pt-BR'); closeReservation(); event.currentTarget.reset(); toast(`Reserva solicitada para ${readableDate}. A gente confirma por telefone.`); });
  document.addEventListener('keydown', (event) => { if (event.key === 'Escape') { closeReservation(); $('#order-drawer').classList.remove('is-open'); } });

  $('#newsletter-form').addEventListener('submit', (event) => { event.preventDefault(); const email = $('#newsletter-email').value; event.currentTarget.reset(); toast(`Pronto. As novidades vão para ${email}.`); });
  $('#menu-toggle').addEventListener('click', () => $('#nav-links').classList.toggle('is-open'));
  $$('.nav-links a').forEach((link) => link.addEventListener('click', () => $('#nav-links').classList.remove('is-open')));
}

document.addEventListener('DOMContentLoaded', init);
