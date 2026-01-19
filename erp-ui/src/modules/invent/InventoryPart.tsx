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
  selectedPart, 
  onFormDataChange 
}: { 
  selectedPart: InventoryPart | null;
  onFormDataChange?: (formData: any) => void;
}) => {
  const [formData, setFormData] = useState({
    description: selectedPart?.description || "",
    unitMeas: selectedPart?.unitMeas || "ADET",
    salesUnitMeas: selectedPart?.salesUnitMeas || "ADET",
    listPrice: selectedPart?.listPrice || 0,
    listPriceInclTax: selectedPart?.listPriceInclTax || 0,
    priceConvFactor: selectedPart?.priceConvFactor || 1,
    taxCode: selectedPart?.taxCode || "KDV01",
    taxClassId: selectedPart?.taxClassId || "STANDARD",
    salesType: selectedPart?.salesType || "SATIS",
    salesTypeDb: selectedPart?.salesTypeDb || "SALE"
  });

  // Seçili malzeme değiştiğinde formData'yı güncelle
  useEffect(() => {
    if (selectedPart) {
      const newFormData = {
        description: selectedPart.description || "",
        unitMeas: selectedPart.unitMeas || "ADET",
        salesUnitMeas: selectedPart.salesUnitMeas || "ADET",
        listPrice: selectedPart.listPrice || 0,
        listPriceInclTax: selectedPart.listPriceInclTax || 0,
        priceConvFactor: selectedPart.priceConvFactor || 1,
        taxCode: selectedPart.taxCode || "KDV01",
        taxClassId: selectedPart.taxClassId || "STANDARD",
        salesType: selectedPart.salesType || "SATIS",
        salesTypeDb: selectedPart.salesTypeDb || "SALE"
      };
      setFormData(newFormData);
      if (onFormDataChange) {
        onFormDataChange(newFormData);
      }
    }
  }, [selectedPart, onFormDataChange]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const newFormData = {
      ...formData,
      [name]: name.includes("Price") || name.includes("Conv") ? parseFloat(value) || 0 : value
    };
    setFormData(newFormData);
    
    if (onFormDataChange) {
      onFormDataChange(newFormData);
    }
  };

  return (
    <div style={{ padding: "15px 0", minHeight: "250px" }}>
      <div style={{ 
        display: "grid", 
        gridTemplateColumns: "1fr", 
        gap: "15px" 
      }}>
        {selectedPart ? (
          <>
            {/* Birim ve Fiyat Bilgileri */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "15px" }}>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <label style={{ marginBottom: "5px", color: "#f1f5f9", fontSize: "0.9rem" }}>Birim</label>
                <select
                  name="unitMeas"
                  value={formData.unitMeas}
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
                <label style={{ marginBottom: "5px", color: "#f1f5f9", fontSize: "0.9rem" }}>Satış Birimi</label>
                <select
                  name="salesUnitMeas"
                  value={formData.salesUnitMeas}
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
                  value={formData.priceConvFactor}
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
                  value={formData.listPrice}
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
                  value={formData.listPriceInclTax}
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
                  value={formData.taxCode}
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
                  <option value="KDV01">KDV %1</option>
                  <option value="KDV08">KDV %8</option>
                  <option value="KDV10">KDV %10</option>
                  <option value="KDV18">KDV %18</option>
                  <option value="KDV20">KDV %20</option>
                  <option value="KDV0">KDV %0</option>
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
                  value={formData.taxClassId}
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
                  value={formData.salesType}
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
                  value={formData.description}
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
            <i className="fas fa-boxes" style={{ fontSize: "2.5rem", marginBottom: "10px" }}></i>
            <p>Düzenlemek için bir malzeme seçin</p>
          </div>
        )}
      </div>
    </div>
  );
};

// StorageTab bileşeni
const StorageTab = ({ selectedPart }: { selectedPart: InventoryPart | null }) => {
  return (
    <div style={{ padding: "15px 0", minHeight: "250px" }}>
      {selectedPart ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "15px" }}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <label style={{ marginBottom: "5px", color: "#f1f5f9", fontSize: "0.9rem" }}>Depo Genişliği (cm)</label>
            <input
              type="number"
              defaultValue={selectedPart.storageWidthRequirement || 0}
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
              defaultValue={selectedPart.storageHeightRequirement || 0}
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
              defaultValue={selectedPart.storageDepthRequirement || 0}
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
          <i className="fas fa-warehouse" style={{ fontSize: "2.5rem", marginBottom: "10px" }}></i>
          <p>Depolama bilgilerini görmek için bir malzeme seçin</p>
        </div>
      )}
    </div>
  );
};

// ClassificationTab bileşeni
const ClassificationTab = ({ selectedPart }: { selectedPart: InventoryPart | null }) => {
  return (
    <div style={{ padding: "15px 0", minHeight: "250px" }}>
      {selectedPart ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "15px" }}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <label style={{ marginBottom: "5px", color: "#f1f5f9", fontSize: "0.9rem" }}>Ürün Grubu</label>
            <input
              type="text"
              defaultValue={selectedPart.partProductFamily || ""}
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
              defaultValue={selectedPart.primeCommodity || ""}
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
              defaultValue={selectedPart.secondCommodity || ""}
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
          <i className="fas fa-tags" style={{ fontSize: "2.5rem", marginBottom: "10px" }}></i>
          <p>Sınıflandırma bilgilerini görmek için bir malzeme seçin</p>
        </div>
      )}
    </div>
  );
};

const tabs = ["General", "Storage", "Classification"];

export default function InventoryPartPage() {
  const [activeTab, setActiveTab] = useState("General");
  
  // SearchList'ten seçilen malzeme state'i
  const [selectedPart, setSelectedPart] = useState<InventoryPart | null>(null);
  const [isSearchListVisible, setIsSearchListVisible] = useState(false);

  // PostgreSQL'den gelen malzeme verileri
  const [inventoryParts, setInventoryParts] = useState<InventoryPart[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // GeneralTab form verileri
  const [generalTabFormData, setGeneralTabFormData] = useState<any>(null);

  // Düzenlenen malzeme bilgileri
  const [editingPartData, setEditingPartData] = useState({
    contract: "",
    partNo: "",
    description: ""
  });

  // PostgreSQL'den malzeme verilerini çek
  useEffect(() => {
    fetchInventoryParts();
  }, []);

  useEffect(() => {
    if (selectedPart) {
      setEditingPartData({
        contract: selectedPart.contract,
        partNo: selectedPart.partNo,
        description: selectedPart.description || ""
      });
    }
  }, [selectedPart]);

  const fetchInventoryParts = async () => {
    try {
      setLoading(true);
      // API endpoint'i
      const response = await fetch('http://localhost:5217/api/inventorypart');
      
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
      setEditingPartData({
        contract: selected.contract,
        partNo: selected.partNo,
        description: selected.description || ""
      });
    }
  };

  const handleToggleSearchList = () => {
    setIsSearchListVisible(!isSearchListVisible);
  };

  // Malzeme silme
  const handleDeletePart = async () => {
    if (!selectedPart) return;
    
    if (window.confirm("Bu malzemeyi silmek istediğinize emin misiniz?")) {
      try {
        const response = await fetch(`http://localhost:5217/api/inventorypart/${selectedPart.contract}/${selectedPart.partNo}`, {
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
  const handleSavePartFields = async () => {
    if (!selectedPart) return;

    try {
      const updateDto: InventoryPartUpdateDto = {
        description: editingPartData.description,
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

      const response = await fetch(`http://localhost:5217/api/inventorypart/${editingPartData.contract}/${editingPartData.partNo}`, {
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

  // Tüm değişiklikleri kaydet
  const handleSaveAll = async () => {
    if (!selectedPart) {
      alert("Lütfen önce bir malzeme seçin!");
      return;
    }

    try {
      // Update DTO oluştur
      const updateDto: InventoryPartUpdateDto = {
        description: generalTabFormData?.description || selectedPart.description,
        listPrice: generalTabFormData?.listPrice || selectedPart.listPrice,
        listPriceInclTax: generalTabFormData?.listPriceInclTax || selectedPart.listPriceInclTax,
        priceConvFactor: generalTabFormData?.priceConvFactor || selectedPart.priceConvFactor,
        taxCode: generalTabFormData?.taxCode || selectedPart.taxCode,
        taxClassId: generalTabFormData?.taxClassId || selectedPart.taxClassId,
        salesType: generalTabFormData?.salesType || selectedPart.salesType,
        salesTypeDb: generalTabFormData?.salesTypeDb || selectedPart.salesTypeDb,
        unitMeas: generalTabFormData?.unitMeas || selectedPart.unitMeas,
        salesUnitMeas: generalTabFormData?.salesUnitMeas || selectedPart.salesUnitMeas,
        rowversion: selectedPart.rowversion
      };

      const response = await fetch(`http://localhost:5217/api/inventorypart/${editingPartData.contract}/${editingPartData.partNo}`, {
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
                  "Düzenlemek için soldaki listeden bir malzeme seçin."
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
            {activeTab === "General" && (
              <GeneralTab 
                selectedPart={selectedPart} 
                onFormDataChange={setGeneralTabFormData}
              />
            )}
            {activeTab === "Storage" && <StorageTab selectedPart={selectedPart} />}
            {activeTab === "Classification" && <ClassificationTab selectedPart={selectedPart} />}
          </div>
        </div>
      </div>
    </div>
  );
}