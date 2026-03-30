import { post, get, patch, deleteRequest } from './restApi';

export const getServices = (payload) => {
    return get('service/get-list', { ...payload });
}
export const getAllServices = (payload) => {
    return get('service/get-all', { ...payload });
}
export const createService = (payload) => {
    return post('service/create', { ...payload });
}
export const updateStatus = (id) => {
    return patch('service/update-status/' + id, {});
}
export const update = (id, payload) => {
    return patch('service/update/' + id, payload);
}
export const deleteService = (id, payload) => {
    return deleteRequest('service/delete/' + id, {});
}
export const getServiceById = (id) => {
    return get('service/get/' + id, {});
}