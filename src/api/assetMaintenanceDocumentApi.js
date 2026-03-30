import { post, get, patch, deleteRequest } from './restApi';

export const getResById = (payload) => {
    return get('assetMaintenanceDocument/get-res-by-id', { ...payload });
}
export const createAssetMaintenanceDocument = (payload) => {
    return post('assetMaintenanceDocument/create', { ...payload });
}
export const getAssetMaintenanceDocumentById = (payload) => {
    return get('assetMaintenanceDocument/get-by-id', { ...payload });
}
export const getAllAssetMaintenanceDocument = (payload) => {
    return get('assetMaintenanceDocument/get-all', { ...payload });
}
export const updateAssetMaintenanceDocument= (payload) => {
    return patch('assetMaintenanceDocument/update', { ...payload });
}
export const updateAssetMaintenanceDocumentStatus = (payload) => {
    return patch('assetMaintenanceDocument/update-status', { ...payload });
}
export const deleteAssetMaintenanceDocument = (payload) => {
    return deleteRequest('assetMaintenanceDocument/delete', { ...payload });
}
