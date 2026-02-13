export declare function verifyEmailService(token: string): Promise<boolean>;
export declare function resendVerificationEmailService(email: string): Promise<boolean>;
export declare function checkVerificationStatusService(email: string): Promise<{
    isVerified: boolean;
    lastSentAt: Date | null;
}>;
//# sourceMappingURL=verificationService.d.ts.map