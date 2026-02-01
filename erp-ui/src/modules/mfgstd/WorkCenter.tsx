import { useState } from "react";
import { ChevronRightIcon } from "@heroicons/react/24/outline";

// Operasyonlar için interface
interface Operation {
  id: number;
  operationCode: string;
  operationName: string;
  workCenterCode?: string;
  setupTime?: number;
  runTime?: number;
  unitOfMeasure?: string;
  costCenter?: string;
  isActive: boolean;
  description?: string;
  createdDate: string;
  createdBy: string;
  rowversion: number;
}

// İş Merkezleri için interface
interface WorkCenter {
  id: number;
  workCenterCode: string;
  workCenterName: string;
  department?: string;
  capacity?: number;
  efficiency?: number;
  supervisor?: string;
  costPerHour?: number;
  isActive: boolean;
  description?: string;
  createdDate: string;
  createdBy: string;
  rowversion: number;
}

const tabs = ["Operasyonlar", "İş Merkezleri"];

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

export default function EngineeringDataPage() {
  const [activeTab, setActiveTab] = useState("Operasyonlar");
  const [isSearchPanelVisible, setIsSearchPanelVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Operasyonlar için state'ler
  const [operations, setOperations] = useState<Operation[]>([
    {
      id: 1,
      operationCode: "OP10",
      operationName: "Torna İşlemi",
      workCenterCode: "TORNA001",
      setupTime: 30,
      runTime: 5,
      unitOfMeasure: "Dakika",
      costCenter: "CC001",
      isActive: true,
      description: "CNC torna işleme operasyonu",
      createdDate: "2024-01-15",
      createdBy: "admin",
      rowversion: 1
    },
    {
      id: 2,
      operationCode: "OP20",
      operationName: "Freze İşlemi",
      workCenterCode: "FREZE001",
      setupTime: 45,
      runTime: 8,
      unitOfMeasure: "Dakika",
      costCenter: "CC001",
      isActive: true,
      description: "CNC freze işleme operasyonu",
      createdDate: "2024-01-16",
      createdBy: "admin",
      rowversion: 1
    },
    {
      id: 3,
      operationCode: "OP30",
      operationName: "Taşlama",
      workCenterCode: "TASLAMA001",
      setupTime: 20,
      runTime: 3,
      unitOfMeasure: "Dakika",
      costCenter: "CC002",
      isActive: false,
      description: "Yüzey taşlama operasyonu",
      createdDate: "2024-01-17",
      createdBy: "admin",
      rowversion: 1
    }
  ]);

  // İş Merkezleri için state'ler
  const [workCenters, setWorkCenters] = useState<WorkCenter[]>([
    {
      id: 1,
      workCenterCode: "TORNA001",
      workCenterName: "CNC Torna Atölyesi",
      department: "Üretim",
      capacity: 160,
      efficiency: 85,
      supervisor: "Ahmet Yılmaz",
      costPerHour: 150,
      isActive: true,
      description: "5 Eksen CNC torna tezgahları",
      createdDate: "2024-01-10",
      createdBy: "admin",
      rowversion: 1
    },
    {
      id: 2,
      workCenterCode: "FREZE001",
      workCenterName: "CNC Freze Atölyesi",
      department: "Üretim",
      capacity: 160,
      efficiency: 90,
      supervisor: "Mehmet Demir",
      costPerHour: 180,
      isActive: true,
      description: "3-5 Eksen CNC freze tezgahları",
      createdDate: "2024-01-11",
      createdBy: "admin",
      rowversion: 1
    },
    {
      id: 3,
      workCenterCode: "TASLAMA001",
      workCenterName: "Taşlama Atölyesi",
      department: "İşleme",
      capacity: 120,
      efficiency: 75,
      supervisor: "Ayşe Kaya",
      costPerHour: 120,
      isActive: true,
      description: "Silindirik ve yüzey taşlama tezgahları",
      createdDate: "2024-01-12",
      createdBy: "admin",
      rowversion: 1
    }
  ]);

  const [selectedOperation, setSelectedOperation] = useState<Operation | null>(null);
  const [selectedWorkCenter, setSelectedWorkCenter] = useState<WorkCenter | null>(null);
  const [editingOperation, setEditingOperation] = useState<Operation | null>(null);
  const [editingWorkCenter, setEditingWorkCenter] = useState<WorkCenter | null>(null);
  
  // Yeni kayıt için state'ler
  const [newOperation, setNewOperation] = useState<Partial<Operation>>({
    operationCode: "",
    operationName: "",
    workCenterCode: "",
    setupTime: 0,
    runTime: 0,
    unitOfMeasure: "Dakika",
    costCenter: "",
    isActive: true,
    description: "",
    createdBy: "admin",
    rowversion: 1
  });

  const [newWorkCenter, setNewWorkCenter] = useState<Partial<WorkCenter>>({
    workCenterCode: "",
    workCenterName: "",
    department: "",
    capacity: 160,
    efficiency: 85,
    supervisor: "",
    costPerHour: 0,
    isActive: true,
    description: "",
    createdBy: "admin",
    rowversion: 1
  });

  // Filtrelenmiş listeler
  const filteredOperations = operations.filter(op => 
    op.operationCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
    op.operationName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (op.workCenterCode && op.workCenterCode.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (op.description && op.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const filteredWorkCenters = workCenters.filter(wc => 
    wc.workCenterCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
    wc.workCenterName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (wc.department && wc.department.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (wc.description && wc.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleToggleSearchPanel = () => {
    setIsSearchPanelVisible(!isSearchPanelVisible);
  };

  const handleOperationSelect = (operation: Operation) => {
    setSelectedOperation(operation);
    setEditingOperation({...operation});
    setSelectedWorkCenter(null);
    setEditingWorkCenter(null);
    setIsCreatingNew(false);
    setIsEditing(false);
  };

  const handleWorkCenterSelect = (workCenter: WorkCenter) => {
    setSelectedWorkCenter(workCenter);
    setEditingWorkCenter({...workCenter});
    setSelectedOperation(null);
    setEditingOperation(null);
    setIsCreatingNew(false);
    setIsEditing(false);
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    if (activeTab === "Operasyonlar" && selectedOperation) {
      setEditingOperation({...selectedOperation});
    } else if (activeTab === "İş Merkezleri" && selectedWorkCenter) {
      setEditingWorkCenter({...selectedWorkCenter});
    }
  };

  const handleSave = () => {
    setIsSaving(true);
    
    // Simüle edilmiş API çağrısı
    setTimeout(() => {
      if (activeTab === "Operasyonlar" && editingOperation) {
        const updatedOperations = operations.map(op => 
          op.id === editingOperation.id ? editingOperation : op
        );
        setOperations(updatedOperations);
        setSelectedOperation(editingOperation);
      } else if (activeTab === "İş Merkezleri" && editingWorkCenter) {
        const updatedWorkCenters = workCenters.map(wc => 
          wc.id === editingWorkCenter.id ? editingWorkCenter : wc
        );
        setWorkCenters(updatedWorkCenters);
        setSelectedWorkCenter(editingWorkCenter);
      }
      
      setIsEditing(false);
      setIsSaving(false);
      alert("Kayıt başarıyla güncellendi!");
    }, 1000);
  };

  const handleDelete = () => {
    if (activeTab === "Operasyonlar" && selectedOperation) {
      if (window.confirm(`${selectedOperation.operationCode} kodlu operasyonu silmek istediğinize emin misiniz?`)) {
        const updatedOperations = operations.filter(op => op.id !== selectedOperation.id);
        setOperations(updatedOperations);
        setSelectedOperation(null);
        setEditingOperation(null);
      }
    } else if (activeTab === "İş Merkezleri" && selectedWorkCenter) {
      if (window.confirm(`${selectedWorkCenter.workCenterCode} kodlu iş merkezini silmek istediğinize emin misiniz?`)) {
        const updatedWorkCenters = workCenters.filter(wc => wc.id !== selectedWorkCenter.id);
        setWorkCenters(updatedWorkCenters);
        setSelectedWorkCenter(null);
        setEditingWorkCenter(null);
      }
    }
  };

  const handleCreateNew = () => {
    setIsCreatingNew(true);
    setIsEditing(true);
    if (activeTab === "Operasyonlar") {
      setNewOperation({
        operationCode: "",
        operationName: "",
        workCenterCode: "",
        setupTime: 0,
        runTime: 0,
        unitOfMeasure: "Dakika",
        costCenter: "",
        isActive: true,
        description: "",
        createdBy: "admin",
        rowversion: 1
      });
    } else {
      setNewWorkCenter({
        workCenterCode: "",
        workCenterName: "",
        department: "",
        capacity: 160,
        efficiency: 85,
        supervisor: "",
        costPerHour: 0,
        isActive: true,
        description: "",
        createdBy: "admin",
        rowversion: 1
      });
    }
  };

  const handleSaveNew = () => {
    setIsSaving(true);
    
    setTimeout(() => {
      if (activeTab === "Operasyonlar") {
        const newOp: Operation = {
          id: operations.length + 1,
          operationCode: newOperation.operationCode || "",
          operationName: newOperation.operationName || "",
          workCenterCode: newOperation.workCenterCode,
          setupTime: newOperation.setupTime,
          runTime: newOperation.runTime,
          unitOfMeasure: newOperation.unitOfMeasure,
          costCenter: newOperation.costCenter,
          isActive: newOperation.isActive || true,
          description: newOperation.description,
          createdDate: new Date().toISOString().split('T')[0],
          createdBy: newOperation.createdBy || "admin",
          rowversion: newOperation.rowversion || 1
        };
        
        setOperations([...operations, newOp]);
        setSelectedOperation(newOp);
        setEditingOperation(newOp);
      } else {
        const newWc: WorkCenter = {
          id: workCenters.length + 1,
          workCenterCode: newWorkCenter.workCenterCode || "",
          workCenterName: newWorkCenter.workCenterName || "",
          department: newWorkCenter.department,
          capacity: newWorkCenter.capacity,
          efficiency: newWorkCenter.efficiency,
          supervisor: newWorkCenter.supervisor,
          costPerHour: newWorkCenter.costPerHour,
          isActive: newWorkCenter.isActive || true,
          description: newWorkCenter.description,
          createdDate: new Date().toISOString().split('T')[0],
          createdBy: newWorkCenter.createdBy || "admin",
          rowversion: newWorkCenter.rowversion || 1
        };
        
        setWorkCenters([...workCenters, newWc]);
        setSelectedWorkCenter(newWc);
        setEditingWorkCenter(newWc);
      }
      
      setIsCreatingNew(false);
      setIsEditing(false);
      setIsSaving(false);
      alert("Yeni kayıt başarıyla oluşturuldu!");
    }, 1000);
  };

  const handleCancelNew = () => {
    setIsCreatingNew(false);
    setIsEditing(false);
  };

  const handleOperationChange = (field: keyof Operation, value: any) => {
    if (editingOperation) {
      setEditingOperation({
        ...editingOperation,
        [field]: value
      });
    }
  };

  const handleWorkCenterChange = (field: keyof WorkCenter, value: any) => {
    if (editingWorkCenter) {
      setEditingWorkCenter({
        ...editingWorkCenter,
        [field]: value
      });
    }
  };

  const handleNewOperationChange = (field: keyof Operation, value: any) => {
    setNewOperation({
      ...newOperation,
      [field]: value
    });
  };

  const handleNewWorkCenterChange = (field: keyof WorkCenter, value: any) => {
    setNewWorkCenter({
      ...newWorkCenter,
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
              <i className={activeTab === "Operasyonlar" ? "fas fa-search" : "fas fa-search"}></i>
              {activeTab === "Operasyonlar" ? "Operasyon Arama" : "İş Merkezi Arama"}
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
            {(activeTab === "Operasyonlar" ? filteredOperations : filteredWorkCenters).map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  if (activeTab === "Operasyonlar") {
                    handleOperationSelect(item as Operation);
                  } else {
                    handleWorkCenterSelect(item as WorkCenter);
                  }
                }}
                style={{
                  padding: "12px 15px",
                  marginBottom: "8px",
                  backgroundColor: (activeTab === "Operasyonlar" && selectedOperation?.id === item.id) ||
                                   (activeTab === "İş Merkezleri" && selectedWorkCenter?.id === item.id)
                    ? "rgba(56, 189, 248, 0.2)"
                    : "rgba(30, 41, 59, 0.5)",
                  border: "1px solid #334155",
                  borderRadius: "8px",
                  cursor: "pointer",
                  transition: "all 0.2s"
                }}
                onMouseOver={(e) => {
                  if ((activeTab === "Operasyonlar" && selectedOperation?.id !== item.id) ||
                      (activeTab === "İş Merkezleri" && selectedWorkCenter?.id !== item.id)) {
                    e.currentTarget.style.backgroundColor = "rgba(56, 189, 248, 0.1)";
                  }
                }}
                onMouseOut={(e) => {
                  if ((activeTab === "Operasyonlar" && selectedOperation?.id !== item.id) ||
                      (activeTab === "İş Merkezleri" && selectedWorkCenter?.id !== item.id)) {
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
                    backgroundColor: activeTab === "Operasyonlar" ? "rgba(139, 92, 246, 0.2)" : "rgba(16, 185, 129, 0.2)",
                    borderRadius: "6px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: "10px",
                    flexShrink: 0
                  }}>
                    <i className={activeTab === "Operasyonlar" ? "fas fa-cog" : "fas fa-industry"}
                      style={{
                        color: activeTab === "Operasyonlar" ? "#8b5cf6" : "#10b981",
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
                      {activeTab === "Operasyonlar" 
                        ? (item as Operation).operationCode 
                        : (item as WorkCenter).workCenterCode}
                    </div>
                    <div style={{
                      color: "#94a3b8",
                      fontSize: "0.8rem"
                    }}>
                      {activeTab === "Operasyonlar" 
                        ? (item as Operation).operationName 
                        : (item as WorkCenter).workCenterName}
                    </div>
                  </div>
                </div>
                
                <div style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "6px",
                  marginTop: "8px"
                }}>
                  {activeTab === "Operasyonlar" ? (
                    <>
                      <span style={{
                        backgroundColor: "rgba(245, 158, 11, 0.2)",
                        color: "#f59e0b",
                        padding: "2px 6px",
                        borderRadius: "4px",
                        fontSize: "0.7rem"
                      }}>
                        Kurulum: {(item as Operation).setupTime}dk
                      </span>
                      <span style={{
                        backgroundColor: "rgba(16, 185, 129, 0.2)",
                        color: "#10b981",
                        padding: "2px 6px",
                        borderRadius: "4px",
                        fontSize: "0.7rem"
                      }}>
                        Çalışma: {(item as Operation).runTime}dk
                      </span>
                      <span style={{
                        backgroundColor: (item as Operation).isActive 
                          ? "rgba(16, 185, 129, 0.2)" 
                          : "rgba(239, 68, 68, 0.2)",
                        color: (item as Operation).isActive ? "#10b981" : "#ef4444",
                        padding: "2px 6px",
                        borderRadius: "4px",
                        fontSize: "0.7rem"
                      }}>
                        {(item as Operation).isActive ? 'Aktif' : 'Pasif'}
                      </span>
                    </>
                  ) : (
                    <>
                      <span style={{
                        backgroundColor: "rgba(59, 130, 246, 0.2)",
                        color: "#3b82f6",
                        padding: "2px 6px",
                        borderRadius: "4px",
                        fontSize: "0.7rem"
                      }}>
                        %{(item as WorkCenter).efficiency}
                      </span>
                      <span style={{
                        backgroundColor: (item as WorkCenter).isActive 
                          ? "rgba(16, 185, 129, 0.2)" 
                          : "rgba(239, 68, 68, 0.2)",
                        color: (item as WorkCenter).isActive ? "#10b981" : "#ef4444",
                        padding: "2px 6px",
                        borderRadius: "4px",
                        fontSize: "0.7rem"
                      }}>
                        {(item as WorkCenter).isActive ? 'Aktif' : 'Pasif'}
                      </span>
                    </>
                  )}
                </div>
              </div>
            ))}
            
            {(activeTab === "Operasyonlar" ? filteredOperations.length === 0 : filteredWorkCenters.length === 0) && (
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
            <i className="fas fa-cogs"></i>
            Mühendislik Temel Veri Ekranı
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
                  setActiveTab(tab);
                  setIsCreatingNew(false);
                  setIsEditing(false);
                  setSelectedOperation(null);
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
                <i className={tab === "Operasyonlar" ? "fas fa-cog" : "fas fa-industry"}></i>
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
                  {activeTab === "Operasyonlar" 
                    ? `Toplam ${operations.length} operasyon` 
                    : `Toplam ${workCenters.length} iş merkezi`}
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
                <span>Yeni {activeTab === "Operasyonlar" ? "Operasyon" : "İş Merkezi"}</span>
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
              gridTemplateColumns: activeTab === "Operasyonlar" 
                ? "100px 2fr 120px 100px 100px 120px 80px"
                : "120px 2fr 120px 100px 100px 120px 150px 80px",
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
              {activeTab === "Operasyonlar" ? (
                <>
                  <div>Operasyon Kodu</div>
                  <div>Operasyon Adı</div>
                  <div>İş Merkezi</div>
                  <div>Kurulum Süresi</div>
                  <div>Çalışma Süresi</div>
                  <div>Maliyet Merkezi</div>
                  <div>Durum</div>
                </>
              ) : (
                <>
                  <div>İş Merkezi Kodu</div>
                  <div>İş Merkezi Adı</div>
                  <div>Departman</div>
                  <div>Kapasite</div>
                  <div>Verimlilik</div>
                  <div>Sorumlu</div>
                  <div>Saatlik Maliyet</div>
                  <div>Durum</div>
                </>
              )}
            </div>

            {/* Grid Body */}
            <div style={{ 
              flex: 1, 
              overflowY: "auto",
              maxHeight: "calc(100vh - 300px)"
            }}>
              {(activeTab === "Operasyonlar" ? filteredOperations : filteredWorkCenters).map((item, index) => {
                const isSelected = activeTab === "Operasyonlar" 
                  ? selectedOperation?.id === (item as Operation).id
                  : selectedWorkCenter?.id === (item as WorkCenter).id;
                
                return (
                  <div
                    key={item.id}
                    onClick={() => {
                      if (activeTab === "Operasyonlar") {
                        handleOperationSelect(item as Operation);
                      } else {
                        handleWorkCenterSelect(item as WorkCenter);
                      }
                    }}
                    style={{
                      display: "grid",
                      gridTemplateColumns: activeTab === "Operasyonlar" 
                        ? "100px 2fr 120px 100px 100px 120px 80px"
                        : "120px 2fr 120px 100px 100px 120px 150px 80px",
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
                    {activeTab === "Operasyonlar" ? (
                      <>
                        <div>
                          <i className="fas fa-cog" style={{ 
                            marginRight: "8px", 
                            color: "#8b5cf6" 
                          }}></i>
                          {(item as Operation).operationCode}
                        </div>
                        <div>{(item as Operation).operationName}</div>
                        <div style={{ color: "#94a3b8" }}>
                          {(item as Operation).workCenterCode || '-'}
                        </div>
                        <div style={{ textAlign: "center" }}>
                          <span style={{
                            backgroundColor: "rgba(245, 158, 11, 0.2)",
                            color: "#f59e0b",
                            padding: "2px 6px",
                            borderRadius: "4px",
                            fontSize: "0.8rem"
                          }}>
                            {(item as Operation).setupTime}dk
                          </span>
                        </div>
                        <div style={{ textAlign: "center" }}>
                          <span style={{
                            backgroundColor: "rgba(16, 185, 129, 0.2)",
                            color: "#10b981",
                            padding: "2px 6px",
                            borderRadius: "4px",
                            fontSize: "0.8rem"
                          }}>
                            {(item as Operation).runTime}dk
                          </span>
                        </div>
                        <div style={{ color: "#94a3b8" }}>
                          {(item as Operation).costCenter || '-'}
                        </div>
                        <div style={{ textAlign: "center" }}>
                          <span style={{
                            backgroundColor: (item as Operation).isActive 
                              ? "rgba(16, 185, 129, 0.2)" 
                              : "rgba(239, 68, 68, 0.2)",
                            color: (item as Operation).isActive ? "#10b981" : "#ef4444",
                            padding: "2px 6px",
                            borderRadius: "4px",
                            fontSize: "0.8rem"
                          }}>
                            {(item as Operation).isActive ? 'Aktif' : 'Pasif'}
                          </span>
                        </div>
                      </>
                    ) : (
                      <>
                        <div>
                          <i className="fas fa-industry" style={{ 
                            marginRight: "8px", 
                            color: "#8b5cf6" 
                          }}></i>
                          {(item as WorkCenter).workCenterCode}
                        </div>
                        <div>{(item as WorkCenter).workCenterName}</div>
                        <div style={{ color: "#94a3b8" }}>
                          {(item as WorkCenter).department || '-'}
                        </div>
                        <div style={{ textAlign: "center" }}>
                          <span style={{
                            backgroundColor: "rgba(59, 130, 246, 0.2)",
                            color: "#3b82f6",
                            padding: "2px 6px",
                            borderRadius: "4px",
                            fontSize: "0.8rem"
                          }}>
                            {(item as WorkCenter).capacity}sa
                          </span>
                        </div>
                        <div style={{ textAlign: "center" }}>
                          <span style={{
                            backgroundColor: "rgba(16, 185, 129, 0.2)",
                            color: "#10b981",
                            padding: "2px 6px",
                            borderRadius: "4px",
                            fontSize: "0.8rem"
                          }}>
                            %{(item as WorkCenter).efficiency}
                          </span>
                        </div>
                        <div style={{ color: "#94a3b8" }}>
                          {(item as WorkCenter).supervisor || '-'}
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <span style={{
                            backgroundColor: "rgba(168, 85, 247, 0.2)",
                            color: "#a855f7",
                            padding: "2px 6px",
                            borderRadius: "4px",
                            fontSize: "0.8rem"
                          }}>
                            ${(item as WorkCenter).costPerHour?.toFixed(2)}
                          </span>
                        </div>
                        <div style={{ textAlign: "center" }}>
                          <span style={{
                            backgroundColor: (item as WorkCenter).isActive 
                              ? "rgba(16, 185, 129, 0.2)" 
                              : "rgba(239, 68, 68, 0.2)",
                            color: (item as WorkCenter).isActive ? "#10b981" : "#ef4444",
                            padding: "2px 6px",
                            borderRadius: "4px",
                            fontSize: "0.8rem"
                          }}>
                            {(item as WorkCenter).isActive ? 'Aktif' : 'Pasif'}
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Seçili Kayıt Detayları */}
          {(selectedOperation || selectedWorkCenter || isCreatingNew) && (
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
                    ? `Yeni ${activeTab === "Operasyonlar" ? "Operasyon" : "İş Merkezi"} Oluştur` 
                    : `${activeTab === "Operasyonlar" ? "Operasyon" : "İş Merkezi"} Detayları`}
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
                {activeTab === "Operasyonlar" ? (
                  isCreatingNew ? (
                    // Yeni Operasyon Formu
                    <>
                      <div>
                        <label style={labelStyle}>Operasyon Kodu *</label>
                        <input
                          type="text"
                          value={newOperation.operationCode || ''}
                          onChange={(e) => handleNewOperationChange('operationCode', e.target.value)}
                          style={inputStyle}
                          placeholder="Örn: OP10"
                        />
                      </div>
                      <div>
                        <label style={labelStyle}>Operasyon Adı *</label>
                        <input
                          type="text"
                          value={newOperation.operationName || ''}
                          onChange={(e) => handleNewOperationChange('operationName', e.target.value)}
                          style={inputStyle}
                          placeholder="Operasyon adını girin"
                        />
                      </div>
                      <div>
                        <label style={labelStyle}>İş Merkezi Kodu</label>
                        <input
                          type="text"
                          value={newOperation.workCenterCode || ''}
                          onChange={(e) => handleNewOperationChange('workCenterCode', e.target.value)}
                          style={inputStyle}
                          placeholder="İş merkezi kodu"
                        />
                      </div>
                      <div>
                        <label style={labelStyle}>Kurulum Süresi (dk)</label>
                        <input
                          type="number"
                          value={newOperation.setupTime || 0}
                          onChange={(e) => handleNewOperationChange('setupTime', parseInt(e.target.value))}
                          style={inputStyle}
                          min="0"
                        />
                      </div>
                      <div>
                        <label style={labelStyle}>Çalışma Süresi (dk)</label>
                        <input
                          type="number"
                          value={newOperation.runTime || 0}
                          onChange={(e) => handleNewOperationChange('runTime', parseInt(e.target.value))}
                          style={inputStyle}
                          min="0"
                        />
                      </div>
                      <div>
                        <label style={labelStyle}>Birim</label>
                        <select
                          value={newOperation.unitOfMeasure || 'Dakika'}
                          onChange={(e) => handleNewOperationChange('unitOfMeasure', e.target.value)}
                          style={inputStyle}
                        >
                          <option value="Dakika">Dakika</option>
                          <option value="Saat">Saat</option>
                          <option value="Adet">Adet</option>
                        </select>
                      </div>
                      <div>
                        <label style={labelStyle}>Maliyet Merkezi</label>
                        <input
                          type="text"
                          value={newOperation.costCenter || ''}
                          onChange={(e) => handleNewOperationChange('costCenter', e.target.value)}
                          style={inputStyle}
                          placeholder="Maliyet merkezi kodu"
                        />
                      </div>
                      <div>
                        <label style={labelStyle}>Durum</label>
                        <select
                          value={newOperation.isActive ? 'true' : 'false'}
                          onChange={(e) => handleNewOperationChange('isActive', e.target.value === 'true')}
                          style={inputStyle}
                        >
                          <option value="true">Aktif</option>
                          <option value="false">Pasif</option>
                        </select>
                      </div>
                      <div style={{ gridColumn: "1 / -1" }}>
                        <label style={labelStyle}>Açıklama</label>
                        <textarea
                          value={newOperation.description || ''}
                          onChange={(e) => handleNewOperationChange('description', e.target.value)}
                          rows={3}
                          style={{
                            ...inputStyle,
                            resize: "vertical"
                          }}
                          placeholder="Operasyon açıklaması..."
                        />
                      </div>
                    </>
                  ) : editingOperation ? (
                    // Operasyon Düzenleme Formu
                    <>
                      <div>
                        <label style={labelStyle}>Operasyon Kodu</label>
                        {isEditing ? (
                          <input
                            type="text"
                            value={editingOperation.operationCode}
                            onChange={(e) => handleOperationChange('operationCode', e.target.value)}
                            style={inputStyle}
                          />
                        ) : (
                          <div style={{ 
                            padding: "8px", 
                            backgroundColor: "rgba(30, 41, 59, 0.5)",
                            borderRadius: "4px",
                            color: "#f1f5f9"
                          }}>
                            {editingOperation.operationCode}
                          </div>
                        )}
                      </div>
                      <div>
                        <label style={labelStyle}>Operasyon Adı</label>
                        {isEditing ? (
                          <input
                            type="text"
                            value={editingOperation.operationName}
                            onChange={(e) => handleOperationChange('operationName', e.target.value)}
                            style={inputStyle}
                          />
                        ) : (
                          <div style={{ 
                            padding: "8px", 
                            backgroundColor: "rgba(30, 41, 59, 0.5)",
                            borderRadius: "4px",
                            color: "#f1f5f9"
                          }}>
                            {editingOperation.operationName}
                          </div>
                        )}
                      </div>
                      <div>
                        <label style={labelStyle}>İş Merkezi Kodu</label>
                        {isEditing ? (
                          <input
                            type="text"
                            value={editingOperation.workCenterCode || ''}
                            onChange={(e) => handleOperationChange('workCenterCode', e.target.value)}
                            style={inputStyle}
                          />
                        ) : (
                          <div style={{ 
                            padding: "8px", 
                            backgroundColor: "rgba(30, 41, 59, 0.5)",
                            borderRadius: "4px",
                            color: "#f1f5f9"
                          }}>
                            {editingOperation.workCenterCode || '-'}
                          </div>
                        )}
                      </div>
                      <div>
                        <label style={labelStyle}>Kurulum Süresi (dk)</label>
                        {isEditing ? (
                          <input
                            type="number"
                            value={editingOperation.setupTime || 0}
                            onChange={(e) => handleOperationChange('setupTime', parseInt(e.target.value))}
                            style={inputStyle}
                            min="0"
                          />
                        ) : (
                          <div style={{ 
                            padding: "8px", 
                            backgroundColor: "rgba(30, 41, 59, 0.5)",
                            borderRadius: "4px",
                            color: "#f1f5f9",
                            textAlign: "center"
                          }}>
                            {editingOperation.setupTime}dk
                          </div>
                        )}
                      </div>
                      <div>
                        <label style={labelStyle}>Çalışma Süresi (dk)</label>
                        {isEditing ? (
                          <input
                            type="number"
                            value={editingOperation.runTime || 0}
                            onChange={(e) => handleOperationChange('runTime', parseInt(e.target.value))}
                            style={inputStyle}
                            min="0"
                          />
                        ) : (
                          <div style={{ 
                            padding: "8px", 
                            backgroundColor: "rgba(30, 41, 59, 0.5)",
                            borderRadius: "4px",
                            color: "#f1f5f9",
                            textAlign: "center"
                          }}>
                            {editingOperation.runTime}dk
                          </div>
                        )}
                      </div>
                      <div>
                        <label style={labelStyle}>Maliyet Merkezi</label>
                        {isEditing ? (
                          <input
                            type="text"
                            value={editingOperation.costCenter || ''}
                            onChange={(e) => handleOperationChange('costCenter', e.target.value)}
                            style={inputStyle}
                          />
                        ) : (
                          <div style={{ 
                            padding: "8px", 
                            backgroundColor: "rgba(30, 41, 59, 0.5)",
                            borderRadius: "4px",
                            color: "#f1f5f9"
                          }}>
                            {editingOperation.costCenter || '-'}
                          </div>
                        )}
                      </div>
                      <div>
                        <label style={labelStyle}>Durum</label>
                        {isEditing ? (
                          <select
                            value={editingOperation.isActive ? 'true' : 'false'}
                            onChange={(e) => handleOperationChange('isActive', e.target.value === 'true')}
                            style={inputStyle}
                          >
                            <option value="true">Aktif</option>
                            <option value="false">Pasif</option>
                          </select>
                        ) : (
                          <div style={{ 
                            padding: "8px", 
                            backgroundColor: editingOperation.isActive 
                              ? "rgba(16, 185, 129, 0.2)" 
                              : "rgba(239, 68, 68, 0.2)",
                            borderRadius: "4px",
                            color: editingOperation.isActive ? "#10b981" : "#ef4444",
                            textAlign: "center",
                            fontWeight: "500"
                          }}>
                            {editingOperation.isActive ? 'Aktif' : 'Pasif'}
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
                          {editingOperation.createdDate}
                        </div>
                      </div>
                      <div style={{ gridColumn: "1 / -1" }}>
                        <label style={labelStyle}>Açıklama</label>
                        {isEditing ? (
                          <textarea
                            value={editingOperation.description || ''}
                            onChange={(e) => handleOperationChange('description', e.target.value)}
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
                            {editingOperation.description || '-'}
                          </div>
                        )}
                      </div>
                    </>
                  ) : null
                ) : (
                  // İş Merkezleri Formu
                  isCreatingNew ? (
                    // Yeni İş Merkezi Formu
                    <>
                      <div>
                        <label style={labelStyle}>İş Merkezi Kodu *</label>
                        <input
                          type="text"
                          value={newWorkCenter.workCenterCode || ''}
                          onChange={(e) => handleNewWorkCenterChange('workCenterCode', e.target.value)}
                          style={inputStyle}
                          placeholder="Örn: TORNA001"
                        />
                      </div>
                      <div>
                        <label style={labelStyle}>İş Merkezi Adı *</label>
                        <input
                          type="text"
                          value={newWorkCenter.workCenterName || ''}
                          onChange={(e) => handleNewWorkCenterChange('workCenterName', e.target.value)}
                          style={inputStyle}
                          placeholder="İş merkezi adını girin"
                        />
                      </div>
                      <div>
                        <label style={labelStyle}>Departman</label>
                        <input
                          type="text"
                          value={newWorkCenter.department || ''}
                          onChange={(e) => handleNewWorkCenterChange('department', e.target.value)}
                          style={inputStyle}
                          placeholder="Departman adı"
                        />
                      </div>
                      <div>
                        <label style={labelStyle}>Kapasite (saat)</label>
                        <input
                          type="number"
                          value={newWorkCenter.capacity || 160}
                          onChange={(e) => handleNewWorkCenterChange('capacity', parseInt(e.target.value))}
                          style={inputStyle}
                          min="0"
                        />
                      </div>
                      <div>
                        <label style={labelStyle}>Verimlilik (%)</label>
                        <input
                          type="number"
                          value={newWorkCenter.efficiency || 85}
                          onChange={(e) => handleNewWorkCenterChange('efficiency', parseInt(e.target.value))}
                          style={inputStyle}
                          min="0"
                          max="100"
                        />
                      </div>
                      <div>
                        <label style={labelStyle}>Sorumlu</label>
                        <input
                          type="text"
                          value={newWorkCenter.supervisor || ''}
                          onChange={(e) => handleNewWorkCenterChange('supervisor', e.target.value)}
                          style={inputStyle}
                          placeholder="Sorumlu kişi"
                        />
                      </div>
                      <div>
                        <label style={labelStyle}>Saatlik Maliyet ($)</label>
                        <input
                          type="number"
                          value={newWorkCenter.costPerHour || 0}
                          onChange={(e) => handleNewWorkCenterChange('costPerHour', parseFloat(e.target.value))}
                          style={inputStyle}
                          min="0"
                          step="0.01"
                        />
                      </div>
                      <div>
                        <label style={labelStyle}>Durum</label>
                        <select
                          value={newWorkCenter.isActive ? 'true' : 'false'}
                          onChange={(e) => handleNewWorkCenterChange('isActive', e.target.value === 'true')}
                          style={inputStyle}
                        >
                          <option value="true">Aktif</option>
                          <option value="false">Pasif</option>
                        </select>
                      </div>
                      <div style={{ gridColumn: "1 / -1" }}>
                        <label style={labelStyle}>Açıklama</label>
                        <textarea
                          value={newWorkCenter.description || ''}
                          onChange={(e) => handleNewWorkCenterChange('description', e.target.value)}
                          rows={3}
                          style={{
                            ...inputStyle,
                            resize: "vertical"
                          }}
                          placeholder="İş merkezi açıklaması..."
                        />
                      </div>
                    </>
                  ) : editingWorkCenter ? (
                    // İş Merkezi Düzenleme Formu
                    <>
                      <div>
                        <label style={labelStyle}>İş Merkezi Kodu</label>
                        {isEditing ? (
                          <input
                            type="text"
                            value={editingWorkCenter.workCenterCode}
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
                            {editingWorkCenter.workCenterCode}
                          </div>
                        )}
                      </div>
                      <div>
                        <label style={labelStyle}>İş Merkezi Adı</label>
                        {isEditing ? (
                          <input
                            type="text"
                            value={editingWorkCenter.workCenterName}
                            onChange={(e) => handleWorkCenterChange('workCenterName', e.target.value)}
                            style={inputStyle}
                          />
                        ) : (
                          <div style={{ 
                            padding: "8px", 
                            backgroundColor: "rgba(30, 41, 59, 0.5)",
                            borderRadius: "4px",
                            color: "#f1f5f9"
                          }}>
                            {editingWorkCenter.workCenterName}
                          </div>
                        )}
                      </div>
                      <div>
                        <label style={labelStyle}>Departman</label>
                        {isEditing ? (
                          <input
                            type="text"
                            value={editingWorkCenter.department || ''}
                            onChange={(e) => handleWorkCenterChange('department', e.target.value)}
                            style={inputStyle}
                          />
                        ) : (
                          <div style={{ 
                            padding: "8px", 
                            backgroundColor: "rgba(30, 41, 59, 0.5)",
                            borderRadius: "4px",
                            color: "#f1f5f9"
                          }}>
                            {editingWorkCenter.department || '-'}
                          </div>
                        )}
                      </div>
                      <div>
                        <label style={labelStyle}>Kapasite (saat)</label>
                        {isEditing ? (
                          <input
                            type="number"
                            value={editingWorkCenter.capacity || 160}
                            onChange={(e) => handleWorkCenterChange('capacity', parseInt(e.target.value))}
                            style={inputStyle}
                            min="0"
                          />
                        ) : (
                          <div style={{ 
                            padding: "8px", 
                            backgroundColor: "rgba(30, 41, 59, 0.5)",
                            borderRadius: "4px",
                            color: "#f1f5f9",
                            textAlign: "center"
                          }}>
                            {editingWorkCenter.capacity}sa
                          </div>
                        )}
                      </div>
                      <div>
                        <label style={labelStyle}>Verimlilik (%)</label>
                        {isEditing ? (
                          <input
                            type="number"
                            value={editingWorkCenter.efficiency || 85}
                            onChange={(e) => handleWorkCenterChange('efficiency', parseInt(e.target.value))}
                            style={inputStyle}
                            min="0"
                            max="100"
                          />
                        ) : (
                          <div style={{ 
                            padding: "8px", 
                            backgroundColor: "rgba(30, 41, 59, 0.5)",
                            borderRadius: "4px",
                            color: "#f1f5f9",
                            textAlign: "center"
                          }}>
                            %{editingWorkCenter.efficiency}
                          </div>
                        )}
                      </div>
                      <div>
                        <label style={labelStyle}>Sorumlu</label>
                        {isEditing ? (
                          <input
                            type="text"
                            value={editingWorkCenter.supervisor || ''}
                            onChange={(e) => handleWorkCenterChange('supervisor', e.target.value)}
                            style={inputStyle}
                          />
                        ) : (
                          <div style={{ 
                            padding: "8px", 
                            backgroundColor: "rgba(30, 41, 59, 0.5)",
                            borderRadius: "4px",
                            color: "#f1f5f9"
                          }}>
                            {editingWorkCenter.supervisor || '-'}
                          </div>
                        )}
                      </div>
                      <div>
                        <label style={labelStyle}>Saatlik Maliyet ($)</label>
                        {isEditing ? (
                          <input
                            type="number"
                            value={editingWorkCenter.costPerHour || 0}
                            onChange={(e) => handleWorkCenterChange('costPerHour', parseFloat(e.target.value))}
                            style={inputStyle}
                            min="0"
                            step="0.01"
                          />
                        ) : (
                          <div style={{ 
                            padding: "8px", 
                            backgroundColor: "rgba(30, 41, 59, 0.5)",
                            borderRadius: "4px",
                            color: "#f1f5f9",
                            textAlign: "right"
                          }}>
                            ${editingWorkCenter.costPerHour?.toFixed(2)}
                          </div>
                        )}
                      </div>
                      <div>
                        <label style={labelStyle}>Durum</label>
                        {isEditing ? (
                          <select
                            value={editingWorkCenter.isActive ? 'true' : 'false'}
                            onChange={(e) => handleWorkCenterChange('isActive', e.target.value === 'true')}
                            style={inputStyle}
                          >
                            <option value="true">Aktif</option>
                            <option value="false">Pasif</option>
                          </select>
                        ) : (
                          <div style={{ 
                            padding: "8px", 
                            backgroundColor: editingWorkCenter.isActive 
                              ? "rgba(16, 185, 129, 0.2)" 
                              : "rgba(239, 68, 68, 0.2)",
                            borderRadius: "4px",
                            color: editingWorkCenter.isActive ? "#10b981" : "#ef4444",
                            textAlign: "center",
                            fontWeight: "500"
                          }}>
                            {editingWorkCenter.isActive ? 'Aktif' : 'Pasif'}
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
                          {editingWorkCenter.createdDate}
                        </div>
                      </div>
                      <div style={{ gridColumn: "1 / -1" }}>
                        <label style={labelStyle}>Açıklama</label>
                        {isEditing ? (
                          <textarea
                            value={editingWorkCenter.description || ''}
                            onChange={(e) => handleWorkCenterChange('description', e.target.value)}
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
                            {editingWorkCenter.description || '-'}
                          </div>
                        )}
                      </div>
                    </>
                  ) : null
                )}
              </div>
            </div>
          )}

          {/* Hiç kayıt seçilmediyse mesaj */}
          {!selectedOperation && !selectedWorkCenter && !isCreatingNew && (
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