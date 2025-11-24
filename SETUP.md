# Setup Instructions - Game Station API

## Prerequisites

- Node.js 18+
- PostgreSQL 14+
- npm atau yarn

## Installation Steps

### 1. Install Dependencies

```bash
npm install
```

Dependencies yang terinstall:

- express: Web framework
- @prisma/client: Database ORM
- bcrypt: Password hashing
- jsonwebtoken: JWT authentication
- joi: Input validation
- dotenv: Environment variables
- typescript, ts-node, nodemon: Development tools

### 2. Setup Database

#### Create PostgreSQL Database

```sql
CREATE DATABASE game_station;
```

#### Configure Environment Variables

Copy `.env.example` to `.env` dan update dengan konfigurasi Anda:

```bash
cp .env.example .env
```

Edit `.env`:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/game_station?schema=public"
JWT_SECRET="your-secret-key"
JWT_REFRESH_SECRET="your-refresh-secret-key"
PORT=3000
```

#### Generate Prisma Client

```bash
npx prisma generate
```

#### Run Database Migration

```bash
npx prisma migrate dev --name init
```

Ini akan:

- Membuat semua tabel sesuai schema
- Membuat relasi antar tabel
- Membuat indexes untuk performa

### 3. Start Development Server

```bash
npm run dev
```

Server akan running di `http://localhost:3000`

### 4. Test API

Buka `http://localhost:3000/health` untuk health check.

Gunakan file `test.http` untuk testing endpoints atau tools seperti:

- Postman
- Thunder Client (VS Code extension)
- REST Client (VS Code extension)
- cURL

## Available Scripts

```bash
npm run dev              # Run development server dengan hot reload
npm run build            # Compile TypeScript to JavaScript
npm start                # Run production server
npm run prisma:generate  # Generate Prisma Client
npm run prisma:migrate   # Run database migrations
npm run prisma:studio    # Open Prisma Studio (database GUI)
```

## Project Structure

```
game-station/
├── prisma/
│   └── schema.prisma          # Database schema
├── src/
│   ├── controller/
│   │   └── AuthController.ts  # Auth logic
│   ├── middleware/
│   │   ├── authMiddleware.ts  # JWT verification
│   │   └── validateMiddleware.ts  # Input validation
│   ├── route/
│   │   └── authRoutes.ts      # Auth routes
│   ├── validation/
│   │   └── authValidation.ts  # Joi schemas
│   └── index.ts               # App entry point
├── docs/
│   └── AUTH_API.md            # API documentation
├── generated/
│   └── prisma/                # Generated Prisma Client
├── .env                       # Environment variables
├── .env.example               # Example environment
├── test.http                  # API testing file
├── tsconfig.json              # TypeScript config
├── nodemon.json               # Nodemon config
├── package.json               # Dependencies
└── README.md                  # Main documentation
```

## Quick Test

### 1. Register User

```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "fullname": "Test User"
  }'
```

### 2. Login

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

Save `accessToken` dari response untuk request berikutnya.

### 3. Logout

```bash
curl -X POST http://localhost:3000/auth/logout \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## Database Management

### View Database in Browser

```bash
npm run prisma:studio
```

Opens at `http://localhost:5555`

### Reset Database (Development only!)

```bash
npx prisma migrate reset
```

⚠️ **WARNING**: This will delete all data!

### Create New Migration

After editing `schema.prisma`:

```bash
npx prisma migrate dev --name your_migration_name
```

## Troubleshooting

### Port Already in Use

Change PORT in `.env` file:

```env
PORT=3001
```

### Database Connection Error

1. Check PostgreSQL is running
2. Verify credentials in `.env`
3. Ensure database exists

### Prisma Client Not Generated

```bash
npx prisma generate
```

### TypeScript Errors

```bash
# Clear and reinstall
rm -rf node_modules dist generated
npm install
npx prisma generate
```

## Next Steps

1. ✅ Auth system sudah complete
2. Tambah endpoints untuk:
   - Branch management
   - Device management
   - Package management
   - Order & booking
   - Payment integration
   - Session tracking
3. Implement production features:
   - Redis untuk caching & session
   - Email service untuk OTP
   - Rate limiting
   - CORS configuration
   - API documentation dengan Swagger
   - Unit & integration tests

## Support

Lihat dokumentasi lengkap di:

- `README.md` - Overview & setup
- `docs/AUTH_API.md` - Complete API documentation
- `test.http` - API examples

Happy coding! 🚀
