import { useEffect, useState } from "react";
import axios from "axios";

interface Permission {
  module: string;
  page: string;
  action: string;
}

export function usePermission() {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [role, setRole] = useState<string>("");

  useEffect(() => {
    // Kullanıcı login olduktan sonra backend’den izin seti çekiyoruz
    axios.get("/api/me/permissions").then(res => {
      setPermissions(res.data.permissions); // örn: [{module:"fin", page:"invoices", action:"view"}]
      setRole(res.data.role); // örn: "admin" veya "sales"
    });
  }, []);

  const hasPermission = (module: string, page: string, action?: string) => {
    // Admin her şeye erişebilir
    if (role === "admin") return true;

    return permissions.some(
      p =>
        p.module === module &&
        p.page === page &&
        (action ? p.action === action : true)
    );
  };

  return { hasPermission, role, permissions };
}