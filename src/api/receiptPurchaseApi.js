import { post, get, patch, deleteRequest } from './restApi';

export const getListReceiptPurchase = (payload) => {
    return get('receipt-purchase/get-list', { ...payload });
}
export const createReceiptPurchase = (payload) => {
    return post('receipt-purchase/create', { ...payload });
}
export const getReceiptPurchaseById = (payload) => {
    return get('receipt-purchase/get-by-id', { ...payload });
}
export const getAllReceiptPurchase = (payload) => {
    return get('receipt-purchase/get-all', { ...payload });
}
export const updateReceiptPurchase = (payload) => {
    return patch('receipt-purchase/update', { ...payload });
}
export const approve = (payload) => {
    return post('receipt-purchase/approve', { ...payload });
}
export const deleteReceiptPurchase = (payload) => {
    return deleteRequest('receipt-purchase/delete', { ...payload });
}
export const getReceiptPurchaseDetailById = (payload) => {
    return get('receipt-purchase/get-detail-by-id', { ...payload });
}
export const getCurrentQtyByPurchaseOrderId = (payload) => {
    return get('receipt-purchase/get-current-qty', { ...payload });
}
