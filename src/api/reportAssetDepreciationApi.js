import { post, get, patch, deleteRequest } from './restApi';

export const getAssetDepreciationReport = (payload) => {
    return patch('reportAssetDepreciation/get-report', { ...payload });
}
export const getDetailAssetDepreciationReport = (payload) => {
    return patch('reportAssetDepreciation/get-detail-report', { ...payload });
}
export const getFullAssetDepreciationReport = (payload) => {
    return patch('reportAssetDepreciation/get-full-report', { ...payload });
}
