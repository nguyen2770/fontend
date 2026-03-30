import { post, get, patch, deleteRequest, postData } from './restApi';
import { baseURL } from "./config";


export const uploadAssetMaintenanceExcel = (_body) => {
    return postData('importData/upload', _body);
}
export const uploadCategoryExcel = (_body) => {
    return postData('importData/upload-category', _body);
}
export const uploadSubCategoryExcel = (_body) => {
    return postData('importData/upload-sub-category', _body);
}
export const uploadAssetExcel = (_body) => {
    return postData('importData/upload-asset', _body);
}
export const uploadSpareCategoryExcel = (_body) => {
    return postData('importData/upload-spare-category', _body);
}
export const uploadSpareSubCategoryExcel = (_body) => {
    return postData('importData/upload-spare-sub-category', _body);
}
export const uploadManufacturerExcel = (_body) => {
    return postData('importData/upload-manufacturer', _body);
}