import { cn } from "@lib/tailwind-utils";
import { ReactNode, useEffect } from "react";
// import { useAppDispatch, useAppSelector } from "@store/store";
import action from "@config/action";
type WrapperProps = {
  children: ReactNode;
  className?: string;
};
const BaseWrapper = ({ children, className }: WrapperProps) => {
  // const dispatch = useAppDispatch();

  // const user = useAppSelector(selectUser);
  const fetchUser = async () => {
    try {
      const response = await action.get("auth/me");
      console.log("USER", response);
    } catch (error: any) {
      console.log("ERROR", error.message);
    }
    // const response = await fetch(`${BACKEND_URL}/auth/me`, {
    //   method: "GET",
    //   credentials: "include",
    // });
    // const user: User = (await response.json())?.data;
    // if (!user) {
    //   console.error("USER NOT FOUND");
    //   return;
    // }
    // dispatch(addUser({ id: user.id, name: user.name }));
  };
  useEffect(() => {
    // if (user && user.id) {
    //   return;
    // }
    fetchUser();
  }, []);
  return (
    <main className={cn("w-full h-svh min-h-fit", className)}>
      <div className="w-wrapper h-full mx-auto flex flex-col items-center justify-center gap-4 font-kustom">
        {children}
      </div>
    </main>
  );
};

export default BaseWrapper;
