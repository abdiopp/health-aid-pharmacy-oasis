import { FC, ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface AuthRouteProps {
  children: ReactNode;
}

/**
 * AuthRoute - A component that prevents authenticated users from accessing auth pages
 * Redirects to home page if user is already authenticated
 */
const AuthRoute: FC<AuthRouteProps> = ({ children }) => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default AuthRoute;
