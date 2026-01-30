import { useState, useEffect, useCallback } from "react";
import SearchList from "./../../components/SearchList";
import { ChevronRightIcon } from "@heroicons/react/24/outline";

declare global {
  interface Window {
    html2pdf: any;
  }
}
// C# API'den gelen veri yapısı (camelCase)
interface CustomerOrderApiResponse {
  company: string;
  orderNo: string;
  contract: string;
  customerNo: string;
  customerPoNo?: string | null;
  dateEntered: string;
  wantedDeliveryDate?: string | null;
  payTermBaseDate?: string | null;
  currencyCode?: string | null;
  payTermId?: string | null;
  deliveryTerms?: string | null;
  shipViaCode?: string | null;
  deliveryCountryCode?: string | null;
  orderId?: string | null;
  authorizeCode?: string | null;
  salesmanCode?: string | null;
  billAddrNo?: string | null;
  shipAddrNo?: string | null;
  internalPoNo?: string | null;
  noteText?: string | null;
  rowstate?: string | null;
  createdBy: string;
  rowversion: number;
  rowkey: string;
}

// Frontend'de kullanacağımız interface (PascalCase)
interface CustomerOrder {
  id: number;
  Company: string;
  OrderNo: string;
  Contract: string;
  CustomerNo: string;
  CustomerPoNo?: string;
  DateEntered: string;
  WantedDeliveryDate?: string;
  PayTermBaseDate?: string;
  CurrencyCode?: string;
  PayTermId?: string;
  DeliveryTerms?: string;
  ShipViaCode?: string;
  DeliveryCountryCode?: string;
  OrderId?: string;
  AuthorizeCode?: string;
  SalesmanCode?: string;
  BillAddrNo?: string;
  ShipAddrNo?: string;
  InternalPoNo?: string;
  NoteText?: string;
  Rowstate?: string;
  CreatedBy: string;
  Rowversion: number;
  Rowkey: string;
}

// Sipariş satırı için API response
interface CustomerOrderLineApiResponse {
  id?: number;
  company: string;
  orderNo: string;
  contract: string;
  lineNo: string;  // 3 karakterli string: "001"
  relNo: string;   // 3 karakterli string: "001"
  partNo: string;
  catalogNo?: string;
  catalogDesc?: string;
  buyQtyDue?: number;
  orderQty?: number;
  deliveredQty?: number;
  backOrderQty?: number;
  saleUnitPrice?: number;
  price?: number;
  unitCode?: string;
  lineDiscount?: number;
  lineValue?: number;
  deliveryDate?: string;
  noteText?: string;
  rowstate?: string;
  createdBy: string;
  rowversion: number;
  rowkey: string;
}

// Frontend'de kullanacağımız sipariş satırı interface
interface CustomerOrderLine {
  id: number;
  Company: string;
  OrderNo: string;
  Contract: string;
  OrderLine: number;    // Frontend'de number olarak kullanıyoruz
  RelNo: string;        // EKLEDİM: relNo'yu da saklamalıyız
  PartNo: string;
  CatalogNo?: string;
  CatalogDesc?: string;
  BuyQtyDue?: number;
  OrderQty?: number;
  DeliveredQty?: number;
  BackOrderQty?: number;
  SaleUnitPrice?: number;
  Price?: number;
  UnitCode?: string;
  LineDiscount?: number;
  LineValue?: number;
  DeliveryDate?: string;
  NoteText?: string;
  Rowstate?: string;
  CreatedBy: string;
  Rowversion: number;
  Rowkey: string;
}

// Düzenleme için Customer Order DTO
interface CustomerOrderUpdateDto {
  company?: string;
  orderNo?: string;
  contract?: string;
  customerNo?: string;
  customerPoNo?: string | null;
  dateEntered?: string;
  wantedDeliveryDate?: string | null;
  payTermBaseDate?: string | null;
  currencyCode?: string | null;
  payTermId?: string | null;
  deliveryTerms?: string | null;
  shipViaCode?: string | null;
  deliveryCountryCode?: string | null;
  orderId?: string | null;
  authorizeCode?: string | null;
  salesmanCode?: string | null;
  billAddrNo?: string | null;
  shipAddrNo?: string | null;
  internalPoNo?: string | null;
  noteText?: string | null;
  rowstate?: string | null;
  rowversion: number;
}

// Satır güncelleme için DTO - API'ye camelCase gönderilecek
interface CustomerOrderLineUpdateDto {
  catalogNo?: string | null;
  partNo?: string | null;
  customerPartNo?: string | null;
  catalogDesc?: string | null;
  buyQtyDue?: number | null;
  customerPartBuyQty?: number | null;
  baseSaleUnitPrice?: number | null;
  saleUnitPrice?: number | null;
  unitPriceInclTax?: number | null;
  salesUnitMeas?: string | null;
  priceUnitMeas?: string | null;
  discount?: number | null;
  additionalDiscount?: number | null;
  customerPartConvFactor?: number | null;
  plannedDeliveryDate?: string | null;
  promisedDeliveryDate?: string | null;
  wantedDeliveryDate?: string | null;
  deliveryType?: string | null;
  taxCode?: string | null;
  noteText?: string | null;
  forwardAgentId?: string | null;
  shipViaCode?: string | null;
  deliveryTerms?: string | null;
  projectId?: string | null;
  freeOfCharge?: string | null;
  rowstate?: string | null;
  rowversion: number;
}
// Yeni sipariş oluşturma için DTO (API'ye camelCase gönderilecek)
interface CustomerOrderCreateDto {
  company: string;
  orderNo: string;
  contract: string;
  customerNo: string;
  customerPoNo?: string;
  dateEntered: string;
  wantedDeliveryDate?: string;
  payTermBaseDate?: string;
  currencyCode?: string;
  payTermId?: string;
  deliveryTerms?: string;
  shipViaCode?: string;
  deliveryCountryCode?: string;
  orderId?: string;
  authorizeCode?: string;
  salesmanCode?: string;
  billAddrNo?: string;
  shipAddrNo?: string;
  internalPoNo?: string;
  noteText?: string;
  createdBy: string;
  rowstate: string;
  rowversion: number;
  rowkey: string;
}

// Yeni sipariş satırı oluşturma için DTO (API'ye camelCase gönderilecek)
interface CustomerOrderLineCreateDto {
  company: string;
  orderNo: string;
  contract: string;
  lineNo: string;
  relNo: string;
  catalogNo: string;
  partNo: string;
  customerPartNo?: string | null;
  catalogDesc?: string | null;
  buyQtyDue?: number | null;
  customerPartBuyQty?: number | null;
  baseSaleUnitPrice?: number | null;
  saleUnitPrice?: number | null;
  unitPriceInclTax?: number | null;
  salesUnitMeas?: string | null;
  priceUnitMeas?: string | null;
  discount?: number | null;
  additionalDiscount?: number | null;
  customerPartConvFactor?: number | null;
  plannedDeliveryDate?: string | null;
  promisedDeliveryDate?: string | null;
  wantedDeliveryDate?: string | null;
  deliveryType?: string | null;
  taxCode?: string | null;
  noteText?: string | null;
  forwardAgentId?: string | null;
  shipViaCode?: string | null;
  deliveryTerms?: string | null;
  projectId?: string | null;
  freeOfCharge?: string | null;
  rowstate?: string | null;
}

const tabs = ["Satış Sipariş Satırları", "Taşıma Bilgileri"];

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

export default function CustomerOrderPage() {
  const [activeTab, setActiveTab] = useState("Satış Sipariş Satırları");
  const [selectedOrder, setSelectedOrder] = useState<CustomerOrder | null>(null);
  const [editingOrder, setEditingOrder] = useState<CustomerOrder | null>(null);
  const [editingOrderLines, setEditingOrderLines] = useState<CustomerOrderLine[]>([]);
  const [isSearchListVisible, setIsSearchListVisible] = useState(false);
  const [isCreatingNewOrder, setIsCreatingNewOrder] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Yeni sipariş formu state'leri (camelCase - API'ye gönderilecek)
  const [newOrderData, setNewOrderData] = useState<CustomerOrderCreateDto>({
    company: "TST",
    orderNo: `SO${String(Math.floor(Math.random() * 10000)).padStart(5, '0')}`,
    contract: "001",
    customerNo: "",
    dateEntered: new Date().toISOString().split('T')[0],
    createdBy: "admin",
    rowstate: "ACTIVE",
    rowversion: 1,
    rowkey: `new-order-${Date.now()}`
  });

  const [newOrderLines, setNewOrderLines] = useState<CustomerOrderLineCreateDto[]>([
    {
      company: "TST",
      orderNo: `SO${String(Math.floor(Math.random() * 10000)).padStart(5, '0')}`,
      contract: "001",
      lineNo: "001",
      relNo: "001",
      catalogNo: "",
      partNo: "",
      buyQtyDue: 1,
      saleUnitPrice: 0
    }
  ]);

  // Veritabanından gelen veriler
  const [customerOrders, setCustomerOrders] = useState<CustomerOrder[]>([]);
  const [orderLines, setOrderLines] = useState<CustomerOrderLine[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // PostgreSQL'den sipariş verilerini çek
  useEffect(() => {
    fetchCustomerOrders();
  }, []);

  useEffect(() => {
    if (selectedOrder && !isCreatingNewOrder) {
      fetchOrderLines(selectedOrder.Company, selectedOrder.OrderNo, selectedOrder.Contract);
      // Seçilen siparişi düzenleme state'ine kopyala
      setEditingOrder(selectedOrder);
    } else {
      setOrderLines([]);
      setEditingOrder(null);
      setEditingOrderLines([]);
    }
  }, [selectedOrder, isCreatingNewOrder]);

  const fetchCustomerOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5217/api/customerorder');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const apiData: CustomerOrderApiResponse[] = await response.json();
      console.log("API'den gelen siparişler:", apiData);
      
      // API verisini frontend formatına çevir (camelCase -> PascalCase)
      const formattedOrders: CustomerOrder[] = apiData.map((apiOrder, index) => {
        const order: CustomerOrder = {
          id: index + 1,
          Company: apiOrder.company || "",
          OrderNo: apiOrder.orderNo || "",
          Contract: apiOrder.contract || "",
          CustomerNo: apiOrder.customerNo || "",
          CustomerPoNo: apiOrder.customerPoNo || undefined,
          DateEntered: apiOrder.dateEntered || new Date().toISOString().split('T')[0],
          WantedDeliveryDate: apiOrder.wantedDeliveryDate || undefined,
          PayTermBaseDate: apiOrder.payTermBaseDate || undefined,
          CurrencyCode: apiOrder.currencyCode || undefined,
          PayTermId: apiOrder.payTermId || undefined,
          DeliveryTerms: apiOrder.deliveryTerms || undefined,
          ShipViaCode: apiOrder.shipViaCode || undefined,
          DeliveryCountryCode: apiOrder.deliveryCountryCode || undefined,
          OrderId: apiOrder.orderId || undefined,
          AuthorizeCode: apiOrder.authorizeCode || undefined,
          SalesmanCode: apiOrder.salesmanCode || undefined,
          BillAddrNo: apiOrder.billAddrNo || undefined,
          ShipAddrNo: apiOrder.shipAddrNo || undefined,
          InternalPoNo: apiOrder.internalPoNo || undefined,
          NoteText: apiOrder.noteText || undefined,
          Rowstate: apiOrder.rowstate || "ACTIVE",
          CreatedBy: apiOrder.createdBy || "admin",
          Rowversion: apiOrder.rowversion || 1,
          Rowkey: apiOrder.rowkey || `order-${Date.now()}-${index}`
        };
        
        return order;
      });
      
      console.log("Formatlanmış siparişler:", formattedOrders);
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

// CustomerOrderLines sayfasından gelen sipariş seçimini dinle
// CustomerOrderLines sayfasından gelen sipariş seçimini dinle
useEffect(() => {
  console.log('🎯 Otomatik sipariş seçim listener aktif');
  
  // 1. Message event'ini dinle
  const handleMessage = (event: MessageEvent) => {
    // Güvenlik kontrolü
    if (event.origin !== window.location.origin && 
        event.origin !== 'http://localhost:5173' && 
        event.origin !== 'http://localhost:3000') {
      return;
    }
    
    if (event.data && event.data.type === 'SELECT_ORDER_FROM_LINES') {
      const orderInfo = event.data.data;
      console.log('📥 MessageEvent ile sipariş seçimi:', orderInfo);
      handleAutoSelectOrder(orderInfo);
    }
  };
  
  // 2. localStorage'dan kontrol et
  const checkLocalStorage = () => {
    try {
      const savedOrder = localStorage.getItem('autoSelectOrder');
      if (savedOrder) {
        const orderInfo = JSON.parse(savedOrder);
        console.log('📥 localStorage ile sipariş seçimi:', orderInfo);
        handleAutoSelectOrder(orderInfo);
        
        // Temizle
        localStorage.removeItem('autoSelectOrder');
      }
    } catch (err) {
      console.error('❌ localStorage okuma hatası:', err);
      localStorage.removeItem('autoSelectOrder');
    }
  };
  
  // 3. URL parametrelerini kontrol et
  const checkUrlParams = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const company = urlParams.get('company');
    const orderNo = urlParams.get('orderNo');
    const contract = urlParams.get('contract');
    const fromLines = urlParams.get('fromCustomerOrderLines');
    
    if (fromLines && company && orderNo && contract) {
      const orderInfo = {
        company,
        orderNo,
        contract,
        timestamp: Date.now(),
        source: 'CustomerOrderLines'
      };
      console.log('📥 URL parametreleri ile sipariş seçimi:', orderInfo);
      handleAutoSelectOrder(orderInfo);
      
      // URL'yi temizle
      window.history.replaceState({}, '', '/sales/orders');
    }
  };
  
  // Otomatik sipariş seçimini işle
  const handleAutoSelectOrder = async (orderInfo: any) => {
    try {
      // Eski verileri temizle (5 dakikadan eski)
      if (orderInfo.timestamp && Date.now() - orderInfo.timestamp > 300000) {
        console.log('⏳ Sipariş bilgisi çok eski, yok sayılıyor');
        return;
      }
      
      console.log(`🔍 Otomatik sipariş yükleniyor: ${orderInfo.orderNo}`);
      
      // Önce mevcut siparişler arasında ara
      const existingOrder = customerOrders.find(o => 
        o.Company === orderInfo.company && 
        o.OrderNo === orderInfo.orderNo && 
        o.Contract === orderInfo.contract
      );
      
      if (existingOrder) {
        console.log('✅ Sipariş mevcut listede bulundu:', existingOrder);
        setSelectedOrder(existingOrder);
        setEditingOrder(existingOrder);
       // alert(`✅ Sipariş ${existingOrder.OrderNo} başarıyla yüklendi!`);
        return;
      }
      
      // Listede yoksa API'den getir
      console.log('🌐 Sipariş listede yok, API\'den getiriliyor...');
      
      // Birden fazla endpoint deneyeceğiz
      const endpoints = [
        `http://localhost:5217/api/customerorder/${orderInfo.company}/${orderInfo.orderNo}/${orderInfo.contract}`,
        `http://localhost:5217/api/customerorder/get?company=${encodeURIComponent(orderInfo.company)}&orderNo=${encodeURIComponent(orderInfo.orderNo)}&contract=${encodeURIComponent(orderInfo.contract)}`,
        `http://localhost:5217/api/salesorder/${orderInfo.company}/${orderInfo.orderNo}/${orderInfo.contract}`
      ];
      
      let orderData = null;
      let successfulEndpoint = '';
      
      for (const endpoint of endpoints) {
        try {
          console.log(`🔄 Deneniyor: ${endpoint}`);
          const response = await fetch(endpoint);
          
          if (response.ok) {
            orderData = await response.json();
            successfulEndpoint = endpoint;
            console.log(`✅ Sipariş bulundu (${endpoint}):`, orderData);
            break;
          }
        } catch (err) {
          console.warn(`⚠️ Endpoint başarısız: ${endpoint}`, err);
        }
      }
      
      if (!orderData) {
        throw new Error('Sipariş hiçbir endpoint\'te bulunamadı');
      }
      
      // API verisini frontend formatına çevir
      const order: CustomerOrder = {
        id: customerOrders.length + 1,
        Company: orderData.company || orderInfo.company,
        OrderNo: orderData.orderNo || orderInfo.orderNo,
        Contract: orderData.contract || orderInfo.contract,
        CustomerNo: orderData.customerNo || "",
        CustomerPoNo: orderData.customerPoNo || undefined,
        DateEntered: orderData.dateEntered || new Date().toISOString().split('T')[0],
        WantedDeliveryDate: orderData.wantedDeliveryDate || undefined,
        PayTermBaseDate: orderData.payTermBaseDate || undefined,
        CurrencyCode: orderData.currencyCode || undefined,
        PayTermId: orderData.payTermId || undefined,
        DeliveryTerms: orderData.deliveryTerms || undefined,
        ShipViaCode: orderData.shipViaCode || undefined,
        DeliveryCountryCode: orderData.deliveryCountryCode || undefined,
        OrderId: orderData.orderId || undefined,
        AuthorizeCode: orderData.authorizeCode || undefined,
        SalesmanCode: orderData.salesmanCode || undefined,
        BillAddrNo: orderData.billAddrNo || undefined,
        ShipAddrNo: orderData.shipAddrNo || undefined,
        InternalPoNo: orderData.internalPoNo || undefined,
        NoteText: orderData.noteText || undefined,
        Rowstate: orderData.rowstate || "ACTIVE",
        CreatedBy: orderData.createdBy || "admin",
        Rowversion: orderData.rowversion || 1,
        Rowkey: orderData.rowkey || `order-${Date.now()}`
      };
      
      // Siparişi seç
      setSelectedOrder(order);
      setEditingOrder(order);
      
      console.log(`✅ Sipariş başarıyla yüklendi (${successfulEndpoint})`);
      
      // Başarı mesajı
     // alert(`✅ Sipariş ${order.OrderNo} otomatik olarak yüklendi!`);
      
    } catch (error) {
      console.error('❌ Sipariş yüklenemedi:', error);
      alert(`❌ Sipariş ${orderInfo.orderNo} otomatik olarak yüklenemedi.\n\nHata: ${error}\n\nLütfen manuel olarak arayın.`);
    }
  };
  
  // Event listener'ı ekle
  window.addEventListener('message', handleMessage);
  
  // Sayfa yüklendiğinde kontrolleri yap (2 saniye gecikme ile)
  const timer = setTimeout(() => {
    checkUrlParams();
    checkLocalStorage();
  }, 2000);
  
  // Cleanup
  return () => {
    window.removeEventListener('message', handleMessage);
    clearTimeout(timer);
  };
}, []); // ✅ Sadece component mount olduğunda çalışsın
// CustomerOrderLines sayfasından gelen sipariş seçimini dinle

const fetchOrderLines = async (company: string, orderNo: string, contract: string) => {
  try {
    const response = await fetch(`http://localhost:5217/api/customerorderline/order/${company}/${orderNo}/${contract}`);
    
    if (response.ok) {
      const apiData: CustomerOrderLineApiResponse[] = await response.json();
      console.log("API'den gelen sipariş satırları:", apiData);
      
      const formattedLines: CustomerOrderLine[] = apiData.map((apiLine, index) => ({
        id: apiLine.id || index + 1,
        Company: apiLine.company || "",
        OrderNo: apiLine.orderNo || "",
        Contract: apiLine.contract || "",
        OrderLine: parseInt(apiLine.lineNo) || 0,
        RelNo: apiLine.relNo || "",  // EKLEDİM
        PartNo: apiLine.partNo || "",
        CatalogNo: apiLine.catalogNo,
        CatalogDesc: apiLine.catalogDesc,
        BuyQtyDue: apiLine.buyQtyDue,
        OrderQty: apiLine.orderQty || apiLine.buyQtyDue || 0,
        DeliveredQty: apiLine.deliveredQty,
        BackOrderQty: apiLine.backOrderQty,
        SaleUnitPrice: apiLine.saleUnitPrice,
        Price: apiLine.price || apiLine.saleUnitPrice || 0,
        UnitCode: apiLine.unitCode || "ADET",
        LineDiscount: apiLine.lineDiscount,
        LineValue: apiLine.lineValue,
        DeliveryDate: apiLine.deliveryDate,
        NoteText: apiLine.noteText,
        Rowstate: apiLine.rowstate || "ACTIVE",
        CreatedBy: apiLine.createdBy || "admin",
        Rowversion: apiLine.rowversion || 1,
        Rowkey: apiLine.rowkey || `line-${Date.now()}-${index}`
      }));
      
      console.log("Formatlanmış sipariş satırları:", formattedLines);
      
      setOrderLines(formattedLines);
      setEditingOrderLines([...formattedLines]);
    } else {
      console.log("Sipariş satırları bulunamadı veya hata oluştu");
      setOrderLines([]);
      setEditingOrderLines([]);
    }
  } catch (err) {
    console.error("Sipariş satırları çekilirken hata:", err);
    setOrderLines([]);
    setEditingOrderLines([]);
  }
};

  // SearchList için item'leri formatla
  const searchListItems = customerOrders.map(order => ({
    id: order.id,
    code: order.OrderNo,
    name: `C:${order.Company} - M:${order.CustomerNo}`,
    description: `Şirket: ${order.Company} | Sipariş: ${order.OrderNo} | Müşteri: ${order.CustomerNo} | Tarih: ${order.DateEntered} | Durum: ${order.Rowstate || 'ACTIVE'}`,
    originalData: order
  }));

  const handleOrderSelect = (item: any) => {
    if (item.originalData) {
      const { Company, OrderNo, Contract } = item.originalData;
      
      const selected = customerOrders.find(o => 
        o.Company === Company && 
        o.OrderNo === OrderNo && 
        o.Contract === Contract
      );
      
      if (selected) {
        console.log("Seçilen sipariş:", selected);
        setSelectedOrder(selected);
        setEditingOrder(selected); // Düzenleme için kopyala
        setIsCreatingNewOrder(false);
        setIsEditing(false); // Düzenleme modunu kapat
      } else {
        setSelectedOrder(item.originalData);
        setEditingOrder(item.originalData); // Düzenleme için kopyala
        setIsCreatingNewOrder(false);
        setIsEditing(false); // Düzenleme modunu kapat
      }
    }
  };

  const handleToggleSearchList = useCallback(() => {
    setIsSearchListVisible(!isSearchListVisible);
  }, [isSearchListVisible]);

  // Düzenleme işlevleri
  const handleEditClick = useCallback(() => {
    setIsEditing(true);
  }, []);

  const handleCancelEdit = useCallback(() => {
    setIsEditing(false);
    setEditingOrder(selectedOrder); // Orijinal değerlere dön
    setEditingOrderLines([...orderLines]); // Orijinal satırlara dön
  }, [selectedOrder, orderLines]);

  const handleEditingOrderChange = useCallback((field: keyof CustomerOrder, value: any) => {
    if (!editingOrder) return;
    
    setEditingOrder({
      ...editingOrder,
      [field]: value
    });
  }, [editingOrder]);

const handleEditingOrderLineChange = useCallback((index: number, field: keyof CustomerOrderLine, value: any) => {
  if (!editingOrderLines[index]) return;
  
  const updatedLines = [...editingOrderLines];
  
  // Sayısal alanlar için tip kontrolü
  if (field === 'OrderQty' || field === 'BuyQtyDue' || field === 'Price' || field === 'SaleUnitPrice' || 
      field === 'LineDiscount' || field === 'LineValue') {
    updatedLines[index] = {
      ...updatedLines[index],
      [field]: parseFloat(value) || 0
    };
  } else {
    updatedLines[index] = {
      ...updatedLines[index],
      [field]: value
    };
  }
  
  setEditingOrderLines(updatedLines);
}, [editingOrderLines]);
const addNewOrderLine = useCallback(() => {
  if (!selectedOrder || !editingOrderLines) return;
  
  const newLineNumber = editingOrderLines.length > 0 
    ? Math.max(...editingOrderLines.map(l => l.OrderLine)) + 1 
    : 1;
  
  const lineNoStr = newLineNumber.toString().padStart(3, '0');
  
  const newLine: CustomerOrderLine = {
    id: editingOrderLines.length + 1,
    Company: selectedOrder.Company,
    OrderNo: selectedOrder.OrderNo,
    Contract: selectedOrder.Contract,
    OrderLine: newLineNumber,
    RelNo: lineNoStr,  // EKLEDİM
    PartNo: "",
    OrderQty: 1,
    Price: 0,
    CreatedBy: "admin",
    Rowversion: 1,
    Rowkey: `new-line-${Date.now()}`
  };
  
  setEditingOrderLines([...editingOrderLines, newLine]);
}, [selectedOrder, editingOrderLines]);
  const removeOrderLine = useCallback((index: number) => {
    if (editingOrderLines.length <= 1) return;
    
    const updatedLines = editingOrderLines.filter((_, i) => i !== index);
    // Satır numaralarını yeniden düzenle
    const renumberedLines = updatedLines.map((line, idx) => ({
      ...line,
      OrderLine: idx + 1
    }));
    
    setEditingOrderLines(renumberedLines);
  }, [editingOrderLines]);
// Sipariş satırı güncelleme için fonksiyonunuzu güncelleyin:
const handleSaveOrder = useCallback(async () => {
  if (!editingOrder || !selectedOrder) return;

  try {
    setIsSaving(true);
    
    console.log("=== SİPARİŞ KAYIT BAŞLANGICI ===");
    console.log("Seçili sipariş:", selectedOrder);
    console.log("Düzenlenen satırlar:", editingOrderLines);

    // 1. Ana siparişi güncelle
    const updateDto: CustomerOrderUpdateDto = {
      company: editingOrder.Company,
      orderNo: editingOrder.OrderNo,
      contract: editingOrder.Contract,
      customerNo: editingOrder.CustomerNo,
      customerPoNo: editingOrder.CustomerPoNo || null,
      dateEntered: editingOrder.DateEntered,
      wantedDeliveryDate: editingOrder.WantedDeliveryDate || null,
      currencyCode: editingOrder.CurrencyCode || null,
      noteText: editingOrder.NoteText || null,
      rowstate: editingOrder.Rowstate || "ACTIVE",
      rowversion: selectedOrder.Rowversion
    };

    console.log("Ana sipariş DTO:", updateDto);

    const response = await fetch(
      `http://localhost:5217/api/customerorder/${selectedOrder.Company}/${selectedOrder.OrderNo}/${selectedOrder.Contract}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateDto)
      }
    );

    if (response.ok) {
      const updatedOrderApi: CustomerOrderApiResponse = await response.json();
      console.log("Ana sipariş güncellendi:", updatedOrderApi);
      
      const updatedOrder: CustomerOrder = {
        id: selectedOrder.id,
        Company: updatedOrderApi.company,
        OrderNo: updatedOrderApi.orderNo,
        Contract: updatedOrderApi.contract,
        CustomerNo: updatedOrderApi.customerNo,
        CustomerPoNo: updatedOrderApi.customerPoNo || undefined,
        DateEntered: updatedOrderApi.dateEntered,
        WantedDeliveryDate: updatedOrderApi.wantedDeliveryDate || undefined,
        PayTermBaseDate: updatedOrderApi.payTermBaseDate || undefined,
        CurrencyCode: updatedOrderApi.currencyCode || undefined,
        PayTermId: updatedOrderApi.payTermId || undefined,
        DeliveryTerms: updatedOrderApi.deliveryTerms || undefined,
        ShipViaCode: updatedOrderApi.shipViaCode || undefined,
        DeliveryCountryCode: updatedOrderApi.deliveryCountryCode || undefined,
        OrderId: updatedOrderApi.orderId || undefined,
        AuthorizeCode: updatedOrderApi.authorizeCode || undefined,
        SalesmanCode: updatedOrderApi.salesmanCode || undefined,
        BillAddrNo: updatedOrderApi.billAddrNo || undefined,
        ShipAddrNo: updatedOrderApi.shipAddrNo || undefined,
        InternalPoNo: updatedOrderApi.internalPoNo || undefined,
        NoteText: updatedOrderApi.noteText || undefined,
        Rowstate: updatedOrderApi.rowstate || "ACTIVE",
        CreatedBy: updatedOrderApi.createdBy,
        Rowversion: updatedOrderApi.rowversion,
        Rowkey: updatedOrderApi.rowkey
      };

      // 2. Sipariş satırlarını işle
      const lineResults = [];
      const lineErrors = [];

      for (const line of editingOrderLines) {
        try {
          console.log(`\n=== Satır ${line.OrderLine} işleniyor ===`);
          console.log("Satır verisi:", line);
          
          // LineNo ve RelNo'yu 3 karakterli string yap
          const lineNoStr = line.OrderLine.toString().padStart(3, '0');
          const relNoStr = line.RelNo || lineNoStr;
          
          // Yeni satır mı? - Rowkey'den kontrol et
          const isNewLine = line.Rowkey && (line.Rowkey.includes('new-line') || !line.Rowkey.includes('-'));
          
          if (isNewLine) {
            console.log(`YENİ SATIR oluşturuluyor: ${line.OrderLine}`);
            
            const lineData: CustomerOrderLineCreateDto = {
              company: updatedOrder.Company,
              orderNo: updatedOrder.OrderNo,
              contract: updatedOrder.Contract,
              lineNo: lineNoStr,
              relNo: relNoStr,
              catalogNo: line.PartNo || "GENEL",
              partNo: line.PartNo || "",
              catalogDesc: line.CatalogDesc || `Satır ${line.OrderLine}`,
              buyQtyDue: line.OrderQty || line.BuyQtyDue || 0,
              saleUnitPrice: line.Price || line.SaleUnitPrice || 0,
              rowstate: line.Rowstate || "ACTIVE"
            };

            console.log("Yeni satır POST verisi:", lineData);
            console.log("POST URL:", `http://localhost:5217/api/customerorderline/order/${updatedOrder.Company}/${updatedOrder.OrderNo}/${updatedOrder.Contract}`);

            const createResponse = await fetch(
              `http://localhost:5217/api/customerorderline/order/${updatedOrder.Company}/${updatedOrder.OrderNo}/${updatedOrder.Contract}`,
              {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(lineData)
              }
            );

            if (createResponse.ok) {
              const createdLine = await createResponse.json();
              console.log(`Satır ${line.OrderLine} başarıyla OLUŞTURULDU:`, createdLine);
              lineResults.push(createdLine);
            } else if (createResponse.status === 409) {
              console.log(`Satır ${line.OrderLine} zaten var, güncellenecek`);
              // Zaten varsa güncellemeye devam et
            } else {
              const errorText = await createResponse.text();
              console.error(`Satır ${line.OrderLine} oluşturma hatası:`, errorText);
              lineErrors.push(`Satır ${line.OrderLine}: ${errorText}`);
            }
          }
          
          // Mevcut satırı güncelle (yeni değilse veya 409 hatası aldıysak)
          console.log(`MEVCUT SATIR güncelleniyor: ${line.OrderLine}`);
          
          // CustomerOrderLineUpdateDto kullanarak
          const lineUpdateDto: CustomerOrderLineUpdateDto = {
            partNo: line.PartNo || "",
            catalogNo: line.CatalogNo || null,
            catalogDesc: line.CatalogDesc || null,
            buyQtyDue: line.OrderQty || line.BuyQtyDue || 0,
            saleUnitPrice: line.Price || line.SaleUnitPrice || 0,
            noteText: line.NoteText || null,
            rowstate: line.Rowstate || "ACTIVE",
            rowversion: line.Rowversion || 1
          };

          console.log("Satır PUT verisi:", lineUpdateDto);
          console.log("PUT URL:", `http://localhost:5217/api/customerorderline/${updatedOrder.Company}/${updatedOrder.OrderNo}/${updatedOrder.Contract}/${lineNoStr}/${relNoStr}`);

          const updateResponse = await fetch(
            `http://localhost:5217/api/customerorderline/${updatedOrder.Company}/${updatedOrder.OrderNo}/${updatedOrder.Contract}/${lineNoStr}/${relNoStr}`,
            {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(lineUpdateDto)
            }
          );

          if (updateResponse.ok) {
            const updatedLine = await updateResponse.json();
            console.log(`Satır ${line.OrderLine} başarıyla GÜNCELLENDİ:`, updatedLine);
            lineResults.push(updatedLine);
          } else {
            const errorText = await updateResponse.text();
            console.error(`Satır ${line.OrderLine} güncelleme hatası:`, errorText);
            lineErrors.push(`Satır ${line.OrderLine}: ${errorText}`);
          }
        } catch (err) {
          console.error(`Satır ${line.OrderLine} işlem hatası:`, err);
          lineErrors.push(`Satır ${line.OrderLine}: ${err instanceof Error ? err.message : "Bilinmeyen hata"}`);
        }
      }

      // 3. Sonuçları işle
      console.log("\n=== İŞLEM SONUÇLARI ===");
      console.log("Başarılı satırlar:", lineResults.length);
      console.log("Hatalar:", lineErrors.length, lineErrors);

      if (lineErrors.length > 0) {
        alert(`Sipariş güncellendi ancak bazı satırlar işlenemedi:\n${lineErrors.join('\n')}`);
      }

      // 4. Verileri yeniden yükle
      console.log("Veriler yeniden yükleniyor...");
      await fetchCustomerOrders();
      
      // Seçili siparişi güncelle
      setSelectedOrder(updatedOrder);
      setEditingOrder(updatedOrder);
      
      // Sipariş satırlarını yeniden yükle
      await fetchOrderLines(updatedOrder.Company, updatedOrder.OrderNo, updatedOrder.Contract);
      
      setIsEditing(false);
      alert("Sipariş ve satırlar başarıyla güncellendi!");
      
    } else {
      const errorText = await response.text();
      console.error("Ana sipariş güncelleme hatası:", errorText);
      throw new Error(`Sipariş güncellenemedi: ${errorText}`);
    }
  } catch (err) {
    console.error("Sipariş güncellenirken hata:", err);
    alert(`Hata: ${err instanceof Error ? err.message : "Bilinmeyen hata"}`);
  } finally {
    setIsSaving(false);
  }
}, [editingOrder, selectedOrder, editingOrderLines, customerOrders.length, fetchCustomerOrders]);

  const handleDeleteOrder = useCallback(async () => {
    if (!selectedOrder) return;
    
    if (!window.confirm(`${selectedOrder.OrderNo} numaralı siparişi silmek istediğinize emin misiniz?`)) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:5217/api/customerorder/${selectedOrder.Company}/${selectedOrder.OrderNo}/${selectedOrder.Contract}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Listeyi yeniden yükle
        await fetchCustomerOrders();
        
        // Seçili siparişi temizle
        setSelectedOrder(null);
        setEditingOrder(null);
        setEditingOrderLines([]);
        setIsEditing(false);
        
        alert("Sipariş başarıyla silindi!");
      } else {
        const errorText = await response.text();
        throw new Error(`Silme başarısız: ${errorText}`);
      }
    } catch (err) {
      console.error("Sipariş silinirken hata:", err);
      alert(`Hata: ${err instanceof Error ? err.message : "Bilinmeyen hata"}`);
    }
  }, [selectedOrder]);

  // Yeni sipariş formu işlemleri (değişmedi)
  const handleNewOrderDataChange = useCallback((field: keyof CustomerOrderCreateDto, value: any) => {
    const updatedData = {
      ...newOrderData,
      [field]: value
    };
    
    setNewOrderData(updatedData);
    
    if (field === 'orderNo') {
      const updatedLines = newOrderLines.map(line => ({
        ...line,
        orderNo: value
      }));
      setNewOrderLines(updatedLines);
    }
  }, [newOrderData, newOrderLines]);

  const handleNewOrderLineChange = useCallback((index: number, field: keyof CustomerOrderLineCreateDto, value: any) => {
    const updatedLines = [...newOrderLines];
    updatedLines[index] = {
      ...updatedLines[index],
      [field]: field === 'buyQtyDue' || field === 'saleUnitPrice' 
        ? parseFloat(value) || 0 
        : value
    };
    setNewOrderLines(updatedLines);
  }, [newOrderLines]);

  const addNewOrderLineInNewOrder = useCallback(() => {
    const newLine: CustomerOrderLineCreateDto = {
      company: newOrderData.company,
      orderNo: newOrderData.orderNo,
      contract: newOrderData.contract,
      lineNo: String(newOrderLines.length + 1).padStart(3, '0'),
      relNo: String(newOrderLines.length + 1).padStart(3, '0'),
      catalogNo: "",
      partNo: "",
      buyQtyDue: 1,
      saleUnitPrice: 0
    };
    setNewOrderLines([...newOrderLines, newLine]);
  }, [newOrderData, newOrderLines]);

  const removeNewOrderLine = useCallback((index: number) => {
    if (newOrderLines.length > 1) {
      const updatedLines = newOrderLines.filter((_, i) => i !== index);
      const renumberedLines = updatedLines.map((line, idx) => ({
        ...line,
        lineNo: String(idx + 1).padStart(3, '0'),
        relNo: String(idx + 1).padStart(3, '0')
      }));
      setNewOrderLines(renumberedLines);
    }
  }, [newOrderLines]);

  const calculateNewOrderTotals = useCallback(() => {
    const subtotal = newOrderLines.reduce((sum, line) => {
      const qty = line.buyQtyDue || 0;
      const price = line.saleUnitPrice || 0;
      return sum + (qty * price);
    }, 0);
    return { subtotal, grandTotal: subtotal };
  }, [newOrderLines]);

  const handleCreateNewOrder = useCallback(async () => {
    if (!newOrderData.customerNo || !newOrderData.orderNo || !newOrderData.company || !newOrderData.contract) {
      alert("Lütfen zorunlu alanları doldurun (Şirket, Sipariş No, Müşteri No, Kontrat)");
      return;
    }

    setIsSaving(true);

    try {
      console.log("Ana sipariş kaydediliyor:", newOrderData);

      // 1. Önce ana siparişi kaydet - camelCase gönder
      const orderResponse = await fetch('http://localhost:5217/api/customerorder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newOrderData)
      });

      if (!orderResponse.ok) {
        const errorText = await orderResponse.text();
        console.error("Sipariş kayıt hatası:", errorText);
        throw new Error(`Sipariş kaydedilemedi: ${errorText}`);
      }

      const savedOrder: CustomerOrderApiResponse = await orderResponse.json();
      console.log("Ana sipariş başarıyla kaydedildi:", savedOrder);

      // 2. Sipariş satırlarını kaydet
      const savedLines: any[] = [];
      let lineErrors: string[] = [];

      for (const [index, line] of newOrderLines.entries()) {
        try {
          if (!line.partNo) {
            console.warn(`Satır ${index + 1} için partNo girilmemiş, atlanıyor...`);
            continue;
          }

          const lineData = {
            ...line,
            orderNo: savedOrder.orderNo,
            company: savedOrder.company,
            contract: savedOrder.contract
          };

          console.log(`Satır ${index + 1} kaydediliyor:`, lineData);

          const lineResponse = await fetch('http://localhost:5217/api/customerorderline/order/' + 
            `${savedOrder.company}/${savedOrder.orderNo}/${savedOrder.contract}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(lineData)
          });

          if (lineResponse.ok) {
            const savedLine = await lineResponse.json();
            savedLines.push(savedLine);
            console.log(`Satır ${index + 1} başarıyla kaydedildi:`, savedLine);
          } else {
            const errorText = await lineResponse.text();
            console.error(`Satır ${index + 1} kayıt hatası:`, errorText);
            lineErrors.push(`Satır ${index + 1}: ${errorText}`);
          }
        } catch (lineErr) {
          console.error(`Satır ${index + 1} işlem hatası:`, lineErr);
          lineErrors.push(`Satır ${index + 1}: ${lineErr}`);
        }
      }

      // 3. Sonuçları işle
      if (lineErrors.length > 0) {
        console.warn("Bazı satırlar kaydedilemedi:", lineErrors);
        alert(`Ana sipariş kaydedildi ancak bazı satırlar kaydedilemedi:\n${lineErrors.join('\n')}`);
      } else if (savedLines.length === 0) {
        console.warn("Hiçbir satır kaydedilmedi");
        alert("Ana sipariş kaydedildi ancak hiçbir satır eklenmedi.");
      } else {
        console.log("Tüm satırlar başarıyla kaydedildi:", savedLines.length);
      }

      // 4. SİPARİŞ LİSTESİNİ YENİDEN ÇEK
      await fetchCustomerOrders();
      
      // 5. Yeni eklenen siparişi frontend formatına çevir ve seç
      const newOrder: CustomerOrder = {
        id: customerOrders.length + 1,
        Company: savedOrder.company,
        OrderNo: savedOrder.orderNo,
        Contract: savedOrder.contract,
        CustomerNo: savedOrder.customerNo,
        CustomerPoNo: savedOrder.customerPoNo || undefined,
        DateEntered: savedOrder.dateEntered,
        WantedDeliveryDate: savedOrder.wantedDeliveryDate || undefined,
        PayTermBaseDate: savedOrder.payTermBaseDate || undefined,
        CurrencyCode: savedOrder.currencyCode || undefined,
        PayTermId: savedOrder.payTermId || undefined,
        DeliveryTerms: savedOrder.deliveryTerms || undefined,
        ShipViaCode: savedOrder.shipViaCode || undefined,
        DeliveryCountryCode: savedOrder.deliveryCountryCode || undefined,
        OrderId: savedOrder.orderId || undefined,
        AuthorizeCode: savedOrder.authorizeCode || undefined,
        SalesmanCode: savedOrder.salesmanCode || undefined,
        BillAddrNo: savedOrder.billAddrNo || undefined,
        ShipAddrNo: savedOrder.shipAddrNo || undefined,
        InternalPoNo: savedOrder.internalPoNo || undefined,
        NoteText: savedOrder.noteText || undefined,
        Rowstate: savedOrder.rowstate || "ACTIVE",
        CreatedBy: savedOrder.createdBy || "admin",
        Rowversion: savedOrder.rowversion || 1,
        Rowkey: savedOrder.rowkey || `new-order-${Date.now()}`
      };

      setSelectedOrder(newOrder);
      setEditingOrder(newOrder);
      setIsCreatingNewOrder(false);
      
      // 6. Formu sıfırla
      resetForm();
      
      alert(`Sipariş başarıyla oluşturuldu: ${savedOrder.orderNo}\nKaydedilen satır sayısı: ${savedLines.length}`);

    } catch (err) {
      console.error("Sipariş oluşturma hatası:", err);
      alert(`Hata: ${err instanceof Error ? err.message : "Bilinmeyen hata"}`);
    } finally {
      setIsSaving(false);
    }
  }, [newOrderData, newOrderLines, customerOrders, fetchCustomerOrders]);

  const resetForm = useCallback(() => {
    setNewOrderData({
      company: "TST",
      orderNo: `SO${String(Math.floor(Math.random() * 10000)).padStart(5, '0')}`,
      contract: "001",
      customerNo: "",
      dateEntered: new Date().toISOString().split('T')[0],
      createdBy: "admin",
      rowstate: "ACTIVE",
      rowversion: 1,
      rowkey: `new-order-${Date.now()}`
    });
    
    setNewOrderLines([
      {
        company: "TST",
        orderNo: `SO${String(Math.floor(Math.random() * 10000)).padStart(5, '0')}`,
        contract: "001",
        lineNo: "001",
        relNo: "001",
        catalogNo: "",
        partNo: "",
        buyQtyDue: 1,
        saleUnitPrice: 0
      }
    ]);
  }, []);

  const handleCancelNewOrder = useCallback(() => {
    setIsCreatingNewOrder(false);
    resetForm();
  }, [resetForm]);

  // Sipariş satırları toplamını hesapla
const calculateOrderLinesTotal = useCallback(() => {
  if (!editingOrderLines || editingOrderLines.length === 0) return 0;
  
  return editingOrderLines.reduce((total, line) => {
    const orderQty = line.OrderQty || line.BuyQtyDue || 0;
    const price = line.Price || line.SaleUnitPrice || 0;
    return total + (orderQty * price);
  }, 0);
}, [editingOrderLines]);


//pdf

const generatePDF = useCallback(async () => {
  if (!selectedOrder) {
    alert("Lütfen önce bir sipariş seçin!");
    return;
  }

  try {
    // Önce HTML içeriğini hazırla
    const element = document.createElement('div');
    element.style.padding = '20px';
    element.style.backgroundColor = 'white';
    element.style.color = 'black';
    element.style.fontFamily = 'Arial, sans-serif';
    
    const totals = calculateOrderLinesTotal();
    const kdv = totals * 0.18;
    const genelToplam = totals + kdv;
    
    element.innerHTML = `
      <div style="text-align: center; margin-bottom: 20px;">
        <h1 style="color: #1e3a8a; margin-bottom: 10px; font-size: 24px;">SATIŞ SİPARİŞİ</h1>
        <div style="border-bottom: 2px solid #1e3a8a; width: 200px; margin: 0 auto;"></div>
      </div>
      
      <div style="margin-bottom: 20px; padding: 15px; background-color: #f8fafc; border-radius: 5px; border: 1px solid #ddd;">
        <h3 style="color: #334155; margin-bottom: 10px; font-size: 16px;">SİPARİŞ BİLGİLERİ</h3>
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px;">
          <div><strong>Sipariş No:</strong> ${selectedOrder.OrderNo}</div>
          <div><strong>Şirket:</strong> ${selectedOrder.Company}</div>
          <div><strong>Kontrat:</strong> ${selectedOrder.Contract}</div>
          <div><strong>Müşteri No:</strong> ${selectedOrder.CustomerNo}</div>
          <div><strong>Sipariş Tarihi:</strong> ${new Date(selectedOrder.DateEntered).toLocaleDateString('tr-TR')}</div>
          <div><strong>Teslimat Tarihi:</strong> ${selectedOrder.WantedDeliveryDate ? new Date(selectedOrder.WantedDeliveryDate).toLocaleDateString('tr-TR') : 'Belirtilmemiş'}</div>
          <div><strong>Para Birimi:</strong> ${selectedOrder.CurrencyCode || 'TRY'}</div>
          <div><strong>Durum:</strong> ${selectedOrder.Rowstate}</div>
        </div>
        ${selectedOrder.NoteText ? `<div style="margin-top: 10px; padding-top: 10px; border-top: 1px solid #ddd;"><strong>Notlar:</strong> ${selectedOrder.NoteText}</div>` : ''}
      </div>
      
      ${editingOrderLines.length > 0 ? `
        <div style="margin-bottom: 20px;">
          <h3 style="color: #334155; margin-bottom: 10px; font-size: 16px;">SİPARİŞ SATIRLARI</h3>
          <table style="width: 100%; border-collapse: collapse; font-size: 12px; border: 1px solid #ddd;">
            <thead>
              <tr style="background-color: #1e40af; color: white;">
                <th style="padding: 8px; border: 1px solid #ddd; text-align: center;">Satır</th>
                <th style="padding: 8px; border: 1px solid #ddd;">Malzeme No</th>
                <th style="padding: 8px; border: 1px solid #ddd;">Açıklama</th>
                <th style="padding: 8px; border: 1px solid #ddd; text-align: right;">Miktar</th>
                <th style="padding: 8px; border: 1px solid #ddd; text-align: right;">Birim Fiyat</th>
                <th style="padding: 8px; border: 1px solid #ddd; text-align: right;">Toplam</th>
              </tr>
            </thead>
            <tbody>
              ${editingOrderLines.map((line, index) => {
                const quantity = line.OrderQty || line.BuyQtyDue || 0;
                const price = line.Price || line.SaleUnitPrice || 0;
                const total = quantity * price;
                
                return `
                  <tr style="${index % 2 === 0 ? 'background-color: #f8fafc;' : ''}">
                    <td style="padding: 6px; border: 1px solid #ddd; text-align: center;">${line.OrderLine}</td>
                    <td style="padding: 6px; border: 1px solid #ddd;">${line.PartNo || '-'}</td>
                    <td style="padding: 6px; border: 1px solid #ddd;">${line.CatalogDesc || '-'}</td>
                    <td style="padding: 6px; border: 1px solid #ddd; text-align: right;">${quantity.toFixed(2)}</td>
                    <td style="padding: 6px; border: 1px solid #ddd; text-align: right;">${price.toFixed(2)} ${selectedOrder.CurrencyCode || 'TL'}</td>
                    <td style="padding: 6px; border: 1px solid #ddd; text-align: right; font-weight: bold;">${total.toFixed(2)} ${selectedOrder.CurrencyCode || 'TL'}</td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      ` : ''}
      
      <div style="padding: 15px; background-color: #f0f9ff; border-radius: 5px; border: 1px solid #ddd;">
        <h3 style="color: #334155; margin-bottom: 10px; font-size: 16px;">TOPLAMLAR</h3>
        <div style="display: flex; justify-content: space-between;">
          <div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
              <span>Ara Toplam:</span>
              <span style="font-weight: bold;">${totals.toFixed(2)} ${selectedOrder.CurrencyCode || 'TL'}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
              <span>KDV (%18):</span>
              <span style="font-weight: bold;">${kdv.toFixed(2)} ${selectedOrder.CurrencyCode || 'TL'}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-top: 10px; padding-top: 10px; border-top: 2px solid #ddd;">
              <span style="font-size: 16px; font-weight: bold;">GENEL TOPLAM:</span>
              <span style="font-size: 18px; font-weight: bold; color: #1e40af;">${genelToplam.toFixed(2)} ${selectedOrder.CurrencyCode || 'TL'}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div style="margin-top: 20px; padding-top: 10px; border-top: 1px dashed #ccc; color: #666; font-size: 11px;">
        <div style="display: flex; justify-content: space-between;">
          <div>Doküman No: SO-${selectedOrder.OrderNo}-${new Date().getFullYear()}</div>
          <div>Oluşturulma: ${new Date().toLocaleString('tr-TR')}</div>
          <div>Oluşturan: ${selectedOrder.CreatedBy || 'Sistem'}</div>
        </div>
        <div style="text-align: center; margin-top: 5px; font-style: italic;">
          Bu belge ERP Suite sistemi tarafından otomatik oluşturulmuştur.
        </div>
      </div>
    `;

    // HTML2PDF'ı dynamic import et
    try {
      const html2pdf = (await import('html2pdf.js')).default;
      
      const opt = {
  margin: 10,
  filename: `Siparis_${selectedOrder.OrderNo}_${new Date().toISOString().split('T')[0]}.pdf`,
  image: { 
    type: 'jpeg' as const, // 'as const' ekleyin veya literal type kullanın
    quality: 0.98 
  },
  html2canvas: { 
    scale: 2,
    useCORS: true,
    logging: false,
    backgroundColor: '#ffffff'
  },
  jsPDF: { 
    unit: 'mm' as const, 
    format: 'a4' as const, 
    orientation: 'portrait' as const
  }
};
      
      html2pdf()
        .set(opt)
        .from(element)
        .save()
        .then(() => {
          console.log('✅ PDF başarıyla oluşturuldu');
          alert(`✅ "${selectedOrder.OrderNo}" siparişi PDF olarak kaydedildi!`);
        })
        .catch((err: any) => {
          console.error('❌ PDF oluşturma hatası:', err);
          alert('❌ PDF oluşturulurken bir hata oluştu!');
        });
        
    } catch (importError) {
      console.error('❌ HTML2PDF yüklenemedi:', importError);
      
      // Alternatif: Yeni pencere ile yazdır
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Sipariş ${selectedOrder.OrderNo}</title>
              <style>
                body { font-family: Arial, sans-serif; padding: 20px; }
                h1 { color: #1e3a8a; }
                table { width: 100%; border-collapse: collapse; margin: 20px 0; }
                th, td { border: 1px solid #ddd; padding: 8px; }
                th { background-color: #f2f2f2; }
                .total { font-weight: bold; font-size: 18px; color: #1e40af; }
              </style>
            </head>
            <body>
              ${element.innerHTML}
              <script>
                window.onload = function() {
                  window.print();
                  setTimeout(() => window.close(), 1000);
                }
              </script>
            </body>
          </html>
        `);
        printWindow.document.close();
        alert('PDF oluşturulamadı, yazdırma penceresi açıldı. Lütfen tarayıcınızın yazdırma seçeneğinden PDF olarak kaydedin.');
      }
    }
      
  } catch (error) {
    console.error('❌ PDF oluşturma hatası:', error);
    alert('❌ PDF oluşturulurken bir hata oluştu!');
  }
}, [selectedOrder, editingOrderLines, calculateOrderLinesTotal]);

//pdf

  // YENİ SİPARİŞ OLUŞTURMA EKRANI (aynı kaldı, değişmedi)
  if (isCreatingNewOrder) {
    const { grandTotal } = calculateNewOrderTotals();

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
                <span>Önce ana sipariş kaydedilecek, ardından sipariş satırları tek tek eklenecektir.</span>
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
              Sipariş Bilgileri (Önce Kaydedilecek)
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
                  Şirket <span style={{ color: "#ef4444" }}>*</span>
                </label>
                <input
                  type="text"
                  value={newOrderData.company}
                  onChange={(e) => handleNewOrderDataChange('company', e.target.value)}
                  style={inputStyle}
                  placeholder="Örn: TST"
                />
              </div>
              <div>
                <label style={{ fontSize: "0.85rem", color: "#94a3b8", marginBottom: "5px", display: "block" }}>
                  Sipariş No <span style={{ color: "#ef4444" }}>*</span>
                </label>
                <input
                  type="text"
                  value={newOrderData.orderNo}
                  onChange={(e) => handleNewOrderDataChange('orderNo', e.target.value)}
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={{ fontSize: "0.85rem", color: "#94a3b8", marginBottom: "5px", display: "block" }}>
                  Kontrat <span style={{ color: "#ef4444" }}>*</span>
                </label>
                <input
                  type="text"
                  value={newOrderData.contract}
                  onChange={(e) => handleNewOrderDataChange('contract', e.target.value)}
                  style={inputStyle}
                  placeholder="Örn: 001"
                />
              </div>
              <div>
                <label style={{ fontSize: "0.85rem", color: "#94a3b8", marginBottom: "5px", display: "block" }}>
                  Müşteri No <span style={{ color: "#ef4444" }}>*</span>
                </label>
                <input
                  type="text"
                  value={newOrderData.customerNo}
                  onChange={(e) => handleNewOrderDataChange('customerNo', e.target.value)}
                  style={inputStyle}
                  placeholder="Müşteri numarası girin"
                />
              </div>
              <div>
                <label style={{ fontSize: "0.85rem", color: "#94a3b8", marginBottom: "5px", display: "block" }}>
                  Sipariş Tarihi
                </label>
                <input
                  type="date"
                  value={newOrderData.dateEntered}
                  onChange={(e) => handleNewOrderDataChange('dateEntered', e.target.value)}
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={{ fontSize: "0.85rem", color: "#94a3b8", marginBottom: "5px", display: "block" }}>
                  İstenen Teslimat Tarihi
                </label>
                <input
                  type="date"
                  value={newOrderData.wantedDeliveryDate || ''}
                  onChange={(e) => handleNewOrderDataChange('wantedDeliveryDate', e.target.value || undefined)}
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={{ fontSize: "0.85rem", color: "#94a3b8", marginBottom: "5px", display: "block" }}>
                  Para Birimi
                </label>
                <input
                  type="text"
                  value={newOrderData.currencyCode || ''}
                  onChange={(e) => handleNewOrderDataChange('currencyCode', e.target.value || undefined)}
                  style={inputStyle}
                  placeholder="TRY"
                />
              </div>
              <div>
                <label style={{ fontSize: "0.85rem", color: "#94a3b8", marginBottom: "5px", display: "block" }}>
                  Müşteri Sipariş No
                </label>
                <input
                  type="text"
                  value={newOrderData.customerPoNo || ''}
                  onChange={(e) => handleNewOrderDataChange('customerPoNo', e.target.value || undefined)}
                  style={inputStyle}
                  placeholder="Müşteri sipariş numarası"
                />
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
                Sipariş Satırları (Sipariş Kaydedildikten Sonra Eklenecek)
              </h3>
              <button
                onClick={addNewOrderLineInNewOrder}
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
                gridTemplateColumns: "60px 120px 2fr 100px 100px 120px 60px",
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
                <div>Birim Fiyat</div>
                <div>Toplam</div>
                <div>Sil</div>
              </div>

              {/* Grid Body */}
              <div>
                {newOrderLines.map((line, index) => {
                  const qty = line.buyQtyDue || 0;
                  const price = line.saleUnitPrice || 0;
                  const lineTotal = qty * price;
                  
                  return (
                    <div
                      key={index}
                      style={{
                        display: "grid",
                        gridTemplateColumns: "60px 120px 2fr 100px 100px 120px 60px",
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
                          value={line.catalogDesc || ''}
                          onChange={(e) => handleNewOrderLineChange(index, 'catalogDesc', e.target.value)}
                          style={{
                            width: "100%",
                            padding: "6px 8px",
                            backgroundColor: "rgba(30, 41, 59, 0.8)",
                            border: "1px solid #475569",
                            borderRadius: "4px",
                            color: "#f1f5f9",
                            fontSize: "0.85rem"
                          }}
                          placeholder="Malzeme açıklaması"
                        />
                      </div>
                      <div>
                        <input
                          type="number"
                          value={qty}
                          onChange={(e) => handleNewOrderLineChange(index, 'buyQtyDue', e.target.value)}
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
                        <input
                          type="number"
                          value={price}
                          onChange={(e) => handleNewOrderLineChange(index, 'saleUnitPrice', e.target.value)}
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
                      <div style={{ color: "#10b981", fontWeight: "600", textAlign: "right", paddingRight: "10px" }}>
                        {lineTotal.toFixed(2)}
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
                  );
                })}
              </div>

              {/* Grid Footer - Toplamlar */}
              <div style={{
                display: "grid",
                gridTemplateColumns: "60px 120px 2fr 100px 100px 120px 60px",
                padding: "12px 15px",
                backgroundColor: "#1e293b",
                borderTop: "2px solid #475569",
                fontSize: "0.9rem",
                fontWeight: "600",
                color: "#f1f5f9"
              }}>
                <div style={{ gridColumn: "1 / 6", textAlign: "right", paddingRight: "10px" }}>
                  GENEL TOPLAM:
                </div>
                <div style={{ color: "#10b981", fontSize: "1rem", textAlign: "right", paddingRight: "10px" }}>
                  {grandTotal.toFixed(2)}
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
                disabled={isSaving || !newOrderData.customerNo || !newOrderData.orderNo || !newOrderData.company || !newOrderData.contract}
                style={{
                  background: !newOrderData.customerNo || !newOrderData.orderNo || !newOrderData.company || !newOrderData.contract
                    ? "#475569" 
                    : isSaving
                    ? "#f59e0b"
                    : "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  padding: "10px 25px",
                  fontSize: "0.9rem",
                  cursor: !newOrderData.customerNo || !newOrderData.orderNo || !newOrderData.company || !newOrderData.contract || isSaving 
                    ? "not-allowed" 
                    : "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  opacity: !newOrderData.customerNo || !newOrderData.orderNo || !newOrderData.company || !newOrderData.contract || isSaving ? 0.6 : 1
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
                    <span>Siparişi Oluştur</span>
                  </>
                )}
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
                  <span>
                    Şirket: <strong>{selectedOrder.Company}</strong> | 
                    Sipariş: <strong>{selectedOrder.OrderNo}</strong> | 
                    Müşteri: <strong>{selectedOrder.CustomerNo}</strong>
                    {isEditing && " (Düzenleme Modu)"}
                  </span>
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
                  <span>Seçili: <strong>{selectedOrder.OrderNo}</strong></span>
                  <span style={{ marginLeft: "8px", color: "#f59e0b" }}>
                    <i className="fas fa-coins" style={{ marginRight: "4px" }}></i>
                    Durum: {selectedOrder.Rowstate}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Seçili sipariş detayları */}
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
                Sipariş Detayları
              </h3>
              
              {/* Düzenleme Butonları */}
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
                    {/* PDF BUTONU EKLEYİN */}
      <button
        onClick={generatePDF}
        disabled={!selectedOrder}
        style={{
          background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
          color: "white",
          border: "none",
          borderRadius: "6px",
          padding: "8px 15px",
          fontSize: "0.85rem",
          cursor: selectedOrder ? "pointer" : "not-allowed",
          display: "flex",
          alignItems: "center",
          gap: "6px",
          opacity: selectedOrder ? 1 : 0.6
        }}
        title="Siparişi PDF olarak kaydet"
      >
        <i className="fas fa-file-pdf"></i>
        <span>PDF Oluştur</span>
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
            
            <div style={{ 
              display: "grid", 
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", 
              gap: "15px",
              marginBottom: "20px"
            }}>
              {/* Şirket */}
              <div>
                <label style={labelStyle}>Şirket</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editingOrder.Company}
                    onChange={(e) => handleEditingOrderChange('Company', e.target.value)}
                    style={inputStyle}
                  />
                ) : (
                  <div style={{ 
                    padding: "8px", 
                    backgroundColor: "rgba(30, 41, 59, 0.5)",
                    borderRadius: "4px",
                    color: "#f1f5f9"
                  }}>
                    {editingOrder.Company}
                  </div>
                )}
              </div>
              
              {/* Sipariş No */}
              <div>
                <label style={labelStyle}>Sipariş No</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editingOrder.OrderNo}
                    onChange={(e) => handleEditingOrderChange('OrderNo', e.target.value)}
                    style={inputStyle}
                  />
                ) : (
                  <div style={{ 
                    padding: "8px", 
                    backgroundColor: "rgba(30, 41, 59, 0.5)",
                    borderRadius: "4px",
                    color: "#f1f5f9"
                  }}>
                    {editingOrder.OrderNo}
                  </div>
                )}
              </div>
              
              {/* Kontrat */}
              <div>
                <label style={labelStyle}>Kontrat</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editingOrder.Contract}
                    onChange={(e) => handleEditingOrderChange('Contract', e.target.value)}
                    style={inputStyle}
                  />
                ) : (
                  <div style={{ 
                    padding: "8px", 
                    backgroundColor: "rgba(30, 41, 59, 0.5)",
                    borderRadius: "4px",
                    color: "#f1f5f9"
                  }}>
                    {editingOrder.Contract}
                  </div>
                )}
              </div>
              
              {/* Müşteri No */}
              <div>
                <label style={labelStyle}>Müşteri No</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editingOrder.CustomerNo}
                    onChange={(e) => handleEditingOrderChange('CustomerNo', e.target.value)}
                    style={inputStyle}
                  />
                ) : (
                  <div style={{ 
                    padding: "8px", 
                    backgroundColor: "rgba(30, 41, 59, 0.5)",
                    borderRadius: "4px",
                    color: "#f1f5f9"
                  }}>
                    {editingOrder.CustomerNo}
                  </div>
                )}
              </div>
              
              {/* Sipariş Tarihi */}
              <div>
                <label style={labelStyle}>Sipariş Tarihi</label>
                {isEditing ? (
                  <input
                    type="date"
                    value={editingOrder.DateEntered}
                    onChange={(e) => handleEditingOrderChange('DateEntered', e.target.value)}
                    style={inputStyle}
                  />
                ) : (
                  <div style={{ 
                    padding: "8px", 
                    backgroundColor: "rgba(30, 41, 59, 0.5)",
                    borderRadius: "4px",
                    color: "#f1f5f9"
                  }}>
                    {editingOrder.DateEntered}
                  </div>
                )}
              </div>
              
              {/* Müşteri Sipariş No */}
              <div>
                <label style={labelStyle}>Müşteri Sipariş No</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editingOrder.CustomerPoNo || ''}
                    onChange={(e) => handleEditingOrderChange('CustomerPoNo', e.target.value || undefined)}
                    style={inputStyle}
                    placeholder="Müşteri sipariş numarası"
                  />
                ) : (
                  <div style={{ 
                    padding: "8px", 
                    backgroundColor: "rgba(30, 41, 59, 0.5)",
                    borderRadius: "4px",
                    color: "#f1f5f9"
                  }}>
                    {editingOrder.CustomerPoNo || '-'}
                  </div>
                )}
              </div>
              
              {/* İstenen Teslimat Tarihi */}
              <div>
                <label style={labelStyle}>İstenen Teslimat Tarihi</label>
                {isEditing ? (
                  <input
                    type="date"
                    value={editingOrder.WantedDeliveryDate || ''}
                    onChange={(e) => handleEditingOrderChange('WantedDeliveryDate', e.target.value || undefined)}
                    style={inputStyle}
                  />
                ) : (
                  <div style={{ 
                    padding: "8px", 
                    backgroundColor: "rgba(30, 41, 59, 0.5)",
                    borderRadius: "4px",
                    color: "#f1f5f9"
                  }}>
                    {editingOrder.WantedDeliveryDate || '-'}
                  </div>
                )}
              </div>
              
              {/* Para Birimi */}
              <div>
                <label style={labelStyle}>Para Birimi</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editingOrder.CurrencyCode || ''}
                    onChange={(e) => handleEditingOrderChange('CurrencyCode', e.target.value || undefined)}
                    style={inputStyle}
                    placeholder="TRY"
                  />
                ) : (
                  <div style={{ 
                    padding: "8px", 
                    backgroundColor: "rgba(30, 41, 59, 0.5)",
                    borderRadius: "4px",
                    color: "#f1f5f9"
                  }}>
                    {editingOrder.CurrencyCode || '-'}
                  </div>
                )}
              </div>
              
              {/* Durum */}
              <div>
                <label style={labelStyle}>Durum</label>
                {isEditing ? (
                  <select
                    value={editingOrder.Rowstate || 'ACTIVE'}
                    onChange={(e) => handleEditingOrderChange('Rowstate', e.target.value)}
                    style={inputStyle}
                  >
                    <option value="ACTIVE">Aktif</option>
                    <option value="CLOSED">Kapalı</option>
                    <option value="CANCELLED">İptal Edildi</option>
                    <option value="ON_HOLD">Beklemede</option>
                  </select>
                ) : (
                  <div style={{ 
                    padding: "8px", 
                    backgroundColor: editingOrder.Rowstate === 'ACTIVE' ? "rgba(16, 185, 129, 0.2)" : 
                                   editingOrder.Rowstate === 'CLOSED' ? "rgba(59, 130, 246, 0.2)" : 
                                   editingOrder.Rowstate === 'CANCELLED' ? "rgba(239, 68, 68, 0.2)" : 
                                   "rgba(245, 158, 11, 0.2)",
                    borderRadius: "4px",
                    color: editingOrder.Rowstate === 'ACTIVE' ? "#10b981" : 
                           editingOrder.Rowstate === 'CLOSED' ? "#3b82f6" : 
                           editingOrder.Rowstate === 'CANCELLED' ? "#ef4444" : "#f59e0b",
                    fontWeight: "500"
                  }}>
                    {editingOrder.Rowstate}
                  </div>
                )}
              </div>
              
              {/* Notlar */}
              <div style={{ gridColumn: "1 / -1" }}>
                <label style={labelStyle}>Notlar</label>
                {isEditing ? (
                  <textarea
                    value={editingOrder.NoteText || ''}
                    onChange={(e) => handleEditingOrderChange('NoteText', e.target.value || undefined)}
                    rows={3}
                    style={{
                      ...inputStyle,
                      resize: "vertical"
                    }}
                    placeholder="Sipariş ile ilgili notlar..."
                  />
                ) : (
                  <div style={{ 
                    padding: "8px", 
                    backgroundColor: "rgba(30, 41, 59, 0.5)",
                    borderRadius: "4px",
                    color: "#f1f5f9",
                    minHeight: "50px"
                  }}>
                    {editingOrder.NoteText || '-'}
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
                      fontSize: "0.9rem",
                      transition: "all 0.2s"
                    }}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {activeTab === "Satış Sipariş Satırları" && (
                <div>
                  {editingOrderLines.length > 0 ? (
                    <div style={{
                      backgroundColor: "rgba(30, 41, 59, 0.3)",
                      borderRadius: "8px",
                      overflow: "hidden",
                      border: "1px solid #334155"
                    }}>
                     
<div style={{
  display: "grid",
  gridTemplateColumns: "60px 120px 2fr 100px 100px 120px 60px",
  backgroundColor: "#334155",
  padding: "12px 15px",
  borderBottom: "1px solid #475569",
  fontSize: "0.8rem",
  fontWeight: "600",
  color: "#f1f5f9"
}}>
  <div>Satır</div>
  <div>Malzeme</div>
  <div>Açıklama</div>
  <div>Miktar</div>
  <div>Birim Fiyat</div>
  <div>Toplam</div>
  <div>İşlem</div>
</div>


{editingOrderLines.map((line, index) => (
  <div
    key={line.id}
    style={{
      display: "grid",
      gridTemplateColumns: "60px 120px 2fr 100px 100px 120px 60px",
      padding: "10px 15px",
      borderBottom: "1px solid #334155",
      fontSize: "0.85rem",
      color: "#f1f5f9",
      backgroundColor: index % 2 === 0 ? "rgba(30, 41, 59, 0.5)" : "rgba(30, 41, 59, 0.3)",
      alignItems: "center"
    }}
  >
    <div>{line.OrderLine}</div>
    <div>
      {isEditing ? (
        <input
          type="text"
          value={line.PartNo}
          onChange={(e) => handleEditingOrderLineChange(index, 'PartNo', e.target.value)}
          style={{
            width: "100%",
            padding: "6px 8px",
            backgroundColor: "rgba(30, 41, 59, 0.8)",
            border: "1px solid #475569",
            borderRadius: "4px",
            color: "#f1f5f9",
            fontSize: "0.85rem"
          }}
        />
      ) : (
        line.PartNo
      )}
    </div>
    <div>
      {isEditing ? (
        <input
          type="text"
          value={line.CatalogDesc || ''} // CatalogDesc kullanın
          onChange={(e) => handleEditingOrderLineChange(index, 'CatalogDesc', e.target.value)}
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
      ) : (
        line.CatalogDesc || '-' // CatalogDesc gösterin
      )}
    </div>
    <div>
      {isEditing ? (
        <input
          type="number"
          value={line.OrderQty || line.BuyQtyDue || 0} // OrderQty veya BuyQtyDue kullanın
          onChange={(e) => handleEditingOrderLineChange(index, 'OrderQty', e.target.value)}
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
        (line.OrderQty || line.BuyQtyDue || 0).toFixed(2)
      )}
    </div>
    <div>
      {isEditing ? (
        <input
          type="number"
          value={line.Price || line.SaleUnitPrice || 0} // Price veya SaleUnitPrice kullanın
          onChange={(e) => handleEditingOrderLineChange(index, 'Price', e.target.value)}
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
        (line.Price || line.SaleUnitPrice || 0).toFixed(2)
      )}
    </div>
    <div style={{ color: "#10b981", fontWeight: "500", textAlign: "right", paddingRight: "10px" }}>
      {((line.OrderQty || line.BuyQtyDue || 0) * (line.Price || line.SaleUnitPrice || 0)).toFixed(2)}
    </div>
    <div style={{ textAlign: "center" }}>
      {isEditing && (
        <button
          onClick={() => removeOrderLine(index)}
          disabled={editingOrderLines.length <= 1}
          style={{
            background: editingOrderLines.length <= 1 ? "#64748b" : "#ef4444",
            color: "white",
            border: "none",
            borderRadius: "4px",
            width: "28px",
            height: "28px",
            cursor: editingOrderLines.length <= 1 ? "not-allowed" : "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            opacity: editingOrderLines.length <= 1 ? 0.5 : 1
          }}
          title="Satırı Sil"
        >
          <i className="fas fa-trash" style={{ fontSize: "0.7rem" }}></i>
        </button>
      )}
    </div>
  </div>
))}
                      
                      {/* Toplam ve Butonlar */}
                      <div style={{
                        display: "grid",
                        gridTemplateColumns: "60px 120px 2fr 100px 100px 120px 60px",
                        padding: "12px 15px",
                        backgroundColor: "#1e293b",
                        borderTop: "2px solid #475569",
                        fontSize: "0.9rem",
                        fontWeight: "600",
                        color: "#f1f5f9"
                      }}>
                        <div style={{ gridColumn: "1 / 5", display: "flex", alignItems: "center" }}>
                          {isEditing && (
                            <button
                              onClick={addNewOrderLine}
                              style={{
                                background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
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
                              <i className="fas fa-plus"></i>
                              <span>Yeni Satır Ekle</span>
                            </button>
                          )}
                        </div>
                        <div style={{ gridColumn: "5 / 7", textAlign: "right", paddingRight: "10px" }}>
                          GENEL TOPLAM:
                        </div>
                        <div style={{ color: "#10b981", fontSize: "1rem", textAlign: "right", paddingRight: "10px" }}>
                          {calculateOrderLinesTotal().toFixed(2)}
                        </div>
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
                      <i className="fas fa-list" style={{ fontSize: "2rem", marginBottom: "10px" }}></i>
                      <p>Bu siparişe ait satır bulunamadı.</p>
                      {isEditing && (
                        <button
                          onClick={addNewOrderLine}
                          style={{
                            background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                            color: "white",
                            border: "none",
                            borderRadius: "6px",
                            padding: "8px 16px",
                            fontSize: "0.85rem",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: "6px",
                            margin: "10px auto 0"
                          }}
                        >
                          <i className="fas fa-plus"></i>
                          <span>Yeni Satır Ekle</span>
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Sipariş seçilmediyse mesaj göster */}
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
            <i className="fas fa-shopping-cart" style={{ fontSize: "2.5rem", marginBottom: "15px", color: "#64748b" }}></i>
            <p style={{ marginBottom: "20px", fontSize: "0.95rem" }}>
              {customerOrders.length === 0 ? 
                "Henüz sipariş bulunmuyor. Yeni bir sipariş oluşturun." : 
                "Düzenlemek için soldaki listeden bir sipariş seçin."}
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
              <span>Yeni Sipariş Oluştur</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}