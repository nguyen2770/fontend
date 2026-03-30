import { post, get, patch, deleteRequest } from "./restApi";

export const getListPreventiveOfModels = (payload) => {
  return patch("preventiveOfModel/get-list", { ...payload });
};
export const createPreventiveOfModel = (payload) => {
  return post("preventiveOfModel/create", { ...payload });
};
export const getPreventiveOfModelById = (payload) => {
  return get("preventiveOfModel/get-by-id", { ...payload });
};
export const getTotalPreventiveByPreventiveOfModel = (payload) => {
  return get("preventiveOfModel/get-count-preventive-by-prevetive-of-model", { ...payload });
};
// export const getResAssignUserByPreventive = (payload) => {
//   return get("preventive/get-re-assign-user-by-preventive", { ...payload });
// };
export const updatePreventiveOfModel = (payload) => {
  return patch("preventiveOfModel/update", { ...payload });
};
export const stopPreventiveOfModel = (payload) => {
  return patch("preventiveOfModel/stop-preventive-of-model", { ...payload });
};
export const startPreventiveOfModel = (payload) => {
  return patch("preventiveOfModel/start-preventive-of-model", { ...payload });
};
export const startManyPreventiveOfModel = (payload) => {
  return patch("preventiveOfModel/start-many-preventive-of-model", { ...payload });
};
export const deletePreventiveOfModelById = (payload) => {
  return deleteRequest("preventiveOfModel/delete", { ...payload });
};
// export const createPreventiveComment = (payload) => {
//   return post("preventive/create-preventive-comment", { ...payload });
// };
// export const getPreventiveComments = (payload) => {
//   return get("preventive/get-preventive-comment", { ...payload });
// };
