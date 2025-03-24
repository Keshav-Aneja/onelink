import Button from "@components/buttons/button";
import {
  getSelectedLink,
  setSelectedLink,
} from "@store/slices/application-slice";
import { useAppDispatch, useAppSelector } from "@store/store";
import { FaUser } from "react-icons/fa";
import { IoMdArrowForward } from "react-icons/io";
import { RiFileMarkedFill } from "react-icons/ri";

const LinkDetailCard = () => {
  const link = useAppSelector(getSelectedLink);
  const dispatch = useAppDispatch();
  if (!link) return null;
  const handleOutsideClick = () => {
    dispatch(setSelectedLink(null));
  };
  return (
    <>
      <div
        className="w-full min-h-screen fixed top-0 left-0"
        onClick={handleOutsideClick}
      ></div>
      <div className="fixed right-0 w-[95%] left-1/2 -translate-x-1/2 h-[35vh] bottom-0 bg-[rgba(0,0,0,0.2)] p-3 backdrop-blur-xl rounded-lg  border-1  border-theme_secondary_white/40 flex  gap-2">
        <section className="h-full aspect-[2.6]  rounded-md overflow-hidden bg-theme_secondary_black relative flex items-center justify-center select-none">
          {link.open_graph ? (
            <img
              src={link.open_graph}
              alt=""
              className="rounded-md h-full w-auto"
            />
          ) : (
            <RiFileMarkedFill className="text-4xl" />
          )}
        </section>
        <div className="w-full flex flex-col gap-2 overflow-y-auto">
          <h1 className="text-2xl font-medium text-white">{link.name}</h1>
          <Button
            className="text-base xxl:text-sm py-1 bg-primary  absolute top-2 right-2 gap-1"
            onClick={() => {
              window.open(link.link, "_blank");
            }}
          >
            <span>Visit Link</span>
            <IoMdArrowForward className="text-2xl -rotate-45" />
          </Button>
          {link.author && (
            <span className="flex items-center gap-2 text-sm text-theme_secondary_white ">
              <FaUser className="text-xs" /> {link.author}
            </span>
          )}
          <p className="text-theme_secondary_white text-sm">
            {link.description || link.site_description}
          </p>
        </div>
      </div>
    </>
  );
};

export default LinkDetailCard;
