// src/helper/emailVerificationHelper.ts
import nodemailer from "nodemailer";
import crypto from "crypto";

const isDevelopment = process.env.NODE_ENV !== "production";

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
        // Production SMTP
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || "587"),
        secure: process.env.SMTP_SECURE === "true",
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
        tls: {
          rejectUnauthorized: false,
        },
      },
);

/**
 * Generate random verification token
 */
export const generateVerificationToken = (): string => {
  return crypto.randomBytes(32).toString("hex");
};

/**
 * Hash verification token untuk disimpan di database
 */
export const hashToken = (token: string): string => {
  return crypto.createHash("sha256").update(token).digest("hex");
};

export const generateMagicKey = (): string => {
  return crypto.randomBytes(48).toString("hex");
}

interface SendVerificationEmailParams {
  to: string;
  key: string; // Plain token (belum di-hash)
  username?: string;
}

/**
 * Kirim email verification ke user
 */
export const sendVerificationEmail = async ({
  to,
  key,
  username = "User",
}: SendVerificationEmailParams): Promise<boolean> => {
  try {
    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?key=${key}`;

    // Development mode: print link ke console
    if (isDevelopment || process.env.EMAIL_DEBUG === "true") {
      console.log("\n" + "=".repeat(70));
      console.log("📧 EMAIL VERIFICATION LINK (Debug Mode)");
      console.log("=".repeat(70));
      console.log(`📧 To: ${to}`);
      console.log(`👤 Username: ${username}`);
      console.log(`🔗 Verification URL:`);
      console.log(`   ${verificationUrl}`);
      console.log(`⏰ Expires: 24 hours from now`);
      console.log("=".repeat(70) + "\n");
    }

    const mailOptions = {
      from: process.env.EMAIL_FROM || "Game Station <noreply@gamestation.com>",
      to,
      subject: "Verify Your Email - Game Station",
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body { 
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
              line-height: 1.6; 
              color: #333;
              margin: 0;
              padding: 0;
              background-color: #f5f5f5;
            }
            .container { 
              max-width: 600px; 
              margin: 40px auto; 
              background: white;
              border-radius: 12px;
              overflow: hidden;
              box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            }
            .header { 
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
              color: white; 
              padding: 40px 30px; 
              text-align: center; 
            }
            .header h1 {
              margin: 0;
              font-size: 28px;
              font-weight: 600;
            }
            .header p {
              margin: 10px 0 0 0;
              font-size: 16px;
              opacity: 0.9;
            }
            .content { 
              padding: 40px 30px; 
            }
            .content p {
              margin: 0 0 15px 0;
              color: #555;
            }
            .greeting {
              font-size: 18px;
              color: #333;
              font-weight: 500;
            }
            .button-container {
              text-align: center;
              margin: 30px 0;
            }
            .button { 
              display: inline-block; 
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white !important; 
              padding: 16px 40px; 
              text-decoration: none; 
              border-radius: 8px; 
              font-weight: 600;
              font-size: 16px;
              box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
              transition: transform 0.2s, box-shadow 0.2s;
            }
            .button:hover { 
              transform: translateY(-2px);
              box-shadow: 0 6px 16px rgba(102, 126, 234, 0.5);
            }
            .info-box { 
              background: #f0f4ff; 
              border-left: 4px solid #667eea; 
              padding: 20px; 
              margin: 25px 0;
              border-radius: 4px;
            }
            .info-box strong {
              color: #667eea;
              display: block;
              margin-bottom: 10px;
            }
            .info-box ul {
              margin: 10px 0;
              padding-left: 20px;
            }
            .info-box li {
              margin: 8px 0;
              color: #555;
            }
            .link-text {
              word-break: break-all; 
              color: #667eea;
              font-size: 13px;
              background: #f9f9f9;
              padding: 10px;
              border-radius: 4px;
              margin-top: 10px;
              display: block;
            }
            .footer { 
              background: #f9f9f9;
              text-align: center; 
              color: #999; 
              font-size: 13px; 
              padding: 25px 30px;
              border-top: 1px solid #eee;
            }
            .footer p {
              margin: 5px 0;
            }
            .warning {
              color: #e74c3c;
              font-size: 14px;
              margin-top: 20px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎮 Welcome to Game Station!</h1>
              <p>One more step to get started</p>
            </div>
            
            <div class="content">
              <p class="greeting">Hi <strong>${username}</strong>,</p>
              
              <p>Thanks for signing up for Game Station! We're thrilled to have you join our gaming community.</p>
              
              <p>To complete your registration and start your gaming journey, please verify your email address by clicking the button below:</p>
              
              <div class="button-container">
                <a href="${verificationUrl}" class="button">✓ Verify Email Address</a>
              </div>
              
              <div class="info-box">
                <strong>ℹ️ Important Information:</strong>
                <ul>
                  <li>This verification link will expire in <strong>24 hours</strong></li>
                  <li>You need to verify your email before you can login</li>
                  <li>Once verified, you'll have full access to all features</li>
                </ul>
              </div>
              
              <p class="warning">⚠️ If you didn't create an account with Game Station, please ignore this email and no account will be created.</p>
              
              <p style="margin-top: 30px;">Best regards,<br><strong>The Game Station Team</strong></p>
            </div>
            
            <div class="footer">
              <p>This is an automated email, please do not reply directly to this message.</p>
              <p>&copy; ${new Date().getFullYear()} Game Station. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
Welcome to Game Station!

Hi ${username},

Thanks for signing up for Game Station! We're thrilled to have you join our gaming community.

To complete your registration and start your gaming journey, please verify your email address by clicking the link below:

${verificationUrl}

IMPORTANT INFORMATION:
- This verification link will expire in 24 hours
- You need to verify your email before you can login
- Once verified, you'll have full access to all features

If you didn't create an account with Game Station, please ignore this email and no account will be created.

Best regards,
The Game Station Team

---
This is an automated email, please do not reply directly to this message.
© ${new Date().getFullYear()} Game Station. All rights reserved.
      `,
    };

    const info = await transporter.sendMail(mailOptions);

    console.log(`✅ Verification email sent to ${to}`);
    if (isDevelopment) {
      console.log(`📬 Message ID: ${info.messageId}`);
    }

    return true;
  } catch (error) {
    console.error("[EMAIL VERIFICATION ERROR]", error);
    return false;
  }
};

/**
 * Kirim ulang verification email
 */
export const resendVerificationEmail = async (
  params: SendVerificationEmailParams,
): Promise<boolean> => {
  console.log(`🔄 Resending verification email to ${params.to}`);
  return await sendVerificationEmail(params);
};

export const testEmailConnection = async (): Promise<boolean> => {
  try {
    await transporter.verify();
    console.log("✅ Email verification server connection successful");
    return true;
  } catch (error) {
    console.error("❌ Email verification server connection failed:", error);
    return false;
  }
};
