// src/modules/production/ShopOrders.tsx

import { useState, useEffect, useCallback } from "react";
import SearchList from "./../../components/SearchList";
import { ChevronRightIcon, EllipsisVerticalIcon } from "@heroicons/react/24/outline";
import type { ShopOrder, ShopMaterialAlloc } from "./../../types/shopOrder.types";
import { ShopOrderService, ShopMaterialService } from "../../services/shopOrder.service";
interface MaterialDescription {
  [key: string]: string; // key: `${contract}_${partNo}`, value: açıklama
}
// Stil sabitleri
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

const tabs = ["Malzeme Tahsisleri", "Notlar"];

export default function ShopOrders() {
  // State tanımlamaları
  const [activeTab, setActiveTab] = useState(tabs[0]);
  const [selectedOrder, setSelectedOrder] = useState<ShopOrder | null>(null);
  const [editingOrder, setEditingOrder] = useState<ShopOrder | null>(null);
  const [orders, setOrders] = useState<ShopOrder[]>([]);
  const [materials, setMaterials] = useState<ShopMaterialAlloc[]>([]);
  const [editingMaterials, setEditingMaterials] = useState<ShopMaterialAlloc[]>([]);
  const [isSearchListVisible, setIsSearchListVisible] = useState(false);
  const [isCreatingNewOrder, setIsCreatingNewOrder] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
   const [materialDescriptions, setMaterialDescriptions] = useState<MaterialDescription>({});
  const [selectedMaterialDesc, setSelectedMaterialDesc] = useState<string>('');

  // Verileri yükle
  useEffect(() => {
    fetchOrders();
  }, []);

  // DÜZELTME: isEditing durumunu kontrol et
  useEffect(() => {
    if (selectedOrder) {
      if (!isEditing) {
        // Sadece düzenleme modunda DEĞİLKEN malzemeleri yükle
        fetchMaterials(selectedOrder.contract, selectedOrder.orderNo);
      }
      setEditingOrder(selectedOrder);
    } else {
      setMaterials([]);
      setEditingMaterials([]);
      setEditingOrder(null);
    }
  }, [selectedOrder]);

  // API çağrıları
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await ShopOrderService.getAllOrders({ pageSize: 100 });
      setOrders(data);
      setError(null);
    } catch (err) {
      console.error("Siparişler yüklenemedi:", err);
      setError(err instanceof Error ? err.message : "Bilinmeyen hata");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchMaterials = async (contract: string, orderNo: string) => {
    try {
      const data = await ShopMaterialService.getMaterialsByOrder(contract, orderNo);
      setMaterials(data);
      setEditingMaterials([...data]);
    } catch (err) {
      console.error("Malzemeler yüklenemedi:", err);
      setMaterials([]);
      setEditingMaterials([]);
    }
  };

  // SearchList için item formatter
  const searchListItems = orders.map((order, index) => ({
    id: index + 1,
    code: order.orderNo,
    name: `${order.partNo} - ${order.contract}`,
    description: `Emri: ${order.orderNo} | Malzeme: ${order.partNo} | Miktar: ${order.revisedQtyDue || 0} | Durum: ${order.rowstate || 'Released'}`,
    originalData: order
  }));

  const handleOrderSelect = (item: any) => {
    if (item.originalData) {
      setSelectedOrder(item.originalData);
      setEditingOrder(item.originalData);
      setIsEditing(false);
      setIsCreatingNewOrder(false);
    }
  };

  const handleToggleSearchList = useCallback(() => {
    setIsSearchListVisible(!isSearchListVisible);
  }, [isSearchListVisible]);

  // Düzenleme işlemleri
  const handleEditClick = () => {
    setIsEditing(true);
  };
  
  const handleCancelEdit = () => {
    setIsEditing(false);
    if (selectedOrder) {
      setEditingOrder(selectedOrder);
      setEditingMaterials([...materials]);
    }
  };

  const handleEditingOrderChange = (field: keyof ShopOrder, value: any) => {
    if (!editingOrder) return;
    
    const updatedOrder = { ...editingOrder, [field]: value };
    setEditingOrder(updatedOrder);
    
    if (field === 'revisedQtyDue') {
      const revisedQtyDue = value || 1;
      const updatedMaterials = editingMaterials.map(material => ({
        ...material,
        qtyRequired: revisedQtyDue * (material.qtyPerAssembly || 1)
      }));
      setEditingMaterials(updatedMaterials);
    }
  };

  const handleEditingMaterialChange = (index: number, field: keyof ShopMaterialAlloc, value: any) => {
    if (!editingMaterials[index]) return;
    
    const updated = [...editingMaterials];
    let newValue = field.includes('qty') ? parseFloat(value) || 0 : value;
    
    // qty_assigned için qty_required'ı geçmemesi için validasyon
    if (field === 'qtyAssigned') {
      const currentMaterial = updated[index];
      const qtyRequired = currentMaterial.qtyRequired || 0;
      if (newValue > qtyRequired) {
        // Eğer fazla girilirse, qty_required değeriyle sınırla
        newValue = qtyRequired;
        alert(`Rezerve miktar gerekli miktardan (${qtyRequired}) fazla olamaz!`);
      }
    }
    
    updated[index] = { 
      ...updated[index], 
      [field]: newValue
    };
    
    if (field === 'qtyPerAssembly') {
      const revisedQtyDue = editingOrder?.revisedQtyDue || 1;
      updated[index].qtyRequired = revisedQtyDue * (newValue || 1);
    }
    
    setEditingMaterials(updated);
  };

  // Tüm satırları rezerve et
  const handleReserveAllMaterials = () => {
    if (!isEditing) {
      alert("Rezervasyon yapmak için önce düzenleme moduna geçin.");
      return;
    }

    const updatedMaterials = editingMaterials.map(material => ({
      ...material,
      qtyAssigned: material.qtyRequired || 0
    }));
    
    setEditingMaterials(updatedMaterials);
    setShowMoreMenu(false);
    alert("Tüm malzemeler rezerve edildi!");
  };

  const handleSaveOrder = async () => {
    if (!editingOrder || !selectedOrder) return;

    try {
      setIsSaving(true);
      
      const updatedOrder = await ShopOrderService.updateOrder(
        selectedOrder.contract,
        selectedOrder.orderNo,
        selectedOrder.orderCode,
        selectedOrder.partNo,
        {
          revisedStartDate: editingOrder.revisedStartDate,
          revisedDueDate: editingOrder.revisedDueDate,
          needDate: editingOrder.needDate,
          revisedQtyDue: editingOrder.revisedQtyDue,
          qtyComplete: editingOrder.qtyComplete,
          noteText: editingOrder.noteText,
          customerOrderNo: editingOrder.customerOrderNo,
          rowstate: editingOrder.rowstate,
          rowversion: selectedOrder.rowversion
        }
      );

      const materialErrors: string[] = [];
      
      for (const material of editingMaterials) {
        try {
          if (material.rowkey?.includes('new-')) {
            await ShopMaterialService.createMaterial({
              contract: material.contract,
              orderNo: material.orderNo,
              lineItemNo: material.lineItemNo,
              partNo: material.partNo,
              operationNo: material.operationNo,
              qtyAssigned: material.qtyAssigned,
              qtyPerAssembly: material.qtyPerAssembly,
              qtyRequired: material.qtyRequired,
              noteText: material.noteText,
              projectId: material.projectId,
              rowstate: material.rowstate
            });
          } else {
            await ShopMaterialService.updateMaterial(
              material.contract,
              material.orderNo,
              material.lineItemNo,
              material.partNo,
              {
                operationNo: material.operationNo,
                qtyAssigned: material.qtyAssigned,
                qtyIssued: material.qtyIssued,
                qtyPerAssembly: material.qtyPerAssembly,
                qtyRequired: material.qtyRequired,
                noteText: material.noteText,
                rowstate: material.rowstate,
                rowversion: material.rowversion
              }
            );
          }
        } catch (err) {
          materialErrors.push(`Malzeme ${material.lineItemNo}: ${err instanceof Error ? err.message : "Bilinmeyen hata"}`);
        }
      }

      if (materialErrors.length > 0) {
        alert(`Sipariş güncellendi ancak bazı malzemeler işlenemedi:\n${materialErrors.join('\n')}`);
      }

      await fetchOrders();
      setSelectedOrder(updatedOrder);
      setEditingOrder(updatedOrder);
      await fetchMaterials(updatedOrder.contract, updatedOrder.orderNo);
      setIsEditing(false);
      alert("İş emri başarıyla güncellendi!");
    } catch (err) {
      console.error("Güncelleme hatası:", err);
      alert(`Hata: ${err instanceof Error ? err.message : "Bilinmeyen hata"}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteOrder = async () => {
    if (!selectedOrder) return;
    
    if (!window.confirm(`${selectedOrder.orderNo} numaralı üretim emrini silmek istediğinize emin misiniz?`)) {
      return;
    }

    try {
      await ShopOrderService.deleteOrder(
        selectedOrder.contract,
        selectedOrder.orderNo,
        selectedOrder.orderCode,
        selectedOrder.partNo
      );
      
      await fetchOrders();
      setSelectedOrder(null);
      setEditingOrder(null);
      setIsEditing(false);
      alert("Üretim emri başarıyla silindi!");
    } catch (err) {
      console.error("Silme hatası:", err);
      alert(`Hata: ${err instanceof Error ? err.message : "Bilinmeyen hata"}`);
    }
  };
  // Seçili sipariş değiştiğinde malzeme açıklamasını al
  useEffect(() => {
    if (selectedOrder) {
      fetchMaterialDescription(selectedOrder.contract, selectedOrder.partNo);
    } else {
      setSelectedMaterialDesc('');
    }
  }, [selectedOrder]);

  // Malzemeler yüklendiğinde malzeme açıklamalarını al
  useEffect(() => {
    if (materials.length > 0) {
      fetchMaterialsDescriptions(materials);
    }
  }, [materials]);

  // Malzeme açıklamalarını almak için fonksiyonlar
  const fetchMaterialDescription = async (contract: string, partNo: string) => {
    try {
      const key = `${contract}_${partNo}`;
      if (materialDescriptions[key]) {
        setSelectedMaterialDesc(materialDescriptions[key]);
        return;
      }

      const description = await ShopMaterialService.getMaterialDescription(contract, partNo);
      setMaterialDescriptions(prev => ({
        ...prev,
        [key]: description
      }));
      setSelectedMaterialDesc(description);
    } catch (err) {
      console.error('Malzeme açıklaması alınamadı:', err);
      setSelectedMaterialDesc('');
    }
  };

  const fetchMaterialsDescriptions = async (materials: ShopMaterialAlloc[]) => {
    try {
      const newDescriptions: MaterialDescription = { ...materialDescriptions };
      
      for (const material of materials) {
        const key = `${material.contract}_${material.partNo}`;
        if (!newDescriptions[key]) {
          try {
            const description = await ShopMaterialService.getMaterialDescription(
              material.contract, 
              material.partNo
            );
            newDescriptions[key] = description;
          } catch (err) {
            newDescriptions[key] = '';
            console.error(`${material.partNo} açıklaması alınamadı:`, err);
          }
        }
      }
      
      setMaterialDescriptions(newDescriptions);
    } catch (err) {
      console.error('Malzeme açıklamaları alınamadı:', err);
    }
  };

  // Yeni iş emri ekranı render mantığı
  if (isCreatingNewOrder) {
    return (
      <div style={{ 
        display: "flex", 
        width: "100%", 
        height: "100vh", 
        overflow: "hidden",
        backgroundColor: "#0f172a",
        alignItems: "center",
        justifyContent: "center"
      }}>
        <div style={{
          background: "#1e293b",
          borderRadius: "12px",
          padding: "30px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
          border: "1px solid #334155",
          width: "90%",
          maxWidth: "600px"
        }}>
          <h2 style={{ 
            color: "#f1f5f9", 
            fontSize: "1.5rem", 
            marginBottom: "20px",
            textAlign: "center"
          }}>
            Yeni İş Emri Oluştur
          </h2>
          <p style={{ 
            color: "#94a3b8", 
            textAlign: "center",
            marginBottom: "30px"
          }}>
            Bu özellik henüz geliştirilme aşamasındadır.
          </p>
          <div style={{ 
            display: "flex", 
            justifyContent: "center",
            gap: "15px",
            marginTop: "30px"
          }}>
            <button
              onClick={() => setIsCreatingNewOrder(false)}
              style={{
                background: "#64748b",
                color: "white",
                border: "none",
                borderRadius: "6px",
                padding: "10px 20px",
                fontSize: "0.9rem",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "8px"
              }}
            >
              <i className="fas fa-arrow-left"></i>
              <span>Geri Dön</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // NORMAL EKRAN
  return (
    <div style={{ 
      display: "flex", 
      width: "100%", 
      height: "100vh", 
      overflow: "hidden",
      backgroundColor: "#0f172a" 
    }}>
      {isSearchListVisible && (
        <SearchList
          title="Üretim Emri Arama"
          items={searchListItems}
          onSelect={handleOrderSelect}
          onToggle={handleToggleSearchList}
          searchFields={["code", "name", "description"]}
          displayFields={["code", "name"]}
          icon="fas fa-industry"
        />
      )}

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
        }}
      >
        <div style={{
          background: "#1e293b",
          borderRadius: "12px",
          padding: "20px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
          border: "1px solid #334155",
          marginBottom: "15px"
        }}>
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "15px",
            paddingBottom: "15px",
            borderBottom: "1px solid #334155",
            flexWrap: "wrap",
            gap: "10px"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={{ 
                backgroundColor: "#8b5cf6",
                color: "white",
                width: "36px",
                height: "36px",
                borderRadius: "8px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.1rem"
              }}>
                <i className="fas fa-industry"></i>
              </div>
              <div>
                <h2 style={{ margin: 0, color: "#f1f5f9", fontSize: "1.3rem" }}>Üretim Emirleri</h2>
                <p style={{ margin: "4px 0 0 0", color: "#94a3b8", fontSize: "0.85rem" }}>
                  Shop Order Management
                </p>
              </div>
            </div>
            
            <div style={{ 
              display: "flex", 
              alignItems: "center", 
              gap: "8px", 
              flexWrap: "wrap",
              justifyContent: "flex-end" 
            }}>
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
                  flexShrink: 0
                }}
              >
                <i className="fas fa-search"></i>
                <span>{isSearchListVisible ? "Listeyi Gizle" : "Listeyi Göster"}</span>
              </button>
              
              <button
                onClick={() => setIsCreatingNewOrder(true)}
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
                  flexShrink: 0
                }}
              >
                <i className="fas fa-plus"></i>
                <span>Yeni İş Emri</span>
              </button>
            </div>
          </div>
          
          <div style={{
            color: "#94a3b8",
            padding: "12px",
            backgroundColor: "rgba(139, 92, 246, 0.1)",
            borderRadius: "6px",
            borderLeft: "3px solid #8b5cf6",
            fontSize: "0.85rem"
          }}>
            {loading ? (
              <span>Veriler yükleniyor...</span>
            ) : error ? (
              <span style={{ color: "#ef4444" }}>Hata: {error}</span>
            ) : selectedOrder ? (
              <span>
                Emri: <strong>{selectedOrder.orderNo}</strong> | 
                Malzeme: <strong>{selectedOrder.partNo}</strong> | 
                Kontrat: <strong>{selectedOrder.contract}</strong>
                {isEditing && " (Düzenleme Modu)"}
              </span>
            ) : (
              "Düzenlemek için soldaki listeden bir üretim emri seçin veya 'Yeni İş Emri' butonuna tıklayın."
            )}
          </div>
        </div>

        {selectedOrder && editingOrder && (
          <div style={{
            background: "#1e293b",
            borderRadius: "12px",
            padding: "20px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
            border: "1px solid #334155",
            marginBottom: "15px"
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
                <i className="fas fa-file-invoice" style={{ color: "#38bdf8" }}></i>
                Emri Detayları
              </h3>
              
              <div style={{ display: "flex", gap: "10px", position: "relative" }}>
                {!isEditing ? (
                  <>
                    <button
                      onClick={handleEditClick}
                      style={{
                        background: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
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
                      <i className="fas fa-edit"></i>
                      <span>Düzenle</span>
                    </button>
                    <button
                      onClick={handleDeleteOrder}
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
                      <span>Sil</span>
                    </button>
                  </>
                ) : (
                  <>
                    {/* Üç nokta menüsü */}
                    <div style={{ position: "relative" }}>
                      <button
                        onClick={() => setShowMoreMenu(!showMoreMenu)}
                        style={{
                          background: "#475569",
                          color: "white",
                          border: "none",
                          borderRadius: "6px",
                          padding: "8px 12px",
                          fontSize: "0.85rem",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: "6px"
                        }}
                      >
                        <EllipsisVerticalIcon style={{ width: "20px", height: "20px" }} />
                      </button>
                      
                      {showMoreMenu && (
                        <div style={{
                          position: "absolute",
                          top: "100%",
                          right: 0,
                          marginTop: "5px",
                          backgroundColor: "#1e293b",
                          border: "1px solid #334155",
                          borderRadius: "6px",
                          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
                          zIndex: 1000,
                          minWidth: "200px"
                        }}>
                          <button
                            onClick={handleReserveAllMaterials}
                            style={{
                              width: "100%",
                              padding: "10px 15px",
                              background: "none",
                              border: "none",
                              color: "#f1f5f9",
                              cursor: "pointer",
                              textAlign: "left",
                              display: "flex",
                              alignItems: "center",
                              gap: "8px",
                              fontSize: "0.85rem"
                            }}
                            onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#334155"}
                            onMouseOut={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                          >
                            <i className="fas fa-check-double" style={{ color: "#10b981" }}></i>
                            <span>Tüm Satırları Rezerve Et</span>
                          </button>
                        </div>
                      )}
                    </div>
                    
                    <button
                      onClick={handleCancelEdit}
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
                      onClick={handleSaveOrder}
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
            
            {/* İş Emri Detayları */}
            <div style={{ 
              display: "grid", 
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", 
              gap: "15px",
              marginBottom: "20px"
            }}>
              <div>
                <label style={labelStyle}>Emri No</label>
                <div style={{ 
                  padding: "8px", 
                  backgroundColor: "rgba(30, 41, 59, 0.5)",
                  borderRadius: "4px",
                  color: "#f1f5f9"
                }}>
                  {editingOrder.orderNo}
                </div>
              </div>
              
              <div>
                <label style={labelStyle}>Malzeme</label>
                <div style={{ 
                  padding: "8px", 
                  backgroundColor: "rgba(30, 41, 59, 0.5)",
                  borderRadius: "4px",
                  color: "#f1f5f9"
                }}>
                  {editingOrder.partNo}
                </div>
              </div>
               {/* MALZEME AÇIKLAMASI TEXTBOX'u */}
            <div>
              <label style={labelStyle}>Malzeme Açıklaması</label>
              <div style={{ 
                padding: "8px", 
                backgroundColor: "rgba(30, 41, 59, 0.5)",
                borderRadius: "4px",
                color: "#f1f5f9",
                minHeight: "35px",
                display: "flex",
                alignItems: "center"
              }}>
                {selectedMaterialDesc }
              </div>
            </div>
              <div>
                <label style={labelStyle}>Kontrat</label>
                <div style={{ 
                  padding: "8px", 
                  backgroundColor: "rgba(30, 41, 59, 0.5)",
                  borderRadius: "4px",
                  color: "#f1f5f9"
                }}>
                  {editingOrder.contract}
                </div>
              </div>
              
              <div>
                <label style={labelStyle}>Başlangıç Tarihi</label>
                {isEditing ? (
                  <input
                    type="date"
                    value={editingOrder.revisedStartDate?.split('T')[0] || ''}
                    onChange={(e) => handleEditingOrderChange('revisedStartDate', e.target.value)}
                    style={inputStyle}
                  />
                ) : (
                  <div style={{ 
                    padding: "8px", 
                    backgroundColor: "rgba(30, 41, 59, 0.5)",
                    borderRadius: "4px",
                    color: "#f1f5f9"
                  }}>
                    {editingOrder.revisedStartDate?.split('T')[0] || '-'}
                  </div>
                )}
              </div>
              
              <div>
                <label style={labelStyle}>Bitiş Tarihi</label>
                {isEditing ? (
                  <input
                    type="date"
                    value={editingOrder.revisedDueDate?.split('T')[0] || ''}
                    onChange={(e) => handleEditingOrderChange('revisedDueDate', e.target.value)}
                    style={inputStyle}
                  />
                ) : (
                  <div style={{ 
                    padding: "8px", 
                    backgroundColor: "rgba(30, 41, 59, 0.5)",
                    borderRadius: "4px",
                    color: "#f1f5f9"
                  }}>
                    {editingOrder.revisedDueDate?.split('T')[0] || '-'}
                  </div>
                )}
              </div>
              
              <div>
                <label style={labelStyle}>Planlanan Miktar</label>
                {isEditing ? (
                  <input
                    type="number"
                    value={editingOrder.revisedQtyDue || 0}
                    onChange={(e) => handleEditingOrderChange('revisedQtyDue', parseFloat(e.target.value) || 0)}
                    style={inputStyle}
                    min="0"
                    step="0.01"
                  />
                ) : (
                  <div style={{ 
                    padding: "8px", 
                    backgroundColor: "rgba(30, 41, 59, 0.5)",
                    borderRadius: "4px",
                    color: "#f1f5f9"
                  }}>
                    {editingOrder.revisedQtyDue?.toFixed(2) || '0.00'}
                  </div>
                )}
              </div>
              
              <div>
                <label style={labelStyle}>Durum</label>
                {isEditing ? (
                  <select
                    value={editingOrder.rowstate || 'Released'}
                    onChange={(e) => handleEditingOrderChange('rowstate', e.target.value)}
                    style={inputStyle}
                  >
                    <option value="Released">Released</option>
                    <option value="Planned">Planned</option>
                    <option value="Closed">Closed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                ) : (
                  <div style={{ 
                    padding: "8px", 
                    backgroundColor: editingOrder.rowstate === 'Released' ? "rgba(16, 185, 129, 0.2)" : 
                                   editingOrder.rowstate === 'Closed' ? "rgba(59, 130, 246, 0.2)" : 
                                   "rgba(245, 158, 11, 0.2)",
                    borderRadius: "4px",
                    color: editingOrder.rowstate === 'Released' ? "#10b981" : 
                           editingOrder.rowstate === 'Closed' ? "#3b82f6" : "#f59e0b",
                    fontWeight: "500"
                  }}>
                    {editingOrder.rowstate || 'Released'}
                  </div>
                )}
              </div>
            </div>

            {/* Tablar */}
            <div style={{ marginTop: "20px" }}>
              <div style={{ 
                display: "flex", 
                borderBottom: "1px solid #334155",
                marginBottom: "15px"
              }}>
                {tabs.map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    style={{
                      padding: "10px 20px",
                      background: "none",
                      border: "none",
                      color: activeTab === tab ? "#38bdf8" : "#94a3b8",
                      cursor: "pointer",
                      borderBottom: activeTab === tab ? "2px solid #38bdf8" : "none",
                      fontSize: "0.9rem"
                    }}
                  >
                    {tab}
                  </button>
                ))}
              </div>

            {activeTab === "Malzeme Tahsisleri" && (
  <div>
    {editingMaterials.length > 0 ? (
      <div style={{
        background: "#1e293b",
        borderRadius: "12px",
        overflow: "hidden",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
        border: "1px solid #334155",
        marginBottom: "20px"
      }}>
        {/* Tablo Container */}
        <div style={{
          overflowX: "auto", // Sadece yatay kaydırma
          minWidth: "900px" // Minimum genişlik
        }}>
          {/* Tablo başlıkları */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "80px 120px minmax(200px, 1fr) 100px 100px 100px 100px 100px",
            backgroundColor: "#334155",
            padding: "12px 15px",
            borderBottom: "1px solid #475569",
            fontSize: "0.8rem",
            fontWeight: "600",
            color: "#f1f5f9",
            minWidth: "900px"
          }}>
            <div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>Satır</div>
            <div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>Malzeme No</div>
            <div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>Malzeme Açıklaması</div>
            <div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>Operasyon No</div>
            <div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>Montaj Başına</div>
            <div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>Gerekli Miktar</div>
            <div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>Rezerve Miktar</div>
            <div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>Tüketilen Miktar</div>
            
          </div>

          {editingMaterials.map((material, index) => {
            const key = `${material.contract}_${material.partNo}`;
            const materialDesc = materialDescriptions[key];
            const qtyAssigned = material.qtyAssigned || 0;
            const qtyRequired = material.qtyRequired || 0;
            const isOverAssigned = qtyAssigned > qtyRequired;

            return (
              <div
                key={index}
                style={{
                  display: "grid",
                  gridTemplateColumns: "80px 120px minmax(200px, 1fr) 100px 100px 100px 100px 100px",
                  padding: "10px 15px",
                  borderBottom: "1px solid #334155",
                  fontSize: "0.85rem",
                  color: "#f1f5f9",
                  backgroundColor: index % 2 === 0 ? "rgba(30, 41, 59, 0.5)" : "rgba(30, 41, 59, 0.3)",
                  alignItems: "center",
                  minWidth: "900px"
                }}
              >
                <div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {material.lineItemNo}
                </div>
                <div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {material.partNo}
                </div>
                
                {/* AÇIKLAMA SÜTUNU - ÇOK SATIR GÖSTERİMİ */}
                <div style={{
                  overflow: "hidden",
                  wordBreak: "break-word", // Uzun kelimeleri böler
                  lineHeight: "1.4",
                  maxHeight: "60px", // Maksimum yükseklik
                  overflowY: "auto", // Çok uzunsa dikey kaydırma
                  paddingRight: "5px",
                  fontSize: "0.8rem"
                }}>
                  {materialDesc || '-'}
                </div>
                
                <div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {material.operationNo || '-'}
                </div>
                
                <div>
                  {isEditing ? (
                    <input
                      type="number"
                      value={material.qtyPerAssembly || 1}
                      onChange={(e) => handleEditingMaterialChange(index, 'qtyPerAssembly', parseFloat(e.target.value) || 1)}
                      style={{
                        width: "100%",
                        padding: "6px 8px",
                        backgroundColor: "rgba(30, 41, 59, 0.8)",
                        border: "1px solid #475569",
                        borderRadius: "4px",
                        color: "#f1f5f9",
                        fontSize: "0.85rem"
                      }}
                      min="0"
                      step="0.01"
                    />
                  ) : (
                    (material.qtyPerAssembly || 1).toFixed(2)
                  )}
                </div>
                <div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {qtyRequired.toFixed(2)}
                </div>
                <div>
                  {isEditing ? (
                    <>
                      <input
                        type="number"
                        value={qtyAssigned}
                        onChange={(e) => handleEditingMaterialChange(index, 'qtyAssigned', parseFloat(e.target.value) || 0)}
                        style={{
                          width: "100%",
                          padding: "6px 8px",
                          backgroundColor: "rgba(30, 41, 59, 0.8)",
                          border: isOverAssigned ? "1px solid #ef4444" : "1px solid #10b981",
                          borderRadius: "4px",
                          color: isOverAssigned ? "#ef4444" : "#f1f5f9",
                          fontSize: "0.85rem"
                        }}
                        min="0"
                        max={qtyRequired}
                        step="0.01"
                        title={`Maksimum rezerve edilebilir miktar: ${qtyRequired}`}
                      />
                      {isOverAssigned && (
                        <div style={{
                          fontSize: "0.7rem",
                          color: "#ef4444",
                          marginTop: "2px"
                        }}>
                          Maks: {qtyRequired.toFixed(2)}
                        </div>
                      )}
                    </>
                  ) : (
                    <>
                      <div style={{
                        color: isOverAssigned ? "#ef4444" : "#f1f5f9",
                        fontWeight: isOverAssigned ? "bold" : "normal"
                      }}>
                        {qtyAssigned.toFixed(2)}
                      </div>
                      {isOverAssigned && (
                        <div style={{
                          fontSize: "0.7rem",
                          color: "#ef4444",
                          marginTop: "2px"
                        }}>
                          (Gerekli: {qtyRequired.toFixed(2)})
                        </div>
                      )}
                    </>
                  )}
                </div>
                
                <div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {(material.qtyIssued || 0).toFixed(2)}
                </div>
                
                <div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {qtyRequired.toFixed(2)}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    ) : (
      <div style={{ 
        textAlign: "center", 
        padding: "40px", 
        color: "#94a3b8"
      }}>
        Malzeme bulunamadı
      </div>
    )}
  </div>
)}

              {activeTab === "Notlar" && (
                <div>
                  {isEditing ? (
                    <textarea
                      value={editingOrder.noteText || ''}
                      onChange={(e) => handleEditingOrderChange('noteText', e.target.value)}
                      rows={5}
                      style={{
                        width: "100%",
                        padding: "12px 15px",
                        backgroundColor: "rgba(30, 41, 59, 0.8)",
                        border: "1px solid #8b5cf6",
                        borderRadius: "8px",
                        color: "#f1f5f9",
                        fontSize: "0.9rem",
                        resize: "vertical"
                      }}
                      placeholder="İş emri ile ilgili notlar..."
                    />
                  ) : (
                    <div style={{
                      padding: "15px",
                      backgroundColor: "rgba(30, 41, 59, 0.5)",
                      borderRadius: "8px",
                      color: "#f1f5f9",
                      minHeight: "100px"
                    }}>
                      {editingOrder.noteText || "Not yok"}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}