import { post, get, patch, deleteRequest } from './restApi';


export const getAllRoles = (payload) => {
    return get('role/get-all', { ...payload });
}
export const createRole = (payload) => {
    return post('role/create', { ...payload });
}
export const updateRole = (id, payload) => {
    return patch('role/update/' + id, payload);
}
export const deleteRole = (id, payload) => {
    return deleteRequest('role/delete/' + id, {});
}
export const getRolePermissions = (id, payload) => {
    return get('role/get-role-permissions/' + id, {});
}
export const updateRolePermissions = (id, payload) => {
    return patch('role/update-role-permissions/' + id, payload);
}