# 📦 E-Commerce REST API (Node.js + Express)

## 🎥 Live Demo

👉 https://www.loom.com/share/771e46248135471fb4875647ff31c1cd

---

## 📌 Overview

This project is a RESTful e-commerce API built using Node.js and Express. It simulates a real online store using JSON files as a database instead of a traditional database system.

It supports full product management, order processing, and stock control logic.

---

## 🚀 Features

### 🛍️ Products

* Create product
* Get all products
* Get single product
* Update product
* Delete product
* Search products by name

### 🧾 Orders

* Create order
* View all orders
* Automatic stock reduction on order
* Prevent ordering when stock is insufficient

### ⚙️ System Features

* Input validation
* Error handling
* File-based persistence (JSON database)
* RESTful API design
* CORS enabled

---

## 🛠️ Tech Stack

* Node.js
* Express.js
* File System (fs module)
* CORS

---

## 📁 Project Structure

```
proj2/
│
├── app.js              # Main server file
├── package.json
├── package-lock.json
├── .gitignore
│
├── data/
│   ├── products.json
│   └── orders.json
│
├── logs/               # (if logging is enabled)
└── utils/              # (logger utility if used)
```

---

## 📡 API Endpoints

### 🛍️ Products

#### Get all products

```
GET /api/v1/products
```

#### Get product by ID

```
GET /api/v1/products/:id
```

#### Create product

```
POST /api/v1/products
```

Body:

```json
{
  "name": "iPhone",
  "price": 1000,
  "stock": 5
}
```

#### Update product

```
PATCH /api/v1/products/:id
```

#### Delete product

```
DELETE /api/v1/products/:id
```

---

### 🧾 Orders

#### Create order

```
POST /api/v1/orders
```

Body:

```json
{
  "productId": 1,
  "quantity": 2,
  "customerName": "John Doe"
}
```

#### Get all orders

```
GET /api/v1/orders
```

---

## ⚙️ How to Run the Project

### 1. Install dependencies

```bash
npm install
```

### 2. Start server

```bash
npm run start
```

### 3. Server runs on

```
http://localhost:9000
```

---

## 📊 Key Features Demonstrated

* REST API design
* CRUD operations
* Stock management system
* Order processing logic
* Input validation
* File-based persistence
* Middleware usage (CORS, JSON parsing)

---

## 🧠 Learning Outcome

This project demonstrates how a backend e-commerce system works without a database by simulating storage using JSON files.

It shows understanding of REST APIs, server-side logic, and data handling.

---

## 👨‍💻 Author

Oghenekevwe Jeffery Onodje
