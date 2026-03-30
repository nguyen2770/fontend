import { post, get, patch, deleteRequest } from "./restApi";

export const createCalibrationWork = (payload) => {
  return post("calibrationWork/create", { ...payload });
};
export const getCalibrationWorks = (payload) => {
  return patch("calibrationWork/get-list", { ...payload });
};
export const deleteCalibrationWorkById = (id, payload) => {
  return patch("calibrationWork/delete/" + id, payload);
};
export const comfirmCancelCalibrationWorkById = (id, payload) => {
  return patch("calibrationWork/comfirm-cancel/" + id, payload);
};
export const assignUserCalibrationWork = (payload) => {
  return patch("calibrationWork/assign-user", payload);
};
export const reassignmentCalibrationWorkAssignUser = (payload) => {
  return patch("calibrationWork/reassignment-calibration-work", payload);
};
export const getCalibrationWorkById = (id, payload) => {
  return get("calibrationWork/get-by-id/" + id, payload);
};
export const getMyCalibrationWorks = (payload) => {
  return patch("calibrationWork/get-list-my-calibration-work", { ...payload });
};
export const comfirmAcceptCalibrationWork = (payload) => {
  return patch("calibrationWork/comfirm-accept", payload);
};
export const comfirmRejectCalibrationWork = (payload) => {
  return patch("calibrationWork/comfirm-reject", payload);
};
export const getCalibrationWorkAssignUserById = (id, payload) => {
  return get("calibrationWork/get-by-id-assign-user/" + id, payload);
};
export const calibratedComfirm = (payload) => {
  return patch("calibrationWork/calibrated-comfirm", payload);
};
export const comfirmCloseCalibrationWork = (payload) => {
  return patch("calibrationWork/comfirm-close-calibration-work", payload);
};
export const comfirmReOpenCalibrationWork = (payload) => {
  return patch("calibrationWork/comfirm-reopen-calibration-work", payload);
};
export const getAllCalibrationWorkHistorys = (id, payload) => {
  return get("calibrationWork/get-all-calibration-work-history/" + id, payload);
};
export const createCalibrationWorkComment = (payload) => {
  return post("calibrationWork/create-calibration-work-comment", {
    ...payload,
  });
};
export const getCalibrationWorkComments = (payload) => {
  return patch("calibrationWork/get-calibration-work-comment", { ...payload });
};
export const getGroupCalibrationWorks = (payload) => {
  return patch("calibrationWork/get-group-calibration-work", payload);
};
export const getTotalCalibrationWorkByGroupStatus = (payload) => {
  return patch(
    "calibrationWork/get-total-calibration-work-by-group-status",
    payload
  );
};
export const getTotalCalibrationWorkAssignUserByStatus = (payload) => {
  return get(
    "calibrationWork/get-total-calibration-work-assign-user-by-status",
    payload
  );
};
export const getAssetCalibrationWorkHistorys = (payload) => {
  return patch("calibrationWork/get-calibration-work-history", payload);
};

export const getCalibrationWorkHistory = (payload) => {
  return get("calibrationWork/get-calibration-work-history", payload);
};
export const updateCalibratedComfirm = (payload) => {
  return patch("calibrationWork/update-calibrated-comfirm", payload);
};