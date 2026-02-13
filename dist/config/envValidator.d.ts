/**
 * Environment Variables Validator
 * Validates all required environment variables on startup
 */
interface EnvironmentConfig {
    DATABASE_URL: string;
    JWT_SECRET: string;
    JWT_REFRESH_SECRET: string;
    JWT_ACCESS_EXPIRES_IN: string;
    JWT_REFRESH_EXPIRES_IN: string;
    PORT: number;
    NODE_ENV: "development" | "production" | "test";
    SMTP_USER: string;
    SMTP_PASS: string;
    SMTP_HOST: string;
    API_KEY_SALT: string;
}
/**
 * Validate environment variables
 * Throws error if required variables are missing or invalid
 */
export declare const validateEnvironment: () => EnvironmentConfig;
export declare const envConfig: EnvironmentConfig;
export {};
//# sourceMappingURL=envValidator.d.ts.map