export interface OptionsInit {
  credentials?: RequestCredentials;
  cache?: RequestCache;
  mode?: RequestMode;
  priority?: RequestPriority;
  signal?: AbortSignal;
}

export interface IActionConfig {
  baseURL: string;
  prefix?: string;
  options?: OptionsInit;
  headers?: HeadersInit;
}

export interface IActionResponse<T = any> {
  success: boolean;
  status: number;
  data: T;
  message: string;
  error?: string;
  cause?: string;
  stackTrace?: string;
  timestamp: string;
}
