// src/helper/emailHelper.ts
import nodemailer from "nodemailer";

// Development: Mailtrap
const isDevelopment = process.env.NODE_ENV !== "production";

// OTP Delivery Method: "email", "console", atau "both"
// Set di .env: OTP_DELIVERY_METHOD=console (untuk dev cepat)
const OTP_DELIVERY_METHOD = process.env.OTP_DELIVERY_METHOD || "email";

const transporter = nodemailer.createTransport(
  isDevelopment
    ? {
        // Mailtrap SMTP (Development)
        host: process.env.MAILTRAP_HOST || "sandbox.smtp.mailtrap.io",
        port: parseInt(process.env.MAILTRAP_PORT || "2525"),
        auth: {
          user: process.env.MAILTRAP_USER,
          pass: process.env.MAILTRAP_PASS,
        },
      }
    : {
        // Production SMTP (Gmail, SendGrid, AWS SES, etc)
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || "587"),
        secure: process.env.SMTP_SECURE === "true",
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      }
);

interface SendOTPEmailParams {
  to: string;
  otp: string;
  expiresInMinutes: number;
  purpose?: string; // "login" atau "reset password"
}

export const sendOTPEmail = async ({
  to,
  otp,
  expiresInMinutes,
  purpose = "login",
}: SendOTPEmailParams): Promise<boolean> => {
  try {
    // Mode: console only (untuk development cepat)
    if (OTP_DELIVERY_METHOD === "console") {
      console.log("\n" + "=".repeat(60));
      console.log("🔐 OTP CODE (Console Mode)");
      console.log("=".repeat(60));
      console.log(`📧 To: ${to}`);
      console.log(`🎯 Purpose: ${purpose}`);
      console.log(`🔢 OTP Code: ${otp}`);
      console.log(`⏰ Valid for: ${expiresInMinutes} minutes`);
      console.log(
        `⏱️  Expires at: ${new Date(
          Date.now() + expiresInMinutes * 60 * 1000
        ).toLocaleString()}`
      );
      console.log("=".repeat(60) + "\n");
      return true;
    }

    const subject =
      purpose === "reset password"
        ? "Reset Password - Game Station"
        : "Your OTP Code - Game Station";

    const titleText =
      purpose === "reset password" ? "Reset Your Password" : "Your OTP Code";

    const bodyText =
      purpose === "reset password"
        ? "You requested to reset your password for your Game Station account. Use the following OTP code:"
        : "You requested to login to your Game Station account. Use the following OTP code:";

    const mailOptions = {
      from: process.env.EMAIL_FROM || "Game Station <noreply@gamestation.com>",
      to,
      subject,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .otp-box { background: white; border: 2px dashed #667eea; border-radius: 10px; padding: 20px; text-align: center; margin: 20px 0; }
            .otp-code { font-size: 32px; font-weight: bold; color: #667eea; letter-spacing: 8px; }
            .warning { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; }
            .footer { text-align: center; color: #666; font-size: 12px; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎮 Game Station</h1>
              <p>${titleText}</p>
            </div>
            <div class="content">
              <p>Hello,</p>
              <p>${bodyText}</p>
              
              <div class="otp-box">
                <div class="otp-code">${otp}</div>
                <p style="color: #666; margin-top: 10px;">Valid for ${expiresInMinutes} minutes</p>
              </div>
              
              <div class="warning">
                <strong>⚠️ Security Notice:</strong>
                <ul style="margin: 10px 0; padding-left: 20px;">
                  <li>Never share this OTP with anyone</li>
                  <li>Game Station staff will never ask for your OTP</li>
                  <li>This code expires in ${expiresInMinutes} minutes</li>
                </ul>
              </div>
              
              <p>If you didn't request this code, please ignore this email or contact our support.</p>
              
              <p>Best regards,<br><strong>Game Station Team</strong></p>
            </div>
            <div class="footer">
              <p>This is an automated email, please do not reply.</p>
              <p>&copy; 2025 Game Station. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
        Game Station - Your OTP Code
        
        Hello,
        
        You requested to login to your Game Station account.
        
        Your OTP Code: ${otp}
        Valid for: ${expiresInMinutes} minutes
        
        Security Notice:
        - Never share this OTP with anyone
        - Game Station staff will never ask for your OTP
        - This code expires in ${expiresInMinutes} minutes
        
        If you didn't request this code, please ignore this email.
        
        Best regards,
        Game Station Team
      `,
    };

    const info = await transporter.sendMail(mailOptions);

    // Mode: both - kirim email dan print ke console
    if (OTP_DELIVERY_METHOD === "both") {
      console.log("\n" + "=".repeat(60));
      console.log("🔐 OTP CODE");
      console.log("=".repeat(60));
      console.log(`📧 To: ${to}`);
      console.log(`🎯 Purpose: ${purpose}`);
      console.log(`🔢 OTP Code: ${otp}`);
      console.log(`⏰ Valid for: ${expiresInMinutes} minutes`);
      console.log(`📨 Email sent: ✅`);
      console.log(`📬 Message ID: ${info.messageId}`);
      if (isDevelopment) {
        console.log(`🔗 Mailtrap: https://mailtrap.io/inboxes`);
      }
      console.log("=".repeat(60) + "\n");
    }

    return true;
  } catch (error) {
    console.error("[EMAIL ERROR]", error);
    return false;
  }
};

// Test email configuration
export const testEmailConnection = async (): Promise<boolean> => {
  try {
    await transporter.verify();
    console.log("✅ Email server connection successful");
    return true;
  } catch (error) {
    console.error("❌ Email server connection failed:", error);
    return false;
  }
};
