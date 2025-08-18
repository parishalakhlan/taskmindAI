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
      from: `"TaskMind AI" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: "Your OTP Verification Code",
      html: `
<div style="font-family: 'Poppins', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #fff0f6; border-radius: 16px; padding: 25px; box-shadow: 0px 6px 15px rgba(0,0,0,0.08);">
  <h2 style="color: #ff4d6d; text-align: center; font-size: 26px; margin-bottom: 10px;">
    ✨ Email Verification ✨
  </h2>

  <div style="background: #ffffff; padding: 20px; border-radius: 12px; text-align: center; border: 2px dashed #ffb6c1;">
    <p style="font-size: 16px; color: #555; line-height: 1.6; margin: 10px 0;">
      Champ 💫<br>
      Your messy waves look way too good to get stressed out of existence 😌.<br>
      Alsooo, can you put that <b style="color:#ff6f61;">biohazard-level Maggi</b> 🍜😂 down before it finishes you before deadlines do?  
    </p>

    <h1 style="color: #ff4d6d; font-size: 38px; margin: 25px 0; letter-spacing: 6px; font-weight: 700;">
      ${otp}
    </h1>

    <p style="font-size: 15px; color: #777; margin: 8px 0;">
      Now… OTP please 💕 (save your waves, save your tummy, save your deadlines).
    </p>

    <p style="font-size: 14px; color: #999; margin-top: 15px;">
      ⏳ This code will expire in <b>5 minutes</b>.
    </p>
    <p style="font-size: 13px; color: #bbb; margin-top: 5px;">
      If you didn’t request this code, please ignore this email.
    </p>
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
