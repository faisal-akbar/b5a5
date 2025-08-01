# 📦 Parcel Delivery System

A modular and secure backend system for managing parcel deliveries. It features real-time tracking, role-based access control, and full parcel lifecycle management.

---

Live Demo: [Parcel Delivery System](https://b5a5.vercel.app/)

## 🧱 Features

- 🔐 Authentication: Email/password-based login using JWT.
- 🔁 Role-based access (`SENDER`, `RECEIVER`, `ADMIN`, `SUPER_ADMIN`, `DELIVERY_PERSONNEL`)
- 📦 Parcel lifecycle: Request, approve, picked, dispatch, deliver, block, cancel, flagged
- 🔄 Status Tracking: Track status changes for each parcel.
- 📲 OTP-based registration verification support
- 🧱 Scalable Modular Architecture
- 🎟️ Coupon support (only admin/super admin can create)
- ⚠️ Global error and validation handling
- 📧 Email notifications for OTP and password reset

## 🧩 Tech Stack

- **Node.js + Express** — Backend framework
- **MongoDB + Mongoose** — NoSQL Database with ODM
- **Zod** — Schema validation
- **TypeScript** — Optional typing (if enabled)
- **JWT** — Authentication
- **dotenv** — Config management
- **Redis** — Caching and session management
- **EJS** — Email templating
- **Postman** — API testing and documentation
- **ESLint** — Code quality and linting
- **Prettier** — Code formatting
- **Nodemailer** — Email sending
- **Vercel** — Deployment platform

---

## 🛠️ Getting Started

```bash
# 1. Clone the repo
git clone https://github.com/faisal-akbar/b5a5.git
cd b5a5
# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example .env

# 4. Update .env with your MongoDB URI, nodemailer credentials, redis credentials, etc.
# SMTP GMAIL
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_USER=fexample@gmail.com
SMTP_PASS=your_smtp_password_here
SMTP_FROM=fexample@gmail.com

# redis
REDIS_HOST=hostname_of_your_redis_server
REDIS_PORT=14282
REDIS_USERNAME=default
REDIS_PASSWORD=your_redis_password_here

# 5. Run locally
npm run dev
```

---

## 📁 Folder Structure

```
── Parcel Delivery.postman_collection.json
├── README.md
├── eslint.config.mjs
├── package-lock.json
├── package.json
├── src
│   ├── app
│   │   ├── config
│   │   │   ├── env.ts
│   │   │   └── redis.config.ts
│   │   ├── interfaces
│   │   │   ├── error.types.ts
│   │   │   └── index.d.ts
│   │   ├── middlewares
│   │   │   ├── checkAuth.ts
│   │   │   ├── globalErrorHandler.ts
│   │   │   ├── notFound.ts
│   │   │   └── validateRequest.ts
│   │   ├── modules
│   │   │   ├── auth
│   │   │   │   ├── auth.controller.ts
│   │   │   │   ├── auth.routes.ts
│   │   │   │   └── auth.service.ts
│   │   │   ├── coupon
│   │   │   │   ├── coupon.controller.ts
│   │   │   │   ├── coupon.interface.ts
│   │   │   │   ├── coupon.model.ts
│   │   │   │   ├── coupon.routes.ts
│   │   │   │   ├── coupon.service.ts
│   │   │   │   ├── coupon.utils.ts
│   │   │   │   └── coupon.validation.ts
│   │   │   ├── otp
│   │   │   │   ├── otp.controller.ts
│   │   │   │   ├── otp.routes.ts
│   │   │   │   ├── otp.service.ts
│   │   │   │   └── otp.validation.ts
│   │   │   ├── parcel
│   │   │   │   ├── parcel.controller.ts
│   │   │   │   ├── parcel.interface.ts
│   │   │   │   ├── parcel.model.ts
│   │   │   │   ├── parcel.routes.ts
│   │   │   │   ├── parcel.service.ts
│   │   │   │   ├── parcel.utils.ts
│   │   │   │   └── parcel.validation.ts
│   │   │   └── user
│   │   │       ├── user.contants.ts
│   │   │       ├── user.controller.ts
│   │   │       ├── user.interface.ts
│   │   │       ├── user.model.ts
│   │   │       ├── user.routes.ts
│   │   │       ├── user.service.ts
│   │   │       └── user.validation.ts
│   │   ├── routes
│   │   │   └── index.ts
│   │   └── utils
│   │       ├── builder
│   │       │   ├── QueryBuilder.ts
│   │       │   └── constants.ts
│   │       ├── catchAsync.ts
│   │       ├── errorHelpers
│   │       │   ├── AppError.ts
│   │       │   ├── handleCastError.ts
│   │       │   ├── handleDuplicateError.ts
│   │       │   ├── handlerValidationError.ts
│   │       │   └── handlerZodError.ts
│   │       ├── generateTrackingId.ts
│   │       ├── jwt
│   │       │   ├── jwt.ts
│   │       │   ├── setCookie.ts
│   │       │   └── userTokens.ts
│   │       ├── seedDummyUser.ts
│   │       ├── seedSuperAdmin.ts
│   │       ├── sendEmail.ts
│   │       ├── sendResponse.ts
│   │       └── templates
│   │           ├── forgetPassword.ejs
│   │           └── otp.ejs
│   ├── app.ts
│   └── server.ts
├── tsconfig.json
└── vercel.json
```

---

## 👤 User Roles

| Role                 | Responsibilities                                          |
| -------------------- | --------------------------------------------------------- |
| `SENDER`             | Register, send/cancel/delete parcels, view own parcels    |
| `RECEIVER`           | View incoming parcels, confirm delivery, delivery history |
| `DELIVERY_PERSONNEL` | Currently admin can assign to parcel, and create          |
| `ADMIN`              | Manage users, create admins and personnel, manage coupons |
| `SUPER_ADMIN`        | Similar to admin but can create super admins              |

---

## 📡 API Endpoints

### 🔐 Auth

| Method | Endpoint           | Description             |
| ------ | ------------------ | ----------------------- |
| POST   | `/login`           | User login              |
| POST   | `/refresh-token`   | Refresh JWT token       |
| POST   | `/logout`          | Logout user             |
| POST   | `/change-password` | Change password         |
| POST   | `/forgot-password` | Forgot password request |
| POST   | `/reset-password`  | Reset password          |

---

### 📲 OTP

| Method | Endpoint  | Description       |
| ------ | --------- | ----------------- |
| POST   | `/send`   | Send OTP to phone |
| POST   | `/verify` | Verify OTP        |

---

### 👤 Users

| Method | Endpoint                     | Role                  | Description                 |
| ------ | ---------------------------- | --------------------- | --------------------------- |
| POST   | `/register`                  | Public                | Register sender/receiver    |
| POST   | `/create-admin`              | `ADMIN`/`SUPER_ADMIN` | Create new admin            |
| POST   | `/create-delivery-personnel` | `ADMIN`/`SUPER_ADMIN` | Register delivery personnel |
| GET    | `/all-users`                 | `ADMIN`/`SUPER_ADMIN` | Get all users               |
| GET    | `/me`                        | Authenticated         | Get logged-in user          |
| GET    | `/:id`                       | Authenticated         | Get user by ID              |
| PATCH  | `/:id`                       | Authenticated         | Update user profile         |
| PATCH  | `/:id/block-user`            | `ADMIN`/`SUPER_ADMIN` | Block/unblock user          |

---

### 📦 Parcels

| Method | Endpoint                | Role       | Description            |
| ------ | ----------------------- | ---------- | ---------------------- |
| POST   | `/`                     | `SENDER`   | Create parcel          |
| POST   | `/cancel/:id`           | `SENDER`   | Cancel parcel          |
| POST   | `/delete/:id`           | `SENDER`   | Delete parcel          |
| GET    | `/me`                   | `SENDER`   | View sender's parcels  |
| GET    | `/:id/status-log`       | `SENDER`   | View parcel status log |
| GET    | `/me/incoming`          | `RECEIVER` | Incoming parcels       |
| GET    | `/me/history`           | `RECEIVER` | Delivery history       |
| PATCH  | `/confirm/:id`          | `RECEIVER` | Confirm delivery       |
| GET    | `/tracking/:trackingId` | Public     | Track parcel           |
| GET    | `/`                     | `ADMIN`    | Get all parcels        |
| POST   | `/create-parcel`        | `ADMIN`    | Admin creates parcel   |
| PATCH  | `/:id/delivery-status`  | `ADMIN`    | Update delivery status |
| PATCH  | `/:id/block-status`     | `ADMIN`    | Block/unblock a parcel |
| GET    | `/:id/details`          | `ADMIN`    | Get parcel details     |

---

### 🎟️ Coupons

| Method | Endpoint | Role    | Description       |
| ------ | -------- | ------- | ----------------- |
| POST   | `/`      | `ADMIN` | Create new coupon |

---

## 🔁 Parcel Lifecycle

### 🔄 Normal Flow

```
REQUESTED → APPROVED → PICKED → DISPATCHED → IN_TRANSIT → DELIVERED
```

### 🛑 Exception Flows

```
Any Stage → FLAGGED → BLOCKED/CANCELLED
PICKED/DISPATCHED/IN_TRANSIT → RETURNED → REQUESTED
IN_TRANSIT → RESCHEDULED → IN_TRANSIT/DELIVERED/CANCELLED
```

---
