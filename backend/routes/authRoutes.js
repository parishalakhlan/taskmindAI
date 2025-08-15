const express = require("express");

const {
  checkAuth,
  signup,
  login,
  sendSignupOTP,
  verifySignupOTP,
  sendLoginOTP,
  verifyLoginOTP,
} = require("../controllers/authController");
const router = express.Router();

router.post("/send-signup-otp", sendSignupOTP);
router.post("/verify-signup-otp", verifySignupOTP);
router.post("/send-login-otp", sendLoginOTP);
router.post("/verify-login-otp", verifyLoginOTP);
// Send OTP Endpoint

router.post("/signup", signup);
router.post("/login", login);
router.get("/check-auth", checkAuth);
module.exports = router;
