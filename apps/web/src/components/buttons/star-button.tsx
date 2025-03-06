import { cn } from "@lib/tailwind-utils";
import { ImStarFull, ImStarEmpty } from "react-icons/im";
interface StarButtonProps {
  starred: boolean;
}

const StarButton = ({ starred }: StarButtonProps) => (
  <button
    className={cn(
      "bg-black text-white absolute top-2 right-2 rounded-full p-1 xxl:p-1.5 text-sm xxl:text-base cursor-pointer hover:bg-primary",
      starred && "bg-primary",
    )}
  >
    {starred ? <ImStarFull /> : <ImStarEmpty />}
  </button>
);

export default StarButton;
