import { post, get, patch, deleteRequest } from "./restApi";

export const createAssetModelChecklist = (payload) => {
  return post("assetModelChecklist/create", { ...payload });
};
export const updateAssetModelChecklist = (assetModelId, payload) => {
  return patch("assetModelChecklist/update/" + assetModelId, { ...payload });
};
export const getAssetModelChecklistByRes = ( payload) => {
  return patch("assetModelChecklist/get-by-res", {
    ...payload,
  });
};
