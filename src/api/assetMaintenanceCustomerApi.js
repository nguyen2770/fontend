import { post, get, deleteRequest } from './restApi';

export const createAssetMaintenanceCustomer = (payload) => {
    return post('/assetMaintenanceCustomer/create', { ...payload });
}

export const getAssetMaintenanceByCustomer = (payload) => {
    return get('/assetMaintenanceCustomer/get-assetMaintenance-by-customer', { ...payload });
}

export const deleteAssetMaintenanceCustomer = (payload) => {
    return deleteRequest('/assetMaintenanceCustomer/delete', { ...payload });
}

export const getUnassignedAssetMaintenanceCustomer = (payload) => {
    return get('/assetMaintenanceCustomer/get-unassigned-asset-by-customer', { ...payload });
}