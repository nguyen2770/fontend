import { post, get, patch, deleteRequest } from './restApi';

export const getListRegions = (payload) => {
    return get('region/get-list', { ...payload });
}
export const createRegion = (payload) => {
    return post('region/create', { ...payload });
}
export const getRegionById = (payload) => {
    return get('region/get-by-id', { ...payload });
}
export const getAllRegion = (payload) => {
    return get('region/get-all', { ...payload });
}
export const updateRegion= (payload) => {
    return patch('region/update', { ...payload });
}
export const deleteRegion = (payload) => {
    return deleteRequest('region/delete', { ...payload });
}
