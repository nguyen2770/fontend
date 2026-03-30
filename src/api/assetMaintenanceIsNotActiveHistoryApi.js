import { post, get, patch, deleteRequest } from './restApi';

export const getAssetMaintenanceIsNotActiveHistoryByAssetMaintenance = (payload) => {
    return get('assetMaintenanceIsNotActiveHistory/get-by-asset-maintenance', { ...payload });
}
