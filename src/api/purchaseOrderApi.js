import { post, get, patch, deleteRequest } from './restApi';

export const getListPurchaseOrder = (payload) => {
    return get('order-purchase/get-list', { ...payload });
}
export const createOrderPurchase = (payload) => {
    return post('order-purchase/create', { ...payload });
}
export const getOrderPurchaseById = (payload) => {
    return get('order-purchase/get-by-id', { ...payload });
}
export const getAllOrderPurchase = (payload) => {
    return get('order-purchase/get-all', { ...payload });
}
export const updateOrderPurchase= (payload) => {
    return patch('order-purchase/update', { ...payload });
}

export const deleteOrderPurchase = (payload) => {
    return deleteRequest('order-purchase/delete', { ...payload });
}
export const getPurchaseOrderDetailById = (payload) => {
    return get('order-purchase/get-detail-by-id', { ...payload });
}
export const getPurchaseOrderDetail = (payload) => {
    return get('order-purchase/get-detail', { ...payload });
}
