# Getting Started - Game Station API

Panduan lengkap untuk setup, instalasi, dan menjalankan Game Station API.

## Daftar Isi

1. [Prerequisites](#prerequisites)
2. [Setup Awal](#setup-awal)
3. [Konfigurasi Environment](#konfigurasi-environment)
4. [Database Setup](#database-setup)
5. [Running the Application](#running-the-application)
6. [Verifikasi Setup](#verifikasi-setup)

---

## Prerequisites

Pastikan Anda telah menginstal:

- **Node.js** v18.0.0 atau lebih tinggi
  - Download: https://nodejs.org/
  - Verifikasi: `node --version`

- **npm** v9.0.0 atau lebih tinggi
  - Biasanya tersedia bersama Node.js
  - Verifikasi: `npm --version`

- **PostgreSQL** v14.0 atau lebih tinggi
  - Download: https://www.postgresql.org/download/
  - Verifikasi: `psql --version`
  - Pastikan PostgreSQL service sudah berjalan

- **Git** (untuk clone repository)
  - Download: https://git-scm.com/
  - Verifikasi: `git --version`

---

## Setup Awal

### 1. Clone Repository

```bash
git clone <repository-url>
cd game-station
```

### 2. Install Dependencies

```bash
npm install
```

Ini akan menginstal semua dependencies dari `package.json`:

- **express** - Web framework
- **typescript** - JavaScript superset dengan type safety
- **prisma** - ORM untuk database
- **jsonwebtoken** - JWT authentication
- **bcrypt** - Password hashing
- **joi** - Data validation
- **zod** - Schema validation
- **nodemailer** - Email service
- Dan dependencies lainnya

Verifikasi instalasi:

```bash
npm list
```

---

## Konfigurasi Environment

### 1. Buat File `.env`

Dari root project, buat file `.env`:

```bash
cp .env.example .env
```

Jika tidak ada `.env.example`, buat file baru `.env` dengan isi:

```bash
# Database Configuration
DATABASE_URL=postgresql://username:password@localhost:5432/game_station

# Server Configuration
PORT=3000
NODE_ENV=development

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here_change_in_production
JWT_REFRESH_SECRET=your_super_secret_refresh_key_here_change_in_production
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Email Configuration (untuk OTP)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Application URL
APP_URL=http://localhost:3000
```

### 2. Update Konfigurasi Database

Edit `.env` dan sesuaikan dengan konfigurasi PostgreSQL Anda:

```bash
# Format: postgresql://username:password@hostname:port/database_name
DATABASE_URL=postgresql://postgres:password@localhost:5432/game_station
```

**Opsi konfigurasi:**

- `username`: Username PostgreSQL (default: `postgres`)
- `password`: Password PostgreSQL
- `hostname`: Host PostgreSQL (default: `localhost`)
- `port`: Port PostgreSQL (default: `5432`)
- `database_name`: Nama database (buat manual terlebih dahulu)

### 3. Setup JWT Secret

Untuk production, generate JWT secret yang aman:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Gunakan output tersebut untuk `JWT_SECRET` dan `JWT_REFRESH_SECRET` di `.env`.

---

## Database Setup

### 1. Create Database

Buka PostgreSQL client atau terminal:

```bash
# Menggunakan psql
psql -U postgres

# Dalam psql:
CREATE DATABASE game_station;
```

Atau gunakan GUI seperti pgAdmin atau DBeaver.

### 2. Generate Prisma Client

```bash
npx prisma generate
```

Ini akan generate Prisma Client berdasarkan `schema.prisma`.

### 3. Run Database Migrations

```bash
npx prisma migrate dev
```

Perintah ini akan:

- Membaca existing migrations dari `prisma/migrations/`
- Apply migrations ke database
- Generate Prisma Client

### 4. (Optional) Seed Database

Untuk mengisi data awal ke database:

```bash
npm run prisma:seed
```

Atau jika tidak ada script:

```bash
npx prisma db seed
# atau
ts-node prisma/seed.ts
```

### 5. Verifikasi Database

Gunakan Prisma Studio untuk melihat data:

```bash
npm run prisma:studio
```

Atau dengan perintah langsung:

```bash
npx prisma studio
```

Ini akan membuka browser pada `http://localhost:5555` dengan UI untuk manage database.

---

## Running the Application

### 1. Development Mode (dengan hot-reload)

```bash
npm run dev
```

Aplikasi akan berjalan pada `http://localhost:3000` dan akan auto-reload ketika file berubah.

Server console akan menampilkan:

```
Server running on port 3000
```

### 2. Production Mode

#### Build

```bash
npm run build
```

Ini akan compile TypeScript ke JavaScript di folder `dist/`.

#### Run

```bash
npm start
```

### 3. Custom Configuration

Jika ingin menggunakan port berbeda:

```bash
PORT=8000 npm run dev
```

---

## Verifikasi Setup

### 1. Check Server Health

```bash
curl http://localhost:3000
```

Atau buka di browser: `http://localhost:3000`

### 2. Test Authentication API

Buat file `test.http` atau gunakan Postman, Insomnia, atau REST Client extension:

```http
### Register User
POST http://localhost:3000/auth/register
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "Test123!",
  "fullname": "Test User",
  "phone": "081234567890"
}
```

### 3. Check Database Connection

```bash
# Buka Prisma Studio
npm run prisma:studio

# Atau test dengan Prisma CLI
npx prisma db execute --stdin < query.sql
```

---

## Troubleshooting

### Error: Cannot connect to database

**Penyebab:**

- PostgreSQL tidak running
- Username/password salah
- Database belum dibuat
- Connection string salah

**Solusi:**

```bash
# Verifikasi PostgreSQL running
psql -U postgres -c "SELECT 1"

# Verifikasi DATABASE_URL di .env
cat .env | grep DATABASE_URL

# Buat database baru
createdb game_station
```

### Error: Port 3000 already in use

**Penyebab:**

- Ada aplikasi lain menggunakan port 3000
- Proses sebelumnya masih running

**Solusi:**

```bash
# Gunakan port berbeda
PORT=3001 npm run dev

# Atau kill proses yang menggunakan port 3000
# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux:
lsof -ti:3000 | xargs kill -9
```

### Error: Module not found

**Penyebab:**

- Dependencies belum diinstall
- Cache npm corrupt

**Solusi:**

```bash
# Clear cache dan reinstall
npm cache clean --force
rm node_modules -r
npm install
```

### Error: Prisma Client not generated

**Penyebab:**

- `prisma generate` belum dijalankan
- Schema Prisma error

**Solusi:**

```bash
# Generate ulang
npx prisma generate

# Verifikasi schema
npx prisma validate
```

---

## Development Scripts

Berikut perintah yang tersedia:

```bash
# Development
npm run dev                 # Run dengan hot-reload (nodemon)

# Build
npm run build              # Compile TypeScript ke JavaScript

# Production
npm start                  # Run compiled JavaScript

# Database
npm run prisma:generate    # Generate Prisma Client
npm run prisma:migrate     # Run database migrations
npm run prisma:studio      # Open Prisma Studio UI
npm run prisma:seed        # Seed database dengan data awal

# Testing
npm test                   # Run tests (belum diimplementasikan)
```

---

## Struktur Project

```
game-station/
├── src/
│   ├── controller/         # Request handlers
│   ├── service/           # Business logic
│   ├── repository/        # Database queries
│   ├── middleware/        # Express middleware
│   ├── validation/        # Data validation
│   ├── helper/            # Utility functions
│   ├── errors/            # Error definitions
│   ├── route/             # API routes
│   └── index.ts           # Entry point
├── prisma/
│   ├── schema.prisma      # Database schema
│   ├── seed.ts            # Seed script
│   └── migrations/        # Migration files
├── docs/                  # API documentation
├── .env                   # Environment variables (gitignored)
├── package.json           # Dependencies
├── tsconfig.json          # TypeScript config
└── README.md              # Project README
```

---

## Next Steps

Setelah setup berhasil:

1. **Baca dokumentasi API:** Lihat folder [docs/](../docs/) untuk dokumentasi lengkap semua endpoint
2. **Pelajari Authentication:** Baca [AUTH_API.md](./AUTH_API.md)
3. **Pelajari Booking Flow:** Baca [BOOKING_FLOW_API.md](./BOOKING_FLOW_API.md)
4. **Pelajari Order System:** Baca [ORDER_API.md](./ORDER_API.md)
5. **Database Schema:** Lihat [DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md)

---

## Tips Pengembangan

### 1. Gunakan REST Client Extension

Install extension di VS Code: `REST Client` untuk test API langsung.

Lihat contoh di file [test.http](../test.http).

### 2. Format Code

Pastikan menggunakan TypeScript dan ESLint untuk code quality.

### 3. Database Query

Untuk debugging query, gunakan Prisma Studio:

```bash
npm run prisma:studio
```

### 4. Debug Mode

Untuk advanced debugging:

```bash
# Windows
set DEBUG=* & npm run dev

# Mac/Linux
DEBUG=* npm run dev
```

---

## Production Deployment

Untuk deploy ke production:

1. Build aplikasi: `npm run build`
2. Setup `.env` dengan production values
3. Run migrations: `npx prisma migrate deploy`
4. Start aplikasi: `npm start`
5. Gunakan process manager seperti PM2, systemd, atau Docker

Lihat [DEPLOYMENT.md](./DEPLOYMENT.md) untuk panduan lebih detail.

---

## Kontribusi

Jika ada error atau ingin menambah fitur, silahkan:

1. Create issue di repository
2. Fork dan create branch baru
3. Submit pull request

---

## Support

Jika ada pertanyaan atau masalah, hubungi tim development.

---

**Last Updated:** January 19, 2026
