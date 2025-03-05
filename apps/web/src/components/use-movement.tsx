import { useEffect, useRef } from "react";

export const useMouseMovement = () => {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const card = cardRef.current;
    if (card) {
      const handleMouseMove = (e: MouseEvent) => {
        const { offsetLeft, offsetTop } = card;
        const x = e.pageX - offsetLeft;
        const y = e.pageY - offsetTop;
        card.style.setProperty("--x", `${x}px`);
        card.style.setProperty("--y", `${y}px`);
      };

      card.addEventListener("mousemove", handleMouseMove);
      return () => card.removeEventListener("mousemove", handleMouseMove);
    }
  }, []);

  return cardRef;
};
