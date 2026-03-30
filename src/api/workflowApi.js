import { post, get, patch, deleteRequest } from './restApi';


export const getAllWorkflows = (payload) => {
    return get('workflow/get-all', { ...payload });
}
export const getWorkflowById = (id, payload = {}) => {
    return get('workflow/get-by-id/' + id, payload);
}

export const updateWorkflow = (id, payload = {}) => {
    return patch('workflow/update/' + id, payload);
}