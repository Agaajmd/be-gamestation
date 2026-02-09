# Security & Validation Implementation Guide

## Overview

This document outlines the security features and validation mechanisms implemented in the Game Station API to ensure production-ready security standards.

---

## 🛡️ Security Features Implemented

### 1. **Environment Variable Validation** (`src/config/envValidator.ts`)

Validates all required environment variables on startup and ensures they meet security standards.

**Features:**

- ✅ Required variable checking (DATABASE_URL, JWT secrets, email config)
- ✅ JWT secret length validation (minimum 32 characters)
- ✅ Ensures JWT_SECRET and JWT_REFRESH_SECRET are different
- ✅ PostgreSQL DATABASE_URL format validation
- ✅ Valid port number range checking (1-65535)
- ✅ NODE_ENV validation (development, production, test)

**Required Environment Variables:**

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/game_station?schema=public"

# JWT
JWT_SECRET="your-secret-key-minimum-32-characters-long"
JWT_REFRESH_SECRET="your-refresh-secret-key-minimum-32-characters-long"
JWT_ACCESS_EXPIRES_IN="15m"
JWT_REFRESH_EXPIRES_IN="7d"

# Email
EMAIL_USER="your-email@gmail.com"
EMAIL_PASSWORD="your-app-password"
EMAIL_HOST="smtp.gmail.com"

# Server
PORT=3000
NODE_ENV="production"

# Optional
API_KEY_SALT="game-station-api-key"
CORS_ORIGINS="https://yourdomain.com,https://www.yourdomain.com"
```

---

### 2. **Password Policy Validation** (`src/validation/passwordPolicy.ts`)

Enforces strong password requirements to prevent weak passwords.

**Password Requirements:**

- ✅ Minimum 8 characters
- ✅ At least one uppercase letter (A-Z)
- ✅ At least one lowercase letter (a-z)
- ✅ At least one number (0-9)
- ✅ At least one special character (!@#$%^&\*)
- ✅ No common weak passwords
- ✅ No common character patterns (repetition, sequences)

**Password Strength Scoring:**

- **Weak**: Score < 60
- **Medium**: Score 60-80
- **Strong**: Score > 80

**Usage in Controllers:**

```typescript
import {
  validatePasswordPolicy,
  getPasswordRequirements,
} from "../validation/passwordPolicy";

// In your registration or password change controller
const validation = validatePasswordPolicy(userPassword);

if (!validation.isValid) {
  return res.status(400).json({
    success: false,
    message: "Password does not meet requirements",
    errors: validation.errors,
    passwordRequirements: getPasswordRequirements(),
  });
}
```

---

### 3. **Input Sanitization** (`src/helper/inputSanitizer.ts`)

Protects against XSS, SQL injection, and other input-based attacks.

**Functions Available:**

#### `sanitizeString(input: string): string`

- Removes/escapes potentially dangerous characters
- Escapes `<` and `>` to prevent XSS
- Limits string length to 1000 characters

#### `sanitizeEmail(email: string): string`

- Normalizes email to lowercase
- Validates email format
- Enforces email length limits (max 254 characters)

#### `sanitizeNumber(input: any, min?, max?): number | null`

- Validates numeric input
- Enforces minimum and maximum values
- Returns null if validation fails

#### `sanitizeFileUpload(filename, mimetype, allowedMimetypes): validation`

- Validates MIME type against whitelist
- Prevents path traversal attacks
- Sanitizes filename characters
- Enforces file extension requirement

#### `sanitizeObject(obj: any): any`

- Recursively sanitizes all string values in objects
- Preserves object structure

#### `sanitizeQueryParams(query: Record<string, any>): Record<string, any>`

- Sanitizes URL query parameters
- Limits key length to 50 characters
- Filters array values

**Usage in Middleware:**

```typescript
// Already integrated in app.use middleware:
app.use((req: Request, res: Response, next: any) => {
  req.query = sanitizeQueryParams(req.query as Record<string, any>);
  next();
});
```

---

### 4. **Rate Limiting** (`src/middleware/rateLimiter.ts`)

Protects API endpoints from brute force and DDoS attacks.

**Predefined Rate Limiters:**

| Endpoint Type          | Window | Max Requests | Purpose                     |
| ---------------------- | ------ | ------------ | --------------------------- |
| **Auth**               | 15 min | 5            | Login/Register attempts     |
| **General API**        | 15 min | 100          | Normal API requests         |
| **Password Reset**     | 1 hour | 3            | Password reset attempts     |
| **Email Verification** | 10 min | 5            | Email verification attempts |
| **File Upload**        | 1 hour | 50           | Upload operations           |

**Applied to Routes:**

```typescript
// Already integrated in src/index.ts
app.use("/auth", authRateLimiter, authRoutes);
app.use(apiRateLimiter); // General API rate limit
```

**Response Headers:**

- `X-RateLimit-Limit`: Maximum requests allowed
- `X-RateLimit-Remaining`: Requests remaining
- `X-RateLimit-Reset`: When the limit resets

---

### 5. **Security Headers** (`src/middleware/securityHeaders.ts`)

Sets HTTP headers to protect against common attacks.

**Headers Set:**

| Header                        | Value                           | Purpose                                     |
| ----------------------------- | ------------------------------- | ------------------------------------------- |
| **X-Content-Type-Options**    | nosniff                         | Prevent MIME type sniffing                  |
| **X-XSS-Protection**          | 1; mode=block                   | XSS protection (older browsers)             |
| **X-Frame-Options**           | DENY                            | Prevent clickjacking                        |
| **Referrer-Policy**           | strict-origin-when-cross-origin | Control referrer info sharing               |
| **Permissions-Policy**        | camera=(), microphone=()...     | Restrict browser features                   |
| **Content-Security-Policy**   | Multiple restrictions           | Prevent inline scripts and unsafe execution |
| **Strict-Transport-Security** | max-age=31536000...             | Force HTTPS (production only)               |

---

### 6. **CORS Configuration** (`src/middleware/securityHeaders.ts`)

Configures Cross-Origin Resource Sharing securely.

**Default Allowed Origins:**

- `http://localhost:3001` (local dev)
- `http://localhost:3000` (local dev)

**To Allow Production Domains:**
Set environment variable:

```env
CORS_ORIGINS="https://yourdomain.com,https://www.yourdomain.com"
```

**Allowed Methods:** GET, POST, PUT, DELETE, PATCH, OPTIONS

**Allowed Headers:** Content-Type, Authorization, X-API-Key

---

### 7. **API Key Management** (`src/helper/apiKeyManager.ts`)

Protects internal APIs and scheduled jobs with API keys.

**Key Features:**

- Generate secure API keys (256-bit random)
- Hash and verify keys
- Track key usage with last-used timestamps
- Activate/deactivate keys
- In-memory store (consider Redis for production)

**Usage for Cron Jobs:**

```typescript
// In src/route/cronRoutes.ts
import { apiKeyAuthMiddleware } from "../helper/apiKeyManager";

router.post("/job-name", apiKeyAuthMiddleware, asyncHandler(your - controller));
```

**Making Requests with API Key:**

```bash
curl -X POST http://localhost:3000/api/cron/job-name \
  -H "X-API-Key: your-api-key-here" \
  -H "Content-Type: application/json"
```

---

### 8. **Error Handling & Graceful Shutdown** (`src/index.ts`)

Implements comprehensive error handling and graceful shutdown.

**Features:**

- Global error handler middleware
- Graceful shutdown on SIGTERM/SIGINT
- Uncaught exception handling
- Unhandled promise rejection handling
- Environment-specific error responses

---

## 📋 Environment Variables Checklist

Before deploying to production, ensure these are set:

```bash
# Required
[ ] DATABASE_URL
[ ] JWT_SECRET (min 32 chars)
[ ] JWT_REFRESH_SECRET (min 32 chars)
[ ] EMAIL_USER
[ ] EMAIL_PASSWORD
[ ] EMAIL_HOST
[ ] NODE_ENV=production
[ ] PORT (e.g., 3000)

# Recommended
[ ] CORS_ORIGINS (set specific domains)
[ ] JWT_ACCESS_EXPIRES_IN=15m
[ ] JWT_REFRESH_EXPIRES_IN=7d
[ ] API_KEY_SALT
```

---

## 🔄 Workflow for Secure Validation

### User Registration Flow:

```typescript
1. Validate email format with sanitizeEmail()
2. Validate password strength with validatePasswordPolicy()
3. Hash password with hashPassword()
4. Sanitize other inputs with sanitizeObject()
5. Check rate limit (handled in middleware)
6. Create user in database
```

### File Upload Flow:

```typescript
1. Check MIME type with sanitizeFileUpload()
2. Sanitize filename
3. Check file size
4. Store in uploads directory
5. Log successful upload
```

### Authentication Flow:

```typescript
1. Receive login request
2. Check rate limit (authRateLimiter)
3. Sanitize email input
4. Verify password
5. Validate JWT secret and tokens
6. Return tokens with proper headers
```

---

## 🚀 Production Deployment Checklist

- [ ] All environment variables set and validated
- [ ] JWT secrets are strong (32+ characters) and different
- [ ] CORS_ORIGINS set to specific production domains
- [ ] NODE_ENV set to "production"
- [ ] Database URL uses production database
- [ ] SSL/TLS certificates configured
- [ ] Rate limiting values appropriate for expected traffic
- [ ] API keys generated and securely stored for cron jobs
- [ ] Error logging configured
- [ ] Database backups enabled
- [ ] Monitoring and alerts setup
- [ ] Security headers verified in browser
- [ ] HTTPS enforced
- [ ] Database connection pooling configured

---

## 🔒 Security Best Practices

1. **Never commit `.env` files** to version control
2. **Rotate API keys** periodically
3. **Use strong, unique JWT secrets** for each environment
4. **Monitor rate limit triggers** for attack detection
5. **Keep dependencies updated** with security patches
6. **Use HTTPS only** in production
7. **Validate all inputs** client-side and server-side
8. **Log security events** for audit trails
9. **Implement CORS carefully** - don't use wildcards in production
10. **Test password validation** with your UX team

---

## 📞 Support & Updates

For security vulnerabilities or concerns, contact the development team immediately.

Last Updated: February 9, 2026
