# Testing Guide - User Update & Announcement API

## 📋 Prerequisites

1. **Server Running**: Pastikan sudah menjalankan `npm run dev`
2. **VS Code Extension**: Install REST Client extension (REST Client oleh Huachao Mao)
3. **Access Token**: Dapatkan dari login endpoint terlebih dahulu

## 🔐 Step 1: Get Access Token

### A. Register User Baru

```http
POST http://localhost:3000/auth/register
Content-Type: application/json

{
  "email": "testuser@example.com",
  "password": "password123",
  "fullname": "Test User",
  "phone": "081234567890",
  "role": "customer"
}
```

### B. Login & Copy Access Token

```http
POST http://localhost:3000/auth/login
Content-Type: application/json

{
  "email": "testuser@example.com",
  "password": "password123"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Login berhasil",
  "data": {
    "user": {
      "id": 1,
      "email": "testuser@example.com",
      "fullname": "Test User",
      ...
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "..."
  }
}
```

Copy `accessToken` untuk digunakan di request selanjutnya.

---

## 👤 USER UPDATE ENDPOINT Tests

### ✅ Test 1: Update Own Information (SUCCESS)

```http
PUT http://localhost:3000/users/1
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "email": "newemail@example.com",
  "fullname": "Nama Baru",
  "phone": "+6281234567890"
}
```

**Expected Response (200 OK):**

```json
{
  "success": true,
  "message": "Informasi user berhasil diperbarui",
  "data": {
    "id": 1,
    "email": "newemail@example.com",
    "fullname": "Nama Baru",
    "phone": "+6281234567890",
    "role": "customer",
    "isVerified": true,
    "createdAt": "2026-02-05T...",
    "updatedAt": "2026-02-05T..."
  }
}
```

---

### ✅ Test 2: Update Only Email

```http
PUT http://localhost:3000/users/1
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "email": "anotheremail@example.com"
}
```

**Expected Response (200 OK):**

```json
{
  "success": true,
  "message": "Informasi user berhasil diperbarui",
  "data": {
    "id": 1,
    "email": "anotheremail@example.com",
    "fullname": "Nama Baru",
    "phone": "+6281234567890",
    ...
  }
}
```

---

### ❌ Test 3: Try to Update Another User (FAIL)

```http
PUT http://localhost:3000/users/2
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "email": "otheremail@example.com"
}
```

**Expected Response (403 Forbidden):**

```json
{
  "success": false,
  "message": "Pengguna tidak memiliki akses",
  "errorCode": "HAS_NO_ACCESS"
}
```

> User 1 tidak bisa edit info User 2, meskipun User 1 adalah owner!

---

### ❌ Test 4: Invalid Email Format (FAIL)

```http
PUT http://localhost:3000/users/1
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "email": "invalid-email"
}
```

**Expected Response (400 Bad Request):**

```json
{
  "success": false,
  "message": "Format email tidak valid",
  "details": [...]
}
```

---

### ❌ Test 5: Phone Invalid Format (FAIL)

```http
PUT http://localhost:3000/users/1
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "phone": "123"
}
```

**Expected Response (400 Bad Request):**

```json
{
  "success": false,
  "message": "Nomor telepon harus berisi 8-15 digit angka",
  "details": [...]
}
```

---

### ❌ Test 6: No Fields to Update (FAIL)

```http
PUT http://localhost:3000/users/1
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{}
```

**Expected Response (400 Bad Request):**

```json
{
  "success": false,
  "message": "Minimal ada 1 field yang harus diubah",
  "details": [...]
}
```

---

### ❌ Test 7: Duplicate Email (FAIL)

Jika email `testuser@example.com` sudah ada:

```http
PUT http://localhost:3000/users/1
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "email": "testuser@example.com"
}
```

**Expected Response (409 Conflict):**

```json
{
  "success": false,
  "message": "Email sudah terdaftar",
  "errorCode": "EMAIL_ALREADY_EXISTS"
}
```

---

### ❌ Test 8: No Authorization Token (FAIL)

```http
PUT http://localhost:3000/users/1
Content-Type: application/json

{
  "email": "newemail@example.com"
}
```

**Expected Response (401 Unauthorized):**

```json
{
  "success": false,
  "message": "Token tidak ditemukan. Silakan login terlebih dahulu"
}
```

---

## 📢 ANNOUNCEMENT ENDPOINTS Tests

### ✅ Test 1: Create Announcement (Admin/Owner)

```http
POST http://localhost:3000/announcements
Authorization: Bearer YOUR_ADMIN_TOKEN
Content-Type: application/json

{
  "title": "Penawaran Spesial",
  "content": "Dapatkan diskon 20% untuk semua pemesanan",
  "forBranch": 1,
  "startDate": "2026-02-05T00:00:00Z",
  "endDate": "2026-02-28T23:59:59Z"
}
```

**Expected Response (201 Created):**

```json
{
  "success": true,
  "message": "Announcement berhasil dibuat",
  "data": {
    "id": 1,
    "title": "Penawaran Spesial",
    "content": "Dapatkan diskon 20% untuk semua pemesanan",
    "forBranch": 1,
    "startDate": "2026-02-05T00:00:00.000Z",
    "endDate": "2026-02-28T23:59:59.000Z",
    "createdAt": "2026-02-05T...",
    "updatedAt": "2026-02-05T..."
  }
}
```

---

### ✅ Test 2: Get All Announcements

```http
GET http://localhost:3000/announcements?skip=0&take=10
Content-Type: application/json
```

**Expected Response (200 OK):**

```json
{
  "success": true,
  "message": "Daftar announcement berhasil diambil",
  "data": [
    {
      "id": 1,
      "title": "Penawaran Spesial",
      "content": "Dapatkan diskon 20%...",
      "forBranch": 1,
      "startDate": "2026-02-05T00:00:00.000Z",
      "endDate": "2026-02-28T23:59:59.000Z",
      ...
    }
  ],
  "pagination": {
    "skip": 0,
    "take": 10,
    "total": 1
  }
}
```

---

### ✅ Test 3: Get Active Announcements Only (PUBLIC - No Auth Required)

```http
GET http://localhost:3000/announcements/active?skip=0&take=10&branchId=1
Content-Type: application/json
```

Returns only announcements where current date is between startDate and endDate.

---

### ✅ Test 4: Get Announcement by ID

```http
GET http://localhost:3000/announcements/1
Content-Type: application/json
```

---

### ✅ Test 5: Update Announcement (Partial Update)

```http
PUT http://localhost:3000/announcements/1
Authorization: Bearer YOUR_ADMIN_TOKEN
Content-Type: application/json

{
  "title": "Judul Baru",
  "endDate": "2026-03-15T23:59:59Z"
}
```

---

### ✅ Test 6: Delete Announcement

```http
DELETE http://localhost:3000/announcements/1
Authorization: Bearer YOUR_ADMIN_TOKEN
```

**Expected Response (200 OK):**

```json
{
  "success": true,
  "message": "Announcement berhasil dihapus"
}
```

---

### ❌ Test 7: Invalid Date Range (FAIL)

```http
POST http://localhost:3000/announcements
Authorization: Bearer YOUR_ADMIN_TOKEN
Content-Type: application/json

{
  "title": "Invalid",
  "content": "Content here",
  "startDate": "2026-02-28T23:59:59Z",
  "endDate": "2026-02-05T00:00:00Z"
}
```

**Expected Response (400 Bad Request):**

```json
{
  "success": false,
  "message": "Tanggal berakhir harus lebih besar dari tanggal mulai",
  "errorCode": "INVALID_ANNOUNCEMENT_DATE"
}
```

---

### ❌ Test 8: Non-Admin Create Announcement (FAIL)

Jika token dari customer:

```http
POST http://localhost:3000/announcements
Authorization: Bearer CUSTOMER_TOKEN
Content-Type: application/json

{
  "title": "...",
  "content": "...",
  "startDate": "...",
  "endDate": "..."
}
```

**Expected Response (403 Forbidden):**

```json
{
  "success": false,
  "message": "Unauthorized"
}
```

---

## 🚀 Testing dengan VS Code REST Client

1. **Copy seluruh test.http file** dari project
2. **Open file** di VS Code
3. **Click "Send Request"** di atas setiap endpoint
4. Response akan muncul di panel sebelah kanan

---

## 📝 Testing Checklist

### User Update

- [ ] Update all fields (email, fullname, phone)
- [ ] Update single field
- [ ] Try update another user → should fail (403)
- [ ] Invalid email format → should fail (400)
- [ ] Invalid phone format → should fail (400)
- [ ] No fields provided → should fail (400)
- [ ] Duplicate email → should fail (409)
- [ ] No token → should fail (401)

### Announcement

- [ ] Create announcement (admin)
- [ ] Get all announcements
- [ ] Get active announcements (public)
- [ ] Get by ID
- [ ] Update announcement
- [ ] Delete announcement
- [ ] Invalid date range → should fail (400)
- [ ] Customer create announcement → should fail (403)

---

## 💡 Tips

- Gunakan variable `@accessToken` di test.http untuk menyimpan token
- Ganti `YOUR_TOKEN` dengan token yang sebenarnya
- Check console server (`npm run dev`) untuk debugging
- Pastikan database sudah ter-setup dengan benar
