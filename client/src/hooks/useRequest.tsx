import { HmacSHA512 } from "crypto-js";
import { config } from "../config";

interface DataResponse {
  msg: string;
  hash: string | null;
}

interface UseRequest {
  updateData: (data?: string) => Promise<void>;
  getData: () => Promise<DataResponse>;
  validateResponse: (msg: string, hashFromServer: string | null) => boolean;
}

const generateHash = (msg: string): string =>
  HmacSHA512(msg, config.salt).toString();

const isValidMsg = (msg: string, hash: string | null): boolean => {
  if (!hash) {
    return false;
  }
  const msgHash = generateHash(msg);
  return msgHash === hash;
};

export const defaultHeaders = {
  Accept: "application/json",
  "Content-Type": "application/json",
};

export const useRequest = (): UseRequest => {
  const getData = async (): Promise<DataResponse> => {
    const response = await fetch(config.apiUrl, { mode: "cors" });
    const { headers } = response;
    const { data } = await response.json();
    const hashFromServer: string | null = headers.get("X-Bequest-Hash");
    return { msg: data, hash: hashFromServer };
  };

  const updateData = async (data?: string): Promise<void> => {
    const msg = {
      body: { data },
    };
    const hash = generateHash(JSON.stringify(msg));

    const myHeaders = new Headers({
      ...defaultHeaders,
      "X-Bequest-Hash": hash,
    });

    await fetch(config.apiUrl, {
      method: "POST",
      body: JSON.stringify({ data }),
      headers: myHeaders,
    });
  };

  const validateResponse = (
    msg: string,
    hashFromServer: string | null,
  ): boolean => {
    const body = JSON.stringify({ body: { data: msg } });
    return isValidMsg(body, hashFromServer);
  };

  return { updateData, getData, validateResponse };
};
