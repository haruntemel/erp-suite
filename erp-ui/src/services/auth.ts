import api from "../api";

export async function login(username: string, password: string) {
  console.log(`🔐 Login attempt for user: ${username}`);
  
  try {
    const response = await api.post("/auth/login", { 
      username, 
      password 
    });
    
    console.log('✅ Login successful, token received');
    return response.data; // { token, user }
  } catch (error: any) {
    console.error('❌ Login failed:', error.response?.data || error.message);
    
    // Kullanıcı dostu hata mesajları
    if (error.response?.status === 401) {
      throw new Error("Kullanıcı adı veya şifre hatalı");
    } else if (error.message.includes('Network Error')) {
      throw new Error("Sunucuya bağlanılamıyor. Backend çalışıyor mu?");
    } else {
      throw new Error("Giriş yapılamadı");
    }
  }
}

export function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.location.href = "/login";
}

export function getToken() {
  return localStorage.getItem("token");
}

export function getUser() {
  const userStr = localStorage.getItem("user");
  return userStr ? JSON.parse(userStr) : null;
}