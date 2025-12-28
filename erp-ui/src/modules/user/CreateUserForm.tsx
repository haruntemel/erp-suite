import { useState } from "react";
import axios from "axios";

export default function CreateUserForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [roleId, setRoleId] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await axios.post("/api/users/create", {
      username,
      password,
      roleId: parseInt(roleId),
    });
    setUsername("");
    setPassword("");
    setRoleId("");
    alert("Kullanıcı oluşturuldu!");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium">Kullanıcı Adı</label>
        <input
          value={username}
          onChange={e => setUsername(e.target.value)}
          className="border px-2 py-1 w-full"
        />
      </div>
      <div>
        <label className="block text-sm font-medium">Şifre</label>
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="border px-2 py-1 w-full"
        />
      </div>
      <div>
        <label className="block text-sm font-medium">Rol ID</label>
        <input
          value={roleId}
          onChange={e => setRoleId(e.target.value)}
          className="border px-2 py-1 w-full"
        />
      </div>
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
        Kaydet
      </button>
    </form>
  );
}