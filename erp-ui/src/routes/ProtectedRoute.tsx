import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";

interface Props {
  children: ReactNode;
  roles?: string[]; // erişime izin verilen roller
}

export default function ProtectedRoute({ children, roles }: Props) {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const location = useLocation();

  // Token yoksa login'e yönlendir
  if (!token) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // Roller verilmişse ve kullanıcı rolü bu listede değilse yetkisiz sayfasına yönlendir
  if (roles && !roles.includes(String(user.role).toLowerCase())) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Erişim serbest
  return children;
}