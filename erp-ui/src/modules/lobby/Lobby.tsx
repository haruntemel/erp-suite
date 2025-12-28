import { useState, useEffect } from "react";
import api from "../../api";

export default function Lobby() {
  const [apiTest, setApiTest] = useState<{ status: string; message?: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const testBackendConnection = async () => {
    setLoading(true);
    try {
      const response = await api.get("/auth/verify");
      setApiTest({ status: "success", message: "Backend connection OK!" });
      console.log("✅ Backend test successful:", response.data);
    } catch (error: any) {
      setApiTest({ 
        status: "error", 
        message: error.response?.data?.message || error.message 
      });
      console.error("❌ Backend test failed:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Sayfa yüklendiğinde backend'i test et
    testBackendConnection();
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Hoşgeldiniz 👋</h2>
      
      {/* Backend Connection Test */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg border">
        <h3 className="font-semibold text-gray-700 mb-2">Backend Connection Test</h3>
        {apiTest ? (
          <div className={`p-3 rounded ${apiTest.status === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
            <strong>{apiTest.status === 'success' ? '✅' : '❌'} {apiTest.status.toUpperCase()}:</strong> {apiTest.message}
          </div>
        ) : (
          <div className="text-gray-500">Testing connection...</div>
        )}
        <button 
          onClick={testBackendConnection}
          disabled={loading}
          className="mt-3 px-4 py-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 disabled:opacity-50"
        >
          {loading ? "Testing..." : "Test Again"}
        </button>
      </div>
      
      <p className="text-gray-600 mb-6">Ana ekran (lobi) burası, modül seçmek için sol menüyü kullanın.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
          <h4 className="font-semibold text-blue-800 mb-2">Hızlı İşlemler</h4>
          <ul className="space-y-1 text-sm text-blue-600">
            <li>• Yeni Satış Siparişi</li>
            <li>• Stok Ekleme</li>
            <li>• Fatura Oluştur</li>
          </ul>
        </div>
        
        <div className="p-4 bg-green-50 rounded-lg border border-green-100">
          <h4 className="font-semibold text-green-800 mb-2">Son Aktiviteler</h4>
          <ul className="space-y-1 text-sm text-green-600">
            <li>• Giriş yapıldı: {new Date().toLocaleTimeString()}</li>
            <li>• Token durumu: {localStorage.getItem('token') ? '✅ Aktif' : '❌ Yok'}</li>
          </ul>
        </div>
      </div>
      
      {/* Debug Info */}
      <div className="mt-6 p-3 bg-gray-100 rounded text-xs text-gray-600">
        <p><strong>Debug Info:</strong></p>
        <p>Token: {localStorage.getItem('token') ? '✓ Present' : '✗ Missing'}</p>
        <p>User: {localStorage.getItem('user') ? '✓ Loaded' : '✗ Not found'}</p>
        <p>Backend URL: http://localhost:5217</p>
      </div>
    </div>
  );
}