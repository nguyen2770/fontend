import { post, get, patch, deleteRequest } from './restApi';

export const getResById = (payload) => {
    return get('asset-model-spare-part/get-res-by-id', { ...payload });
}
export const createAssetModelSparePart = (payload) => {
    return post('asset-model-spare-part/create', { ...payload });
}
export const getAssetModelSparePartById = (payload) => {
    return get('asset-model-spare-part/get-by-id', { ...payload });
}
export const getAllAssetModelSparePart = (payload) => {
    return get('asset-model-spare-part/get-all', { ...payload });
}
export const updateAssetModelSparePart = (payload) => {
    return patch('asset-model-spare-part/update', { ...payload });
}
export const deleteAssetModelSparePart = (payload) => {
    return deleteRequest('asset-model-spare-part/delete', { ...payload });
}
