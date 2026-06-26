// js/app.js
// Powers the homepage: fetches products from the backend API,
// renders product cards, and wires up search + category filtering.

let allProducts = []; // full list fetched from API
let activeCategory = "All";
let searchTimeout = null;

const productGrid = document.getElementById("productGrid");
const categoryBar = document.getElementById("categoryBar");
const resultCount = document.getElementById("resultCount");
const searchInput = document.getElementById("searchInput");

// ------------------------------------------------------------------
// Fetch all products from the backend (GET /api/products)
// ------------------------------------------------------------------
async function fetchProducts() {
  try {
    const response = await fetch(`${API_BASE_URL}/products`);

    if (!response.ok) {
      throw new Error(`Server responded with status ${response.status}`);
    }

    const result = await response.json();
    allProducts = result.data || [];

    renderCategoryPills();
    renderProducts(allProducts);
  } catch (error) {
    console.error("Failed to fetch products:", error);
    productGrid.innerHTML = `
      <div class="empty-state">
        <div class="icon">&#9888;&#65039;</div>
        <h3>Could not load products</h3>
        <p>Make sure the backend server is running on port 5000.</p>
      </div>
    `;
  }
}

// ------------------------------------------------------------------
// Render category filter pills based on unique categories in the data
// ------------------------------------------------------------------
function renderCategoryPills() {
  const categories = ["All", ...new Set(allProducts.map((p) => p.category))];

  categoryBar.innerHTML = categories
    .map(
      (cat) => `
      <button class="category-pill ${cat === activeCategory ? "active" : ""}" data-category="${cat}">
        ${cat}
      </button>
    `
    )
    .join("");

  // Attach click handlers to each pill
  document.querySelectorAll(".category-pill").forEach((btn) => {
    btn.addEventListener("click", () => {
      activeCategory = btn.dataset.category;
      document
        .querySelectorAll(".category-pill")
        .forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      applyFilters();
    });
  });
}

// ------------------------------------------------------------------
// Render the product grid given a list of products
// ------------------------------------------------------------------
function renderProducts(products) {
  resultCount.textContent = `(${products.length})`;

  if (products.length === 0) {
    productGrid.innerHTML = `
      <div class="empty-state">
        <div class="icon">&#128269;</div>
        <h3>No products found</h3>
        <p>Try a different search term or category.</p>
      </div>
    `;
    return;
  }

  productGrid.innerHTML = products
    .map(
      (product, index) => `
      <div class="product-card" style="animation-delay: ${index * 0.04}s">
        <div class="img-wrap">
          <span class="category-tag">${product.category}</span>
          <img src="${product.image}" alt="${product.name}" loading="lazy"
               onerror="this.src='https://via.placeholder.com/400x300/121826/5b8cff?text=TechStore'" />
        </div>
        <div class="info">
          <h3>${product.name}</h3>
          <p class="desc">${product.description}</p>
          <div class="price-row">
            <span class="price">₹${product.price.toLocaleString("en-IN")}</span>
          </div>
          <button class="btn btn-primary btn-block" data-id="${product._id}">
            Add to Cart
          </button>
        </div>
      </div>
    `
    )
    .join("");

  // Attach "Add to Cart" click handlers
  document.querySelectorAll(".product-card .btn-primary").forEach((btn) => {
    btn.addEventListener("click", () => {
      const product = allProducts.find((p) => p._id === btn.dataset.id);
      if (product) {
        addToCart(product);
        showToast(`${product.name} added to cart`);

        // Quick visual feedback on the button itself
        btn.classList.add("added");
        btn.textContent = "Added ✓";
        setTimeout(() => {
          btn.classList.remove("added");
          btn.textContent = "Add to Cart";
        }, 900);
      }
    });
  });
}

// ------------------------------------------------------------------
// Apply both search text and category filter together
// ------------------------------------------------------------------
function applyFilters() {
  const searchTerm = searchInput.value.trim().toLowerCase();

  let filtered = allProducts;

  if (activeCategory !== "All") {
    filtered = filtered.filter((p) => p.category === activeCategory);
  }

  if (searchTerm) {
    filtered = filtered.filter(
      (p) =>
        p.name.toLowerCase().includes(searchTerm) ||
        p.description.toLowerCase().includes(searchTerm)
    );
  }

  renderProducts(filtered);
}

// Debounced search input (waits 250ms after typing stops before filtering)
searchInput.addEventListener("input", () => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(applyFilters, 250);
});

// ------------------------------------------------------------------
// Toast notification helper
// ------------------------------------------------------------------
function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2000);
}

// ------------------------------------------------------------------
// Mobile menu toggle
// ------------------------------------------------------------------
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");
if (menuToggle) {
  menuToggle.addEventListener("click", () => {
    navLinks.classList.toggle("open");
  });
}

// Kick things off
fetchProducts();
