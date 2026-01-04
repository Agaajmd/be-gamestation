import { User } from "@prisma/client";

export type LoginOTPResult =
  | { status: "OTP_SENT"; message: string }
  | {
      status: "SUCCESS";
      user: User;
      accessToken: string;
      refreshToken: string;
    };
