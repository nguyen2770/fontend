import { post, get, patch, deleteRequest } from "./restApi";

export const getCalibrationWorkDocumentsByCalibrationWorkId = (payload) => {
  return get(
    `calibrationWorkDocuments/get-calibration-work-documents-by-calibration-work-id`,
    {
      ...payload,
    },
  );
};
export const createCalibrationWorkDocuments = (payload) => {
  return post(`calibrationWorkDocuments/create`, {
    ...payload,
  });
};
export const deleteCalibrationWorkDocuments = (id, payload) => {
  return deleteRequest(`calibrationWorkDocuments/delete/` + id, {
    ...payload,
  });
};
