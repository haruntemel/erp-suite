import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  HomeIcon, 
  ArrowRightOnRectangleIcon, 
  UserCircleIcon,
  ChevronDownIcon,
  Cog6ToothIcon,
  ShieldCheckIcon
} from "@heroicons/react/24/outline";
import { logout, getUser } from "../services/auth";

export default function TopbarWithDropdown() {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentUser = getUser();

  // 🔹 isAdmin fonksiyonu eklendi
  const isAdmin = () => {
    return currentUser?.role?.toLowerCase() === "admin";
  };

  // Dropdown dışına tıklanınca kapat
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    if (window.confirm("Çıkış yapmak istediğinize emin misiniz?")) {
      logout();
    }
  };

  const menuItems = [
    { icon: <UserCircleIcon className="w-4 h-4" />, label: "Profilim", onClick: () => navigate("/profile") },
    { icon: <Cog6ToothIcon className="w-4 h-4" />, label: "Ayarlar", onClick: () => navigate("/settings") },
    ...(isAdmin() ? [
      { icon: <ShieldCheckIcon className="w-4 h-4" />, label: "Admin Paneli", onClick: () => navigate("/admin") }
    ] : []),
    { type: "divider" },
    { icon: <ArrowRightOnRectangleIcon className="w-4 h-4" />, label: "Çıkış Yap", onClick: handleLogout, danger: true }
  ];

  return (
    <header className="w-full bg-gray-800 border-b border-gray-700 px-6 py-3 flex items-center justify-between">
      {/* Sol taraf */}
      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate("/")}
          className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <HomeIcon className="w-5 h-5" />
        </button>
        <span className="text-gray-300 text-sm font-medium">ERP Suite</span>
      </div>

      {/* Sağ taraf - Dropdown */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="flex items-center space-x-2 px-3 py-2 bg-gray-700 rounded-lg hover:bg-gray-600"
        >
          <UserCircleIcon className="w-5 h-5 text-gray-300" />
          <div className="text-left">
            <div className="text-sm text-gray-200 font-medium">{currentUser?.username || "Kullanıcı"}</div>
            <div className="text-xs text-gray-400">{isAdmin() ? "Admin" : "Kullanıcı"}</div>
          </div>
          <ChevronDownIcon className={`w-4 h-4 text-gray-400 transition-transform ${dropdownOpen ? "rotate-180" : ""}`} />
        </button>

        {/* Dropdown menü */}
        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-lg border border-gray-700 py-1 z-50">
            {menuItems.map((item, index) =>
              item.type === "divider" ? (
                <div key={index} className="border-t border-gray-700 my-1"></div>
              ) : (
                <button
                  key={index}
                  onClick={() => {
                    item.onClick?.();
                    setDropdownOpen(false);
                  }}
                  className={`
                    w-full flex items-center space-x-2 px-4 py-2 text-sm
                    ${item.danger 
                      ? "text-red-400 hover:bg-red-900/20 hover:text-red-300" 
                      : "text-gray-300 hover:bg-gray-700 hover:text-white"
                    }
                  `}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              )
            )}
          </div>
        )}
      </div>
    </header>
  );
}