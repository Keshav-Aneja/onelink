import CircularButton from "@components/buttons/circular-button";
import { IoLogOutSharp } from "react-icons/io5";
import { RiUserFill } from "react-icons/ri";
import { IoSettingsOutline } from "react-icons/io5";
import Popover from "./popover";
import { useSelector } from "react-redux";
import { selectUser } from "@store/slices/user-slice";
import { useLogoutUserMutation } from "@features/users/logout-user";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { cn } from "@lib/tailwind-utils";
import { paths } from "@config/paths";

const ProfileBox = () => {
  return (
    <section>
      <Popover
        key={2}
        Trigger={<ProfileTrigger />}
        Content={({ className, closeModal }) => (
          <ProfileContent className={className} closeModal={closeModal} />
        )}
      />
    </section>
  );
};

export default ProfileBox;

type ContentProps = {
  className?: string;
  closeModal?: () => void;
};

export function ProfileContent({ className, closeModal }: ContentProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const user = useSelector(selectUser);
  const [mutex, setMutex] = useState(false);
  const { mutateAsync } = useLogoutUserMutation();

  const initials = user.name
    ? user.name
        .split(" ")
        .slice(0, 2)
        .map((w: string) => w[0])
        .join("")
        .toUpperCase()
    : "?";

  const handleLogout = async () => {
    setMutex(true);
    const response = await mutateAsync();
    setMutex(false);
    if (response && response.success) {
      localStorage.removeItem("persist:onelink");
      window.location.href = `/auth?redirectTo=${encodeURIComponent(location.pathname)}`;
    }
  };

  const handleSettings = () => {
    navigate(paths.settings.getHref());
    closeModal?.();
  };

  return (
    <div className={cn(className, "z-100")}>
      {/* User identity header */}
      <div className="flex items-center gap-3 px-1 py-2">
        <div className="shrink-0 w-10 h-10 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center overflow-hidden">
          {user.profile_url && user.profile_url.length > 0 ? (
            <img
              src={user.profile_url}
              alt={user.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-sm font-semibold text-primary">{initials}</span>
          )}
        </div>
        <div className="flex flex-col min-w-0">
          <span className="text-sm font-semibold text-theme_primary_white truncate leading-tight">
            {user.name}
          </span>
          <span className="text-xs text-secondary_text truncate leading-tight mt-0.5">
            {user.email}
          </span>
        </div>
      </div>

      <div className="h-px bg-white/10 my-1" />

      {/* Settings */}
      <button
        onClick={handleSettings}
        className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm text-theme_secondary_white hover:bg-white/5 hover:text-theme_primary_white transition-colors cursor-pointer"
      >
        <IoSettingsOutline className="text-base shrink-0" />
        <span>Settings</span>
      </button>

      {/* Logout */}
      <button
        onClick={handleLogout}
        disabled={mutex}
        className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm text-secondary_text hover:bg-red-500/10 hover:text-red-400 transition-colors disabled:opacity-50 cursor-pointer"
      >
        {mutex ? (
          <span className="text-base shrink-0 animate-spin inline-block">⟳</span>
        ) : (
          <IoLogOutSharp className="text-base shrink-0" />
        )}
        <span>{mutex ? "Logging out…" : "Log out"}</span>
      </button>
    </div>
  );
}

export function ProfileTrigger() {
  const user = useSelector(selectUser);
  const { profile_url: profileImage, name: username } = user;
  return (
    <CircularButton key={2}>
      {profileImage && profileImage.length > 0 ? (
        <img
          src={profileImage}
          alt={username}
          className="w-full h-full object-cover rounded-full"
        />
      ) : (
        <RiUserFill className="text-xl xxl:text-2xl" />
      )}
    </CircularButton>
  );
}
