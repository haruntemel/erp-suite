import { useState, useEffect } from "react";
import { ChevronRightIcon } from "@heroicons/react/24/outline";

// WorkCenter interface'i
interface WorkCenter {
  company: string;
  contract: string;
  workCenterNo: string;
  description?: string;
  workCenterCode?: string;
  productionLine?: string;
  departmentNo?: string;
  noteText?: string;
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

// CompanySite interface'i (contract listesi için)
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

const tabs = ["İş Merkezleri"];

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

export default function WorkCenterPage() {
  const [activeTab] = useState("İş Merkezleri");
  const [isSearchPanelVisible, setIsSearchPanelVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingCompanies, setIsLoadingCompanies] = useState(false);
  const [isLoadingContracts, setIsLoadingContracts] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  // WorkCenter'lar için state'ler
  const [workCenters, setWorkCenters] = useState<WorkCenter[]>([]);
  const [selectedWorkCenter, setSelectedWorkCenter] = useState<WorkCenter | null>(null);
  const [editingWorkCenter, setEditingWorkCenter] = useState<WorkCenter | null>(null);
  
  // Companies için state
  const [companies, setCompanies] = useState<Company[]>([]);
  
  // CompanySites (contracts) için state
  const [companySites, setCompanySites] = useState<CompanySite[]>([]);
  const [filteredContracts, setFilteredContracts] = useState<CompanySite[]>([]);
  
  // Yeni kayıt için state
  const [newWorkCenter, setNewWorkCenter] = useState<Partial<WorkCenter>>({
    company: "",
    contract: "",
    workCenterNo: "",
    description: "",
    workCenterCode: "",
    productionLine: "",
    departmentNo: "",
    noteText: "",
    rowstate: "Active"
  });

  // API URL'leri
  const API_BASE_URL = "/api";
  const WORK_CENTER_API = `${API_BASE_URL}/workcenter`;
  const COMPANY_API = `${API_BASE_URL}/company`;
  const COMPANY_SITE_API = `${API_BASE_URL}/companysites`;

  // WorkCenter'ları, Companies'ı ve CompanySites'ı yükle
  useEffect(() => {
    fetchWorkCenters();
    fetchCompanies();
    fetchCompanySites();
  }, []);

  // Company değiştiğinde contract'ları filtrele
  useEffect(() => {
    if (newWorkCenter.company) {
      const contracts = companySites.filter(site => site.company === newWorkCenter.company);
      setFilteredContracts(contracts);
      
      // Eğer seçili contract artık bu şirkete ait değilse, contract'ı temizle
      if (newWorkCenter.contract && !contracts.some(c => c.contract === newWorkCenter.contract)) {
        setNewWorkCenter(prev => ({ ...prev, contract: "" }));
      }
    } else {
      setFilteredContracts([]);
      setNewWorkCenter(prev => ({ ...prev, contract: "" }));
    }
  }, [newWorkCenter.company, companySites]);

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
    setIsLoadingContracts(true);
    try {
      console.log("Fetching company sites from:", COMPANY_SITE_API);
      
      const response = await fetch(COMPANY_SITE_API);
      console.log("Company sites response status:", response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Company sites API Error response:", errorText);
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }
      
      const data: CompanySite[] = await response.json();
      console.log("Received company sites:", data);
      setCompanySites(data);
    } catch (error: any) {
      console.error("Company sites yüklenirken hata:", error);
      console.error("Error details:", error.message);
    } finally {
      setIsLoadingContracts(false);
    }
  };

  const fetchWorkCenters = async () => {
    setIsLoading(true);
    try {
      console.log("Fetching work centers from:", WORK_CENTER_API);
      
      const response = await fetch(WORK_CENTER_API);
      console.log("Response status:", response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("API Error response:", errorText);
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }
      
      const data: WorkCenter[] = await response.json();
      console.log("Received data:", data);
      setWorkCenters(data);
    } catch (error: any) {
      console.error("WorkCenter'lar yüklenirken hata:", error);
      console.error("Error details:", error.message);
      alert(`WorkCenter'lar yüklenirken hata: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchWorkCenterDetail = async (company: string, contract: string, workCenterNo: string) => {
    try {
      const response = await fetch(`${WORK_CENTER_API}/${company}/${contract}/${workCenterNo}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: WorkCenter = await response.json();
      return data;
    } catch (error) {
      console.error("WorkCenter detayı yüklenirken hata:", error);
      alert("WorkCenter detayı yüklenirken hata oluştu!");
      return null;
    }
  };

  // Seçilen şirketin adını getir
  const getCompanyName = (companyId: string) => {
    const company = companies.find(c => c.companyId === companyId);
    return company ? `${company.name} (${company.companyId})` : companyId;
  };

  // Seçilen contract'ın açıklamasını getir
  const getContractDescription = (company: string, contract: string) => {
    const site = companySites.find(s => s.company === company && s.contract === contract);
    return site?.description || contract;
  };

  // Filtrelenmiş liste
  const filteredWorkCenters = workCenters.filter(wc => 
    wc.workCenterNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (wc.description && wc.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (wc.workCenterCode && wc.workCenterCode.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (wc.productionLine && wc.productionLine.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (wc.departmentNo && wc.departmentNo.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleToggleSearchPanel = () => {
    setIsSearchPanelVisible(!isSearchPanelVisible);
  };

  const handleWorkCenterSelect = async (workCenter: WorkCenter) => {
    setIsLoading(true);
    try {
      const detail = await fetchWorkCenterDetail(
        workCenter.company, 
        workCenter.contract, 
        workCenter.workCenterNo
      );
      
      if (detail) {
        setSelectedWorkCenter(detail);
        setEditingWorkCenter({...detail});
      }
    } catch (error) {
      console.error("WorkCenter seçilirken hata:", error);
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
    if (selectedWorkCenter) {
      setEditingWorkCenter({...selectedWorkCenter});
    }
  };

  const handleSave = async () => {
    if (!editingWorkCenter) return;
    
    setIsSaving(true);
    try {
      const response = await fetch(
        `${WORK_CENTER_API}/${editingWorkCenter.company}/${editingWorkCenter.contract}/${editingWorkCenter.workCenterNo}`, 
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            description: editingWorkCenter.description,
            workCenterCode: editingWorkCenter.workCenterCode,
            productionLine: editingWorkCenter.productionLine,
            departmentNo: editingWorkCenter.departmentNo,
            noteText: editingWorkCenter.noteText,
            rowstate: editingWorkCenter.rowstate,
            rowversion: editingWorkCenter.rowversion || new Date().toISOString().split('T')[0]
          })
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const updatedWorkCenter: WorkCenter = await response.json();
      
      // Local state'i güncelle
      const updatedWorkCenters = workCenters.map(wc => 
        wc.company === updatedWorkCenter.company && 
        wc.contract === updatedWorkCenter.contract && 
        wc.workCenterNo === updatedWorkCenter.workCenterNo 
          ? updatedWorkCenter 
          : wc
      );
      
      setWorkCenters(updatedWorkCenters);
      setSelectedWorkCenter(updatedWorkCenter);
      setEditingWorkCenter(updatedWorkCenter);
      setIsEditing(false);
      
      alert("WorkCenter başarıyla güncellendi!");
    } catch (error) {
      console.error("WorkCenter güncellenirken hata:", error);
      alert("WorkCenter güncellenirken hata oluştu!");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedWorkCenter) return;
    
    if (window.confirm(`${selectedWorkCenter.workCenterNo} kodlu work center'ı silmek istediğinize emin misiniz?`)) {
      try {
        const response = await fetch(
          `${WORK_CENTER_API}/${selectedWorkCenter.company}/${selectedWorkCenter.contract}/${selectedWorkCenter.workCenterNo}`, 
          {
            method: 'DELETE'
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Local state'i güncelle
        const updatedWorkCenters = workCenters.filter(wc => 
          !(wc.company === selectedWorkCenter.company && 
            wc.contract === selectedWorkCenter.contract && 
            wc.workCenterNo === selectedWorkCenter.workCenterNo)
        );
        
        setWorkCenters(updatedWorkCenters);
        setSelectedWorkCenter(null);
        setEditingWorkCenter(null);
        
        alert("WorkCenter başarıyla silindi!");
      } catch (error) {
        console.error("WorkCenter silinirken hata:", error);
        alert("WorkCenter silinirken hata oluştu!");
      }
    }
  };

  const handleCreateNew = () => {
    setIsCreatingNew(true);
    setIsEditing(true);
    setNewWorkCenter({
      company: "",
      contract: "",
      workCenterNo: "",
      description: "",
      workCenterCode: "",
      productionLine: "",
      departmentNo: "",
      noteText: "",
      rowstate: "Active"
    });
  };

  const handleSaveNew = async () => {
    if (!newWorkCenter.company || !newWorkCenter.contract || !newWorkCenter.workCenterNo) {
      alert("Şirket, Kontrat ve Work Center No alanları zorunludur!");
      return;
    }
    
    setIsSaving(true);
    try {
      const response = await fetch(WORK_CENTER_API, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newWorkCenter)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const createdWorkCenter: WorkCenter = await response.json();
      
      // Local state'i güncelle
      setWorkCenters([...workCenters, createdWorkCenter]);
      setSelectedWorkCenter(createdWorkCenter);
      setEditingWorkCenter(createdWorkCenter);
      setIsCreatingNew(false);
      setIsEditing(false);
      
      alert("Yeni WorkCenter başarıyla oluşturuldu!");
    } catch (error: any) {
      console.error("WorkCenter oluşturulurken hata:", error);
      alert(`WorkCenter oluşturulurken hata: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelNew = () => {
    setIsCreatingNew(false);
    setIsEditing(false);
  };

  const handleWorkCenterChange = (field: keyof WorkCenter, value: any) => {
    if (editingWorkCenter) {
      setEditingWorkCenter({
        ...editingWorkCenter,
        [field]: value
      });
    }
  };

  const handleNewWorkCenterChange = (field: keyof WorkCenter, value: any) => {
    setNewWorkCenter({
      ...newWorkCenter,
      [field]: value
    });
  };

  // Grid'de company adını göstermek için
  const getGridCompanyName = (companyId: string) => {
    const company = companies.find(c => c.companyId === companyId);
    return company ? company.companyId : companyId;
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
              İş Merkezi Arama
            </h3>
            
            <div style={{ position: "relative" }}>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Kod, ad veya açıklama ile ara..."
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
            ) : filteredWorkCenters.length > 0 ? (
              filteredWorkCenters.map((item) => (
                <div
                  key={`${item.company}-${item.contract}-${item.workCenterNo}`}
                  onClick={() => handleWorkCenterSelect(item)}
                  style={{
                    padding: "12px 15px",
                    marginBottom: "8px",
                    backgroundColor: selectedWorkCenter?.company === item.company && 
                                   selectedWorkCenter?.contract === item.contract && 
                                   selectedWorkCenter?.workCenterNo === item.workCenterNo
                      ? "rgba(56, 189, 248, 0.2)"
                      : "rgba(30, 41, 59, 0.5)",
                    border: "1px solid #334155",
                    borderRadius: "8px",
                    cursor: "pointer",
                    transition: "all 0.2s"
                  }}
                  onMouseOver={(e) => {
                    if (!(selectedWorkCenter?.company === item.company && 
                          selectedWorkCenter?.contract === item.contract && 
                          selectedWorkCenter?.workCenterNo === item.workCenterNo)) {
                      e.currentTarget.style.backgroundColor = "rgba(56, 189, 248, 0.1)";
                    }
                  }}
                  onMouseOut={(e) => {
                    if (!(selectedWorkCenter?.company === item.company && 
                          selectedWorkCenter?.contract === item.contract && 
                          selectedWorkCenter?.workCenterNo === item.workCenterNo)) {
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
                      backgroundColor: "rgba(16, 185, 129, 0.2)",
                      borderRadius: "6px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginRight: "10px",
                      flexShrink: 0
                    }}>
                      <i className="fas fa-industry"
                        style={{
                          color: "#10b981",
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
                        {item.workCenterNo}
                      </div>
                      <div style={{
                        color: "#94a3b8",
                        fontSize: "0.8rem"
                      }}>
                        {item.description || item.workCenterCode || 'No Description'}
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
                      {getGridCompanyName(item.company)}
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
            <i className="fas fa-industry"></i>
            İş Merkezi Yönetimi
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
                  setSelectedWorkCenter(null);
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
                <i className="fas fa-industry"></i>
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
                  fetchWorkCenters();
                  fetchCompanies();
                  fetchCompanySites();
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
                  {isLoading ? "Yükleniyor..." : `Toplam ${workCenters.length} iş merkezi`}
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
                <span>Yeni İş Merkezi</span>
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
              gridTemplateColumns: "100px 120px 1fr 150px 120px 120px 120px 80px",
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
              <div>Work Center No</div>
              <div>Açıklama</div>
              <div>Work Center Code</div>
              <div>Üretim Hattı</div>
              <div>Departman</div>
              <div>Durum</div>
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
              ) : filteredWorkCenters.length > 0 ? (
                filteredWorkCenters.map((item, index) => {
                  const isSelected = selectedWorkCenter?.company === item.company && 
                                   selectedWorkCenter?.contract === item.contract && 
                                   selectedWorkCenter?.workCenterNo === item.workCenterNo;
                  
                  return (
                    <div
                      key={`${item.company}-${item.contract}-${item.workCenterNo}`}
                      onClick={() => handleWorkCenterSelect(item)}
                      style={{
                        display: "grid",
                        gridTemplateColumns: "100px 120px 1fr 150px 120px 120px 120px 80px",
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
                        {getGridCompanyName(item.company)}
                      </div>
                      <div style={{ color: "#f59e0b", fontWeight: "500" }}>{item.contract}</div>
                      <div>
                        <i className="fas fa-industry" style={{ 
                          marginRight: "8px", 
                          color: "#10b981" 
                        }}></i>
                        {item.workCenterNo}
                      </div>
                      <div style={{ 
                        color: "#94a3b8",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis"
                      }}>
                        {item.description || '-'}
                      </div>
                      <div style={{ color: "#94a3b8" }}>{item.workCenterCode || '-'}</div>
                      <div style={{ color: "#94a3b8" }}>{item.productionLine || '-'}</div>
                      <div style={{ color: "#94a3b8" }}>{item.departmentNo || '-'}</div>
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
                    </div>
                  );
                })
              ) : (
                <div style={{
                  padding: "40px",
                  textAlign: "center",
                  color: "#94a3b8"
                }}>
                  <i className="fas fa-industry" style={{ fontSize: "2rem", marginBottom: "10px" }}></i>
                  <p>Hiç work center bulunamadı.</p>
                </div>
              )}
            </div>
          </div>

          {/* Seçili Kayıt Detayları */}
          {(selectedWorkCenter || isCreatingNew) && (
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
                    ? "Yeni İş Merkezi Oluştur" 
                    : "İş Merkezi Detayları"}
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
                  // Yeni İş Merkezi Formu
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
                          value={newWorkCenter.company || ''}
                          onChange={(e) => handleNewWorkCenterChange('company', e.target.value)}
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
                      {isLoadingContracts || isLoadingCompanies ? (
                        <div style={{
                          padding: "10px 12px",
                          backgroundColor: "rgba(30, 41, 59, 0.8)",
                          border: "1px solid #475569",
                          borderRadius: "6px",
                          color: "#94a3b8",
                          fontSize: "0.9rem"
                        }}>
                          {!newWorkCenter.company ? "Önce şirket seçin" : "Contract'lar yükleniyor..."}
                        </div>
                      ) : (
                        <select
                          value={newWorkCenter.contract || ''}
                          onChange={(e) => handleNewWorkCenterChange('contract', e.target.value)}
                          style={inputStyle}
                          disabled={!newWorkCenter.company}
                        >
                          <option value="">
                            {newWorkCenter.company ? "Contract seçin..." : "Önce şirket seçin"}
                          </option>
                          {filteredContracts.map(site => (
                            <option key={`${site.company}-${site.contract}`} value={site.contract}>
                              {site.contract} - {site.description || 'No Description'}
                            </option>
                          ))}
                        </select>
                      )}
                    </div>
                    <div>
                      <label style={labelStyle}>Work Center No *</label>
                      <input
                        type="text"
                        value={newWorkCenter.workCenterNo || ''}
                        onChange={(e) => handleNewWorkCenterChange('workCenterNo', e.target.value)}
                        style={inputStyle}
                        placeholder="Örn: WC001"
                      />
                    </div>
                    <div>
                      <label style={labelStyle}>Açıklama</label>
                      <input
                        type="text"
                        value={newWorkCenter.description || ''}
                        onChange={(e) => handleNewWorkCenterChange('description', e.target.value)}
                        style={inputStyle}
                        placeholder="Açıklama girin"
                      />
                    </div>
                    <div>
                      <label style={labelStyle}>Work Center Code</label>
                      <input
                        type="text"
                        value={newWorkCenter.workCenterCode || ''}
                        onChange={(e) => handleNewWorkCenterChange('workCenterCode', e.target.value)}
                        style={inputStyle}
                        placeholder="Work center kodu"
                      />
                    </div>
                    <div>
                      <label style={labelStyle}>Üretim Hattı</label>
                      <input
                        type="text"
                        value={newWorkCenter.productionLine || ''}
                        onChange={(e) => handleNewWorkCenterChange('productionLine', e.target.value)}
                        style={inputStyle}
                        placeholder="Üretim hattı kodu"
                      />
                    </div>
                    <div>
                      <label style={labelStyle}>Departman No</label>
                      <input
                        type="text"
                        value={newWorkCenter.departmentNo || ''}
                        onChange={(e) => handleNewWorkCenterChange('departmentNo', e.target.value)}
                        style={inputStyle}
                        placeholder="Departman numarası"
                      />
                    </div>
                    <div>
                      <label style={labelStyle}>Durum</label>
                      <select
                        value={newWorkCenter.rowstate || 'Active'}
                        onChange={(e) => handleNewWorkCenterChange('rowstate', e.target.value)}
                        style={inputStyle}
                      >
                        <option value="Active">Aktif</option>
                        <option value="Inactive">Pasif</option>
                        <option value="Deleted">Silindi</option>
                      </select>
                    </div>
                    <div style={{ gridColumn: "1 / -1" }}>
                      <label style={labelStyle}>Not</label>
                      <textarea
                        value={newWorkCenter.noteText || ''}
                        onChange={(e) => handleNewWorkCenterChange('noteText', e.target.value)}
                        rows={3}
                        style={{
                          ...inputStyle,
                          resize: "vertical"
                        }}
                        placeholder="Not metni..."
                      />
                    </div>
                  </>
                ) : editingWorkCenter ? (
                  // İş Merkezi Düzenleme Formu
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
                          {getCompanyName(editingWorkCenter.company)}
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
                          {getCompanyName(editingWorkCenter.company)}
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
                          {editingWorkCenter.contract} - {getContractDescription(editingWorkCenter.company, editingWorkCenter.contract)}
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
                          {editingWorkCenter.contract}
                        </div>
                      )}
                    </div>
                    <div>
                      <label style={labelStyle}>Work Center No</label>
                      {isEditing ? (
                        <div style={{ 
                          padding: "10px 12px",
                          backgroundColor: "rgba(30, 41, 59, 0.8)",
                          border: "1px solid #475569",
                          borderRadius: "6px",
                          color: "#94a3b8",
                          fontSize: "0.9rem"
                        }}>
                          {editingWorkCenter.workCenterNo}
                          <div style={{ fontSize: "0.8rem", color: "#64748b", marginTop: "2px" }}>
                            (Düzenlenemez)
                          </div>
                        </div>
                      ) : (
                        <div style={{ 
                          padding: "8px", 
                          backgroundColor: "rgba(30, 41, 59, 0.5)",
                          borderRadius: "4px",
                          color: "#f1f5f9"
                        }}>
                          {editingWorkCenter.workCenterNo}
                        </div>
                      )}
                    </div>
                    <div>
                      <label style={labelStyle}>Açıklama</label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={editingWorkCenter.description || ''}
                          onChange={(e) => handleWorkCenterChange('description', e.target.value)}
                          style={inputStyle}
                        />
                      ) : (
                        <div style={{ 
                          padding: "8px", 
                          backgroundColor: "rgba(30, 41, 59, 0.5)",
                          borderRadius: "4px",
                          color: "#f1f5f9"
                        }}>
                          {editingWorkCenter.description || '-'}
                        </div>
                      )}
                    </div>
                    <div>
                      <label style={labelStyle}>Work Center Code</label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={editingWorkCenter.workCenterCode || ''}
                          onChange={(e) => handleWorkCenterChange('workCenterCode', e.target.value)}
                          style={inputStyle}
                        />
                      ) : (
                        <div style={{ 
                          padding: "8px", 
                          backgroundColor: "rgba(30, 41, 59, 0.5)",
                          borderRadius: "4px",
                          color: "#f1f5f9"
                        }}>
                          {editingWorkCenter.workCenterCode || '-'}
                        </div>
                      )}
                    </div>
                    <div>
                      <label style={labelStyle}>Üretim Hattı</label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={editingWorkCenter.productionLine || ''}
                          onChange={(e) => handleWorkCenterChange('productionLine', e.target.value)}
                          style={inputStyle}
                        />
                      ) : (
                        <div style={{ 
                          padding: "8px", 
                          backgroundColor: "rgba(30, 41, 59, 0.5)",
                          borderRadius: "4px",
                          color: "#f1f5f9"
                        }}>
                          {editingWorkCenter.productionLine || '-'}
                        </div>
                      )}
                    </div>
                    <div>
                      <label style={labelStyle}>Departman No</label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={editingWorkCenter.departmentNo || ''}
                          onChange={(e) => handleWorkCenterChange('departmentNo', e.target.value)}
                          style={inputStyle}
                        />
                      ) : (
                        <div style={{ 
                          padding: "8px", 
                          backgroundColor: "rgba(30, 41, 59, 0.5)",
                          borderRadius: "4px",
                          color: "#f1f5f9"
                        }}>
                          {editingWorkCenter.departmentNo || '-'}
                        </div>
                      )}
                    </div>
                    <div>
                      <label style={labelStyle}>Durum</label>
                      {isEditing ? (
                        <select
                          value={editingWorkCenter.rowstate || 'Active'}
                          onChange={(e) => handleWorkCenterChange('rowstate', e.target.value)}
                          style={inputStyle}
                        >
                          <option value="Active">Aktif</option>
                          <option value="Inactive">Pasif</option>
                          <option value="Deleted">Silindi</option>
                        </select>
                      ) : (
                        <div style={{ 
                          padding: "8px", 
                          backgroundColor: editingWorkCenter.rowstate === 'Active' 
                            ? "rgba(16, 185, 129, 0.2)" 
                            : "rgba(239, 68, 68, 0.2)",
                          borderRadius: "4px",
                          color: editingWorkCenter.rowstate === 'Active' ? "#10b981" : "#ef4444",
                          textAlign: "center",
                          fontWeight: "500"
                        }}>
                          {editingWorkCenter.rowstate || '-'}
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
                        {editingWorkCenter.createDate ? 
                          new Date(editingWorkCenter.createDate).toLocaleDateString('tr-TR') : 
                          'Belirtilmemiş'}
                      </div>
                    </div>
                    <div>
                      <label style={labelStyle}>Row Key</label>
                      <div style={{ 
                        padding: "8px", 
                        backgroundColor: "rgba(30, 41, 59, 0.5)",
                        borderRadius: "4px",
                        color: "#94a3b8",
                        fontSize: "0.8rem",
                        wordBreak: "break-all"
                      }}>
                        {editingWorkCenter.rowkey || '-'}
                      </div>
                    </div>
                    <div style={{ gridColumn: "1 / -1" }}>
                      <label style={labelStyle}>Not</label>
                      {isEditing ? (
                        <textarea
                          value={editingWorkCenter.noteText || ''}
                          onChange={(e) => handleWorkCenterChange('noteText', e.target.value)}
                          rows={3}
                          style={{
                            ...inputStyle,
                            resize: "vertical"
                          }}
                        />
                      ) : (
                        <div style={{ 
                          padding: "8px", 
                          backgroundColor: "rgba(30, 41, 59, 0.5)",
                          borderRadius: "4px",
                          color: "#f1f5f9",
                          minHeight: "50px"
                        }}>
                          {editingWorkCenter.noteText || '-'}
                        </div>
                      )}
                    </div>
                  </>
                ) : null}
              </div>
            </div>
          )}

          {/* Hiç kayıt seçilmediyse mesaj */}
          {!selectedWorkCenter && !isCreatingNew && (
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
              <p>Detayları görmek için tablodan bir kayıt seçin veya yeni kayıt oluşturun.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}