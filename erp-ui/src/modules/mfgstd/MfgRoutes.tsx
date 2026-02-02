import { useState, useEffect, useCallback } from "react";
import SearchList from "./../../components/SearchList";
import { ChevronRightIcon } from "@heroicons/react/24/outline";

// API'den gelen veri yapısı (camelCase)
interface RoutingHeadApiResponse {
  company: string;
  contract: string;
  partNo: string;
  routingRevision: string;
  bomType: string;
  noteText?: string | null;
  phaseInDate?: string | null;
  phaseOutDate?: string | null;
  createDate: string;
  rowversion?: string;
  rowkey?: string;
  rowstate?: string;
}

// Frontend'de kullanacağımız interface (PascalCase)
interface RoutingHead {
  id: number;
  Company: string;
  Contract: string;
  PartNo: string;
  RoutingRevision: string;
  BomType: string;
  NoteText?: string;
  PhaseInDate?: string;
  PhaseOutDate?: string;
  CreateDate: string;
  Rowversion?: string;
  Rowkey?: string;
  Rowstate?: string;
}

// API'den gelen Operasyon satırı yapısı
interface RoutingOperationApiResponse {
  company: string;
  contract: string;
  partNo: string;
  routingRevision: string;
  bomType: string;
  operationNo: number;
  operationDescription?: string | null;
  workCenterNo?: string | null;
  machRunFactor?: number | null;
  machSetupTime?: number | null;
  laborClassNo?: string | null;
  setupLaborClassNo?: string | null;
  crewSize?: number | null;
  setupCrewSize?: number | null;
  runTimeCode?: string | null;
  noteText?: string | null;
  rowversion?: string | null;
  rowkey?: string | null;
}

// Frontend'de kullanacağımız Operasyon satırı interface
interface RoutingOperation {
  id: number;
  Company: string;
  Contract: string;
  PartNo: string;
  RoutingRevision: string;
  BomType: string;
  OperationNo: number;
  OperationDescription?: string;
  WorkCenterNo?: string;
  MachRunFactor?: number;
  MachSetupTime?: number;
  LaborClassNo?: string;
  SetupLaborClassNo?: string;
  CrewSize?: number;
  SetupCrewSize?: number;
  RunTimeCode?: string;
  NoteText?: string;
  Rowversion?: string;
  Rowkey?: string;
}

// Yeni Routing Başlığı oluşturma için DTO
interface RoutingHeadCreateDto {
  company: string;
  contract: string;
  partNo: string;
  routingRevision: string;
  bomType: string;
  noteText?: string | null;
  phaseInDate?: string | null;
  phaseOutDate?: string | null;
  rowversion?: string;
  rowkey?: string;
}

// Yeni Operasyon satırı oluşturma için DTO
interface RoutingOperationCreateDto {
  company: string;
  contract: string;
  partNo: string;
  routingRevision: string;
  bomType: string;
  operationNo: number;
  operationDescription?: string | null;
  workCenterNo?: string | null;
  machRunFactor?: number | null;
  machSetupTime?: number | null;
  laborClassNo?: string | null;
  setupLaborClassNo?: string | null;
  crewSize?: number | null;
  setupCrewSize?: number | null;
  runTimeCode?: string | null;
  noteText?: string | null;
  rowversion?: string;
  rowkey?: string;
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

// Company interface'i
interface Company {
  companyId: string;
  name: string;
  creationDate: Date;
  associationNo?: string;
  defaultLanguage: string;
  logotype?: string;
  corporateForm?: string;
  country: string;
  createdBy: string;
  localizationCountry: string;
  rowversion: number;
  rowkey: string;
}

// CompanySite interface'i (contract listesi için)
interface CompanySite {
  company: string;
  contract: string;
  description?: string;
  country?: string;
  createDate?: Date;
  rowversion?: Date;
  rowkey: string;
  rowstate?: string;
}

const tabs = ["Operasyonlar", "Detay Bilgiler"];

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

export default function RoutingPage() {
  const [activeTab, setActiveTab] = useState("Operasyonlar");
  const [selectedHead, setSelectedHead] = useState<RoutingHead | null>(null);
  const [editingHead, setEditingHead] = useState<RoutingHead | null>(null);
  const [editingOperations, setEditingOperations] = useState<RoutingOperation[]>([]);
  const [isSearchListVisible, setIsSearchListVisible] = useState(false);
  const [isCreatingNewHead, setIsCreatingNewHead] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  // Inventory Part Search States
  const [showInventorySearch, setShowInventorySearch] = useState(false);
  const [inventoryParts, setInventoryParts] = useState<InventoryPart[]>([]);
  const [inventoryLoading, setInventoryLoading] = useState(false);
  const [searchForHead, setSearchForHead] = useState(false);

  // Company ve Contract için state'ler
  const [companies, setCompanies] = useState<Company[]>([]);
  const [companySites, setCompanySites] = useState<CompanySite[]>([]);
  const [filteredContracts, setFilteredContracts] = useState<CompanySite[]>([]);
  const [isLoadingCompanies, setIsLoadingCompanies] = useState(false);
  const [isLoadingContracts, setIsLoadingContracts] = useState(false);

  // Yeni routing başlığı formu state'leri
  const [newHeadData, setNewHeadData] = useState<RoutingHeadCreateDto>({
    company: "",
    contract: "",
    partNo: "",
    routingRevision: "A",
    bomType: "STANDARD",
    rowversion: new Date().toISOString()
  });

  const [newOperations, setNewOperations] = useState<RoutingOperationCreateDto[]>([
    {
      company: "",
      contract: "",
      partNo: "",
      routingRevision: "A",
      bomType: "STANDARD",
      operationNo: 10,
      operationDescription: "",
      workCenterNo: "",
      machRunFactor: 1,
      machSetupTime: 0,
      laborClassNo: "",
      runTimeCode: "HOUR",
      noteText: null
    }
  ]);

  // Veritabanından gelen veriler
  const [routingHeads, setRoutingHeads] = useState<RoutingHead[]>([]);
  const [operationLines, setOperationLines] = useState<RoutingOperation[]>([]);
  const [loading, setLoading] = useState(true);


  // API URL'leri
  const API_BASE_URL = "/api";
  const ROUTING_HEAD_API = `${API_BASE_URL}/routingheadtab`;
  const ROUTING_OPERATION_API = `${API_BASE_URL}/routingoperationtab`;
  const COMPANY_API = `${API_BASE_URL}/company`;
  const COMPANY_SITE_API = `${API_BASE_URL}/companysites`;
  const INVENTORY_PART_API = `${API_BASE_URL}/inventorypart`;

  // PostgreSQL'den Routing başlık verilerini çek
  useEffect(() => {
    fetchRoutingHeads();
    fetchCompanies();
    fetchCompanySites();
  }, []);

  // Company değiştiğinde contract'ları filtrele
  useEffect(() => {
    if (newHeadData.company) {
      const contracts = companySites.filter(site => site.company === newHeadData.company);
      setFilteredContracts(contracts);
      
      if (newHeadData.contract && !contracts.some(c => c.contract === newHeadData.contract)) {
        handleNewHeadDataChange('contract', "");
      }
    } else {
      setFilteredContracts([]);
      handleNewHeadDataChange('contract', "");
    }
  }, [newHeadData.company, companySites]);

  useEffect(() => {
    if (selectedHead && !isCreatingNewHead) {
      fetchOperationLines(
        selectedHead.Company, 
        selectedHead.Contract, 
        selectedHead.PartNo,
        selectedHead.RoutingRevision,
        selectedHead.BomType
      );
      setEditingHead(selectedHead);
    } else {
      setOperationLines([]);
      setEditingHead(null);
      setEditingOperations([]);
    }
  }, [selectedHead, isCreatingNewHead]);

  const fetchCompanies = async () => {
    setIsLoadingCompanies(true);
    try {
      console.log("Fetching companies from:", COMPANY_API);
      
      const response = await fetch(COMPANY_API);
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }
      
      const data: Company[] = await response.json();
      console.log("Received companies:", data);
      setCompanies(data);
    } catch (error: any) {
      console.error("Companies yüklenirken hata:", error);
      console.error("Error details:", error.message);
    } finally {
      setIsLoadingCompanies(false);
    }
  };

  const fetchCompanySites = async () => {
    setIsLoadingContracts(true);
    try {
      console.log("Fetching company sites from:", COMPANY_SITE_API);
      
      const response = await fetch(COMPANY_SITE_API);
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }
      
      const data: CompanySite[] = await response.json();
      console.log("Received company sites:", data);
      setCompanySites(data);
    } catch (error: any) {
      console.error("Company sites yüklenirken hata:", error);
      console.error("Error details:", error.message);
    } finally {
      setIsLoadingContracts(false);
    }
  };

  const fetchRoutingHeads = async () => {
    try {
      setLoading(true);
      const response = await fetch(ROUTING_HEAD_API);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const apiData: RoutingHeadApiResponse[] = await response.json();
      console.log("API'den gelen Routing Başlıkları:", apiData);
      
      const formattedHeads: RoutingHead[] = apiData.map((apiHead, index) => {
        const head: RoutingHead = {
          id: index + 1,
          Company: apiHead.company || "",
          Contract: apiHead.contract || "",
          PartNo: apiHead.partNo || "",
          RoutingRevision: apiHead.routingRevision || "A",
          BomType: apiHead.bomType || "STANDARD",
          NoteText: apiHead.noteText || undefined,
          PhaseInDate: apiHead.phaseInDate || undefined,
          PhaseOutDate: apiHead.phaseOutDate || undefined,
          CreateDate: apiHead.createDate || new Date().toISOString().split('T')[0],
          Rowversion: apiHead.rowversion || undefined,
          Rowkey: apiHead.rowkey || undefined,
          Rowstate: apiHead.rowstate || 'Active'
        };
        
        return head;
      });
      
      console.log("Formatlanmış Routing Başlıkları:", formattedHeads);
      setRoutingHeads(formattedHeads);
      
    } catch (err) {
      console.error("Routing başlık verileri çekilirken hata:", err);
      setRoutingHeads([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchOperationLines = async (
    company: string, 
    contract: string, 
    partNo: string, 
    routingRevision: string, 
    bomType: string
  ) => {
    try {
      const response = await fetch(
        `${ROUTING_OPERATION_API}/byhead/${company}/${contract}/${partNo}/${routingRevision}/${bomType}`
      );
      
      if (response.ok) {
        const apiData: RoutingOperationApiResponse[] = await response.json();
        console.log("API'den gelen Operasyon Satırları:", apiData);
        
        const formattedLines: RoutingOperation[] = apiData.map((apiLine, index) => ({
          id: index + 1,
          Company: apiLine.company || "",
          Contract: apiLine.contract || "",
          PartNo: apiLine.partNo || "",
          RoutingRevision: apiLine.routingRevision || "A",
          BomType: apiLine.bomType || "STANDARD",
          OperationNo: apiLine.operationNo || 0,
          OperationDescription: apiLine.operationDescription || undefined,
          WorkCenterNo: apiLine.workCenterNo || undefined,
          MachRunFactor: apiLine.machRunFactor || undefined,
          MachSetupTime: apiLine.machSetupTime || undefined,
          LaborClassNo: apiLine.laborClassNo || undefined,
          SetupLaborClassNo: apiLine.setupLaborClassNo || undefined,
          CrewSize: apiLine.crewSize || undefined,
          SetupCrewSize: apiLine.setupCrewSize || undefined,
          RunTimeCode: apiLine.runTimeCode || undefined,
          NoteText: apiLine.noteText || undefined,
          Rowversion: apiLine.rowversion || undefined,
          Rowkey: apiLine.rowkey || undefined
        }));
        
        console.log("Formatlanmış Operasyon Satırları:", formattedLines);
        
        setOperationLines(formattedLines);
        setEditingOperations([...formattedLines]);
      } else {
        console.log("Operasyon satırları bulunamadı veya hata oluştu");
        setOperationLines([]);
        setEditingOperations([]);
      }
    } catch (err) {
      console.error("Operasyon satırları çekilirken hata:", err);
      setOperationLines([]);
      setEditingOperations([]);
    }
  };

  // Şirket adını getir
  const getCompanyName = (companyId: string) => {
    const company = companies.find(c => c.companyId === companyId);
    return company ? `${company.name} (${company.companyId})` : companyId;
  };

  // Contract açıklamasını getir
  const getContractDescription = (company: string, contract: string) => {
    const site = companySites.find(s => s.company === company && s.contract === contract);
    return site?.description || contract;
  };

  // Inventory Part Search Functions
  const searchInventoryParts = async (searchTerm: string = "") => {
    try {
      setInventoryLoading(true);
      let url = `${INVENTORY_PART_API}/search`;
      
      if (searchTerm) {
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
    
    if (searchForHead && editingHead) {
      setEditingHead({
        ...editingHead,
        PartNo: part.partNo
      });
    } else if (searchForHead && isCreatingNewHead) {
      setNewHeadData({
        ...newHeadData,
        partNo: part.partNo
      });
    }
    
    setShowInventorySearch(false);
  };

  const openInventorySearch = (forHead: boolean) => {
    setSearchForHead(forHead);
    setShowInventorySearch(true);
    searchInventoryParts("");
  };

  // SearchList için item'leri formatla
  const searchListItems = routingHeads.map(head => ({
    id: head.id,
    code: head.PartNo,
    name: `${head.RoutingRevision} - ${head.BomType}`,
    description: `Şirket: ${head.Company} | Kontrat: ${head.Contract} | Parça: ${head.PartNo} | Revizyon: ${head.RoutingRevision} | Tip: ${head.BomType}`,
    extraInfo: `Şirket: ${getCompanyName(head.Company)} | Tesis: ${getContractDescription(head.Company, head.Contract)}`,
    originalData: head
  }));

  const handleHeadSelect = (item: any) => {
    if (item.originalData) {
      const { Company, Contract, PartNo, RoutingRevision, BomType } = item.originalData;
      
      const selected = routingHeads.find(h => 
        h.Company === Company && 
        h.Contract === Contract && 
        h.PartNo === PartNo && 
        h.RoutingRevision === RoutingRevision &&
        h.BomType === BomType
      );
      
      if (selected) {
        console.log("Seçilen Routing Başlığı:", selected);
        setSelectedHead(selected);
        setEditingHead(selected);
        setIsCreatingNewHead(false);
        setIsEditing(false);
      } else {
        setSelectedHead(item.originalData);
        setEditingHead(item.originalData);
        setIsCreatingNewHead(false);
        setIsEditing(false);
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
    setEditingHead(selectedHead);
    setEditingOperations([...operationLines]);
  }, [selectedHead, operationLines]);

  const handleEditingHeadChange = useCallback((field: keyof RoutingHead, value: any) => {
    if (!editingHead) return;
    
    setEditingHead({
      ...editingHead,
      [field]: value
    });
  }, [editingHead]);

  const handleEditingOperationChange = useCallback((index: number, field: keyof RoutingOperation, value: any) => {
    if (!editingOperations[index]) return;
    
    const updatedOperations = [...editingOperations];
    
    // Sayısal alanlar için tip kontrolü
    if (field === 'OperationNo' || field === 'MachRunFactor' || field === 'MachSetupTime' 
        || field === 'CrewSize' || field === 'SetupCrewSize') {
      updatedOperations[index] = {
        ...updatedOperations[index],
        [field]: value === '' ? undefined : parseFloat(value)
      };
    } else {
      updatedOperations[index] = {
        ...updatedOperations[index],
        [field]: value
      };
    }
    
    setEditingOperations(updatedOperations);
  }, [editingOperations]);

  const addNewOperationLine = useCallback(() => {
    if (!selectedHead || !editingOperations) return;
    
    const newOperationNo = editingOperations.length > 0 
      ? Math.max(...editingOperations.map(l => l.OperationNo)) + 10 
      : 10;
    
    const newLine: RoutingOperation = {
      id: editingOperations.length + 1,
      Company: selectedHead.Company,
      Contract: selectedHead.Contract,
      PartNo: selectedHead.PartNo,
      RoutingRevision: selectedHead.RoutingRevision,
      BomType: selectedHead.BomType,
      OperationNo: newOperationNo,
      OperationDescription: "",
      WorkCenterNo: "",
      MachRunFactor: 1,
      MachSetupTime: 0,
      LaborClassNo: "",
      RunTimeCode: "HOUR"
    };
    
    setEditingOperations([...editingOperations, newLine]);
  }, [selectedHead, editingOperations]);

  const removeOperationLine = useCallback((index: number) => {
    if (editingOperations.length <= 1) return;
    
    const updatedOperations = editingOperations.filter((_, i) => i !== index);
    setEditingOperations(updatedOperations);
  }, [editingOperations]);

  const handleSaveHead = useCallback(async () => {
    if (!editingHead || !selectedHead) return;

    try {
      setIsSaving(true);
      
      console.log("=== ROUTING KAYIT BAŞLANGICI ===");
      console.log("Seçili başlık:", selectedHead);
      console.log("Düzenlenen operasyonlar:", editingOperations);

      // 1. Ana başlığı güncelle
      const updateDto = {
        noteText: editingHead.NoteText || null,
        phaseInDate: editingHead.PhaseInDate || null,
        phaseOutDate: editingHead.PhaseOutDate || null
      };

      console.log("Ana başlık DTO:", updateDto);

      const response = await fetch(
        `${ROUTING_HEAD_API}/${selectedHead.Company}/${selectedHead.Contract}/${selectedHead.PartNo}/${selectedHead.RoutingRevision}/${selectedHead.BomType}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updateDto)
        }
      );

      if (response.ok) {
        const updatedHeadApi: RoutingHeadApiResponse = await response.json();
        console.log("Ana başlık güncellendi:", updatedHeadApi);
        
        const updatedHead: RoutingHead = {
          id: selectedHead.id,
          Company: updatedHeadApi.company,
          Contract: updatedHeadApi.contract,
          PartNo: updatedHeadApi.partNo,
          RoutingRevision: updatedHeadApi.routingRevision,
          BomType: updatedHeadApi.bomType,
          NoteText: updatedHeadApi.noteText || undefined,
          PhaseInDate: updatedHeadApi.phaseInDate || undefined,
          PhaseOutDate: updatedHeadApi.phaseOutDate || undefined,
          CreateDate: updatedHeadApi.createDate,
          Rowversion: updatedHeadApi.rowversion || undefined,
          Rowkey: updatedHeadApi.rowkey || undefined,
          Rowstate: updatedHeadApi.rowstate || 'Active'
        };

        // 2. Operasyon satırlarını işle
        const lineResults = [];
        const lineErrors = [];

        for (const operation of editingOperations) {
          try {
            console.log(`\n=== Operasyon ${operation.OperationNo} işleniyor ===`);
            console.log("Operasyon verisi:", operation);
            
            // Yeni operasyon mu? - Rowkey'den kontrol et
            const isNewOperation = !operation.Rowkey || operation.Rowkey.includes('new');
            
            if (isNewOperation) {
              console.log(`YENİ OPERASYON oluşturuluyor: ${operation.OperationNo}`);
              
              const operationData: RoutingOperationCreateDto = {
                company: updatedHead.Company,
                contract: updatedHead.Contract,
                partNo: updatedHead.PartNo,
                routingRevision: updatedHead.RoutingRevision,
                bomType: updatedHead.BomType,
                operationNo: operation.OperationNo,
                operationDescription: operation.OperationDescription || null,
                workCenterNo: operation.WorkCenterNo || null,
                machRunFactor: operation.MachRunFactor || null,
                machSetupTime: operation.MachSetupTime || null,
                laborClassNo: operation.LaborClassNo || null,
                setupLaborClassNo: operation.SetupLaborClassNo || null,
                crewSize: operation.CrewSize || null,
                setupCrewSize: operation.SetupCrewSize || null,
                runTimeCode: operation.RunTimeCode || null,
                noteText: operation.NoteText || null
              };

              console.log("Yeni operasyon POST verisi:", operationData);

              const createResponse = await fetch(
                ROUTING_OPERATION_API,
                {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(operationData)
                }
              );

              if (createResponse.ok) {
                const createdLine = await createResponse.json();
                console.log(`Operasyon ${operation.OperationNo} başarıyla OLUŞTURULDU:`, createdLine);
                lineResults.push(createdLine);
                continue;
              } else {
                const errorText = await createResponse.text();
                console.error(`Operasyon ${operation.OperationNo} oluşturma hatası:`, errorText);
                lineErrors.push(`Operasyon ${operation.OperationNo}: ${errorText}`);
              }
            }
            
            // Mevcut operasyonu güncelle
            console.log(`MEVCUT OPERASYON güncelleniyor: ${operation.OperationNo}`);
            
            const operationUpdateDto = {
              operationDescription: operation.OperationDescription || null,
              workCenterNo: operation.WorkCenterNo || null,
              machRunFactor: operation.MachRunFactor || null,
              machSetupTime: operation.MachSetupTime || null,
              laborClassNo: operation.LaborClassNo || null,
              setupLaborClassNo: operation.SetupLaborClassNo || null,
              crewSize: operation.CrewSize || null,
              setupCrewSize: operation.SetupCrewSize || null,
              runTimeCode: operation.RunTimeCode || null,
              noteText: operation.NoteText || null
            };

            console.log("Operasyon PUT verisi:", operationUpdateDto);
            
            const putUrl = `${ROUTING_OPERATION_API}/${operation.Company}/${operation.Contract}/${operation.PartNo}/${operation.BomType}/${operation.RoutingRevision}/${operation.OperationNo}`;
            console.log("PUT URL:", putUrl);

            const updateResponse = await fetch(
              putUrl,
              {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(operationUpdateDto)
              }
            );

            if (updateResponse.ok) {
              const updatedLine = await updateResponse.json();
              console.log(`Operasyon ${operation.OperationNo} başarıyla GÜNCELLENDİ:`, updatedLine);
              lineResults.push(updatedLine);
            } else {
              const errorText = await updateResponse.text();
              console.error(`Operasyon ${operation.OperationNo} güncelleme hatası:`, errorText);
              console.error(`HTTP Status: ${updateResponse.status}`);
              lineErrors.push(`Operasyon ${operation.OperationNo}: ${errorText}`);
            }
          } catch (err) {
            console.error(`Operasyon ${operation.OperationNo} işlem hatası:`, err);
            lineErrors.push(`Operasyon ${operation.OperationNo}: ${err instanceof Error ? err.message : "Bilinmeyen hata"}`);
          }
        }

        console.log("\n=== İŞLEM SONUÇLARI ===");
        console.log("Başarılı operasyonlar:", lineResults.length);
        console.log("Hatalar:", lineErrors.length, lineErrors);

        if (lineErrors.length > 0) {
          alert(`Routing başlığı güncellendi ancak bazı operasyonlar işlenemedi:\n${lineErrors.join('\n')}`);
        }

        console.log("Veriler yeniden yükleniyor...");
        await fetchRoutingHeads();
        
        setSelectedHead(updatedHead);
        setEditingHead(updatedHead);
        
        await fetchOperationLines(
          updatedHead.Company, 
          updatedHead.Contract, 
          updatedHead.PartNo, 
          updatedHead.RoutingRevision, 
          updatedHead.BomType
        );
        
        setIsEditing(false);
        alert("Routing ve operasyonlar başarıyla güncellendi!");
        
      } else {
        const errorText = await response.text();
        console.error("Ana başlık güncelleme hatası:", errorText);
        throw new Error(`Routing başlığı güncellenemedi: ${errorText}`);
      }
    } catch (err) {
      console.error("Routing güncellenirken hata:", err);
      alert(`Hata: ${err instanceof Error ? err.message : "Bilinmeyen hata"}`);
    } finally {
      setIsSaving(false);
    }
  }, [editingHead, selectedHead, editingOperations, fetchRoutingHeads]);

  const handleDeleteHead = useCallback(async () => {
    if (!selectedHead) return;
    
    if (!window.confirm(`${selectedHead.PartNo} numaralı Routing başlığını silmek istediğinize emin misiniz?`)) {
      return;
    }

    try {
      const response = await fetch(
        `${ROUTING_HEAD_API}/${selectedHead.Company}/${selectedHead.Contract}/${selectedHead.PartNo}/${selectedHead.RoutingRevision}/${selectedHead.BomType}`,
        {
          method: 'DELETE',
        }
      );

      if (response.ok) {
        await fetchRoutingHeads();
        
        setSelectedHead(null);
        setEditingHead(null);
        setEditingOperations([]);
        setIsEditing(false);
        
        alert("Routing başlığı başarıyla silindi!");
      } else {
        const errorText = await response.text();
        throw new Error(`Silme başarısız: ${errorText}`);
      }
    } catch (err) {
      console.error("Routing başlığı silinirken hata:", err);
      alert(`Hata: ${err instanceof Error ? err.message : "Bilinmeyen hata"}`);
    }
  }, [selectedHead, fetchRoutingHeads]);

  // Yeni routing formu işlemleri
  const handleNewHeadDataChange = useCallback((field: keyof RoutingHeadCreateDto, value: any) => {
    const updatedData = {
      ...newHeadData,
      [field]: value
    };
    
    setNewHeadData(updatedData);
  }, [newHeadData]);

  const handleNewOperationChange = useCallback((index: number, field: keyof RoutingOperationCreateDto, value: any) => {
    const updatedOperations = [...newOperations];
    updatedOperations[index] = {
      ...updatedOperations[index],
      [field]: field === 'operationNo' || field === 'machRunFactor' || field === 'machSetupTime' 
                || field === 'crewSize' || field === 'setupCrewSize'
        ? (value === '' ? null : parseFloat(value))
        : value
    };
    setNewOperations(updatedOperations);
  }, [newOperations]);

  const addNewOperationInNewHead = useCallback(() => {
    const newLine: RoutingOperationCreateDto = {
      company: newHeadData.company,
      contract: newHeadData.contract,
      partNo: newHeadData.partNo,
      routingRevision: newHeadData.routingRevision,
      bomType: newHeadData.bomType,
      operationNo: newOperations.length > 0 
        ? Math.max(...newOperations.map(l => l.operationNo)) + 10 
        : 10,
      operationDescription: "",
      workCenterNo: "",
      machRunFactor: 1,
      machSetupTime: 0,
      laborClassNo: "",
      runTimeCode: "HOUR",
      noteText: null
    };
    setNewOperations([...newOperations, newLine]);
  }, [newOperations, newHeadData]);

  const removeNewOperation = useCallback((index: number) => {
    if (newOperations.length > 1) {
      const updatedOperations = newOperations.filter((_, i) => i !== index);
      setNewOperations(updatedOperations);
    }
  }, [newOperations]);

  const handleCreateNewHead = useCallback(async () => {
    if (!newHeadData.company || !newHeadData.contract || !newHeadData.partNo 
        || !newHeadData.routingRevision || !newHeadData.bomType) {
      alert("Lütfen zorunlu alanları doldurun (Şirket, Kontrat, Parça No, Routing Revizyon, BOM Tipi)");
      return;
    }

    setIsSaving(true);

    try {
      console.log("Yeni Routing başlığı kaydediliyor:", newHeadData);

      // API'nin beklediği DTO formatı
      const createDto: RoutingHeadCreateDto = {
        company: newHeadData.company,
        contract: newHeadData.contract,
        partNo: newHeadData.partNo,
        routingRevision: newHeadData.routingRevision,
        bomType: newHeadData.bomType,
        noteText: newHeadData.noteText || null,
        phaseInDate: newHeadData.phaseInDate || null,
        phaseOutDate: newHeadData.phaseOutDate || null
      };

      console.log("API'ye gönderilecek veri:", createDto);

      // 1. Önce ana başlığı kaydet
      const headResponse = await fetch(ROUTING_HEAD_API, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(createDto)
      });

      if (!headResponse.ok) {
        const errorText = await headResponse.text();
        console.error("Routing başlığı kayıt hatası:", errorText);
        console.error("Response status:", headResponse.status);
        
        try {
          const errorJson = JSON.parse(errorText);
          throw new Error(`Routing başlığı kaydedilemedi: ${JSON.stringify(errorJson, null, 2)}`);
        } catch {
          throw new Error(`Routing başlığı kaydedilemedi: ${errorText}`);
        }
      }

      const savedHead: RoutingHeadApiResponse = await headResponse.json();
      console.log("Routing başlığı başarıyla kaydedildi:", savedHead);

      // 2. Operasyon satırlarını kaydet
      const savedLines: any[] = [];
      let lineErrors: string[] = [];

      for (const [index, operation] of newOperations.entries()) {
        try {
          const operationData: RoutingOperationCreateDto = {
            company: savedHead.company,
            contract: savedHead.contract,
            partNo: savedHead.partNo,
            routingRevision: savedHead.routingRevision,
            bomType: savedHead.bomType,
            operationNo: operation.operationNo,
            operationDescription: operation.operationDescription || null,
            workCenterNo: operation.workCenterNo || null,
            machRunFactor: operation.machRunFactor || null,
            machSetupTime: operation.machSetupTime || null,
            laborClassNo: operation.laborClassNo || null,
            setupLaborClassNo: operation.setupLaborClassNo || null,
            crewSize: operation.crewSize || null,
            setupCrewSize: operation.setupCrewSize || null,
            runTimeCode: operation.runTimeCode || null,
            noteText: operation.noteText || null
          };

          console.log(`Operasyon ${index + 1} kaydediliyor:`, operationData);

          const lineResponse = await fetch(
            ROUTING_OPERATION_API,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(operationData)
            }
          );

          if (lineResponse.ok) {
            const savedLine = await lineResponse.json();
            savedLines.push(savedLine);
            console.log(`Operasyon ${index + 1} başarıyla kaydedildi:`, savedLine);
          } else {
            const errorText = await lineResponse.text();
            console.error(`Operasyon ${index + 1} kayıt hatası:`, errorText);
            lineErrors.push(`Operasyon ${index + 1}: ${errorText}`);
          }
        } catch (lineErr) {
          console.error(`Operasyon ${index + 1} işlem hatası:`, lineErr);
          lineErrors.push(`Operasyon ${index + 1}: ${lineErr}`);
        }
      }

      // 3. Sonuçları işle
      if (lineErrors.length > 0) {
        console.warn("Bazı operasyonlar kaydedilemedi:", lineErrors);
        alert(`Routing başlığı kaydedildi ancak bazı operasyonlar kaydedilemedi:\n${lineErrors.join('\n')}`);
      } else if (savedLines.length === 0) {
        console.warn("Hiçbir operasyon kaydedilmedi");
        alert("Routing başlığı kaydedildi ancak hiçbir operasyon eklenmedi.");
      } else {
        console.log("Tüm operasyonlar başarıyla kaydedildi:", savedLines.length);
      }

      // 4. Verileri yeniden yükle
      await fetchRoutingHeads();
      
      // 5. Yeni eklenen başlığı seç
      const newHead: RoutingHead = {
        id: routingHeads.length + 1,
        Company: savedHead.company,
        Contract: savedHead.contract,
        PartNo: savedHead.partNo,
        RoutingRevision: savedHead.routingRevision,
        BomType: savedHead.bomType,
        NoteText: savedHead.noteText || undefined,
        PhaseInDate: savedHead.phaseInDate || undefined,
        PhaseOutDate: savedHead.phaseOutDate || undefined,
        CreateDate: savedHead.createDate,
        Rowversion: savedHead.rowversion || undefined,
        Rowkey: savedHead.rowkey || undefined,
        Rowstate: savedHead.rowstate || 'Active'
      };

      setSelectedHead(newHead);
      setEditingHead(newHead);
      setIsCreatingNewHead(false);
      
      // 6. Formu sıfırla
      resetForm();
      
      alert(`Routing başlığı başarıyla oluşturuldu: ${savedHead.partNo}\nKaydedilen operasyon sayısı: ${savedLines.length}`);

    } catch (err) {
      console.error("Routing başlığı oluşturma hatası:", err);
      alert(`Hata: ${err instanceof Error ? err.message : "Bilinmeyen hata"}`);
    } finally {
      setIsSaving(false);
    }
  }, [newHeadData, newOperations, routingHeads, fetchRoutingHeads]);

  const resetForm = useCallback(() => {
    setNewHeadData({
      company: "",
      contract: "",
      partNo: "",
      routingRevision: "A",
      bomType: "STANDARD",
      rowversion: new Date().toISOString()
    });
    
    setNewOperations([
      {
        company: "",
        contract: "",
        partNo: "",
        routingRevision: "A",
        bomType: "STANDARD",
        operationNo: 10,
        operationDescription: "",
        workCenterNo: "",
        machRunFactor: 1,
        machSetupTime: 0,
        laborClassNo: "",
        runTimeCode: "HOUR",
        noteText: null
      }
    ]);
  }, []);

  const handleCancelNewHead = useCallback(() => {
    setIsCreatingNewHead(false);
    resetForm();
  }, [resetForm]);

  // YENİ ROUTING OLUŞTURMA EKRANI
  if (isCreatingNewHead) {
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
            title="Routing Arama"
            items={searchListItems}
            onSelect={handleHeadSelect}
            onToggle={handleToggleSearchList}
            searchFields={["code", "name", "description"]}
            displayFields={["code", "name"]}
            icon="fas fa-route"
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

        {/* ANA EKRAN - YENİ ROUTING OLUŞTURMA */}
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
                <h2 style={{ margin: 0, color: "#f1f5f9", fontSize: "1.3rem" }}>Yeni Üretim Yönlendirme</h2>
                <p style={{ margin: "4px 0 0 0", color: "#94a3b8", fontSize: "0.85rem" }}>
                  Parça No: <strong>{newHeadData.partNo || "(Belirtilmemiş)"}</strong>
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
                <span>Önce routing başlığı kaydedilecek, ardından operasyonlar tek tek eklenecektir.</span>
              </div>
            </div>
          </div>

          {/* Routing Başlık Bilgileri */}
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
              Routing Başlık Bilgileri (Önce Kaydedilecek)
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
              {/* Şirket Seçimi */}
              <div>
                <label style={labelStyle}>
                  Şirket <span style={{ color: "#ef4444" }}>*</span>
                </label>
                {isLoadingCompanies ? (
                  <div style={{
                    padding: "10px 12px",
                    backgroundColor: "rgba(30, 41, 59, 0.8)",
                    border: "1px solid #475569",
                    borderRadius: "6px",
                    color: "#94a3b8",
                    fontSize: "0.9rem"
                  }}>
                    Şirketler yükleniyor...
                  </div>
                ) : (
                  <select
                    value={newHeadData.company}
                    onChange={(e) => handleNewHeadDataChange('company', e.target.value)}
                    style={inputStyle}
                  >
                    <option value="">Şirket seçin...</option>
                    {companies.map(company => (
                      <option key={company.companyId} value={company.companyId}>
                        {company.name} ({company.companyId})
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {/* Kontrat Seçimi */}
              <div>
                <label style={labelStyle}>
                  Kontrat <span style={{ color: "#ef4444" }}>*</span>
                </label>
                {isLoadingContracts || isLoadingCompanies ? (
                  <div style={{
                    padding: "10px 12px",
                    backgroundColor: "rgba(30, 41, 59, 0.8)",
                    border: "1px solid #475569",
                    borderRadius: "6px",
                    color: "#94a3b8",
                    fontSize: "0.9rem"
                  }}>
                    {!newHeadData.company ? "Önce şirket seçin" : "Contract'lar yükleniyor..."}
                  </div>
                ) : (
                  <select
                    value={newHeadData.contract}
                    onChange={(e) => handleNewHeadDataChange('contract', e.target.value)}
                    style={inputStyle}
                    disabled={!newHeadData.company}
                  >
                    <option value="">
                      {newHeadData.company ? "Contract seçin..." : "Önce şirket seçin"}
                    </option>
                    {filteredContracts.map(site => (
                      <option key={`${site.company}-${site.contract}`} value={site.contract}>
                        {site.contract} - {site.description || 'No Description'}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div>
                <label style={labelStyle}>
                  Parça No <span style={{ color: "#ef4444" }}>*</span>
                </label>
                <div style={{ display: "flex", gap: "8px" }}>
                  <input
                    type="text"
                    value={newHeadData.partNo}
                    onChange={(e) => handleNewHeadDataChange('partNo', e.target.value)}
                    style={{ ...inputStyle, flex: 1 }}
                    placeholder="Parça numarası girin"
                  />
                  <button
                    onClick={() => openInventorySearch(true)}
                    style={{
                      background: "#8b5cf6",
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
                    title="Malzeme Ara"
                  >
                    <i className="fas fa-search"></i>
                  </button>
                </div>
              </div>
              <div>
                <label style={labelStyle}>
                  Routing Revizyonu <span style={{ color: "#ef4444" }}>*</span>
                </label>
                <input
                  type="text"
                  value={newHeadData.routingRevision}
                  onChange={(e) => handleNewHeadDataChange('routingRevision', e.target.value)}
                  style={inputStyle}
                  placeholder="Örn: A"
                />
              </div>
              <div>
                <label style={labelStyle}>
                  BOM Tipi <span style={{ color: "#ef4444" }}>*</span>
                </label>
                <select
                  value={newHeadData.bomType}
                  onChange={(e) => handleNewHeadDataChange('bomType', e.target.value)}
                  style={inputStyle}
                >
                  <option value="STANDARD">STANDARD</option>
                  <option value="PLANNING">PLANNING</option>
                  <option value="ALTERNATIVE">ALTERNATIVE</option>
                  <option value="ENGINEERING">ENGINEERING</option>
                </select>
              </div>
              <div>
                <label style={labelStyle}>Başlangıç Tarihi</label>
                <input
                  type="date"
                  value={newHeadData.phaseInDate || ''}
                  onChange={(e) => handleNewHeadDataChange('phaseInDate', e.target.value || null)}
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>Bitiş Tarihi</label>
                <input
                  type="date"
                  value={newHeadData.phaseOutDate || ''}
                  onChange={(e) => handleNewHeadDataChange('phaseOutDate', e.target.value || null)}
                  style={inputStyle}
                />
              </div>
            </div>
          </div>

          {/* Operasyonlar */}
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
                Operasyonlar (Başlık Kaydedildikten Sonra Eklenecek)
              </h3>
              <button
                onClick={addNewOperationInNewHead}
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
                <span>Yeni Operasyon Ekle</span>
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
                gridTemplateColumns: "80px 2fr 120px 100px 100px 120px 100px 80px",
                backgroundColor: "#334155",
                padding: "12px 15px",
                borderBottom: "1px solid #475569",
                fontSize: "0.75rem",
                fontWeight: "600",
                color: "#f1f5f9",
                position: "sticky",
                top: 0,
                zIndex: 10
              }}>
                <div>Op.No</div>
                <div>Açıklama</div>
                <div>İş Merkezi</div>
                <div>Çalışan</div>
                <div>Kurulum</div>
                <div>İşçi Sınıfı</div>
                <div>Çalışma Kodu</div>
                <div>Sil</div>
              </div>

              {/* Grid Body */}
              <div>
                {newOperations.map((operation, index) => (
                  <div
                    key={index}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "80px 2fr 120px 100px 100px 120px 100px 80px",
                      padding: "10px 15px",
                      borderBottom: "1px solid #334155",
                      fontSize: "0.8rem",
                      color: "#f1f5f9",
                      backgroundColor: index % 2 === 0 ? "rgba(30, 41, 59, 0.5)" : "rgba(30, 41, 59, 0.3)",
                      alignItems: "center"
                    }}
                  >
                    <div>
                      <input
                        type="number"
                        value={operation.operationNo}
                        onChange={(e) => handleNewOperationChange(index, 'operationNo', e.target.value)}
                        style={{
                          width: "100%",
                          padding: "6px 8px",
                          backgroundColor: "rgba(30, 41, 59, 0.8)",
                          border: "1px solid #475569",
                          borderRadius: "4px",
                          color: "#f1f5f9",
                          fontSize: "0.8rem"
                        }}
                        min="10"
                        step="10"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        value={operation.operationDescription || ''}
                        onChange={(e) => handleNewOperationChange(index, 'operationDescription', e.target.value)}
                        style={{
                          width: "100%",
                          padding: "6px 8px",
                          backgroundColor: "rgba(30, 41, 59, 0.8)",
                          border: "1px solid #475569",
                          borderRadius: "4px",
                          color: "#f1f5f9",
                          fontSize: "0.8rem"
                        }}
                        placeholder="Operasyon açıklaması"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        value={operation.workCenterNo || ''}
                        onChange={(e) => handleNewOperationChange(index, 'workCenterNo', e.target.value)}
                        style={{
                          width: "100%",
                          padding: "6px 8px",
                          backgroundColor: "rgba(30, 41, 59, 0.8)",
                          border: "1px solid #475569",
                          borderRadius: "4px",
                          color: "#f1f5f9",
                          fontSize: "0.8rem"
                        }}
                        placeholder="İş merkezi"
                      />
                    </div>
                    <div>
                      <input
                        type="number"
                        step="0.1"
                        value={operation.machRunFactor || ''}
                        onChange={(e) => handleNewOperationChange(index, 'machRunFactor', e.target.value)}
                        style={{
                          width: "100%",
                          padding: "6px 8px",
                          backgroundColor: "rgba(30, 41, 59, 0.8)",
                          border: "1px solid #475569",
                          borderRadius: "4px",
                          color: "#f1f5f9",
                          fontSize: "0.8rem"
                        }}
                        placeholder="1.0"
                      />
                    </div>
                    <div>
                      <input
                        type="number"
                        value={operation.machSetupTime || ''}
                        onChange={(e) => handleNewOperationChange(index, 'machSetupTime', e.target.value)}
                        style={{
                          width: "100%",
                          padding: "6px 8px",
                          backgroundColor: "rgba(30, 41, 59, 0.8)",
                          border: "1px solid #475569",
                          borderRadius: "4px",
                          color: "#f1f5f9",
                          fontSize: "0.8rem"
                        }}
                        placeholder="0"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        value={operation.laborClassNo || ''}
                        onChange={(e) => handleNewOperationChange(index, 'laborClassNo', e.target.value)}
                        style={{
                          width: "100%",
                          padding: "6px 8px",
                          backgroundColor: "rgba(30, 41, 59, 0.8)",
                          border: "1px solid #475569",
                          borderRadius: "4px",
                          color: "#f1f5f9",
                          fontSize: "0.8rem"
                        }}
                        placeholder="İşçi sınıfı"
                      />
                    </div>
                    <div>
                      <select
                        value={operation.runTimeCode || 'HOUR'}
                        onChange={(e) => handleNewOperationChange(index, 'runTimeCode', e.target.value)}
                        style={{
                          width: "100%",
                          padding: "6px 8px",
                          backgroundColor: "rgba(30, 41, 59, 0.8)",
                          border: "1px solid #475569",
                          borderRadius: "4px",
                          color: "#f1f5f9",
                          fontSize: "0.8rem"
                        }}
                      >
                        <option value="HOUR">Saat</option>
                        <option value="MINUTE">Dakika</option>
                        <option value="DAY">Gün</option>
                        <option value="PIECE">Adet</option>
                      </select>
                    </div>
                    <div style={{ textAlign: "center" }}>
                      <button
                        onClick={() => removeNewOperation(index)}
                        disabled={newOperations.length <= 1}
                        style={{
                          background: newOperations.length <= 1 ? "#64748b" : "#ef4444",
                          color: "white",
                          border: "none",
                          borderRadius: "4px",
                          width: "28px",
                          height: "28px",
                          cursor: newOperations.length <= 1 ? "not-allowed" : "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          opacity: newOperations.length <= 1 ? 0.5 : 1
                        }}
                        title="Operasyonu Sil"
                      >
                        <i className="fas fa-trash" style={{ fontSize: "0.7rem" }}></i>
                      </button>
                    </div>
                  </div>
                ))}
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
              value={newHeadData.noteText || ''}
              onChange={(e) => handleNewHeadDataChange('noteText', e.target.value || null)}
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
              placeholder="Routing ile ilgili ek notlar..."
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
                onClick={handleCancelNewHead}
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
                onClick={handleCreateNewHead}
                disabled={isSaving || !newHeadData.partNo || !newHeadData.company || !newHeadData.contract || !newHeadData.routingRevision || !newHeadData.bomType}
                style={{
                  background: !newHeadData.partNo || !newHeadData.company || !newHeadData.contract || !newHeadData.routingRevision || !newHeadData.bomType
                    ? "#475569" 
                    : isSaving
                    ? "#f59e0b"
                    : "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  padding: "10px 25px",
                  fontSize: "0.9rem",
                  cursor: !newHeadData.partNo || !newHeadData.company || !newHeadData.contract || !newHeadData.routingRevision || !newHeadData.bomType || isSaving 
                    ? "not-allowed" 
                    : "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  opacity: !newHeadData.partNo || !newHeadData.company || !newHeadData.contract || !newHeadData.routingRevision || !newHeadData.bomType || isSaving ? 0.6 : 1
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
                    <span>Routing'i Oluştur</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // NORMAL EKRAN - Routing Listeleme ve Düzenleme
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
          title="Routing Arama"
          items={searchListItems}
          onSelect={handleHeadSelect}
          onToggle={handleToggleSearchList}
          searchFields={["code", "name", "description"]}
          displayFields={["code", "name"]}
          icon="fas fa-route"
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
        {/* Header - Tabs */}
        <div style={{
          background: "#1e293b",
          borderRadius: "12px 12px 0 0",
          padding: "20px 20px 0 20px",
          border: "1px solid #334155",
          borderBottom: "none",
          display: "flex",
          flexDirection: "column",
          marginBottom: "0",
          minWidth: "0"
        }}>
          <div style={{ 
            fontSize: "1.3rem",
            color: "#8b5cf6",
            marginBottom: "15px",
            fontWeight: "600",
            display: "flex",
            alignItems: "center",
            gap: "10px"
          }}>
            <i className="fas fa-route"></i>
            Üretim Yönlendirme Yönetimi
          </div>
          
          {/* Tablar */}
          <div style={{ 
            display: "flex", 
            borderBottom: "1px solid #334155"
          }}>
            {tabs.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  padding: "12px 24px",
                  background: "none",
                  border: "none",
                  color: activeTab === tab ? "#38bdf8" : "#94a3b8",
                  cursor: "pointer",
                  borderBottom: activeTab === tab ? "3px solid #38bdf8" : "none",
                  fontSize: "0.9rem",
                  transition: "all 0.2s",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px"
                }}
              >
                {tab === "Operasyonlar" ? (
                  <i className="fas fa-list"></i>
                ) : (
                  <i className="fas fa-info-circle"></i>
                )}
                <span>{tab}</span>
              </button>
            ))}
          </div>
        </div>

        {/* İçerik Alanı */}
        <div style={{
          flex: 1,
          background: "#1e293b",
          borderRadius: "0 0 12px 12px",
          padding: "20px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
          border: "1px solid #334155",
          borderTop: "none",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden"
        }}>
          {/* Üst Kontroller */}
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
            paddingBottom: "15px",
            borderBottom: "1px solid #334155"
          }}>
            <div style={{ 
              color: "#94a3b8",
              fontSize: "0.9rem",
              display: "flex",
              alignItems: "center",
              gap: "10px"
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
                  gap: "5px"
                }}
              >
                <i className="fas fa-search"></i>
                <span>{isSearchListVisible ? "Listeyi Gizle" : "Listeyi Göster"}</span>
              </button>
              
              <button
                onClick={() => {
                  fetchRoutingHeads();
                  fetchCompanies();
                  fetchCompanySites();
                }}
                style={{
                  background: "#3b82f6",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  padding: "8px 12px",
                  fontSize: "0.8rem",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "5px"
                }}
              >
                <i className="fas fa-sync-alt"></i>
                <span>Yenile</span>
              </button>
              
              <div style={{
                padding: "6px 12px",
                backgroundColor: "rgba(30, 41, 59, 0.5)",
                borderRadius: "4px",
                display: "flex",
                alignItems: "center",
                gap: "5px"
              }}>
                <i className="fas fa-database"></i>
                <span>
                  {loading ? "Yükleniyor..." : `Toplam ${routingHeads.length} routing`}
                </span>
              </div>
            </div>
            
            <div style={{ display: "flex", gap: "10px" }}>
              <button
                onClick={() => setIsCreatingNewHead(true)}
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
                  gap: "6px"
                }}
              >
                <i className="fas fa-plus"></i>
                <span>Yeni Routing</span>
              </button>
            </div>
          </div>

          {/* Data Grid View */}
          <div style={{
            flex: 1,
            backgroundColor: "rgba(30, 41, 59, 0.3)",
            borderRadius: "8px",
            overflow: "hidden",
            border: "1px solid #334155",
            display: "flex",
            flexDirection: "column"
          }}>
            {/* Grid Header */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "100px 120px 120px 1fr 120px 120px 100px 80px",
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
              <div>Şirket</div>
              <div>Kontrat</div>
              <div>Parça No</div>
              <div>Açıklama</div>
              <div>Revizyon</div>
              <div>BOM Tipi</div>
              <div>Durum</div>
              <div>İşlem</div>
            </div>

            {/* Grid Body */}
            <div style={{ 
              flex: 1, 
              overflowY: "auto",
              maxHeight: "calc(100vh - 300px)"
            }}>
              {loading ? (
                <div style={{
                  padding: "40px",
                  textAlign: "center",
                  color: "#94a3b8"
                }}>
                  <i className="fas fa-spinner fa-spin" style={{ fontSize: "2rem", marginBottom: "10px" }}></i>
                  <p>Yükleniyor...</p>
                </div>
              ) : routingHeads.length > 0 ? (
                routingHeads.map((head, index) => {
                  const isSelected = selectedHead?.Company === head.Company && 
                                   selectedHead?.Contract === head.Contract && 
                                   selectedHead?.PartNo === head.PartNo && 
                                   selectedHead?.RoutingRevision === head.RoutingRevision &&
                                   selectedHead?.BomType === head.BomType;
                  
                  return (
                    <div
                      key={`${head.Company}-${head.Contract}-${head.PartNo}-${head.RoutingRevision}-${head.BomType}`}
                      onClick={() => setSelectedHead(head)}
                      style={{
                        display: "grid",
                        gridTemplateColumns: "100px 120px 120px 1fr 120px 120px 100px 80px",
                        padding: "10px 15px",
                        borderBottom: "1px solid #334155",
                        fontSize: "0.85rem",
                        color: "#f1f5f9",
                        backgroundColor: isSelected 
                          ? "rgba(56, 189, 248, 0.2)" 
                          : index % 2 === 0 
                            ? "rgba(30, 41, 59, 0.5)" 
                            : "rgba(30, 41, 59, 0.3)",
                        cursor: "pointer",
                        alignItems: "center",
                        transition: "background-color 0.2s"
                      }}
                      onMouseOver={(e) => {
                        if (!isSelected) e.currentTarget.style.backgroundColor = "rgba(56, 189, 248, 0.1)";
                      }}
                      onMouseOut={(e) => {
                        if (!isSelected) e.currentTarget.style.backgroundColor = index % 2 === 0 
                          ? "rgba(30, 41, 59, 0.5)" 
                          : "rgba(30, 41, 59, 0.3)";
                      }}
                    >
                      <div>
                        <i className="fas fa-building" style={{ 
                          marginRight: "8px", 
                          color: "#8b5cf6" 
                        }}></i>
                        {getCompanyName(head.Company)}
                      </div>
                      <div style={{ color: "#f59e0b", fontWeight: "500" }}>
                        <i className="fas fa-file-contract" style={{ marginRight: "8px" }}></i>
                        {head.Contract}
                      </div>
                      <div>
                        <i className="fas fa-box" style={{ marginRight: "8px", color: "#10b981" }}></i>
                        {head.PartNo}
                      </div>
                      <div style={{ 
                        color: "#94a3b8",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis"
                      }}>
                        {head.NoteText || '-'}
                      </div>
                      <div style={{ color: "#3b82f6", fontWeight: "500" }}>{head.RoutingRevision}</div>
                      <div style={{ color: "#8b5cf6" }}>{head.BomType}</div>
                      <div style={{ textAlign: "center" }}>
                        <span style={{
                          backgroundColor: head.Rowstate === 'Active' 
                            ? "rgba(16, 185, 129, 0.2)" 
                            : "rgba(239, 68, 68, 0.2)",
                          color: head.Rowstate === 'Active' ? "#10b981" : "#ef4444",
                          padding: "2px 6px",
                          borderRadius: "4px",
                          fontSize: "0.8rem"
                        }}>
                          {head.Rowstate || 'Active'}
                        </span>
                      </div>
                      <div style={{ textAlign: "center" }}>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedHead(head);
                            setEditingHead(head);
                          }}
                          style={{
                            background: "#3b82f6",
                            color: "white",
                            border: "none",
                            borderRadius: "4px",
                            padding: "6px 10px",
                            fontSize: "0.8rem",
                            cursor: "pointer"
                          }}
                        >
                          Seç
                        </button>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div style={{
                  padding: "40px",
                  textAlign: "center",
                  color: "#94a3b8"
                }}>
                  <i className="fas fa-route" style={{ fontSize: "2rem", marginBottom: "10px" }}></i>
                  <p>Hiç routing bulunamadı.</p>
                </div>
              )}
            </div>
          </div>

          {/* Seçili Routing Detayları */}
          {selectedHead && editingHead && (
            <div style={{
              background: "#1e293b",
              borderRadius: "12px",
              padding: "20px",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
              border: "1px solid #334155",
              marginTop: "15px"
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
                  <i className="fas fa-info-circle" style={{ color: "#38bdf8" }}></i>
                  Routing Detayları
                  {isEditing && " (Düzenleme Modu)"}
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
                      <button
                        onClick={handleDeleteHead}
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
                        onClick={handleSaveHead}
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
              
              {/* Detay Formu */}
              <div style={{ 
                display: "grid", 
                gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", 
                gap: "15px",
                marginBottom: "20px"
              }}>
                {/* Şirket */}
                <div>
                  <label style={labelStyle}>Şirket</label>
                  <div style={{ 
                    padding: "10px 12px",
                    backgroundColor: "rgba(30, 41, 59, 0.8)",
                    border: "1px solid #475569",
                    borderRadius: "6px",
                    color: "#f1f5f9",
                    fontWeight: "500",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px"
                  }}>
                    <i className="fas fa-building" style={{ color: "#8b5cf6" }}></i>
                    <span>{getCompanyName(editingHead.Company)}</span>
                  </div>
                </div>

                {/* Kontrat */}
                <div>
                  <label style={labelStyle}>Kontrat</label>
                  <div style={{ 
                    padding: "10px 12px",
                    backgroundColor: "rgba(30, 41, 59, 0.8)",
                    border: "1px solid #475569",
                    borderRadius: "6px",
                    color: "#f1f5f9",
                    fontWeight: "500",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px"
                  }}>
                    <i className="fas fa-file-contract" style={{ color: "#f59e0b" }}></i>
                    <span>
                      {editingHead.Contract} - {getContractDescription(editingHead.Company, editingHead.Contract)}
                    </span>
                  </div>
                </div>

                {/* Parça No */}
                <div>
                  <label style={labelStyle}>Parça No</label>
                  {isEditing ? (
                    <div style={{ display: "flex", gap: "8px" }}>
                      <input
                        type="text"
                        value={editingHead.PartNo}
                        onChange={(e) => handleEditingHeadChange('PartNo', e.target.value)}
                        style={{ ...inputStyle, flex: 1 }}
                        disabled={!isEditing}
                      />
                      <button
                        onClick={() => openInventorySearch(true)}
                        style={{
                          background: "#8b5cf6",
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
                        title="Malzeme Ara"
                        disabled={!isEditing}
                      >
                        <i className="fas fa-search"></i>
                      </button>
                    </div>
                  ) : (
                    <div style={{ 
                      padding: "8px", 
                      backgroundColor: "rgba(30, 41, 59, 0.5)",
                      borderRadius: "4px",
                      color: "#f1f5f9",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px"
                    }}>
                      <i className="fas fa-box" style={{ color: "#10b981" }}></i>
                      <span>{editingHead.PartNo}</span>
                    </div>
                  )}
                </div>
                
                {/* Routing Revizyonu */}
                <div>
                  <label style={labelStyle}>Routing Revizyonu</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editingHead.RoutingRevision}
                      onChange={(e) => handleEditingHeadChange('RoutingRevision', e.target.value)}
                      style={inputStyle}
                    />
                  ) : (
                    <div style={{ 
                      padding: "8px", 
                      backgroundColor: "rgba(30, 41, 59, 0.5)",
                      borderRadius: "4px",
                      color: "#f1f5f9",
                      fontWeight: "500"
                    }}>
                      {editingHead.RoutingRevision}
                    </div>
                  )}
                </div>
                
                {/* BOM Tipi */}
                <div>
                  <label style={labelStyle}>BOM Tipi</label>
                  {isEditing ? (
                    <select
                      value={editingHead.BomType}
                      onChange={(e) => handleEditingHeadChange('BomType', e.target.value)}
                      style={inputStyle}
                    >
                      <option value="STANDARD">STANDARD</option>
                      <option value="PLANNING">PLANNING</option>
                      <option value="ALTERNATIVE">ALTERNATIVE</option>
                      <option value="ENGINEERING">ENGINEERING</option>
                    </select>
                  ) : (
                    <div style={{ 
                      padding: "8px", 
                      backgroundColor: "rgba(30, 41, 59, 0.5)",
                      borderRadius: "4px",
                      color: "#f1f5f9",
                      fontWeight: "500"
                    }}>
                      {editingHead.BomType}
                    </div>
                  )}
                </div>
                
                {/* Başlangıç Tarihi */}
                <div>
                  <label style={labelStyle}>Başlangıç Tarihi</label>
                  {isEditing ? (
                    <input
                      type="date"
                      value={editingHead.PhaseInDate || ''}
                      onChange={(e) => handleEditingHeadChange('PhaseInDate', e.target.value || undefined)}
                      style={inputStyle}
                    />
                  ) : (
                    <div style={{ 
                      padding: "8px", 
                      backgroundColor: "rgba(30, 41, 59, 0.5)",
                      borderRadius: "4px",
                      color: "#f1f5f9"
                    }}>
                      {editingHead.PhaseInDate || '-'}
                    </div>
                  )}
                </div>
                
                {/* Bitiş Tarihi */}
                <div>
                  <label style={labelStyle}>Bitiş Tarihi</label>
                  {isEditing ? (
                    <input
                      type="date"
                      value={editingHead.PhaseOutDate || ''}
                      onChange={(e) => handleEditingHeadChange('PhaseOutDate', e.target.value || undefined)}
                      style={inputStyle}
                    />
                  ) : (
                    <div style={{ 
                      padding: "8px", 
                      backgroundColor: "rgba(30, 41, 59, 0.5)",
                      borderRadius: "4px",
                      color: "#f1f5f9"
                    }}>
                      {editingHead.PhaseOutDate || '-'}
                    </div>
                  )}
                </div>
                
                {/* Oluşturulma Tarihi */}
                <div>
                  <label style={labelStyle}>Oluşturulma Tarihi</label>
                  <div style={{ 
                    padding: "8px", 
                    backgroundColor: "rgba(30, 41, 59, 0.5)",
                    borderRadius: "4px",
                    color: "#94a3b8",
                    fontSize: "0.85rem"
                  }}>
                    {editingHead.CreateDate}
                  </div>
                </div>
                
                {/* Notlar */}
                <div style={{ gridColumn: "1 / -1" }}>
                  <label style={labelStyle}>Notlar</label>
                  {isEditing ? (
                    <textarea
                      value={editingHead.NoteText || ''}
                      onChange={(e) => handleEditingHeadChange('NoteText', e.target.value || undefined)}
                      rows={3}
                      style={{
                        ...inputStyle,
                        resize: "vertical"
                      }}
                      placeholder="Routing ile ilgili notlar..."
                    />
                  ) : (
                    <div style={{ 
                      padding: "8px", 
                      backgroundColor: "rgba(30, 41, 59, 0.5)",
                      borderRadius: "4px",
                      color: "#f1f5f9",
                      minHeight: "50px"
                    }}>
                      {editingHead.NoteText || '-'}
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

                {activeTab === "Operasyonlar" && (
                  <div>
                    {editingOperations.length > 0 ? (
                      <div style={{
                        backgroundColor: "rgba(30, 41, 59, 0.3)",
                        borderRadius: "8px",
                        overflow: "hidden",
                        border: "1px solid #334155"
                      }}>
                        <div style={{
                          display: "grid",
                          gridTemplateColumns: "80px 2fr 120px 100px 100px 120px 120px 100px 80px",
                          backgroundColor: "#334155",
                          padding: "12px 15px",
                          borderBottom: "1px solid #475569",
                          fontSize: "0.7rem",
                          fontWeight: "600",
                          color: "#f1f5f9"
                        }}>
                          <div>Op.No</div>
                          <div>Açıklama</div>
                          <div>İş Merkezi</div>
                          <div>Çalışan</div>
                          <div>Kurulum</div>
                          <div>İşçi Sınıfı</div>
                          <div>Kurulum İşçi</div>
                          <div>Çalışma Kodu</div>
                          <div>İşlem</div>
                        </div>

                        {editingOperations.map((operation, index) => (
                          <div
                            key={operation.id}
                            style={{
                              display: "grid",
                              gridTemplateColumns: "80px 2fr 120px 100px 100px 120px 120px 100px 80px",
                              padding: "10px 15px",
                              borderBottom: "1px solid #334155",
                              fontSize: "0.8rem",
                              color: "#f1f5f9",
                              backgroundColor: index % 2 === 0 ? "rgba(30, 41, 59, 0.5)" : "rgba(30, 41, 59, 0.3)",
                              alignItems: "center"
                            }}
                          >
                            <div>
                              {isEditing ? (
                                <input
                                  type="number"
                                  value={operation.OperationNo}
                                  onChange={(e) => handleEditingOperationChange(index, 'OperationNo', e.target.value)}
                                  style={{
                                    width: "100%",
                                    padding: "6px 8px",
                                    backgroundColor: "rgba(30, 41, 59, 0.8)",
                                    border: "1px solid #475569",
                                    borderRadius: "4px",
                                    color: "#f1f5f9",
                                    fontSize: "0.8rem"
                                  }}
                                  min="10"
                                  step="10"
                                />
                              ) : (
                                operation.OperationNo
                              )}
                            </div>
                            <div>
                              {isEditing ? (
                                <input
                                  type="text"
                                  value={operation.OperationDescription || ''}
                                  onChange={(e) => handleEditingOperationChange(index, 'OperationDescription', e.target.value)}
                                  style={{
                                    width: "100%",
                                    padding: "6px 8px",
                                    backgroundColor: "rgba(30, 41, 59, 0.8)",
                                    border: "1px solid #475569",
                                    borderRadius: "4px",
                                    color: "#f1f5f9",
                                    fontSize: "0.8rem"
                                  }}
                                />
                              ) : (
                                operation.OperationDescription || '-'
                              )}
                            </div>
                            <div>
                              {isEditing ? (
                                <input
                                  type="text"
                                  value={operation.WorkCenterNo || ''}
                                  onChange={(e) => handleEditingOperationChange(index, 'WorkCenterNo', e.target.value)}
                                  style={{
                                    width: "100%",
                                    padding: "6px 8px",
                                    backgroundColor: "rgba(30, 41, 59, 0.8)",
                                    border: "1px solid #475569",
                                    borderRadius: "4px",
                                    color: "#f1f5f9",
                                    fontSize: "0.8rem"
                                  }}
                                />
                              ) : (
                                operation.WorkCenterNo || '-'
                              )}
                            </div>
                            <div>
                              {isEditing ? (
                                <input
                                  type="number"
                                  step="0.1"
                                  value={operation.MachRunFactor || ''}
                                  onChange={(e) => handleEditingOperationChange(index, 'MachRunFactor', e.target.value)}
                                  style={{
                                    width: "100%",
                                    padding: "6px 8px",
                                    backgroundColor: "rgba(30, 41, 59, 0.8)",
                                    border: "1px solid #475569",
                                    borderRadius: "4px",
                                    color: "#f1f5f9",
                                    fontSize: "0.8rem"
                                  }}
                                />
                              ) : (
                                operation.MachRunFactor || '-'
                              )}
                            </div>
                            <div>
                              {isEditing ? (
                                <input
                                  type="number"
                                  value={operation.MachSetupTime || ''}
                                  onChange={(e) => handleEditingOperationChange(index, 'MachSetupTime', e.target.value)}
                                  style={{
                                    width: "100%",
                                    padding: "6px 8px",
                                    backgroundColor: "rgba(30, 41, 59, 0.8)",
                                    border: "1px solid #475569",
                                    borderRadius: "4px",
                                    color: "#f1f5f9",
                                    fontSize: "0.8rem"
                                  }}
                                />
                              ) : (
                                operation.MachSetupTime || '-'
                              )}
                            </div>
                            <div>
                              {isEditing ? (
                                <input
                                  type="text"
                                  value={operation.LaborClassNo || ''}
                                  onChange={(e) => handleEditingOperationChange(index, 'LaborClassNo', e.target.value)}
                                  style={{
                                    width: "100%",
                                    padding: "6px 8px",
                                    backgroundColor: "rgba(30, 41, 59, 0.8)",
                                    border: "1px solid #475569",
                                    borderRadius: "4px",
                                    color: "#f1f5f9",
                                    fontSize: "0.8rem"
                                  }}
                                />
                              ) : (
                                operation.LaborClassNo || '-'
                              )}
                            </div>
                            <div>
                              {isEditing ? (
                                <input
                                  type="text"
                                  value={operation.SetupLaborClassNo || ''}
                                  onChange={(e) => handleEditingOperationChange(index, 'SetupLaborClassNo', e.target.value)}
                                  style={{
                                    width: "100%",
                                    padding: "6px 8px",
                                    backgroundColor: "rgba(30, 41, 59, 0.8)",
                                    border: "1px solid #475569",
                                    borderRadius: "4px",
                                    color: "#f1f5f9",
                                    fontSize: "0.8rem"
                                  }}
                                />
                              ) : (
                                operation.SetupLaborClassNo || '-'
                              )}
                            </div>
                            <div>
                              {isEditing ? (
                                <select
                                  value={operation.RunTimeCode || 'HOUR'}
                                  onChange={(e) => handleEditingOperationChange(index, 'RunTimeCode', e.target.value)}
                                  style={{
                                    width: "100%",
                                    padding: "6px 8px",
                                    backgroundColor: "rgba(30, 41, 59, 0.8)",
                                    border: "1px solid #475569",
                                    borderRadius: "4px",
                                    color: "#f1f5f9",
                                    fontSize: "0.8rem"
                                  }}
                                >
                                  <option value="HOUR">Saat</option>
                                  <option value="MINUTE">Dakika</option>
                                  <option value="DAY">Gün</option>
                                  <option value="PIECE">Adet</option>
                                </select>
                              ) : (
                                operation.RunTimeCode || 'HOUR'
                              )}
                            </div>
                            <div style={{ textAlign: "center" }}>
                              {isEditing && (
                                <button
                                  onClick={() => removeOperationLine(index)}
                                  disabled={editingOperations.length <= 1}
                                  style={{
                                    background: editingOperations.length <= 1 ? "#64748b" : "#ef4444",
                                    color: "white",
                                    border: "none",
                                    borderRadius: "4px",
                                    width: "28px",
                                    height: "28px",
                                    cursor: editingOperations.length <= 1 ? "not-allowed" : "pointer",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    opacity: editingOperations.length <= 1 ? 0.5 : 1
                                  }}
                                  title="Operasyonu Sil"
                                >
                                  <i className="fas fa-trash" style={{ fontSize: "0.7rem" }}></i>
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                        
                        {/* Butonlar */}
                        <div style={{
                          display: "grid",
                          gridTemplateColumns: "80px 2fr 120px 100px 100px 120px 120px 100px 80px",
                          padding: "12px 15px",
                          backgroundColor: "#1e293b",
                          borderTop: "2px solid #475569",
                          fontSize: "0.9rem",
                          fontWeight: "600",
                          color: "#f1f5f9"
                        }}>
                          <div style={{ gridColumn: "1 / 8", display: "flex", alignItems: "center" }}>
                            {isEditing && (
                              <button
                                onClick={addNewOperationLine}
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
                                <span>Yeni Operasyon Ekle</span>
                              </button>
                            )}
                          </div>
                          <div style={{ gridColumn: "8 / 10", textAlign: "right", paddingRight: "10px" }}>
                            TOPLAM OPERASYON: {editingOperations.length}
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
                        <p>Bu routing'e ait operasyon bulunamadı.</p>
                        {isEditing && (
                          <button
                            onClick={addNewOperationLine}
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
                            <span>Yeni Operasyon Ekle</span>
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Routing seçilmediyse mesaj */}
          {!selectedHead && !isCreatingNewHead && (
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
              minHeight: "300px",
              marginTop: "15px"
            }}>
              <i className="fas fa-route" style={{ fontSize: "2.5rem", marginBottom: "15px", color: "#64748b" }}></i>
              <p style={{ marginBottom: "20px", fontSize: "0.95rem" }}>
                {routingHeads.length === 0 ? 
                  "Henüz routing bulunmuyor. Yeni bir routing oluşturun." : 
                  "Düzenlemek için tablodan bir routing seçin."}
              </p>
              <button
                onClick={() => setIsCreatingNewHead(true)}
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
                <span>Yeni Routing Oluştur</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}