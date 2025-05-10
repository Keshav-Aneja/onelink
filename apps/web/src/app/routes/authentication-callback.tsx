import { paths } from "@config/paths";
import { useEffect } from "react";
import Cookies from "js-cookie";
import { useLocation, useNavigate } from "react-router";

const AuthenticationCallback = () => {
  const locationURL = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(locationURL.search);

  const handleCookie = () => {
    const token = queryParams.get("token");
    if (!token || token.length == 0) {
      navigate(paths.landing.path);
      return;
    }
    const existingToken = Cookies.get("connect.sid");
    if (existingToken) return;

    Cookies.set("connect.sid", token, {
      expires: 1, // days
      secure: true,
      httpOnly: true,
      sameSite: "None",
      path: "/",
    });
  };

  const handleRedirect = () => {
    const redirectPath = queryParams.get("redirectTo");
    if (redirectPath && redirectPath.length > 0) {
      navigate(decodeURIComponent(redirectPath));
      return;
    }
    navigate(paths.landing.path);
  };

  useEffect(() => {
    handleCookie();
    handleRedirect();
  }, []);
  return <div>AuthenticationCallback</div>;
};

export default AuthenticationCallback;
