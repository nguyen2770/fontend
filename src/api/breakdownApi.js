import { post, get, patch, deleteRequest } from "./restApi";

export const getListBreakdowns = (payload) => {
  return post("breakdown/get-list", { ...payload });
};
export const createBreakdown = (payload) => {
  return post("breakdown/create", { ...payload });
};
export const getBreakdownById = (payload) => {
  return get("breakdown/get-by-id", { ...payload });
};
export const getAllBreakdown = (payload) => {
  return get("breakdown/get-all", { ...payload });
};
export const getAllSubBreakdown = (payload) => {
  return get("breakdown/get-all-sub", { ...payload });
};
export const updateBreakdown = (payload) => {
  return patch("breakdown/update", { ...payload });
};
export const deleteBreakdown = (payload) => {
  return deleteRequest("breakdown/delete", { ...payload });
};
export const getBreakdownComments = (payload) => {
  return get("breakdown/get-breakdown-comment", { ...payload });
};
export const createBreakdownComment = (payload) => {
  return post("breakdown/create-breakdown-comment", { ...payload });
};
export const comfirmCloseBreakdown = (payload) => {
  return post("breakdown/comfirm-close-breakdown", { ...payload });
};
export const comfirmReopenBreakdown = (payload) => {
  return post("breakdown/comfirm-reopen-breakdown", { ...payload });
};
export const comfirmCancelBreakdown = (payload) => {
  return patch("breakdown/comfirm-cancel-breakdown", { ...payload });
};
export const getAllBreakdownAttachment = (payload) => {
  return get('breakdown/get-all-breakdown-attachment', { ...payload });
};
export const getTotalBreakdwonStatus = (payload) => {
  return patch('breakdown/get-total-breakdown-status', { ...payload });
};
export const getAssetIncidentHistorys = (payload) => {
  return patch("breakdown/get-asset-incident-history", { ...payload });
};
export const getAllAttachmentByBreackdown = (payload) => {
  return get('breakdown/get-all-attachment-by-breakdown', { ...payload });
};