import type { ReactElement } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children }: { children: ReactElement }) {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    // Lưu lại đường dẫn hiện tại vào state để quay lại ngay sau khi đăng nhập
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return children;
}