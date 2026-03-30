import { post, get, patch, deleteRequest } from './restApi';

export const getListAssetTypeParameters = (payload) => {
    return get('assetTypeParameter/get-list', { ...payload });
}
export const createAssetTypeParameter = (payload) => {
    return post('assetTypeParameter/create', { ...payload });
}
export const getAssetTypeParameterById = (payload) => {
    return get('assetTypeParameter/get-by-id', { ...payload });
}
export const getAllAssetTypeParameter = (payload) => {
    return get('assetTypeParameter/get-all', { ...payload });
}
export const updateAssetTypeParameter = (id, payload) => {
    return patch('assetTypeParameter/update/' + id, { ...payload });
}
export const deleteAssetTypeParameter = (payload) => {
    return deleteRequest('assetTypeParameter/delete', { ...payload });
}
