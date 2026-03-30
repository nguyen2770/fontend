import { post, get, patch, deleteRequest, postData } from "./restApi";

export const getListSuppliers = (payload) => {
  return get("supplier/get-list", { ...payload });
};
export const createSupplier = (payload) => {
  return post("supplier/create", { ...payload });
};
export const getSupplierById = (payload) => {
  return get("supplier/get-by-id", { ...payload });
};
export const getAllSupplier = (payload) => {
  return get("supplier/get-all", { ...payload });
};
export const updateSupplier = (payload) => {
  return patch("supplier/update", { ...payload });
};
export const updateSupplierStatus = (payload) => {
  return patch("supplier/update-status", { ...payload });
};
export const deleteSupplier = (payload) => {
  return deleteRequest("supplier/delete", { ...payload });
};
export const uploadSupplierExcel = (payload) => {
  return postData("supplier/upload-supplier", payload);
};
