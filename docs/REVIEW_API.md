# Review API Documentation

Base URL: `http://localhost:3000`

## Endpoints

### 1. Create Review

Create review for completed order (customer only)

**Endpoint:** `POST /reviews`

**Headers:**

```
Authorization: Bearer <token>
```

**Request Body:**

```json
{
  "orderId": "1",
  "rating": 5,
  "comment": "Great experience! Clean place and friendly staff."
}
```

**Response:**

```json
{
  "success": true,
  "message": "Review berhasil dibuat",
  "data": {
    "id": "1",
    "orderId": "1",
    "customerId": "1",
    "rating": 5,
    "comment": "Great experience! Clean place and friendly staff.",
    "createdAt": "2024-12-09T10:00:00.000Z",
    "order": {
      "orderCode": "ORD-ABC123",
      "branch": {...}
    }
  }
}
```

---

### 2. Get Reviews

Get list of reviews (role-based)

**Endpoint:** `GET /reviews`

**Headers:**

```
Authorization: Bearer <token>
```

**Query Parameters:**

- `branchId` (optional): Filter by branch (owner only)
- `minRating` (optional): Filter by minimum rating (1-5)

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": "1",
      "orderId": "1",
      "customerId": "1",
      "rating": 5,
      "comment": "Great experience!",
      "createdAt": "2024-12-09T10:00:00.000Z",
      "customer": {...},
      "order": {...}
    }
  ]
}
```

---

### 3. Get Review by ID

Get review details by ID

**Endpoint:** `GET /reviews/:id`

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
    "customerId": "1",
    "rating": 5,
    "comment": "Great experience!",
    "createdAt": "2024-12-09T10:00:00.000Z",
    "customer": {...},
    "order": {
      "branch": {...},
      "orderItems": [...]
    }
  }
}
```

---

### 4. Update Review

Update review (customer can only update their own review)

**Endpoint:** `PUT /reviews/:id`

**Headers:**

```
Authorization: Bearer <token>
```

**Request Body:**

```json
{
  "rating": 4,
  "comment": "Updated comment"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Review berhasil diupdate",
  "data": {...}
}
```

---

### 5. Delete Review

Delete review (customer can only delete their own review)

**Endpoint:** `DELETE /reviews/:id`

**Headers:**

```
Authorization: Bearer <token>
```

**Response:**

```json
{
  "success": true,
  "message": "Review berhasil dihapus"
}
```

---

## Rating Scale

- `1` - Very Poor
- `2` - Poor
- `3` - Average
- `4` - Good
- `5` - Excellent

## Notes

- Review can only be created for orders with status `completed`
- Each order can only have one review
- Customer can only review their own orders
- Admin and owner can view all reviews for their branches

## Error Responses

### 400 Bad Request

```json
{
  "success": false,
  "message": "Review hanya bisa dibuat untuk order yang sudah completed"
}
```

```json
{
  "success": false,
  "message": "Review untuk order ini sudah ada"
}
```

### 403 Forbidden

```json
{
  "success": false,
  "message": "Anda tidak memiliki akses ke review ini"
}
```

### 404 Not Found

```json
{
  "success": false,
  "message": "Review tidak ditemukan"
}
```
