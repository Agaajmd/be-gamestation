# Package API Documentation

Base URL: `http://localhost:3000`

## Endpoints

### 1. Create Package

Add new package to a branch (owner/admin only)

**Endpoint:** `POST /branches/:id/packages`

**Headers:**

```
Authorization: Bearer <token>
```

**URL Parameters:**

- `id` - Branch ID

**Request Body:**

```json
{
  "name": "2 Hours Gaming",
  "durationMinutes": 120,
  "price": 50000,
  "isActive": true
}
```

**Response:**

```json
{
  "success": true,
  "message": "Paket berhasil ditambahkan",
  "data": {
    "id": "1",
    "branchId": "1",
    "name": "2 Hours Gaming",
    "durationMinutes": 120,
    "price": "50000.00",
    "isActive": true,
    "createdAt": "2024-12-09T10:00:00.000Z"
  }
}
```

---

### 2. Get Packages

Get list of packages for a branch

**Endpoint:** `GET /branches/:id/packages`

**URL Parameters:**

- `id` - Branch ID

**Query Parameters:**

- `isActive` (optional): Filter by active status (`true` or `false`)

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": "1",
      "branchId": "1",
      "name": "2 Hours Gaming",
      "durationMinutes": 120,
      "price": "50000.00",
      "isActive": true,
      "createdAt": "2024-12-09T10:00:00.000Z"
    },
    {
      "id": "2",
      "branchId": "1",
      "name": "4 Hours Gaming",
      "durationMinutes": 240,
      "price": "90000.00",
      "isActive": true,
      "createdAt": "2024-12-09T10:00:00.000Z"
    }
  ]
}
```

---

### 3. Get Package by ID

Get package details by ID

**Endpoint:** `GET /branches/:branchId/packages/:packageId`

**URL Parameters:**

- `branchId` - Branch ID
- `packageId` - Package ID

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "1",
    "branchId": "1",
    "name": "2 Hours Gaming",
    "durationMinutes": 120,
    "price": "50000.00",
    "isActive": true,
    "createdAt": "2024-12-09T10:00:00.000Z",
    "branch": {
      "id": "1",
      "name": "GameStation Senayan"
    }
  }
}
```

---

### 4. Update Package

Update package details (owner/admin only)

**Endpoint:** `PUT /branches/:branchId/packages/:packageId`

**Headers:**

```
Authorization: Bearer <token>
```

**URL Parameters:**

- `branchId` - Branch ID
- `packageId` - Package ID

**Request Body:**

```json
{
  "name": "2 Hours Gaming (Updated)",
  "durationMinutes": 120,
  "price": 55000,
  "isActive": true
}
```

**Response:**

```json
{
  "success": true,
  "message": "Paket berhasil diupdate",
  "data": {
    "id": "1",
    "branchId": "1",
    "name": "2 Hours Gaming (Updated)",
    "durationMinutes": 120,
    "price": "55000.00",
    "isActive": true,
    "createdAt": "2024-12-09T10:00:00.000Z"
  }
}
```

---

### 5. Delete Package

Delete package (owner/admin only)

**Endpoint:** `DELETE /branches/:branchId/packages/:packageId`

**Headers:**

```
Authorization: Bearer <token>
```

**URL Parameters:**

- `branchId` - Branch ID
- `packageId` - Package ID

**Response:**

```json
{
  "success": true,
  "message": "Paket berhasil dihapus"
}
```

---

## Package Fields

| Field           | Type    | Required | Description                          |
| --------------- | ------- | -------- | ------------------------------------ |
| name            | string  | Yes      | Package name (max 50 chars)          |
| durationMinutes | number  | Yes      | Duration in minutes (must be > 0)    |
| price           | number  | Yes      | Price in IDR (must be > 0)           |
| isActive        | boolean | No       | Package availability (default: true) |

## Common Package Examples

### PlayStation Packages

```json
[
  {
    "name": "1 Hour PS5",
    "durationMinutes": 60,
    "price": 30000
  },
  {
    "name": "2 Hours PS5",
    "durationMinutes": 120,
    "price": 55000
  },
  {
    "name": "5 Hours PS5 (Paket Hemat)",
    "durationMinutes": 300,
    "price": 125000
  }
]
```

### VR Packages

```json
[
  {
    "name": "30 Minutes VR Experience",
    "durationMinutes": 30,
    "price": 40000
  },
  {
    "name": "1 Hour VR Gaming",
    "durationMinutes": 60,
    "price": 70000
  }
]
```

### Racing Simulator Packages

```json
[
  {
    "name": "30 Minutes Racing",
    "durationMinutes": 30,
    "price": 50000
  },
  {
    "name": "1 Hour Racing Challenge",
    "durationMinutes": 60,
    "price": 90000
  }
]
```

## Access Control

- **Customer**: Can view active packages (public)
- **Admin**: Can view and manage packages for their branch
- **Owner**: Can view and manage packages for all their branches

## Notes

- Package can be soft-deleted by setting `isActive` to `false`
- Inactive packages won't appear in public listings but remain in database
- Duration is stored in minutes for flexibility
- Price supports 2 decimal places
- Packages can be shared across multiple device types using DevicePackage relation

## Error Responses

### 400 Bad Request

```json
{
  "success": false,
  "message": "Durasi harus lebih dari 0 menit"
}
```

```json
{
  "success": false,
  "message": "Harga harus lebih dari 0"
}
```

### 403 Forbidden

```json
{
  "success": false,
  "message": "Anda tidak memiliki akses ke cabang ini"
}
```

### 404 Not Found

```json
{
  "success": false,
  "message": "Paket tidak ditemukan"
}
```

### 500 Internal Server Error

```json
{
  "success": false,
  "message": "Terjadi kesalahan saat menambahkan paket"
}
```
