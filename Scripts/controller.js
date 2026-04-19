import * as Model from './model.js';
import * as View from './view.js';

function handleOpenModal(id) {
  Model.setModalQty(id, 1);
  View.setModalQtyDisplay(id, 1, Model.PRODUCTS[id].price);
  View.openModal(id);
}

function handleChangeQty(id, delta) {
  const qty = Model.changeModalQty(id, delta);
  View.setModalQtyDisplay(id, qty, qty * Model.PRODUCTS[id].price);
}

function handleQtyInput(id) {
  const input = document.getElementById(`${id}Qty`);
  const parsed = parseInt(input.value, 10);
  if (!isNaN(parsed) && parsed >= 1) {
    Model.setModalQty(id, parsed);
    View.setPriceDisplay(id, parsed * Model.PRODUCTS[id].price);
  }
}

function handleAddToCart(id) {
  Model.addToCart(id);
  View.updateCartBadge(Model.getCartTotal());
  View.closeModal(id);
}

function refreshBasket() {
  View.renderBasket(Model.getCartEntries(), Model.PRODUCTS, {
    onDecrement: (id) => { Model.decrementCart(id); refreshBasket(); },
    onIncrement: (id) => { Model.incrementCart(id); refreshBasket(); },
    onRemove:    (id) => { Model.removeFromCart(id); refreshBasket(); }
  });
  View.updateCartBadge(Model.getCartTotal());
}

function handleOpenBasket() {
  refreshBasket();
  View.openBasketModal();
}

function handleFilterItems(category, e) {
  const cards = document.querySelectorAll('.card');
  const tabs  = document.querySelectorAll('.tab');

  if (category === 'all') {
    tabs.forEach(tab => tab.classList.remove('active'));
    e.currentTarget.classList.add('active');
    cards.forEach(card => card.classList.remove('dimmed'));
    return;
  }

  const allTab = document.querySelector('.tab[data-category="all"]');
  if (allTab) allTab.classList.remove('active');
  e.currentTarget.classList.toggle('active');

  const activeCategories = [...document.querySelectorAll('.tab.active')]
    .map(tab => tab.dataset.category)
    .filter(c => c && c !== 'all');

  if (activeCategories.length === 0) {
    if (allTab) allTab.classList.add('active');
    cards.forEach(card => card.classList.remove('dimmed'));
    return;
  }

  cards.forEach(card => {
    const matches = activeCategories.some(c => card.classList.contains(c));
    card.classList.toggle('dimmed', !matches);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('modals-container');

  for (const [id, product] of Object.entries(Model.PRODUCTS)) {
    const modal = View.buildProductModal(id, product, {
      onClose:     () => View.closeModal(id),
      onDecrease:  () => handleChangeQty(id, -1),
      onIncrease:  () => handleChangeQty(id, 1),
      onQtyInput:  () => handleQtyInput(id),
      onAddToCart: () => handleAddToCart(id)
    });
    container.appendChild(modal);
  }

  container.appendChild(View.buildBasketModal(() => View.closeBasketModal()));

  document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', (e) => handleFilterItems(tab.dataset.category, e));
  });

  document.querySelector('.cart-btn').addEventListener('click', handleOpenBasket);

  document.querySelectorAll('.card[data-product]').forEach(card => {
    card.addEventListener('click', () => handleOpenModal(card.dataset.product));
  });
});
