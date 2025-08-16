import { GoogleAuth } from "./GoogleAuth";
import { InstagramAuth } from "./InstagramAuth";

interface SocialAuthProvidersProps {
  onSuccess?: (provider: string, response: unknown) => void;
  onError?: (provider: string, error: unknown) => void;
}

export const SocialAuthProviders: React.FC<SocialAuthProvidersProps> = ({
  onSuccess,
  onError,
}) => {
  const handleGoogleSuccess = (response: unknown) => {
    onSuccess?.("google", response);
  };

  const handleGoogleError = () => {
    onError?.("google", "Authentication failed");
  };

  const handleInstagramSuccess = (response: unknown) => {
    onSuccess?.("instagram", response);
  };

  const handleInstagramError = (error: unknown) => {
    onError?.("instagram", error);
  };

  return (
    <div className="space-y-4">
      <GoogleAuth onSuccess={handleGoogleSuccess} onError={handleGoogleError} />
      <InstagramAuth
        onSuccess={handleInstagramSuccess}
        onError={handleInstagramError}
      />
    </div>
  );
};
