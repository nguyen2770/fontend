import { post, get } from "./restApi";

export const createOrigin = (payload) => {
  return post("origin/create", { ...payload });
};
export const getOriginById = (payload) => {
  return get("origin/get-by-id", { ...payload });
};
export const getAllOrigin = (payload) => {
  return get("origin/get-all", { ...payload });
};

