# Custom Order (Walk-in/Offline Customers) Documentation

## Overview

Custom Order adalah endpoint untuk staff/owner membuat order untuk customer yang datang langsung ke store (walk-in/offline customers).

Ada 2 jenis custom order:

1. **Member Customer** → Sudah punya akun (customerId)
2. **Guest Customer** → Belum punya akun (cukup kasih nama + nomor telepon)

## Flow

Custom order mengikuti flow yang sama seperti regular order:

1. **POST /orders/custom** → Add custom order to cart (staff/owner)
2. **POST /orders/:id/checkout** → Checkout order (customer atau staff/owner)

## Perbedaan dengan Regular Order

| Aspek                      | Regular Order                                   | Custom Order                                |
| -------------------------- | ----------------------------------------------- | ------------------------------------------- |
| **Siapa membuat**          | Customer                                        | Staff/Owner                                 |
| **bookingDate**            | Customer input (tanggal di masa depan/sekarang) | Otomatis menggunakan hari ini               |
| **Require customer login** | Ya                                              | Tidak (staff input data customer)           |
| **Flow**                   | addToCart → checkout                            | addCustomOrderToCart → checkout             |
| **Customer type**          | Member only                                     | Member atau Guest                           |
| **Data minimal**           | -                                               | Member: customerId ATAU Guest: name + phone |

## Endpoint

### 1. Create Custom Order (Add to Cart)

**Endpoint:** `POST /orders/custom`

**Headers:**

```
Authorization: Bearer <token>
Content-Type: application/json
```

**Requirement:** User role harus `owner` atau `admin`

---

### Opsi A: Member Customer (Sudah punya akun)

**Request Body:**

```json
{
  "branchId": "1",
  "customerId": "5",
  "roomAndDeviceId": "2",
  "categoryId": "3",
  "durationMinutes": 60,
  "startTime": "15:30",
  "notes": "Member customer walk-in"
}
```

**Field Details:**

- `branchId` (required, string): ID cabang
- `customerId` (required, string): ID customer yang sudah terdaftar di sistem
- `roomAndDeviceId` (required, string): ID device/ruangan yang dipilih
- `categoryId` (optional, string): ID kategori device (Regular/VIP/VVIP)
- `durationMinutes` (required, number): Durasi bermain dalam menit (minimal 30)
- `startTime` (required, string): Waktu mulai (format HH:mm) - untuk hari ini
- `notes` (optional, string): Catatan tambahan

---

### Opsi B: Guest Customer (Belum punya akun)

**Request Body:**

```json
{
  "branchId": "1",
  "guestCustomerName": "Budi Santoso",
  "guestCustomerPhone": "081234567890",
  "guestCustomerEmail": "budi@email.com",
  "roomAndDeviceId": "2",
  "categoryId": "3",
  "durationMinutes": 60,
  "startTime": "15:30",
  "notes": "Walk-in guest customer"
}
```

**Field Details:**

- `branchId` (required, string): ID cabang
- `guestCustomerName` (required, string): Nama lengkap customer (min 3 karakter)
- `guestCustomerPhone` (required, string): Nomor telepon (format: 62xxx, 0xxx, atau +62xxx)
- `guestCustomerEmail` (optional, string): Email customer
- `roomAndDeviceId` (required, string): ID device/ruangan yang dipilih
- `categoryId` (optional, string): ID kategori device
- `durationMinutes` (required, number): Durasi bermain dalam menit (minimal 30)
- `startTime` (required, string): Waktu mulai (format HH:mm) - untuk hari ini
- `notes` (optional, string): Catatan tambahan

**Response:**

```json
{
  "success": true,
  "message": "Custom order berhasil ditambahkan ke keranjang",
  "data": {
    "id": "2",
    "orderCode": "ORD-ABC456",
    "customerId": null,
    "guestCustomerName": "Budi Santoso",
    "guestCustomerPhone": "081234567890",
    "guestCustomerEmail": "budi@email.com",
    "branchId": "1",
    "status": "cart",
    "totalAmount": "100000.00",
    "paymentStatus": "unpaid",
    "createdAt": "2026-02-27T10:30:00.000Z",
    "orderItems": [
      {
        "id": "3",
        "orderId": "2",
        "roomAndDeviceId": "2",
        "bookingStart": "2026-02-27T15:30:00.000Z",
        "bookingEnd": "2026-02-27T16:30:00.000Z",
        "durationMinutes": 60,
        "price": "100000.00",
        "baseAmount": "75000.00",
        "categoryFee": "25000.00",
        "advanceBookingFee": "0.00",
        "roomAndDevice": {
          "id": "2",
          "name": "Regular Room 02",
          "roomNumber": "REG-02",
          "deviceType": "xbox",
          "pricePerHour": "75000.00",
          "category": {
            "id": "3",
            "name": "Regular",
            "tier": "regular",
            "pricePerHour": "25000.00"
          }
        }
      }
    ],
    "branch": {
      "id": "1",
      "name": "Game Station Jakarta Pusat",
      "address": "Jl. Sudirman No. 123",
      "phone": "021-12345678"
    }
  }
}
```

### 2. Checkout Custom Order

Setelah custom order dibuat, flow checkout sama seperti regular order:

**Endpoint:** `POST /orders/:id/checkout`

**Headers:**

```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Request Body:**

```json
{
  "paymentId": "1"
}
```

File upload: `paymentProof` (optional)

**Response:** Sama seperti regular checkout order

---

## Use Cases

### Scenario 1: Member Customer Walk-in

1. Staff: "Anda sudah member di game station?"
2. Customer: "Iya, member dengan ID 5"
3. Staff membuat custom order dengan `customerId: "5"`
4. Order bisa di-append ke existing cart jika customer punya cart sebelumnya

### Scenario 2: New Customer Walk-in (No Account)

1. Staff: "Anda sudah member?"
2. Customer: "Belum"
3. Staff membuat custom order dengan guest data (nama + phone)
4. Setiap guest customer selalu order baru (tidak append ke existing)
5. Nanti jika customer mau daftar akun, bisa di-link ke order ini

---

## Key Behaviors

### Member Customer (customerId)

- ✅ Bisa append ke existing cart jika ada
- ✅ Duplicate booking check berlaku
- ✅ Same cart logic dengan regular order

### Guest Customer (guestCustomerName + guestCustomerPhone)

- ✅ Selalu membuat order baru (no append)
- ⏹️ Duplicate booking check tidak berlaku (karena masih guest)
- ✅ Data tersimpan di order untuk reference nantinya

---

## Database Fields

Setiap order sekarang punya field:

- `customerId` → Nullable (untuk guest orders)
- `guestCustomerName` → Nama customer guest
- `guestCustomerPhone` → Phone customer guest
- `guestCustomerEmail` → Email customer guest (optional)

**Constraint:** Hanya satu yang boleh diisi:

- ATAU `customerId` (member order)
- ATAU `guestCustomerName + guestCustomerPhone` (guest order)

---

## Valid Phone Formats

Guest phone harus match pattern: `^(\+62|62|0)[0-9]{9,12}$`

Contoh valid:

- `081234567890`
- `6281234567890`
- `+6281234567890`

---

## Notes

- Custom order tetap mengikuti pricing logic yang sama (baseAmount + categoryFee)
- Staff harus punya access ke branch yang dituju
- Booking time harus tidak di masa lalu (validasi per-device masih berlaku)
- Guest orders tidak bisa di-append ke existing, selalu order terpisah

## Notes

- Custom order tetap mengikuti pricing logic yang sama (baseAmount + categoryFee)
- Staff harus punya access ke branch yang dituju
- Booking time harus tidak di masa lalu (validasi per-device masih berlaku)
- Guest orders tidak bisa di-append ke existing, selalu order terpisah
