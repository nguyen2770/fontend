import { post, get, patch, deleteRequest } from './restApi';

export const getListPurchaseQuotation = (payload) => {
    return get('purchase-quotation/get-list', { ...payload });
}
export const createPurchaseQuotation = (payload) => {
    return post('purchase-quotation/create', { ...payload });
}
export const getPurchaseQuotationById = (payload) => {
    return get('purchase-quotation/get-by-id', { ...payload });
}
export const getAllPurchaseQuotation = (payload) => {
    return get('purchase-quotation/get-all', { ...payload });
}
export const updatePurchaseQuotation= (payload) => {
    return patch('purchase-quotation/update', { ...payload });
}

export const deletePurchaseQuotation = (payload) => {
    return deleteRequest('purchase-quotation/delete', { ...payload });
}

export const getPurchaseQuotationDetailById = (payload) => {
    return get('purchase-quotation/get-detail-by-id', { ...payload });

}

export const getPurchaseQuotationDetail = (payload) => {
    return get('purchase-quotation/get-detail', { ...payload });

}

export const getCurrentQtyByPurchaseOrderId = (payload) => {
    return get('purchase-quotation/get-current-qty', { ...payload });
}

export const getQuotationInfo = (payload) => {
    return get('purchase-quotation/get-info', { ...payload });
}

export const getPurchaseQuotation = (payload) => {
    return get('purchase-quotation/get-quotation', { ...payload });
}

export const getQuotationAttachmentByQuotation = (payload) => {
    return get('purchase-quotation/get-attachment', { ...payload });
}
