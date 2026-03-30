import { post, get, patch, deleteRequest, postData } from './restApi';

export const getListBranches = (payload) => {
    return get('branch/get-list', { ...payload });
}
export const createBranch = (payload) => {
    return post('branch/create', { ...payload });
}
export const getBranchById = (payload) => {
    return get('branch/get-by-id', { ...payload });
}
export const getAllBranch = (payload) => {
    return get('branch/get-all', { ...payload });
}
export const updateBranch = (payload) => {
    return patch('branch/update', { ...payload });
}
export const updateBranchStatus = (payload) => {
    return patch('branch/update-status', { ...payload });
}
export const deleteBranch = (payload) => {
    return deleteRequest('branch/delete', { ...payload });
}
export const uploadBranchExcel = (payload) => {
    return postData("branch/upload-branch", payload);
};
