import { post, get, patch, deleteRequest } from './restApi';

export const getListCities = (payload) => {
    return get('city/get-list', { ...payload });
}
export const createCity = (payload) => {
    return post('city/create', { ...payload });
}
export const getCityById = (payload) => {
    return get('city/get-by-id', { ...payload });
}
export const getAllCity = (payload) => {
    return get('city/get-all', { ...payload });
}
export const updateCity= (payload) => {
    return patch('city/update', { ...payload });
}
export const updateCityStatus = (payload) => {
    return patch('city/update-status', { ...payload });
}
export const deleteCity = (payload) => {
    return deleteRequest('city/delete', { ...payload });
}

export const getCityByStateId = (payload) => {
    return get('city/get-by-state-id', { ...payload });
}
