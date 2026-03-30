import { post, get, patch, deleteRequest } from './restApi';

export const getListAssetTypes = (payload) => {
    return get('assetType/get-list', { ...payload });
}
export const createAssetType = (payload) => {
    return post('assetType/create', { ...payload });
}
export const getAssetTypeById = (payload) => {
    return get('assetType/get-by-id', { ...payload });
}
export const getAllAssetType = (payload) => {
    return get('assetType/get-all', { ...payload });
}
export const updateAssetType= (payload) => {
    return patch('assetType/update', { ...payload });
}
export const updateAssetTypeStatus = (payload) => {
    return patch('assetType/update-status', { ...payload });
}
export const deleteAssetType = (payload) => {
    return deleteRequest('assetType/delete', { ...payload });
}

export const getAssetTypeByAsset = (payload) => {
    return get('assetType/get-by-asset', { ...payload });
}
