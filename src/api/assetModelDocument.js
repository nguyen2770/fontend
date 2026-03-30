import { post, get, patch, deleteRequest } from './restApi';

export const getListAssetModelDocuments = (payload) => {
    return get('assetModelDocument/get-list', { ...payload });
}
export const createAssetModelDocument = (payload) => {
    return post('assetModelDocument/create', { ...payload });
}
export const updateAssetModelDocument = (id, payload) => {
    return patch('assetModelDocument/update/' + id, { ...payload });
}
export const deleteAssetModelDocument = (payload) => {
    return deleteRequest('assetModelDocument/delete', { ...payload });
}
export const getAssetModelDocumentByAssetModel = (payload) => {
    return get('assetModelDocument/getAll', { ...payload });
}
export const getAssetModelDocumentById = (payload) => {
    return get('assetModelDocument/get-by-id', { ...payload });
}