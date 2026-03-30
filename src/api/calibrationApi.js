import { post, get, patch, deleteRequest } from "./restApi";

export const createCalibration = (payload) => {
  return post("calibration/create", { ...payload });
};
export const getCalibrations = (payload) => {
  return patch("calibration/get-list", { ...payload });
};
export const deleteCalibrationById = (payload) => {
  return deleteRequest("calibration/delete", { ...payload });
};
export const reassignmentUser = (payload) => {
  return patch("calibration/reassignment-user", { ...payload });
};
export const assignUser = (payload) => {
  return patch("calibration/assign-user", { ...payload });
};
export const updateCalibrationById = (payload) => {
  return patch("calibration/update", { ...payload });
};
export const getCalibrationById = (payload) => {
  return get("calibration/get-by-id", { ...payload });
};
export const stopCalibration = (payload) => {
  return patch("calibration/stop-calibration", { ...payload });
};
export const startCalibration = (payload) => {
  return patch("calibration/start-calibration", { ...payload });
};
export const changeOfContractCalibration = (payload) => {
  return patch("calibration/change-of-calibration-contract", { ...payload });
};

export const oneQACallBack = (payload) => {
  return post("calibration/oneQA-callback", { ...payload });
};