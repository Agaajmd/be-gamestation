# Device Management API Documentation

API untuk mengelola device cabang (branch) game station.

## Base URL

```
/api/branches
```

---

## Endpoints

### 1. Add Device to Branch

Menambahkan device ke cabang (Owner/Admin).

**Endpoint:** `POST /branches/:id/devices`

**Authorization:** Bearer Token (Owner/Admin)

**URL Parameters:**

- `id`: Branch ID

**Request Body:**

```json
{
  "code": "PS5-VIP-001",
  "roomNumber": "VIP-01",
  "type": "ps",
  "version": "ps5",
  "categoryId": "2",
  "pricePerHour": 75000,
  "specs": {
    "storage": "1TB SSD",
    "controllers": 2,
    "features": ["4K", "HDR", "Ray Tracing"]
  },
  "status": "active"
}
```

**Field Details:**

- `code` (required): Kode unik device (dalam branch)
- `roomNumber` (required): Nomor ruangan (max 20 karakter)
- `type` (required): Tipe device, pilihan: `"ps"`, `"racing"`, `"vr"`, `"pc"`, `"arcade"`
- `version` (optional): Versi device
  - PS: `"ps4"`, `"ps5"`
  - Racing: `"racing_standard"`, `"racing_pro"`
  - VR: `"vr_meta"`, `"vr_pico"`
  - PC: `"pc_standard"`, `"pc_gaming"`
  - Arcade: `"arcade_standard"`
- `categoryId` (optional): ID kategori device (Regular/VIP/VVIP)
- `pricePerHour` (required): Harga per jam
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
    "categoryId": "2",
    "code": "PS5-VIP-001",
    "roomNumber": "VIP-01",
    "type": "ps",
    "version": "ps5",
    "pricePerHour": "75000.00",
    "specs": {
      "storage": "1TB SSD",
      "controllers": 2,
      "features": ["4K", "HDR", "Ray Tracing"]
    },
    "status": "active",
    "category": {
      "id": "2",
      "name": "VIP",
      "tier": "vip",
      "pricePerHour": "25000.00"
    },
    "createdAt": "2025-12-12T10:00:00.000Z",
    "updatedAt": "2025-12-12T10:00:00.000Z"
  }
}
```

**Error Responses:**

- `400`: Code, room number, type, dan price per hour wajib diisi
- `400`: Type harus salah satu dari: ps, racing, vr, pc, arcade
- `400`: Kode device sudah digunakan di cabang ini
- `400`: Nomor ruangan sudah digunakan di cabang ini
- `403`: Anda tidak memiliki akses ke cabang ini

---

### 2. Update Device

Update informasi device (Owner/Admin).

**Endpoint:** `PUT /branches/:branchId/devices/:deviceId`

**Authorization:** Bearer Token (Owner/Admin)

**URL Parameters:**

- `branchId`: Branch ID
- `deviceId`: Device ID

**Request Body:**

```json
{
  "code": "PS5-VIP-001-UPDATED",
  "roomNumber": "VIP-01A",
  "type": "ps",
  "version": "ps5",
  "categoryId": "3",
  "pricePerHour": 80000,
  "specs": {
    "model": "PlayStation 5 Pro",
    "storage": "2TB",
    "controllers": 4
  },
  "status": "maintenance"
}
```

**Field Details:**

- `code` (optional): Kode baru device (harus unique dalam branch)
- `type` (optional): Tipe device, pilihan: `"ps"`, `"racing"`, `"vr"`, `"pc"`, `"arcade"`
- `specs` (optional): JSON berisi spesifikasi device
- `status` (optional): Status device, pilihan: `"active"`, `"maintenance"`, `"disabled"`

**Note:** Semua field optional, hanya kirim field yang ingin diupdate.

**Success Response (200):**

```json
{
  "success": true,
  "message": "Device berhasil diupdate",
  "data": {
    "id": "1",
    "branchId": "1",
    "code": "PS-02",
    "type": "ps",
    "specs": {
      "model": "PlayStation 5 Pro",
      "storage": "2TB",
      "controllers": 4
    },
    "status": "maintenance",
    "createdAt": "2025-12-05T10:00:00.000Z",
    "updatedAt": "2025-12-08T15:30:00.000Z"
  }
}
```

**Error Responses:**

- `404`: Device tidak ditemukan di cabang ini
- `403`: Anda tidak memiliki akses ke cabang ini
- `400`: Type harus salah satu dari: ps, racing, vr, pc, arcade
- `400`: Status harus salah satu dari: active, maintenance, disabled
- `400`: Kode device sudah digunakan di cabang ini

---

### 3. Delete Device

Hapus device dari cabang (Owner/Admin).

**Endpoint:** `DELETE /branches/:branchId/devices/:deviceId`

**Authorization:** Bearer Token (Owner/Admin)

**URL Parameters:**

- `branchId`: Branch ID
- `deviceId`: Device ID

**Success Response (200):**

```json
{
  "success": true,
  "message": "Device berhasil dihapus"
}
```

**Error Responses:**

- `404`: Device tidak ditemukan di cabang ini
- `403`: Anda tidak memiliki akses ke cabang ini
- `400`: Tidak dapat menghapus device yang memiliki riwayat session. Ubah status menjadi 'disabled' jika ingin menonaktifkan.

**Important Note:**

- Device dengan riwayat session tidak bisa dihapus untuk menjaga data integrity
- Gunakan status `"disabled"` untuk menonaktifkan device jika masih punya riwayat

---

## Authorization & Access Control

### Role-Based Access:

| Endpoint      | Owner             | Admin                | Customer |
| ------------- | ----------------- | -------------------- | -------- |
| Add Device    | ✅ (own branches) | ✅ (assigned branch) | ❌       |
| Update Device | ✅ (own branches) | ✅ (assigned branch) | ❌       |
| Delete Device | ✅ (own branches) | ✅ (assigned branch) | ❌       |

---

## Device Types

Available device types:

- `ps` - PlayStation consoles
- `racing` - Racing simulator
- `vr` - Virtual Reality headsets
- `pc` - PC Gaming
- `arcade` - Arcade machines

---

## Device Status

Available status:

- `active` - Device aktif dan bisa dipakai
- `maintenance` - Device dalam perbaikan/maintenance
- `disabled` - Device dinonaktifkan

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
  "message": "Anda tidak memiliki akses ke cabang ini"
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

### Example 1: Admin menambahkan device baru

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

### Example 2: Owner update status device ke maintenance

```bash
curl -X PUT http://localhost:3000/api/branches/1/devices/5 \
  -H "Authorization: Bearer <owner_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "maintenance"
  }'
```

### Example 3: Admin hapus device yang tidak terpakai

```bash
curl -X DELETE http://localhost:3000/api/branches/1/devices/5 \
  -H "Authorization: Bearer <admin_token>"
```

---

## Notes

1. **Code Uniqueness**: Device code harus unique dalam satu branch, tapi boleh sama di branch berbeda.

2. **Soft Delete Alternative**: Jika device punya riwayat session, gunakan status `"disabled"` untuk menonaktifkan device tanpa menghapus data.

3. **Audit Logging**: Setiap operasi create, update, dan delete akan otomatis dicatat di `AuditLog`.

4. **BigInt Handling**: Semua ID dalam response dikembalikan sebagai string untuk menghindari masalah precision dengan BigInt.

5. **Specs Format**: Field `specs` adalah JSON object yang bisa disesuaikan dengan kebutuhan masing-masing tipe device.
