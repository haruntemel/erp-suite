import { useState } from "react";
import SearchList from "../../../components/SearchList";
import { ChevronRightIcon } from "@heroicons/react/24/outline";

interface Company {
  id: number;
  company: string;
  name: string;
  association_no?: string;
  default_language: string;
  logotype?: string;
  corporate_form?: string;
  country: string;
  localization_country: string;
}

// GeneralTab bileşeni - SADECE DİĞER ALANLAR
const GeneralTab = ({ selectedCompany }: { selectedCompany: Company | null }) => {
  const [formData, setFormData] = useState({
    default_language: selectedCompany?.default_language || "tr",
    logotype: selectedCompany?.logotype || "",
    corporate_form: selectedCompany?.corporate_form || "",
    country: selectedCompany?.country || "TR",
    localization_country: selectedCompany?.localization_country || "TR"
  });

  // Seçili şirket değiştiğinde formData'yı güncelle
  useState(() => {
    if (selectedCompany) {
      setFormData({
        default_language: selectedCompany.default_language || "tr",
        logotype: selectedCompany.logotype || "",
        corporate_form: selectedCompany.corporate_form || "",
        country: selectedCompany.country || "TR",
        localization_country: selectedCompany.localization_country || "TR"
      });
    }
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div style={{ padding: "15px 0", minHeight: "250px" }}>
      <div style={{ 
        display: "grid", 
        gridTemplateColumns: "1fr", 
        gap: "15px" 
      }}>
        {selectedCompany ? (
          <>
            {/* İlk Satır */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "15px" }}>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <label style={{ marginBottom: "5px", color: "#f1f5f9", fontSize: "0.9rem" }}>Default Language</label>
                <select
                  name="default_language"
                  value={formData.default_language}
                  onChange={handleInputChange}
                  style={{
                    padding: "10px",
                    backgroundColor: "rgba(30, 41, 59, 0.8)",
                    border: "1px solid #334155",
                    borderRadius: "6px",
                    color: "#f1f5f9",
                    fontSize: "0.9rem"
                  }}
                >
                  <option value="tr">Turkish</option>
                  <option value="en">English</option>
                  <option value="de">German</option>
                  <option value="fr">French</option>
                  <option value="es">Spanish</option>
                  <option value="ar">Arabic</option>
                </select>
              </div>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <label style={{ marginBottom: "5px", color: "#f1f5f9", fontSize: "0.9rem" }}>Corporate Form</label>
                <select
                  name="corporate_form"
                  value={formData.corporate_form}
                  onChange={handleInputChange}
                  style={{
                    padding: "10px",
                    backgroundColor: "rgba(30, 41, 59, 0.8)",
                    border: "1px solid #334155",
                    borderRadius: "6px",
                    color: "#f1f5f9",
                    fontSize: "0.9rem"
                  }}
                >
                  <option value="as">Anonim Şirket (A.Ş.)</option>
                  <option value="ltd">Limited Şirket (Ltd. Şti.)</option>
                  <option value="joint">Kollektif Şirket</option>
                  <option value="commandite">Komandit Şirket</option>
                  <option value="cooperative">Kooperatif</option>
                  <option value="branch">Şube</option>
                  <option value="individual">Şahıs Şirketi</option>
                </select>
              </div>
            </div>

            {/* İkinci Satır */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "15px" }}>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <label style={{ marginBottom: "5px", color: "#f1f5f9", fontSize: "0.9rem" }}>Country</label>
                <select
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  style={{
                    padding: "10px",
                    backgroundColor: "rgba(30, 41, 59, 0.8)",
                    border: "1px solid #334155",
                    borderRadius: "6px",
                    color: "#f1f5f9",
                    fontSize: "0.9rem"
                  }}
                >
                  <option value="TR">Türkiye</option>
                  <option value="US">United States</option>
                  <option value="DE">Germany</option>
                  <option value="FR">France</option>
                  <option value="GB">United Kingdom</option>
                  <option value="IT">Italy</option>
                  <option value="ES">Spain</option>
                  <option value="NL">Netherlands</option>
                  <option value="BE">Belgium</option>
                  <option value="CH">Switzerland</option>
                  <option value="AE">United Arab Emirates</option>
                  <option value="SA">Saudi Arabia</option>
                </select>
              </div>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <label style={{ marginBottom: "5px", color: "#f1f5f9", fontSize: "0.9rem" }}>Localization Country</label>
                <select
                  name="localization_country"
                  value={formData.localization_country}
                  onChange={handleInputChange}
                  style={{
                    padding: "10px",
                    backgroundColor: "rgba(30, 41, 59, 0.8)",
                    border: "1px solid #334155",
                    borderRadius: "6px",
                    color: "#f1f5f9",
                    fontSize: "0.9rem"
                  }}
                >
                  <option value="TR">Türkiye</option>
                  <option value="US">United States</option>
                  <option value="DE">Germany</option>
                  <option value="FR">France</option>
                  <option value="GB">United Kingdom</option>
                  <option value="IT">Italy</option>
                  <option value="ES">Spain</option>
                  <option value="NL">Netherlands</option>
                  <option value="BE">Belgium</option>
                  <option value="CH">Switzerland</option>
                  <option value="AE">United Arab Emirates</option>
                  <option value="SA">Saudi Arabia</option>
                </select>
              </div>
            </div>

            {/* Üçüncü Satır - Logotype */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "15px" }}>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <label style={{ marginBottom: "5px", color: "#f1f5f9", fontSize: "0.9rem" }}>Logotype URL</label>
                <input
                  type="text"
                  name="logotype"
                  value={formData.logotype}
                  onChange={handleInputChange}
                  style={{
                    padding: "10px",
                    backgroundColor: "rgba(30, 41, 59, 0.8)",
                    border: "1px solid #334155",
                    borderRadius: "6px",
                    color: "#f1f5f9",
                    fontSize: "0.9rem"
                  }}
                  placeholder="https://example.com/logo.png"
                />
              </div>
              {/* Boş sütun - denge için */}
              <div></div>
            </div>

            {/* Logotype önizleme (eğer URL varsa) */}
            {formData.logotype && (
              <div style={{ display: "flex", flexDirection: "column", marginTop: "10px" }}>
                <label style={{ marginBottom: "5px", color: "#f1f5f9", fontSize: "0.9rem" }}>Logotype Preview</label>
                <div style={{
                  padding: "15px",
                  backgroundColor: "rgba(30, 41, 59, 0.8)",
                  border: "1px solid #334155",
                  borderRadius: "6px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  minHeight: "100px"
                }}>
                  <img 
                    src={formData.logotype} 
                    alt="Company Logo" 
                    style={{
                      maxWidth: "150px",
                      maxHeight: "80px",
                      objectFit: "contain"
                    }}
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                      const parent = (e.target as HTMLImageElement).parentElement;
                      if (parent) {
                        parent.innerHTML = '<div style="color: #94a3b8; text-align: center;"><i class="fas fa-image" style="font-size: 2rem; margin-bottom: 5px;"></i><p>Logo cannot be loaded</p></div>';
                      }
                    }}
                  />
                </div>
              </div>
            )}
          </>
        ) : (
          <div style={{ 
            textAlign: "center", 
            padding: "30px 0", 
            color: "#94a3b8",
            minHeight: "250px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center"
          }}>
            <i className="fas fa-building" style={{ fontSize: "2.5rem", marginBottom: "10px" }}></i>
            <p>Düzenlemek için bir şirket seçin</p>
          </div>
        )}
      </div>
    </div>
  );
};

// AddressTab bileşeni - SABİT YÜKSEKLİK
const AddressTab = ({ selectedCompany }: { selectedCompany: Company | null }) => {
  return (
    <div style={{ padding: "15px 0", minHeight: "250px" }}>
      {selectedCompany ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "15px" }}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <label style={{ marginBottom: "5px", color: "#f1f5f9", fontSize: "0.9rem" }}>Adres</label>
            <input
              type="text"
              style={{
                padding: "10px",
                backgroundColor: "rgba(30, 41, 59, 0.8)",
                border: "1px solid #334155",
                borderRadius: "6px",
                color: "#f1f5f9",
                fontSize: "0.9rem"
              }}
              placeholder="Adres bilgisi"
            />
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <label style={{ marginBottom: "5px", color: "#f1f5f9", fontSize: "0.9rem" }}>Şehir</label>
            <input
              type="text"
              style={{
                padding: "10px",
                backgroundColor: "rgba(30, 41, 59, 0.8)",
                border: "1px solid #334155",
                borderRadius: "6px",
                color: "#f1f5f9",
                fontSize: "0.9rem"
              }}
              placeholder="Şehir"
            />
          </div>
        </div>
      ) : (
        <div style={{ 
          textAlign: "center", 
          padding: "30px 0", 
          color: "#94a3b8",
          minHeight: "250px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center"
        }}>
          <i className="fas fa-map-marker-alt" style={{ fontSize: "2.5rem", marginBottom: "10px" }}></i>
          <p>Adres bilgilerini görmek için bir şirket seçin</p>
        </div>
      )}
    </div>
  );
};

const tabs = ["General", "Address"];

export default function CompanyPage() {
  const [activeTab, setActiveTab] = useState("General");
  
  // SearchList'ten seçilen şirket state'i
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [isSearchListVisible, setIsSearchListVisible] = useState(false);

  // Örnek şirket verileri - SADECE SEARCHLIST İÇİN
  const initialCompanies: Company[] = [
    { id: 1, company: "COMP001", name: "Demo Şirket A.Ş.", association_no: "1234567890", default_language: "tr", logotype: "https://via.placeholder.com/150", corporate_form: "as", country: "TR", localization_country: "TR" },
    { id: 2, company: "COMP002", name: "Test Ltd. Şti.", association_no: "9876543210", default_language: "en", corporate_form: "ltd", country: "TR", localization_country: "TR" },
    { id: 3, company: "COMP003", name: "Global İnşaat A.Ş.", association_no: "4567891230", default_language: "tr", corporate_form: "as", country: "TR", localization_country: "TR" },
    { id: 4, company: "COMP004", name: "Teknoloji Ltd.", association_no: "7891234560", default_language: "en", corporate_form: "ltd", country: "TR", localization_country: "TR" },
    { id: 5, company: "COMP005", name: "Mobilya Üretim A.Ş.", association_no: "3216549870", default_language: "tr", corporate_form: "as", country: "TR", localization_country: "TR" },
  ];

  const [companies, setCompanies] = useState<Company[]>(initialCompanies);

  // Düzenlenen şirket
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);

  const searchListItems = companies.map(company => ({
    id: company.id,
    code: company.company,
    name: company.name,
    description: company.association_no ? `Assoc No: ${company.association_no}` : "No association number",
    originalData: company
  }));

  const handleCompanySelect = (item: any) => {
    const selected = companies.find(c => c.id === item.id);
    if (selected) {
      setSelectedCompany(selected);
    }
  };

  const handleToggleSearchList = () => {
    setIsSearchListVisible(!isSearchListVisible);
  };

  // Şirket silme
  const handleDeleteCompany = (id: number) => {
    if (window.confirm("Bu şirketi silmek istediğinize emin misiniz?")) {
      setCompanies(companies.filter(company => company.id !== id));
      if (selectedCompany?.id === id) {
        setSelectedCompany(null);
      }
    }
  };

  // Şirket düzenleme - SearchList'te seçilen şirketin düzenleme moduna alınması
  const handleEditCompany = (company: Company) => {
    setEditingCompany(company);
    setSelectedCompany(company);
  };

  const handleUpdateCompany = (field: keyof Company, value: string) => {
    if (!editingCompany) return;
    setEditingCompany({ ...editingCompany, [field]: value });
  };

  const handleSaveEdit = () => {
    if (!editingCompany) return;
    setCompanies(companies.map(company => 
      company.id === editingCompany.id ? editingCompany : company
    ));
    setSelectedCompany(editingCompany);
    setEditingCompany(null);
  };

  const handleCancelEdit = () => {
    setEditingCompany(null);
  };

  // Ana kaydet butonu - GeneralTab bilgilerini kaydet
  const handleSave = () => {
    if (!selectedCompany) {
      alert("Lütfen önce bir şirket seçin!");
      return;
    }
    console.log("Değişiklikler kaydedildi:", selectedCompany);
    alert("Değişiklikler kaydedildi!");
  };

  return (
    <div style={{ 
      display: "flex", 
      width: "100%", 
      height: "100vh", 
      overflow: "hidden",
      backgroundColor: "#0f172a" 
    }}>
      {/* SearchList Panel - Sadece görünürse göster */}
      {isSearchListVisible && (
        <SearchList
          title="Şirket Arama"
          items={searchListItems}
          onSelect={handleCompanySelect}
          onToggle={handleToggleSearchList}
          searchFields={["code", "name", "description"]}
          displayFields={["code", "name"]}
          icon="fas fa-building"
          // Otomatik düzenleme modu için prop
          autoEditMode={true}
        />
      )}

      {/* SearchList GİZLİ durumda - Sadece göster butonu */}
      {!isSearchListVisible && (
        <div 
          style={{
            width: "40px",
            height: "calc(100vh - 70px)",
            position: "fixed",
            left: "280px",
            top: "70px",
            backgroundColor: "#1e293b",
            borderRight: "1px solid #334155",
            zIndex: 100,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            paddingTop: "15px"
          }}
        >
          <button
            onClick={handleToggleSearchList}
            style={{
              background: "none",
              border: "none",
              color: "#94a3b8",
              cursor: "pointer",
              padding: "10px",
              width: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "5px"
            }}
          >
            <ChevronRightIcon style={{ width: "20px", height: "20px" }} />
            <span style={{ fontSize: "0.7rem", writingMode: "vertical-rl", transform: "rotate(180deg)" }}>
              Göster
            </span>
          </button>
        </div>
      )}

      {/* Ana içerik */}
      <div 
        style={{ 
          flex: 1,
          display: "flex",
          flexDirection: "column",
          height: "100vh",
          overflow: "hidden",
          padding: "15px",
          paddingTop: "70px",
          transition: "all 0.3s ease",
          backgroundColor: "#0f172a",
          marginLeft: isSearchListVisible ? "320px" : "40px",
          width: isSearchListVisible ? "calc(100vw - 320px)" : "calc(100vw - 40px)",
          borderRight: "1px solid #334155",
          boxSizing: "border-box"
        }}
      >
        {/* Header Card */}
        <div style={{
          background: "#1e293b",
          borderRadius: "12px",
          padding: "20px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
          border: "1px solid #334155",
          display: "flex",
          flexDirection: "column",
          marginBottom: "15px",
          minWidth: "0",
          borderRight: "1px solid #334155"
        }}>
          <div style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "15px",
            paddingBottom: "15px",
            borderBottom: "1px solid #334155",
            flexWrap: "wrap",
            gap: "10px"
          }}>
            <div style={{ 
              backgroundColor: "#38bdf8",
              color: "white",
              width: "36px",
              height: "36px",
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.1rem",
              flexShrink: 0
            }}>
              <i className="fas fa-building"></i>
            </div>
            <div style={{ 
              fontSize: "1.3rem",
              color: "#38bdf8",
              marginLeft: "12px",
              fontWeight: "600",
              flex: 1,
              minWidth: "200px"
            }}>
              Şirket Tanımları
            </div>
            <div style={{ 
              display: "flex", 
              alignItems: "center", 
              gap: "8px", 
              flexWrap: "wrap",
              justifyContent: "flex-end" 
            }}>
              {/* SearchList toggle butonu */}
              <button
                onClick={handleToggleSearchList}
                style={{
                  background: isSearchListVisible ? "#334155" : "#38bdf8",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  padding: "8px 12px",
                  fontSize: "0.8rem",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "5px",
                  transition: "all 0.3s",
                  flexShrink: 0
                }}
              >
                <i className="fas fa-search"></i>
                <span>{isSearchListVisible ? "Listeyi Gizle" : "Listeyi Göster"}</span>
              </button>
              
              {/* Ana kaydet butonu - SADECE ŞİRKET SEÇİLDİĞİNDE AKTİF */}
              <button
                onClick={handleSave}
                disabled={!selectedCompany}
                style={{
                  background: selectedCompany 
                    ? "linear-gradient(135deg, #0ea5e9 0%, #0369a1 100%)" 
                    : "#64748b",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  padding: "8px 15px",
                  fontSize: "0.85rem",
                  cursor: selectedCompany ? "pointer" : "not-allowed",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  flexShrink: 0,
                  opacity: selectedCompany ? 1 : 0.6
                }}
              >
                <i className="fas fa-save"></i>
                <span>Kaydet</span>
              </button>
            </div>
          </div>
          
          {/* Bilgi mesajı */}
          <div style={{
            color: "#94a3b8",
            lineHeight: "1.5",
            padding: "12px",
            backgroundColor: "rgba(30, 41, 59, 0.5)",
            borderRadius: "6px",
            borderLeft: selectedCompany ? "3px solid #10b981" : "3px solid #38bdf8",
            fontSize: "0.85rem"
          }}>
            <div style={{ 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "10px"
            }}>
              <div style={{ display: "flex", alignItems: "center", flex: 1, minWidth: "200px" }}>
                <i className="fas fa-info-circle" style={{ marginRight: "8px" }}></i>
                {selectedCompany 
                  ? `"${selectedCompany.company} - ${selectedCompany.name}" şirketinin bilgilerini düzenleyin.`
                  : "Düzenlemek için soldaki listeden bir şirket seçin."
                }
              </div>
              {selectedCompany && (
                <div style={{ 
                  backgroundColor: "rgba(16, 185, 129, 0.2)", 
                  padding: "4px 8px", 
                  borderRadius: "4px",
                  fontSize: "0.8rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                  flexShrink: 0
                }}>
                  <i className="fas fa-check-circle" style={{ color: "#10b981" }}></i>
                  <span>Seçili: <strong>{selectedCompany.company}</strong></span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* COMPANY CARD - Company Code, Name, Association No - SEÇİLEN ŞİRKET BİLGİLERİ */}
        <div style={{
          background: "#1e293b",
          borderRadius: "12px",
          padding: "20px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
          border: "1px solid #334155",
          display: "flex",
          flexDirection: "column",
          marginBottom: "15px",
          borderRight: "1px solid #334155"
        }}>
          <div style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "15px",
            paddingBottom: "15px",
            borderBottom: "1px solid #334155",
            flexWrap: "wrap",
            gap: "10px"
          }}>
            <div style={{ 
              backgroundColor: "#10b981",
              color: "white",
              width: "36px",
              height: "36px",
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.1rem",
              flexShrink: 0
            }}>
              <i className="fas fa-building"></i>
            </div>
            <div style={{ 
              fontSize: "1.3rem",
              color: "#10b981",
              marginLeft: "12px",
              fontWeight: "600",
              flex: 1,
              minWidth: "200px"
            }}>
              {selectedCompany ? `Şirket Bilgileri - ${selectedCompany.company}` : "Şirket Bilgileri"}
            </div>
          </div>
          
          {/* SEÇİLEN ŞİRKET BİLGİLERİ - EDIT MODE VEYA VIEW MODE */}
          {selectedCompany && (
            <div style={{ 
              backgroundColor: "rgba(30, 41, 59, 0.3)",
              borderRadius: "8px",
              padding: "15px",
              marginBottom: "15px",
              border: "1px solid #334155"
            }}>
              <div style={{ 
                display: "flex", 
                alignItems: "center", 
                justifyContent: "space-between",
                marginBottom: "15px"
              }}>
                <h4 style={{ color: "#f1f5f9", fontSize: "0.95rem", fontWeight: "600" }}>
                  <i className="fas fa-eye" style={{ marginRight: "8px", color: "#38bdf8" }}></i>
                  Seçili Şirket Bilgileri
                </h4>
                <div style={{ display: "flex", gap: "8px" }}>
                  <button
                    onClick={() => handleEditCompany(selectedCompany)}
                    style={{
                      background: "#3b82f6",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      padding: "6px 12px",
                      fontSize: "0.75rem",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "4px"
                    }}
                  >
                    <i className="fas fa-edit"></i>
                    <span>Düzenle</span>
                  </button>
                  <button
                    onClick={() => handleDeleteCompany(selectedCompany.id)}
                    style={{
                      background: "#ef4444",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      padding: "6px 12px",
                      fontSize: "0.75rem",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "4px"
                    }}
                  >
                    <i className="fas fa-trash"></i>
                    <span>Sil</span>
                  </button>
                </div>
              </div>
              
              {editingCompany?.id === selectedCompany.id ? (
                // DÜZENLEME MODU
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "15px" }}>
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <label style={{ marginBottom: "5px", color: "#f1f5f9", fontSize: "0.85rem" }}>Company Code *</label>
                    <input
                      type="text"
                      value={editingCompany.company}
                      onChange={(e) => handleUpdateCompany('company', e.target.value)}
                      style={{
                        width: "100%",
                        padding: "8px 10px",
                        backgroundColor: "rgba(30, 41, 59, 0.8)",
                        border: "1px solid #38bdf8",
                        borderRadius: "4px",
                        color: "#f1f5f9",
                        fontSize: "0.85rem"
                      }}
                    />
                  </div>
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <label style={{ marginBottom: "5px", color: "#f1f5f9", fontSize: "0.85rem" }}>Company Name *</label>
                    <input
                      type="text"
                      value={editingCompany.name}
                      onChange={(e) => handleUpdateCompany('name', e.target.value)}
                      style={{
                        width: "100%",
                        padding: "8px 10px",
                        backgroundColor: "rgba(30, 41, 59, 0.8)",
                        border: "1px solid #38bdf8",
                        borderRadius: "4px",
                        color: "#f1f5f9",
                        fontSize: "0.85rem"
                      }}
                    />
                  </div>
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <label style={{ marginBottom: "5px", color: "#f1f5f9", fontSize: "0.85rem" }}>Association No</label>
                    <input
                      type="text"
                      value={editingCompany.association_no || ""}
                      onChange={(e) => handleUpdateCompany('association_no', e.target.value)}
                      style={{
                        width: "100%",
                        padding: "8px 10px",
                        backgroundColor: "rgba(30, 41, 59, 0.8)",
                        border: "1px solid #38bdf8",
                        borderRadius: "4px",
                        color: "#f1f5f9",
                        fontSize: "0.85rem"
                      }}
                    />
                  </div>
                  <div style={{ 
                    display: "flex", 
                    alignItems: "flex-end",
                    gap: "8px" 
                  }}>
                    <button
                      onClick={handleSaveEdit}
                      style={{
                        background: "#10b981",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        padding: "8px 15px",
                        fontSize: "0.8rem",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "5px",
                        flex: 1
                      }}
                    >
                      <i className="fas fa-check"></i>
                      <span>Kaydet</span>
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      style={{
                        background: "#64748b",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        padding: "8px 15px",
                        fontSize: "0.8rem",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "5px",
                        flex: 1
                      }}
                    >
                      <i className="fas fa-times"></i>
                      <span>İptal</span>
                    </button>
                  </div>
                </div>
              ) : (
                // GÖRÜNTÜLEME MODU
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "15px" }}>
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <div style={{ fontSize: "0.8rem", color: "#94a3b8", marginBottom: "4px" }}>Company Code</div>
                    <div style={{ 
                      padding: "8px 10px",
                      backgroundColor: "rgba(30, 41, 59, 0.5)",
                      border: "1px solid #334155",
                      borderRadius: "4px",
                      color: "#f1f5f9",
                      fontSize: "0.9rem",
                      fontFamily: "monospace"
                    }}>
                      {selectedCompany.company}
                    </div>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <div style={{ fontSize: "0.8rem", color: "#94a3b8", marginBottom: "4px" }}>Company Name</div>
                    <div style={{ 
                      padding: "8px 10px",
                      backgroundColor: "rgba(30, 41, 59, 0.5)",
                      border: "1px solid #334155",
                      borderRadius: "4px",
                      color: "#f1f5f9",
                      fontSize: "0.9rem"
                    }}>
                      {selectedCompany.name}
                    </div>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <div style={{ fontSize: "0.8rem", color: "#94a3b8", marginBottom: "4px" }}>Association No</div>
                    <div style={{ 
                      padding: "8px 10px",
                      backgroundColor: "rgba(30, 41, 59, 0.5)",
                      border: "1px solid #334155",
                      borderRadius: "4px",
                      color: "#f1f5f9",
                      fontSize: "0.9rem"
                    }}>
                      {selectedCompany.association_no || "-"}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Tabs Card - GENEL BİLGİLER (Diğer alanlar) */}
        <div style={{
          background: "#1e293b",
          borderRadius: "12px",
          padding: "20px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
          border: "1px solid #334155",
          flexShrink: 0,
          borderRight: "1px solid #334155",
          minHeight: "400px"
        }}>
          {/* Tab Headers */}
          <div style={{ 
            display: "flex", 
            borderBottom: "1px solid #334155",
            marginBottom: "15px"
          }}>
            {tabs.map((tab) => {
              const isActive = activeTab === tab;
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  style={{
                    flex: 1,
                    textAlign: "center",
                    padding: "12px",
                    background: "none",
                    border: "none",
                    color: isActive ? "#1d4ed8" : "#64748b",
                    cursor: "pointer",
                    fontWeight: "600",
                    borderBottom: isActive ? "2px solid #2563eb" : "2px solid transparent",
                    backgroundColor: isActive ? "rgba(30, 41, 59, 0.8)" : "transparent",
                    fontSize: "0.85rem",
                    minWidth: "120px",
                    height: "44px"
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
                    {tab === "General" && <i className="fas fa-cog"></i>}
                    {tab === "Address" && <i className="fas fa-map-marker-alt"></i>}
                    <span>{tab}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Tab Content - SABİT YÜKSEKLİK */}
          <div style={{ minHeight: "300px" }}>
            {activeTab === "General" && <GeneralTab selectedCompany={selectedCompany} />}
            {activeTab === "Address" && <AddressTab selectedCompany={selectedCompany} />}
          </div>
        </div>
      </div>
    </div>
  );
}