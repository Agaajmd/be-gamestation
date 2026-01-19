# API Documentation Standard - Game Station

Template dan standard untuk semua API documentation.

## Overview

Semua API documentation harus mengikuti format standard ini untuk konsistensi dan kemudahan pemahaman.

---

## Template Struktur API Documentation

```markdown
# [Feature Name] API Documentation

> Deskripsi singkat fitur ini

## Base URL
```

http://localhost:3000

```

## Authentication

- Endpoint mana saja yang memerlukan authentication
- Contoh: Semua endpoint kecuali `/auth/register` dan `/auth/login`

## Rate Limiting

- Rate limit info jika ada

---

## Endpoints

### 1. [Action] [Resource]

**Description:** Deskripsi singkat apa endpoint ini lakukan

**Endpoint:** `[METHOD] /path`

**Access:** Public / Protected / Admin Only / Owner Only

**Headers:**
```

Authorization: Bearer <token> (jika protected)
Content-Type: application/json

````

**URL Parameters:** (jika ada)
- `id` (required): Deskripsi
- `branchId` (optional): Deskripsi

**Query Parameters:** (jika ada)
- `page` (optional, default: 1): Halaman
- `limit` (optional, default: 10): Jumlah per halaman
- `sort` (optional): Field untuk sorting (-createdAt, totalAmount)
- `search` (optional): Search term

**Request Body:**
```json
{
  "field1": "type",
  "field2": "type"
}
````

**Field Descriptions:**

- `field1` (required/optional): Tipe dan deskripsi
- `field2` (required/optional): Tipe dan deskripsi

**Response Success (200/201):**

```json
{
  "success": true,
  "message": "Deskripsi sukses",
  "data": {}
}
```

**Response Error (4xx/5xx):**

```json
{
  "success": false,
  "message": "Deskripsi error",
  "error": {
    "code": "ERROR_CODE",
    "statusCode": 400,
    "details": "Detail teknis"
  }
}
```

**Validation Errors (422):**

```json
{
  "success": false,
  "message": "Validasi gagal",
  "error": {
    "code": "VALIDATION_ERROR",
    "statusCode": 422,
    "fields": [
      {
        "field": "email",
        "message": "Email tidak valid"
      }
    ]
  }
}
```

**Example Request:**

```bash
curl -X POST http://localhost:3000/orders \\
  -H "Authorization: Bearer TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{
    "branchId": "1",
    "roomAndDeviceId": "101"
  }'
```

**Example Response Success:**

```json
{
  "success": true,
  "message": "Operasi berhasil",
  "data": { ... }
}
```

---

## Common Error Codes

- `RESOURCE_NOT_FOUND` (404): Resource tidak ditemukan
- `AUTH_TOKEN_EXPIRED` (401): Token sudah expired
- `VALIDATION_ERROR` (422): Validasi gagal

Lihat [ERROR_HANDLING.md](./ERROR_HANDLING.md) untuk daftar lengkap error codes.

---

## Pagination Example

```
GET /orders?page=2&limit=20
```

Response:

```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 2,
    "limit": 20,
    "total": 150,
    "totalPages": 8
  }
}
```

---

## Usage Examples

### JavaScript/TypeScript

\`\`\`typescript
const response = await fetch('http://localhost:3000/orders', {
method: 'POST',
headers: {
'Authorization': \`Bearer \${token}\`,
'Content-Type': 'application/json'
},
body: JSON.stringify({
branchId: '1',
roomAndDeviceId: '101'
})
});

const data = await response.json();
\`\`\`

### Python

\`\`\`python
import requests

headers = {
'Authorization': f'Bearer {token}',
'Content-Type': 'application/json'
}

response = requests.post(
'http://localhost:3000/orders',
json={
'branchId': '1',
'roomAndDeviceId': '101'
},
headers=headers
)

data = response.json()
\`\`\`

### cURL

\`\`\`bash
curl -X POST http://localhost:3000/orders \\
-H "Authorization: Bearer TOKEN" \\
-H "Content-Type: application/json" \\
-d '{
"branchId": "1",
"roomAndDeviceId": "101"
}'
\`\`\`

---

````

## Guidelines

### 1. Naming Convention

| Type | Format | Example |
|------|--------|---------|
| Endpoint | kebab-case | `/booking-flows`, `/room-and-devices` |
| Field names | camelCase | `branchId`, `roomAndDeviceId` |
| Enum values | snake_case | `in_use`, `checked_in` |
| Error codes | UPPER_SNAKE_CASE | `AUTH_TOKEN_EXPIRED` |

### 2. Field Types & Validation

```json
{
  "email": "user@example.com",                    // string (email format)
  "password": "SecurePass123!",                   // string (min 8, special chars)
  "age": 25,                                      // number (integer)
  "price": 150000.50,                             // number (decimal)
  "active": true,                                 // boolean
  "createdAt": "2026-01-19T10:30:00.000Z",       // ISO datetime string
  "bookingDate": "2026-01-25",                    // date string YYYY-MM-DD
  "startTime": "14:00",                           // time string HH:mm
  "duration": 120,                                // duration in minutes
  "amenities": ["wifi", "parking"],              // array of strings
  "metadata": { "key": "value" },                 // object
  "id": "1"                                       // string (BigInt as string)
}
````

### 3. Status Codes

Gunakan HTTP status codes yang tepat:

- `200 OK`: GET, successful update/delete
- `201 Created`: Successful POST (create resource)
- `204 No Content`: DELETE dengan no body response
- `400 Bad Request`: Validation error atau business logic error
- `401 Unauthorized`: Missing/invalid token
- `403 Forbidden`: Insufficient permission
- `404 Not Found`: Resource tidak ada
- `409 Conflict`: Duplicate/conflict error
- `422 Unprocessable Entity`: Validation error with field details
- `429 Too Many Requests`: Rate limit exceeded
- `500 Internal Server Error`: Server error

### 4. Response Format

Semua response harus mengikuti format:

```json
{
  "success": true/false,
  "message": "Deskripsi human-friendly",
  "data": { /* actual data */ } atau null,
  "error": { /* error details */ } // hanya jika error
}
```

### 5. Pagination Standards

Query parameters:

- `page` (int, default: 1)
- `limit` (int, default: 10, max: 100)
- `sort` (string, format: `-fieldName` untuk descending)
- `search` (string)
- Filter params sesuai kebutuhan

Response:

```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 250,
    "totalPages": 25
  }
}
```

### 6. Documentation Checklist

Sebelum finalize API documentation:

- [ ] Endpoint path jelas dan konsisten
- [ ] HTTP method tepat (GET, POST, PUT, DELETE, PATCH)
- [ ] Access level jelas (Public, Protected, Admin, Owner)
- [ ] Field descriptions lengkap
- [ ] Validation rules dijelaskan
- [ ] Success response contoh diberikan
- [ ] Error response contoh diberikan
- [ ] Error codes di-list dan dijelaskan
- [ ] Example curl/code diberikan
- [ ] Related endpoints di-link
- [ ] Rate limiting info jika ada
- [ ] Authentication header contoh diberikan

---

## File Structure

```
docs/
├── GETTING_STARTED.md              # Setup & installation
├── USAGE_GUIDE.md                  # Flow & usage scenarios
├── DATABASE_SCHEMA.md              # Database documentation
├── ERROR_HANDLING.md               # Error codes & handling
├── API_STANDARD.md                 # File ini
├── README.md                       # Index dokumentasi
├── AUTH_API.md                     # Authentication endpoints
├── BOOKING_FLOW_API.md            # Booking flow endpoints
├── ORDER_API.md                    # Order endpoints
├── PAYMENT_API.md                  # Payment endpoints
├── SESSION_API.md                  # Session endpoints
├── REVIEW_API.md                   # Review endpoints
├── BRANCH_API.md                   # Branch management
├── DEVICE_API.md                   # Device management
├── GAME_API.md                     # Game endpoints
├── DEVICE_CATEGORY_API.md         # Device category
├── SUBSCRIPTION_API.md             # Subscription endpoints
├── NOTIFICATION_API.md             # Notification endpoints
├── HOLIDAY_API.md                  # Holiday management
├── BRANCH_AMENITIES_GUIDE.md       # Amenities guide
└── SEEDER.md                       # Database seeding
```

---

## Tips Dokumentasi

### 1. Keep It DRY (Don't Repeat Yourself)

Jangan ulangi dokumentasi yang sama. Link ke USAGE_GUIDE.md untuk flow umum.

### 2. Real Examples

Gunakan contoh data yang realistic:

- ✅ `"branchId": "1"`
- ❌ `"branchId": "xxx"`

### 3. Clear Language

- ✅ "Durasi minimal 30 menit"
- ❌ "dur >= 30m"

### 4. Visual Formatting

```markdown
**Bold** untuk: field names, endpoint paths, status
_Italic_ untuk: values, contoh data
`Code` untuk: technical terms, variable names
```

### 5. Link ke Dokumentasi Lain

```markdown
- Lihat [GETTING_STARTED.md](./GETTING_STARTED.md) untuk setup
- Lihat [ERROR_HANDLING.md](./ERROR_HANDLING.md) untuk error codes
- Lihat [DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md) untuk model details
```

### 6. Update Consistency

- Setiap API update, update dokumentasi
- Update `Last Updated` date di bawah file
- Jika ada breaking changes, highlight dengan **WARNING** atau **⚠️**

---

## Version Management

Jika ada API versioning (v1, v2, dll):

```markdown
## API Version

- **Current Version:** v1
- **Deprecated Versions:** None
- **Planned Changes:** None

### Version History

- **v1.0.0** (2026-01-19): Initial release
```

---

## Last Updated: January 19, 2026

Dokumentasi ini harus diupdate setiap kali ada perubahan pada API.
