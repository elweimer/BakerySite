export const PRODUCTS = {
  bread:       { title: 'Custom Bread Designs', price: 10, emoji: '🍞', tagline: 'Artisan breads crafted with creativity.',    accent: '#c8860a', image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&q=80' },
  brownieCups: { title: 'Brownie Cups',         price: 8,  emoji: '🍫', tagline: 'Rich chocolate treats in perfect portions.',  accent: '#6b3a2a', image: 'https://tasting-thyme.com/wp-content/uploads/2024/05/IMG_7212.jpg' },
  jam:         { title: 'Jam',                  price: 7,  emoji: '🍓', tagline: 'Homemade jams with fresh ingredients.',        accent: '#b03060', image: 'https://www.leftyspoon.com/wp-content/uploads/2014/08/how-to-make-homemade-jam-8-1024x681.jpg' },
  bibs:        { title: 'Bibs',                 price: 12, emoji: '🐣', tagline: 'Soft and durable for everyday use.',            accent: '#5a8a5a', image: 'https://s.turbifycdn.com/aah/yhst-2003691491864/vintage-baby-bib-with-bunny-embroidery-and-red-checked-trim-56.jpg' },
  babyShirts:  { title: 'Baby Shirts',          price: 15, emoji: '👶', tagline: 'Comfortable and adorable designs.',             accent: '#4a7aaa', image: 'https://i5.walmartimages.com/seo/Honest-Baby-Clothing-Baby-Toddler-Boy-or-Girl-Gender-Neutral-Organic-Cotton-Short-Sleeve-T-Shirts-8-Pack-Newborn-5T_1dbed5c8-4cb4-48d1-bc94-545b315df186.45c2c5bb7ea9687cee3e0fc1a7e0c2fe.jpeg' },
  socks:       { title: 'Socks',                price: 8,  emoji: '🧦', tagline: 'Cozy, warm, and handmade.',                    accent: '#7a5aaa', image: 'https://images.unsplash.com/photo-1586350977771-b3b0abd50c82?w=600&q=80' },
  brownies:    { title: 'Brownies',             price: 6,  emoji: '🍫', tagline: 'Fudgy and delicious classics.',                accent: '#4a2a1a', image: 'https://images.unsplash.com/photo-1564355808539-22fda35bed7e?w=600&q=80' },
  cookies:     { title: 'Cookies',              price: 5,  emoji: '🍪', tagline: 'Freshly baked in many flavors.',               accent: '#a0641e', image: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=600&q=80' },
  cupcakes:    { title: 'Cupcakes',             price: 4,  emoji: '🧁', tagline: 'Perfect for celebrations.',                   accent: '#c0567a', image: 'https://images.unsplash.com/photo-1486427944299-d1955d23e34d?w=600&q=80' }
};

export const cart = {};
export const quantities = {};

export function addToCart(id) {
  const qty = quantities[id] || 1;
  cart[id] = (cart[id] || 0) + qty;
}

export function removeFromCart(id) {
  delete cart[id];
}

export function incrementCart(id) {
  cart[id] += 1;
}

export function decrementCart(id) {
  cart[id] = Math.max(1, cart[id] - 1);
}

export function setModalQty(id, value) {
  quantities[id] = value;
}

export function changeModalQty(id, delta) {
  quantities[id] = Math.max(1, (quantities[id] || 1) + delta);
  return quantities[id];
}

export function getCartTotal() {
  return Object.values(cart).reduce((sum, q) => sum + q, 0);
}

export function getCartEntries() {
  return Object.entries(cart).filter(([, qty]) => qty > 0);
}
