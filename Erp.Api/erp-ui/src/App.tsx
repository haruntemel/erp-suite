import { Routes, Route } from "react-router-dom";
import Shell from "./layout/Shell";
import SalesHome from "./modules/sales/SalesHome";
import InventoryHome from "./modules/invent/InventoryHome";
import FinanceHome from "./modules/fin/FinanceHome";
import Lobby from "./modules/lobby/Lobby";

// Alt kırılım sayfaları (örnek)
import SalesOrders from "./modules/sales/SalesOrders";
import SalesQuotes from "./modules/sales/SalesQuotes";
import Warehouse from "./modules/invent/Warehouse";
import Invoices from "./modules/fin/Invoices";

export default function App() {
  return (
    <Routes>
      <Route element={<Shell />}>
        {/* Ana ekran (lobi) */}
        <Route path="/" element={<Lobby />} />

        {/* Modüller */}
        <Route path="/sales" element={<SalesHome />} />
        <Route path="/invent" element={<InventoryHome />} />
        <Route path="/fin" element={<FinanceHome />} />

        {/* Alt kırılımlar */}
        <Route path="/sales/orders" element={<SalesOrders />} />
        <Route path="/sales/quotes" element={<SalesQuotes />} />
        <Route path="/invent/warehouse" element={<Warehouse />} />
        <Route path="/fin/invoices" element={<Invoices />} />
      </Route>
    </Routes>
  );
}