import { useState, useEffect } from "react";
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
  creation_date?: string;
  created_by?: string;
  rowversion?: number;
  rowkey?: string;
}

interface CompanyUpdateDto {
  name?: string;
  associationNo?: string;
  defaultLanguage?: string;
  logotype?: string;
  corporateForm?: string;
  country?: string;
  localizationCountry?: string;
  rowversion: number;
}


interface CompanyCreateDto {
  companyId: string;  
  company: string;    
  name: string;
  associationNo?: string;
  defaultLanguage?: string;
  logotype?: string;
  corporateForm?: string;
  country?: string;
  localizationCountry?: string;
  createdBy: string;
  rowversion: number;
  rowkey: string;
}

// GeneralTab bileşeni
const GeneralTab = ({ 
  selectedCompany, 
  onFormDataChange,
  isNewCompanyMode,
  newCompanyFormData,
  onNewCompanyFormDataChange
}: { 
  selectedCompany: Company | null;
  onFormDataChange?: (formData: any) => void;
  isNewCompanyMode?: boolean;
  newCompanyFormData?: any;
  onNewCompanyFormDataChange?: (formData: any) => void;
}) => {
  const [formData, setFormData] = useState({
    default_language: selectedCompany?.default_language || "tr",
    logotype: selectedCompany?.logotype || "",
    corporate_form: selectedCompany?.corporate_form || "",
    country: selectedCompany?.country || "TR",
    localization_country: selectedCompany?.localization_country || "TR"
  });

  // Seçili şirket değiştiğinde formData'yı güncelle
  useEffect(() => {
    if (selectedCompany && !isNewCompanyMode) {
      const newFormData = {
        default_language: selectedCompany.default_language || "tr",
        logotype: selectedCompany.logotype || "",
        corporate_form: selectedCompany.corporate_form || "",
        country: selectedCompany.country || "TR",
        localization_country: selectedCompany.localization_country || "TR"
      };
      setFormData(newFormData);
      if (onFormDataChange) {
        onFormDataChange(newFormData);
      }
    }
  }, [selectedCompany, onFormDataChange, isNewCompanyMode]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (isNewCompanyMode && onNewCompanyFormDataChange) {
      const newFormData = {
        ...newCompanyFormData,
        [name]: value
      };
      onNewCompanyFormDataChange(newFormData);
    } else {
      const newFormData = {
        ...formData,
        [name]: value
      };
      setFormData(newFormData);
      
      if (onFormDataChange) {
        onFormDataChange(newFormData);
      }
    }
  };

  const displayData = isNewCompanyMode ? newCompanyFormData : formData;

  return (
    <div style={{ padding: "15px 0", minHeight: "250px" }}>
      <div style={{ 
        display: "grid", 
        gridTemplateColumns: "1fr", 
        gap: "15px" 
      }}>
        {selectedCompany || isNewCompanyMode ? (
          <>
            {/* İlk Satır */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "15px" }}>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <label style={{ marginBottom: "5px", color: "#f1f5f9", fontSize: "0.9rem" }}>Default Language</label>
                <select
                  name="default_language"
                  value={displayData?.default_language || "tr"}
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
                  value={displayData?.corporate_form || ""}
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
                  <option value="">Select Corporate Form</option>
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
                  value={displayData?.country || "TR"}
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
                  value={displayData?.localization_country || "TR"}
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
                  value={displayData?.logotype || ""}
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
            {displayData?.logotype && (
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
                    src={displayData.logotype} 
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

// AddressTab bileşeni
const AddressTab = ({ selectedCompany, isNewCompanyMode }: { selectedCompany: Company | null; isNewCompanyMode?: boolean }) => {
  return (
    <div style={{ padding: "15px 0", minHeight: "250px" }}>
      {selectedCompany || isNewCompanyMode ? (
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
  
  // Yeni şirket ekleme modu
  const [isNewCompanyMode, setIsNewCompanyMode] = useState(false);

  // PostgreSQL'den gelen şirket verileri
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // GeneralTab form verileri
  const [generalTabFormData, setGeneralTabFormData] = useState<any>(null);
  
  // Yeni şirket form verileri
  const [newCompanyFormData, setNewCompanyFormData] = useState({
    default_language: "tr",
    logotype: "",
    corporate_form: "",
    country: "TR",
    localization_country: "TR"
  });

  // Düzenlenen şirket bilgileri
  const [editingCompanyData, setEditingCompanyData] = useState({
    company: "",
    name: "",
    association_no: ""
  });

  // PostgreSQL'den şirket verilerini çek
  useEffect(() => {
    fetchCompanies();
  }, []);

  useEffect(() => {
    if (selectedCompany && !isNewCompanyMode) {
      setEditingCompanyData({
        company: selectedCompany.company,
        name: selectedCompany.name,
        association_no: selectedCompany.association_no || ""
      });
    }
  }, [selectedCompany, isNewCompanyMode]);

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/company');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      const formattedCompanies: Company[] = data.map((company: any, index: number) => ({
        id: index + 1,
        company: company.companyId || company.company || "",
        name: company.name || "",
        association_no: company.associationNo || company.association_no || "",
        default_language: company.defaultLanguage || company.default_language || "tr",
        logotype: company.logotype || "",
        corporate_form: company.corporateForm || company.corporate_form || "",
        country: company.country || "TR",
        localization_country: company.localizationCountry || company.localization_country || "TR",
        creation_date: company.creationDate || company.creation_date || "",
        created_by: company.createdBy || company.created_by || "",
        rowversion: company.rowversion || 1,
        rowkey: company.rowkey || ""
      }));
      
      setCompanies(formattedCompanies);
      setError(null);
    } catch (err) {
      console.error("Şirket verileri çekilirken hata:", err);
      setError(err instanceof Error ? err.message : "Bilinmeyen bir hata oluştu");
      setCompanies([]);
    } finally {
      setLoading(false);
    }
  };

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
      setEditingCompanyData({
        company: selected.company,
        name: selected.name,
        association_no: selected.association_no || ""
      });
      setIsNewCompanyMode(false);
    }
  };

  const handleToggleSearchList = () => {
    setIsSearchListVisible(!isSearchListVisible);
  };

  // Yeni şirket ekleme işlemi
  const handleAddNewCompany = () => {
    setIsNewCompanyMode(true);
    setSelectedCompany(null);
    setEditingCompanyData({
      company: "",
      name: "",
      association_no: ""
    });
    setNewCompanyFormData({
      default_language: "tr",
      logotype: "",
      corporate_form: "",
      country: "TR",
      localization_country: "TR"
    });
  };

  // Yeni şirketi kaydetme
const handleSaveNewCompany = async () => {
  // Validasyon
  if (!editingCompanyData.company.trim()) {
    alert("Company Code alanı zorunludur!");
    return;
  }
  
  if (!editingCompanyData.name.trim()) {
    alert("Company Name alanı zorunludur!");
    return;
  }

  try {
    const newCompany: CompanyCreateDto = {
      companyId: editingCompanyData.company,
      company: editingCompanyData.company, // Aynı değeri hem companyId hem company olarak gönder
      name: editingCompanyData.name,
      associationNo: editingCompanyData.association_no || undefined,
      defaultLanguage: newCompanyFormData.default_language,
      logotype: newCompanyFormData.logotype || undefined,
      corporateForm: newCompanyFormData.corporate_form || undefined,
      country: newCompanyFormData.country,
      localizationCountry: newCompanyFormData.localization_country,
      createdBy: "admin",
      rowversion: 1,
      rowkey: `company_${Date.now()}`
    };

    console.log("Gönderilen veri:", newCompany);

    const response = await fetch('/api/company', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newCompany),
    });

      if (response.ok) {
        const createdCompany = await response.json();
        await fetchCompanies();
        
        // Yeni eklenen şirketi seç
        const newCompanyData: Company = {
          id: companies.length + 1,
          company: createdCompany.companyId || createdCompany.company,
          name: createdCompany.name,
          association_no: createdCompany.associationNo,
          default_language: createdCompany.defaultLanguage || "tr",
          logotype: createdCompany.logotype || "",
          corporate_form: createdCompany.corporateForm || "",
          country: createdCompany.country || "TR",
          localization_country: createdCompany.localizationCountry || "TR",
          creation_date: new Date().toISOString(),
          created_by: "admin",
          rowversion: 1,
          rowkey: createdCompany.rowkey || ""
        };
        
        setSelectedCompany(newCompanyData);
        setIsNewCompanyMode(false);
        alert("Yeni şirket başarıyla eklendi!");
      } else {
        let errorMessage = "Şirket ekleme işlemi başarısız oldu";
        
        try {
          const errorData = await response.json();
          console.error("API hata detayı:", errorData);
          
          // Validation errors varsa göster
          if (errorData.errors) {
            const validationErrors = Object.values(errorData.errors).flat().join(', ');
            errorMessage = `Validasyon hataları: ${validationErrors}`;
          } else if (errorData.title || errorData.detail) {
            errorMessage = `${errorData.title || 'Hata'}: ${errorData.detail || 'Bilinmeyen hata'}`;
          }
        } catch (parseError) {
          errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        }
        
        throw new Error(errorMessage);
      }
    } catch (err) {
      console.error("Yeni şirket eklenirken hata:", err);
      alert(err instanceof Error ? err.message : "Yeni şirket eklenirken bir hata oluştu!");
    }
  };

  // Yeni şirket eklemeyi iptal et
  const handleCancelNewCompany = () => {
    setIsNewCompanyMode(false);
    setSelectedCompany(null);
    setEditingCompanyData({
      company: "",
      name: "",
      association_no: ""
    });
  };

  // Şirket silme
  const handleDeleteCompany = async (id: number) => {
    if (window.confirm("Bu şirketi silmek istediğinize emin misiniz?")) {
      try {
        const companyToDelete = companies.find(c => c.id === id);
        if (!companyToDelete) return;

        const response = await fetch(`/api/company/${companyToDelete.company}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          await fetchCompanies();
          
          if (selectedCompany?.id === id) {
            setSelectedCompany(null);
            setEditingCompanyData({
              company: "",
              name: "",
              association_no: ""
            });
          }
          
          alert("Şirket başarıyla silindi!");
        } else {
          const errorData = await response.json();
          throw new Error(errorData.message || "Silme işlemi başarısız oldu");
        }
      } catch (err) {
        console.error("Şirket silinirken hata:", err);
        alert(err instanceof Error ? err.message : "Şirket silinirken bir hata oluştu!");
      }
    }
  };

  // Şirket alanlarını güncelleme
  const handleUpdateCompanyField = (field: keyof typeof editingCompanyData, value: string) => {
    setEditingCompanyData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Şirket düzenleme kaydetme
  const handleSaveCompanyFields = async () => {
    if (!selectedCompany) return;

    try {
      const updateDto: CompanyUpdateDto = {
        name: editingCompanyData.name,
        associationNo: editingCompanyData.association_no || undefined,
        defaultLanguage: generalTabFormData?.default_language || selectedCompany.default_language,
        logotype: generalTabFormData?.logotype || selectedCompany.logotype || undefined,
        corporateForm: generalTabFormData?.corporate_form || selectedCompany.corporate_form || undefined,
        country: generalTabFormData?.country || selectedCompany.country,
        localizationCountry: generalTabFormData?.localization_country || selectedCompany.localization_country,
        rowversion: selectedCompany.rowversion || 1
      };

      const response = await fetch(`/api/company/${editingCompanyData.company}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateDto),
      });

      if (response.ok) {
        await fetchCompanies();
        
        const updatedCompany = await response.json();
        const formattedCompany: Company = {
          ...selectedCompany,
          company: updatedCompany.companyId || updatedCompany.company,
          name: updatedCompany.name,
          association_no: updatedCompany.associationNo,
          rowversion: updatedCompany.rowversion || selectedCompany.rowversion
        };
        
        setSelectedCompany(formattedCompany);
        alert("Değişiklikler başarıyla kaydedildi!");
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Güncelleme işlemi başarısız oldu");
      }
    } catch (err) {
      console.error("Şirket güncellenirken hata:", err);
      alert(err instanceof Error ? err.message : "Değişiklikler kaydedilirken bir hata oluştu!");
    }
  };

  // Tüm değişiklikleri kaydet
  const handleSaveAll = async () => {
    if (isNewCompanyMode) {
      // Yeni şirket ekleme modundaysa yeni şirketi kaydet
      await handleSaveNewCompany();
      return;
    }

    if (!selectedCompany) {
      alert("Lütfen önce bir şirket seçin!");
      return;
    }

    try {
      // Company fields için updateDto
      const companyUpdateDto: CompanyUpdateDto = {
        name: editingCompanyData.name,
        associationNo: editingCompanyData.association_no || undefined,
        defaultLanguage: generalTabFormData?.default_language || selectedCompany.default_language,
        logotype: generalTabFormData?.logotype || selectedCompany.logotype || undefined,
        corporateForm: generalTabFormData?.corporate_form || selectedCompany.corporate_form || undefined,
        country: generalTabFormData?.country || selectedCompany.country,
        localizationCountry: generalTabFormData?.localization_country || selectedCompany.localization_country,
        rowversion: selectedCompany.rowversion || 1
      };

      console.log("Güncellenen veri:", companyUpdateDto);

      const response = await fetch(`/api/company/${editingCompanyData.company}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(companyUpdateDto),
      });

      if (response.ok) {
        await fetchCompanies();
        
        const updatedCompany = await response.json();
        const formattedCompany: Company = {
          ...selectedCompany,
          company: updatedCompany.companyId || updatedCompany.company,
          name: updatedCompany.name,
          association_no: updatedCompany.associationNo,
          default_language: updatedCompany.defaultLanguage || selectedCompany.default_language,
          logotype: updatedCompany.logotype || selectedCompany.logotype,
          corporate_form: updatedCompany.corporateForm || selectedCompany.corporate_form,
          country: updatedCompany.country || selectedCompany.country,
          localization_country: updatedCompany.localizationCountry || selectedCompany.localization_country,
          rowversion: updatedCompany.rowversion || selectedCompany.rowversion
        };
        
        setSelectedCompany(formattedCompany);
        alert("Tüm değişiklikler başarıyla kaydedildi!");
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Kaydetme işlemi başarısız oldu");
      }
    } catch (err) {
      console.error("Değişiklikler kaydedilirken hata:", err);
      alert(err instanceof Error ? err.message : "Değişiklikler kaydedilirken bir hata oluştu!");
    }
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
              {/* Yeni Ekle Butonu */}
              <button
                onClick={handleAddNewCompany}
                style={{
                  background: "#059669",
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
                <i className="fas fa-plus"></i>
                <span>Yeni Ekle</span>
              </button>
              
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
              
              {/* Yükleme durumuna göre kaydet butonu */}
              {loading ? (
                <div style={{
                  padding: "8px 15px",
                  fontSize: "0.85rem",
                  color: "#94a3b8",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px"
                }}>
                  <i className="fas fa-spinner fa-spin"></i>
                  <span>Yükleniyor...</span>
                </div>
              ) : (
                <button
                  onClick={handleSaveAll}
                  disabled={!selectedCompany && !isNewCompanyMode}
                  style={{
                    background: (selectedCompany || isNewCompanyMode)
                      ? "linear-gradient(135deg, #0ea5e9 0%, #0369a1 100%)" 
                      : "#64748b",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                    padding: "8px 15px",
                    fontSize: "0.85rem",
                    cursor: (selectedCompany || isNewCompanyMode) ? "pointer" : "not-allowed",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    flexShrink: 0,
                    opacity: (selectedCompany || isNewCompanyMode) ? 1 : 0.6
                  }}
                >
                  <i className="fas fa-save"></i>
                  <span>{isNewCompanyMode ? "Yeni Şirketi Kaydet" : "Kaydet"}</span>
                </button>
              )}

              {/* Yeni şirket modunda iptal butonu */}
              {isNewCompanyMode && (
                <button
                  onClick={handleCancelNewCompany}
                  style={{
                    background: "#dc2626",
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
                  <i className="fas fa-times"></i>
                  <span>İptal</span>
                </button>
              )}
            </div>
          </div>
          
          {/* Bilgi mesajı */}
          <div style={{
            color: "#94a3b8",
            lineHeight: "1.5",
            padding: "12px",
            backgroundColor: "rgba(30, 41, 59, 0.5)",
            borderRadius: "6px",
            borderLeft: isNewCompanyMode ? "3px solid #059669" : selectedCompany ? "3px solid #10b981" : "3px solid #38bdf8",
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
                {loading ? (
                  <span>Veriler yükleniyor...</span>
                ) : error ? (
                  <span style={{ color: "#ef4444" }}>Hata: {error}</span>
                ) : companies.length === 0 ? (
                  <span>Veritabanında şirket bulunamadı. Yeni şirket eklemek için "Yeni Ekle" butonuna tıklayın.</span>
                ) : isNewCompanyMode ? (
                  <span style={{ color: "#059669", fontWeight: "600" }}>
                    <i className="fas fa-plus-circle" style={{ marginRight: "8px" }}></i>
                    Yeni şirket ekliyorsunuz. Lütfen gerekli alanları doldurun.
                  </span>
                ) : selectedCompany ? (
                  `"${selectedCompany.company} - ${selectedCompany.name}" şirketinin bilgilerini düzenleyin.`
                ) : (
                  "Düzenlemek için soldaki listeden bir şirket seçin veya yeni şirket eklemek için 'Yeni Ekle' butonuna tıklayın."
                )}
              </div>
              {isNewCompanyMode ? (
                <div style={{ 
                  backgroundColor: "rgba(5, 150, 105, 0.2)", 
                  padding: "4px 8px", 
                  borderRadius: "4px",
                  fontSize: "0.8rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                  flexShrink: 0
                }}>
                  <i className="fas fa-plus-circle" style={{ color: "#059669" }}></i>
                  <span>Yeni Şirket Ekle</span>
                </div>
              ) : selectedCompany && (
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

        {/* COMPANY CARD - Company Code, Name, Association No - DÜZENLENEBİLİR ALANLAR */}
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
              backgroundColor: isNewCompanyMode ? "#059669" : "#10b981",
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
              {isNewCompanyMode ? <i className="fas fa-plus"></i> : <i className="fas fa-building"></i>}
            </div>
            <div style={{ 
              fontSize: "1.3rem",
              color: isNewCompanyMode ? "#059669" : "#10b981",
              marginLeft: "12px",
              fontWeight: "600",
              flex: 1,
              minWidth: "200px"
            }}>
              {isNewCompanyMode ? "Yeni Şirket Ekle" : selectedCompany ? `Şirket Bilgileri - ${selectedCompany.company}` : "Şirket Bilgileri"}
            </div>
            {(selectedCompany || isNewCompanyMode) && !isNewCompanyMode && (
              <button
                onClick={handleSaveCompanyFields}
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
                  gap: "6px",
                  flexShrink: 0
                }}
              >
                <i className="fas fa-check"></i>
                <span>Şirket Bilgilerini Kaydet</span>
              </button>
            )}
          </div>
          
          {/* ŞİRKET BİLGİLERİ - DÜZENLENEBİLİR ALANLAR */}
          {selectedCompany || isNewCompanyMode ? (
            <div style={{ 
              backgroundColor: "rgba(30, 41, 59, 0.3)",
              borderRadius: "8px",
              padding: "15px",
              marginBottom: "15px",
              border: "1px solid #334155"
            }}>
              <h4 style={{ 
                color: "#f1f5f9", 
                fontSize: "0.95rem", 
                fontWeight: "600",
                marginBottom: "15px"
              }}>
                <i className={`fas ${isNewCompanyMode ? 'fa-plus-circle' : 'fa-edit'}`} style={{ marginRight: "8px", color: isNewCompanyMode ? "#059669" : "#38bdf8" }}></i>
                {isNewCompanyMode ? "Yeni Şirket Temel Bilgileri" : "Şirket Temel Bilgileri"}
              </h4>
              
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "15px" }}>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <label style={{ marginBottom: "5px", color: "#f1f5f9", fontSize: "0.85rem" }}>
                    Company Code <span style={{ color: "#ef4444" }}>*</span>
                  </label>
                  <input
                    type="text"
                    value={editingCompanyData.company}
                    onChange={(e) => handleUpdateCompanyField('company', e.target.value)}
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      backgroundColor: isNewCompanyMode ? "rgba(5, 150, 105, 0.1)" : "rgba(30, 41, 59, 0.8)",
                      border: `1px solid ${isNewCompanyMode ? "#059669" : "#38bdf8"}`,
                      borderRadius: "6px",
                      color: "#f1f5f9",
                      fontSize: "0.9rem",
                      transition: "all 0.2s"
                    }}
                    placeholder="Şirket kodu girin"
                  />
                  <div style={{ fontSize: "0.75rem", color: "#94a3b8", marginTop: "4px" }}>
                    Şirketin benzersiz kodu
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <label style={{ marginBottom: "5px", color: "#f1f5f9", fontSize: "0.85rem" }}>
                    Company Name <span style={{ color: "#ef4444" }}>*</span>
                  </label>
                  <input
                    type="text"
                    value={editingCompanyData.name}
                    onChange={(e) => handleUpdateCompanyField('name', e.target.value)}
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      backgroundColor: isNewCompanyMode ? "rgba(5, 150, 105, 0.1)" : "rgba(30, 41, 59, 0.8)",
                      border: `1px solid ${isNewCompanyMode ? "#059669" : "#38bdf8"}`,
                      borderRadius: "6px",
                      color: "#f1f5f9",
                      fontSize: "0.9rem",
                      transition: "all 0.2s"
                    }}
                    placeholder="Şirket adı girin"
                  />
                  <div style={{ fontSize: "0.75rem", color: "#94a3b8", marginTop: "4px" }}>
                    Şirketin resmi adı
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <label style={{ marginBottom: "5px", color: "#f1f5f9", fontSize: "0.85rem" }}>
                    Vergi Kimlik Kodu
                  </label>
                  <input
                    type="text"
                    value={editingCompanyData.association_no}
                    onChange={(e) => handleUpdateCompanyField('association_no', e.target.value)}
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      backgroundColor: isNewCompanyMode ? "rgba(5, 150, 105, 0.1)" : "rgba(30, 41, 59, 0.8)",
                      border: `1px solid ${isNewCompanyMode ? "#059669" : "#38bdf8"}`,
                      borderRadius: "6px",
                      color: "#f1f5f9",
                      fontSize: "0.9rem",
                      transition: "all 0.2s"
                    }}
                    placeholder="İsteğe bağlı"
                  />
                  <div style={{ fontSize: "0.75rem", color: "#94a3b8", marginTop: "4px" }}>
                    İlişkilendirme numarası (isteğe bağlı)
                  </div>
                </div>
              </div>

              {/* Butonlar */}
              <div style={{ 
                display: "flex", 
                justifyContent: "flex-end",
                marginTop: "15px",
                paddingTop: "15px",
                borderTop: "1px solid #334155",
                gap: "10px"
              }}>
                {isNewCompanyMode ? (
                  <>
                    <button
                      onClick={handleSaveNewCompany}
                      style={{
                        background: "linear-gradient(135deg, #059669 0%, #047857 100%)",
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
                      <i className="fas fa-check"></i>
                      <span>Yeni Şirketi Kaydet</span>
                    </button>
                    <button
                      onClick={handleCancelNewCompany}
                      style={{
                        background: "#dc2626",
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
                      <i className="fas fa-times"></i>
                      <span>İptal</span>
                    </button>
                  </>
                ) : selectedCompany && (
                  <button
                    onClick={() => handleDeleteCompany(selectedCompany.id)}
                    style={{
                      background: "#dc2626",
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
                    <i className="fas fa-trash"></i>
                    <span>Şirketi Sil</span>
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div style={{ 
              backgroundColor: "rgba(30, 41, 59, 0.3)",
              borderRadius: "8px",
              padding: "15px",
              marginBottom: "15px",
              border: "1px solid #334155",
              textAlign: "center",
              color: "#94a3b8",
              minHeight: "150px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center"
            }}>
              <i className="fas fa-building" style={{ fontSize: "2rem", marginBottom: "10px", color: "#64748b" }}></i>
              <p>Düzenlemek için soldaki listeden bir şirket seçin veya yeni şirket eklemek için 'Yeni Ekle' butonuna tıklayın</p>
            </div>
          )}
          
          {/* Şirket sayısı bilgisi */}
          <div style={{ 
            fontSize: "0.85rem", 
            color: "#94a3b8", 
            padding: "8px 12px",
            backgroundColor: "rgba(30, 41, 59, 0.3)",
            borderRadius: "4px",
            marginTop: "10px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "10px"
          }}>
            <div>
              <i className="fas fa-database" style={{ marginRight: "8px" }}></i>
              <span>Toplam {companies.length} şirket bulundu</span>
            </div>
            {loading && (
              <span>
                <i className="fas fa-spinner fa-spin"></i> Veriler güncelleniyor...
              </span>
            )}
            {isNewCompanyMode && (
              <span style={{ color: "#059669", fontWeight: "600" }}>
                <i className="fas fa-plus-circle" style={{ marginRight: "4px" }}></i>
                Yeni şirket ekleniyor
              </span>
            )}
          </div>
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
                    color: isActive ? (isNewCompanyMode ? "#059669" : "#1d4ed8") : "#64748b",
                    cursor: "pointer",
                    fontWeight: "600",
                    borderBottom: isActive ? `2px solid ${isNewCompanyMode ? "#059669" : "#2563eb"}` : "2px solid transparent",
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
            {activeTab === "General" && (
              <GeneralTab 
                selectedCompany={selectedCompany} 
                onFormDataChange={setGeneralTabFormData}
                isNewCompanyMode={isNewCompanyMode}
                newCompanyFormData={newCompanyFormData}
                onNewCompanyFormDataChange={setNewCompanyFormData}
              />
            )}
            {activeTab === "Address" && <AddressTab selectedCompany={selectedCompany} isNewCompanyMode={isNewCompanyMode} />}
          </div>
        </div>
      </div>
    </div>
  );
}