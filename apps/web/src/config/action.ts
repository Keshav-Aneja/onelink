import { Action } from "@onelink/action";
import { BACKEND_URL } from "./constants";
/**
 * Here I'm using my own package for handling API calls, this is just a wrapper for fetch API
 * Checkout /packages/action
 */
const action = new Action(BACKEND_URL, "api", {
  credentials: "include",
});

export default action;
