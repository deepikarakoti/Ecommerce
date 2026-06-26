# TechStore — Electronics E-Commerce Website

A complete full-stack e-commerce demo built with **HTML, CSS, vanilla JavaScript**
on the frontend and **Node.js, Express.js, MongoDB (Mongoose)** on the backend.

```
ecommerce/
│
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB connection
│   ├── controllers/
│   │   └── productController.js  # CRUD logic
│   ├── models/
│   │   └── Product.js            # Mongoose schema
│   ├── routes/
│   │   └── productRoutes.js      # REST API routes
│   ├── server.js                 # App entry point
│   ├── seed.js                   # Sample data loader
│   ├── .env                      # Environment variables
│   └── package.json
│
└── frontend/
    ├── index.html   # Homepage — product listing, search, filters
    ├── cart.html    # Cart page — quantity management, remove items
    ├── admin.html   # Admin panel — add/update/delete products
    ├── css/style.css
    ├── js/
    │   ├── config.js     # API base URL
    │   ├── cart.js        # Shared cart logic (localStorage)
    │   ├── app.js         # Homepage logic
    │   ├── cart-page.js   # Cart page logic
    │   └── admin.js       # Admin CRUD logic
    └── images/
```

---

## STEP 1 — Software Installation

Install these three tools first:

1. **Node.js** (v18 or later recommended)
   Download: https://nodejs.org

2. **MongoDB Community Server**
   Download: https://www.mongodb.com/try/download/community
   (Also install **MongoDB Compass** if you'd like a GUI to view your data.)

3. **VS Code**
   Download: https://code.visualstudio.com

**Verify installations** by running these in your terminal/command prompt:

```bash
node -v          # should print something like v18.x.x or higher
npm -v            # should print the npm version
mongod --version  # should print the MongoDB server version
```

If `mongod` isn't recognized on Windows, make sure MongoDB's `bin` folder is
added to your system PATH (the installer usually offers to do this for you).

---

## STEP 2 — Project Setup

1. Copy the `ecommerce` folder (provided) anywhere on your machine — e.g.
   `C:\Projects\ecommerce` or `~/Projects/ecommerce`.

2. Open the **backend** folder in a terminal:

```bash
cd ecommerce/backend
```

3. The `package.json` is already included, so just install the dependencies:

```bash
npm install
```

This installs `express`, `mongoose`, `cors`, `dotenv`, and `nodemon`
(all already listed in `package.json` — no need to run `npm init` again).

> If you ever start a similar project from scratch, the commands would be:
> ```bash
> npm init -y
> npm install express mongoose cors dotenv
> npm install nodemon --save-dev
> ```

---

## STEP 3 — MongoDB Setup

1. **Start MongoDB** (it often runs as a background service after install).
   To start it manually:

   - **Windows:** MongoDB usually installs as a Windows Service and starts
     automatically. To start manually: `net start MongoDB`
   - **macOS (Homebrew):** `brew services start mongodb-community`
   - **Linux:** `sudo systemctl start mongod`

2. **Verify MongoDB is running:**

```bash
mongosh
```

If it connects and shows a `test>` prompt, MongoDB is running correctly.
Type `exit` to leave the shell.

3. **Connection string used by this project** (already set in `backend/.env`):

```
mongodb://127.0.0.1:27017/ecommerce
```

This tells Mongoose to connect to a local MongoDB server and use (or create)
a database named **ecommerce**. You don't need to create the database or
collection manually — Mongoose creates them automatically the first time
data is inserted.

---

## STEP 4 — Load Sample Data (Seed the Database)

From the `backend` folder, run:

```bash
node seed.js
```

Expected output:

```
MongoDB Connected for seeding...
Existing products removed.
12 sample products added successfully!
```

This inserts 12 sample electronics products (phones, laptops, headphones,
etc.) into the `products` collection so your homepage isn't empty.

---

## STEP 5 — Backend Execution

From the `backend` folder, run:

```bash
node server.js
```

Or, for auto-restart on file changes during development:

```bash
npx nodemon server.js
```

**Expected output:**

```
MongoDB Connected: 127.0.0.1
Server Running on Port 5000
```

Keep this terminal window open — the server needs to keep running.

---

## STEP 6 — Test the APIs

You can test with **Postman**, **Thunder Client** (VS Code extension), or
just your browser for GET requests.

Base URL: `http://localhost:5000/api/products`

| Method | Endpoint              | Purpose                  |
|--------|------------------------|---------------------------|
| GET    | `/api/products`        | Get all products (supports `?search=` and `?category=`) |
| GET    | `/api/products/:id`    | Get a single product     |
| POST   | `/api/products`        | Create a new product     |
| PUT    | `/api/products/:id`    | Update an existing product |
| DELETE | `/api/products/:id`    | Delete a product          |

**Sample GET request:**

```
GET http://localhost:5000/api/products
```

**Sample response:**

```json
{
  "success": true,
  "count": 12,
  "data": [
    {
      "_id": "665f1c2e8b3a4d1234567890",
      "name": "Apple iPhone 15",
      "price": 79999,
      "image": "https://images.unsplash.com/photo-...",
      "description": "6.1-inch Super Retina display...",
      "category": "Mobiles",
      "createdAt": "2026-06-26T10:00:00.000Z"
    }
  ]
}
```

**Sample POST request** (Body → raw → JSON):

```
POST http://localhost:5000/api/products
Content-Type: application/json

{
  "name": "OnePlus 12",
  "price": 64999,
  "image": "https://example.com/oneplus12.jpg",
  "description": "Snapdragon 8 Gen 3, 50MP Hasselblad camera, 100W fast charging.",
  "category": "Mobiles"
}
```

**Sample response:**

```json
{
  "success": true,
  "message": "Product created successfully",
  "data": { "_id": "...", "name": "OnePlus 12", ... }
}
```

**Sample PUT request:**

```
PUT http://localhost:5000/api/products/665f1c2e8b3a4d1234567890
Content-Type: application/json

{ "price": 74999 }
```

**Sample DELETE request:**

```
DELETE http://localhost:5000/api/products/665f1c2e8b3a4d1234567890
```

---

## STEP 7 — Frontend Execution

You have two options:

**Option A — VS Code Live Server (recommended for beginners)**
1. Open the `frontend` folder in VS Code.
2. Install the "Live Server" extension if you don't have it.
3. Right-click `index.html` → "Open with Live Server".
4. Your browser opens something like `http://127.0.0.1:5500/index.html`.

**Option B — Open directly via the backend (no extra tool needed)**
Since `server.js` already serves the `frontend` folder as static files,
once your backend is running you can simply visit:
```
http://localhost:5000
```
and the homepage will load directly from the same server.

> Either way, make sure the backend (`node server.js`) is running in a
> separate terminal — the frontend pages fetch data from
> `http://localhost:5000/api/products`.

---

## STEP 8 — Verify the Project End-to-End

1. Open `admin.html` → fill the form → click **Add Product**. You should
   see a green success message and the new product appear in the table below.
2. Open **MongoDB Compass** (or `mongosh`) → connect to
   `mongodb://127.0.0.1:27017` → open the `ecommerce` database →
   `products` collection → confirm your new document is there.
3. Open `index.html` (or refresh it) → your new product should now appear
   in the homepage grid.
4. Click **Add to Cart** on a few products → the cart counter badge in the
   navbar should increase.
5. Open `cart.html` → use the **+ / −** buttons to change quantities, and
   click **Remove** to delete an item. The cart total updates instantly.
6. Go back to `admin.html` → click **Edit** on a product → change a field →
   click **Update Product** → confirm the change reflects on the homepage.
7. Click **Delete** on a product in the admin table → confirm the dialog →
   the product disappears from both the admin table and the homepage.

---

## STEP 9 — Common Errors & Solutions

| Error | Cause | Solution |
|---|---|---|
| `MongoDB Connection Error: connect ECONNREFUSED 127.0.0.1:27017` | MongoDB service isn't running | Start MongoDB (`net start MongoDB` / `brew services start mongodb-community` / `sudo systemctl start mongod`) |
| `Error: listen EADDRINUSE: address already in use :::5000` | Port 5000 is already taken by another process | Stop the other process, or change `PORT` in `.env` to e.g. `5050` (and update `API_BASE_URL` in `frontend/js/config.js` to match) |
| CORS error in browser console (`blocked by CORS policy`) | Frontend and backend are on different origins and CORS isn't enabled | Already handled — `app.use(cors())` is in `server.js`. If it still happens, make sure the backend is actually running and you're hitting the right port |
| `Cannot find module 'express'` (or similar) | Dependencies weren't installed | Run `npm install` inside the `backend` folder |
| Homepage shows "Could not load products" | Backend isn't running, or wrong API URL | Start the backend with `node server.js`; verify `API_BASE_URL` in `frontend/js/config.js` matches your backend's actual port |
| Admin form submit fails silently | Missing required field, or invalid Image URL | Check the red error message under the form; all fields are required |
| `node seed.js` does nothing / hangs | MongoDB not running | Start MongoDB first, then re-run the seed script |

---

## Notes

- The shopping cart is stored in the browser's `localStorage`, so it persists
  between page reloads but is per-browser (not synced across devices) —
  this keeps the demo simple while still being fully functional.
- Product images use Unsplash URLs by default; you can swap any `image`
  field for your own hosted image URL via the Admin Panel.
- This project is intentionally framework-free on the frontend (no React)
  as requested, using plain HTML/CSS/JS with the Fetch API.
