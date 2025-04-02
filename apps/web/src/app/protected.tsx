import { paths } from "@config/paths";
import { useUser } from "@features/users/get-user";
import { useCheckSession, useStoredUser } from "@hooks/user";
import { Fragment, ReactNode, useEffect, useState } from "react";
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
  const sessionExists = useCheckSession();
  const user = useStoredUser();

  // Use a state to control whether to fetch user
  const [shouldFetchUser, setShouldFetchUser] = useState<boolean>(
    !user && sessionExists,
  );

  // Only fetch when needed
  const userQuery = useUser(shouldFetchUser);
  useEffect(() => {
    console.log(user);
    console.log(sessionExists);
    if (shouldFetchUser && userQuery.data && userQuery.data.success) {
      dispatch(addUser(userQuery.data.data));
      setShouldFetchUser(false);
    }
  }, [userQuery.data, shouldFetchUser, dispatch]);

  // Handle session check
  if (!sessionExists) {
    return <Navigate to={paths.auth.getHref(location.pathname)} replace />;
  }

  // If user exists, render children
  if (user) {
    return <Fragment>{children}</Fragment>;
  }

  // Handle user fetching states
  if (shouldFetchUser) {
    if (userQuery.isLoading) {
      return <Loader />;
    }

    if (!userQuery.data || !userQuery.data?.success) {
      Cookies.remove("connect.sid");
      return <Navigate to={paths.auth.getHref(location.pathname)} replace />;
    }

    if (userQuery.data) {
      return <Fragment>{children}</Fragment>;
    }
  }

  return null;
};

export default ProtectedRoute;
