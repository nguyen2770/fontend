import { post, get, patch, deleteRequest } from './restApi';

export const getListStockLocation = (payload) => {
    return get('stockLocation/get-list', { ...payload });
}

export const updateStockLocation = (payload) => {
    return patch('stockLocation/update', { ...payload });
}

export const createStockLocation = (payload) => {
    return post('stockLocation/create', { ...payload });
}