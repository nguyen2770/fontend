import { post, get, patch, deleteRequest } from "./restApi";

export const getNotificationSetting = () => {
  return get("notification/get-notification-setting", {});
};
export const updateNotificationSetting = (payload) => {
  return patch("notification/update-notification-setting", { ...payload });
};
export const getNotificationTypes = (payload) => {
  return get("notification/get-notification-types", { ...payload });
};
export const updateNotificationType = (payload) => {
  return patch("notification/update-notification-type", { ...payload });
};
export const getNotificationUser = (payload) => {
  return patch("notification/get-notification-user", { ...payload });
};
export const deleteNotificationUser = (payload) => {
  return patch("notification/delete-notification-user", { ...payload });
};
export const readNotification = (payload) => {
  return patch("notification/read", { ...payload });
};
export const unReadNotification = (payload) => {
  return patch("notification/un-read", { ...payload });
};
export const readAllNotification = (payload) => {
  return patch("notification/read-all", { ...payload });
};