# Game Station API - Documentation Index

Dokumentasi lengkap untuk Game Station API - Platform manajemen game station dengan fitur booking, payment, dan session tracking.

**Version:** 1.0.0  
**Last Updated:** January 19, 2026

---

## 📚 Daftar Lengkap Dokumentasi

### 🚀 Getting Started (Mulai dari sini!)

| Dokumen                                    | Deskripsi                                                                                |
| ------------------------------------------ | ---------------------------------------------------------------------------------------- |
| [GETTING_STARTED.md](./GETTING_STARTED.md) | Setup project, instalasi dependencies, konfigurasi environment, dan menjalankan aplikasi |
| [API_STANDARD.md](./API_STANDARD.md)       | Standard dan template untuk semua API documentation                                      |

### 📖 User Guides

| Dokumen                                    | Deskripsi                                                                                         |
| ------------------------------------------ | ------------------------------------------------------------------------------------------------- |
| [USAGE_GUIDE.md](./USAGE_GUIDE.md)         | Panduan penggunaan fitur-fitur utama dengan contoh flow lengkap (Auth, Booking, Payment, Session) |
| [DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md) | Dokumentasi struktur database, relasi, tipe data, dan entity relationship diagram                 |
| [ERROR_HANDLING.md](./ERROR_HANDLING.md)   | Panduan error handling, error codes, troubleshooting, dan best practices                          |

### 🔐 Authentication

| Dokumen                      | Deskripsi                                                            |
| ---------------------------- | -------------------------------------------------------------------- |
| [AUTH_API.md](./AUTH_API.md) | Register, Login (Email & Password), Login OTP, Refresh Token, Logout |

### 📅 Booking & Orders

| Dokumen                                      | Deskripsi                                                                    |
| -------------------------------------------- | ---------------------------------------------------------------------------- |
| [BOOKING_FLOW_API.md](./BOOKING_FLOW_API.md) | Get branches, device types, availability check, device details               |
| [ORDER_API.md](./ORDER_API.md)               | Create order, view orders, update order, checkout, order management          |
| [SESSION_API.md](./SESSION_API.md)           | Check-in, check-out, view active session, extend session, session management |

### 💳 Payment

| Dokumen                            | Deskripsi                                                              |
| ---------------------------------- | ---------------------------------------------------------------------- |
| [PAYMENT_API.md](./PAYMENT_API.md) | Create payment, check payment methods, payment status, refund handling |

### ⭐ Reviews & Ratings

| Dokumen                          | Deskripsi                                                   |
| -------------------------------- | ----------------------------------------------------------- |
| [REVIEW_API.md](./REVIEW_API.md) | Submit review, view reviews, rating and feedback management |

### 🏢 Management

| Dokumen                                                  | Deskripsi                                                                 |
| -------------------------------------------------------- | ------------------------------------------------------------------------- |
| [BRANCH_API.md](./BRANCH_API.md)                         | Create/update branch, view branches, branch information, admin management |
| [DEVICE_API.md](./DEVICE_API.md)                         | Manage devices/rooms, device status, device availability, maintenance     |
| [DEVICE_CATEGORY_API.md](./DEVICE_CATEGORY_API.md)       | Create/update categories (Regular/VIP/VVIP), category pricing             |
| [GAME_API.md](./GAME_API.md)                             | Game management, game availability per device                             |
| [HOLIDAY_API.md](./HOLIDAY_API.md)                       | Manage branch holidays, closed dates, special days                        |
| [BRANCH_AMENITIES_GUIDE.md](./BRANCH_AMENITIES_GUIDE.md) | Available amenities, amenities configuration                              |

### 📢 Notifications & Subscriptions

| Dokumen                                      | Deskripsi                                                           |
| -------------------------------------------- | ------------------------------------------------------------------- |
| [NOTIFICATION_API.md](./NOTIFICATION_API.md) | Send notifications, notification channels, notification preferences |
| [SUBSCRIPTION_API.md](./SUBSCRIPTION_API.md) | Subscription plans, subscription management, billing                |

### 🌱 Database & Development

| Dokumen                  | Deskripsi                                          |
| ------------------------ | -------------------------------------------------- |
| [SEEDER.md](./SEEDER.md) | Database seeding, initial data setup, seed scripts |

---

## 🎯 Quick Navigation

### Saya ingin...

**Setup aplikasi baru:**

1. Baca [GETTING_STARTED.md](./GETTING_STARTED.md)
2. Follow langkah demi langkah di file tersebut
3. Jalankan aplikasi: `npm run dev`

**Memahami flow booking:**

1. Baca [USAGE_GUIDE.md](./USAGE_GUIDE.md#booking-flow) - Section Booking Flow
2. Follow contoh dari mulai cek branch hingga checkout
3. Lihat [BOOKING_FLOW_API.md](./BOOKING_FLOW_API.md) untuk detail endpoint

**Integrate authentication:**

1. Baca [AUTH_API.md](./AUTH_API.md)
2. Lihat [USAGE_GUIDE.md](./USAGE_GUIDE.md#authentication-flow) untuk scenario lengkap
3. Lihat [ERROR_HANDLING.md](./ERROR_HANDLING.md#1-authentication-errors-401) untuk handle error

**Memahami struktur database:**

1. Baca [DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md)
2. Lihat Entity Relationship Diagram
3. Explore model details untuk table yang relevan

**Handle error dengan benar:**

1. Baca [ERROR_HANDLING.md](./ERROR_HANDLING.md)
2. Lihat error codes yang relevan dengan endpoint
3. Lihat contoh client-side error handling

**Develop fitur baru:**

1. Lihat [API_STANDARD.md](./API_STANDARD.md) untuk format standard
2. Follow template untuk dokumentasi
3. Pastikan semua field dan error cases ter-document

---

## 📋 Tech Stack

- **Runtime:** Node.js v18+
- **Language:** TypeScript
- **Framework:** Express.js
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Authentication:** JWT (JSON Web Tokens)
- **Password Hashing:** bcrypt
- **Validation:** Joi, Zod
- **Email:** Nodemailer

---

## 🔑 Key Features

### Authentication

- ✅ Register dengan email & password
- ✅ Login dengan email & password
- ✅ Login OTP (tanpa password)
- ✅ Token refresh mechanism
- ✅ Role-based access control (Customer, Admin, Owner)

### Booking System

- ✅ Cek ketersediaan device real-time
- ✅ Multiple device types (PS, Racing, VR, PC, Arcade)
- ✅ Category tiers (Regular, VIP, VVIP)
- ✅ Dynamic pricing
- ✅ Advance booking discounts
- ✅ Time slot management

### Payment

- ✅ Multiple payment methods (E-wallet, Bank Transfer, Credit Card)
- ✅ Payment gateway integration
- ✅ Refund handling
- ✅ Transaction tracking

### Session Management

- ✅ Check-in/Check-out
- ✅ Session tracking
- ✅ Session extension
- ✅ Duration monitoring

### Management Features

- ✅ Multi-branch support
- ✅ Device management
- ✅ Staff management
- ✅ Holiday & closed date management
- ✅ Amenities management
- ✅ Review & rating system

---

## 🚀 Getting Started Steps

### 1. Setup Awal

\`\`\`bash
git clone <repo>
cd game-station
npm install
cp .env.example .env
\`\`\`

### 2. Database Setup

\`\`\`bash

# Update .env dengan database config Anda

# Kemudian:

npx prisma generate
npx prisma migrate dev
npm run prisma:seed # Optional
\`\`\`

### 3. Run Development

\`\`\`bash
npm run dev

# Server akan berjalan di http://localhost:3000

\`\`\`

### 4. Test API

Gunakan REST Client extension di VS Code, atau Postman untuk test endpoint.
Lihat [test.http](../test.http) untuk contoh request.

---

## 💡 Common Tasks

### Test Authentication

Lihat [AUTH_API.md](./AUTH_API.md) dan [USAGE_GUIDE.md#authentication-flow](./USAGE_GUIDE.md#authentication-flow)

### Test Booking Flow

1. Get branches: `GET /booking/branches`
2. Check device types: `GET /booking/branches/:id/device-types`
3. Check availability: `POST /booking/check-availability`
4. Create order: `POST /orders`

### Handle Errors Properly

Lihat [ERROR_HANDLING.md](./ERROR_HANDLING.md) untuk error codes dan client-side handling

### Database Queries

Gunakan Prisma Studio: `npm run prisma:studio`

---

## 📝 Documentation Standards

Semua dokumentasi harus:

- ✅ Mengikuti format di [API_STANDARD.md](./API_STANDARD.md)
- ✅ Include success dan error response examples
- ✅ Include field descriptions
- ✅ Include curl/code examples
- ✅ Link ke related documentation
- ✅ Explain error codes yang mungkin terjadi

---

## 📌 Important Notes

- **Semua timestamps** dalam format ISO 8601: `2026-01-19T10:30:00.000Z`
- **Semua IDs** adalah BigInt (dikirim sebagai string dalam JSON)
- **Semua currency** dalam IDR dengan 2 decimal places
- **Rate limit:** 100 requests per minute per IP
- **Token expiry:** Access token 15 menit, Refresh token 7 hari

---

## 🎓 Learning Path

### Pemula

1. GETTING_STARTED.md
2. USAGE_GUIDE.md
3. AUTH_API.md
4. BOOKING_FLOW_API.md

### Intermediate

1. DATABASE_SCHEMA.md

---

## 📞 Support & Contribution

### Report Issues

Jika menemukan error atau dokumentasi tidak akurat:

1. Create issue di repository
2. Sertakan detail (endpoint, request, response)
3. Sertakan langkah untuk reproduce

### Contribute

Untuk menambah/improve dokumentasi:

1. Follow format di [API_STANDARD.md](./API_STANDARD.md)
2. Test endpoint yang di-document
3. Include examples
4. Submit pull request

---

## 📅 Version & Updates

| Version | Release Date | Changes                                       |
| ------- | ------------ | --------------------------------------------- |
| 1.0.0   | 2026-01-19   | Initial release dengan complete documentation |

---

**Last Updated:** January 19, 2026

---

**Questions?** Baca dokumentasi yang relevan atau hubungi tim development.

### Admin (`admin`)

- Can manage devices in their branch
- Can manage packages in their branch
- Can view and manage orders in their branch
- Can manage sessions in their branch
- Can create notifications
- Limited to single branch access

### Owner (`owner`)

- Full access to all branches they own
- Can create and manage branches
- Can create and manage admins
- Can view all orders, payments, sessions across their branches
- Can manage subscriptions
- Can view analytics and reports

## Common Response Formats

### Success Response

```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

### Error Response

```json
{
  "success": false,
  "message": "Error description"
}
```

### Validation Error

```json
{
  "success": false,
  "errors": [
    {
      "field": "email",
      "message": "Email tidak valid"
    }
  ]
}
```

## HTTP Status Codes

- `200 OK` - Request successful
- `201 Created` - Resource created successfully
- `400 Bad Request` - Invalid request data
- `401 Unauthorized` - Authentication required or failed
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server error

## Data Types & Enums

### Device Types

- `ps` - PlayStation
- `racing` - Racing Simulator
- `vr` - VR Gaming
- `pc` - PC Gaming
- `arcade` - Arcade Machine

### Device Status

- `active` - Device is operational
- `maintenance` - Under maintenance
- `disabled` - Disabled/not available

### Order Status

- `pending` - Order created, awaiting payment
- `paid` - Payment confirmed
- `cancelled` - Order cancelled
- `checked_in` - Customer checked in
- `completed` - Order completed
- `no_show` - Customer didn't show up
- `refunded` - Order refunded

### Payment Status

- `unpaid` - Payment not received
- `paid` - Payment confirmed
- `failed` - Payment failed
- `refund_pending` - Refund in process

### Payment Methods

- `e_wallet` - E-Wallet (GoPay, OVO, Dana, etc.)
- `bank_transfer` - Bank Transfer
- `gateway` - Payment Gateway (Midtrans, Xendit, etc.)

### Session Status

- `running` - Session active
- `stopped` - Session ended

### Notification Channels

- `push` - Push notification
- `email` - Email
- `sms` - SMS

### Subscription Status

- `active` - Active subscription
- `expired` - Expired
- `cancelled` - Cancelled

## Typical Order Flow

1. **Customer browses**
   - `GET /branches` - View available branches
   - `GET /branches/:id/packages` - View packages
   - `GET /branches/:id/devices` - View available devices
   - `GET /games` - View game catalog

2. **Customer creates order**
   - `POST /orders` - Create order with items
   - Order status: `pending`, Payment status: `unpaid`

3. **Customer makes payment**
   - `POST /payments` - Create payment record
   - Payment status: `pending`

4. **Admin confirms payment**
   - `PUT /payments/:id` - Update payment to `paid`
   - Order automatically updated to `paid` status

5. **Customer arrives (Check-in)**
   - `POST /sessions` - Admin starts session
   - Order status: `checked_in`
   - Session status: `running`

6. **Session ends**
   - `PUT /sessions/:id` - Admin stops session
   - Order status: `completed`
   - Session status: `stopped`

7. **Customer leaves review**
   - `POST /reviews` - Customer creates review
   - Rating: 1-5 stars with optional comment

## Rate Limiting

- Currently no rate limiting implemented
- Consider implementing rate limiting in production

## CORS

- Configure CORS settings based on your frontend domain
- Currently accepts all origins in development

## Database

- PostgreSQL database
- Prisma ORM
- BigInt for all ID fields
- Timestamps in ISO 8601 format

## Notes

- All datetime fields use ISO 8601 format
- All ID fields are BigInt but serialized as strings in JSON responses
- Prices use Decimal type with 2 decimal places
- File uploads not yet implemented (future feature)

## Support

For issues or questions, contact the development team.

---

**Last Updated:** December 9, 2025
**Version:** 1.0.0
