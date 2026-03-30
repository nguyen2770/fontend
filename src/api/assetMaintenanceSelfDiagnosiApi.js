import { post, get, patch, deleteRequest } from './restApi';

export const getResById = (payload) => {
    return get('assetMaintenanceSelfDiagnosi/get-res-by-id', { ...payload });
}
export const createAssetMaintenanceSeftDiagnosi = (payload) => {
    return post('assetMaintenanceSelfDiagnosi/create', { ...payload });
}
export const getAssetMaintenanceSeftDiagnosiById = (payload) => {
    return get('assetMaintenanceSelfDiagnosi/get-by-id', { ...payload });
}
export const getAllAssetMaintenanceSeftDiagnosi = (payload) => {
    return get('assetMaintenanceSelfDiagnosi/get-all', { ...payload });
}
export const getDefectNotUsedInSeftDiagnosi = (payload) => {
    return get('assetMaintenanceSelfDiagnosi/get-defect-not-used', { ...payload });
}
export const updateAssetMaintenanceSeftDiagnosi= (payload) => {
    return patch('assetMaintenanceSelfDiagnosi/update', { ...payload });
}
export const updateAssetMaintenanceSeftDiagnosiStatus = (payload) => {
    return patch('assetMaintenanceSelfDiagnosi/update-status', { ...payload });
}
export const deleteAssetMaintenanceSeftDiagnosi = (payload) => {
    return deleteRequest('assetMaintenanceSelfDiagnosi/delete', { ...payload });
}
