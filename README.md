# APEX GYM WEAR — Full-Stack E-Commerce Store

A complete full-stack athletic apparel store built with **Next.js 16**, **MongoDB Atlas**, and **JWT authentication**.

## Tech Stack
- **Frontend:** Next.js 16 App Router, React 19, TypeScript, Tailwind CSS
- **State:** Zustand (cart + auth, persisted)
- **Backend:** Next.js API Routes (RESTful)
- **Database:** MongoDB Atlas via Mongoose
- **Auth:** JWT + bcrypt
- **Deploy:** Vercel

## Quick Start

### 1. Install
```bash
npm install
```

### 2. Environment
```bash
cp .env.example .env.local
# Fill in MONGODB_URI and JWT_SECRET
```

### 3. Seed Database
```bash
npm run seed
# Creates 12 products + admin: admin@gymstore.com / Admin@123
```

### 4. Run
```bash
npm run dev
# http://localhost:3000
```

## API Endpoints

| Method | Endpoint | Auth |
|---|---|---|
| POST | /api/auth/register | Public |
| POST | /api/auth/login | Public |
| GET | /api/products | Public |
| POST | /api/products | Admin |
| GET/PUT/DELETE | /api/products/[id] | Public/Admin |
| GET/POST | /api/orders | User |
| GET | /api/admin/orders | Admin |
| PATCH | /api/admin/orders/[id] | Admin |

## Pages
- `/` — Homepage with featured products
- `/shop` — Catalog with search + category filter
- `/product/[id]` — Product detail with size selector
- `/cart` — Cart management
- `/checkout` — Checkout + order placement
- `/auth/login` & `/auth/register` — Authentication
- `/account` — Order history
- `/admin/dashboard` — Admin stats
- `/admin/products` — Add/edit/delete products
- `/admin/orders` — Update order fulfillment status

## Deploy to Vercel
1. Push to GitHub
2. Import repo on vercel.com
3. Add MONGODB_URI + JWT_SECRET environment variables
4. Deploy
