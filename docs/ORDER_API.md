# Order API Documentation

Base URL: `http://localhost:3000`

## Endpoints

### 1. Create Order

Create new order (customer only) - Updated untuk flow booking baru

**Endpoint:** `POST /orders`

**Headers:**

```
Authorization: Bearer <token>
```

**Request Body:**

```json
{
  "branchId": "1",
  "deviceId": "1",
  "categoryId": "2",
  "durationMinutes": 120,
  "gameId": "5",
  "bookingDate": "2025-12-15",
  "startTime": "14:00",
  "paymentMethod": "e_wallet",
  "notes": "Request good controller"
}
```

**Field Details:**

- `branchId` (required): ID cabang
- `deviceId` (required): ID device/ruangan yang dipilih
- `categoryId` (optional): ID kategori device (Regular/VIP/VVIP)
- `durationMinutes` (required): Durasi bermain dalam menit (minimal 30)
- `gameId` (optional): ID game yang ingin dimainkan
- `bookingDate` (required): Tanggal booking (YYYY-MM-DD)
- `startTime` (required): Waktu mulai (HH:mm)
- `paymentMethod` (optional): Metode pembayaran
- `notes` (optional): Catatan tambahan

**Response:**

```json
{
  "success": true,
  "message": "Order berhasil dibuat",
  "data": {
    "id": "1",
    "orderCode": "ORD-ABC123",
    "customerId": "1",
    "branchId": "1",
    "status": "pending",
    "baseAmount": "150000.00",
    "categoryFee": "50000.00",
    "advanceBookingFee": "20000.00",
    "totalAmount": "220000.00",
    "paymentStatus": "unpaid",
    "bookingStart": "2025-12-15T14:00:00.000Z",
    "bookingEnd": "2025-12-15T16:00:00.000Z",
    "orderItems": [
      {
        "id": "1",
        "orderId": "1",
        "roomAndDeviceId": "1",
        "gameId": "5",
        "durationMinutes": 120,
        "price": "220000.00",
        "roomAndDevice": {
          "id": "1",
          "name": "VIP Room 01",
          "roomNumber": "VIP-01",
          "deviceType": "ps",
          "version": "ps5",
          "pricePerHour": "75000.00",
          "category": {
            "id": "2",
            "name": "VIP",
            "tier": "vip",
            "pricePerHour": "25000.00"
          }
        },
        "game": {
          "id": "5",
          "name": "God of War Ragnarok",
          "deviceType": "ps"
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

**Pricing Breakdown:**

- `baseAmount`: Harga device per jam × durasi (75.000 × 2 = 150.000)
- `categoryFee`: Biaya kategori per jam × durasi (25.000 × 2 = 50.000)
- `advanceBookingFee`: Biaya booking di muka per jam × durasi (10.000 × 2 = 20.000)
- `totalAmount`: Total keseluruhan (220.000)

**Error Responses:**

- `400`: Validation error
- `400`: Device sudah dibooking pada waktu tersebut
- `404`: Branch/Device/Category/Game tidak ditemukan

---

### 2. Get Orders

Get list of orders (role-based)

**Endpoint:** `GET /orders`

**Headers:**

```
Authorization: Bearer <token>
```

**Query Parameters:**

- `status` (optional): Filter by status
- `branchId` (optional): Filter by branch (owner only)

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": "1",
      "orderCode": "ORD-ABC123",
      "status": "pending",
      "baseAmount": "150000.00",
      "categoryFee": "50000.00",
      "advanceBookingFee": "20000.00",
      "totalAmount": "220000.00",
      "paymentStatus": "unpaid",
      "bookingStart": "2025-12-15T14:00:00.000Z",
      "bookingEnd": "2025-12-15T16:00:00.000Z",
      "branch": {...},
      "orderItems": [...],
      "customer": {...}
    }
  ]
}
```

---

### 3. Get Order by ID

Get order details by ID

**Endpoint:** `GET /orders/:id`

**Headers:**

```
Authorization: Bearer <token>
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "1",
    "orderCode": "ORD-ABC123",
    "status": "pending",
    "totalAmount": "50000.00",
    "paymentStatus": "unpaid",
    "bookingStart": "2024-12-10T14:00:00.000Z",
    "bookingEnd": "2024-12-10T16:00:00.000Z",
    "branch": {...},
    "orderItems": [...],
    "customer": {...},
    "payment": {...},
    "session": {...},
    "review": {...}
  }
}
```

---

### 4. Update Order Status

Update order status (admin/owner only)

**Endpoint:** `PUT /orders/:id/status`

**Headers:**

```
Authorization: Bearer <token>
```

**Request Body:**

```json
{
  "status": "paid"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Status order berhasil diupdate",
  "data": {...}
}
```

---

### 5. Update Payment Status

Update payment status (admin/owner only)

**Endpoint:** `PUT /orders/:id/payment-status`

**Headers:**

```
Authorization: Bearer <token>
```

**Request Body:**

```json
{
  "paymentStatus": "paid"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Status pembayaran berhasil diupdate",
  "data": {...}
}
```

---

### 6. Cancel Order

Cancel order (customer can cancel their own pending orders)

**Endpoint:** `DELETE /orders/:id`

**Headers:**

```
Authorization: Bearer <token>
```

**Response:**

```json
{
  "success": true,
  "message": "Order berhasil dibatalkan"
}
```

---

## Order Status Options

- `pending` - Order created, awaiting payment
- `paid` - Payment confirmed
- `cancelled` - Order cancelled
- `checked_in` - Customer checked in, session started
- `completed` - Order completed
- `no_show` - Customer didn't show up
- `refunded` - Order refunded

## Payment Status Options

- `unpaid` - Payment not yet received
- `paid` - Payment confirmed
- `failed` - Payment failed
- `refund_pending` - Refund in process

## Payment Method Options

- `e_wallet` - E-Wallet (GoPay, OVO, Dana, etc.)
- `bank_transfer` - Bank Transfer
- `gateway` - Payment Gateway

## Error Responses

### 400 Bad Request

```json
{
  "success": false,
  "message": "Device dengan ID 1 sudah dibooking pada waktu tersebut"
}
```

### 403 Forbidden

```json
{
  "success": false,
  "message": "Anda tidak memiliki akses ke order ini"
}
```

### 404 Not Found

```json
{
  "success": false,
  "message": "Order tidak ditemukan"
}
```
