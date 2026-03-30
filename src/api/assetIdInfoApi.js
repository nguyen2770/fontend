import { post, get, patch, deleteRequest } from "./restApi";

export const createAssetIdInfo = (payload) => {
  return post("assetIdInfo/create", { ...payload });
};
export const getAssetIdInfoById = (payload) => {
  return get("assetIdInfo/get-by-id", { ...payload });
};
export const getAssetIdInfoByIdAssetMaintenance = (payload) => {
  return get("assetIdInfo/get-list-for-assetMaintenance", { ...payload });
};
export const updateAssetIdInfo = (payload) => {
  return patch("assetIdInfo/update", { ...payload });
};
export const updateAssetIdInfoStatus = (payload) => {
  return patch("assetIdInfo/update-status", { ...payload });
};
export const deleteAssetIdInfo = (payload) => {
  return deleteRequest("assetIdInfo/delete", { ...payload });
};
