import { post, get, patch, deleteRequest } from "./restApi";

export const createPreventiveTaskAssignUser = (payload) => {
  return post("preventiveTaskAssignUser/create", { ...payload });
};

export const getPreventiveAssignUserByPreventiveId = (payload) => {
  return get("preventiveTaskAssignUser/get-by-preventive", { ...payload });
};
export const updateStatus = (payload) => {
  return patch("preventiveTaskAssignUser/update-status", { ...payload });
};