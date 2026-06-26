// js/cart-page.js
// Renders the cart items table and order summary on cart.html,
// and wires up quantity +/- controls and remove buttons.

const cartLayout = document.getElementById("cartLayout");

function renderCartPage() {
  const cart = getCart();

  if (cart.length === 0) {
    cartLayout.innerHTML = `
      <div class="empty-cart">
        <div class="icon">&#128722;</div>
        <h3>Your cart is empty</h3>
        <p>Looks like you haven't added anything yet.</p>
        <a href="index.html" class="btn btn-primary">Browse Products</a>
      </div>
    `;
    return;
  }

  const itemsHtml = cart
    .map(
      (item) => `
      <div class="cart-item" data-id="${item.productId}">
        <img src="${item.image}" alt="${item.name}"
             onerror="this.src='https://via.placeholder.com/100x100/121826/5b8cff?text=TS'" />
        <div class="details">
          <h4>${item.name}</h4>
          <span class="unit-price">₹${item.price.toLocaleString("en-IN")} each</span>
        </div>
        <div class="actions">
          <span class="line-total">₹${(item.price * item.quantity).toLocaleString("en-IN")}</span>
          <div class="qty-control">
            <button class="qty-minus" data-id="${item.productId}">−</button>
            <span>${item.quantity}</span>
            <button class="qty-plus" data-id="${item.productId}">+</button>
          </div>
          <button class="remove-btn" data-id="${item.productId}">Remove</button>
        </div>
      </div>
    `
    )
    .join("");

  const subtotal = getCartTotal();
  const shipping = subtotal > 0 ? 99 : 0;
  const total = subtotal + shipping;

  cartLayout.innerHTML = `
    <div class="cart-items">${itemsHtml}</div>
    <div class="cart-summary">
      <h3>Order Summary</h3>
      <div class="summary-row">
        <span>Subtotal</span>
        <span>₹${subtotal.toLocaleString("en-IN")}</span>
      </div>
      <div class="summary-row">
        <span>Shipping</span>
        <span>₹${shipping}</span>
      </div>
      <div class="summary-row total">
        <span>Total</span>
        <span class="value">₹${total.toLocaleString("en-IN")}</span>
      </div>
      <button class="btn btn-primary btn-block" id="checkoutBtn" style="margin-top:16px;">
        Checkout
      </button>
      <a href="index.html" class="btn btn-outline btn-block" style="margin-top:10px;">
        Continue Shopping
      </a>
    </div>
  `;

  attachCartEvents();
}

function attachCartEvents() {
  // Increase quantity
  document.querySelectorAll(".qty-plus").forEach((btn) => {
    btn.addEventListener("click", () => {
      const cart = getCart();
      const item = cart.find((i) => i.productId === btn.dataset.id);
      if (item) updateQuantity(item.productId, item.quantity + 1);
      renderCartPage();
    });
  });

  // Decrease quantity (removes item if it hits 0)
  document.querySelectorAll(".qty-minus").forEach((btn) => {
    btn.addEventListener("click", () => {
      const cart = getCart();
      const item = cart.find((i) => i.productId === btn.dataset.id);
      if (item) updateQuantity(item.productId, item.quantity - 1);
      renderCartPage();
    });
  });

  // Remove item entirely
  document.querySelectorAll(".remove-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      removeFromCart(btn.dataset.id);
      showToast("Item removed from cart");
      renderCartPage();
    });
  });

  // Checkout button (demo only — no real payment integration)
  const checkoutBtn = document.getElementById("checkoutBtn");
  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", () => {
      showToast("This is a demo — checkout is not implemented.");
    });
  }
}

function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2000);
}

// Mobile menu toggle
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");
if (menuToggle) {
  menuToggle.addEventListener("click", () => {
    navLinks.classList.toggle("open");
  });
}

renderCartPage();
