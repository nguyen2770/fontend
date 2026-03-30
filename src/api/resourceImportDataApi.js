import {
  post,
  get,
  patch,
  deleteRequest,
  postData,
  generateFullUrl,
} from "./restApi";
import { baseURL } from "./config";

export const uploadDocumentResourceImportData = (_body) => {
  return postData("resourceImportData/upload-image", _body);
};
export const getDocumentResourceImportData = (_id) => {
  return `${generateFullUrl()}/resourceImportData/image/` + _id;
};
export const deleteDocumentResourceImportData = (payload) => {
  return deleteRequest("resourceImportData/:id", { ...payload });
};
export const getListResourceImportDataAssetMaintenance = (payload) => {
  return get("resourceImportData/get-lits-assetMaintenance", { ...payload });
};
export const confirmCloseFileDeletion = (payload) => {
  return patch("resourceImportData/comfirm-colse-delele", { ...payload });
};
export const confirmDeleteFile = (payload) => {
  return patch("resourceImportData/comfirm-delele-file", { ...payload });
};
