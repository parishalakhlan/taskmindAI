// utils/emailSender.js
const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD, // Use app password if 2FA enabled
  },
});
transporter.verify((error, success) => {
  if (error) {
    console.error("Email configuration error:", error);
  } else {
    console.log("Email server is ready to send messages");
  }
});

const sendOTPEmail = async (email, otp) => {
  console.log("sendOTPEmail function");
  try {
    const mailOptions = {
      from: `"Your App Name" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: "Your OTP Verification Code",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333; text-align: center;">Email Verification</h2>
          <div style="background-color: #f9f9f9; padding: 20px; border-radius: 10px; text-align: center;">
            <p style="font-size: 16px; color: #666;">Your verification code is:</p>
            <h1 style="color: #4CAF50; font-size: 36px; margin: 20px 0; letter-spacing: 5px;">${otp}</h1>
            <p style="font-size: 14px; color: #999;">This code will expire in 5 minutes.</p>
            <p style="font-size: 14px; color: #999;">If you didn't request this code, please ignore this email.</p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`OTP sent successfully to ${email}`);
    return true;
  } catch (error) {
    console.error("Email send error:", error);
    return false;
  }
};

module.exports = { sendOTPEmail };
