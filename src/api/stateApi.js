import { post, get, patch, deleteRequest } from './restApi';

export const getListStates = (payload) => {
    return get('state/get-list', { ...payload });
}
export const createState = (payload) => {
    return post('state/create', { ...payload });
}
export const getStateById = (payload) => {
    return get('state/get-by-id', { ...payload });
}
export const getAllState = (payload) => {
    return get('state/get-all', { ...payload });
}
export const updateState= (payload) => {
    return patch('state/update', { ...payload });
}
export const updateStateStatus = (payload) => {
    return patch('state/update-status', { ...payload });
}
export const deleteState = (payload) => {
    return deleteRequest('state/delete', { ...payload });
}
export const getStateByCountryId = (payload) => {


    return post('state/get-by-country-id', { ...payload });
}
