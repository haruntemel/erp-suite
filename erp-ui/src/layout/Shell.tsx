import { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";

const Shell = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [openModules, setOpenModules] = useState<string[]>([]);

  // Modül verileri
  const modules = [
    {
      key: "enterp",
      name: "Uygulama Temel Kurgu",
      icon: "shopping-cart",
      path: "/enterp/company",
      children: [
        { name: "Şirket", path: "/enterp/company" } 
      ]
    },
    {
      key: "sales",
      name: "Satış",
      icon: "shopping-cart",
      path: "/sales",
      children: [
        { name: "Satış Siparişi", path: "/sales/orders" },
        { name: "Satış Teklifi", path: "/sales/quotes" },
        { name: "Müşteriler", path: "/sales/customers" },
        { name: "Satış Faturaları", path: "/sales/invoices" }
      ]
    },
    {
      key: "invent",
      name: "Stok",
      icon: "boxes",
      path: "/invent",
      children: [
        { name: "Depo Yönetimi", path: "/invent/warehouse" },
        { name: "Ürünler", path: "/invent/products" },
        { name: "Stok Takip", path: "/invent/inventory" },
        { name: "Transferler", path: "/invent/transfers" }
      ]
    },
    {
      key: "fin",
      name: "Finans",
      icon: "money-bill-wave",
      path: "/fin",
      children: [
        { name: "Fatura", path: "/fin/invoices" },
        { name: "Ödemeler", path: "/fin/payments" },
        { name: "Finansal Raporlar", path: "/fin/reports" },
        { name: "Hesaplar", path: "/fin/accounts" }
      ]
    },
    {
      key: "user",
      name: "Kullanıcı",
      icon: "users",
      path: "/user",
      children: [
        { name: "Kullanıcılar", path: "/user/users" },
        { name: "Roller", path: "/user/roles" },
        { name: "İzinler", path: "/user/permissions" },
        { name: "Kullanıcı Logları", path: "/user/logs" }
      ]
    }
  ];

  // Kullanıcı bilgisini localStorage'dan al
  const getUser = () => {
    try {
      const savedUser = localStorage.getItem("user");
      return savedUser ? JSON.parse(savedUser) : { username: "User", role: "admin" };
    } catch {
      return { username: "User", role: "admin" };
    }
  };

  const user = getUser();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const handleHomeClick = () => {
    navigate("/");
  };

  const handleSearchClear = () => {
    setSearchQuery("");
  };

  const toggleModule = (key: string) => {
    setOpenModules(prev =>
      prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
    );
  };

  // Aktif modülü bul
  const getActiveModule = () => {
    const path = location.pathname;
    if (path.startsWith("/enterp")) return "enterp";
    if (path.startsWith("/sales")) return "sales";
    if (path.startsWith("/invent")) return "invent";
    if (path.startsWith("/fin")) return "fin";
    if (path.startsWith("/user")) return "user";
    return "";
  };

  const activeModule = getActiveModule();

  // Arama ile filtrele
  const filteredModules = modules.filter(module =>
    module.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    module.children.some(child => 
      child.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  return (
    <div className={`app ${sidebarCollapsed ? "sidebar-collapsed" : ""}`}>
      {/* Sidebar */}
      <aside className={`sidebar ${sidebarCollapsed ? "collapsed" : ""}`}>
        <div className="sidebar-header">
          <h2>
            <i className="fas fa-server"></i> ERP Suite
          </h2>
          <button
            className="toggle-btn"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          >
            <i className="fas fa-bars"></i>
          </button>
        </div>

        <div className="search-container">
          <div className="search-box">
            <input
              type="text"
              className="search-input"
              placeholder="Search modules..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <i className="fas fa-search search-icon"></i>
            {searchQuery && (
              <button className="close-search" onClick={handleSearchClear}>
                <i className="fas fa-times"></i>
              </button>
            )}
          </div>
        </div>

        <nav className="nav-menu">
          {/* Sabit Dashboard linki */}
          <div className="nav-section">
            <div className="section-title">Ana Menü</div>
            <div
              className={`nav-item ${location.pathname === "/" ? "active" : ""}`}
              onClick={() => navigate("/")}
              style={{ cursor: "pointer" }}
            >
             {/*<div className={`status-checkbox ${location.pathname === "/" ? "checked" : ""}`}></div>*/}
              <i className="fas fa-tachometer-alt"></i>
              <span>Dashboard</span>
              <div className="tooltip">Dashboard</div>
            </div>
          </div>

          {/* Modüller */}
          <div className="nav-section">
            <div className="section-title">Modüller</div>
            
            {filteredModules.map((module) => {
              const isActive = activeModule === module.key;
              const isOpen = openModules.includes(module.key);
              
              return (
                <div key={module.key}>
                  {/* Ana Modül */}
                  <div
                    className={`nav-item ${isActive ? "active" : ""}`}
                    onClick={() => toggleModule(module.key)}
                    style={{ cursor: "pointer" }}
                  >
                   {/*  <div className={`status-checkbox ${isActive ? "checked" : ""}`}></div>*/}
                    <i className={`fas fa-${module.icon}`}></i>
                    <span>{module.name}</span>
                    <i className={`fas fa-chevron-${isOpen ? "down" : "right"}`} style={{ marginLeft: "auto", fontSize: "0.8rem" }}></i>
                    <div className="tooltip">{module.name}</div>
                  </div>

                  {/* Alt Sayfalar */}
                  {isOpen && module.children.map((child) => {
                    const isChildActive = location.pathname === child.path;
                    return (
                      <div
                        key={child.path}
                        className={`nav-item sub-item ${isChildActive ? "active" : ""}`}
                        onClick={() => navigate(child.path)}
                        style={{ cursor: "pointer" }}
                      >
                        {/* <div className="status-checkbox"></div>*/}
                        <i className="fas fa-angle-right"></i>
                        <span>{child.name}</span>
                        <div className="tooltip">{child.name}</div>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </nav>

        <div className="sidebar-footer">
          <div className="system-status">
            <div className="status-dot"></div>
            <span>System Online</span>
          </div>
          <p>ERP Suite v1.0</p>
          <p>
            {modules.length} modül yüklü
          </p>
        </div>
      </aside>

      {/* Topbar */}
      <header className="topbar">
        <div className="topbar-left">
         

          <button className="home-btn" onClick={handleHomeClick}>
            <i className="fas fa-home"></i>
            <span>Home</span>
          </button>
        </div>

       

        <div className="topbar-right">
          <div className="user-info">
            <div className="user-avatar">
              {user?.username?.charAt(0).toUpperCase() || "U"}
            </div>
            <div>
              <div>{user?.username || "User"}</div>
              <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>
                {user?.role || "Admin"}
              </div>
            </div>
          </div>

          <button className="logout-btn" onClick={handleLogout}>
            <i className="fas fa-sign-out-alt"></i>
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
};

export default Shell;