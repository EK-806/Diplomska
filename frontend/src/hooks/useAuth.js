import { useDispatch, useSelector } from "react-redux";
import { useEffect, useCallback } from "react";
import axiosApiCall from "@/lib/axiosApiCall";
import { fetchUserData, Logout as LogoutAction } from "@/hooks/userSlice";

const useAuth = () => {
  const dispatch = useDispatch();
  const { user, loading, error } = useSelector((state) => state.auth);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token && !user && !loading) {
      dispatch(fetchUserData());
    }
  }, [dispatch]);

  const fetchUser = useCallback(() => dispatch(fetchUserData()), [dispatch]);

  const LogOut = useCallback(async () => {
    try {
      await axiosApiCall.get("/api/v1/user/logout");
    } finally {
      dispatch(LogoutAction());
    }
  }, [dispatch]);

  return { user, loading, error, LogOut, fetchUser };
};

export default useAuth;