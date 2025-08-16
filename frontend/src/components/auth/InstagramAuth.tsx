import { useRouter } from "next/router";
import { FaInstagram } from "react-icons/fa";

interface InstagramAuthProps {
  onSuccess?: (response: unknown) => void;
  onError?: (error: unknown) => void;
}

export const InstagramAuth: React.FC<InstagramAuthProps> = ({
  onSuccess,
  onError,
}) => {
  const router = useRouter();

  const handleClick = () => {
    try {
      const clientId = process.env.NEXT_PUBLIC_INSTAGRAM_CLIENT_ID;
      const redirectUri = encodeURIComponent(
        `${window.location.origin}/api/auth/instagram/callback`
      );
      const authUrl = `https://api.instagram.com/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=user_profile&response_type=code`;

      window.location.href = authUrl;
    } catch (error) {
      console.error("Instagram auth error:", error);
      onError?.(error);
    }
  };

  return (
    <button
      onClick={handleClick}
      className="flex items-center justify-center p-2 sm:p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors duration-200"
    >
      <FaInstagram className="text-gray-600 w-5 h-5 sm:w-6 sm:h-6" />
      <span className="ml-2">Continue with Instagram</span>
    </button>
  );
};
