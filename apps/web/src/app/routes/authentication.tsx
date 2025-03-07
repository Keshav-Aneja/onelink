import Button from "@components/buttons/button";
import BaseWrapper from "@wrappers/base-wrapper";
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { Provider } from "@onelink/entities";
import { BACKEND_URL } from "@config/constants";
const AuthenticationPage = () => {
  function handleAuthentication(provider: Provider) {
    if (
      !provider ||
      !(provider === Provider.Github || provider === Provider.Google)
    ) {
      //Notification Message
      //Please provide a valid provider
      return;
    }
    window.location.href = `${BACKEND_URL}/api/auth/${provider}`;
  }
  return (
    <BaseWrapper className="--auth-background">
      <div className="w-full h-full flex justify-center items-center font-kustom">
        <section className="h-full w-1/3 flex flex-col justify-center gap-6">
          <span>
            <h1 className="text-3xl xxl:text-4xl font-semibold">
              Welcome back
            </h1>
            <p className="text-sm xxl:text-lg text-theme_secondary_white">
              Access your account now to effortlessly save pages you want to
              revisit.
            </p>
          </span>
          <div className="flex flex-col gap-3 w-full">
            <Button
              Icon={FcGoogle}
              className="w-full"
              onClick={() => {
                handleAuthentication(Provider.Google);
              }}
            >
              Continue with Google
            </Button>
            <Button
              Icon={FaGithub}
              className="w-full"
              onClick={() => {
                handleAuthentication(Provider.Github);
              }}
            >
              Continue with GitHub
            </Button>
          </div>
        </section>
        <div className="text-7xl xxl:text-8xl font-semibold fixed bottom-12 left-12 text-theme_secondary_white">
          OneLink.
        </div>
      </div>
    </BaseWrapper>
  );
};

export default AuthenticationPage;
