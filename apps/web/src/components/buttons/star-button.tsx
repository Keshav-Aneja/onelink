import { useUpdateLink } from "@features/links/update-link";
import { cn } from "@lib/tailwind-utils";
import { Link } from "@onelink/entities/models";
import {
  addFavLink,
  deleteFavLink,
  replaceFavLink,
} from "@store/slices/favourite-links-slice";
import { useAppDispatch } from "@store/store";
import { useEffect, useState } from "react";
import { ImStarFull, ImStarEmpty } from "react-icons/im";
interface StarButtonProps {
  starred: boolean;
  id: string;
  link: Link;
}

const StarButton = ({ starred, id, link }: StarButtonProps) => {
  const [isStarred, setIsStarred] = useState(starred);
  const [update, setUpdate] = useState(false);
  const dispatch = useAppDispatch();
  const handleChangeStarredState = () => {
    setIsStarred(!isStarred);
    setUpdate(true);
  };
  const updateLinkMutation = useUpdateLink({
    mutationConfig: {
      onSuccess: () => {
        if (isStarred) {
          const linkObj = link;
          linkObj["is_starred"] = isStarred;
          dispatch(addFavLink(linkObj));
        } else {
          dispatch(deleteFavLink(link.id));
        }
      },
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

  return (
    <button
      className={cn(
        "bg-black text-white  rounded-full p-1 xxl:p-1.5 text-sm xxl:text-base cursor-pointer hover:bg-primary",
        isStarred && "bg-primary",
      )}
      onClick={handleChangeStarredState}
    >
      {isStarred ? <ImStarFull /> : <ImStarEmpty />}
    </button>
  );
};

export default StarButton;
