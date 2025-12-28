import { useState } from "react";
import { login } from "../../services/auth";

export default function LoginForm() {
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("12345");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      console.log("🔄 Attempting login...");
      
      const data = await login(username, password);
      
      // Token'ı kaydet
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      
      console.log("✅ Login successful! Token saved.");
      console.log("User:", data.user);
      
      // Ana sayfaya yönlendir (DİKKAT: /dashboard DEĞİL, /)
      window.location.href = "/";
      
    } catch (err: any) {
      console.error("❌ Login error:", err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h1 className="text-2xl font-bold text-center mb-6">ERP Suite</h1>
        
        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 rounded text-sm">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Kullanıcı Adı</label>
            <input
              className="w-full px-3 py-2 border rounded"
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Şifre</label>
            <input
              type="password"
              className="w-full px-3 py-2 border rounded"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>
          
          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded disabled:opacity-50"
          >
            {loading ? "Giriş Yapılıyor..." : "Giriş Yap"}
          </button>
        </form>
        
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>Test: <span className="font-mono">admin / 12345</span></p>
          <p className="mt-1">Backend: <span className="font-mono">http://localhost:5217</span></p>
        </div>
      </div>
    </div>
  );
}