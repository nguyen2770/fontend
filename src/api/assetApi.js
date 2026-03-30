import { post, get, patch, deleteRequest } from './restApi';

export const getListAssets = (payload) => {
    return get('asset/get-list', { ...payload });
}
export const getAssetByRes = (payload) => {
    return get('asset/get-by-res', { ...payload });
}
export const createAsset = (payload) => {
    return post('asset/create', { ...payload });
}
export const getAssetById = (payload) => {
    return get('asset/get-by-id', { ...payload });
}
export const getAllAsset = (payload) => {
    return get('asset/get-all', { ...payload });
}
export const updateAsset= (payload) => {
    return patch('asset/update', { ...payload });
}
export const updateAssetStatus = (payload) => {
    return patch('asset/update-status', { ...payload });
}
export const deleteAsset = (payload) => {
    return deleteRequest('asset/delete', { ...payload });
}
