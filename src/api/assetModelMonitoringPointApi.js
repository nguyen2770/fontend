import { post, get, patch, deleteRequest } from './restApi';

export const getResById = (payload) => {
    return get('asset-model-monitoring-point/get-res-by-id', { ...payload });
}
export const createAssetModelMonitoringPoint = (payload) => {
    return post('asset-model-monitoring-point/create', { ...payload });
}
export const getAssetModelMonitoringPointById = (payload) => {
    return get('asset-model-monitoring-point/get-by-id', { ...payload });
}
export const getAllAssetModelMonitoringPoint = (payload) => {
    return get('asset-model-monitoring-point/get-all', { ...payload });
}
export const updateAssetModelMonitoringPoint = (payload) => {
    return patch('asset-model-monitoring-point/update', { ...payload });
}
export const updateAssetModelMonitoringPointStatus = (payload) => {
    return patch('asset-model-monitoring-point/update-status', { ...payload });
}
export const deleteAssetModelMonitoringPoint = (payload) => {
    return deleteRequest('asset-model-monitoring-point/delete', { ...payload });
}
