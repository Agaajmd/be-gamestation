# Subscription API Documentation

Base URL: `http://localhost:3000`

## Endpoints

### 1. Create Subscription

Create new subscription (owner only)

**Endpoint:** `POST /subscriptions`

**Headers:**

```
Authorization: Bearer <token>
```

**Request Body:**

```json
{
  "plan": "Premium",
  "price": 500000,
  "startsAt": "2024-12-01T00:00:00.000Z",
  "endsAt": "2025-01-01T00:00:00.000Z"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Subscription berhasil dibuat",
  "data": {
    "id": "1",
    "ownerId": "1",
    "plan": "Premium",
    "price": "500000.00",
    "startsAt": "2024-12-01T00:00:00.000Z",
    "endsAt": "2025-01-01T00:00:00.000Z",
    "status": "active"
  }
}
```

---

### 2. Get Subscriptions

Get list of subscriptions (owner only)

**Endpoint:** `GET /subscriptions`

**Headers:**

```
Authorization: Bearer <token>
```

**Query Parameters:**

- `status` (optional): Filter by status

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": "1",
      "ownerId": "1",
      "plan": "Premium",
      "price": "500000.00",
      "startsAt": "2024-12-01T00:00:00.000Z",
      "endsAt": "2025-01-01T00:00:00.000Z",
      "status": "active"
    }
  ]
}
```

---

### 3. Get Active Subscription

Get current active subscription (owner only)

**Endpoint:** `GET /subscriptions/active`

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
    "ownerId": "1",
    "plan": "Premium",
    "price": "500000.00",
    "startsAt": "2024-12-01T00:00:00.000Z",
    "endsAt": "2025-01-01T00:00:00.000Z",
    "status": "active"
  }
}
```

---

### 4. Get Subscription by ID

Get subscription details by ID (owner only)

**Endpoint:** `GET /subscriptions/:id`

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
    "ownerId": "1",
    "plan": "Premium",
    "price": "500000.00",
    "startsAt": "2024-12-01T00:00:00.000Z",
    "endsAt": "2025-01-01T00:00:00.000Z",
    "status": "active",
    "owner": {
      "user": {...}
    }
  }
}
```

---

### 5. Update Subscription

Update subscription (owner only)

**Endpoint:** `PUT /subscriptions/:id`

**Headers:**

```
Authorization: Bearer <token>
```

**Request Body:**

```json
{
  "plan": "Premium Plus",
  "price": 750000,
  "endsAt": "2025-02-01T00:00:00.000Z",
  "status": "active"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Subscription berhasil diupdate",
  "data": {...}
}
```

---

### 6. Delete Subscription

Delete subscription (owner only)

**Endpoint:** `DELETE /subscriptions/:id`

**Headers:**

```
Authorization: Bearer <token>
```

**Response:**

```json
{
  "success": true,
  "message": "Subscription berhasil dihapus"
}
```

---

## Subscription Status Options

- `active` - Currently active
- `expired` - Subscription has expired
- `cancelled` - Subscription cancelled

## Common Subscription Plans

- `Basic` - Basic plan (1-2 branches)
- `Standard` - Standard plan (3-5 branches)
- `Premium` - Premium plan (6-10 branches)
- `Enterprise` - Enterprise plan (unlimited branches)

## Plan Features Example

```json
{
  "Basic": {
    "maxBranches": 2,
    "maxDevicesPerBranch": 10,
    "features": ["Basic reporting", "Email support"]
  },
  "Standard": {
    "maxBranches": 5,
    "maxDevicesPerBranch": 20,
    "features": ["Advanced reporting", "Priority support", "Custom branding"]
  },
  "Premium": {
    "maxBranches": 10,
    "maxDevicesPerBranch": 50,
    "features": [
      "Full analytics",
      "24/7 support",
      "API access",
      "Custom integrations"
    ]
  },
  "Enterprise": {
    "maxBranches": "unlimited",
    "maxDevicesPerBranch": "unlimited",
    "features": [
      "All Premium features",
      "Dedicated account manager",
      "Custom SLA"
    ]
  }
}
```

## Access Control

- Only **Owner** role can access subscription endpoints
- Admin and Customer cannot access subscriptions

## Error Responses

### 403 Forbidden

```json
{
  "success": false,
  "message": "Hanya owner yang dapat mengakses subscription"
}
```

```json
{
  "success": false,
  "message": "Anda tidak memiliki akses ke subscription ini"
}
```

### 404 Not Found

```json
{
  "success": false,
  "message": "Subscription tidak ditemukan"
}
```

```json
{
  "success": false,
  "message": "Tidak ada subscription aktif"
}
```
