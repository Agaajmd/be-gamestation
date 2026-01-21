# Holiday API - Updated Documentation

## Overview

API Holiday yang telah di-refactor untuk support operasi pada semua branch atau branch tertentu, dengan opsi untuk overwrite dan delete existing holidays.

## Endpoints

### 1. Sync National Holidays

Sync libur nasional Indonesia dari API eksternal ke branch tertentu atau semua branch.

**Endpoint:** `POST /holidays/national/sync/:year`

**Parameters:**

- `year` (path, required): Tahun untuk sync (2020-2030)
- `branchIds` (query, optional): Comma-separated branch IDs. Jika tidak ada, sync ke semua branch
- `overwrite` (query, optional): `true` atau `false` (default). Jika true, update existing holidays
- `deleteExisting` (query, optional): `true` atau `false` (default). Jika true, delete existing holidays sebelum sync

**Examples:**

**Sync ke semua branch (default):**

```bash
POST /holidays/national/sync/2026
```

**Sync ke branch tertentu:**

```bash
POST /holidays/national/sync/2026?branchIds=1,2,3
```

**Sync ke semua branch dengan overwrite:**

```bash
POST /holidays/national/sync/2026?overwrite=true
```

**Sync ke branch tertentu dengan delete existing:**

```bash
POST /holidays/national/sync/2026?branchIds=1,2&deleteExisting=true
```

**Response:**

```json
{
  "success": true,
  "message": "Berhasil sync 11 libur nasional tahun 2026",
  "data": {
    "year": 2026,
    "targetBranches": 5,
    "totalFromAPI": 15,
    "created": 11,
    "updated": 0,
    "skipped": 4,
    "deleted": 0,
    "failed": 0,
    "createdList": [
      {
        "date": "2026-01-01",
        "name": "Tahun Baru",
        "branchCount": 5
      }
    ],
    "updatedList": null,
    "skippedList": [
      {
        "date": "2026-01-02",
        "name": "Holiday Name",
        "reason": "Already exists in 5 branch(es)",
        "branchCount": 5
      }
    ],
    "deletedList": null,
    "errorList": null
  }
}
```

---

### 2. Add Custom Holiday (Single)

Menambahkan 1 hari libur custom ke branch tertentu atau semua branch.

**Endpoint:** `POST /holidays/custom`

**Query Parameters:**

- `branchIds` (optional): Comma-separated branch IDs. Jika tidak ada, tambah ke semua branch
- `overwrite` (optional): `true` atau `false` (default). Jika true, update existing holidays

**Body:**

```json
{
  "date": "2026-03-15",
  "name": "Company Anniversary",
  "description": "Celebrating our 10 years"
}
```

**Examples:**

**Add ke semua branch:**

```bash
POST /holidays/custom
Content-Type: application/json

{
  "date": "2026-03-15",
  "name": "Company Anniversary"
}
```

**Add ke branch tertentu:**

```bash
POST /holidays/custom?branchIds=1,2,3
Content-Type: application/json

{
  "date": "2026-03-15",
  "name": "Company Anniversary",
  "description": "Celebrating our 10 years"
}
```

**Add dengan overwrite (jika sudah ada, update):**

```bash
POST /holidays/custom?branchIds=1&overwrite=true
Content-Type: application/json

{
  "date": "2026-03-15",
  "name": "Company Anniversary",
  "description": "Updated description"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Hari libur 'Company Anniversary' berhasil ditambahkan ke 3 branch",
  "data": {
    "date": "2026-03-15",
    "name": "Company Anniversary",
    "targetBranches": 3,
    "created": 3,
    "updated": 0,
    "skipped": 0,
    "failed": 0,
    "createdList": [
      {
        "id": "1",
        "branchId": "1",
        "branchName": "Branch Pusat",
        "date": "2026-03-15",
        "name": "Company Anniversary"
      }
    ]
  }
}
```

---

### 3. Add Custom Holidays (Bulk)

Menambahkan multiple hari libur custom sekaligus.

**Endpoint:** `POST /holidays/custom/bulk`

**Query Parameters:**

- `branchIds` (optional): Comma-separated branch IDs. Jika tidak ada, tambah ke semua branch
- `overwrite` (optional): `true` atau `false` (default)

**Body:**

```json
{
  "holidays": [
    {
      "date": "2026-03-15",
      "name": "Company Anniversary",
      "description": "Celebrating our 10 years"
    },
    {
      "date": "2026-12-25",
      "name": "Christmas Holiday"
    }
  ]
}
```

**Examples:**

**Add multiple ke semua branch:**

```bash
POST /holidays/custom/bulk
Content-Type: application/json

{
  "holidays": [
    {
      "date": "2026-03-15",
      "name": "Company Anniversary"
    },
    {
      "date": "2026-12-25",
      "name": "Christmas Holiday"
    }
  ]
}
```

**Add multiple ke branch tertentu dengan overwrite:**

```bash
POST /holidays/custom/bulk?branchIds=1,2&overwrite=true
Content-Type: application/json

{
  "holidays": [
    {
      "date": "2026-03-15",
      "name": "Company Anniversary"
    },
    {
      "date": "2026-12-25",
      "name": "Christmas Holiday"
    }
  ]
}
```

**Response:**

```json
{
  "success": true,
  "message": "Berhasil menambahkan 6 hari libur baru",
  "data": {
    "totalHolidays": 2,
    "targetBranches": 2,
    "created": 6,
    "updated": 0,
    "skipped": 0,
    "failed": 0,
    "createdList": [
      {
        "id": "1",
        "branchId": "1",
        "branchName": "Branch Pusat",
        "date": "2026-03-15",
        "name": "Company Anniversary"
      }
    ]
  }
}
```

---

### 4. Get Branch Holidays

Mendapatkan semua hari libur untuk branch dengan optional date range filter.

**Endpoint:** `GET /branches/:branchId/holidays`

**Parameters:**

- `branchId` (path, required): ID branch
- `startDate` (query, optional): Format YYYY-MM-DD
- `endDate` (query, optional): Format YYYY-MM-DD

**Examples:**

**Get semua holidays di branch:**

```bash
GET /branches/1/holidays
```

**Get holidays dengan date range:**

```bash
GET /branches/1/holidays?startDate=2026-01-01&endDate=2026-12-31
```

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": "1",
      "branchId": "1",
      "date": "2026-01-01T00:00:00.000Z",
      "name": "Tahun Baru",
      "description": "Tahun Baru - Libur Nasional"
    },
    {
      "id": "2",
      "branchId": "1",
      "date": "2026-03-15T00:00:00.000Z",
      "name": "Company Anniversary",
      "description": "Celebrating our 10 years"
    }
  ]
}
```

---

### 5. Delete Holiday by ID

Menghapus hari libur spesifik berdasarkan ID.

**Endpoint:** `DELETE /holidays/:holidayId`

**Parameters:**

- `holidayId` (path, required): ID holiday

**Example:**

```bash
DELETE /holidays/1
```

**Response:**

```json
{
  "success": true,
  "message": "Hari libur berhasil dihapus",
  "data": {
    "deletedCount": 1,
    "holidayId": "1",
    "branchId": "1"
  }
}
```

---

### 6. Delete Holidays by Date Range

Menghapus hari libur berdasarkan range tanggal dari branch tertentu atau semua branch.

**Endpoint:** `DELETE /holidays/delete-range`

**Query Parameters:**

- `startDate` (required): Format YYYY-MM-DD
- `endDate` (required): Format YYYY-MM-DD
- `branchIds` (optional): Comma-separated branch IDs. Jika tidak ada, delete dari semua branch

**Examples:**

**Delete dari semua branch berdasarkan date range:**

```bash
DELETE /holidays/delete-range?startDate=2026-01-01&endDate=2026-01-31
```

**Delete dari branch tertentu:**

```bash
DELETE /holidays/delete-range?branchIds=1,2&startDate=2026-01-01&endDate=2026-01-31
```

**Response:**

```json
{
  "success": true,
  "message": "Berhasil menghapus 12 hari libur",
  "data": {
    "deletedCount": 12,
    "startDate": "2026-01-01",
    "endDate": "2026-01-31",
    "affectedBranches": 5
  }
}
```

---

## Usage Scenarios

### Scenario 1: Sync National Holidays for All Branches (First Time)

```bash
POST /holidays/national/sync/2026
```

- Sync semua libur nasional tahun 2026 ke semua branch
- Holiday yang sudah exist akan di-skip

### Scenario 2: Update National Holidays for Specific Branches

```bash
POST /holidays/national/sync/2026?branchIds=1,2,3&overwrite=true
```

- Sync ke 3 branch tertentu dengan update description

### Scenario 3: Reset National Holidays

```bash
POST /holidays/national/sync/2026?deleteExisting=true
```

- Delete semua existing national holidays
- Kemudian sync holidays baru dari API

### Scenario 4: Add Custom Holiday to All Branches

```bash
POST /holidays/custom
{
  "date": "2026-06-01",
  "name": "Mid Year Celebration"
}
```

- Tambah custom holiday ke semua branch

### Scenario 5: Add Multiple Custom Holidays with Overwrite

```bash
POST /holidays/custom/bulk?branchIds=1,2&overwrite=true
{
  "holidays": [
    {"date": "2026-03-15", "name": "Company Anniversary"},
    {"date": "2026-12-25", "name": "Christmas"}
  ]
}
```

- Tambah multiple holidays ke 2 branch tertentu
- Jika sudah exist, akan update

### Scenario 6: Clean Up Old Holidays

```bash
DELETE /holidays/delete-range?startDate=2026-01-01&endDate=2026-02-28&branchIds=1
```

- Delete semua holidays di branch 1 untuk bulan Januari-Februari 2026

---

## Error Handling

### Common Errors:

**400 - Bad Request:**

```json
{
  "success": false,
  "message": "Date dan name wajib diisi"
}
```

**404 - Not Found:**

```json
{
  "success": false,
  "message": "Branch tidak ditemukan"
}
```

**500 - Server Error:**

```json
{
  "success": false,
  "message": "Failed to fetch holidays from external API"
}
```

---

## Notes

- Semua operasi dapat dilakukan ke semua branch (default) atau branch tertentu
- `branchIds` harus comma-separated jika lebih dari 1 branch
- `overwrite` default adalah `false` - existing holidays tidak akan diupdate
- `deleteExisting` default adalah `false` - existing holidays tidak akan dihapus
- Date format: YYYY-MM-DD (ISO format)
- Respons selalu include statistik: created, updated, skipped, failed
