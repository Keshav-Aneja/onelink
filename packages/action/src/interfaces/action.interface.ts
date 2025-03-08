import { IActionResponse, OptionsInit } from "./common";

export interface IAction {
  get<T>(
    url: string,
    options?: OptionsInit,
    headers?: HeadersInit,
  ): Promise<IActionResponse>;
  delete<T>(
    url: string,
    options?: OptionsInit,
    headers?: HeadersInit,
  ): Promise<IActionResponse>;
  post<T>(
    url: string,
    data?: any,
    options?: OptionsInit,
    headers?: HeadersInit,
  ): Promise<IActionResponse>;
  patch<T>(
    url: string,
    data?: any,
    options?: OptionsInit,
    headers?: HeadersInit,
  ): Promise<IActionResponse>;
}
