import { post, get, patch, deleteRequest, postData } from './restApi';

export const getListAssetModelSeftDiagnosias = (payload) => {
    return get('asset-model-seft-diagnosia/get-list', { ...payload });
}
export const createAssetModelSeftDiagnosia = (payload) => {
    return post('asset-model-seft-diagnosia/create', { ...payload });
}
export const getAssetModelSeftDiagnosiaById = (id) => {
    return get('asset-model-seft-diagnosia/get-by-id/' + id, {});
}
export const getAllAssetModelSeftDiagnosia = (payload) => {
    return get('asset-model-seft-diagnosia/get-all', { ...payload });
}
export const updateAssetModelSeftDiagnosia = (id, payload) => {
    return patch('asset-model-seft-diagnosia/update/' + id, { ...payload });
}
export const updateAssetModelSeftDiagnosiaStatus = (id) => {
    return patch('asset-model-seft-diagnosia/update-status/' + id, {});
}
export const deleteAssetModelSeftDiagnosia = (payload) => {
    return deleteRequest('asset-model-seft-diagnosia/delete', { ...payload });
}
export const uploadExcel = (payload) => {
    return postData('asset-model-seft-diagnosia/upload-excel', payload);
}
