// src/services/shopOrder.service.ts

import type {
  ShopOrder,
  ShopOrderApiResponse,
  ShopOrderCreateDto,
  ShopOrderUpdateDto,
  ShopMaterialAlloc,
  ShopMaterialAllocApiResponse,
  ShopMaterialAllocCreateDto,
  ShopMaterialAllocUpdateDto
} from '../types/shopOrder.types';

/*const API_BASE_URL = 'http://localhost:5217/api';*/
const API_BASE_URL = '/api';

/**
 * API'den gelen veriyi frontend formatına dönüştürür
 */
const mapApiResponseToShopOrder = (apiResponse: ShopOrderApiResponse): ShopOrder => ({
  orderNo: apiResponse.orderNo,
  orderCode: apiResponse.orderCode,
  contract: apiResponse.contract,
  partNo: apiResponse.partNo,
  revisedStartDate: apiResponse.revisedStartDate || undefined,
  revisedDueDate: apiResponse.revisedDueDate || undefined,
  needDate: apiResponse.needDate || undefined,
  completeDate: apiResponse.completeDate || undefined,
  revisedQtyDue: apiResponse.revisedQtyDue || undefined,
  qtyComplete: apiResponse.qtyComplete || undefined,
  operationScrapped: apiResponse.operationScrapped || undefined,
  noteText: apiResponse.noteText || undefined,
  customerOrderNo: apiResponse.customerOrderNo || undefined,
  customerLineNo: apiResponse.customerLineNo || undefined,
  customerRelNo: apiResponse.customerRelNo || undefined,
  customerLineItemNo: apiResponse.customerLineItemNo || undefined,
  customerNo: apiResponse.customerNo || undefined,
  projectId: apiResponse.projectId || undefined,
  activitySeq: apiResponse.activitySeq || undefined,
  owningCustomerNo: apiResponse.owningCustomerNo || undefined,
  createdBy: apiResponse.createdBy || undefined,
  rowversion: apiResponse.rowversion || undefined,
  rowkey: apiResponse.rowkey || undefined,
  rowstate: apiResponse.rowstate || undefined
});

const mapApiResponseToMaterialAlloc = (apiResponse: ShopMaterialAllocApiResponse): ShopMaterialAlloc => ({
  contract: apiResponse.contract,
  orderNo: apiResponse.orderNo,
  lineItemNo: apiResponse.lineItemNo,
  partNo: apiResponse.partNo,
  operationNo: apiResponse.operationNo || undefined, 
  createDate: apiResponse.createDate || undefined,
  qtyAssigned: apiResponse.qtyAssigned || undefined,
  qtyIssued: apiResponse.qtyIssued || undefined,
  qtyPerAssembly: apiResponse.qtyPerAssembly || undefined,
  qtyRequired: apiResponse.qtyRequired || undefined,
  noteText: apiResponse.noteText || undefined,
  activitySeq: apiResponse.activitySeq || undefined,
  projectId: apiResponse.projectId || undefined,
  catchQtyIssued: apiResponse.catchQtyIssued || undefined,
  qtyScr : apiResponse.qtyScr  || undefined,
  rowversion: apiResponse.rowversion || undefined,
  rowkey: apiResponse.rowkey || undefined,
  rowstate: apiResponse.rowstate || undefined
});

/**
 * Shop Order Service - Tüm API çağrıları burada
 */
export class ShopOrderService {
  /**
   * Tüm üretim emirlerini getirir
   */
  static async getAllOrders(params?: {
    page?: number;
    pageSize?: number;
    orderNo?: string;
    partNo?: string;
    customerOrderNo?: string;
    rowstate?: string;
  }): Promise<ShopOrder[]> {
    const queryParams = new URLSearchParams();
    
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.pageSize) queryParams.append('pageSize', params.pageSize.toString());
    if (params?.orderNo) queryParams.append('orderNo', params.orderNo);
    if (params?.partNo) queryParams.append('partNo', params.partNo);
    if (params?.customerOrderNo) queryParams.append('customerOrderNo', params.customerOrderNo);
    if (params?.rowstate) queryParams.append('rowstate', params.rowstate);

    const response = await fetch(`${API_BASE_URL}/shoporder?${queryParams}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data: ShopOrderApiResponse[] = await response.json();
    return data.map(mapApiResponseToShopOrder);
  }

  /**
   * Belirli bir üretim emrini getirir
   */
  static async getOrder(contract: string, orderNo: string, orderCode: string, partNo: string): Promise<ShopOrder> {
    const response = await fetch(
      `${API_BASE_URL}/shoporder/${encodeURIComponent(contract)}/${encodeURIComponent(orderNo)}/${encodeURIComponent(orderCode)}/${encodeURIComponent(partNo)}`
    );
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data: ShopOrderApiResponse = await response.json();
    return mapApiResponseToShopOrder(data);
  }

  /**
   * Müşteri siparişine bağlı üretim emirlerini getirir
   */
  static async getOrdersByCustomerOrder(customerOrderNo: string): Promise<ShopOrder[]> {
    const response = await fetch(
      `${API_BASE_URL}/shoporder/by-customer-order/${encodeURIComponent(customerOrderNo)}`
    );
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data: ShopOrderApiResponse[] = await response.json();
    return data.map(mapApiResponseToShopOrder);
  }

  /**
   * Yeni üretim emri oluşturur
   */
  static async createOrder(order: ShopOrderCreateDto): Promise<ShopOrder> {
    const response = await fetch(`${API_BASE_URL}/shoporder`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(order)
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }
    
    const data: ShopOrderApiResponse = await response.json();
    return mapApiResponseToShopOrder(data);
  }

  /**
   * Üretim emrini günceller
   */
  static async updateOrder(
    contract: string,
    orderNo: string,
    orderCode: string,
    partNo: string,
    updates: ShopOrderUpdateDto
  ): Promise<ShopOrder> {
    const response = await fetch(
      `${API_BASE_URL}/shoporder/${encodeURIComponent(contract)}/${encodeURIComponent(orderNo)}/${encodeURIComponent(orderCode)}/${encodeURIComponent(partNo)}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates)
      }
    );
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }
    
    const data: ShopOrderApiResponse = await response.json();
    return mapApiResponseToShopOrder(data);
  }

  /**
   * Üretim emrini siler
   */
  static async deleteOrder(contract: string, orderNo: string, orderCode: string, partNo: string): Promise<void> {
    const response = await fetch(
      `${API_BASE_URL}/shoporder/${encodeURIComponent(contract)}/${encodeURIComponent(orderNo)}/${encodeURIComponent(orderCode)}/${encodeURIComponent(partNo)}`,
      {
        method: 'DELETE'
      }
    );
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }
  }
}

/**
 * Shop Material Allocation Service
 */
export class ShopMaterialService {
  /**
   * Belirli bir siparişin malzemelerini getirir
   */
  static async getMaterialDescription(contract: string, partNo: string): Promise<string> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/inventorypart/${encodeURIComponent(contract)}/${encodeURIComponent(partNo)}`
      );
      
      if (!response.ok) {
        console.error(`HTTP error! status: ${response.status} for ${contract}/${partNo}`);
        return '';
      }
      
      const data = await response.json();
      return data.description || '';
    } catch (err) {
      console.error('Malzeme açıklaması alınamadı:', err);
      return '';
    }
  }

  static async getMaterialsByOrder(contract: string, orderNo: string): Promise<ShopMaterialAlloc[]> {
    const response = await fetch(
      `${API_BASE_URL}/shopmaterialalloc/by-order/${encodeURIComponent(contract)}/${encodeURIComponent(orderNo)}`
    );
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data: ShopMaterialAllocApiResponse[] = await response.json();
    return data.map(mapApiResponseToMaterialAlloc);
  }

  /**
   * Belirli bir malzeme tahsisini getirir
   */
  static async getMaterial(
    contract: string,
    orderNo: string,
    lineItemNo: number,
    partNo: string
  ): Promise<ShopMaterialAlloc> {
    const response = await fetch(
      `${API_BASE_URL}/shopmaterialalloc/${encodeURIComponent(contract)}/${encodeURIComponent(orderNo)}/${lineItemNo}/${encodeURIComponent(partNo)}`
    );
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data: ShopMaterialAllocApiResponse = await response.json();
    return mapApiResponseToMaterialAlloc(data);
  }

  /**
   * Yeni malzeme tahsisi oluşturur
   */
  static async createMaterial(material: ShopMaterialAllocCreateDto): Promise<ShopMaterialAlloc> {
    const response = await fetch(`${API_BASE_URL}/shopmaterialalloc`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(material)
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }
    
    const data: ShopMaterialAllocApiResponse = await response.json();
    return mapApiResponseToMaterialAlloc(data);
  }

  /**
   * Malzeme tahsisini günceller
   */
  static async updateMaterial(
    contract: string,
    orderNo: string,
    lineItemNo: number,
    partNo: string,
    updates: ShopMaterialAllocUpdateDto
  ): Promise<ShopMaterialAlloc> {
    const response = await fetch(
      `${API_BASE_URL}/shopmaterialalloc/${encodeURIComponent(contract)}/${encodeURIComponent(orderNo)}/${lineItemNo}/${encodeURIComponent(partNo)}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates)
      }
    );
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }
    
    const data: ShopMaterialAllocApiResponse = await response.json();
    return mapApiResponseToMaterialAlloc(data);
  }

  /**
   * Malzeme tahsisini siler
   */
  static async deleteMaterial(
    contract: string,
    orderNo: string,
    lineItemNo: number,
    partNo: string
  ): Promise<void> {
    const response = await fetch(
      `${API_BASE_URL}/shopmaterialalloc/${encodeURIComponent(contract)}/${encodeURIComponent(orderNo)}/${lineItemNo}/${encodeURIComponent(partNo)}`,
      {
        method: 'DELETE'
      }
    );
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }
  }

  /**
   * Bir siparişin tüm malzemelerini siler
   */
  static async deleteMaterialsByOrder(contract: string, orderNo: string): Promise<void> {
    const response = await fetch(
      `${API_BASE_URL}/shopmaterialalloc/by-order/${encodeURIComponent(contract)}/${encodeURIComponent(orderNo)}`,
      {
        method: 'DELETE'
      }
    );
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }
  }
}