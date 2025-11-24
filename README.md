# Game Station API

API untuk sistem manajemen game station dengan fitur booking, payment, dan session tracking.

## Tech Stack

- Node.js + Express.js
- TypeScript
- PostgreSQL
- Prisma ORM
- JWT Authentication
- Bcrypt

## Setup

1. Install dependencies:

```bash
npm install
npm install bcrypt jsonwebtoken
npm install --save-dev @types/bcrypt @types/jsonwebtoken
```

2. Setup database:

```bash
# Copy environment variables
cp .env.example .env

# Edit .env dengan konfigurasi database Anda

# Generate Prisma Client
npx prisma generate

# Run migration
npx prisma migrate dev --name init
```

3. Run development server:

```bash
npm run dev
```

## API Endpoints

### Authentication

#### 1. Register

```http
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "fullname": "John Doe",
  "phone": "081234567890",
  "role": "customer"
}
```

Response:

```json
{
  "success": true,
  "message": "Registrasi berhasil",
  "data": {
    "user": {
      "id": "1",
      "email": "user@example.com",
      "fullname": "John Doe",
      "role": "customer",
      "phone": "081234567890",
      "createdAt": "2025-11-19T10:00:00.000Z"
    },
    "accessToken": "eyJhbGc...",
    "refreshToken": "eyJhbGc..."
  }
}
```

#### 2. Login (Email & Password)

```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

Response:

```json
{
  "success": true,
  "message": "Login berhasil",
  "data": {
    "user": {
      "id": "1",
      "email": "user@example.com",
      "fullname": "John Doe",
      "role": "customer",
      "phone": "081234567890"
    },
    "accessToken": "eyJhbGc...",
    "refreshToken": "eyJhbGc..."
  }
}
```

#### 3. Login OTP (2-Step Process)

**Step 1: Request OTP**

```http
POST /auth/login-otp
Content-Type: application/json

{
  "email": "user@example.com"
}
```

Response:

```json
{
  "success": true,
  "message": "OTP telah dikirim ke email Anda",
  "data": {
    "expiresIn": 300
  }
}
```

**Step 2: Verify OTP**

```http
POST /auth/login-otp
Content-Type: application/json

{
  "email": "user@example.com",
  "otp": "123456"
}
```

Response:

```json
{
  "success": true,
  "message": "Login berhasil",
  "data": {
    "user": { ... },
    "accessToken": "eyJhbGc...",
    "refreshToken": "eyJhbGc..."
  }
}
```

#### 4. Refresh Token

```http
POST /auth/refresh-token
Content-Type: application/json

{
  "refreshToken": "eyJhbGc..."
}
```

Response:

```json
{
  "success": true,
  "message": "Token berhasil di-refresh",
  "data": {
    "accessToken": "eyJhbGc...",
    "refreshToken": "eyJhbGc..."
  }
}
```

#### 5. Logout

```http
POST /auth/logout
Authorization: Bearer <access-token>
```

Response:

```json
{
  "success": true,
  "message": "Logout berhasil"
}
```

## Authentication Middleware

Gunakan middleware untuk protect routes:

```typescript
import { authenticateToken, authorizeRoles } from "./middleware/authMiddleware";

// Protect route (require login)
router.get("/profile", authenticateToken, getProfile);

// Protect route with role check
router.get(
  "/admin",
  authenticateToken,
  authorizeRoles("admin", "super_admin"),
  adminDashboard
);
```

## Notes

- Access token expire in 15 minutes
- Refresh token expire in 7 days
- OTP expire in 5 minutes
- Password di-hash dengan bcrypt (10 rounds)
- Gunakan Redis untuk OTP storage dan token blacklist di production
- Implement rate limiting untuk prevent brute force attacks

## TODO Production Checklist

- [ ] Setup Redis untuk OTP storage
- [ ] Implement token blacklist dengan Redis
- [ ] Setup email service untuk kirim OTP
- [ ] Setup SMS service (optional)
- [ ] Implement rate limiting
- [ ] Setup CORS
- [ ] Setup helmet untuk security headers
- [ ] Setup logging (Winston/Pino)
- [ ] Setup monitoring (Sentry)
- [ ] Add input validation dengan Joi
- [ ] Add API documentation (Swagger)
