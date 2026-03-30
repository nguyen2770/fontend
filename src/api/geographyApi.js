import { post, get, patch, deleteRequest } from './restApi';

export const getAllCommunes = (payload) => {
    return get('geography/get-all-communes', { ...payload });
}
export const getAllCommunesByProvince = (payload) => {
    return get('geography/get-all-communes-by-province', { ...payload });
}
export const getAllProvinces = (payload) => {
    return get('geography/get-all-provinces', { ...payload });
}