# Security & Validation Setup Guide

## 📦 Installation

### Step 1: Install New Dependencies

```bash
npm install helmet express-rate-limit express-validator xss
```

**Package Versions:**

```json
{
  "helmet": "^7.1.0",
  "express-rate-limit": "^7.1.5",
  "express-validator": "^7.0.0",
  "xss": "^1.0.14"
}
```

### Step 2: Configure Environment Variables

1. Copy the example file:

```bash
cp .env.example .env
```

2. Edit `.env` with your configuration:

```env
# Required - Generate strong secrets
JWT_SECRET="your-secret-key-minimum-32-characters-long"
JWT_REFRESH_SECRET="your-refresh-secret-key-minimum-32-characters-long"

# Database
DATABASE_URL="postgresql://user:password@localhost:5432/game_station"

# Email
EMAIL_USER="your-email@gmail.com"
EMAIL_PASSWORD="your-app-password"
EMAIL_HOST="smtp.gmail.com"

# Server
PORT=3000
NODE_ENV="development"
```

### Step 3: Generate Strong JWT Secrets

Use OpenSSL to generate cryptographically secure secrets:

```bash
# For JWT_SECRET
openssl rand -base64 32

# For JWT_REFRESH_SECRET
openssl rand -base64 32
```

Or use Node.js:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## ✅ Verification Steps

### 1. Verify Environment Variables

Start the server and check for validation messages:

```bash
npm run dev
```

You should see:

```
🔍 Validating environment variables...
✅ Environment variables validated successfully
🔑 Initializing default API keys...
```

### 2. Test Security Headers

Use curl to check security headers:

```bash
curl -i http://localhost:3000/health
```

Look for headers like:

```
X-Content-Type-Options: nosniff
X-XSS-Protection: 1; mode=block
X-Frame-Options: DENY
Content-Security-Policy: ...
```

### 3. Test Rate Limiting

Make multiple requests to trigger rate limiting:

```bash
for i in {1..10}; do
  curl -X POST http://localhost:3000/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"test@test.com","password":"test"}'
done
```

After 5 attempts, you should see a 429 Too Many Requests response.

### 4. Test Input Sanitization

Try sending XSS payload:

```bash
curl "http://localhost:3000/users?search=<script>alert('xss')</script>"
```

The script tags should be escaped to `&lt;script&gt;`.

---

## 🔐 Integrating Security into Controllers

### Example: Secure Registration Controller

```typescript
import { Request, Response } from "express";
import { validatePasswordPolicy } from "../validation/passwordPolicy";
import { sanitizeEmail, sanitizeString } from "../helper/inputSanitizer";
import { hashPassword } from "../helper/password";

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, fullname } = req.body;

    // 1. Sanitize inputs
    const sanitizedEmail = sanitizeEmail(email);
    const sanitizedName = sanitizeString(fullname);

    if (!sanitizedEmail) {
      res.status(400).json({
        success: false,
        message: "Invalid email format",
      });
      return;
    }

    // 2. Validate password strength
    const passwordValidation = validatePasswordPolicy(password);
    if (!passwordValidation.isValid) {
      res.status(400).json({
        success: false,
        message: "Password does not meet security requirements",
        errors: passwordValidation.errors,
      });
      return;
    }

    // 3. Hash password
    const hashedPassword = await hashPassword(password);

    // 4. Create user in database
    const user = await createUserInDatabase({
      email: sanitizedEmail,
      password: hashedPassword,
      fullname: sanitizedName,
    });

    res.status(201).json({
      success: true,
      message: "Registration successful",
      data: { userId: user.id },
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({
      success: false,
      message: "Registration failed",
    });
  }
};
```

### Example: Secure File Upload

```typescript
import { Request, Response } from "express";
import { sanitizeFileUpload } from "../helper/inputSanitizer";
import { uploadRateLimiter } from "../middleware/rateLimiter";

// Apply rate limiter to upload route
router.post(
  "/upload",
  uploadRateLimiter,
  async (req: Request, res: Response) => {
    try {
      const file = req.file;

      if (!file) {
        res.status(400).json({
          success: false,
          message: "No file provided",
        });
        return;
      }

      // Sanitize file upload
      const validation = sanitizeFileUpload(file.originalname, file.mimetype, [
        "image/jpeg",
        "image/png",
        "image/webp",
      ]);

      if (!validation.isValid) {
        res.status(400).json({
          success: false,
          message: validation.error,
        });
        return;
      }

      // Proceed with file upload
      const savedPath = await saveFile(file, validation.sanitizedFilename);

      res.status(200).json({
        success: true,
        message: "File uploaded successfully",
        data: { path: savedPath },
      });
    } catch (error) {
      console.error("Upload error:", error);
      res.status(500).json({
        success: false,
        message: "Upload failed",
      });
    }
  },
);
```

---

## 🔑 Using API Keys for Cron Jobs

### Step 1: Generate API Keys at Startup

The system automatically generates default API keys on first startup. Check logs for:

```
🔑 Initializing default API keys...
📌 Cron Jobs API Key: Your-Key-Here
📌 Notification Service API Key: Your-Key-Here
```

**Save these keys securely!** They're only shown once.

### Step 2: Protect Cron Routes

```typescript
// src/route/cronRoutes.ts
import { Router } from "express";
import { apiKeyAuthMiddleware } from "../helper/apiKeyManager";

const router = Router();

// All cron routes are protected with API key auth
router.use(apiKeyAuthMiddleware);

router.post("/job-name", async (req, res) => {
  // Protected endpoint
});

export default router;
```

### Step 3: Call Cron Jobs with API Key

From your scheduled job service:

```bash
curl -X POST http://localhost:3000/api/cron/job-name \
  -H "X-API-Key: your-saved-api-key" \
  -H "Content-Type: application/json" \
  -d '{...}'
```

Or from Node.js:

```typescript
const response = await fetch("http://localhost:3000/api/cron/job-name", {
  method: "POST",
  headers: {
    "X-API-Key": process.env.CRON_API_KEY,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ ... }),
});
```

---

## 📊 Security Configuration Overview

All security settings are centralized in `src/config/securityConfig.ts`:

```typescript
{
  password: { minLength: 8, require: [uppercase, lowercase, numbers, special] },
  jwt: { accessTokenExpiry: "15m", refreshTokenExpiry: "7d" },
  rateLimiting: { auth: [15m, 5 attempts], api: [15m, 100 requests] },
  fileUpload: { maxFileSize: 5MB, allowedTypes: [jpeg, png, webp] },
  cors: { origins: "localhost:3001,localhost:3000", methods: [GET, POST, ...] },
}
```

---

## 🚨 Common Issues & Solutions

### Issue: "JWT_SECRET must be defined"

**Solution:** Check that JWT_SECRET is set in `.env` and is at least 32 characters.

### Issue: Rate limit blocking legitimate users

**Solution:** Adjust rate limit values in `src/middleware/rateLimiter.ts` based on expected usage.

### Issue: CORS errors for production domain

**Solution:** Set `CORS_ORIGINS` environment variable:

```env
CORS_ORIGINS="https://yourdomain.com,https://www.yourdomain.com"
```

### Issue: "Invalid or inactive API key"

**Solution:** Make sure you're using the correct API key and include it in header:

```
X-API-Key: your-api-key
```

---

## 📋 Pre-Deployment Checklist

- [ ] All packages installed successfully
- [ ] Environment variables configured
- [ ] JWT secrets are strong (32+ chars) and different
- [ ] Database URL points to production database
- [ ] EMAIL credentials configured
- [ ] NODE_ENV set to "production"
- [ ] CORS_ORIGINS set to specific domains
- [ ] Rate limiting values appropriate
- [ ] Security headers verified
- [ ] API keys generated and saved securely
- [ ] Error logs configured
- [ ] Backup strategy in place
- [ ] Monitoring enabled
- [ ] HTTPS/SSL configured

---

## 📚 Related Documentation

- [Security & Validation Guide](./SECURITY_VALIDATION_GUIDE.md)
- [API Standard](./API_STANDARD.md)
- [Database Schema](./DATABASE_SCHEMA.md)

---

Last Updated: February 9, 2026
