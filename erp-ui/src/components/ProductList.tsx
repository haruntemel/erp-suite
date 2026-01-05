import { useEffect, useState } from "react";
import api from "../api";

type Product = {
  id: string;
  code: string;
  name: string;
  price: number;
  stockQty: number;
};

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    api.get("/products")
  .then((res: { data: { value: Product[] } }) => setProducts(res.data.value))
  .catch((err: unknown) => console.error("API error:", err));
  }, []);

  return (
    <div className="bg-white shadow p-4 rounded">
      <h2 className="text-lg font-semibold mb-2">Ürünler</h2>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b">
            <th className="text-left">Kod</th>
            <th className="text-left">Ad</th>
            <th className="text-left">Fiyat</th>
            <th className="text-left">Stok</th>
          </tr>
        </thead>
        <tbody>
          {products.map(p => (
            <tr key={p.id} className="border-b">
              <td>{p.code}</td>
              <td>{p.name}</td>
              <td>{p.price}</td>
              <td>{p.stockQty}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}