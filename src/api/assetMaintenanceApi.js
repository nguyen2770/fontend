import { post, get, patch, deleteRequest } from "./restApi";

export const getListAssetMaintenances = (payload) => {
  return patch("assetMaintenance/get-list", { ...payload });
};
export const createAssetMaintenance = (payload) => {
  return post("assetMaintenance/create", { ...payload });
};
export const getAssetMaintenanceById = (payload) => {
  return get("assetMaintenance/get-by-id", { ...payload });
};
export const getAllDowntime = (id) => {
  return get("assetMaintenance/get-all-downtime/" + id, {});
};
export const getAllAssetMaintenance = (payload) => {
  return get("assetMaintenance/get-all", { ...payload });
};
export const updateAssetMaintenance = (payload) => {
  return patch("assetMaintenance/update", { ...payload });
};
export const updateAssetMaintenanceStatus = (payload) => {
  return patch("assetMaintenance/update-status", { ...payload });
};
export const deleteAssetMaintenance = (payload) => {
  return deleteRequest("assetMaintenance/delete", { ...payload });
};
export const deleteManyAssetMaintenance = (payload) => {
  return deleteRequest("assetMaintenance/delete-list", { ...payload });
};
export const getAllSubAssetMaintenance = (payload) => {
  return get("assetMaintenance/get-all-sub", { ...payload });
};
export const getAssetModalByRes = (payload) => {
  return get("assetMaintenance/get-asset-model-by-res", { ...payload });
};
export const getAllAsssetModel = (payload) => {
  return get("assetMaintenance/get-all-asset-model", { ...payload });
};
export const getAllAsssetMaintenanceByRes = (payload) => {
  return get("assetMaintenance/get-asset-maintenance-res", { ...payload });
};
export const createAssetMaintenanceLocationHistory = (payload) => {
  return post("assetMaintenance/create-location-history", { ...payload });
};
export const getAssetMaintenanceLocationHistoryByRes = (payload) => {
  return get("assetMaintenance/get-location-history-by-res", { ...payload });
};
export const getAssetSummary = (payload) => {
  return patch("assetMaintenance/get-asset-summary", { ...payload });
};
export const getAssetMaintenanceDueInspections = (payload) => {
  return get("assetMaintenance/get-asset-maintenance-due-inspections", {
    ...payload,
  });
};
export const getCurrentAssetNumber = (payload) => {
  return get("assetMaintenance/get-current-asset-number", { ...payload });
};
export const getAssetMaintenanceChecklistByRes = (payload) => {
  return patch("assetMaintenance/get-asset-maintenance-checklist-by-res", {
    ...payload,
  });
};
export const updateAssetMaintenanceChecklistByAssetMaintenance = (payload) => {
  return patch(
    "assetMaintenance/update-asset-maintenance-checklist-by-asset-maintenance",
    { ...payload },
  );
};
export const requestCancelAsset = (payload) => {
  return patch("assetMaintenance/update-cancel-asset", { ...payload });
};
export const approveCancelAsset = (payload) => {
  return patch("assetMaintenance/approve-cancel-asset", { ...payload });
};
export const getPropertyAccessoriesByAssetMaintenance = (payload) => {
  return patch(
    "assetMaintenance/get-property-accessories-by-asset-maintenance",
    { ...payload },
  );
};
export const mapPropertyAccessoriesWithAssetMaintenance = (payload) => {
  return patch(
    "assetMaintenance/map-property-accessories-with-asset-maintenance",
    { ...payload },
  );
};
export const getPropertyAccessoriesNotMap = (payload) => {
  return patch("assetMaintenance/get-property-accessories-not-map", {
    ...payload,
  });
};
export const deleteParentIdInPropertyAccessories = (payload) => {
  return deleteRequest(
    "assetMaintenance/delete-parentId-in-property-pccessories",
    { ...payload },
  );
};
export const updateStatus = (payload) => {
  return patch("assetMaintenance/update-asset-status", {
    ...payload,
  });
};
export const requestReturnAsset = (payload) => {
  return patch("assetMaintenance/update-return-asset", { ...payload });
};
export const approveReturnAsset = (payload) => {
  return patch("assetMaintenance/approve-return-asset", { ...payload });
};

export const disposalAsset = (payload) => {
  return patch("assetMaintenance/disposal-asset", { ...payload });
};