import Button from "@components/buttons/button";
import { cn } from "@lib/tailwind-utils";
import {
  getSelectedLink,
  setSelectedLink,
} from "@store/slices/application-slice";
import { useAppDispatch, useAppSelector } from "@store/store";
import { useState } from "react";
import { IoMdArrowForward } from "react-icons/io";
import { RiFileMarkedFill } from "react-icons/ri";
import { FiChevronDown, FiChevronUp, FiUser } from "react-icons/fi";
import { useUpdateLink } from "@features/links/update-link";
import SubscribeButton from "@components/buttons/subscribe-button";

const LinkDetailCard = () => {
  const link = useAppSelector(getSelectedLink);
  const dispatch = useAppDispatch();

  const handleOutsideClick = () => {
    dispatch(setSelectedLink(null));
  };
  const [showFullText, setShowFullText] = useState(false);
  if (!link) return null;
  const linkDescription = link.description || link.site_description || "";

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    const truncated = text.slice(0, maxLength);
    const lastSpace = truncated.lastIndexOf(" ");
    return truncated.slice(0, lastSpace) + "...";
  };

  return (
    <>
      <div
        className="w-full min-h-screen fixed top-0 left-0"
        onClick={handleOutsideClick}
      ></div>
      <div className="fixed w-1/4 top-1/2 -translate-y-1/2 right-0 h-full bottom-0 bg-[rgba(0,0,0,0.2)] p-3 backdrop-blur-2xl rounded-lg border-1 border-theme_secondary_white/40 flex flex-col gap-2">
        <section className="w-full aspect-[1.91] rounded-md overflow-hidden bg-theme_secondary_black relative flex items-center justify-center select-none">
          {link.open_graph ? (
            <img
              src={link.open_graph}
              alt=""
              className="rounded-md w-full h-auto object-cover"
            />
          ) : (
            <RiFileMarkedFill className="text-4xl" />
          )}
          <Button
            className="text-sm xxl:text-sm py-1 hover:bg-theme_secondary_black absolute bottom-2 right-2 gap-1 px-4"
            onClick={() => {
              window.open(link.link, "_blank");
            }}
          >
            <span>Visit Link</span>
            <IoMdArrowForward className="text-xl -rotate-45" />
          </Button>
        </section>
        <div className="w-full flex flex-col gap-2">
          <h1 className="text-2xl font-medium text-white">{link.name}</h1>
          <section className="flex items-center w-full justify-between">
            {link.author && (
              <span className="flex items-center gap-2 text-sm text-theme_secondary_white">
                <FiUser className="text-xs" /> {link.author}
              </span>
            )}
            <SubscribeButton
              subscribed={link.subscribed ?? false}
              id={link.id}
            />
          </section>
          <div className="relative">
            <p
              id="description-text"
              className={cn(
                "text-theme_secondary_white text-sm transition-all duration-300 ease-in-out",
              )}
            >
              {showFullText
                ? linkDescription
                : truncateText(linkDescription, 300)}
            </p>

            {!showFullText && linkDescription.length > 300 && (
              <>
                <div className="absolute -bottom-2 left-0 w-full h-10 "></div>
                <button
                  onClick={() => setShowFullText(true)}
                  className="absolute bottom-0 left-1/2 transform -translate-x-1/2 bg-black px-3 py-1 rounded-full text-xs text-primary font-semibold   hover:text-primary/80 flex items-center gap-1 cursor-pointer"
                  aria-expanded={showFullText}
                  aria-controls="description-text"
                >
                  Read More <FiChevronDown />
                </button>
              </>
            )}

            {showFullText && linkDescription.length > 300 && (
              <button
                onClick={() => setShowFullText(false)}
                className="text-primary hover:text-primary/80 cursor-pointer mt-2 text-xs font-medium flex items-center gap-1"
                aria-expanded={showFullText}
                aria-controls="description-text"
              >
                Show Less <FiChevronUp />
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default LinkDetailCard;
