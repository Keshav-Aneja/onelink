import { useUpdateLink } from "@features/links/update-link";
import { cn } from "@lib/tailwind-utils";
import { useEffect, useState } from "react";
import { ImStarFull, ImStarEmpty } from "react-icons/im";
interface StarButtonProps {
  starred: boolean;
  id: string;
  subtle?: boolean;
}

const StarButton = ({ starred, id, subtle = false }: StarButtonProps) => {
  const [isStarred, setIsStarred] = useState(starred);
  const [update, setUpdate] = useState(false);
  const handleChangeStarredState = () => {
    setIsStarred(!isStarred);
    setUpdate(true);
  };
  const updateLinkMutation = useUpdateLink({
    mutationConfig: {
      onSuccess: () => {},
    },
  });

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (update) {
        updateLinkMutation.mutate({ id, data: { is_starred: isStarred } });
        setUpdate(false);
      }
      //TODO: Add toaster notification here
    }, 1000);

    return () => {
      clearTimeout(timeout);
    };
  }, [isStarred, update]);

  if (subtle) {
    return (
      <button
        className={cn(
          "text-sm cursor-pointer transition-colors",
          isStarred ? "text-primary" : "text-theme_secondary_white/40 hover:text-primary",
        )}
        onClick={handleChangeStarredState}
      >
        {isStarred ? <ImStarFull /> : <ImStarEmpty />}
      </button>
    );
  }

  return (
    <button
      className={cn(
        "bg-black text-white  rounded-full p-1 xxl:p-1.5 text-xs md:text-sm xxl:text-base cursor-pointer hover:bg-primary",
        isStarred && "bg-primary",
      )}
      onClick={handleChangeStarredState}
    >
      {isStarred ? <ImStarFull /> : <ImStarEmpty />}
    </button>
  );
};

export default StarButton;
