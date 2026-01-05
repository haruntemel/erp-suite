// src/contexts/AuthContext.tsx
import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

interface User {
  id: number;
  username: string;
  email?: string;
  role: string;
  name?: string;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Uygulama başladığında localStorage'dan kullanıcıyı yükle
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        const savedUser = localStorage.getItem('user');
        
        console.log("🔐 Auth check - Token:", token ? "var" : "yok");
        
        if (token && savedUser) {
          // Token'ı validate et (opsiyonel - backend'de doğrulama yapabilirsiniz)
          const userData = JSON.parse(savedUser);
          console.log("✅ User loaded from localStorage:", userData);
          setUser(userData);
          
          // Token hala geçerli mi kontrol et
          try {
            const response = await fetch('http://localhost:5000/api/auth/validate', {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            });
            
            if (!response.ok) {
              throw new Error('Token geçersiz');
            }
          } catch (error) {
            console.log("❌ Token expired, logging out");
            logout();
          }
        } else {
          console.log("❌ No auth found");
          setUser(null);
        }
      } catch (error) {
        console.error("Auth check error:", error);
        logout();
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (username: string, password: string) => {
    console.log("🔐 Login attempt to backend:", username);
    
    try {
      // Backend'e login isteği gönder
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Giriş başarısız');
      }

      console.log("✅ Login successful:", data.user);
      
      // Token ve kullanıcı bilgilerini kaydet
      const { token, user: userData } = data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      
      setUser(userData);
      
    } catch (error: any) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const logout = () => {
    console.log("🔐 Logout");
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // İsterseniz backend'de de logout yapabilirsiniz
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};