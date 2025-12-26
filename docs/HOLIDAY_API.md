# Holiday API Documentation

API untuk mengelola hari libur nasional dan custom per branch.

## Features

- ✅ Sync otomatis libur nasional Indonesia dari API eksternal
- ✅ Tambah libur custom per branch
- ✅ Update & hapus hari libur
- ✅ Filter berdasarkan branch, tanggal, atau tahun

---

## Endpoints

### 1. Sync National Holidays (from API)

**Recommended!** Sync libur nasional Indonesia untuk tahun tertentu dari API gratis.

```http
POST /holidays/national/sync/:year
Authorization: Bearer {token}
```

**Parameters:**

- `year` (path): Tahun yang ingin di-sync (2020-2030)

**Response Success:**

```json
{
  "success": true,
  "message": "Berhasil sync 16 libur nasional tahun 2025",
  "data": {
    "year": 2025,
    "affectedBranches": 3,
    "totalFromAPI": 16,
    "created": 16,
    "skipped": 0,
    "failed": 0,
    "createdList": [
      {
        "date": "2025-01-01",
        "name": "Tahun Baru Masehi"
      },
      {
        "date": "2025-08-17",
        "name": "Hari Kemerdekaan Republik Indonesia"
      }
      // ... more holidays
    ]
  }
}
```

**Response Already Exists:**

```json
{
  "success": true,
  "message": "Berhasil sync 0 libur nasional tahun 2025",
  "data": {
    "year": 2025,
    "affectedBranches": 3,
    "totalFromAPI": 16,
    "created": 0,
    "skipped": 16,
    "failed": 0,
    "skippedList": [
      {
        "date": "2025-01-01",
        "name": "Tahun Baru Masehi",
        "reason": "Already exists"
      }
      // ... more
    ]
  }
}
```

**Error Cases:**

- `400`: Invalid year (di luar range 2020-2030)
- `404`: Tidak ada branch atau data dari API
- `502`: Gagal koneksi ke API eksternal

**Usage:**

```bash
# Sync libur nasional 2025
curl -X POST http://localhost:3000/holidays/national/sync/2025 \
  -H "Authorization: Bearer YOUR_TOKEN"

# Sync untuk tahun lain
curl -X POST http://localhost:3000/holidays/national/sync/2026 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### 2. Add Custom Holiday

Tambah hari libur custom untuk branch tertentu (ulang tahun branch, event khusus, dll).

```http
POST /holidays/custom
Authorization: Bearer {token}
Content-Type: application/json

{
  "branchId": "1",
  "date": "2025-08-17",
  "name": "Ulang Tahun Branch Jakarta",
  "description": "Anniversary ke-5 cabang Jakarta"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Hari libur berhasil ditambahkan",
  "data": {
    "id": "123",
    "branchId": "1",
    "branchName": "Game Station Jakarta",
    "date": "2025-08-17T00:00:00.000Z",
    "name": "Ulang Tahun Branch Jakarta",
    "description": "Anniversary ke-5 cabang Jakarta"
  }
}
```

---

### 3. Get Holidays

Ambil daftar hari libur dengan berbagai filter.

```http
GET /holidays?branchId=1&year=2025
GET /holidays?startDate=2025-01-01&endDate=2025-12-31
GET /holidays
```

**Query Parameters (Optional):**

- `branchId`: Filter by branch
- `year`: Filter by year
- `startDate` & `endDate`: Filter by date range

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": "1",
      "branchId": "1",
      "branchName": "Game Station Jakarta",
      "date": "2025-01-01T00:00:00.000Z",
      "name": "Tahun Baru Masehi",
      "description": "Tahun Baru Masehi - Libur Nasional"
    }
  ],
  "meta": {
    "total": 16,
    "filters": {
      "branchId": "1",
      "year": "2025"
    }
  }
}
```

---

### 4. Update Holiday

Update informasi hari libur.

```http
PUT /holidays/:id
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Libur Lebaran (Updated)",
  "description": "Idul Fitri 1446 H"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Hari libur berhasil diupdate",
  "data": {
    "id": "5",
    "branchId": "1",
    "branchName": "Game Station Jakarta",
    "date": "2025-03-31T00:00:00.000Z",
    "name": "Libur Lebaran (Updated)",
    "description": "Idul Fitri 1446 H"
  }
}
```

---

### 5. Delete Holiday

Hapus hari libur individual.

```http
DELETE /holidays/:id
Authorization: Bearer {token}
```

**Response:**

```json
{
  "success": true,
  "message": "Hari libur berhasil dihapus",
  "data": {
    "id": "5",
    "branchName": "Game Station Jakarta",
    "date": "2025-03-31T00:00:00.000Z",
    "name": "Idul Fitri"
  }
}
```

---

### 6. Delete National Holiday

Hapus hari libur nasional dari **semua branch** pada tanggal tertentu.

```http
DELETE /holidays/national/2025-12-25?name=Natal
Authorization: Bearer {token}
```

**Query Parameters (Optional):**

- `name`: Filter by holiday name

**Response:**

```json
{
  "success": true,
  "message": "3 hari libur berhasil dihapus",
  "data": {
    "date": "2025-12-25T00:00:00.000Z",
    "deletedCount": 3
  }
}
```

---

## Workflow Recommended

### Setup Awal (Owner/Admin)

1. **Sync libur nasional untuk tahun berjalan:**

   ```bash
   POST /holidays/national/sync/2025
   ```

2. **Tambah libur custom jika ada:**

   ```bash
   POST /holidays/custom
   {
     "branchId": "1",
     "date": "2025-10-15",
     "name": "Company Anniversary",
     "description": "Ulang tahun perusahaan"
   }
   ```

3. **View semua holidays:**
   ```bash
   GET /holidays?year=2025
   ```

### Setiap Awal Tahun

Sync libur nasional untuk tahun baru:

```bash
POST /holidays/national/sync/2026
```

---

## Integration dengan Booking Flow

Hari libur otomatis ter-filter di:

1. **GET /booking/branches/:branchId/available-dates**

   - Tanggal yang ada holiday masuk ke `closedDates`

2. **GET /booking/branches/:branchId/available-times**
   - Jika tanggal holiday, return empty dengan message

Contoh response:

```json
{
  "success": true,
  "data": [],
  "message": "Branch tutup: Tahun Baru Masehi"
}
```

---

## API Source

Data libur nasional di-sync dari:
**https://api-harilibur.vercel.app/**

- ✅ Gratis
- ✅ Data akurat untuk Indonesia
- ✅ Support 2020-2030
- ✅ Include libur nasional & cuti bersama

---

## Authorization

Semua endpoint (kecuali GET) memerlukan:

- `Authorization: Bearer {token}`
- Role: `owner` atau `admin`

---

## Error Handling

| Code | Message      | Cause                             |
| ---- | ------------ | --------------------------------- |
| 400  | Invalid year | Year di luar range 2020-2030      |
| 401  | Unauthorized | Token invalid/missing             |
| 403  | Forbidden    | Bukan owner/admin                 |
| 404  | Not found    | Branch/holiday tidak ditemukan    |
| 409  | Conflict     | Holiday sudah ada (duplicate)     |
| 502  | Bad Gateway  | API eksternal tidak dapat diakses |
| 500  | Server Error | Internal error                    |
