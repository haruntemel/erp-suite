import { useState, useEffect } from "react";
import SearchList from "./../../components/SearchList";
import { ChevronRightIcon } from "@heroicons/react/24/outline";

interface CustomerOrder {
  id: number;
  orderNo: string;
  customerId: string;
  customerName: string;
  orderDate: string;
  deliveryDate: string;
  status: string;
  totalAmount: number;
  currency: string;
  paymentMethod: string;
  shippingAddress?: string;
  billingAddress?: string;
  notes?: string;
  createdBy: string;
  createdAt: string;
  rowversion: number;
  rowkey: string;
}

interface OrderLine {
  id: number;
  orderId: number;
  lineNo: number;
  partNo: string;
  description: string;
  quantity: number;
  unitPrice: number;
  unit: string;
  taxRate: number;
  taxAmount: number;
  lineTotal: number;
  deliveryDate: string;
  status: string;
  notes?: string;
}

interface ShippingInfo {
  id: number;
  orderId: number;
  shippingMethod: string;
  carrier?: string;
  trackingNo?: string;
  shippingAddress: string;
  shippingCity: string;
  shippingCountry: string;
  shippingZipCode?: string;
  contactPerson?: string;
  contactPhone?: string;
  estimatedDelivery: string;
  actualDelivery?: string;
  shippingCost: number;
  notes?: string;
}

interface CustomerOrderUpdateDto {
  customerName?: string;
  deliveryDate?: string;
  status?: string;
  totalAmount?: number;
  paymentMethod?: string;
  shippingAddress?: string;
  billingAddress?: string;
  notes?: string;
  rowversion: number;
}

const tabs = ["Satış Sipariş Satırları", "Taşıma Bilgileri"];

export default function CustomerOrderPage() {
  const [activeTab, setActiveTab] = useState("Satış Sipariş Satırları");
  
  // SearchList'ten seçilen sipariş state'i
  const [selectedOrder, setSelectedOrder] = useState<CustomerOrder | null>(null);
  const [isSearchListVisible, setIsSearchListVisible] = useState(false);

  // YENİ: Yeni sipariş oluşturma modu
  const [isCreatingNewOrder, setIsCreatingNewOrder] = useState(false);

  // Yeni sipariş formu state'leri
  const [newOrderData, setNewOrderData] = useState({
    orderNo: `ORD${String(Math.floor(Math.random() * 10000)).padStart(5, '0')}`,
    customerId: "",
    customerName: "",
    orderDate: new Date().toISOString().split('T')[0],
    deliveryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    currency: "TRY",
    paymentMethod: "HAVALE",
    shippingAddress: "",
    billingAddress: "",
    notes: ""
  });

  const [newOrderLines, setNewOrderLines] = useState<OrderLine[]>([
    {
      id: 1,
      orderId: 0,
      lineNo: 1,
      partNo: "",
      description: "",
      quantity: 1,
      unitPrice: 0,
      unit: "ADET",
      taxRate: 18,
      taxAmount: 0,
      lineTotal: 0,
      deliveryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: "BEKLIYOR"
    }
  ]);

  // PostgreSQL'den gelen sipariş verileri
  const [customerOrders, setCustomerOrders] = useState<CustomerOrder[]>([]);
  const [orderLines, setOrderLines] = useState<OrderLine[]>([]);
  const [shippingInfo, setShippingInfo] = useState<ShippingInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Düzenlenen sipariş bilgileri
  const [editingOrderData, setEditingOrderData] = useState({
    orderNo: "",
    customerName: "",
    deliveryDate: ""
  });

  // PostgreSQL'den sipariş verilerini çek
  useEffect(() => {
    fetchCustomerOrders();
  }, []);

  useEffect(() => {
    if (selectedOrder && !isCreatingNewOrder) {
      setEditingOrderData({
        orderNo: selectedOrder.orderNo,
        customerName: selectedOrder.customerName,
        deliveryDate: selectedOrder.deliveryDate
      });
      
      // Bu siparişe ait satırları ve taşıma bilgilerini yükle
      fetchOrderLines(selectedOrder.id);
      fetchShippingInfo(selectedOrder.id);
    } else {
      setOrderLines([]);
      setShippingInfo(null);
    }
  }, [selectedOrder, isCreatingNewOrder]);

  const fetchCustomerOrders = async () => {
    try {
      setLoading(true);
      // API endpoint'i - Gerçek endpoint'i yazın
      const response = await fetch('http://localhost:5217/api/customerorder');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      const formattedOrders: CustomerOrder[] = data.map((order: any, index: number) => ({
        id: order.id || index + 1,
        orderNo: order.orderNo || `ORD${String(index + 1).padStart(5, '0')}`,
        customerId: order.customerId || "",
        customerName: order.customerName || "Müşteri Adı",
        orderDate: order.orderDate || new Date().toISOString().split('T')[0],
        deliveryDate: order.deliveryDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        status: order.status || "BEKLIYOR",
        totalAmount: order.totalAmount || 0,
        currency: order.currency || "TRY",
        paymentMethod: order.paymentMethod || "HAVALE",
        shippingAddress: order.shippingAddress,
        billingAddress: order.billingAddress,
        notes: order.notes,
        createdBy: order.createdBy || "admin",
        createdAt: order.createdAt || new Date().toISOString(),
        rowversion: order.rowversion || 1,
        rowkey: order.rowkey || ""
      }));
      
      setCustomerOrders(formattedOrders);
      setError(null);
    } catch (err) {
      console.error("Sipariş verileri çekilirken hata:", err);
      setError(err instanceof Error ? err.message : "Bilinmeyen bir hata oluştu");
      setCustomerOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrderLines = async (orderId: number) => {
    try {
      // API endpoint'i - Gerçek endpoint'i yazın
      const response = await fetch(`http://localhost:5217/api/customerorder/${orderId}/lines`);
      
      if (response.ok) {
        const data = await response.json();
        setOrderLines(data);
      }
    } catch (err) {
      console.error("Sipariş satırları çekilirken hata:", err);
      setOrderLines([]);
    }
  };

  const fetchShippingInfo = async (orderId: number) => {
    try {
      // API endpoint'i - Gerçek endpoint'i yazın
      const response = await fetch(`http://localhost:5217/api/customerorder/${orderId}/shipping`);
      
      if (response.ok) {
        const data = await response.json();
        setShippingInfo(data);
      } else {
        setShippingInfo(null);
      }
    } catch (err) {
      console.error("Taşıma bilgileri çekilirken hata:", err);
      setShippingInfo(null);
    }
  };

  const searchListItems = customerOrders.map(order => ({
    id: order.id,
    code: order.orderNo,
    name: order.customerName,
    description: `Tutar: ${order.totalAmount.toFixed(2)} ${order.currency} - Durum: ${order.status}`,
    originalData: order
  }));

  const handleOrderSelect = (item: any) => {
    const selected = customerOrders.find(o => o.id === item.id);
    if (selected) {
      setSelectedOrder(selected);
      setEditingOrderData({
        orderNo: selected.orderNo,
        customerName: selected.customerName,
        deliveryDate: selected.deliveryDate
      });
      setIsCreatingNewOrder(false); // Yeni sipariş modundan çık
    }
  };

  const handleToggleSearchList = () => {
    setIsSearchListVisible(!isSearchListVisible);
  };

  // Yeni sipariş formu işlemleri
  const handleNewOrderDataChange = (field: string, value: any) => {
    setNewOrderData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNewOrderLineChange = (index: number, field: keyof OrderLine, value: any) => {
    const updatedLines = [...newOrderLines];
    updatedLines[index] = {
      ...updatedLines[index],
      [field]: field === 'quantity' || field === 'unitPrice' || field === 'taxRate' 
        ? parseFloat(value) || 0 
        : value
    };

    // Otomatik hesaplama
    if (field === 'quantity' || field === 'unitPrice' || field === 'taxRate') {
      const line = updatedLines[index];
      line.taxAmount = (line.quantity * line.unitPrice * line.taxRate) / 100;
      line.lineTotal = (line.quantity * line.unitPrice) + line.taxAmount;
    }

    setNewOrderLines(updatedLines);
  };

  const addNewOrderLine = () => {
    const newLine: OrderLine = {
      id: newOrderLines.length + 1,
      orderId: 0,
      lineNo: newOrderLines.length + 1,
      partNo: "",
      description: "",
      quantity: 1,
      unitPrice: 0,
      unit: "ADET",
      taxRate: 18,
      taxAmount: 0,
      lineTotal: 0,
      deliveryDate: newOrderData.deliveryDate,
      status: "BEKLIYOR"
    };
    setNewOrderLines([...newOrderLines, newLine]);
  };

  const removeNewOrderLine = (index: number) => {
    if (newOrderLines.length > 1) {
      const updatedLines = newOrderLines.filter((_, i) => i !== index);
      // Satır numaralarını güncelle
      const renumberedLines = updatedLines.map((line, idx) => ({
        ...line,
        lineNo: idx + 1
      }));
      setNewOrderLines(renumberedLines);
    }
  };

  const calculateNewOrderTotals = () => {
    const subtotal = newOrderLines.reduce((sum, line) => sum + (line.quantity * line.unitPrice), 0);
    const taxTotal = newOrderLines.reduce((sum, line) => sum + line.taxAmount, 0);
    const grandTotal = subtotal + taxTotal;
    return { subtotal, taxTotal, grandTotal };
  };

  const handleCreateNewOrder = () => {
    const { grandTotal } = calculateNewOrderTotals();
    
    const newOrder: CustomerOrder = {
      id: Math.floor(Math.random() * 1000) + 100,
      orderNo: newOrderData.orderNo,
      customerId: newOrderData.customerId,
      customerName: newOrderData.customerName,
      orderDate: newOrderData.orderDate,
      deliveryDate: newOrderData.deliveryDate,
      status: "BEKLIYOR",
      totalAmount: grandTotal,
      currency: newOrderData.currency,
      paymentMethod: newOrderData.paymentMethod,
      shippingAddress: newOrderData.shippingAddress,
      billingAddress: newOrderData.billingAddress,
      notes: newOrderData.notes,
      createdBy: "admin",
      createdAt: new Date().toISOString(),
      rowversion: 1,
      rowkey: `new-order-${Date.now()}`
    };

    // State'i güncelle
    setCustomerOrders(prev => [newOrder, ...prev]);
    setSelectedOrder(newOrder);
    setIsCreatingNewOrder(false);
    
    // Formu sıfırla
    setNewOrderData({
      orderNo: `ORD${String(Math.floor(Math.random() * 10000)).padStart(5, '0')}`,
      customerId: "",
      customerName: "",
      orderDate: new Date().toISOString().split('T')[0],
      deliveryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      currency: "TRY",
      paymentMethod: "HAVALE",
      shippingAddress: "",
      billingAddress: "",
      notes: ""
    });
    
    setNewOrderLines([
      {
        id: 1,
        orderId: 0,
        lineNo: 1,
        partNo: "",
        description: "",
        quantity: 1,
        unitPrice: 0,
        unit: "ADET",
        taxRate: 18,
        taxAmount: 0,
        lineTotal: 0,
        deliveryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        status: "BEKLIYOR"
      }
    ]);

    alert(`Yeni sipariş oluşturuldu: ${newOrder.orderNo}`);
  };

  const handleCancelNewOrder = () => {
    setIsCreatingNewOrder(false);
    setNewOrderData({
      orderNo: `ORD${String(Math.floor(Math.random() * 10000)).padStart(5, '0')}`,
      customerId: "",
      customerName: "",
      orderDate: new Date().toISOString().split('T')[0],
      deliveryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      currency: "TRY",
      paymentMethod: "HAVALE",
      shippingAddress: "",
      billingAddress: "",
      notes: ""
    });
    setNewOrderLines([
      {
        id: 1,
        orderId: 0,
        lineNo: 1,
        partNo: "",
        description: "",
        quantity: 1,
        unitPrice: 0,
        unit: "ADET",
        taxRate: 18,
        taxAmount: 0,
        lineTotal: 0,
        deliveryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        status: "BEKLIYOR"
      }
    ]);
  };

  // Yeni sipariş modunda mıyız kontrolü
  if (isCreatingNewOrder) {
    const { subtotal, taxTotal, grandTotal } = calculateNewOrderTotals();

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
            title="Satış Sipariş Arama"
            items={searchListItems}
            onSelect={handleOrderSelect}
            onToggle={handleToggleSearchList}
            searchFields={["code", "name", "description"]}
            displayFields={["code", "name"]}
            icon="fas fa-shopping-cart"
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

        {/* ANA EKRAN - YENİ SİPARİŞ OLUŞTURMA */}
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
                <h2 style={{ margin: 0, color: "#f1f5f9", fontSize: "1.3rem" }}>Yeni Satış Siparişi</h2>
                <p style={{ margin: "4px 0 0 0", color: "#94a3b8", fontSize: "0.85rem" }}>
                  Sipariş No: <strong>{newOrderData.orderNo}</strong>
                </p>
              </div>
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
                <span>Yeni bir satış siparişi oluşturuyorsunuz. Lütfen tüm gerekli alanları doldurun.</span>
              </div>
            </div>
          </div>

          {/* Sipariş Bilgileri */}
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
              Sipariş Bilgileri
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
                <label style={{ fontSize: "0.85rem", color: "#94a3b8", marginBottom: "5px", display: "block" }}>
                  Sipariş No <span style={{ color: "#ef4444" }}>*</span>
                </label>
                <input
                  type="text"
                  value={newOrderData.orderNo}
                  onChange={(e) => handleNewOrderDataChange('orderNo', e.target.value)}
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    backgroundColor: "rgba(30, 41, 59, 0.8)",
                    border: "1px solid #38bdf8",
                    borderRadius: "6px",
                    color: "#f1f5f9",
                    fontSize: "0.9rem"
                  }}
                />
              </div>
              <div>
                <label style={{ fontSize: "0.85rem", color: "#94a3b8", marginBottom: "5px", display: "block" }}>
                  Müşteri Adı <span style={{ color: "#ef4444" }}>*</span>
                </label>
                <input
                  type="text"
                  value={newOrderData.customerName}
                  onChange={(e) => handleNewOrderDataChange('customerName', e.target.value)}
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    backgroundColor: "rgba(30, 41, 59, 0.8)",
                    border: "1px solid #38bdf8",
                    borderRadius: "6px",
                    color: "#f1f5f9",
                    fontSize: "0.9rem"
                  }}
                  placeholder="Müşteri adı girin"
                />
              </div>
              <div>
                <label style={{ fontSize: "0.85rem", color: "#94a3b8", marginBottom: "5px", display: "block" }}>
                  Sipariş Tarihi
                </label>
                <input
                  type="date"
                  value={newOrderData.orderDate}
                  onChange={(e) => handleNewOrderDataChange('orderDate', e.target.value)}
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    backgroundColor: "rgba(30, 41, 59, 0.8)",
                    border: "1px solid #38bdf8",
                    borderRadius: "6px",
                    color: "#f1f5f9",
                    fontSize: "0.9rem"
                  }}
                />
              </div>
              <div>
                <label style={{ fontSize: "0.85rem", color: "#94a3b8", marginBottom: "5px", display: "block" }}>
                  Teslimat Tarihi
                </label>
                <input
                  type="date"
                  value={newOrderData.deliveryDate}
                  onChange={(e) => handleNewOrderDataChange('deliveryDate', e.target.value)}
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    backgroundColor: "rgba(30, 41, 59, 0.8)",
                    border: "1px solid #38bdf8",
                    borderRadius: "6px",
                    color: "#f1f5f9",
                    fontSize: "0.9rem"
                  }}
                />
              </div>
              <div>
                <label style={{ fontSize: "0.85rem", color: "#94a3b8", marginBottom: "5px", display: "block" }}>Para Birimi</label>
                <select
                  value={newOrderData.currency}
                  onChange={(e) => handleNewOrderDataChange('currency', e.target.value)}
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    backgroundColor: "rgba(30, 41, 59, 0.8)",
                    border: "1px solid #38bdf8",
                    borderRadius: "6px",
                    color: "#f1f5f9",
                    fontSize: "0.9rem"
                  }}
                >
                  <option value="TRY">TRY (₺)</option>
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: "0.85rem", color: "#94a3b8", marginBottom: "5px", display: "block" }}>Ödeme Yöntemi</label>
                <select
                  value={newOrderData.paymentMethod}
                  onChange={(e) => handleNewOrderDataChange('paymentMethod', e.target.value)}
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    backgroundColor: "rgba(30, 41, 59, 0.8)",
                    border: "1px solid #38bdf8",
                    borderRadius: "6px",
                    color: "#f1f5f9",
                    fontSize: "0.9rem"
                  }}
                >
                  <option value="HAVALE">Havale/EFT</option>
                  <option value="KREDI_KARTI">Kredi Kartı</option>
                  <option value="NAKIT">Nakit</option>
                  <option value="CEK">Çek</option>
                </select>
              </div>
            </div>

            {/* Adres Bilgileri */}
            <div style={{ marginTop: "20px" }}>
              <h4 style={{ 
                color: "#f1f5f9", 
                fontSize: "0.95rem", 
                marginBottom: "15px",
                display: "flex",
                alignItems: "center",
                gap: "8px"
              }}>
                <i className="fas fa-map-marker-alt" style={{ color: "#8b5cf6" }}></i>
                Adres Bilgileri
              </h4>
              
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
                  <label style={{ fontSize: "0.85rem", color: "#94a3b8", marginBottom: "5px", display: "block" }}>
                    Sevk Adresi
                  </label>
                  <textarea
                    value={newOrderData.shippingAddress}
                    onChange={(e) => handleNewOrderDataChange('shippingAddress', e.target.value)}
                    rows={2}
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      backgroundColor: "rgba(30, 41, 59, 0.8)",
                      border: "1px solid #8b5cf6",
                      borderRadius: "6px",
                      color: "#f1f5f9",
                      fontSize: "0.9rem",
                      resize: "vertical"
                    }}
                    placeholder="Sevk edilecek adres"
                  />
                </div>
                <div>
                  <label style={{ fontSize: "0.85rem", color: "#94a3b8", marginBottom: "5px", display: "block" }}>
                    Fatura Adresi
                  </label>
                  <textarea
                    value={newOrderData.billingAddress}
                    onChange={(e) => handleNewOrderDataChange('billingAddress', e.target.value)}
                    rows={2}
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      backgroundColor: "rgba(30, 41, 59, 0.8)",
                      border: "1px solid #8b5cf6",
                      borderRadius: "6px",
                      color: "#f1f5f9",
                      fontSize: "0.9rem",
                      resize: "vertical"
                    }}
                    placeholder="Fatura adresi"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Sipariş Satırları */}
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
                <i className="fas fa-list" style={{ color: "#f59e0b" }}></i>
                Sipariş Satırları
              </h3>
              <button
                onClick={addNewOrderLine}
                style={{
                  background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
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
                <span>Yeni Satır Ekle</span>
              </button>
            </div>

            {/* Data Grid View */}
            <div style={{
              backgroundColor: "rgba(30, 41, 59, 0.3)",
              borderRadius: "8px",
              overflow: "hidden",
              border: "1px solid #334155",
              maxHeight: "300px",
              overflowY: "auto"
            }}>
              {/* Grid Header */}
              <div style={{
                display: "grid",
                gridTemplateColumns: "50px 120px 2fr 100px 80px 120px 100px 120px 120px 60px",
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
                <div>Malzeme</div>
                <div>Açıklama</div>
                <div>Miktar</div>
                <div>Birim</div>
                <div>Birim Fiyat</div>
                <div>KDV %</div>
                <div>KDV Tutarı</div>
                <div>Toplam</div>
                <div>Sil</div>
              </div>

              {/* Grid Body */}
              <div>
                {newOrderLines.map((line, index) => (
                  <div
                    key={line.id}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "50px 120px 2fr 100px 80px 120px 100px 120px 120px 60px",
                      padding: "10px 15px",
                      borderBottom: "1px solid #334155",
                      fontSize: "0.85rem",
                      color: "#f1f5f9",
                      backgroundColor: index % 2 === 0 ? "rgba(30, 41, 59, 0.5)" : "rgba(30, 41, 59, 0.3)",
                      alignItems: "center"
                    }}
                  >
                    <div>{line.lineNo}</div>
                    <div>
                      <input
                        type="text"
                        value={line.partNo}
                        onChange={(e) => handleNewOrderLineChange(index, 'partNo', e.target.value)}
                        style={{
                          width: "100%",
                          padding: "6px 8px",
                          backgroundColor: "rgba(30, 41, 59, 0.8)",
                          border: "1px solid #475569",
                          borderRadius: "4px",
                          color: "#f1f5f9",
                          fontSize: "0.85rem"
                        }}
                        placeholder="PART001"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        value={line.description}
                        onChange={(e) => handleNewOrderLineChange(index, 'description', e.target.value)}
                        style={{
                          width: "100%",
                          padding: "6px 8px",
                          backgroundColor: "rgba(30, 41, 59, 0.8)",
                          border: "1px solid #475569",
                          borderRadius: "4px",
                          color: "#f1f5f9",
                          fontSize: "0.85rem"
                        }}
                        placeholder="Açıklama"
                      />
                    </div>
                    <div>
                      <input
                        type="number"
                        value={line.quantity}
                        onChange={(e) => handleNewOrderLineChange(index, 'quantity', e.target.value)}
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
                    <div>
                      <select
                        value={line.unit}
                        onChange={(e) => handleNewOrderLineChange(index, 'unit', e.target.value)}
                        style={{
                          width: "100%",
                          padding: "6px 8px",
                          backgroundColor: "rgba(30, 41, 59, 0.8)",
                          border: "1px solid #475569",
                          borderRadius: "4px",
                          color: "#f1f5f9",
                          fontSize: "0.85rem"
                        }}
                      >
                        <option value="ADET">Adet</option>
                        <option value="KG">Kilogram</option>
                        <option value="LT">Litre</option>
                        <option value="MT">Metre</option>
                      </select>
                    </div>
                    <div>
                      <input
                        type="number"
                        value={line.unitPrice}
                        onChange={(e) => handleNewOrderLineChange(index, 'unitPrice', e.target.value)}
                        style={{
                          width: "100%",
                          padding: "6px 8px",
                          backgroundColor: "rgba(30, 41,59, 0.8)",
                          border: "1px solid #475569",
                          borderRadius: "4px",
                          color: "#f1f5f9",
                          fontSize: "0.85rem"
                        }}
                        min="0"
                        step="0.01"
                      />
                    </div>
                    <div>
                      <input
                        type="number"
                        value={line.taxRate}
                        onChange={(e) => handleNewOrderLineChange(index, 'taxRate', e.target.value)}
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
                        max="100"
                        step="1"
                      />
                    </div>
                    <div style={{ color: "#ef4444", textAlign: "right", paddingRight: "10px" }}>
                      {line.taxAmount.toFixed(2)} {newOrderData.currency}
                    </div>
                    <div style={{ color: "#10b981", fontWeight: "600", textAlign: "right", paddingRight: "10px" }}>
                      {line.lineTotal.toFixed(2)} {newOrderData.currency}
                    </div>
                    <div style={{ textAlign: "center" }}>
                      <button
                        onClick={() => removeNewOrderLine(index)}
                        disabled={newOrderLines.length <= 1}
                        style={{
                          background: newOrderLines.length <= 1 ? "#64748b" : "#ef4444",
                          color: "white",
                          border: "none",
                          borderRadius: "4px",
                          width: "28px",
                          height: "28px",
                          cursor: newOrderLines.length <= 1 ? "not-allowed" : "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          opacity: newOrderLines.length <= 1 ? 0.5 : 1
                        }}
                        title="Satırı Sil"
                      >
                        <i className="fas fa-trash" style={{ fontSize: "0.7rem" }}></i>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Grid Footer - Toplamlar */}
              <div style={{
                display: "grid",
                gridTemplateColumns: "50px 120px 2fr 100px 80px 120px 100px 120px 120px 60px",
                padding: "12px 15px",
                backgroundColor: "#1e293b",
                borderTop: "2px solid #475569",
                fontSize: "0.9rem",
                fontWeight: "600",
                color: "#f1f5f9"
              }}>
                <div colSpan={6} style={{ gridColumn: "1 / 7", textAlign: "right", paddingRight: "10px" }}>
                  TOPLAMLAR:
                </div>
                <div style={{ color: "#ef4444", textAlign: "right", paddingRight: "10px" }}>
                  {taxTotal.toFixed(2)} {newOrderData.currency}
                </div>
                <div style={{ color: "#10b981", fontSize: "1rem", textAlign: "right", paddingRight: "10px" }}>
                  {grandTotal.toFixed(2)} {newOrderData.currency}
                </div>
                <div></div>
              </div>
            </div>
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
              value={newOrderData.notes}
              onChange={(e) => handleNewOrderDataChange('notes', e.target.value)}
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
              placeholder="Sipariş ile ilgili ek notlar..."
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
                  gap: "8px",
                  transition: "all 0.2s"
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#475569"}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = "#64748b"}
              >
                <i className="fas fa-times"></i>
                <span>İptal</span>
              </button>
              <button
                onClick={handleCreateNewOrder}
                disabled={!newOrderData.customerName || !newOrderData.orderNo}
                style={{
                  background: !newOrderData.customerName || !newOrderData.orderNo 
                    ? "#475569" 
                    : "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  padding: "10px 25px",
                  fontSize: "0.9rem",
                  cursor: !newOrderData.customerName || !newOrderData.orderNo ? "not-allowed" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  opacity: !newOrderData.customerName || !newOrderData.orderNo ? 0.6 : 1
                }}
              >
                <i className="fas fa-check"></i>
                <span>Siparişi Oluştur</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // NORMAL EKRAN - Sipariş Listeleme ve Düzenleme
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
          title="Satış Sipariş Arama"
          items={searchListItems}
          onSelect={handleOrderSelect}
          onToggle={handleToggleSearchList}
          searchFields={["code", "name", "description"]}
          displayFields={["code", "name"]}
          icon="fas fa-shopping-cart"
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
              backgroundColor: "#f59e0b",
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
              <i className="fas fa-shopping-cart"></i>
            </div>
            <div style={{ 
              fontSize: "1.3rem",
              color: "#f59e0b",
              marginLeft: "12px",
              fontWeight: "600",
              flex: 1,
              minWidth: "200px"
            }}>
              Satış Sipariş Yönetimi
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
                  transition: "all 0.3s",
                  flexShrink: 0
                }}
              >
                <i className="fas fa-search"></i>
                <span>{isSearchListVisible ? "Listeyi Gizle" : "Listeyi Göster"}</span>
              </button>
              
              {/* YENİ SİPARİŞ BUTONU - DEĞİŞTİ: doğrudana ana ekranı değiştiriyor */}
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
                <span>Yeni Sipariş</span>
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
            borderLeft: selectedOrder ? "3px solid #10b981" : "3px solid #f59e0b",
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
                ) : customerOrders.length === 0 ? (
                  <span>Veritabanında satış siparişi bulunamadı.</span>
                ) : selectedOrder ? (
                  `"${selectedOrder.orderNo} - ${selectedOrder.customerName}" siparişinin bilgilerini düzenleyin.`
                ) : (
                  "Düzenlemek için soldaki listeden bir sipariş seçin veya 'Yeni Sipariş' butonuna tıklayın."
                )}
              </div>
              {selectedOrder && (
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
                  <span>Seçili: <strong>{selectedOrder.orderNo}</strong></span>
                  <span style={{ marginLeft: "8px", color: "#f59e0b" }}>
                    <i className="fas fa-coins" style={{ marginRight: "4px" }}></i>
                    {selectedOrder.totalAmount.toFixed(2)} {selectedOrder.currency}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Normal sipariş listeleme ve düzenleme ekranı buraya gelecek */}
        {/* ... mevcut normal ekran içeriği ... */}
        
        <div style={{
          background: "#1e293b",
          borderRadius: "12px",
          padding: "20px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
          border: "1px solid #334155",
          textAlign: "center",
          color: "#94a3b8",
          minHeight: "300px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center"
        }}>
          <i className="fas fa-shopping-cart" style={{ fontSize: "2.5rem", marginBottom: "10px", color: "#64748b" }}></i>
          <p>{selectedOrder ? "Sipariş detayları burada gösterilecek" : "Bir sipariş seçin veya yeni sipariş oluşturun"}</p>
          {!selectedOrder && (
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
                gap: "8px",
                marginTop: "15px"
              }}
            >
              <i className="fas fa-plus"></i>
              <span>Yeni Sipariş Oluştur</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}