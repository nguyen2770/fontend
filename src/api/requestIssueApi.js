import { post, get, patch, deleteRequest } from './restApi';

export const getListRequestIssues = (payload) => {
    return get('request-issue/get-list', { ...payload });
}
export const createRequestIssue = (payload) => {
    return post('request-issue/create', { ...payload });
}
export const getRequestIssueById = (payload) => {
    return get('request-issue/get-by-id', { ...payload });
}
export const getAllRequestIssue = (payload) => {
    return get('request-issue/get-all', { ...payload });
}
export const updateRequestIssue= (payload) => {
    return patch('request-issue/update', { ...payload });
}
export const deleteRequestIssue = (payload) => {
    return deleteRequest('request-issue/delete', { ...payload });
}
export const getRequestIssuesDetailById = (payload) => {
    return get('request-issue/get-detail-by-id', { ...payload });

}

export const updateAction= (payload) => {
    return patch('request-issue/update-action', { ...payload });
}
