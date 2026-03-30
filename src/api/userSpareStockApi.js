import { post, get, patch, deleteRequest } from "./restApi";

export const getListUserSpareStocks = (payload) => {
  return get("user-spare-stock/list", { ...payload });
};

export const createUserSpareStock = (payload) => {
  return post("user-spare-stock/create", { ...payload });
};

export const getUserSpareStockById = (payload) => {
  return get("user-spare-stock/get-by-id", { ...payload });
};

export const updateUserSpareStock = (payload) => {
  return patch("user-spare-stock/update", { ...payload });
};

export const getUserSpareStocks = (payload) => {
  return get("user-spare-stock/get-all", { ...payload });
};

export const deleteUserSpareStock = (payload) => {
  return deleteRequest("user-spare-stock/delete", { ...payload });
};

export const getUserSpareStockBySparePartId = (payload) => {
  return get("user-spare-stock/get-by-sparePartId", { ...payload });
}