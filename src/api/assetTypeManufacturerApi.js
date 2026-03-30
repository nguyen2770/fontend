import { post, get, patch, deleteRequest } from './restApi';

export const getListAssetTypeManufacturers = (payload) => {
    return get('assetTypeManufacturer/get-list', { ...payload });
}
export const createAssetTypeManufacturer = (payload) => {
    return post('assetTypeManufacturer/create', { ...payload });
}
export const getAssetTypeManufacturerById = (payload) => {
    return get('assetTypeManufacturer/get-by-id', { ...payload });
}
export const getAllAssetTypeManufacturer = (payload) => {
    return get('assetTypeManufacturer/get-all', { ...payload });
}
export const updateAssetTypeManufacturer = (payload) => {
    return patch('assetTypeManufacturer/update', { ...payload });
}
export const deleteAssetTypeManufacturer = (payload) => {
    return deleteRequest('assetTypeManufacturer/delete', { ...payload });
}
export const updateManufacturersOfAssetType = (payload) => {
    return post('assetTypeManufacturer/update-assetType', { ...payload });
}
export const getAssetTypeManufacturerByAssetType = (payload) => {
    return get('assetTypeManufacturer/get-by-assetType', { ...payload });
}
export const getAssetTypeManufacturerByAsset = (payload) => {
    return get('assetTypeManufacturer/get-by-asset', { ...payload });
}