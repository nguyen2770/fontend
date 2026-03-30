import { get, post } from "./restApi";

export const getSpareParts = (payload) => {
  return get("inventory/get-spare-parts", { ...payload });
};

export const getAssetModels = (payload) => {
  return get("inventory/get-asset-models", { ...payload });
};

export const getInventorySpareParts = (payload) => {
  return post("inventory/get-spare-parts-inventory", { ...payload });
};

export const getInventoryDetail = (payload) => {
  return get("inventory/get-detail", { ...payload });
};
