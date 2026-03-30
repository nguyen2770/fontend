import { post, get, patch, deleteRequest } from './restApi';

export const getResById = (payload) => {
    return get('assetMaintenanceSchedule/get-res-by-id', { ...payload });
}
export const createAssetMaintenanceSchedule = (payload) => {
    return post('assetMaintenanceSchedule/create', { ...payload });
}
export const getAssetMaintenanceScheduleById = (payload) => {
    return get('assetMaintenanceSchedule/get-by-id', { ...payload });
}
export const getAllAssetMaintenanceSchedule = (payload) => {
    return get('assetMaintenanceSchedule/get-all', { ...payload });
}
export const updateAssetMaintenanceSchedule= (payload) => {
    return patch('assetMaintenanceSchedule/update', { ...payload });
}
export const deleteAssetMaintenanceSchedule = (payload) => {
    return deleteRequest('assetMaintenanceSchedule/delete', { ...payload });
}
