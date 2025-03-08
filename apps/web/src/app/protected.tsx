import { paths } from "@config/paths";
import { useUser } from "@features/users/get-user";
import { useCheckSession, useStoredUser } from "@hooks/user";
import { Fragment, ReactNode } from "react";
import { Navigate, useLocation } from "react-router";
import Loader from "./loader";
import Cookies from "js-cookie";
import { useAppDispatch } from "@store/store";
import { addUser } from "@store/slices/user-slice";
interface AuthProps {
  children: ReactNode;
}
const ProtectedRoute = ({ children }: AuthProps) => {
  const location = useLocation();
  const dispatch = useAppDispatch();
  /**
   * Check if the session exists or not. If not redirect the user
   */
  const sessionExists = useCheckSession();
  if (!sessionExists) {
    return <Navigate to={paths.auth.getHref(location.pathname)} replace />;
  }
  const user = useStoredUser();
  /**
   * If session exists, but the user details are stored already then continue with the rest of the application
   */
  if (user) {
    return <Fragment>{children}</Fragment>;
  }
  /**
   * If the stored user does not exists, then fetch the user again
   */
  const userQuery = useUser();
  if (userQuery.isLoading) {
    return <Loader />;
  }
  if (!userQuery.data || !userQuery.data?.success) {
    Cookies.remove("connect.sid");
    return;
  }
  if (userQuery.data) {
    console.log("ADDING USER");
    dispatch(addUser(userQuery.data.data));
  }

  return <Fragment>{children}</Fragment>;
};

export default ProtectedRoute;
