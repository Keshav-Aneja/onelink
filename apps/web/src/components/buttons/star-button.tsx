import { useUpdateLink } from "@features/links/update-link";
import { cn } from "@lib/tailwind-utils";
import { useEffect, useState } from "react";
import { ImStarFull, ImStarEmpty } from "react-icons/im";
interface StarButtonProps {
  starred: boolean;
  id: string;
}

const StarButton = ({ starred, id }: StarButtonProps) => {
  const [isStarred, setIsStarred] = useState(starred);
  const handleChangeStarredState = () => {
    setIsStarred(!isStarred);
  };
  const updateLinkMutation = useUpdateLink({
    mutationConfig: {
      onSuccess: () => {
        console.log("Link added successfull");
      },
    },
  });
  useEffect(() => {
    const timeout = setTimeout(() => {
      updateLinkMutation.mutate({ id, data: { is_starred: isStarred } });
      //TODO: Add toaster notification here
    }, 1000);

    return () => {
      clearTimeout(timeout);
    };
  }, [isStarred]);
  return (
    <button
      className={cn(
        "bg-black text-white absolute top-2 right-2 rounded-full p-1 xxl:p-1.5 text-sm xxl:text-base cursor-pointer hover:bg-primary",
        isStarred && "bg-primary",
      )}
      onClick={handleChangeStarredState}
    >
      {isStarred ? <ImStarFull /> : <ImStarEmpty />}
    </button>
  );
};

export default StarButton;
