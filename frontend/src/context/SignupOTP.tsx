// components/auth/SignupOTP.tsx
"use client";
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaSpinner, FaTimesCircle } from "react-icons/fa";
interface UserData {
  id: string;
  name: string;
  email: string;
  // Add other user properties you expect
}
interface SignupOTPProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (token: string, userData: UserData) => void;
  signupData: {
    name: string;
    email: string;
    password: string;
    passwordConfirm: string;
  };
}
const backendUrl = process.env.NEXT_PUBLIC_BACKEND_PUBLIC_URL;
export const SignupOTP: React.FC<SignupOTPProps> = ({
  isOpen,
  onClose,
  onSuccess,
  signupData,
}) => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState("");
  const [resendTimer, setResendTimer] = useState(0);
  const [isOtpSent, setIsOtpSent] = useState(false);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const sendOTP = async () => {
    setIsLoading(true);
    setError("");

    try {
      const requestData = {
        email: signupData.email,
        name: signupData.name,
        password: signupData.password,
      };

      console.log("Sending OTP with data:", requestData); // Debug log

      const response = await fetch(
        `${backendUrl}/api/v1/auth/send-signup-otp`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestData),
        }
      );

      const data = await response.json();
      console.log("OTP Response:", data); // Debug log

      if (!response.ok) {
        throw new Error(data.message || "Failed to send OTP");
      }

      setIsOtpSent(true);
      setResendTimer(60); // 60 seconds countdown
    } catch (err: unknown) {
      console.error("Send OTP Error:", err); // Debug log
      setError(err instanceof Error ? err.message : "Failed to send OTP");
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    if (isOpen && !isOtpSent) {
      sendOTP();
    }
  }, [isOpen, isOtpSent]);

  // Resend timer
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);
  const verifyOTP = async () => {
    const otpCode = otp.join("");
    if (otpCode.length !== 6) {
      setError("Please enter complete OTP");
      return;
    }

    setIsVerifying(true);
    setError("");

    try {
      const response = await fetch(
        `${backendUrl}/api/v1/auth/verify-signup-otp`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: signupData.email,
            name: signupData.name,
            password: signupData.password,
            passwordConfirm: signupData.passwordConfirm,
            otp: otpCode,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "OTP verification failed");
      }

      // Success - call the success handler
      onSuccess(data.token, data.user);
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to send OTP");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return; // Only allow single digits

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError("");

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-verify when all fields are filled
    if (newOtp.every((digit) => digit !== "") && newOtp.join("").length === 6) {
      setTimeout(() => verifyOTP(), 100);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleResendOTP = () => {
    setOtp(["", "", "", "", "", ""]);
    sendOTP();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-rose-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Verify Your Email
            </h2>
            <p className="text-gray-600">
              {"We've sent a 6-digit verification code to"}
            </p>
            <p className="text-gray-900 font-semibold">{signupData.email}</p>
          </div>

          {/* Loading State for Sending OTP */}
          {isLoading && (
            <div className="text-center py-8">
              <FaSpinner className="animate-spin text-4xl text-rose-500 mx-auto mb-4" />
              <p className="text-gray-600">Sending OTP to your email...</p>
            </div>
          )}

          {/* OTP Input Fields */}
          {!isLoading && isOtpSent && (
            <>
              <div className="flex justify-center space-x-3 mb-6">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => {
                      inputRefs.current[index] = el;
                    }}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="w-12 h-12 text-center text-xl font-bold border-2 border-gray-300 rounded-lg focus:border-rose-500 focus:outline-none transition-colors"
                    disabled={isVerifying}
                  />
                ))}
              </div>

              {/* Error Message */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center justify-center text-red-500 text-sm mb-4"
                >
                  <FaTimesCircle className="mr-2" />
                  {error}
                </motion.div>
              )}

              {/* Verify Button */}
              <button
                onClick={verifyOTP}
                disabled={isVerifying || otp.some((digit) => digit === "")}
                className="w-full bg-rose-500 hover:bg-rose-600 disabled:bg-gray-300 text-white font-semibold py-3 rounded-lg transition-colors mb-4 flex items-center justify-center"
              >
                {isVerifying ? (
                  <>
                    <FaSpinner className="animate-spin mr-2" />
                    Verifying...
                  </>
                ) : (
                  "Verify & Create Account"
                )}
              </button>

              {/* Resend Section */}
              <div className="text-center">
                <p className="text-gray-600 text-sm mb-2">
                  {" Didn't receive the code?"}
                </p>
                {resendTimer > 0 ? (
                  <p className="text-gray-500 text-sm">
                    Resend in {resendTimer}s
                  </p>
                ) : (
                  <button
                    onClick={handleResendOTP}
                    className="text-rose-500 hover:text-rose-600 font-semibold text-sm"
                  >
                    Resend OTP
                  </button>
                )}
              </div>
            </>
          )}

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// components/auth/LoginOTP.tsx
interface LoginOTPProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (token: string, userData: UserData) => void;
  email: string;
}

export const LoginOTP: React.FC<LoginOTPProps> = ({
  isOpen,
  onClose,
  onSuccess,
  email,
}) => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState("");
  const [resendTimer, setResendTimer] = useState(0);
  const [isOtpSent, setIsOtpSent] = useState(false);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Send initial OTP when component opens
  useEffect(() => {
    if (isOpen && !isOtpSent) {
      sendOTP();
    }
  }, [isOpen, isOtpSent]);

  // Resend timer
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const sendOTP = async () => {
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(`${backendUrl}/api/v1/auth/send-login-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to send OTP");
      }

      setIsOtpSent(true);
      setResendTimer(60);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to send OTP");
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOTP = async () => {
    const otpCode = otp.join("");
    if (otpCode.length !== 6) {
      setError("Please enter complete OTP");
      return;
    }

    setIsVerifying(true);
    setError("");

    try {
      const response = await fetch(
        `${backendUrl}/api/v1/auth/verify-login-otp`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            otp: otpCode,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "OTP verification failed");
      }

      onSuccess(data.token, data.user);
      onClose();
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : " OTP verification failed !"
      );
    } finally {
      setIsVerifying(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError("");

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    if (newOtp.every((digit) => digit !== "") && newOtp.join("").length === 6) {
      setTimeout(() => verifyOTP(), 100);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleResendOTP = () => {
    setOtp(["", "", "", "", "", ""]);
    sendOTP();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-blue-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Secure Login
            </h2>
            <p className="text-gray-600">{"  We've sent a 6-digit code to"}</p>
            <p className="text-gray-900 font-semibold">{email}</p>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="text-center py-8">
              <FaSpinner className="animate-spin text-4xl text-blue-500 mx-auto mb-4" />
              <p className="text-gray-600">Sending OTP to your email...</p>
            </div>
          )}

          {/* OTP Input Fields */}
          {!isLoading && isOtpSent && (
            <>
              <div className="flex justify-center space-x-3 mb-6">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => {
                      inputRefs.current[index] = el;
                    }}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="w-12 h-12 text-center text-xl font-bold border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                    disabled={isVerifying}
                  />
                ))}
              </div>

              {/* Error Message */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center justify-center text-red-500 text-sm mb-4"
                >
                  <FaTimesCircle className="mr-2" />
                  {error}
                </motion.div>
              )}

              {/* Verify Button */}
              <button
                onClick={verifyOTP}
                disabled={isVerifying || otp.some((digit) => digit === "")}
                className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white font-semibold py-3 rounded-lg transition-colors mb-4 flex items-center justify-center"
              >
                {isVerifying ? (
                  <>
                    <FaSpinner className="animate-spin mr-2" />
                    Verifying...
                  </>
                ) : (
                  "Verify & Login"
                )}
              </button>

              {/* Resend Section */}
              <div className="text-center">
                <p className="text-gray-600 text-sm mb-2">
                  {" Didn't receive the code?"}
                </p>
                {resendTimer > 0 ? (
                  <p className="text-gray-500 text-sm">
                    Resend in {resendTimer}s
                  </p>
                ) : (
                  <button
                    onClick={handleResendOTP}
                    className="text-blue-500 hover:text-blue-600 font-semibold text-sm"
                  >
                    Resend OTP
                  </button>
                )}
              </div>
            </>
          )}

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
