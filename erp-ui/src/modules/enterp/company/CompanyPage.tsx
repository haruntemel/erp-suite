import { useState, useEffect } from "react";
import axios from "axios";
import { ArrowDownTrayIcon } from "@heroicons/react/24/outline"; 

import GeneralTab from "./tabs/GeneralTab";
import AddressTab from "./tabs/AddressTab";

interface Company {
  company: string;
  name: string;
  association_no?: string;
  default_language: string;
  logotype?: string;
  corporate_form?: string;
  country: string;
  localization_country: string;
}

const tabs = ["General", "Address"];

export default function CompanyPage() {
  const [activeTab, setActiveTab] = useState("General");
  const [companies, setCompanies] = useState<Company[]>([]);

  useEffect(() => {
    axios.get("/api/company").then((res) => setCompanies(res.data));
  }, []);

  const handleSave = () => {
    console.log("Kaydet butonuna basıldı");
    // Burada backend'e POST isteği yapılabilir
  };

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-lg">
              <i className="building text-blue-600 dark:text-blue-400 text-xl"></i>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Şirket Tanımları
              </h1>
            </div>
          </div>
        </div>
		</div>
 <button
          onClick={handleSave}
          className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-lg font-medium transition-colors duration-200 shadow-md hover:shadow-lg"
          style={{ 
            display: 'flex', 
            alignItems: 'center'
          }}
        >
          {/* Font Awesome Disket İkonu - Shell.tsx'teki gibi */}
          <i className="fas fa-save text-lg"></i>
        </button>
      {/* Tablo sadece company, name, association_no */}
      <table className="table-auto w-full border mb-6">
        <thead>
          <tr>
            <th className="border px-4 py-2">Company</th>
            <th className="border px-4 py-2">Name</th>
            <th className="border px-4 py-2">Association No</th>
          </tr>
        </thead>
        <tbody>
          {companies.map((c) => (
            <tr key={c.company}>
              <td className="border px-4 py-2">{c.company}</td>
              <td className="border px-4 py-2">{c.name}</td>
              <td className="border px-4 py-2">{c.association_no || "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Sekme başlıkları */}
      <div className="flex border-b mb-4">
        {tabs.map((tab) => {
          const isActive = activeTab === tab;
          return (
            <div
              key={tab}
              onClick={() => setActiveTab(tab)}
			  
              className={`flex-1 text-center cursor-pointer px-6 py-3 rounded-md text-sm font-semibold transition-all duration-200 cursor-pointer ${
                isActive ? "tab-active" : "tab-inactive hover:text-gray-200 hover:bg-gray-800/50"
				
				
              }`}
            >
              <div className="w-1 h-1 rounded-full bg-current opacity-60"></div>
              <span>{tab}</span>
            </div>
          );
        })}
      </div>

      {/* Sekme içerikleri */}
      {activeTab === "General" && <GeneralTab />}
      {activeTab === "Address" && <AddressTab />}
    </div>
  );
}