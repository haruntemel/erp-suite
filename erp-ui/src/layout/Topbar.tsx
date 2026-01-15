import { useLocation, useNavigate } from "react-router-dom";
import { HomeIcon } from "@heroicons/react/24/outline";
import { logout } from "../services/auth"; // ✅ logout fonksiyonunu import ediyoruz

const pathLabels: Record<string, string> = {
  enterp: "Uygulama Temel Kurgu",
  sales: "Satış",
  invent: "Stok",
  fin: "Finans",
  company: "Şirket",
  orders: "Satış Siparişi",
  quotes: "Satış Teklifi",
  customer: "Müşteri", // DÜZELTİLDİ: customers -> customer
  warehouse: "Depo Yönetimi",
  invoices: "Fatura",
};

export default function Topbar() {
  const location = useLocation();
  const navigate = useNavigate();

  const segments = location.pathname.split("/").filter(Boolean);
  const breadcrumb = segments.map(seg => pathLabels[seg] || seg).join(" \\ ");

  const handleLogout = () => {
    // Basitçe logout fonksiyonunu çağır
    logout();
  };

  return (
    <header
      className="
        w-full
        bg-gray-200 border-b border-gray-300
        px-4 py-2
        flex items-center justify-between
      "
    >
      {/* Sol tarafta Home ikonu */}
      <button
        onClick={() => navigate("/")}
        className="m-2 p-2 w-10 h-10 flex items-center justify-center bg-red-600 rounded hover:bg-red-500"
      >
        <HomeIcon
          style={{ width: "13px", height: "13px" }}
          className="flex-shrink-0 text-black"
        />
      </button>

      {/* Ortada breadcrumb */}
      {segments.length > 0 && (
        <div className="text-gray-700 font-medium">{breadcrumb}</div>
      )}

      {/* SAĞ TARAFTA OTOMATİK KAPATMA BUTONU */}
      <button
        onClick={handleLogout}
        className="
          m-2 p-2 
          bg-red-600 text-white 
          rounded hover:bg-red-700
          text-sm font-medium
          transition-colors duration-200
        "
      >
        Çıkış Yap
      </button>
    </header>
  );
}