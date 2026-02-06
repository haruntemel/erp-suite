// src/modules/production/ShopOrders.tsx

import { useState, useEffect, useCallback } from "react";
import SearchList from "./../../components/SearchList";
import { ChevronRightIcon } from "@heroicons/react/24/outline";
import type { ShopOrder, ShopMaterialAlloc } from "./../../types/shopOrder.types";
import { ShopOrderService, ShopMaterialService } from "../../services/shopOrder.service";

// YENİ: Ürün Ağacı Interface'leri (ürün ağacı ekranından alınmıştır)
interface ProdStructureHead {
  id: number;
  Contract: string;
  PartNo: string;
  EngChgLevel: string;
  BomTypeDb: string;
  NoteText?: string;
  EffPhaseInDate?: string;
  EffPhaseOutDate?: string;
  CreateDate: string;
  Rowstate?: string;
  CreatedBy: string;
  Rowversion: number;
  Rowkey: string;
}

interface ProdStructure {
  id: number;
  Contract: string;
  PartNo: string;
  EngChgLevel: string;
  BomTypeDb: string;
  AlternativeNo: string;
  LineItemNo: number;
  LineSequence: number;
  OperationNo: number;
  NoteText?: string;
  Source?: string;
  CreateDate: string;
  LastActivityDate?: string;
  ComponentPart?: string;
  Rowstate?: string;
  CreatedBy: string;
  Rowversion: number;
  Rowkey: string;
  RoutingOperationNo?: number;
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

// Yeni iş emri oluşturma için interface
interface NewShopOrderDto {
  contract: string;
  orderNo: string;
  orderCode: string;
  partNo: string;
  revisedStartDate?: string;
  revisedDueDate?: string;
  needDate?: string;
  revisedQtyDue?: number;
  qtyComplete?: number;
  noteText?: string;
  customerOrderNo?: string;
  rowstate: string;
  createdBy: string;
  rowversion: number;
  rowkey: string;
}

// Yeni malzeme tahsisi interface'i
interface NewShopMaterialDto {
  contract: string;
  orderNo: string;
  lineItemNo: number;
  partNo: string;
  operationNo?: number;
  qtyAssigned?: number;
  qtyIssued?: number;
  qtyPerAssembly?: number;
  qtyRequired?: number;
  noteText?: string;
  projectId?: string;
  rowstate?: string;

}

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

  // YENİ: Ürün Ağacı State'leri
  const [showProdStructureSearch, setShowProdStructureSearch] = useState(false);
  const [prodStructureHeads, setProdStructureHeads] = useState<ProdStructureHead[]>([]);
  const [prodStructures, setProdStructures] = useState<ProdStructure[]>([]);
  const [prodStructureLoading, setProdStructureLoading] = useState(false);

  // Yeni iş emri state'leri
  const [newOrderData, setNewOrderData] = useState<NewShopOrderDto>({
    contract: "01",
    orderNo: `WO${String(Math.floor(Math.random() * 10000)).padStart(5, '0')}`,
    orderCode: "01",
    partNo: "",
    revisedStartDate: new Date().toISOString().split('T')[0],
    revisedDueDate: new Date().toISOString().split('T')[0],
    revisedQtyDue: 1,
    qtyComplete: 0,
    rowstate: "Released",
    createdBy: "admin",
    rowversion: 1,
    rowkey: `new-order-${Date.now()}`
  });

  const [newOrderMaterials, setNewOrderMaterials] = useState<NewShopMaterialDto[]>([]);

  // Verileri yükle
  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    if (selectedOrder && !isEditing) {
      fetchMaterials(selectedOrder.contract, selectedOrder.orderNo);
      setEditingOrder(selectedOrder);
    } else {
      setMaterials([]);
      setEditingMaterials([]);
      setEditingOrder(null);
    }
  }, [selectedOrder, isEditing]);

  // Yeni sipariş orderNo değiştiğinde malzemeleri güncelle
  useEffect(() => {
    const updatedMaterials = newOrderMaterials.map(material => ({
      ...material,
      orderNo: newOrderData.orderNo
    }));
    setNewOrderMaterials(updatedMaterials);
  }, [newOrderData.orderNo]);

  // YENİ: Seçilen malzeme değiştiğinde ürün ağacını getir
  useEffect(() => {
    if (isCreatingNewOrder && newOrderData.partNo && newOrderData.contract) {
      fetchProdStructures(newOrderData.contract, newOrderData.partNo);
    }
  }, [isCreatingNewOrder, newOrderData.partNo, newOrderData.contract]);
// YENİ: Seçilen malzeme değiştiğinde ürün ağacını getir
useEffect(() => {
  console.log("=== useEffect tetiklendi ===");
  console.log("isCreatingNewOrder:", isCreatingNewOrder);
  console.log("newOrderData.partNo:", newOrderData.partNo);
  console.log("newOrderData.contract:", newOrderData.contract);
  
  if (isCreatingNewOrder && newOrderData.partNo && newOrderData.contract) {
    console.log("fetchProdStructures çağrılacak...");
    fetchProdStructures(newOrderData.contract, newOrderData.partNo);
  } else {
    console.log("fetchProdStructures çağrılmayacak, koşullar sağlanmıyor");
  }
}, [isCreatingNewOrder, newOrderData.partNo, newOrderData.contract]);
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

  // YENİ: Ürün Ağacı Başlıklarını Getir
  const fetchProdStructureHeads = async (searchTerm: string = "") => {
    try {
      setProdStructureLoading(true);
      let url = "/api/prodstructurehead";
      
      if (searchTerm) {
        url += `/search?partNo=${encodeURIComponent(searchTerm)}`;
      }
      
      const response = await fetch(url);
      
      if (response.ok) {
        const data = await response.json();
        
        // API'den gelen veriyi formatla
        const formattedHeads: ProdStructureHead[] = data.map((apiHead: any, index: number) => ({
          id: index + 1,
          Contract: apiHead.contract || apiHead.Contract || "",
          PartNo: apiHead.partNo || apiHead.PartNo || "",
          EngChgLevel: apiHead.engChgLevel || apiHead.EngChgLevel || "A",
          BomTypeDb: apiHead.bomTypeDb || apiHead.BomTypeDb || "STANDARD",
          NoteText: apiHead.noteText || apiHead.NoteText || undefined,
          EffPhaseInDate: apiHead.effPhaseInDate || apiHead.EffPhaseInDate || undefined,
          EffPhaseOutDate: apiHead.effPhaseOutDate || apiHead.EffPhaseOutDate || undefined,
          CreateDate: apiHead.createDate || apiHead.CreateDate || new Date().toISOString().split('T')[0],
          Rowstate: apiHead.rowstate || apiHead.Rowstate || "ACTIVE",
          CreatedBy: apiHead.createdBy || apiHead.CreatedBy || "admin",
          Rowversion: apiHead.rowversion || apiHead.Rowversion || 1,
          Rowkey: apiHead.rowkey || apiHead.Rowkey || `head-${Date.now()}-${index}`
        }));
        
        setProdStructureHeads(formattedHeads);
      } else {
        console.error("Ürün ağacı başlıkları getirilemedi:", await response.text());
        setProdStructureHeads([]);
      }
    } catch (err) {
      console.error("Ürün ağacı başlıkları getirilirken hata:", err);
      setProdStructureHeads([]);
    } finally {
      setProdStructureLoading(false);
    }
  };

 // YENİ: Basitleştirilmiş ürün ağacı getirme fonksiyonu
const fetchProdStructures = async (contract: string, partNo: string) => {
  try {
    console.log("=== fetchProdStructures BAŞLADI ===");
    console.log("Parametreler: contract=", contract, "partNo=", partNo);
    
    setProdStructureLoading(true);
    
    // Kontrat ve partNo'yu temizle
    const cleanContract = contract.trim();
    const cleanPartNo = partNo.trim();
    
    console.log("Temizlenmiş: contract=", cleanContract, "partNo=", cleanPartNo);
    
    // DEBUG: Hangi URL'ye istek yapacağımızı göster
    const testUrl = `/api/prodstructure/head/${cleanContract}/${cleanPartNo}/A/STANDARD/000`;
    console.log("Test URL:", testUrl);
    
    // ÖNCE: Direkt test URL'sine istek yapalım
    console.log("Direkt test isteği yapılıyor...");
    const testResponse = await fetch(testUrl);
    console.log("Test response status:", testResponse.status);
    
    if (testResponse.ok) {
      const testData = await testResponse.json();
      console.log("Test data received:", testData);
      console.log("Number of structures:", testData.length);
      
      if (testData.length > 0) {
        const formattedStructures: ProdStructure[] = testData.map((apiLine: any, index: number) => ({
          id: index + 1,
          Contract: apiLine.contract || apiLine.Contract || cleanContract,
          PartNo: apiLine.partNo || apiLine.PartNo || cleanPartNo,
          EngChgLevel: apiLine.engChgLevel || apiLine.EngChgLevel || "A",
          BomTypeDb: apiLine.bomTypeDb || apiLine.BomTypeDb || "STANDARD",
          AlternativeNo: apiLine.alternativeNo || apiLine.AlternativeNo || "000",
          LineItemNo: apiLine.lineItemNo || apiLine.LineItemNo || 0,
          LineSequence: apiLine.lineSequence || apiLine.LineSequence || 0,
          OperationNo: apiLine.operationNo || apiLine.OperationNo || 0,
          NoteText: apiLine.noteText || apiLine.NoteText || undefined,
          Source: apiLine.source || apiLine.Source || undefined,
          CreateDate: apiLine.createDate || apiLine.CreateDate || new Date().toISOString().split('T')[0],
          LastActivityDate: apiLine.lastActivityDate || apiLine.LastActivityDate || undefined,
          ComponentPart: apiLine.componentPart || apiLine.ComponentPart || undefined,
          Rowstate: apiLine.rowstate || apiLine.Rowstate || "ACTIVE",
          CreatedBy: apiLine.createdBy || apiLine.CreatedBy || "admin",
          Rowversion: apiLine.rowversion || apiLine.Rowversion || 1,
          Rowkey: apiLine.rowkey || apiLine.Rowkey || `line-${Date.now()}-${index}`,
          RoutingOperationNo: apiLine.routingOperationNo || apiLine.RoutingOperationNo
        }));
        
        console.log("Formatted structures:", formattedStructures);
        setProdStructures(formattedStructures);
        
        // Ürün ağacı satırlarını malzeme tahsislerine çevir
        convertProdStructuresToMaterials(formattedStructures);
      } else {
        console.warn("Ürün ağacı satırı bulunamadı");
        setProdStructures([]);
        setNewOrderMaterials([]);
      }
    } else {
      const errorText = await testResponse.text();
      console.error("Test isteği başarısız:", errorText);
      
      // Alternatif: Başlıkları getirip deneyelim
      console.log("Alternatif yöntem deneniyor...");
      const headsUrl = `/api/prodstructurehead/search?partNo=${cleanPartNo}&contract=${cleanContract}`;
      console.log("Heads URL:", headsUrl);
      
      const headsResponse = await fetch(headsUrl);
      console.log("Heads response status:", headsResponse.status);
      
      if (headsResponse.ok) {
        const headsData = await headsResponse.json();
        console.log("Heads data:", headsData);
        
        if (headsData.Items && headsData.Items.length > 0) {
          const firstHead = headsData.Items[0];
          const engChgLevel = firstHead.engChgLevel || firstHead.EngChgLevel || "A";
          const bomTypeDb = firstHead.bomTypeDb || firstHead.BomTypeDb || "STANDARD";
          
          const finalUrl = `/api/prodstructure/head/${cleanContract}/${cleanPartNo}/${engChgLevel}/${bomTypeDb}/000`;
          console.log("Final URL:", finalUrl);
          
          const finalResponse = await fetch(finalUrl);
          console.log("Final response status:", finalResponse.status);
          
          if (finalResponse.ok) {
            const finalData = await finalResponse.json();
            console.log("Final data received:", finalData);
            // ... aynı formatlama işlemi
          }
        }
      }
    }
  } catch (err) {
    console.error("Ürün ağacı getirilirken hata:", err);
    setProdStructures([]);
    setNewOrderMaterials([]);
  } finally {
    console.log("=== fetchProdStructures BİTTİ ===");
    setProdStructureLoading(false);
  }
};
  // YENİ: Ürün Ağacı Satırlarını Malzeme Tahsislerine Çevir
  const convertProdStructuresToMaterials = (structures: ProdStructure[]) => {
    const materials: NewShopMaterialDto[] = structures
      .filter(structure => structure.ComponentPart && structure.ComponentPart.trim() !== "")
      .map((structure, index) => ({
        contract: newOrderData.contract,
        orderNo: newOrderData.orderNo,
        lineItemNo: index + 1,
        partNo: structure.ComponentPart || "",
        operationNo: structure.OperationNo || 10,
        qtyAssigned: 0,
        qtyIssued: 0,
        qtyPerAssembly: 1, // Varsayılan değer
        qtyRequired: (newOrderData.revisedQtyDue || 1) * 1, // Planlanan miktar * parça başına miktar
        rowstate: "Active"
      }));
    
    setNewOrderMaterials(materials);
  };

  // YENİ: Ürün Ağacı Başlığı Seçimi
const handleProdStructureSelect = (head: ProdStructureHead) => {
  console.log("=== handleProdStructureSelect ===");
  console.log("Seçilen ürün ağacı:", head);
  
  if (isCreatingNewOrder) {
    console.log("Yeni iş emri modunda, newOrderData güncelleniyor...");
    setNewOrderData({
      ...newOrderData,
      partNo: head.PartNo,
      contract: head.Contract
    });
    
    // Ürün ağacı satırlarını getir
    console.log("fetchProdStructures çağrılıyor...");
    fetchProdStructures(head.Contract, head.PartNo);
  } else if (isEditing && editingOrder) {
    console.log("Düzenleme modunda, editingOrder güncelleniyor...");
    setEditingOrder({
      ...editingOrder,
      partNo: head.PartNo,
      contract: head.Contract
    });
    
    // Düzenleme modunda ürün ağacı satırlarını getir
    fetchProdStructuresForEditing(head.Contract, head.PartNo);
  }
  
  setShowProdStructureSearch(false);
};

  // YENİ: Düzenleme modu için ürün ağacı satırlarını getir
  const fetchProdStructuresForEditing = async (contract: string, partNo: string) => {
    try {
      setProdStructureLoading(true);
      
      const headsResponse = await fetch(`/api/prodstructurehead/search?partNo=${partNo}&contract=${contract}`);
      
      if (headsResponse.ok) {
        const headsData = await headsResponse.json();
        
        if (headsData.length > 0) {
          const firstHead = headsData[0];
          const engChgLevel = firstHead.engChgLevel || firstHead.EngChgLevel || "A";
          const bomTypeDb = firstHead.bomTypeDb || firstHead.BomTypeDb || "STANDARD";
          
          const structuresResponse = await fetch(
            `/api/prodstructure/head/${contract}/${partNo}/${engChgLevel}/${bomTypeDb}/000`
          );
          
          if (structuresResponse.ok) {
            const structuresData = await structuresResponse.json();
            
            const formattedStructures: ProdStructure[] = structuresData.map((apiLine: any, index: number) => ({
              id: index + 1,
              Contract: apiLine.contract || apiLine.Contract || "",
              PartNo: apiLine.partNo || apiLine.PartNo || "",
              EngChgLevel: apiLine.engChgLevel || apiLine.EngChgLevel || "A",
              BomTypeDb: apiLine.bomTypeDb || apiLine.BomTypeDb || "STANDARD",
              AlternativeNo: apiLine.alternativeNo || apiLine.AlternativeNo || "000",
              LineItemNo: apiLine.lineItemNo || apiLine.LineItemNo || 0,
              LineSequence: apiLine.lineSequence || apiLine.LineSequence || 0,
              OperationNo: apiLine.operationNo || apiLine.OperationNo || 0,
              NoteText: apiLine.noteText || apiLine.NoteText || undefined,
              Source: apiLine.source || apiLine.Source || undefined,
              CreateDate: apiLine.createDate || apiLine.CreateDate || new Date().toISOString().split('T')[0],
              LastActivityDate: apiLine.lastActivityDate || apiLine.LastActivityDate || undefined,
              ComponentPart: apiLine.componentPart || apiLine.ComponentPart || undefined,
              Rowstate: apiLine.rowstate || apiLine.Rowstate || "ACTIVE",
              CreatedBy: apiLine.createdBy || apiLine.CreatedBy || "admin",
              Rowversion: apiLine.rowversion || apiLine.Rowversion || 1,
              Rowkey: apiLine.rowkey || apiLine.Rowkey || `line-${Date.now()}-${index}`,
              RoutingOperationNo: apiLine.routingOperationNo || apiLine.RoutingOperationNo
            }));
            
            setProdStructures(formattedStructures);
            
            // Mevcut malzeme tahsislerini güncelle veya yeniden oluştur
            updateMaterialsFromProdStructures(formattedStructures);
          }
        }
      }
    } catch (err) {
      console.error("Düzenleme için ürün ağacı getirilirken hata:", err);
    } finally {
      setProdStructureLoading(false);
    }
  };

  // YENİ: Mevcut malzeme tahsislerini ürün ağacından güncelle
  const updateMaterialsFromProdStructures = (structures: ProdStructure[]) => {
    const componentStructures = structures.filter(structure => structure.ComponentPart && structure.ComponentPart.trim() !== "");
    
    const updatedMaterials: ShopMaterialAlloc[] = componentStructures.map((structure, index) => {
      // Mevcut malzeme varsa onu bul, yoksa yeni oluştur
      const existingMaterial = editingMaterials.find(m => m.partNo === structure.ComponentPart);
      
      if (existingMaterial) {
        return {
          ...existingMaterial,
          operationNo: structure.OperationNo || existingMaterial.operationNo,
          lineItemNo: index + 1
        };
      } else {
        return {
          contract: editingOrder?.contract || newOrderData.contract,
          orderNo: editingOrder?.orderNo || newOrderData.orderNo,
          lineItemNo: index + 1,
          partNo: structure.ComponentPart || "",
          operationNo: structure.OperationNo || 10,
          qtyAssigned: 0,
          qtyIssued: 0,
          qtyPerAssembly: 1,
          qtyRequired: (editingOrder?.revisedQtyDue || 1) * 1,
          rowstate: "Active",
          rowkey: `new-${Date.now()}-${index}`
        } as ShopMaterialAlloc;
      }
    });
    
    setEditingMaterials(updatedMaterials);
  };

  // YENİ: Ürün Ağacı Arama Modalını Aç
  const openProdStructureSearch = () => {
    setShowProdStructureSearch(true);
    fetchProdStructureHeads("");
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

  // Yeni sipariş form işlemleri
  const handleNewOrderDataChange = useCallback((field: keyof NewShopOrderDto, value: any) => {
    const updatedData = {
      ...newOrderData,
      [field]: value
    };
    
    setNewOrderData(updatedData);
    
    // Planlanan miktar değiştiğinde malzeme miktarlarını güncelle
    if (field === 'revisedQtyDue') {
      const updatedMaterials = newOrderMaterials.map(material => ({
        ...material,
        qtyRequired: (value || 1) * (material.qtyPerAssembly || 1)
      }));
      setNewOrderMaterials(updatedMaterials);
    }
  }, [newOrderData, newOrderMaterials]);

  const handleNewMaterialChange = useCallback((index: number, field: keyof NewShopMaterialDto, value: any) => {
    const updatedMaterials = [...newOrderMaterials];
    const updatedMaterial = {
      ...updatedMaterials[index],
      [field]: field.includes('qty') ? parseFloat(value) || 0 : value
    };
    
    updatedMaterials[index] = updatedMaterial;
    
    // qtyPerAssembly değiştiğinde qtyRequired'i güncelle
    if (field === 'qtyPerAssembly') {
      updatedMaterial.qtyRequired = (newOrderData.revisedQtyDue || 1) * (parseFloat(value) || 1);
    }
    
    setNewOrderMaterials(updatedMaterials);
  }, [newOrderMaterials, newOrderData.revisedQtyDue]);

  // YENİ: Yeni malzeme ekleme kaldırıldı (otomatik olarak ürün ağacından gelecek)

  const removeNewMaterial = useCallback((index: number) => {
    if (newOrderMaterials.length > 1) {
      const updatedMaterials = newOrderMaterials.filter((_, i) => i !== index);
      const renumberedMaterials = updatedMaterials.map((material, idx) => ({
        ...material,
        lineItemNo: idx + 1
      }));
      setNewOrderMaterials(renumberedMaterials);
    }
  }, [newOrderMaterials]);

  const handleCreateNewOrder = async () => {
    if (!newOrderData.partNo || !newOrderData.orderNo || !newOrderData.contract) {
      alert("Lütfen zorunlu alanları doldurun (İş Emri No, Malzeme No, Kontrat)");
      return;
    }

    if (newOrderMaterials.length === 0) {
      alert("Ürün ağacında malzeme bulunamadı. Lütfen geçerli bir ürün ağacı seçin.");
      return;
    }

    setIsSaving(true);

    try {
      console.log("Yeni iş emri kaydediliyor:", newOrderData);

      // 1. Önce ana iş emrini kaydet
      const orderResponse = await ShopOrderService.createOrder(newOrderData);

      console.log("Ana iş emri başarıyla kaydedildi:", orderResponse);

      // 2. Malzemeleri kaydet
      const savedMaterials: any[] = [];
      let materialErrors: string[] = [];

      for (const [index, material] of newOrderMaterials.entries()) {
        try {
          if (!material.partNo) {
            console.warn(`Malzeme ${index + 1} için partNo girilmemiş, atlanıyor...`);
            continue;
          }

          const materialData = {
            ...material,
            orderNo: orderResponse.orderNo,
            contract: orderResponse.contract
          };

          console.log(`Malzeme ${index + 1} kaydediliyor:`, materialData);

          const materialResponse = await ShopMaterialService.createMaterial(materialData);
          savedMaterials.push(materialResponse);
          console.log(`Malzeme ${index + 1} başarıyla kaydedildi:`, materialResponse);
        } catch (materialErr) {
          console.error(`Malzeme ${index + 1} işlem hatası:`, materialErr);
          materialErrors.push(`Malzeme ${index + 1}: ${materialErr instanceof Error ? materialErr.message : "Bilinmeyen hata"}`);
        }
      }

      // 3. Sonuçları işle
      if (materialErrors.length > 0) {
        console.warn("Bazı malzemeler kaydedilemedi:", materialErrors);
        alert(`Ana iş emri kaydedildi ancak bazı malzemeler kaydedilemedi:\n${materialErrors.join('\n')}`);
      } else {
        console.log("Tüm malzemeler başarıyla kaydedildi:", savedMaterials.length);
      }

      // 4. Sipariş listesini yeniden yükle
      await fetchOrders();
      
      // 5. Yeni eklenen siparişi seç
      setSelectedOrder(orderResponse);
      setEditingOrder(orderResponse);
      setIsCreatingNewOrder(false);
      
      // 6. Formu sıfırla
      resetForm();
      
      alert(`İş emri başarıyla oluşturuldu: ${orderResponse.orderNo}\nKaydedilen malzeme sayısı: ${savedMaterials.length}`);

    } catch (err) {
      console.error("İş emri oluşturma hatası:", err);
      alert(`Hata: ${err instanceof Error ? err.message : "Bilinmeyen hata"}`);
    } finally {
      setIsSaving(false);
    }
  };

  const resetForm = useCallback(() => {
    setNewOrderData({
      contract: "01",
      orderNo: `WO${String(Math.floor(Math.random() * 10000)).padStart(5, '0')}`,
      orderCode: "p",
      partNo: "",
      revisedStartDate: new Date().toISOString().split('T')[0],
      revisedDueDate: new Date().toISOString().split('T')[0],
      revisedQtyDue: 1,
      qtyComplete: 0,
      rowstate: "Released",
      createdBy: "admin",
      rowversion: 1,
      rowkey: `new-order-${Date.now()}`
    });
    
    setNewOrderMaterials([]);
    setProdStructures([]);
  }, []);

  const handleCancelNewOrder = useCallback(() => {
    setIsCreatingNewOrder(false);
    resetForm();
  }, [resetForm]);

  // Düzenleme işlemleri
  const handleEditClick = () => setIsEditing(true);
  
  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditingOrder(selectedOrder);
    setEditingMaterials([...materials]);
  };

  const handleEditingOrderChange = (field: keyof ShopOrder, value: any) => {
    if (!editingOrder) return;
    
    const updatedOrder = { ...editingOrder, [field]: value };
    setEditingOrder(updatedOrder);
    
    // Planlanan miktar değiştiğinde malzeme miktarlarını güncelle
    if (field === 'revisedQtyDue') {
      const updatedMaterials = editingMaterials.map(material => ({
        ...material,
        qtyRequired: (value || 1) * (material.qtyPerAssembly || 1)
      }));
      setEditingMaterials(updatedMaterials);
    }
  };

  const handleEditingMaterialChange = (index: number, field: keyof ShopMaterialAlloc, value: any) => {
    if (!editingMaterials[index]) return;
    const updated = [...editingMaterials];
    updated[index] = { 
      ...updated[index], 
      [field]: field.includes('qty') ? parseFloat(value) || 0 : value 
    };
    
    // qtyPerAssembly değiştiğinde qtyRequired'i güncelle
    if (field === 'qtyPerAssembly') {
      updated[index].qtyRequired = (editingOrder?.revisedQtyDue || 1) * (parseFloat(value) || 1);
    }
    
    setEditingMaterials(updated);
  };

  const handleSaveOrder = async () => {
    if (!editingOrder || !selectedOrder) return;

    try {
      setIsSaving(true);
      
      // Ana siparişi güncelle
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

      // Malzemeleri güncelle
      const materialErrors: string[] = [];
      
      for (const material of editingMaterials) {
        try {
          if (material.rowkey?.includes('new-')) {
            // Yeni malzeme
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
            // Mevcut malzeme güncelleme
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
          console.error(`Malzeme ${material.lineItemNo} işlem hatası:`, err);
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

  // YENİ: Malzeme ekleme butonu kaldırıldı (otomatik olarak ürün ağacından gelecek)

  const removeMaterial = async (index: number) => {
    if (editingMaterials.length <= 1) return;
    
    const material = editingMaterials[index];
    
    // Eğer kaydedilmişse API'den sil
    if (!material.rowkey?.includes('new-')) {
      try {
        await ShopMaterialService.deleteMaterial(
          material.contract,
          material.orderNo,
          material.lineItemNo,
          material.partNo
        );
      } catch (err) {
        console.error("Malzeme silme hatası:", err);
        alert(`Hata: ${err instanceof Error ? err.message : "Bilinmeyen hata"}`);
        return;
      }
    }
    
    const updated = editingMaterials.filter((_, i) => i !== index);
    setEditingMaterials(updated);
  };

  // YENİ İŞ EMRİ OLUŞTURMA EKRANI
  if (isCreatingNewOrder) {
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
            title="Üretim Emri Arama"
            items={searchListItems}
            onSelect={handleOrderSelect}
            onToggle={handleToggleSearchList}
            searchFields={["code", "name", "description"]}
            displayFields={["code", "name"]}
            icon="fas fa-industry"
          />
        )}

        {/* YENİ: Ürün Ağacı Arama Modalı */}
        {showProdStructureSearch && (
          <div style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            zIndex: 2000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}>
            <div style={{
              backgroundColor: "#1e293b",
              borderRadius: "12px",
              padding: "20px",
              width: "80%",
              maxWidth: "1000px",
              maxHeight: "80vh",
              overflow: "hidden",
              border: "2px solid #10b981"
            }}>
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "15px",
                paddingBottom: "15px",
                borderBottom: "1px solid #334155"
              }}>
                <h2 style={{ 
                  margin: 0, 
                  color: "#f1f5f9", 
                  fontSize: "1.2rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px"
                }}>
                  <i className="fas fa-sitemap" style={{ color: "#10b981" }}></i>
                  Ürün Ağacı Arama
                </h2>
                <button
                  onClick={() => setShowProdStructureSearch(false)}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#94a3b8",
                    cursor: "pointer",
                    fontSize: "1.2rem"
                  }}
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>

              <div style={{ marginBottom: "15px" }}>
                <div style={{
                  display: "flex",
                  gap: "10px",
                  marginBottom: "10px"
                }}>
                  <input
                    type="text"
                    placeholder="Parça No ile ara..."
                    onChange={(e) => fetchProdStructureHeads(e.target.value)}
                    style={{
                      flex: 1,
                      padding: "10px",
                      backgroundColor: "rgba(30, 41, 59, 0.8)",
                      border: "1px solid #475569",
                      borderRadius: "6px",
                      color: "#f1f5f9"
                    }}
                  />
                </div>
              </div>

              <div style={{
                maxHeight: "50vh",
                overflowY: "auto",
                borderRadius: "8px",
                border: "1px solid #334155"
              }}>
                <table style={{ 
                  width: "100%", 
                  borderCollapse: "collapse" 
                }}>
                  <thead style={{
                    backgroundColor: "#334155",
                    position: "sticky",
                    top: 0
                  }}>
                    <tr>
                      <th style={{ 
                        padding: "12px 15px", 
                        textAlign: "left", 
                        color: "#f1f5f9", 
                        fontSize: "0.85rem",
                        borderBottom: "1px solid #475569"
                      }}>
                        Parça No
                      </th>
                      <th style={{ 
                        padding: "12px 15px", 
                        textAlign: "left", 
                        color: "#f1f5f9", 
                        fontSize: "0.85rem",
                        borderBottom: "1px solid #475569"
                      }}>
                        Kontrat
                      </th>
                      <th style={{ 
                        padding: "12px 15px", 
                        textAlign: "left", 
                        color: "#f1f5f9", 
                        fontSize: "0.85rem",
                        borderBottom: "1px solid #475569"
                      }}>
                        Revizyon
                      </th>
                      <th style={{ 
                        padding: "12px 15px", 
                        textAlign: "left", 
                        color: "#f1f5f9", 
                        fontSize: "0.85rem",
                        borderBottom: "1px solid #475569"
                      }}>
                        BOM Tipi
                      </th>
                      <th style={{ 
                        padding: "12px 15px", 
                        textAlign: "left", 
                        color: "#f1f5f9", 
                        fontSize: "0.85rem",
                        borderBottom: "1px solid #475569"
                      }}>
                        İşlem
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {prodStructureLoading ? (
                      <tr>
                        <td colSpan={5} style={{ 
                          padding: "40px", 
                          textAlign: "center", 
                          color: "#94a3b8" 
                        }}>
                          <i className="fas fa-spinner fa-spin" style={{ marginRight: "10px" }}></i>
                          Ürün ağaçları yükleniyor...
                        </td>
                      </tr>
                    ) : prodStructureHeads.length === 0 ? (
                      <tr>
                        <td colSpan={5} style={{ 
                          padding: "40px", 
                          textAlign: "center", 
                          color: "#94a3b8" 
                        }}>
                          <i className="fas fa-sitemap" style={{ marginRight: "10px" }}></i>
                          Ürün ağacı bulunamadı
                        </td>
                      </tr>
                    ) : (
                      prodStructureHeads.map((head) => (
                        <tr key={`${head.Contract}-${head.PartNo}-${head.EngChgLevel}-${head.BomTypeDb}`}
                          style={{
                            borderBottom: "1px solid #334155",
                            backgroundColor: "rgba(30, 41, 59, 0.5)"
                          }}
                        >
                          <td style={{ 
                            padding: "12px 15px", 
                            color: "#f1f5f9",
                            fontSize: "0.85rem",
                            fontWeight: "600"
                          }}>
                            {head.PartNo}
                          </td>
                          <td style={{ 
                            padding: "12px 15px", 
                            color: "#94a3b8",
                            fontSize: "0.85rem"
                          }}>
                            {head.Contract}
                          </td>
                          <td style={{ 
                            padding: "12px 15px", 
                            color: "#94a3b8",
                            fontSize: "0.85rem"
                          }}>
                            {head.EngChgLevel}
                          </td>
                          <td style={{ 
                            padding: "12px 15px", 
                            color: "#94a3b8",
                            fontSize: "0.85rem"
                          }}>
                            {head.BomTypeDb}
                          </td>
                          <td style={{ 
                            padding: "12px 15px",
                            textAlign: "center"
                          }}>
                            <button
                              onClick={() => handleProdStructureSelect(head)}
                              style={{
                                background: "#10b981",
                                color: "white",
                                border: "none",
                                borderRadius: "4px",
                                padding: "6px 12px",
                                fontSize: "0.8rem",
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                gap: "5px"
                              }}
                            >
                              <i className="fas fa-check"></i>
                              <span>Seç</span>
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              <div style={{
                marginTop: "15px",
                paddingTop: "15px",
                borderTop: "1px solid #334155",
                textAlign: "right"
              }}>
                <button
                  onClick={() => setShowProdStructureSearch(false)}
                  style={{
                    background: "#64748b",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                    padding: "8px 16px",
                    fontSize: "0.85rem",
                    cursor: "pointer"
                  }}
                >
                  Kapat
                </button>
              </div>
            </div>
          </div>
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

        {/* ANA EKRAN - YENİ İŞ EMRİ OLUŞTURMA */}
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
                <h2 style={{ margin: 0, color: "#f1f5f9", fontSize: "1.3rem" }}>Yeni Üretim Emri</h2>
                <p style={{ margin: "4px 0 0 0", color: "#94a3b8", fontSize: "0.85rem" }}>
                  İş Emri No: <strong>{newOrderData.orderNo}</strong>
                  {newOrderData.partNo && ` | Malzeme: ${newOrderData.partNo}`}
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
              {prodStructureLoading && (
                <div style={{
                  backgroundColor: "rgba(59, 130, 246, 0.2)",
                  color: "#3b82f6",
                  padding: "5px 10px",
                  borderRadius: "4px",
                  fontSize: "0.85rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "5px"
                }}>
                  <i className="fas fa-spinner fa-spin"></i>
                  <span>Ürün ağacı yükleniyor...</span>
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
                <span>
                  {newOrderData.partNo 
                    ? `"${newOrderData.partNo}" malzemesinin ürün ağacından ${newOrderMaterials.length} adet bileşen yüklendi.`
                    : "Önce ürün ağacından bir malzeme seçin. Malzeme seçildiğinde ürün ağacındaki tüm bileşenler otomatik olarak malzeme tahsislerine eklenecektir."
                  }
                </span>
              </div>
            </div>
          </div>

          {/* İş Emri Bilgileri */}
          <div style={{
            background: "#1e293b",
            borderRadius: "12px",
            padding: "20px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
            border: "1px solid #334155",
            marginBottom: "15px"
          }}>
            <h3 style={{ 
              color: "#f1f5f9", 
              fontSize: "1rem", 
              marginBottom: "15px",
              display: "flex",
              alignItems: "center",
              gap: "8px"
            }}>
              <i className="fas fa-info-circle" style={{ color: "#38bdf8" }}></i>
              İş Emri Bilgileri
            </h3>
            
            <div style={{ 
              display: "grid", 
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", 
              gap: "15px",
              backgroundColor: "rgba(30, 41, 59, 0.5)",
              padding: "15px",
              borderRadius: "8px",
              border: "1px solid #334155"
            }}>
              <div>
                <label style={labelStyle}>
                  İş Emri No <span style={{ color: "#ef4444" }}>*</span>
                </label>
                <input
                  type="text"
                  value={newOrderData.orderNo}
                  onChange={(e) => handleNewOrderDataChange('orderNo', e.target.value)}
                  style={inputStyle}
                  placeholder="Örn: WO00123"
                />
              </div>
              <div>
                <label style={labelStyle}>
                  Kontrat <span style={{ color: "#ef4444" }}>*</span>
                </label>
                <input
                  type="text"
                  value={newOrderData.contract}
                  onChange={(e) => handleNewOrderDataChange('contract', e.target.value)}
                  style={inputStyle}
                  placeholder="Örn: 01"
                />
              </div>
              <div>
                <label style={labelStyle}>
                  Malzeme No <span style={{ color: "#ef4444" }}>*</span>
                </label>
                <div style={{ display: "flex", gap: "8px" }}>
                  <input
                    type="text"
                    value={newOrderData.partNo}
                    onChange={(e) => handleNewOrderDataChange('partNo', e.target.value)}
                    style={{ ...inputStyle, flex: 1 }}
                    placeholder="Üretilecek malzeme numarası"
                    readOnly
                  />
                  <button
                    onClick={openProdStructureSearch}
                    style={{
                      background: "#10b981",
                      color: "white",
                      border: "none",
                      borderRadius: "6px",
                      padding: "10px 12px",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      minWidth: "40px"
                    }}
                    title="Ürün Ağacından Seç"
                  >
                    <i className="fas fa-sitemap"></i>
                  </button>
                </div>
                {newOrderData.partNo && (
                  <div style={{
                    marginTop: "5px",
                    fontSize: "0.75rem",
                    color: "#10b981",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px"
                  }}>
                    <i className="fas fa-check-circle"></i>
                    <span>Ürün ağacından seçildi</span>
                  </div>
                )}
              </div>
              <div>
                <label style={labelStyle}>
                  İş Emri Kodu
                </label>
                <input
                  type="text"
                  value={newOrderData.orderCode}
                  onChange={(e) => handleNewOrderDataChange('orderCode', e.target.value)}
                  style={inputStyle}
                  placeholder="01"
                />
              </div>
              <div>
                <label style={labelStyle}>
                  Başlangıç Tarihi
                </label>
                <input
                  type="date"
                  value={newOrderData.revisedStartDate}
                  onChange={(e) => handleNewOrderDataChange('revisedStartDate', e.target.value)}
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>
                  Bitiş Tarihi
                </label>
                <input
                  type="date"
                  value={newOrderData.revisedDueDate}
                  onChange={(e) => handleNewOrderDataChange('revisedDueDate', e.target.value)}
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>
                  Planlanan Miktar <span style={{ color: "#ef4444" }}>*</span>
                </label>
                <input
                  type="number"
                  value={newOrderData.revisedQtyDue}
                  onChange={(e) => handleNewOrderDataChange('revisedQtyDue', parseFloat(e.target.value) || 0)}
                  style={inputStyle}
                  min="0"
                  step="0.01"
                />
                <div style={{
                  marginTop: "5px",
                  fontSize: "0.75rem",
                  color: "#94a3b8"
                }}>
                  Bu miktar, malzeme tahsislerindeki "Gerekli Miktar"ı etkiler
                </div>
              </div>
              <div>
                <label style={labelStyle}>
                  Durum
                </label>
                <select
                  value={newOrderData.rowstate}
                  onChange={(e) => handleNewOrderDataChange('rowstate', e.target.value)}
                  style={inputStyle}
                >
                  <option value="Released">Released</option>
                  <option value="Planned">Planned</option>
                  <option value="Closed">Closed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
            </div>
          </div>

          {/* Malzeme Tahsisleri (Otomatik - Ürün Ağacından) */}
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
              <div>
                <h3 style={{ 
                  color: "#f1f5f9", 
                  fontSize: "1rem",
                  margin: 0,
                  display: "flex",
                  alignItems: "center",
                  gap: "8px"
                }}>
                  <i className="fas fa-box" style={{ color: "#f59e0b" }}></i>
                  Malzeme Tahsisleri (Ürün Ağacından Otomatik)
                </h3>
                {newOrderData.partNo && (
                  <p style={{ 
                    margin: "5px 0 0 0", 
                    color: "#94a3b8", 
                    fontSize: "0.85rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "5px"
                  }}>
                    <i className="fas fa-info-circle"></i>
                    {prodStructures.length > 0 
                      ? `${prodStructures.length} adet ürün ağacı satırından ${newOrderMaterials.length} adet malzeme yüklendi`
                      : "Ürün ağacı yükleniyor veya malzeme bulunamadı"}
                  </p>
                )}
              </div>
              
              {newOrderData.partNo && newOrderMaterials.length > 0 && (
                <div style={{
                  backgroundColor: "rgba(245, 158, 11, 0.1)",
                  color: "#f59e0b",
                  padding: "5px 10px",
                  borderRadius: "4px",
                  fontSize: "0.85rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "5px"
                }}>
                  <i className="fas fa-sync-alt"></i>
                  <span>Ürün Ağacından Otomatik</span>
                </div>
              )}
            </div>

            {/* Data Grid View */}
            {newOrderMaterials.length > 0 ? (
              <div style={{
                backgroundColor: "rgba(30, 41, 59, 0.3)",
                borderRadius: "8px",
                overflow: "hidden",
                border: "1px solid #334155"
              }}>
                {/* Grid Header */}
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "60px 200px 100px 120px 100px 100px 100px 80px",
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
                  <div>Satır</div>
                  <div>Malzeme No</div>
                  <div>Operasyon</div>
                  <div>Parça Başına</div>
                  <div>Atanan</div>
                  <div>Verilen</div>
                  <div>Gerekli</div>
                  <div>Sil</div>
                </div>

                {/* Grid Body */}
                <div>
                  {newOrderMaterials.map((material, index) => (
                    <div
                      key={index}
                      style={{
                        display: "grid",
                        gridTemplateColumns: "60px 200px 100px 120px 100px 100px 100px 80px",
                        padding: "10px 15px",
                        borderBottom: "1px solid #334155",
                        fontSize: "0.85rem",
                        color: "#f1f5f9",
                        backgroundColor: index % 2 === 0 ? "rgba(30, 41, 59, 0.5)" : "rgba(30, 41, 59, 0.3)",
                        alignItems: "center"
                      }}
                    >
                      <div>{material.lineItemNo}</div>
                      
                      {/* Malzeme No - SADECE OKUNABİLİR */}
                      <div>
                        <input
                          type="text"
                          value={material.partNo}
                          style={{
                            width: "100%",
                            padding: "6px 8px",
                            backgroundColor: "rgba(30, 41, 59, 0.5)",
                            border: "1px solid #475569",
                            borderRadius: "4px",
                            color: "#f1f5f9",
                            fontSize: "0.85rem",
                            cursor: "not-allowed"
                          }}
                          readOnly
                        />
                        
                      </div>
                      
                      {/* Operasyon - SADECE OKUNABİLİR */}
                      <div>
                        <input
                          type="number"
                          value={material.operationNo || 10}
                          style={{
                            width: "100%",
                            padding: "6px 8px",
                            backgroundColor: "rgba(30, 41, 59, 0.5)",
                            border: "1px solid #475569",
                            borderRadius: "4px",
                            color: "#f1f5f9",
                            fontSize: "0.85rem",
                            cursor: "not-allowed"
                          }}
                          readOnly
                        />
                      </div>
                      
                      {/* Parça Başına */}
                      <div>
                        <input
                          type="number"
                          value={material.qtyPerAssembly || 1}
                          onChange={(e) => handleNewMaterialChange(index, 'qtyPerAssembly', e.target.value)}
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
                      </div>
                      
                      {/* Atanan */}
                      <div>
                        <input
                          type="number"
                          value={material.qtyAssigned || 0}
                          onChange={(e) => handleNewMaterialChange(index, 'qtyAssigned', e.target.value)}
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
                      </div>
                      
                      {/* Verilen */}
                      <div>
                        <input
                          type="number"
                          value={material.qtyIssued || 0}
                          onChange={(e) => handleNewMaterialChange(index, 'qtyIssued', e.target.value)}
                          style={{
                            width: "100%",
                            padding: "6px 8px",
                            backgroundColor: "rgba(30, 41, 59, 0.5)",
                            border: "1px solid #475569",
                            borderRadius: "4px",
                            color: "#f1f5f9",
                            fontSize: "0.85rem",
                            cursor: "not-allowed"
                          }}
                          readOnly
                        />
                      </div>
                      
                      {/* Gerekli */}
                      <div>
                        <input
                          type="number"
                          value={material.qtyRequired || 0}
                          style={{
                            width: "100%",
                            padding: "6px 8px",
                            backgroundColor: "rgba(30, 41, 59, 0.5)",
                            border: "1px solid #475569",
                            borderRadius: "4px",
                            color: "#f1f5f9",
                            fontSize: "0.85rem",
                            cursor: "not-allowed"
                          }}
                          readOnly
                        />
                        <div style={{
                          fontSize: "0.7rem",
                          color: "#94a3b8",
                          marginTop: "2px"
                        }}>
                        
                        </div>
                      </div>
                      
                      {/* Sil Butonu */}
                      <div style={{ display: "flex", justifyContent: "center" }}>
                        <button
                          onClick={() => removeNewMaterial(index)}
                          disabled={newOrderMaterials.length <= 1}
                          style={{
                            background: newOrderMaterials.length <= 1 ? "#64748b" : "#ef4444",
                            color: "white",
                            border: "none",
                            borderRadius: "4px",
                            width: "32px",
                            height: "32px",
                            cursor: newOrderMaterials.length <= 1 ? "not-allowed" : "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            opacity: newOrderMaterials.length <= 1 ? 0.5 : 1,
                            flexShrink: 0
                          }}
                          title="Malzemeyi Sil"
                        >
                          <i className="fas fa-trash" style={{ fontSize: "0.7rem" }}></i>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
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
                <i className="fas fa-sitemap" style={{ fontSize: "2rem", marginBottom: "10px" }}></i>
                <p>
                  {newOrderData.partNo 
                    ? "Ürün ağacında malzeme bulunamadı veya yükleniyor..."
                    : "Önce üstteki malzeme alanından bir ürün ağacı seçin"
                  }
                </p>
              </div>
            )}
          </div>

          {/* Notlar ve Butonlar */}
          <div style={{
            background: "#1e293b",
            borderRadius: "12px",
            padding: "20px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
            border: "1px solid #334155",
            marginBottom: "15px"
          }}>
            <h3 style={{ 
              color: "#f1f5f9", 
              fontSize: "1rem", 
              marginBottom: "15px",
              display: "flex",
              alignItems: "center",
              gap: "8px"
            }}>
              <i className="fas fa-sticky-note" style={{ color: "#8b5cf6" }}></i>
              Notlar
            </h3>
            <textarea
              value={newOrderData.noteText || ''}
              onChange={(e) => handleNewOrderDataChange('noteText', e.target.value || undefined)}
              rows={3}
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
              placeholder="İş emri ile ilgili ek notlar..."
            />

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
                onClick={handleCancelNewOrder}
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
                onClick={handleCreateNewOrder}
                disabled={isSaving || !newOrderData.partNo || !newOrderData.orderNo || !newOrderData.contract || newOrderMaterials.length === 0}
                style={{
                  background: !newOrderData.partNo || !newOrderData.orderNo || !newOrderData.contract || newOrderMaterials.length === 0
                    ? "#475569" 
                    : isSaving
                    ? "#f59e0b"
                    : "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  padding: "10px 25px",
                  fontSize: "0.9rem",
                  cursor: !newOrderData.partNo || !newOrderData.orderNo || !newOrderData.contract || newOrderMaterials.length === 0 || isSaving 
                    ? "not-allowed" 
                    : "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  opacity: !newOrderData.partNo || !newOrderData.orderNo || !newOrderData.contract || newOrderMaterials.length === 0 || isSaving ? 0.6 : 1
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
                    <span>İş Emrini Oluştur</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // NORMAL EKRAN - İş Emri Listeleme ve Düzenleme
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
          title="Üretim Emri Arama"
          items={searchListItems}
          onSelect={handleOrderSelect}
          onToggle={handleToggleSearchList}
          searchFields={["code", "name", "description"]}
          displayFields={["code", "name"]}
          icon="fas fa-industry"
        />
      )}

      {/* YENİ: Ürün Ağacı Arama Modalı (düzenleme için) */}
      {showProdStructureSearch && !isCreatingNewOrder && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.8)",
          zIndex: 2000,
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}>
          <div style={{
            backgroundColor: "#1e293b",
            borderRadius: "12px",
            padding: "20px",
            width: "80%",
            maxWidth: "1000px",
            maxHeight: "80vh",
            overflow: "hidden",
            border: "2px solid #10b981"
          }}>
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "15px",
              paddingBottom: "15px",
              borderBottom: "1px solid #334155"
            }}>
              <h2 style={{ 
                margin: 0, 
                color: "#f1f5f9", 
                fontSize: "1.2rem",
                display: "flex",
                alignItems: "center",
                gap: "10px"
              }}>
                <i className="fas fa-sitemap" style={{ color: "#10b981" }}></i>
                Ürün Ağacı Arama (Malzeme Değiştir)
              </h2>
              <button
                onClick={() => setShowProdStructureSearch(false)}
                style={{
                  background: "none",
                  border: "none",
                  color: "#94a3b8",
                  cursor: "pointer",
                  fontSize: "1.2rem"
                }}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>

            <div style={{ marginBottom: "15px" }}>
              <div style={{
                display: "flex",
                gap: "10px",
                marginBottom: "10px"
              }}>
                <input
                  type="text"
                  placeholder="Parça No ile ara..."
                  onChange={(e) => fetchProdStructureHeads(e.target.value)}
                  style={{
                    flex: 1,
                    padding: "10px",
                    backgroundColor: "rgba(30, 41, 59, 0.8)",
                    border: "1px solid #475569",
                    borderRadius: "6px",
                    color: "#f1f5f9"
                  }}
                />
              </div>
            </div>

            <div style={{
              maxHeight: "50vh",
              overflowY: "auto",
              borderRadius: "8px",
              border: "1px solid #334155"
            }}>
              <table style={{ 
                width: "100%", 
                borderCollapse: "collapse" 
              }}>
                <thead style={{
                  backgroundColor: "#334155",
                  position: "sticky",
                  top: 0
                }}>
                  <tr>
                    <th style={{ 
                      padding: "12px 15px", 
                      textAlign: "left", 
                      color: "#f1f5f9", 
                      fontSize: "0.85rem",
                      borderBottom: "1px solid #475569"
                    }}>
                      Parça No
                    </th>
                    <th style={{ 
                      padding: "12px 15px", 
                      textAlign: "left", 
                      color: "#f1f5f9", 
                      fontSize: "0.85rem",
                      borderBottom: "1px solid #475569"
                    }}>
                      Kontrat
                    </th>
                    <th style={{ 
                      padding: "12px 15px", 
                      textAlign: "left", 
                      color: "#f1f5f9", 
                      fontSize: "0.85rem",
                      borderBottom: "1px solid #475569"
                    }}>
                      Revizyon
                    </th>
                    <th style={{ 
                      padding: "12px 15px", 
                      textAlign: "left", 
                      color: "#f1f5f9", 
                      fontSize: "0.85rem",
                      borderBottom: "1px solid #475569"
                    }}>
                      BOM Tipi
                    </th>
                    <th style={{ 
                      padding: "12px 15px", 
                      textAlign: "left", 
                      color: "#f1f5f9", 
                      fontSize: "0.85rem",
                      borderBottom: "1px solid #475569"
                    }}>
                      İşlem
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {prodStructureLoading ? (
                    <tr>
                      <td colSpan={5} style={{ 
                        padding: "40px", 
                        textAlign: "center", 
                        color: "#94a3b8" 
                      }}>
                        <i className="fas fa-spinner fa-spin" style={{ marginRight: "10px" }}></i>
                        Ürün ağaçları yükleniyor...
                      </td>
                    </tr>
                  ) : prodStructureHeads.length === 0 ? (
                    <tr>
                      <td colSpan={5} style={{ 
                        padding: "40px", 
                        textAlign: "center", 
                        color: "#94a3b8" 
                      }}>
                        <i className="fas fa-sitemap" style={{ marginRight: "10px" }}></i>
                        Ürün ağacı bulunamadı
                      </td>
                    </tr>
                  ) : (
                    prodStructureHeads.map((head) => (
                      <tr key={`${head.Contract}-${head.PartNo}-${head.EngChgLevel}-${head.BomTypeDb}`}
                        style={{
                          borderBottom: "1px solid #334155",
                          backgroundColor: "rgba(30, 41, 59, 0.5)"
                        }}
                      >
                        <td style={{ 
                          padding: "12px 15px", 
                          color: "#f1f5f9",
                          fontSize: "0.85rem",
                          fontWeight: "600"
                        }}>
                          {head.PartNo}
                        </td>
                        <td style={{ 
                          padding: "12px 15px", 
                          color: "#94a3b8",
                          fontSize: "0.85rem"
                        }}>
                          {head.Contract}
                        </td>
                        <td style={{ 
                          padding: "12px 15px", 
                          color: "#94a3b8",
                          fontSize: "0.85rem"
                        }}>
                          {head.EngChgLevel}
                        </td>
                        <td style={{ 
                          padding: "12px 15px", 
                          color: "#94a3b8",
                          fontSize: "0.85rem"
                        }}>
                          {head.BomTypeDb}
                        </td>
                        <td style={{ 
                          padding: "12px 15px",
                          textAlign: "center"
                        }}>
                          <button
                            onClick={() => handleProdStructureSelect(head)}
                            style={{
                              background: "#10b981",
                              color: "white",
                              border: "none",
                              borderRadius: "4px",
                              padding: "6px 12px",
                              fontSize: "0.8rem",
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              gap: "5px"
                            }}
                          >
                            <i className="fas fa-check"></i>
                            <span>Seç</span>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div style={{
              marginTop: "15px",
              paddingTop: "15px",
              borderTop: "1px solid #334155",
              textAlign: "right"
            }}>
              <div style={{
                backgroundColor: "rgba(245, 158, 11, 0.1)",
                padding: "10px",
                borderRadius: "6px",
                marginBottom: "10px",
                fontSize: "0.85rem",
                color: "#f1f5f9"
              }}>
                <i className="fas fa-exclamation-triangle" style={{ marginRight: "8px", color: "#f59e0b" }}></i>
                Malzeme değiştirildiğinde ürün ağacındaki tüm bileşenler malzeme tahsislerine otomatik olarak eklenecektir.
              </div>
              <button
                onClick={() => setShowProdStructureSearch(false)}
                style={{
                  background: "#64748b",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  padding: "8px 16px",
                  fontSize: "0.85rem",
                  cursor: "pointer"
                }}
              >
                Kapat
              </button>
            </div>
          </div>
        </div>
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
                  flexShrink: 0,
                  transition: "all 0.2s"
                }}
                onMouseOver={(e) => e.currentTarget.style.transform = "translateY(-2px)"}
                onMouseOut={(e) => e.currentTarget.style.transform = "translateY(0)"}
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

        {/* Seçili Sipariş Detayları */}
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
              
              <div style={{ display: "flex", gap: "10px" }}>
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
            
            {/* Emri Bilgileri Grid */}
            <div style={{ 
              display: "grid", 
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", 
              gap: "15px",
              marginBottom: "20px"
            }}>
              {/* Emri No */}
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
              
              {/* Malzeme */}
              <div>
                <label style={labelStyle}>Malzeme</label>
                {isEditing ? (
                  <div style={{ display: "flex", gap: "8px" }}>
                    <input
                      type="text"
                      value={editingOrder.partNo}
                      onChange={(e) => handleEditingOrderChange('partNo', e.target.value)}
                      style={{ ...inputStyle, flex: 1 }}
                      placeholder="Üretilecek malzeme numarası"
                    />
                    <button
                      onClick={openProdStructureSearch}
                      style={{
                        background: "#10b981",
                        color: "white",
                        border: "none",
                        borderRadius: "6px",
                        padding: "10px 12px",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        minWidth: "40px"
                      }}
                      title="Ürün Ağacından Seç"
                    >
                      <i className="fas fa-sitemap"></i>
                    </button>
                  </div>
                ) : (
                  <div style={{ 
                    padding: "8px", 
                    backgroundColor: "rgba(30, 41, 59, 0.5)",
                    borderRadius: "4px",
                    color: "#f1f5f9"
                  }}>
                    {editingOrder.partNo}
                  </div>
                )}
                {isEditing && (
                  <div style={{
                    marginTop: "5px",
                    fontSize: "0.75rem",
                    color: "#f59e0b"
                  }}>
                    <i className="fas fa-exclamation-triangle"></i>
                    Malzeme değiştirilirse ürün ağacı yeniden yüklenecek
                  </div>
                )}
              </div>
              
              {/* Kontrat */}
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
              
              {/* Başlangıç Tarihi */}
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
              
              {/* Bitiş Tarihi */}
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
              
              {/* Planlanan Miktar */}
              <div>
                <label style={labelStyle}>Planlanan Miktar</label>
                {isEditing ? (
                  <>
                    <input
                      type="number"
                      value={editingOrder.revisedQtyDue || 0}
                      onChange={(e) => handleEditingOrderChange('revisedQtyDue', parseFloat(e.target.value) || 0)}
                      style={inputStyle}
                      min="0"
                      step="0.01"
                    />
                    <div style={{
                      marginTop: "5px",
                      fontSize: "0.75rem",
                      color: "#94a3b8"
                    }}>
                      Malzeme tahsislerindeki "Gerekli Miktar"ı etkiler
                    </div>
                  </>
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
              
              {/* Tamamlanan Miktar */}
              <div>
                <label style={labelStyle}>Tamamlanan Miktar</label>
                {isEditing ? (
                  <input
                    type="number"
                    value={editingOrder.qtyComplete || 0}
                    onChange={(e) => handleEditingOrderChange('qtyComplete', parseFloat(e.target.value) || 0)}
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
                    {editingOrder.qtyComplete?.toFixed(2) || '0.00'}
                  </div>
                )}
              </div>
              
              {/* Müşteri Siparişi */}
              <div>
                <label style={labelStyle}>Müşteri Siparişi</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editingOrder.customerOrderNo || ''}
                    onChange={(e) => handleEditingOrderChange('customerOrderNo', e.target.value)}
                    style={inputStyle}
                    placeholder="Müşteri sipariş no"
                  />
                ) : (
                  <div style={{ 
                    padding: "8px", 
                    backgroundColor: "rgba(30, 41, 59, 0.5)",
                    borderRadius: "4px",
                    color: "#f1f5f9"
                  }}>
                    {editingOrder.customerOrderNo || '-'}
                  </div>
                )}
              </div>
              
              {/* Durum */}
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
                                   editingOrder.rowstate === 'Cancelled' ? "rgba(239, 68, 68, 0.2)" : 
                                   "rgba(245, 158, 11, 0.2)",
                    borderRadius: "4px",
                    color: editingOrder.rowstate === 'Released' ? "#10b981" : 
                           editingOrder.rowstate === 'Closed' ? "#3b82f6" : 
                           editingOrder.rowstate === 'Cancelled' ? "#ef4444" : "#f59e0b",
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
                      backgroundColor: "rgba(30, 41, 59, 0.3)",
                      borderRadius: "8px",
                      overflow: "hidden",
                      border: "1px solid #334155"
                    }}>
                      {/* Grid Header */}
                      <div style={{
                        display: "grid",
                        gridTemplateColumns: "60px 150px 120px 120px 100px 100px 100px 100px",
                        backgroundColor: "#334155",
                        padding: "12px 15px",
                        borderBottom: "1px solid #475569",
                        fontSize: "0.8rem",
                        fontWeight: "600",
                        color: "#f1f5f9"
                      }}>
                        <div>Satır</div>
                        <div>Malzeme</div>
                        <div>Operasyon</div>
                        <div>Montaj Başına Miktar</div>
                        <div>Rezerve Miktar</div>
                        <div>Kullanılan Miktar</div>
                        <div>Gerekli Miktar</div>
                        <div>İşlem</div>
                      </div>

                      {/* Grid Body */}
                      {editingMaterials.map((material, index) => (
                        <div
                          key={index}
                          style={{
                            display: "grid",
                            gridTemplateColumns: "60px 150px 120px 120px 100px 100px 100px 100px",
                            padding: "10px 15px",
                            borderBottom: "1px solid #334155",
                            fontSize: "0.85rem",
                            color: "#f1f5f9",
                            backgroundColor: index % 2 === 0 ? "rgba(30, 41, 59, 0.5)" : "rgba(30, 41, 59, 0.3)",
                            alignItems: "center"
                          }}
                        >
                          <div>{material.lineItemNo}</div>
                          <div>
                            {isEditing ? (
                              <input
                                type="text"
                                value={material.partNo}
                                style={{
                                  width: "100%",
                                  padding: "6px 8px",
                                  backgroundColor: "rgba(30, 41, 59, 0.5)",
                                  border: "1px solid #475569",
                                  borderRadius: "4px",
                                  color: "#f1f5f9",
                                  fontSize: "0.85rem",
                                  cursor: "not-allowed"
                                }}
                                readOnly
                              />
                            ) : (
                              material.partNo
                            )}
                          </div>
                          <div>
                            {isEditing ? (
                              <input
                                type="number"
                                value={material.operationNo || ''}
                                style={{
                                  width: "100%",
                                  padding: "6px 8px",
                                  backgroundColor: "rgba(30, 41, 59, 0.5)",
                                  border: "1px solid #475569",
                                  borderRadius: "4px",
                                  color: "#f1f5f9",
                                  fontSize: "0.85rem",
                                  cursor: "not-allowed"
                                }}
                                readOnly
                              />
                            ) : (
                              material.operationNo || '-'
                            )}
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
                          <div>
                            {isEditing ? (
                              <input
                                type="number"
                                value={material.qtyAssigned || 0}
                                onChange={(e) => handleEditingMaterialChange(index, 'qtyAssigned', parseFloat(e.target.value) || 0)}
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
                              (material.qtyAssigned || 0).toFixed(2)
                            )}
                          </div>
                          <div>
                            {isEditing ? (
                              <input
                                type="number"
                                value={material.qtyIssued || 0}
                                onChange={(e) => handleEditingMaterialChange(index, 'qtyIssued', parseFloat(e.target.value) || 0)}
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
                              (material.qtyIssued || 0).toFixed(2)
                            )}
                          </div>
                          <div>
                            {isEditing ? (
                              <input
                                type="number"
                                value={material.qtyRequired || 0}
                                style={{
                                  width: "100%",
                                  padding: "6px 8px",
                                  backgroundColor: "rgba(30, 41, 59, 0.5)",
                                  border: "1px solid #475569",
                                  borderRadius: "4px",
                                  color: "#f1f5f9",
                                  fontSize: "0.85rem",
                                  cursor: "not-allowed"
                                }}
                                readOnly
                              />
                            ) : (
                              (material.qtyRequired || 0).toFixed(2)
                            )}
                          </div>
                          <div style={{ display: "flex", justifyContent: "center", gap: "5px" }}>
                            {isEditing && (
                              <button
                                onClick={() => removeMaterial(index)}
                                disabled={editingMaterials.length <= 1}
                                style={{
                                  background: editingMaterials.length <= 1 ? "#64748b" : "#ef4444",
                                  color: "white",
                                  border: "none",
                                  borderRadius: "4px",
                                  width: "32px",
                                  height: "32px",
                                  cursor: editingMaterials.length <= 1 ? "not-allowed" : "pointer",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  opacity: editingMaterials.length <= 1 ? 0.5 : 1
                                }}
                                title="Satırı Sil"
                              >
                                <i className="fas fa-trash" style={{ fontSize: "0.7rem" }}></i>
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                      
                      {isEditing && (
                        <div style={{
                          padding: "12px 15px",
                          backgroundColor: "#1e293b",
                          borderTop: "2px solid #475569",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center"
                        }}>
                          <div style={{
                            fontSize: "0.85rem",
                            color: "#94a3b8"
                          }}>
                            <i className="fas fa-info-circle" style={{ marginRight: "5px" }}></i>
                            Malzemeler ürün ağacından otomatik yüklenir. Malzeme değiştirmek için üstteki malzeme alanını kullanın.
                          </div>
                        </div>
                      )}
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
                      <i className="fas fa-box" style={{ fontSize: "2rem", marginBottom: "10px" }}></i>
                      <p>Bu üretim emrine ait malzeme bulunamadı.</p>
                      {isEditing && (
                        <div style={{
                          marginTop: "15px",
                          fontSize: "0.85rem",
                          color: "#f59e0b"
                        }}>
                          <i className="fas fa-exclamation-triangle"></i>
                          Malzeme seçildiğinde ürün ağacı otomatik olarak yüklenecektir.
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {activeTab === "Notlar" && (
                <div>
                  <label style={labelStyle}>Notlar</label>
                  {isEditing ? (
                    <textarea
                      value={editingOrder.noteText || ''}
                      onChange={(e) => handleEditingOrderChange('noteText', e.target.value)}
                      rows={5}
                      style={{
                        ...inputStyle,
                        resize: "vertical"
                      }}
                      placeholder="Üretim emri ile ilgili notlar..."
                    />
                  ) : (
                    <div style={{ 
                      padding: "12px", 
                      backgroundColor: "rgba(30, 41, 59, 0.5)",
                      borderRadius: "4px",
                      color: "#f1f5f9",
                      minHeight: "100px",
                      whiteSpace: "pre-wrap"
                    }}>
                      {editingOrder.noteText || 'Not bulunmuyor.'}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* İş emri seçilmediğinde */}
        {!selectedOrder && !isCreatingNewOrder && (
          <div style={{
            background: "#1e293b",
            borderRadius: "12px",
            padding: "40px 20px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
            border: "1px solid #334155",
            textAlign: "center",
            color: "#94a3b8",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "300px"
          }}>
            <i className="fas fa-industry" style={{ fontSize: "2.5rem", marginBottom: "15px", color: "#64748b" }}></i>
            <p style={{ marginBottom: "20px", fontSize: "0.95rem" }}>
              {orders.length === 0 ? 
                "Henüz üretim emri bulunmuyor. Yeni bir iş emri oluşturun." : 
                "Düzenlemek için soldaki listeden bir üretim emri seçin."}
            </p>
            <button
              onClick={() => setIsCreatingNewOrder(true)}
              style={{
                background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
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
              <i className="fas fa-plus"></i>
              <span>Yeni İş Emri Oluştur</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}