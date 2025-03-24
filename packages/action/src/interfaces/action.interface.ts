import { IActionResponse, OptionsInit } from "./common";

export interface IAction {
  get(
    url: string,
    options?: OptionsInit,
    headers?: HeadersInit,
  ): Promise<IActionResponse>;
  delete(
    url: string,
    options?: OptionsInit,
    headers?: HeadersInit,
  ): Promise<IActionResponse>;
  post(
    url: string,
    data?: any,
    options?: OptionsInit,
    headers?: HeadersInit,
  ): Promise<IActionResponse>;
  patch(
    url: string,
    data?: any,
    options?: OptionsInit,
    headers?: HeadersInit,
  ): Promise<IActionResponse>;
}
