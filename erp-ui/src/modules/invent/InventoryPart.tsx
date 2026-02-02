import { useState, useEffect } from "react";
import SearchList from "./../../components/SearchList";
import { ChevronRightIcon } from "@heroicons/react/24/outline";

// Interface - C# modeline göre
interface InventoryPart {
  contract: string;
  partNo: string;
  accountingGroup?: string;
  countryOfOrigin?: string;
  estimatedMaterialCost?: number;
  partProductCode?: string;
  partProductFamily?: string;
  partStatus?: string;
  plannerBuyer?: string;
  primeCommodity?: string;
  secondCommodity?: string;
  unitMeas?: string;
  salesUnitMeas?: string;
  description?: string;
  listPrice?: number;
  listPriceInclTax?: number;
  priceConvFactor?: number;
  taxCode?: string;
  taxClassId?: string;
  salesType?: string;
  salesTypeDb?: string;
  typeCode?: string;
  typeCodeDb?: string;
  storageWidthRequirement?: number;
  storageHeightRequirement?: number;
  storageDepthRequirement?: number;
  storageVolumeRequirement?: number;
  storageWeightRequirement?: number;
  minStorageTemperature?: number;
  maxStorageTemperature?: number;
  minStorageHumidity?: number;
  maxStorageHumidity?: number;
  standardPutawayQty?: number;
  standardPackSize?: number;
  createDate?: string;
  expectedLeadtime?: number;
  rowversion: number;
  rowkey: string;
}

// Yeni malzeme oluşturma için DTO
interface InventoryPartCreateDto {
  contract: string;
  partNo: string;
  description?: string;
  unitMeas?: string;
  salesUnitMeas?: string;
  listPrice?: number;
  listPriceInclTax?: number;
  priceConvFactor?: number;
  taxCode?: string;
  taxClassId?: string;
  salesType?: string;
  salesTypeDb?: string;
  typeCode?: string;
  typeCodeDb?: string;
  rowversion: number;
  rowkey: string;
  createDate?: string;
}

// Güncelleme için DTO
interface InventoryPartUpdateDto {
  description?: string;
  listPrice?: number;
  listPriceInclTax?: number;
  priceConvFactor?: number;
  taxCode?: string;
  taxClassId?: string;
  salesType?: string;
  salesTypeDb?: string;
  unitMeas?: string;
  salesUnitMeas?: string;
  rowversion: number;
}

// GeneralTab bileşeni
const GeneralTab = ({ 
  formData, 
  onFormDataChange
}: { 
  formData: any;
  onFormDataChange: (formData: any) => void;
}) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const newFormData = {
      ...formData,
      [name]: name.includes("Price") || name.includes("Conv") ? parseFloat(value) || 0 : value
    };
    onFormDataChange(newFormData);
  };

  return (
    <div style={{ padding: "15px 0", minHeight: "250px" }}>
      <div style={{ 
        display: "grid", 
        gridTemplateColumns: "1fr", 
        gap: "15px" 
      }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "15px" }}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <label style={{ marginBottom: "5px", color: "#f1f5f9", fontSize: "0.9rem" }}>Birim</label>
            <select
              name="unitMeas"
              value={formData.unitMeas || "ADET"}
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
              <option value="ADET">Adet</option>
              <option value="KG">Kilogram</option>
              <option value="LT">Litre</option>
              <option value="MT">Metre</option>
              <option value="M2">Metrekare</option>
              <option value="M3">Metreküp</option>
              <option value="PAKET">Paket</option>
              <option value="KOLİ">Koli</option>
            </select>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <label style={{ marginBottom: "5px", color: "#f1f5f9", fontSize: "0.9rem" }}>Parça Tipi</label>
            <select
              name="typeCodeDb"
              value={formData.typeCodeDb || "P"}
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
              <option value="M">Üretilmiş</option>
              <option value="P">Satınalınan</option>
              <option value="R">Satınalanın (Ham)</option>
            </select>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <label style={{ marginBottom: "5px", color: "#f1f5f9", fontSize: "0.9rem" }}>Satış Birimi</label>
            <select
              name="salesUnitMeas"
              value={formData.salesUnitMeas || "ADET"}
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
              <option value="ADET">Adet</option>
              <option value="KG">Kilogram</option>
              <option value="LT">Litre</option>
              <option value="MT">Metre</option>
              <option value="M2">Metrekare</option>
              <option value="M3">Metreküp</option>
              <option value="PAKET">Paket</option>
              <option value="KOLİ">Koli</option>
            </select>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <label style={{ marginBottom: "5px", color: "#f1f5f9", fontSize: "0.9rem" }}>Fiyat Dönüşüm Faktörü</label>
            <input
              type="number"
              name="priceConvFactor"
              value={formData.priceConvFactor || 1}
              onChange={handleInputChange}
              step="0.01"
              min="0"
              style={{
                padding: "10px",
                backgroundColor: "rgba(30, 41, 59, 0.8)",
                border: "1px solid #334155",
                borderRadius: "6px",
                color: "#f1f5f9",
                fontSize: "0.9rem"
              }}
            />
          </div>
        </div>

        {/* Fiyat Bilgileri */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "15px" }}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <label style={{ marginBottom: "5px", color: "#f1f5f9", fontSize: "0.9rem" }}>Liste Fiyatı</label>
            <input
              type="number"
              name="listPrice"
              value={formData.listPrice || 0}
              onChange={handleInputChange}
              step="0.01"
              min="0"
              style={{
                padding: "10px",
                backgroundColor: "rgba(30, 41, 59, 0.8)",
                border: "1px solid #334155",
                borderRadius: "6px",
                color: "#f1f5f9",
                fontSize: "0.9rem"
              }}
            />
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <label style={{ marginBottom: "5px", color: "#f1f5f9", fontSize: "0.9rem" }}>KDV Dahil Liste Fiyatı</label>
            <input
              type="number"
              name="listPriceInclTax"
              value={formData.listPriceInclTax || 0}
              onChange={handleInputChange}
              step="0.01"
              min="0"
              style={{
                padding: "10px",
                backgroundColor: "rgba(30, 41, 59, 0.8)",
                border: "1px solid #334155",
                borderRadius: "6px",
                color: "#f1f5f9",
                fontSize: "0.9rem"
              }}
            />
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <label style={{ marginBottom: "5px", color: "#f1f5f9", fontSize: "0.9rem" }}>Vergi Kodu</label>
            <select
              name="taxCode"
              value={formData.taxCode || "KDV01"}
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
              <option value="KDV01">1</option>
              <option value="KDV10">10</option>
              <option value="KDV20">20</option>
              <option value="KDV0">0</option>
              <option value="OTV">ÖTV</option>
              <option value="EXPORT">İhracat</option>
            </select>
          </div>
        </div>

        {/* Satış ve Vergi Bilgileri */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "15px" }}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <label style={{ marginBottom: "5px", color: "#f1f5f9", fontSize: "0.9rem" }}>Vergi Sınıfı</label>
            <input
              type="text"
              name="taxClassId"
              value={formData.taxClassId || "STANDARD"}
              onChange={handleInputChange}
              style={{
                padding: "10px",
                backgroundColor: "rgba(30, 41, 59, 0.8)",
                border: "1px solid #334155",
                borderRadius: "6px",
                color: "#f1f5f9",
                fontSize: "0.9rem"
              }}
            />
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <label style={{ marginBottom: "5px", color: "#f1f5f9", fontSize: "0.9rem" }}>Satış Tipi</label>
            <select
              name="salesType"
              value={formData.salesType || "SATIS"}
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
              <option value="SATIS">Satış</option>
              <option value="KIRALAMA">Kiralama</option>
              <option value="HIZMET">Hizmet</option>
              <option value="KONSINYE">Konsinye</option>
              <option value="ICARET">İç Ticaret</option>
            </select>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <label style={{ marginBottom: "5px", color: "#f1f5f9", fontSize: "0.9rem" }}>Açıklama</label>
            <input
              type="text"
              name="description"
              value={formData.description || ""}
              onChange={handleInputChange}
              style={{
                padding: "10px",
                backgroundColor: "rgba(30, 41, 59, 0.8)",
                border: "1px solid #334155",
                borderRadius: "6px",
                color: "#f1f5f9",
                fontSize: "0.9rem"
              }}
              placeholder="Malzeme açıklaması"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// StorageTab bileşeni
const StorageTab = ({ 
  formData, 
  onFormDataChange
}: { 
  formData: any;
  onFormDataChange: (formData: any) => void;
}) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const newFormData = {
      ...formData,
      [name]: parseFloat(value) || 0
    };
    onFormDataChange(newFormData);
  };

  return (
    <div style={{ padding: "15px 0", minHeight: "250px" }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "15px" }}>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <label style={{ marginBottom: "5px", color: "#f1f5f9", fontSize: "0.9rem" }}>Depo Genişliği (cm)</label>
          <input
            type="number"
            name="storageWidthRequirement"
            value={formData.storageWidthRequirement || 0}
            onChange={handleInputChange}
            style={{
              padding: "10px",
              backgroundColor: "rgba(30, 41, 59, 0.8)",
              border: "1px solid #334155",
              borderRadius: "6px",
              color: "#f1f5f9",
              fontSize: "0.9rem"
            }}
          />
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <label style={{ marginBottom: "5px", color: "#f1f5f9", fontSize: "0.9rem" }}>Depo Yüksekliği (cm)</label>
          <input
            type="number"
            name="storageHeightRequirement"
            value={formData.storageHeightRequirement || 0}
            onChange={handleInputChange}
            style={{
              padding: "10px",
              backgroundColor: "rgba(30, 41, 59, 0.8)",
              border: "1px solid #334155",
              borderRadius: "6px",
              color: "#f1f5f9",
              fontSize: "0.9rem"
            }}
          />
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <label style={{ marginBottom: "5px", color: "#f1f5f9", fontSize: "0.9rem" }}>Depo Derinliği (cm)</label>
          <input
            type="number"
            name="storageDepthRequirement"
            value={formData.storageDepthRequirement || 0}
            onChange={handleInputChange}
            style={{
              padding: "10px",
              backgroundColor: "rgba(30, 41, 59, 0.8)",
              border: "1px solid #334155",
              borderRadius: "6px",
              color: "#f1f5f9",
              fontSize: "0.9rem"
            }}
          />
        </div>
      </div>
    </div>
  );
};

// ClassificationTab bileşeni
const ClassificationTab = ({ 
  formData, 
  onFormDataChange
}: { 
  formData: any;
  onFormDataChange: (formData: any) => void;
}) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const newFormData = {
      ...formData,
      [name]: value
    };
    onFormDataChange(newFormData);
  };

  return (
    <div style={{ padding: "15px 0", minHeight: "250px" }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "15px" }}>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <label style={{ marginBottom: "5px", color: "#f1f5f9", fontSize: "0.9rem" }}>Ürün Grubu</label>
          <input
            type="text"
            name="partProductFamily"
            value={formData.partProductFamily || ""}
            onChange={handleInputChange}
            style={{
              padding: "10px",
              backgroundColor: "rgba(30, 41, 59, 0.8)",
              border: "1px solid #334155",
              borderRadius: "6px",
              color: "#f1f5f9",
              fontSize: "0.9rem"
            }}
            placeholder="Ürün grubu"
          />
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <label style={{ marginBottom: "5px", color: "#f1f5f9", fontSize: "0.9rem" }}>Birincil Emtia</label>
          <input
            type="text"
            name="primeCommodity"
            value={formData.primeCommodity || ""}
            onChange={handleInputChange}
            style={{
              padding: "10px",
              backgroundColor: "rgba(30, 41, 59, 0.8)",
              border: "1px solid #334155",
              borderRadius: "6px",
              color: "#f1f5f9",
              fontSize: "0.9rem"
            }}
            placeholder="Birincil emtia"
          />
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <label style={{ marginBottom: "5px", color: "#f1f5f9", fontSize: "0.9rem" }}>İkincil Emtia</label>
          <input
            type="text"
            name="secondCommodity"
            value={formData.secondCommodity || ""}
            onChange={handleInputChange}
            style={{
              padding: "10px",
              backgroundColor: "rgba(30, 41, 59, 0.8)",
              border: "1px solid #334155",
              borderRadius: "6px",
              color: "#f1f5f9",
              fontSize: "0.9rem"
            }}
            placeholder="İkincil emtia"
          />
        </div>
      </div>
    </div>
  );
};

const tabs = ["General", "Storage", "Classification"];

export default function InventoryPartPage() {
  const [activeTab, setActiveTab] = useState("General");
  
  // SearchList'ten seçilen malzeme state'i
  const [selectedPart, setSelectedPart] = useState<InventoryPart | null>(null);
  const [isSearchListVisible, setIsSearchListVisible] = useState(false);
  const [isCreatingNewPart, setIsCreatingNewPart] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // PostgreSQL'den gelen malzeme verileri
  const [inventoryParts, setInventoryParts] = useState<InventoryPart[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Düzenlenen malzeme bilgileri
  const [editingPartData, setEditingPartData] = useState({
    contract: "",
    partNo: "",
    description: ""
  });

  // Yeni malzeme formu state'leri (tüm sekmeler için form data)
  const [newPartFormData, setNewPartFormData] = useState({
    // General tab
    contract: "001",
    partNo: `PART${String(Math.floor(Math.random() * 10000)).padStart(5, '0')}`,
    description: "",
    unitMeas: "ADET",
    salesUnitMeas: "ADET",
    listPrice: 0,
    listPriceInclTax: 0,
    priceConvFactor: 1,
    taxCode: "KDV01",
    taxClassId: "STANDARD",
    salesType: "SATIS",
    salesTypeDb: "SALE",
    typeCode: "P",
    typeCodeDb: "P",
    createDate: new Date().toISOString().split('T')[0],
    
    // Storage tab
    storageWidthRequirement: 0,
    storageHeightRequirement: 0,
    storageDepthRequirement: 0,
    storageVolumeRequirement: 0,
    storageWeightRequirement: 0,
    minStorageTemperature: 0,
    maxStorageTemperature: 0,
    minStorageHumidity: 0,
    maxStorageHumidity: 0,
    standardPutawayQty: 0,
    standardPackSize: 0,
    expectedLeadtime: 0,
    
    // Classification tab
    partProductFamily: "",
    primeCommodity: "",
    secondCommodity: "",
    accountingGroup: "",
    countryOfOrigin: "",
    estimatedMaterialCost: 0,
    partProductCode: "",
    partStatus: "",
    plannerBuyer: "",
    
    // System fields
    rowversion: 1,
    rowkey: `new-part-${Date.now()}`
  });

  // Mevcut malzeme düzenleme için form data (tüm sekmeler için)
  const [editingFormData, setEditingFormData] = useState<any>(null);

  // PostgreSQL'den malzeme verilerini çek
  useEffect(() => {
    fetchInventoryParts();
  }, []);

  // Seçili malzeme değiştiğinde formData'yı güncelle
  useEffect(() => {
    if (selectedPart) {
      setEditingPartData({
        contract: selectedPart.contract,
        partNo: selectedPart.partNo,
        description: selectedPart.description || ""
      });
      
      // Tüm form verilerini selectedPart'tan al
      setEditingFormData({
        // General tab
        description: selectedPart.description || "",
        unitMeas: selectedPart.unitMeas || "ADET",
        salesUnitMeas: selectedPart.salesUnitMeas || "ADET",
        listPrice: selectedPart.listPrice || 0,
        listPriceInclTax: selectedPart.listPriceInclTax || 0,
        priceConvFactor: selectedPart.priceConvFactor || 1,
        taxCode: selectedPart.taxCode || "KDV01",
        taxClassId: selectedPart.taxClassId || "STANDARD",
        salesType: selectedPart.salesType || "SATIS",
        salesTypeDb: selectedPart.salesTypeDb || "SALE",
        typeCodeDb: selectedPart.typeCodeDb || "P",
        
        // Storage tab
        storageWidthRequirement: selectedPart.storageWidthRequirement || 0,
        storageHeightRequirement: selectedPart.storageHeightRequirement || 0,
        storageDepthRequirement: selectedPart.storageDepthRequirement || 0,
        
        // Classification tab
        partProductFamily: selectedPart.partProductFamily || "",
        primeCommodity: selectedPart.primeCommodity || "",
        secondCommodity: selectedPart.secondCommodity || "",
      });
    } else {
      setEditingFormData(null);
    }
  }, [selectedPart]);

  const fetchInventoryParts = async () => {
    try {
      setLoading(true);
      // API endpoint'i
      const response = await fetch('/api/inventorypart');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      const formattedParts: InventoryPart[] = data.map((part: any) => ({
        contract: part.contract || "",
        partNo: part.partNo || "",
        accountingGroup: part.accountingGroup,
        countryOfOrigin: part.countryOfOrigin,
        estimatedMaterialCost: part.estimatedMaterialCost,
        partProductCode: part.partProductCode,
        partProductFamily: part.partProductFamily,
        partStatus: part.partStatus,
        plannerBuyer: part.plannerBuyer,
        primeCommodity: part.primeCommodity,
        secondCommodity: part.secondCommodity,
        unitMeas: part.unitMeas,
        salesUnitMeas: part.salesUnitMeas,
        description: part.description,
        listPrice: part.listPrice,
        listPriceInclTax: part.listPriceInclTax,
        priceConvFactor: part.priceConvFactor,
        taxCode: part.taxCode,
        taxClassId: part.taxClassId,
        salesType: part.salesType,
        salesTypeDb: part.salesTypeDb,
        typeCode: part.typeCode,
        typeCodeDb: part.typeCodeDb,
        storageWidthRequirement: part.storageWidthRequirement,
        storageHeightRequirement: part.storageHeightRequirement,
        storageDepthRequirement: part.storageDepthRequirement,
        storageVolumeRequirement: part.storageVolumeRequirement,
        storageWeightRequirement: part.storageWeightRequirement,
        minStorageTemperature: part.minStorageTemperature,
        maxStorageTemperature: part.maxStorageTemperature,
        minStorageHumidity: part.minStorageHumidity,
        maxStorageHumidity: part.maxStorageHumidity,
        standardPutawayQty: part.standardPutawayQty,
        standardPackSize: part.standardPackSize,
        createDate: part.createDate,
        expectedLeadtime: part.expectedLeadtime,
        rowversion: part.rowversion || 1,
        rowkey: part.rowkey || ""
      }));
      
      setInventoryParts(formattedParts);
      setError(null);
    } catch (err) {
      console.error("Malzeme verileri çekilirken hata:", err);
      setError(err instanceof Error ? err.message : "Bilinmeyen bir hata oluştu");
      setInventoryParts([]);
    } finally {
      setLoading(false);
    }
  };

  const searchListItems = inventoryParts.map((part, index) => ({
    id: index + 1,
    code: part.partNo,
    name: part.description || "Açıklama yok",
    description: `Contract: ${part.contract}`,
    originalData: part
  }));

  const handlePartSelect = (item: any) => {
    const selected = inventoryParts.find(p => p.partNo === item.code && p.contract === item.originalData?.contract);
    if (selected) {
      setSelectedPart(selected);
      setIsCreatingNewPart(false);
    }
  };

  const handleToggleSearchList = () => {
    setIsSearchListVisible(!isSearchListVisible);
  };

  // Yeni malzeme formu işlemleri
  const handleNewPartFormDataChange = (formData: any) => {
    setNewPartFormData(prev => ({
      ...prev,
      ...formData
    }));
  };

  const handleCreateNewPart = async () => {
    if (!newPartFormData.contract || !newPartFormData.partNo) {
      alert("Lütfen zorunlu alanları doldurun (Kontrat, Malzeme Kodu)");
      return;
    }

    setIsSaving(true);

    try {
      // Create DTO oluştur
      const createDto: InventoryPartCreateDto = {
        contract: newPartFormData.contract,
        partNo: newPartFormData.partNo,
        description: newPartFormData.description,
        unitMeas: newPartFormData.unitMeas,
        salesUnitMeas: newPartFormData.salesUnitMeas,
        listPrice: newPartFormData.listPrice,
        listPriceInclTax: newPartFormData.listPriceInclTax,
        priceConvFactor: newPartFormData.priceConvFactor,
        taxCode: newPartFormData.taxCode,
        taxClassId: newPartFormData.taxClassId,
        salesType: newPartFormData.salesType,
        salesTypeDb: newPartFormData.salesTypeDb,
        typeCode: newPartFormData.typeCode,
        typeCodeDb: newPartFormData.typeCodeDb,
        rowversion: newPartFormData.rowversion,
        rowkey: newPartFormData.rowkey,
        createDate: newPartFormData.createDate
      };

      const response = await fetch('/api/inventorypart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(createDto)
      });

      if (response.ok) {
        const savedPart = await response.json();
        alert(`Malzeme başarıyla oluşturuldu: ${savedPart.partNo}`);
        
        // Listeyi yeniden yükle
        await fetchInventoryParts();
        
        // Yeni oluşturulan malzemeyi seç
        const newPart: InventoryPart = {
          contract: savedPart.contract,
          partNo: savedPart.partNo,
          description: savedPart.description || "",
          unitMeas: savedPart.unitMeas || "ADET",
          salesUnitMeas: savedPart.salesUnitMeas || "ADET",
          listPrice: savedPart.listPrice || 0,
          listPriceInclTax: savedPart.listPriceInclTax || 0,
          priceConvFactor: savedPart.priceConvFactor || 1,
          taxCode: savedPart.taxCode || "KDV01",
          taxClassId: savedPart.taxClassId || "STANDARD",
          salesType: savedPart.salesType || "SATIS",
          salesTypeDb: savedPart.salesTypeDb || "SALE",
          typeCode: savedPart.typeCode || "P",
          typeCodeDb: savedPart.typeCodeDb || "P",
          rowversion: savedPart.rowversion || 1,
          rowkey: savedPart.rowkey || `new-part-${Date.now()}`
        };
        
        setSelectedPart(newPart);
        setIsCreatingNewPart(false);
        
        // Formu sıfırla
        setNewPartFormData({
          contract: "001",
          partNo: `PART${String(Math.floor(Math.random() * 10000)).padStart(5, '0')}`,
          description: "",
          unitMeas: "ADET",
          salesUnitMeas: "ADET",
          listPrice: 0,
          listPriceInclTax: 0,
          priceConvFactor: 1,
          taxCode: "KDV01",
          taxClassId: "STANDARD",
          salesType: "SATIS",
          salesTypeDb: "SALE",
          typeCode: "P",
          typeCodeDb: "P",
          createDate: new Date().toISOString().split('T')[0],
          
          storageWidthRequirement: 0,
          storageHeightRequirement: 0,
          storageDepthRequirement: 0,
          storageVolumeRequirement: 0,
          storageWeightRequirement: 0,
          minStorageTemperature: 0,
          maxStorageTemperature: 0,
          minStorageHumidity: 0,
          maxStorageHumidity: 0,
          standardPutawayQty: 0,
          standardPackSize: 0,
          expectedLeadtime: 0,
          
          partProductFamily: "",
          primeCommodity: "",
          secondCommodity: "",
          accountingGroup: "",
          countryOfOrigin: "",
          estimatedMaterialCost: 0,
          partProductCode: "",
          partStatus: "",
          plannerBuyer: "",
          
          rowversion: 1,
          rowkey: `new-part-${Date.now()}`
        });
      } else {
        const errorText = await response.text();
        throw new Error(`Malzeme kaydedilemedi: ${errorText}`);
      }
    } catch (err) {
      console.error("Malzeme oluşturma hatası:", err);
      alert(`Hata: ${err instanceof Error ? err.message : "Bilinmeyen hata"}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelNewPart = () => {
    setIsCreatingNewPart(false);
    setNewPartFormData({
      contract: "001",
      partNo: `PART${String(Math.floor(Math.random() * 10000)).padStart(5, '0')}`,
      description: "",
      unitMeas: "ADET",
      salesUnitMeas: "ADET",
      listPrice: 0,
      listPriceInclTax: 0,
      priceConvFactor: 1,
      taxCode: "KDV01",
      taxClassId: "STANDARD",
      salesType: "SATIS",
      salesTypeDb: "SALE",
      typeCode: "P",
      typeCodeDb: "P",
      createDate: new Date().toISOString().split('T')[0],
      
      storageWidthRequirement: 0,
      storageHeightRequirement: 0,
      storageDepthRequirement: 0,
      storageVolumeRequirement: 0,
      storageWeightRequirement: 0,
      minStorageTemperature: 0,
      maxStorageTemperature: 0,
      minStorageHumidity: 0,
      maxStorageHumidity: 0,
      standardPutawayQty: 0,
      standardPackSize: 0,
      expectedLeadtime: 0,
      
      partProductFamily: "",
      primeCommodity: "",
      secondCommodity: "",
      accountingGroup: "",
      countryOfOrigin: "",
      estimatedMaterialCost: 0,
      partProductCode: "",
      partStatus: "",
      plannerBuyer: "",
      
      rowversion: 1,
      rowkey: `new-part-${Date.now()}`
    });
  };

  // Malzeme silme
  const handleDeletePart = async () => {
    if (!selectedPart) return;
    
    if (window.confirm("Bu malzemeyi silmek istediğinize emin misiniz?")) {
      try {
        const response = await fetch(`/api/inventorypart/${selectedPart.contract}/${selectedPart.partNo}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          await fetchInventoryParts();
          setSelectedPart(null);
          setEditingPartData({
            contract: "",
            partNo: "",
            description: ""
          });
          setEditingFormData(null);
          alert("Malzeme başarıyla silindi!");
        } else {
          const errorData = await response.json();
          throw new Error(errorData.message || "Silme işlemi başarısız oldu");
        }
      } catch (err) {
        console.error("Malzeme silinirken hata:", err);
        alert(err instanceof Error ? err.message : "Malzeme silinirken bir hata oluştu!");
      }
    }
  };

  // Malzeme alanlarını güncelleme
  const handleUpdatePartField = (field: keyof typeof editingPartData, value: string) => {
    setEditingPartData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Malzeme düzenleme kaydetme
  // Malzeme düzenleme kaydetme - SADECE Contract, PartNo, Description
const handleSavePartFields = async () => {
  if (!selectedPart) return;

  try {
    const updateDto: InventoryPartUpdateDto = {
      description: editingPartData.description, // Buradan alıyoruz
      listPrice: selectedPart.listPrice,
      listPriceInclTax: selectedPart.listPriceInclTax,
      priceConvFactor: selectedPart.priceConvFactor,
      taxCode: selectedPart.taxCode,
      taxClassId: selectedPart.taxClassId,
      salesType: selectedPart.salesType,
      salesTypeDb: selectedPart.salesTypeDb,
      unitMeas: selectedPart.unitMeas,
      salesUnitMeas: selectedPart.salesUnitMeas,
      rowversion: selectedPart.rowversion
    };

    const response = await fetch(`/api/inventorypart/${editingPartData.contract}/${editingPartData.partNo}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateDto),
    });

    if (response.ok) {
      await fetchInventoryParts();
      
      const updatedPart = await response.json();
      const formattedPart: InventoryPart = {
        ...selectedPart,
        description: updatedPart.description,
        rowversion: updatedPart.rowversion || selectedPart.rowversion
      };
      
      setSelectedPart(formattedPart);
      
      // editingFormData'yı da güncelle
      if (editingFormData) {
        setEditingFormData({
          ...editingFormData,
          description: updatedPart.description
        });
      }
      
      alert("Değişiklikler başarıyla kaydedildi!");
    } else {
      const errorData = await response.json();
      throw new Error(errorData.message || "Güncelleme işlemi başarısız oldu");
    }
  } catch (err) {
    console.error("Malzeme güncellenirken hata:", err);
    alert(err instanceof Error ? err.message : "Değişiklikler kaydedilirken bir hata oluştu!");
  }
};

// Tüm değişiklikleri kaydet - TÜM SEKMELER
const handleSaveAll = async () => {
  if (!selectedPart) {
    alert("Lütfen önce bir malzeme seçin!");
    return;
  }

  try {
    // Update DTO oluştur - editingFormData'daki güncellenmiş değerleri kullan
    // NOT: editingPartData'daki description yerine editingFormData'dakini kullan
    const updateDto: InventoryPartUpdateDto = {
      description: editingFormData?.description || selectedPart.description, // Bu satırı değiştirdim
      listPrice: editingFormData?.listPrice || selectedPart.listPrice,
      listPriceInclTax: editingFormData?.listPriceInclTax || selectedPart.listPriceInclTax,
      priceConvFactor: editingFormData?.priceConvFactor || selectedPart.priceConvFactor,
      taxCode: editingFormData?.taxCode || selectedPart.taxCode,
      taxClassId: editingFormData?.taxClassId || selectedPart.taxClassId,
      salesType: editingFormData?.salesType || selectedPart.salesType,
      salesTypeDb: editingFormData?.salesTypeDb || selectedPart.salesTypeDb,
      unitMeas: editingFormData?.unitMeas || selectedPart.unitMeas,
      salesUnitMeas: editingFormData?.salesUnitMeas || selectedPart.salesUnitMeas,
      rowversion: selectedPart.rowversion
    };

    const response = await fetch(`/api/inventorypart/${selectedPart.contract}/${selectedPart.partNo}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateDto),
    });

    if (response.ok) {
      await fetchInventoryParts();
      
      const updatedPart = await response.json();
      const formattedPart: InventoryPart = {
        ...selectedPart,
        description: updatedPart.description || selectedPart.description,
        listPrice: updatedPart.listPrice || selectedPart.listPrice,
        listPriceInclTax: updatedPart.listPriceInclTax || selectedPart.listPriceInclTax,
        priceConvFactor: updatedPart.priceConvFactor || selectedPart.priceConvFactor,
        taxCode: updatedPart.taxCode || selectedPart.taxCode,
        taxClassId: updatedPart.taxClassId || selectedPart.taxClassId,
        salesType: updatedPart.salesType || selectedPart.salesType,
        salesTypeDb: updatedPart.salesTypeDb || selectedPart.salesTypeDb,
        unitMeas: updatedPart.unitMeas || selectedPart.unitMeas,
        salesUnitMeas: updatedPart.salesUnitMeas || selectedPart.salesUnitMeas,
        rowversion: updatedPart.rowversion || selectedPart.rowversion
      };
      
      setSelectedPart(formattedPart);
      
      // editingPartData'yı da güncelle
      setEditingPartData(prev => ({
        ...prev,
        description: updatedPart.description || selectedPart.description
      }));
      
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

  // Mevcut malzeme form verilerini güncelle
  const handleEditingFormDataChange = (formData: any) => {
    setEditingFormData((prev: any) => ({
      ...prev,
      ...formData
    }));
  };

  // YENİ MALZEME OLUŞTURMA EKRANI
  if (isCreatingNewPart) {
    return (
      <div style={{ 
        display: "flex", 
        width: "100%", 
        height: "100vh", 
        overflow: "hidden",
        backgroundColor: "#0f172a" 
      }}>
        {/* SearchList Panel */}
        {isSearchListVisible && (
          <SearchList
            title="Malzeme Arama"
            items={searchListItems}
            onSelect={handlePartSelect}
            onToggle={handleToggleSearchList}
            searchFields={["code", "name", "description"]}
            displayFields={["code", "name"]}
            icon="fas fa-boxes"
          />
        )}

        {/* SearchList GİZLİ durumda */}
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

        {/* ANA EKRAN - YENİ MALZEME OLUŞTURMA */}
        <div 
          style={{ 
            flex: 1,
            display: "flex",
            flexDirection: "column",
            height: "100vh",
            overflow: "auto",
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
            marginBottom: "15px"
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
                <i className="fas fa-plus"></i>
              </div>
              <div>
                <h2 style={{ margin: 0, color: "#f1f5f9", fontSize: "1.3rem" }}>Yeni Malzeme Oluştur</h2>
                <p style={{ margin: "4px 0 0 0", color: "#94a3b8", fontSize: "0.85rem" }}>
                  Malzeme Kodu: <strong>{newPartFormData.partNo}</strong>
                </p>
              </div>
              {isSaving && (
                <div style={{
                  marginLeft: "auto",
                  backgroundColor: "rgba(245, 158, 11, 0.2)",
                  color: "#f59e0b",
                  padding: "5px 10px",
                  borderRadius: "4px",
                  fontSize: "0.85rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "5px"
                }}>
                  <i className="fas fa-spinner fa-spin"></i>
                  <span>Kaydediliyor...</span>
                </div>
              )}
            </div>
            
            <div style={{
              color: "#94a3b8",
              lineHeight: "1.5",
              padding: "12px",
              backgroundColor: "rgba(16, 185, 129, 0.1)",
              borderRadius: "6px",
              borderLeft: "3px solid #10b981",
              fontSize: "0.85rem"
            }}>
              <div style={{ display: "flex", alignItems: "center" }}>
                <i className="fas fa-info-circle" style={{ marginRight: "8px", color: "#10b981" }}></i>
                <span>Yeni malzeme oluşturmak için aşağıdaki alanları doldurun.</span>
              </div>
            </div>
          </div>

          {/* MALZEME CARD - Contract, PartNo, Description */}
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
                <i className="fas fa-barcode"></i>
              </div>
              <div style={{ 
                fontSize: "1.3rem",
                color: "#10b981",
                marginLeft: "12px",
                fontWeight: "600",
                flex: 1,
                minWidth: "200px"
              }}>
                Malzeme Bilgileri - {newPartFormData.partNo}
              </div>
            </div>
            
            {/* TEMEL MALZEME BİLGİLERİ */}
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
                <i className="fas fa-edit" style={{ marginRight: "8px", color: "#8b5cf6" }}></i>
                Malzeme Temel Bilgileri
              </h4>
              
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "15px" }}>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <label style={{ marginBottom: "5px", color: "#f1f5f9", fontSize: "0.85rem" }}>
                    Contract <span style={{ color: "#ef4444" }}>*</span>
                  </label>
                  <input
                    type="text"
                    value={newPartFormData.contract}
                    onChange={(e) => handleNewPartFormDataChange({ contract: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      backgroundColor: "rgba(30, 41, 59, 0.8)",
                      border: "1px solid #8b5cf6",
                      borderRadius: "6px",
                      color: "#f1f5f9",
                      fontSize: "0.9rem",
                      transition: "all 0.2s"
                    }}
                    placeholder="Örn: 001"
                  />
                </div>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <label style={{ marginBottom: "5px", color: "#f1f5f9", fontSize: "0.85rem" }}>
                    Malzeme Kodu <span style={{ color: "#ef4444" }}>*</span>
                  </label>
                  <input
                    type="text"
                    value={newPartFormData.partNo}
                    onChange={(e) => handleNewPartFormDataChange({ partNo: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      backgroundColor: "rgba(30, 41, 59, 0.8)",
                      border: "1px solid #8b5cf6",
                      borderRadius: "6px",
                      color: "#f1f5f9",
                      fontSize: "0.9rem",
                      transition: "all 0.2s"
                    }}
                    placeholder="Malzeme kodu"
                  />
                </div>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <label style={{ marginBottom: "5px", color: "#f1f5f9", fontSize: "0.85rem" }}>
                    Oluşturulma Tarihi
                  </label>
                  <input
                    type="date"
                    value={newPartFormData.createDate || ''}
                    onChange={(e) => handleNewPartFormDataChange({ createDate: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      backgroundColor: "rgba(30, 41, 59, 0.8)",
                      border: "1px solid #8b5cf6",
                      borderRadius: "6px",
                      color: "#f1f5f9",
                      fontSize: "0.9rem",
                      transition: "all 0.2s"
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Tabs Card - GENEL, STORAGE, CLASSIFICATION */}
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
                      {tab === "Storage" && <i className="fas fa-warehouse"></i>}
                      {tab === "Classification" && <i className="fas fa-tags"></i>}
                      <span>{tab}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Tab Content */}
            <div style={{ minHeight: "300px" }}>
              {activeTab === "General" && (
                <GeneralTab 
                  formData={newPartFormData}
                  onFormDataChange={handleNewPartFormDataChange}
                />
              )}
              {activeTab === "Storage" && (
                <StorageTab 
                  formData={newPartFormData}
                  onFormDataChange={handleNewPartFormDataChange}
                />
              )}
              {activeTab === "Classification" && (
                <ClassificationTab 
                  formData={newPartFormData}
                  onFormDataChange={handleNewPartFormDataChange}
                />
              )}
            </div>

            {/* Butonlar */}
            <div style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: "12px",
              marginTop: "20px",
              paddingTop: "20px",
              borderTop: "1px solid #334155"
            }}>
              <button
                onClick={handleCancelNewPart}
                disabled={isSaving}
                style={{
                  background: "#64748b",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  padding: "10px 20px",
                  fontSize: "0.9rem",
                  cursor: isSaving ? "not-allowed" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  transition: "all 0.2s",
                  opacity: isSaving ? 0.6 : 1
                }}
              >
                <i className="fas fa-times"></i>
                <span>İptal</span>
              </button>
              <button
                onClick={handleCreateNewPart}
                disabled={isSaving || !newPartFormData.contract || !newPartFormData.partNo}
                style={{
                  background: !newPartFormData.contract || !newPartFormData.partNo
                    ? "#475569" 
                    : isSaving
                    ? "#f59e0b"
                    : "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  padding: "10px 25px",
                  fontSize: "0.9rem",
                  cursor: !newPartFormData.contract || !newPartFormData.partNo || isSaving 
                    ? "not-allowed" 
                    : "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  opacity: !newPartFormData.contract || !newPartFormData.partNo || isSaving ? 0.6 : 1
                }}
              >
                {isSaving ? (
                  <>
                    <i className="fas fa-spinner fa-spin"></i>
                    <span>Kaydediliyor...</span>
                  </>
                ) : (
                  <>
                    <i className="fas fa-check"></i>
                    <span>Malzemeyi Oluştur</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // NORMAL EKRAN - Malzeme Listeleme ve Düzenleme
  return (
    <div style={{ 
      display: "flex", 
      width: "100%", 
      height: "100vh", 
      overflow: "hidden",
      backgroundColor: "#0f172a" 
    }}>
      {/* SearchList Panel */}
      {isSearchListVisible && (
        <SearchList
          title="Malzeme Arama"
          items={searchListItems}
          onSelect={handlePartSelect}
          onToggle={handleToggleSearchList}
          searchFields={["code", "name", "description"]}
          displayFields={["code", "name"]}
          icon="fas fa-boxes"
        />
      )}

      {/* SearchList GİZLİ durumda */}
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
              backgroundColor: "#8b5cf6",
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
              <i className="fas fa-boxes"></i>
            </div>
            <div style={{ 
              fontSize: "1.3rem",
              color: "#8b5cf6",
              marginLeft: "12px",
              fontWeight: "600",
              flex: 1,
              minWidth: "200px"
            }}>
              Malzeme Kartı Tanımları
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
                  background: isSearchListVisible ? "#334155" : "#8b5cf6",
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
              
              {/* Yeni Malzeme Butonu */}
              <button
                onClick={() => setIsCreatingNewPart(true)}
                style={{
                  background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  padding: "8px 15px",
                  fontSize: "0.8rem",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  flexShrink: 0,
                  transition: "all 0.2s"
                }}
                onMouseOver={(e) => e.currentTarget.style.transform = "translateY(-2px)"}
                onMouseOut={(e) => e.currentTarget.style.transform = "translateY(0)"}
              >
                <i className="fas fa-plus"></i>
                <span>Yeni Malzeme</span>
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
                  disabled={!selectedPart}
                  style={{
                    background: selectedPart 
                      ? "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)" 
                      : "#64748b",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                    padding: "8px 15px",
                    fontSize: "0.85rem",
                    cursor: selectedPart ? "pointer" : "not-allowed",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    flexShrink: 0,
                    opacity: selectedPart ? 1 : 0.6
                  }}
                >
                  <i className="fas fa-save"></i>
                  <span>Kaydet</span>
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
            borderLeft: selectedPart ? "3px solid #10b981" : "3px solid #8b5cf6",
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
                ) : inventoryParts.length === 0 ? (
                  <span>Veritabanında malzeme bulunamadı.</span>
                ) : selectedPart ? (
                  `"${selectedPart.partNo} - ${selectedPart.description || 'Açıklama yok'}" malzemesinin bilgilerini düzenleyin.`
                ) : (
                  "Düzenlemek için soldaki listeden bir malzeme seçin veya 'Yeni Malzeme' butonuna tıklayın."
                )}
              </div>
              {selectedPart && (
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
                  <span>Seçili: <strong>{selectedPart.partNo}</strong></span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* MALZEME CARD - Contract, PartNo, Description - DÜZENLENEBİLİR ALANLAR */}
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
              <i className="fas fa-barcode"></i>
            </div>
            <div style={{ 
              fontSize: "1.3rem",
              color: "#10b981",
              marginLeft: "12px",
              fontWeight: "600",
              flex: 1,
              minWidth: "200px"
            }}>
              {selectedPart ? `Malzeme Bilgileri - ${selectedPart.partNo}` : "Malzeme Bilgileri"}
            </div>
            {selectedPart && (
              <button
                onClick={handleSavePartFields}
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
                <span>Malzeme Bilgilerini Kaydet</span>
              </button>
            )}
          </div>
          
          {/* MALZEME BİLGİLERİ - DÜZENLENEBİLİR ALANLAR */}
          {selectedPart ? (
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
                <i className="fas fa-edit" style={{ marginRight: "8px", color: "#8b5cf6" }}></i>
                Malzeme Temel Bilgileri
              </h4>
              
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "15px" }}>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <label style={{ marginBottom: "5px", color: "#f1f5f9", fontSize: "0.85rem" }}>
                    Contract <span style={{ color: "#ef4444" }}>*</span>
                  </label>
                  <input
                    type="text"
                    value={editingPartData.contract}
                    onChange={(e) => handleUpdatePartField('contract', e.target.value)}
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      backgroundColor: "rgba(30, 41, 59, 0.8)",
                      border: "1px solid #8b5cf6",
                      borderRadius: "6px",
                      color: "#f1f5f9",
                      fontSize: "0.9rem",
                      transition: "all 0.2s"
                    }}
                  />
                  <div style={{ fontSize: "0.75rem", color: "#94a3b8", marginTop: "4px" }}>
                    Malzeme contract numarası
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <label style={{ marginBottom: "5px", color: "#f1f5f9", fontSize: "0.85rem" }}>
                    Malzeme Kodu <span style={{ color: "#ef4444" }}>*</span>
                  </label>
                  <input
                    type="text"
                    value={editingPartData.partNo}
                    onChange={(e) => handleUpdatePartField('partNo', e.target.value)}
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      backgroundColor: "rgba(30, 41, 59, 0.8)",
                      border: "1px solid #8b5cf6",
                      borderRadius: "6px",
                      color: "#f1f5f9",
                      fontSize: "0.9rem",
                      transition: "all 0.2s"
                    }}
                  />
                  <div style={{ fontSize: "0.75rem", color: "#94a3b8", marginTop: "4px" }}>
                    Malzemenin benzersiz kodu
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <label style={{ marginBottom: "5px", color: "#f1f5f9", fontSize: "0.85rem" }}>
                    Açıklama
                  </label>
                  <input
                    type="text"
                    value={editingPartData.description}
                    onChange={(e) => handleUpdatePartField('description', e.target.value)}
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      backgroundColor: "rgba(30, 41, 59, 0.8)",
                      border: "1px solid #8b5cf6",
                      borderRadius: "6px",
                      color: "#f1f5f9",
                      fontSize: "0.9rem",
                      transition: "all 0.2s"
                    }}
                  />
                  <div style={{ fontSize: "0.75rem", color: "#94a3b8", marginTop: "4px" }}>
                    Malzeme açıklaması
                  </div>
                </div>
              </div>

              {/* Sil butonu */}
              <div style={{ 
                display: "flex", 
                justifyContent: "flex-end",
                marginTop: "15px",
                paddingTop: "15px",
                borderTop: "1px solid #334155"
              }}>
                <button
                  onClick={handleDeletePart}
                  style={{
                    background: "#ef4444",
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
                  <span>Malzemeyi Sil</span>
                </button>
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
              <i className="fas fa-boxes" style={{ fontSize: "2rem", marginBottom: "10px", color: "#64748b" }}></i>
              <p>Düzenlemek için soldaki listeden bir malzeme seçin</p>
            </div>
          )}
          
          {/* Malzeme sayısı bilgisi */}
          <div style={{ 
            fontSize: "0.85rem", 
            color: "#94a3b8", 
            padding: "8px 12px",
            backgroundColor: "rgba(30, 41, 59, 0.3)",
            borderRadius: "4px",
            marginTop: "10px"
          }}>
            <i className="fas fa-database" style={{ marginRight: "8px" }}></i>
            <span>Toplam {inventoryParts.length} malzeme bulundu</span>
            {loading && (
              <span style={{ marginLeft: "15px" }}>
                <i className="fas fa-spinner fa-spin"></i> Veriler güncelleniyor...
              </span>
            )}
          </div>
        </div>

        {/* Tabs Card - GENEL BİLGİLER */}
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
                    {tab === "Storage" && <i className="fas fa-warehouse"></i>}
                    {tab === "Classification" && <i className="fas fa-tags"></i>}
                    <span>{tab}</span>
                    </div>
                </button>
              );
            })}
          </div>

          {/* Tab Content */}
          <div style={{ minHeight: "300px" }}>
            {activeTab === "General" && editingFormData && (
              <GeneralTab 
                formData={editingFormData}
                onFormDataChange={handleEditingFormDataChange}
              />
            )}
            {activeTab === "Storage" && editingFormData && (
              <StorageTab 
                formData={editingFormData}
                onFormDataChange={handleEditingFormDataChange}
              />
            )}
            {activeTab === "Classification" && editingFormData && (
              <ClassificationTab 
                formData={editingFormData}
                onFormDataChange={handleEditingFormDataChange}
              />
            )}
            {(!editingFormData || !selectedPart) && (
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
                <i className="fas fa-boxes" style={{ fontSize: "2.5rem", marginBottom: "10px" }}></i>
                <p>Düzenlemek için bir malzeme seçin</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}