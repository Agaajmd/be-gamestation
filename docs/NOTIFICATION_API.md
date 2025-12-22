# Notification API Documentation

Base URL: `http://localhost:3000`

## Endpoints

### 1. Create Notification

Create notification (admin/owner only)

**Endpoint:** `POST /notifications`

**Headers:**

```
Authorization: Bearer <token>
```

**Request Body:**

```json
{
  "userId": "1",
  "type": "order_confirmation",
  "channel": "email",
  "payload": {
    "subject": "Order Confirmation",
    "message": "Your order has been confirmed",
    "orderCode": "ORD-ABC123"
  }
}
```

**Response:**

```json
{
  "success": true,
  "message": "Notification berhasil dibuat",
  "data": {
    "id": "1",
    "userId": "1",
    "type": "order_confirmation",
    "channel": "email",
    "payload": {...},
    "status": "pending",
    "sentAt": null
  }
}
```

---

### 2. Get Notifications

Get list of notifications (role-based)

**Endpoint:** `GET /notifications`

**Headers:**

```
Authorization: Bearer <token>
```

**Query Parameters:**

- `status` (optional): Filter by status
- `type` (optional): Filter by type

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": "1",
      "userId": "1",
      "type": "order_confirmation",
      "channel": "email",
      "payload": {...},
      "status": "sent",
      "sentAt": "2024-12-09T10:00:00.000Z",
      "user": {...}
    }
  ]
}
```

---

### 3. Get Notification by ID

Get notification details by ID

**Endpoint:** `GET /notifications/:id`

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
    "userId": "1",
    "type": "order_confirmation",
    "channel": "email",
    "payload": {...},
    "status": "sent",
    "sentAt": "2024-12-09T10:00:00.000Z",
    "user": {...}
  }
}
```

---

### 4. Update Notification Status

Update notification status (admin/owner only)

**Endpoint:** `PUT /notifications/:id`

**Headers:**

```
Authorization: Bearer <token>
```

**Request Body:**

```json
{
  "status": "sent"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Notification status berhasil diupdate",
  "data": {...}
}
```

---

### 5. Delete Notification

Delete notification (admin/owner only)

**Endpoint:** `DELETE /notifications/:id`

**Headers:**

```
Authorization: Bearer <token>
```

**Response:**

```json
{
  "success": true,
  "message": "Notification berhasil dihapus"
}
```

---

## Notification Channel Options

- `push` - Push Notification (Mobile/Web)
- `email` - Email
- `sms` - SMS

## Notification Status Options

- `pending` - Not yet sent
- `sent` - Successfully sent
- `failed` - Failed to send

## Common Notification Types

- `order_confirmation` - Order confirmation
- `payment_success` - Payment successful
- `session_reminder` - Session reminder
- `session_complete` - Session completed
- `review_request` - Request for review
- `promotion` - Promotional message

## Access Control

- **Customer**: Can only view their own notifications
- **Admin**: Can view all notifications and create notifications
- **Owner**: Can view all notifications and create notifications

## Error Responses

### 403 Forbidden

```json
{
  "success": false,
  "message": "Anda tidak memiliki akses ke notification ini"
}
```

### 404 Not Found

```json
{
  "success": false,
  "message": "Notification tidak ditemukan"
}
```
