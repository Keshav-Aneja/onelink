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

export interface IActionResponse {
  success: boolean;
  status: number;
  data: any;
  message: string;
  error?: string;
  cause?: string;
  stackTrace?: string;
  timestamp: string;
}
