import { post, get, patch, deleteRequest } from './restApi';

export const getListSuppliesNeedSpareParts = (payload) => {
    return get('supplies-need-spare-part/get-list', { ...payload });
}
export const createSuppliesNeedSparePart = (payload) => {
    return post('supplies-need-spare-part/create', { ...payload });
}
export const getSuppliesNeedSparePartById = (payload) => {
    return get('supplies-need-spare-part/get-by-id', { ...payload });
}
export const getSuppliesNeedSparePartBySuppliesNeed = (payload) => {
    return get('supplies-need-spare-part/get-by-supplies-need', { ...payload });
}
export const getAllSuppliesNeedSparePart = (payload) => {
    return get('supplies-need-spare-part/get-all', { ...payload });
}
export const updateSuppliesNeedSparePart= (payload) => {
    return patch('supplies-need-spare-part/update', { ...payload });
}
export const updateSuppliesNeedSparePartStatus = (payload) => {
    return patch('supplies-need-spare-part/update-status', { ...payload });
}

export const deleteSuppliesNeedSparePart = (payload) => {
    return deleteRequest('supplies-need-spare-part/delete', { ...payload });
}
