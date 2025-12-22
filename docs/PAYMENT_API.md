# Payment API Documentation

Base URL: `http://localhost:3000`

## Endpoints

### 1. Create Payment

Create payment record

**Endpoint:** `POST /payments`

**Headers:**

```
Authorization: Bearer <token>
```

**Request Body:**

```json
{
  "orderId": "1",
  "amount": 50000,
  "method": "e_wallet",
  "provider": "GoPay",
  "transactionId": "TRX-123456",
  "metadata": {
    "phone": "081234567890",
    "account_name": "John Doe"
  }
}
```

**Response:**

```json
{
  "success": true,
  "message": "Payment berhasil dibuat",
  "data": {
    "id": "1",
    "orderId": "1",
    "amount": "50000.00",
    "method": "e_wallet",
    "provider": "GoPay",
    "status": "pending",
    "transactionId": "TRX-123456",
    "paidAt": null,
    "metadata": {...}
  }
}
```

---

### 2. Get Payments

Get list of payments (admin/owner only)

**Endpoint:** `GET /payments`

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
      "orderId": "1",
      "amount": "50000.00",
      "method": "e_wallet",
      "provider": "GoPay",
      "status": "paid",
      "transactionId": "TRX-123456",
      "paidAt": "2024-12-09T10:00:00.000Z",
      "order": {...}
    }
  ]
}
```

---

### 3. Get Payment by ID

Get payment details by ID

**Endpoint:** `GET /payments/:id`

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
    "orderId": "1",
    "amount": "50000.00",
    "method": "e_wallet",
    "provider": "GoPay",
    "status": "paid",
    "transactionId": "TRX-123456",
    "paidAt": "2024-12-09T10:00:00.000Z",
    "metadata": {...},
    "order": {
      "customer": {...},
      "branch": {...},
      "orderItems": [...]
    }
  }
}
```

---

### 4. Update Payment

Update payment status (admin/owner only)

**Endpoint:** `PUT /payments/:id`

**Headers:**

```
Authorization: Bearer <token>
```

**Request Body:**

```json
{
  "status": "paid",
  "transactionId": "TRX-123456",
  "paidAt": "2024-12-09T10:00:00.000Z",
  "metadata": {
    "receipt_url": "https://example.com/receipt.pdf"
  }
}
```

**Response:**

```json
{
  "success": true,
  "message": "Payment berhasil diupdate",
  "data": {...}
}
```

---

## Payment Method Options

- `e_wallet` - E-Wallet (GoPay, OVO, Dana, etc.)
- `bank_transfer` - Bank Transfer
- `gateway` - Payment Gateway (Midtrans, Xendit, etc.)

## Payment Status Options

- `pending` - Payment pending
- `paid` - Payment confirmed
- `failed` - Payment failed
- `refunded` - Payment refunded

## Error Responses

### 400 Bad Request

```json
{
  "success": false,
  "message": "Payment untuk order ini sudah ada"
}
```

### 403 Forbidden

```json
{
  "success": false,
  "message": "Anda tidak memiliki akses ke payment ini"
}
```

### 404 Not Found

```json
{
  "success": false,
  "message": "Payment tidak ditemukan"
}
```
