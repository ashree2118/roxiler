# Store Rating Platform - FullStack Application

A full-stack web application that allows users to explore registered stores, submit ratings (1–5 stars), and manage listings with role-based access control (System Administrator, Normal User, and Store Owner).

## Live Demo & Links

* **Frontend Application:** [https://roxiler-weld-three.vercel.app](https://roxiler-weld-three.vercel.app)
* **Backend API:** [https://your-api.onrender.com](https://roxiler-bktf.onrender.com)/api
* **API Documentation / Health:** [https://your-api.onrender.com/](https://roxiler-bktf.onrender.com)api/health

## Demo Credentials

| Role             | Email                 | Password     | Pre-configured Access                              |
| :--------------- | :-------------------- | :----------- | :------------------------------------------------- |
| **System Admin** | `admin@system.com`    | `Admin@1234` | Full metrics, user & store management, filter/sort |
| **Store Owner**  | `owner@freshmart.com` | `Owner@1234` | View store ratings breakdown & average score       |
| **Normal User**  | `user@example.com`    | `User@1234`  | Rate stores, edit ratings, search/filter stores    |

> **Note:** New Normal Users and Store Owners can also self-register via the Registration page.

## Tech Stack

* **Backend:** Node.js, Express.js
* **Database & ORM:** PostgreSQL (NeonDB), Prisma ORM
* **Authentication:** JWT (JSON Web Tokens), bcrypt.js
* **Validation:** `express-validator` (enforcing strict character & regex requirements)
* **Frontend:** React.js (Vite), Tailwind CSS, Lucide Icons, Axios
* **State Management & Routing:** React Context API, React Router DOM v6

## Features & Role Capabilities

### System Administrator

* **Dashboard Overview:** Live metric cards displaying total users, total stores, and total submitted ratings.
* **User Management:**

  * View all registered users (Normal Users, Store Owners, Admins).
  * Dynamic sorting (Ascending/Descending) on Name, Email, Address, and Role.
  * Multi-field filters (Name, Email, Address, Role).
  * Displays overall store rating for Store Owners.
  * Create new users with any specified role.
* **Store Management:**

  * View all stores with real-time computed average ratings.
  * Add new stores and optionally assign registered owners.
  * Filter and sort store records.

### Normal User (Customer)

* **Registration & Single-Sign-On:** Instant sign-up with client & server-side validation.
* **Store Directory:**

  * Search stores in real time by **Name** and **Address**.
  * Sort stores by name or average rating.
  * View store information, overall rating, and their own submitted rating.
* **Interactive Rating System:**

  * Rate stores from 1 to 5 stars.
  * Modify previously submitted ratings (upsert mechanism).
* **Profile:** Change password securely from the dashboard.

### Store Owner

* **Onboarding:** Register with user and store details, receiving instant verification.
* **Owner Dashboard:**

  * Real-time overall store rating and total rating count.
  * Comprehensive customer list displaying users who reviewed their store and the individual ratings submitted.
* **Profile:** Change password functionality.

## Form Validations & Security Rules

All constraints are validated on both **Client-Side (React)** and **Server-Side (`express-validator`)**:

* **Name:** Minimum 20 characters, Maximum 60 characters.
* **Address:** Maximum 400 characters.
* **Password:** 8–16 characters, must include at least one uppercase letter and one special character: `^(?=.*[A-Z])(?=.*[!@#$%^&*])`
* **Email:** Strict RFC 5322 email regex standard.
* **Ratings:** Strict integer range from 1 to 5.
* **Rating uniqueness:** Enforced unique constraint per `(userId, storeId)`.

## Database Schema (Prisma)

```prisma
enum Role {
  ADMIN
  USER
  STORE_OWNER
}

model User {
  id         String   @id @default(uuid())
  name       String   @db.VarChar(60)
  email      String   @unique
  password   String
  address    String   @db.VarChar(400)
  role       Role     @default(USER)
  ownedStore Store?   @relation("StoreOwner")
  ratings    Rating[]
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt
}

model Store {
  id        String   @id @default(uuid())
  name      String   @db.VarChar(60)
  email     String   @unique
  address   String   @db.VarChar(400)
  ownerId   String?  @unique
  owner     User?    @relation("StoreOwner", fields: [ownerId], references: [id], onDelete: SetNull)
  ratings   Rating[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Rating {
  id        String   @id @default(uuid())
  rating    Int      // 1 to 5
  userId    String
  storeId   String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  store     Store    @relation(fields: [storeId], references: [id], onDelete: Cascade)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@unique([userId, storeId])
}
```

## Local Development Setup

### 1. Clone the Repository

```bash
git clone https://github.com/ashree2118/roxiler.git
cd store-rating-app
```

### 2. Backend Setup

```bash
cd backend
npm install

# Configure .env
cp .env.example .env
```

Ensure your `backend/.env` contains:

```env
PORT=5000
DATABASE_URL="postgresql://<user>:<password>@<neon_host>/<database>?sslmode=require"
JWT_SECRET="super_secret_jwt_key"
JWT_EXPIRES_IN="7d"
```

Run migrations and seed the database:

```bash
npx prisma migrate dev --name init
npx prisma db seed
npm run dev
```

### 3. Frontend Setup

```bash
cd ../frontend
npm install

# Configure .env
cp .env.example .env
```

Ensure your `frontend/.env` contains:

```env
VITE_API_URL="http://localhost:5000/api"
```

Run the development server:

```bash
npm run dev
```

Access the frontend at:

```text
http://localhost:5173
```
