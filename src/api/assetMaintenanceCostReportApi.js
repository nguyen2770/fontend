import { get } from "./restApi";

export const getReport = (payload) => {
    return get("assetMaintenanceCostReport/get-report", { ...payload });
};