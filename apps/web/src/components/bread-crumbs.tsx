import { cn } from "@lib/tailwind-utils";
import getPaths, { useParentIdFromPath, usePath } from "@lib/utils/get-paths";
import { IoFolderOpen } from "react-icons/io5";
import { Link } from "react-router";
import { useMemo } from "react";

const Breadcrumbs = () => {
  const paths = getPaths();
  const pathId = useParentIdFromPath();

  const displayPaths = useMemo(
    () => (paths.length > 6 ? paths.slice(-6) : paths),
    [paths]
  );

  return (
    <div
      className={cn(
        "w-full px-3 flex items-center gap-2",
        pathId === undefined && "pointer-events-none opacity-50",
      )}
    >
      {displayPaths.map((path) => (
        <Crumb label={path} key={path} />
      ))}
    </div>
  );
};

export default Breadcrumbs;

interface CrumbProps {
  label: string;
}
export const Crumb = ({ label }: CrumbProps) => {
  const linkPath = usePath(label);

  return (
    <Link to={linkPath} className="flex items-center gap-1 text-lg group">
      <IoFolderOpen className=" group-first:block hidden group-hover:text-primary group-last:text-primary" />
      <span className="group-last:underline group-last:text-primary group-last:font-medium px-2  group-hover:text-primary group-hover:underline underline-offset-4 cursor-pointer text-sm">
        {label}
      </span>
      <span className="group-last:hidden">/</span>
    </Link>
  );
};
