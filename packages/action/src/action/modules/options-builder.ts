import { OptionsInit } from "../../interfaces";
import { defaultHeaders, defaultOptions } from "./config";

export default function buildOptions(
  method: string,
  options?: OptionsInit,
  headers?: HeadersInit,
  data?: any,
): RequestInit {
  const reqHeaders = { ...defaultHeaders, ...headers } as Record<
    string,
    string
  >;
  const reqOptions = { ...defaultOptions, ...options };
  const baseOptions = { headers: reqHeaders, ...reqOptions, method };

  if (method !== "GET" && method !== "HEAD") {
    if (data instanceof FormData) {
      delete reqHeaders["Content-Type"];
      // Learning: I don't need to explicitly set the headers for the formData browser will detect the formData and automatically add the header as well as a boundary, setting it manually as before can cause issues in processing the request
      // reqHeaders["Content-Type"] = "multipart/form-data";
      return { ...baseOptions, body: data };
    } else {
      return { ...baseOptions, body: data ? JSON.stringify(data) : null };
    }
  }
  return baseOptions;
}
