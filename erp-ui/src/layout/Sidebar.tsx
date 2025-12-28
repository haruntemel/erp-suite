import { NavLink } from "react-router-dom";
import { useState, useEffect } from "react";
import { FolderIcon, FolderOpenIcon } from "@heroicons/react/24/outline";
import permissions from "../config/permissions.json"; // 👈 JSON’dan çekiyoruz

// JSON’dan modülleri dönüştür
const modules = Object.entries(permissions.modules).map(([key, mod]) => ({
  path: `/${key}`,
  label: mod.label,
  children: Object.entries(mod.pages).map(([pageKey, page]) => ({
    path: `/${key}/${pageKey}`,
    label: page.label,
  })),
}));

export default function Sidebar({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [query, setQuery] = useState("");
  const [openModules, setOpenModules] = useState<string[]>([]);

  const toggleModule = (path: string) => {
    setOpenModules(prev =>
      prev.includes(path) ? prev.filter(p => p !== path) : [...prev, path]
    );
  };

  // Arama sırasında ilgili modülleri otomatik aç
  useEffect(() => {
    if (query) {
      const matchedParents = modules
        .filter(m =>
          m.children?.some(c =>
            c.label.toLowerCase().includes(query.toLowerCase())
          )
        )
        .map(m => m.path);

      setOpenModules(matchedParents);
    }
  }, [query]);

  const filteredModules = modules.filter(
    m =>
      m.label.toLowerCase().includes(query.toLowerCase()) ||
      m.children?.some(c => c.label.toLowerCase().includes(query.toLowerCase()))
  );

  if (!isOpen) return null;

  return (
    <aside className="w-64 bg-gray-900 text-gray-100 border-r border-gray-700 h-screen flex flex-col">
      {/* Üst kısım: Arama + X */}
      <div className="p-4 border-b border-gray-800 flex items-center gap-2">
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Modül ara..."
          className="flex-1 px-2 py-1 rounded bg-gray-800 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring focus:ring-blue-500"
        />
        <button
          onClick={() => {
            setQuery("");
            onClose();
          }}
          className="p-2 w-10 h-10 flex items-center justify-center bg-red-600 text-white rounded hover:bg-red-500"
        >
          X
        </button>
      </div>

      {/* Modül listesi */}
      <nav className="p-4 space-y-1 flex-1 overflow-y-auto">
        {filteredModules.map(m => (
          <div key={m.path}>
            {/* Ana modül */}
            <div
              onClick={() => toggleModule(m.path)}
              className="flex items-center gap-1 cursor-pointer px-3 py-2 rounded-md hover:bg-gray-800 text-gray-300 font-semibold select-none transition-colors"
            >
              {openModules.includes(m.path) ? (
                <FolderOpenIcon
                  style={{ width: "13px", height: "13px" }}
                  className="flex-shrink-0 text-yellow-600"
                />
              ) : (
                <FolderIcon
                  style={{ width: "13px", height: "13px" }}
                  className="flex-shrink-0 text-yellow-600"
                />
              )}
              <span>{m.label}</span>
            </div>

            {/* Alt kırılımlar */}
            {openModules.includes(m.path) && m.children && (
              <div className="ml-9 mt-1 space-y-1">
                {m.children.map(c => (
                  <NavLink
                    key={c.path}
                    to={c.path}
                    className={({ isActive }) =>
                      `block px-3 py-1 rounded-md text-sm ${
                        isActive
                          ? "bg-gray-700 text-white"
                          : "text-gray-400 hover:text-gray-200"
                      }`
                    }
                  >
                    {c.label}
                  </NavLink>
                ))}
              </div>
            )}
          </div>
        ))}

        {filteredModules.length === 0 && (
          <div className="text-sm text-gray-400 text-center py-4">
            Sonuç bulunamadı
          </div>
        )}
      </nav>
    </aside>
  );
}