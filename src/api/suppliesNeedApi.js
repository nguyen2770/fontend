import { post, get, patch, deleteRequest } from './restApi';

export const getListSuppliesNeeds = (payload) => {
    return get('supplies-need/get-list', { ...payload });
}
export const createSuppliesNeed = (payload) => {
    return post('supplies-need/create', { ...payload });
}
export const getSuppliesNeedById = (payload) => {
    return get('supplies-need/get-by-id', { ...payload });
}
export const getAllSuppliesNeed = (payload) => {
    return get('supplies-need/get-all', { ...payload });
}
export const updateSuppliesNeed= (payload) => {
    return patch('supplies-need/update', { ...payload });
}
export const updateSuppliesNeedAction = (payload) => {
    return patch('supplies-need/update-action', { ...payload });
}
export const deleteSuppliesNeed = (payload) => {
    return deleteRequest('supplies-need/delete', { ...payload });
}

export const getSuppliesNeedDetailById = (payload) => {
    return get('supplies-need/get-detail-by-id', {...payload})
}
