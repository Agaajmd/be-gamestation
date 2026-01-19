# Game Station API

Platform manajemen game station dengan fitur booking online, payment processing, session tracking, dan multi-branch management.

**Version:** 1.0.0  
**Status:** Production Ready  
**Last Updated:** January 19, 2026

---

## 📋 Overview

Game Station API adalah backend sistem untuk game station yang menyediakan fitur lengkap untuk customer dan business owner:

### Customer Features

- 🔐 Login/Register dengan Email atau OTP
- 📅 Booking device dengan real-time availability
- 💳 Multiple payment methods
- ⏱️ Session tracking dan extension
- ⭐ Review dan rating

### Business Owner Features

- 🏢 Multi-branch management
- 🎮 Device & category management
- 📊 Order & payment tracking
- 👥 Staff management
- 📢 Notification system

---

## 🚀 Quick Start

### Prerequisites

- Node.js v18+
- npm v9+
- PostgreSQL v14+

### Installation

```bash
# Clone repository
git clone <repo-url>
cd game-station

# Install dependencies
npm install

# Setup environment
cp .env.example .env

# Edit .env dengan database configuration Anda
nano .env

# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate dev

# (Optional) Seed database
npm run prisma:seed

# Start development server
npm run dev
```

Server akan berjalan di `http://localhost:3000`

---

## 📚 Documentation

**Semua dokumentasi tersedia di folder [docs/](./docs/)**

### Essential Docs

- **[GETTING_STARTED.md](./docs/GETTING_STARTED.md)** - Setup dan instalasi lengkap
- **[USAGE_GUIDE.md](./docs/USAGE_GUIDE.md)** - Panduan penggunaan dengan contoh flow
- **[API_STANDARD.md](./docs/API_STANDARD.md)** - Standard dokumentasi API

### API Reference

- **[AUTH_API.md](./docs/AUTH_API.md)** - Authentication endpoints
- **[BOOKING_FLOW_API.md](./docs/BOOKING_FLOW_API.md)** - Booking flow endpoints
- **[ORDER_API.md](./docs/ORDER_API.md)** - Order management
- **[PAYMENT_API.md](./docs/PAYMENT_API.md)** - Payment processing
- **[SESSION_API.md](./docs/SESSION_API.md)** - Session management

### Reference Docs

- **[DATABASE_SCHEMA.md](./docs/DATABASE_SCHEMA.md)** - Database structure & relationships
- **[ERROR_HANDLING.md](./docs/ERROR_HANDLING.md)** - Error codes & troubleshooting
- **[docs/README.md](./docs/README.md)** - Complete documentation index

---

## 🛠️ Tech Stack

| Component        | Technology | Version     |
| ---------------- | ---------- | ----------- |
| Runtime          | Node.js    | v18+        |
| Language         | TypeScript | 5.9+        |
| Framework        | Express.js | 5.1+        |
| Database         | PostgreSQL | 14+         |
| ORM              | Prisma     | 7.2+        |
| Authentication   | JWT        | -           |
| Password Hashing | bcrypt     | 5.1+        |
| Validation       | Joi, Zod   | 18.0+, 4.1+ |
| Email            | Nodemailer | 7.0+        |

---

## 📦 Project Structure

```
game-station/
├── src/
│   ├── controller/           # Request handlers
│   ├── service/             # Business logic
│   ├── repository/          # Database queries
│   ├── middleware/          # Express middleware
│   ├── validation/          # Data validation schemas
│   ├── helper/              # Utility functions
│   ├── errors/              # Custom error classes
│   ├── route/               # API routes
│   ├── database/            # Database connection
│   └── index.ts             # Application entry point
├── prisma/
│   ├── schema.prisma        # Database schema
│   ├── seed.ts              # Database seeding
│   └── migrations/          # Migration files
├── docs/                    # API documentation
├── .env                     # Environment variables
├── package.json             # Dependencies
├── tsconfig.json            # TypeScript config
└── README.md                # This file
```

---

## 🔑 Key Features

### Authentication & Authorization

- ✅ Email + Password registration & login
- ✅ OTP-based login (no password needed)
- ✅ JWT token management (access + refresh)
- ✅ Role-based access control (Customer, Admin, Owner)
- ✅ Token refresh mechanism
- ✅ Secure logout

### Booking System

- ✅ Real-time device availability checking
- ✅ Multiple device types (PS, Racing, VR, PC, Arcade)
- ✅ Device categories with pricing (Regular, VIP, VVIP)
- ✅ Dynamic pricing with advance booking discounts
- ✅ Time slot management
- ✅ Duration-based pricing calculation

### Order Management

- ✅ Shopping cart functionality
- ✅ Order creation & tracking
- ✅ Price calculation with breakdown
- ✅ Order history
- ✅ Order cancellation

### Payment Processing

- ✅ Multiple payment methods (E-wallet, Bank Transfer, Credit Card)
- ✅ Payment gateway integration
- ✅ Payment status tracking
- ✅ Refund handling
- ✅ Transaction management

### Session Tracking

- ✅ Check-in/Check-out system
- ✅ Real-time session monitoring
- ✅ Session duration tracking
- ✅ Session extension capability
- ✅ Automatic session timeout

### Business Management

- ✅ Multi-branch support
- ✅ Device & room management
- ✅ Staff management per branch
- ✅ Holiday & closed date management
- ✅ Amenities management
- ✅ Customer reviews & ratings
- ✅ Notification system
- ✅ Subscription plans

---

## 📊 API Endpoints Overview

### Authentication (6 endpoints)

```
POST   /auth/register            - Register new user
POST   /auth/login               - Login dengan email & password
POST   /auth/request-otp         - Request OTP untuk login
POST   /auth/verify-otp          - Verify OTP dan login
POST   /auth/refresh-token       - Refresh access token
POST   /auth/logout              - Logout user
```

### Booking & Orders (16 endpoints)

```
GET    /booking/branches                           - Get all branches
GET    /booking/branches/:id/device-types         - Get device types
GET    /booking/branches/:id/:type/:version       - Get device details
POST   /booking/check-availability                - Check availability
POST   /orders                                    - Create order
GET    /orders                                    - Get user orders
GET    /orders/:id                                - Get order details
GET    /orders/cart                               - Get cart items
PUT    /orders/:id/items/:itemId                  - Update cart item
DELETE /orders/:id/items/:itemId                  - Remove from cart
POST   /orders/:id/checkout                       - Checkout order
```

### Payments (4 endpoints)

```
POST   /payments                 - Create payment
GET    /payments                 - Get payments
GET    /payments/:id             - Get payment details
GET    /payment/methods          - Get available methods
```

### Sessions (4 endpoints)

```
POST   /sessions/check-in        - Check-in
GET    /sessions/active          - Get active session
POST   /sessions/:id/extend      - Extend session
POST   /sessions/:id/check-out   - Check-out
```

### Reviews (3 endpoints)

```
POST   /reviews                  - Create review
GET    /reviews/:branchId        - Get branch reviews
GET    /reviews/order/:orderId   - Get order review
```

---

## 🔐 Security Features

- ✅ JWT token-based authentication
- ✅ Bcrypt password hashing
- ✅ CORS configured
- ✅ Input validation & sanitization
- ✅ Role-based access control
- ✅ Rate limiting ready
- ✅ SQL injection prevention (via Prisma)
- ✅ HTTPS recommended for production

---

## 📝 Available Scripts

```bash
# Development
npm run dev                 # Start with hot-reload (nodemon)

# Build & Production
npm run build              # Compile TypeScript
npm start                  # Run compiled JavaScript

# Database
npm run prisma:generate    # Generate Prisma Client
npm run prisma:migrate     # Run migrations
npm run prisma:studio      # Open Prisma Studio UI
npm run prisma:seed        # Seed database

# Testing
npm test                   # Run tests
```

---

## 🧪 Testing API

### With REST Client (VS Code Extension)

```
Install extension: REST Client by Huachao Mao
Then use the provided test.http file
```

### With cURL

```bash
# Register
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@test.com",
    "password": "Pass123!",
    "fullname": "Test User",
    "phone": "081234567890"
  }'

# Get branches
curl http://localhost:3000/booking/branches
```

### With Postman

1. Import endpoints from API documentation
2. Set up environment variables
3. Test each endpoint

---

## 🚀 Deployment

### Production Checklist

- [ ] Setup .env dengan production values
- [ ] Configure database connection string
- [ ] Setup JWT secrets (use strong random values)
- [ ] Run migrations: `npx prisma migrate deploy`
- [ ] Setup logging (Winston/Pino)
- [ ] Setup error tracking (Sentry)
- [ ] Configure CORS properly
- [ ] Setup rate limiting
- [ ] Enable HTTPS
- [ ] Setup monitoring & alerting
- [ ] Backup database regularly
- [ ] Setup CI/CD pipeline

### Environment Variables

```bash
# Database
DATABASE_URL=postgresql://user:password@host:5432/game_station

# Server
PORT=3000
NODE_ENV=production

# JWT
JWT_SECRET=<strong-random-secret>
JWT_REFRESH_SECRET=<strong-random-secret>
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Email (optional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your@email.com
EMAIL_PASS=app-password

# Application
APP_URL=https://your-domain.com
```

---

## 📞 Support & Contribution

### Report Issues

- Create issue dengan detail lengkap
- Include error message, request, dan response
- Provide steps untuk reproduce

### Contribute

1. Follow API_STANDARD.md
2. Test endpoint thoroughly
3. Update documentation
4. Create pull request

---

## 🎓 Learning Resources

### For New Developers

1. Read [docs/GETTING_STARTED.md](./docs/GETTING_STARTED.md)
2. Read [docs/USAGE_GUIDE.md](./docs/USAGE_GUIDE.md)
3. Read [docs/DATABASE_SCHEMA.md](./docs/DATABASE_SCHEMA.md)
4. Start with simple features
5. Follow [docs/API_STANDARD.md](./docs/API_STANDARD.md) for new features

### Documentation Links

- **Complete API Index:** [docs/README.md](./docs/README.md)
- **API Standard:** [docs/API_STANDARD.md](./docs/API_STANDARD.md)
- **Error Handling:** [docs/ERROR_HANDLING.md](./docs/ERROR_HANDLING.md)
- **Database Schema:** [docs/DATABASE_SCHEMA.md](./docs/DATABASE_SCHEMA.md)

---

## 📅 Version History

| Version | Date         | Status     | Notes                                     |
| ------- | ------------ | ---------- | ----------------------------------------- |
| 1.0.0   | Jan 19, 2026 | Production | Initial release with complete feature set |

---

## 🏆 Best Practices

### Development

- Always test endpoints before committing
- Update documentation with code changes
- Follow TypeScript strict mode
- Use meaningful variable names
- Write clean, readable code
- Comment complex logic

### Security

- Never commit .env file
- Use environment variables for secrets
- Validate all inputs
- Sanitize database queries (Prisma does this)
- Use HTTPS in production
- Rotate secrets regularly

### Performance

- Use database indexes
- Cache frequently accessed data
- Monitor query performance
- Implement pagination
- Use compression
- Monitor API response times

---

## 🔗 Related Files

- **IMPLEMENTATION_SUMMARY.md** - Implementation details
- **BOOKING_FLOW_CHANGES.md** - Recent booking flow changes
- **SETUP.md** - Additional setup instructions
- **test.http** - Sample API requests

---

**Questions?** Read the comprehensive documentation in the [docs/](./docs/) folder or contact the development team.

**Last Updated:** January 19, 2026
