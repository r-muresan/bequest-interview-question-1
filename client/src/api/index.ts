import { savedToken } from "../functions/index.ts";

const API_URL = "http://localhost:8080";
export const login = async (name: string, password: string) => {
  const response = await fetch(API_URL + "/login", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, password }),
  });
  const json = await response.json();

  savedToken(json.token);
  return json;
};
export const getDataUser = async (token) => {
  const response = await fetch(API_URL + "/user", {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      authorization: `bearer ${token}`,
    },
  });
  const data = await response.json();
  console.log("response server", data);
  return data;
};

export const updateDataUser = async (
  name: string | undefined,
  token: string | null
) => {
  const res = await fetch(API_URL + "/update", {
    method: "PATCH",
    body: JSON.stringify({ name }),
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      authorization: `bearer ${token}`,
    },
  });
  const json = await res.json();
  console.log("json", json);
  return json;
};

export const getHistoryListNames = async (token: string | null) => {
  const response = await fetch(API_URL + "/get-changes-usernames", {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      authorization: `bearer ${token}`,
    },
  });
  const data = await response.json();

  return data;
};
