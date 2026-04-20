import { post, get, patch, deleteRequest } from './restApi';

export const getListAssetModel = (payload) => {
    return get('assetModel/get-list', { ...payload });
}
export const getAssetModelByAssetTypeAndAsset = (payload) => {
    return get('assetModel/get-assetType-assetType-asset', { ...payload });
}
export const createAssetModel = (payload) => {
    return post('assetModel/create', { ...payload });
}
export const getAssetModelById = (id) => {
    return get('assetModel/get-by-id/' + id, {});
}
export const getAssetModelByAssetId = (payload) => {
    return get('assetModel/get-by-assetId', { ...payload });
}
export const getAllAssetModel = (payload) => {
    return get('assetModel/get-all', { ...payload });
}
export const updateAssetModel = (id, payload) => {
    return patch('assetModel/update/' + id, { ...payload });
}
export const updateAssetModelStatus = (id) => {
    return patch('assetModel/update-status/' + id, {});
}
export const deleteAssetModel = (payload) => {
    return deleteRequest('assetModel/delete', { ...payload });
}
export const getListAssetModelStock = (payload) => {
    return get('assetModel/get-list-inventory', { ...payload });
}