import { post, get, patch, deleteRequest, postData } from "./restApi";
import * as restGateway from "./restGatewayApi";
export const getListUser = (payload) => {
  return get("users/get-list", { ...payload });
};
export const createUser = async (payload) => {
  let res = await post("users/create", { ...payload });
  if (res && res.id) {
    return post("users/create", { ...res.user });
  }
  return;
};
export const getUserById = (payload) => {
  const { userId, ...params } = payload;
  return get(`users/get-by-id/${userId}`, { ...params });
};
export const updateUser = async (userId, payload) => {
  let res = await patch(`users/update/${userId}`, payload);
  if (res && res.id) {
    return patch(`users/update/${userId}`, payload);
  }
  return;
};
export const updateUserStatus = (payload) => {
  patch("users/update-status", { ...payload });
  return patch("users/update-status", { ...payload });
};
export const deleteUser = (payload) => {
  const { userId, ...rest } = payload;
  deleteRequest(`users/delete/${userId}`, { ...rest });
  return deleteRequest(`users/delete/${userId}`, { ...rest });
};
export const getAllUser = (payload) => {
  return get("users/getAll", { ...payload });
};
export const updateUserBranchs = (userId, payload) => {
  return patch(`users/update-branchs/${userId}`, payload);
};
export const getUserBranchs = (userId) => {
  return patch(`users/get-branchs/${userId}`, {});
};
export const getPermissions = () => {
  return get(`users/get-permissions`, {});
};
export const getDataUser = () => {
  return get(`users/get-data-user`, {});
};
export const updateCompanySetting = (payload) => {
  return patch(`users/update-company-setting`, payload);
};
export const getPermissisonByUsers = () => {
  return get(`users/get-permission-by-user`, {});
};
export const updateLastLoginTime = () => {
  return patch(`users/update-last-login-time`, {});
};
export const uploadUserExcel = (_body) => {
  return postData('users/upload-user', _body);
}
export const getListUserKS = (payload) => {
  return get("users/get-list_ks", { ...payload });
};