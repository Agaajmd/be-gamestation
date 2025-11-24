# Auth Controller Documentation

## Struktur Response API

Semua response mengikuti format standar:

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
  "message": "Pesan error",
  "errors": [
    {
      "field": "email",
      "message": "Email wajib diisi"
    }
  ]
}
```

## Endpoints

### 1. POST /auth/register

Register user baru ke sistem.

**Request Body:**

```json
{
  "email": "user@example.com", // Required, valid email
  "password": "password123", // Optional, min 6 characters
  "fullname": "John Doe", // Required, 3-100 characters
  "phone": "081234567890", // Optional
  "role": "customer" // Optional: customer|admin|super_admin
}
```

**Success Response (201):**

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
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Responses:**

- 400: Validasi gagal
- 409: Email sudah terdaftar

---

### 2. POST /auth/login

Login dengan email dan password.

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Success Response (200):**

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
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Responses:**

- 400: Email atau password tidak diisi
- 401: Email atau password salah / Akun menggunakan OTP-only

---

### 3. POST /auth/login-otp

Login menggunakan OTP (One-Time Password) - 2 step process.

#### Step 1: Request OTP

**Request Body:**

```json
{
  "email": "user@example.com"
}
```

**Success Response (200):**

```json
{
  "success": true,
  "message": "OTP telah dikirim ke email Anda",
  "data": {
    "expiresIn": 300 // seconds (5 minutes)
  }
}
```

#### Step 2: Verify OTP

**Request Body:**

```json
{
  "email": "user@example.com",
  "otp": "123456" // 6 digit code
}
```

**Success Response (200):**

```json
{
  "success": true,
  "message": "Login berhasil",
  "data": {
    "user": { ... },
    "accessToken": "...",
    "refreshToken": "..."
  }
}
```

**Error Responses:**

- 400: OTP tidak ditemukan atau expired
- 401: OTP tidak valid
- 404: Email tidak terdaftar

**Notes:**

- OTP berlaku 5 menit
- OTP 6 digit angka
- Saat development, OTP akan di-log ke console
- Di production, gunakan Redis untuk storage dan implementasi email/SMS service

---

### 4. POST /auth/refresh-token

Refresh access token yang expired menggunakan refresh token.

**Request Body:**

```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Success Response (200):**

```json
{
  "success": true,
  "message": "Token berhasil di-refresh",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." // New refresh token (rotation)
  }
}
```

**Error Responses:**

- 400: Refresh token tidak diisi
- 401: Refresh token tidak valid atau expired
- 404: User tidak ditemukan

**Notes:**

- Access token expire: 15 menit
- Refresh token expire: 7 hari
- Implementasi refresh token rotation untuk keamanan

---

### 5. POST /auth/logout

Logout user dan invalidate token.

**Headers:**

```
Authorization: Bearer <access-token>
```

**Success Response (200):**

```json
{
  "success": true,
  "message": "Logout berhasil"
}
```

**Error Responses:**

- 400: Token tidak ditemukan
- 401: Token tidak valid

**Notes:**

- Di production, implement token blacklist dengan Redis
- Token akan ditambahkan ke blacklist sampai expired
- Setiap logout akan dicatat di audit_logs

---

## Token Structure

### JWT Payload

```json
{
  "userId": "1",
  "email": "user@example.com",
  "role": "customer",
  "iat": 1700000000,
  "exp": 1700000900
}
```

### Cara Menggunakan Token

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## Authentication Middleware

### authenticateToken

Middleware untuk verify JWT token dan protect routes.

**Usage:**

```typescript
import { authenticateToken } from "./middleware/authMiddleware";

router.get("/profile", authenticateToken, getProfile);
```

**Response jika gagal:**

```json
{
  "success": false,
  "message": "Token tidak ditemukan. Silakan login terlebih dahulu"
}
```

### authorizeRoles

Middleware untuk check user role.

**Usage:**

```typescript
import { authenticateToken, authorizeRoles } from "./middleware/authMiddleware";

// Only admin and super_admin can access
router.get(
  "/admin",
  authenticateToken,
  authorizeRoles("admin", "super_admin"),
  adminDashboard
);

// Only super_admin can access
router.delete(
  "/user/:id",
  authenticateToken,
  authorizeRoles("super_admin"),
  deleteUser
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

## User Roles

1. **customer** (default)

   - Customer biasa yang melakukan booking
   - Akses: booking, view orders, payment

2. **admin**

   - Admin per branch
   - Akses: manage devices, view orders, manage sessions

3. **super_admin**
   - Super admin dengan full access
   - Akses: manage all branches, users, settings

---

## Security Best Practices

### Development

- JWT_SECRET dan JWT_REFRESH_SECRET ada di .env
- OTP disimpan di memory (Map)
- Token blacklist belum implementasi

### Production Checklist

- [ ] Gunakan strong random secret keys
- [ ] Implement Redis untuk OTP storage
- [ ] Implement Redis untuk token blacklist
- [ ] Setup email service (SendGrid/AWS SES)
- [ ] Setup SMS service (Twilio/Vonage)
- [ ] Implement rate limiting (express-rate-limit)
- [ ] Setup CORS dengan whitelist
- [ ] Setup helmet untuk security headers
- [ ] Implement request logging
- [ ] Setup monitoring (Sentry/DataDog)
- [ ] Implement HTTPS
- [ ] Setup password policy (complexity, history)
- [ ] Implement account lockout after failed attempts
- [ ] Add email verification
- [ ] Add password reset functionality
- [ ] Implement 2FA (Two-Factor Authentication)

---

## Testing

### Manual Testing

Gunakan file `test.http` dengan REST Client extension di VS Code:

```bash
# Install REST Client extension
# Open test.http
# Click "Send Request" untuk test setiap endpoint
```

### Curl Examples

**Register:**

```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "fullname": "Test User"
  }'
```

**Login:**

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

**Logout:**

```bash
curl -X POST http://localhost:3000/auth/logout \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

## Error Codes Reference

| Status | Message                        | Cause                     |
| ------ | ------------------------------ | ------------------------- |
| 400    | Validasi gagal                 | Input tidak sesuai format |
| 401    | Email atau password salah      | Credentials tidak valid   |
| 401    | Token tidak valid atau expired | JWT verification failed   |
| 403    | Anda tidak memiliki akses      | Insufficient permissions  |
| 404    | Email tidak terdaftar          | User not found            |
| 409    | Email sudah terdaftar          | Duplicate email           |
| 500    | Terjadi kesalahan              | Internal server error     |

---

## Database Schema Related

### User Model Fields

- `id`: BigInt (Auto increment)
- `email`: String (Unique, indexed)
- `passwordHash`: String (Nullable - untuk OTP-only users)
- `fullname`: String
- `role`: Enum (customer, admin, super_admin)
- `phone`: String (Optional)
- `createdAt`: DateTime (UTC)
- `updatedAt`: DateTime (UTC)

### Audit Log

Setiap logout akan tercatat:

```json
{
  "userId": 1,
  "action": "LOGOUT",
  "entity": "Auth",
  "entityId": 1,
  "meta": {
    "email": "user@example.com",
    "timestamp": "2025-11-19T10:00:00.000Z"
  }
}
```
