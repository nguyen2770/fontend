import { post, get, patch, deleteRequest } from "./restApi";

export const getListManufacturers = (payload) => {
  return get("manufacturer/get-list", { ...payload });
};
export const createManufacturer = (payload) => {
  return post("manufacturer/create", { ...payload });
};
export const getManufacturerById = (payload) => {
  return get("manufacturer/get-by-id", { ...payload });
};
export const getAllManufacturer = (payload) => {
  return get("manufacturer/get-all", { ...payload });
};
export const updateManufacturer = (payload) => {
  return patch("manufacturer/update", { ...payload });
};
export const deleteManufacturer = (payload) => {
  return deleteRequest("manufacturer/delete", { ...payload });
};
