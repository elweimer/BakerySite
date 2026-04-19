export function buildProductModal(id, product, { onClose, onDecrease, onIncrease, onQtyInput, onAddToCart }) {
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
  const addBtn = modal.querySelector('.add-to-cart-btn');

  modal.addEventListener('click', (e) => { if (e.target === modal) onClose(); });
  modal.querySelector('.modal-close').addEventListener('click', onClose);
  decreaseBtn.addEventListener('click', onDecrease);
  increaseBtn.addEventListener('click', onIncrease);
  modal.querySelector(`#${id}Qty`).addEventListener('input', onQtyInput);
  addBtn.addEventListener('click', onAddToCart);
  addBtn.addEventListener('mouseenter', function () {
    this.style.background = product.accent;
    this.style.color = 'white';
  });
  addBtn.addEventListener('mouseleave', function () {
    this.style.background = 'white';
    this.style.color = product.accent;
  });

  return modal;
}

export function buildBasketModal(onClose) {
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
  modal.addEventListener('click', (e) => { if (e.target === modal) onClose(); });
  modal.querySelector('#basket-close').addEventListener('click', onClose);
  return modal;
}

export function renderBasket(cartEntries, products, { onDecrement, onIncrement, onRemove }) {
  const content = document.getElementById('basket-content');
  const confirmBtn = document.getElementById('confirm-order-btn');

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
    const lineTotal = qty * products[id].price;
    total += lineTotal;

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${products[id].title}</td>
      <td class="basket-qty-cell">
        <button class="qty-btn basket-qty-btn">&#8722;</button>
        <span class="basket-qty-val">${qty}</span>
        <button class="qty-btn basket-qty-btn">&#43;</button>
      </td>
      <td class="basket-price">$${lineTotal}</td>
      <td><button class="basket-remove-btn" title="Remove">&times;</button></td>`;

    const [decBtn, incBtn] = tr.querySelectorAll('.basket-qty-btn');
    tr.querySelector('.basket-remove-btn').addEventListener('click', () => onRemove(id));
    decBtn.addEventListener('click', () => onDecrement(id));
    incBtn.addEventListener('click', () => onIncrement(id));

    tbody.appendChild(tr);
  }

  const tfoot = document.createElement('tfoot');
  tfoot.innerHTML = `<tr><td colspan="4" class="basket-total">Total: $${total}</td></tr>`;

  table.appendChild(tbody);
  table.appendChild(tfoot);
  content.appendChild(table);
  confirmBtn.style.display = '';
}

export function updateCartBadge(total) {
  const badge = document.getElementById('cart-badge');
  badge.textContent = total;
  badge.style.display = total > 0 ? 'flex' : 'none';
}

export function openModal(id) {
  document.getElementById(`${id}Modal`).classList.add('active');
}

export function closeModal(id) {
  document.getElementById(`${id}Modal`).classList.remove('active');
}

export function openBasketModal() {
  document.getElementById('basketModal').classList.add('active');
}

export function closeBasketModal() {
  document.getElementById('basketModal').classList.remove('active');
}

export function setModalQtyDisplay(id, qty, lineTotal) {
  document.getElementById(`${id}Qty`).value = qty;
  document.getElementById(`${id}Price`).textContent = `$${lineTotal}`;
}

export function setPriceDisplay(id, lineTotal) {
  document.getElementById(`${id}Price`).textContent = `$${lineTotal}`;
}
