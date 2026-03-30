import { post, get, patch, deleteRequest, postData } from './restApi';

export const getListAssetModelParameters = (payload) => {
    return get('asset-model-parameter/get-list', { ...payload });
}
export const createAssetModelParameter = (payload) => {
    return post('asset-model-parameter/create', { ...payload });
}
export const getAssetModelParameterById = (payload) => {
    return get('asset-model-parameter/get-by-id', { ...payload });
}
export const getAllAssetModelParameter = (payload) => {
    return get('asset-model-parameter/get-all', { ...payload });
}
export const updateAssetModelParameter = (id, payload) => {
    return patch('asset-model-parameter/update/' + id, { ...payload });
}
export const deleteAssetModelParameter = (payload) => {
    return deleteRequest('asset-model-parameter/delete', { ...payload });
}
export const uploadAssetModelParameterExcel = (payload) => {
    return postData('asset-model-parameter/upload-asset-model-parameter', payload);
}
