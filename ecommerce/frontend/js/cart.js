// js/cart.js
// Shared cart logic used by index.html (product listing) and cart.html.
// The cart is persisted in localStorage so it survives page reloads.

const CART_KEY = "techstore_cart";

/**
 * Read the cart array from localStorage.
 * Cart item shape: { productId, name, price, image, quantity }
 */
function getCart() {
  const raw = localStorage.getItem(CART_KEY);
  return raw ? JSON.parse(raw) : [];
}

/**
 * Persist the cart array to localStorage.
 */
function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

/**
 * Add a product to the cart.
 * If the product already exists in the cart, increase its quantity instead
 * of adding a duplicate row.
 */
function addToCart(product) {
  const cart = getCart();
  const existing = cart.find((item) => item.productId === product._id);

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({
      productId: product._id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
    });
  }

  saveCart(cart);
  updateCartCount();
}

/**
 * Update the quantity of a specific cart item.
 * Removes the item entirely if quantity drops to 0.
 */
function updateQuantity(productId, newQuantity) {
  let cart = getCart();

  if (newQuantity <= 0) {
    cart = cart.filter((item) => item.productId !== productId);
  } else {
    const item = cart.find((item) => item.productId === productId);
    if (item) item.quantity = newQuantity;
  }

  saveCart(cart);
  updateCartCount();
}

/**
 * Remove an item from the cart completely.
 */
function removeFromCart(productId) {
  const cart = getCart().filter((item) => item.productId !== productId);
  saveCart(cart);
  updateCartCount();
}

/**
 * Calculate the total number of items in the cart (sum of quantities).
 */
function getCartItemCount() {
  return getCart().reduce((sum, item) => sum + item.quantity, 0);
}

/**
 * Calculate the total cart price.
 */
function getCartTotal() {
  return getCart().reduce((sum, item) => sum + item.price * item.quantity, 0);
}

/**
 * Update the cart counter badge in the navbar (present on every page).
 */
function updateCartCount() {
  const countEl = document.getElementById("cartCount");
  if (countEl) {
    const count = getCartItemCount();
    countEl.textContent = count;
    countEl.style.display = count > 0 ? "flex" : "none";
  }
}

// Run on every page load so the navbar badge is always accurate
document.addEventListener("DOMContentLoaded", updateCartCount);
