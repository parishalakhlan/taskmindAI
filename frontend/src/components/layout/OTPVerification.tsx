// components/OTPVerification.tsx
import { useState } from "react";
import { OTPInput } from "./OTPInput";

interface OTPVerificationProps {
  email: string;
  onVerify: (otp: string) => Promise<void>;
  onResend: () => Promise<void>;
  loading?: boolean;
  resendLoading?: boolean;
}

export const OTPVerification = ({
  email,
  onVerify,
  onResend,
  loading = false,
  resendLoading = false,
}: OTPVerificationProps) => {
  const [error, setError] = useState("");

  const handleVerify = async (otp: string) => {
    try {
      setError("");
      await onVerify(otp);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Verification failed");
    }
  };

  const handleResend = async () => {
    try {
      setError("");
      await onResend();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to resend OTP");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-gray-600 mb-4">
          {"  We've sent a 6-digit verification code to"}
          <span className="font-semibold">{email}</span>. Please check your
          inbox and enter the code below.
        </p>

        <OTPInput onComplete={handleVerify} disabled={loading} />

        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      </div>

      <div>
        <button
          type="button"
          onClick={handleResend}
          disabled={resendLoading || loading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {resendLoading ? "Resending..." : "Resend OTP"}
        </button>
      </div>
    </div>
  );
};
