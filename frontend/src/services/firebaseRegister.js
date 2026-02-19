import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import auth from "../config/firebaseConfig";
import axiosApiCall from "@/lib/axiosApiCall";

export default async function registerWithEmailAndPasword(fetchUser, navigate, toast) {
  try {
    const provider = new GoogleAuthProvider();
    const userCredential = await signInWithPopup(auth, provider);

    const user = userCredential.user;

    const idToken = await user.getIdToken(true);

    const res = await axiosApiCall.post("/api/v1/user/login", { idToken });

    if (!res.data?.accessToken || !res.data?.updateToken) {
      throw new Error("Backend did not return accessToken/updateToken. Check sendToken().");
    }

    localStorage.setItem("accessToken", res.data.accessToken);
    localStorage.setItem("updateToken", res.data.updateToken);

    if (fetchUser) {
      const result = await fetchUser();
      if (result?.meta?.requestStatus && result.meta.requestStatus !== "fulfilled") {
        throw new Error(result.payload || "Failed to fetch user after Google login.");
      }
    }

    toast?.({
      title: "Login Successful",
      description: "Signed in with Google",
    });

    if (navigate) navigate("/", { replace: true });

    return res.data;
  } catch (error) {
    console.error("Error:", error.response?.data || error.message);

    toast?.({
      title: "Google Login Failed",
      description: error.response?.data?.message || error.message,
      variant: "destructive",
    });

    throw error;
  }
}