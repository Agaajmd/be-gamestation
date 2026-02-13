/**
 * Security Configuration
 * Centralizes all security settings
 */
export declare const securityConfig: {
    password: {
        minLength: number;
        maxLength: number;
        requireUppercase: boolean;
        requireLowercase: boolean;
        requireNumbers: boolean;
        requireSpecialChars: boolean;
        specialCharsRegex: RegExp;
    };
    jwt: {
        accessTokenExpiry: string;
        refreshTokenExpiry: string;
        algorithm: "HS256";
        issuer: string;
        audience: string;
    };
    rateLimiting: {
        auth: {
            windowMs: number;
            maxRequests: number;
        };
        api: {
            windowMs: number;
            maxRequests: number;
        };
        passwordReset: {
            windowMs: number;
            maxRequests: number;
        };
        emailVerification: {
            windowMs: number;
            maxRequests: number;
        };
        upload: {
            windowMs: number;
            maxRequests: number;
        };
    };
    fileUpload: {
        maxFileSize: number;
        allowedMimetypes: string[];
        allowedExtensions: string[];
    };
    cors: {
        maxAge: number;
        credentials: boolean;
        methods: string[];
        allowedHeaders: string[];
    };
    session: {
        maxAge: number;
        secure: boolean;
        httpOnly: boolean;
        sameSite: "strict";
    };
    headers: {
        contentSecurityPolicy: boolean;
        crossOriginEmbedderPolicy: boolean;
        crossOriginOpenerPolicy: boolean;
        crossOriginResourcePolicy: {
            policy: string;
        };
        dnsPrefetchControl: {
            allow: boolean;
        };
        frameguard: {
            action: string;
        };
        hidePoweredBy: boolean;
        hsts: {
            maxAge: number;
            includeSubDomains: boolean;
            preload: boolean;
        };
        ieNoOpen: boolean;
        noSniff: boolean;
        referrerPolicy: {
            policy: string;
        };
        xssFilter: boolean;
    };
    input: {
        maxStringLength: number;
        maxArrayLength: number;
        maxObjectDepth: number;
    };
    features: {
        enableHelmet: boolean;
        enableRateLimiting: boolean;
        enableInputSanitization: boolean;
        enableSecurityHeaders: boolean;
        enableApiKeyAuth: boolean;
        enableCsrfProtection: boolean;
    };
};
//# sourceMappingURL=securityConfig.d.ts.map