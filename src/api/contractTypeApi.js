import { post, get, patch, deleteRequest } from './restApi';

export const getListContractTypes = (payload) => {
    return get('contractTypeRoute/get-list', { ...payload });
}
export const createContractType = (payload) => {
    return post('contractTypeRoute/create', { ...payload });
}
export const getContractTypeById = (payload) => {
    return get('contractTypeRoute/get-by-id', { ...payload });
}
export const getAllContractType = (payload) => {
    return get('contractTypeRoute/get-all', { ...payload });
}
export const updateContractType= (payload) => {
    return patch('contractTypeRoute/update', { ...payload });
}
export const deleteContractType = (payload) => {
    return deleteRequest('contractTypeRoute/delete', { ...payload });
}
