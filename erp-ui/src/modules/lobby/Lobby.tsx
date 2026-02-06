// src/modules/dashboard/Dashboard.tsx

import { useState, useEffect } from 'react';
import { DashboardService, type DashboardStats } from '../../services/dashboard.service';

const Dashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await DashboardService.getDashboardStats();
      setStats(data);
    } catch (err) {
      setError('Dashboard yüklenirken hata oluştu');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadDashboard();
    setRefreshing(false);
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  // Formatting functions
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return new Intl.DateTimeFormat('tr-TR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      }).format(date);
    } catch {
      return '-';
    }
  };

  if (loading && !stats) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Dashboard yükleniyor...</p>
      </div>
    );
  }

  if (error && !stats) {
    return (
      <div className="dashboard-error">
        <i className="fas fa-exclamation-triangle"></i>
        <p>{error}</p>
        <button onClick={handleRefresh} className="btn btn-retry">
          <i className="fas fa-sync-alt"></i> Tekrar Dene
        </button>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {/* Header */}
      <div className="dashboard-header">
        <div className="header-content">
          <h1 className="dashboard-title">
            <i className="fas fa-tachometer-alt"></i> Genel Görünüm - Özet
          </h1>
          <p className="dashboard-subtitle">
            Sistem istatistikleri ve analitik görünüm
          </p>
        </div>
        <button 
          onClick={handleRefresh} 
          className={`btn-refresh ${refreshing ? 'refreshing' : ''}`}
          disabled={refreshing}
        >
          <i className="fas fa-sync-alt"></i>
          {refreshing ? 'Güncelleniyor...' : 'Yenile'}
        </button>
      </div>

      {/* Top Stats Grid - 4x1 on desktop, 2x2 on tablet, 1x4 on mobile */}
      <div className="dashboard-top-stats">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #38bdf8 0%, #0ea5e9 100%)' }}>
            <i className="fas fa-shopping-cart"></i>
          </div>
          <div className="stat-info">
            <h3>Toplam Sipariş</h3>
            <p className="stat-value">{stats?.totalCustomerOrders || 0}</p>
            <span className="stat-badge positive">
              <i className="fas fa-arrow-up"></i> Aktif
            </span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}>
            <i className="fas fa-list"></i>
          </div>
          <div className="stat-info">
            <h3>Sipariş Satırları</h3>
            <p className="stat-value">{stats?.totalOrderLines || 0}</p>
            <span className="stat-badge info">
              <i className="fas fa-info-circle"></i> Toplam
            </span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)' }}>
            <i className="fas fa-industry"></i>
          </div>
          <div className="stat-info">
            <h3>Üretim Emirleri</h3>
            <p className="stat-value">{stats?.totalShopOrders || 0}</p>
            <span className="stat-badge warning">
              <i className="fas fa-tasks"></i> İşlemde
            </span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' }}>
            <i className="fas fa-money-bill-wave"></i>
          </div>
          <div className="stat-info">
            <h3>Toplam Gelir</h3>
            <p className="stat-value">{formatCurrency(stats?.totalRevenue || 0)}</p>
            <span className="stat-badge positive">
              <i className="fas fa-chart-line"></i> Artış
            </span>
          </div>
        </div>
      </div>

      {/* Middle Row - 2x2 Grid */}
      <div className="dashboard-middle">
        {/* Order Status Chart */}
        <div className="chart-card">
          <div className="card-header">
            <div className="card-icon" style={{ background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)' }}>
              <i className="fas fa-chart-pie"></i>
            </div>
            <h2 className="card-title">Sipariş Durumları</h2>
          </div>
          <div className="chart-content">
            {stats?.ordersByStatus.map((item, index) => {
              const total = stats.totalCustomerOrders || 1;
              const percentage = ((item.count / total) * 100).toFixed(1);
              
              const statusColors: Record<string, string> = {
                'Planned': '#f59e0b',
                'Released': '#0ea5e9',
                'Closed': '#10b981',
                'Cancelled': '#ef4444',
                'Unknown': '#64748b'
              };

              return (
                <div key={index} className="status-item">
                  <div className="status-info">
                    <span 
                      className="status-dot" 
                      style={{ backgroundColor: statusColors[item.status] }}
                    ></span>
                    <span className="status-name">{item.status}</span>
                    <span className="status-count">{item.count}</span>
                  </div>
                  <div className="status-bar-container">
                    <div 
                      className="status-bar" 
                      style={{ 
                        width: `${percentage}%`,
                        backgroundColor: statusColors[item.status]
                      }}
                    ></div>
                  </div>
                  <span className="status-percentage">{percentage}%</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Status Overview */}
        <div className="status-overview-card">
          <div className="card-header">
            <div className="card-icon" style={{ background: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)' }}>
              <i className="fas fa-clipboard-list"></i>
            </div>
            <h2 className="card-title">Durum Özeti</h2>
          </div>
          <div className="status-grid">
            <div className="status-item-card pending">
              <div className="status-icon">
                <i className="fas fa-clock"></i>
              </div>
              <div className="status-content">
                <h3>Bekleyen</h3>
                <p className="status-value">{stats?.pendingOrders || 0}</p>
              </div>
            </div>

            <div className="status-item-card in-progress">
              <div className="status-icon">
                <i className="fas fa-spinner"></i>
              </div>
              <div className="status-content">
                <h3>Devam Eden</h3>
                <p className="status-value">{stats?.inProgressOrders || 0}</p>
              </div>
            </div>

            <div className="status-item-card completed">
              <div className="status-icon">
                <i className="fas fa-check-circle"></i>
              </div>
              <div className="status-content">
                <h3>Tamamlanan</h3>
                <p className="status-value">{stats?.completedOrders || 0}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Row - 2x2 Grid */}
      <div className="dashboard-bottom">
        {/* Recent Orders */}
        <div className="list-card">
          <div className="card-header">
            <div className="card-icon" style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}>
              <i className="fas fa-clock"></i>
            </div>
            <h2 className="card-title">Son Siparişler</h2>
          </div>
          <div className="list-content">
            {stats?.recentOrders.length === 0 ? (
              <div className="empty-state">
                <i className="fas fa-inbox"></i>
                <p>Henüz sipariş yok</p>
              </div>
            ) : (
              stats?.recentOrders.slice(0, 5).map((order, index) => (
                <div key={index} className="list-item">
                  <div className="list-item-icon">
                    <i className="fas fa-file-invoice"></i>
                  </div>
                  <div className="list-item-info">
                    <h4>#{order.orderNo}</h4>
                    <p>{order.customerNo}</p>
                  </div>
                  <div className="list-item-meta">
                    <span className="date">{order.dateEntered ? formatDate(order.dateEntered) : '-'}</span>
                    <span className={`status ${order.status?.toLowerCase()}`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Top Customers */}
        <div className="list-card">
          <div className="card-header">
            <div className="card-icon" style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' }}>
              <i className="fas fa-users"></i>
            </div>
            <h2 className="card-title">Top Müşteriler</h2>
          </div>
          <div className="list-content">
            {stats?.topCustomers.length === 0 ? (
              <div className="empty-state">
                <i className="fas fa-user-slash"></i>
                <p>Müşteri verisi yok</p>
              </div>
            ) : (
              stats?.topCustomers.slice(0, 5).map((customer, index) => (
                <div key={index} className="list-item">
                  <div className="customer-rank">
                    #{index + 1}
                  </div>
                  <div className="list-item-info">
                    <h4>{customer.customer}</h4>
                    <p>{customer.count} sipariş</p>
                  </div>
                  <div className="customer-badge">
                    <i className="fas fa-star"></i>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Order Trend */}
        <div className="chart-card full-width">
          <div className="card-header">
            <div className="card-icon" style={{ background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)' }}>
              <i className="fas fa-chart-line"></i>
            </div>
            <h2 className="card-title">Sipariş Trendi (Son 7 Gün)</h2>
          </div>
          <div className="trend-chart">
            <div className="chart-bars">
              {stats?.orderTrend.map((item, index) => {
                const maxCount = Math.max(...(stats?.orderTrend.map(t => t.count) || [1]));
                const height = (item.count / maxCount) * 100;
                
                return (
                  <div key={index} className="bar-container">
                    <div 
                      className="bar" 
                      style={{ 
                        height: `${height}%`,
                        background: 'linear-gradient(to top, #0ea5e9, #38bdf8)'
                      }}
                      data-count={item.count}
                    >
                      <div className="bar-value">{item.count}</div>
                    </div>
                    <span className="bar-label">
                      {new Date(item.date).toLocaleDateString('tr-TR', { 
                        day: 'numeric', 
                        month: 'short' 
                      })}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;