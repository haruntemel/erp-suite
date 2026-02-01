import { useState, useEffect } from "react";
import { ChevronRightIcon } from "@heroicons/react/24/outline";

// CompanySite interface'i
interface CompanySite {
  company: string;
  contract: string;
  description?: string;
  country?: string;
  createDate?: Date;
  rowversion?: Date;
  rowkey: string;
  rowstate?: string;
}

// Company interface'i
interface Company {
  companyId: string;
  name: string;
  creationDate: Date;
  associationNo?: string;
  defaultLanguage: string;
  logotype?: string;
  corporateForm?: string;
  country: string;
  createdBy: string;
  localizationCountry: string;
  rowversion: number;
  rowkey: string;
}

const tabs = ["Şirket Tesisleri"];

// Düzenleme formu için style constants
const inputStyle = {
  padding: "10px 12px",
  backgroundColor: "rgba(30, 41, 59, 0.8)",
  border: "1px solid #38bdf8",
  borderRadius: "6px",
  color: "#f1f5f9",
  fontSize: "0.9rem",
  width: "100%",
} as const;

const labelStyle = {
  fontSize: "0.85rem",
  color: "#94a3b8",
  marginBottom: "5px",
  display: "block"
} as const;

export default function CompanySitePage() {
  const [activeTab] = useState("Şirket Tesisleri");
  const [isSearchPanelVisible, setIsSearchPanelVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingCompanies, setIsLoadingCompanies] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  // CompanySite'lar için state'ler
  const [companySites, setCompanySites] = useState<CompanySite[]>([]);
  const [selectedCompanySite, setSelectedCompanySite] = useState<CompanySite | null>(null);
  const [editingCompanySite, setEditingCompanySite] = useState<CompanySite | null>(null);
  
  // Companies için state
  const [companies, setCompanies] = useState<Company[]>([]);
  
  // Yeni kayıt için state
  const [newCompanySite, setNewCompanySite] = useState<Partial<CompanySite>>({
    company: "",
    contract: "",
    description: "",
    country: "TR", // Varsayılan olarak Türkiye
    rowstate: "Active"
  });

  // API URL'leri
  const API_BASE_URL = "http://localhost:5217/api";
  const COMPANY_SITE_API = `${API_BASE_URL}/companysites`;
  const COMPANY_API = `${API_BASE_URL}/company`;

  // CompanySite'ları ve Companies'ı yükle
  useEffect(() => {
    fetchCompanySites();
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    setIsLoadingCompanies(true);
    try {
      console.log("Fetching companies from:", COMPANY_API);
      
      const response = await fetch(COMPANY_API);
      console.log("Companies response status:", response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Companies API Error response:", errorText);
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }
      
      const data: Company[] = await response.json();
      console.log("Received companies:", data);
      setCompanies(data);
    } catch (error: any) {
      console.error("Companies yüklenirken hata:", error);
      console.error("Error details:", error.message);
    } finally {
      setIsLoadingCompanies(false);
    }
  };

  const fetchCompanySites = async () => {
    setIsLoading(true);
    try {
      console.log("Fetching company sites from:", COMPANY_SITE_API);
      
      const response = await fetch(COMPANY_SITE_API);
      console.log("Response status:", response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("API Error response:", errorText);
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }
      
      const data: CompanySite[] = await response.json();
      console.log("Received data:", data);
      setCompanySites(data);
    } catch (error: any) {
      console.error("CompanySite'lar yüklenirken hata:", error);
      console.error("Error details:", error.message);
      alert(`CompanySite'lar yüklenirken hata: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCompanySiteDetail = async (company: string, contract: string) => {
    try {
      const response = await fetch(`${COMPANY_SITE_API}/${company}/${contract}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: CompanySite = await response.json();
      return data;
    } catch (error) {
      console.error("CompanySite detayı yüklenirken hata:", error);
      alert("CompanySite detayı yüklenirken hata oluştu!");
      return null;
    }
  };

  // Seçilen şirketin adını getir
  const getCompanyName = (companyId: string) => {
    const company = companies.find(c => c.companyId === companyId);
    return company ? `${company.name} (${company.companyId})` : companyId;
  };

  // Filtrelenmiş liste
  const filteredCompanySites = companySites.filter(cs => 
    cs.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cs.contract.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (cs.description && cs.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (cs.country && cs.country.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleToggleSearchPanel = () => {
    setIsSearchPanelVisible(!isSearchPanelVisible);
  };

  const handleCompanySiteSelect = async (companySite: CompanySite) => {
    setIsLoading(true);
    try {
      const detail = await fetchCompanySiteDetail(companySite.company, companySite.contract);
      
      if (detail) {
        setSelectedCompanySite(detail);
        setEditingCompanySite({...detail});
      }
    } catch (error) {
      console.error("CompanySite seçilirken hata:", error);
    } finally {
      setIsLoading(false);
    }
    setIsCreatingNew(false);
    setIsEditing(false);
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    if (selectedCompanySite) {
      setEditingCompanySite({...selectedCompanySite});
    }
  };

  const handleSave = async () => {
    if (!editingCompanySite) return;
    
    setIsSaving(true);
    try {
      const response = await fetch(
        `${COMPANY_SITE_API}/${editingCompanySite.company}/${editingCompanySite.contract}`, 
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            description: editingCompanySite.description,
            country: editingCompanySite.country,
            rowstate: editingCompanySite.rowstate,
            rowversion: editingCompanySite.rowversion || new Date().toISOString().split('T')[0]
          })
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const updatedCompanySite: CompanySite = await response.json();
      
      // Local state'i güncelle
      const updatedCompanySites = companySites.map(cs => 
        cs.company === updatedCompanySite.company && 
        cs.contract === updatedCompanySite.contract 
          ? updatedCompanySite 
          : cs
      );
      
      setCompanySites(updatedCompanySites);
      setSelectedCompanySite(updatedCompanySite);
      setEditingCompanySite(updatedCompanySite);
      setIsEditing(false);
      
      alert("CompanySite başarıyla güncellendi!");
    } catch (error) {
      console.error("CompanySite güncellenirken hata:", error);
      alert("CompanySite güncellenirken hata oluştu!");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedCompanySite) return;
    
    if (window.confirm(`${selectedCompanySite.company} - ${selectedCompanySite.contract} tesisini silmek istediğinize emin misiniz?`)) {
      try {
        const response = await fetch(
          `${COMPANY_SITE_API}/${selectedCompanySite.company}/${selectedCompanySite.contract}`, 
          {
            method: 'DELETE'
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Local state'i güncelle
        const updatedCompanySites = companySites.filter(cs => 
          !(cs.company === selectedCompanySite.company && 
            cs.contract === selectedCompanySite.contract)
        );
        
        setCompanySites(updatedCompanySites);
        setSelectedCompanySite(null);
        setEditingCompanySite(null);
        
        alert("CompanySite başarıyla silindi!");
      } catch (error) {
        console.error("CompanySite silinirken hata:", error);
        alert("CompanySite silinirken hata oluştu!");
      }
    }
  };

  const handleCreateNew = () => {
    setIsCreatingNew(true);
    setIsEditing(true);
    setNewCompanySite({
      company: "",
      contract: "",
      description: "",
      country: "TR",
      rowstate: "Active"
    });
  };

  const handleSaveNew = async () => {
    if (!newCompanySite.company || !newCompanySite.contract) {
      alert("Şirket ve Kontrat alanları zorunludur!");
      return;
    }
    
    setIsSaving(true);
    try {
      const response = await fetch(COMPANY_SITE_API, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...newCompanySite,
          rowkey: `${newCompanySite.company}_${newCompanySite.contract}_${Date.now()}` // Otomatik rowkey oluştur
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const createdCompanySite: CompanySite = await response.json();
      
      // Local state'i güncelle
      setCompanySites([...companySites, createdCompanySite]);
      setSelectedCompanySite(createdCompanySite);
      setEditingCompanySite(createdCompanySite);
      setIsCreatingNew(false);
      setIsEditing(false);
      
      alert("Yeni CompanySite başarıyla oluşturuldu!");
    } catch (error: any) {
      console.error("CompanySite oluşturulurken hata:", error);
      alert(`CompanySite oluşturulurken hata: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelNew = () => {
    setIsCreatingNew(false);
    setIsEditing(false);
  };

  const handleCompanySiteChange = (field: keyof CompanySite, value: any) => {
    if (editingCompanySite) {
      setEditingCompanySite({
        ...editingCompanySite,
        [field]: value
      });
    }
  };

  const handleNewCompanySiteChange = (field: keyof CompanySite, value: any) => {
    setNewCompanySite({
      ...newCompanySite,
      [field]: value
    });
  };

  return (
    <div style={{ 
      display: "flex", 
      width: "100%", 
      height: "100vh", 
      overflow: "hidden",
      backgroundColor: "#0f172a" 
    }}>
      {/* Arama Paneli */}
      {isSearchPanelVisible && (
        <div style={{
          width: "320px",
          height: "calc(100vh - 70px)",
          position: "fixed",
          left: "280px",
          top: "70px",
          backgroundColor: "#1e293b",
          borderRight: "1px solid #334155",
          zIndex: 100,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden"
        }}>
          <div style={{
            padding: "20px",
            borderBottom: "1px solid #334155",
            backgroundColor: "#1e293b"
          }}>
            <h3 style={{ 
              margin: 0, 
              color: "#f1f5f9", 
              fontSize: "1rem",
              marginBottom: "15px",
              display: "flex",
              alignItems: "center",
              gap: "8px"
            }}>
              <i className="fas fa-search"></i>
              Tesis Arama
            </h3>
            
            <div style={{ position: "relative" }}>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Şirket, kontrat veya açıklama ile ara..."
                style={{
                  width: "100%",
                  padding: "10px 12px 10px 40px",
                  backgroundColor: "rgba(30, 41, 59, 0.8)",
                  border: "1px solid #475569",
                  borderRadius: "6px",
                  color: "#f1f5f9",
                  fontSize: "0.9rem"
                }}
              />
              <i className="fas fa-search" style={{
                position: "absolute",
                left: "12px",
                top: "50%",
                transform: "translateY(-50%)",
                color: "#94a3b8",
                fontSize: "0.9rem"
              }}></i>
            </div>
          </div>

          <div style={{
            flex: 1,
            overflowY: "auto",
            padding: "10px"
          }}>
            {isLoading ? (
              <div style={{
                textAlign: "center",
                padding: "40px 20px",
                color: "#94a3b8",
                fontSize: "0.9rem"
              }}>
                <i className="fas fa-spinner fa-spin" style={{ fontSize: "1.5rem", marginBottom: "10px", display: "block" }}></i>
                <p>Yükleniyor...</p>
              </div>
            ) : filteredCompanySites.length > 0 ? (
              filteredCompanySites.map((item) => (
                <div
                  key={`${item.company}-${item.contract}`}
                  onClick={() => handleCompanySiteSelect(item)}
                  style={{
                    padding: "12px 15px",
                    marginBottom: "8px",
                    backgroundColor: selectedCompanySite?.company === item.company && 
                                   selectedCompanySite?.contract === item.contract
                      ? "rgba(56, 189, 248, 0.2)"
                      : "rgba(30, 41, 59, 0.5)",
                    border: "1px solid #334155",
                    borderRadius: "8px",
                    cursor: "pointer",
                    transition: "all 0.2s"
                  }}
                  onMouseOver={(e) => {
                    if (!(selectedCompanySite?.company === item.company && 
                          selectedCompanySite?.contract === item.contract)) {
                      e.currentTarget.style.backgroundColor = "rgba(56, 189, 248, 0.1)";
                    }
                  }}
                  onMouseOut={(e) => {
                    if (!(selectedCompanySite?.company === item.company && 
                          selectedCompanySite?.contract === item.contract)) {
                      e.currentTarget.style.backgroundColor = "rgba(30, 41, 59, 0.5)";
                    }
                  }}
                >
                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "8px"
                  }}>
                    <div style={{
                      width: "32px",
                      height: "32px",
                      backgroundColor: "rgba(139, 92, 246, 0.2)",
                      borderRadius: "6px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginRight: "10px",
                      flexShrink: 0
                    }}>
                      <i className="fas fa-building"
                        style={{
                          color: "#8b5cf6",
                          fontSize: "0.9rem"
                        }}
                      ></i>
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{
                        color: "#f1f5f9",
                        fontWeight: "500",
                        fontSize: "0.9rem",
                        marginBottom: "2px"
                      }}>
                        {getCompanyName(item.company)}
                      </div>
                      <div style={{
                        color: "#94a3b8",
                        fontSize: "0.8rem"
                      }}>
                        {item.contract} - {item.description || 'No Description'}
                      </div>
                    </div>
                  </div>
                  
                  <div style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "6px",
                    marginTop: "8px"
                  }}>
                    <span style={{
                      backgroundColor: "rgba(59, 130, 246, 0.2)",
                      color: "#3b82f6",
                      padding: "2px 6px",
                      borderRadius: "4px",
                      fontSize: "0.7rem"
                    }}>
                      {item.company}
                    </span>
                    <span style={{
                      backgroundColor: "rgba(245, 158, 11, 0.2)",
                      color: "#f59e0b",
                      padding: "2px 6px",
                      borderRadius: "4px",
                      fontSize: "0.7rem"
                    }}>
                      {item.contract}
                    </span>
                    {item.country && (
                      <span style={{
                        backgroundColor: "rgba(16, 185, 129, 0.2)",
                        color: "#10b981",
                        padding: "2px 6px",
                        borderRadius: "4px",
                        fontSize: "0.7rem"
                      }}>
                        <i className="fas fa-flag"></i> {item.country}
                      </span>
                    )}
                    {item.rowstate && (
                      <span style={{
                        backgroundColor: item.rowstate === 'Active' 
                          ? "rgba(16, 185, 129, 0.2)" 
                          : "rgba(239, 68, 68, 0.2)",
                        color: item.rowstate === 'Active' ? "#10b981" : "#ef4444",
                        padding: "2px 6px",
                        borderRadius: "4px",
                        fontSize: "0.7rem"
                      }}>
                        {item.rowstate}
                      </span>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div style={{
                textAlign: "center",
                padding: "40px 20px",
                color: "#94a3b8",
                fontSize: "0.9rem"
              }}>
                <i className="fas fa-search" style={{ fontSize: "1.5rem", marginBottom: "10px", display: "block" }}></i>
                <p>Arama kriterlerinize uygun kayıt bulunamadı.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Arama Paneli GİZLİ durumda */}
      {!isSearchPanelVisible && (
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
            onClick={handleToggleSearchPanel}
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
          marginLeft: isSearchPanelVisible ? "320px" : "40px",
          width: isSearchPanelVisible ? "calc(100vw - 320px)" : "calc(100vw - 40px)",
          borderRight: "1px solid #334155",
          boxSizing: "border-box"
        }}
      >
        {/* Header - Tabs */}
        <div style={{
          background: "#1e293b",
          borderRadius: "12px 12px 0 0",
          padding: "20px 20px 0 20px",
          border: "1px solid #334155",
          borderBottom: "none",
          display: "flex",
          flexDirection: "column",
          marginBottom: "0",
          minWidth: "0"
        }}>
          <div style={{ 
            fontSize: "1.3rem",
            color: "#8b5cf6",
            marginBottom: "15px",
            fontWeight: "600",
            display: "flex",
            alignItems: "center",
            gap: "10px"
          }}>
            <i className="fas fa-building"></i>
            Şirket Tesis Yönetimi
          </div>
          
          {/* Tablar */}
          <div style={{ 
            display: "flex", 
            borderBottom: "1px solid #334155"
          }}>
            {tabs.map(tab => (
              <button
                key={tab}
                onClick={() => {
                  setIsCreatingNew(false);
                  setIsEditing(false);
                  setSelectedCompanySite(null);
                  setSearchQuery("");
                }}
                style={{
                  padding: "12px 24px",
                  background: "none",
                  border: "none",
                  color: activeTab === tab ? "#38bdf8" : "#94a3b8",
                  cursor: "pointer",
                  borderBottom: activeTab === tab ? "3px solid #38bdf8" : "none",
                  fontSize: "0.9rem",
                  transition: "all 0.2s",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px"
                }}
              >
                <i className="fas fa-building"></i>
                <span>{tab}</span>
              </button>
            ))}
          </div>
        </div>

        {/* İçerik Alanı */}
        <div style={{
          flex: 1,
          background: "#1e293b",
          borderRadius: "0 0 12px 12px",
          padding: "20px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
          border: "1px solid #334155",
          borderTop: "none",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden"
        }}>
          {/* Üst Kontroller */}
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
            paddingBottom: "15px",
            borderBottom: "1px solid #334155"
          }}>
            <div style={{ 
              color: "#94a3b8",
              fontSize: "0.9rem",
              display: "flex",
              alignItems: "center",
              gap: "10px"
            }}>
              <button
                onClick={handleToggleSearchPanel}
                style={{
                  background: isSearchPanelVisible ? "#334155" : "#8b5cf6",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  padding: "8px 12px",
                  fontSize: "0.8rem",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "5px"
                }}
              >
                <i className="fas fa-search"></i>
                <span>{isSearchPanelVisible ? "Listeyi Gizle" : "Listeyi Göster"}</span>
              </button>
              
              <button
                onClick={() => {
                  fetchCompanySites();
                  fetchCompanies();
                }}
                style={{
                  background: "#3b82f6",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  padding: "8px 12px",
                  fontSize: "0.8rem",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "5px"
                }}
              >
                <i className="fas fa-sync-alt"></i>
                <span>Yenile</span>
              </button>
              
              <div style={{
                padding: "6px 12px",
                backgroundColor: "rgba(30, 41, 59, 0.5)",
                borderRadius: "4px",
                display: "flex",
                alignItems: "center",
                gap: "5px"
              }}>
                <i className="fas fa-database"></i>
                <span>
                  {isLoading ? "Yükleniyor..." : `Toplam ${companySites.length} tesis`}
                </span>
              </div>
            </div>
            
            <div style={{ display: "flex", gap: "10px" }}>
              <button
                onClick={handleCreateNew}
                style={{
                  background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  padding: "8px 15px",
                  fontSize: "0.85rem",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px"
                }}
              >
                <i className="fas fa-plus"></i>
                <span>Yeni Tesis</span>
              </button>
            </div>
          </div>

          {/* Data Grid View */}
          <div style={{
            flex: 1,
            backgroundColor: "rgba(30, 41, 59, 0.3)",
            borderRadius: "8px",
            overflow: "hidden",
            border: "1px solid #334155",
            display: "flex",
            flexDirection: "column"
          }}>
            {/* Grid Header */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "120px 120px 1fr 120px 80px 180px",
              backgroundColor: "#334155",
              padding: "12px 15px",
              borderBottom: "1px solid #475569",
              fontSize: "0.8rem",
              fontWeight: "600",
              color: "#f1f5f9",
              position: "sticky",
              top: 0,
              zIndex: 10
            }}>
              <div>Şirket</div>
              <div>Kontrat</div>
              <div>Açıklama</div>
              <div>Ülke</div>
              <div>Durum</div>
              <div>Oluşturma Tarihi</div>
            </div>

            {/* Grid Body */}
            <div style={{ 
              flex: 1, 
              overflowY: "auto",
              maxHeight: "calc(100vh - 300px)"
            }}>
              {isLoading ? (
                <div style={{
                  padding: "40px",
                  textAlign: "center",
                  color: "#94a3b8"
                }}>
                  <i className="fas fa-spinner fa-spin" style={{ fontSize: "2rem", marginBottom: "10px" }}></i>
                  <p>Yükleniyor...</p>
                </div>
              ) : filteredCompanySites.length > 0 ? (
                filteredCompanySites.map((item, index) => {
                  const isSelected = selectedCompanySite?.company === item.company && 
                                   selectedCompanySite?.contract === item.contract;
                  
                  return (
                    <div
                      key={`${item.company}-${item.contract}`}
                      onClick={() => handleCompanySiteSelect(item)}
                      style={{
                        display: "grid",
                        gridTemplateColumns: "120px 120px 1fr 120px 80px 180px",
                        padding: "10px 15px",
                        borderBottom: "1px solid #334155",
                        fontSize: "0.85rem",
                        color: "#f1f5f9",
                        backgroundColor: isSelected 
                          ? "rgba(56, 189, 248, 0.2)" 
                          : index % 2 === 0 
                            ? "rgba(30, 41, 59, 0.5)" 
                            : "rgba(30, 41, 59, 0.3)",
                        cursor: "pointer",
                        alignItems: "center",
                        transition: "background-color 0.2s"
                      }}
                      onMouseOver={(e) => {
                        if (!isSelected) e.currentTarget.style.backgroundColor = "rgba(56, 189, 248, 0.1)";
                      }}
                      onMouseOut={(e) => {
                        if (!isSelected) e.currentTarget.style.backgroundColor = index % 2 === 0 
                          ? "rgba(30, 41, 59, 0.5)" 
                          : "rgba(30, 41, 59, 0.3)";
                      }}
                    >
                      <div>
                        <i className="fas fa-building" style={{ 
                          marginRight: "8px", 
                          color: "#8b5cf6" 
                        }}></i>
                        {getCompanyName(item.company)}
                      </div>
                      <div style={{ color: "#f59e0b", fontWeight: "500" }}>{item.contract}</div>
                      <div style={{ 
                        color: "#94a3b8",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis"
                      }}>
                        {item.description || '-'}
                      </div>
                      <div style={{ 
                        color: "#10b981",
                        display: "flex",
                        alignItems: "center",
                        gap: "5px"
                      }}>
                        <i className="fas fa-flag"></i>
                        {item.country || '-'}
                      </div>
                      <div style={{ textAlign: "center" }}>
                        <span style={{
                          backgroundColor: item.rowstate === 'Active' 
                            ? "rgba(16, 185, 129, 0.2)" 
                            : "rgba(239, 68, 68, 0.2)",
                          color: item.rowstate === 'Active' ? "#10b981" : "#ef4444",
                          padding: "2px 6px",
                          borderRadius: "4px",
                          fontSize: "0.8rem"
                        }}>
                          {item.rowstate || '-'}
                        </span>
                      </div>
                      <div style={{ color: "#94a3b8", fontSize: "0.8rem" }}>
                        {item.createDate ? 
                          new Date(item.createDate).toLocaleDateString('tr-TR') : 
                          '-'}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div style={{
                  padding: "40px",
                  textAlign: "center",
                  color: "#94a3b8"
                }}>
                  <i className="fas fa-building" style={{ fontSize: "2rem", marginBottom: "10px" }}></i>
                  <p>Hiç tesis bulunamadı.</p>
                </div>
              )}
            </div>
          </div>

          {/* Seçili Kayıt Detayları */}
          {(selectedCompanySite || isCreatingNew) && (
            <div style={{
              background: "#1e293b",
              borderRadius: "12px",
              padding: "20px",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
              border: "1px solid #334155",
              marginTop: "15px"
            }}>
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "15px"
              }}>
                <h3 style={{ 
                  color: "#f1f5f9", 
                  fontSize: "1rem", 
                  margin: 0,
                  display: "flex",
                  alignItems: "center",
                  gap: "8px"
                }}>
                  <i className="fas fa-info-circle" style={{ color: "#38bdf8" }}></i>
                  {isCreatingNew 
                    ? "Yeni Tesis Oluştur" 
                    : "Tesis Detayları"}
                  {isEditing && " (Düzenleme Modu)"}
                </h3>
                
                {/* Butonlar */}
                <div style={{ display: "flex", gap: "10px" }}>
                  {!isEditing ? (
                    <>
                      <button
                        onClick={handleEditClick}
                        disabled={isCreatingNew}
                        style={{
                          background: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
                          color: "white",
                          border: "none",
                          borderRadius: "6px",
                          padding: "8px 15px",
                          fontSize: "0.85rem",
                          cursor: isCreatingNew ? "not-allowed" : "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                          opacity: isCreatingNew ? 0.5 : 1
                        }}
                      >
                        <i className="fas fa-edit"></i>
                        <span>Düzenle</span>
                      </button>
                      <button
                        onClick={handleDelete}
                        disabled={isCreatingNew}
                        style={{
                          background: "#ef4444",
                          color: "white",
                          border: "none",
                          borderRadius: "6px",
                          padding: "8px 15px",
                          fontSize: "0.85rem",
                          cursor: isCreatingNew ? "not-allowed" : "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                          opacity: isCreatingNew ? 0.5 : 1
                        }}
                      >
                        <i className="fas fa-trash"></i>
                        <span>Sil</span>
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={isCreatingNew ? handleCancelNew : handleCancelEdit}
                        disabled={isSaving}
                        style={{
                          background: "#64748b",
                          color: "white",
                          border: "none",
                          borderRadius: "6px",
                          padding: "8px 15px",
                          fontSize: "0.85rem",
                          cursor: isSaving ? "not-allowed" : "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                          opacity: isSaving ? 0.6 : 1
                        }}
                      >
                        <i className="fas fa-times"></i>
                        <span>İptal</span>
                      </button>
                      <button
                        onClick={isCreatingNew ? handleSaveNew : handleSave}
                        disabled={isSaving}
                        style={{
                          background: isSaving ? "#f59e0b" : "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                          color: "white",
                          border: "none",
                          borderRadius: "6px",
                          padding: "8px 15px",
                          fontSize: "0.85rem",
                          cursor: isSaving ? "not-allowed" : "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                          opacity: isSaving ? 0.6 : 1
                        }}
                      >
                        {isSaving ? (
                          <>
                            <i className="fas fa-spinner fa-spin"></i>
                            <span>Kaydediliyor...</span>
                          </>
                        ) : (
                          <>
                            <i className="fas fa-save"></i>
                            <span>Kaydet</span>
                          </>
                        )}
                      </button>
                    </>
                  )}
                </div>
              </div>
              
              {/* Detay Formu */}
              <div style={{ 
                display: "grid", 
                gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", 
                gap: "15px",
                marginBottom: "20px"
              }}>
                {isCreatingNew ? (
                  // Yeni Tesis Formu
                  <>
                    <div>
                      <label style={labelStyle}>Şirket *</label>
                      {isLoadingCompanies ? (
                        <div style={{
                          padding: "10px 12px",
                          backgroundColor: "rgba(30, 41, 59, 0.8)",
                          border: "1px solid #475569",
                          borderRadius: "6px",
                          color: "#94a3b8",
                          fontSize: "0.9rem"
                        }}>
                          Şirketler yükleniyor...
                        </div>
                      ) : (
                        <select
                          value={newCompanySite.company || ''}
                          onChange={(e) => handleNewCompanySiteChange('company', e.target.value)}
                          style={inputStyle}
                        >
                          <option value="">Şirket seçin...</option>
                          {companies.map(company => (
                            <option key={company.companyId} value={company.companyId}>
                              {company.name} ({company.companyId})
                            </option>
                          ))}
                        </select>
                      )}
                    </div>
                    <div>
                      <label style={labelStyle}>Kontrat *</label>
                      <input
                        type="text"
                        value={newCompanySite.contract || ''}
                        onChange={(e) => handleNewCompanySiteChange('contract', e.target.value)}
                        style={inputStyle}
                        placeholder="Örn: SITE1"
                      />
                    </div>
                    <div style={{ gridColumn: "1 / -1" }}>
                      <label style={labelStyle}>Açıklama</label>
                      <input
                        type="text"
                        value={newCompanySite.description || ''}
                        onChange={(e) => handleNewCompanySiteChange('description', e.target.value)}
                        style={inputStyle}
                        placeholder="Tesis açıklaması"
                      />
                    </div>
                    <div>
                      <label style={labelStyle}>Ülke</label>
                      <select
                        value={newCompanySite.country || 'TR'}
                        onChange={(e) => handleNewCompanySiteChange('country', e.target.value)}
                        style={inputStyle}
                      >
                        <option value="TR">Türkiye</option>
                        <option value="US">Amerika</option>
                        <option value="DE">Almanya</option>
                        <option value="FR">Fransa</option>
                        <option value="UK">İngiltere</option>
                        <option value="CN">Çin</option>
                        <option value="JP">Japonya</option>
                      </select>
                    </div>
                    <div>
                      <label style={labelStyle}>Durum</label>
                      <select
                        value={newCompanySite.rowstate || 'Active'}
                        onChange={(e) => handleNewCompanySiteChange('rowstate', e.target.value)}
                        style={inputStyle}
                      >
                        <option value="Active">Aktif</option>
                        <option value="Inactive">Pasif</option>
                        <option value="Deleted">Silindi</option>
                      </select>
                    </div>
                  </>
                ) : editingCompanySite ? (
                  // Tesis Düzenleme Formu
                  <>
                    <div>
                      <label style={labelStyle}>Şirket</label>
                      {isEditing ? (
                        <div style={{ 
                          padding: "10px 12px",
                          backgroundColor: "rgba(30, 41, 59, 0.8)",
                          border: "1px solid #475569",
                          borderRadius: "6px",
                          color: "#94a3b8",
                          fontSize: "0.9rem"
                        }}>
                          {getCompanyName(editingCompanySite.company)}
                          <div style={{ fontSize: "0.8rem", color: "#64748b", marginTop: "2px" }}>
                            (Düzenlenemez)
                          </div>
                        </div>
                      ) : (
                        <div style={{ 
                          padding: "8px", 
                          backgroundColor: "rgba(30, 41, 59, 0.5)",
                          borderRadius: "4px",
                          color: "#f1f5f9",
                          fontWeight: "500"
                        }}>
                          {getCompanyName(editingCompanySite.company)}
                        </div>
                      )}
                    </div>
                    <div>
                      <label style={labelStyle}>Kontrat</label>
                      {isEditing ? (
                        <div style={{ 
                          padding: "10px 12px",
                          backgroundColor: "rgba(30, 41, 59, 0.8)",
                          border: "1px solid #475569",
                          borderRadius: "6px",
                          color: "#94a3b8",
                          fontSize: "0.9rem"
                        }}>
                          {editingCompanySite.contract}
                          <div style={{ fontSize: "0.8rem", color: "#64748b", marginTop: "2px" }}>
                            (Düzenlenemez)
                          </div>
                        </div>
                      ) : (
                        <div style={{ 
                          padding: "8px", 
                          backgroundColor: "rgba(30, 41, 59, 0.5)",
                          borderRadius: "4px",
                          color: "#f1f5f9",
                          fontWeight: "500"
                        }}>
                          {editingCompanySite.contract}
                        </div>
                      )}
                    </div>
                    <div>
                      <label style={labelStyle}>Açıklama</label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={editingCompanySite.description || ''}
                          onChange={(e) => handleCompanySiteChange('description', e.target.value)}
                          style={inputStyle}
                        />
                      ) : (
                        <div style={{ 
                          padding: "8px", 
                          backgroundColor: "rgba(30, 41, 59, 0.5)",
                          borderRadius: "4px",
                          color: "#f1f5f9"
                        }}>
                          {editingCompanySite.description || '-'}
                        </div>
                      )}
                    </div>
                    <div>
                      <label style={labelStyle}>Ülke</label>
                      {isEditing ? (
                        <select
                          value={editingCompanySite.country || 'TR'}
                          onChange={(e) => handleCompanySiteChange('country', e.target.value)}
                          style={inputStyle}
                        >
                          <option value="TR">Türkiye</option>
                          <option value="US">Amerika</option>
                          <option value="DE">Almanya</option>
                          <option value="FR">Fransa</option>
                          <option value="UK">İngiltere</option>
                          <option value="CN">Çin</option>
                          <option value="JP">Japonya</option>
                        </select>
                      ) : (
                        <div style={{ 
                          padding: "8px", 
                          backgroundColor: "rgba(16, 185, 129, 0.2)",
                          borderRadius: "4px",
                          color: "#10b981",
                          display: "flex",
                          alignItems: "center",
                          gap: "5px"
                        }}>
                          <i className="fas fa-flag"></i>
                          {editingCompanySite.country || '-'}
                        </div>
                      )}
                    </div>
                    <div>
                      <label style={labelStyle}>Durum</label>
                      {isEditing ? (
                        <select
                          value={editingCompanySite.rowstate || 'Active'}
                          onChange={(e) => handleCompanySiteChange('rowstate', e.target.value)}
                          style={inputStyle}
                        >
                          <option value="Active">Aktif</option>
                          <option value="Inactive">Pasif</option>
                          <option value="Deleted">Silindi</option>
                        </select>
                      ) : (
                        <div style={{ 
                          padding: "8px", 
                          backgroundColor: editingCompanySite.rowstate === 'Active' 
                            ? "rgba(16, 185, 129, 0.2)" 
                            : "rgba(239, 68, 68, 0.2)",
                          borderRadius: "4px",
                          color: editingCompanySite.rowstate === 'Active' ? "#10b981" : "#ef4444",
                          textAlign: "center",
                          fontWeight: "500"
                        }}>
                          {editingCompanySite.rowstate || '-'}
                        </div>
                      )}
                    </div>
                    <div>
                      <label style={labelStyle}>Oluşturulma Tarihi</label>
                      <div style={{ 
                        padding: "8px", 
                        backgroundColor: "rgba(30, 41, 59, 0.5)",
                        borderRadius: "4px",
                        color: "#94a3b8",
                        fontSize: "0.85rem"
                      }}>
                        {editingCompanySite.createDate ? 
                          new Date(editingCompanySite.createDate).toLocaleDateString('tr-TR') : 
                          'Belirtilmemiş'}
                      </div>
                    </div>
                    <div>
                      <label style={labelStyle}>Row Version</label>
                      <div style={{ 
                        padding: "8px", 
                        backgroundColor: "rgba(30, 41, 59, 0.5)",
                        borderRadius: "4px",
                        color: "#94a3b8",
                        fontSize: "0.85rem"
                      }}>
                        {editingCompanySite.rowversion ? 
                          new Date(editingCompanySite.rowversion).toLocaleDateString('tr-TR') : 
                          '-'}
                      </div>
                    </div>
                    <div style={{ gridColumn: "1 / -1" }}>
                      <label style={labelStyle}>Row Key</label>
                      <div style={{ 
                        padding: "8px", 
                        backgroundColor: "rgba(30, 41, 59, 0.5)",
                        borderRadius: "4px",
                        color: "#94a3b8",
                        fontSize: "0.8rem",
                        wordBreak: "break-all",
                        fontFamily: "monospace"
                      }}>
                        {editingCompanySite.rowkey || '-'}
                      </div>
                    </div>
                  </>
                ) : null}
              </div>
            </div>
          )}

          {/* Hiç kayıt seçilmediyse mesaj */}
          {!selectedCompanySite && !isCreatingNew && (
            <div style={{
              textAlign: "center",
              padding: "40px 20px",
              color: "#94a3b8",
              backgroundColor: "rgba(30, 41, 59, 0.3)",
              borderRadius: "8px",
              border: "1px dashed #334155",
              marginTop: "15px"
            }}>
              <i className="fas fa-mouse-pointer" style={{ fontSize: "2rem", marginBottom: "10px" }}></i>
              <p>Detayları görmek için tablodan bir tesis seçin veya yeni tesis oluşturun.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}