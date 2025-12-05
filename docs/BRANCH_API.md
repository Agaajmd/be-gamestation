# Branch Management API Documentation

API untuk mengelola cabang (branch) game station.

## Base URL

```
/api/branches
```

---

## Endpoints

### 1. Create Branch

Membuat cabang baru (Owner only).

**Endpoint:** `POST /branches`

**Authorization:** Bearer Token (Owner)

**Request Body:**

```json
{
  "name": "PS Station Sudirman",
  "address": "Jl. Sudirman No. 123, Jakarta",
  "phone": "081234567890",
  "timezone": "Asia/Jakarta",
  "openTime": "09:00:00",
  "closeTime": "23:00:00"
}
```

**Field Details:**

- `name` (required): Nama cabang
- `address` (optional): Alamat lengkap cabang
- `phone` (optional): Nomor telepon cabang
- `timezone` (optional): Timezone, default "Asia/Jakarta"
- `openTime` (optional): Jam buka (format: HH:MM:SS atau HH:MM)
- `closeTime` (optional): Jam tutup (format: HH:MM:SS atau HH:MM)

**Success Response (201):**

```json
{
  "success": true,
  "message": "Cabang berhasil dibuat",
  "data": {
    "id": "1",
    "ownerId": "1",
    "name": "PS Station Sudirman",
    "address": "Jl. Sudirman No. 123, Jakarta",
    "phone": "081234567890",
    "timezone": "Asia/Jakarta",
    "openTime": "1970-01-01T09:00:00.000Z",
    "closeTime": "1970-01-01T23:00:00.000Z",
    "createdAt": "2025-12-05T10:00:00.000Z",
    "updatedAt": "2025-12-05T10:00:00.000Z"
  }
}
```

**Error Responses:**

- `403`: Anda harus menjadi owner untuk membuat cabang
- `400`: Nama cabang wajib diisi

---

### 2. Get All Branches

Melihat daftar cabang berdasarkan role user.

**Endpoint:** `GET /branches`

**Authorization:** Bearer Token (Owner/Admin/Customer)

**Behavior by Role:**

- **Owner**: Melihat semua cabang miliknya
- **Admin**: Melihat cabang yang dikelolanya
- **Customer**: -

**Success Response (200):**

```json
{
  "success": true,
  "data": [
    {
      "id": "1",
      "name": "PS Station Sudirman",
      "address": "Jl. Sudirman No. 123, Jakarta",
      "phone": "081234567890",
      "timezone": "Asia/Jakarta",
      "openTime": "1970-01-01T09:00:00.000Z",
      "closeTime": "1970-01-01T23:00:00.000Z",
      "owner": {
        "id": "1",
        "userId": "1",
        "user": {
          "email": "owner@example.com",
          "fullname": "John Doe"
        }
      },
      "_count": {
        "devices": 10,
        "packages": 5,
        "orders": 150
      },
      "createdAt": "2025-12-05T10:00:00.000Z",
      "updatedAt": "2025-12-05T10:00:00.000Z"
    }
  ]
}
```

---

### 3. Get Branch by ID

Melihat detail cabang.

**Endpoint:** `GET /branches/:id`

**Authorization:** Bearer Token

**URL Parameters:**

- `id`: Branch ID

**Success Response (200):**

```json
{
  "success": true,
  "data": {
    "id": "1",
    "name": "PS Station Sudirman",
    "address": "Jl. Sudirman No. 123, Jakarta",
    "phone": "081234567890",
    "timezone": "Asia/Jakarta",
    "openTime": "1970-01-01T09:00:00.000Z",
    "closeTime": "1970-01-01T23:00:00.000Z",
    "owner": {
      "id": "1",
      "user": {
        "fullname": "John Doe",
        "email": "owner@example.com",
        "phone": "081234567890"
      }
    },
    "devices": [
      {
        "id": "1",
        "code": "PS-01",
        "type": "ps",
        "status": "active"
      }
    ],
    "packages": [
      {
        "id": "1",
        "name": "Paket 1 Jam",
        "durationMinutes": 60,
        "price": "15000.00",
        "isActive": true
      }
    ],
    "admins": [
      {
        "id": "1",
        "role": "manager",
        "user": {
          "fullname": "Jane Smith",
          "email": "admin@example.com",
          "phone": "081234567891"
        }
      }
    ],
    "_count": {
      "orders": 150
    }
  }
}
```

**Error Responses:**

- `404`: Cabang tidak ditemukan
- `403`: Anda tidak memiliki akses ke cabang ini

---

### 4. Update Branch

Update informasi cabang (Owner only).

**Endpoint:** `PUT /branches/:id`

**Authorization:** Bearer Token (Owner)

**URL Parameters:**

- `id`: Branch ID

**Request Body:**

```json
{
  "name": "PS Station Sudirman (Updated)",
  "address": "Jl. Sudirman No. 456, Jakarta",
  "phone": "081234567899",
  "timezone": "Asia/Jakarta",
  "openTime": "10:00:00",
  "closeTime": "00:00:00"
}
```

**Note:** Semua field optional, hanya kirim field yang ingin diupdate.

**Success Response (200):**

```json
{
  "success": true,
  "message": "Cabang berhasil diupdate",
  "data": {
    "id": "1",
    "name": "PS Station Sudirman (Updated)",
    "address": "Jl. Sudirman No. 456, Jakarta",
    "phone": "081234567899",
    "timezone": "Asia/Jakarta",
    "openTime": "1970-01-01T10:00:00.000Z",
    "closeTime": "1970-01-01T00:00:00.000Z",
    "updatedAt": "2025-12-05T11:00:00.000Z"
  }
}
```

**Error Responses:**

- `404`: Cabang tidak ditemukan
- `403`: Anda tidak memiliki akses untuk mengupdate cabang ini

---

### 5. Delete Branch

Hapus cabang (Owner only).

**Endpoint:** `DELETE /branches/:id`

**Authorization:** Bearer Token (Owner)

**URL Parameters:**

- `id`: Branch ID

**Success Response (200):**

```json
{
  "success": true,
  "message": "Cabang berhasil dihapus"
}
```

**Error Responses:**

- `404`: Cabang tidak ditemukan
- `403`: Anda tidak memiliki akses untuk menghapus cabang ini
- `400`: Tidak dapat menghapus cabang yang memiliki riwayat order

---

### 6. Add Branch Admin

Menambahkan admin/staff ke cabang (Owner only).

**Endpoint:** `POST /branches/:id/admins`

**Authorization:** Bearer Token (Owner)

**URL Parameters:**

- `id`: Branch ID

**Request Body:**

```json
{
  "email": "admin@example.com",
  "role": "manager"
}
```

**Field Details:**

- `email` (required): Email user yang akan dijadikan admin
- `role` (required): Role admin, pilihan: `"staff"` atau `"manager"`

**Success Response (201):**

```json
{
  "success": true,
  "message": "Admin berhasil ditambahkan",
  "data": {
    "id": "1",
    "userId": "2",
    "branchId": "1",
    "role": "manager",
    "user": {
      "email": "admin@example.com",
      "fullname": "Jane Smith",
      "phone": "081234567891"
    },
    "createdAt": "2025-12-05T10:00:00.000Z"
  }
}
```

**Error Responses:**

- `400`: Email dan role wajib diisi
- `400`: Role harus staff atau manager
- `404`: Cabang tidak ditemukan
- `404`: User dengan email tersebut tidak ditemukan
- `400`: User sudah menjadi admin di cabang lain
- `403`: Hanya owner yang dapat menambahkan admin

**Note:** Jika user masih berstatus `customer`, role-nya akan otomatis diupdate menjadi `admin`.

---

### 7. Remove Branch Admin

Menghapus admin dari cabang (Owner only).

**Endpoint:** `DELETE /branches/:id/admins/:adminId`

**Authorization:** Bearer Token (Owner)

**URL Parameters:**

- `id`: Branch ID
- `adminId`: Admin ID

**Success Response (200):**

```json
{
  "success": true,
  "message": "Admin berhasil dihapus"
}
```

**Error Responses:**

- `404`: Admin tidak ditemukan
- `403`: Hanya owner yang dapat menghapus admin

**Note:** Setelah dihapus, role user akan dikembalikan ke `customer`.

---

### 8. Add Device to Branch

Menambahkan device ke cabang (Owner/Admin).

**Endpoint:** `POST /branches/:id/devices`

**Authorization:** Bearer Token (Owner/Admin)

**URL Parameters:**

- `id`: Branch ID

**Request Body:**

```json
{
  "code": "PS-01",
  "type": "ps",
  "specs": {
    "model": "PlayStation 5",
    "storage": "1TB",
    "controllers": 2
  },
  "status": "active"
}
```

**Field Details:**

- `code` (required): Kode unik device (dalam branch)
- `type` (required): Tipe device, pilihan: `"ps"`, `"racing"`, `"vr"`, `"pc"`, `"arcade"`
- `specs` (optional): JSON berisi spesifikasi device
- `status` (optional): Status device, default: `"active"`, pilihan: `"active"`, `"maintenance"`, `"disabled"`

**Success Response (201):**

```json
{
  "success": true,
  "message": "Device berhasil ditambahkan",
  "data": {
    "id": "1",
    "branchId": "1",
    "code": "PS-01",
    "type": "ps",
    "specs": {
      "model": "PlayStation 5",
      "storage": "1TB",
      "controllers": 2
    },
    "status": "active",
    "createdAt": "2025-12-05T10:00:00.000Z",
    "updatedAt": "2025-12-05T10:00:00.000Z"
  }
}
```

**Error Responses:**

- `400`: Code dan type wajib diisi
- `400`: Type harus salah satu dari: ps, racing, vr, pc, arcade
- `400`: Kode device sudah digunakan di cabang ini
- `403`: Anda tidak memiliki akses ke cabang ini

---

### 9. Add Package to Branch

Menambahkan paket ke cabang (Owner/Admin).

**Endpoint:** `POST /branches/:id/packages`

**Authorization:** Bearer Token (Owner/Admin)

**URL Parameters:**

- `id`: Branch ID

**Request Body:**

```json
{
  "name": "Paket 1 Jam",
  "durationMinutes": 60,
  "price": 15000,
  "isActive": true
}
```

**Field Details:**

- `name` (required): Nama paket
- `durationMinutes` (required): Durasi paket dalam menit (harus > 0)
- `price` (required): Harga paket (harus > 0)
- `isActive` (optional): Status aktif paket, default: `true`

**Success Response (201):**

```json
{
  "success": true,
  "message": "Paket berhasil ditambahkan",
  "data": {
    "id": "1",
    "branchId": "1",
    "name": "Paket 1 Jam",
    "durationMinutes": 60,
    "price": "15000.00",
    "isActive": true,
    "createdAt": "2025-12-05T10:00:00.000Z",
    "updatedAt": "2025-12-05T10:00:00.000Z"
  }
}
```

**Error Responses:**

- `400`: Name, durationMinutes, dan price wajib diisi
- `400`: Durasi harus lebih dari 0 menit
- `400`: Harga harus lebih dari 0
- `403`: Anda tidak memiliki akses ke cabang ini

---

## Authorization & Access Control

### Role-Based Access:

| Endpoint          | Owner    | Admin         | Customer |
| ----------------- | -------- | ------------- | -------- |
| Create Branch     | ✅       | ❌            | ❌       |
| Get All Branches  | ✅ (own) | ✅ (assigned) | ❌       |
| Get Branch Detail | ✅ (own) | ✅ (assigned) | ❌       |
| Update Branch     | ✅ (own) | ❌            | ❌       |
| Delete Branch     | ✅ (own) | ❌            | ❌       |
| Add Admin         | ✅ (own) | ❌            | ❌       |
| Remove Admin      | ✅ (own) | ❌            | ❌       |
| Add Device        | ✅ (own) | ✅ (assigned) | ❌       |
| Add Package       | ✅ (own) | ✅ (assigned) | ❌       |

---

## Common Error Responses

**401 Unauthorized:**

```json
{
  "success": false,
  "message": "Token tidak ditemukan. Silakan login terlebih dahulu"
}
```

**403 Forbidden:**

```json
{
  "success": false,
  "message": "Anda tidak memiliki akses untuk resource ini"
}
```

**500 Internal Server Error:**

```json
{
  "success": false,
  "message": "Terjadi kesalahan saat memproses request"
}
```

---

## Usage Examples

### Example 1: Owner membuat cabang baru

```bash
curl -X POST http://localhost:3000/api/branches \
  -H "Authorization: Bearer <owner_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "PS Station Sudirman",
    "address": "Jl. Sudirman No. 123",
    "phone": "081234567890",
    "openTime": "09:00",
    "closeTime": "23:00"
  }'
```

### Example 2: Owner menambahkan admin ke cabang

```bash
curl -X POST http://localhost:3000/api/branches/1/admins \
  -H "Authorization: Bearer <owner_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "role": "manager"
  }'
```

### Example 3: Admin menambahkan device

```bash
curl -X POST http://localhost:3000/api/branches/1/devices \
  -H "Authorization: Bearer <admin_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "code": "PS-01",
    "type": "ps",
    "specs": {
      "model": "PlayStation 5"
    }
  }'
```

### Example 4: Admin menambahkan paket

```bash
curl -X POST http://localhost:3000/api/branches/1/packages \
  -H "Authorization: Bearer <admin_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Paket 1 Jam",
    "durationMinutes": 60,
    "price": 15000
  }'
```

---

## Notes

1. **BigInt Handling**: Semua ID dalam response dikembalikan sebagai string untuk menghindari masalah precision dengan BigInt.

2. **Time Format**: `openTime` dan `closeTime` disimpan sebagai Date dengan reference date `1970-01-01`. Yang penting adalah jam/menit/detik-nya.

3. **Cascade Delete**: Ketika branch dihapus, semua devices, packages, dan admins yang terkait akan otomatis terhapus (cascade). Namun, branch dengan riwayat order tidak bisa dihapus.

4. **Audit Logging**: Setiap operasi create, update, dan delete akan otomatis dicatat di `AuditLog` untuk keperluan tracking.

5. **Admin Limitation**: Satu user hanya bisa menjadi admin di satu cabang. Jika ingin assign ke cabang lain, harus dihapus dulu dari cabang sebelumnya.
