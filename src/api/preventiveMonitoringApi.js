import { post, get, patch, deleteRequest } from "./restApi";

export const getPreventiveMonitorings = (payload) => {
  return patch("preventiveMonitoring/get-list", { ...payload });
};

export const updatePreventiveMonitoringById = (id, payload) => {
  return patch(`preventiveMonitoring/update-preventive-monitoring/${id}`, {
    ...payload,
  });
};
export const getPreventiveMonitoringHistorys = (payload) => {
  return patch("preventiveMonitoring/get-list-preventive-monitoring", {
    ...payload,
  });
};
