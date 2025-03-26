import { cn } from "@lib/tailwind-utils";
import getPaths, { getParentIdFromPath, getPath } from "@lib/utils/get-paths";
import { IoFolderOpen } from "react-icons/io5";
import { Link } from "react-router";

const Breadcrumbs = () => {
  const paths = getPaths();
  const pathId = getParentIdFromPath();
  return (
    <div
      className={cn(
        "w-full px-3 flex items-center gap-2",
        pathId === undefined && "pointer-events-none opacity-50",
      )}
    >
      {paths.length > 6
        ? paths.slice(-6).map((path, _i) => <Crumb label={path} key={_i} />)
        : paths.map((path, _i) => <Crumb label={path} key={_i} />)}
    </div>
  );
};

export default Breadcrumbs;

interface CrumbProps {
  label: string;
}
export const Crumb = ({ label }: CrumbProps) => {
  return (
    <Link to={getPath(label)} className="flex items-center gap-1 text-lg group">
      <IoFolderOpen className=" group-first:block hidden group-hover:text-primary group-last:text-primary" />
      <span className="group-last:underline group-last:text-primary group-last:font-medium px-2  group-hover:text-primary group-hover:underline underline-offset-4 cursor-pointer text-sm">
        {label}
      </span>
      <span className="group-last:hidden">/</span>
    </Link>
  );
};
