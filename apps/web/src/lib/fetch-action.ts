import { ApiError } from "@onelink/entities/errros";
interface OptionsInit {
  credentials?: RequestCredentials;
  cache?: RequestCache;
  mode?: RequestMode;
  priority?: RequestPriority;
  signal?: AbortSignal;
}

interface ActionConfig {
  baseURL: string;
  prefix?: string;
  options?: OptionsInit;
  headers?: HeadersInit;
}

interface ActionStructure {
  success: boolean;
  status: number;
  data: any;
  message: string;
  error?: string;
  cause?: string;
  stackTrace?: string;
  timestamp: string;
}

export default class Action {
  private readonly config: ActionConfig;
  private _defaultOptions: Record<string, string> = {
    method: "GET",
  };
  private _defaultHeaders: HeadersInit = {
    "Content-Type": "application/json;charset=utf-8",
    Accept: "application/json, text/plain, */*",
  };
  constructor(
    baseURL: string,
    prefix?: string,
    options?: OptionsInit,
    headers?: HeadersInit,
  ) {
    this.config = {
      baseURL,
      prefix: prefix ?? "",
      headers: merge(this._defaultHeaders, headers || {}),
      options: merge(this._defaultOptions, options || {}),
    };
  }

  private createURL = (url: string) => {
    const { baseURL, prefix } = this.config;
    return `${baseURL}${prefix ? `/${prefix}/` : "/"}${url}`;
  };

  private async parseResponse<T>(response: Response): Promise<T> {
    const contentType = response.headers.get("content-type");
    if (contentType?.includes("application/json")) return response.json();
    return response.text() as any;
  }

  private getOptions(
    method: string,
    options?: OptionsInit,
    headers?: HeadersInit,
    data?: any,
  ): RequestInit {
    const reqHeaders = merge(headers || {}, this.config.headers || {});
    const reqOptions = merge(options || {}, this.config.options || {});
    const baseOptions = merge({ headers: reqHeaders }, reqOptions, { method });
    if (method !== "GET" && method !== "HEAD") {
      if (data instanceof FormData) {
        delete reqHeaders["Content-Type"];
        // Learning: I don't need to explicitly set the headers for the formData browser will detect the formData and automatically add the header as well as a boundary, setting it manually as before can cause issues in processing the request
        // reqHeaders["Content-Type"] = "multipart/form-data";0.
        return merge(baseOptions, { body: data });
      } else {
        return merge(baseOptions, { body: data ? JSON.stringify(data) : null });
      }
    }
    return baseOptions;
  }

  private async request<T>(url: string, options: RequestInit) {
    const response = await fetch(this.createURL(url), options);
    const resData = (await this.parseResponse<T>(response)) as ActionStructure;
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

  async get<T = any>(
    url: string,
    options?: OptionsInit,
    headers?: HeadersInit,
  ): Promise<ActionStructure> {
    const requestOptions = this.getOptions("GET", options, headers);
    return this.request<T>(url, requestOptions);
  }

  async post<T = any>(
    url: string,
    data: any,
    options?: OptionsInit,
    headers?: HeadersInit,
  ): Promise<ActionStructure> {
    const requestOptions = this.getOptions("POST", options, headers, data);
    return this.request<T>(url, requestOptions);
  }

  async patch<T = any>(
    url: string,
    data: any,
    options?: OptionsInit,
    headers?: HeadersInit,
  ): Promise<ActionStructure> {
    const requestOptions = this.getOptions("PATCH", options, headers, data);
    return this.request<T>(url, requestOptions);
  }

  async delete<T = any>(
    url: string,
    options?: OptionsInit,
    headers?: HeadersInit,
  ): Promise<ActionStructure> {
    const requestOptions = this.getOptions("DELETE", options, headers);
    return this.request<T>(url, requestOptions);
  }
}

function merge(...args: Record<any, any>[]): Record<any, any> {
  const result: Record<string, any> = {};
  args.forEach((obj) => {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        result[key] = obj[key];
      }
    }
  });
  return result;
}
