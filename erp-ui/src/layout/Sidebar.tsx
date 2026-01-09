import { NavLink, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { 
  FolderIcon, 
  FolderOpenIcon,
  ChevronRightIcon,
  ChevronDownIcon,
  XMarkIcon
} from "@heroicons/react/24/outline";

// JSON'dan gelen modüller için tip
interface ModuleData {
  label: string;
  pages: Record<string, { label: string; actions?: string[] }>;
}

// Statik modüller (JSON'dan gelecek ama şimdilik burada)
const staticModules: Record<string, ModuleData> = {
  enterp: {
    label: "Uygulama Temel Kurgu",
    pages: {
      company: { label: "Şirket", actions: ["view", "create", "edit"] }
    }
  },
  sales: {
    label: "Satış",
    pages: {
      orders: { label: "Satış Siparişi", actions: ["view", "create", "edit"] },
      quotes: { label: "Satış Teklifi", actions: ["view", "create"] },
      customers: { label: "Müşteriler", actions: ["view", "create", "edit"] },
      invoices: { label: "Satış Faturaları", actions: ["view", "create"] }
    }
  },
  invent: {
    label: "Stok",
    pages: {
      warehouse: { label: "Depo Yönetimi", actions: ["view", "edit"] },
      products: { label: "Ürünler", actions: ["view", "create", "edit"] },
      inventory: { label: "Stok Takip", actions: ["view", "edit"] },
      transfers: { label: "Transferler", actions: ["view", "create"] }
    }
  },
  fin: {
    label: "Finans",
    pages: {
      invoices: { label: "Fatura", actions: ["view", "create", "edit"] },
      payments: { label: "Ödemeler", actions: ["view", "create"] },
      reports: { label: "Finansal Raporlar", actions: ["view"] },
      accounts: { label: "Hesaplar", actions: ["view", "edit"] }
    }
  },
  user: {
    label: "Kullanıcı",
    pages: {
      users: { label: "Kullanıcılar", actions: ["view", "create", "edit", "delete"] },
      roles: { label: "Roller", actions: ["view", "edit"] },
      permissions: { label: "İzinler", actions: ["view", "edit"] },
      logs: { label: "Kullanıcı Logları", actions: ["view"] }
    }
  }
};

// Modülleri dönüştür
const modules = Object.entries(staticModules).map(([key, mod]) => ({
  key,
  path: `/${key}`,
  label: mod.label,
  icon: <FolderIcon className="w-4 h-4" />,
  children: Object.entries(mod.pages).map(([pageKey, page]) => ({
    key: pageKey,
    path: `/${key}/${pageKey}`,
    label: page.label,
    icon: <ChevronRightIcon className="w-3 h-3" />
  }))
}));

export default function Sidebar({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const location = useLocation();
  const [query, setQuery] = useState("");
  const [openModules, setOpenModules] = useState<string[]>([modules[0]?.key || ""]);
  const [filteredModules, setFilteredModules] = useState(modules);

  // Arama yapıldığında filtrele
  useEffect(() => {
    if (!query.trim()) {
      setFilteredModules(modules);
      return;
    }

    const searchTerm = query.toLowerCase();
    const filtered = modules.filter(module =>
      module.label.toLowerCase().includes(searchTerm) ||
      module.children.some(child => 
        child.label.toLowerCase().includes(searchTerm)
      )
    );

    setFilteredModules(filtered);
    
    // Eşleşen modülleri aç
    const matchedModules = filtered.map(m => m.key);
    setOpenModules(prev => [...new Set([...prev, ...matchedModules])]);
  }, [query]);

  // Sayfa değiştiğinde ilgili modülü aç
  useEffect(() => {
    const currentPath = location.pathname;
    const moduleKey = currentPath.split('/')[1];
    if (moduleKey && !openModules.includes(moduleKey)) {
      setOpenModules(prev => [...prev, moduleKey]);
    }
  }, [location.pathname]);

  const toggleModule = (key: string) => {
    setOpenModules(prev =>
      prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
    );
  };

  if (!isOpen) return null;

  return (
    <aside className="w-64 bg-gray-900 text-gray-100 border-r border-gray-700 h-screen flex flex-col fixed left-0 top-0 z-50 shadow-xl">
      {/* Header - Arama ve Kapat */}
      <div className="p-4 border-b border-gray-800 flex items-center gap-2 bg-gray-950">
        <div className="relative flex-1">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search modules..."
            className="w-full px-4 py-2 pl-10 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-2 w-10 h-10 flex items-center justify-center bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
          aria-label="Kapat"
        >
          <XMarkIcon className="w-5 h-5" />
        </button>
      </div>

      {/* Modül Listesi */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-1">
        {filteredModules.length > 0 ? (
          filteredModules.map((module) => (
            <div key={module.key} className="mb-2">
              {/* Ana Modül */}
              <div
                onClick={() => toggleModule(module.key)}
                className={`flex items-center gap-3 cursor-pointer px-3 py-3 rounded-lg transition-all duration-200 ${
                  openModules.includes(module.key)
                    ? 'bg-blue-900/20 text-blue-300'
                    : 'hover:bg-gray-800 text-gray-300'
                }`}
              >
                {openModules.includes(module.key) ? (
                  <FolderOpenIcon className="w-5 h-5 text-yellow-500 flex-shrink-0" />
                ) : (
                  <FolderIcon className="w-5 h-5 text-yellow-500 flex-shrink-0" />
                )}
                <span className="font-medium flex-1">{module.label}</span>
                {openModules.includes(module.key) ? (
                  <ChevronDownIcon className="w-4 h-4 text-gray-500" />
                ) : (
                  <ChevronRightIcon className="w-4 h-4 text-gray-500" />
                )}
              </div>

              {/* Alt Sayfalar */}
              {openModules.includes(module.key) && module.children.length > 0 && (
                <div className="ml-8 mt-1 space-y-1 border-l border-gray-700 pl-3">
                  {module.children.map((child) => {
                    const isActive = location.pathname === child.path;
                    return (
                      <NavLink
                        key={child.key}
                        to={child.path}
                        onClick={onClose}
                        className={`
                          flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-all duration-200
                          ${isActive
                            ? 'bg-blue-900/30 text-blue-300 border-l-2 border-blue-500'
                            : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/50'
                          }
                        `}
                      >
                        <div className="w-1 h-1 rounded-full bg-current opacity-60"></div>
                        <span>{child.label}</span>
                      </NavLink>
                    );
                  })}
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <div className="text-gray-400 mb-2">
              "{query}" için sonuç bulunamadı
            </div>
            <div className="text-sm text-gray-600">
              Sadece: Satış, Stok, Finans, Kullanıcı
            </div>
          </div>
        )}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-800 bg-gray-950">
        <div className="text-xs text-gray-500">
          <div className="flex justify-between items-center">
            <span className="font-medium text-gray-400">ERP Suite</span>
            <span className="px-2 py-1 bg-green-900/30 text-green-400 rounded-full text-xs">
              {modules.length} modül
            </span>
          </div>
          <div className="text-[11px] text-gray-600 mt-2">
            <span className="text-gray-500">Aktif: </span>
            {modules.map(m => m.label).join(", ")}
          </div>
        </div>
      </div>
    </aside>
  );
}