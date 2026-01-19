# Database Schema - Game Station API

Dokumentasi lengkap struktur database, relasi, dan tipe data.

## Daftar Isi

1. [Entity Relationship Diagram](#entity-relationship-diagram)
2. [Models & Tables](#models--tables)
3. [Enums](#enums)
4. [Indexing & Performance](#indexing--performance)
5. [Relationships](#relationships)

---

## Entity Relationship Diagram

```
┌──────────────┐
│    User      │
├──────────────┤
│ id (PK)      │
│ email        │
│ password     │
│ fullname     │
│ role         │ ─────┬─────────────────────────┐
│ phone        │      │                         │
│ createdAt    │      │                         │
└──────────────┘      │                         │
       │              │                         │
       │              ▼                         ▼
       │          ┌────────┐            ┌──────────┐
       │          │ Owner  │            │  Admin   │
       │          └────────┘            └──────────┘
       │              │                      │
       │              ▼                      ▼
       │          ┌────────────┐        ┌─────────┐
       │          │  Branch    │◄───────│ Category│
       │          └────────────┘        └─────────┘
       │              │
       │              ▼
       │        ┌──────────────────┐
       │        │  roomAndDevice   │
       │        │ (PS5 Room, etc)  │
       │        └──────────────────┘
       │              │
       ├──────────────┤
       │              │
       ▼              ▼
    ┌──────┐    ┌──────────┐
    │Order │────│ OrderItem│
    └──────┘    └──────────┘
       │              │
       ├──────────────┘
       │
       ├──────────┬──────────┬─────────────┐
       │          │          │             │
       ▼          ▼          ▼             ▼
    ┌─────────┐ ┌───────┐ ┌────────┐ ┌─────────┐
    │ Payment │ │Session│ │ Review │ │ Booking │
    └─────────┘ └───────┘ └────────┘ └─────────┘
```

---

## Models & Tables

### 1. User (users)

Tabel untuk menyimpan informasi user (customer, admin, owner).

**Columns:**
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | BigInt | PK, Auto-increment | Unique user identifier |
| `email` | VarChar(255) | UNIQUE, NOT NULL | Email address |
| `passwordHash` | VarChar(255) | NULLABLE | Hashed password |
| `fullname` | VarChar(100) | NOT NULL | Full name |
| `role` | Enum | NOT NULL | customer, admin, owner |
| `phone` | VarChar(20) | NULLABLE | Phone number |
| `createdAt` | Timestamp | NOT NULL | Creation timestamp |
| `updatedAt` | Timestamp | NULLABLE | Last update timestamp |

**Indexes:**

- `idx_users_email` - Email lookup

**Relations:**

- One-to-One: `Owner`
- One-to-Many: `Order`, `Notification`, `AuditLog`, `Review`
- One-to-One: `Admin`

---

### 2. Owner (owners)

Tabel untuk menyimpan informasi pemilik bisnis game station.

**Columns:**
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | BigInt | PK, Auto-increment | Unique owner identifier |
| `userId` | BigInt | FK, UNIQUE | Reference to User |
| `companyName` | VarChar(150) | NOT NULL | Nama perusahaan |
| `createdAt` | Timestamp | NOT NULL | Creation timestamp |
| `updatedAt` | Timestamp | NULLABLE | Last update timestamp |

**Relations:**

- One-to-One: `User`
- One-to-Many: `Branch`, `Subscription`

---

### 3. Branch (branches)

Tabel untuk menyimpan informasi cabang game station.

**Columns:**
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | BigInt | PK, Auto-increment | Unique branch identifier |
| `ownerId` | BigInt | FK | Reference to Owner |
| `name` | VarChar(120) | NOT NULL | Nama cabang |
| `address` | Text | NULLABLE | Alamat cabang |
| `phone` | VarChar(20) | NULLABLE | Nomor telepon |
| `timezone` | VarChar(50) | DEFAULT 'Asia/Jakarta' | Timezone |
| `openTime` | Time | NULLABLE | Jam buka |
| `closeTime` | Time | NULLABLE | Jam tutup |
| `amenities` | JSON | DEFAULT '[]' | Fasilitas (wifi, parking, cafe, etc) |
| `createdAt` | Timestamp | NOT NULL | Creation timestamp |
| `updatedAt` | Timestamp | NULLABLE | Last update timestamp |

**Indexes:**

- `idx_branches_owner` - Owner lookup

**Relations:**

- Many-to-One: `Owner`
- One-to-Many: `Admin`, `Category`, `roomAndDevice`, `Order`, `AdvanceBookingPrice`, `BranchHoliday`

**Example:**

```json
{
  "id": 1,
  "ownerId": 1,
  "name": "Game Station Jakarta Pusat",
  "address": "Jl. Sudirman No. 123",
  "phone": "021-12345678",
  "timezone": "Asia/Jakarta",
  "openTime": "09:00:00",
  "closeTime": "23:00:00",
  "amenities": ["wifi", "parking", "cafe", "toilet"]
}
```

---

### 4. Category (categories)

Tabel untuk kategori ruangan (Regular, VIP, VVIP).

**Columns:**
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | BigInt | PK, Auto-increment | Unique category identifier |
| `branchId` | BigInt | FK | Reference to Branch |
| `name` | VarChar(50) | NOT NULL | Nama kategori |
| `description` | Text | NULLABLE | Deskripsi kategori |
| `tier` | Enum | NOT NULL | regular, vip, vvip |
| `pricePerHour` | Decimal(12,2) | NOT NULL | Harga per jam |
| `amenities` | JSON | DEFAULT '[]' | Amenities tambahan |
| `createdAt` | Timestamp | NOT NULL | Creation timestamp |
| `updatedAt` | Timestamp | NULLABLE | Last update timestamp |

**Constraints:**

- UNIQUE: (name, tier) per branch

**Relations:**

- Many-to-One: `Branch`
- One-to-Many: `roomAndDevice`

**Example:**

```json
{
  "id": 1,
  "branchId": 1,
  "name": "VIP",
  "tier": "vip",
  "pricePerHour": "25000.00",
  "amenities": ["ac", "sofa", "mini_bar"],
  "description": "Ruangan dengan AC dan sofa nyaman"
}
```

---

### 5. roomAndDevice (room_and_devices)

Tabel untuk menyimpan ruangan dan device (PS5, Racing, VR, dll).

**Columns:**
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | BigInt | PK, Auto-increment | Unique device identifier |
| `branchId` | BigInt | FK | Reference to Branch |
| `categoryId` | BigInt | FK, NULLABLE | Reference to Category |
| `name` | VarChar(50) | NOT NULL | Nama ruangan (PS5 Room 1) |
| `deviceType` | Enum | NOT NULL | ps, racing, vr, pc, arcade |
| `version` | Enum | NULLABLE | ps4, ps5, racing_pro, vr_meta, etc |
| `pricePerHour` | Decimal(12,2) | NOT NULL | Harga per jam |
| `roomNumber` | VarChar(20) | NULLABLE | Nomor ruangan |
| `status` | Enum | DEFAULT 'available' | available, maintenance, in_use |
| `createdAt` | Timestamp | NOT NULL | Creation timestamp |
| `updatedAt` | Timestamp | NULLABLE | Last update timestamp |

**Constraints:**

- UNIQUE: (categoryId, name, deviceType)

**Indexes:**

- `idx_device_category_branch_type` - Search optimization

**Relations:**

- Many-to-One: `Branch`, `Category`
- One-to-Many: `GameAvailability`, `OrderItem`, `AvailabilityException`, `Session`

---

### 6. AdvanceBookingPrice (advance_booking_prices)

Tabel untuk fee booking di muka (early bird pricing).

**Columns:**
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | BigInt | PK, Auto-increment | Unique identifier |
| `branchId` | BigInt | FK | Reference to Branch |
| `daysInAdvance` | Int | NOT NULL | Jumlah hari sebelumnya |
| `additionalFee` | Decimal(12,2) | NOT NULL | Biaya tambahan (Rp) |
| `createdAt` | Timestamp | NOT NULL | Creation timestamp |

**Constraints:**

- UNIQUE: (branchId, daysInAdvance)

**Example:**

```json
{
  "branchId": 1,
  "daysInAdvance": 7,
  "additionalFee": "20000.00" // Booking 7 hari sebelumnya: +Rp20.000
}
```

---

### 7. Game (games)

Tabel untuk master data game.

**Columns:**
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | BigInt | PK, Auto-increment | Unique game identifier |
| `name` | VarChar(100) | NOT NULL | Nama game |
| `deviceType` | Enum | NULLABLE | Tipe device (ps, vr, etc) |
| `createdAt` | Timestamp | NOT NULL | Creation timestamp |

**Relations:**

- One-to-Many: `GameAvailability`

---

### 8. GameAvailability (game_availability)

Tabel untuk ketersediaan game di room tertentu.

**Columns:**
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | BigInt | PK, Auto-increment | Unique identifier |
| `gameId` | BigInt | FK | Reference to Game |
| `roomAndDeviceId` | BigInt | FK | Reference to roomAndDevice |
| `createdAt` | Timestamp | NOT NULL | Creation timestamp |

**Constraints:**

- UNIQUE: (gameId, roomAndDeviceId)

---

### 9. Order (orders)

Tabel untuk menyimpan order/booking customer.

**Columns:**
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | BigInt | PK, Auto-increment | Unique order identifier |
| `orderCode` | VarChar(32) | UNIQUE | Kode order (ORD-ABC123) |
| `customerId` | BigInt | FK | Reference to User |
| `branchId` | BigInt | FK | Reference to Branch |
| `status` | Enum | NOT NULL | pending, paid, cancelled, checked_in, completed, cart, refunded |
| `totalAmount` | Decimal(12,2) | NOT NULL | Total harga |
| `paymentMethod` | VarChar(50) | NULLABLE | e_wallet, bank_transfer, gateway |
| `paymentStatus` | Enum | NOT NULL | unpaid, paid, failed, refund_pending |
| `notes` | Text | NULLABLE | Catatan tambahan |
| `createdAt` | Timestamp | NOT NULL | Creation timestamp |
| `updatedAt` | Timestamp | NULLABLE | Last update timestamp |

**Indexes:**

- `idx_orders_customer` - Customer lookup
- `idx_orders_branch_booking` - Branch lookup

**Relations:**

- Many-to-One: `User`, `Branch`
- One-to-Many: `OrderItem`
- One-to-One: `Payment`, `Session`, `Review`

---

### 10. OrderItem (order_items)

Tabel untuk detail item dalam order (bisa multiple items per order).

**Columns:**
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | BigInt | PK, Auto-increment | Unique item identifier |
| `orderId` | BigInt | FK | Reference to Order |
| `roomAndDeviceId` | BigInt | FK | Reference to roomAndDevice |
| `bookingStart` | Timestamp | NOT NULL | Waktu mulai booking |
| `bookingEnd` | Timestamp | NOT NULL | Waktu selesai booking |
| `durationMinutes` | Int | NOT NULL | Durasi dalam menit |
| `price` | Decimal(12,2) | NOT NULL | Total harga item |
| `baseAmount` | Decimal(12,2) | NOT NULL | Harga dasar (device) |
| `categoryFee` | Decimal(12,2) | DEFAULT 0 | Fee kategori (VIP, VVIP) |
| `advanceBookingFee` | Decimal(12,2) | DEFAULT 0 | Fee booking advance |
| `createdAt` | Timestamp | NOT NULL | Creation timestamp |

**Relations:**

- Many-to-One: `Order`, `roomAndDevice`

**Example:**

```json
{
  "id": 1,
  "orderId": 1,
  "roomAndDeviceId": 101,
  "bookingStart": "2026-01-25T14:00:00Z",
  "bookingEnd": "2026-01-25T16:00:00Z",
  "durationMinutes": 120,
  "baseAmount": "150000.00",
  "categoryFee": "50000.00",
  "advanceBookingFee": "20000.00",
  "price": "220000.00"
}
```

---

### 11. Payment (payments)

Tabel untuk menyimpan detail pembayaran.

**Columns:**
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | BigInt | PK, Auto-increment | Unique payment identifier |
| `orderId` | BigInt | FK, UNIQUE | Reference to Order |
| `amount` | Decimal(12,2) | NOT NULL | Jumlah pembayaran |
| `method` | Enum | NOT NULL | e_wallet, bank_transfer, gateway |
| `provider` | VarChar(50) | NULLABLE | OVO, GoPay, DANA, BCA, dll |
| `status` | Enum | NOT NULL | pending, paid, failed, refunded |
| `transactionId` | VarChar(255) | NULLABLE | ID transaksi dari payment gateway |
| `paidAt` | Timestamp | NULLABLE | Waktu pembayaran selesai |
| `metadata` | JSON | NULLABLE | Data tambahan (receipt, dll) |

**Relations:**

- One-to-One: `Order`

---

### 12. Session (sessions)

Tabel untuk menyimpan session bermain customer.

**Columns:**
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | BigInt | PK, Auto-increment | Unique session identifier |
| `orderId` | BigInt | FK, UNIQUE | Reference to Order |
| `roomAndDeviceId` | BigInt | FK | Reference to roomAndDevice |
| `startedAt` | Timestamp | NOT NULL | Waktu mulai session |
| `endedAt` | Timestamp | NULLABLE | Waktu selesai session |
| `status` | Enum | NOT NULL | running, stopped |

**Relations:**

- One-to-One: `Order`
- Many-to-One: `roomAndDevice`

---

### 13. Review (reviews)

Tabel untuk menyimpan review dan rating dari customer.

**Columns:**
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | BigInt | PK, Auto-increment | Unique review identifier |
| `orderId` | BigInt | FK, UNIQUE | Reference to Order |
| `customerId` | BigInt | FK | Reference to User |
| `rating` | SmallInt | NOT NULL | Rating 1-5 |
| `comment` | Text | NULLABLE | Komentar review |
| `createdAt` | Timestamp | NOT NULL | Creation timestamp |

**Constraints:**

- Rating range: 1-5

---

### 14. Admin (admins)

Tabel untuk menyimpan informasi admin per branch.

**Columns:**
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | BigInt | PK, Auto-increment | Unique admin identifier |
| `userId` | BigInt | FK, UNIQUE | Reference to User |
| `branchId` | BigInt | FK | Reference to Branch |
| `role` | Enum | NOT NULL | staff, manager |

**Relations:**

- One-to-One: `User`
- Many-to-One: `Branch`

---

### 15. Notification (notifications)

Tabel untuk menyimpan notifikasi ke customer.

**Columns:**
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | BigInt | PK, Auto-increment | Unique notification identifier |
| `userId` | BigInt | FK | Reference to User |
| `type` | VarChar(50) | NOT NULL | booking_confirmed, payment_received, dll |
| `channel` | Enum | NOT NULL | push, email, sms |
| `payload` | JSON | NOT NULL | Data notifikasi |
| `status` | Enum | NOT NULL | pending, sent, failed |
| `sentAt` | Timestamp | NULLABLE | Waktu pengiriman |

---

### 16. AvailabilityException (availability_exceptions)

Tabel untuk exception availability (maintenance, special event, dll).

**Columns:**
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | BigInt | PK, Auto-increment | Unique identifier |
| `roomAndDeviceId` | BigInt | FK | Reference to roomAndDevice |
| `startAt` | Timestamp | NOT NULL | Waktu mulai exception |
| `endAt` | Timestamp | NOT NULL | Waktu selesai exception |
| `reason` | VarChar(255) | NULLABLE | Alasan (maintenance, event, dll) |

---

### 17. BranchHoliday (branch_holidays)

Tabel untuk hari libur per branch.

**Columns:**
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | BigInt | PK, Auto-increment | Unique identifier |
| `branchId` | BigInt | FK | Reference to Branch |
| `date` | Date | NOT NULL | Tanggal libur |
| `name` | VarChar(100) | NOT NULL | Nama hari libur |
| `description` | Text | NULLABLE | Deskripsi |
| `createdAt` | Timestamp | NOT NULL | Creation timestamp |

**Constraints:**

- UNIQUE: (branchId, date)

---

### 18. Subscription (subscriptions)

Tabel untuk subscription owner.

**Columns:**
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | BigInt | PK, Auto-increment | Unique identifier |
| `ownerId` | BigInt | FK | Reference to Owner |
| `plan` | VarChar(50) | NOT NULL | basic, premium, enterprise |
| `price` | Decimal(12,2) | NOT NULL | Harga subscription |
| `startsAt` | Timestamp | NOT NULL | Tanggal mulai |
| `endsAt` | Timestamp | NOT NULL | Tanggal berakhir |
| `status` | Enum | NOT NULL | active, expired, cancelled |

---

### 19. AuditLog (audit_logs)

Tabel untuk audit trail.

**Columns:**
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | BigInt | PK, Auto-increment | Unique identifier |
| `userId` | BigInt | FK, NULLABLE | Reference to User |
| `action` | VarChar(100) | NOT NULL | create, update, delete |
| `entity` | VarChar(100) | NOT NULL | Order, User, Branch, dll |
| `entityId` | BigInt | NULLABLE | ID entity yang di-modify |
| `meta` | JSON | NULLABLE | Data tambahan |
| `createdAt` | Timestamp | NOT NULL | Creation timestamp |

---

## Enums

### UserRole

```
- customer: User pelanggan
- admin: Admin branch
- owner: Pemilik bisnis
```

### DeviceType

```
- ps: PlayStation
- racing: Racing arcade
- vr: Virtual Reality
- pc: Personal Computer
- arcade: Arcade tradisional
```

### DeviceVersion

```
PlayStation: ps4, ps5
Racing: racing_standard, racing_pro
VR: vr_meta, vr_pico
PC: pc_standard, pc_gaming
Arcade: arcade_standard
```

### CategoryTier

```
- regular: Ruangan standar
- vip: VIP (AC, sofa, dll)
- vvip: Very VIP (premium, mini bar, dll)
```

### OrderStatus

```
- cart: Item di keranjang
- pending: Order created, waiting payment
- paid: Pembayaran berhasil
- cancelled: Order dibatalkan
- checked_in: Customer sudah check-in
- completed: Session selesai
- refunded: Pembayaran di-refund
```

### PaymentStatus

```
- unpaid: Belum dibayar
- paid: Sudah dibayar
- failed: Pembayaran gagal
- refund_pending: Menunggu refund
```

### PaymentMethod

```
- e_wallet: OVO, GoPay, DANA
- bank_transfer: Transfer bank
- gateway: Credit card via payment gateway
```

---

## Indexing & Performance

**Recommended Indexes:**

```sql
-- User queries
CREATE INDEX idx_users_email ON users(email);

-- Branch queries
CREATE INDEX idx_branches_owner ON branches(owner_id);

-- Order queries
CREATE INDEX idx_orders_customer ON orders(customer_id);
CREATE INDEX idx_orders_branch_booking ON orders(branch_id, created_at);

-- Device search
CREATE INDEX idx_device_category_branch_type ON room_and_devices(category_id, device_type);

-- Performance optimization
CREATE INDEX idx_order_items_booking_time ON order_items(booking_start, booking_end);
```

---

## Data Type Conventions

| Tipe      | PostgreSQL    | Prisma   | Kegunaan                    |
| --------- | ------------- | -------- | --------------------------- |
| ID        | BIGINT        | BigInt   | Auto-increment ID           |
| Currency  | DECIMAL(12,2) | Decimal  | Harga (Rp dengan 2 decimal) |
| Text      | VARCHAR       | String   | Teks pendek                 |
| Long Text | TEXT          | String   | Teks panjang                |
| Date/Time | TIMESTAMP(6)  | DateTime | Timestamps                  |
| Time Only | TIME(6)       | DateTime | Jam (open/close time)       |
| Date Only | DATE          | DateTime | Tanggal (holiday)           |
| Boolean   | BOOLEAN       | Boolean  | True/False                  |
| JSON      | JSON          | Json     | Flexible data               |
| Enum      | Predefined    | Enum     | Fixed values                |

---

**Last Updated:** January 19, 2026
