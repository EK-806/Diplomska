import { Navigate, Outlet, useLocation } from "react-router-dom";
import useAuth from "@/hooks/useAuth";

const Private = ({ allowedRoles, children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  const u = user?.user ?? user ?? null;

  if (loading) {
    return (
      <section className="flex justify-center items-center min-h-screen">
        <h1 className="text-4xl">Loading...</h1>
      </section>
    );
  }

  if (!u) {
    return (
      <Navigate
        to="/signin-signup"
        replace
        state={{ from: location.pathname }}
      />
    );
  }

  if (allowedRoles && !allowedRoles.includes(u.role)) {
    return <Navigate to="/" replace/>;
  }

  return children ? children : <Outlet/>;
};

export default Private;