/**
 * Generate random verification token
 */
export declare const generateVerificationToken: () => string;
/**
 * Hash verification token untuk disimpan di database
 */
export declare const hashToken: (token: string) => string;
interface SendVerificationEmailParams {
    to: string;
    token: string;
    username?: string;
}
/**
 * Kirim email verification ke user
 */
export declare const sendVerificationEmail: ({ to, token, username, }: SendVerificationEmailParams) => Promise<boolean>;
/**
 * Kirim ulang verification email
 */
export declare const resendVerificationEmail: (params: SendVerificationEmailParams) => Promise<boolean>;
export declare const testEmailConnection: () => Promise<boolean>;
export {};
//# sourceMappingURL=sendVerificationEmail.d.ts.map