const PRODUCTS = {
  bread:       { title: 'Custom Bread Designs', price: 10, emoji: '🍞', tagline: 'Artisan breads crafted with creativity.',   accent: '#c8860a', image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&q=80' },
  brownieCups: { title: 'Brownie Cups',         price: 8,  emoji: '🍫', tagline: 'Rich chocolate treats in perfect portions.', accent: '#6b3a2a', image: 'https://tasting-thyme.com/wp-content/uploads/2024/05/IMG_7212.jpg' },
  jam:         { title: 'Jam',                  price: 7,  emoji: '🍓', tagline: 'Homemade jams with fresh ingredients.',       accent: '#b03060', image: 'https://www.leftyspoon.com/wp-content/uploads/2014/08/how-to-make-homemade-jam-8-1024x681.jpg' },
  bibs:        { title: 'Bibs',                 price: 12, emoji: '🐣', tagline: 'Soft and durable for everyday use.',           accent: '#5a8a5a', image: 'https://s.turbifycdn.com/aah/yhst-2003691491864/vintage-baby-bib-with-bunny-embroidery-and-red-checked-trim-56.jpg' },
  babyShirts:  { title: 'Baby Shirts',          price: 15, emoji: '👶', tagline: 'Comfortable and adorable designs.',            accent: '#4a7aaa', image: 'https://i5.walmartimages.com/seo/Honest-Baby-Clothing-Baby-Toddler-Boy-or-Girl-Gender-Neutral-Organic-Cotton-Short-Sleeve-T-Shirts-8-Pack-Newborn-5T_1dbed5c8-4cb4-48d1-bc94-545b315df186.45c2c5bb7ea9687cee3e0fc1a7e0c2fe.jpeg' },
  socks:       { title: 'Socks',                price: 8,  emoji: '🧦', tagline: 'Cozy, warm, and handmade.',                   accent: '#7a5aaa', image: 'https://images.unsplash.com/photo-1586350977771-b3b0abd50c82?w=600&q=80' },
  brownies:    { title: 'Brownies',             price: 6,  emoji: '🍫', tagline: 'Fudgy and delicious classics.',               accent: '#4a2a1a', image: 'https://images.unsplash.com/photo-1564355808539-22fda35bed7e?w=600&q=80' },
  cookies:     { title: 'Cookies',              price: 5,  emoji: '🍪', tagline: 'Freshly baked in many flavors.',              accent: '#a0641e', image: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=600&q=80' },
  cupcakes:    { title: 'Cupcakes',             price: 4,  emoji: '🧁', tagline: 'Perfect for celebrations.',                  accent: '#c0567a', image: 'https://images.unsplash.com/photo-1486427944299-d1955d23e34d?w=600&q=80' }
};

const quantities = {};
const cart = {};

function buildModals() {
  const container = document.getElementById('modals-container');

  for (const [id, product] of Object.entries(PRODUCTS)) {
    const div = document.createElement('div');
    div.innerHTML = `
      <div id="${id}Modal" class="modal-overlay">
        <div class="modal product-modal" data-product="${id}">
          <button class="modal-close">&times;</button>
          <div class="modal-hero" style="background-image: url('${product.image}')">
            <div class="modal-hero-overlay">
              <span class="modal-emoji">${product.emoji}</span>
              <h2>${product.title}</h2>
              <p class="modal-tagline">${product.tagline}</p>
            </div>
          </div>
          <div class="modal-body">
            <div class="quantity-row">
              <span>Quantity:</span>
              <button class="qty-btn">&#8722;</button>
              <input type="number" id="${id}Qty" value="1" min="1">
              <button class="qty-btn">&#43;</button>
            </div>
            <div class="price-row">
              <span>Price: <strong id="${id}Price">$${product.price}</strong></span>
            </div>
          </div>
          <button class="add-to-cart-btn" style="border-color:${product.accent}; color:${product.accent}">
            Add to Cart
          </button>
        </div>
      </div>`;

    const modal = div.firstElementChild;
    const [decreaseBtn, increaseBtn] = modal.querySelectorAll('.qty-btn');
    const qtyInput = modal.querySelector(`#${id}Qty`);

    modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(id); });
    modal.querySelector('.modal-close').addEventListener('click', () => closeModal(id));
    decreaseBtn.addEventListener('click', () => changeQty(id, -1));
    increaseBtn.addEventListener('click', () => changeQty(id, 1));
    qtyInput.addEventListener('input', () => updateQtyFromInput(id));
    modal.querySelector('.add-to-cart-btn').addEventListener('click', () => addToCart(id));
    modal.querySelector('.add-to-cart-btn').addEventListener('mouseenter', function() {
      this.style.background = PRODUCTS[id].accent;
      this.style.color = 'white';
    });
    modal.querySelector('.add-to-cart-btn').addEventListener('mouseleave', function() {
      this.style.background = 'white';
      this.style.color = PRODUCTS[id].accent;
    });

    container.appendChild(modal);
  }

  buildBasketModal(container);
}

function buildBasketModal(container) {
  const div = document.createElement('div');
  div.innerHTML = `
    <div id="basketModal" class="modal-overlay">
      <div class="modal basket-modal">
        <button class="modal-close" id="basket-close">&times;</button>
        <h2>Your Basket</h2>
        <div id="basket-content"></div>
        <button class="add-to-cart-btn confirm-btn" id="confirm-order-btn">Confirm Order</button>
      </div>
    </div>`;

  const modal = div.firstElementChild;
  modal.addEventListener('click', (e) => { if (e.target === modal) closeBasket(); });
  modal.querySelector('#basket-close').addEventListener('click', closeBasket);
  container.appendChild(modal);
}

function addToCart(id) {
  const qty = quantities[id] || 1;
  cart[id] = (cart[id] || 0) + qty;
  updateCartBadge();
  closeModal(id);
}

function updateCartBadge() {
  const total = Object.values(cart).reduce((sum, q) => sum + q, 0);
  const badge = document.getElementById('cart-badge');
  badge.textContent = total;
  badge.style.display = total > 0 ? 'flex' : 'none';
}

function openBasket() {
  renderBasket();
  document.getElementById('basketModal').classList.add('active');
}

function renderBasket() {
  const content = document.getElementById('basket-content');
  const confirmBtn = document.getElementById('confirm-order-btn');
  const cartEntries = Object.entries(cart).filter(([, qty]) => qty > 0);

  content.innerHTML = '';

  if (cartEntries.length === 0) {
    content.innerHTML = '<p class="basket-empty">Your basket is empty.</p>';
    confirmBtn.style.display = 'none';
    return;
  }

  let total = 0;
  const table = document.createElement('table');
  table.className = 'basket-table';
  table.innerHTML = '<thead><tr><th>Item</th><th>Qty</th><th>Price</th><th></th></tr></thead>';

  const tbody = document.createElement('tbody');
  for (const [id, qty] of cartEntries) {
    const lineTotal = qty * PRODUCTS[id].price;
    total += lineTotal;

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${PRODUCTS[id].title}</td>
      <td class="basket-qty-cell">
        <button class="qty-btn basket-qty-btn">&#8722;</button>
        <span class="basket-qty-val">${qty}</span>
        <button class="qty-btn basket-qty-btn">&#43;</button>
      </td>
      <td class="basket-price">$${lineTotal}</td>
      <td><button class="basket-remove-btn" title="Remove">&times;</button></td>`;

    const [decBtn, incBtn] = tr.querySelectorAll('.basket-qty-btn');
    const removeBtn = tr.querySelector('.basket-remove-btn');

    decBtn.addEventListener('click', () => { cart[id] = Math.max(1, cart[id] - 1); renderBasket(); });
    incBtn.addEventListener('click', () => { cart[id] += 1; renderBasket(); });
    removeBtn.addEventListener('click', () => { delete cart[id]; updateCartBadge(); renderBasket(); });

    tbody.appendChild(tr);
  }

  const tfoot = document.createElement('tfoot');
  tfoot.innerHTML = `<tr><td colspan="4" class="basket-total">Total: $${total}</td></tr>`;

  table.appendChild(tbody);
  table.appendChild(tfoot);
  content.appendChild(table);

  updateCartBadge();
  confirmBtn.style.display = '';
}

function closeBasket() {
  document.getElementById('basketModal').classList.remove('active');
}

function openModal(id) {
  quantities[id] = 1;
  document.getElementById(id + 'Qty').value = 1;
  document.getElementById(id + 'Price').textContent = '$' + PRODUCTS[id].price;
  document.getElementById(id + 'Modal').classList.add('active');
}

function closeModal(id) {
  document.getElementById(id + 'Modal').classList.remove('active');
}

function changeQty(id, delta) {
  quantities[id] = Math.max(1, (quantities[id] || 1) + delta);
  document.getElementById(id + 'Qty').value = quantities[id];
  document.getElementById(id + 'Price').textContent = '$' + (quantities[id] * PRODUCTS[id].price);
}

function updateQtyFromInput(id) {
  const input = document.getElementById(id + 'Qty');
  const parsed = parseInt(input.value, 10);
  if (!isNaN(parsed) && parsed >= 1) {
    quantities[id] = parsed;
    document.getElementById(id + 'Price').textContent = '$' + (quantities[id] * PRODUCTS[id].price);
  }
}

function filterItems(category, e) {
  const cards = document.querySelectorAll(".card");
  const tabs = document.querySelectorAll(".tab");

  if (category === 'all') {
    // Clear all active category tabs; activate 'all'
    tabs.forEach(tab => tab.classList.remove('active'));
    e.target.classList.add('active');
    cards.forEach(card => card.classList.remove('dimmed'));
    return;
  }

  // Deactivate 'all' tab when a category is explicitly chosen
  const allTab = document.querySelector('.tab[data-category="all"]');
  if (allTab) allTab.classList.remove('active');

  // Toggle this category tab
  e.target.classList.toggle('active');

  // Collect all active categories
  const activeCategories = [...document.querySelectorAll('.tab.active')]
    .map(tab => tab.dataset.category)
    .filter(c => c && c !== 'all');

  // If nothing selected, revert to 'all'
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

document.addEventListener('DOMContentLoaded', buildModals);

