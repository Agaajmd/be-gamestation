# Seeder Documentation

## Overview

Seeder digunakan untuk membuat data awal (initial data) ke database, terutama untuk membuat akun Owner.

## Owner Accounts

Seeder akan membuat 2 akun Owner default:

### Owner 1

- **Email**: `owner@psstation.com`
- **Password**: `Owner123!`
- **Fullname**: John Doe
- **Phone**: 08123456789
- **Company**: PS Station Jakarta Pusat
- **Address**: Jl. Sudirman No. 123, Jakarta Pusat
- **Role**: owner

### Owner 2

- **Email**: `owner2@psstation.com`
- **Password**: `Owner123!`
- **Fullname**: Jane Smith
- **Phone**: 08198765432
- **Company**: Gaming Zone Bandung
- **Address**: Jl. Dago No. 45, Bandung
- **Role**: owner

## Cara Menjalankan Seeder

### 1. Reset Database + Seeder (Hapus semua data dan jalankan seeder)

```bash
npm run prisma:migrate -- --reset
```

atau

```bash
npx prisma migrate reset
```

### 2. Jalankan Seeder Saja (Tanpa reset)

```bash
npm run prisma:seed
```

### 3. Generate Prisma Client + Migrate + Seeder

```bash
npm run prisma:migrate
```

## Modifikasi Seeder

Untuk menambah atau mengubah data Owner, edit file `prisma/seed.ts`:

```typescript
// Tambah owner baru
await createOwner({
  email: "owner3@psstation.com",
  password: "Password123!",
  fullname: "New Owner",
  phone: "08111111111",
  companyName: "New Gaming Station",
  address: "New Address",
});
```

## Login sebagai Owner

Setelah seeder berjalan, Anda bisa login menggunakan:

**Endpoint**: `POST /auth/login`

**Request Body**:

```json
{
  "email": "owner@psstation.com",
  "password": "Owner123!"
}
```

**Response**:

```json
{
  "success": true,
  "message": "Login berhasil",
  "data": {
    "user": {
      "id": "1",
      "email": "owner@psstation.com",
      "fullname": "John Doe",
      "role": "owner",
      "phone": "08123456789"
    },
    "owner": {
      "id": "1",
      "companyName": "PS Station Jakarta Pusat",
      "address": "Jl. Sudirman No. 123, Jakarta Pusat"
    },
    "accessToken": "eyJhbGc...",
    "refreshToken": "eyJhbGc..."
  }
}
```

## Role Hierarchy

1. **Owner** (dibuat via seeder)

   - Pemilik bisnis
   - Bisa membuat Branch dan Admin
   - Full access ke semua fitur

2. **Admin** (dibuat oleh Owner)

   - Staff/Manager yang mengelola Branch
   - Access terbatas sesuai Branch

3. **Customer** (register sendiri via `/auth/register`)
   - Pengguna biasa
   - Bisa membuat booking/order

## Security Notes

⚠️ **PENTING**:

- Ganti password default di production
- Ganti `JWT_SECRET` di environment variable
- Jangan commit `.env` file ke repository
- Gunakan password yang kuat untuk Owner account

## Troubleshooting

### Seeder gagal karena email sudah ada

```bash
# Reset database terlebih dahulu
npx prisma migrate reset --force
```

### Error: Cannot find module 'bcrypt'

```bash
npm install bcrypt @types/bcrypt
```

### Error: Prisma Client belum di-generate

```bash
npm run prisma:generate
```
