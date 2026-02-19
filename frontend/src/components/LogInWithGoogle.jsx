import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import auth from "@/config/firebaseConfig";
import axiosApiCall from "@/lib/axiosApiCall";
import { LoaderCircle } from "lucide-react";
import useAuth from "@/hooks/useAuth";
import { useToast } from "@/hooks/useToast";
import { useNavigate } from "react-router-dom";

export default function LogInWithGoogle() {
  const [loadingLogIn, setLoadingLogIn] = useState(false);
  const { fetchUser } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    setLoadingLogIn(true);

    try {
      const result = await signInWithPopup(auth, provider);
      const idToken = await result.user.getIdToken(true);
      const response = await axiosApiCall.post(
        "/api/v1/user/login",
        { idToken }
      );

      if (!response.data?.accessToken || !response.data?.updateToken) {
        throw new Error("Backend did not return auth tokens");
      }
      localStorage.setItem("accessToken", response.data.accessToken);
      localStorage.setItem("updateToken", response.data.updateToken);

      const resultFetch = await fetchUser();
      if (
        resultFetch?.meta?.requestStatus &&
        resultFetch.meta.requestStatus !== "fulfilled"
      ) {
        throw new Error("Failed to fetch user after Google login");
      }

      toast({
        title: "Login Successful",
        description: "Signed in with Google",
      });

      navigate("/", { replace: true });

    } catch (error) {
      console.error("Error during Google login:", error.response?.data || error.message);

      toast({
        title: "Login Failed",
        description: error.response?.data?.message || error.message,
        variant: "destructive",
      });
    } finally {
      setLoadingLogIn(false);
    }
  };

  return (
    <Button
      onClick={handleGoogleLogin}
      className="flex items-center justify-center gap-2
             bg-gray-400 text-gray-100
             border-2 border-gray-900
             hover:bg-gray-500
             dark:bg-gray-600 dark:text-gray-100
             dark:border-gray-100
             dark:hover:bg-gray-700
             transition-colors"
      disabled={loadingLogIn}>
      {loadingLogIn ? (
        <LoaderCircle className="animate-spin"/>
      ) : (
        <img className="h-6" src="/google.png" alt="Google Logo"/>
      )}
      Google Login
    </Button>
  );
}