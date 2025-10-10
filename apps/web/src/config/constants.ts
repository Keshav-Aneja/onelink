export const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
export const ROOT_PATH = "Home";

export enum Pages {
  COLLECTIONS = "/collections",
  AUTHENTICATION = "/auth",
}

export const Intervals = {
  DATA_SYNC: 60 * 1000,
};
