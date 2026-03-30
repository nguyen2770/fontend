import { post, get, patch, deleteRequest } from "./restApi";

export const getListCustomerSpareStocks = (payload) => {
  return get("customer-spare-stock/list", { ...payload });
};

export const createCustomerSpareStock = (payload) => {
  return post("customer-spare-stock/create", { ...payload });
};

export const getCustomerSpareStockById = (payload) => {
  return get("customer-spare-stock/get-by-id", { ...payload });
};

export const updateCustomerSpareStock = (payload) => {
  return patch("customer-spare-stock/update", { ...payload });
};

export const getCustomerSpareStocks = (payload) => {
  return get("customer-spare-stock/get-all", { ...payload });
};

export const deleteCustomerSpareStock = (payload) => {
  return deleteRequest("customer-spare-stock/delete", { ...payload });
};


export const getCustomerSpareStockBySparePartId = (payload) => {
  return get("customer-spare-stock/get-by-sparePartId", { ...payload });
};