import {
  IActionConfig,
  IActionResponse,
  OptionsInit,
} from "../interfaces/common";
import { IAction } from "../interfaces/action.interface";
import mergeConfig from "./modules/config";
import buildOptions from "./modules/options-builder";
import request from "./modules/create-request";

export class Action implements IAction {
  private readonly config: IActionConfig;
  constructor(
    baseURL: string,
    prefix?: string,
    options?: OptionsInit,
    headers?: HeadersInit,
  ) {
    this.config = mergeConfig(baseURL, prefix, options, headers);
  }

  async get<T = any>(
    url: string,
    options?: OptionsInit,
    headers?: HeadersInit,
  ): Promise<IActionResponse> {
    const requestOptions = buildOptions(
      "GET",
      { ...this.config.options, ...options },
      { ...this.config.headers, ...headers },
    );
    return await request<T>(url, this.config, requestOptions);
  }

  async post<T = any>(
    url: string,
    data?: any,
    options?: OptionsInit,
    headers?: HeadersInit,
  ): Promise<IActionResponse> {
    const requestOptions = buildOptions(
      "POST",
      { ...this.config.options, ...options },
      { ...this.config.headers, ...headers },
      data,
    );
    return await request<T>(url, this.config, requestOptions);
  }

  async patch<T = any>(
    url: string,
    data?: any,
    options?: OptionsInit,
    headers?: HeadersInit,
  ): Promise<IActionResponse> {
    const requestOptions = buildOptions(
      "PATCH",
      { ...this.config.options, ...options },
      { ...this.config.headers, ...headers },
      data,
    );
    console.log("COMING HERE DATA", data);
    return await request<T>(url, this.config, requestOptions);
  }

  async delete<T = any>(
    url: string,
    options?: OptionsInit,
    headers?: HeadersInit,
  ): Promise<IActionResponse> {
    const requestOptions = buildOptions(
      "DELETE",
      { ...this.config.options, ...options },
      { ...this.config.headers, ...headers },
    );
    return await request<T>(url, this.config, requestOptions);
  }
}
