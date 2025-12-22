# Booking Flow API Documentation

API untuk flow booking customer dari pemilihan cabang hingga checkout.

## Base URL

```
http://localhost:3000
```

---

## 1. Get All Branches

Mendapatkan semua cabang game station untuk halaman booking.

### Endpoint

```
GET /booking/branches
```

### Access

Public

### Response Success (200)

```json
{
  "success": true,
  "data": [
    {
      "id": "1",
      "name": "Game Station Jakarta Pusat",
      "address": "Jl. Sudirman No. 123, Jakarta Pusat",
      "phone": "021-12345678",
      "openTime": "09:00:00",
      "closeTime": "23:00:00",
      "amenities": ["wifi", "parking", "cafe"],
      "_count": {
        "devices": 15
      }
    }
  ]
}
```

---

## 2. Get Available Device Types

Mendapatkan tipe device yang tersedia di cabang (PS, Racing, VR, dll).

### Endpoint

```
GET /booking/branches/:branchId/device-types
```

### Access

Public

### URL Parameters

- `branchId` (required): ID cabang

### Response Success (200)

```json
{
  "success": true,
  "data": {
    "ps": [
      {
        "version": "ps4",
        "pricePerHour": "50000.00"
      },
      {
        "version": "ps5",
        "pricePerHour": "75000.00"
      }
    ],
    "racing": [
      {
        "version": "racing_standard",
        "pricePerHour": "80000.00"
      },
      {
        "version": "racing_pro",
        "pricePerHour": "120000.00"
      }
    ],
    "vr": [
      {
        "version": "vr_meta",
        "pricePerHour": "100000.00"
      }
    ]
  }
}
```

### Response Error (404)

```json
{
  "success": false,
  "message": "Cabang tidak ditemukan"
}
```

---

## 3. Get Available Categories

Mendapatkan kategori device (Regular, VIP, VVIP) berdasarkan device type yang dipilih.

### Endpoint

```
GET /booking/branches/:branchId/categories
```

### Access

Public

### URL Parameters

- `branchId` (required): ID cabang

### Query Parameters

- `deviceType` (required): Tipe device (ps, racing, vr, pc, arcade)
- `deviceVersion` (optional): Versi device (ps4, ps5, etc)

### Example Request

```
GET /booking/branches/1/categories?deviceType=ps&deviceVersion=ps5
```

### Response Success (200)

```json
{
  "success": true,
  "data": [
    {
      "id": "1",
      "name": "Regular",
      "tier": "regular",
      "deviceType": "ps",
      "description": "Ruangan standar dengan fasilitas dasar",
      "pricePerHour": "0.00",
      "amenities": {
        "features": ["AC", "Sofa"]
      },
      "isActive": true,
      "_count": {
        "devices": 5,
        "games": 50
      }
    },
    {
      "id": "2",
      "name": "VIP",
      "tier": "vip",
      "deviceType": "ps",
      "description": "Ruangan privat dengan sofa premium dan minuman gratis",
      "pricePerHour": "25000.00",
      "amenities": {
        "features": ["AC", "Premium Sofa", "Mini Bar", "Sound System"]
      },
      "isActive": true,
      "_count": {
        "devices": 3,
        "games": 50
      }
    },
    {
      "id": "3",
      "name": "VVIP",
      "tier": "vvip",
      "deviceType": "ps",
      "description": "Ruangan eksklusif dengan home theater dan butler service",
      "pricePerHour": "50000.00",
      "amenities": {
        "features": ["AC", "Home Theater", "Butler Service", "Private Bathroom"]
      },
      "isActive": true,
      "_count": {
        "devices": 2,
        "games": 80
      }
    }
  ]
}
```

### Response Error (400)

```json
{
  "success": false,
  "message": "Device type wajib diisi"
}
```

---

## 4. Get Available Rooms

Mendapatkan ruangan (device) yang tersedia berdasarkan kategori dan waktu.

### Endpoint

```
GET /booking/branches/:branchId/rooms
```

### Access

Public

### URL Parameters

- `branchId` (required): ID cabang

### Query Parameters

- `deviceType` (required): Tipe device
- `categoryId` (required): ID kategori
- `deviceVersion` (optional): Versi device
- `bookingDate` (optional): Tanggal booking (YYYY-MM-DD) untuk cek availability
- `startTime` (optional): Jam mulai (HH:mm) untuk cek availability

### Example Request

```
GET /booking/branches/1/rooms?deviceType=ps&categoryId=2&deviceVersion=ps5&bookingDate=2025-12-15&startTime=14:00
```

### Response Success (200)

```json
{
  "success": true,
  "data": [
    {
      "id": "1",
      "roomNumber": "VIP-01",
      "code": "PS5-VIP-001",
      "type": "ps",
      "version": "ps5",
      "pricePerHour": "75000.00",
      "specs": {
        "storage": "1TB SSD",
        "controllers": 2
      },
      "isAvailable": true,
      "games": [
        {
          "id": "1",
          "name": "God of War Ragnarok",
          "platform": "ps"
        },
        {
          "id": "2",
          "name": "Spider-Man 2",
          "platform": "ps"
        }
      ]
    },
    {
      "id": "2",
      "roomNumber": "VIP-02",
      "code": "PS5-VIP-002",
      "type": "ps",
      "version": "ps5",
      "pricePerHour": "75000.00",
      "specs": {
        "storage": "1TB SSD",
        "controllers": 2
      },
      "isAvailable": false,
      "games": [
        {
          "id": "1",
          "name": "God of War Ragnarok",
          "platform": "ps"
        }
      ]
    }
  ]
}
```

### Response Error (400)

```json
{
  "success": false,
  "message": "Device type dan category ID wajib diisi"
}
```

---

## 5. Get Available Dates

Mendapatkan tanggal yang tersedia untuk booking dengan informasi biaya tambahan advance booking.

### Endpoint

```
GET /booking/branches/:branchId/available-dates
```

### Access

Public

### URL Parameters

- `branchId` (required): ID cabang

### Query Parameters

- `startDate` (required): Tanggal mulai (YYYY-MM-DD)
- `endDate` (required): Tanggal akhir (YYYY-MM-DD)

### Example Request

```
GET /booking/branches/1/available-dates?startDate=2025-12-12&endDate=2025-12-20
```

### Response Success (200)

```json
{
  "success": true,
  "data": [
    {
      "date": "2025-12-12",
      "daysFromToday": 0,
      "advanceBookingFee": 0,
      "isToday": true
    },
    {
      "date": "2025-12-13",
      "daysFromToday": 1,
      "advanceBookingFee": 0,
      "isToday": false
    },
    {
      "date": "2025-12-15",
      "daysFromToday": 3,
      "advanceBookingFee": 10000,
      "isToday": false
    },
    {
      "date": "2025-12-19",
      "daysFromToday": 7,
      "advanceBookingFee": 20000,
      "isToday": false
    }
  ]
}
```

### Response Error (400)

```json
{
  "success": false,
  "message": "Start date dan end date wajib diisi"
}
```

---

## 6. Get Available Times

Mendapatkan jam yang tersedia untuk booking di tanggal tertentu (realtime availability).

### Endpoint

```
GET /booking/branches/:branchId/available-times
```

### Access

Public

### URL Parameters

- `branchId` (required): ID cabang

### Query Parameters

- `deviceId` (required): ID device/ruangan
- `bookingDate` (required): Tanggal booking (YYYY-MM-DD)
- `durationMinutes` (required): Durasi bermain dalam menit

### Example Request

```
GET /booking/branches/1/available-times?deviceId=1&bookingDate=2025-12-15&durationMinutes=120
```

### Response Success (200)

```json
{
  "success": true,
  "data": [
    {
      "time": "09:00",
      "isAvailable": true
    },
    {
      "time": "09:30",
      "isAvailable": true
    },
    {
      "time": "10:00",
      "isAvailable": false
    },
    {
      "time": "10:30",
      "isAvailable": false
    },
    {
      "time": "11:00",
      "isAvailable": false
    },
    {
      "time": "11:30",
      "isAvailable": false
    },
    {
      "time": "12:00",
      "isAvailable": true
    }
  ]
}
```

### Response Error (400)

```json
{
  "success": false,
  "message": "Device ID, booking date, dan duration wajib diisi"
}
```

---

## 7. Calculate Booking Price

Menghitung total harga booking dengan breakdown biaya sebelum checkout.

### Endpoint

```
POST /booking/calculate-price
```

### Access

Public / Authenticated

### Request Body

```json
{
  "branchId": "1",
  "deviceId": "1",
  "categoryId": "2",
  "bookingDate": "2025-12-15",
  "startTime": "14:00",
  "durationMinutes": 120
}
```

### Response Success (200)

```json
{
  "success": true,
  "data": {
    "baseAmount": "150000.00",
    "categoryFee": "50000.00",
    "advanceBookingFee": "20000.00",
    "totalAmount": "220000.00",
    "breakdown": {
      "devicePricePerHour": "75000.00",
      "categoryPricePerHour": "25000.00",
      "durationHours": 2,
      "daysInAdvance": 3
    }
  }
}
```

### Response Error (400)

```json
{
  "success": false,
  "message": "Semua field wajib diisi"
}
```

### Response Error (404)

```json
{
  "success": false,
  "message": "Device tidak ditemukan"
}
```

---

## Booking Flow Summary

1. **User login** (menggunakan `/auth/login`)
2. **Pilih cabang** → `GET /booking/branches`
3. **Pilih device type** (PS, Racing, dll) → `GET /booking/branches/:branchId/device-types`
4. **Pilih versi device** (PS4, PS5, dll) → dari response step 3
5. **Pilih kategori** (Regular, VIP, VVIP) → `GET /booking/branches/:branchId/categories?deviceType=ps&deviceVersion=ps5`
6. **Pilih ruangan dan lihat games** → `GET /booking/branches/:branchId/rooms?deviceType=ps&categoryId=2&deviceVersion=ps5`
7. **Pilih tanggal booking** → `GET /booking/branches/:branchId/available-dates?startDate=2025-12-12&endDate=2025-12-20`
8. **Pilih jam mulai** → `GET /booking/branches/:branchId/available-times?deviceId=1&bookingDate=2025-12-15&durationMinutes=120`
9. **Hitung harga** → `POST /booking/calculate-price`
10. **Create order** → `POST /orders` (dengan data lengkap)
11. **Payment** → `POST /payments`

---

## Notes

### Realtime Availability

Semua endpoint availability (rooms, times) melakukan pengecekan realtime terhadap:

- Status device (active/maintenance/disabled)
- Booking yang sudah ada (pending, paid, checked_in)
- Availability exceptions (maintenance schedule)

### Pricing Structure

- **Base Amount**: Harga device per jam × durasi
- **Category Fee**: Harga kategori per jam × durasi (0 untuk Regular)
- **Advance Booking Fee**: Biaya booking di muka berdasarkan berapa hari sebelumnya × durasi
- **Total Amount**: Base + Category Fee + Advance Booking Fee

### Device Versions

- **PS**: ps4, ps5
- **Racing**: racing_standard, racing_pro
- **VR**: vr_meta, vr_pico
- **PC**: pc_standard, pc_gaming
- **Arcade**: arcade_standard

### Category Tiers

- **regular**: Kategori standar (biasanya fee = 0)
- **vip**: Kategori premium dengan fasilitas lebih
- **vvip**: Kategori eksklusif dengan fasilitas terlengkap
