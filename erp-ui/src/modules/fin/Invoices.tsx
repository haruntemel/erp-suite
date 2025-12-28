import { useEffect, useState } from "react";
import axios from "axios";

export default function InvoicesPage() {
  const [permissions, setPermissions] = useState<any[]>([]);

  useEffect(() => {
    axios.get("/api/me/permissions").then(res => {
      setPermissions(res.data);
    });
  }, []);

  const hasPermission = (module: string, page: string, action: string) => {
    return permissions.some(
      p => p.module === module && p.page === page && p.action === action
    );
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">💰 Fatura Sayfası</h1>

      {/* Görüntüleme izni varsa listeyi göster */}
      {hasPermission("fin", "invoices", "view") ? (
        <div className="border p-2">
          <p>Fatura listesi burada...</p>
        </div>
      ) : (
        <p className="text-red-500">Bu sayfayı görüntüleme yetkiniz yok.</p>
      )}

      {/* Düzenleme izni varsa buton göster */}
      {hasPermission("fin", "invoices", "edit") && (
        <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded">
          Fatura Düzenle
        </button>
      )}

      {/* Silme izni varsa buton göster */}
      {hasPermission("fin", "invoices", "delete") && (
        <button className="mt-4 bg-red-600 text-white px-4 py-2 rounded">
          Fatura Sil
        </button>
      )}
    </div>
  );
}