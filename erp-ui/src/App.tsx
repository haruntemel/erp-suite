import { Routes, Route } from "react-router-dom";
import Shell from "./layout/Shell";
import SalesHome from "./modules/sales/SalesHome";
import InventoryHome from "./modules/invent/InventoryHome";
import FinanceHome from "./modules/fin/FinanceHome";
import Lobby from "./modules/lobby/Lobby";

// Alt kırılım sayfaları
import SalesOrders from "./modules/sales/SalesOrders";
import SalesQuotes from "./modules/sales/SalesQuotes";
import Warehouse from "./modules/invent/Warehouse";
import Invoices from "./modules/fin/Invoices";

// 🔹 Yeni User modülü
import UsersHome from "./modules/user/UsersHome";
import UsersPage from "./modules/user/UsersPage";

// 🔹 Login ve koruma
import LoginForm from "./modules/auth/LoginForm";
import ProtectedRoute from "./routes/ProtectedRoute";

export default function App() {
  return (
    <Routes>
      {/* Login ekranı */}
      <Route path="/login" element={<LoginForm />} />

      {/* Tüm modüller ProtectedRoute içinde */}
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
        <Route path="/sales" element={<SalesHome />} />
        <Route path="/invent" element={<InventoryHome />} />
        <Route path="/fin" element={<FinanceHome />} />
        <Route path="/user" element={<UsersHome />} />

        {/* Alt kırılımlar */}
        <Route path="/sales/orders" element={<SalesOrders />} />
        <Route path="/sales/quotes" element={<SalesQuotes />} />
        <Route path="/invent/warehouse" element={<Warehouse />} />
        <Route path="/fin/invoices" element={<Invoices />} />
        <Route path="/user/users" element={<UsersPage />} />
      </Route>
    </Routes>
  );
}