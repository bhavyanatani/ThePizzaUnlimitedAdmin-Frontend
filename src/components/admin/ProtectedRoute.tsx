import { Navigate } from 'react-router-dom';
import { getAuthToken } from '@/utils/api';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const token = getAuthToken();

  if (!token) {
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
};
