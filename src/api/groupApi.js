import { post, get, patch, deleteRequest } from "./restApi";

export const getListGroups = (payload) => {
  return get("group/get-list", { ...payload });
};
export const createGroup = (payload) => {
  return post("group/create", { ...payload });
};
export const getGroupById = (payload) => {
  return get("group/get-by-id", { ...payload });
};
export const getAllGroup = (payload) => {
  return get("group/get-all", { ...payload });
};
export const updateGroup = (payload) => {
  return patch("group/update", { ...payload });
};
export const updateGroupStatus = (payload) => {
  return patch("group/update-status", { ...payload });
};
export const deleteGroup = (payload) => {
  return deleteRequest("group/delete", { ...payload });
};
