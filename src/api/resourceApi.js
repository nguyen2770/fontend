import { post, get, generateFullUrl, deleteRequest, postData, getBlob } from "./restApi";
import { baseURL } from "./config";

export const getListAssets = (payload) => {
  return get(`asset/get-list`, { ...payload });
};
export const uploadImage = (_body) => {
  return postData("resource/upload-image", _body);
};
export const getImage = (_id) => {
  return generateFullUrl(`/resource/image/` + _id);
};
export const deleteImage = (payload) => {
  return deleteRequest("resource/:id", { ...payload });
};
export const getSizeUsed = (payload) => {
  return get(`resource/get-size-used`, { ...payload });
};
export const downloadImage = (_id) => {
  return getBlob(`/resource/image/` + _id);
};
export const previewResource = (_id) => {
  return get(`resource/file-preview/` + _id);
};
