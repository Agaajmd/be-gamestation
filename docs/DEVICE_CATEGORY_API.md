# Device Category API Documentation

API untuk mengelola kategori device (Regular, VIP, VVIP) di setiap cabang.

## Base URL

```
http://localhost:3000
```

---

## 1. Add Device Category

Menambahkan kategori device baru ke cabang (Owner/Admin only).

### Endpoint

```
POST /branches/:id/device-categories
```

### Access

Private (Owner/Admin)

### Headers

```
Authorization: Bearer <token>
```

### URL Parameters

- `id` (required): ID cabang

### Request Body

```json
{
  "name": "VIP",
  "tier": "vip",
  "deviceType": "ps",
  "description": "Ruangan privat dengan sofa premium dan minuman gratis",
  "pricePerHour": 25000,
  "amenities": {
    "features": ["AC", "Premium Sofa", "Mini Bar", "Sound System"]
  },
  "isActive": true
}
```

### Field Descriptions

- `name` (required): Nama kategori (max 50 karakter)
- `tier` (required): Tier kategori (`regular`, `vip`, `vvip`)
- `deviceType` (required): Tipe device (`ps`, `racing`, `vr`, `pc`, `arcade`)
- `description` (optional): Deskripsi keunggulan kategori
- `pricePerHour` (required): Biaya tambahan per jam untuk kategori ini
- `amenities` (optional): Fasilitas khusus kategori (JSON object)
- `isActive` (optional): Status aktif/non-aktif (default: true)

### Response Success (201)

```json
{
  "success": true,
  "message": "Kategori device berhasil ditambahkan",
  "data": {
    "id": "2",
    "branchId": "1",
    "name": "VIP",
    "tier": "vip",
    "deviceType": "ps",
    "description": "Ruangan privat dengan sofa premium dan minuman gratis",
    "pricePerHour": "25000.00",
    "amenities": {
      "features": ["AC", "Premium Sofa", "Mini Bar", "Sound System"]
    },
    "isActive": true,
    "createdAt": "2025-12-12T08:00:00.000Z",
    "updatedAt": "2025-12-12T08:00:00.000Z"
  }
}
```

### Response Error (400)

```json
{
  "success": false,
  "message": "Kategori dengan nama dan device type yang sama sudah ada"
}
```

### Response Error (403)

```json
{
  "success": false,
  "message": "Anda tidak memiliki akses ke cabang ini"
}
```

---

## 2. Get Device Categories

Mendapatkan semua kategori device di cabang.

### Endpoint

```
GET /branches/:id/device-categories
```

### Access

Public

### URL Parameters

- `id` (required): ID cabang

### Query Parameters

- `deviceType` (optional): Filter berdasarkan tipe device
- `tier` (optional): Filter berdasarkan tier (regular, vip, vvip)
- `isActive` (optional): Filter berdasarkan status aktif (true/false)

### Example Request

```
GET /branches/1/device-categories?deviceType=ps&isActive=true
```

### Response Success (200)

```json
{
  "success": true,
  "data": [
    {
      "id": "1",
      "branchId": "1",
      "name": "Regular",
      "tier": "regular",
      "deviceType": "ps",
      "description": "Ruangan standar dengan fasilitas dasar",
      "pricePerHour": "0.00",
      "amenities": {
        "features": ["AC", "Sofa"]
      },
      "isActive": true,
      "createdAt": "2025-12-12T08:00:00.000Z",
      "updatedAt": "2025-12-12T08:00:00.000Z",
      "_count": {
        "devices": 5,
        "games": 50
      }
    },
    {
      "id": "2",
      "branchId": "1",
      "name": "VIP",
      "tier": "vip",
      "deviceType": "ps",
      "description": "Ruangan privat dengan sofa premium dan minuman gratis",
      "pricePerHour": "25000.00",
      "amenities": {
        "features": ["AC", "Premium Sofa", "Mini Bar", "Sound System"]
      },
      "isActive": true,
      "createdAt": "2025-12-12T08:00:00.000Z",
      "updatedAt": "2025-12-12T08:00:00.000Z",
      "_count": {
        "devices": 3,
        "games": 50
      }
    }
  ]
}
```

---

## 3. Update Device Category

Mengupdate kategori device (Owner/Admin only).

### Endpoint

```
PUT /branches/:branchId/device-categories/:categoryId
```

### Access

Private (Owner/Admin)

### Headers

```
Authorization: Bearer <token>
```

### URL Parameters

- `branchId` (required): ID cabang
- `categoryId` (required): ID kategori

### Request Body

```json
{
  "name": "VIP Premium",
  "description": "Ruangan VIP dengan upgrade fasilitas",
  "pricePerHour": 30000,
  "amenities": {
    "features": ["AC", "Premium Sofa", "Mini Bar", "Sound System", "PS VR2"]
  },
  "isActive": true
}
```

### Response Success (200)

```json
{
  "success": true,
  "message": "Kategori device berhasil diupdate",
  "data": {
    "id": "2",
    "branchId": "1",
    "name": "VIP Premium",
    "tier": "vip",
    "deviceType": "ps",
    "description": "Ruangan VIP dengan upgrade fasilitas",
    "pricePerHour": "30000.00",
    "amenities": {
      "features": ["AC", "Premium Sofa", "Mini Bar", "Sound System", "PS VR2"]
    },
    "isActive": true,
    "createdAt": "2025-12-12T08:00:00.000Z",
    "updatedAt": "2025-12-12T09:30:00.000Z"
  }
}
```

### Response Error (403)

```json
{
  "success": false,
  "message": "Anda tidak memiliki akses ke cabang ini"
}
```

### Response Error (404)

```json
{
  "success": false,
  "message": "Kategori tidak ditemukan di cabang ini"
}
```

---

## 4. Delete Device Category

Menghapus kategori device (Owner/Admin only).

### Endpoint

```
DELETE /branches/:branchId/device-categories/:categoryId
```

### Access

Private (Owner/Admin)

### Headers

```
Authorization: Bearer <token>
```

### URL Parameters

- `branchId` (required): ID cabang
- `categoryId` (required): ID kategori

### Response Success (200)

```json
{
  "success": true,
  "message": "Kategori device berhasil dihapus"
}
```

### Response Error (400)

```json
{
  "success": false,
  "message": "Tidak dapat menghapus kategori yang masih digunakan oleh device"
}
```

### Response Error (403)

```json
{
  "success": false,
  "message": "Anda tidak memiliki akses ke cabang ini"
}
```

### Response Error (404)

```json
{
  "success": false,
  "message": "Kategori tidak ditemukan di cabang ini"
}
```

---

## Category Tier Guidelines

### Regular

- Tier standar dengan fasilitas dasar
- Biasanya `pricePerHour` = 0 (tidak ada biaya tambahan)
- Cocok untuk casual gamers

### VIP

- Tier premium dengan fasilitas lebih baik
- Biaya tambahan moderate (misalnya 20.000 - 50.000 per jam)
- Ruangan privat, sofa premium, minuman gratis, dll

### VVIP

- Tier eksklusif dengan fasilitas terlengkap
- Biaya tambahan premium (misalnya 50.000 - 100.000 per jam)
- Home theater, butler service, private bathroom, dll

---

## Use Cases

### Setup Kategori untuk Cabang Baru

1. Buat kategori Regular untuk setiap device type

```json
{
  "name": "Regular PS",
  "tier": "regular",
  "deviceType": "ps",
  "pricePerHour": 0
}
```

2. Buat kategori VIP (optional)

```json
{
  "name": "VIP PS",
  "tier": "vip",
  "deviceType": "ps",
  "pricePerHour": 25000,
  "amenities": {
    "features": ["Private Room", "Premium Sofa"]
  }
}
```

3. Buat kategori VVIP (optional)

```json
{
  "name": "VVIP PS",
  "tier": "vvip",
  "deviceType": "ps",
  "pricePerHour": 50000,
  "amenities": {
    "features": ["Exclusive Suite", "Butler Service"]
  }
}
```

### Sementara Disable Kategori

Jika kategori sedang renovasi atau maintenance:

```json
{
  "isActive": false
}
```

### Pricing Strategy

Total harga untuk customer:

```
Total = (Device Price Per Hour + Category Price Per Hour) × Duration Hours + Advance Booking Fee
```

Contoh:

- PS5 Standard: Rp 75.000/jam
- VIP Category: Rp 25.000/jam
- Duration: 2 jam
- Booking 3 hari di muka: Rp 10.000/jam

Total = (75.000 + 25.000) × 2 + (10.000 × 2) = Rp 220.000

---

## Notes

- Setiap kombinasi `name + deviceType` di branch yang sama harus unik
- Kategori tidak bisa dihapus jika masih ada device yang menggunakannya
- Set `isActive = false` untuk sementara menonaktifkan kategori
- Kategori Regular biasanya tidak dikenakan biaya tambahan (pricePerHour = 0)
- Amenities bersifat flexible (JSON), bisa disesuaikan kebutuhan masing-masing cabang
