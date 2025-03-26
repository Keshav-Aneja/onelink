import { ApiError } from "@onelink/entities/errros";
import { IActionConfig, IActionResponse } from "../../interfaces";
import parseResponse from "./parser";
import createURL from "./url-generator";

export default async function request<T>(
  url: string,
  config: IActionConfig,
  options: RequestInit,
) {
  const endpoint = createURL(
    { baseURL: config.baseURL, prefix: config.prefix },
    url,
  );
  console.log("SENDING FINAL OPTIONS ", options.body);
  const response = await fetch(endpoint, options);
  const resData = (await parseResponse<T>(response)) as IActionResponse;
  if (!response.ok) {
    if (!resData.success) {
      // TODO: in future call the notification service here
      throw new ApiError(resData.error ?? resData.message);
    } else {
      //FIXME: :D Change this later
      throw new Error(`${response.status} - ${response.body?.toString()}`);
    }
  }
  return resData;
}
