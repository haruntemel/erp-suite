import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  // Token kontrolü
  const token = localStorage.getItem('token');
  
  // DEBUG: Console'a yaz
  console.log('🔐 ProtectedRoute - Token check:', token ? '✓ EXISTS' : '✗ MISSING');
  
  // Token yoksa login sayfasına yönlendir
  if (!token) {
    console.warn('⚠️ No token found, redirecting to /login');
    return <Navigate to="/login" replace />;
  }
  
  // Token varsa içeriği göster
  console.log('✅ Access granted, rendering children');
  return <>{children}</>;
}