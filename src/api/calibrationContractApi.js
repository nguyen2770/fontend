import { post, get, patch, deleteRequest } from "./restApi";

export const createCalibrationContract = (payload) => {
  return post("calibrationContract/create", { ...payload });
};
export const getCalibrationContracts = (payload) => {
  return patch("calibrationContract/get-list", { ...payload });
};
export const getCalibrationContractById = (id, payload) => {
  return get("calibrationContract/get-by-id/" + id, payload);
};
export const deleteCalibrationContract = (id, payload) => {
  return patch("calibrationContract/delete/" + id, payload);
};
export const updateCalibrationContract = (payload) => {
  return patch("calibrationContract/update", payload);
};
export const createCalibrationContractMappingAssetMaintenance = (payload) => {
  return post(
    "calibrationContract/create-calibration-contract-mapping-asset-maintenance",
    { ...payload }
  );
};
export const getCalibrationContractMappingAssetMaintenanceByRes = (payload) => {
  return patch(
    "calibrationContract/get-calibration-contract-mapping-asset-maintenance-by-res",
    { ...payload }
  );
};
export const deleteCalibrationContractMappingAssetMaintenance = (id) => {
  return patch(
    "calibrationContract/delete-calibration-contract-mapping-asset-maintenance/" +
      id
  );
};
