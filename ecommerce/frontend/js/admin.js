// js/admin.js
// Powers the Admin Panel: fetch/list, create, update, delete products
// via the backend REST API. Uses fetch() with async/await throughout.

const productForm = document.getElementById("productForm");
const productIdInput = document.getElementById("productId");
const nameInput = document.getElementById("name");
const priceInput = document.getElementById("price");
const categoryInput = document.getElementById("category");
const imageInput = document.getElementById("image");
const descriptionInput = document.getElementById("description");

const formTitle = document.getElementById("formTitle");
const submitBtn = document.getElementById("submitBtn");
const cancelEditBtn = document.getElementById("cancelEditBtn");
const formMessage = document.getElementById("formMessage");
const adminTableBody = document.getElementById("adminTableBody");
const adminCount = document.getElementById("adminCount");

let products = [];

// ------------------------------------------------------------------
// Load all products and render them in the admin table
// (GET /api/products)
// ------------------------------------------------------------------
async function loadProducts() {
  try {
    const response = await fetch(`${API_BASE_URL}/products`);
    const result = await response.json();
    products = result.data || [];
    renderTable();
  } catch (error) {
    console.error("Failed to load products:", error);
    adminTableBody.innerHTML = `
      <tr><td colspan="5" style="text-align:center; color:var(--danger); padding:24px;">
        Could not connect to backend. Is the server running on port 5000?
      </td></tr>
    `;
  }
}

function renderTable() {
  adminCount.textContent = `(${products.length})`;

  if (products.length === 0) {
    adminTableBody.innerHTML = `
      <tr><td colspan="5" style="text-align:center; color:var(--text-dim); padding:24px;">
        No products yet. Add your first product using the form.
      </td></tr>
    `;
    return;
  }

  adminTableBody.innerHTML = products
    .map(
      (p) => `
      <tr>
        <td><img src="${p.image}" alt="${p.name}" onerror="this.src='https://via.placeholder.com/44/121826/5b8cff?text=TS'" /></td>
        <td>${p.name}</td>
        <td>${p.category}</td>
        <td class="price-cell">₹${p.price.toLocaleString("en-IN")}</td>
        <td>
          <div class="row-actions">
            <button class="btn btn-outline edit-btn" data-id="${p._id}">Edit</button>
            <button class="btn btn-danger delete-btn" data-id="${p._id}">Delete</button>
          </div>
        </td>
      </tr>
    `
    )
    .join("");

  // Wire up Edit buttons
  document.querySelectorAll(".edit-btn").forEach((btn) => {
    btn.addEventListener("click", () => startEdit(btn.dataset.id));
  });

  // Wire up Delete buttons
  document.querySelectorAll(".delete-btn").forEach((btn) => {
    btn.addEventListener("click", () => handleDelete(btn.dataset.id));
  });
}

// ------------------------------------------------------------------
// Populate the form with an existing product's data for editing
// ------------------------------------------------------------------
function startEdit(id) {
  const product = products.find((p) => p._id === id);
  if (!product) return;

  productIdInput.value = product._id;
  nameInput.value = product.name;
  priceInput.value = product.price;
  categoryInput.value = product.category;
  imageInput.value = product.image;
  descriptionInput.value = product.description;

  formTitle.textContent = "Edit Product";
  submitBtn.textContent = "Update Product";
  cancelEditBtn.style.display = "inline-flex";

  // Scroll the form into view (handy on mobile)
  document.querySelector(".admin-form-card").scrollIntoView({ behavior: "smooth" });
}

// ------------------------------------------------------------------
// Reset the form back to "Add new product" mode
// ------------------------------------------------------------------
function resetForm() {
  productForm.reset();
  productIdInput.value = "";
  formTitle.textContent = "Add New Product";
  submitBtn.textContent = "Add Product";
  cancelEditBtn.style.display = "none";
}

cancelEditBtn.addEventListener("click", resetForm);

// ------------------------------------------------------------------
// Handle form submit: creates a new product OR updates an existing one
// depending on whether productIdInput has a value.
// (POST /api/products  or  PUT /api/products/:id)
// ------------------------------------------------------------------
productForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const payload = {
    name: nameInput.value.trim(),
    price: parseFloat(priceInput.value),
    category: categoryInput.value,
    image: imageInput.value.trim(),
    description: descriptionInput.value.trim(),
  };

  const editingId = productIdInput.value;
  const isEditing = Boolean(editingId);

  try {
    submitBtn.disabled = true;
    submitBtn.textContent = isEditing ? "Updating..." : "Adding...";

    const url = isEditing
      ? `${API_BASE_URL}/products/${editingId}`
      : `${API_BASE_URL}/products`;
    const method = isEditing ? "PUT" : "POST";

    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || "Something went wrong");
    }

    showFormMessage(
      isEditing ? "Product updated successfully!" : "Product added successfully!",
      "success"
    );

    resetForm();
    await loadProducts();
  } catch (error) {
    console.error("Save failed:", error);
    showFormMessage(error.message, "error");
  } finally {
    submitBtn.disabled = false;
    if (submitBtn.textContent.includes("...")) {
      submitBtn.textContent = isEditing ? "Update Product" : "Add Product";
    }
  }
});

// ------------------------------------------------------------------
// Handle delete with a confirmation prompt
// (DELETE /api/products/:id)
// ------------------------------------------------------------------
async function handleDelete(id) {
  const product = products.find((p) => p._id === id);
  const confirmed = confirm(`Delete "${product?.name}"? This cannot be undone.`);
  if (!confirmed) return;

  try {
    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: "DELETE",
    });
    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || "Failed to delete product");
    }

    showToast("Product deleted");
    await loadProducts();
  } catch (error) {
    console.error("Delete failed:", error);
    showToast(error.message);
  }
}

// ------------------------------------------------------------------
// Small UI helpers
// ------------------------------------------------------------------
function showFormMessage(text, type) {
  formMessage.textContent = text;
  formMessage.className = `form-message show ${type}`;
  setTimeout(() => formMessage.classList.remove("show"), 3500);
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

// Kick things off
loadProducts();
