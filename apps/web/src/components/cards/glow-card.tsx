import { ReactNode } from "react";
import { cn } from "@lib/tailwind-utils";
import { useMouseMovement } from "@components/use-movement";
interface GlowCardProps {
  children: ReactNode;
  className?: string;
  style?: Record<string, any>;
}
export default function GlowCard({
  children,
  className,
  style,
}: GlowCardProps) {
  const cardRef = useMouseMovement();
  return (
    <div
      className={cn(
        "--glow-card min-h-12 w-full rounded-full shadow-sm  relative overflow-hidden",
        className,
      )}
      ref={cardRef}
      style={style}
    >
      <div className="w-full h-full absolute rounded-full top-0 left-0 z-[50] flex items-center justify-center">
        {children}
      </div>
    </div>
  );
}
