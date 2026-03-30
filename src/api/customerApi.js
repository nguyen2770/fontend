import { post, get, patch, deleteRequest, postData } from './restApi';

export const getListCustomers = (payload) => {
    return get('customer/get-list', { ...payload });
}
export const createCustomer = (payload) => {
    return post('customer/create', { ...payload });
}
export const getCustomerById = (payload) => {
    return get('customer/get-by-id', { ...payload });
}
export const getAllCustomer = (payload) => {
    return get('customer/get-all', { ...payload });
}
export const updateCustomer = (payload) => {
    return patch('customer/update', { ...payload });
}
export const updateCustomerStatus = (payload) => {
    return patch('customer/update-status', { ...payload });
}
export const deleteCustomer = (payload) => {
    return deleteRequest('customer/delete', { ...payload });
}
export const insertManyCustomer = (payload) => {
    return post('customer/insertMany', { ...payload });
}
export const uploadCustomerExcel = (payload) => {
    return postData('customer/upload-customer', payload);
}