import { post, get, patch, deleteRequest } from "./restApi";

export const createBreakdownAssignUser = (payload) => {
  return post("breakdownAssignUser/create", { ...payload });
};
export const getBreakdownAssignUserByBreakdownId = (payload) => {
  return get("breakdownAssignUser/get-by-breakdownId", { ...payload });
};
export const getBreakdowUserByBreakdownEndWCA = (payload) => {
  return get("breakdownAssignUser/get-by-breakdown-wca", { ...payload });
};
export const updateStatus = (payload) => {
  return patch("breakdownAssignUser/update-status", { ...payload });
};
export const replacementAssignUser = (payload) => {
  return patch("breakdownAssignUser/replecement-assign-user", { ...payload });
};
export const comfirmBreakdownAssignUserFixed = (payload) => {
  return patch(`breakdownAssignUser/comfirm-breakdown-fixed`, { ...payload });
};
export const getTotalMyBreakdownAssignUserStatus = (payload) => {
  return get("breakdownAssignUser/get-total-my-breakdown-assign-user", { ...payload });
};