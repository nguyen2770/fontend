import { post, get, patch, deleteRequest } from "./restApi";

export const getListTaxGroups = (payload) => {
  return get("taxGroup/list", { ...payload });
};
export const createTaxGroup = (payload) => {
  return post("taxGroup/create", { ...payload });
};
export const getTaxGroupById = (payload) => {
  return get("taxGroup/get-by-id", { ...payload });
};

export const updateTaxGroup = (payload) => {
  return patch("taxGroup/update", { ...payload });
};

export const getTaxGroups = (payload) => {
  return get("taxGroup/get-all", { ...payload });
};

export const deleteTaxGroup = (payload) => {
  return deleteRequest("taxGroup/delete", { ...payload });
};