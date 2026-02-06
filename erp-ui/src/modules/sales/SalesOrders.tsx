import { useState, useEffect, useCallback } from "react";
import SearchList from "./../../components/SearchList";
import { ChevronRightIcon } from "@heroicons/react/24/outline";
import { ShopOrderService, ShopMaterialService } from "../../services/shopOrder.service";

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
  paidAmount?: number;
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
  PaidAmount?:number;
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

// Inventory Part Interface
interface InventoryPart {
  contract: string;
  partNo: string;
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
  rowkey: string;
  createDate?: string;
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
  paidAmount?: number;
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
  paidAmount?: number;
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

// YENİ: İş Emri DTO Interface
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

// Ürün Ağacı Interface'leri
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

// İş Emri Malzeme Tahsisi
interface ShopMaterialAlloc {
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
  rowkey: string;
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

  // Inventory Part Search States
  const [showInventorySearch, setShowInventorySearch] = useState(false);
  const [inventoryParts, setInventoryParts] = useState<InventoryPart[]>([]);
  const [inventoryLoading, setInventoryLoading] = useState(false);
  const [searchForHead, setSearchForHead] = useState(false); // true: head için, false: line için
  const [searchForLineIndex, setSearchForLineIndex] = useState<number>(-1); // hangi satır için

  // YENİ: İş Emri State'leri
  const [showShopOrderModal, setShowShopOrderModal] = useState(false);
  const [selectedLineForShopOrder, setSelectedLineForShopOrder] = useState<CustomerOrderLine | null>(null);
  const [_prodStructureHeads, setProdStructureHeads] = useState<ProdStructureHead[]>([]);
  const [_prodStructures, setProdStructures] = useState<ProdStructure[]>([]);
  const [_prodStructureLoading, setProdStructureLoading] = useState(false);
  const [shopOrderMaterials, setShopOrderMaterials] = useState<ShopMaterialAlloc[]>([]);
  const [newShopOrderData, setNewShopOrderData] = useState<NewShopOrderDto>({
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
    rowkey: `new-shop-order-${Date.now()}`
  });

  // Yeni sipariş formu state'leri (camelCase - API'ye gönderilecek)
  const [newOrderData, setNewOrderData] = useState<CustomerOrderCreateDto>({
    company: "TST",
    orderNo: `SO${String(Math.floor(Math.random() * 10000)).padStart(5, '0')}`,
    contract: "01",
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
      contract: "01",
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
      const response = await fetch('/api/customerorder');
      
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
          PaidAmount: apiOrder.paidAmount || 0,
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
          return;
        }
        
        // Listede yoksa API'den getir
        console.log('🌐 Sipariş listede yok, API\'den getiriliyor...');
        
        // Birden fazla endpoint deneyeceğiz
        const endpoints = [
          `/api/customerorder/${orderInfo.company}/${orderInfo.orderNo}/${orderInfo.contract}`,
          `/api/customerorder/get?company=${encodeURIComponent(orderInfo.company)}&orderNo=${encodeURIComponent(orderInfo.orderNo)}&contract=${encodeURIComponent(orderInfo.contract)}`,
          `/api/salesorder/${orderInfo.company}/${orderInfo.orderNo}/${orderInfo.contract}`
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
          PaidAmount: orderData.paidAmount || 0,
          Rowstate: orderData.rowstate || "ACTIVE",
          CreatedBy: orderData.createdBy || "admin",
          Rowversion: orderData.rowversion || 1,
          Rowkey: orderData.rowkey || `order-${Date.now()}`
        };
        
        // Siparişi seç
        setSelectedOrder(order);
        setEditingOrder(order);
        
        console.log(`✅ Sipariş başarıyla yüklendi (${successfulEndpoint})`);
        
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

  const fetchOrderLines = async (company: string, orderNo: string, contract: string) => {
    try {
      const response = await fetch(`/api/customerorderline/order/${company}/${orderNo}/${contract}`);
      
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


  // Ürün Ağacı Satırlarını Getir
  // Ürün Ağacı Satırlarını Getir - HATA DÜZELTMELİ VERSİYON
const fetchProdStructures = async (contract: string, partNo: string, engChgLevel: string = "A", bomTypeDb: string = "STANDARD") => {
  try {
    setProdStructureLoading(true);
    
    console.log(`🔍 Ürün ağacı satırları aranıyor:`, {
      contract,
      partNo,
      engChgLevel,
      bomTypeDb
    });
    
    const response = await fetch(
      `/api/prodstructure/head/${contract}/${partNo}/${engChgLevel}/${bomTypeDb}/000`
    );
    
    console.log(`📡 API Response Status: ${response.status}`);
    
    if (response.ok) {
      const data = await response.json();
      console.log(`✅ API'den gelen veri:`, data);
      console.log(`📊 Veri tipi: ${Array.isArray(data) ? 'Array' : typeof data}`);
      
      // Veriyi işle - eğer array değilse array yap
      const dataArray = Array.isArray(data) ? data : [data];
      
      console.log(`📊 İşlenecek veri sayısı: ${dataArray.length}`);
      
      const formattedStructures: ProdStructure[] = dataArray.map((apiLine: any, index: number) => {
        const formatted = {
          id: index + 1,
          Contract: apiLine.contract || apiLine.Contract || contract,
          PartNo: apiLine.partNo || apiLine.PartNo || partNo,
          EngChgLevel: apiLine.engChgLevel || apiLine.EngChgLevel || engChgLevel,
          BomTypeDb: apiLine.bomTypeDb || apiLine.BomTypeDb || bomTypeDb,
          AlternativeNo: apiLine.alternativeNo || apiLine.AlternativeNo || "000",
          LineItemNo: apiLine.lineItemNo || apiLine.LineItemNo || index + 1,
          LineSequence: apiLine.lineSequence || apiLine.LineSequence || index + 1,
          OperationNo: apiLine.operationNo || apiLine.OperationNo || 10,
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
        };
        
        console.log(`📝 Formatlanmış satır ${index + 1}:`, formatted);
        return formatted;
      });
      
      console.log(`✅ Formatlanmış yapılar (${formattedStructures.length} adet):`, formattedStructures);
      setProdStructures(formattedStructures);
      return formattedStructures;
    } else {
      const errorText = await response.text();
      console.error(`❌ Ürün ağacı satırları getirilemedi: ${errorText}`);
      console.error(`❌ Status: ${response.status} ${response.statusText}`);
      
      // Boş array döndür
      setProdStructures([]);
      return [];
    }
  } catch (err) {
    console.error("❌ Ürün ağacı satırları getirilirken hata:", err);
    
    // Hata mesajını daha detaylı göster
    if (err instanceof Error) {
      console.error(`❌ Hata detayı: ${err.message}`);
      console.error(`❌ Stack trace: ${err.stack}`);
    }
    
    setProdStructures([]);
    return [];
  } finally {
    setProdStructureLoading(false);
  }
};

  // Ürün Ağacını Malzeme Tahsislerine Çevir
  const convertProdStructuresToMaterials = (structures: ProdStructure[], orderQty: number = 1) => {
    const materials: ShopMaterialAlloc[] = structures
      .filter(structure => structure.ComponentPart && structure.ComponentPart.trim() !== "")
      .map((structure, index) => ({
        contract: "01",
        orderNo: newShopOrderData.orderNo,
        lineItemNo: index + 1,
        partNo: structure.ComponentPart || "",
        operationNo: structure.OperationNo || 10,
        qtyAssigned: 0,
        qtyIssued: 0,
        qtyPerAssembly: 1,
        qtyRequired: orderQty * 1,
        rowstate: "Active",
        rowkey: `shop-mat-${Date.now()}-${index}`
      }));
    
    setShopOrderMaterials(materials);
    return materials;
  };

  // İş Emri Oluşturma Modalını Aç
  const openShopOrderModal = async (orderLine: CustomerOrderLine) => {
  setSelectedLineForShopOrder(orderLine);
  setShowShopOrderModal(true);
  
  // İş emri verilerini hazırla
  const shopOrderData: NewShopOrderDto = {
    contract: orderLine.Contract || "01",
    orderNo: `WO${String(Math.floor(Math.random() * 10000)).padStart(5, '0')}`,
    orderCode: "001",
    partNo: orderLine.PartNo,
    revisedStartDate: new Date().toISOString().split('T')[0],
    revisedDueDate: orderLine.DeliveryDate || new Date().toISOString().split('T')[0],
    revisedQtyDue: orderLine.OrderQty || orderLine.BuyQtyDue || 1,
    qtyComplete: 0,
    noteText: `Satış Siparişi: ${selectedOrder?.OrderNo}, Satır: ${orderLine.OrderLine}`,
    customerOrderNo: selectedOrder?.OrderNo,
    rowstate: "Released",
    createdBy: "admin",
    rowversion: 1,
    rowkey: `new-shop-order-${Date.now()}`
  };
  
  setNewShopOrderData(shopOrderData);
  
  // Ürün ağacını getir
  if (orderLine.PartNo) {
    try {
      console.log(`🛠️ İş Emri için malzeme: ${orderLine.PartNo}`);
      
      // Direkt sabit değerlerle ürün ağacını getir
      const contract = orderLine.Contract || "01";
      const partNo = orderLine.PartNo;
      const engChgLevel = "A";
      const bomTypeDb = "STANDARD";
      
      console.log(`🔍 Direkt ürün ağacı çekiliyor: ${contract}/${partNo}/${engChgLevel}/${bomTypeDb}`);
      
      const structures = await fetchProdStructures(
        contract,
        partNo,
        engChgLevel,
        bomTypeDb
      );
      
      console.log(`📊 Ürün ağacı satırları (${structures.length} adet):`, structures);
      
      if (structures.length > 0) {
        const materials = convertProdStructuresToMaterials(structures, orderLine.OrderQty || orderLine.BuyQtyDue || 1);
        console.log(`📦 Malzeme tahsisleri oluşturuldu:`, materials.length, "adet");
        setShopOrderMaterials(materials);
        
        // Başlık için de test verisi oluştur (gösterim için)
        const testHead: ProdStructureHead = {
          id: 1,
          Contract: contract,
          PartNo: partNo,
          EngChgLevel: engChgLevel,
          BomTypeDb: bomTypeDb,
          CreateDate: new Date().toISOString().split('T')[0],
          CreatedBy: "admin",
          Rowversion: 1,
          Rowkey: `head-${Date.now()}`
        };
        setProdStructureHeads([testHead]);
      } else {
        console.warn(`⚠️ "${orderLine.PartNo}" malzemesi için ürün ağacı bulunamadı.`);
        
        // Kullanıcıya seçenek sun
        const userChoice = window.confirm(
          `"${orderLine.PartNo}" malzemesi için ürün ağacı bulunamadı.\n\n` +
          `Devam etmek istiyor musunuz? (Boş malzeme listesi ile oluşturulacak)`
        );
        
        if (userChoice) {
          console.log(`✅ Kullanıcı boş malzeme listesi ile devam etmeyi seçti.`);
          
          // Boş malzeme listesi oluştur
          const emptyMaterial: ShopMaterialAlloc = {
            contract: contract,
            orderNo: shopOrderData.orderNo,
            lineItemNo: 1,
            partNo: partNo,
            operationNo: 10,
            qtyAssigned: 0,
            qtyIssued: 0,
            qtyPerAssembly: 1,
            qtyRequired: orderLine.OrderQty || orderLine.BuyQtyDue || 1,
            noteText: "Otomatik oluşturuldu - Ürün ağacı yok",
            rowstate: "Active",
            rowkey: `empty-mat-${Date.now()}`
          };
          
          setShopOrderMaterials([emptyMaterial]);
        } else {
          console.log(`❌ Kullanıcı işlemi iptal etti.`);
          handleCloseShopOrderModal();
        }
      }
    } catch (error) {
      console.error("❌ Ürün ağacı yüklenirken hata:", error);
      
      // Daha açıklayıcı hata mesajı
      alert(`Ürün ağacı yüklenirken hata oluştu:\n\n${error}\n\nURL: /api/prodstructure/head/${orderLine.Contract || "01"}/${orderLine.PartNo}/A/STANDARD/000`);
      
      // Hata durumunda da boş liste ile devam et
      const emptyMaterial: ShopMaterialAlloc = {
        contract: orderLine.Contract || "01",
        orderNo: shopOrderData.orderNo,
        lineItemNo: 1,
        partNo: orderLine.PartNo,
        operationNo: 10,
        qtyAssigned: 0,
        qtyIssued: 0,
        qtyPerAssembly: 1,
        qtyRequired: orderLine.OrderQty || orderLine.BuyQtyDue || 1,
        noteText: "Hata durumunda otomatik oluşturuldu",
        rowstate: "Active",
        rowkey: `error-mat-${Date.now()}`
      };
      
      setShopOrderMaterials([emptyMaterial]);
    }
  } else {
    alert(`⚠️ Malzeme numarası belirtilmemiş!`);
    setShopOrderMaterials([]);
  }
};

  // İş Emri Oluştur
  const handleCreateShopOrder = async () => {
  if (!selectedLineForShopOrder) return;
  
  try {
    setIsSaving(true);
    
    console.log("=== İŞ EMRI OLUŞTURMA BAŞLANGICI ===");
    console.log("Seçili satır:", selectedLineForShopOrder);
    console.log("İş emri verisi:", newShopOrderData);
    console.log("Malzeme listesi:", shopOrderMaterials);
    
    // 1. ShopOrderService kullanarak iş emri oluştur
    console.log("1. ShopOrderService.createOrder çağrılıyor...");
    
    try {
      // ShopOrderCreateDto formatına çevir
      const shopOrderCreateDto = {
        contract: newShopOrderData.contract,
        orderNo: newShopOrderData.orderNo,
        orderCode: newShopOrderData.orderCode,
        partNo: newShopOrderData.partNo,
        revisedStartDate: newShopOrderData.revisedStartDate,
        revisedDueDate: newShopOrderData.revisedDueDate,
        needDate: newShopOrderData.revisedDueDate, // needDate = revisedDueDate
        revisedQtyDue: newShopOrderData.revisedQtyDue,
        qtyComplete: 0,
        noteText: newShopOrderData.noteText || `Satış Siparişi: ${selectedOrder?.OrderNo}, Satır: ${selectedLineForShopOrder.OrderLine}`,
        customerOrderNo: selectedOrder?.OrderNo,
        rowstate: "Released",
        createdBy: "admin"
      };
      
      console.log("ShopOrderCreateDto:", shopOrderCreateDto);
      
      const savedOrder = await ShopOrderService.createOrder(shopOrderCreateDto);
      console.log("✅ İş emri başarıyla oluşturuldu:", savedOrder);
      
      // 2. Malzeme tahsislerini kaydet
      console.log(`2. Malzeme tahsisleri kaydediliyor (${shopOrderMaterials.length} adet)...`);
      
      if (shopOrderMaterials.length > 0) {
        let materialErrors: string[] = [];
        let successCount = 0;
        
        for (const material of shopOrderMaterials) {
          try {
            // ShopMaterialAllocCreateDto formatına çevir
            const materialCreateDto = {
              contract: material.contract,
              orderNo: savedOrder.orderNo || newShopOrderData.orderNo,
              lineItemNo: material.lineItemNo,
              partNo: material.partNo,
              operationNo: material.operationNo,
              qtyAssigned: material.qtyAssigned || 0,
              qtyIssued: material.qtyIssued || 0,
              qtyPerAssembly: material.qtyPerAssembly || 1,
              qtyRequired: material.qtyRequired || (selectedLineForShopOrder.OrderQty || selectedLineForShopOrder.BuyQtyDue || 1),
              noteText: material.noteText || `Satış Siparişi: ${selectedOrder?.OrderNo}`,
              rowstate: "Active"
            };
            
            console.log(`📦 Malzeme kaydediliyor:`, materialCreateDto);
            
            await ShopMaterialService.createMaterial(materialCreateDto);
            successCount++;
            console.log(`✅ Malzeme ${material.lineItemNo} başarıyla kaydedildi`);
            
          } catch (materialErr) {
            console.error(`❌ Malzeme ${material.lineItemNo} kayıt hatası:`, materialErr);
            materialErrors.push(`Malzeme ${material.lineItemNo}: ${materialErr instanceof Error ? materialErr.message : "Bilinmeyen hata"}`);
          }
        }
        
        if (materialErrors.length > 0) {
          console.warn("⚠️ Bazı malzemeler kaydedilemedi:", materialErrors);
          alert(`✅ İş emri oluşturuldu: ${savedOrder.orderNo}\n\n⚠️ Ancak ${materialErrors.length} malzeme kaydedilemedi:\n${materialErrors.slice(0, 5).join('\n')}`);
        } else {
          console.log(`✅ Tüm malzemeler başarıyla kaydedildi (${successCount} adet)`);
        }
      } else {
        console.log("ℹ️ Kaydedilecek malzeme yok");
      }
      
      // Başarı mesajı
      alert(`✅ İş emri başarıyla oluşturuldu!\n\nİş Emri No: ${savedOrder.orderNo}\nMalzeme: ${newShopOrderData.partNo}\nMiktar: ${newShopOrderData.revisedQtyDue}\n\nMalzeme sayısı: ${shopOrderMaterials.length}`);
      
      // Modal'ı kapat ve state'leri sıfırla
      console.log("✅ İş emri oluşturma başarıyla tamamlandı");
      setShowShopOrderModal(false);
      setSelectedLineForShopOrder(null);
      setShopOrderMaterials([]);
      
    } catch (orderErr) {
      console.error("❌ ShopOrderService.createOrder hatası:", orderErr);
      throw orderErr;
    }
    
  } catch (error) {
    console.error("❌ İş emri oluşturma hatası:", error);
    
    // Daha detaylı hata mesajı
    let errorMessage = "Bilinmeyen bir hata oluştu";
    
    if (error instanceof Error) {
      errorMessage = error.message;
      console.error(`❌ Hata stack:`, error.stack);
    }
    
    alert(`❌ İş emri oluşturulamadı!\n\nHata: ${errorMessage}\n\nLütfen:\n1. API endpoint'lerini kontrol edin\n2. Konsoldaki hata detaylarını inceleyin`);
  } finally {
    setIsSaving(false);
  }
};

  // İş Emri Modalını Kapat
  const handleCloseShopOrderModal = () => {
    setShowShopOrderModal(false);
    setSelectedLineForShopOrder(null);
    setShopOrderMaterials([]);
    setProdStructureHeads([]);
    setProdStructures([]);
  };

  // Inventory Part Search Functions
  const searchInventoryParts = async (searchTerm: string = "") => {
    try {
      setInventoryLoading(true);
      let url = "/api/inventorypart/search";
      
      if (searchTerm) {
        // Search by part number or description
        url += `?partNo=${encodeURIComponent(searchTerm)}&description=${encodeURIComponent(searchTerm)}`;
      }
      
      const response = await fetch(url);
      
      if (response.ok) {
        const data = await response.json();
        setInventoryParts(data);
      } else {
        console.error("Inventory part search error:", await response.text());
        setInventoryParts([]);
      }
    } catch (err) {
      console.error("Inventory part search error:", err);
      setInventoryParts([]);
    } finally {
      setInventoryLoading(false);
    }
  };

  const handleInventoryPartSelect = (part: InventoryPart) => {
    console.log("Selected inventory part:", part);
    
    if (searchForHead && isCreatingNewOrder) {
      // Yeni sipariş için malzeme seçildi
      const updatedNewStructures = [...newOrderLines];
      if (updatedNewStructures[searchForLineIndex]) {
        updatedNewStructures[searchForLineIndex] = {
          ...updatedNewStructures[searchForLineIndex],
          partNo: part.partNo,
          catalogNo: part.partNo,
          catalogDesc: part.description || ""
        };
        setNewOrderLines(updatedNewStructures);
      }
    } else if (!searchForHead && isCreatingNewOrder && searchForLineIndex >= 0) {
      // Yeni sipariş için line'da malzeme seçildi
      const updatedNewStructures = [...newOrderLines];
      updatedNewStructures[searchForLineIndex] = {
        ...updatedNewStructures[searchForLineIndex],
        partNo: part.partNo,
        catalogNo: part.partNo,
        catalogDesc: part.description || ""
      };
      setNewOrderLines(updatedNewStructures);
    } else if (!searchForHead && searchForLineIndex >= 0 && editingOrderLines[searchForLineIndex]) {
      // Mevcut sipariş satırı için malzeme seçildi
      const updatedStructures = [...editingOrderLines];
      updatedStructures[searchForLineIndex] = {
        ...updatedStructures[searchForLineIndex],
        PartNo: part.partNo,
        CatalogNo: part.partNo,
        CatalogDesc: part.description || ""
      };
      setEditingOrderLines(updatedStructures);
    }
    
    setShowInventorySearch(false);
  };

  const openInventorySearch = (forHead: boolean, lineIndex?: number) => {
    setSearchForHead(forHead);
    setSearchForLineIndex(lineIndex ?? -1);
    setShowInventorySearch(true);
    searchInventoryParts(""); // Boş arama ile tüm parçaları getir
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
        authorizeCode: editingOrder.AuthorizeCode || null,
        salesmanCode: editingOrder.SalesmanCode || null,
        noteText: editingOrder.NoteText || null,
        paidAmount: editingOrder.PaidAmount,
        rowstate: editingOrder.Rowstate || "ACTIVE",
        rowversion: selectedOrder.Rowversion
      };

      console.log("Ana sipariş DTO:", updateDto);

      const response = await fetch(
        `/api/customerorder/${selectedOrder.Company}/${selectedOrder.OrderNo}/${selectedOrder.Contract}`,
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
          PaidAmount: updatedOrderApi.paidAmount,
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
              console.log("POST URL:", `/api/customerorderline/order/${updatedOrder.Company}/${updatedOrder.OrderNo}/${updatedOrder.Contract}`);

              const createResponse = await fetch(
                `/api/customerorderline/order/${updatedOrder.Company}/${updatedOrder.OrderNo}/${updatedOrder.Contract}`,
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
            console.log("PUT URL:", `/api/customerorderline/${updatedOrder.Company}/${updatedOrder.OrderNo}/${updatedOrder.Contract}/${lineNoStr}/${relNoStr}`);

            const updateResponse = await fetch(
              `/api/customerorderline/${updatedOrder.Company}/${updatedOrder.OrderNo}/${updatedOrder.Contract}/${lineNoStr}/${relNoStr}`,
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
  }, [editingOrder, selectedOrder, editingOrderLines, customerOrders.length]);

  const handleDeleteOrder = useCallback(async () => {
    if (!selectedOrder) return;
    
    if (!window.confirm(`${selectedOrder.OrderNo} numaralı siparişi silmek istediğinize emin misiniz?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/customerorder/${selectedOrder.Company}/${selectedOrder.OrderNo}/${selectedOrder.Contract}`, {
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

  // Yeni sipariş formu işlemleri
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
      const orderResponse = await fetch('/api/customerorder', {
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

          const lineResponse = await fetch('/api/customerorderline/order/' + 
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
        PaidAmount: savedOrder.paidAmount || 0,
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
  }, [newOrderData, newOrderLines, customerOrders]);

  const resetForm = useCallback(() => {
    setNewOrderData({
      company: "TST",
      orderNo: `SO${String(Math.floor(Math.random() * 10000)).padStart(5, '0')}`,
      contract: "01",
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
        contract: "01",
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
            type: 'jpeg' as const,
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

  // YENİ: İş Emri Modalı JSX
  const ShopOrderModal = () => {
    if (!showShopOrderModal) return null;

    return (
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
        justifyContent: "center",
        padding: "20px"
      }}>
        <div style={{
          backgroundColor: "#1e293b",
          borderRadius: "12px",
          padding: "20px",
          width: "90%",
          maxWidth: "1000px",
          maxHeight: "90vh",
          overflow: "auto",
          border: "2px solid #38bdf8"
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
              <i className="fas fa-industry" style={{ color: "#10b981" }}></i>
              İş Emri Oluştur
            </h2>
            <button
              onClick={handleCloseShopOrderModal}
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

          {/* İş Emri Bilgileri */}
          <div style={{ marginBottom: "20px" }}>
            <h3 style={{ 
              color: "#f1f5f9", 
              fontSize: "1rem", 
              marginBottom: "10px",
              display: "flex",
              alignItems: "center",
              gap: "8px"
            }}>
              <i className="fas fa-info-circle" style={{ color: "#38bdf8" }}></i>
              İş Emri Bilgileri
            </h3>
            
            <div style={{ 
              display: "grid", 
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", 
              gap: "15px",
              backgroundColor: "rgba(30, 41, 59, 0.5)",
              padding: "15px",
              borderRadius: "8px",
              border: "1px solid #334155"
            }}>
              <div>
                <label style={labelStyle}>İş Emri No</label>
                <input
                  type="text"
                  value={newShopOrderData.orderNo}
                  onChange={(e) => setNewShopOrderData({...newShopOrderData, orderNo: e.target.value})}
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>Malzeme No</label>
                <input
                  type="text"
                  value={newShopOrderData.partNo}
                  readOnly
                  style={{...inputStyle, backgroundColor: "#334155"}}
                />
              </div>
              <div>
                <label style={labelStyle}>Miktar</label>
                <input
                  type="number"
                  value={newShopOrderData.revisedQtyDue}
                  onChange={(e) => setNewShopOrderData({...newShopOrderData, revisedQtyDue: Number(e.target.value)})}
                  style={inputStyle}
                  min="1"
                />
              </div>
              <div>
                <label style={labelStyle}>Başlangıç Tarihi</label>
                <input
                  type="date"
                  value={newShopOrderData.revisedStartDate}
                  onChange={(e) => setNewShopOrderData({...newShopOrderData, revisedStartDate: e.target.value})}
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>Bitiş Tarihi</label>
                <input
                  type="date"
                  value={newShopOrderData.revisedDueDate}
                  onChange={(e) => setNewShopOrderData({...newShopOrderData, revisedDueDate: e.target.value})}
                  style={inputStyle}
                />
              </div>
            </div>
          </div>

          {/* Malzeme Listesi */}
          {shopOrderMaterials.length > 0 && (
            <div style={{ marginBottom: "20px" }}>
              <h3 style={{ 
                color: "#f1f5f9", 
                fontSize: "1rem", 
                marginBottom: "10px",
                display: "flex",
                alignItems: "center",
                gap: "8px"
              }}>
                <i className="fas fa-boxes" style={{ color: "#f59e0b" }}></i>
                Malzeme Tahsisleri ({shopOrderMaterials.length} adet)
              </h3>
              
              <div style={{
                maxHeight: "200px",
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
                        padding: "10px", 
                        textAlign: "left", 
                        color: "#f1f5f9", 
                        fontSize: "0.85rem",
                        borderBottom: "1px solid #475569"
                      }}>
                        Sıra
                      </th>
                      <th style={{ 
                        padding: "10px", 
                        textAlign: "left", 
                        color: "#f1f5f9", 
                        fontSize: "0.85rem",
                        borderBottom: "1px solid #475569"
                      }}>
                        Malzeme No
                      </th>
                      <th style={{ 
                        padding: "10px", 
                        textAlign: "left", 
                        color: "#f1f5f9", 
                        fontSize: "0.85rem",
                        borderBottom: "1px solid #475569"
                      }}>
                        İşlem No
                      </th>
                      <th style={{ 
                        padding: "10px", 
                        textAlign: "left", 
                        color: "#f1f5f9", 
                        fontSize: "0.85rem",
                        borderBottom: "1px solid #475569"
                      }}>
                        Gerekli Miktar
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {shopOrderMaterials.map((material, index) => (
                      <tr key={material.rowkey}
                        style={{
                          borderBottom: "1px solid #334155",
                          backgroundColor: index % 2 === 0 ? "rgba(30, 41, 59, 0.5)" : "rgba(30, 41, 59, 0.3)"
                        }}
                      >
                        <td style={{ 
                          padding: "10px", 
                          color: "#f1f5f9",
                          fontSize: "0.85rem"
                        }}>
                          {material.lineItemNo}
                        </td>
                        <td style={{ 
                          padding: "10px", 
                          color: "#94a3b8",
                          fontSize: "0.85rem"
                        }}>
                          {material.partNo}
                        </td>
                        <td style={{ 
                          padding: "10px", 
                          color: "#94a3b8",
                          fontSize: "0.85rem"
                        }}>
                          {material.operationNo || 10}
                        </td>
                        <td style={{ 
                          padding: "10px", 
                          color: "#10b981",
                          fontSize: "0.85rem"
                        }}>
                          {material.qtyRequired}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

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
              onClick={handleCloseShopOrderModal}
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
              <i className="fas fa-times"></i>
              <span>İptal</span>
            </button>
            <button
              onClick={handleCreateShopOrder}
              disabled={isSaving || !newShopOrderData.partNo}
              style={{
                background: !newShopOrderData.partNo
                  ? "#475569" 
                  : isSaving
                  ? "#f59e0b"
                  : "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                color: "white",
                border: "none",
                borderRadius: "6px",
                padding: "10px 25px",
                fontSize: "0.9rem",
                cursor: !newShopOrderData.partNo || isSaving ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                opacity: !newShopOrderData.partNo || isSaving ? 0.6 : 1
              }}
            >
              {isSaving ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i>
                  <span>Oluşturuluyor...</span>
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
    );
  };

  // YENİ SİPARİŞ OLUŞTURMA EKRANI
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

        {/* Inventory Part Search Modal */}
        {showInventorySearch && (
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
              maxWidth: "800px",
              maxHeight: "80vh",
              overflow: "hidden",
              border: "2px solid #38bdf8"
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
                  <i className="fas fa-search" style={{ color: "#38bdf8" }}></i>
                  Malzeme Arama
                </h2>
                <button
                  onClick={() => setShowInventorySearch(false)}
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
                    placeholder="Parça No veya Açıklama ile ara..."
                    onChange={(e) => searchInventoryParts(e.target.value)}
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
                        Açıklama
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
                        İşlem
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {inventoryLoading ? (
                      <tr>
                        <td colSpan={4} style={{ 
                          padding: "40px", 
                          textAlign: "center", 
                          color: "#94a3b8" 
                        }}>
                          <i className="fas fa-spinner fa-spin" style={{ marginRight: "10px" }}></i>
                          Yükleniyor...
                        </td>
                      </tr>
                    ) : inventoryParts.length === 0 ? (
                      <tr>
                        <td colSpan={4} style={{ 
                          padding: "40px", 
                          textAlign: "center", 
                          color: "#94a3b8" 
                        }}>
                          <i className="fas fa-box-open" style={{ marginRight: "10px" }}></i>
                          Malzeme bulunamadı
                        </td>
                      </tr>
                    ) : (
                      inventoryParts.map((part) => (
                        <tr key={`${part.contract}-${part.partNo}`}
                          style={{
                            borderBottom: "1px solid #334155",
                            backgroundColor: "rgba(30, 41, 59, 0.5)"
                          }}
                        >
                          <td style={{ 
                            padding: "12px 15px", 
                            color: "#f1f5f9",
                            fontSize: "0.85rem"
                          }}>
                            {part.partNo}
                          </td>
                          <td style={{ 
                            padding: "12px 15px", 
                            color: "#94a3b8",
                            fontSize: "0.85rem"
                          }}>
                            {part.description || '-'}
                          </td>
                          <td style={{ 
                            padding: "12px 15px", 
                            color: "#94a3b8",
                            fontSize: "0.85rem"
                          }}>
                            {part.contract}
                          </td>
                          <td style={{ 
                            padding: "12px 15px",
                            textAlign: "center"
                          }}>
                            <button
                              onClick={() => handleInventoryPartSelect(part)}
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
                  onClick={() => setShowInventorySearch(false)}
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
                  placeholder="Örn: 01"
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
                gridTemplateColumns: "60px 150px 2fr 100px 100px 120px 60px 100px", 
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
                <div>İş Emri</div> {/* YENİ KOLON */}
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
        gridTemplateColumns: "60px 150px 2fr 100px 100px 120px 60px 100px",
        padding: "10px 15px",
        borderBottom: "1px solid #334155",
        fontSize: "0.85rem",
        color: "#f1f5f9",
        backgroundColor: index % 2 === 0 ? "rgba(30, 41, 59, 0.5)" : "rgba(30, 41, 59, 0.3)",
        alignItems: "center",
        gap: "10px"
      }}
    >
      {/* Satır No */}
      <div>{line.lineNo}</div>
      
      {/* Malzeme - Input + Button */}
      <div style={{ display: "flex", gap: "4px", alignItems: "center" }}>
        <input
          type="text"
          value={line.partNo}
          onChange={(e) => handleNewOrderLineChange(index, 'partNo', e.target.value)}
          style={{
            flex: 1,
            minWidth: 0,
            padding: "6px 8px",
            backgroundColor: "rgba(30, 41, 59, 0.8)",
            border: "1px solid #475569",
            borderRadius: "4px",
            color: "#f1f5f9",
            fontSize: "0.85rem"
          }}
        />
        <button
          onClick={() => openInventorySearch(false, index)}
          style={{
            background: "#8b5cf6",
            color: "white",
            border: "none",
            borderRadius: "4px",
            padding: "6px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "32px",
            height: "32px",
            flexShrink: 0
          }}
          title="Malzeme Ara"
        >
          <i className="fas fa-search" style={{ fontSize: "0.7rem" }}></i>
        </button>
      </div>
      
      {/* Açıklama */}
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
      
      {/* Miktar */}
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
      
      {/* Birim Fiyat */}
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
      
      {/* Toplam */}
      <div style={{ 
        color: "#10b981", 
        fontWeight: "600", 
        textAlign: "right"
      }}>
        {lineTotal.toFixed(2)}
      </div>
      
      {/* Sil Butonu */}
      <div style={{ display: "flex", justifyContent: "center" }}>
        <button
          onClick={() => removeNewOrderLine(index)}
          disabled={newOrderLines.length <= 1}
          style={{
            background: newOrderLines.length <= 1 ? "#64748b" : "#ef4444",
            color: "white",
            border: "none",
            borderRadius: "4px",
            width: "32px",
            height: "32px",
            cursor: newOrderLines.length <= 1 ? "not-allowed" : "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            opacity: newOrderLines.length <= 1 ? 0.5 : 1,
            flexShrink: 0
          }}
          title="Satırı Sil"
        >
          <i className="fas fa-trash" style={{ fontSize: "0.7rem" }}></i>
        </button>
      </div>
      
      {/* İş Emri Butonu - Yeni sipariş için pasif */}
      <div style={{ display: "flex", justifyContent: "center" }}>
        <button
          disabled
          style={{
            background: "#64748b",
            color: "#94a3b8",
            border: "none",
            borderRadius: "4px",
            padding: "6px 12px",
            fontSize: "0.75rem",
            cursor: "not-allowed",
            display: "flex",
            alignItems: "center",
            gap: "5px",
            whiteSpace: "nowrap",
            opacity: 0.5
          }}
          title="Önce siparişi kaydedin"
        >
          <i className="fas fa-industry"></i>
          <span>Kaydet Sonra</span>
        </button>
      </div>
    </div>
  );
})}
              </div>

              {/* Grid Footer - Toplamlar */}
              <div style={{
                display: "grid",
                gridTemplateColumns: "60px 150px 2fr 100px 100px 120px 60px 100px",
                padding: "12px 15px",
                backgroundColor: "#1e293b",
                borderTop: "2px solid #475569",
                fontSize: "0.9rem",
                fontWeight: "600",
                color: "#f1f5f9"
              }}>
                <div style={{ gridColumn: "1 / 7", textAlign: "right", paddingRight: "10px" }}>
                  GENEL TOPLAM:
                </div>
                <div style={{ color: "#10b981", fontSize: "1rem", textAlign: "right", paddingRight: "10px" }}>
                  {grandTotal.toFixed(2)}
                </div>
                <div></div>
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

      {/* Inventory Part Search Modal */}
      {showInventorySearch && (
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
            maxWidth: "800px",
            maxHeight: "80vh",
            overflow: "hidden",
            border: "2px solid #38bdf8"
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
                <i className="fas fa-search" style={{ color: "#38bdf8" }}></i>
                Malzeme Arama
              </h2>
              <button
                onClick={() => setShowInventorySearch(false)}
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
                  placeholder="Parça No veya Açıklama ile ara..."
                  onChange={(e) => searchInventoryParts(e.target.value)}
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
                      Açıklama
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
                      İşlem
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {inventoryLoading ? (
                    <tr>
                      <td colSpan={4} style={{ 
                        padding: "40px", 
                        textAlign: "center", 
                        color: "#94a3b8" 
                      }}>
                        <i className="fas fa-spinner fa-spin" style={{ marginRight: "10px" }}></i>
                        Yükleniyor...
                      </td>
                    </tr>
                  ) : inventoryParts.length === 0 ? (
                    <tr>
                      <td colSpan={4} style={{ 
                        padding: "40px", 
                        textAlign: "center", 
                        color: "#94a3b8" 
                      }}>
                        <i className="fas fa-box-open" style={{ marginRight: "10px" }}></i>
                        Malzeme bulunamadı
                      </td>
                    </tr>
                  ) : (
                    inventoryParts.map((part) => (
                      <tr key={`${part.contract}-${part.partNo}`}
                        style={{
                          borderBottom: "1px solid #334155",
                          backgroundColor: "rgba(30, 41, 59, 0.5)"
                        }}
                      >
                        <td style={{ 
                          padding: "12px 15px", 
                          color: "#f1f5f9",
                          fontSize: "0.85rem"
                        }}>
                          {part.partNo}
                        </td>
                        <td style={{ 
                          padding: "12px 15px", 
                          color: "#94a3b8",
                          fontSize: "0.85rem"
                        }}>
                          {part.description || '-'}
                        </td>
                        <td style={{ 
                          padding: "12px 15px", 
                          color: "#94a3b8",
                          fontSize: "0.85rem"
                        }}>
                          {part.contract}
                        </td>
                        <td style={{ 
                          padding: "12px 15px",
                          textAlign: "center"
                        }}>
                          <button
                            onClick={() => handleInventoryPartSelect(part)}
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
                onClick={() => setShowInventorySearch(false)}
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

      {/* İş Emri Modalı */}
      <ShopOrderModal />

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
              {/* koordinatör */}
              <div>
                <label style={labelStyle}>Koordinatör</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editingOrder.AuthorizeCode || ''}
                    onChange={(e) => handleEditingOrderChange('AuthorizeCode', e.target.value || undefined)}
                    style={inputStyle}
                  />
                ) : (
                  <div style={{ 
                    padding: "8px", 
                    backgroundColor: "rgba(30, 41, 59, 0.5)",
                    borderRadius: "4px",
                    color: "#f1f5f9"
                  }}>
                    {editingOrder.AuthorizeCode || '-'}
                  </div>
                )}
              </div>
               {/* satış per */}
              <div>
                <label style={labelStyle}>Satış Personeli</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editingOrder.SalesmanCode || ''}
                    onChange={(e) => handleEditingOrderChange('SalesmanCode', e.target.value || undefined)}
                    style={inputStyle}
                  />
                ) : (
                  <div style={{ 
                    padding: "8px", 
                    backgroundColor: "rgba(30, 41, 59, 0.5)",
                    borderRadius: "4px",
                    color: "#f1f5f9"
                  }}>
                    {editingOrder.SalesmanCode || '-'}
                  </div>
                )}
              </div>
{/* PaidAmount */}
              <div>
                <label style={labelStyle}>Ödenen Tutar</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editingOrder.PaidAmount || ''}
                    onChange={(e) => handleEditingOrderChange('PaidAmount', e.target.value || undefined)}
                    style={inputStyle}
                  />
                ) : (
                  <div style={{ 
                    padding: "8px", 
                    backgroundColor: "rgba(30, 41, 59, 0.5)",
                    borderRadius: "4px",
                    color: "#f1f5f9"
                  }}>
                    {editingOrder.PaidAmount || '-'}
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
                        gridTemplateColumns: "60px 150px 2fr 100px 100px 120px 60px 100px",
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
                         <div>İş Emri</div> 
                      </div>

                      {/* Mevcut Sipariş Satırları */}
                      {editingOrderLines.map((line, index) => {
                        const quantity = line.OrderQty || line.BuyQtyDue || 0;
                        const price = line.Price || line.SaleUnitPrice || 0;
                        const total = quantity * price;
                        
                        return (
                          <div
                            key={line.id}
                            style={{
                              display: "grid",
                              gridTemplateColumns: "60px 150px 2fr 100px 100px 120px 60px 100px",
                              padding: "10px 15px",
                              borderBottom: "1px solid #334155",
                              fontSize: "0.85rem",
                              color: "#f1f5f9",
                              backgroundColor: index % 2 === 0 ? "rgba(30, 41, 59, 0.5)" : "rgba(30, 41, 59, 0.3)",
                              alignItems: "center",
                              gap: "10px"
                            }}
                          >
                            {/* Satır No */}
                            <div>{line.OrderLine}</div>
                            
                            {/* Malzeme */}
                            <div>
                              {isEditing ? (
                                <div style={{ display: "flex", gap: "4px", alignItems: "center" }}>
                                  <input
                                    type="text"
                                    value={line.PartNo}
                                    onChange={(e) => handleEditingOrderLineChange(index, 'PartNo', e.target.value)}
                                    style={{
                                      flex: 1,
                                      minWidth: 0,
                                      padding: "6px 8px",
                                      backgroundColor: "rgba(30, 41, 59, 0.8)",
                                      border: "1px solid #475569",
                                      borderRadius: "4px",
                                      color: "#f1f5f9",
                                      fontSize: "0.85rem"
                                    }}
                                    placeholder="PART001"
                                  />
                                  <button
                                    onClick={() => openInventorySearch(false, index)}
                                    style={{
                                      background: "#8b5cf6",
                                      color: "white",
                                      border: "none",
                                      borderRadius: "4px",
                                      padding: "6px",
                                      cursor: "pointer",
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                      width: "32px",
                                      height: "32px",
                                      flexShrink: 0
                                    }}
                                    title="Malzeme Ara"
                                  >
                                    <i className="fas fa-search" style={{ fontSize: "0.7rem" }}></i>
                                  </button>
                                </div>
                              ) : (
                                <div style={{ padding: "6px 8px" }}>{line.PartNo}</div>
                              )}
                            </div>
                            
                            {/* Açıklama */}
                            <div>
                              {isEditing ? (
                                <input
                                  type="text"
                                  value={line.CatalogDesc || ''}
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
                                <div style={{ padding: "6px 8px" }}>{line.CatalogDesc || '-'}</div>
                              )}
                            </div>
                            
                            {/* Miktar */}
                            <div>
                              {isEditing ? (
                                <input
                                  type="number"
                                  value={quantity}
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
                                <div style={{ padding: "6px 8px", textAlign: "right" }}>
                                  {quantity.toFixed(2)}
                                </div>
                              )}
                            </div>
                            
                            {/* Birim Fiyat */}
                            <div>
                              {isEditing ? (
                                <input
                                  type="number"
                                  value={price}
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
                                <div style={{ padding: "6px 8px", textAlign: "right" }}>
                                  {price.toFixed(2)}
                                </div>
                              )}
                            </div>
                            
                            {/* Toplam */}
                            <div style={{ 
                              color: "#10b981", 
                              fontWeight: "600", 
                              textAlign: "right"
                            }}>
                              {total.toFixed(2)}
                            </div>
                            
                            {/* İşlem - Düzeltilmiş */}
                            <div style={{ display: "flex", justifyContent: "center" }}>
                              {isEditing && (
                                <button
                                  onClick={() => removeOrderLine(index)}
                                  disabled={editingOrderLines.length <= 1}
                                  style={{
                                    background: editingOrderLines.length <= 1 ? "#64748b" : "#ef4444",
                                    color: "white",
                                    border: "none",
                                    borderRadius: "4px",
                                    width: "32px",
                                    height: "32px",
                                    cursor: editingOrderLines.length <= 1 ? "not-allowed" : "pointer",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    opacity: editingOrderLines.length <= 1 ? 0.5 : 1,
                                    flexShrink: 0
                                  }}
                                  title="Satırı Sil"
                                >
                                  <i className="fas fa-trash" style={{ fontSize: "0.7rem" }}></i>
                                </button>
                              )}
                            </div>
                            
                            {/* İş Emri Butonu */}
                            <div style={{ display: "flex", justifyContent: "center" }}>
                              <button
                                onClick={() => openShopOrderModal(line)}
                                style={{
                                  background: "#10b981",
                                  color: "white",
                                  border: "none",
                                  borderRadius: "4px",
                                  padding: "6px 12px",
                                  fontSize: "0.75rem",
                                  cursor: "pointer",
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "5px",
                                  whiteSpace: "nowrap"
                                }}
                                title="Bu satır için iş emri oluştur"
                              >
                                <i className="fas fa-industry"></i>
                                <span>İş Emri</span>
                              </button>
                            </div>
                          </div>
                        );
                      })}
                      
                      {/* Toplam ve Butonlar */}
                      <div style={{
                        display: "grid",
                        gridTemplateColumns: "60px 150px 2fr 100px 100px 120px 60px 100px",
                        padding: "12px 15px",
                        backgroundColor: "#1e293b",
                        borderTop: "2px solid #475569",
                        fontSize: "0.9rem",
                        fontWeight: "600",
                        color: "#f1f5f9"
                      }}>
                        <div style={{ gridColumn: "1 / 6", display: "flex", alignItems: "center" }}>
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
                        <div style={{ gridColumn: "6 / 8", textAlign: "right", paddingRight: "10px" }}>
                          GENEL TOPLAM:
                        </div>
                        <div style={{ color: "#10b981", fontSize: "1rem", textAlign: "right", paddingRight: "10px" }}>
                          {calculateOrderLinesTotal().toFixed(2)}
                        </div>
                        <div></div>
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