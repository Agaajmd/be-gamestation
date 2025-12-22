# Branch Amenities/Facilities Feature

## Overview

Untuk menampilkan fasilitas branch seperti VIP Room, PS5, Racing Simulator, dll ketika customer melihat list branch.

## Implementation Plan

### Option 1: Add `amenities` Field to Branch Model (RECOMMENDED) ✅

Tambahkan field JSON array di model Branch untuk menyimpan list fasilitas.

#### 1. Update Prisma Schema

```prisma
model Branch {
  id        BigInt    @id @default(autoincrement())
  ownerId   BigInt    @map("owner_id")
  name      String    @db.VarChar(120)
  address   String?   @db.Text
  phone     String?   @db.VarChar(20)
  timezone  String    @default("Asia/Jakarta") @db.VarChar(50)
  openTime  DateTime? @map("open_time") @db.Time(6)
  closeTime DateTime? @map("close_time") @db.Time(6)
  amenities Json?     @default("[]")  // 👈 ADD THIS
  createdAt DateTime  @default(now()) @map("created_at") @db.Timestamp(6)
  updatedAt DateTime? @updatedAt @map("updated_at") @db.Timestamp(6)

  // ... relations
}
```

#### 2. Run Migration

```bash
npx prisma migrate dev --name add_amenities_to_branch
```

#### 3. Update Branch Validation

File: `src/validation/branchValidation.ts`

```typescript
export const createBranchSchema = z.object({
  name: z.string().min(1).max(120),
  address: z.string().optional(),
  phone: z.string().max(20).optional(),
  timezone: z.string().max(50).optional(),
  openTime: z
    .string()
    .regex(/^\d{2}:\d{2}(:\d{2})?$/)
    .optional(),
  closeTime: z
    .string()
    .regex(/^\d{2}:\d{2}(:\d{2})?$/)
    .optional(),
  amenities: z.array(z.string()).optional(), // 👈 ADD THIS
});

export const updateBranchSchema = z.object({
  // ... existing fields
  amenities: z.array(z.string()).optional(), // 👈 ADD THIS
});
```

#### 4. Update BranchController

File: `src/controller/BranchController.ts`

##### Create Branch:

```typescript
export const createBranch = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, address, phone, timezone, openTime, closeTime, amenities } = req.body;

    // ... existing validation ...

    const branch = await prisma.branch.create({
      data: {
        ownerId: owner.id,
        name,
        address,
        phone,
        timezone: timezone || "Asia/Jakarta",
        openTime: parsedOpenTime,
        closeTime: parsedCloseTime,
        amenities: amenities || [], // 👈 ADD THIS
      },
    });

    // ... rest of code
  }
};
```

##### Get Branches (for Customer):

```typescript
export const getBranches = async (req: Request, res: Response): Promise<void> => {
  try {
    const userRole = req.user?.role;

    if (userRole === "customer" || !userRole) {
      // Public endpoint for customers
      branches = await prisma.branch.findMany({
        select: {
          id: true,
          name: true,
          address: true,
          phone: true,
          timezone: true,
          openTime: true,
          closeTime: true,
          amenities: true, // 👈 Include amenities
          _count: {
            select: {
              devices: true,
              packages: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    }

    // ... rest of code
  }
};
```

#### 5. Update Branch Documentation

Add amenities example to `docs/BRANCH_API.md`

---

## Usage Examples

### Creating Branch with Amenities

```json
POST /branches
Authorization: Bearer <owner_token>

{
  "name": "GameStation Senayan",
  "address": "Jl. Senayan No. 123, Jakarta",
  "phone": "021-12345678",
  "openTime": "10:00:00",
  "closeTime": "23:00:00",
  "amenities": [
    "VIP Room",
    "PS5 Gaming",
    "PS4 Gaming",
    "Racing Simulator",
    "VR Room",
    "PC Gaming Arena",
    "High-Speed WiFi",
    "Air Conditioning",
    "Parking Area",
    "Cafe & Snacks",
    "Streaming Setup",
    "Tournament Area"
  ]
}
```

### Customer Viewing Branches

```json
GET /branches

Response:
{
  "success": true,
  "data": [
    {
      "id": "1",
      "name": "GameStation Senayan",
      "address": "Jl. Senayan No. 123, Jakarta",
      "phone": "021-12345678",
      "openTime": "10:00:00",
      "closeTime": "23:00:00",
      "amenities": [
        "VIP Room",
        "PS5 Gaming",
        "PS4 Gaming",
        "Racing Simulator",
        "VR Room",
        "PC Gaming Arena",
        "High-Speed WiFi",
        "Air Conditioning",
        "Parking Area",
        "Cafe & Snacks"
      ],
      "_count": {
        "devices": 15,
        "packages": 8
      }
    }
  ]
}
```

---

## Common Amenities List

### Gaming Facilities

- ✅ PS5 Gaming Pods
- ✅ PS4 Gaming Stations
- ✅ PC Gaming Arena
- ✅ VR Gaming Room
- ✅ Racing Simulator
- ✅ Arcade Machines
- ✅ Nintendo Switch
- ✅ Xbox Series X/S

### Room Types

- ✅ VIP Private Rooms
- ✅ Party Rooms (4-8 people)
- ✅ Tournament Arena
- ✅ Streaming Studios
- ✅ Open Gaming Area

### Comfort & Facilities

- ✅ High-Speed WiFi
- ✅ Air Conditioning
- ✅ Comfortable Gaming Chairs
- ✅ Premium Audio System
- ✅ Large Screens/Projectors
- ✅ Charging Stations

### Additional Services

- ✅ Cafe & Beverages
- ✅ Snacks & Food
- ✅ Parking Area
- ✅ 24/7 Security
- ✅ Clean Restrooms
- ✅ Customer Lounge

### Technical

- ✅ Streaming Equipment
- ✅ Professional Gaming Peripherals
- ✅ Discord Voice Chat
- ✅ Multiple Monitor Setup
- ✅ RGB Lighting

---

## Alternative Option 2: Derive from Devices

Instead of storing amenities separately, derive them from available devices:

```typescript
// In BranchController
const branch = await prisma.branch.findUnique({
  where: { id: branchId },
  include: {
    devices: {
      where: { status: "active" },
      select: { type: true },
    },
  },
});

// Transform devices to amenities
const deviceTypes = [...new Set(branch.devices.map((d) => d.type))];
const amenityMap = {
  ps: "PlayStation Gaming",
  pc: "PC Gaming Arena",
  vr: "VR Gaming Room",
  racing: "Racing Simulator",
  arcade: "Arcade Games",
};

const amenities = deviceTypes.map((type) => amenityMap[type]);
```

**Pros**:

- ✅ Always accurate (based on actual devices)
- ✅ No manual update needed

**Cons**:

- ❌ Limited to device-based amenities
- ❌ Cannot add non-device amenities (WiFi, Cafe, etc.)

---

## Recommendation

**Use Option 1 (amenities field)** because:

1. ✅ More flexible - can add any type of facility
2. ✅ Better UX - shows complete picture of branch
3. ✅ Marketing friendly - highlight unique features
4. ✅ Can complement device information
5. ✅ Easy to update and maintain

---

## Migration Steps

1. **Update schema.prisma**

   ```bash
   # Add amenities field to Branch model
   ```

2. **Create migration**

   ```bash
   npx prisma migrate dev --name add_amenities_to_branch
   ```

3. **Update validation schemas**

   ```bash
   # Update branchValidation.ts
   ```

4. **Update controllers**

   ```bash
   # Update BranchController.ts
   ```

5. **Update documentation**

   ```bash
   # Update BRANCH_API.md
   ```

6. **Test endpoints**
   ```bash
   # Test create/update/get branch with amenities
   ```

---

## Frontend Display Ideas

### Branch Card

```tsx
<BranchCard>
  <h3>{branch.name}</h3>
  <p>{branch.address}</p>

  <div className="amenities">
    <h4>Fasilitas:</h4>
    <div className="amenity-tags">
      {branch.amenities.map((amenity) => (
        <span className="tag">{amenity}</span>
      ))}
    </div>
  </div>

  <div className="stats">
    <span>{branch._count.devices} Devices</span>
    <span>{branch._count.packages} Packages</span>
  </div>
</BranchCard>
```

### Filter by Amenities

```tsx
<FilterBar>
  <MultiSelect
    label="Fasilitas"
    options={[
      "VIP Room",
      "PS5 Gaming",
      "VR Room",
      "Racing Simulator",
      "WiFi",
      "Cafe",
      "Parking",
    ]}
    onChange={(selected) => filterBranches(selected)}
  />
</FilterBar>
```

---

**Status**: Ready to implement! Just need to run migration and update the code.
