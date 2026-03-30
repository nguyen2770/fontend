import { post, get, patch, deleteRequest } from "./restApi";

export const getListPreventives = (payload) => {
  return patch("preventive/get-list", { ...payload });
};
export const createPreventive = (payload) => {
  return post("preventive/create", { ...payload });
};
export const getPreventiveById = (payload) => {
  return get("preventive/get-by-id", { ...payload });
};
export const getAllPreventive = (payload) => {
  return get("preventive/get-all", { ...payload });
};
export const getResAssignUserByPreventive = (payload) => {
  return get("preventive/get-re-assign-user-by-preventive", { ...payload });
};
export const updatePreventive = (payload) => {
  return patch("preventive/update", { ...payload });
};
export const stopPreventive = (payload) => {
  return patch("preventive/stop-preventive", { ...payload });
};
export const startPreventive = (payload) => {
  return patch("preventive/start-preventive", { ...payload });
};
export const deletePreventive = (payload) => {
  return deleteRequest("preventive/delete", { ...payload });
};
export const createPreventiveComment = (payload) => {
  return post("preventive/create-preventive-comment", { ...payload });
};
export const getPreventiveComments = (payload) => {
  return get("preventive/get-preventive-comment", { ...payload });
};
export const getPreventiveByConditionBasedSchedule = (payload) => {
  return patch("preventive/get-preventive-by-condition-base-schedule", {
    ...payload,
  });
};
export const generateSchedulePrenventiveByPreventiveConditionBasedSchedule = (
  payload
) => {
  return patch(
    "preventive/generate-schedule-preventive-by-preventive-condition-based-schedule",
    {
      ...payload,
    }
  );
};
export const getAllPreventiveConditionBasedScheduleHistoryByPreventive = (
  payload
) => {
  return patch(
    "preventive/get-all-preventive-condition-based-schedule-history-by-preventive",
    {
      ...payload,
    }
  );
};
export const changeOfContractPreventive = (payload) => {
  return patch("preventive/change-of-contract", { ...payload });
};