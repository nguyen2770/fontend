import { post, get, patch, deleteRequest } from './restApi';

export const getListAssetTypeCategorys = (payload) => {
    return get('assetTypeCategory/get-list', { ...payload });
}
export const createAssetTypeCategory = (payload) => {
    return post('assetTypeCategory/create', { ...payload });
}
export const getAssetTypeCategoryById = (payload) => {
    return get('assetTypeCategory/get-by-id', { ...payload });
}
export const getAllAssetTypeCategory = (payload) => {
    return get('assetTypeCategory/get-all', { ...payload });
}
export const updateAssetTypeCategory = (payload) => {
    return patch('assetTypeCategory/update', { ...payload });
}
export const updateAssetTypeCategoryStatus = (payload) => {
    return patch('assetTypeCategory/update-status', { ...payload });
}
export const deleteAssetTypeCategory = (payload) => {
    return deleteRequest('assetTypeCategory/delete', { ...payload });
}
