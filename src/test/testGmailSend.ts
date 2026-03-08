// src/test/testGmailSend.ts

import dotenv from "dotenv";
dotenv.config();

import {
  testEmailConnection,
  sendVerificationEmail,
  generateVerificationToken,
} from "../helper/sendVerificationEmail";

async function testGmailDelivery() {
  console.log("🧪 Testing Gmail Email Delivery\n");
  console.log("=".repeat(60));

  // Check environment
  console.log("📋 Configuration:");
  console.log(`   NODE_ENV: ${process.env.NODE_ENV}`);
  console.log(`   SMTP_HOST: ${process.env.SMTP_HOST}`);
  console.log(`   SMTP_PORT: ${process.env.SMTP_PORT}`);
  console.log(`   SMTP_USER: ${process.env.SMTP_USER}`);
  console.log(`   SMTP_PASS: ${process.env.SMTP_PASS ? "***" + process.env.SMTP_PASS.slice(-4) : "NOT SET"}`);
  console.log("=".repeat(60) + "\n");

  try {
    // Test 1: Connection
    console.log("1️⃣ Testing SMTP connection...");
    const connected = await testEmailConnection();

    if (!connected) {
      console.error("❌ Failed to connect to Gmail SMTP server");
      console.log("\n🔧 Troubleshooting:");
      console.log("   1. Check if 2FA is enabled on your Gmail");
      console.log("   2. Generate App Password: https://myaccount.google.com/apppasswords");
      console.log("   3. Make sure SMTP_USER and SMTP_PASS are correct in .env");
      console.log("   4. Check if 'Less secure app access' is NOT blocking you");
      return;
    }

    console.log("✅ Connection successful!\n");

    // Test 2: Send verification email
    console.log("2️⃣ Sending test verification email...");
    console.log("   Target email: Enter your email to receive test");
    
    // ⚠️ GANTI EMAIL INI DENGAN EMAIL KAMU YANG MAU NERIMA TEST
    const testEmail = "newbiezzeggi@gmail.com"; // 👈 GANTI INI

    const token = generateVerificationToken();
    const emailSent = await sendVerificationEmail({
      to: testEmail,
      key: token,
      username: "Test User",
    });

    if (emailSent) {
      console.log("✅ Email sent successfully!");
      console.log(`\n📧 Check your inbox at: ${testEmail}`);
      console.log("📬 Also check SPAM folder if not in inbox");
      console.log("\n🔗 Verification link (for testing):");
      console.log(`   ${process.env.FRONTEND_URL}/verify-email?token=${token}`);
    } else {
      console.log("❌ Failed to send email");
    }

    console.log("\n" + "=".repeat(60));
    console.log("✅ Test completed!");
    console.log("=".repeat(60));
  } catch (error: any) {
    console.error("\n❌ Test failed with error:");
    console.error(error.message);
    
    if (error.code === "EAUTH") {
      console.log("\n🔧 Authentication Error - Possible solutions:");
      console.log("   1. Regenerate App Password");
      console.log("   2. Make sure you're using App Password, NOT regular Gmail password");
      console.log("   3. Remove spaces from App Password in .env file");
    } else if (error.code === "ECONNECTION") {
      console.log("\n🔧 Connection Error - Possible solutions:");
      console.log("   1. Check your internet connection");
      console.log("   2. Verify SMTP_HOST and SMTP_PORT are correct");
      console.log("   3. Check if firewall is blocking port 587");
    }
  }
}

// Run the test
testGmailDelivery();