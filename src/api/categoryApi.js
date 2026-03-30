import { post, get, patch, deleteRequest } from './restApi';

export const getListCategories = (payload) => {
    return get('category/get-list', { ...payload });
}
export const createCategory = (payload) => {
    return post('category/create', { ...payload });
}
export const getCategoryById = (payload) => {
    return get('category/get-by-id', { ...payload });
}
export const getAllCategory = (payload) => {
    return get('category/get-all', { ...payload });
}
export const updateCategory = (payload) => {
    return patch('category/update', { ...payload });
}
export const updateCategoryStatus = (payload) => {
    return patch('category/update-status', { ...payload });
}
export const deleteCategory = (payload) => {
    return deleteRequest('category/delete', { ...payload });
}
