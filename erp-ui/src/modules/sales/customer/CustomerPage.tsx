import { useState, useEffect } from "react";
import SearchList from "../../../components/SearchList";
import { ChevronRightIcon } from "@heroicons/react/24/outline";

interface Customer {
  id: number;
  customer_id: string;
  name: string;
  association_no?: string;
  corporate_form?: string;
  country: string;
  party_type?: string;
  category?: string;
  check_limit?: string;
  limit_control_type?: string;
  default_language: string;
  created_by?: string;
  changed_by?: string;
  creation_date?: string;
  identifier_reference?: string;
  rowversion?: Date;
  rowkey?: string;
  rowtype?: string;
}

interface CustomerUpdateDto {
  name?: string;
  associationNo?: string;
  corporateForm?: string;
  country?: string;
  partyType?: string;
  category?: string;
  checkLimit?: string;
  limitControlType?: string;
  defaultLanguage?: string;
  identifierReference?: string;
  rowversion?: Date;
}

// GeneralTab bileşeni
const GeneralTab = ({ 
  selectedCustomer, 
  onFormDataChange 
}: { 
  selectedCustomer: Customer | null;
  onFormDataChange?: (formData: any) => void;
}) => {
  const [formData, setFormData] = useState({
    default_language: selectedCustomer?.default_language || "tr",
    corporate_form: selectedCustomer?.corporate_form || "",
    country: selectedCustomer?.country || "TR",
    party_type: selectedCustomer?.party_type || "",
    category: selectedCustomer?.category || "",
    check_limit: selectedCustomer?.check_limit || "",
    limit_control_type: selectedCustomer?.limit_control_type || "",
    identifier_reference: selectedCustomer?.identifier_reference || ""
  });

  // Seçili müşteri değiştiğinde formData'yı güncelle
  useEffect(() => {
    if (selectedCustomer) {
      const newFormData = {
        default_language: selectedCustomer.default_language || "tr",
        corporate_form: selectedCustomer.corporate_form || "",
        country: selectedCustomer.country || "TR",
        party_type: selectedCustomer.party_type || "",
        category: selectedCustomer.category || "",
        check_limit: selectedCustomer.check_limit || "",
        limit_control_type: selectedCustomer.limit_control_type || "",
        identifier_reference: selectedCustomer.identifier_reference || ""
      };
      setFormData(newFormData);
      if (onFormDataChange) {
        onFormDataChange(newFormData);
      }
    }
  }, [selectedCustomer, onFormDataChange]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const newFormData = {
      ...formData,
      [name]: value
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
        {selectedCustomer ? (
          <>
            {/* İlk Satır */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "15px" }}>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <label style={{ marginBottom: "5px", color: "#f1f5f9", fontSize: "0.9rem" }}>Default Language</label>
                <select
                  name="default_language"
                  value={formData.default_language}
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
                  <option value="tr">Turkish</option>
                  <option value="en">English</option>
                  <option value="de">German</option>
                  <option value="fr">French</option>
                  <option value="es">Spanish</option>
                  <option value="ar">Arabic</option>
                </select>
              </div>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <label style={{ marginBottom: "5px", color: "#f1f5f9", fontSize: "0.9rem" }}>Corporate Form</label>
                <select
                  name="corporate_form"
                  value={formData.corporate_form}
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
                  <option value="">Select</option>
                  <option value="as">Anonim Şirket (A.Ş.)</option>
                  <option value="ltd">Limited Şirket (Ltd. Şti.)</option>
                  <option value="joint">Kollektif Şirket</option>
                  <option value="commandite">Komandit Şirket</option>
                  <option value="cooperative">Kooperatif</option>
                  <option value="branch">Şube</option>
                  <option value="individual">Şahıs Şirketi</option>
                </select>
              </div>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <label style={{ marginBottom: "5px", color: "#f1f5f9", fontSize: "0.9rem" }}>Party Type</label>
                <select
                  name="party_type"
                  value={formData.party_type}
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
                  <option value="">Select</option>
                  <option value="company">Company</option>
                  <option value="individual">Individual</option>
                  <option value="government">Government</option>
                  <option value="non_profit">Non-Profit</option>
                </select>
              </div>
            </div>

            {/* İkinci Satır */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "15px" }}>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <label style={{ marginBottom: "5px", color: "#f1f5f9", fontSize: "0.9rem" }}>Country</label>
                <select
                  name="country"
                  value={formData.country}
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
                  <option value="TR">Türkiye</option>
                  <option value="US">United States</option>
                  <option value="DE">Germany</option>
                  <option value="FR">France</option>
                  <option value="GB">United Kingdom</option>
                  <option value="IT">Italy</option>
                  <option value="ES">Spain</option>
                  <option value="NL">Netherlands</option>
                  <option value="BE">Belgium</option>
                  <option value="CH">Switzerland</option>
                  <option value="AE">United Arab Emirates</option>
                  <option value="SA">Saudi Arabia</option>
                </select>
              </div>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <label style={{ marginBottom: "5px", color: "#f1f5f9", fontSize: "0.9rem" }}>Category</label>
                <select
                  name="category"
                  value={formData.category}
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
                  <option value="">Select</option>
                  <option value="regular">Regular</option>
                  <option value="vip">VIP</option>
                  <option value="wholesale">Wholesale</option>
                  <option value="retail">Retail</option>
                  <option value="corporate">Corporate</option>
                </select>
              </div>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <label style={{ marginBottom: "5px", color: "#f1f5f9", fontSize: "0.9rem" }}>Check Limit</label>
                <select
                  name="check_limit"
                  value={formData.check_limit}
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
                  <option value="">Select</option>
                  <option value="no_limit">No Limit</option>
                  <option value="warning">Warning Only</option>
                  <option value="block">Block</option>
                </select>
              </div>
            </div>

            {/* Üçüncü Satır */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "15px" }}>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <label style={{ marginBottom: "5px", color: "#f1f5f9", fontSize: "0.9rem" }}>Limit Control Type</label>
                <select
                  name="limit_control_type"
                  value={formData.limit_control_type}
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
                  <option value="">Select</option>
                  <option value="credit_limit">Credit Limit</option>
                  <option value="order_limit">Order Limit</option>
                  <option value="both">Both</option>
                  <option value="none">None</option>
                </select>
              </div>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <label style={{ marginBottom: "5px", color: "#f1f5f9", fontSize: "0.9rem" }}>Identifier Reference</label>
                <input
                  type="text"
                  name="identifier_reference"
                  value={formData.identifier_reference}
                  onChange={handleInputChange}
                  style={{
                    padding: "10px",
                    backgroundColor: "rgba(30, 41, 59, 0.8)",
                    border: "1px solid #334155",
                    borderRadius: "6px",
                    color: "#f1f5f9",
                    fontSize: "0.9rem"
                  }}
                  placeholder="Vergi no, TC kimlik no, vb."
                />
              </div>
              {/* Boş sütun - denge için */}
              <div></div>
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
            <i className="fas fa-users" style={{ fontSize: "2.5rem", marginBottom: "10px" }}></i>
            <p>Düzenlemek için bir müşteri seçin</p>
          </div>
        )}
      </div>
    </div>
  );
};

// AddressTab bileşeni
const AddressTab = ({ selectedCustomer }: { selectedCustomer: Customer | null }) => {
  return (
    <div style={{ padding: "15px 0", minHeight: "250px" }}>
      {selectedCustomer ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "15px" }}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <label style={{ marginBottom: "5px", color: "#f1f5f9", fontSize: "0.9rem" }}>Adres</label>
            <input
              type="text"
              style={{
                padding: "10px",
                backgroundColor: "rgba(30, 41, 59, 0.8)",
                border: "1px solid #334155",
                borderRadius: "6px",
                color: "#f1f5f9",
                fontSize: "0.9rem"
              }}
              placeholder="Adres bilgisi"
            />
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <label style={{ marginBottom: "5px", color: "#f1f5f9", fontSize: "0.9rem" }}>Şehir</label>
            <input
              type="text"
              style={{
                padding: "10px",
                backgroundColor: "rgba(30, 41, 59, 0.8)",
                border: "1px solid #334155",
                borderRadius: "6px",
                color: "#f1f5f9",
                fontSize: "0.9rem"
              }}
              placeholder="Şehir"
            />
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <label style={{ marginBottom: "5px", color: "#f1f5f9", fontSize: "0.9rem" }}>Posta Kodu</label>
            <input
              type="text"
              style={{
                padding: "10px",
                backgroundColor: "rgba(30, 41, 59, 0.8)",
                border: "1px solid #334155",
                borderRadius: "6px",
                color: "#f1f5f9",
                fontSize: "0.9rem"
              }}
              placeholder="Posta kodu"
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
          <i className="fas fa-map-marker-alt" style={{ fontSize: "2.5rem", marginBottom: "10px" }}></i>
          <p>Adres bilgilerini görmek için bir müşteri seçin</p>
        </div>
      )}
    </div>
  );
};

// ContactTab bileşeni
const ContactTab = ({ selectedCustomer }: { selectedCustomer: Customer | null }) => {
  return (
    <div style={{ padding: "15px 0", minHeight: "250px" }}>
      {selectedCustomer ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "15px" }}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <label style={{ marginBottom: "5px", color: "#f1f5f9", fontSize: "0.9rem" }}>Telefon</label>
            <input
              type="text"
              style={{
                padding: "10px",
                backgroundColor: "rgba(30, 41, 59, 0.8)",
                border: "1px solid #334155",
                borderRadius: "6px",
                color: "#f1f5f9",
                fontSize: "0.9rem"
              }}
              placeholder="Telefon numarası"
            />
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <label style={{ marginBottom: "5px", color: "#f1f5f9", fontSize: "0.9rem" }}>Email</label>
            <input
              type="email"
              style={{
                padding: "10px",
                backgroundColor: "rgba(30, 41, 59, 0.8)",
                border: "1px solid #334155",
                borderRadius: "6px",
                color: "#f1f5f9",
                fontSize: "0.9rem"
              }}
              placeholder="Email adresi"
            />
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <label style={{ marginBottom: "5px", color: "#f1f5f9", fontSize: "0.9rem" }}>Web Sitesi</label>
            <input
              type="text"
              style={{
                padding: "10px",
                backgroundColor: "rgba(30, 41, 59, 0.8)",
                border: "1px solid #334155",
                borderRadius: "6px",
                color: "#f1f5f9",
                fontSize: "0.9rem"
              }}
              placeholder="Web sitesi URL"
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
          <i className="fas fa-address-book" style={{ fontSize: "2.5rem", marginBottom: "10px" }}></i>
          <p>İletişim bilgilerini görmek için bir müşteri seçin</p>
        </div>
      )}
    </div>
  );
};

const tabs = ["General", "Address", "Contact"];

export default function CustomerPage() {
  const [activeTab, setActiveTab] = useState("General");
  
  // SearchList'ten seçilen müşteri state'i
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isSearchListVisible, setIsSearchListVisible] = useState(false);

  // PostgreSQL'den gelen müşteri verileri
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // GeneralTab form verileri
  const [generalTabFormData, setGeneralTabFormData] = useState<any>(null);

  // Düzenlenen müşteri bilgileri
  const [editingCustomerData, setEditingCustomerData] = useState({
    customer_id: "",
    name: "",
    association_no: ""
  });

  // PostgreSQL'den müşteri verilerini çek
  useEffect(() => {
    fetchCustomers();
  }, []);

  useEffect(() => {
    if (selectedCustomer) {
      setEditingCustomerData({
        customer_id: selectedCustomer.customer_id,
        name: selectedCustomer.name,
        association_no: selectedCustomer.association_no || ""
      });
    }
  }, [selectedCustomer]);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      // API endpoint'ini customer_info tablosuna göre güncelleyin
      const response = await fetch('http://localhost:5217/api/customer');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      const formattedCustomers: Customer[] = data.map((customer: any, index: number) => ({
        id: index + 1,
        customer_id: customer.customerId || customer.customer_id || "",
        name: customer.name || "",
        association_no: customer.associationNo || customer.association_no || "",
        corporate_form: customer.corporateForm || customer.corporate_form || "",
        country: customer.country || "TR",
        party_type: customer.partyType || customer.party_type || "",
        category: customer.category || "",
        check_limit: customer.checkLimit || customer.check_limit || "",
        limit_control_type: customer.limitControlType || customer.limit_control_type || "",
        default_language: customer.defaultLanguage || customer.default_language || "tr",
        created_by: customer.createdBy || customer.created_by || "",
        changed_by: customer.changedBy || customer.changed_by || "",
        creation_date: customer.creationDate || customer.creation_date || "",
        identifier_reference: customer.identifierReference || customer.identifier_reference || "",
        rowversion: customer.rowversion || new Date(),
        rowkey: customer.rowkey || "",
        rowtype: customer.rowtype || ""
      }));
      
      setCustomers(formattedCustomers);
      setError(null);
    } catch (err) {
      console.error("Müşteri verileri çekilirken hata:", err);
      setError(err instanceof Error ? err.message : "Bilinmeyen bir hata oluştu");
      setCustomers([]);
    } finally {
      setLoading(false);
    }
  };

  const searchListItems = customers.map(customer => ({
    id: customer.id,
    code: customer.customer_id,
    name: customer.name,
    description: customer.association_no ? `Assoc No: ${customer.association_no}` : "No association number",
    originalData: customer
  }));

  const handleCustomerSelect = (item: any) => {
    const selected = customers.find(c => c.id === item.id);
    if (selected) {
      setSelectedCustomer(selected);
      setEditingCustomerData({
        customer_id: selected.customer_id,
        name: selected.name,
        association_no: selected.association_no || ""
      });
    }
  };

  const handleToggleSearchList = () => {
    setIsSearchListVisible(!isSearchListVisible);
  };

  // Müşteri silme
  const handleDeleteCustomer = async (id: number) => {
    if (window.confirm("Bu müşteriyi silmek istediğinize emin misiniz?")) {
      try {
        const customerToDelete = customers.find(c => c.id === id);
        if (!customerToDelete) return;

        const response = await fetch(`http://localhost:5217/api/customer/${customerToDelete.customer_id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          await fetchCustomers();
          
          if (selectedCustomer?.id === id) {
            setSelectedCustomer(null);
            setEditingCustomerData({
              customer_id: "",
              name: "",
              association_no: ""
            });
          }
          
          alert("Müşteri başarıyla silindi!");
        } else {
          const errorData = await response.json();
          throw new Error(errorData.message || "Silme işlemi başarısız oldu");
        }
      } catch (err) {
        console.error("Müşteri silinirken hata:", err);
        alert(err instanceof Error ? err.message : "Müşteri silinirken bir hata oluştu!");
      }
    }
  };

  // Müşteri alanlarını güncelleme
  const handleUpdateCustomerField = (field: keyof typeof editingCustomerData, value: string) => {
    setEditingCustomerData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Müşteri düzenleme kaydetme
  const handleSaveCustomerFields = async () => {
    if (!selectedCustomer) return;

    try {
      const updateDto: CustomerUpdateDto = {
        name: editingCustomerData.name,
        associationNo: editingCustomerData.association_no,
        corporateForm: selectedCustomer.corporate_form,
        country: selectedCustomer.country,
        partyType: selectedCustomer.party_type,
        category: selectedCustomer.category,
        checkLimit: selectedCustomer.check_limit,
        limitControlType: selectedCustomer.limit_control_type,
        defaultLanguage: selectedCustomer.default_language,
        identifierReference: selectedCustomer.identifier_reference,
        rowversion: selectedCustomer.rowversion
      };

      const response = await fetch(`http://localhost:5217/api/customer/${editingCustomerData.customer_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateDto),
      });

      if (response.ok) {
        await fetchCustomers();
        
        const updatedCustomer = await response.json();
        const formattedCustomer: Customer = {
          ...selectedCustomer,
          customer_id: updatedCustomer.customerId || updatedCustomer.customer_id,
          name: updatedCustomer.name,
          association_no: updatedCustomer.associationNo,
          rowversion: updatedCustomer.rowversion || selectedCustomer.rowversion
        };
        
        setSelectedCustomer(formattedCustomer);
        alert("Değişiklikler başarıyla kaydedildi!");
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Güncelleme işlemi başarısız oldu");
      }
    } catch (err) {
      console.error("Müşteri güncellenirken hata:", err);
      alert(err instanceof Error ? err.message : "Değişiklikler kaydedilirken bir hata oluştu!");
    }
  };

  // Tüm değişiklikleri kaydet (hem GeneralTab hem customer fields)
  const handleSaveAll = async () => {
    if (!selectedCustomer) {
      alert("Lütfen önce bir müşteri seçin!");
      return;
    }

    try {
      // Customer fields için updateDto
      const customerUpdateDto: CustomerUpdateDto = {
        name: editingCustomerData.name,
        associationNo: editingCustomerData.association_no,
        corporateForm: generalTabFormData?.corporate_form || selectedCustomer.corporate_form,
        country: generalTabFormData?.country || selectedCustomer.country,
        partyType: generalTabFormData?.party_type || selectedCustomer.party_type,
        category: generalTabFormData?.category || selectedCustomer.category,
        checkLimit: generalTabFormData?.check_limit || selectedCustomer.check_limit,
        limitControlType: generalTabFormData?.limit_control_type || selectedCustomer.limit_control_type,
        defaultLanguage: generalTabFormData?.default_language || selectedCustomer.default_language,
        identifierReference: generalTabFormData?.identifier_reference || selectedCustomer.identifier_reference,
        rowversion: selectedCustomer.rowversion
      };

      const response = await fetch(`http://localhost:5217/api/customer/${editingCustomerData.customer_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(customerUpdateDto),
      });

      if (response.ok) {
        await fetchCustomers();
        
        const updatedCustomer = await response.json();
        const formattedCustomer: Customer = {
          ...selectedCustomer,
          customer_id: updatedCustomer.customerId || updatedCustomer.customer_id,
          name: updatedCustomer.name,
          association_no: updatedCustomer.associationNo,
          corporate_form: updatedCustomer.corporateForm || selectedCustomer.corporate_form,
          country: updatedCustomer.country || selectedCustomer.country,
          party_type: updatedCustomer.partyType || selectedCustomer.party_type,
          category: updatedCustomer.category || selectedCustomer.category,
          check_limit: updatedCustomer.checkLimit || selectedCustomer.check_limit,
          limit_control_type: updatedCustomer.limitControlType || selectedCustomer.limit_control_type,
          default_language: updatedCustomer.defaultLanguage || selectedCustomer.default_language,
          identifier_reference: updatedCustomer.identifierReference || selectedCustomer.identifier_reference,
          rowversion: updatedCustomer.rowversion || selectedCustomer.rowversion
        };
        
        setSelectedCustomer(formattedCustomer);
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
      {/* SearchList Panel - Sadece görünürse göster */}
      {isSearchListVisible && (
        <SearchList
          title="Müşteri Arama"
          items={searchListItems}
          onSelect={handleCustomerSelect}
          onToggle={handleToggleSearchList}
          searchFields={["code", "name", "description"]}
          displayFields={["code", "name"]}
          icon="fas fa-users"
        />
      )}

      {/* SearchList GİZLİ durumda - Sadece göster butonu */}
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
              backgroundColor: "#38bdf8",
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
              <i className="fas fa-users"></i>
            </div>
            <div style={{ 
              fontSize: "1.3rem",
              color: "#38bdf8",
              marginLeft: "12px",
              fontWeight: "600",
              flex: 1,
              minWidth: "200px"
            }}>
              Müşteri Tanımları
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
                  background: isSearchListVisible ? "#334155" : "#38bdf8",
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
                  disabled={!selectedCustomer}
                  style={{
                    background: selectedCustomer 
                      ? "linear-gradient(135deg, #0ea5e9 0%, #0369a1 100%)" 
                      : "#64748b",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                    padding: "8px 15px",
                    fontSize: "0.85rem",
                    cursor: selectedCustomer ? "pointer" : "not-allowed",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    flexShrink: 0,
                    opacity: selectedCustomer ? 1 : 0.6
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
            borderLeft: selectedCustomer ? "3px solid #10b981" : "3px solid #38bdf8",
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
                ) : customers.length === 0 ? (
                  <span>Veritabanında müşteri bulunamadı.</span>
                ) : selectedCustomer ? (
                  `"${selectedCustomer.customer_id} - ${selectedCustomer.name}" müşterisinin bilgilerini düzenleyin.`
                ) : (
                  "Düzenlemek için soldaki listeden bir müşteri seçin."
                )}
              </div>
              {selectedCustomer && (
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
                  <span>Seçili: <strong>{selectedCustomer.customer_id}</strong></span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* CUSTOMER CARD - Customer ID, Name, Association No - DÜZENLENEBİLİR ALANLAR */}
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
              <i className="fas fa-user-tie"></i>
            </div>
            <div style={{ 
              fontSize: "1.3rem",
              color: "#10b981",
              marginLeft: "12px",
              fontWeight: "600",
              flex: 1,
              minWidth: "200px"
            }}>
              {selectedCustomer ? `Müşteri Bilgileri - ${selectedCustomer.customer_id}` : "Müşteri Bilgileri"}
            </div>
            {selectedCustomer && (
              <button
                onClick={handleSaveCustomerFields}
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
                <span>Müşteri Bilgilerini Kaydet</span>
              </button>
            )}
          </div>
          
          {/* MÜŞTERİ BİLGİLERİ - DÜZENLENEBİLİR ALANLAR */}
          {selectedCustomer ? (
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
                <i className="fas fa-edit" style={{ marginRight: "8px", color: "#38bdf8" }}></i>
                Müşteri Temel Bilgileri
              </h4>
              
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "15px" }}>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <label style={{ marginBottom: "5px", color: "#f1f5f9", fontSize: "0.85rem" }}>
                    Müşteri Kodu <span style={{ color: "#ef4444" }}>*</span>
                  </label>
                  <input
                    type="text"
                    value={editingCustomerData.customer_id}
                    onChange={(e) => handleUpdateCustomerField('customer_id', e.target.value)}
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      backgroundColor: "rgba(30, 41, 59, 0.8)",
                      border: "1px solid #38bdf8",
                      borderRadius: "6px",
                      color: "#f1f5f9",
                      fontSize: "0.9rem",
                      transition: "all 0.2s"
                    }}
                  />
                  <div style={{ fontSize: "0.75rem", color: "#94a3b8", marginTop: "4px" }}>
                    Müşterinin benzersiz kodu
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <label style={{ marginBottom: "5px", color: "#f1f5f9", fontSize: "0.85rem" }}>
                    Müşteri Adı <span style={{ color: "#ef4444" }}>*</span>
                  </label>
                  <input
                    type="text"
                    value={editingCustomerData.name}
                    onChange={(e) => handleUpdateCustomerField('name', e.target.value)}
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      backgroundColor: "rgba(30, 41, 59, 0.8)",
                      border: "1px solid #38bdf8",
                      borderRadius: "6px",
                      color: "#f1f5f9",
                      fontSize: "0.9rem",
                      transition: "all 0.2s"
                    }}
                  />
                  <div style={{ fontSize: "0.75rem", color: "#94a3b8", marginTop: "4px" }}>
                    Müşterinin resmi adı
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <label style={{ marginBottom: "5px", color: "#f1f5f9", fontSize: "0.85rem" }}>
                    İlişkilendirme No
                  </label>
                  <input
                    type="text"
                    value={editingCustomerData.association_no}
                    onChange={(e) => handleUpdateCustomerField('association_no', e.target.value)}
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      backgroundColor: "rgba(30, 41, 59, 0.8)",
                      border: "1px solid #38bdf8",
                      borderRadius: "6px",
                      color: "#f1f5f9",
                      fontSize: "0.9rem",
                      transition: "all 0.2s"
                    }}
                  />
                  <div style={{ fontSize: "0.75rem", color: "#94a3b8", marginTop: "4px" }}>
                    İlişkilendirme numarası (isteğe bağlı)
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
                  onClick={() => handleDeleteCustomer(selectedCustomer.id)}
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
                  <span>Müşteriyi Sil</span>
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
              <i className="fas fa-users" style={{ fontSize: "2rem", marginBottom: "10px", color: "#64748b" }}></i>
              <p>Düzenlemek için soldaki listeden bir müşteri seçin</p>
            </div>
          )}
          
          {/* Müşteri sayısı bilgisi */}
          <div style={{ 
            fontSize: "0.85rem", 
            color: "#94a3b8", 
            padding: "8px 12px",
            backgroundColor: "rgba(30, 41, 59, 0.3)",
            borderRadius: "4px",
            marginTop: "10px"
          }}>
            <i className="fas fa-database" style={{ marginRight: "8px" }}></i>
            <span>Toplam {customers.length} müşteri bulundu</span>
            {loading && (
              <span style={{ marginLeft: "15px" }}>
                <i className="fas fa-spinner fa-spin"></i> Veriler güncelleniyor...
              </span>
            )}
          </div>
        </div>

        {/* Tabs Card - GENEL BİLGİLER (Diğer alanlar) */}
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
                    {tab === "Address" && <i className="fas fa-map-marker-alt"></i>}
                    {tab === "Contact" && <i className="fas fa-address-book"></i>}
                    <span>{tab}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Tab Content - SABİT YÜKSEKLİK */}
          <div style={{ minHeight: "300px" }}>
            {activeTab === "General" && (
              <GeneralTab 
                selectedCustomer={selectedCustomer} 
                onFormDataChange={setGeneralTabFormData}
              />
            )}
            {activeTab === "Address" && <AddressTab selectedCustomer={selectedCustomer} />}
            {activeTab === "Contact" && <ContactTab selectedCustomer={selectedCustomer} />}
          </div>
        </div>
      </div>
    </div>
  );
}