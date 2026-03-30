import { post, get, patch, deleteRequest } from './restApi';

export const getListReturnToSupplier = (payload) => {
    return get('return-supplier/get-list', { ...payload });
}
export const createReturnToSupplier = (payload) => {
    return post('return-supplier/create', { ...payload });
}
export const getReturnToSupplierById = (payload) => {
    return get('return-supplier/get-by-id', { ...payload });
}
export const getAllReturnToSupplier = (payload) => {
    return get('return-supplier/get-all', { ...payload });
}
export const updateReturnToSupplier= (payload) => {
    return patch('return-supplier/update', { ...payload });
}

export const deleteReturnToSupplier = (payload) => {
    return deleteRequest('return-supplier/delete', { ...payload });
}
export const getReturnToSupplierDetailById = (payload) => {
    return get('return-supplier/get-detail-by-id', { ...payload });

}

export const getCurrentQtyByPurchaseOrderId = (payload) => {
    return get('return-supplier/get-current-qty', { ...payload });
}
