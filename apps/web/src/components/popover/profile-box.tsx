import Button from "@components/buttons/button";
import CircularButton from "@components/buttons/circular-button";
import { IoLogOutSharp } from "react-icons/io5";
import { RiUserFill } from "react-icons/ri";
import Popover from "./popover";
interface ProfileBoxProps {
  profileImage?: string;
}
const ProfileBox = ({ profileImage }: ProfileBoxProps) => {
  return (
    <section>
      {/* Instead of doing conditional rendering, and again and again mounting and unmounting the container, this will cache the component once it's rendered. so better performance */}
      <Popover
        key={2}
        Trigger={() => <ProfileTrigger profileImage={profileImage} />}
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
  return (
    <div className={className}>
      <div className="bg-theme_secondary_black rounded-md p-2 text-sm xxl:text-lg text-center font-medium truncate">
        Keshav Aneja
      </div>
      <Button
        Icon={IoLogOutSharp}
        className="w-full text-sm xxl:text-base rounded-md"
      >
        Logout
      </Button>
    </div>
  );
}

type TriggerProps = {
  // ref: React.Ref<HTMLButtonElement> | undefined;
  // onClick: () => void;
  profileImage?: string;
};
export function ProfileTrigger({ profileImage }: TriggerProps) {
  return (
    <CircularButton key={2}>
      {profileImage && profileImage.length > 0 ? (
        <img
          src="/images/logo.webp"
          alt="{{profile_user}}"
          className="w-full h-full object-cover rounded-full"
        />
      ) : (
        <RiUserFill className="text-xl xxl:text-2xl" />
      )}
    </CircularButton>
  );
}
