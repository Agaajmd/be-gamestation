# Game API Documentation

Base URL: `http://localhost:3000`

## Endpoints

### 1. Get All Games

Get list of all games (public endpoint)

**Endpoint:** `GET /games`

**Query Parameters:**

- `platform` (optional): Filter by platform (`ps`, `pc`, `pcvr`, `racing`)

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": "1",
      "name": "God of War Ragnarok",
      "platform": "ps",
      "createdAt": "2024-12-09T10:00:00.000Z"
    }
  ]
}
```

---

### 2. Get Game by ID

Get game details by ID

**Endpoint:** `GET /games/:id`

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "1",
    "name": "God of War Ragnarok",
    "platform": "ps",
    "createdAt": "2024-12-09T10:00:00.000Z"
  }
}
```

---

### 3. Create Game

Create new game (owner/admin only)

**Endpoint:** `POST /games`

**Headers:**

```
Authorization: Bearer <token>
```

**Request Body:**

```json
{
  "name": "God of War Ragnarok",
  "platform": "ps"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Game berhasil ditambahkan",
  "data": {
    "id": "1",
    "name": "God of War Ragnarok",
    "platform": "ps",
    "createdAt": "2024-12-09T10:00:00.000Z"
  }
}
```

---

### 4. Update Game

Update game details (owner/admin only)

**Endpoint:** `PUT /games/:id`

**Headers:**

```
Authorization: Bearer <token>
```

**Request Body:**

```json
{
  "name": "God of War Ragnarok Updated",
  "platform": "ps"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Game berhasil diupdate",
  "data": {
    "id": "1",
    "name": "God of War Ragnarok Updated",
    "platform": "ps",
    "createdAt": "2024-12-09T10:00:00.000Z"
  }
}
```

---

### 5. Delete Game

Delete game (owner only)

**Endpoint:** `DELETE /games/:id`

**Headers:**

```
Authorization: Bearer <token>
```

**Response:**

```json
{
  "success": true,
  "message": "Game berhasil dihapus"
}
```

---

## Platform Options

- `ps` - PlayStation
- `pc` - PC Gaming
- `pcvr` - PC VR
- `racing` - Racing Simulator

## Error Responses

### 400 Bad Request

```json
{
  "success": false,
  "message": "Game dengan nama dan platform yang sama sudah ada"
}
```

### 401 Unauthorized

```json
{
  "success": false,
  "message": "Token tidak ditemukan. Silakan login terlebih dahulu"
}
```

### 403 Forbidden

```json
{
  "success": false,
  "message": "Akses ditolak. Hanya owner yang dapat mengakses"
}
```

### 404 Not Found

```json
{
  "success": false,
  "message": "Game tidak ditemukan"
}
```

### 500 Internal Server Error

```json
{
  "success": false,
  "message": "Terjadi kesalahan saat mengambil data game"
}
```
