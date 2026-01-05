import { useEffect, useState } from 'react';
import api from '../api'; // doğru path olmalı

useEffect(() => {
  api.get("/dashboard/stats").then(res => {
    console.log(res.data);
  });
}, []);

interface DashboardStats {
  totalProducts: number;
  totalUsers: number;
  activeUsers: number;
  recentActivities: Array<{
    id: number;
    action: string;
    user: string;
    time: string;
  }>;
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      console.log('Token from localStorage:', token); // DEBUG
      
      // 1. YÖNTEM: Doğrudan fetch ile
      const response = await fetch('http://localhost:5217/api/dashboard/stats', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      // 2. YÖNTEM: Axios ile
      // const response = await api.get('/dashboard/stats');
      
      console.log('Response status:', response.status); // DEBUG
      
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Yetkilendirme hatası. Lütfen tekrar giriş yapın.');
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Dashboard data:', data); // DEBUG
      setStats(data);
    } catch (err: any) {
      console.error('Dashboard error:', err);
      setError(err.message || 'Veriler yüklenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
        <h3 className="font-bold">Hata!</h3>
        <p>{error}</p>
        <button
          onClick={fetchDashboardData}
          className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Tekrar Dene
        </button>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Veri bulunamadı.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
      
      {/* İstatistik Kartları */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-blue-800">Toplam Ürün</h3>
          <p className="text-3xl font-bold text-blue-600">{stats.totalProducts}</p>
        </div>
        
        <div className="bg-green-50 p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-green-800">Toplam Kullanıcı</h3>
          <p className="text-3xl font-bold text-green-600">{stats.totalUsers}</p>
        </div>
        
        <div className="bg-purple-50 p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-purple-800">Aktif Kullanıcılar</h3>
          <p className="text-3xl font-bold text-purple-600">{stats.activeUsers}</p>
        </div>
      </div>
      
      {/* Son Aktiviteler */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Son Aktiviteler</h2>
        <div className="space-y-3">
          {stats.recentActivities.map((activity) => (
            <div key={activity.id} className="flex items-center justify-between py-2 border-b">
              <div>
                <span className="font-medium">{activity.user}</span>
                <span className="text-gray-600 ml-2">{activity.action}</span>
              </div>
              <span className="text-sm text-gray-500">
                {new Date(activity.time).toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}