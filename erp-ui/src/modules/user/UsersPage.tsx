import { useEffect, useState } from "react";
import axios from "axios";
import CreateUserForm from "./CreateUserForm";   

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    axios.get("/api/users").then(res => setUsers(res.data));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">👥 Kullanıcılar</h1>

      <CreateUserForm />

      <table className="mt-6 w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2">ID</th>
            <th className="p-2">Kullanıcı Adı</th>
            <th className="p-2">Rol</th>
            <th className="p-2">Oluşturulma</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.id} className="border-t">
              <td className="p-2">{u.id}</td>
              <td className="p-2">{u.username}</td>
              <td className="p-2">{u.role?.name}</td>
              <td className="p-2">{new Date(u.created_at).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}