import { Routes, Route } from "react-router-dom";
import Shell from "./layout/Shell";
import AppBase from "./modules/enterp/AppBase";
import SalesHome from "./modules/sales/SalesHome";
import InventoryHome from "./modules/invent/InventoryHome";
import MfgstdHome from "./modules/mfgstd/MfgstdHome";
import FinanceHome from "./modules/fin/FinanceHome";
import Lobby from "./modules/lobby/Lobby";

// Alt kırılım sayfaları
import SalesOrders from "./modules/sales/SalesOrders";
import SalesQuotes from "./modules/sales/SalesQuotes";
import CustomerPage from "./modules/sales/customer/CustomerPage";
import Warehouse from "./modules/invent/Warehouse";
import InventoryPart from "./modules/invent/InventoryPart";
import Invoices from "./modules/fin/Invoices";
import SaleOrderLinesPage from './modules/sales/SaleOrderLines';
import MfgStructures from './modules/mfgstd/MfgStructures';
import WorkCenter from './modules/mfgstd/WorkCenter';
import MfgRoutes from './modules/mfgstd/MfgRoutes';
// 🔹 User modülü
import UsersHome from "./modules/user/UsersHome";

// 🔹 Login ve koruma
import LoginForm from "./modules/auth/LoginForm";
import ProtectedRoute from "./routes/ProtectedRoute";
import CreateUserForm from "./modules/user/CreateUserForm";
import CompanyPage from "./modules/enterp/company/CompanyPage";

// 🔹 Yetkisiz sayfa
//import Unauthorized from "./modules/auth/Unauthorized";

export default function App() {
  return (
    <Routes>
      {/* Login ekranı */}
      <Route path="/login" element={<LoginForm />} />

      {/* Yetkisiz erişim */}
       {/* <Route path="/unauthorized" element={<Unauthorized />} />*/}

      {/* Tüm modüller ProtectedRoute içinde (login zorunlu) */}
      <Route
        element={
          <ProtectedRoute>
            <Shell />
          </ProtectedRoute>
        }
      >
        {/* Ana ekran (lobi) */}
        <Route path="/" element={<Lobby />} />

        {/* Modüller */}
        <Route path="/enterp" element={<AppBase />} />
        <Route path="/sales" element={<SalesHome />} />
        <Route path="/invent" element={<InventoryHome />} />
        <Route path="/fin" element={<FinanceHome />} />
        <Route path="/mfgstd" element={<MfgstdHome />} />
        <Route path="/user" element={<UsersHome />} />

        {/* Alt kırılımlar */}
        <Route path="/enterp/company" element={<CompanyPage />} />
        <Route path="/sales/customer" element={<CustomerPage />} />
        <Route path="/sales/customerorderlines" element={<SaleOrderLinesPage />} />
        <Route path="/sales/orders" element={<SalesOrders />} />
        <Route path="/sales/quotes" element={<SalesQuotes />} />
        <Route path="/invent/warehouse" element={<Warehouse />} />
        <Route path="/invent/inventorypart" element={<InventoryPart />} />
        <Route path="/fin/invoices" element={<Invoices />} />
        <Route path="/user/users" element={<CreateUserForm />} />
        <Route path="/mfgstd/mfgroutes" element={<MfgRoutes />} />
        <Route path="/mfgstd/mfgstructures" element={<MfgStructures />} />
        <Route path="/mfgstd/workcenter" element={<WorkCenter />} />
        
      </Route>
    </Routes>
  );
}