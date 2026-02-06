// src/modules/workshop/WorkshopStation.tsx

import { useState, useEffect, useCallback } from "react";
import SearchList from "./../../components/SearchList";
import { ChevronRightIcon } from "@heroicons/react/24/outline";
import type { ShopOrder, ShopMaterialAlloc } from "./../../types/shopOrder.types";
import { ShopOrderService, ShopMaterialService } from "../../services/shopOrder.service";

// Malzeme tüketim satırı interface'i
interface MaterialConsumption extends ShopMaterialAlloc {
  consumeQty: number; // Kullanıcının gireceği tüketim miktarı
  isValid: boolean;   // Validasyon durumu
  errorMessage?: string; // Hata mesajı
}

export default function WorkshopStation() {
  // State tanımlamaları
  const [selectedOrder, setSelectedOrder] = useState<ShopOrder | null>(null);
  const [startedOrders, setStartedOrders] = useState<ShopOrder[]>([]);
  const [materials, setMaterials] = useState<MaterialConsumption[]>([]);
  const [isSearchListVisible, setIsSearchListVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [allConsumptionsComplete, setAllConsumptionsComplete] = useState(false);
  const [isClosingOrder, setIsClosingOrder] = useState(false);

  // Sadece Started durumundaki iş emirlerini yükle
  useEffect(() => {
    fetchStartedOrders();
  }, []);

  // Seçilen iş emrinin malzemelerini yükle ve tüketim durumunu kontrol et
  useEffect(() => {
    if (selectedOrder) {
      fetchMaterials(selectedOrder.contract, selectedOrder.orderNo);
    } else {
      setMaterials([]);
      setAllConsumptionsComplete(false);
    }
  }, [selectedOrder]);

  // Started durumundaki iş emirlerini getir
  const fetchStartedOrders = async () => {
    try {
      setLoading(true);
      const allOrders = await ShopOrderService.getAllOrders({ pageSize: 1000 });
      
      // Sadece Started durumundaki emirleri filtrele
      const started = allOrders.filter(order => order.rowstate === 'Started' || order.rowstate === 'Released');
      setStartedOrders(started);
      setError(null);
    } catch (err) {
      console.error("İş emirleri yüklenemedi:", err);
      setError(err instanceof Error ? err.message : "Bilinmeyen hata");
      setStartedOrders([]);
    } finally {
      setLoading(false);
    }
  };

  // Malzemeleri getir ve tüketim alanlarını hazırla
  const fetchMaterials = async (contract: string, orderNo: string) => {
    try {
      const data = await ShopMaterialService.getMaterialsByOrder(contract, orderNo);
      
      // Her malzemeye tüketim miktarı ve validasyon ekle
      const materialsWithConsumption: MaterialConsumption[] = data.map(material => ({
        ...material,
        consumeQty: 0,
        isValid: true
      }));
      
      setMaterials(materialsWithConsumption);
      
      // Tüm tüketimlerin tamamlanıp tamamlanmadığını kontrol et
      checkAllConsumptionsComplete(data);
      
    } catch (err) {
      console.error("Malzemeler yüklenemedi:", err);
      setMaterials([]);
      setAllConsumptionsComplete(false);
    }
  };

  // Tüm tüketimlerin tamamlanıp tamamlanmadığını kontrol et
  const checkAllConsumptionsComplete = (materialsData: ShopMaterialAlloc[]) => {
    const allComplete = materialsData.every(material => {
      const qtyIssued = material.qtyIssued || 0;
      const qtyRequired = material.qtyRequired || 0;
      return qtyIssued >= qtyRequired;
    });
    
    setAllConsumptionsComplete(allComplete);
  };

  // SearchList için item formatter
  const searchListItems = startedOrders.map((order, index) => ({
    id: index + 1,
    code: order.orderNo,
    name: `${order.partNo} - ${order.contract}`,
    description: `İş Emri: ${order.orderNo} | Malzeme: ${order.partNo} | Üretilecek: ${order.revisedQtyDue || 0} | Durum: Started`,
    originalData: order
  }));

  const handleOrderSelect = (item: any) => {
    if (item.originalData) {
      setSelectedOrder(item.originalData);
    }
  };

  const handleToggleSearchList = useCallback(() => {
    setIsSearchListVisible(!isSearchListVisible);
  }, [isSearchListVisible]);

  // Tüketim miktarı değişikliği ve validasyon
  const handleConsumeQtyChange = (index: number, value: string) => {
    const qty = parseFloat(value) || 0;
    const material = materials[index];
    
    let isValid = true;
    let errorMessage: string | undefined;

    // Validasyonlar
    if (qty < 0) {
      isValid = false;
      errorMessage = "Negatif değer girilemez";
    } else if (qty > (material.qtyRequired || 0)) {
      isValid = false;
      errorMessage = `Gerekli miktardan fazla olamaz (Max: ${material.qtyRequired})`;
    } else if ((material.qtyIssued || 0) + qty > (material.qtyRequired || 0)) {
      isValid = false;
      errorMessage = `Toplam çıkış miktarı gerekli miktarı aşamaz (Mevcut: ${material.qtyIssued}, Max: ${material.qtyRequired})`;
    }

    const updatedMaterials = [...materials];
    updatedMaterials[index] = {
      ...material,
      consumeQty: qty,
      isValid,
      errorMessage
    };
    
    setMaterials(updatedMaterials);
  };

  // Tüketim işlemini kaydet
  const handleSaveConsumption = async () => {
    if (!selectedOrder) return;

    // Tüketim yapılacak malzemeleri filtrele
    const materialsToConsume = materials.filter(m => m.consumeQty > 0);

    if (materialsToConsume.length === 0) {
      alert("Hiçbir malzeme için tüketim miktarı girilmedi!");
      return;
    }

    // Tüm tüketimlerin valid olduğunu kontrol et
    const hasInvalidItems = materialsToConsume.some(m => !m.isValid);
    if (hasInvalidItems) {
      alert("Hatalı tüketim miktarları var! Lütfen kontrol edin.");
      return;
    }

    try {
      setIsSaving(true);

      // Her malzeme için qty_issued'i güncelle
      for (const material of materialsToConsume) {
        const newQtyIssued = (material.qtyIssued || 0) + material.consumeQty;
        
        await ShopMaterialService.updateMaterial(
          material.contract,
          material.orderNo,
          material.lineItemNo,
          material.partNo,
          {
            qtyIssued: newQtyIssued,
            rowversion: material.rowversion
          }
        );
      }

      // Malzemeleri yeniden yükle
      await fetchMaterials(selectedOrder.contract, selectedOrder.orderNo);

      alert("Malzeme tüketimi başarıyla kaydedildi!");

    } catch (err) {
      console.error("Tüketim kaydetme hatası:", err);
      alert(`Hata: ${err instanceof Error ? err.message : "Bilinmeyen hata"}`);
    } finally {
      setIsSaving(false);
    }
  };

  // İş emrini kapat (Üretimi Tamamla)
  const handleCompleteProduction = async () => {
    if (!selectedOrder || !allConsumptionsComplete) return;
    
    if (!window.confirm(`${selectedOrder.orderNo} numaralı iş emrini tamamlamak ve kapatmak istediğinize emin misiniz?\n\nqty_complete = revised_qty_due (${selectedOrder.revisedQtyDue})\nrowstate = Closed`)) {
      return;
    }

    try {
      setIsClosingOrder(true);
      
      // İş emrini kapat
      const updatedOrder = await ShopOrderService.updateOrder(
        selectedOrder.contract,
        selectedOrder.orderNo,
        selectedOrder.orderCode,
        selectedOrder.partNo,
        {
          qtyComplete: selectedOrder.revisedQtyDue || 0, // qty_complete = revised_qty_due
          rowstate: "Closed", // rowstate = Closed
          rowversion: selectedOrder.rowversion
        }
      );

      // İş emirlerini yenile
      await fetchStartedOrders();
      
      // Seçili emri kaldır
      setSelectedOrder(null);
      setMaterials([]);
      setAllConsumptionsComplete(false);
      
      alert(`Üretim tamamlandı!\nİş emri kapatıldı: ${updatedOrder.orderNo}\nqty_complete = ${updatedOrder.qtyComplete}\nrowstate = ${updatedOrder.rowstate}`);
      
    } catch (err) {
      console.error("İş emri kapatma hatası:", err);
      alert(`Hata: ${err instanceof Error ? err.message : "Bilinmeyen hata"}`);
    } finally {
      setIsClosingOrder(false);
    }
  };

  // Tüketim formunu sıfırla
  const handleResetConsumption = () => {
    const resetMaterials = materials.map(m => ({
      ...m,
      consumeQty: 0,
      isValid: true,
      errorMessage: undefined
    }));
    setMaterials(resetMaterials);
  };

  // Progress hesaplama
  const calculateProgress = (material: MaterialConsumption): number => {
    const qtyRequired = material.qtyRequired || 0;
    const qtyIssued = material.qtyIssued || 0;
    
    if (qtyRequired === 0) return 0;
    return Math.min((qtyIssued / qtyRequired) * 100, 100);
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
          title="Started İş Emirleri"
          items={searchListItems}
          onSelect={handleOrderSelect}
          onToggle={handleToggleSearchList}
          searchFields={["code", "name", "description"]}
          displayFields={["code", "name"]}
          icon="fas fa-tools"
        />
      )}

      {/* Minimize edilmiş SearchList */}
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

      {/* Ana İçerik */}
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
        {/* Header Card */}
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
                backgroundColor: "#f59e0b",
                color: "white",
                width: "36px",
                height: "36px",
                borderRadius: "8px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.1rem"
              }}>
                <i className="fas fa-tools"></i>
              </div>
              <div>
                <h2 style={{ margin: 0, color: "#f1f5f9", fontSize: "1.3rem" }}>Atölye Tezgahı</h2>
                <p style={{ margin: "4px 0 0 0", color: "#94a3b8", fontSize: "0.85rem" }}>
                  Workshop Material Consumption
                </p>
              </div>
            </div>
            
            <button
              onClick={handleToggleSearchList}
              style={{
                background: isSearchListVisible ? "#334155" : "#f59e0b",
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
              <span>{isSearchListVisible ? "Listeyi Gizle" : "İş Emri Seç"}</span>
            </button>
          </div>
          
          <div style={{
            color: "#94a3b8",
            padding: "12px",
            backgroundColor: "rgba(245, 158, 11, 0.1)",
            borderRadius: "6px",
            borderLeft: "3px solid #f59e0b",
            fontSize: "0.85rem"
          }}>
            {loading ? (
              <span>
                <i className="fas fa-spinner fa-spin" style={{ marginRight: "8px" }}></i>
                Veriler yükleniyor...
              </span>
            ) : error ? (
              <span style={{ color: "#ef4444" }}>
                <i className="fas fa-exclamation-triangle" style={{ marginRight: "8px" }}></i>
                Hata: {error}
              </span>
            ) : selectedOrder ? (
              <div style={{ display: "flex", alignItems: "center", gap: "15px", flexWrap: "wrap" }}>
                <span>
                  <strong>İş Emri:</strong> {selectedOrder.orderNo}
                </span>
                <span>•</span>
                <span>
                  <strong>Malzeme:</strong> {selectedOrder.partNo}
                </span>
                <span>•</span>
                <span>
                  <strong>Üretilecek Miktar (revised_qty_due):</strong> {(selectedOrder.revisedQtyDue || 0).toFixed(2)}
                </span>
                <span>•</span>
                <span style={{
                  backgroundColor: "rgba(245, 158, 11, 0.2)",
                  color: "#f59e0b",
                  padding: "3px 8px",
                  borderRadius: "4px",
                  fontWeight: "500"
                }}>
                  <i className="fas fa-play-circle" style={{ marginRight: "5px" }}></i>
                  Started
                </span>
              </div>
            ) : (
              <span>
                <i className="fas fa-info-circle" style={{ marginRight: "8px" }}></i>
                Soldaki listeden Started durumundaki bir iş emri seçin.
              </span>
            )}
          </div>

          {/* Üretimi Tamamla Butonu */}
          {selectedOrder && allConsumptionsComplete && (
            <div style={{
              marginTop: "15px",
              paddingTop: "15px",
              borderTop: "1px solid #334155"
            }}>
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "12px",
                backgroundColor: "rgba(16, 185, 129, 0.1)",
                borderRadius: "6px",
                border: "1px solid #10b981"
              }}>
                <div>
                  <div style={{ 
                    display: "flex", 
                    alignItems: "center", 
                    gap: "8px",
                    color: "#10b981",
                    marginBottom: "5px"
                  }}>
                    <i className="fas fa-check-circle"></i>
                    <strong>Tüm tüketimler tamamlandı!</strong>
                  </div>
                  <div style={{ fontSize: "0.85rem", color: "#94a3b8" }}>
                    İş emrini kapatmak için "Üretimi Tamamla" butonuna tıklayın.
                  </div>
                </div>
                
                <button
                  onClick={handleCompleteProduction}
                  disabled={isClosingOrder}
                  style={{
                    background: isClosingOrder 
                      ? "#f59e0b" 
                      : "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                    padding: "10px 20px",
                    fontSize: "0.9rem",
                    cursor: isClosingOrder ? "not-allowed" : "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    opacity: isClosingOrder ? 0.6 : 1
                  }}
                >
                  {isClosingOrder ? (
                    <>
                      <i className="fas fa-spinner fa-spin"></i>
                      <span>Kapatılıyor...</span>
                    </>
                  ) : (
                    <>
                      <i className="fas fa-check-double"></i>
                      <span>Üretimi Tamamla ve Kapat</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Seçili İş Emri Detayları */}
        {selectedOrder && (
          <>
            {/* Malzeme Tüketim Tablosu */}
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
                marginBottom: "15px",
                paddingBottom: "15px",
                borderBottom: "1px solid #334155"
              }}>
                <h3 style={{ 
                  color: "#f1f5f9", 
                  fontSize: "1rem", 
                  margin: 0,
                  display: "flex",
                  alignItems: "center",
                  gap: "8px"
                }}>
                  <i className="fas fa-boxes" style={{ color: "#f59e0b" }}></i>
                  Malzeme Tüketimi
                </h3>
                
                <div style={{
                  display: "flex",
                  gap: "10px"
                }}>
                  <button
                    onClick={handleResetConsumption}
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
                    <i className="fas fa-undo"></i>
                    <span>Sıfırla</span>
                  </button>
                  
                  <button
                    onClick={handleSaveConsumption}
                    disabled={isSaving || materials.every(m => m.consumeQty === 0)}
                    style={{
                      background: isSaving 
                        ? "#f59e0b" 
                        : materials.every(m => m.consumeQty === 0)
                        ? "#475569"
                        : "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
                      color: "white",
                      border: "none",
                      borderRadius: "6px",
                      padding: "8px 15px",
                      fontSize: "0.85rem",
                      cursor: isSaving || materials.every(m => m.consumeQty === 0) 
                        ? "not-allowed" 
                        : "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      opacity: isSaving || materials.every(m => m.consumeQty === 0) ? 0.6 : 1
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
                        <span>Tüketimi Kaydet</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Bilgi Kutusu */}
              <div style={{
                backgroundColor: "rgba(59, 130, 246, 0.1)",
                borderLeft: "3px solid #3b82f6",
                padding: "12px",
                borderRadius: "6px",
                marginBottom: "15px",
                fontSize: "0.85rem",
                color: "#f1f5f9"
              }}>
                <div style={{ display: "flex", alignItems: "center", marginBottom: "8px" }}>
                  <i className="fas fa-info-circle" style={{ color: "#3b82f6", marginRight: "8px" }}></i>
                  <strong>Kullanım Talimatları:</strong>
                </div>
                <ul style={{ margin: "5px 0", paddingLeft: "30px", color: "#94a3b8" }}>
                  <li>Her malzeme için tüketim miktarını girin</li>
                  <li>Tüketim miktarı gerekli miktarı geçemez</li>
                  <li>Tüm malzemelerin çıkışı tamamlandığında "Üretimi Tamamla" butonu aktif olur</li>
                  <li>"Üretimi Tamamla" butonu: qty_complete = revised_qty_due ve rowstate = Closed</li>
                </ul>
              </div>

              {/* Malzeme Tablosu */}
              {materials.length > 0 ? (
                <div style={{
                  backgroundColor: "rgba(30, 41, 59, 0.3)",
                  borderRadius: "8px",
                  overflow: "hidden",
                  border: "1px solid #334155"
                }}>
                  {/* Grid Header */}
                  <div style={{
                    display: "grid",
                    gridTemplateColumns: "60px 180px 100px 120px 120px 120px 120px 150px",
                    backgroundColor: "#334155",
                    padding: "12px 15px",
                    borderBottom: "1px solid #475569",
                    fontSize: "0.8rem",
                    fontWeight: "600",
                    color: "#f1f5f9"
                  }}>
                    <div>Satır</div>
                    <div>Malzeme No</div>
                    <div>Operasyon</div>
                    <div>Montaj Başına</div>
                    <div>Rezerve</div>
                    <div>Çıkış Yapılan</div>
                    <div>Gerekli</div>
                    <div>Tüketim Miktarı</div>
                  </div>

                  {/* Grid Body */}
                  {materials.map((material, index) => {
                    const progress = calculateProgress(material);
                    const isCompleted = (material.qtyIssued || 0) >= (material.qtyRequired || 0);
                    
                    return (
                      <div
                        key={index}
                        style={{
                          display: "grid",
                          gridTemplateColumns: "60px 180px 100px 120px 120px 120px 120px 150px",
                          padding: "10px 15px",
                          borderBottom: "1px solid #334155",
                          fontSize: "0.85rem",
                          color: "#f1f5f9",
                          backgroundColor: index % 2 === 0 
                            ? "rgba(30, 41, 59, 0.5)" 
                            : "rgba(30, 41, 59, 0.3)",
                          alignItems: "center"
                        }}
                      >
                        {/* Satır No */}
                        <div>{material.lineItemNo}</div>
                        
                        {/* Malzeme No */}
                        <div style={{
                          fontWeight: "600",
                          color: isCompleted ? "#10b981" : "#f1f5f9"
                        }}>
                          {material.partNo}
                          {isCompleted && (
                            <i 
                              className="fas fa-check-circle" 
                              style={{ 
                                marginLeft: "5px", 
                                color: "#10b981",
                                fontSize: "0.7rem"
                              }}
                            ></i>
                          )}
                        </div>
                        
                        {/* Operasyon */}
                        <div style={{ color: "#94a3b8" }}>
                          {material.operationNo || '-'}
                        </div>
                        
                        {/* Montaj Başına */}
                        <div style={{ 
                          textAlign: "right",
                          color: "#94a3b8"
                        }}>
                          {(material.qtyPerAssembly || 0).toFixed(2)}
                        </div>
                        
                        {/* Rezerve */}
                        <div style={{ 
                          textAlign: "right",
                          color: "#38bdf8"
                        }}>
                          {(material.qtyAssigned || 0).toFixed(2)}
                        </div>
                        
                        {/* Çıkış Yapılan */}
                        <div>
                          <div style={{ 
                            textAlign: "right",
                            color: isCompleted ? "#10b981" : "#f59e0b",
                            fontWeight: "600",
                            marginBottom: "4px"
                          }}>
                            {(material.qtyIssued || 0).toFixed(2)}
                          </div>
                          {/* Progress Bar */}
                          <div style={{
                            width: "100%",
                            height: "4px",
                            backgroundColor: "rgba(30, 41, 59, 0.8)",
                            borderRadius: "2px",
                            overflow: "hidden"
                          }}>
                            <div style={{
                              width: `${progress}%`,
                              height: "100%",
                              backgroundColor: isCompleted ? "#10b981" : "#f59e0b",
                              transition: "width 0.3s ease"
                            }}></div>
                          </div>
                        </div>
                        
                        {/* Gerekli */}
                        <div style={{ 
                          textAlign: "right",
                          color: "#10b981",
                          fontWeight: "600"
                        }}>
                          {(material.qtyRequired || 0).toFixed(2)}
                        </div>
                        
                        {/* Tüketim Miktarı Input */}
                        <div>
                          <input
                            type="number"
                            value={material.consumeQty || ''}
                            onChange={(e) => handleConsumeQtyChange(index, e.target.value)}
                            disabled={isCompleted || isSaving}
                            style={{
                              width: "100%",
                              padding: "6px 8px",
                              backgroundColor: isCompleted 
                                ? "rgba(30, 41, 59, 0.5)" 
                                : material.isValid
                                ? "rgba(30, 41, 59, 0.8)"
                                : "rgba(239, 68, 68, 0.2)",
                              border: `1px solid ${
                                isCompleted 
                                  ? "#475569"
                                  : material.isValid 
                                  ? "#f59e0b" 
                                  : "#ef4444"
                              }`,
                              borderRadius: "4px",
                              color: isCompleted ? "#94a3b8" : "#f1f5f9",
                              fontSize: "0.85rem",
                              cursor: isCompleted ? "not-allowed" : "text"
                            }}
                            min="0"
                            step="0.01"
                            placeholder={isCompleted ? "Tamamlandı" : "0.00"}
                          />
                          {!material.isValid && material.errorMessage && (
                            <div style={{
                              fontSize: "0.7rem",
                              color: "#ef4444",
                              marginTop: "3px",
                              display: "flex",
                              alignItems: "center",
                              gap: "3px"
                            }}>
                              <i className="fas fa-exclamation-triangle"></i>
                              <span>{material.errorMessage}</span>
                            </div>
                          )}
                          {isCompleted && (
                            <div style={{
                              fontSize: "0.7rem",
                              color: "#10b981",
                              marginTop: "3px",
                              display: "flex",
                              alignItems: "center",
                              gap: "3px"
                            }}>
                              <i className="fas fa-check-circle"></i>
                              <span>Tamamlandı</span>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div style={{
                  textAlign: "center",
                  padding: "40px",
                  color: "#94a3b8",
                  backgroundColor: "rgba(30, 41, 59, 0.3)",
                  borderRadius: "8px",
                  border: "1px dashed #334155"
                }}>
                  <i className="fas fa-box-open" style={{ fontSize: "2rem", marginBottom: "10px" }}></i>
                  <p>Bu iş emrine ait malzeme tahsisi bulunamadı</p>
                </div>
              )}

              {/* İlerleme Özeti */}
              {materials.length > 0 && (
                <div style={{
                  marginTop: "20px",
                  padding: "15px",
                  backgroundColor: "rgba(30, 41, 59, 0.5)",
                  borderRadius: "8px",
                  border: "1px solid #334155"
                }}>
                  <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                    gap: "15px"
                  }}>
                    <div>
                      <div style={{ fontSize: "0.75rem", color: "#94a3b8", marginBottom: "5px" }}>
                        Toplam Malzeme
                      </div>
                      <div style={{ fontSize: "1.2rem", color: "#f1f5f9", fontWeight: "600" }}>
                        {materials.length}
                      </div>
                    </div>
                    
                    <div>
                      <div style={{ fontSize: "0.75rem", color: "#94a3b8", marginBottom: "5px" }}>
                        Tamamlanan
                      </div>
                      <div style={{ fontSize: "1.2rem", color: "#10b981", fontWeight: "600" }}>
                        {materials.filter(m => (m.qtyIssued || 0) >= (m.qtyRequired || 0)).length}
                      </div>
                    </div>
                    
                    <div>
                      <div style={{ fontSize: "0.75rem", color: "#94a3b8", marginBottom: "5px" }}>
                        Bekleyen
                      </div>
                      <div style={{ fontSize: "1.2rem", color: "#f59e0b", fontWeight: "600" }}>
                        {materials.filter(m => (m.qtyIssued || 0) < (m.qtyRequired || 0)).length}
                      </div>
                    </div>
                    
                    <div>
                      <div style={{ fontSize: "0.75rem", color: "#94a3b8", marginBottom: "5px" }}>
                        Genel İlerleme
                      </div>
                      <div style={{ 
                        fontSize: "1.2rem", 
                        color: allConsumptionsComplete
                          ? "#10b981"
                          : "#38bdf8", 
                        fontWeight: "600" 
                      }}>
                        {materials.length > 0 
                          ? Math.round(
                              (materials.filter(m => (m.qtyIssued || 0) >= (m.qtyRequired || 0)).length / 
                              materials.length) * 100
                            ) 
                          : 0}%
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        {/* Boş Durum */}
        {!selectedOrder && !loading && (
          <div style={{
            background: "#1e293b",
            borderRadius: "12px",
            padding: "60px 20px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
            border: "1px solid #334155",
            textAlign: "center"
          }}>
            <div style={{
              display: "inline-block",
              padding: "20px",
              backgroundColor: "rgba(245, 158, 11, 0.1)",
              borderRadius: "50%",
              marginBottom: "20px"
            }}>
              <i 
                className="fas fa-tools" 
                style={{ 
                  fontSize: "3rem", 
                  color: "#f59e0b" 
                }}
              ></i>
            </div>
            <h3 style={{ 
              color: "#f1f5f9", 
              fontSize: "1.2rem",
              marginBottom: "10px" 
            }}>
              Started İş Emri Seçilmedi
            </h3>
            <p style={{ 
              color: "#94a3b8",
              fontSize: "0.9rem",
              marginBottom: "20px"
            }}>
              Malzeme tüketimi yapmak için soldaki listeden Started durumunda bir iş emri seçin.
              <br />
              <small style={{ color: "#64748b" }}>
                (Not: İş emirleri Shop Orders ekranında "Started" durumuna getirilmelidir)
              </small>
            </p>
            <button
              onClick={() => setIsSearchListVisible(true)}
              style={{
                background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
                color: "white",
                border: "none",
                borderRadius: "6px",
                padding: "10px 20px",
                fontSize: "0.9rem",
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "8px"
              }}
            >
              <i className="fas fa-list"></i>
              <span>Started İş Emirlerini Göster</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}