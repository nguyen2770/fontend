import { get, post, patch } from './restApi';

export const getWorkReportByPerson = (payload) => {
    return patch('workReportByPerson/get-report', { ...payload });
}
export const getResource = (payload) => {
    return get('workReportByPerson/get-document', { ...payload });
}
export const getListWorkReportByPerson = (payload) => {
    return post('workReportByPerson/get-list-work', { ...payload });
}
// export const getFileZip = (payload) => {
//     return post('workReportByPerson/download-zip', { ...payload });
// }