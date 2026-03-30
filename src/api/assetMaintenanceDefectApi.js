import { post, get, patch, deleteRequest } from './restApi';

export const getResById = (payload) => {
    return get('assetMaintenanceDefect/get-res-by-id', { ...payload });
}
export const createAssetMaintenanceDefect = (payload) => {
    return post('assetMaintenanceDefect/create', { ...payload });
}
export const getAssetMaintenanceDefectById = (payload) => {
    return get('assetMaintenanceDefect/get-by-id', { ...payload });
}
export const getAllAssetMaintenanceDefect = (payload) => {
    return get('assetMaintenanceDefect/get-all', { ...payload });
}
export const updateAssetMaintenanceDefect= (payload) => {
    return patch('assetMaintenanceDefect/update', { ...payload });
}
export const updateAssetMaintenanceDefectStatus = (payload) => {
    return patch('assetMaintenanceDefect/update-status', { ...payload });
}
export const deleteAssetMaintenanceDefect = (payload) => {
    return deleteRequest('assetMaintenanceDefect/delete', { ...payload });
}
