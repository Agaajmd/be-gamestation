# Usage Guide - Game Station API

Panduan penggunaan fitur-fitur utama Game Station API.

## Daftar Isi

1. [Authentication Flow](#authentication-flow)
2. [Booking Flow](#booking-flow)
3. [Order Management](#order-management)
4. [Payment Processing](#payment-processing)
5. [Session Management](#session-management)
6. [Common Patterns](#common-patterns)

---

## Authentication Flow

### Scenario 1: Register dan Login dengan Email & Password

#### Step 1: Register User

```http
POST /auth/register
Content-Type: application/json

{
  "email": "customer@example.com",
  "password": "SecurePass123!",
  "fullname": "John Doe",
  "phone": "081234567890"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Registrasi berhasil",
  "data": {
    "user": {
      "id": "1",
      "email": "customer@example.com",
      "fullname": "John Doe",
      "role": "customer",
      "phone": "081234567890"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### Step 2: Simpan Tokens

```javascript
// Client-side (React/Vue/etc)
localStorage.setItem("accessToken", response.data.accessToken);
localStorage.setItem("refreshToken", response.data.refreshToken);
```

#### Step 3: Gunakan Access Token untuk API Calls

Semua request yang memerlukan autentikasi harus menyertakan header:

```http
GET /booking/branches
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Scenario 2: Login dengan OTP (Tanpa Password)

#### Step 1: Request OTP

Ketika user belum terdaftar atau ingin login via OTP:

```http
POST /auth/request-otp
Content-Type: application/json

{
  "email": "customer@example.com"
}
```

**Response:**

```json
{
  "success": true,
  "message": "OTP telah dikirim ke email Anda",
  "data": {
    "expiresIn": 300 // 5 menit
  }
}
```

#### Step 2: Verify OTP

User akan menerima email berisi OTP 6 digit.

```http
POST /auth/verify-otp
Content-Type: application/json

{
  "email": "customer@example.com",
  "otp": "123456"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Login berhasil",
  "data": {
    "user": {
      "id": "1",
      "email": "customer@example.com",
      "fullname": "John Doe",
      "role": "customer"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Scenario 3: Token Refresh

Ketika access token sudah expired (berlaku 15 menit):

```http
POST /auth/refresh-token
Content-Type: application/json

{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response:**

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

### Scenario 4: Logout

```http
POST /auth/logout
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response:**

```json
{
  "success": true,
  "message": "Logout berhasil",
  "data": null
}
```

---

## Booking Flow

Complete flow dari customer memilih branch hingga checkout.

### Step 1: Lihat Semua Branch

Customer membuka halaman booking dan melihat daftar cabang.

```http
GET /booking/branches
```

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": "1",
      "name": "Game Station Jakarta Pusat",
      "address": "Jl. Sudirman No. 123, Jakarta Pusat",
      "phone": "021-12345678",
      "openTime": "09:00:00",
      "closeTime": "23:00:00",
      "amenities": ["wifi", "parking", "cafe", "food-court"],
      "_count": {
        "devices": 25
      }
    },
    {
      "id": "2",
      "name": "Game Station Jakarta Selatan",
      "address": "Jl. Gatot Subroto No. 456, Jakarta Selatan",
      "phone": "021-87654321",
      "openTime": "10:00:00",
      "closeTime": "22:00:00",
      "amenities": ["wifi", "parking", "toilet"],
      "_count": {
        "devices": 18
      }
    }
  ]
}
```

### Step 2: Lihat Device Types dan Harga

Setelah memilih branch (Branch ID: 1), customer melihat tipe device yang tersedia.

```http
GET /booking/branches/1/device-types
```

**Response:**

```json
{
  "success": true,
  "data": {
    "ps": [
      {
        "version": "ps4",
        "pricePerHour": "50000.00",
        "availableCount": 5
      },
      {
        "version": "ps5",
        "pricePerHour": "75000.00",
        "availableCount": 8
      }
    ],
    "racing": [
      {
        "version": "racing_arcade",
        "pricePerHour": "80000.00",
        "availableCount": 3
      }
    ],
    "vr": [
      {
        "version": "vr_meta_quest_3",
        "pricePerHour": "100000.00",
        "availableCount": 2
      }
    ]
  }
}
```

### Step 3: Lihat Device Spesifik dan Kategori

Customer memilih device type (PS5) dan melihat ruangan spesifik beserta kategori.

```http
GET /booking/branches/1/ps/ps5
```

**Response:**

```json
{
  "success": true,
  "data": {
    "devices": [
      {
        "id": "101",
        "name": "PS5 Room 1",
        "roomNumber": "R-01",
        "pricePerHour": "75000.00",
        "status": "available",
        "categories": [
          {
            "id": "c1",
            "name": "Regular",
            "tier": "regular",
            "pricePerHour": "0.00",
            "description": "Ruangan standar dengan fasilitas dasar"
          },
          {
            "id": "c2",
            "name": "VIP",
            "tier": "vip",
            "pricePerHour": "25000.00",
            "description": "Ruangan dengan AC dan sofa nyaman"
          },
          {
            "id": "c3",
            "name": "VVIP",
            "tier": "vvip",
            "pricePerHour": "50000.00",
            "description": "Ruangan premium dengan mini bar dan gaming setup pro"
          }
        ]
      },
      {
        "id": "102",
        "name": "PS5 Room 2",
        "roomNumber": "R-02",
        "pricePerHour": "75000.00",
        "status": "available",
        "categories": [
          {
            "id": "c1",
            "name": "Regular",
            "tier": "regular",
            "pricePerHour": "0.00"
          },
          {
            "id": "c2",
            "name": "VIP",
            "tier": "vip",
            "pricePerHour": "25000.00"
          }
        ]
      }
    ]
  }
}
```

### Step 4: Cek Availability

Customer memilih tanggal dan jam, kemudian cek ketersediaan.

```http
POST /booking/check-availability
Content-Type: application/json
Authorization: Bearer <token>

{
  "branchId": "1",
  "roomAndDeviceId": "101",
  "bookingDate": "2026-01-25",
  "startTime": "14:00",
  "durationMinutes": 120
}
```

**Response Success:**

```json
{
  "success": true,
  "message": "Device tersedia untuk jam yang diminta",
  "data": {
    "available": true,
    "bookingStart": "2026-01-25T14:00:00.000Z",
    "bookingEnd": "2026-01-25T16:00:00.000Z",
    "conflicts": []
  }
}
```

**Response Conflict:**

```json
{
  "success": true,
  "message": "Device tidak tersedia pada waktu tersebut",
  "data": {
    "available": false,
    "conflicts": [
      {
        "bookingStart": "2026-01-25T14:30:00.000Z",
        "bookingEnd": "2026-01-25T15:30:00.000Z"
      }
    ],
    "suggestedTimes": ["16:00", "17:00", "18:00"]
  }
}
```

---

## Order Management

### Step 1: Tambah ke Keranjang (Add to Cart)

Setelah cek availability, customer tambahkan ke keranjang.

```http
POST /orders
Content-Type: application/json
Authorization: Bearer <token>

{
  "branchId": "1",
  "roomAndDeviceId": "101",
  "categoryId": "c2",
  "bookingDate": "2026-01-25",
  "startTime": "14:00",
  "durationMinutes": 120,
  "notes": "Minta controller wireless yang baru"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Berhasil ditambahkan ke keranjang",
  "data": {
    "id": "o1",
    "orderCode": "ORD-ABC123DEF",
    "customerId": "1",
    "status": "cart",
    "totalAmount": "220000.00",
    "orderItems": [
      {
        "id": "oi1",
        "roomAndDeviceId": "101",
        "durationMinutes": 120,
        "roomName": "PS5 Room 1",
        "deviceType": "ps",
        "version": "ps5",
        "basePrice": "150000.00",
        "categoryName": "VIP",
        "categoryFee": "50000.00",
        "totalPrice": "200000.00"
      }
    ]
  }
}
```

### Step 2: Lihat Keranjang

Customer bisa melihat apa yang ada di keranjang sebelum checkout.

```http
GET /orders/cart
Authorization: Bearer <token>
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "o1",
    "orderCode": "ORD-ABC123DEF",
    "status": "cart",
    "items": [
      {
        "id": "oi1",
        "roomName": "PS5 Room 1",
        "durationMinutes": 120,
        "bookingDate": "2026-01-25",
        "startTime": "14:00",
        "endTime": "16:00",
        "categoryName": "VIP",
        "basePrice": "150000.00",
        "categoryFee": "50000.00",
        "totalPrice": "200000.00"
      }
    ],
    "subtotal": "200000.00",
    "taxes": "20000.00",
    "totalAmount": "220000.00"
  }
}
```

### Step 3: Update Order (Edit Item)

Jika ingin mengubah durasi atau item.

```http
PUT /orders/o1/items/oi1
Content-Type: application/json
Authorization: Bearer <token>

{
  "durationMinutes": 180
}
```

**Response:**

```json
{
  "success": true,
  "message": "Item berhasil diupdate",
  "data": {
    "id": "oi1",
    "durationMinutes": 180,
    "basePrice": "225000.00",
    "categoryFee": "50000.00",
    "totalPrice": "275000.00"
  }
}
```

### Step 4: Remove Item dari Keranjang

```http
DELETE /orders/o1/items/oi1
Authorization: Bearer <token>
```

**Response:**

```json
{
  "success": true,
  "message": "Item berhasil dihapus dari keranjang"
}
```

### Step 5: Checkout (Convert Cart to Order)

```http
POST /orders/o1/checkout
Content-Type: application/json
Authorization: Bearer <token>

{
  "paymentMethod": "credit_card",
  "paymentDetails": {
    "cardNumber": "4111111111111111",
    "expiryDate": "12/25",
    "cvv": "123"
  }
}
```

**Response:**

```json
{
  "success": true,
  "message": "Order berhasil dibuat dan pembayaran diproses",
  "data": {
    "id": "o1",
    "orderCode": "ORD-ABC123DEF",
    "status": "confirmed",
    "paymentStatus": "paid",
    "bookings": [
      {
        "id": "b1",
        "bookingCode": "BK-001-20260125",
        "bookingDate": "2026-01-25",
        "startTime": "14:00",
        "endTime": "16:00",
        "roomName": "PS5 Room 1",
        "checkInCode": "QRCODE123"
      }
    ],
    "totalAmount": "220000.00",
    "transactionId": "TRX-2026011900123"
  }
}
```

---

## Payment Processing

### Metode Pembayaran yang Didukung

1. **Credit Card** - Kartu kredit VISA/Mastercard
2. **Debit Card** - Kartu debit
3. **E-Wallet** - OVO, GoPay, DANA
4. **Bank Transfer** - Transfer bank manual
5. **Cicilan** - Cicilan 0% (Tenor 3/6/12 bulan)

### Step 1: Check Payment Methods

```http
GET /payment/methods
Authorization: Bearer <token>
```

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": "pm_credit_card",
      "name": "Credit Card",
      "type": "credit_card",
      "available": true,
      "fee": "0.029",
      "description": "Biaya 2.9%"
    },
    {
      "id": "pm_ewallet",
      "name": "E-Wallet",
      "type": "ewallet",
      "available": true,
      "fee": "0.015",
      "providers": ["ovo", "gopay", "dana"]
    },
    {
      "id": "pm_bank_transfer",
      "name": "Transfer Bank",
      "type": "bank_transfer",
      "available": true,
      "fee": "0.0"
    }
  ]
}
```

### Step 2: Process Payment

```http
POST /payments
Content-Type: application/json
Authorization: Bearer <token>

{
  "orderId": "o1",
  "paymentMethod": "credit_card",
  "amount": "220000.00",
  "cardDetails": {
    "cardNumber": "4111111111111111",
    "cardholderName": "JOHN DOE",
    "expiryDate": "12/25",
    "cvv": "123"
  }
}
```

**Response Success:**

```json
{
  "success": true,
  "message": "Pembayaran berhasil diproses",
  "data": {
    "id": "p1",
    "orderId": "o1",
    "transactionId": "TRX-2026011900123",
    "status": "success",
    "amount": "220000.00",
    "paymentMethod": "credit_card",
    "paidAt": "2026-01-19T10:30:00.000Z"
  }
}
```

### Step 3: Get Payment Status

```http
GET /payments/p1
Authorization: Bearer <token>
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "p1",
    "transactionId": "TRX-2026011900123",
    "status": "success",
    "amount": "220000.00",
    "currency": "IDR",
    "paymentMethod": "credit_card",
    "createdAt": "2026-01-19T10:30:00.000Z",
    "paidAt": "2026-01-19T10:30:05.000Z"
  }
}
```

---

## Session Management

### Step 1: Check-In

Sebelum booking dimulai, customer check-in menggunakan QR code atau check-in code.

```http
POST /sessions/check-in
Content-Type: application/json
Authorization: Bearer <token>

{
  "checkInCode": "QRCODE123",
  "branchId": "1"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Check-in berhasil",
  "data": {
    "id": "s1",
    "bookingId": "b1",
    "checkInTime": "2026-01-25T14:00:00.000Z",
    "roomName": "PS5 Room 1",
    "durationMinutes": 120,
    "remainingMinutes": 120,
    "endTime": "2026-01-25T16:00:00.000Z"
  }
}
```

### Step 2: Get Active Session

```http
GET /sessions/active
Authorization: Bearer <token>
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "s1",
    "bookingId": "b1",
    "roomName": "PS5 Room 1",
    "checkInTime": "2026-01-25T14:00:00.000Z",
    "remainingMinutes": 85,
    "totalDuration": 120,
    "endTime": "2026-01-25T16:00:00.000Z",
    "status": "active"
  }
}
```

### Step 3: Extend Session

Customer bisa extend booking jika tersedia slot berikutnya.

```http
POST /sessions/s1/extend
Content-Type: application/json
Authorization: Bearer <token>

{
  "additionalMinutes": 60
}
```

**Response:**

```json
{
  "success": true,
  "message": "Session berhasil diperpanjang",
  "data": {
    "id": "s1",
    "newEndTime": "2026-01-25T17:00:00.000Z",
    "extensionCost": "75000.00",
    "totalCost": "295000.00"
  }
}
```

### Step 4: Check-Out

Ketika session selesai, customer check-out.

```http
POST /sessions/s1/check-out
Authorization: Bearer <token>
```

**Response:**

```json
{
  "success": true,
  "message": "Check-out berhasil",
  "data": {
    "id": "s1",
    "checkOutTime": "2026-01-25T16:00:00.000Z",
    "totalDuration": 120,
    "totalCost": "220000.00",
    "status": "completed"
  }
}
```

---

## Common Patterns

### Error Handling

Semua error response mengikuti format yang konsisten:

```json
{
  "success": false,
  "message": "Deskripsi error yang user-friendly",
  "error": {
    "code": "ERROR_CODE",
    "details": "Detail teknis (jika ada)"
  }
}
```

Contoh error response:

```http
POST /orders
Authorization: Bearer invalid_token

{
  "success": false,
  "message": "Token tidak valid",
  "error": {
    "code": "AUTH_INVALID_TOKEN",
    "statusCode": 401
  }
}
```

### Pagination

API yang mengembalikan list data mendukung pagination:

```http
GET /booking/branches?page=1&limit=10&sort=-createdAt
```

**Response:**

```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "totalPages": 3
  }
}
```

### Search dan Filter

```http
GET /booking/branches?search=Jakarta&amenities=wifi,parking&status=open
```

### Sorting

```http
GET /orders?sort=-createdAt   # Descending
GET /orders?sort=totalAmount  # Ascending
```

---

## Best Practices

### 1. Simpan Tokens dengan Aman

```javascript
// ❌ JANGAN
localStorage.setItem("token", response.data.accessToken);

// ✅ LAKUKAN
sessionStorage.setItem("accessToken", response.data.accessToken);
sessionStorage.setItem("refreshToken", response.data.refreshToken);

// Untuk extra security, simpan refresh token di httpOnly cookie
document.cookie = `refreshToken=${response.data.refreshToken}; HttpOnly; Secure; SameSite=Strict`;
```

### 2. Refresh Token Otomatis

```javascript
const api = axios.create({
  baseURL: "http://localhost:3000",
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      const refreshToken = sessionStorage.getItem("refreshToken");
      const res = await axios.post("/auth/refresh-token", { refreshToken });
      sessionStorage.setItem("accessToken", res.data.data.accessToken);
      return api(error.config);
    }
    return Promise.reject(error);
  },
);
```

### 3. Handle Network Errors

```javascript
try {
  const response = await api.post("/orders", orderData);
  // Handle success
} catch (error) {
  if (error.response) {
    // Server responded with error status
    console.error(error.response.data.message);
  } else if (error.request) {
    // Request made but no response
    console.error("No response from server");
  } else {
    // Error dalam setup request
    console.error("Error:", error.message);
  }
}
```

### 4. Validasi Data Client-Side

```javascript
const validateBooking = (bookingData) => {
  if (!bookingData.branchId) throw new Error("Branch harus dipilih");
  if (!bookingData.roomAndDeviceId) throw new Error("Device harus dipilih");
  if (bookingData.durationMinutes < 30)
    throw new Error("Durasi minimal 30 menit");
  if (new Date(bookingData.bookingDate) < new Date())
    throw new Error("Tanggal tidak valid");
  return true;
};
```

---

**Last Updated:** January 19, 2026
