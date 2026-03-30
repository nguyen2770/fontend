import { post, get, patch, deleteRequest } from "./restApi";

export const getPropertyInspections = (payload) => {
  return patch("propertyInspection/get-list", { ...payload });
};
export const getPropertyInspectionById = (id, payload) => {
  return get("propertyInspection/get-by-id/" + id, { ...payload });
};
export const cancelPropertyInspection = (payload) => {
  return patch("propertyInspection/cancel-property-inspection", { ...payload });
};
export const closePropertyInspection = (payload) => {
  return patch("propertyInspection/close-property-inspection", { ...payload });
};
export const createPropertyInspection = (payload) => {
  return post(`propertyInspection/create`, { ...payload });
};
export const updatePropertyInspectionById = (payload) => {
  return patch("propertyInspection/update", { ...payload });
};
