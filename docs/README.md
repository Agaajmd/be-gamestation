# Game Station API - Complete Documentation

Complete REST API documentation for Game Station management system.

## Base URL

```
http://localhost:3000
```

## Authentication

Most endpoints require authentication using JWT Bearer token:

```
Authorization: Bearer <your_jwt_token>
```

## 🆕 New Booking Flow (December 2025)

The system now supports a complete customer booking flow with:

- Device categories (Regular, VIP, VVIP) with different pricing
- Device versions (PS4/PS5, Racing Standard/Pro, etc.)
- Room number system for each device
- Real-time availability checking
- Advance booking with additional fees
- Detailed pricing breakdown (base price + category fee + advance booking fee)

See [Booking Flow API](BOOKING_FLOW_API.md) for complete guide.

## Available API Modules

### 1. [Authentication API](AUTH_API.md)

User registration, login, and profile management

- Register new user
- Login
- Get current user profile
- Update profile
- Change password

### 2. [Branch API](BRANCH_API.md)

Branch management for owners and admins

- Create branch
- Get branches
- Get branch by ID
- Update branch
- Delete branch

### 3. [Device API](DEVICE_API.md) ⚡ Updated

Device management within branches (now with categories, versions, and room numbers)

- Create device (with category, version, room number, price per hour)
- Get devices
- Get device by ID
- Update device
- Delete device

### 3.1 [Device Category API](DEVICE_CATEGORY_API.md) 🆕 New

Manage device categories (Regular, VIP, VVIP) per branch

- Create device category
- Get categories by branch
- Update category
- Delete category

### 4. [Booking Flow API](BOOKING_FLOW_API.md) 🆕 New

Complete customer booking flow from branch selection to checkout

- Get all branches
- Get available device types
- Get available categories
- Get available rooms (with real-time status)
- Get available dates (with advance booking fees)
- Get available times (real-time slots)
- Calculate booking price (with breakdown)

### 5. [Package API](PACKAGE_API.md)

Package/pricing management

- Create package
- Get packages
- Get package by ID
- Update package
- Delete package

### 6. [Game API](GAME_API.md)

Game catalog management

- Create game
- Get games (public)
- Get game by ID
- Update game
- Delete game

### 7. [Order API](ORDER_API.md) ⚡ Updated

Customer order and booking management (now with pricing breakdown)

- Create order (single device with category selection)
- Get orders
- Get order by ID
- Update order status
- Update payment status
- Cancel order

### 8. [Payment API](PAYMENT_API.md)

Payment processing and tracking

- Create payment
- Get payments
- Get payment by ID
- Update payment status

### 8. [Session API](SESSION_API.md)

Gaming session management

- Start session
- Get sessions
- Get session by ID
- Stop session

### 9. [Review API](REVIEW_API.md)

Customer review and rating system

- Create review
- Get reviews
- Get review by ID
- Update review
- Delete review

### 10. [Notification API](NOTIFICATION_API.md)

Notification management system

- Create notification
- Get notifications
- Get notification by ID
- Update notification status
- Delete notification

### 11. [Subscription API](SUBSCRIPTION_API.md)

Owner subscription management

- Create subscription
- Get subscriptions
- Get active subscription
- Get subscription by ID
- Update subscription
- Delete subscription

### 12. Admin Management

Admin/staff management within branches

- Create admin
- Get admins
- Get admin by ID
- Update admin
- Delete admin

## User Roles

### Customer (`customer`)

- Can create orders
- Can view own orders, payments, sessions
- Can create and manage reviews
- Can view own notifications
- Can view available branches, devices, packages, games

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
