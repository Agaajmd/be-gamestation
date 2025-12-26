interface SendOTPEmailParams {
    to: string;
    otp: string;
    expiresInMinutes: number;
    purpose?: string;
}
export declare const sendOTPEmail: ({ to, otp, expiresInMinutes, purpose, }: SendOTPEmailParams) => Promise<boolean>;
export declare const testEmailConnection: () => Promise<boolean>;
export {};
//# sourceMappingURL=emailHelper.d.ts.map