import ENV from "./env";

export const PATH = {
  login: "/login",
  home: "/home",
};

export const API = {
  login: `${ENV.API_BASE_URL}/auth/login`,
  me: `${ENV.API_BASE_URL}/auth/me`,
  contacts: `${ENV.API_BASE_URL}/contacts`,
  deletecontact: (id) => `${ENV.API_BASE_URL}/contacts/${id}`,
  editcontact: (id) => `${ENV.API_BASE_URL}/contacts/${id}`,
};
