# 🛒 NextJS E-Commerce Platform

> A full-stack, production-ready e-commerce platform built with Next.js 14, Express, and PostgreSQL — featuring product management, cart, checkout, Stripe payments, and an admin dashboard.

![MIT License](https://img.shields.io/badge/License-MIT-green.svg)
![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791?logo=postgresql)
![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?logo=prisma)

---

## ✨ Features

### 🧑‍💻 Customer-Facing
- **Home Page** — Hero section, featured products, and category browsing
- **Product Listing** — Filters by category, price range, and rating; full-text search
- **Product Detail** — Image gallery, customer reviews, and add-to-cart
- **Shopping Cart** — Quantity management, real-time order summary
- **Checkout Flow** — Shipping address form, Stripe-powered payment
- **Authentication** — Register, login, and JWT-secured sessions with refresh tokens
- **User Dashboard** — Order history, order status tracking, and profile settings

### 🛠️ Admin Dashboard
- Manage **products** (create, edit, delete, inventory tracking)
- Manage **orders** (view, update status)
- Manage **users** and roles

### ⚙️ Backend & Infrastructure
- RESTful API with full CRUD across all resources
- JWT authentication with **refresh token rotation**
- **Role-based access control** (admin vs. customer)
- **Stripe Payment Intent** integration
- Image upload support
- Seeded database with sample products and categories

---

## 🧰 Tech Stack

| Layer       | Technology                                      |
|-------------|-------------------------------------------------|
| Frontend    | Next.js 14, TypeScript, Tailwind CSS            |
| Backend     | Node.js, Express, TypeScript                    |
| Database    | PostgreSQL 16                                   |
| ORM         | Prisma                                          |
| Auth        | JWT (Access + Refresh Tokens)                   |
| Payments    | Stripe                                          |
| Image Upload| Multer / Cloud Storage                          |

---

## 🗄️ Database Schema

```
Users          → id, name, email, password_hash, role, created_at
Products       → id, name, description, price, stock, category_id, images, rating
Categories     → id, name, slug
Orders         → id, user_id, status, total, shipping_address, created_at
OrderItems     → id, order_id, product_id, quantity, price
Reviews        → id, user_id, product_id, rating, comment
Cart           → id, user_id, items (JSON)
```

---

## 🚀 Getting Started

### Prerequisites

Ensure the following are installed on your machine:

- [Node.js](https://nodejs.org/) v18+
- [npm](https://www.npmjs.com/) v9+
- [PostgreSQL](https://www.postgresql.org/) v14+
- A [Stripe](https://stripe.com/) account (for payment keys)

---

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/your-username/nextjs-ecommerce-platform.git
cd nextjs-ecommerce-platform
```

2. **Install dependencies**

```bash
# Install backend dependencies
cd backend && npm install

# Install frontend dependencies
cd ../frontend && npm install
```

3. **Configure environment variables**

```bash
# Backend
cp backend/.env.example backend/.env

# Frontend
cp frontend/.env.example frontend/.env.local
```

Fill in the required values in each `.env` file. See the [Environment Variables](#-environment-variables) section below.

4. **Set up the database**

```bash
cd backend

# Run Prisma migrations
npx prisma migrate dev --name init

# Generate Prisma client
npx prisma generate

# Seed the database with sample data
npm run seed
```

---

### Running Locally

Open two terminal windows and run:

```bash
# Terminal 1 — Backend (http://localhost:5000)
cd backend && npm run dev

# Terminal 2 — Frontend (http://localhost:3000)
cd frontend && npm run dev
```

---

## 🔐 Environment Variables

### Backend — `backend/.env`

| Variable                  | Description                                      | Example                              |
|---------------------------|--------------------------------------------------|--------------------------------------|
| `DATABASE_URL`            | PostgreSQL connection string                     | `postgresql://user:pass@localhost:5432/ecommerce` |
| `JWT_ACCESS_SECRET`       | Secret key for signing access tokens             | `your-access-secret`                 |
| `JWT_REFRESH_SECRET`      | Secret key for signing refresh tokens            | `your-refresh-secret`                |
| `JWT_ACCESS_EXPIRES_IN`   | Access token expiry duration                     | `15m`                                |
| `JWT_REFRESH_EXPIRES_IN`  | Refresh token expiry duration                    | `7d`                                 |
| `STRIPE_SECRET_KEY`       | Stripe secret key for payment intents            | `sk_test_...`                        |
| `STRIPE_WEBHOOK_SECRET`   | Stripe webhook signing secret                    | `whsec_...`                          |
| `PORT`                    | Port for the Express server                      | `5000`                               |
| `CLIENT_URL`              | Allowed CORS origin (frontend URL)               | `http://localhost:3000`              |
| `UPLOAD_DIR`              | Directory for uploaded images                    | `./uploads`                          |

### Frontend — `frontend/.env.local`

| Variable                          | Description                              | Example                     |
|-----------------------------------|------------------------------------------|-----------------------------|
| `NEXT_PUBLIC_API_URL`             | Base URL of the backend API              | `http://localhost:5000/api` |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key for Elements   | `pk_test_...`               |

---

## 📁 Project Structure

```
nextjs-ecommerce-platform/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma       # Database schema
│   │   ├── migrations/         # Prisma migration files
│   │   └── seed.ts             # Database seed script
│   ├── src/
│   │   ├── controllers/        # Route controllers
│   │   ├── middleware/         # Auth, error handling, RBAC
│   │   ├── routes/             # Express route definitions
│   │   ├── services/           # Business logic
│   │   └── index.ts            # Entry point
│   └── .env.example
│
├── frontend/
│   ├── app/                    # Next.js 14 App Router
│   │   ├── (auth)/             # Login & Register pages
│   │   ├── (shop)/             # Product listing & detail
│   │   ├── cart/               # Cart page
│   │   ├── checkout/           # Checkout flow
│   │   ├── dashboard/          # User dashboard
│   │   └── admin/              # Admin dashboard
│   ├── components/             # Reusable UI components
│   ├── lib/                    # API clients, utilities
│   ├── types/                  # Shared TypeScript types
│   └── .env.example
│
└── README.md
```

---

## 🤝 Contributing

Contributions are welcome and appreciated! To get started:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/your-feature-name`)
3. Commit your changes (`git commit -m 'feat: add your feature'`)
4. Push to your branch (`git push origin feature/your-feature-name`)