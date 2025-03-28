import Button from "@components/buttons/button";
import CircularButton from "@components/buttons/circular-button";
import { IoLogOutSharp } from "react-icons/io5";
import { RiUserFill } from "react-icons/ri";
import Popover from "./popover";
import { useSelector } from "react-redux";
import { selectUser } from "@store/slices/user-slice";
import { useLogoutUserMutation } from "@features/users/logout-user";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { cn } from "@lib/tailwind-utils";

const ProfileBox = () => {
  return (
    <section>
      {/* Instead of doing conditional rendering, and again and again mounting and unmounting the container, this will cache the component once it's rendered. so better performance */}
      <Popover
        key={2}
        Trigger={<ProfileTrigger />}
        Content={({ className }) => <ProfileContent className={className} />}
      />
    </section>
  );
};

export default ProfileBox;

type ContentProps = {
  className?: string;
};
export function ProfileContent({ className }: ContentProps) {
  const location = useLocation();
  const user = useSelector(selectUser);
  const [mutex, setMutex] = useState(false);
  const { mutateAsync } = useLogoutUserMutation();
  const navigate = useNavigate();
  const handleLogout = async () => {
    setMutex(true);
    const response = await mutateAsync();
    setMutex(false);
    if (response && response.success) {
      localStorage.removeItem("persist:onelink");
      navigate(`/auth?redirectTo=${encodeURIComponent(location.pathname)}`);
    }
  };
  return (
    <div className={cn(className, "z-[100]")}>
      <div className="bg-theme_secondary_black rounded-md p-2 text-sm xxl:text-lg text-center font-medium truncate">
        {user.name}
      </div>
      <Button
        Icon={IoLogOutSharp}
        className="w-full text-sm xxl:text-base rounded-md"
        onClick={handleLogout}
        disabled={mutex}
        aria-disabled={mutex}
        loading={mutex}
      >
        Logout
      </Button>
    </div>
  );
}

export function ProfileTrigger() {
  const user = useSelector(selectUser);
  const { profile_url: profileImage } = user;
  return (
    <CircularButton key={2}>
      {profileImage && profileImage.length > 0 ? (
        <img
          src={profileImage}
          alt="{{profile_user}}"
          className="w-full h-full object-cover rounded-full"
        />
      ) : (
        <RiUserFill className="text-xl xxl:text-2xl" />
      )}
    </CircularButton>
  );
}
