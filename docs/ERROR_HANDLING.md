# Error Handling - Game Station API

Panduan lengkap tentang error codes, error handling, dan best practices.

## Daftar Isi

1. [Error Response Format](#error-response-format)
2. [HTTP Status Codes](#http-status-codes)
3. [Error Codes & Categories](#error-codes--categories)
4. [Error Handling Best Practices](#error-handling-best-practices)
5. [Troubleshooting Guide](#troubleshooting-guide)

---

## Error Response Format

Semua error response mengikuti format yang konsisten:

### Standard Error Response

```json
{
  "success": false,
  "message": "Deskripsi error yang user-friendly",
  "error": {
    "code": "ERROR_CODE",
    "statusCode": 400,
    "details": "Detail teknis (optional)",
    "timestamp": "2026-01-19T10:30:00.000Z"
  }
}
```

### Dengan Validation Errors

```json
{
  "success": false,
  "message": "Validasi gagal",
  "error": {
    "code": "VALIDATION_ERROR",
    "statusCode": 422,
    "details": "Data tidak sesuai requirements",
    "fields": [
      {
        "field": "email",
        "message": "Email harus valid"
      },
      {
        "field": "password",
        "message": "Password minimal 8 karakter"
      }
    ]
  }
}
```

---

## HTTP Status Codes

| Code | Status                | Deskripsi                          | Contoh                         |
| ---- | --------------------- | ---------------------------------- | ------------------------------ |
| 200  | OK                    | Request sukses                     | GET /booking/branches          |
| 201  | Created               | Resource berhasil dibuat           | POST /auth/register            |
| 204  | No Content            | Request sukses, no body            | DELETE /orders/:id             |
| 400  | Bad Request           | Request invalid                    | Durasi < 30 menit              |
| 401  | Unauthorized          | Token missing/invalid              | Missing Authorization header   |
| 403  | Forbidden             | Token valid tapi tidak punya akses | Customer access admin endpoint |
| 404  | Not Found             | Resource tidak ditemukan           | Branch ID tidak ada            |
| 409  | Conflict              | Conflict dengan data existing      | Email sudah terdaftar          |
| 422  | Unprocessable Entity  | Validasi data gagal                | Invalid field value            |
| 429  | Too Many Requests     | Rate limit exceeded                | Terlalu banyak request         |
| 500  | Internal Server Error | Server error                       | Database connection error      |
| 503  | Service Unavailable   | Server maintenance                 | Service temporarily down       |

---

## Error Codes & Categories

### 1. Authentication Errors (401)

#### AUTH_INVALID_CREDENTIALS

- **HTTP Status:** 401
- **Message:** "Email atau password salah"
- **Penyebab:** Login gagal karena email/password tidak cocok
- **Solusi:** Periksa email dan password, atau gunakan "Lupa Password"

```json
{
  "success": false,
  "message": "Email atau password salah",
  "error": {
    "code": "AUTH_INVALID_CREDENTIALS",
    "statusCode": 401
  }
}
```

#### AUTH_INVALID_TOKEN

- **HTTP Status:** 401
- **Message:** "Token tidak valid"
- **Penyebab:** Token expired, signature invalid, atau malformed
- **Solusi:** Refresh token atau login kembali

```json
{
  "success": false,
  "message": "Token tidak valid atau sudah expired",
  "error": {
    "code": "AUTH_INVALID_TOKEN",
    "statusCode": 401,
    "details": "Token expired at 2026-01-19T10:15:00Z"
  }
}
```

#### AUTH_TOKEN_EXPIRED

- **HTTP Status:** 401
- **Message:** "Token sudah expired"
- **Penyebab:** Access token berlaku 15 menit
- **Solusi:** Gunakan refresh token untuk mendapat access token baru

```json
{
  "success": false,
  "message": "Token sudah expired",
  "error": {
    "code": "AUTH_TOKEN_EXPIRED",
    "statusCode": 401
  }
}
```

#### AUTH_MISSING_TOKEN

- **HTTP Status:** 401
- **Message:** "Authorization header tidak ditemukan"
- **Penyebab:** Request tidak menyertakan Authorization header
- **Solusi:** Tambahkan header `Authorization: Bearer <token>`

```json
{
  "success": false,
  "message": "Authorization header tidak ditemukan",
  "error": {
    "code": "AUTH_MISSING_TOKEN",
    "statusCode": 401
  }
}
```

#### AUTH_INSUFFICIENT_PERMISSION

- **HTTP Status:** 403
- **Message:** "Anda tidak punya akses ke resource ini"
- **Penyebab:** User role tidak sesuai dengan endpoint
- **Solusi:** Login dengan user yang tepat

```json
{
  "success": false,
  "message": "Anda tidak punya akses ke resource ini",
  "error": {
    "code": "AUTH_INSUFFICIENT_PERMISSION",
    "statusCode": 403,
    "details": "Endpoint ini hanya untuk admin"
  }
}
```

#### AUTH_OTP_INVALID

- **HTTP Status:** 401
- **Message:** "OTP tidak valid atau sudah expired"
- **Penyebab:** OTP salah atau sudah expired (5 menit)
- **Solusi:** Request OTP baru

```json
{
  "success": false,
  "message": "OTP tidak valid atau sudah expired",
  "error": {
    "code": "AUTH_OTP_INVALID",
    "statusCode": 401
  }
}
```

---

### 2. Resource Not Found Errors (404)

#### RESOURCE_NOT_FOUND

- **HTTP Status:** 404
- **Message:** "Resource tidak ditemukan"
- **Penyebab:** ID tidak ada di database
- **Solusi:** Verifikasi ID

```json
{
  "success": false,
  "message": "Branch tidak ditemukan",
  "error": {
    "code": "RESOURCE_NOT_FOUND",
    "statusCode": 404,
    "details": "Branch dengan ID 999 tidak ada"
  }
}
```

#### BRANCH_NOT_FOUND

- **HTTP Status:** 404
- **Message:** "Cabang tidak ditemukan"

#### ORDER_NOT_FOUND

- **HTTP Status:** 404
- **Message:** "Order tidak ditemukan"

#### DEVICE_NOT_FOUND

- **HTTP Status:** 404
- **Message:** "Device tidak ditemukan"

---

### 3. Validation Errors (422)

#### VALIDATION_ERROR

- **HTTP Status:** 422
- **Message:** "Validasi gagal"
- **Penyebab:** Field tidak valid atau missing
- **Solusi:** Perbaiki field sesuai error details

```json
{
  "success": false,
  "message": "Validasi gagal",
  "error": {
    "code": "VALIDATION_ERROR",
    "statusCode": 422,
    "fields": [
      {
        "field": "durationMinutes",
        "message": "Durasi minimal 30 menit"
      },
      {
        "field": "bookingDate",
        "message": "Tanggal tidak boleh di masa lalu"
      }
    ]
  }
}
```

#### INVALID_EMAIL_FORMAT

- **HTTP Status:** 422
- **Message:** "Format email tidak valid"

#### INVALID_PHONE_FORMAT

- **HTTP Status:** 422
- **Message:** "Format nomor telepon tidak valid"

#### INVALID_PASSWORD_FORMAT

- **HTTP Status:** 422
- **Message:** "Password harus minimal 8 karakter dengan kombinasi huruf besar, kecil, angka, dan simbol"

#### INVALID_DURATION

- **HTTP Status:** 422
- **Message:** "Durasi harus minimal 30 menit"

#### INVALID_BOOKING_DATE

- **HTTP Status:** 422
- **Message:** "Tanggal booking tidak boleh di masa lalu"

#### MISSING_REQUIRED_FIELD

- **HTTP Status:** 422
- **Message:** "Field <fieldName> tidak boleh kosong"

---

### 4. Conflict Errors (409)

#### RESOURCE_ALREADY_EXISTS

- **HTTP Status:** 409
- **Message:** "Resource sudah ada"
- **Penyebab:** Duplikasi unik field
- **Solusi:** Gunakan resource yang berbeda

```json
{
  "success": false,
  "message": "Email sudah terdaftar",
  "error": {
    "code": "RESOURCE_ALREADY_EXISTS",
    "statusCode": 409,
    "details": "Email customer@test.com sudah terdaftar dengan user ID 5"
  }
}
```

#### EMAIL_ALREADY_REGISTERED

- **HTTP Status:** 409
- **Message:** "Email sudah terdaftar"
- **Solusi:** Gunakan email lain atau login

#### DEVICE_NOT_AVAILABLE

- **HTTP Status:** 409
- **Message:** "Device tidak tersedia untuk jam tersebut"
- **Penyebab:** Device sudah dibooking
- **Solusi:** Pilih device/waktu lain

```json
{
  "success": false,
  "message": "Device tidak tersedia untuk jam tersebut",
  "error": {
    "code": "DEVICE_NOT_AVAILABLE",
    "statusCode": 409,
    "details": "PS5 Room 1 sudah dibooking 14:00-16:00",
    "suggestedTimes": ["16:00", "17:00", "18:00"]
  }
}
```

---

### 5. Business Logic Errors (400)

#### INVALID_ORDER_STATUS

- **HTTP Status:** 400
- **Message:** "Status order tidak valid untuk aksi ini"
- **Penyebab:** Aksi tidak sesuai dengan status order
- **Solusi:** Periksa status order

```json
{
  "success": false,
  "message": "Tidak bisa checkout order yang sudah dibayar",
  "error": {
    "code": "INVALID_ORDER_STATUS",
    "statusCode": 400,
    "details": "Order status: paid"
  }
}
```

#### PAYMENT_FAILED

- **HTTP Status:** 400
- **Message:** "Pembayaran gagal"
- **Penyebab:** Error dari payment gateway
- **Solusi:** Coba lagi atau gunakan metode pembayaran lain

```json
{
  "success": false,
  "message": "Pembayaran gagal",
  "error": {
    "code": "PAYMENT_FAILED",
    "statusCode": 400,
    "details": "Card declined by issuer",
    "gatewayErrorCode": "card_declined"
  }
}
```

#### INSUFFICIENT_BALANCE

- **HTTP Status:** 400
- **Message:** "Saldo tidak cukup"
- **Penyebab:** E-wallet tidak punya saldo cukup
- **Solusi:** Top-up e-wallet

#### BOOKING_TIME_CONFLICT

- **HTTP Status:** 400
- **Message:** "Waktu booking bertabrakan dengan booking lain"
- **Penyebab:** Device sudah ada booking pada waktu tersebut
- **Solusi:** Pilih waktu lain

#### BRANCH_CLOSED

- **HTTP Status:** 400
- **Message:** "Cabang sedang tutup pada jam yang dipilih"
- **Penyebab:** Booking di luar jam operasional
- **Solusi:** Pilih waktu dalam jam operasional

#### BRANCH_HOLIDAY

- **HTTP Status:** 400
- **Message:** "Cabang tutup pada tanggal tersebut (hari libur)"
- **Penyebab:** Booking pada hari libur
- **Solusi:** Pilih tanggal lain

#### EXTENSION_NOT_AVAILABLE

- **HTTP Status:** 400
- **Message:** "Tidak bisa extend session, device sudah dibooking setelahnya"
- **Penyebab:** Tidak ada slot tersedia untuk extend
- **Solusi:** Gunakan device lain atau tidak perlu extend

---

### 6. Server Errors (500)

#### INTERNAL_SERVER_ERROR

- **HTTP Status:** 500
- **Message:** "Terjadi kesalahan pada server"
- **Penyebab:** Bug atau error tidak terduga
- **Solusi:** Report ke tim development

```json
{
  "success": false,
  "message": "Terjadi kesalahan pada server",
  "error": {
    "code": "INTERNAL_SERVER_ERROR",
    "statusCode": 500,
    "details": "Error: Connection timeout",
    "errorId": "ERR-2026-01-19-001"
  }
}
```

#### DATABASE_ERROR

- **HTTP Status:** 500
- **Message:** "Kesalahan database"
- **Penyebab:** Query error atau connection issue
- **Solusi:** Coba lagi nanti

#### EXTERNAL_SERVICE_ERROR

- **HTTP Status:** 500
- **Message:** "Error dari layanan eksternal"
- **Penyebab:** Payment gateway, email service, dll error
- **Solusi:** Coba lagi nanti

#### RATE_LIMIT_EXCEEDED

- **HTTP Status:** 429
- **Message:** "Terlalu banyak request, silahkan coba lagi nanti"
- **Penyebab:** Melebihi batas request per minute
- **Solusi:** Tunggu beberapa saat sebelum request lagi

```json
{
  "success": false,
  "message": "Terlalu banyak request",
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "statusCode": 429,
    "details": "Limit: 100 requests per minute",
    "retryAfter": 60
  }
}
```

---

## Error Handling Best Practices

### 1. Client-Side Error Handling

#### JavaScript/TypeScript

```typescript
interface ApiError {
  success: false;
  message: string;
  error: {
    code: string;
    statusCode: number;
    details?: string;
    fields?: Array<{ field: string; message: string }>;
  };
}

async function makeRequest(url: string, options: any) {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getAccessToken()}`,
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error: ApiError = await response.json();
      throw new ApiException(error);
    }

    return response.json();
  } catch (error) {
    handleError(error);
  }
}

function handleError(error: any) {
  if (error instanceof ApiException) {
    const { code, statusCode, message } = error.data.error;

    switch (code) {
      case "AUTH_TOKEN_EXPIRED":
        // Refresh token dan retry
        refreshTokenAndRetry();
        break;

      case "AUTH_INVALID_CREDENTIALS":
        // Show login form
        showLoginModal();
        break;

      case "VALIDATION_ERROR":
        // Show validation errors
        showFieldErrors(error.data.error.fields);
        break;

      case "DEVICE_NOT_AVAILABLE":
        // Show suggested times
        showAlternativeBookings(error.data.error.suggestedTimes);
        break;

      case "PAYMENT_FAILED":
        // Show retry option with different payment method
        showPaymentRetryModal();
        break;

      default:
        // Show generic error
        showErrorNotification(message || "Terjadi kesalahan");
    }
  } else {
    // Network error or parsing error
    console.error("Network error:", error);
    showErrorNotification("Koneksi gagal, cek internet Anda");
  }
}

class ApiException extends Error {
  constructor(public data: ApiError) {
    super(data.message);
  }
}
```

#### React Example

```jsx
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

function BookingComponent() {
  const [error, setError] = useState(null);

  const {
    data,
    isLoading,
    error: queryError,
  } = useQuery({
    queryKey: ["branches"],
    queryFn: async () => {
      const response = await fetch("/api/booking/branches", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
      }

      return response.json();
    },
    retry: (failureCount, error) => {
      // Don't retry auth errors
      if (error.message.includes("AUTH_")) return false;
      // Retry other errors up to 3 times
      return failureCount < 3;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  if (queryError) {
    return <ErrorAlert message={queryError.message} />;
  }

  return <div>{/* Render branches */}</div>;
}
```

### 2. API Request Interceptor

```typescript
// axios interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { response } = error;

    // Handle token expiry
    if (
      response?.status === 401 &&
      response?.data?.error?.code === "AUTH_TOKEN_EXPIRED"
    ) {
      const refreshToken = getRefreshToken();

      try {
        const { data } = await api.post("/auth/refresh-token", {
          refreshToken,
        });
        setAccessToken(data.data.accessToken);
        setRefreshToken(data.data.refreshToken);

        // Retry original request
        return api(error.config);
      } catch (refreshError) {
        // Refresh failed, redirect to login
        redirectToLogin();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);
```

### 3. Logging & Monitoring

```typescript
// Log error untuk debugging
function logError(error: ApiError) {
  const errorLog = {
    timestamp: new Date().toISOString(),
    code: error.error.code,
    statusCode: error.error.statusCode,
    message: error.message,
    url: window.location.href,
    userAgent: navigator.userAgent,
    userId: getCurrentUserId(),
  };

  // Send to error tracking service
  fetch("/api/logs/errors", {
    method: "POST",
    body: JSON.stringify(errorLog),
  });

  // Also log to console in development
  if (process.env.NODE_ENV === "development") {
    console.error("API Error:", errorLog);
  }
}
```

---

## Troubleshooting Guide

### Problem: "Token tidak valid"

**Kemungkinan penyebab:**

1. Token sudah expired (15 menit)
2. Token di-copy salah
3. Token dari user lain
4. Server time tidak sync

**Solusi:**

```typescript
// Refresh token
const response = await fetch("/auth/refresh-token", {
  method: "POST",
  body: JSON.stringify({
    refreshToken: localStorage.getItem("refreshToken"),
  }),
});

if (response.ok) {
  const data = await response.json();
  localStorage.setItem("accessToken", data.data.accessToken);
  // Retry request
}
```

### Problem: "Device tidak tersedia"

**Kemungkinan penyebab:**

1. Device sudah dibooking customer lain
2. Device sedang maintenance
3. Device melebihi kapasitas
4. Booking bertabrakan dengan jam sebelumnya

**Solusi:**

```typescript
// Check availability terlebih dahulu
const availability = await checkAvailability({
  roomAndDeviceId: 101,
  bookingDate: "2026-01-25",
  startTime: "14:00",
  durationMinutes: 120,
});

if (availability.available) {
  // Proceed with booking
} else {
  // Show alternative times
  showSuggestedTimes(availability.suggestedTimes);
}
```

### Problem: "Pembayaran gagal"

**Kemungkinan penyebab:**

1. Saldo tidak cukup
2. Card declined
3. Server pembayaran error
4. Timeout

**Solusi:**

```typescript
// Try different payment method
async function retryPayment(orderId, newPaymentMethod) {
  try {
    const response = await fetch(`/payments`, {
      method: "POST",
      body: JSON.stringify({
        orderId,
        paymentMethod: newPaymentMethod,
        amount: orderTotal,
      }),
    });

    if (response.ok) {
      return showSuccess("Pembayaran berhasil");
    }
  } catch (error) {
    // Handle specific error
    if (error.error.code === "INSUFFICIENT_BALANCE") {
      showMessage("Saldo tidak cukup, silahkan top-up");
    }
  }
}
```

### Problem: "Email sudah terdaftar"

**Solusi:**

```javascript
// Offer login or use different email
if (error.code === "EMAIL_ALREADY_REGISTERED") {
  showOptions([
    { text: "Login dengan email ini", action: goToLogin },
    { text: "Gunakan email lain", action: resetEmailField },
  ]);
}
```

### Problem: Request timeout

**Penyebab:**

1. Koneksi lambat
2. Server lambat
3. Request terlalu besar

**Solusi:**

```typescript
// Set timeout dan retry
const api = axios.create({
  timeout: 10000, // 10 seconds
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === "ECONNABORTED") {
      console.error("Request timeout, retrying...");
      // Retry logic
    }
    return Promise.reject(error);
  },
);
```

---

## Summary Table

| Error Code               | Status | Solusi                   |
| ------------------------ | ------ | ------------------------ |
| AUTH_TOKEN_EXPIRED       | 401    | Refresh token            |
| AUTH_INVALID_CREDENTIALS | 401    | Check email/password     |
| DEVICE_NOT_AVAILABLE     | 409    | Pilih waktu lain         |
| EMAIL_ALREADY_REGISTERED | 409    | Gunakan email lain/login |
| VALIDATION_ERROR         | 422    | Perbaiki field           |
| PAYMENT_FAILED           | 400    | Retry dengan metode lain |
| BRANCH_CLOSED            | 400    | Pilih waktu operasional  |
| INTERNAL_SERVER_ERROR    | 500    | Report & retry nanti     |

---

**Last Updated:** January 19, 2026
