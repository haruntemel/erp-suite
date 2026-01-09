import { useState, useEffect } from "react";
import axios from "axios";

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

// GeneralTab bileşeni
const GeneralTab = () => {
  const [formData, setFormData] = useState({
    company: "COMP001",
    name: "Demo Şirket A.Ş.",
    association_no: "1234567890",
    default_language: "tr",
    logotype: "company-logo.png",
    corporate_form: "as",
    country: "TR",
    localization_country: "TR"
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="space-y-4">
      <div className="form-grid">
        {/* Sol Kolon */}
        <div className="form-column">
          <div className="form-group">
            <label className="form-label">Company Code</label>
            <input
              type="text"
              name="company"
              value={formData.company}
              onChange={handleInputChange}
              className="form-input"
              placeholder="COMP001"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Company Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="form-input"
              placeholder="Şirket Adı"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Association No</label>
            <input
              type="text"
              name="association_no"
              value={formData.association_no}
              onChange={handleInputChange}
              className="form-input"
              placeholder="1234567890"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Default Language</label>
            <select
              name="default_language"
              value={formData.default_language}
              onChange={handleInputChange}
              className="form-select"
            >
              <option value="tr">Türkçe</option>
              <option value="en">English</option>
              <option value="de">Deutsch</option>
            </select>
          </div>
        </div>

        {/* Sağ Kolon */}
        <div className="form-column">
          <div className="form-group">
            <label className="form-label">Corporate Form</label>
            <select
              name="corporate_form"
              value={formData.corporate_form}
              onChange={handleInputChange}
              className="form-select"
            >
              <option value="">Select</option>
              <option value="as">Anonim Şirket</option>
              <option value="ltd">Limited Şirket</option>
              <option value="koop">Kooperatif</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Country</label>
            <select
              name="country"
              value={formData.country}
              onChange={handleInputChange}
              className="form-select"
            >
              <option value="TR">Türkiye</option>
              <option value="DE">Almanya</option>
              <option value="US">ABD</option>
              <option value="GB">İngiltere</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Localization Country</label>
            <select
              name="localization_country"
              value={formData.localization_country}
              onChange={handleInputChange}
              className="form-select"
            >
              <option value="TR">Türkiye</option>
              <option value="DE">Almanya</option>
              <option value="US">ABD</option>
              <option value="GB">İngiltere</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Logotype</label>
            <div className="upload-group">
              <input
                type="text"
                name="logotype"
                value={formData.logotype}
                onChange={handleInputChange}
                className="form-input"
                placeholder="logo.png"
              />
              <button className="upload-btn">
                <i className="fas fa-upload"></i>
                <span>Upload</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// AddressTab bileşeni
const AddressTab = () => {
  const [addressData, setAddressData] = useState({
    address_line1: "1234 İş Merkezi Sokak",
    address_line2: "No: 56 Kat: 7",
    city: "İstanbul",
    postal_code: "34000",
    phone: "+90 212 123 45 67",
    email: "info@sirket.com",
    website: "www.sirket.com"
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAddressData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="space-y-4">
      <div className="form-grid">
        <div className="form-column">
          <div className="form-group">
            <label className="form-label">Address Line 1</label>
            <input
              type="text"
              name="address_line1"
              value={addressData.address_line1}
              onChange={handleInputChange}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Address Line 2</label>
            <input
              type="text"
              name="address_line2"
              value={addressData.address_line2}
              onChange={handleInputChange}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">City</label>
            <input
              type="text"
              name="city"
              value={addressData.city}
              onChange={handleInputChange}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Postal Code</label>
            <input
              type="text"
              name="postal_code"
              value={addressData.postal_code}
              onChange={handleInputChange}
              className="form-input"
            />
          </div>
        </div>

        <div className="form-column">
          <div className="form-group">
            <label className="form-label">Phone</label>
            <input
              type="text"
              name="phone"
              value={addressData.phone}
              onChange={handleInputChange}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="email"
              name="email"
              value={addressData.email}
              onChange={handleInputChange}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Website</label>
            <input
              type="text"
              name="website"
              value={addressData.website}
              onChange={handleInputChange}
              className="form-input"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const tabs = ["General", "Address"];

export default function CompanyPage() {
  const [activeTab, setActiveTab] = useState("General");
  const [companies, setCompanies] = useState<Company[]>([
    { company: "COMP001", name: "Demo Şirket A.Ş.", association_no: "1234567890", default_language: "tr", corporate_form: "as", country: "TR", localization_country: "TR" },
    { company: "COMP002", name: "Test Ltd. Şti.", association_no: "9876543210", default_language: "en", corporate_form: "ltd", country: "TR", localization_country: "TR" }
  ]);

  const handleSave = () => {
    console.log("Kaydet butonuna basıldı");
  };

  return (
    <div className="main-content full-width-page">
      {/* Header Card */}
      <div className="card full-width-card">
        <div className="card-header">
          <div className="card-icon" style={{ backgroundColor: "#38bdf8" }}>
            <i className="fas fa-building"></i>
          </div>
          <div className="card-title">Şirket Tanımları</div>
          <button
            onClick={handleSave}
            className="save-btn"
          >
            <i className="fas fa-save"></i>
            <span>Kaydet</span>
          </button>
        </div>
        <div className="status-message">
          Şirket bilgilerini düzenleyin ve kaydedin. Tüm alanlar zorunludur.
        </div>
      </div>

      {/* Company List Card */}
      <div className="card full-width-card">
        <div className="card-header">
          <div className="card-icon" style={{ backgroundColor: "#10b981" }}>
            <i className="fas fa-list"></i>
          </div>
          <div className="card-title">Şirket Listesi</div>
        </div>
        <div className="table-container">
          <table className="debug-table full-width-table">
            <thead>
              <tr>
                <td className="debug-label">Company</td>
                <td className="debug-label">Name</td>
                <td className="debug-label">Association No</td>
              </tr>
            </thead>
            <tbody>
              {companies.map((c) => (
                <tr key={c.company}>
                  <td className="debug-value">{c.company}</td>
                  <td className="debug-value">{c.name}</td>
                  <td className="debug-value">{c.association_no || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Tabs Card */}
      <div className="card full-width-card">
        {/* Tab Headers */}
        <div className="tabs-header">
          {tabs.map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`tab-button ${isActive ? 'tab-active' : 'tab-inactive'}`}
              >
                <div className="tab-content">
                  {tab === "General" && <i className="fas fa-cog"></i>}
                  {tab === "Address" && <i className="fas fa-map-marker-alt"></i>}
                  <span>{tab}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="tabs-content">
          {activeTab === "General" && <GeneralTab />}
          {activeTab === "Address" && <AddressTab />}
        </div>
      </div>

      {/* Inline CSS for full-width layout */}
      <style jsx>{`
        .full-width-page {
          width: 100%;
          max-width: 100%;
          padding: 20px;
          margin: 0;
          box-sizing: border-box;
        }

        .full-width-card {
          width: 100%;
          margin-bottom: 20px;
          box-sizing: border-box;
        }

        .full-width-table {
          width: 100%;
          table-layout: fixed;
        }

        .full-width-table td {
          word-wrap: break-word;
          overflow-wrap: break-word;
        }

        /* Responsive grid */
        .form-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 20px;
        }

        @media (min-width: 768px) {
          .form-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        .form-column {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
        }

        .form-label {
          display: block;
          margin-bottom: 5px;
          font-weight: 500;
          font-size: 0.9rem;
          color: #94a3b8;
        }

        .form-input, .form-select {
          width: 100%;
          padding: 10px 12px;
          background-color: rgba(30, 41, 59, 0.8);
          border: 1px solid #334155;
          border-radius: 8px;
          color: #f1f5f9;
          font-size: 0.9rem;
          box-sizing: border-box;
        }

        .form-input:focus, .form-select:focus {
          outline: none;
          border-color: #38bdf8;
          box-shadow: 0 0 0 2px rgba(56, 189, 248, 0.2);
        }

        .form-select {
          appearance: none;
          background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%2394a3b8' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
          background-position: right 0.5rem center;
          background-repeat: no-repeat;
          background-size: 1em 1em;
        }

        .upload-group {
          display: flex;
          gap: 10px;
        }

        .upload-btn {
          padding: 10px 15px;
          background-color: rgba(30, 41, 59, 0.8);
          border: 1px solid #334155;
          border-radius: 8px;
          color: #94a3b8;
          font-size: 0.9rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 5px;
          white-space: nowrap;
        }

        .upload-btn:hover {
          border-color: #38bdf8;
          color: #38bdf8;
        }

        .save-btn {
          background: linear-gradient(135deg, #0ea5e9 0%, #0369a1 100%);
          color: white;
          border: none;
          border-radius: 8px;
          padding: 10px 20px;
          font-size: 0.9rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          margin-left: auto;
        }

        .save-btn:hover {
          background: linear-gradient(135deg, #0284c7 0%, #075985 100%);
        }

        .tabs-header {
          display: flex;
          border-bottom: 1px solid #334155;
        }

        .tab-button {
          flex: 1;
          padding: 12px;
          background: none;
          border: none;
          cursor: pointer;
          font-weight: 600;
          border-bottom: 2px solid transparent;
        }

        .tab-button.tab-active {
          color: #1d4ed8;
          background-color: #f1f5f9;
          border-bottom-color: #2563eb;
        }

        .tab-button.tab-inactive {
          color: #64748b;
        }

        .tab-button:hover {
          background-color: rgba(56, 189, 248, 0.1);
        }

        .tab-content {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .tabs-content {
          padding: 20px 0;
        }

        .table-container {
          overflow-x: auto;
        }

        @media (max-width: 768px) {
          .full-width-page {
            padding: 15px;
          }
          
          .save-btn span {
            display: none;
          }
          
          .tab-button {
            padding: 10px 5px;
            font-size: 0.85rem;
          }
          
          .tab-content span {
            display: none;
          }
        }

        @media (max-width: 480px) {
          .full-width-page {
            padding: 10px;
          }
          
          .card-title {
            font-size: 1.2rem;
          }
          
          .upload-btn span {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}