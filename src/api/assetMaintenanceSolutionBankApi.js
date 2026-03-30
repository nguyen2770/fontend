import { post, get, patch, deleteRequest } from './restApi';

export const getResById = (payload) => {
    return get('assetMaintenanceSolutionBank/get-res-by-id', { ...payload });
}
export const createAssetMaintenanceSolutionBank = (payload) => {
    return post('assetMaintenanceSolutionBank/create', { ...payload });
}
export const getAssetMaintenanceSolutionBankById = (payload) => {
    return get('assetMaintenanceSolutionBank/get-by-id', { ...payload });
}
export const getAllAssetMaintenanceSolutionBank = (payload) => {
    return get('assetMaintenanceSolutionBank/get-all', { ...payload });
}
export const getDefectNotUsedInSolutionBank = (payload) => {
    return get('assetMaintenanceSolutionBank/get-defect-not-used', { ...payload });
}
export const updateAssetMaintenanceSolutionBank= (payload) => {
    return patch('assetMaintenanceSolutionBank/update', { ...payload });
}
export const updateAssetMaintenanceSolutionBankStatus = (payload) => {
    return patch('assetMaintenanceSolutionBank/update-status', { ...payload });
}
export const deleteAssetMaintenanceSolutionBank = (payload) => {
    return deleteRequest('assetMaintenanceSolutionBank/delete', { ...payload });
}
