# Authentication API Documentation

API untuk autentikasi dan manajemen user di Game Station.

## Base URL

```
http://localhost:3000
```

---

## 🔐 Overview

Game Station mendukung 2 metode autentikasi:

1. **Email + Password** - Login tradisional dengan kredensial
2. **OTP (One-Time Password)** - Login tanpa password menggunakan kode OTP 6 digit

### Token System

- **Access Token**: Berlaku 15 menit, digunakan untuk autentikasi API
- **Refresh Token**: Berlaku 7 hari, digunakan untuk mendapatkan access token baru
- **Token Rotation**: Setiap refresh akan menghasilkan refresh token baru

---

## Struktur Response API

### Success Response

```json
{
  "success": true,
  "message": "Pesan sukses",
  "data": {
    // Data response
  }
}
```

### Error Response

```json
{
  "success": false,
  "message": "Pesan error"
}
```

---

## Endpoints

## 1. Register User

Mendaftarkan user baru ke sistem.

### Endpoint

```
POST /auth/register
```

### Access

Public

### Request Body

```json
{
  "email": "customer@test.com",
  "password": "Customer123!",
  "fullname": "Budi Santoso",
  "phone": "081234567890"
}
```

### Field Descriptions

- `email` (required): Email valid dan belum terdaftar
- `password` (optional): Password untuk login (jika tidak diisi, hanya bisa login via OTP)
- `fullname` (required): Nama lengkap user
- `phone` (optional): Nomor telepon
- `role`: Otomatis "customer", tidak bisa diset saat register

### Field Descriptions

- `email` (required): Email valid dan belum terdaftar
- `password` (optional): Password untuk login (jika tidak diisi, hanya bisa login via OTP)
- `fullname` (required): Nama lengkap user
- `phone` (optional): Nomor telepon
- `role`: Otomatis "customer", tidak bisa diset saat register

### Response Success (201)

```json
{
  "success": true,
  "message": "Registrasi berhasil",
  "data": {
    "user": {
      "id": "1",
      "email": "customer@test.com",
      "fullname": "Budi Santoso",
      "role": "customer",
      "phone": "081234567890",
      "createdAt": "2025-12-15T10:00:00.000Z"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Response Error

**400 Bad Request** - Validasi gagal

```json
{
  "success": false,
  "message": "Email dan fullname wajib diisi"
}
```

**409 Conflict** - Email sudah terdaftar

```json
{
  "success": false,
  "message": "Email sudah terdaftar"
}
```

---

## 2. Login dengan Password

Login menggunakan email dan password (untuk user yang set password saat register).

### Endpoint

```
POST /auth/login
```

### Access

Public

### Request Body

```json
{
  "email": "customer@test.com",
  "password": "Customer123!"
}
```

### Field Descriptions

- `email` (required): Email terdaftar
- `password` (required): Password user

### Response Success (200)

```json
{
  "success": true,
  "message": "Login berhasil",
  "data": {
    "user": {
      "id": "1",
      "email": "customer@test.com",
      "fullname": "Budi Santoso",
      "role": "customer",
      "phone": "081234567890"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Response Error

**400 Bad Request** - Field tidak lengkap

```json
{
  "success": false,
  "message": "Email dan password wajib diisi"
}
```

**401 Unauthorized** - Kredensial salah

```json
{
  "success": false,
  "message": "Email atau password salah"
}
```

**401 Unauthorized** - Akun OTP-only

```json
{
  "success": false,
  "message": "Akun ini menggunakan login OTP. Silakan gunakan /auth/login-otp"
}
```

**404 Not Found** - Email tidak terdaftar

```json
{
  "success": false,
  "message": "Email tidak terdaftar"
}
```

---

## 3. Login dengan OTP

Login menggunakan OTP (One-Time Password) untuk user yang tidak set password atau prefer login tanpa password. **Proses 2 step.**

### Step 1: Request OTP

Meminta OTP dikirim ke email (dalam development, OTP akan muncul di console server).

#### Endpoint

```
POST /auth/login-otp
```

#### Access

Public

#### Request Body

```json
{
  "email": "customer@test.com"
}
```

#### Response Success (200)

```json
{
  "success": true,
  "message": "OTP telah dikirim ke email Anda. Berlaku selama 5 menit.",
  "data": {
    "email": "customer@test.com",
    "expiresIn": 300
  }
}
```

**Note Development**: OTP akan tampil di console server:

```
[OTP] Email: customer@test.com, OTP: 123456 (expires at 2025-12-15T10:05:00.000Z)
```

#### Response Error

**400 Bad Request**

```json
{
  "success": false,
  "message": "Email wajib diisi"
}
```

**404 Not Found**

```json
{
  "success": false,
  "message": "Email tidak terdaftar"
}
```

---

### Step 2: Verify OTP

Verifikasi OTP yang diterima dan dapatkan access token.

#### Endpoint

```
POST /auth/login-otp
```

#### Access

Public

#### Request Body

```json
{
  "email": "customer@test.com",
  "otp": "123456"
}
```

#### Field Descriptions

- `email` (required): Email yang request OTP
- `otp` (required): Kode OTP 6 digit yang diterima

#### Response Success (200)

```json
{
  "success": true,
  "message": "Login berhasil",
  "data": {
    "user": {
      "id": "1",
      "email": "customer@test.com",
      "fullname": "Budi Santoso",
      "role": "customer",
      "phone": "081234567890"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### Response Error

**400 Bad Request** - OTP expired atau tidak ada

```json
{
  "success": false,
  "message": "OTP tidak ditemukan atau sudah expired. Silakan request OTP baru."
}
```

**401 Unauthorized** - OTP salah

```json
{
  "success": false,
  "message": "OTP tidak valid"
}
```

**404 Not Found** - Email tidak terdaftar

```json
{
  "success": false,
  "message": "Email tidak terdaftar"
}
```

#### OTP Properties

- **Format**: 6 digit angka (contoh: 123456)
- **Validity**: 5 menit
- **Storage**: In-memory Map (production: gunakan Redis)
- **Delivery**: Console log (production: email/SMS service)

---

## 4. Refresh Access Token

Refresh access token yang expired menggunakan refresh token. Implementasi token rotation untuk security.

### Endpoint

```
POST /auth/refresh-token
```

### Access

Public (requires valid refresh token)

### Request Body

```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Response Success (200)

```json
{
  "success": true,
  "message": "Token berhasil di-refresh",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Note**: Refresh token yang baru akan diberikan (token rotation) untuk security.

### Response Error

**400 Bad Request**

```json
{
  "success": false,
  "message": "Refresh token wajib diisi"
}
```

**401 Unauthorized** - Token invalid/expired

```json
{
  "success": false,
  "message": "Refresh token tidak valid atau sudah expired"
}
```

**404 Not Found** - User tidak ditemukan

```json
{
  "success": false,
  "message": "User tidak ditemukan"
}
```

### Token Expiry

- **Access Token**: 15 menit
- **Refresh Token**: 7 hari
- **Strategy**: Rotating refresh tokens (old token invalid setelah refresh)

---

## 5. Logout

Logout user dari sistem. Token akan di-blacklist (production: Redis).

### Endpoint

```
POST /auth/logout
```

### Access

Private (requires authentication)

### Headers

```
Authorization: Bearer <access-token>
```

### Request Body

Tidak ada (empty body)

### Response Success (200)

```json
{
  "success": true,
  "message": "Logout berhasil"
}
```

### Response Error

**400 Bad Request** - Token tidak ada

```json
{
  "success": false,
  "message": "Token tidak ditemukan. Silakan login terlebih dahulu"
}
```

**401 Unauthorized** - Token invalid

```json
{
  "success": false,
  "message": "Token tidak valid atau sudah expired"
}
```

### Audit Log

Setiap logout akan tercatat di audit_logs:

```json
{
  "userId": 1,
  "action": "LOGOUT",
  "entity": "Auth",
  "entityId": 1,
  "meta": {
    "email": "customer@test.com",
    "timestamp": "2025-12-15T10:00:00.000Z"
  }
}
```

---

## 🔒 Authentication Middleware

### authenticateToken

Middleware untuk verifikasi JWT token dan protect routes.

**Usage:**

```typescript
import { authenticateToken } from "./middleware/authMiddleware";

router.get("/profile", authenticateToken, getUserProfile);
router.post("/orders", authenticateToken, createOrder);
```

**Functionality:**

- Extract token dari header `Authorization: Bearer <token>`
- Verify token signature dan expiry
- Decode user info (userId, email, role)
- Inject ke `req.user`

**Response jika gagal:**

```json
{
  "success": false,
  "message": "Token tidak ditemukan. Silakan login terlebih dahulu"
}
```

**Request Object After Auth:**

```typescript
req.user = {
  userId: "1",
  email: "customer@test.com",
  role: "customer",
};
```

---

### authorizeRoles

Middleware untuk check user role (harus digunakan setelah authenticateToken).

**Usage:**

```typescript
import { authenticateToken, authorizeRoles } from "./middleware/authMiddleware";

// Hanya admin dan owner yang bisa akses
router.post(
  "/branches/:id/devices",
  authenticateToken,
  authorizeRoles("admin", "owner"),
  addDevice
);

// Hanya owner yang bisa akses
router.delete(
  "/branches/:id",
  authenticateToken,
  authorizeRoles("owner"),
  deleteBranch
);
```

**Response jika role tidak sesuai:**

```json
{
  "success": false,
  "message": "Anda tidak memiliki akses untuk resource ini"
}
```

---

## 👥 User Roles

### 1. Customer (Default)

- Role default saat register
- Bisa booking device/room
- Lihat order history
- Payment
- Review & rating

### 2. Admin

- Admin per branch (diassign oleh Owner)
- Manage devices di branch
- Lihat orders di branch
- Manage sessions di branch
- Tidak bisa manage branch lain

### 3. Owner

- Pemilik branch (bisa punya multiple branches)
- Manage branches sendiri
- Manage admins
- Manage devices, categories, pricing
- View reports & analytics
- Full control atas branch miliknya

---

## 🔐 JWT Token Structure

### Access Token Payload

```json
{
  "userId": "1",
  "email": "customer@test.com",
  "role": "customer",
  "iat": 1734264000,
  "exp": 1734264900
}
```

### Refresh Token Payload

```json
{
  "userId": "1",
  "email": "customer@test.com",
  "role": "customer",
  "iat": 1734264000,
  "exp": 1734868800
}
```

### How to Use Token

**Authorization Header:**

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Example with cURL:**

```bash
curl -X GET http://localhost:3000/orders/my \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Example with JavaScript Fetch:**

```javascript
fetch("http://localhost:3000/orders/my", {
  headers: {
    Authorization: `Bearer ${accessToken}`,
    "Content-Type": "application/json",
  },
});
```

---

## 🧪 Testing Guide

### Using REST Client (VS Code Extension)

Save this to `test.http`:

```http
### 1. Register New Customer
# @name register
POST http://localhost:3000/auth/register
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "Test123!",
  "fullname": "Test User",
  "phone": "08123456789"
}

### 2. Login with Password
# @name login
POST http://localhost:3000/auth/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "Test123!"
}

### Extract token from response above and save to variable
@accessToken = {{login.response.body.data.accessToken}}
@refreshToken = {{login.response.body.data.refreshToken}}

### 3. Test Protected Endpoint
GET http://localhost:3000/orders/my
Authorization: Bearer {{accessToken}}

### 4. Refresh Token (when access token expired)
# @name refresh
POST http://localhost:3000/auth/refresh-token
Content-Type: application/json

{
  "refreshToken": "{{refreshToken}}"
}

### 5. Logout
POST http://localhost:3000/auth/logout
Authorization: Bearer {{accessToken}}

### 6. Login with OTP - Step 1: Request OTP
POST http://localhost:3000/auth/login-otp
Content-Type: application/json

{
  "email": "test@example.com"
}

### Check console for OTP, then use it below

### 7. Login with OTP - Step 2: Verify OTP
# @name otpLogin
POST http://localhost:3000/auth/login-otp
Content-Type: application/json

{
  "email": "test@example.com",
  "otp": "123456"
}
```

### Using cURL

**Register:**

```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123!",
    "fullname": "Test User",
    "phone": "08123456789"
  }'
```

**Login:**

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123!"
  }'
```

**Request OTP:**

```bash
curl -X POST http://localhost:3000/auth/login-otp \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com"
  }'
```

**Verify OTP:**

```bash
curl -X POST http://localhost:3000/auth/login-otp \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "otp": "123456"
  }'
```

**Refresh Token:**

```bash
curl -X POST http://localhost:3000/auth/refresh-token \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "YOUR_REFRESH_TOKEN"
  }'
```

**Logout:**

```bash
curl -X POST http://localhost:3000/auth/logout \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

## ⚠️ Security Notes

### Current Implementation (Development)

✅ **Implemented:**

- JWT access & refresh tokens
- Token rotation on refresh
- Password hashing dengan bcrypt
- Role-based access control
- Audit logging untuk logout
- OTP 6 digit dengan 5 menit expiry

❌ **Not Yet Implemented (TODO for Production):**

- Token blacklist (gunakan Redis)
- OTP via email/SMS (sekarang console log)
- Rate limiting untuk prevent brute force
- Account lockout setelah failed attempts
- Email verification
- Password reset functionality
- 2FA (Two-Factor Authentication)
- CORS whitelist
- Security headers (Helmet)

### Environment Variables

Required di `.env`:

```bash
JWT_SECRET=your-super-secret-key-change-in-production
JWT_REFRESH_SECRET=your-refresh-secret-key-change-in-production
```

**IMPORTANT**: Ganti secret keys dengan random string yang kuat untuk production!

### Production Checklist

- [ ] Generate strong random JWT secrets (min 256-bit)
- [ ] Setup Redis untuk token blacklist
- [ ] Setup Redis untuk OTP storage
- [ ] Integrate email service (SendGrid, AWS SES, Mailgun)
- [ ] Integrate SMS service (Twilio, Vonage) - optional
- [ ] Implement rate limiting (express-rate-limit)
- [ ] Setup CORS dengan domain whitelist
- [ ] Add Helmet untuk security headers
- [ ] Implement request logging & monitoring
- [ ] Setup error tracking (Sentry, DataDog)
- [ ] Force HTTPS only
- [ ] Implement password complexity rules
- [ ] Add account lockout mechanism
- [ ] Implement email verification
- [ ] Add forgot password flow
- [ ] Consider 2FA implementation
- [ ] Regular security audits
- [ ] Setup WAF (Web Application Firewall)

---

## 📊 Database Schema

### User Table

```prisma
model User {
  id           BigInt    @id @default(autoincrement())
  email        String    @unique
  passwordHash String?   // Nullable untuk OTP-only users
  fullname     String
  role         UserRole  @default(customer)
  phone        String?
  createdAt    DateTime  @default(now())
  updatedAt    DateTime? @updatedAt

  // Relations
  orders       Order[]
  reviews      Review[]
  auditLogs    AuditLog[]
  // ... other relations
}

enum UserRole {
  customer
  admin
  owner
}
```

### Notes:

- `passwordHash` nullable: User bisa register tanpa password (OTP-only)
- `email` unique & indexed untuk fast lookup
- Soft delete tidak diimplementasi (hard delete)

---

## 📈 Error Codes Reference

| Status | Message               | Cause                                        |
| ------ | --------------------- | -------------------------------------------- |
| 200    | OK                    | Request berhasil                             |
| 201    | Created               | User berhasil dibuat                         |
| 400    | Bad Request           | Validasi gagal atau field required kosong    |
| 401    | Unauthorized          | Kredensial salah atau token invalid/expired  |
| 403    | Forbidden             | Insufficient permissions (role tidak sesuai) |
| 404    | Not Found             | Email/user tidak ditemukan                   |
| 409    | Conflict              | Email sudah terdaftar (duplicate)            |
| 500    | Internal Server Error | Server error (check logs)                    |

---

## 🔄 Authentication Flow Diagram

### Password-based Login Flow

```
┌──────────┐
│  Client  │
└─────┬────┘
      │
      │ POST /auth/register
      │ { email, password, fullname }
      ▼
┌──────────────┐
│    Server    │── Hash password with bcrypt
└──────┬───────┘
       │
       │ Save to DB
       │ Generate JWT tokens
       ▼
┌──────────────┐
│   Response   │── { user, accessToken, refreshToken }
└──────────────┘
```

### OTP-based Login Flow

```
┌──────────┐
│  Client  │
└─────┬────┘
      │
      │ Step 1: POST /auth/login-otp
      │ { email }
      ▼
┌──────────────┐
│    Server    │── Generate 6-digit OTP
└──────┬───────┘── Store in memory with 5min expiry
       │          (Production: Redis)
       │
       ▼
┌──────────────┐
│    Email     │── Send OTP to user's email
└──────────────┘   (Development: console log)
       │
       │ User receives OTP
       │
       ▼
┌──────────┐
│  Client  │── Step 2: POST /auth/login-otp
└─────┬────┘   { email, otp }
       │
       ▼
┌──────────────┐
│    Server    │── Verify OTP
└──────┬───────┘── Generate JWT tokens
       │
       ▼
┌──────────────┐
│   Response   │── { user, accessToken, refreshToken }
└──────────────┘
```

### Token Refresh Flow

```
┌──────────┐
│  Client  │── Access token expired
└─────┬────┘
      │
      │ POST /auth/refresh-token
      │ { refreshToken }
      ▼
┌──────────────┐
│    Server    │── Verify refresh token
└──────┬───────┘── Generate new access token
       │          Generate new refresh token (rotation)
       ▼
┌──────────────┐
│   Response   │── { accessToken, refreshToken }
└──────────────┘
```

---

## 💡 Best Practices

### For Frontend Developers

1. **Store Tokens Securely**

   - Use `httpOnly` cookies (recommended) or
   - Use secure storage like `sessionStorage` (better than `localStorage`)
   - Never store in plain JavaScript variables

2. **Handle Token Expiry**

   ```javascript
   // Implement automatic token refresh
   const refreshAccessToken = async () => {
     const refreshToken = getRefreshToken();
     const response = await fetch("/auth/refresh-token", {
       method: "POST",
       body: JSON.stringify({ refreshToken }),
     });
     const data = await response.json();
     saveTokens(data.accessToken, data.refreshToken);
   };
   ```

3. **Intercept 401 Errors**

   ```javascript
   // Auto-refresh on 401
   axios.interceptors.response.use(
     (response) => response,
     async (error) => {
       if (error.response.status === 401) {
         await refreshAccessToken();
         return axios(error.config); // Retry original request
       }
       return Promise.reject(error);
     }
   );
   ```

4. **Logout on Tab Close**
   ```javascript
   window.addEventListener("beforeunload", () => {
     // Optional: logout on browser close
     fetch("/auth/logout", {
       method: "POST",
       headers: { Authorization: `Bearer ${accessToken}` },
       keepalive: true,
     });
   });
   ```

### For Backend Developers

1. **Use Environment Variables**

   - Never commit secrets to git
   - Use strong random secrets (min 256-bit)
   - Rotate secrets periodically

2. **Implement Rate Limiting**

   ```javascript
   // Prevent brute force attacks
   const rateLimit = require("express-rate-limit");

   const loginLimiter = rateLimit({
     windowMs: 15 * 60 * 1000, // 15 minutes
     max: 5, // 5 attempts
     message: "Too many login attempts, please try again later",
   });

   app.post("/auth/login", loginLimiter, login);
   ```

3. **Log Security Events**

   - Failed login attempts
   - Successful logins
   - Token refreshes
   - Logouts
   - Role changes

4. **Monitor Suspicious Activity**
   - Multiple failed logins
   - Login from different locations
   - Unusual API usage patterns

---

## 🚀 Quick Start Testing

### 1. Start Server

```bash
npm run dev
```

### 2. Test Registration

```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123!",
    "fullname": "Test User"
  }'
```

### 3. Test Login

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123!"
  }'
```

### 4. Save Token & Test Protected Endpoint

```bash
# Save accessToken from login response
TOKEN="your_access_token_here"

# Test protected endpoint
curl -X GET http://localhost:3000/orders/my \
  -H "Authorization: Bearer $TOKEN"
```

---

## 📝 Changelog

### Version 1.0.0 (December 2025)

- ✅ Initial authentication system
- ✅ Email + password login
- ✅ OTP-based login
- ✅ JWT access & refresh tokens
- ✅ Token rotation on refresh
- ✅ Role-based access control
- ✅ Audit logging
- ✅ BCrypt password hashing

### Future Enhancements

- [ ] Email verification on registration
- [ ] Forgot password flow
- [ ] 2FA/MFA support
- [ ] Social login (Google, Facebook)
- [ ] Session management dashboard
- [ ] Device tracking
- [ ] Suspicious activity alerts

---

**Last Updated**: December 15, 2025  
**API Version**: 1.0.0  
**Status**: Production Ready (with production checklist)
