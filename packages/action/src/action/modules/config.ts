import { IActionConfig, OptionsInit } from "../../interfaces";

/**
 *
 * @param baseURL - Ex: http://localhost:8080
 * @param prefix - Ex: "api" or "api/v1" - This will be prefixed like : http://localhost:8080/api/v1
 * @param options - Any default options clke credentials, signals, etc
 * @param headers - Preffered default headers
 * @returns a proper options object to be consumed by fetch API
 */
export default function mergeConfig(
  baseURL: string,
  prefix?: string,
  options?: OptionsInit,
  headers?: HeadersInit,
): IActionConfig {
  return {
    baseURL,
    prefix: prefix ?? "",
    headers: { ...defaultHeaders, ...headers },
    options: { ...defaultOptions, ...options },
  };
}

export const defaultHeaders: HeadersInit = {
  "Content-Type": "application/json;charset=utf-8",
  Accept: "application/json, text/plain, */*",
};

export const defaultOptions: Record<string, string> = {
  method: "GET",
};
