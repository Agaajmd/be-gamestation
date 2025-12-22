# Session API Documentation

Base URL: `http://localhost:3000`

## Endpoints

### 1. Create Session (Start Session)

Start a new gaming session (admin/owner only)

**Endpoint:** `POST /sessions`

**Headers:**

```
Authorization: Bearer <token>
```

**Request Body:**

```json
{
  "orderId": "1",
  "deviceId": "1"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Session berhasil dimulai",
  "data": {
    "id": "1",
    "orderId": "1",
    "deviceId": "1",
    "startedAt": "2024-12-09T10:00:00.000Z",
    "endedAt": null,
    "status": "running",
    "order": {
      "customer": {...}
    },
    "device": {...}
  }
}
```

---

### 2. Get Sessions

Get list of sessions (admin/owner only)

**Endpoint:** `GET /sessions`

**Headers:**

```
Authorization: Bearer <token>
```

**Query Parameters:**

- `status` (optional): Filter by status (`running`, `stopped`)
- `branchId` (optional): Filter by branch (owner only)
- `deviceId` (optional): Filter by device

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": "1",
      "orderId": "1",
      "deviceId": "1",
      "startedAt": "2024-12-09T10:00:00.000Z",
      "endedAt": null,
      "status": "running",
      "order": {
        "customer": {...},
        "branch": {...}
      },
      "device": {...}
    }
  ]
}
```

---

### 3. Get Session by ID

Get session details by ID

**Endpoint:** `GET /sessions/:id`

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
    "deviceId": "1",
    "startedAt": "2024-12-09T10:00:00.000Z",
    "endedAt": "2024-12-09T12:00:00.000Z",
    "status": "stopped",
    "order": {
      "customer": {...},
      "branch": {...},
      "orderItems": [...]
    },
    "device": {...}
  }
}
```

---

### 4. Update Session (Stop Session)

Update session status (admin/owner only)

**Endpoint:** `PUT /sessions/:id`

**Headers:**

```
Authorization: Bearer <token>
```

**Request Body:**

```json
{
  "status": "stopped",
  "endedAt": "2024-12-09T12:00:00.000Z"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Session berhasil diupdate",
  "data": {
    "id": "1",
    "orderId": "1",
    "deviceId": "1",
    "startedAt": "2024-12-09T10:00:00.000Z",
    "endedAt": "2024-12-09T12:00:00.000Z",
    "status": "stopped"
  }
}
```

---

## Session Status Options

- `running` - Session is currently active
- `stopped` - Session has ended

## Notes

- Session can only be created for orders with status `paid` or `checked_in`
- When session is started, order status automatically changes to `checked_in`
- When session is stopped, order status automatically changes to `completed`
- Device cannot be used for multiple sessions simultaneously

## Error Responses

### 400 Bad Request

```json
{
  "success": false,
  "message": "Device sedang digunakan untuk session lain"
}
```

```json
{
  "success": false,
  "message": "Order harus dalam status paid atau checked_in untuk memulai session"
}
```

### 403 Forbidden

```json
{
  "success": false,
  "message": "Anda tidak memiliki akses ke session ini"
}
```

### 404 Not Found

```json
{
  "success": false,
  "message": "Session tidak ditemukan"
}
```
