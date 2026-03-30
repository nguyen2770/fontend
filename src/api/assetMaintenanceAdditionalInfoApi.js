import { post, get, patch, deleteRequest } from './restApi';

export const getResById = (payload) => {
    return get('assetMaintenanceAdditionalInfo/get-res-by-id', { ...payload });
}
export const createAssetMaintenanceAdditionalInfoPoint = (payload) => {
    return post('assetMaintenanceAdditionalInfo/create', { ...payload });
}
export const getAssetMaintenanceAdditionalInfoById = (payload) => {
    return get('assetMaintenanceAdditionalInfo/get-by-id', { ...payload });
}
export const getAllAssetMaintenanceAdditionalInfo = (payload) => {
    return get('assetMaintenanceAdditionalInfo/get-all', { ...payload });
}
export const updateAssetMaintenanceAdditionalInfo= (payload) => {
    return patch('assetMaintenanceAdditionalInfo/update', { ...payload });
}
export const updateAssetMaintenanceAdditionalInfoStatus = (payload) => {
    return patch('assetMaintenanceAdditionalInfo/update-status', { ...payload });
}
export const deleteAssetMaintenanceAdditionalInfo = (payload) => {
    return deleteRequest('assetMaintenanceAdditionalInfo/delete', { ...payload });
}
