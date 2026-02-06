import { useState, useEffect, useCallback } from "react";
import SearchList from "./../../components/SearchList";
import { ChevronRightIcon } from "@heroicons/react/24/outline";

// C# API'den gelen veri yapısı (camelCase)
interface ProdStructureHeadApiResponse {
  contract: string;
  partNo: string;
  engChgLevel: string;
  bomTypeDb: string;
  noteText?: string | null;
  effPhaseInDate?: string | null;
  effPhaseOutDate?: string | null;
  createDate: string;
  rowstate?: string | null;
  createdBy: string;
  rowversion: number;
  rowkey: string;
}

// Frontend'de kullanacağımız interface (PascalCase)
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

// C# API'den gelen Ürün Ağacı satırı yapısı
interface ProdStructureApiResponse {
  contract: string;
  partNo: string;
  engChgLevel: string;
  bomTypeDb: string;
  alternativeNo: string;
  lineItemNo: number;
  lineSequence: number;
  operationNo: number;
  noteText?: string | null;
  source?: string | null;
  createDate: string;
  lastActivityDate?: string | null;
  componentPart?: string | null;
  rowstate?: string | null;
  createdBy: string;
  rowversion: number;
  rowkey: string;
}

// Frontend'de kullanacağımız Ürün Ağacı satırı interface
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

// Routing Operation Interface - Controller'a göre
interface RoutingOperationTab {
  company: string;
  contract: string;
  partNo: string;
  routingRevision: string;
  bomType: string;
  operationNo: number;
  operationDescription?: string;
  workCenterNo?: string;
  machRunFactor?: number;
  machSetupTime?: number;
  laborClassNo?: string;
  setupLaborClassNo?: string;
  crewSize?: number;
  setupCrewSize?: number;
  runTimeCode?: string;
  noteText?: string;
  rowversion: Date;
  rowkey: string;
}

// Düzenleme için Prod Structure Head DTO
interface ProdStructureHeadUpdateDto {
  noteText?: string | null;
  effPhaseInDate?: string | null;
  effPhaseOutDate?: string | null;
  rowstate?: string | null;
  rowversion: number;
}

// Yeni Ürün Ağacı Başlığı oluşturma için DTO
interface ProdStructureHeadCreateDto {
  contract: string;
  partNo: string;
  engChgLevel: string;
  bomTypeDb: string;
  noteText?: string;
  effPhaseInDate?: string;
  effPhaseOutDate?: string;
  createdBy: string;
  rowstate: string;
  rowversion: number;
  rowkey: string;
}

// Yeni Ürün Ağacı satırı oluşturma için DTO
interface ProdStructureCreateDto {
  lineItemNo: number;
  lineSequence: number;
  operationNo: number;
  noteText?: string | null;
  source?: string | null;
  lastActivityDate?: string | null;
  componentPart?: string | null;
  rowstate?: string | null;
  routingOperationNo?: number;
}

// Ürün Ağacı satırı güncelleme için DTO
interface ProdStructureUpdateDto {
  noteText?: string | null;
  source?: string | null;
  lastActivityDate?: string | null;
  componentPart?: string | null;
  rowstate?: string | null;
  rowversion: number;
  routingOperationNo?: number | null;
}


// CompanySite Interface
interface CompanySite {
  company: string;
  contract: string;
  siteName?: string;
  address?: string;
  city?: string;
  country?: string;
  phone?: string;
  email?: string;
  rowversion: Date;
  rowkey: string;
}

const tabs = ["Ürün Ağacı Satırları", "Detay Bilgiler"];

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

export default function ProdStructurePage() {
  const [activeTab, setActiveTab] = useState("Ürün Ağacı Satırları");
  const [selectedHead, setSelectedHead] = useState<ProdStructureHead | null>(null);
  const [editingHead, setEditingHead] = useState<ProdStructureHead | null>(null);
  const [editingStructures, setEditingStructures] = useState<ProdStructure[]>([]);
  const [isSearchListVisible, setIsSearchListVisible] = useState(false);
  const [isCreatingNewHead, setIsCreatingNewHead] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  

  
  // Inventory Part Search States
  const [showInventorySearch, setShowInventorySearch] = useState(false);
  const [inventoryParts, setInventoryParts] = useState<InventoryPart[]>([]);
  const [inventoryLoading, setInventoryLoading] = useState(false);
  const [searchForHead, setSearchForHead] = useState(false);
  const [searchForLineIndex, setSearchForLineIndex] = useState<number>(-1);

  // Routing Operation Search States
  const [showRoutingSearch, setShowRoutingSearch] = useState(false);
  const [routingOperations, setRoutingOperations] = useState<RoutingOperationTab[]>([]);
  const [routingLoading, setRoutingLoading] = useState(false);
  const [searchForRoutingIndex, setSearchForRoutingIndex] = useState<number>(-1);

  // Yeni ürün ağacı başlığı formu state'leri
  const [newHeadData, setNewHeadData] = useState<ProdStructureHeadCreateDto>({
    contract: "01",
    partNo: "",
    engChgLevel: "A",
    bomTypeDb: "STANDARD",
    createdBy: "admin",
    rowstate: "ACTIVE",
    rowversion: 1,
    rowkey: `new-prod-head-${Date.now()}`
  });

  const [newStructures, setNewStructures] = useState<ProdStructureCreateDto[]>([
    {
      lineItemNo: 1,
      lineSequence: 10,
      operationNo: 10,
      componentPart: "",
      rowstate: "ACTIVE"
    }
  ]);

  // Veritabanından gelen veriler
  const [prodStructureHeads, setProdStructureHeads] = useState<ProdStructureHead[]>([]);
  const [structureLines, setStructureLines] = useState<ProdStructure[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // PostgreSQL'den Ürün Ağacı başlık verilerini çek
  useEffect(() => {
    fetchProdStructureHeads();
  }, []);

  useEffect(() => {
    if (selectedHead && !isCreatingNewHead) {
      fetchStructureLines(
        selectedHead.Contract, 
        selectedHead.PartNo, 
        selectedHead.EngChgLevel, 
        selectedHead.BomTypeDb
      );
      setEditingHead(selectedHead);
    } else {
      setStructureLines([]);
      setEditingHead(null);
      setEditingStructures([]);
    }
  }, [selectedHead, isCreatingNewHead]);

  const fetchProdStructureHeads = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/prodstructurehead');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const apiData: ProdStructureHeadApiResponse[] = await response.json();
      const formattedHeads: ProdStructureHead[] = apiData.map((apiHead, index) => ({
        id: index + 1,
        Contract: apiHead.contract || "",
        PartNo: apiHead.partNo || "",
        EngChgLevel: apiHead.engChgLevel || "A",
        BomTypeDb: apiHead.bomTypeDb || "STANDARD",
        NoteText: apiHead.noteText || undefined,
        EffPhaseInDate: apiHead.effPhaseInDate || undefined,
        EffPhaseOutDate: apiHead.effPhaseOutDate || undefined,
        CreateDate: apiHead.createDate || new Date().toISOString().split('T')[0],
        Rowstate: apiHead.rowstate || "ACTIVE",
        CreatedBy: apiHead.createdBy || "admin",
        Rowversion: apiHead.rowversion || 1,
        Rowkey: apiHead.rowkey || `head-${Date.now()}-${index}`
      }));
      
      setProdStructureHeads(formattedHeads);
      setError(null);
      
    } catch (err) {
      console.error("Ürün Ağacı başlık verileri çekilirken hata:", err);
      setError(err instanceof Error ? err.message : "Bilinmeyen bir hata oluştu");
      setProdStructureHeads([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchStructureLines = async (contract: string, partNo: string, engChgLevel: string, bomTypeDb: string) => {
    try {
      const response = await fetch(
        `/api/prodstructure/head/${contract}/${partNo}/${engChgLevel}/${bomTypeDb}/000`
      );
      
      if (response.ok) {
        const apiData: ProdStructureApiResponse[] = await response.json();
        
        const formattedLines: ProdStructure[] = apiData.map((apiLine, index) => ({
          id: index + 1,
          Contract: apiLine.contract || "",
          PartNo: apiLine.partNo || "",
          EngChgLevel:  "A",
          BomTypeDb:  "STANDARD",
          AlternativeNo: "000",
          LineItemNo: apiLine.lineItemNo || 0,
          LineSequence: apiLine.lineSequence || 0,
          OperationNo: apiLine.operationNo || 0,
          NoteText: apiLine.noteText || undefined,
          Source: apiLine.source || undefined,
          CreateDate: apiLine.createDate || new Date().toISOString().split('T')[0],
          LastActivityDate: apiLine.lastActivityDate || undefined,
          ComponentPart: apiLine.componentPart || undefined,
          Rowstate: apiLine.rowstate || "ACTIVE",
          CreatedBy: apiLine.createdBy || "admin",
          Rowversion: apiLine.rowversion || 1,
          Rowkey: apiLine.rowkey || `line-${Date.now()}-${index}`
        }));
        
        setStructureLines(formattedLines);
        setEditingStructures([...formattedLines]);
      } else {
        setStructureLines([]);
        setEditingStructures([]);
      }
    } catch (err) {
      console.error("Ürün Ağacı satırları çekilirken hata:", err);
      setStructureLines([]);
      setEditingStructures([]);
    }
  };

  // Inventory Part Search Functions
  const searchInventoryParts = async (searchTerm: string = "") => {
    try {
      setInventoryLoading(true);
      let url = "/api/inventorypart/search";
      
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

  // Routing Operation Search Functions
const searchRoutingOperations = async () => {
  if (!selectedHead) {
    console.error("Routing search için head seçili değil");
    return;
  }

  try {
    setRoutingLoading(true);
    
    // Contract'a göre company bilgisini al
    const company = await getCompanyByContract(selectedHead.Contract);
    console.log(`Routing search için company: ${company}, contract: ${selectedHead.Contract}`);
    
    const url = `/api/RoutingOperationTab/ByHead/${company}/${selectedHead.Contract}/${selectedHead.PartNo}/${selectedHead.EngChgLevel}/${selectedHead.BomTypeDb}`;
    
    console.log("Routing operation search URL:", url);
    
    const response = await fetch(url);
    
    if (response.ok) {
      const data = await response.json();
      console.log("Routing operations received:", data);
      setRoutingOperations(data);
    } else if (response.status === 404) {
      console.log("Routing operations not found, returning empty list");
      setRoutingOperations([]);
    } else {
      const errorText = await response.text();
      console.error("Routing operation search error:", errorText);
      setRoutingOperations([]);
    }
  } catch (err) {
    console.error("Routing operation search error:", err);
    setRoutingOperations([]);
  } finally {
    setRoutingLoading(false);
  }
};

// Company bilgisi alma fonksiyonu
const getCompanyByContract = async (contract: string): Promise<string> => {
  try {
    // Önce tüm company'leri getir
    const response = await fetch('/api/CompanySites');
    
    if (response.ok) {
      const companySites: CompanySite[] = await response.json();
      
      // Contract'a göre company bul
      const foundCompany = companySites.find(cs => cs.contract === contract);
      
      if (foundCompany) {
        console.log(`Contract ${contract} için company bulundu: ${foundCompany.company}`);
        return foundCompany.company;
      } else {
        console.warn(`Contract ${contract} için company bulunamadı, varsayılan olarak "01" kullanılıyor.`);
        return "01"; // Varsayılan değer
      }
    } else {
      console.warn("CompanySites API hatası, varsayılan company kullanılıyor.");
      return "01"; // Varsayılan değer
    }
  } catch (err) {
    console.error("Company bilgisi alınırken hata:", err);
    return "01"; // Varsayılan değer
  }
};

  const handleInventoryPartSelect = (part: InventoryPart) => {
    console.log("Selected inventory part:", part);
    
    if (searchForHead && editingHead) {
      setEditingHead({
        ...editingHead,
        PartNo: part.partNo
      });
    } else if (searchForLineIndex >= 0 && editingStructures[searchForLineIndex]) {
      const updatedStructures = [...editingStructures];
      updatedStructures[searchForLineIndex] = {
        ...updatedStructures[searchForLineIndex],
        ComponentPart: part.partNo
      };
      setEditingStructures(updatedStructures);
    } else if (searchForHead && isCreatingNewHead) {
      setNewHeadData({
        ...newHeadData,
        partNo: part.partNo
      });
    } else if (!searchForHead && isCreatingNewHead && searchForLineIndex >= 0) {
      const updatedNewStructures = [...newStructures];
      updatedNewStructures[searchForLineIndex] = {
        ...updatedNewStructures[searchForLineIndex],
        componentPart: part.partNo
      };
      setNewStructures(updatedNewStructures);
    }
    
    setShowInventorySearch(false);
  };

  const handleRoutingSelect = (operation: RoutingOperationTab) => {
    console.log("Selected routing operation:", operation);
    
    if (searchForRoutingIndex >= 0 && editingStructures[searchForRoutingIndex]) {
      const updatedStructures = [...editingStructures];
      updatedStructures[searchForRoutingIndex] = {
        ...updatedStructures[searchForRoutingIndex],
        OperationNo: operation.operationNo,
        RoutingOperationNo: operation.operationNo
      };
      setEditingStructures(updatedStructures);
    } else if (isCreatingNewHead && searchForRoutingIndex >= 0) {
      const updatedNewStructures = [...newStructures];
      updatedNewStructures[searchForRoutingIndex] = {
        ...updatedNewStructures[searchForRoutingIndex],
        operationNo: operation.operationNo,
        routingOperationNo: operation.operationNo
      };
      setNewStructures(updatedNewStructures);
    }
    
    setShowRoutingSearch(false);
  };

  const openInventorySearch = (forHead: boolean, lineIndex?: number) => {
    setSearchForHead(forHead);
    setSearchForLineIndex(lineIndex ?? -1);
    setShowInventorySearch(true);
    searchInventoryParts("");
  };

  const openRoutingSearch = (lineIndex: number) => {
    if (!selectedHead) {
      alert("Önce bir ürün ağacı seçmelisiniz.");
      return;
    }
    
    setSearchForRoutingIndex(lineIndex);
    setShowRoutingSearch(true);
    searchRoutingOperations();
  };

  // SearchList için item'leri formatla
  const searchListItems = prodStructureHeads.map(head => ({
    id: head.id,
    code: head.PartNo,
    name: `${head.EngChgLevel} - ${head.BomTypeDb}`,
    description: `Kontrat: ${head.Contract} | Parça: ${head.PartNo} | Revizyon: ${head.EngChgLevel} | Tip: ${head.BomTypeDb} | Durum: ${head.Rowstate || 'ACTIVE'}`,
    originalData: head
  }));

  const handleHeadSelect = (item: any) => {
    if (item.originalData) {
      const { Contract, PartNo, EngChgLevel, BomTypeDb } = item.originalData;
      
      const selected = prodStructureHeads.find(h => 
        h.Contract === Contract && 
        h.PartNo === PartNo && 
        h.EngChgLevel === EngChgLevel &&
        h.BomTypeDb === BomTypeDb
      );
      
      if (selected) {
        console.log("Seçilen Ürün Ağacı Başlığı:", selected);
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
    setEditingStructures([...structureLines]);
  }, [selectedHead, structureLines]);

  const handleEditingHeadChange = useCallback((field: keyof ProdStructureHead, value: any) => {
    if (!editingHead) return;
    
    setEditingHead({
      ...editingHead,
      [field]: value
    });
  }, [editingHead]);

  const handleEditingStructureChange = useCallback((index: number, field: keyof ProdStructure, value: any) => {
    if (!editingStructures[index]) return;
    
    const updatedStructures = [...editingStructures];
    
    if (field === 'LineItemNo' || field === 'LineSequence' || field === 'OperationNo') {
      updatedStructures[index] = {
        ...updatedStructures[index],
        [field]: parseInt(value) || 0
      };
    } else {
      updatedStructures[index] = {
        ...updatedStructures[index],
        [field]: value
      };
    }
    
    setEditingStructures(updatedStructures);
  }, [editingStructures]);

  const addNewStructureLine = useCallback(() => {
    if (!selectedHead || !editingStructures) return;
    
    const newLineItemNo = editingStructures.length > 0 
      ? Math.max(...editingStructures.map(l => l.LineItemNo)) + 1 
      : 1;
    
    const newLine: ProdStructure = {
      id: editingStructures.length + 1,
      Contract: selectedHead.Contract,
      PartNo: selectedHead.PartNo,
      EngChgLevel: selectedHead.EngChgLevel,
      BomTypeDb: selectedHead.BomTypeDb,
      AlternativeNo: "000",
      LineItemNo: newLineItemNo,
      LineSequence: 10,
      OperationNo: 10,
      CreatedBy: "admin",
      Rowversion: 1,
      Rowkey: `new-line-${Date.now()}`,
      CreateDate: new Date().toISOString().split('T')[0]
    };
    
    setEditingStructures([...editingStructures, newLine]);
  }, [selectedHead, editingStructures]);

  const removeStructureLine = useCallback((index: number) => {
    if (editingStructures.length <= 1) return;
    
    const updatedStructures = editingStructures.filter((_, i) => i !== index);
    setEditingStructures(updatedStructures);
  }, [editingStructures]);

  const handleSaveHead = useCallback(async () => {
    if (!editingHead || !selectedHead) return;

    try {
      setIsSaving(true);
      
      console.log("=== ÜRÜN AĞACI KAYIT BAŞLANGICI ===");
      console.log("Seçili başlık:", selectedHead);
      console.log("Düzenlenen satırlar:", editingStructures);

      // 1. Ana başlığı güncelle
      const updateDto: ProdStructureHeadUpdateDto = {
        noteText: editingHead.NoteText || null,
        effPhaseInDate: editingHead.EffPhaseInDate || null,
        effPhaseOutDate: editingHead.EffPhaseOutDate || null,
        rowstate: editingHead.Rowstate || "ACTIVE",
        rowversion: selectedHead.Rowversion
      };

      const response = await fetch(
        `/api/prodstructurehead/${selectedHead.Contract}/${selectedHead.PartNo}/${selectedHead.EngChgLevel}/${selectedHead.BomTypeDb}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updateDto)
        }
      );

      if (response.ok) {
        const updatedHeadApi: ProdStructureHeadApiResponse = await response.json();
        console.log("Ana başlık güncellendi:", updatedHeadApi);
        
        const updatedHead: ProdStructureHead = {
          id: selectedHead.id,
          Contract: updatedHeadApi.contract,
          PartNo: updatedHeadApi.partNo,
          EngChgLevel: updatedHeadApi.engChgLevel,
          BomTypeDb: updatedHeadApi.bomTypeDb,
          NoteText: updatedHeadApi.noteText || undefined,
          EffPhaseInDate: updatedHeadApi.effPhaseInDate || undefined,
          EffPhaseOutDate: updatedHeadApi.effPhaseOutDate || undefined,
          CreateDate: updatedHeadApi.createDate,
          Rowstate: updatedHeadApi.rowstate || "ACTIVE",
          CreatedBy: updatedHeadApi.createdBy,
          Rowversion: updatedHeadApi.rowversion,
          Rowkey: updatedHeadApi.rowkey
        };

        // 2. Ürün ağacı satırlarını işle
        const lineResults = [];
        const lineErrors = [];

        for (const line of editingStructures) {
          try {
            console.log(`\n=== Satır ${line.LineItemNo} işleniyor ===`);
            console.log("Satır verisi:", line);
            
            const isNewLine = line.Rowkey && line.Rowkey.includes('new-line');
            
            if (isNewLine) {
              console.log(`YENİ SATIR oluşturuluyor: ${line.LineItemNo}`);
              
              const lineData: ProdStructureCreateDto = {
                lineItemNo: line.LineItemNo,
                lineSequence: line.LineSequence,
                operationNo: line.OperationNo,
                componentPart: line.ComponentPart || "",
                noteText: line.NoteText || null,
                source: line.Source || null,
                lastActivityDate: line.LastActivityDate || null,
                rowstate: line.Rowstate || "ACTIVE",
                routingOperationNo: line.RoutingOperationNo
              };

              const createResponse = await fetch(
                `/api/prodstructure/head/${updatedHead.Contract}/${updatedHead.PartNo}/${updatedHead.EngChgLevel}/${updatedHead.BomTypeDb}/000`,
                {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(lineData)
                }
              );

              if (createResponse.ok) {
                const createdLine = await createResponse.json();
                console.log(`Satır ${line.LineItemNo} başarıyla OLUŞTURULDU:`, createdLine);
                lineResults.push(createdLine);
              } else if (createResponse.status === 409) {
                console.log(`Satır ${line.LineItemNo} zaten var, güncellenecek`);
              } else {
                const errorText = await createResponse.text();
                console.error(`Satır ${line.LineItemNo} oluşturma hatası:`, errorText);
                lineErrors.push(`Satır ${line.LineItemNo}: ${errorText}`);
              }
            }
            
            // Mevcut satırı güncelle
            console.log(`MEVCUT SATIR güncelleniyor: ${line.LineItemNo}`);
            
            const alternativeNo = "000";
            
            const lineUpdateDto: ProdStructureUpdateDto = {
              noteText: line.NoteText || null,
              source: line.Source || null,
              lastActivityDate: line.LastActivityDate || null,
              componentPart: line.ComponentPart || null,
              rowstate: line.Rowstate || "ACTIVE",
              rowversion: line.Rowversion || 1,
              routingOperationNo: line.RoutingOperationNo || null
            };

            const putUrl = `/api/prodstructure/${updatedHead.Contract}/${updatedHead.PartNo}/${updatedHead.EngChgLevel}/${updatedHead.BomTypeDb}/${alternativeNo}/${line.LineItemNo}/${line.LineSequence}/${line.OperationNo}`;
            console.log("PUT URL:", putUrl);

            const updateResponse = await fetch(
              putUrl,
              {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(lineUpdateDto)
              }
            );

            if (updateResponse.ok) {
              const updatedLine = await updateResponse.json();
              console.log(`Satır ${line.LineItemNo} başarıyla GÜNCELLENDİ:`, updatedLine);
              lineResults.push(updatedLine);
            } else {
              const errorText = await updateResponse.text();
              console.error(`Satır ${line.LineItemNo} güncelleme hatası:`, errorText);
              lineErrors.push(`Satır ${line.LineItemNo}: ${errorText}`);
            }
          } catch (err) {
            console.error(`Satır ${line.LineItemNo} işlem hatası:`, err);
            lineErrors.push(`Satır ${line.LineItemNo}: ${err instanceof Error ? err.message : "Bilinmeyen hata"}`);
          }
        }

        if (lineErrors.length > 0) {
          alert(`Ürün Ağacı başlığı güncellendi ancak bazı satırlar işlenemedi:\n${lineErrors.join('\n')}`);
        }

        await fetchProdStructureHeads();
        
        setSelectedHead(updatedHead);
        setEditingHead(updatedHead);
        
        await fetchStructureLines(updatedHead.Contract, updatedHead.PartNo, updatedHead.EngChgLevel, updatedHead.BomTypeDb);
        
        setIsEditing(false);
        alert("Ürün Ağacı ve satırlar başarıyla güncellendi!");
        
      } else {
        const errorText = await response.text();
        console.error("Ana başlık güncelleme hatası:", errorText);
        throw new Error(`Ürün Ağacı başlığı güncellenemedi: ${errorText}`);
      }
    } catch (err) {
      console.error("Ürün Ağacı güncellenirken hata:", err);
      alert(`Hata: ${err instanceof Error ? err.message : "Bilinmeyen hata"}`);
    } finally {
      setIsSaving(false);
    }
  }, [editingHead, selectedHead, editingStructures, fetchProdStructureHeads]);

  const handleDeleteHead = useCallback(async () => {
    if (!selectedHead) return;
    
    if (!window.confirm(`${selectedHead.PartNo} numaralı Ürün Ağacı başlığını silmek istediğinize emin misiniz?`)) {
      return;
    }

    try {
      const response = await fetch(
        `/api/prodstructurehead/${selectedHead.Contract}/${selectedHead.PartNo}/${selectedHead.EngChgLevel}/${selectedHead.BomTypeDb}`,
        {
          method: 'DELETE',
        }
      );

      if (response.ok) {
        await fetchProdStructureHeads();
        
        setSelectedHead(null);
        setEditingHead(null);
        setEditingStructures([]);
        setIsEditing(false);
        
        alert("Ürün Ağacı başlığı başarıyla silindi!");
      } else {
        const errorText = await response.text();
        throw new Error(`Silme başarısız: ${errorText}`);
      }
    } catch (err) {
      console.error("Ürün Ağacı başlığı silinirken hata:", err);
      alert(`Hata: ${err instanceof Error ? err.message : "Bilinmeyen hata"}`);
    }
  }, [selectedHead, fetchProdStructureHeads]);

  // Yeni ürün ağacı formu işlemleri
  const handleNewHeadDataChange = useCallback((field: keyof ProdStructureHeadCreateDto, value: any) => {
    const updatedData = {
      ...newHeadData,
      [field]: value
    };
    
    setNewHeadData(updatedData);
  }, [newHeadData]);

  const handleNewStructureChange = useCallback((index: number, field: keyof ProdStructureCreateDto, value: any) => {
    const updatedStructures = [...newStructures];
    updatedStructures[index] = {
      ...updatedStructures[index],
      [field]: field === 'lineItemNo' || field === 'lineSequence' || field === 'operationNo'
        ? parseInt(value) || 0
        : value
    };
    setNewStructures(updatedStructures);
  }, [newStructures]);

  const addNewStructureInNewHead = useCallback(() => {
    const newLine: ProdStructureCreateDto = {
      lineItemNo: newStructures.length > 0 
        ? Math.max(...newStructures.map(l => l.lineItemNo)) + 1 
        : 1,
      lineSequence: 10,
      operationNo: 10,
      componentPart: "",
      rowstate: "ACTIVE"
    };
    setNewStructures([...newStructures, newLine]);
  }, [newStructures]);

  const removeNewStructure = useCallback((index: number) => {
    if (newStructures.length > 1) {
      const updatedStructures = newStructures.filter((_, i) => i !== index);
      setNewStructures(updatedStructures);
    }
  }, [newStructures]);

  const handleCreateNewHead = useCallback(async () => {
    if (!newHeadData.contract || !newHeadData.partNo || !newHeadData.engChgLevel || !newHeadData.bomTypeDb) {
      alert("Lütfen zorunlu alanları doldurun (Kontrat, Parça No, Revizyon Seviyesi, BOM Tipi)");
      return;
    }

    setIsSaving(true);

    try {
      console.log("Yeni Ürün Ağacı başlığı kaydediliyor:", newHeadData);

      const headResponse = await fetch('/api/prodstructurehead', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newHeadData)
      });

      if (!headResponse.ok) {
        const errorText = await headResponse.text();
        console.error("Ürün Ağacı başlığı kayıt hatası:", errorText);
        throw new Error(`Ürün Ağacı başlığı kaydedilemedi: ${errorText}`);
      }

      const savedHead: ProdStructureHeadApiResponse = await headResponse.json();
      console.log("Ürün Ağacı başlığı başarıyla kaydedildi:", savedHead);

      const savedLines: any[] = [];
      let lineErrors: string[] = [];

      for (const [index, line] of newStructures.entries()) {
        try {
          if (!line.componentPart) {
            console.warn(`Satır ${index + 1} için bileşen parçası girilmemiş, atlanıyor...`);
            continue;
          }

          const lineData = {
            ...line
          };

          console.log(`Satır ${index + 1} kaydediliyor:`, lineData);

          const lineResponse = await fetch(
            `/api/prodstructure/head/${savedHead.contract}/${savedHead.partNo}/${savedHead.engChgLevel}/${savedHead.bomTypeDb}/000`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(lineData)
            }
          );

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

      if (lineErrors.length > 0) {
        console.warn("Bazı satırlar kaydedilemedi:", lineErrors);
        alert(`Ürün Ağacı başlığı kaydedildi ancak bazı satırlar kaydedilemedi:\n${lineErrors.join('\n')}`);
      } else if (savedLines.length === 0) {
        console.warn("Hiçbir satır kaydedilmedi");
        alert("Ürün Ağacı başlığı kaydedildi ancak hiçbir satır eklenmedi.");
      } else {
        console.log("Tüm satırlar başarıyla kaydedildi:", savedLines.length);
      }

      await fetchProdStructureHeads();
      
      const newHead: ProdStructureHead = {
        id: prodStructureHeads.length + 1,
        Contract: savedHead.contract,
        PartNo: savedHead.partNo,
        EngChgLevel: savedHead.engChgLevel,
        BomTypeDb: savedHead.bomTypeDb,
        NoteText: savedHead.noteText || undefined,
        EffPhaseInDate: savedHead.effPhaseInDate || undefined,
        EffPhaseOutDate: savedHead.effPhaseOutDate || undefined,
        CreateDate: savedHead.createDate,
        Rowstate: savedHead.rowstate || "ACTIVE",
        CreatedBy: savedHead.createdBy || "admin",
        Rowversion: savedHead.rowversion || 1,
        Rowkey: savedHead.rowkey || `new-head-${Date.now()}`
      };

      setSelectedHead(newHead);
      setEditingHead(newHead);
      setIsCreatingNewHead(false);
      
      resetForm();
      
      alert(`Ürün Ağacı başlığı başarıyla oluşturuldu: ${savedHead.partNo}\nKaydedilen satır sayısı: ${savedLines.length}`);

    } catch (err) {
      console.error("Ürün Ağacı başlığı oluşturma hatası:", err);
      alert(`Hata: ${err instanceof Error ? err.message : "Bilinmeyen hata"}`);
    } finally {
      setIsSaving(false);
    }
  }, [newHeadData, newStructures, prodStructureHeads, fetchProdStructureHeads]);

  const resetForm = useCallback(() => {
    setNewHeadData({
      contract: "01",
      partNo: "",
      engChgLevel: "A",
      bomTypeDb: "STANDARD",
      createdBy: "admin",
      rowstate: "ACTIVE",
      rowversion: 1,
      rowkey: `new-prod-head-${Date.now()}`
    });
    
    setNewStructures([
      {
        lineItemNo: 1,
        lineSequence: 10,
        operationNo: 10,
        componentPart: "",
        rowstate: "ACTIVE"
      }
    ]);
  }, []);

  const handleCancelNewHead = useCallback(() => {
    setIsCreatingNewHead(false);
    resetForm();
  }, [resetForm]);

  // YENİ ÜRÜN AĞACI OLUŞTURMA EKRANI
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
            title="Ürün Ağacı Arama"
            items={searchListItems}
            onSelect={handleHeadSelect}
            onToggle={handleToggleSearchList}
            searchFields={["code", "name", "description"]}
            displayFields={["code", "name"]}
            icon="fas fa-sitemap"
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

        {/* Routing Operation Search Modal */}
        {showRoutingSearch && (
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
              maxWidth: "1200px",
              maxHeight: "80vh",
              overflow: "hidden",
              border: "2px solid #f59e0b"
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
                  <i className="fas fa-cogs" style={{ color: "#f59e0b" }}></i>
                  Routing Operasyon Seçimi
                </h2>
                <button
                  onClick={() => setShowRoutingSearch(false)}
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
    backgroundColor: "rgba(245, 158, 11, 0.1)",
    padding: "10px",
    borderRadius: "6px",
    borderLeft: "3px solid #f59e0b",
    fontSize: "0.85rem",
    color: "#f1f5f9"
  }}>
    <div style={{ display: "flex", gap: "15px", flexWrap: "wrap" }}>
      <span><strong>Şirket:</strong> {selectedHead ? "Yükleniyor..." : "01"}</span>
      <span><strong>Parça:</strong> {selectedHead?.PartNo || newHeadData?.partNo}</span>
      <span><strong>Kontrat:</strong> {selectedHead?.Contract || newHeadData?.contract}</span>
      <span><strong>Revizyon:</strong> {selectedHead?.EngChgLevel || newHeadData?.engChgLevel}</span>
      <span><strong>BOM Tipi:</strong> {selectedHead?.BomTypeDb || newHeadData?.bomTypeDb}</span>
    </div>
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
                        Operasyon No
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
                        İş Merkezi
                      </th>
                      <th style={{ 
                        padding: "12px 15px", 
                        textAlign: "left", 
                        color: "#f1f5f9", 
                        fontSize: "0.85rem",
                        borderBottom: "1px solid #475569"
                      }}>
                        Kurulum Süresi
                      </th>
                      <th style={{ 
                        padding: "12px 15px", 
                        textAlign: "left", 
                        color: "#f1f5f9", 
                        fontSize: "0.85rem",
                        borderBottom: "1px solid #475569"
                      }}>
                        Çalıştırma Faktörü
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
                    {routingLoading ? (
                      <tr>
                        <td colSpan={6} style={{ 
                          padding: "40px", 
                          textAlign: "center", 
                          color: "#94a3b8" 
                        }}>
                          <i className="fas fa-spinner fa-spin" style={{ marginRight: "10px" }}></i>
                          Routing operasyonları yükleniyor...
                        </td>
                      </tr>
                    ) : routingOperations.length === 0 ? (
                      <tr>
                        <td colSpan={6} style={{ 
                          padding: "40px", 
                          textAlign: "center", 
                          color: "#94a3b8" 
                        }}>
                          <i className="fas fa-cogs" style={{ marginRight: "10px" }}></i>
                          Bu parça için routing operasyonu bulunamadı
                        </td>
                      </tr>
                    ) : (
                      routingOperations.map((operation) => (
                        <tr key={`${operation.operationNo}`}
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
                            {operation.operationNo}
                          </td>
                          <td style={{ 
                            padding: "12px 15px", 
                            color: "#94a3b8",
                            fontSize: "0.85rem"
                          }}>
                            {operation.operationDescription || '-'}
                          </td>
                          <td style={{ 
                            padding: "12px 15px", 
                            color: "#94a3b8",
                            fontSize: "0.85rem"
                          }}>
                            {operation.workCenterNo || '-'}
                          </td>
                          <td style={{ 
                            padding: "12px 15px", 
                            color: "#94a3b8",
                            fontSize: "0.85rem"
                          }}>
                            {operation.machSetupTime || '-'}
                          </td>
                          <td style={{ 
                            padding: "12px 15px", 
                            color: "#94a3b8",
                            fontSize: "0.85rem"
                          }}>
                            {operation.machRunFactor || '-'}
                          </td>
                          <td style={{ 
                            padding: "12px 15px",
                            textAlign: "center"
                          }}>
                            <button
                              onClick={() => handleRoutingSelect(operation)}
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
                  onClick={() => setShowRoutingSearch(false)}
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

        {/* ANA EKRAN - YENİ ÜRÜN AĞACI OLUŞTURMA */}
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
                <h2 style={{ margin: 0, color: "#f1f5f9", fontSize: "1.3rem" }}>Yeni Ürün Ağacı</h2>
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
                <span>Önce ürün ağacı başlığı kaydedilecek, ardından ürün ağacı satırları tek tek eklenecektir.</span>
              </div>
            </div>
          </div>

          {/* Ürün Ağacı Başlık Bilgileri */}
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
              Ürün Ağacı Başlık Bilgileri (Önce Kaydedilecek)
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
                  Kontrat <span style={{ color: "#ef4444" }}>*</span>
                </label>
                <input
                  type="text"
                  value={newHeadData.contract}
                  onChange={(e) => handleNewHeadDataChange('contract', e.target.value)}
                  style={inputStyle}
                  placeholder="Örn: 01"
                />
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
                  Revizyon Seviyesi <span style={{ color: "#ef4444" }}>*</span>
                </label>
                <input
                  type="text"
                  value={newHeadData.engChgLevel}
                  onChange={(e) => handleNewHeadDataChange('engChgLevel', e.target.value)}
                  style={inputStyle}
                  placeholder="Örn: A"
                />
              </div>
              <div>
                <label style={labelStyle}>
                  BOM Tipi <span style={{ color: "#ef4444" }}>*</span>
                </label>
                <select
                  value={newHeadData.bomTypeDb}
                  onChange={(e) => handleNewHeadDataChange('bomTypeDb', e.target.value)}
                  style={inputStyle}
                >
                  <option value="STANDARD">STANDARD</option>
                  <option value="PLANNING">PLANNING</option>
                  <option value="ALTERNATIVE">ALTERNATIVE</option>
                  <option value="ENGINEERING">ENGINEERING</option>
                </select>
              </div>
              <div>
                <label style={labelStyle}>
                  Geçerli Başlangıç Tarihi
                </label>
                <input
                  type="date"
                  value={newHeadData.effPhaseInDate || ''}
                  onChange={(e) => handleNewHeadDataChange('effPhaseInDate', e.target.value || undefined)}
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>
                  Geçerli Bitiş Tarihi
                </label>
                <input
                  type="date"
                  value={newHeadData.effPhaseOutDate || ''}
                  onChange={(e) => handleNewHeadDataChange('effPhaseOutDate', e.target.value || undefined)}
                  style={inputStyle}
                />
              </div>
            </div>
          </div>

          {/* Ürün Ağacı Satırları */}
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
                Ürün Ağacı Satırları (Başlık Kaydedildikten Sonra Eklenecek)
              </h3>
              <button
                onClick={addNewStructureInNewHead}
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
                gridTemplateColumns: "80px 80px 100px 2fr 80px",
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
                <div>Satır No</div>
                <div>Sıra No</div>
                <div>Operasyon</div>
                <div>Bileşen Parçası</div>
                <div>Sil</div>
              </div>

              {/* Grid Body */}
              <div>
                {newStructures.map((line, index) => (
                  <div
                    key={index}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "80px 80px 100px 2fr 80px",
                      padding: "10px 15px",
                      borderBottom: "1px solid #334155",
                      fontSize: "0.85rem",
                      color: "#f1f5f9",
                      backgroundColor: index % 2 === 0 ? "rgba(30, 41, 59, 0.5)" : "rgba(30, 41, 59, 0.3)",
                      alignItems: "center"
                    }}
                  >
                    <div>
                      <input
                        type="number"
                        value={line.lineItemNo}
                        onChange={(e) => handleNewStructureChange(index, 'lineItemNo', e.target.value)}
                        style={{
                          width: "100%",
                          padding: "6px 8px",
                          backgroundColor: "rgba(30, 41, 59, 0.8)",
                          border: "1px solid #475569",
                          borderRadius: "4px",
                          color: "#f1f5f9",
                          fontSize: "0.85rem"
                        }}
                        min="1"
                      />
                    </div>
                    <div>
                      <input
                        type="number"
                        value={line.lineSequence}
                        onChange={(e) => handleNewStructureChange(index, 'lineSequence', e.target.value)}
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
                      />
                    </div>
                    <div style={{ display: "flex", gap: "4px" }}>
                      <input
                        type="number"
                        value={line.operationNo}
                        onChange={(e) => handleNewStructureChange(index, 'operationNo', e.target.value)}
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
                      />
                      <button
  onClick={async () => {
    if (newHeadData.partNo) {
      setSearchForRoutingIndex(index);
      setShowRoutingSearch(true);
      if (newHeadData.contract && newHeadData.partNo && newHeadData.engChgLevel && newHeadData.bomTypeDb) {
        try {
          // Contract'a göre company bilgisini al
          const company = await getCompanyByContract(newHeadData.contract);
          console.log(`Yeni head için routing search: company=${company}, contract=${newHeadData.contract}, part=${newHeadData.partNo}`);
          
          const url = `/api/RoutingOperationTab/ByHead/${company}/${newHeadData.contract}/${newHeadData.partNo}/${newHeadData.engChgLevel}/${newHeadData.bomTypeDb}`;
          console.log("Routing search URL:", url);
          
          const response = await fetch(url);
          if (response.ok) {
            const data = await response.json();
            console.log("Routing operations found:", data.length);
            setRoutingOperations(data);
          } else if (response.status === 404) {
            console.log("Routing operations not found");
            setRoutingOperations([]);
          } else {
            console.error("Routing search error:", await response.text());
            setRoutingOperations([]);
          }
        } catch (err) {
          console.error("Routing operation search error:", err);
          setRoutingOperations([]);
        }
      }
    } else {
      alert("Önce parça numarasını giriniz.");
    }
  }}
  style={{
    background: "#f59e0b",
    color: "white",
    border: "none",
    borderRadius: "4px",
    padding: "6px 8px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minWidth: "32px"
  }}
  title="Routing Operasyonu Seç"
>
  <i className="fas fa-cogs" style={{ fontSize: "0.7rem" }}></i>
</button>
                    </div>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <input
                        type="text"
                        value={line.componentPart || ''}
                        onChange={(e) => handleNewStructureChange(index, 'componentPart', e.target.value)}
                        style={{
                          flex: 1,
                          padding: "6px 8px",
                          backgroundColor: "rgba(30, 41, 59, 0.8)",
                          border: "1px solid #475569",
                          borderRadius: "4px",
                          color: "#f1f5f9",
                          fontSize: "0.85rem"
                        }}
                        placeholder="Bileşen parçası numarası"
                      />
                      <button
                        onClick={() => openInventorySearch(false, index)}
                        style={{
                          background: "#8b5cf6",
                          color: "white",
                          border: "none",
                          borderRadius: "4px",
                          padding: "6px 8px",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          minWidth: "32px"
                        }}
                        title="Malzeme Ara"
                      >
                        <i className="fas fa-search" style={{ fontSize: "0.7rem" }}></i>
                      </button>
                    </div>
                    <div style={{ textAlign: "center" }}>
                      <button
                        onClick={() => removeNewStructure(index)}
                        disabled={newStructures.length <= 1}
                        style={{
                          background: newStructures.length <= 1 ? "#64748b" : "#ef4444",
                          color: "white",
                          border: "none",
                          borderRadius: "4px",
                          width: "28px",
                          height: "28px",
                          cursor: newStructures.length <= 1 ? "not-allowed" : "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          opacity: newStructures.length <= 1 ? 0.5 : 1
                        }}
                        title="Satırı Sil"
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
              onChange={(e) => handleNewHeadDataChange('noteText', e.target.value || undefined)}
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
              placeholder="Ürün Ağacı ile ilgili ek notlar..."
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
                disabled={isSaving || !newHeadData.partNo || !newHeadData.contract || !newHeadData.engChgLevel || !newHeadData.bomTypeDb}
                style={{
                  background: !newHeadData.partNo || !newHeadData.contract || !newHeadData.engChgLevel || !newHeadData.bomTypeDb
                    ? "#475569" 
                    : isSaving
                    ? "#f59e0b"
                    : "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  padding: "10px 25px",
                  fontSize: "0.9rem",
                  cursor: !newHeadData.partNo || !newHeadData.contract || !newHeadData.engChgLevel || !newHeadData.bomTypeDb || isSaving 
                    ? "not-allowed" 
                    : "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  opacity: !newHeadData.partNo || !newHeadData.contract || !newHeadData.engChgLevel || !newHeadData.bomTypeDb || isSaving ? 0.6 : 1
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
                    <span>Ürün Ağacını Oluştur</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // NORMAL EKRAN - Ürün Ağacı Listeleme ve Düzenleme
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
          title="Ürün Ağacı Arama"
          items={searchListItems}
          onSelect={handleHeadSelect}
          onToggle={handleToggleSearchList}
          searchFields={["code", "name", "description"]}
          displayFields={["code", "name"]}
          icon="fas fa-sitemap"
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

      {/* Routing Operation Search Modal */}
      {showRoutingSearch && selectedHead && (
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
            maxWidth: "1200px",
            maxHeight: "80vh",
            overflow: "hidden",
            border: "2px solid #f59e0b"
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
                <i className="fas fa-cogs" style={{ color: "#f59e0b" }}></i>
                Routing Operasyon Seçimi
              </h2>
              <button
                onClick={() => setShowRoutingSearch(false)}
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
                backgroundColor: "rgba(245, 158, 11, 0.1)",
                padding: "10px",
                borderRadius: "6px",
                borderLeft: "3px solid #f59e0b",
                fontSize: "0.85rem",
                color: "#f1f5f9"
              }}>
                <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
                  <span><strong>Parça:</strong> {selectedHead.PartNo}</span>
                  <span><strong>Kontrat:</strong> {selectedHead.Contract}</span>
                  <span><strong>Revizyon:</strong> {selectedHead.EngChgLevel}</span>
                  <span><strong>BOM Tipi:</strong> {selectedHead.BomTypeDb}</span>
                </div>
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
                      Operasyon No
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
                      İş Merkezi
                    </th>
                    <th style={{ 
                      padding: "12px 15px", 
                      textAlign: "left", 
                      color: "#f1f5f9", 
                      fontSize: "0.85rem",
                      borderBottom: "1px solid #475569"
                    }}>
                      Kurulum Süresi
                    </th>
                    <th style={{ 
                      padding: "12px 15px", 
                      textAlign: "left", 
                      color: "#f1f5f9", 
                      fontSize: "0.85rem",
                      borderBottom: "1px solid #475569"
                    }}>
                      Çalıştırma Faktörü
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
                  {routingLoading ? (
                    <tr>
                      <td colSpan={6} style={{ 
                        padding: "40px", 
                        textAlign: "center", 
                        color: "#94a3b8" 
                      }}>
                        <i className="fas fa-spinner fa-spin" style={{ marginRight: "10px" }}></i>
                        Routing operasyonları yükleniyor...
                      </td>
                    </tr>
                  ) : routingOperations.length === 0 ? (
                    <tr>
                      <td colSpan={6} style={{ 
                        padding: "40px", 
                        textAlign: "center", 
                        color: "#94a3b8" 
                      }}>
                        <i className="fas fa-cogs" style={{ marginRight: "10px" }}></i>
                        Bu parça için routing operasyonu bulunamadı
                      </td>
                    </tr>
                  ) : (
                    routingOperations.map((operation) => (
                      <tr key={`${operation.operationNo}`}
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
                          {operation.operationNo}
                        </td>
                        <td style={{ 
                          padding: "12px 15px", 
                          color: "#94a3b8",
                          fontSize: "0.85rem"
                        }}>
                          {operation.operationDescription || '-'}
                        </td>
                        <td style={{ 
                          padding: "12px 15px", 
                          color: "#94a3b8",
                          fontSize: "0.85rem"
                        }}>
                          {operation.workCenterNo || '-'}
                        </td>
                        <td style={{ 
                          padding: "12px 15px", 
                          color: "#94a3b8",
                          fontSize: "0.85rem"
                        }}>
                          {operation.machSetupTime || '-'}
                        </td>
                        <td style={{ 
                          padding: "12px 15px", 
                          color: "#94a3b8",
                          fontSize: "0.85rem"
                        }}>
                          {operation.machRunFactor || '-'}
                        </td>
                        <td style={{ 
                          padding: "12px 15px",
                          textAlign: "center"
                        }}>
                          <button
                            onClick={() => handleRoutingSelect(operation)}
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
                onClick={() => setShowRoutingSearch(false)}
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
              <i className="fas fa-sitemap"></i>
            </div>
            <div style={{ 
              fontSize: "1.3rem",
              color: "#8b5cf6",
              marginLeft: "12px",
              fontWeight: "600",
              flex: 1,
              minWidth: "200px"
            }}>
              Ürün Ağacı Yönetimi
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
                  transition: "all 0.3s",
                  flexShrink: 0
                }}
              >
                <i className="fas fa-search"></i>
                <span>{isSearchListVisible ? "Listeyi Gizle" : "Listeyi Göster"}</span>
              </button>
              
              <button
                onClick={() => setIsCreatingNewHead(true)}
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
                <span>Yeni Ürün Ağacı</span>
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
            borderLeft: selectedHead ? "3px solid #10b981" : "3px solid #8b5cf6",
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
                ) : prodStructureHeads.length === 0 ? (
                  <span>Veritabanında ürün ağacı bulunamadı.</span>
                ) : selectedHead ? (
                  <span>
                    Parça: <strong>{selectedHead.PartNo}</strong> | 
                    Revizyon: <strong>{selectedHead.EngChgLevel}</strong> | 
                    Tip: <strong>{selectedHead.BomTypeDb}</strong>
                    {isEditing && " (Düzenleme Modu)"}
                  </span>
                ) : (
                  "Düzenlemek için soldaki listeden bir ürün ağacı seçin veya 'Yeni Ürün Ağacı' butonuna tıklayın."
                )}
              </div>
              {selectedHead && (
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
                  <span>Seçili: <strong>{selectedHead.PartNo}</strong></span>
                  <span style={{ marginLeft: "8px", color: "#f59e0b" }}>
                    <i className="fas fa-code-branch" style={{ marginRight: "4px" }}></i>
                    Durum: {selectedHead.Rowstate}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Seçili ürün ağacı detayları */}
        {selectedHead && editingHead && (
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
                Ürün Ağacı Detayları
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
            
            <div style={{ 
              display: "grid", 
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", 
              gap: "15px",
              marginBottom: "20px"
            }}>
              {/* Kontrat */}
              <div>
                <label style={labelStyle}>Kontrat</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editingHead.Contract}
                    onChange={(e) => handleEditingHeadChange('Contract', e.target.value)}
                    style={inputStyle}
                  />
                ) : (
                  <div style={{ 
                    padding: "8px", 
                    backgroundColor: "rgba(30, 41, 59, 0.5)",
                    borderRadius: "4px",
                    color: "#f1f5f9"
                  }}>
                    {editingHead.Contract}
                  </div>
                )}
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
                ) : (
                  <div style={{ 
                    padding: "8px", 
                    backgroundColor: "rgba(30, 41, 59, 0.5)",
                    borderRadius: "4px",
                    color: "#f1f5f9"
                  }}>
                    {editingHead.PartNo}
                  </div>
                )}
              </div>
              
              {/* Revizyon Seviyesi */}
              <div>
                <label style={labelStyle}>Revizyon Seviyesi</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editingHead.EngChgLevel}
                    onChange={(e) => handleEditingHeadChange('EngChgLevel', e.target.value)}
                    style={inputStyle}
                  />
                ) : (
                  <div style={{ 
                    padding: "8px", 
                    backgroundColor: "rgba(30, 41, 59, 0.5)",
                    borderRadius: "4px",
                    color: "#f1f5f9"
                  }}>
                    {editingHead.EngChgLevel}
                  </div>
                )}
              </div>
              
              {/* BOM Tipi */}
              <div>
                <label style={labelStyle}>BOM Tipi</label>
                {isEditing ? (
                  <select
                    value={editingHead.BomTypeDb}
                    onChange={(e) => handleEditingHeadChange('BomTypeDb', e.target.value)}
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
                    color: "#f1f5f9"
                  }}>
                    {editingHead.BomTypeDb}
                  </div>
                )}
              </div>
              
              {/* Geçerli Başlangıç Tarihi */}
              <div>
                <label style={labelStyle}>Geçerli Başlangıç Tarihi</label>
                {isEditing ? (
                  <input
                    type="date"
                    value={editingHead.EffPhaseInDate || ''}
                    onChange={(e) => handleEditingHeadChange('EffPhaseInDate', e.target.value || undefined)}
                    style={inputStyle}
                  />
                ) : (
                  <div style={{ 
                    padding: "8px", 
                    backgroundColor: "rgba(30, 41, 59, 0.5)",
                    borderRadius: "4px",
                    color: "#f1f5f9"
                  }}>
                    {editingHead.EffPhaseInDate || '-'}
                  </div>
                )}
              </div>
              
              {/* Geçerli Bitiş Tarihi */}
              <div>
                <label style={labelStyle}>Geçerli Bitiş Tarihi</label>
                {isEditing ? (
                  <input
                    type="date"
                    value={editingHead.EffPhaseOutDate || ''}
                    onChange={(e) => handleEditingHeadChange('EffPhaseOutDate', e.target.value || undefined)}
                    style={inputStyle}
                  />
                ) : (
                  <div style={{ 
                    padding: "8px", 
                    backgroundColor: "rgba(30, 41, 59, 0.5)",
                    borderRadius: "4px",
                    color: "#f1f5f9"
                  }}>
                    {editingHead.EffPhaseOutDate || '-'}
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
                  color: "#f1f5f9"
                }}>
                  {editingHead.CreateDate}
                </div>
              </div>
              
              {/* Durum */}
              <div>
                <label style={labelStyle}>Durum</label>
                {isEditing ? (
                  <select
                    value={editingHead.Rowstate || 'ACTIVE'}
                    onChange={(e) => handleEditingHeadChange('Rowstate', e.target.value)}
                    style={inputStyle}
                  >
                    <option value="ACTIVE">Aktif</option>
                    <option value="INACTIVE">Pasif</option>
                    <option value="OBSOLETE">Eskimiş</option>
                    <option value="PLANNED">Planlanmış</option>
                  </select>
                ) : (
                  <div style={{ 
                    padding: "8px", 
                    backgroundColor: editingHead.Rowstate === 'ACTIVE' ? "rgba(16, 185, 129, 0.2)" : 
                                   editingHead.Rowstate === 'INACTIVE' ? "rgba(59, 130, 246, 0.2)" : 
                                   editingHead.Rowstate === 'OBSOLETE' ? "rgba(239, 68, 68, 0.2)" : 
                                   "rgba(245, 158, 11, 0.2)",
                    borderRadius: "4px",
                    color: editingHead.Rowstate === 'ACTIVE' ? "#10b981" : 
                           editingHead.Rowstate === 'INACTIVE' ? "#3b82f6" : 
                           editingHead.Rowstate === 'OBSOLETE' ? "#ef4444" : "#f59e0b",
                    fontWeight: "500"
                  }}>
                    {editingHead.Rowstate}
                  </div>
                )}
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
                    placeholder="Ürün Ağacı ile ilgili notlar..."
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

              {activeTab === "Ürün Ağacı Satırları" && (
                <div>
                  {editingStructures.length > 0 ? (
                    <div style={{
                      backgroundColor: "rgba(30, 41, 59, 0.3)",
                      borderRadius: "8px",
                      overflow: "hidden",
                      border: "1px solid #334155"
                    }}>
                      <div style={{
                        display: "grid",
                        gridTemplateColumns: "80px 80px 100px 2fr 120px 80px",
                        backgroundColor: "#334155",
                        padding: "12px 15px",
                        borderBottom: "1px solid #475569",
                        fontSize: "0.8rem",
                        fontWeight: "600",
                        color: "#f1f5f9"
                      }}>
                        <div>Satır No</div>
                        <div>Sıra No</div>
                        <div>Operasyon</div>
                        <div>Bileşen Parçası</div>
                        <div>Kaynak</div>
                        <div>İşlem</div>
                      </div>

                      {editingStructures.map((line, index) => (
                        <div
                          key={line.id}
                          style={{
                            display: "grid",
                            gridTemplateColumns: "80px 80px 100px 2fr 120px 80px",
                            padding: "10px 15px",
                            borderBottom: "1px solid #334155",
                            fontSize: "0.85rem",
                            color: "#f1f5f9",
                            backgroundColor: index % 2 === 0 ? "rgba(30, 41, 59, 0.5)" : "rgba(30, 41, 59, 0.3)",
                            alignItems: "center"
                          }}
                        >
                          <div>
                            {isEditing ? (
                              <input
                                type="number"
                                value={line.LineItemNo}
                                onChange={(e) => handleEditingStructureChange(index, 'LineItemNo', e.target.value)}
                                style={{
                                  width: "100%",
                                  padding: "6px 8px",
                                  backgroundColor: "rgba(30, 41, 59, 0.8)",
                                  border: "1px solid #475569",
                                  borderRadius: "4px",
                                  color: "#f1f5f9",
                                  fontSize: "0.85rem"
                                }}
                                min="1"
                              />
                            ) : (
                              line.LineItemNo
                            )}
                          </div>
                          <div>
                            {isEditing ? (
                              <input
                                type="number"
                                value={line.LineSequence}
                                onChange={(e) => handleEditingStructureChange(index, 'LineSequence', e.target.value)}
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
                              />
                            ) : (
                              line.LineSequence
                            )}
                          </div>
                          <div style={{ display: "flex", gap: "4px" }}>
                            {isEditing ? (
                              <>
                                <input
                                  type="number"
                                  value={line.OperationNo}
                                  onChange={(e) => handleEditingStructureChange(index, 'OperationNo', e.target.value)}
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
                                />
                                <button
                                  onClick={() => openRoutingSearch(index)}
                                  style={{
                                    background: "#f59e0b",
                                    color: "white",
                                    border: "none",
                                    borderRadius: "4px",
                                    padding: "6px 8px",
                                    cursor: "pointer",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    minWidth: "32px"
                                  }}
                                  title="Routing Operasyonu Seç"
                                >
                                  <i className="fas fa-cogs" style={{ fontSize: "0.7rem" }}></i>
                                </button>
                              </>
                            ) : (
                              <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                                {line.OperationNo}
                                {line.RoutingOperationNo && (
                                  <span style={{ 
                                    backgroundColor: "rgba(245, 158, 11, 0.2)", 
                                    color: "#f59e0b",
                                    padding: "2px 6px",
                                    borderRadius: "3px",
                                    fontSize: "0.7rem"
                                  }}>
                                    (R)
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                          <div>
                            {isEditing ? (
                              <div style={{ display: "flex", gap: "8px" }}>
                                <input
                                  type="text"
                                  value={line.ComponentPart || ''}
                                  onChange={(e) => handleEditingStructureChange(index, 'ComponentPart', e.target.value)}
                                  style={{
                                    flex: 1,
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
                                    padding: "6px 8px",
                                    cursor: "pointer",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    minWidth: "32px"
                                  }}
                                  title="Malzeme Ara"
                                >
                                  <i className="fas fa-search" style={{ fontSize: "0.7rem" }}></i>
                                </button>
                              </div>
                            ) : (
                              line.ComponentPart || '-'
                            )}
                          </div>
                          <div>
                            {isEditing ? (
                              <input
                                type="text"
                                value={line.Source || ''}
                                onChange={(e) => handleEditingStructureChange(index, 'Source', e.target.value)}
                                style={{
                                  width: "100%",
                                  padding: "6px 8px",
                                  backgroundColor: "rgba(30, 41, 59, 0.8)",
                                  border: "1px solid #475569",
                                  borderRadius: "4px",
                                  color: "#f1f5f9",
                                  fontSize: "0.85rem"
                                }}
                                placeholder="Kaynak"
                              />
                            ) : (
                              line.Source || '-'
                            )}
                          </div>
                          <div style={{ textAlign: "center" }}>
                            {isEditing && (
                              <button
                                onClick={() => removeStructureLine(index)}
                                disabled={editingStructures.length <= 1}
                                style={{
                                  background: editingStructures.length <= 1 ? "#64748b" : "#ef4444",
                                  color: "white",
                                  border: "none",
                                  borderRadius: "4px",
                                  width: "28px",
                                  height: "28px",
                                  cursor: editingStructures.length <= 1 ? "not-allowed" : "pointer",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  opacity: editingStructures.length <= 1 ? 0.5 : 1
                                }}
                                title="Satırı Sil"
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
                        gridTemplateColumns: "80px 80px 100px 2fr 120px 80px",
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
                              onClick={addNewStructureLine}
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
                          TOPLAM SATIR: {editingStructures.length}
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
                      <p>Bu ürün ağacına ait satır bulunamadı.</p>
                      {isEditing && (
                        <button
                          onClick={addNewStructureLine}
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

        {/* Ürün Ağacı seçilmediyse mesaj göster */}
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
            minHeight: "300px"
          }}>
            <i className="fas fa-sitemap" style={{ fontSize: "2.5rem", marginBottom: "15px", color: "#64748b" }}></i>
            <p style={{ marginBottom: "20px", fontSize: "0.95rem" }}>
              {prodStructureHeads.length === 0 ? 
                "Henüz ürün ağacı bulunmuyor. Yeni bir ürün ağacı oluşturun." : 
                "Düzenlemek için soldaki listeden bir ürün ağacı seçin."}
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
              <span>Yeni Ürün Ağacı Oluştur</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}