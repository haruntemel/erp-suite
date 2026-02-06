// src/modules/sales/SaleOrderLines.tsx

import { useState, useEffect, useCallback } from "react";

// API'den gelen veri yapısı - Sipariş Başlığı
interface CustomerOrderApiResponse {
  orderNo: string;
  company: string;
  contract: string;
  customerNo: string;
  customerPoNo: string | null;
  salesmanCode: string | null;
  authorizeCode: string | null;
  paidAmount: number | null;
}

// API'den gelen veri yapısı - Müşteri
interface CustomerApiResponse {
  customerId: string;
  name: string;
  associationNo?: string;
  corporateForm?: string;
  country?: string;
  partyType?: string;
  category?: string;
  checkLimit?: string;
  limitControlType?: string;
  defaultLanguage?: string;
  identifierReference?: string;
  rowversion?: number;
  rowkey?: string;
  creationDate?: string;
  createdBy?: string;
  changedBy?: string;
}

// API'den gelen veri yapısı - Sipariş Satırı
interface CustomerOrderLineApiResponse {
  orderNo: string;
  company: string;
  contract: string;
  lineNo: string;
  relNo: string;
  catalogNo: string | null;
  partNo: string;
  customerPartNo: string | null;
  catalogDesc: string | null;
  buyQtyDue: number | null;
  customerPartBuyQty: number | null;
  baseSaleUnitPrice: number | null;
  saleUnitPrice: number | null;
  unitPriceInclTax: number | null;
  salesUnitMeas: string | null;
  priceUnitMeas: string | null;
  discount: number | null;
  additionalDiscount: number | null;
  priceConvFactor: number;
  customerPartConvFactor: number | null;
  dateEntered: string;
  plannedDeliveryDate: string | null;
  promisedDeliveryDate: string | null;
  wantedDeliveryDate: string | null;
  deliveryType: string | null;
  taxCode: string | null;
  noteText: string | null;
  customerNo: string;
  forwardAgentId: string | null;
  shipViaCode: string | null;
  deliveryTerms: string | null;
  projectId: string | null;
  freeOfCharge: string | null;
  rowstate: string | null;
  rowversion: number;
  rowkey: string;
}

// View için kullanacağımız interface
interface OrderLineView {
  orderNo: string;
  company: string;
  contract: string;
  lineNo: string;
  relNo: string;
  partNo: string;
  catalogDesc: string;
  customerNo: string;
  customerName: string;
  buyQtyDue: number;
  saleUnitPrice: number;
  lineTotal: number;
  dateEntered: string;
  wantedDeliveryDate: string | null;
  rowstate: string;
  rowkey: string;
  customerPoNo: string;
  salesmanCode: string;
  authorizeCode: string;
  paidAmount: number;
}

// Sütun tipi
interface TableColumn {
  key: string;
  label: string;
  width: string;
  align?: 'left' | 'center' | 'right';
}

export default function SaleOrderLinesPage() {
  const [orderLines, setOrderLines] = useState<OrderLineView[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<keyof OrderLineView>("dateEntered");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [selectedRow, setSelectedRow] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // Sütun yapılandırması
  const columns: TableColumn[] = [
    { key: "orderNo", label: "Sipariş No", width: "120px", align: "left" },
    { key: "customerNo", label: "Müşteri No", width: "100px", align: "left" },
    { key: "customerName", label: "Müşteri Adı", width: "150px", align: "left" },
    { key: "customerPoNo", label: "Müşteri Sipariş No", width: "120px", align: "left" },
    { key: "salesmanCode", label: "Satış Personeli", width: "100px", align: "left" },
    { key: "authorizeCode", label: "Koordinatör", width: "100px", align: "left" },
    { key: "partNo", label: "Malzeme No", width: "120px", align: "left" },
    { key: "catalogDesc", label: "Açıklama", width: "200px", align: "left" },
    { key: "buyQtyDue", label: "Miktar", width: "80px", align: "right" },
    { key: "saleUnitPrice", label: "Birim Fiyat", width: "100px", align: "right" },
    { key: "lineTotal", label: "Toplam", width: "120px", align: "right" },
    { key: "paidAmount", label: "Ödenen Tutar", width: "100px", align: "right" },
    { key: "dateEntered", label: "Sipariş Tarihi", width: "120px", align: "left" },
    { key: "wantedDeliveryDate", label: "Teslimat Tarihi", width: "120px", align: "left" },
    { key: "rowstate", label: "Durum", width: "100px", align: "center" },
    { key: "actions", label: "İşlemler", width: "80px", align: "center" }
  ];

  // Müşterileri çek
  const fetchCustomers = useCallback(async () => {
    try {
      const response = await fetch('/api/customer');
      
      if (!response.ok) {
        throw new Error(`Müşteri API hatası: ${response.status} ${response.statusText}`);
      }
      
      const customersData: CustomerApiResponse[] = await response.json();
      
      // Müşterileri Map'e dönüştür (customerId -> CustomerApiResponse)
      const customersMap = new Map<string, CustomerApiResponse>();
      customersData.forEach(customer => {
        // CustomerId kontrol et (büyük/küçük harf duyarlılığı için)
        const customerId = customer.customerId || 
                         (customer as any).CustomerId || 
                         (customer as any).customer_id ||
                         (customer as any).customerNo;
        
        if (customerId && customer.name) {
          customersMap.set(customerId, {
            ...customer,
            customerId: customerId // Standardize et
          });
        }
      });
      
      return customersMap;
      
    } catch (err) {
      console.error("Müşteriler çekilirken hata:", err);
      throw err;
    }
  }, []);

  // Sipariş başlıklarını çek
  const fetchOrders = useCallback(async () => {
    try {
      const response = await fetch('/api/customerorder');
      
      if (!response.ok) {
        throw new Error(`Sipariş başlığı API hatası: ${response.status} ${response.statusText}`);
      }
      
      const ordersData: CustomerOrderApiResponse[] = await response.json();
      
      // Sipariş başlıklarını Map'e dönüştür (company-orderNo-contract -> CustomerOrderApiResponse)
      const ordersMap = new Map<string, CustomerOrderApiResponse>();
      ordersData.forEach(order => {
        const key = `${order.company}-${order.orderNo}-${order.contract}`;
        ordersMap.set(key, order);
      });
      
      return ordersMap;
      
    } catch (err) {
      console.error("Sipariş başlıkları çekilirken hata:", err);
      throw err;
    }
  }, []);

  // Tüm verileri çek ve birleştir
  const fetchAllData = useCallback(async () => {
    try {
      setLoading(true);
      
      // 1. Önce müşterileri çek
      const customersMap = await fetchCustomers();
      
      // 2. Sipariş başlıklarını çek
      const ordersMap = await fetchOrders();
      
      // 3. Sipariş satırlarını çek
      const response = await fetch('/api/customerorderline/get-all');
      
      if (!response.ok) {
        throw new Error(`Sipariş satırı API hatası: ${response.status} ${response.statusText}`);
      }
      
      const apiData: CustomerOrderLineApiResponse[] = await response.json();
      
      // 4. Verileri birleştir
      const viewData: OrderLineView[] = [];
      
      apiData.forEach((line, index) => {
        // Sipariş başlık bilgilerini bul
        const orderKey = `${line.company}-${line.orderNo}-${line.contract}`;
        const orderInfo = ordersMap.get(orderKey);
        
        // Müşteri bilgilerini bul (customerNo ile)
        const customerNo = line.customerNo || orderInfo?.customerNo || "";
        const customerInfo = customersMap.get(customerNo);
        
        viewData.push({
          orderNo: line.orderNo || "",
          company: line.company || "",
          contract: line.contract || "",
          lineNo: line.lineNo || "",
          relNo: line.relNo || "",
          partNo: line.partNo || "-",
          catalogDesc: line.catalogDesc || line.partNo || "-",
          customerNo: customerNo,
          customerName: customerInfo?.name || customerNo || "-",
          buyQtyDue: line.buyQtyDue || line.customerPartBuyQty || 0,
          saleUnitPrice: line.saleUnitPrice || line.baseSaleUnitPrice || line.unitPriceInclTax || 0,
          lineTotal: (line.buyQtyDue || 0) * (line.saleUnitPrice || 0),
          dateEntered: line.dateEntered || new Date().toISOString().split('T')[0],
          wantedDeliveryDate: line.wantedDeliveryDate,
          rowstate: line.rowstate || "ACTIVE",
          rowkey: line.rowkey || `line-${Date.now()}-${index}`,
          // SİPARİŞ BAŞLIK BİLGİLERİ
          customerPoNo: orderInfo?.customerPoNo || "-",
          salesmanCode: orderInfo?.salesmanCode || "-",
          authorizeCode: orderInfo?.authorizeCode || "-",
          paidAmount: orderInfo?.paidAmount || 0,
        });
      });
      
      setOrderLines(viewData);
      setTotalCount(viewData.length);
      setTotalPages(Math.ceil(viewData.length / pageSize));
      setError(null);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Bilinmeyen bir hata oluştu";
      console.error("Veri çekilirken hata:", err);
      setError(errorMessage);
      setOrderLines([]);
    } finally {
      setLoading(false);
    }
  }, [pageSize, fetchCustomers, fetchOrders]);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  // Arama ve filtreleme
  const filteredLines = orderLines.filter(line => {
    if (!searchTerm) return true;
    
    const term = searchTerm.toLowerCase();
    return (
      line.orderNo.toLowerCase().includes(term) ||
      line.customerNo.toLowerCase().includes(term) ||
      line.customerName.toLowerCase().includes(term) ||
      line.customerPoNo.toLowerCase().includes(term) ||
      line.salesmanCode.toLowerCase().includes(term) ||
      line.authorizeCode.toLowerCase().includes(term) ||
      line.partNo.toLowerCase().includes(term) ||
      line.catalogDesc.toLowerCase().includes(term)
    );
  });

  // Sıralama
  const sortedLines = [...filteredLines].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];
    
    if (aValue == null && bValue == null) return 0;
    if (aValue == null) return sortDirection === 'asc' ? -1 : 1;
    if (bValue == null) return sortDirection === 'asc' ? 1 : -1;
    
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortDirection === 'asc' 
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }
    
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortDirection === 'asc' 
        ? aValue - bValue
        : bValue - aValue;
    }
    
    return 0;
  });

  // Sayfalama
  const paginatedLines = sortedLines.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  // Sütun sıralama
  const handleSort = (field: string) => {
    if (field === 'actions') return;
    
    const orderLineField = field as keyof OrderLineView;
    if (sortField === orderLineField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(orderLineField);
      setSortDirection('asc');
    }
    setPage(1);
  };

  // Üç nokta menüsü tıklama
  const handleMenuClick = (rowkey: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedRow(selectedRow === rowkey ? null : rowkey);
  };

  // Sipariş detayına git
  const goToOrderDetail = useCallback((orderNo: string, company: string, contract: string) => {
    const orderInfo = {
      company,
      orderNo,
      contract,
      timestamp: Date.now(),
      source: 'CustomerOrderLines'
    };
    
    try {
      localStorage.setItem('autoSelectOrder', JSON.stringify(orderInfo));
    } catch (err) {
      console.error('localStorage kayıt hatası:', err);
    }
    
    const params = new URLSearchParams({
      company: company,
      orderNo: orderNo,
      contract: contract,
      fromCustomerOrderLines: 'true'
    });
    
    const targetUrl = `/sales/orders?${params.toString()}`;
    window.location.href = targetUrl;
    
  }, []);

  // Sayfa değiştirme
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Sayfa boyutu değiştirme
  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize);
    setPage(1);
    setTotalPages(Math.ceil(filteredLines.length / newSize));
  };

  // Toplam hesapla
  const calculateTotals = () => {
    const totals = filteredLines.reduce((acc, line) => {
      acc.totalQty += line.buyQtyDue;
      acc.totalAmount += line.lineTotal;
      acc.totalPaid += line.paidAmount;
      return acc;
    }, { totalQty: 0, totalAmount: 0, totalPaid: 0 });
    
    return totals;
  };

  // Durum renkleri
  const getStatusColor = (status: string) => {
    const statusUpper = status?.toUpperCase();
    switch (statusUpper) {
      case 'ACTIVE': return { bg: 'rgba(16, 185, 129, 0.2)', text: '#10b981' };
      case 'CLOSED': return { bg: 'rgba(59, 130, 246, 0.2)', text: '#3b82f6' };
      case 'CANCELLED': return { bg: 'rgba(239, 68, 68, 0.2)', text: '#ef4444' };
      case 'ON_HOLD': return { bg: 'rgba(245, 158, 11, 0.2)', text: '#f59e0b' };
      default: return { bg: 'rgba(148, 163, 184, 0.2)', text: '#94a3b8' };
    }
  };

  const totals = calculateTotals();

  // Loading state
  if (loading) {
    return (
      <div style={{ 
        display: "flex", 
        justifyContent: "center", 
        alignItems: "center", 
        height: "100vh",
        backgroundColor: "#0f172a",
        color: "#f1f5f9"
      }}>
        <div style={{ textAlign: "center" }}>
          <div style={{
            width: "60px",
            height: "60px",
            border: "4px solid rgba(56, 189, 248, 0.3)",
            borderTop: "4px solid #38bdf8",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
            margin: "0 auto 20px"
          }}></div>
          <style>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
          <p style={{ fontSize: "1rem", color: "#94a3b8" }}>Satış sipariş satırları yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      width: "100%", 
      minHeight: "100vh", 
      backgroundColor: "#0f172a",
      color: "#f1f5f9",
      padding: "20px",
      paddingTop: "70px",
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
    }}>
      {/* Header */}
      <div style={{
        background: "#1e293b",
        borderRadius: "12px",
        padding: "20px",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
        border: "1px solid #334155",
        marginBottom: "20px"
      }}>
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "15px",
          flexWrap: "wrap",
          gap: "15px"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ 
              backgroundColor: "#8b5cf6",
              color: "white",
              width: "44px",
              height: "44px",
              borderRadius: "10px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.4rem",
              boxShadow: "0 4px 12px rgba(139, 92, 246, 0.4)"
            }}>
              <i className="fas fa-list"></i>
            </div>
            <div>
              <h1 style={{ 
                margin: 0, 
                color: "#f1f5f9", 
                fontSize: "1.6rem",
                fontWeight: "700" 
              }}>
                Satış Sipariş Satırları
              </h1>
              <p style={{ 
                margin: "5px 0 0 0", 
                color: "#94a3b8", 
                fontSize: "0.9rem",
                display: "flex",
                alignItems: "center",
                gap: "8px"
              }}>
                <i className="fas fa-database"></i>
                <span>Toplam <strong>{totalCount}</strong> satır • Son güncelleme: {new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}</span>
              </p>
            </div>
          </div>
          
          <div style={{ 
            display: "flex", 
            gap: "12px", 
            alignItems: "center",
            flexWrap: "wrap" 
          }}>
            <div style={{ position: "relative" }}>
              <i className="fas fa-search" style={{
                position: "absolute",
                left: "14px",
                top: "50%",
                transform: "translateY(-50%)",
                color: "#64748b",
                fontSize: "0.95rem"
              }}></i>
              <input
                type="text"
                placeholder="Sipariş no, müşteri, PO no, satıcı ara..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setPage(1);
                }}
                style={{
                  padding: "11px 15px 11px 45px",
                  backgroundColor: "rgba(30, 41, 59, 0.8)",
                  border: "1px solid #475569",
                  borderRadius: "8px",
                  color: "#f1f5f9",
                  fontSize: "0.95rem",
                  width: "320px",
                  transition: "all 0.3s ease"
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "#8b5cf6";
                  e.target.style.boxShadow = "0 0 0 3px rgba(139, 92, 246, 0.1)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "#475569";
                  e.target.style.boxShadow = "none";
                }}
              />
            </div>
            
            <button
              onClick={() => fetchAllData()}
              style={{
                background: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
                color: "white",
                border: "none",
                borderRadius: "8px",
                padding: "11px 18px",
                fontSize: "0.95rem",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                fontWeight: "600",
                transition: "all 0.3s ease",
                boxShadow: "0 4px 12px rgba(59, 130, 246, 0.3)"
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 6px 16px rgba(59, 130, 246, 0.4)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(59, 130, 246, 0.3)";
              }}
            >
              <i className="fas fa-sync-alt"></i>
              <span>Yenile</span>
            </button>
          </div>
        </div>
        
        {/* Toplam Bilgileri */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "12px",
          marginTop: "20px",
          padding: "18px",
          backgroundColor: "rgba(30, 41, 59, 0.5)",
          borderRadius: "10px",
          border: "1px solid #334155"
        }}>
          <div style={{ textAlign: "center", padding: "12px" }}>
            <div style={{ fontSize: "0.85rem", color: "#94a3b8", marginBottom: "6px", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
              <i className="fas fa-filter"></i>
              <span>Filtrelenen</span>
            </div>
            <div style={{ fontSize: "1.4rem", fontWeight: "700", color: "#f1f5f9" }}>
              {filteredLines.length}
            </div>
          </div>
          
          <div style={{ textAlign: "center", padding: "12px" }}>
            <div style={{ fontSize: "0.85rem", color: "#94a3b8", marginBottom: "6px", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
              <i className="fas fa-box"></i>
              <span>Toplam Miktar</span>
            </div>
            <div style={{ fontSize: "1.4rem", fontWeight: "700", color: "#10b981" }}>
              {totals.totalQty.toFixed(2)}
            </div>
          </div>
          
          <div style={{ textAlign: "center", padding: "12px" }}>
            <div style={{ fontSize: "0.85rem", color: "#94a3b8", marginBottom: "6px", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
              <i className="fas fa-money-bill-wave"></i>
              <span>Toplam Tutar</span>
            </div>
            <div style={{ fontSize: "1.4rem", fontWeight: "700", color: "#f59e0b" }}>
              {totals.totalAmount.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} TL
            </div>
          </div>
          
          <div style={{ textAlign: "center", padding: "12px" }}>
            <div style={{ fontSize: "0.85rem", color: "#94a3b8", marginBottom: "6px", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
              <i className="fas fa-money-check"></i>
              <span>Toplam Ödenen</span>
            </div>
            <div style={{ fontSize: "1.4rem", fontWeight: "700", color: "#8b5cf6" }}>
              {totals.totalPaid.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} TL
            </div>
          </div>
          
          <div style={{ textAlign: "center", padding: "12px" }}>
            <div style={{ fontSize: "0.85rem", color: "#94a3b8", marginBottom: "6px", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
              <i className="fas fa-percentage"></i>
              <span>Ödeme Oranı</span>
            </div>
            <div style={{ fontSize: "1.4rem", fontWeight: "700", color: "#3b82f6" }}>
              {totals.totalAmount > 0 
                ? `${((totals.totalPaid / totals.totalAmount) * 100).toFixed(1)}%`
                : "0%"}
            </div>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div style={{
          background: "rgba(239, 68, 68, 0.1)",
          border: "1px solid #ef4444",
          borderRadius: "10px",
          padding: "18px",
          marginBottom: "20px",
          color: "#fca5a5"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <i className="fas fa-exclamation-triangle" style={{ fontSize: "1.2rem" }}></i>
            <div>
              <div style={{ fontWeight: "600", fontSize: "1rem" }}>Veri Yükleme Hatası</div>
              <div style={{ marginTop: "4px", fontSize: "0.9rem" }}>{error}</div>
            </div>
          </div>
          <button
            onClick={() => fetchAllData()}
            style={{
              marginTop: "12px",
              background: "#ef4444",
              color: "white",
              border: "none",
              borderRadius: "6px",
              padding: "8px 16px",
              fontSize: "0.9rem",
              cursor: "pointer",
              fontWeight: "600",
              transition: "all 0.2s",
              display: "flex",
              alignItems: "center",
              gap: "8px"
            }}
            onMouseOver={(e) => e.currentTarget.style.opacity = "0.9"}
            onMouseOut={(e) => e.currentTarget.style.opacity = "1"}
          >
            <i className="fas fa-redo"></i>
            <span>Tekrar Dene</span>
          </button>
        </div>
      )}

      {/* Data Table */}
      <div style={{
        background: "#1e293b",
        borderRadius: "12px",
        overflow: "hidden",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
        border: "1px solid #334155",
        marginBottom: "20px"
      }}>
        {/* Table Header */}
        <div style={{
          display: "grid",
          gridTemplateColumns: columns.map(col => col.width).join(" "),
          backgroundColor: "#334155",
          padding: "14px 16px",
          borderBottom: "2px solid #475569",
          fontSize: "0.9rem",
          fontWeight: "700",
          color: "#f1f5f9",
          position: "sticky",
          top: "0",
          zIndex: "10"
        }}>
          {columns.map(column => (
            column.key === 'actions' ? (
              <div 
                key={column.key} 
                style={{ 
                  textAlign: "center",
                  color: "#94a3b8",
                  letterSpacing: "0.5px"
                }}
              >
                {column.label}
              </div>
            ) : (
              <button
                key={column.key}
                onClick={() => handleSort(column.key)}
                style={{
                  background: "none",
                  border: "none",
                  color: "#f1f5f9",
                  cursor: "pointer",
                  padding: "0",
                  textAlign: column.align || "left",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  fontWeight: "700",
                  transition: "all 0.2s",
                  fontSize: "0.9rem"
                }}
                onMouseOver={(e) => e.currentTarget.style.color = "#38bdf8"}
                onMouseOut={(e) => e.currentTarget.style.color = "#f1f5f9"}
              >
                <span>{column.label}</span>
                {sortField === column.key && (
                  <i 
                    className={`fas fa-sort-${sortDirection === 'asc' ? 'up' : 'down'}`} 
                    style={{ fontSize: "0.85rem", color: "#38bdf8" }}
                  ></i>
                )}
              </button>
            )
          ))}
        </div>

        {/* Table Body */}
        <div style={{ 
          maxHeight: "calc(100vh - 350px)", 
          overflowY: "auto",
          scrollbarWidth: "thin",
          scrollbarColor: "#475569 #1e293b"
        }}>
          <style>{`
            ::-webkit-scrollbar {
              width: 10px;
              height: 10px;
            }
            ::-webkit-scrollbar-track {
              background: #1e293b;
              border-radius: 5px;
            }
            ::-webkit-scrollbar-thumb {
              background: #475569;
              border-radius: 5px;
              border: 2px solid #1e293b;
            }
            ::-webkit-scrollbar-thumb:hover {
              background: #64748b;
            }
          `}</style>
          
          {paginatedLines.length === 0 ? (
            <div style={{ 
              textAlign: "center", 
              padding: "70px 20px", 
              color: "#94a3b8",
              background: "linear-gradient(135deg, rgba(30, 41, 59, 0.3) 0%, rgba(30, 41, 59, 0.1) 100%)"
            }}>
              <i className="fas fa-inbox" style={{ 
                fontSize: "3rem", 
                marginBottom: "20px",
                opacity: 0.4 
              }}></i>
              <p style={{ fontSize: "1.1rem", marginBottom: "8px", fontWeight: "500" }}>
                {searchTerm ? "Aranan kriterlere uygun satır bulunamadı." : "Henüz sipariş satırı bulunmuyor."}
              </p>
              <p style={{ fontSize: "0.9rem", color: "#64748b", marginBottom: "20px" }}>
                {searchTerm ? "Farklı bir arama terimi deneyin veya filtreyi temizleyin." : "Yeni sipariş oluşturmak için Satış Siparişleri sayfasını kullanın."}
              </p>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  style={{
                    background: "rgba(56, 189, 248, 0.1)",
                    border: "1px solid #38bdf8",
                    color: "#38bdf8",
                    padding: "8px 20px",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontSize: "0.9rem",
                    fontWeight: "500",
                    transition: "all 0.2s"
                  }}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = "rgba(56, 189, 248, 0.2)"}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = "rgba(56, 189, 248, 0.1)"}
                >
                  <i className="fas fa-times" style={{ marginRight: "6px" }}></i>
                  Filtreyi Temizle
                </button>
              )}
            </div>
          ) : (
            paginatedLines.map((line, index) => {
              const statusColors = getStatusColor(line.rowstate);
              const isSelected = selectedRow === line.rowkey;
              
              return (
                <div
                  key={`${line.rowkey}-${index}`}
                  style={{
                    display: "grid",
                    gridTemplateColumns: columns.map(col => col.width).join(" "),
                    padding: "14px 16px",
                    borderBottom: "1px solid #334155",
                    fontSize: "0.9rem",
                    color: "#f1f5f9",
                    backgroundColor: isSelected 
                      ? "rgba(56, 189, 248, 0.15)" 
                      : index % 2 === 0 
                        ? "rgba(30, 41, 59, 0.5)" 
                        : "rgba(30, 41, 59, 0.3)",
                    alignItems: "center",
                    position: "relative",
                    transition: "all 0.2s ease",
                    cursor: "pointer"
                  }}
                  onMouseEnter={(e) => !isSelected && (e.currentTarget.style.backgroundColor = "rgba(56, 189, 248, 0.08)")}
                  onMouseLeave={(e) => !isSelected && (e.currentTarget.style.backgroundColor = index % 2 === 0 ? "rgba(30, 41, 59, 0.5)" : "rgba(30, 41, 59, 0.3)")}
                  onClick={() => goToOrderDetail(line.orderNo, line.company, line.contract)}
                >
                  {/* Sipariş No */}
                  <div style={{ 
                    fontWeight: "600", 
                    color: "#38bdf8",
                    fontSize: "0.95rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px"
                  }}>
                    <i className="fas fa-file-invoice" style={{ fontSize: "0.8rem", opacity: 0.7 }}></i>
                    {line.orderNo}
                  </div>
                  
                  {/* Müşteri No */}
                  <div style={{ 
                    fontFamily: "'Roboto Mono', 'Courier New', monospace",
                    fontSize: "0.85rem",
                    color: "#cbd5e1"
                  }}>
                    {line.customerNo}
                  </div>
                  
                  {/* Müşteri Adı */}
                  <div style={{ 
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    color: "#e2e8f0"
                  }}>
                    {line.customerName}
                  </div>
                  
                  {/* Customer PO No */}
                  <div style={{ 
                    color: "#f59e0b",
                    fontWeight: "600",
                    fontFamily: "'Roboto Mono', 'Courier New', monospace",
                    fontSize: "0.85rem"
                  }}>
                    {line.customerPoNo}
                  </div>
                  
                  {/* Satış Personeli */}
                  <div style={{ 
                    color: "#10b981",
                    fontWeight: "600",
                    fontSize: "0.85rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px"
                  }}>
                    {line.salesmanCode !== "-" && <i className="fas fa-user-tag" style={{ fontSize: "0.7rem", opacity: 0.7 }}></i>}
                    {line.salesmanCode}
                  </div>
                  
                  {/* Koordinatör */}
                  <div style={{ 
                    color: "#8b5cf6",
                    fontWeight: "600",
                    fontSize: "0.85rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px"
                  }}>
                    {line.authorizeCode !== "-" && <i className="fas fa-key" style={{ fontSize: "0.7rem", opacity: 0.7 }}></i>}
                    {line.authorizeCode}
                  </div>
                  
                  {/* Malzeme No */}
                  <div style={{ 
                    color: "#f59e0b",
                    fontWeight: "600",
                    fontFamily: "'Roboto Mono', 'Courier New', monospace",
                    fontSize: "0.9rem"
                  }}>
                    {line.partNo}
                  </div>
                  
                  {/* Açıklama */}
                  <div style={{ 
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    color: "#cbd5e1",
                    fontSize: "0.88rem"
                  }}>
                    {line.catalogDesc}
                  </div>
                  
                  {/* Miktar */}
                  <div style={{ 
                    textAlign: "right", 
                    color: "#10b981", 
                    fontWeight: "700",
                    fontFamily: "'Roboto Mono', 'Courier New', monospace",
                    fontSize: "0.95rem"
                  }}>
                    {line.buyQtyDue.toFixed(2)}
                  </div>
                  
                  {/* Birim Fiyat */}
                  <div style={{ 
                    textAlign: "right", 
                    color: "#f59e0b", 
                    fontWeight: "700",
                    fontFamily: "'Roboto Mono', 'Courier New', monospace",
                    fontSize: "0.95rem"
                  }}>
                    {line.saleUnitPrice.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} TL
                  </div>
                  
                  {/* Toplam */}
                  <div style={{ 
                    textAlign: "right", 
                    color: "#8b5cf6", 
                    fontWeight: "800",
                    fontFamily: "'Roboto Mono', 'Courier New', monospace",
                    fontSize: "1rem"
                  }}>
                    {line.lineTotal.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} TL
                  </div>
                  
                  {/* Ödenen Tutar */}
                  <div style={{ 
                    textAlign: "right", 
                    color: line.paidAmount > 0 ? "#10b981" : "#94a3b8", 
                    fontWeight: "700",
                    fontFamily: "'Roboto Mono', 'Courier New', monospace",
                    fontSize: "0.95rem"
                  }}>
                    {line.paidAmount.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} TL
                  </div>
                  
                  {/* Sipariş Tarihi */}
                  <div style={{ 
                    color: "#cbd5e1",
                    fontSize: "0.85rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px"
                  }}>
                    <i className="far fa-calendar" style={{ fontSize: "0.8rem", opacity: 0.6 }}></i>
                    {new Date(line.dateEntered).toLocaleDateString('tr-TR', { 
                      year: 'numeric', 
                      month: '2-digit', 
                      day: '2-digit' 
                    })}
                  </div>
                  
                  {/* Teslimat Tarihi */}
                  <div style={{ 
                    color: line.wantedDeliveryDate ? "#10b981" : "#94a3b8",
                    fontSize: "0.85rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px"
                  }}>
                    <i className="far fa-clock" style={{ fontSize: "0.8rem", opacity: 0.6 }}></i>
                    {line.wantedDeliveryDate 
                      ? new Date(line.wantedDeliveryDate).toLocaleDateString('tr-TR', { 
                          year: 'numeric', 
                          month: '2-digit', 
                          day: '2-digit' 
                        })
                      : "-"}
                  </div>
                  
                  {/* Durum */}
                  <div style={{ textAlign: "center" }}>
                    <span style={{
                      padding: "5px 12px",
                      borderRadius: "20px",
                      fontSize: "0.75rem",
                      fontWeight: "700",
                      backgroundColor: statusColors.bg,
                      color: statusColors.text,
                      display: "inline-block",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                      border: `1px solid ${statusColors.text}20`,
                      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)"
                    }}>
                      {line.rowstate}
                    </span>
                  </div>
                  
                  {/* İşlemler - Üç Nokta Menü */}
                  <div style={{ textAlign: "center", position: "relative", zIndex: 20 }}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMenuClick(line.rowkey, e);
                      }}
                      style={{
                        background: isSelected ? "rgba(56, 189, 248, 0.2)" : "rgba(148, 163, 184, 0.1)",
                        border: "none",
                        color: isSelected ? "#38bdf8" : "#94a3b8",
                        cursor: "pointer",
                        padding: "8px",
                        borderRadius: "8px",
                        width: "36px",
                        height: "36px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        transition: "all 0.2s",
                        fontSize: "1rem"
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "rgba(56, 189, 248, 0.2)"}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = isSelected ? "rgba(56, 189, 248, 0.2)" : "rgba(148, 163, 184, 0.1)"}
                      title="İşlemler"
                    >
                      <i className="fas fa-ellipsis-v"></i>
                    </button>
                    
                    {/* Dropdown Menu */}
                    {isSelected && (
                      <div style={{
                        position: "absolute",
                        right: "0",
                        top: "100%",
                        marginTop: "5px",
                        backgroundColor: "#1e293b",
                        border: "1px solid #334155",
                        borderRadius: "10px",
                        boxShadow: "0 10px 25px rgba(0, 0, 0, 0.5)",
                        zIndex: "1000",
                        minWidth: "220px",
                        overflow: "hidden",
                        backdropFilter: "blur(10px)"
                      }}>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            goToOrderDetail(line.orderNo, line.company, line.contract);
                            setSelectedRow(null);
                          }}
                          style={{
                            width: "100%",
                            padding: "14px 18px",
                            background: "none",
                            border: "none",
                            color: "#f1f5f9",
                            cursor: "pointer",
                            textAlign: "left",
                            fontSize: "0.9rem",
                            display: "flex",
                            alignItems: "center",
                            gap: "12px",
                            borderBottom: "1px solid #334155",
                            transition: "all 0.2s"
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "rgba(56, 189, 248, 0.2)"}
                          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                        >
                          <div style={{
                            width: "32px",
                            height: "32px",
                            backgroundColor: "rgba(56, 189, 248, 0.1)",
                            borderRadius: "8px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center"
                          }}>
                            <i className="fas fa-external-link-alt" style={{ color: "#38bdf8" }}></i>
                          </div>
                          <div>
                            <div style={{ fontWeight: "600" }}>Siparişe Git</div>
                            <div style={{ fontSize: "0.8rem", color: "#94a3b8", marginTop: "2px" }}>
                              {line.orderNo} detayını aç
                            </div>
                          </div>
                        </button>
                        
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            const lineInfo = `📋 SİPARİŞ SATIR BİLGİLERİ\n━━━━━━━━━━━━━━━━━━━━━━\n📦 Sipariş: ${line.orderNo}\n👤 Müşteri: ${line.customerName} (${line.customerNo})\n📝 PO No: ${line.customerPoNo}\n👨‍💼 Satış Personeli: ${line.salesmanCode}\n🔑 Koordinatör: ${line.authorizeCode}\n🔧 Malzeme: ${line.partNo}\n📝 Açıklama: ${line.catalogDesc}\n📊 Miktar: ${line.buyQtyDue}\n💰 Fiyat: ${line.saleUnitPrice} TL\n💎 Toplam: ${line.lineTotal} TL\n💳 Ödenen: ${line.paidAmount} TL\n📅 Tarih: ${line.dateEntered}\n🚚 Teslimat: ${line.wantedDeliveryDate || "Belirtilmemiş"}\n📌 Durum: ${line.rowstate}`;
                            navigator.clipboard.writeText(lineInfo);
                            setSelectedRow(null);
                            alert("✅ Satır bilgileri panoya kopyalandı!");
                          }}
                          style={{
                            width: "100%",
                            padding: "14px 18px",
                            background: "none",
                            border: "none",
                            color: "#f1f5f9",
                            cursor: "pointer",
                            textAlign: "left",
                            fontSize: "0.9rem",
                            display: "flex",
                            alignItems: "center",
                            gap: "12px",
                            transition: "all 0.2s"
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "rgba(245, 158, 11, 0.2)"}
                          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                        >
                          <div style={{
                            width: "32px",
                            height: "32px",
                            backgroundColor: "rgba(245, 158, 11, 0.1)",
                            borderRadius: "8px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center"
                          }}>
                            <i className="fas fa-clipboard-list" style={{ color: "#f59e0b" }}></i>
                          </div>
                          <div>
                            <div style={{ fontWeight: "600" }}>Detayları Kopyala</div>
                            <div style={{ fontSize: "0.8rem", color: "#94a3b8", marginTop: "2px" }}>
                              Tüm satır bilgilerini kopyala
                            </div>
                          </div>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Table Footer - Sayfalama */}
        {filteredLines.length > 0 && (
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "18px 20px",
            backgroundColor: "#1e293b",
            borderTop: "1px solid #334155",
            fontSize: "0.9rem",
            color: "#94a3b8",
            flexWrap: "wrap",
            gap: "12px"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "6px 12px", backgroundColor: "rgba(30, 41, 59, 0.5)", borderRadius: "6px" }}>
                <i className="fas fa-layer-group" style={{ fontSize: "0.85rem", color: "#38bdf8" }}></i>
                <span>Sayfa <strong>{page}</strong> / <strong>{totalPages}</strong></span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "6px 12px", backgroundColor: "rgba(30, 41, 59, 0.5)", borderRadius: "6px" }}>
                <i className="fas fa-eye" style={{ fontSize: "0.85rem", color: "#10b981" }}></i>
                <span>Gösterilen: <strong>{(page - 1) * pageSize + 1}</strong> - <strong>{Math.min(page * pageSize, filteredLines.length)}</strong> / <strong>{filteredLines.length}</strong></span>
              </div>
            </div>
            
            <div style={{ display: "flex", gap: "6px", alignItems: "center", flexWrap: "wrap" }}>
              <button
                onClick={() => handlePageChange(1)}
                disabled={page === 1}
                style={{
                  padding: "8px 12px",
                  background: page === 1 ? "#475569" : "#334155",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  cursor: page === 1 ? "not-allowed" : "pointer",
                  opacity: page === 1 ? 0.5 : 1,
                  transition: "all 0.2s",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  fontWeight: "500"
                }}
                onMouseOver={(e) => page !== 1 && (e.currentTarget.style.backgroundColor = "#475569")}
                onMouseOut={(e) => page !== 1 && (e.currentTarget.style.backgroundColor = "#334155")}
                title="İlk sayfa"
              >
                <i className="fas fa-angle-double-left"></i>
              </button>
              
              <button
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1}
                style={{
                  padding: "8px 12px",
                  background: page === 1 ? "#475569" : "#334155",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  cursor: page === 1 ? "not-allowed" : "pointer",
                  opacity: page === 1 ? 0.5 : 1,
                  transition: "all 0.2s",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  fontWeight: "500"
                }}
                onMouseOver={(e) => page !== 1 && (e.currentTarget.style.backgroundColor = "#475569")}
                onMouseOut={(e) => page !== 1 && (e.currentTarget.style.backgroundColor = "#334155")}
                title="Önceki sayfa"
              >
                <i className="fas fa-chevron-left"></i>
              </button>
              
              {/* Sayfa Numaraları */}
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (page <= 3) {
                  pageNum = i + 1;
                } else if (page >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = page - 2 + i;
                }
                
                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    style={{
                      padding: "8px 14px",
                      background: page === pageNum ? "#3b82f6" : "#334155",
                      color: "white",
                      border: "none",
                      borderRadius: "6px",
                      cursor: "pointer",
                      minWidth: "42px",
                      fontWeight: page === pageNum ? "700" : "500",
                      transition: "all 0.2s",
                      fontSize: "0.9rem"
                    }}
                    onMouseOver={(e) => page !== pageNum && (e.currentTarget.style.backgroundColor = "#475569")}
                    onMouseOut={(e) => page !== pageNum && (e.currentTarget.style.backgroundColor = "#334155")}
                  >
                    {pageNum}
                  </button>
                );
              })}
              
              <button
                onClick={() => handlePageChange(page + 1)}
                disabled={page === totalPages}
                style={{
                  padding: "8px 12px",
                  background: page === totalPages ? "#475569" : "#334155",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  cursor: page === totalPages ? "not-allowed" : "pointer",
                  opacity: page === totalPages ? 0.5 : 1,
                  transition: "all 0.2s",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  fontWeight: "500"
                }}
                onMouseOver={(e) => page !== totalPages && (e.currentTarget.style.backgroundColor = "#475569")}
                onMouseOut={(e) => page !== totalPages && (e.currentTarget.style.backgroundColor = "#334155")}
                title="Sonraki sayfa"
              >
                <i className="fas fa-chevron-right"></i>
              </button>
              
              <button
                onClick={() => handlePageChange(totalPages)}
                disabled={page === totalPages}
                style={{
                  padding: "8px 12px",
                  background: page === totalPages ? "#475569" : "#334155",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  cursor: page === totalPages ? "not-allowed" : "pointer",
                  opacity: page === totalPages ? 0.5 : 1,
                  transition: "all 0.2s",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  fontWeight: "500"
                }}
                onMouseOver={(e) => page !== totalPages && (e.currentTarget.style.backgroundColor = "#475569")}
                onMouseOut={(e) => page !== totalPages && (e.currentTarget.style.backgroundColor = "#334155")}
                title="Son sayfa"
              >
                <i className="fas fa-angle-double-right"></i>
              </button>
              
              {/* Sayfa Boyutu Seçimi */}
              <div style={{ marginLeft: "12px", display: "flex", alignItems: "center", gap: "8px" }}>
                <select
                  value={pageSize}
                  onChange={(e) => handlePageSizeChange(Number(e.target.value))}
                  style={{
                    padding: "8px 12px",
                    backgroundColor: "#334155",
                    color: "#f1f5f9",
                    border: "1px solid #475569",
                    borderRadius: "6px",
                    fontSize: "0.9rem",
                    cursor: "pointer",
                    fontWeight: "500",
                    transition: "all 0.2s"
                  }}
                  onFocus={(e) => e.target.style.borderColor = "#3b82f6"}
                  onBlur={(e) => e.target.style.borderColor = "#475569"}
                >
                  <option value="10">10 / sayfa</option>
                  <option value="20">20 / sayfa</option>
                  <option value="50">50 / sayfa</option>
                  <option value="100">100 / sayfa</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer Bilgi */}
      <div style={{
        textAlign: "center",
        color: "#64748b",
        fontSize: "0.85rem",
        padding: "15px",
        borderTop: "1px solid #334155",
        marginTop: "20px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "15px",
        flexWrap: "wrap"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <i className="fas fa-info-circle" style={{ color: "#38bdf8" }}></i>
          <span>Toplam <strong>{totalCount}</strong> sipariş satırı • <strong>{columns.length - 1}</strong> sütun</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <i className="fas fa-clock" style={{ color: "#10b981" }}></i>
          <span>Son güncelleme: {new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <i className="fas fa-server" style={{ color: "#8b5cf6" }}></i>
          <span>API: <code style={{ background: "rgba(30, 41, 59, 0.5)", padding: "2px 6px", borderRadius: "4px", fontFamily: "'Roboto Mono', monospace" }}>/api/customerorderline/get-all</code></span>
        </div>
      </div>

      {/* Click Outside için overlay */}
      {selectedRow && (
        <div
          onClick={() => setSelectedRow(null)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 5,
            cursor: "default"
          }}
        />
      )}
    </div>
  );
}