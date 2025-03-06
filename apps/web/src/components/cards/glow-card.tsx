import { ReactNode } from "react";
import { cn } from "@lib/tailwind-utils";
import { useMouseMovement } from "@components/use-movement";
interface GlowCardProps {
  children: ReactNode;
  className?: string;
  style?: Record<string, any>;
  containerClassName?: string;
  props?: any;
}
export default function GlowCard({
  children,
  className,
  containerClassName,
  style,
  props,
}: GlowCardProps) {
  const cardRef = useMouseMovement();
  return (
    <div
      className={cn(
        "--glow-card min-h-12 w-full rounded-full shadow-sm  relative after:rounded-[50px] overflow-hidden",
        className,
      )}
      tabIndex={0}
      ref={cardRef}
      style={style}
      {...props}
    >
      <div
        className={cn(
          "w-full h-full absolute rounded-full top-0 left-0 z-[10] flex items-center justify-center",
          containerClassName,
        )}
      >
        {children}
      </div>
    </div>
  );
}
