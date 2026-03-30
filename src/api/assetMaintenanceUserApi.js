import { post, get, patch, deleteRequest } from './restApi';

export const createAssetMaintenanceUser = (payload) => {
    return post('assetMaintenanceUser/create', { ...payload });
}

export const getAllAssetMaintenanceUser = (payload) => {
    return get('assetMaintenanceUser/get-all', { ...payload });
}

export const getAssetMaintenanceUserByUser = (payload) => {
    return get('assetMaintenanceUser/get-by-user', { ...payload });
}

export const getAssetMaintenanceUserByAssetMaintenance = (payload) => {
    return get('assetMaintenanceUser/get-by-asset-maintenance', { ...payload });
}

export const deleteAssetMaintenanceUser = (payload) => {
    return deleteRequest('assetMaintenanceUser/delete', { ...payload });
}

export const getAssetMaintenanceByUser = (payload) => {
    return get('assetMaintenanceUser/get-assetMaintenance-by-user', { ...payload });
}
