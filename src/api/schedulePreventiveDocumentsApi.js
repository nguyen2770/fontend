import { post, get, patch, deleteRequest } from "./restApi";

export const getSchedulePreventiveDocumentBySchedulePreventive = (payload) => {
  return patch(
    `schedulePreventiveDocuments/get-schedule-preventive-documents-by-schedule-preventive`,
    {
      ...payload,
    },
  );
};
export const deleteSchedulePreventiveDocumentById = (id, payload) => {
  return deleteRequest(
    `schedulePreventiveDocuments/delete-schedule-preventive-documents-by-id/` +
      id,
    {
      ...payload,
    },
  );
};
export const createSchedulePreventiveDocument = (payload) => {
  return post(
    `schedulePreventiveDocuments/create-schedule-preventive-document`,
    {
      ...payload,
    },
  );
};
