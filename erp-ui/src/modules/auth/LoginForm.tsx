import { useState } from "react";
import { login } from "../../services/auth";

export default function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = await login(username, password);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      window.location.href = "/dashboard";
    } catch {
      alert("Giriş başarısız. Bilgileri kontrol edin.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-sm p-6">
      <div>
        <label className="block text-sm font-medium">Kullanıcı Adı</label>
        <input
          className="border px-2 py-1 w-full"
          value={username}
          onChange={e => setUsername(e.target.value)}
        />
      </div>
      <div>
        <label className="block text-sm font-medium">Şifre</label>
        <input
          type="password"
          className="border px-2 py-1 w-full"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
      </div>
      <button className="bg-blue-600 text-white px-4 py-2 rounded">Giriş Yap</button>
    </form>
  );
}