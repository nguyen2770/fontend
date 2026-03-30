import { post, get, patch, deleteRequest } from './restApi';

export const getListCountrys = (payload) => {
    return get('country/get-list', { ...payload });
}
export const createCountry = (payload) => {
    return post('country/create', { ...payload });
}
export const getCountryById = (payload) => {
    return get('country/get-by-id', { ...payload });
}
export const getAllCountry = (payload) => {
    return get('country/get-all', { ...payload });
}
export const updateCountry= (payload) => {
    return patch('country/update', { ...payload });
}
export const updateCountryStatus = (payload) => {
    return patch('country/update-status', { ...payload });
}
export const deleteCountry = (payload) => {
    return deleteRequest('country/delete', { ...payload });
}
