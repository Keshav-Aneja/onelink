import { cn } from "@lib/tailwind-utils";
import { useEffect } from "react";
import { ReactElement, useRef, useState } from "react";
import { FaCross } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
interface PopoverProps {
  modal?: boolean;
  Trigger: ReactElement;
  Content: (props: { className?: string }) => ReactElement;
}
const Popover = ({ Trigger, Content, modal = false }: PopoverProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const triggerRef = useRef<HTMLDivElement | null>(null);
  const popoverRef = useRef<HTMLDivElement | null>(null);

  const toggleVisibility = () => {
    setIsVisible((visibility) => !visibility);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popoverRef.current &&
        triggerRef.current &&
        !popoverRef.current.contains(event.target as Node) &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        setIsVisible(false);
      }
    };
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsVisible(false);
      }
    };
    const closeBtn = document
      .getElementById("--ol-modal-close-btn")
      ?.addEventListener("click", () => {
        setIsVisible(false);
      });

    document.addEventListener("keydown", handleKeyPress);
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, []);

  return (
    <div className="relative">
      {modal && isVisible && (
        <div
          className={cn(
            "w-full h-full fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[90] bg-black/20 backdrop-blur-md",
          )}
        ></div>
      )}
      <div className="" ref={triggerRef} onClick={toggleVisibility}>
        {Trigger}
      </div>
      <div
        style={{ contentVisibility: isVisible ? "visible" : "hidden" }}
        ref={popoverRef}
      >
        {Content({
          className:
            "w-60 absolute top-16 right-0 p-2 bg-black border-1 border-white/40 rounded-lg flex flex-col gap-2",
        })}
      </div>
    </div>
  );
};

export default Popover;
