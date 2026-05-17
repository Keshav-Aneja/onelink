import Button from "@components/buttons/button";
import BaseWrapper from "@wrappers/base-wrapper";
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { Provider } from "@onelink/entities";
import { BACKEND_URL } from "@config/constants";
import { useSearchParams, useNavigate } from "react-router";
import { useCheckSession } from "@hooks/user";
import { useEffect, useState } from "react";
import { paths } from "@config/paths";
import Cookies from "js-cookie";

const LOCAL_MODE = import.meta.env.VITE_LOCAL_MODE === "true";

const LocalAuthForm = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const endpoint =
        mode === "login"
          ? `${BACKEND_URL}/api/auth/local/login`
          : `${BACKEND_URL}/api/auth/local/register`;
      const body: Record<string, string> =
        mode === "login"
          ? { email, password }
          : { email, password, name };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data?.message || data?.error || "Something went wrong");
        return;
      }

      const data = await res.json().catch(() => ({}));
      const sessionID = data?.data?.sessionID;
      if (sessionID) {
        Cookies.set("connect.sid", sessionID, {
          expires: 3,
          sameSite: "Lax",
          path: "/",
        });
      }

      navigate(paths.collections.root.path);
    } catch {
      setError("Network error — is the backend running?");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 w-full"
    >
      {mode === "register" && (
        <div className="flex flex-col gap-1">
          <label className="text-xs text-theme_secondary_white">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="Your name"
            className="bg-transparent border border-white/20 rounded-md px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-white/50"
          />
        </div>
      )}
      <div className="flex flex-col gap-1">
        <label className="text-xs text-theme_secondary_white">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="you@example.com"
          className="bg-transparent border border-white/20 rounded-md px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-white/50"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-xs text-theme_secondary_white">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          placeholder="••••••••"
          className="bg-transparent border border-white/20 rounded-md px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-white/50"
        />
      </div>
      {error && (
        <p className="text-xs text-red-400">{error}</p>
      )}
      <Button type="submit" className="w-full" disabled={loading}>
        {loading
          ? "Please wait..."
          : mode === "login"
          ? "Sign in"
          : "Create account"}
      </Button>
      <p className="text-xs text-center text-theme_secondary_white">
        {mode === "login" ? "No account yet?" : "Already have an account?"}{" "}
        <button
          type="button"
          onClick={() => { setMode(mode === "login" ? "register" : "login"); setError(""); }}
          className="underline text-white"
        >
          {mode === "login" ? "Register" : "Sign in"}
        </button>
      </p>
    </form>
  );
};

const AuthenticationPage = () => {
  const [params] = useSearchParams();
  const redirectTo = params.get("redirectTo");
  const session = useCheckSession();
  const navigate = useNavigate();

  useEffect(() => {
    if (redirectTo && session) {
      navigate(decodeURIComponent(redirectTo));
    }
  }, [redirectTo, session, navigate]);

  function handleAuthentication(provider: Provider) {
    if (
      !provider ||
      !(provider === Provider.Github || provider === Provider.Google)
    ) {
      return;
    }
    window.location.href = `${BACKEND_URL}/api/auth/${provider}${redirectTo ? `?redirectTo=${redirectTo}` : ""}`;
  }

  return (
    <BaseWrapper className="--auth-background">
      <div className="w-full h-full flex justify-center items-center font-kustom">
        <section className="h-full w-4/5 md:w-1/3 flex flex-col justify-center gap-6">
          <span>
            <h1 className="text-2xl md:text-3xl xxl:text-4xl font-semibold">
              Welcome back
            </h1>
            <p className="text-xs md:text-sm xxl:text-lg text-theme_secondary_white">
              Access your account now to effortlessly save pages you want to
              revisit.
            </p>
          </span>
          <div className="flex flex-col gap-3 w-full">
            {LOCAL_MODE ? (
              <LocalAuthForm />
            ) : (
              <>
                <Button
                  Icon={FcGoogle}
                  className="w-full"
                  onClick={() => handleAuthentication(Provider.Google)}
                >
                  Continue with Google
                </Button>
                <Button
                  Icon={FaGithub}
                  className="w-full"
                  onClick={() => handleAuthentication(Provider.Github)}
                >
                  Continue with GitHub
                </Button>
              </>
            )}
          </div>
        </section>
        <div className="text-3xl md:text-7xl xxl:text-8xl font-semibold fixed bottom-12 left-12 text-theme_secondary_white">
          OneLink.
        </div>
      </div>
    </BaseWrapper>
  );
};

export default AuthenticationPage;
