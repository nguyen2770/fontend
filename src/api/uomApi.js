import { post, get, patch, deleteRequest, postData } from "./restApi";

export const getListUom = (payload) => {
  return get("uom/get-list", { ...payload });
}
export const getAllUom = (payload) => {
  return get("uom/get-all", { ...payload });
}
export const getNameUomById = (payload) => {
  return get("uom/get-by-id", { ...payload })
}
export const createUom = (payload) => {
  return post("uom/create", { ...payload });
};
export const updateUom = (payload) => {
  return patch("uom/update", { ...payload });
};
export const deleteUom = (payload) => {
  return deleteRequest("uom/delete", { ...payload });
};
export const uploadUomExcel = (_body) => {
  return postData('uom/upload-uom', _body);
}