import { useCheckSession } from "@hooks/user";
import { cn } from "@lib/tailwind-utils";
import { ReactNode } from "react";
import { useNavigate, useSearchParams } from "react-router";
type WrapperProps = {
  children: ReactNode;
  className?: string;
};
const BaseWrapper = ({ children, className }: WrapperProps) => {
  const [params] = useSearchParams();
  const redirectPath = decodeURIComponent(params.get("redirectTo") ?? "");
  const session = useCheckSession();
  const navigate = useNavigate();
  if (redirectPath && session) {
    navigate(redirectPath);
    return;
  }

  return (
    <main className={cn("w-full h-svh min-h-fit", className)}>
      <div className="w-wrapper h-full mx-auto flex flex-col items-center justify-center gap-4 font-kustom">
        {children}
      </div>
    </main>
  );
};

export default BaseWrapper;
