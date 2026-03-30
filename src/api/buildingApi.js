import { post, get, patch, deleteRequest, postData } from './restApi';

export const getListBuildings = (payload) => {
    return get('building/get-list', { ...payload });
}
export const createBuilding = (payload) => {
    return post('building/create', { ...payload });
}
export const getBuildingById = (payload) => {
    return get('building/get-by-id', { ...payload });
}
export const getAllBuilding = (payload) => {
    return get('building/get-all', { ...payload });
}
export const updateBuilding = (payload) => {
    return patch('building/update', { ...payload });
}
export const updateBuildingStatus = (payload) => {
    return patch('building/update-status', { ...payload });
}
export const deleteBuilding = (payload) => {
    return deleteRequest('building/delete', { ...payload });
}
export const uploadBuildingExcel = (_body) => {
    return postData('building/upload-building', _body);
}