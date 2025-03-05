import React, { useEffect } from "react";
import { ReactElement, useCallback, useRef, useState } from "react";
interface PopoverProps {
  Trigger: () => ReactElement;
  Content: (props: { className?: string }) => ReactElement;
}
const Popover = ({ Trigger, Content }: PopoverProps) => {
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

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative">
      <div className="" ref={triggerRef} onClick={toggleVisibility}>
        {Trigger()}
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
