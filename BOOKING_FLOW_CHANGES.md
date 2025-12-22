# Booking Flow Implementation - Change Summary

## 📅 Date: December 12, 2025

## 🎯 Overview

Implementasi lengkap flow booking customer dari pemilihan cabang hingga checkout dengan sistem kategori device, pricing breakdown, dan real-time availability checking.

---

## 🗄️ Database Changes (Prisma Schema)

### New Models

#### 1. DeviceCategory

Kategori device (Regular, VIP, VVIP) per branch dengan pricing dan amenities sendiri.

```prisma
model DeviceCategory {
  id           BigInt       @id @default(autoincrement())
  branchId     BigInt
  name         String       @db.VarChar(50)
  tier         CategoryTier // regular, vip, vvip
  deviceType   DeviceType
  description  String?
  pricePerHour Decimal
  amenities    Json?
  isActive     Boolean

  // Relations
  branch  Branch
  devices Device[]
  games   GameAvailability[]
}
```

#### 2. GameAvailability

Relasi game dengan kategori device (game tersedia untuk kategori tertentu).

```prisma
model GameAvailability {
  id         BigInt
  gameId     BigInt
  categoryId BigInt

  // Relations
  game     Game
  category DeviceCategory
}
```

#### 3. AdvanceBookingPrice

Biaya tambahan untuk booking di muka (berapa hari sebelumnya).

```prisma
model AdvanceBookingPrice {
  id            BigInt
  branchId      BigInt
  daysInAdvance Int
  additionalFee Decimal

  // Relations
  branch Branch
}
```

### New Enums

```prisma
enum DeviceVersion {
  ps4
  ps5
  racing_standard
  racing_pro
  vr_meta
  vr_pico
  pc_standard
  pc_gaming
  arcade_standard
}

enum CategoryTier {
  regular
  vip
  vvip
}
```

### Modified Models

#### Device

Ditambahkan field:

- `categoryId`: Relasi ke DeviceCategory
- `roomNumber`: Nomor ruangan (unique per branch)
- `version`: Versi device (ps4/ps5, dll)
- `pricePerHour`: Harga per jam

#### Order

Ditambahkan field pricing breakdown:

- `baseAmount`: Harga dasar device
- `categoryFee`: Biaya kategori
- `advanceBookingFee`: Biaya booking di muka
- `totalAmount`: Total (sebelumnya sudah ada)

#### Branch

Ditambahkan relasi:

- `deviceCategories`: Kategori device di branch
- `advanceBookingPrices`: Setting harga advance booking

#### Game

Ditambahkan relasi:

- `gameAvailability`: Game tersedia di kategori mana

---

## 🔧 Backend Changes

### New Controllers

#### 1. DeviceCategoryController.ts

Mengelola kategori device:

- `addDeviceCategory()` - POST /branches/:id/device-categories
- `getDeviceCategories()` - GET /branches/:id/device-categories
- `updateDeviceCategory()` - PUT /branches/:branchId/device-categories/:categoryId
- `deleteDeviceCategory()` - DELETE /branches/:branchId/device-categories/:categoryId

#### 2. BookingFlowController.ts

Mengelola flow booking customer:

- `getBranches()` - GET /booking/branches
- `getAvailableDeviceTypes()` - GET /booking/branches/:branchId/device-types
- `getAvailableCategories()` - GET /booking/branches/:branchId/categories
- `getAvailableRooms()` - GET /booking/branches/:branchId/rooms
- `getAvailableDates()` - GET /booking/branches/:branchId/available-dates
- `getAvailableTimes()` - GET /booking/branches/:branchId/available-times
- `calculateBookingPrice()` - POST /booking/calculate-price

### Updated Controllers

#### DeviceController.ts

- `addDevice()` - Updated untuk support categoryId, roomNumber, version, pricePerHour
- `updateDevice()` - Updated untuk support field baru

#### OrderController.ts

- `createOrder()` - Complete rewrite untuk support:
  - Single device booking (tidak lagi array items)
  - Pricing breakdown (baseAmount, categoryFee, advanceBookingFee)
  - Category selection
  - Game selection

### New Validations

#### deviceCategoryValidation.ts

- `addDeviceCategorySchema`
- `updateDeviceCategorySchema`

#### bookingValidation.ts

- `calculateBookingPriceSchema`

### Updated Validations

#### deviceValidation.ts

- Updated untuk include: roomNumber, version, categoryId, pricePerHour

#### orderValidation.ts

- Updated dari array items menjadi single device booking

### New Routes

#### bookingRoutes.ts

Routes untuk booking flow (semua public):

```typescript
GET  /booking/branches
GET  /booking/branches/:branchId/device-types
GET  /booking/branches/:branchId/categories
GET  /booking/branches/:branchId/rooms
GET  /booking/branches/:branchId/available-dates
GET  /booking/branches/:branchId/available-times
POST /booking/calculate-price
```

### Updated Routes

#### deviceRoutes.ts

Ditambahkan routes untuk device category:

```typescript
POST   /branches/:id/device-categories
GET    /branches/:id/device-categories
PUT    /branches/:branchId/device-categories/:categoryId
DELETE /branches/:branchId/device-categories/:categoryId
```

#### index.ts

Ditambahkan:

```typescript
app.use("/booking", bookingRoutes);
```

---

## 📚 Documentation Changes

### New Documentation Files

1. **BOOKING_FLOW_API.md** - Complete booking flow guide

   - 7 endpoint dokumentasi lengkap
   - Flow summary
   - Pricing structure explanation
   - Real-time availability notes

2. **DEVICE_CATEGORY_API.md** - Device category management
   - CRUD operations
   - Category tier guidelines
   - Use cases dan examples
   - Pricing strategy

### Updated Documentation Files

1. **DEVICE_API.md**

   - Updated request/response untuk field baru
   - Added device version information
   - Added category and room number

2. **ORDER_API.md**

   - Updated create order structure
   - Added pricing breakdown explanation
   - Removed array items, now single device

3. **README.md**
   - Added booking flow section
   - Updated module list
   - Added change indicators (🆕 New, ⚡ Updated)

---

## 🎯 Booking Flow Summary

### Step-by-Step User Journey

1. **User Login** → `/auth/login`
2. **Pilih Cabang** → `GET /booking/branches`
3. **Pilih Device Type** → `GET /booking/branches/:branchId/device-types`
   - PS, Racing, VR, PC, Arcade
4. **Pilih Versi Device** → dari response step 3
   - PS4, PS5, Racing Standard/Pro, dll
5. **Pilih Kategori** → `GET /booking/branches/:branchId/categories?deviceType=ps&deviceVersion=ps5`
   - Regular (biaya +0)
   - VIP (biaya +Rp 25.000/jam)
   - VVIP (biaya +Rp 50.000/jam)
6. **Pilih Ruangan & Lihat Games** → `GET /booking/branches/:branchId/rooms?deviceType=ps&categoryId=2`
   - List ruangan available/not available (realtime)
   - List games tersedia untuk kategori tersebut
7. **Pilih Tanggal** → `GET /booking/branches/:branchId/available-dates?startDate=...&endDate=...`
   - Lihat biaya advance booking (jika booking beberapa hari ke depan)
8. **Pilih Jam Mulai** → `GET /booking/branches/:branchId/available-times?deviceId=1&bookingDate=...`
   - Slot jam 30 menit interval
   - Status available/not available (realtime)
9. **Hitung Harga** → `POST /booking/calculate-price`
   - Breakdown: base amount + category fee + advance booking fee
10. **Create Order** → `POST /orders`
11. **Payment** → `POST /payments`

---

## 💰 Pricing Structure

### Formula

```
Total = (Device Price/Hour + Category Price/Hour) × Hours + (Advance Booking Fee/Hour × Hours)
```

### Example

- Device: PS5 = Rp 75.000/jam
- Category: VIP = Rp 25.000/jam
- Duration: 2 jam
- Booking 3 hari di muka = Rp 10.000/jam

**Calculation:**

```
Base Amount          = 75.000 × 2 = Rp 150.000
Category Fee         = 25.000 × 2 = Rp  50.000
Advance Booking Fee  = 10.000 × 2 = Rp  20.000
─────────────────────────────────────────────
Total Amount                      = Rp 220.000
```

---

## 🔄 Real-time Availability

### Checks Performed

1. **Device Status**

   - active ✅
   - maintenance ❌
   - disabled ❌

2. **Existing Bookings**

   - Check overlapping time slots
   - Status: pending, paid, checked_in

3. **Availability Exceptions**
   - Scheduled maintenance
   - Special closures

### Endpoints with Real-time Check

- `/booking/branches/:branchId/rooms` - Device availability
- `/booking/branches/:branchId/available-times` - Time slot availability

---

## 🗃️ Migration

### Migration File

```
prisma/migrations/20251212080028_add_device_categories_and_booking_flow/migration.sql
```

### Affected Tables

- ✅ Created: `device_categories`
- ✅ Created: `game_availability`
- ✅ Created: `advance_booking_prices`
- ✅ Modified: `devices` (added categoryId, roomNumber, version, pricePerHour)
- ✅ Modified: `orders` (added baseAmount, categoryFee, advanceBookingFee)

### Running Migration

```bash
npx prisma migrate dev
npx prisma generate
```

---

## 🧪 Testing Endpoints

### Quick Test Flow

```bash
# 1. Get branches
GET http://localhost:3000/booking/branches

# 2. Get device types for branch 1
GET http://localhost:3000/booking/branches/1/device-types

# 3. Get categories for PS
GET http://localhost:3000/booking/branches/1/categories?deviceType=ps

# 4. Get rooms
GET http://localhost:3000/booking/branches/1/rooms?deviceType=ps&categoryId=2

# 5. Get available dates
GET http://localhost:3000/booking/branches/1/available-dates?startDate=2025-12-12&endDate=2025-12-20

# 6. Get available times
GET http://localhost:3000/booking/branches/1/available-times?deviceId=1&bookingDate=2025-12-15&durationMinutes=120

# 7. Calculate price
POST http://localhost:3000/booking/calculate-price
{
  "branchId": "1",
  "deviceId": "1",
  "categoryId": "2",
  "bookingDate": "2025-12-15",
  "startTime": "14:00",
  "durationMinutes": 120
}

# 8. Create order
POST http://localhost:3000/orders
Authorization: Bearer <token>
{
  "branchId": "1",
  "deviceId": "1",
  "categoryId": "2",
  "packageId": "1",
  "gameId": "5",
  "bookingStart": "2025-12-15T14:00:00.000Z",
  "bookingEnd": "2025-12-15T16:00:00.000Z",
  "paymentMethod": "e_wallet"
}
```

---

## 📝 Notes for Developers

### Seeding Data

Untuk testing, perlu seed data:

1. Device Categories (Regular, VIP, VVIP) untuk setiap branch
2. Advance Booking Prices (contoh: 3 hari = +10k, 7 hari = +20k)
3. Devices dengan categoryId, roomNumber, version, pricePerHour
4. Game Availability (link games ke categories)

### Future Enhancements

1. **Package Discount**: Implement diskon untuk package tertentu
2. **Peak Hours Pricing**: Harga berbeda untuk jam ramai
3. **Membership Tier**: Diskon untuk member setia
4. **Group Booking**: Booking multiple rooms sekaligus
5. **Waitlist**: Jika fully booked, customer bisa join waitlist

### Performance Considerations

1. **Caching**: Consider caching untuk:

   - Branch list (jarang berubah)
   - Device categories (jarang berubah)
   - Game availability (jarang berubah)

2. **Indexing**: Sudah ada index untuk:

   - `devices` pada (branchId, type, status)
   - `device_categories` pada (branchId, deviceType)
   - `orders` pada (branchId, bookingStart)

3. **Real-time**: Availability check bisa di-optimize dengan:
   - Redis cache untuk active bookings
   - WebSocket untuk real-time updates

---

## ✅ Completion Checklist

- [x] Update Prisma schema
- [x] Create and run migration
- [x] Generate Prisma client
- [x] Create DeviceCategoryController
- [x] Create BookingFlowController
- [x] Update DeviceController
- [x] Update OrderController
- [x] Create device category validations
- [x] Create booking validations
- [x] Update device validations
- [x] Update order validations
- [x] Create bookingRoutes
- [x] Update deviceRoutes
- [x] Update index.ts
- [x] Create BOOKING_FLOW_API.md
- [x] Create DEVICE_CATEGORY_API.md
- [x] Update DEVICE_API.md
- [x] Update ORDER_API.md
- [x] Update README.md

---

## 🚀 Deployment Notes

Before deploying to production:

1. Review all pricing configurations
2. Test booking flow end-to-end
3. Verify real-time availability accuracy
4. Test payment integration
5. Set up monitoring for booking endpoints
6. Configure rate limiting for public booking endpoints
7. Backup database before migration

---

**Implementation Date**: December 12, 2025  
**Developer**: GitHub Copilot  
**Status**: ✅ Complete
