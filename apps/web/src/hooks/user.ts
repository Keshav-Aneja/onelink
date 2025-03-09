import { selectUser } from "@store/slices/user-slice";
import { useAppSelector } from "@store/store";
import Cookies from "js-cookie";
export function useStoredUser() {
  const user = useAppSelector(selectUser);
  if (!user || !user.id) {
    return undefined;
  }
  return user;
}
export function useCheckSession(): boolean {
  const cookie = Cookies.get("connect.sid");
  if (!cookie) {
    return false;
  }
  return true;
}
