import { BACKEND_URL } from "@config/constants";
import { cn } from "@lib/tailwind-utils";
import { ReactNode, useEffect } from "react";
import { User } from "@onelink/entities/models";
import { useAppDispatch, useAppSelector } from "@store/store";
import { addUser, selectUser } from "@store/slices/user-slice";
type WrapperProps = {
  children: ReactNode;
  className?: string;
};
const BaseWrapper = ({ children, className }: WrapperProps) => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const fetchUser = async () => {
    const response = await fetch(`${BACKEND_URL}/auth/me`, {
      method: "GET",
      credentials: "include",
    });
    const user: User = (await response.json())?.data;
    if (!user) {
      console.error("USER NOT FOUND");
    }
    dispatch(addUser({ id: user.id, name: user.name }));
  };
  useEffect(() => {
    if (user && user.id) {
      return;
    }
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
