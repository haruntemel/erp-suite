// src/types/shopOrder.types.ts

/**
 * Üretim Emri (Shop Order) - API Response
 */
export interface ShopOrderApiResponse {
  orderNo: string;
  orderCode: string;
  contract: string;
  partNo: string;
  revisedStartDate?: string | null;
  revisedDueDate?: string | null;
  needDate?: string | null;
  completeDate?: string | null;
  revisedQtyDue?: number | null;
  qtyComplete?: number | null;
  operationScrapped?: number | null;
  noteText?: string | null;
  customerOrderNo?: string | null;
  customerLineNo?: string | null;
  customerRelNo?: string | null;
  customerLineItemNo?: number | null;
  customerNo?: string | null;
  projectId?: string | null;
  activitySeq?: number | null;
  owningCustomerNo?: string | null;
  createdBy?: string | null;
  rowversion?: string | null;
  rowkey?: string | null;
  rowstate?: string | null;
}

/**
 * Üretim Emri - Frontend kullanımı
 */
export interface ShopOrder {
  orderNo: string;
  orderCode: string;
  contract: string;
  partNo: string;
  revisedStartDate?: string;
  revisedDueDate?: string;
  needDate?: string;
  completeDate?: string;
  revisedQtyDue?: number;
  qtyComplete?: number;
  operationScrapped?: number;
  noteText?: string;
  customerOrderNo?: string;
  customerLineNo?: string;
  customerRelNo?: string;
  customerLineItemNo?: number;
  customerNo?: string;
  projectId?: string;
  activitySeq?: number;
  owningCustomerNo?: string;
  createdBy?: string;
  rowversion?: string;
  rowkey?: string;
  rowstate?: string;
}

/**
 * Üretim Emri Oluşturma DTO
 */
export interface ShopOrderCreateDto {
  orderNo: string;
  orderCode: string;
  contract: string;
  partNo: string;
  revisedStartDate?: string;
  revisedDueDate?: string;
  needDate?: string;
  revisedQtyDue?: number;
  noteText?: string;
  customerOrderNo?: string;
  customerLineNo?: string;
  customerRelNo?: string;
  customerLineItemNo?: number;
  customerNo?: string;
  projectId?: string;
  activitySeq?: number;
  owningCustomerNo?: string;
  rowstate?: string;
}

/**
 * Üretim Emri Güncelleme DTO
 */
export interface ShopOrderUpdateDto {
  revisedStartDate?: string;
  revisedDueDate?: string;
  needDate?: string;
  completeDate?: string;
  revisedQtyDue?: number;
  qtyComplete?: number;
  operationScrapped?: number;
  noteText?: string;
  customerOrderNo?: string;
  customerLineNo?: string;
  customerRelNo?: string;
  customerLineItemNo?: number;
  customerNo?: string;
  projectId?: string;
  activitySeq?: number;
  owningCustomerNo?: string;
  rowstate?: string;
  rowversion?: string;
}

/**
 * Malzeme Tahsisi (Shop Material Allocation) - API Response
 */
export interface ShopMaterialAllocApiResponse {
  contract: string;
  orderNo: string;
  lineItemNo: number;
  partNo: string;
  operationNo?: number | null;
  createDate?: string | null;
  qtyAssigned?: number | null;
  qtyIssued?: number | null;
  qtyPerAssembly?: number | null;
  qtyRequired?: number | null;
  noteText?: string | null;
  activitySeq?: number | null;
  projectId?: string | null;
  catchQtyIssued?: number | null;
  qtyScr ?: number | null;
  rowversion?: string | null;
  rowkey?: string | null;
  rowstate?: string | null;
}

/**
 * Malzeme Tahsisi - Frontend kullanımı
 */
export interface ShopMaterialAlloc {
  contract: string;
  orderNo: string;
  lineItemNo: number;
  partNo: string;
  operationNo?: number;
  createDate?: string;
  qtyAssigned?: number;
  qtyIssued?: number;
  qtyPerAssembly?: number;
  qtyRequired?: number;
  noteText?: string;
  activitySeq?: number;
  projectId?: string;
  catchQtyIssued?: number;
  qtyScr ?: number;
  rowversion?: string;
  rowkey?: string;
  rowstate?: string;
}

/**
 * Malzeme Tahsisi Oluşturma DTO
 */
export interface ShopMaterialAllocCreateDto {
  contract: string;
  orderNo: string;
  lineItemNo: number;
  partNo: string;
  operationNo?: number;
  qtyAssigned?: number;
  qtyPerAssembly?: number;
  qtyRequired?: number;
  noteText?: string;
  activitySeq?: number;
  projectId?: string;
  rowstate?: string;
}

/**
 * Malzeme Tahsisi Güncelleme DTO
 */
export interface ShopMaterialAllocUpdateDto {
  operationNo?: number;
  qtyAssigned?: number;
  qtyIssued?: number;
  qtyPerAssembly?: number;
  qtyRequired?: number;
  noteText?: string;
  activitySeq?: number;
  projectId?: string;
  catchQtyIssued?: number;
  qtyScr ?: number;
  rowstate?: string;
  rowversion?: string;
}