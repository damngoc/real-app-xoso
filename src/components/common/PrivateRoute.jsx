import React, { useMemo } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { ROUTES } from "@/config/constants";

const PrivateRoute = ({ children, requiredRole }) => {
  const { user, loading } = useAuth();

  useMemo(() => {
    console.log("PrivateRoute rendered", user, loading, requiredRole);
  }, [user, loading, requiredRole]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // if (!user) {
  //   return <Navigate to="/login" replace />;
  // }

  // if (requiredRole && user?.role !== requiredRole) {
  //   // Nếu không đủ quyền, chuyển về dashboard
  //   return <Navigate to={ROUTES.ADMIN_DASHBOARD} replace />;
  // }

  return children;
};

export default PrivateRoute;
