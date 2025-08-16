import {
  GoogleOAuthProvider,
  GoogleLogin,
  CredentialResponse,
} from "@react-oauth/google";
import { useRouter } from "next/router";

interface GoogleAuthProps {
  onSuccess?: (credentialResponse: CredentialResponse) => void;
  onError?: () => void;
}

export const GoogleAuth: React.FC<GoogleAuthProps> = ({
  onSuccess,
  onError,
}) => {
  const router = useRouter();

  const handleSuccess = (credentialResponse: CredentialResponse) => {
    console.log("Google Auth Success", credentialResponse);
    onSuccess?.(credentialResponse);
    router.push("/dashboard");
  };

  const handleError = () => {
    console.log("Google Auth Failed");
    onError?.();
  };

  return (
    <GoogleOAuthProvider
      clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? ""}
    >
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={handleError}
        useOneTap
        text="signin_with"
        shape="rectangular"
        size="medium"
      />
    </GoogleOAuthProvider>
  );
};
