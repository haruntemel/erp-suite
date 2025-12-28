import { useState } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { Outlet } from "react-router-dom";

export default function Shell() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Üst bar */}
      <Topbar />

      <div className="flex flex-1">
        {/* Sol bölüm */}
        <div className="relative">
          {/* Sidebar kapalıyken gizleme (☰) butonu */}
          {!sidebarOpen && (
            <button
              onClick={() => setSidebarOpen(true)}
              className="m-2 p-2 w-10 h-10 flex items-center justify-center bg-gray-900 text-white rounded hover:bg-gray-800"
            >
              ☰
            </button>
          )}

          {/* Sidebar */}
          <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        </div>

        {/* Sağ içerik */}
        <div className="flex-1 flex flex-col">
          <main className="flex-1 p-6 overflow-auto">
            <div className="bg-white rounded-lg shadow p-6">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}