import { post, get, patch, deleteRequest } from './restApi';

export const getListRequestPurchases = (payload) => {
    return get('request-purchase/get-list', { ...payload });
}
export const createRequestPurchase = (payload) => {
    return post('request-purchase/create', { ...payload });
}
export const getRequestPurchaseById = (payload) => {
    return get('request-purchase/get-by-id', { ...payload });
}
export const getAllRequestPurchase = (payload) => {
    return get('request-purchase/get-all', { ...payload });
}
export const updateRequestPurchase= (payload) => {
    return patch('request-purchase/update', { ...payload });
}
export const updateRequestPurchaseStatus = (payload) => {
    return patch('request-purchase/update-status', { ...payload });
}
export const deleteRequestPurchase = (payload) => {
    return deleteRequest('request-purchase/delete', { ...payload });
}
export const getRequestPurchasesDetailById = (payload) => {
    return get('request-purchase/get-detail-by-id', { ...payload });

}
