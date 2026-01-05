import api from "../api";

// Login fonksiyonu
export async function login(username: string, password: string) {
  try {
    const response = await api.post("/auth/login", { username, password });
    return response.data;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
}

// 🔥 KESİN ÇALIŞAN LOGOUT FONKSİYONU
export function logout(): void {
  try {
    // Tüm auth verilerini temizle
    localStorage.clear(); // Tüm localStorage'ı temizler
    
    // Alternatif: Sadece auth ile ilgili olanları temizle
    // localStorage.removeItem("token");
    // localStorage.removeItem("user");
    // sessionStorage.clear();
    
    console.log("✅ Logout successful, redirecting to login...");
    
    // Login sayfasına yönlendir
    window.location.href = "/login";
    
    // Sayfanın cache'lenmemesi için
    window.location.replace("/login");
    
  } catch (error) {
    console.error("Logout error:", error);
    // Yine de login sayfasına git
    window.location.href = "/login";
  }
}

// Diğer fonksiyonlar...
export function getToken() {
  return localStorage.getItem("token");
}

export function getUser() {
  const userStr = localStorage.getItem("user");
  try {
    return userStr ? JSON.parse(userStr) : null;
  } catch {
    return null;
  }
}