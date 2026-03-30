import { post, get, patch, deleteRequest } from './restApi';

export const getListComplianceTypes = (payload) => {
    return get('complianceTypeRoute/get-list', { ...payload });
}
export const createComplianceType = (payload) => {
    return post('complianceTypeRoute/create', { ...payload });
}
export const getComplianceTypeById = (payload) => {
    return get('complianceTypeRoute/get-by-id', { ...payload });
}
export const getAllComplianceType = (payload) => {
    return get('complianceTypeRoute/get-all', { ...payload });
}
export const updateComplianceType= (payload) => {
    return patch('complianceTypeRoute/update', { ...payload });
}
export const deleteComplianceType = (payload) => {
    return deleteRequest('complianceTypeRoute/delete', { ...payload });
}
