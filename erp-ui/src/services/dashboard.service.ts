// src/services/dashboard.service.ts

const API_BASE_URL = 'http://localhost:5217/api';

export interface DashboardStats {
  totalCustomerOrders: number;
  totalOrderLines: number;
  totalShopOrders: number;
  totalRevenue: number;
  pendingOrders: number;
  completedOrders: number;
  inProgressOrders: number;
  recentOrders: any[];
  topCustomers: { customer: string; count: number }[];
  ordersByStatus: { status: string; count: number }[];
  orderTrend: { date: string; count: number }[];
}

export class DashboardService {
  /**
   * Dashboard için tüm istatistikleri getirir
   */
  static async getDashboardStats(): Promise<DashboardStats> {
    try {
      // Paralel olarak tüm verileri çek
      const [customerOrders, orderLines, shopOrders] = await Promise.all([
        fetch(`${API_BASE_URL}/customerorder`).then(res => res.json()),
        fetch(`${API_BASE_URL}/customerorderline/get-all`).then(res => res.json()),
        fetch(`${API_BASE_URL}/shoporder`).then(res => res.json())
      ]);

      // İstatistikleri hesapla
      const stats: DashboardStats = {
        totalCustomerOrders: customerOrders.length,
        totalOrderLines: orderLines.length,
        totalShopOrders: shopOrders.length,
        totalRevenue: this.calculateTotalRevenue(orderLines),
        pendingOrders: this.countOrdersByStatus(customerOrders, 'Planned'),
        completedOrders: this.countOrdersByStatus(customerOrders, 'Closed'),
        inProgressOrders: this.countOrdersByStatus(customerOrders, 'Released'),
        recentOrders: this.getRecentOrders(customerOrders, 5),
        topCustomers: this.getTopCustomers(customerOrders, 5),
        ordersByStatus: this.groupOrdersByStatus(customerOrders),
        orderTrend: this.calculateOrderTrend(orderLines)
      };

      return stats;
    } catch (error) {
      console.error('Dashboard stats fetch error:', error);
      throw error;
    }
  }

  /**
   * Toplam geliri hesapla
   */
  private static calculateTotalRevenue(orderLines: any[]): number {
    return orderLines.reduce((sum: number, line: any) => {
      const price = line.saleUnitPrice || 0;
      const qty = line.buyQtyDue || 0;
      return sum + (price * qty);
    }, 0);
  }

  /**
   * Belirli duruma göre sipariş sayısını say
   */
  private static countOrdersByStatus(orders: any[], status: string): number {
    return orders.filter(order => order.rowstate === status).length;
  }

  /**
   * Son siparişleri getir
   */
  private static getRecentOrders(orders: any[], limit: number): any[] {
    return [...orders]
      .sort((a: any, b: any) => {
        const dateA = a.dateEntered ? new Date(a.dateEntered) : new Date(0);
        const dateB = b.dateEntered ? new Date(b.dateEntered) : new Date(0);
        return dateB.getTime() - dateA.getTime();
      })
      .slice(0, limit)
      .map((order: any) => ({
        orderNo: order.orderNo,
        customerNo: order.customerNo,
        dateEntered: order.dateEntered,
        status: order.rowstate
      }));
  }

  /**
   * En çok sipariş veren müşterileri getir
   */
  private static getTopCustomers(orders: any[], limit: number): { customer: string; count: number }[] {
    const customerCounts: Record<string, number> = orders.reduce((acc: Record<string, number>, order: any) => {
      const customer = order.customerNo || 'Unknown';
      acc[customer] = (acc[customer] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(customerCounts)
      .map(([customer, count]) => ({ 
        customer, 
        count: Number(count) 
      }))
      .sort((a: { customer: string; count: number }, b: { customer: string; count: number }) => b.count - a.count)
      .slice(0, limit);
  }

  /**
   * Siparişleri durumlarına göre grupla
   */
  private static groupOrdersByStatus(orders: any[]): { status: string; count: number }[] {
    const statusCounts: Record<string, number> = orders.reduce((acc: Record<string, number>, order: any) => {
      const status = order.rowstate || 'Unknown';
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(statusCounts)
      .map(([status, count]) => ({ 
        status, 
        count: Number(count) 
      }))
      .sort((a: { status: string; count: number }, b: { status: string; count: number }) => b.count - a.count);
  }

  /**
   * Sipariş trendini hesapla (son 7 gün)
   */
  private static calculateOrderTrend(orderLines: any[]): { date: string; count: number }[] {
    const today = new Date();
    const last7Days: { date: string; count: number }[] = [];

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const count = orderLines.filter((line: any) => {
        if (!line.dateEntered) return false;
        const lineDate = new Date(line.dateEntered).toISOString().split('T')[0];
        return lineDate === dateStr;
      }).length;

      last7Days.push({ date: dateStr, count });
    }

    return last7Days;
  }
}