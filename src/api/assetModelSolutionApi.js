import { post, get, patch, deleteRequest, postData } from './restApi';

export const getListAssetModelSolutions = (payload) => {
    return get('asset-model-solution/get-list', { ...payload });
}
export const createAssetModelSolution = (payload) => {
    return post('asset-model-solution/create', { ...payload });
}
export const getAssetModelSolutionById = (id) => {
    return get('asset-model-solution/get-by-id/' + id, {});
}
export const getAllAssetModelSolution = (payload) => {
    return get('asset-model-solution/get-all', { ...payload });
}
export const updateAssetModelSolution = (id, payload) => {
    return patch('asset-model-solution/update/' + id, { ...payload });
}
export const updateAssetModelSolutionStatus = (id) => {
    return patch('asset-model-solution/update-status/' + id, {});
}
export const deleteAssetModelSolution = (payload) => {
    return deleteRequest('asset-model-solution/delete', { ...payload });
}
export const uploadAssetModelSolutionExcel = (payload) => {
    return postData('asset-model-solution/upload-excel', payload);
}
