# User Update & Announcement System

## User Update Information

### Endpoint

- **PUT** `/users/:id` - Update user information (email, fullname, phone)

### Flow

1. **Controller**: `src/controller/UserController.ts` → `updateUserInfo()`
2. **Service**: `src/service/UserService/userService.ts` → `updateUserInfoService()`
3. **Repository**: `src/repository/userRepository.ts` → `updateUserInfo()`
4. **Validation**: `src/validation/bodyValidation/userValidation.ts` → `updateUserInfoSchema`
5. **Route**: `src/route/userRoute.ts`
6. **Error Handling**: `src/errors/UserError/userError.ts`

### Fitur

- Update email dengan validasi duplikasi
- Update fullname (3-100 karakter)
- Update phone (8-15 digit)
- Minimal 1 field harus diubah
- Validasi email format dengan Joi
- Validasi nomor telepon dengan regex

### Request Body

```json
{
  "email": "newemail@example.com",
  "fullname": "Nama Lengkap Baru",
  "phone": "+6281234567890"
}
```

### Response

```json
{
  "success": true,
  "message": "Informasi user berhasil diperbarui",
  "data": {
    "id": 1,
    "email": "newemail@example.com",
    "fullname": "Nama Lengkap Baru",
    "phone": "+6281234567890",
    "role": "customer",
    "isVerified": true,
    "createdAt": "2026-02-05T...",
    "updatedAt": "2026-02-05T..."
  }
}
```

---

## Announcement System

### Endpoints

1. **POST** `/announcements` - Create announcement (Admin/Owner only)
2. **GET** `/announcements` - Get all announcements (paginated)
3. **GET** `/announcements/active` - Get active announcements only (public)
4. **GET** `/announcements/:id` - Get specific announcement by ID
5. **PUT** `/announcements/:id` - Update announcement (Admin/Owner only)
6. **DELETE** `/announcements/:id` - Delete announcement (Admin/Owner only)

### Flow

1. **Controller**: `src/controller/AnnouncementController.ts`
2. **Service**: `src/service/AnnouncementService/announcementService.ts`
3. **Repository**: `src/repository/announcementRepository.ts`
4. **Validation**: `src/validation/bodyValidation/announcementValidation.ts`
5. **Route**: `src/route/announcementRoute.ts`
6. **Error Handling**: `src/errors/AnnouncementError/announcementError.ts`

### Fitur

- Create/Read/Update/Delete (CRUD) announcements
- Pagination support untuk GET all
- Filtering active announcements berdasarkan date range
- Filtering by branch (forBranch field)
- Automatic date validation (endDate > startDate)
- Global announcements (forBranch = null) dan branch-specific
- Role-based access control (Admin/Owner only untuk create/update/delete)

### Create Request Body

```json
{
  "title": "Penawaran Spesial",
  "content": "Dapatkan diskon 20% untuk pemesanan hari ini",
  "forBranch": 1,
  "startDate": "2026-02-05T00:00:00Z",
  "endDate": "2026-02-15T23:59:59Z"
}
```

### Update Request Body (partial update)

```json
{
  "title": "Judul Baru",
  "endDate": "2026-02-20T23:59:59Z"
}
```

### GET Announcements Query Parameters

```
GET /announcements?skip=0&take=10&branchId=1
GET /announcements/active?skip=0&take=10&branchId=1
```

### Response Example

```json
{
  "success": true,
  "message": "Daftar announcement berhasil diambil",
  "data": [
    {
      "id": 1,
      "title": "Penawaran Spesial",
      "content": "Dapatkan diskon 20% untuk pemesanan hari ini",
      "forBranch": 1,
      "startDate": "2026-02-05T00:00:00.000Z",
      "endDate": "2026-02-15T23:59:59.000Z",
      "createdAt": "2026-02-05T...",
      "updatedAt": "2026-02-05T..."
    }
  ],
  "pagination": {
    "skip": 0,
    "take": 10,
    "total": 1
  }
}
```

### Error Handling

- `UserNotFoundError` (404) - User tidak ditemukan
- `EmailAlreadyExistsError` (409) - Email sudah terdaftar
- `AnnouncementNotFoundError` (404) - Announcement tidak ditemukan
- `InvalidAnnouncementDateError` (400) - Tanggal tidak valid
- Validation errors dari Joi

### Integration Points

- User routes registered di `/users`
- Announcement routes registered di `/announcements`
- Middleware authentication untuk protected routes
- Role-based middleware (requireOwnerOrAdmin) untuk admin-only routes

---

## Validasi Schema

### User Update Validation

- Email: optional, format email valid
- Fullname: optional, 3-100 karakter
- Phone: optional, 8-15 digit
- **Constraint**: Minimal 1 field harus diisi

### Announcement Create Validation

- Title: required, 3-150 karakter
- Content: required, minimal 10 karakter
- ForBranch: optional, BigInt
- StartDate: required, ISO date format
- EndDate: required, ISO date, must be > startDate

### Announcement Update Validation

- Semua field optional
- **Constraint**: Minimal 1 field harus diubah
- Jika startDate diubah, harus validate terhadap endDate
- Jika endDate diubah, harus validate terhadap startDate
