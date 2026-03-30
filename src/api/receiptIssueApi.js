import { post, get, patch, deleteRequest } from './restApi';

export const getListReceiptIssue = (payload) => {
    return get('receipt-issue/get-list', { ...payload });
}
export const createReceiptIssue = (payload) => {
    return post('receipt-issue/create', { ...payload });
}
export const getReceiptIssueById = (payload) => {
    return get('receipt-issue/get-by-id', { ...payload });
}
export const getAllReceiptIssue = (payload) => {
    return get('receipt-issue/get-all', { ...payload });
}
export const updateReceiptIssue = (payload) => {
    return patch('receipt-issue/update', { ...payload });
}
export const deleteReceiptIssue = (payload) => {
    return deleteRequest('receipt-issue/delete', { ...payload });
}
export const getReceiptIssueDetailById = (payload) => {
    return get('receipt-issue/get-detail-by-id', { ...payload });
}
export const getCurrentQtyByPurchaseOrderId = (payload) => {
    return get('receipt-issue/get-current-qty', { ...payload });
}
export const approve = (payload) => {
    return post('receipt-issue/approve', { ...payload });
}
