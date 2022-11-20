import { KeyObject } from "./common";

type Options = {
    timeout?: number,
    headers?: KeyObject,
    method?: string,
    data?: unknown,
}

export const METHODS = {
  GET: "GET",
  POST: "POST",
  PUT: "PUT",
  DELETE: "DELETE",
};

function queryStringify(data: KeyObject) {
  if(typeof data !== "object") {
    throw new Error("Data must be object");
  }
  const keys = Object.keys(data);
  return keys.reduce((result, key, index) => `${result}${key}=${data[key]}${index < keys.length - 1 ? "&" : ""}`, "?");
}

export class HTTPTransport {
  static get(url: string, options: Options = {}) {
    return HTTPTransport.request(url, { ...options, method: METHODS.GET }, options.timeout);
  }

  static post(url: string, options: Options = {}) {
    return HTTPTransport.request(url, { ...options, method: METHODS.POST }, options.timeout);
  }

  static put(url: string, options: Options = {}) {
    return HTTPTransport.request(url, { ...options, method: METHODS.PUT }, options.timeout);
  }

  static delete(url: string, options: Options = {}) {
    return HTTPTransport.request(url, { ...options, method: METHODS.DELETE }, options.timeout);
  }

  static request(url: string, options: Options = {}, timeout = 5000) {
    const { headers = {}, method, data } = options;

    return new Promise((resolve, reject) => {
      if (!method) {
        reject(new Error("No method"));
        return;
      }

      const xhr = new XMLHttpRequest();
      const isGet = method === METHODS.GET;

      xhr.open(
        method,
        isGet && !!data ? `${url}${queryStringify(data)}` : url,
      );

      Object.keys(headers).forEach((key) => {
        xhr.setRequestHeader(key, headers[key]);
      });

      xhr.onload = () => {
        resolve(xhr);
      };

      xhr.onabort = reject;
      xhr.onerror = reject;
      xhr.timeout = timeout;
      xhr.ontimeout = reject;
      xhr.withCredentials = true;
      if (isGet || !data) {
        xhr.send();
      }else if(headers.mimeType === "multipart/form-data") {
        xhr.send(data as any);
      }else{
        xhr.send(JSON.stringify(data));
      }
    });
  }
}
